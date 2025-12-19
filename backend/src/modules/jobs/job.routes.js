// backend/src/modules/jobs/job.routes.js

const router = require("express").Router();

const controller = require("./job.controller");
const auth = require("../../middleware/authMiddleware");
const role = require("../../middleware/roleMiddleware");
const validateRequest = require("../../middleware/validateRequest");

const {
  createJobSchema,
  applyJobSchema,
  updateJobStatusSchema,
  jobQuerySchema, // ✅ FIX: used now
} = require("./job.validation");

/* ──────────────────────────────────────────────
   CREATE JOB
   (Alumni / Faculty / Admin)
─────────────────────────────────────────────── */
router.post(
  "/",
  auth,
  role("alumni", "faculty", "admin"),
  validateRequest(createJobSchema),
  controller.postJob
);

/* ──────────────────────────────────────────────
   GET MY POSTED JOBS
   (Alumni / Faculty)
   ⚠️ MUST come before "/:id"
─────────────────────────────────────────────── */
router.get(
  "/my/posted",
  auth,
  role("alumni", "faculty"),
  controller.getMyPostedJobs
);

/* ──────────────────────────────────────────────
   GET JOBS (LIST + SEARCH + FILTER + AI)
   (All authenticated users)
─────────────────────────────────────────────── */
router.get(
  "/",
  auth,
  validateRequest(jobQuerySchema, "query"), // ✅ FIX
  controller.getJobs
);

/* ──────────────────────────────────────────────
   GET JOB DETAILS
   + viewsCount
   + AI recommendation (student)
─────────────────────────────────────────────── */
router.get(
  "/:id",
  auth,
  controller.getJobDetails
);

/* ──────────────────────────────────────────────
   APPLY JOB
   (Student only)
─────────────────────────────────────────────── */
router.post(
  "/:id/apply",
  auth,
  role("student"),
  validateRequest(applyJobSchema),
  controller.applyJob
);

/* ──────────────────────────────────────────────
   GET JOB APPLICANTS 🔥
   (Job Owner / Admin)
   REQUIRED for ApplicantList.jsx
─────────────────────────────────────────────── */
router.get(
  "/:id/applicants",
  auth,
  role("alumni", "faculty", "admin"),
  controller.getApplicants
);

/* ──────────────────────────────────────────────
   ADMIN — UPDATE JOB STATUS
   (pending → open → closed)
─────────────────────────────────────────────── */
router.patch(
  "/:id/status",
  auth,
  role("admin"),
  validateRequest(updateJobStatusSchema),
  controller.updateJobStatus
);

module.exports = router;
