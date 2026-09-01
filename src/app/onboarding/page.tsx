import { OnboardingForm } from "@/components/OnboardingForm";

export default function OnboardingPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="mb-8 text-center font-display text-2xl font-semibold">
        Let's build your profile
      </h1>
      <OnboardingForm />
    </div>
  );
}
