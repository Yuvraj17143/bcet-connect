// frontend/src/modules/jobs/pages/JobDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../services/apiClient";
import { useAuth } from "../../../context/AuthContext";
import JobMatchWidget from "../components/JobMatchWidget";
import {
  MapPin,
  Building2,
  ArrowLeft,
  Briefcase,
  Calendar,
  Clock,
  IndianRupee,
  Users,
  Send,
  Lock,
  CheckCircle2,
  AlertCircle,
  Shield,
  GraduationCap,
} from "lucide-react";

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [applying, setApplying] = useState(false);

  /* ──────────────────────────────────────────────
     FETCH JOB
  ──────────────────────────────────────────────── */
  useEffect(() => {
    api
      .get(`/jobs/${id}`)
      .then((res) => setJob(res.data.data))
      .catch(() => navigate("/jobs"));
  }, [id, navigate]);

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading job details...</p>
        </div>
      </div>
    );
  }

  /* ──────────────────────────────────────────────
     DERIVED STATES
  ──────────────────────────────────────────────── */
  const isStudent = user?.role === "student";
  const isOpen = job.status === "open";
  const isPending = job.status === "pending";

  const alreadyApplied = isStudent
    ? job.applicants?.some((a) => a.user === user?.id)
    : false;

  const canApply = isStudent && isOpen && !alreadyApplied;

  /* ──────────────────────────────────────────────
     SALARY DISPLAY
  ──────────────────────────────────────────────── */
  let salaryText = null;
  if (job.salaryRange && (job.salaryRange.min || job.salaryRange.max)) {
    const min = job.salaryRange.min || null;
    const max = job.salaryRange.max || null;

    if (min && max) salaryText = `₹${min.toLocaleString()} – ₹${max.toLocaleString()}`;
    else if (min) salaryText = `From ₹${min.toLocaleString()}`;
    else if (max) salaryText = `Up to ₹${max.toLocaleString()}`;
  }

  /* ──────────────────────────────────────────────
     POSTED BY BADGE
  ──────────────────────────────────────────────── */
  const getPostedByBadge = () => {
    if (job.postedByRole === "admin")
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-sm font-medium">
          <Shield size={14} />
          Posted by Admin
        </span>
      );

    if (job.postedByRole === "faculty")
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-sm font-medium">
          <GraduationCap size={14} />
          Posted by Faculty
        </span>
      );

    if (job.postedByRole === "alumni")
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-sm font-medium">
          <Users size={14} />
          Posted by Alumni
        </span>
      );

    return null;
  };

  /* ──────────────────────────────────────────────
     APPLY HANDLER
  ──────────────────────────────────────────────── */
  const handleApply = async () => {
    if (!canApply) return;

    try {
      setApplying(true);

      // 🔔 resume upload UI can be added later
      await api.post(`/jobs/${id}/apply`, {
        resume: "https://example.com/resume.pdf",
      });

      alert("Applied successfully 🎉");
      setJob((prev) => ({
        ...prev,
        applicantsCount: prev.applicantsCount + 1,
      }));
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to apply");
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Jobs
        </button>

        {/* STATUS BANNER */}
        {isPending && (
          <div className="mb-6 p-4 rounded-lg bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 flex items-start gap-3">
            <AlertCircle size={20} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                Pending Review
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-0.5">
                This job posting is awaiting administrator approval before being visible to all students.
              </p>
            </div>
          </div>
        )}

        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* HEADER CARD */}
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
              {/* Title Section */}
              <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-start gap-4 mb-4">
                  {/* Company Initial */}
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-2xl shadow-sm flex-shrink-0">
                    {job.company?.charAt(0)?.toUpperCase() || "J"}
                  </div>

                  {/* Title + Company */}
                  <div className="flex-1 min-w-0">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {job.title}
                    </h1>
                    <p className="text-lg text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Building2 size={18} />
                      {job.company}
                    </p>
                  </div>
                </div>

                {/* Posted By Badge */}
                {getPostedByBadge()}
              </div>

              {/* Key Info Grid */}
              <div className="p-6 grid sm:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-900/50">
                {/* Location */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center flex-shrink-0">
                    <MapPin size={18} className="text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                      Location
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">
                      {job.location}
                    </p>
                  </div>
                </div>

                {/* Employment Type */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center flex-shrink-0">
                    <Briefcase size={18} className="text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                      Job Type
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">
                      {job.employmentType}
                    </p>
                  </div>
                </div>

                {/* Work Mode */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center flex-shrink-0">
                    <Clock size={18} className="text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                      Work Mode
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">
                      {job.mode}
                    </p>
                  </div>
                </div>

                {/* Salary */}
                {salaryText && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center flex-shrink-0">
                      <IndianRupee size={18} className="text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                        Salary Range
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">
                        {salaryText}
                      </p>
                    </div>
                  </div>
                )}

                {/* Deadline */}
                {job.deadline && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center flex-shrink-0">
                      <Calendar size={18} className="text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                        Application Deadline
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">
                        {new Date(job.deadline).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* REQUIRED SKILLS */}
            {job.requiredSkills && job.requiredSkills.length > 0 && (
              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 size={18} className="text-blue-600 dark:text-blue-400" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Required Skills
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {job.requiredSkills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-md text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* OPTIONAL SKILLS */}
            {job.optionalSkills && job.optionalSkills.length > 0 && (
              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 size={18} className="text-gray-500 dark:text-gray-400" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Optional Skills (Nice to Have)
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {job.optionalSkills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-md text-sm font-medium bg-gray-50 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* JOB DESCRIPTION */}
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Job Description
              </h2>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                  {job.description}
                </p>
              </div>
            </div>

            {/* AI MATCH WIDGET */}
            {job.recommendation && isStudent && (
              <JobMatchWidget recommendation={job.recommendation} />
            )}
          </div>

          {/* RIGHT COLUMN - Sticky Apply Box */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-6">
              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Application
                  </h2>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* NOT A STUDENT */}
                  {!isStudent && (
                    <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-start gap-3">
                      <Lock size={18} className="text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Students Only
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Only registered students can apply for job opportunities.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* ALREADY APPLIED */}
                  {alreadyApplied && (
                    <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 flex items-start gap-3">
                      <CheckCircle2 size={18} className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-green-700 dark:text-green-300">
                          Application Submitted
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                          You have already applied for this position. The recruiter will review your application.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* NOT OPEN */}
                  {!isOpen && !isPending && (
                    <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 flex items-start gap-3">
                      <AlertCircle size={18} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-red-700 dark:text-red-300">
                          Applications Closed
                        </p>
                        <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                          This position is no longer accepting applications.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* APPLY BUTTON */}
                  <button
                    disabled={!canApply || applying}
                    onClick={handleApply}
                    className={`
                      w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors
                      ${
                        canApply
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                      }
                    `}
                  >
                    {applying ? (
                      <>
                        <Clock size={18} className="animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        {alreadyApplied ? "Already Applied" : "Apply Now"}
                      </>
                    )}
                  </button>

                  {/* PRIVACY NOTE */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                      🔒 Your profile information and resume will be securely shared with the job poster. We respect your privacy.
                    </p>
                  </div>
                </div>
              </div>

              {/* ADDITIONAL INFO */}
              {job.applicantsCount > 0 && (
                <div className="mt-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
                    <Users size={16} />
                    <span>
                      <strong>{job.applicantsCount}</strong> {job.applicantsCount === 1 ? "student has" : "students have"} applied
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}