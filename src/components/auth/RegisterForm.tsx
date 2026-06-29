"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type FormState = {
  error: string | null;
  isPending: boolean;
};

export function RegisterForm() {
  const router = useRouter();
  const [state, setState] = useState<FormState>({
    error: null,
    isPending: false
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ error: null, isPending: true });

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password")
      })
    });

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setState({ error: data.error ?? "登録に失敗しました。", isPending: false });
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
      <div>
        <label className="text-sm font-semibold text-stone-700" htmlFor="name">
          表示名
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          className="mt-2 w-full rounded-md border border-stone-300 px-3 py-2 outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
        />
      </div>
      <div>
        <label className="text-sm font-semibold text-stone-700" htmlFor="email">
          メールアドレス
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="mt-2 w-full rounded-md border border-stone-300 px-3 py-2 outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
        />
      </div>
      <div>
        <label className="text-sm font-semibold text-stone-700" htmlFor="password">
          パスワード
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          className="mt-2 w-full rounded-md border border-stone-300 px-3 py-2 outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
        />
      </div>

      {state.error && (
        <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={state.isPending}
        className="w-full rounded-md bg-ink px-4 py-2 font-semibold text-white shadow-sm transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {state.isPending ? "登録中..." : "アカウント作成"}
      </button>
    </form>
  );
}
