import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DifficultyBadge } from "@/components/ui/DifficultyBadge";

export const dynamic = "force-dynamic";

export default async function AdminQuestsPage() {
  await requireAdmin();

  const quests = await prisma.quest.findMany({
    include: {
      category: true
    },
    orderBy: [{ createdAt: "desc" }]
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-ink">問題管理</h1>
          <p className="mt-2 text-stone-600">クエストの作成、編集、公開設定を行います。</p>
        </div>
        <Link
          href="/admin/quests/new"
          className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-700"
        >
          新規作成
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-stone-50 text-stone-600">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Difficulty</th>
              <th className="px-4 py-3">Published</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {quests.map((quest) => (
              <tr key={quest.id}>
                <td className="px-4 py-3 font-semibold text-ink">{quest.title}</td>
                <td className="px-4 py-3">{quest.category.name}</td>
                <td className="px-4 py-3">
                  <DifficultyBadge difficulty={quest.difficulty} />
                </td>
                <td className="px-4 py-3">{quest.isPublished ? "公開" : "非公開"}</td>
                <td className="px-4 py-3">
                  <Link className="font-bold text-emerald-700" href={`/admin/quests/${quest.id}/edit`}>
                    編集
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
