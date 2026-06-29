import { notFound } from "next/navigation";
import { QuestCard } from "@/components/quests/QuestCard";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type CategoryPageProps = {
  params: Promise<{ categoryId: string }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const user = await requireUser();
  const { categoryId } = await params;

  const category = await prisma.category.findUnique({
    where: { slug: categoryId }
  });

  if (!category) {
    notFound();
  }

  const quests = await prisma.quest.findMany({
    where: {
      categoryId: category.id,
      isPublished: true
    },
    include: {
      category: true,
      progresses: {
        where: { userId: user.id },
        select: { status: true }
      }
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }]
  });

  const completedCount = quests.filter((quest) => quest.progresses[0]?.status === "COMPLETED").length;

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        <span
          className="inline-flex rounded-full px-3 py-1 text-xs font-bold text-white"
          style={{ backgroundColor: category.accentColor }}
        >
          {category.name}
        </span>
        <h1 className="mt-4 text-3xl font-black text-ink">{category.name} Quests</h1>
        <p className="mt-2 text-stone-600">{category.description}</p>
        <p className="mt-4 text-sm font-semibold text-stone-500">
          {completedCount} / {quests.length} completed
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        {quests.map((quest) => (
          <QuestCard key={quest.id} quest={quest} />
        ))}
      </div>
    </div>
  );
}
