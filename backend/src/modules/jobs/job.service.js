// backend/src/modules/jobs/job.service.js

const Job = require("./job.model");
const ApiError = require("../../utils/ApiError");
const {
  calculateJobMatch,
  rankJobsForUser,
} = require("./job.recommendation");

/* ──────────────────────────────────────────────
   CREATE / POST JOB
   (Alumni / Faculty / Admin)
─────────────────────────────────────────────── */
exports.postJob = async (data, user) => {
  if (!user?.id || !user?.role) {
    throw new ApiError(401, "Invalid user context");
  }

  if (!["alumni", "faculty", "admin"].includes(user.role)) {
    throw new ApiError(403, "You are not allowed to post jobs");
  }

  const job = await Job.create({
    title: data.title,
    company: data.company,
    companyLogo: data.companyLogo,
    location: data.location,
    employmentType: data.employmentType,
    mode: data.mode,
    experienceLevel: data.experienceLevel,
    category: data.category,
    description: data.description,

    requiredSkills: Array.isArray(data.requiredSkills)
      ? data.requiredSkills.map((s) => s.trim())
      : [],

    optionalSkills: Array.isArray(data.optionalSkills)
      ? data.optionalSkills.map((s) => s.trim())
      : [],

    salaryRange: data.salaryRange,
    applyLink: data.applyLink,
    deadline: data.deadline,

    postedBy: user.id,
    postedByRole: user.role,

    viewsCount: 0,
    applicantsCount: 0,
    status: user.role === "admin" ? "open" : "pending",
  });

  return job;
};

/* ──────────────────────────────────────────────
   GET JOBS (LIST + SEARCH + FILTER + AI)
─────────────────────────────────────────────── */
exports.getJobs = async ({
  search,
  employmentType,
  mode,
  location,
  requiredSkills,
  page = 1,
  limit = 20,
  role,
  userId,
  userSkills = [],
}) => {
  const andFilters = [];

  /* ───── Role-based visibility ───── */
  if (role === "student") {
    andFilters.push({ status: "open" });
  }

  if (["alumni", "faculty"].includes(role)) {
    andFilters.push({
      $or: [{ status: "open" }, { postedBy: userId }],
    });
  }

  /* Admin sees everything (no filter) */

  /* ───── Search ───── */
  if (search) {
    andFilters.push({
      $or: [
        { title: new RegExp(search, "i") },
        { company: new RegExp(search, "i") },
      ],
    });
  }

  /* ───── Filters ───── */
  if (employmentType) {
    andFilters.push({ employmentType });
  }

  if (mode) {
    andFilters.push({ mode });
  }

  if (location) {
    andFilters.push({ location: new RegExp(location, "i") });
  }

  if (Array.isArray(requiredSkills) && requiredSkills.length > 0) {
    andFilters.push({
      requiredSkills: {
        $in: requiredSkills.map((s) =>
          s.toString().trim().toLowerCase()
        ),
      },
    });
  }

  const finalQuery =
    andFilters.length > 0 ? { $and: andFilters } : {};

  const skip = (page - 1) * limit;

  const jobs = await Job.find(finalQuery)
    .populate("postedBy", "name avatar role")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  /* ───── AI Ranking (students only) ───── */
  if (role === "student" && Array.isArray(userSkills)) {
    return rankJobsForUser(
      jobs.map((j) => j.toObject()),
      userSkills
    );
  }

  return jobs;
};

/* ──────────────────────────────────────────────
   GET JOB DETAILS
─────────────────────────────────────────────── */
exports.getJobDetails = async (jobId, user) => {
  const job = await Job.findById(jobId).populate(
    "postedBy",
    "name avatar role"
  );

  if (!job) throw new ApiError(404, "Job not found");

  job.viewsCount += 1;
  await job.save();

  let recommendation = null;

  if (user?.role === "student" && Array.isArray(user.skills)) {
    recommendation = calculateJobMatch({
      userSkills: user.skills,
      requiredSkills: job.requiredSkills,
      optionalSkills: job.optionalSkills,
    });
  }

  return {
    ...job.toObject(),
    recommendation,
  };
};

/* ──────────────────────────────────────────────
   APPLY JOB (Student only)
─────────────────────────────────────────────── */
exports.applyJob = async (jobId, user, resumeUrl) => {
  if (user?.role !== "student") {
    throw new ApiError(403, "Only students can apply for jobs");
  }

  const job = await Job.findById(jobId);
  if (!job) throw new ApiError(404, "Job not found");

  if (job.status !== "open") {
    throw new ApiError(400, "Job is not open for applications");
  }

  const alreadyApplied = job.applicants.some(
    (a) => a.user.toString() === user.id
  );

  if (alreadyApplied) {
    throw new ApiError(400, "You have already applied for this job");
  }

  /* 🔥 AI SCORE (optional, future-safe) */
  let aiScore = null;

  if (Array.isArray(user.skills)) {
    const result = calculateJobMatch({
      userSkills: user.skills,
      requiredSkills: job.requiredSkills,
      optionalSkills: job.optionalSkills,
    });

    aiScore = result.matchScore;
  }

  job.applicants.push({
    user: user.id,
    resume: resumeUrl || null,
    aiScore,
  });

  job.applicantsCount += 1;
  await job.save();

  return job;
};

/* ──────────────────────────────────────────────
   GET APPLICANTS (OWNER / ADMIN)
─────────────────────────────────────────────── */
exports.getApplicants = async (jobId, user) => {
  if (!user) throw new ApiError(401, "Unauthorized");

  const job = await Job.findById(jobId)
    .populate("applicants.user", "name avatar batch department")
    .select("title company applicants postedBy");

  if (!job) throw new ApiError(404, "Job not found");

  /* ✅ SAFE OWNERSHIP CHECK */
  const postedById =
    typeof job.postedBy === "object" && job.postedBy._id
      ? job.postedBy._id.toString()
      : job.postedBy.toString();

  const isOwner = postedById === user.id;
  const isAdmin = user.role === "admin";

  if (!isOwner && !isAdmin) {
    throw new ApiError(403, "You are not allowed to view applicants");
  }

  return {
    job: {
      id: job._id,
      title: job.title,
      company: job.company,
    },
    applicants: job.applicants,
  };
};

/* ──────────────────────────────────────────────
   ADMIN — UPDATE JOB STATUS
─────────────────────────────────────────────── */
exports.updateJobStatus = async (jobId, status, user) => {
  if (user?.role !== "admin") {
    throw new ApiError(403, "Only admin can update job status");
  }

  const allowed = ["draft", "pending", "open", "closed"];
  if (!allowed.includes(status)) {
    throw new ApiError(400, "Invalid job status");
  }

  const job = await Job.findById(jobId);
  if (!job) throw new ApiError(404, "Job not found");

  job.status = status;
  await job.save();

  return job;
};
