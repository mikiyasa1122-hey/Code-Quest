import { NextResponse } from "next/server";
import type { Difficulty } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const difficulties = ["BEGINNER", "NORMAL", "HARD", "BOSS"] as const;

function isDifficulty(value: string | null): value is Difficulty {
  return Boolean(value && difficulties.includes(value as Difficulty));
}

export async function GET(request: Request) {
  const user = await getCurrentUser();
  const url = new URL(request.url);
  const categorySlug = url.searchParams.get("category");
  const difficulty = url.searchParams.get("difficulty");
  const status = url.searchParams.get("status");

  const quests = await prisma.quest.findMany({
    where: {
      isPublished: true,
      ...(categorySlug ? { category: { slug: categorySlug } } : {}),
      ...(isDifficulty(difficulty) ? { difficulty } : {})
    },
    include: {
      category: true,
      ...(user
        ? {
            progresses: {
              where: { userId: user.id },
              select: { status: true }
            }
          }
        : {})
    },
    orderBy: [{ category: { order: "asc" } }, { sortOrder: "asc" }, { createdAt: "asc" }]
  });

  const filteredQuests =
    user && status
      ? quests.filter((quest) => {
          const progressStatus = quest.progresses[0]?.status ?? "NOT_STARTED";
          return progressStatus === status;
        })
      : quests;

  return NextResponse.json({ quests: filteredQuests });
}
