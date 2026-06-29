import { notFound } from "next/navigation";
import { AdminQuestForm } from "@/components/quests/AdminQuestForm";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type EditQuestPageProps = {
  params: Promise<{ questId: string }>;
};

export default async function EditQuestPage({ params }: EditQuestPageProps) {
  await requireAdmin();

  const { questId } = await params;
  const [categories, quest] = await Promise.all([
    prisma.category.findMany({
      orderBy: { order: "asc" },
      select: {
        id: true,
        name: true
      }
    }),
    prisma.quest.findUnique({
      where: { id: questId },
      include: {
        choices: {
          orderBy: { order: "asc" },
          select: {
            text: true,
            isCorrect: true
          }
        }
      }
    })
  ]);

  if (!quest) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-ink">問題編集</h1>
        <p className="mt-2 text-stone-600">{quest.title}</p>
      </div>
      <AdminQuestForm categories={categories} initialQuest={quest} />
    </div>
  );
}
