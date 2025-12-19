// backend/src/modules/jobs/job.validation.js
const Joi = require("joi");

/* ──────────────────────────────────────────────
   REUSABLE SKILL ARRAY (AI SAFE)
─────────────────────────────────────────────── */
const skillArray = Joi.array()
  .items(
    Joi.string()
      .trim()
      .lowercase()
      .min(1)
      .max(50)
  )
  .max(30)
  .unique()
  .default([]);

/* ──────────────────────────────────────────────
   CREATE / POST JOB
   (Alumni / Faculty / Admin)
─────────────────────────────────────────────── */
exports.createJobSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(3)
    .max(120)
    .required(),

  company: Joi.string()
    .trim()
    .min(2)
    .max(120)
    .required(),

  companyLogo: Joi.string()
    .uri()
    .optional(),

  location: Joi.string()
    .trim()
    .min(2)
    .max(120)
    .required(),

  employmentType: Joi.string()
    .valid(
      "Full-Time",
      "Internship",
      "Part-Time",
      "Contract",
      "Freelance"
    )
    .default("Full-Time"),

  mode: Joi.string()
    .valid("Onsite", "Remote", "Hybrid")
    .default("Onsite"),

  experienceLevel: Joi.string()
    .valid("Entry", "Mid", "Senior", "Lead")
    .default("Entry"),

  category: Joi.string()
    .trim()
    .max(60)
    .default("General"),

  description: Joi.string()
    .trim()
    .min(20)
    .max(5000)
    .required(),

  /* 🔥 AI CORE */
  requiredSkills: skillArray.min(1).required(),
  optionalSkills: skillArray.optional(),

  salaryRange: Joi.object({
    min: Joi.number()
      .min(0)
      .default(0),

    max: Joi.number()
      .min(Joi.ref("min"))
      .default(0),

    currency: Joi.string().default("INR"),
  }).optional(),

  /* External apply allowed */
  applyLink: Joi.string()
    .uri()
    .allow("")
    .optional(),

  deadline: Joi.date()
    .greater("now")
    .optional(),

  /* ❌ SECURITY: NEVER client controlled */
  status: Joi.forbidden(),
  postedBy: Joi.forbidden(),
  postedByRole: Joi.forbidden(),
});

/* ──────────────────────────────────────────────
   APPLY JOB
   (Student only)
   ✔ resume optional if applyLink exists
─────────────────────────────────────────────── */
exports.applyJobSchema = Joi.object({
  resume: Joi.string()
    .uri()
    .optional(),
});

/* ──────────────────────────────────────────────
   ADMIN — UPDATE JOB STATUS
─────────────────────────────────────────────── */
exports.updateJobStatusSchema = Joi.object({
  status: Joi.string()
    .valid("pending", "open", "closed")
    .required(),
});

/* ──────────────────────────────────────────────
   JOB LIST / SEARCH VALIDATION
   (Frontend Filters)
─────────────────────────────────────────────── */
exports.jobQuerySchema = Joi.object({
  search: Joi.string()
    .trim()
    .allow(""),

  employmentType: Joi.string()
    .valid(
      "Full-Time",
      "Internship",
      "Part-Time",
      "Contract",
      "Freelance"
    )
    .optional(),

  mode: Joi.string()
    .valid("Onsite", "Remote", "Hybrid")
    .optional(),

  requiredSkills: skillArray.optional(),

  page: Joi.number()
    .min(1)
    .default(1),

  limit: Joi.number()
    .min(1)
    .max(50)
    .default(20),
});
