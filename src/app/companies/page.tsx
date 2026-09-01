"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { CompanyCard, CompanyData } from "@/components/CompanyCard";
import { EmptyState } from "@/components/EmptyState";
import { cn } from "@/lib/utils";

const TIERS = [
  { value: "", label: "All" },
  { value: "STARTUP", label: "Startup" },
  { value: "MID_MARKET", label: "Mid-market" },
  { value: "ENTERPRISE", label: "Enterprise" },
  { value: "BIG_TECH", label: "Big tech" },
];

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [query, setQuery] = useState("");
  const [tier, setTier] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (tier) params.set("tier", tier);

    setLoading(true);
    const timeout = setTimeout(() => {
      fetch(`/api/companies?${params.toString()}`)
        .then((res) => res.json())
        .then((data) => setCompanies(data.companies ?? []))
        .finally(() => setLoading(false));
    }, 250);

    return () => clearTimeout(timeout);
  }, [query, tier]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-display text-2xl font-semibold">Company directory</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Browse every partner company and see what they're hiring for.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          placeholder="Search companies or industries…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="sm:max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          {TIERS.map((t) => (
            <button
              key={t.value}
              onClick={() => setTier(t.value)}
              className={cn(
                "rounded-full border border-border px-3 py-1.5 text-sm",
                tier === t.value && "border-primary bg-primary/10 text-primary"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading companies…</p>
        ) : companies.length === 0 ? (
          <EmptyState
            title="No companies match your search"
            body="Try a different keyword or clear the tier filter."
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {companies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
