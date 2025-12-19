// backend/src/modules/jobs/job.model.js
const mongoose = require("mongoose");

/* ──────────────────────────────────────────────
   APPLICANT SUB-SCHEMA
─────────────────────────────────────────────── */
const applicantSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    resume: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["applied", "shortlisted", "rejected", "hired"],
      default: "applied",
      index: true,
    },

    appliedAt: {
      type: Date,
      default: Date.now,
    },

    /* ───── AI / ANALYTICS ───── */
    aiScore: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },

    statusUpdatedAt: {
      type: Date,
      default: null,
    },

    statusUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { _id: false }
);

/* ──────────────────────────────────────────────
   JOB SCHEMA
─────────────────────────────────────────────── */
const jobSchema = new mongoose.Schema(
  {
    /* ───── BASIC INFO ───── */
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    companyLogo: {
      type: String,
      default: "https://via.placeholder.com/100x100?text=Logo",
    },

    location: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    employmentType: {
      type: String,
      enum: ["Full-Time", "Internship", "Part-Time", "Contract", "Freelance"],
      default: "Full-Time",
      index: true,
    },

    mode: {
      type: String,
      enum: ["Onsite", "Remote", "Hybrid"],
      default: "Onsite",
      index: true,
    },

    experienceLevel: {
      type: String,
      enum: ["Entry", "Mid", "Senior", "Lead"],
      default: "Entry",
    },

    category: {
      type: String,
      default: "General",
      index: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    /* ───── SKILLS (NORMALIZED) ───── */
    requiredSkills: {
      type: [String],
      default: [],
      index: true,
      set: (skills) =>
        Array.isArray(skills)
          ? skills.map((s) => s.toLowerCase().trim())
          : [],
    },

    optionalSkills: {
      type: [String],
      default: [],
      set: (skills) =>
        Array.isArray(skills)
          ? skills.map((s) => s.toLowerCase().trim())
          : [],
    },

    /* ───── SALARY ───── */
    salaryRange: {
      min: {
        type: Number,
        default: 0,
        min: 0,
      },
      max: {
        type: Number,
        default: 0,
        min: 0,
      },
      currency: {
        type: String,
        default: "INR",
      },
    },

    applyLink: {
      type: String,
      trim: true,
      default: "",
    },

    deadline: {
      type: Date,
      index: true,
    },

    /* ───── OWNERSHIP ───── */
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    postedByRole: {
      type: String,
      enum: ["student", "alumni", "faculty", "admin"],
      required: true,
      index: true,
    },

    /* ───── STATUS ───── */
    status: {
      type: String,
      enum: ["draft", "pending", "open", "closed"],
      default: "pending",
      index: true,
    },

    isArchived: {
      type: Boolean,
      default: false,
      index: true,
    },

    /* ───── METRICS ───── */
    viewsCount: {
      type: Number,
      default: 0,
    },

    applicantsCount: {
      type: Number,
      default: 0,
    },

    applicants: {
      type: [applicantSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

/* ──────────────────────────────────────────────
   TEXT SEARCH
─────────────────────────────────────────────── */
jobSchema.index({
  title: "text",
  company: "text",
  location: "text",
});

/* ──────────────────────────────────────────────
   PERFORMANCE INDEXES
─────────────────────────────────────────────── */
jobSchema.index({ status: 1, createdAt: -1 });
jobSchema.index({ postedBy: 1, status: 1 });
jobSchema.index({ mode: 1, employmentType: 1 });
jobSchema.index({ "applicants.user": 1 });

module.exports = mongoose.model("Job", jobSchema);
