// frontend/src/modules/jobs/pages/JobCreatePage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/apiClient";
import { useAuth } from "../../../context/AuthContext";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  MapPin,
  Clock,
  IndianRupee,
  Calendar,
  FileText,
  Tag,
  AlertCircle,
  CheckCircle2,
  Info,
} from "lucide-react";

export default function JobCreatePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  /* ──────────────────────────────────────────────
     ACCESS CONTROL
  ──────────────────────────────────────────────── */
  if (user?.role === "student") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950 flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Access Denied
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Only alumni, faculty, or administrators can post job opportunities.
          </p>
          <button
            onClick={() => navigate("/jobs")}
            className="w-full px-4 py-2.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            Go to Jobs
          </button>
        </div>
      </div>
    );
  }

  /* ──────────────────────────────────────────────
     FORM STATE
  ──────────────────────────────────────────────── */
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    employmentType: "Full-Time",
    mode: "Onsite",
    experienceLevel: "Entry",
    category: "General",
    description: "",
    deadline: "",
    minSalary: "",
    maxSalary: "",
    currency: "INR",
  });

  const [requiredSkillsInput, setRequiredSkillsInput] = useState("");
  const [optionalSkillsInput, setOptionalSkillsInput] = useState("");
  const [requiredSkills, setRequiredSkills] = useState([]);
  const [optionalSkills, setOptionalSkills] = useState([]);

  const [loading, setLoading] = useState(false);

  /* ──────────────────────────────────────────────
     HANDLERS
  ──────────────────────────────────────────────── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const parseSkills = (value, setter, inputSetter) => {
    inputSetter(value);
    const parsed = value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    setter(parsed);
  };

  /* ──────────────────────────────────────────────
     SUBMIT
  ──────────────────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const salaryRange =
        form.minSalary || form.maxSalary
          ? {
              min: Number(form.minSalary || 0),
              max: Number(form.maxSalary || 0),
              currency: form.currency,
            }
          : undefined;

      const payload = {
        title: form.title,
        company: form.company,
        location: form.location,
        employmentType: form.employmentType,
        mode: form.mode,
        experienceLevel: form.experienceLevel,
        category: form.category,
        description: form.description,
        requiredSkills,
        optionalSkills,
        deadline: form.deadline || undefined,
        ...(salaryRange && { salaryRange }),
      };

      await api.post("/jobs", payload);

      alert("Job posted successfully 🎉");
      navigate("/jobs");
    } catch (err) {
      console.error(err);
      alert(
        err?.response?.data?.message ||
          "Failed to post job. Please check inputs."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ──────────────────────────────────────────────
     NEEDS APPROVAL MESSAGE
  ──────────────────────────────────────────────── */
  const needsApproval = user?.role !== "admin";

  /* ──────────────────────────────────────────────
     UI
  ──────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Jobs
          </button>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-sm">
              <Briefcase size={24} strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Post a Job Opportunity
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Share opportunities with students and help them launch their careers
              </p>
            </div>
          </div>
        </div>

        {/* Approval Notice */}
        {needsApproval && (
          <div className="mb-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 flex gap-3">
            <Info size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Review Required
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-0.5">
                Your job posting will be reviewed by an administrator before being published to students.
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <section className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-2 mb-5">
              <FileText size={18} className="text-gray-700 dark:text-gray-300" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Basic Information
              </h2>
            </div>

            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Job Title */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    name="title"
                    placeholder="e.g., Software Engineer, Marketing Intern"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  />
                </div>

                {/* Company */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      required
                      name="company"
                      placeholder="Company name"
                      value={form.company}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      required
                      name="location"
                      placeholder="City, State or Remote"
                      value={form.location}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Job Details */}
          <section className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-2 mb-5">
              <Briefcase size={18} className="text-gray-700 dark:text-gray-300" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Job Details
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Employment Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Employment Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="employmentType"
                  value={form.employmentType}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                >
                  <option>Full-Time</option>
                  <option>Internship</option>
                  <option>Part-Time</option>
                  <option>Contract</option>
                  <option>Freelance</option>
                </select>
              </div>

              {/* Work Mode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Work Mode <span className="text-red-500">*</span>
                </label>
                <select
                  name="mode"
                  value={form.mode}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                >
                  <option>Onsite</option>
                  <option>Remote</option>
                  <option>Hybrid</option>
                </select>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Experience Level
                </label>
                <select
                  name="experienceLevel"
                  value={form.experienceLevel}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                >
                  <option>Entry</option>
                  <option>Mid</option>
                  <option>Senior</option>
                  <option>Lead</option>
                </select>
              </div>

              {/* Application Deadline */}
              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Application Deadline (Optional)
                </label>
                <div className="relative max-w-xs">
                  <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    name="deadline"
                    value={form.deadline}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Compensation */}
          <section className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-2 mb-5">
              <IndianRupee size={18} className="text-gray-700 dark:text-gray-300" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Compensation (Optional)
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Minimum Salary
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                  <input
                    type="number"
                    name="minSalary"
                    placeholder="e.g., 30000"
                    value={form.minSalary}
                    onChange={handleChange}
                    className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Maximum Salary
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                  <input
                    type="number"
                    name="maxSalary"
                    placeholder="e.g., 50000"
                    value={form.maxSalary}
                    onChange={handleChange}
                    className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Description */}
          <section className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-2 mb-5">
              <FileText size={18} className="text-gray-700 dark:text-gray-300" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Job Description
              </h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Describe the role <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={6}
                name="description"
                placeholder="Provide a detailed description of the role, responsibilities, qualifications, and any other relevant information..."
                value={form.description}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow resize-none"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Be clear and specific to attract the right candidates
              </p>
            </div>
          </section>

          {/* Skills */}
          <section className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-2 mb-5">
              <Tag size={18} className="text-gray-700 dark:text-gray-300" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Required Skills
              </h2>
            </div>

            <div className="space-y-4">
              {/* Required Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Required Skills <span className="text-red-500">*</span>
                </label>
                <input
                  value={requiredSkillsInput}
                  onChange={(e) =>
                    parseSkills(
                      e.target.value,
                      setRequiredSkills,
                      setRequiredSkillsInput
                    )
                  }
                  placeholder="React, Node.js, MongoDB (comma-separated)"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                />
                {requiredSkills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {requiredSkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800"
                      >
                        <CheckCircle2 size={12} />
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Optional Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Optional Skills (Nice to Have)
                </label>
                <input
                  value={optionalSkillsInput}
                  onChange={(e) =>
                    parseSkills(
                      e.target.value,
                      setOptionalSkills,
                      setOptionalSkillsInput
                    )
                  }
                  placeholder="Docker, AWS, CI/CD (comma-separated)"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                />
                {optionalSkills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {optionalSkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Submit */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Clock size={18} className="animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  Publish Job
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}