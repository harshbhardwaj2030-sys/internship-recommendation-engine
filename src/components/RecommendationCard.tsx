import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface RecommendationData {
  id: string;
  roleTitle: string;
  domain: string;
  locationType: string;
  stipendAmount: number;
  durationWeeks: number;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  company: { id: string; name: string; logoUrl: string | null; tier: string };
}

function scoreTone(score: number) {
  if (score >= 80) return "text-emerald-600 bg-emerald-50";
  if (score >= 55) return "text-primary bg-primary/10";
  return "text-amber-700 bg-amber-50";
}

export function RecommendationCard({ rec }: { rec: RecommendationData }) {
  return (
    <Link href={`/internships/${rec.id}`}>
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardContent className="flex h-full flex-col p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              {rec.company.logoUrl && (
                <Image
                  src={rec.company.logoUrl}
                  alt=""
                  width={40}
                  height={40}
                  className="rounded-lg border border-border"
                />
              )}
              <div>
                <p className="font-display text-base font-semibold leading-tight">
                  {rec.roleTitle}
                </p>
                <p className="text-sm text-muted-foreground">{rec.company.name}</p>
              </div>
            </div>
            <div
              className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-display text-sm font-semibold",
                scoreTone(rec.matchScore)
              )}
            >
              {rec.matchScore}%
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            <Badge variant="secondary">{rec.locationType}</Badge>
            <Badge variant="secondary">${rec.stipendAmount.toLocaleString()}/mo</Badge>
            <Badge variant="secondary">{rec.durationWeeks} weeks</Badge>
          </div>

          <div className="mt-4 flex-1 text-sm text-muted-foreground">
            {rec.matchedSkills.length > 0 ? (
              <p>
                Matches on {rec.matchedSkills.slice(0, 3).join(", ")}
                {rec.matchedSkills.length > 3 ? ` +${rec.matchedSkills.length - 3} more` : ""}
              </p>
            ) : (
              <p>No skill overlap yet — see the skill gap breakdown.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
