import Link from "next/link";
import type { Difficulty, ProgressStatus, QuestType } from "@prisma/client";
import { CheckCircle2, CircleDashed, Code2, ListChecks, PencilLine } from "lucide-react";
import { DifficultyBadge } from "@/components/ui/DifficultyBadge";

type QuestCardProps = {
  quest: {
    id: string;
    title: string;
    description: string;
    type: QuestType;
    difficulty: Difficulty;
    xpReward: number;
    category: {
      name: string;
      slug: string;
      accentColor: string;
    };
    progresses?: {
      status: ProgressStatus;
    }[];
  };
};

function getTypeIcon(type: QuestType) {
  if (type === "MULTIPLE_CHOICE") {
    return <ListChecks size={17} aria-hidden="true" />;
  }

  if (type === "TEXT_INPUT") {
    return <PencilLine size={17} aria-hidden="true" />;
  }

  return <Code2 size={17} aria-hidden="true" />;
}

export function QuestCard({ quest }: QuestCardProps) {
  const status = quest.progresses?.[0]?.status;
  const isCompleted = status === "COMPLETED";

  return (
    <Link
      href={`/quests/${quest.id}`}
      className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span
          className="rounded-full px-3 py-1 text-xs font-bold text-white"
          style={{ backgroundColor: quest.category.accentColor }}
        >
          {quest.category.name}
        </span>
        <DifficultyBadge difficulty={quest.difficulty} />
      </div>

      <div className="mt-4 flex items-start gap-3">
        <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-stone-100 text-stone-700">
          {getTypeIcon(quest.type)}
        </span>
        <div>
          <h2 className="text-lg font-bold text-ink">{quest.title}</h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">{quest.description}</p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-stone-100 pt-4 text-sm">
        <span className="font-semibold text-amber-700">{quest.xpReward} XP</span>
        <span className="inline-flex items-center gap-1 text-stone-500">
          {isCompleted ? (
            <>
              <CheckCircle2 size={16} className="text-emerald-600" aria-hidden="true" />
              Completed
            </>
          ) : (
            <>
              <CircleDashed size={16} aria-hidden="true" />
              Start
            </>
          )}
        </span>
      </div>
    </Link>
  );
}
