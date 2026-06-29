import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const user = await requireUser();

  const submissions = await prisma.submission.findMany({
    where: { userId: user.id },
    include: {
      quest: {
        include: { category: true }
      }
    },
    orderBy: { createdAt: "desc" },
    take: 100
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-ink">回答履歴</h1>
        <p className="mt-2 text-stone-600">提出した答え、正誤、獲得XPを保存しています。</p>
      </div>

      <div className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-stone-50 text-stone-600">
            <tr>
              <th className="px-4 py-3">日時</th>
              <th className="px-4 py-3">クエスト</th>
              <th className="px-4 py-3">カテゴリ</th>
              <th className="px-4 py-3">結果</th>
              <th className="px-4 py-3">Score</th>
              <th className="px-4 py-3">XP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {submissions.map((submission) => (
              <tr key={submission.id}>
                <td className="px-4 py-3 text-stone-500">
                  {new Intl.DateTimeFormat("ja-JP", {
                    dateStyle: "medium",
                    timeStyle: "short"
                  }).format(submission.createdAt)}
                </td>
                <td className="px-4 py-3 font-semibold text-ink">
                  <Link href={`/quests/${submission.questId}`}>{submission.quest.title}</Link>
                </td>
                <td className="px-4 py-3">{submission.quest.category.name}</td>
                <td className="px-4 py-3">
                  <span className={submission.isCorrect ? "font-bold text-emerald-700" : "font-bold text-amber-700"}>
                    {submission.isCorrect ? "Correct" : "Retry"}
                  </span>
                </td>
                <td className="px-4 py-3">{submission.score}</td>
                <td className="px-4 py-3">{submission.xpEarned}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {submissions.length === 0 && <p className="p-5 text-sm text-stone-500">まだ回答履歴がありません。</p>}
      </div>
    </div>
  );
}
