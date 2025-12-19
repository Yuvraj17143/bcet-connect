// src/modules/jobs/components/JobCard.jsx
import { Link } from "react-router-dom";
import {
  Briefcase,
  MapPin,
  Building2,
  Clock,
  IndianRupee,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  Users,
} from "lucide-react";

export default function JobCard({ job, currentUserRole }) {
  if (!job) return null;

  const {
    _id,
    title,
    company,
    location,
    employmentType,
    mode,
    requiredSkills = [],
    optionalSkills = [],
    salaryRange,
    status = "open",
    postedByRole,
    recommendation,
  } = job;

  /* ──────────────────────────────────────────────
     SAFE FALLBACKS
  ──────────────────────────────────────────────── */
  const displaySkills =
    requiredSkills.length > 0 ? requiredSkills : optionalSkills;

  const initials =
    company?.charAt(0)?.toUpperCase() ||
    title?.charAt(0)?.toUpperCase() ||
    "J";

  /* ──────────────────────────────────────────────
     SALARY FORMAT
  ──────────────────────────────────────────────── */
  let salaryText = null;
  if (salaryRange && (salaryRange.min || salaryRange.max)) {
    const min = salaryRange.min || null;
    const max = salaryRange.max || null;

    if (min && max) salaryText = `₹${min} – ₹${max}`;
    else if (min) salaryText = `From ₹${min}`;
    else if (max) salaryText = `Up to ₹${max}`;
  }

  /* ──────────────────────────────────────────────
     STATUS FLAGS
  ──────────────────────────────────────────────── */
  const isClosed = status === "closed";
  const isPending = status === "pending";
  const cardDisabled = isClosed;

  /* ──────────────────────────────────────────────
     ROLE BADGE - Professional Style
  ──────────────────────────────────────────────── */
  const roleBadge = () => {
    if (postedByRole === "admin")
      return (
        <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-medium">
          <ShieldCheck size={13} strokeWidth={2} />
          Admin
        </span>
      );

    if (postedByRole === "faculty")
      return (
        <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-medium">
          <GraduationCap size={13} strokeWidth={2} />
          Faculty
        </span>
      );

    if (postedByRole === "alumni")
      return (
        <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-medium">
          <Users size={13} strokeWidth={2} />
          Alumni
        </span>
      );

    return null;
  };

  /* ──────────────────────────────────────────────
     AI MATCH (STUDENT ONLY)
  ──────────────────────────────────────────────── */
  const showMatch =
    currentUserRole === "student" && recommendation?.matchScore !== undefined;

  return (
    <Link
      to={`/jobs/${_id}`}
      className={`block ${cardDisabled ? "pointer-events-none" : ""}`}
    >
      <article
        className={`
          group relative
          rounded-xl border bg-white dark:bg-gray-900
          transition-all duration-300 ease-out
          ${
            cardDisabled
              ? "border-gray-200 dark:border-gray-800 opacity-60"
              : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-lg"
          }
        `}
      >
        {/* ─────────────────────────────────────────
            TOP STATUS BAR (Only for Pending/Closed)
        ───────────────────────────────────────── */}
        {(isPending || isClosed) && (
          <div
            className={`
            px-4 py-2 text-xs font-medium border-b
            ${
              isPending
                ? "bg-amber-50 text-amber-800 border-amber-100 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-900"
                : "bg-red-50 text-red-800 border-red-100 dark:bg-red-950 dark:text-red-300 dark:border-red-900"
            }
          `}
          >
            {isPending && "⏳ Pending admin approval"}
            {isClosed && "🔒 Applications closed"}
          </div>
        )}

        {/* ─────────────────────────────────────────
            MAIN CONTENT
        ───────────────────────────────────────── */}
        <div className="p-5">
          {/* Header Section */}
          <div className="flex gap-4">
            {/* Company Avatar */}
            <div
              className="
              w-12 h-12 rounded-lg flex-shrink-0
              bg-gradient-to-br from-blue-500 to-blue-600
              flex items-center justify-center
              text-white font-semibold text-lg
              shadow-sm
            "
            >
              {initials}
            </div>

            {/* Job Info */}
            <div className="flex-1 min-w-0">
              {/* Title + Employment Type */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3
                  className="
                  text-lg font-semibold text-gray-900 dark:text-white
                  leading-tight line-clamp-2
                  group-hover:text-blue-600 dark:group-hover:text-blue-400
                  transition-colors
                "
                >
                  {title}
                </h3>

                {employmentType && (
                  <span
                    className="
                    inline-flex items-center gap-1.5
                    px-2.5 py-1 rounded-md text-xs font-medium
                    bg-blue-50 text-blue-700
                    dark:bg-blue-950 dark:text-blue-300
                    whitespace-nowrap flex-shrink-0
                  "
                  >
                    <Briefcase size={12} strokeWidth={2.5} />
                    {employmentType}
                  </span>
                )}
              </div>

              {/* Company + Location */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-600 dark:text-gray-400 mb-3">
                {company && (
                  <span className="inline-flex items-center gap-1.5">
                    <Building2 size={14} strokeWidth={2} />
                    {company}
                  </span>
                )}
                {location && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={14} strokeWidth={2} />
                    {location}
                  </span>
                )}
              </div>

              {/* Mode + Salary + Posted By */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {mode && (
                  <span
                    className="
                    inline-flex items-center gap-1.5
                    px-2.5 py-1 rounded-md text-xs font-medium
                    bg-gray-100 text-gray-700
                    dark:bg-gray-800 dark:text-gray-300
                  "
                  >
                    <Clock size={12} strokeWidth={2} />
                    {mode}
                  </span>
                )}

                {salaryText && (
                  <span
                    className="
                    inline-flex items-center gap-1.5
                    px-2.5 py-1 rounded-md text-xs font-medium
                    bg-green-50 text-green-700
                    dark:bg-green-950 dark:text-green-300
                  "
                  >
                    <IndianRupee size={12} strokeWidth={2} />
                    {salaryText}
                  </span>
                )}

                {roleBadge()}
              </div>

              {/* Skills */}
              {displaySkills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {displaySkills.slice(0, 4).map((skill) => (
                    <span
                      key={skill}
                      className="
                        px-3 py-1 rounded-md text-xs font-medium
                        bg-gray-50 text-gray-700 border border-gray-200
                        dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700
                      "
                    >
                      {skill}
                    </span>
                  ))}
                  {displaySkills.length > 4 && (
                    <span className="px-3 py-1 text-xs font-medium text-gray-500">
                      +{displaySkills.length - 4} more
                    </span>
                  )}
                </div>
              )}

              {/* AI Match Score */}
              {showMatch && (
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800">
                  <Sparkles
                    size={14}
                    className="text-purple-600 dark:text-purple-400"
                    strokeWidth={2}
                  />
                  <span className="text-xs font-semibold text-purple-700 dark:text-purple-300">
                    {recommendation.matchScore}% match
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────
            FOOTER CTA
        ───────────────────────────────────────── */}
        <div
          className="
          px-5 py-3 border-t border-gray-100 dark:border-gray-800
          flex items-center justify-between
          bg-gray-50/50 dark:bg-gray-900/50
        "
        >
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {isClosed ? "Closed" : "Click to view details"}
          </span>
          {!isClosed && (
            <span
              className="
              text-sm font-medium text-blue-600 dark:text-blue-400
              group-hover:translate-x-1 transition-transform
            "
            >
              View & Apply →
            </span>
          )}
        </div>
      </article>
    </Link>
  );
}