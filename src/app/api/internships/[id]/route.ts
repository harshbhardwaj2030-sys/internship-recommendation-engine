import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateMatchScore } from "@/lib/matching";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const internship = await prisma.internship.findUnique({
    where: { id: params.id },
    include: { company: true },
  });

  if (!internship) {
    return NextResponse.json({ error: "Internship not found." }, { status: 404 });
  }

  const session = await getServerSession(authOptions);
  let match = null;

  if (session?.user) {
    const userId = (session.user as { id: string }).id;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user) match = calculateMatchScore(user, internship);
  }

  return NextResponse.json({ internship, match });
}
