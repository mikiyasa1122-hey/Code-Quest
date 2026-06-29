import type { Difficulty } from "@prisma/client";

const LEVEL_UNIT_XP = 120;

export function calculateLevel(xp: number): number {
  return Math.floor(Math.sqrt(Math.max(xp, 0) / LEVEL_UNIT_XP)) + 1;
}

export function getXpForNextLevel(level: number): number {
  return level * level * LEVEL_UNIT_XP;
}

export function getLevelProgress(xp: number, level: number) {
  const currentLevelStart = (level - 1) * (level - 1) * LEVEL_UNIT_XP;
  const nextLevelStart = getXpForNextLevel(level);
  const earnedInLevel = xp - currentLevelStart;
  const neededInLevel = nextLevelStart - currentLevelStart;

  return {
    currentLevelStart,
    nextLevelStart,
    percent: Math.min(100, Math.round((earnedInLevel / neededInLevel) * 100))
  };
}

export function getTitleForLevel(level: number, totalCorrect: number): string {
  if (totalCorrect >= 50) {
    return "Code Quest Master";
  }

  if (level >= 15) {
    return "Full-stack Hero";
  }

  if (level >= 10) {
    return "TypeScript Knight";
  }

  if (level >= 6) {
    return "React Explorer";
  }

  if (level >= 3) {
    return "JavaScript Adventurer";
  }

  return "Novice Adventurer";
}

export function getDifficultyLabel(difficulty: Difficulty): string {
  const labels: Record<Difficulty, string> = {
    BEGINNER: "Beginner",
    NORMAL: "Normal",
    HARD: "Hard",
    BOSS: "Boss"
  };

  return labels[difficulty];
}

export function getDifficultyTone(difficulty: Difficulty): string {
  const tones: Record<Difficulty, string> = {
    BEGINNER: "border-emerald-200 bg-emerald-50 text-emerald-800",
    NORMAL: "border-sky-200 bg-sky-50 text-sky-800",
    HARD: "border-amber-200 bg-amber-50 text-amber-800",
    BOSS: "border-rose-200 bg-rose-50 text-rose-800"
  };

  return tones[difficulty];
}
