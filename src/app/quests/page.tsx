import Link from "next/link";
import { QuestCard } from "@/components/quests/QuestCard";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type QuestsPageProps = {
  searchParams: Promise<{
    category?: string;
    difficulty?: string;
    status?: string;
  }>;
};

const difficultyOptions = ["BEGINNER", "NORMAL", "HARD", "BOSS"];

export default async function QuestsPage({ searchParams }: QuestsPageProps) {
  const user = await requireUser();
  const search = await searchParams;

  const [categories, quests] = await Promise.all([
    prisma.category.findMany({ orderBy: { order: "asc" } }),
    prisma.quest.findMany({
      where: {
        isPublished: true,
        ...(search.category ? { category: { slug: search.category } } : {}),
        ...(search.difficulty && difficultyOptions.includes(search.difficulty)
          ? { difficulty: search.difficulty as "BEGINNER" | "NORMAL" | "HARD" | "BOSS" }
          : {})
      },
      include: {
        category: true,
        progresses: {
          where: { userId: user.id },
          select: { status: true }
        }
      },
      orderBy: [{ category: { order: "asc" } }, { sortOrder: "asc" }, { createdAt: "asc" }]
    })
  ]);

  const filteredQuests = search.status
    ? quests.filter((quest) => (quest.progresses[0]?.status ?? "NOT_STARTED") === search.status)
    : quests;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-ink">クエスト一覧</h1>
        <p className="mt-2 text-stone-600">カテゴリ、難易度、進捗で絞り込めます。</p>
      </div>

      <div className="flex flex-wrap gap-2 rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
        <Link className="rounded-md bg-stone-100 px-3 py-2 text-sm font-semibold" href="/quests">
          All
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            className="rounded-md px-3 py-2 text-sm font-semibold hover:bg-stone-100"
            href={`/quests?category=${category.slug}`}
          >
            {category.name}
          </Link>
        ))}
        {difficultyOptions.map((difficulty) => (
          <Link
            key={difficulty}
            className="rounded-md px-3 py-2 text-sm font-semibold hover:bg-stone-100"
            href={`/quests?difficulty=${difficulty}`}
          >
            {difficulty}
          </Link>
        ))}
        <Link className="rounded-md px-3 py-2 text-sm font-semibold hover:bg-stone-100" href="/quests?status=COMPLETED">
          Completed
        </Link>
        <Link className="rounded-md px-3 py-2 text-sm font-semibold hover:bg-stone-100" href="/quests?status=NOT_STARTED">
          Not started
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredQuests.map((quest) => (
          <QuestCard key={quest.id} quest={quest} />
        ))}
      </div>
    </div>
  );
}
