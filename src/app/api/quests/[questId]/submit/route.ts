import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { awardEarnedBadges } from "@/lib/badges";
import { prisma } from "@/lib/prisma";
import { evaluateQuestAnswer } from "@/lib/scoring";
import { touchLearningStreak } from "@/lib/streak";
import { questSubmissionSchema } from "@/lib/validations";
import { calculateLevel, getTitleForLevel } from "@/lib/xp";

type RouteContext = {
  params: Promise<{ questId: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = questSubmissionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "回答の形式が正しくありません。" }, { status: 400 });
  }

  const { questId } = await context.params;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const quest = await tx.quest.findFirst({
        where: {
          id: questId,
          isPublished: true
        },
        include: {
          choices: true
        }
      });

      if (!quest) {
        throw new Error("QUEST_NOT_FOUND");
      }

      const existingProgress = await tx.userProgress.findUnique({
        where: {
          userId_questId: {
            userId: user.id,
            questId
          }
        }
      });

      const evaluation = evaluateQuestAnswer(quest, parsed.data);
      const alreadyCompleted = existingProgress?.status === "COMPLETED";
      const now = new Date();
      const xpEarned = evaluation.isCorrect && !alreadyCompleted ? quest.xpReward : 0;
      const nextStatus = evaluation.isCorrect ? "COMPLETED" : existingProgress?.status ?? "IN_PROGRESS";
      const nextCompletedAt = evaluation.isCorrect ? existingProgress?.completedAt ?? now : existingProgress?.completedAt;

      await tx.submission.create({
        data: {
          userId: user.id,
          questId,
          answer: parsed.data.choiceId ?? parsed.data.answer,
          isCorrect: evaluation.isCorrect,
          score: evaluation.score,
          xpEarned,
          feedback: evaluation.feedback
        }
      });

      await tx.userProgress.upsert({
        where: {
          userId_questId: {
            userId: user.id,
            questId
          }
        },
        create: {
          userId: user.id,
          questId,
          status: nextStatus,
          attempts: 1,
          bestScore: evaluation.score,
          completedAt: nextCompletedAt
        },
        update: {
          status: nextStatus,
          attempts: { increment: 1 },
          bestScore: Math.max(existingProgress?.bestScore ?? 0, evaluation.score),
          completedAt: nextCompletedAt
        }
      });

      const currentUser = await tx.user.findUniqueOrThrow({
        where: { id: user.id },
        select: {
          xp: true,
          totalCorrect: true
        }
      });

      const nextXp = currentUser.xp + xpEarned;
      const nextTotalCorrect = currentUser.totalCorrect + (evaluation.isCorrect && !alreadyCompleted ? 1 : 0);
      const nextLevel = calculateLevel(nextXp);
      const nextTitle = getTitleForLevel(nextLevel, nextTotalCorrect);

      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          xp: nextXp,
          totalCorrect: nextTotalCorrect,
          level: nextLevel,
          title: nextTitle
        },
        select: {
          level: true,
          title: true
        }
      });

      if (xpEarned > 0) {
        await tx.xpLog.create({
          data: {
            userId: user.id,
            amount: xpEarned,
            reason: `Quest clear: ${quest.title}`
          }
        });
      }

      await touchLearningStreak(tx, user.id);
      const earnedBadges = await awardEarnedBadges(tx, user.id);

      return {
        isCorrect: evaluation.isCorrect,
        score: evaluation.score,
        xpEarned,
        feedback: evaluation.feedback,
        explanation: quest.explanation,
        level: updatedUser.level,
        title: updatedUser.title,
        earnedBadges
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error && error.message === "QUEST_NOT_FOUND") {
      return NextResponse.json({ error: "クエストが見つかりません。" }, { status: 404 });
    }

    return NextResponse.json({ error: "回答の保存中にエラーが発生しました。" }, { status: 500 });
  }
}
