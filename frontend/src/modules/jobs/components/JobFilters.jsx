// src/modules/jobs/components/JobFilters.jsx

import { useState } from "react";
import {
  SlidersHorizontal,
  RefreshCcw,
  Briefcase,
  MapPin,
  Clock,
  Tag,
  X,
  ChevronDown,
} from "lucide-react";

export default function JobFilters({ filters, onFilterChange }) {
  const [skillsInput, setSkillsInput] = useState("");

  if (!filters) return null;

  const update = (patch) => {
    onFilterChange({ ...filters, ...patch });
  };

  const reset = () => {
    setSkillsInput("");
    onFilterChange({
      employmentType: undefined,
      mode: undefined,
      location: undefined,
      requiredSkills: [],
    });
  };

  const handleSkillsChange = (e) => {
    const value = e.target.value;
    setSkillsInput(value);

    const skills = value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    update({ requiredSkills: skills });
  };

  const removeSkill = (skillToRemove) => {
    const updatedSkills = filters.requiredSkills.filter(
      (skill) => skill !== skillToRemove
    );
    update({ requiredSkills: updatedSkills });
    setSkillsInput(updatedSkills.join(", "));
  };

  const hasActiveFilters =
    filters.employmentType ||
    filters.mode ||
    filters.location ||
    (filters.requiredSkills && filters.requiredSkills.length > 0);

  return (
    <section className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <SlidersHorizontal size={16} className="text-gray-900 dark:text-white" strokeWidth={2} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                Filters
                {hasActiveFilters && (
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                    {[
                      filters.employmentType,
                      filters.mode,
                      filters.location,
                      filters.requiredSkills?.length > 0,
                    ].filter(Boolean).length}
                  </span>
                )}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Refine your search
              </p>
            </div>
          </div>
          <button
            onClick={reset}
            disabled={!hasActiveFilters}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <RefreshCcw size={12} strokeWidth={2} />
            Reset
          </button>
        </div>
      </div>

      {/* Filter Options */}
      <div className="p-5 space-y-5">
        {/* Job Type */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white mb-2.5">
            <Briefcase size={16} className="text-gray-500 dark:text-gray-400" strokeWidth={2} />
            Job Type
          </label>
          <div className="relative">
            <select
              value={filters.employmentType || ""}
              onChange={(e) =>
                update({ employmentType: e.target.value || undefined })
              }
              className="w-full appearance-none px-4 py-2.5 pr-10 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:border-gray-900 dark:focus:border-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/10 transition-all cursor-pointer"
            >
              <option value="">All Types</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Internship">Internship</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Contract">Contract</option>
              <option value="Freelance">Freelance</option>
            </select>
            <ChevronDown
              size={16}
              strokeWidth={2}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
        </div>

        {/* Work Mode */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white mb-2.5">
            <Clock size={16} className="text-gray-500 dark:text-gray-400" strokeWidth={2} />
            Work Mode
          </label>
          <div className="relative">
            <select
              value={filters.mode || ""}
              onChange={(e) => update({ mode: e.target.value || undefined })}
              className="w-full appearance-none px-4 py-2.5 pr-10 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:border-gray-900 dark:focus:border-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/10 transition-all cursor-pointer"
            >
              <option value="">Any Mode</option>
              <option value="Onsite">Onsite</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
            </select>
            <ChevronDown
              size={16}
              strokeWidth={2}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white mb-2.5">
            <MapPin size={16} className="text-gray-500 dark:text-gray-400" strokeWidth={2} />
            Location
          </label>
          <input
            type="text"
            placeholder="e.g. Bangalore, Mumbai"
            value={filters.location || ""}
            onChange={(e) =>
              update({ location: e.target.value || undefined })
            }
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm placeholder-gray-400 dark:placeholder-gray-500 focus:border-gray-900 dark:focus:border-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/10 transition-all"
          />
        </div>

        {/* Skills */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white mb-2.5">
            <Tag size={16} className="text-gray-500 dark:text-gray-400" strokeWidth={2} />
            Skills
          </label>
          <input
            type="text"
            placeholder="e.g. React, Node.js, Python"
            value={skillsInput}
            onChange={handleSkillsChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm placeholder-gray-400 dark:placeholder-gray-500 focus:border-gray-900 dark:focus:border-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/10 transition-all"
          />
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1.5">
            Separate multiple skills with commas
          </p>

          {/* Skills Tags */}
          {filters.requiredSkills && filters.requiredSkills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {filters.requiredSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-0.5 transition-colors"
                    aria-label={`Remove ${skill}`}
                  >
                    <X size={12} strokeWidth={2.5} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Active Summary */}
        {hasActiveFilters && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30">
              <p className="text-xs font-medium text-blue-900 dark:text-blue-300">
                {[
                  filters.employmentType,
                  filters.mode,
                  filters.location,
                  filters.requiredSkills?.length > 0 &&
                    `${filters.requiredSkills.length} skill${
                      filters.requiredSkills.length > 1 ? "s" : ""
                    }`,
                ]
                  .filter(Boolean)
                  .join(" • ")}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}