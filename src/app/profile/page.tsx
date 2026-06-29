import { StatCard } from "@/components/dashboard/StatCard";
import { XpBar } from "@/components/dashboard/XpBar";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await requireUser();

  const [streak, submissions, completedCount, badgeCount] = await Promise.all([
    prisma.streak.findUnique({ where: { userId: user.id } }),
    prisma.submission.count({ where: { userId: user.id } }),
    prisma.userProgress.count({ where: { userId: user.id, status: "COMPLETED" } }),
    prisma.userBadge.count({ where: { userId: user.id } })
  ]);

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-bold text-emerald-700">{user.title}</p>
        <h1 className="mt-2 text-3xl font-black text-ink">{user.name}</h1>
        <p className="mt-2 text-stone-600">{user.email}</p>
      </section>

      <XpBar xp={user.xp} level={user.level} />

      <section className="grid gap-4 md:grid-cols-4">
        <StatCard label="XP" value={user.xp} />
        <StatCard label="Correct" value={user.totalCorrect} />
        <StatCard label="Completed" value={completedCount} />
        <StatCard label="Submissions" value={submissions} />
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <StatCard label="Current streak" value={`${streak?.currentCount ?? 0}日`} />
        <StatCard label="Longest streak" value={`${streak?.longestCount ?? 0}日`} />
        <StatCard label="Badges" value={badgeCount} />
        <StatCard label="Role" value={user.role} />
      </section>
    </div>
  );
}
