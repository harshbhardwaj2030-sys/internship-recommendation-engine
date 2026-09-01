import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    n: "1",
    title: "Tell us what you know",
    body: "Add your skills, major, and the kind of work you want to do. Takes about two minutes.",
  },
  {
    n: "2",
    title: "We score every opening",
    body: "Each active internship gets a match score out of 100, weighing your skills, your interests, and your preferences.",
  },
  {
    n: "3",
    title: "See exactly why, and what's missing",
    body: "Every recommendation shows which skills matched and which ones to learn next.",
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-16 sm:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
              Internships ranked by how well they actually fit you.
            </h1>
            <p className="mt-5 max-w-md text-lg text-muted-foreground">
              Pathway scores every open internship against your skills, your
              interests, and your preferences — so you spend your time on the
              roles worth applying to.
            </p>
            <div className="mt-8 flex gap-3">
              <Button size="lg" asChild>
                <Link href="/signup">Build your profile</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/companies">Browse companies</Link>
              </Button>
            </div>
          </div>

          <Card className="border-border/80 shadow-md">
            <CardContent className="p-6">
              <p className="text-xs font-medium text-muted-foreground">Sample match</p>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <p className="font-display text-base font-semibold">
                    Machine Learning Platform Intern
                  </p>
                  <p className="text-sm text-muted-foreground">Halcyon Systems</p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 font-display text-lg font-semibold text-primary">
                  92%
                </div>
              </div>
              <div className="mt-5 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Skills overlap</span>
                  <span className="font-medium">36 / 40</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Domain fit</span>
                  <span className="font-medium">30 / 30</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Preference alignment</span>
                  <span className="font-medium">26 / 30</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="border-t border-border bg-card/50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-display text-2xl font-semibold">How matching works</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {steps.map((step) => (
              <div key={step.n}>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {step.n}
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
