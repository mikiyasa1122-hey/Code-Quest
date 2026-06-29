import Link from "next/link";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { getCurrentUser } from "@/lib/auth";

export default async function RegisterPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-ink">アカウント作成</h1>
        <p className="mt-2 text-sm leading-6 text-stone-600">
          登録後すぐに学習ダッシュボードへ移動します。
        </p>
      </div>
      <RegisterForm />
      <p className="mt-5 text-center text-sm text-stone-600">
        すでに登録済みなら{" "}
        <Link href="/login" className="font-bold text-emerald-700">
          ログイン
        </Link>
      </p>
    </div>
  );
}
