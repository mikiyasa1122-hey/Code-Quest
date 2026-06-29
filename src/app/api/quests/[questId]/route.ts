import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ questId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { questId } = await context.params;
  const quest = await prisma.quest.findFirst({
    where: {
      id: questId,
      isPublished: true
    },
    include: {
      category: true,
      choices: {
        orderBy: { order: "asc" },
        select: {
          id: true,
          text: true,
          order: true
        }
      }
    }
  });

  if (!quest) {
    return NextResponse.json({ error: "クエストが見つかりません。" }, { status: 404 });
  }

  return NextResponse.json({ quest });
}
