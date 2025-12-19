// src/modules/jobs/components/JobMatchWidget.jsx
import {
  Brain,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  XCircle,
  TrendingUp,
} from "lucide-react";

export default function JobMatchWidget({ recommendation }) {
  // 🔒 Defensive guard
  if (!recommendation) {
    return (
      <section className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-6 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 mb-3">
          <Brain size={20} className="text-gray-400" />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
          AI match score will be available once your profile skills are complete.
        </p>
      </section>
    );
  }

  const {
    matchScore = 0,
    matchedSkills = [],
    missingSkills = [],
    optionalMatched = [],
    explanation = "",
  } = recommendation;

  /* ──────────────────────────────────────────────
     LABEL + COLOR - Professional Styling
  ──────────────────────────────────────────────── */
  const matchLabel =
    matchScore >= 80
      ? "Strong Match"
      : matchScore >= 50
      ? "Good Match"
      : "Needs Improvement";

  const matchConfig =
    matchScore >= 80
      ? {
          label: "Strong Match",
          icon: CheckCircle2,
          textColor: "text-emerald-700 dark:text-emerald-300",
          bgColor: "bg-emerald-50 dark:bg-emerald-950",
          borderColor: "border-emerald-200 dark:border-emerald-800",
          gaugeColor: "#10b981",
        }
      : matchScore >= 50
      ? {
          label: "Good Match",
          icon: TrendingUp,
          textColor: "text-blue-700 dark:text-blue-300",
          bgColor: "bg-blue-50 dark:bg-blue-950",
          borderColor: "border-blue-200 dark:border-blue-800",
          gaugeColor: "#3b82f6",
        }
      : {
          label: "Needs Improvement",
          icon: AlertCircle,
          textColor: "text-amber-700 dark:text-amber-300",
          bgColor: "bg-amber-50 dark:bg-amber-950",
          borderColor: "border-amber-200 dark:border-amber-800",
          gaugeColor: "#f59e0b",
        };

  const StatusIcon = matchConfig.icon;

  return (
    <section className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
      {/* Header Bar */}
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-sm">
              <Brain size={20} strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                AI-Powered Match Analysis
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Based on your profile vs. job requirements
              </p>
            </div>
          </div>

          {/* Match Badge - Desktop */}
          <div
            className={`hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold border ${matchConfig.bgColor} ${matchConfig.textColor} ${matchConfig.borderColor}`}
          >
            <StatusIcon size={14} strokeWidth={2.5} />
            {matchConfig.label}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-5">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Score Gauge Section */}
          <div className="flex flex-col items-center lg:items-start gap-3">
            {/* Circular Gauge */}
            <div className="relative">
              <svg className="w-32 h-32" viewBox="0 0 120 120">
                {/* Background circle */}
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="10"
                  className="dark:stroke-gray-800"
                />
                {/* Progress circle */}
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke={matchConfig.gaugeColor}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${(matchScore / 100) * 314} 314`}
                  transform="rotate(-90 60 60)"
                  className="transition-all duration-1000"
                />
                {/* Center content */}
                <text
                  x="60"
                  y="55"
                  textAnchor="middle"
                  className="text-3xl font-bold fill-gray-900 dark:fill-white"
                >
                  {matchScore}%
                </text>
                <text
                  x="60"
                  y="70"
                  textAnchor="middle"
                  className="text-xs fill-gray-500 dark:fill-gray-400"
                >
                  match score
                </text>
              </svg>
            </div>

            {/* Match Badge - Mobile */}
            <div
              className={`sm:hidden inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold border ${matchConfig.bgColor} ${matchConfig.textColor} ${matchConfig.borderColor}`}
            >
              <StatusIcon size={14} strokeWidth={2.5} />
              {matchConfig.label}
            </div>
          </div>

          {/* Details Section */}
          <div className="flex-1 space-y-4">
            {/* Explanation */}
            {explanation && (
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {explanation}
                </p>
              </div>
            )}

            {/* Skills Breakdown */}
            <div className="space-y-3">
              {/* Matched Skills */}
              {matchedSkills.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2
                      size={16}
                      className="text-emerald-600 dark:text-emerald-400"
                      strokeWidth={2}
                    />
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                      Skills You Match ({matchedSkills.length})
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {matchedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800"
                      >
                        <CheckCircle2 size={12} strokeWidth={2.5} />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing Skills */}
              {missingSkills.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle
                      size={16}
                      className="text-red-600 dark:text-red-400"
                      strokeWidth={2}
                    />
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                      Skills to Develop ({missingSkills.length})
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {missingSkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-red-50 text-red-700 border border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800"
                      >
                        <XCircle size={12} strokeWidth={2.5} />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Optional Matched */}
              {optionalMatched.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles
                      size={16}
                      className="text-purple-600 dark:text-purple-400"
                      strokeWidth={2}
                    />
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                      Bonus Skills ({optionalMatched.length})
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {optionalMatched.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800"
                      >
                        <Sparkles size={12} strokeWidth={2.5} />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Note */}
            <div className="pt-3 border-t border-gray-200 dark:border-gray-800">
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                💡 This score is calculated by comparing your profile skills with job requirements. Keep your profile updated to improve accuracy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}