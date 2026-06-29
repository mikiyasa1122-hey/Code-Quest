import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
  }

  const badges = await prisma.badge.findMany({
    orderBy: { order: "asc" },
    include: {
      users: {
        where: { userId: user.id },
        select: { earnedAt: true }
      }
    }
  });

  return NextResponse.json({ badges });
}
