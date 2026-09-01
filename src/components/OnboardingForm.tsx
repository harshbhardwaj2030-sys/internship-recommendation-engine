"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const EDUCATION_LEVELS = [
  { value: "FRESHMAN", label: "Freshman" },
  { value: "SOPHOMORE", label: "Sophomore" },
  { value: "JUNIOR", label: "Junior" },
  { value: "SENIOR", label: "Senior" },
  { value: "POST_GRAD", label: "Post-grad" },
];

const LOCATION_TYPES = [
  { value: "REMOTE", label: "Remote" },
  { value: "HYBRID", label: "Hybrid" },
  { value: "ONSITE", label: "Onsite" },
];

const DOMAINS = [
  "Software Engineering",
  "Data Science",
  "Marketing",
  "Design",
];

const STEP_LABELS = ["Background", "Skills", "Interests", "Preferences"];

export function OnboardingForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const [major, setMajor] = useState("");
  const [educationLevel, setEducationLevel] = useState("JUNIOR");
  const [skillsInput, setSkillsInput] = useState("");
  const [domainInterests, setDomainInterests] = useState<string[]>([]);
  const [locationPreference, setLocationPreference] = useState("HYBRID");
  const [targetStipend, setTargetStipend] = useState("");
  const [portfolioInput, setPortfolioInput] = useState("");

  const skills = skillsInput
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  function toggleDomain(domain: string) {
    setDomainInterests((prev) =>
      prev.includes(domain) ? prev.filter((d) => d !== domain) : [...prev, domain]
    );
  }

  async function handleFinish() {
    setSubmitting(true);
    const portfolioLinks = portfolioInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        major,
        educationLevel,
        skills,
        domainInterests,
        locationPreference,
        targetStipend: targetStipend ? Number(targetStipend) : null,
        portfolioLinks,
      }),
    });

    setSubmitting(false);
    router.push("/dashboard");
  }

  return (
    <Card className="mx-auto max-w-xl">
      <CardHeader>
        <div className="mb-1 flex gap-2">
          {STEP_LABELS.map((label, i) => (
            <div
              key={label}
              className={cn(
                "h-1.5 flex-1 rounded-full",
                i <= step ? "bg-primary" : "bg-secondary"
              )}
            />
          ))}
        </div>
        <CardTitle>{STEP_LABELS[step]}</CardTitle>
        <CardDescription>Step {step + 1} of {STEP_LABELS.length}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {step === 0 && (
          <>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="major">Major / field of study</Label>
              <Input
                id="major"
                placeholder="Computer Science"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Education level</Label>
              <div className="flex flex-wrap gap-2">
                {EDUCATION_LEVELS.map((level) => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => setEducationLevel(level.value)}
                    className={cn(
                      "rounded-full border border-border px-3 py-1.5 text-sm",
                      educationLevel === level.value && "border-primary bg-primary/10 text-primary"
                    )}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="skills">Your skills</Label>
            <Input
              id="skills"
              placeholder="Python, React, SQL, Figma"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Separate each skill with a comma.</p>
            {skills.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1.5">
                {skills.map((s) => (
                  <span key={s} className="rounded-full bg-secondary px-2.5 py-1 text-xs">
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-1.5">
            <Label>Domains you're interested in</Label>
            <div className="flex flex-wrap gap-2">
              {DOMAINS.map((domain) => (
                <button
                  key={domain}
                  type="button"
                  onClick={() => toggleDomain(domain)}
                  className={cn(
                    "rounded-full border border-border px-3 py-1.5 text-sm",
                    domainInterests.includes(domain) && "border-primary bg-primary/10 text-primary"
                  )}
                >
                  {domain}
                </button>
              ))}
            </div>
            <div className="mt-4 flex flex-col gap-1.5">
              <Label htmlFor="portfolio">Portfolio links (optional)</Label>
              <Input
                id="portfolio"
                placeholder="github.com/you, yourportfolio.com"
                value={portfolioInput}
                onChange={(e) => setPortfolioInput(e.target.value)}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <>
            <div className="flex flex-col gap-1.5">
              <Label>Location preference</Label>
              <div className="flex flex-wrap gap-2">
                {LOCATION_TYPES.map((loc) => (
                  <button
                    key={loc.value}
                    type="button"
                    onClick={() => setLocationPreference(loc.value)}
                    className={cn(
                      "rounded-full border border-border px-3 py-1.5 text-sm",
                      locationPreference === loc.value && "border-primary bg-primary/10 text-primary"
                    )}
                  >
                    {loc.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="stipend">Target monthly stipend ($)</Label>
              <Input
                id="stipend"
                type="number"
                placeholder="2000"
                value={targetStipend}
                onChange={(e) => setTargetStipend(e.target.value)}
              />
            </div>
          </>
        )}

        <div className="mt-2 flex justify-between">
          <Button
            variant="outline"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            Back
          </Button>
          {step < STEP_LABELS.length - 1 ? (
            <Button onClick={() => setStep((s) => s + 1)}>Continue</Button>
          ) : (
            <Button onClick={handleFinish} disabled={submitting}>
              {submitting ? "Saving…" : "See my matches"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
