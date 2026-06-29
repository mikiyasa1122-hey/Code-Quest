"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { PublicQuest } from "@/types/quest";

type SubmitResult = {
  isCorrect: boolean;
  score: number;
  xpEarned: number;
  feedback: string;
  explanation: string;
  level: number;
  title: string;
  earnedBadges: string[];
};

type QuestAnswerFormProps = {
  quest: PublicQuest;
};

export function QuestAnswerForm({ quest }: QuestAnswerFormProps) {
  const router = useRouter();
  const [answer, setAnswer] = useState(quest.starterCode ?? "");
  const [choiceId, setChoiceId] = useState("");
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setError(null);

    const response = await fetch(`/api/quests/${quest.id}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        answer,
        choiceId: choiceId || undefined
      })
    });

    const data = (await response.json()) as SubmitResult | { error?: string };

    if (!response.ok) {
      setError("error" in data && data.error ? data.error : "提出に失敗しました。");
      setIsPending(false);
      return;
    }

    setResult(data as SubmitResult);
    setIsPending(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {quest.type === "MULTIPLE_CHOICE" && (
        <fieldset className="space-y-3">
          <legend className="text-sm font-semibold text-stone-700">選択肢</legend>
          {quest.choices.map((choice) => (
            <label
              key={choice.id}
              className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition ${
                choiceId === choice.id ? "border-ink bg-slate-50" : "border-stone-200 bg-white hover:bg-stone-50"
              }`}
            >
              <input
                type="radio"
                name="choiceId"
                value={choice.id}
                checked={choiceId === choice.id}
                onChange={(event) => setChoiceId(event.target.value)}
                className="mt-1"
              />
              <span className="text-sm leading-6 text-stone-700">{choice.text}</span>
            </label>
          ))}
        </fieldset>
      )}

      {quest.type === "TEXT_INPUT" && (
        <div>
          <label className="text-sm font-semibold text-stone-700" htmlFor="answer">
            回答
          </label>
          <input
            id="answer"
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            className="mt-2 w-full rounded-md border border-stone-300 px-3 py-2 outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
            placeholder="答えを入力"
          />
        </div>
      )}

      {quest.type === "CODE_INPUT" && (
        <div>
          <label className="text-sm font-semibold text-stone-700" htmlFor="code-answer">
            コード
          </label>
          <textarea
            id="code-answer"
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            rows={12}
            spellCheck={false}
            className="mt-2 w-full rounded-md border border-stone-300 bg-slate-950 px-4 py-3 font-mono text-sm leading-6 text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
          />
          <p className="mt-2 text-xs text-stone-500">
            このMVPでは安全のためコードを実行せず、必要な構文が含まれるかで採点します。
          </p>
        </div>
      )}

      {error && (
        <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-ink px-5 py-2.5 font-semibold text-white shadow-sm transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "採点中..." : "回答を提出"}
      </button>

      {result && (
        <section
          className={`rounded-lg border p-5 ${
            result.isCorrect ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"
          }`}
        >
          <p className="text-lg font-bold text-ink">{result.isCorrect ? "正解" : "もう一歩"}</p>
          <p className="mt-2 text-sm leading-6 text-stone-700">{result.feedback}</p>
          <p className="mt-3 text-sm font-semibold text-amber-800">獲得XP: {result.xpEarned}</p>
          <p className="mt-1 text-sm text-stone-700">
            現在: Lv.{result.level} / {result.title}
          </p>
          {result.earnedBadges.length > 0 && (
            <p className="mt-2 text-sm font-semibold text-emerald-800">
              新しいバッジ: {result.earnedBadges.join(", ")}
            </p>
          )}
          <div className="mt-4 rounded-md bg-white/75 p-4">
            <p className="text-sm font-bold text-stone-700">解説</p>
            <p className="mt-2 text-sm leading-6 text-stone-700">{result.explanation}</p>
          </div>
        </section>
      )}
    </form>
  );
}
