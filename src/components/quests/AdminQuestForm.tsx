"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type CategoryOption = {
  id: string;
  name: string;
};

type AdminQuestFormProps = {
  categories: CategoryOption[];
  initialQuest?: {
    id: string;
    title: string;
    slug: string;
    description: string;
    content: string;
    explanation: string;
    type: "MULTIPLE_CHOICE" | "TEXT_INPUT" | "CODE_INPUT";
    difficulty: "BEGINNER" | "NORMAL" | "HARD" | "BOSS";
    xpReward: number;
    expectedAnswer: string | null;
    starterCode: string | null;
    categoryId: string;
    isPublished: boolean;
    choices: {
      text: string;
      isCorrect: boolean;
    }[];
  };
};

const emptyChoices = [
  { text: "", isCorrect: true },
  { text: "", isCorrect: false },
  { text: "", isCorrect: false },
  { text: "", isCorrect: false }
];

export function AdminQuestForm({ categories, initialQuest }: AdminQuestFormProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [type, setType] = useState(initialQuest?.type ?? "MULTIPLE_CHOICE");
  const [choices, setChoices] = useState(initialQuest?.choices.length ? initialQuest.choices : emptyChoices);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const payload = {
      title: formData.get("title"),
      slug: formData.get("slug"),
      description: formData.get("description"),
      content: formData.get("content"),
      explanation: formData.get("explanation"),
      type,
      difficulty: formData.get("difficulty"),
      xpReward: formData.get("xpReward"),
      expectedAnswer: formData.get("expectedAnswer"),
      starterCode: formData.get("starterCode"),
      categoryId: formData.get("categoryId"),
      isPublished: formData.get("isPublished") === "on",
      choices: type === "MULTIPLE_CHOICE" ? choices.filter((choice) => choice.text.trim().length > 0) : []
    };

    const endpoint = initialQuest ? `/api/admin/quests/${initialQuest.id}` : "/api/admin/quests";
    const response = await fetch(endpoint, {
      method: initialQuest ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setMessage(data.error ?? "保存に失敗しました。");
      setIsPending(false);
      return;
    }

    setMessage("保存しました。");
    setIsPending(false);
    router.push("/admin/quests");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-semibold text-stone-700">
          タイトル
          <input
            name="title"
            defaultValue={initialQuest?.title}
            required
            className="mt-2 w-full rounded-md border border-stone-300 px-3 py-2"
          />
        </label>
        <label className="text-sm font-semibold text-stone-700">
          slug
          <input
            name="slug"
            defaultValue={initialQuest?.slug}
            required
            className="mt-2 w-full rounded-md border border-stone-300 px-3 py-2"
          />
        </label>
      </div>

      <label className="block text-sm font-semibold text-stone-700">
        説明
        <input
          name="description"
          defaultValue={initialQuest?.description}
          required
          className="mt-2 w-full rounded-md border border-stone-300 px-3 py-2"
        />
      </label>

      <label className="block text-sm font-semibold text-stone-700">
        問題文
        <textarea
          name="content"
          defaultValue={initialQuest?.content}
          required
          rows={5}
          className="mt-2 w-full rounded-md border border-stone-300 px-3 py-2"
        />
      </label>

      <label className="block text-sm font-semibold text-stone-700">
        解説
        <textarea
          name="explanation"
          defaultValue={initialQuest?.explanation}
          required
          rows={4}
          className="mt-2 w-full rounded-md border border-stone-300 px-3 py-2"
        />
      </label>

      <div className="grid gap-4 md:grid-cols-4">
        <label className="text-sm font-semibold text-stone-700">
          タイプ
          <select
            value={type}
            onChange={(event) => setType(event.target.value as typeof type)}
            className="mt-2 w-full rounded-md border border-stone-300 px-3 py-2"
          >
            <option value="MULTIPLE_CHOICE">選択式</option>
            <option value="TEXT_INPUT">テキスト</option>
            <option value="CODE_INPUT">コード</option>
          </select>
        </label>
        <label className="text-sm font-semibold text-stone-700">
          難易度
          <select
            name="difficulty"
            defaultValue={initialQuest?.difficulty ?? "BEGINNER"}
            className="mt-2 w-full rounded-md border border-stone-300 px-3 py-2"
          >
            <option value="BEGINNER">Beginner</option>
            <option value="NORMAL">Normal</option>
            <option value="HARD">Hard</option>
            <option value="BOSS">Boss</option>
          </select>
        </label>
        <label className="text-sm font-semibold text-stone-700">
          XP
          <input
            name="xpReward"
            type="number"
            min="1"
            defaultValue={initialQuest?.xpReward ?? 50}
            className="mt-2 w-full rounded-md border border-stone-300 px-3 py-2"
          />
        </label>
        <label className="text-sm font-semibold text-stone-700">
          カテゴリ
          <select
            name="categoryId"
            defaultValue={initialQuest?.categoryId ?? categories[0]?.id}
            className="mt-2 w-full rounded-md border border-stone-300 px-3 py-2"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {type === "MULTIPLE_CHOICE" && (
        <div className="space-y-3 rounded-lg border border-stone-200 bg-stone-50 p-4">
          <p className="text-sm font-bold text-stone-700">選択肢</p>
          {choices.map((choice, index) => (
            <div key={index} className="grid gap-3 md:grid-cols-[1fr_auto]">
              <input
                value={choice.text}
                onChange={(event) => {
                  const nextChoices = [...choices];
                  nextChoices[index] = { ...choice, text: event.target.value };
                  setChoices(nextChoices);
                }}
                className="rounded-md border border-stone-300 px-3 py-2"
                placeholder={`選択肢 ${index + 1}`}
              />
              <label className="inline-flex items-center gap-2 text-sm text-stone-700">
                <input
                  type="radio"
                  name="correctChoice"
                  checked={choice.isCorrect}
                  onChange={() =>
                    setChoices(
                      choices.map((item, itemIndex) => ({
                        ...item,
                        isCorrect: itemIndex === index
                      }))
                    )
                  }
                />
                正解
              </label>
            </div>
          ))}
        </div>
      )}

      <label className="block text-sm font-semibold text-stone-700">
        採点用の答え
        <textarea
          name="expectedAnswer"
          defaultValue={initialQuest?.expectedAnswer ?? ""}
          rows={3}
          className="mt-2 w-full rounded-md border border-stone-300 px-3 py-2"
        />
      </label>

      <label className="block text-sm font-semibold text-stone-700">
        スターターコード
        <textarea
          name="starterCode"
          defaultValue={initialQuest?.starterCode ?? ""}
          rows={4}
          className="mt-2 w-full rounded-md border border-stone-300 px-3 py-2 font-mono text-sm"
        />
      </label>

      <label className="inline-flex items-center gap-2 text-sm font-semibold text-stone-700">
        <input name="isPublished" type="checkbox" defaultChecked={initialQuest?.isPublished ?? true} />
        公開する
      </label>

      {message && <p className="rounded-md bg-stone-100 px-3 py-2 text-sm text-stone-700">{message}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-ink px-5 py-2.5 font-semibold text-white shadow-sm transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "保存中..." : "保存"}
      </button>
    </form>
  );
}
