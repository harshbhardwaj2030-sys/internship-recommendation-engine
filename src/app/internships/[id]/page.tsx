import Image from "next/image";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateMatchScore } from "@/lib/matching";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default async function InternshipDetailPage({ params }: { params: { id: string } }) {
  const internship = await prisma.internship.findUnique({
    where: { id: params.id },
    include: { company: true },
  });
  if (!internship) notFound();

  const session = await getServerSession(authOptions);
  let match = null;
  if (session?.user) {
    const userId = (session.user as { id: string }).id;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user) match = calculateMatchScore(user, internship);
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="flex items-start gap-4">
        {internship.company.logoUrl && (
          <Image
            src={internship.company.logoUrl}
            alt=""
            width={56}
            height={56}
            className="rounded-xl border border-border"
          />
        )}
        <div>
          <h1 className="font-display text-2xl font-semibold">{internship.roleTitle}</h1>
          <p className="text-muted-foreground">
            {internship.company.companyName} · {internship.company.headquartersLocation}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Badge variant="secondary">{internship.domain}</Badge>
        <Badge variant="secondary">{internship.locationType}</Badge>
        <Badge variant="secondary">${internship.stipendAmount.toLocaleString()}/mo</Badge>
        <Badge variant="secondary">{internship.durationWeeks} weeks</Badge>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <h2 className="font-display text-lg font-semibold">About the role</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {internship.description}
          </p>

          <h2 className="mt-8 font-display text-lg font-semibold">Required skills</h2>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {internship.requiredSkills.map((skill) => (
              <Badge
                key={skill}
                variant={match?.matchedSkills.includes(skill) ? "success" : "outline"}
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {match && (
          <Card className="h-fit">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="font-display text-sm font-semibold">Why you're a match</p>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-display text-sm font-semibold text-primary">
                  {match.totalScore}%
                </div>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Skills overlap</span>
                  <span className="font-medium">{match.skillsScore} / 40</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Domain fit</span>
                  <span className="font-medium">{match.domainScore} / 30</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Preference alignment</span>
                  <span className="font-medium">{match.preferenceScore} / 30</span>
                </div>
              </div>

              {match.missingSkills.length > 0 && (
                <div className="mt-5 border-t border-border pt-4">
                  <p className="text-sm font-medium">Skill gaps</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Learn these to raise your match score:
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {match.missingSkills.map((skill) => (
                      <Badge key={skill} variant="warning">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
