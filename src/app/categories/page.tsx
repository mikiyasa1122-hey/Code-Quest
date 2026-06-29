import { CategoryCard } from "@/components/categories/CategoryCard";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const user = await requireUser();

  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: {
      _count: {
        select: { quests: true }
      }
    }
  });

  const completedByCategory = await prisma.userProgress.groupBy({
    by: ["questId"],
    where: {
      userId: user.id,
      status: "COMPLETED"
    },
    _count: true
  });

  const completedQuestIds = completedByCategory.map((progress) => progress.questId);
  const completedQuests = await prisma.quest.findMany({
    where: {
      id: { in: completedQuestIds }
    },
    select: {
      categoryId: true
    }
  });

  const completedCounts = completedQuests.reduce<Record<string, number>>((counts, quest) => {
    counts[quest.categoryId] = (counts[quest.categoryId] ?? 0) + 1;
    return counts;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-ink">学習カテゴリ</h1>
        <p className="mt-2 text-stone-600">得意分野も苦手分野も、カテゴリごとに進められます。</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} completedCount={completedCounts[category.id] ?? 0} />
        ))}
      </div>
    </div>
  );
}
