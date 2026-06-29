import type { Prisma } from "@prisma/client";

type Tx = Prisma.TransactionClient;

export function getTokyoDateKey(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
}

function dateKeyToUtcTime(dateKey: string): number {
  const [year, month, day] = dateKey.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

function diffDays(fromDateKey: string, toDateKey: string): number {
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.round((dateKeyToUtcTime(toDateKey) - dateKeyToUtcTime(fromDateKey)) / oneDay);
}

export async function touchLearningStreak(tx: Tx, userId: string) {
  const now = new Date();
  const todayKey = getTokyoDateKey(now);
  const current = await tx.streak.findUnique({
    where: { userId }
  });

  if (!current) {
    return tx.streak.create({
      data: {
        userId,
        currentCount: 1,
        longestCount: 1,
        lastStudiedAt: now
      }
    });
  }

  if (!current.lastStudiedAt) {
    return tx.streak.update({
      where: { userId },
      data: {
        currentCount: 1,
        longestCount: Math.max(current.longestCount, 1),
        lastStudiedAt: now
      }
    });
  }

  const lastKey = getTokyoDateKey(current.lastStudiedAt);

  if (lastKey === todayKey) {
    return current;
  }

  const nextCount = diffDays(lastKey, todayKey) === 1 ? current.currentCount + 1 : 1;

  return tx.streak.update({
    where: { userId },
    data: {
      currentCount: nextCount,
      longestCount: Math.max(current.longestCount, nextCount),
      lastStudiedAt: now
    }
  });
}
