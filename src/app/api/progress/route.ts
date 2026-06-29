import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
  }

  const progresses = await prisma.userProgress.findMany({
    where: { userId: user.id },
    include: {
      quest: {
        include: { category: true }
      }
    },
    orderBy: { updatedAt: "desc" }
  });

  return NextResponse.json({ progresses });
}
