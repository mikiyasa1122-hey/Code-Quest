import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { adminQuestSchema } from "@/lib/validations";

type RouteContext = {
  params: Promise<{ questId: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  await requireAdmin();

  const { questId } = await context.params;
  const body = await request.json();
  const parsed = adminQuestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "入力内容を確認してください。" }, { status: 400 });
  }

  const quest = await prisma.$transaction(async (tx) => {
    await tx.choice.deleteMany({
      where: { questId }
    });

    return tx.quest.update({
      where: { id: questId },
      data: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        description: parsed.data.description,
        content: parsed.data.content,
        explanation: parsed.data.explanation,
        type: parsed.data.type,
        difficulty: parsed.data.difficulty,
        xpReward: parsed.data.xpReward,
        expectedAnswer: parsed.data.expectedAnswer || null,
        starterCode: parsed.data.starterCode || null,
        categoryId: parsed.data.categoryId,
        isPublished: parsed.data.isPublished,
        choices: {
          create: parsed.data.choices.map((choice, index) => ({
            text: choice.text,
            isCorrect: choice.isCorrect,
            order: index + 1
          }))
        }
      }
    });
  });

  return NextResponse.json({ quest });
}

export async function DELETE(_request: Request, context: RouteContext) {
  await requireAdmin();

  const { questId } = await context.params;

  await prisma.quest.delete({
    where: { id: questId }
  });

  return NextResponse.json({ ok: true });
}
