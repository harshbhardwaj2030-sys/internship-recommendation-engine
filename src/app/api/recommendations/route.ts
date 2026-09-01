import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateMatchScore } from "@/lib/matching";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get("limit") ?? 20);
  const domainFilter = searchParams.get("domain");

  const userId = (session.user as { id: string }).id;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const internships = await prisma.internship.findMany({
    where: {
      status: "ACTIVE",
      ...(domainFilter ? { domain: domainFilter } : {}),
    },
    include: { company: true },
  });

  const ranked = internships
    .map((internship) => {
      const match = calculateMatchScore(user, internship);
      return { internship, match };
    })
    .sort((a, b) => b.match.totalScore - a.match.totalScore)
    .slice(0, limit);

  const results = ranked.map(({ internship, match }) => ({
    id: internship.id,
    roleTitle: internship.roleTitle,
    domain: internship.domain,
    locationType: internship.locationType,
    stipendAmount: internship.stipendAmount,
    durationWeeks: internship.durationWeeks,
    description: internship.description,
    company: {
      id: internship.company.id,
      name: internship.company.companyName,
      logoUrl: internship.company.logoUrl,
      tier: internship.company.companyTier,
    },
    matchScore: match.totalScore,
    breakdown: {
      skills: match.skillsScore,
      domain: match.domainScore,
      preference: match.preferenceScore,
    },
    matchedSkills: match.matchedSkills,
    missingSkills: match.missingSkills,
  }));

  return NextResponse.json({
    hasProfile: user.onboardingComplete,
    count: results.length,
    recommendations: results,
  });
}
