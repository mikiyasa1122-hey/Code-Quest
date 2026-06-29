import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/dashboard/StatCard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requireAdmin();

  const [users, quests, submissions, publishedQuests] = await Promise.all([
    prisma.user.count(),
    prisma.quest.count(),
    prisma.submission.count(),
    prisma.quest.count({ where: { isPublished: true } })
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-ink">管理画面</h1>
        <p className="mt-2 text-stone-600">問題作成と公開状態を管理します。</p>
      </div>
      <section className="grid gap-4 md:grid-cols-4">
        <StatCard label="Users" value={users} />
        <StatCard label="Quests" value={quests} />
        <StatCard label="Published" value={publishedQuests} />
        <StatCard label="Submissions" value={submissions} />
      </section>
      <Link
        href="/admin/quests"
        className="inline-flex rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-700"
      >
        問題を管理
      </Link>
    </div>
  );
}
