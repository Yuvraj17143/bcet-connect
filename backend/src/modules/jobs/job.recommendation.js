// backend/src/modules/jobs/job.recommendation.js

/* ──────────────────────────────────────────────
   NORMALIZERS (AI SAFE)
─────────────────────────────────────────────── */
const normalizeSkill = (skill = "") =>
  skill
    .toString()
    .trim()
    .toLowerCase();

const normalizeArray = (arr = []) =>
  Array.isArray(arr)
    ? [...new Set(arr.map(normalizeSkill).filter(Boolean))]
    : [];

/* ──────────────────────────────────────────────
   CORE MATCH CALCULATION
   (Rule-based, ML-ready)
─────────────────────────────────────────────── */
function calculateJobMatch({
  userSkills = [],
  requiredSkills = [],
  optionalSkills = [],
}) {
  const uSkills = normalizeArray(userSkills);
  const rSkills = normalizeArray(requiredSkills);
  const oSkills = normalizeArray(optionalSkills);

  /* ───── SAFETY ───── */
  if (rSkills.length === 0) {
    return {
      matchScore: 0,
      matchedSkills: [],
      missingSkills: [],
      optionalMatched: [],
      breakdown: {
        requiredScore: 0,
        optionalScore: 0,
      },
      explanation: "Job has no required skills defined",
    };
  }

  /* ───── REQUIRED SKILLS (80%) ───── */
  const matchedRequired = rSkills.filter((s) =>
    uSkills.includes(s)
  );

  const missingRequired = rSkills.filter(
    (s) => !uSkills.includes(s)
  );

  const requiredScore =
    (matchedRequired.length / rSkills.length) * 80;

  /* ───── OPTIONAL SKILLS (20%) ───── */
  const matchedOptional = oSkills.filter((s) =>
    uSkills.includes(s)
  );

  const optionalScore =
    oSkills.length > 0
      ? (matchedOptional.length / oSkills.length) * 20
      : 0;

  /* ───── FINAL SCORE ───── */
  const matchScore = Math.round(
    Math.min(requiredScore + optionalScore, 100)
  );

  /* ───── HUMAN READABLE EXPLANATION ───── */
  let explanation = "";

  if (matchScore >= 85) {
    explanation = "Excellent match based on your skills";
  } else if (matchScore >= 65) {
    explanation = "Good match, a few skills can be improved";
  } else if (matchScore >= 40) {
    explanation = "Partial match, consider improving key skills";
  } else {
    explanation = "Low match, many required skills are missing";
  }

  return {
    matchScore,

    matchedSkills: matchedRequired,
    missingSkills: missingRequired,
    optionalMatched: matchedOptional,

    breakdown: {
      requiredScore: Math.round(requiredScore),
      optionalScore: Math.round(optionalScore),
    },

    explanation,
  };
}

/* ──────────────────────────────────────────────
   RANK JOBS FOR A USER (LIST VIEW)
─────────────────────────────────────────────── */
function rankJobsForUser(jobs = [], userSkills = []) {
  if (!Array.isArray(jobs) || !Array.isArray(userSkills)) {
    return [];
  }

  return jobs
    .map((job) => {
      const recommendation = calculateJobMatch({
        userSkills,
        requiredSkills: job.requiredSkills || [],
        optionalSkills: job.optionalSkills || [],
      });

      /* ⚠️ IMPORTANT:
         job may be a mongoose document
         convert safely if needed
      */
      const plainJob =
        typeof job.toObject === "function"
          ? job.toObject()
          : job;

      return {
        ...plainJob,
        recommendation,
      };
    })
    .sort(
      (a, b) =>
        b.recommendation.matchScore -
        a.recommendation.matchScore
    );
}

module.exports = {
  calculateJobMatch,
  rankJobsForUser,
};
