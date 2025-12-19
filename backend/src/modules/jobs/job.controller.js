// backend/src/modules/jobs/job.controller.js

const catchAsync = require("../../utils/catchAsync");
const jobService = require("./job.service");

/* ──────────────────────────────────────────────
   CREATE / POST JOB
   (Alumni / Faculty / Admin)
─────────────────────────────────────────────── */
exports.postJob = catchAsync(async (req, res) => {
  const job = await jobService.postJob(req.body, req.user);

  res.status(201).json({
    success: true,
    message: "Job posted successfully",
    data: job,
  });
});

/* ──────────────────────────────────────────────
   GET JOBS (LIST + SEARCH + FILTER + AI)
   (Student / Alumni / Faculty / Admin)
─────────────────────────────────────────────── */
exports.getJobs = catchAsync(async (req, res) => {
  const {
    search,
    employmentType,
    mode,              // ✅ FIX: missing earlier
    location,
    requiredSkills,
    page = 1,
    limit = 20,
  } = req.query;

  /* 🔥 AI + SEARCH SAFE NORMALIZATION */
  const normalizedSkills = Array.isArray(requiredSkills)
    ? requiredSkills
        .map((s) => s.toString().trim().toLowerCase())
        .filter(Boolean)
    : requiredSkills
    ? [requiredSkills.toString().trim().toLowerCase()]
    : [];

  const jobs = await jobService.getJobs({
    search: search?.trim(),
    employmentType,
    mode,              // ✅ pass to service
    location,

    requiredSkills: normalizedSkills,

    page: Number(page),
    limit: Number(limit),

    role: req.user.role,
    userId: req.user.id,
    userSkills: req.user.skills || [],
  });

  res.status(200).json({
    success: true,
    count: jobs.length,
    data: jobs,
  });
});

/* ──────────────────────────────────────────────
   GET JOB DETAILS
   + viewsCount
   + AI Recommendation (Student)
─────────────────────────────────────────────── */
exports.getJobDetails = catchAsync(async (req, res) => {
  const job = await jobService.getJobDetails(
    req.params.id,
    req.user
  );

  res.status(200).json({
    success: true,
    data: job,
  });
});

/* ──────────────────────────────────────────────
   APPLY JOB
   (Student only)
─────────────────────────────────────────────── */
exports.applyJob = catchAsync(async (req, res) => {
  const job = await jobService.applyJob(
    req.params.id,
    req.user,
    req.body.resume
  );

  res.status(200).json({
    success: true,
    message: "Applied successfully",
    data: job,
  });
});

/* ──────────────────────────────────────────────
   GET MY POSTED JOBS
   (Alumni / Faculty)
─────────────────────────────────────────────── */
exports.getMyPostedJobs = catchAsync(async (req, res) => {
  const jobs = await jobService.getJobs({
    role: req.user.role,
    userId: req.user.id,
    page: 1,
    limit: 50, // dashboard view
  });

  res.status(200).json({
    success: true,
    count: jobs.length,
    data: jobs,
  });
});

/* ──────────────────────────────────────────────
   GET JOB APPLICANTS
   (Job Owner / Admin)
   REQUIRED for ApplicantList.jsx
─────────────────────────────────────────────── */
exports.getApplicants = catchAsync(async (req, res) => {
  const result = await jobService.getApplicants(
    req.params.id,
    req.user
  );

  res.status(200).json({
    success: true,
    data: result,
  });
});

/* ──────────────────────────────────────────────
   ADMIN — UPDATE JOB STATUS
   (pending → open → closed)
─────────────────────────────────────────────── */
exports.updateJobStatus = catchAsync(async (req, res) => {
  const job = await jobService.updateJobStatus(
    req.params.id,
    req.body.status,
    req.user
  );

  res.status(200).json({
    success: true,
    message: "Job status updated successfully",
    data: job,
  });
});
