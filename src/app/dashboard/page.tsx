import Link from "next/link";
import { ArrowRight, BookOpenCheck, Flame, Trophy } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { XpBar } from "@/components/dashboard/XpBar";
import { QuestCard } from "@/components/quests/QuestCard";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireUser();

  const [totalQuests, completedCount, streak, recentQuests, recentSubmissions, badgeCount] =
    await Promise.all([
      prisma.quest.count({ where: { isPublished: true } }),
      prisma.userProgress.count({
        where: {
          userId: user.id,
          status: "COMPLETED"
        }
      }),
      prisma.streak.findUnique({
        where: { userId: user.id }
      }),
      prisma.quest.findMany({
        where: {
          isPublished: true,
          progresses: {
            none: {
              userId: user.id,
              status: "COMPLETED"
            }
          }
        },
        include: {
          category: true,
          progresses: {
            where: { userId: user.id },
            select: { status: true }
          }
        },
        orderBy: [{ difficulty: "asc" }, { createdAt: "asc" }],
        take: 3
      }),
      prisma.submission.findMany({
        where: { userId: user.id },
        include: {
          quest: {
            include: { category: true }
          }
        },
        orderBy: { createdAt: "desc" },
        take: 5
      }),
      prisma.userBadge.count({
        where: { userId: user.id }
      })
    ]);

  return (
    <div className="space-y-8">
      <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-bold text-emerald-700">{user.title}</p>
        <h1 className="mt-2 text-3xl font-black text-ink">こんにちは、{user.name}さん</h1>
        <p className="mt-2 text-stone-600">今日も1問だけ進めると、学習の流れが切れにくくなります。</p>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <StatCard label="Cleared" value={`${completedCount}/${totalQuests}`} helper="公開クエストのクリア数" />
        <StatCard label="Correct" value={user.totalCorrect} helper="初回正解として数えた数" />
        <StatCard label="Streak" value={`${streak?.currentCount ?? 0}日`} helper="連続学習日数" />
        <StatCard label="Badges" value={badgeCount} helper="獲得済みバッジ" />
      </section>

      <XpBar xp={user.xp} level={user.level} />

      <section>
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-ink">おすすめクエスト</h2>
            <p className="mt-1 text-sm text-stone-600">未クリアの問題から3件表示しています。</p>
          </div>
          <Link href="/quests" className="inline-flex items-center gap-1 text-sm font-bold text-emerald-700">
            すべて見る
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {recentQuests.map((quest) => (
            <QuestCard key={quest.id} quest={quest} />
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center gap-2">
            <BookOpenCheck size={20} className="text-emerald-700" aria-hidden="true" />
            <h2 className="font-bold text-ink">最近の回答</h2>
          </div>
          <div className="mt-4 divide-y divide-stone-100">
            {recentSubmissions.length === 0 && <p className="text-sm text-stone-500">まだ回答履歴がありません。</p>}
            {recentSubmissions.map((submission) => (
              <div key={submission.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                <div>
                  <p className="font-semibold text-ink">{submission.quest.title}</p>
                  <p className="text-stone-500">{submission.quest.category.name}</p>
                </div>
                <span className={submission.isCorrect ? "font-bold text-emerald-700" : "font-bold text-amber-700"}>
                  {submission.isCorrect ? "Correct" : "Retry"}
                </span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Flame size={20} className="text-amber-600" aria-hidden="true" />
            <h2 className="font-bold text-ink">継続メモ</h2>
          </div>
          <p className="mt-4 text-sm leading-6 text-stone-600">
            現在の最長記録は{streak?.longestCount ?? 0}日です。提出するとストリークが更新されます。
          </p>
          <div className="mt-4 flex items-center gap-2 rounded-md bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-800">
            <Trophy size={17} aria-hidden="true" />
            Lv.{user.level} / {user.title}
          </div>
        </article>
      </section>
    </div>
  );
}
