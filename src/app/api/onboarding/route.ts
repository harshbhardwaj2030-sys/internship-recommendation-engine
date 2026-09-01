import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const body = await req.json();
  const {
    educationLevel,
    major,
    skills,
    domainInterests,
    locationPreference,
    targetStipend,
    portfolioLinks,
  } = body;

  const userId = (session.user as { id: string }).id;

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      educationLevel,
      major,
      skills: Array.isArray(skills) ? skills : [],
      domainInterests: Array.isArray(domainInterests) ? domainInterests : [],
      locationPreference,
      targetStipend: targetStipend ? Number(targetStipend) : null,
      portfolioLinks: Array.isArray(portfolioLinks) ? portfolioLinks : [],
      onboardingComplete: true,
    },
  });

  return NextResponse.json({ user: updated });
}
