import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { getCurrentUser } from "@/lib/auth";

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-ink">ログイン</h1>
        <p className="mt-2 text-sm leading-6 text-stone-600">
          demo@codequest.local / password123 でseedユーザーを試せます。
        </p>
      </div>
      <LoginForm />
      <p className="mt-5 text-center text-sm text-stone-600">
        アカウントがない場合は{" "}
        <Link href="/register" className="font-bold text-emerald-700">
          新規登録
        </Link>
      </p>
    </div>
  );
}
