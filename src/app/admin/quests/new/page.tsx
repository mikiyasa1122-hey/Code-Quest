import { AdminQuestForm } from "@/components/quests/AdminQuestForm";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function NewQuestPage() {
  await requireAdmin();

  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    select: {
      id: true,
      name: true
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-ink">問題作成</h1>
        <p className="mt-2 text-stone-600">MVP用のクエストを管理画面から追加できます。</p>
      </div>
      <AdminQuestForm categories={categories} />
    </div>
  );
}
