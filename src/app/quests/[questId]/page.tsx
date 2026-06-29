import { notFound } from "next/navigation";
import { DifficultyBadge } from "@/components/ui/DifficultyBadge";
import { QuestAnswerForm } from "@/components/quests/QuestAnswerForm";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { PublicQuest } from "@/types/quest";

export const dynamic = "force-dynamic";

type QuestPageProps = {
  params: Promise<{ questId: string }>;
};

export default async function QuestPage({ params }: QuestPageProps) {
  const user = await requireUser();
  const { questId } = await params;

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
      },
      progresses: {
        where: { userId: user.id },
        select: {
          status: true,
          attempts: true,
          bestScore: true
        }
      }
    }
  });

  if (!quest) {
    notFound();
  }

  const publicQuest: PublicQuest = {
    id: quest.id,
    title: quest.title,
    slug: quest.slug,
    description: quest.description,
    content: quest.content,
    explanation: quest.explanation,
    type: quest.type,
    difficulty: quest.difficulty,
    xpReward: quest.xpReward,
    starterCode: quest.starterCode,
    choices: quest.choices,
    category: {
      id: quest.category.id,
      name: quest.category.name,
      slug: quest.category.slug,
      accentColor: quest.category.accentColor
    }
  };

  const progress = quest.progresses[0];

  return (
    <div className="grid gap-6 lg:grid-cols-[0.72fr_0.28fr]">
      <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className="rounded-full px-3 py-1 text-xs font-bold text-white"
            style={{ backgroundColor: quest.category.accentColor }}
          >
            {quest.category.name}
          </span>
          <DifficultyBadge difficulty={quest.difficulty} />
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800">
            {quest.xpReward} XP
          </span>
        </div>

        <h1 className="mt-5 text-3xl font-black text-ink">{quest.title}</h1>
        <p className="mt-3 text-sm leading-6 text-stone-600">{quest.description}</p>

        <div className="mt-6 rounded-lg bg-stone-50 p-5">
          <p className="text-sm font-bold text-stone-700">問題</p>
          <p className="mt-2 whitespace-pre-wrap leading-7 text-stone-800">{quest.content}</p>
        </div>

        <div className="mt-6">
          <QuestAnswerForm quest={publicQuest} />
        </div>
      </section>

      <aside className="space-y-4">
        <article className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-ink">Your progress</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-stone-500">Status</dt>
              <dd className="font-semibold text-ink">{progress?.status ?? "NOT_STARTED"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-stone-500">Attempts</dt>
              <dd className="font-semibold text-ink">{progress?.attempts ?? 0}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-stone-500">Best score</dt>
              <dd className="font-semibold text-ink">{progress?.bestScore ?? 0}</dd>
            </div>
          </dl>
        </article>

        {quest.starterCode && (
          <article className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
            <h2 className="font-bold text-ink">Starter code</h2>
            <pre className="mt-3 overflow-x-auto rounded-md bg-slate-950 p-4 text-xs leading-6 text-slate-100">
              <code>{quest.starterCode}</code>
            </pre>
          </article>
        )}
      </aside>
    </div>
  );
}
