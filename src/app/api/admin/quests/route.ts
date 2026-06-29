import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { adminQuestSchema } from "@/lib/validations";

export async function POST(request: Request) {
  await requireAdmin();

  const body = await request.json();
  const parsed = adminQuestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "入力内容を確認してください。" }, { status: 400 });
  }

  if (parsed.data.type === "MULTIPLE_CHOICE") {
    const correctCount = parsed.data.choices.filter((choice) => choice.isCorrect).length;

    if (parsed.data.choices.length < 2 || correctCount !== 1) {
      return NextResponse.json({ error: "選択式問題は選択肢2つ以上、正解1つが必要です。" }, { status: 400 });
    }
  }

  const quest = await prisma.quest.create({
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

  return NextResponse.json({ quest }, { status: 201 });
}
