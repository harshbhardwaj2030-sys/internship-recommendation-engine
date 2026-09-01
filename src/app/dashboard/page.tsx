import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateMatchScore } from "@/lib/matching";
import { RecommendationCard, RecommendationData } from "@/components/RecommendationCard";
import { EmptyState } from "@/components/EmptyState";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const userId = (session.user as { id: string }).id;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) redirect("/login");

  if (!user.onboardingComplete) redirect("/onboarding");

  const internships = await prisma.internship.findMany({
    where: { status: "ACTIVE" },
    include: { company: true },
  });

  const recommendations: RecommendationData[] = internships
    .map((internship) => {
      const match = calculateMatchScore(user, internship);
      return {
        id: internship.id,
        roleTitle: internship.roleTitle,
        domain: internship.domain,
        locationType: internship.locationType,
        stipendAmount: internship.stipendAmount,
        durationWeeks: internship.durationWeeks,
        matchScore: match.totalScore,
        matchedSkills: match.matchedSkills,
        missingSkills: match.missingSkills,
        company: {
          id: internship.company.id,
          name: internship.company.companyName,
          logoUrl: internship.company.logoUrl,
          tier: internship.company.companyTier,
        },
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);

  const hasAnySkills = user.skills.length > 0;

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Recommended for you</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ranked by match score across skills, domain, and preferences.
          </p>
        </div>
      </div>

      {!hasAnySkills ? (
        <EmptyState
          title="Add a few skills to unlock matches"
          body="Your match scores depend on the skills and interests in your profile. Add some and we'll re-rank every internship instantly."
          ctaLabel="Update your profile"
          ctaHref="/onboarding"
        />
      ) : recommendations.length === 0 ? (
        <EmptyState
          title="No active internships right now"
          body="Check back soon — new roles are added regularly."
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {recommendations.map((rec) => (
            <RecommendationCard key={rec.id} rec={rec} />
          ))}
        </div>
      )}
    </div>
  );
}
