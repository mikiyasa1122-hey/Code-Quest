import type { Badge, Prisma } from "@prisma/client";

type Tx = Prisma.TransactionClient;

async function hasCompletedCategory(tx: Tx, userId: string, categorySlug: string): Promise<boolean> {
  const totalPublished = await tx.quest.count({
    where: {
      isPublished: true,
      category: { slug: categorySlug }
    }
  });

  if (totalPublished === 0) {
    return false;
  }

  const completed = await tx.userProgress.count({
    where: {
      userId,
      status: "COMPLETED",
      quest: {
        category: { slug: categorySlug }
      }
    }
  });

  return completed >= totalPublished;
}

async function matchesBadgeRule(tx: Tx, userId: string, badge: Badge): Promise<boolean> {
  const user = await tx.user.findUnique({
    where: { id: userId },
    select: { totalCorrect: true }
  });

  if (!user) {
    return false;
  }

  if (badge.rule === "FIRST_CORRECT") {
    return user.totalCorrect >= 1;
  }

  if (badge.rule === "TEN_CORRECT") {
    return user.totalCorrect >= 10;
  }

  if (badge.rule === "FIRST_BOSS") {
    const bossClearCount = await tx.submission.count({
      where: {
        userId,
        isCorrect: true,
        quest: { difficulty: "BOSS" }
      }
    });

    return bossClearCount >= 1;
  }

  if (badge.rule === "SEVEN_DAY_STREAK") {
    const streak = await tx.streak.findUnique({
      where: { userId },
      select: { longestCount: true }
    });

    return (streak?.longestCount ?? 0) >= 7;
  }

  if (badge.rule === "CATEGORY_COMPLETE" && badge.ruleValue) {
    return hasCompletedCategory(tx, userId, badge.ruleValue);
  }

  return false;
}

export async function awardEarnedBadges(tx: Tx, userId: string): Promise<string[]> {
  const [badges, ownedBadges] = await Promise.all([
    tx.badge.findMany({ orderBy: { order: "asc" } }),
    tx.userBadge.findMany({
      where: { userId },
      select: { badgeId: true }
    })
  ]);

  const ownedBadgeIds = new Set(ownedBadges.map((badge) => badge.badgeId));
  const earnedNames: string[] = [];

  for (const badge of badges) {
    if (ownedBadgeIds.has(badge.id)) {
      continue;
    }

    if (await matchesBadgeRule(tx, userId, badge)) {
      await tx.userBadge.create({
        data: {
          userId,
          badgeId: badge.id
        }
      });

      earnedNames.push(badge.name);
    }
  }

  return earnedNames;
}
