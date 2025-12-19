// frontend/src/modules/jobs/components/ApplicantList.jsx

import { useEffect, useState } from "react";
import api from "@/services/apiClient";
import {
  FileText,
  User,
  CalendarDays,
  AlertCircle,
  Loader2,
  Users,
  Briefcase,
  Mail,
  GraduationCap,
  ExternalLink,
  Download,
} from "lucide-react";

export default function ApplicantList({ jobId }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);

  /* ──────────────────────────────────────────────
     FETCH APPLICANTS (BACKEND ALIGNED)
  ──────────────────────────────────────────────── */
  useEffect(() => {
    if (!jobId) return;

    const fetchApplicants = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get(`/jobs/${jobId}/applicants`);

        const payload = res?.data?.data;

        setJob(payload?.job || null);
        setApplicants(
          Array.isArray(payload?.applicants) ? payload.applicants : []
        );
      } catch (err) {
        console.error("❌ Failed to load applicants:", err);
        setError(
          err?.response?.data?.message ||
            "You are not allowed to view applicants for this job."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [jobId]);

  /* ──────────────────────────────────────────────
     STATES
  ──────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2
          className="animate-spin text-blue-600 dark:text-blue-400 mb-3"
          size={36}
        />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Loading applicants...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-6 flex items-start gap-3">
        <AlertCircle
          size={20}
          className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
        />
        <div>
          <p className="text-sm font-medium text-red-900 dark:text-red-100">
            Access Denied
          </p>
          <p className="text-sm text-red-700 dark:text-red-300 mt-1">
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!applicants.length) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
          <Users size={32} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No Applications Yet
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          When students apply for this position, their applications will appear
          here for your review.
        </p>
      </div>
    );
  }

  /* ──────────────────────────────────────────────
     HELPERS
  ──────────────────────────────────────────────── */
  const formatDate = (date) => {
    try {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "shortlisted":
        return {
          bg: "bg-blue-50 dark:bg-blue-950",
          text: "text-blue-700 dark:text-blue-300",
          border: "border-blue-200 dark:border-blue-800",
          label: "Shortlisted",
        };
      case "rejected":
        return {
          bg: "bg-red-50 dark:bg-red-950",
          text: "text-red-700 dark:text-red-300",
          border: "border-red-200 dark:border-red-800",
          label: "Rejected",
        };
      case "hired":
        return {
          bg: "bg-emerald-50 dark:bg-emerald-950",
          text: "text-emerald-700 dark:text-emerald-300",
          border: "border-emerald-200 dark:border-emerald-800",
          label: "Hired",
        };
      default:
        return {
          bg: "bg-gray-50 dark:bg-gray-800",
          text: "text-gray-700 dark:text-gray-300",
          border: "border-gray-200 dark:border-gray-700",
          label: "Applied",
        };
    }
  };

  /* ──────────────────────────────────────────────
     RENDER
  ──────────────────────────────────────────────── */
  return (
    <section className="space-y-6">
      {/* Header Card */}
      {job && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-sm flex-shrink-0">
              <Briefcase size={24} strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                {job.title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {job.company}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300">
                  <Users size={14} />
                  {applicants.length}{" "}
                  {applicants.length === 1 ? "Application" : "Applications"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Applicants List */}
      <div className="space-y-3">
        {applicants.map((app, index) => {
          const user = app.user || {};
          const statusConfig = getStatusConfig(app.status);

          return (
            <div
              key={`${user._id || "user"}-${index}`}
              className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors overflow-hidden"
            >
              <div className="p-5">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Left - Avatar + Info */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    {/* Avatar */}
                    <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name || "Student"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User size={24} className="text-white" strokeWidth={2} />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-base mb-1">
                        {user.name || "Unnamed Student"}
                      </h3>

                      {/* Meta Info */}
                      <div className="space-y-1.5">
                        {user.department && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <GraduationCap size={14} />
                            <span>
                              {user.department}
                              {user.batch && ` • ${user.batch}`}
                            </span>
                          </div>
                        )}

                        {user.email && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Mail size={14} />
                            <a
                              href={`mailto:${user.email}`}
                              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                              {user.email}
                            </a>
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <CalendarDays size={14} />
                          <span>Applied on {formatDate(app.appliedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right - Status + Actions */}
                  <div className="flex sm:flex-col sm:items-end gap-3 sm:gap-2">
                    {/* Status Badge */}
                    <span
                      className={`inline-flex items-center px-3 py-1.5 rounded-md text-xs font-semibold border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                    >
                      {statusConfig.label}
                    </span>

                    {/* Resume Button */}
                    {app.resume && (
                      <a
                        href={app.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-sm font-medium transition-colors"
                      >
                        <FileText size={16} />
                        <span>Resume</span>
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Optional: Skills Section (if available) */}
              {user.skills && user.skills.length > 0 && (
                <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">
                    Skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.slice(0, 5).map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 rounded-md text-xs bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                      >
                        {skill}
                      </span>
                    ))}
                    {user.skills.length > 5 && (
                      <span className="px-2 py-1 text-xs text-gray-500">
                        +{user.skills.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Summary */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          Showing {applicants.length}{" "}
          {applicants.length === 1 ? "application" : "applications"}
        </p>
      </div>
    </section>
  );
}