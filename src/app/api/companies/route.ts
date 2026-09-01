import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  const tier = searchParams.get("tier");
  const industry = searchParams.get("industry");

  const companies = await prisma.company.findMany({
    where: {
      ...(q
        ? {
            OR: [
              { companyName: { contains: q, mode: "insensitive" } },
              { industry: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(tier ? { companyTier: tier as any } : {}),
      ...(industry ? { industry } : {}),
    },
    include: {
      _count: { select: { internships: { where: { status: "ACTIVE" } } } },
    },
    orderBy: { companyName: "asc" },
  });

  return NextResponse.json({ companies });
}
