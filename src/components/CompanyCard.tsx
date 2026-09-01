import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const TIER_LABELS: Record<string, string> = {
  STARTUP: "Startup",
  MID_MARKET: "Mid-market",
  ENTERPRISE: "Enterprise",
  BIG_TECH: "Big tech",
};

export interface CompanyData {
  id: string;
  companyName: string;
  logoUrl: string | null;
  industry: string;
  companyTier: string;
  headquartersLocation: string;
  cultureTags: string[];
  _count?: { internships: number };
}

export function CompanyCard({ company }: { company: CompanyData }) {
  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col p-5">
        <div className="flex items-center gap-3">
          {company.logoUrl && (
            <Image
              src={company.logoUrl}
              alt=""
              width={44}
              height={44}
              className="rounded-lg border border-border"
            />
          )}
          <div>
            <p className="font-display text-base font-semibold leading-tight">
              {company.companyName}
            </p>
            <p className="text-sm text-muted-foreground">{company.industry}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          <Badge variant="outline">{TIER_LABELS[company.companyTier] ?? company.companyTier}</Badge>
          <Badge variant="outline">{company.headquartersLocation}</Badge>
        </div>

        <div className="mt-4 flex flex-1 flex-wrap gap-1.5">
          {company.cultureTags.map((tag) => (
            <span key={tag} className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">
              {tag}
            </span>
          ))}
        </div>

        {typeof company._count?.internships === "number" && (
          <p className="mt-4 text-xs text-muted-foreground">
            {company._count.internships} active opening
            {company._count.internships === 1 ? "" : "s"}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
