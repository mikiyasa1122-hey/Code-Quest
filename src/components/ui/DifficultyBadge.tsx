import type { Difficulty } from "@prisma/client";
import { getDifficultyLabel, getDifficultyTone } from "@/lib/xp";

type DifficultyBadgeProps = {
  difficulty: Difficulty;
};

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getDifficultyTone(difficulty)}`}>
      {getDifficultyLabel(difficulty)}
    </span>
  );
}
