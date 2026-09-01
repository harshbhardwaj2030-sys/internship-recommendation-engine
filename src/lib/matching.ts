import { Internship, User } from "@prisma/client";

export interface MatchBreakdown {
  skillsScore: number; // 0-40
  domainScore: number; // 0-30
  preferenceScore: number; // 0-30
  totalScore: number; // 0-100
  matchedSkills: string[];
  missingSkills: string[];
}

const norm = (s: string) => s.trim().toLowerCase();

/**
 * Skills Overlap (40%): fraction of the internship's required skills the
 * candidate already has, scaled to 40 points.
 */
function scoreSkills(userSkills: string[], requiredSkills: string[]) {
  const userSet = new Set(userSkills.map(norm));
  if (requiredSkills.length === 0) {
    return { score: 40, matched: [] as string[], missing: [] as string[] };
  }

  const matched: string[] = [];
  const missing: string[] = [];
  for (const skill of requiredSkills) {
    if (userSet.has(norm(skill))) matched.push(skill);
    else missing.push(skill);
  }

  const fraction = matched.length / requiredSkills.length;
  return { score: Math.round(fraction * 40), matched, missing };
}

/**
 * Domain Fit (30%): does the role's domain appear in the candidate's
 * declared domain interests?
 */
function scoreDomain(domainInterests: string[], roleDomain: string) {
  if (domainInterests.length === 0) return 15; // neutral score if no preference set
  const interested = domainInterests.some((d) => norm(d) === norm(roleDomain));
  return interested ? 30 : 0;
}

/**
 * Preference Alignment (30%): split evenly between location-type match (15)
 * and stipend meeting the candidate's target baseline (15).
 */
function scorePreference(
  locationPreference: string | null | undefined,
  targetStipend: number | null | undefined,
  internshipLocation: string,
  internshipStipend: number
) {
  let score = 0;

  // Location: exact match gets full points; REMOTE roles are also a partial
  // fit for anyone since they impose no relocation cost.
  if (!locationPreference) {
    score += 7.5;
  } else if (norm(locationPreference) === norm(internshipLocation)) {
    score += 15;
  } else if (norm(internshipLocation) === "remote") {
    score += 10;
  }

  // Stipend: full points if the role meets or exceeds the target; partial
  // credit scaled by how close it comes otherwise.
  if (!targetStipend || targetStipend <= 0) {
    score += 15;
  } else if (internshipStipend >= targetStipend) {
    score += 15;
  } else {
    const ratio = Math.max(0, internshipStipend / targetStipend);
    score += Math.round(ratio * 15);
  }

  return Math.min(30, score);
}

export function calculateMatchScore(
  user: Pick<User, "skills" | "domainInterests" | "locationPreference" | "targetStipend">,
  internship: Pick<
    Internship,
    "requiredSkills" | "domain" | "locationType" | "stipendAmount"
  >
): MatchBreakdown {
  const skills = scoreSkills(user.skills, internship.requiredSkills);
  const domainScore = scoreDomain(user.domainInterests, internship.domain);
  const preferenceScore = scorePreference(
    user.locationPreference,
    user.targetStipend,
    internship.locationType,
    internship.stipendAmount
  );

  const totalScore = Math.min(
    100,
    Math.round(skills.score + domainScore + preferenceScore)
  );

  return {
    skillsScore: skills.score,
    domainScore,
    preferenceScore,
    totalScore,
    matchedSkills: skills.matched,
    missingSkills: skills.missing,
  };
}
