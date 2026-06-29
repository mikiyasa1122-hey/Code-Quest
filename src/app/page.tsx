import Link from "next/link";
import { ArrowRight, CheckCircle2, Database, Gamepad2, Sparkles } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { ButtonLink } from "@/components/ui/ButtonLink";

export default async function HomePage() {
  const user = await getCurrentUser();

  return (
    <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
      <section className="py-10">
        <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">Full-stack learning RPG</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-normal text-ink sm:text-6xl">
          Code Quest
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-700">
          クエストをクリアしながら、HTML、CSS、JavaScript、TypeScript、React、DBを学ぶフルスタック学習アプリです。
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={user ? "/dashboard" : "/register"}>
            {user ? "ダッシュボードへ" : "無料で開始"}
          </ButtonLink>
          <ButtonLink href="/quests" variant="secondary">
            クエストを見る
          </ButtonLink>
        </div>
      </section>

      <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-soft">
        <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
            <Gamepad2 size={24} aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-bold text-ink">今日の進め方</h2>
            <p className="text-sm text-stone-500">迷わず1問から始められます</p>
          </div>
        </div>
        <div className="mt-5 space-y-4">
          {[
            { icon: CheckCircle2, title: "問題を解く", text: "選択式、テキスト入力、コード入力に対応。" },
            { icon: Sparkles, title: "XPを獲得", text: "初回正解で経験値が入り、レベルと称号が更新。" },
            { icon: Database, title: "履歴を保存", text: "提出、正誤、スコア、獲得XPをPostgreSQLに保存。" }
          ].map((item) => (
            <div key={item.title} className="flex gap-3">
              <span className="mt-1 text-emerald-700">
                <item.icon size={19} aria-hidden="true" />
              </span>
              <div>
                <p className="font-semibold text-ink">{item.title}</p>
                <p className="text-sm leading-6 text-stone-600">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
        <Link
          href={user ? "/dashboard" : "/register"}
          className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-800"
        >
          はじめる
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}
