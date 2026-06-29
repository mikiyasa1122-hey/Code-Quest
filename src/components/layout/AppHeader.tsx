import Link from "next/link";
import { Code2, LogOut, ShieldCheck, UserCircle } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { LogoutButton } from "@/components/auth/LogoutButton";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/quests", label: "Quests" },
  { href: "/categories", label: "Categories" },
  { href: "/history", label: "History" },
  { href: "/badges", label: "Badges" }
];

export async function AppHeader() {
  const user = await getCurrentUser();

  return (
    <header className="border-b border-stone-200 bg-white/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-ink text-white">
            <Code2 size={22} aria-hidden="true" />
          </span>
          <span>
            <span className="block text-lg font-bold">Code Quest</span>
            <span className="block text-xs text-stone-500">Learn by clearing quests</span>
          </span>
        </Link>

        <nav className="flex flex-wrap items-center gap-2 text-sm">
          {user &&
            navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-stone-700 transition hover:bg-stone-100 hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          {user?.role === "ADMIN" && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-rose-700 transition hover:bg-rose-50"
            >
              <ShieldCheck size={16} aria-hidden="true" />
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/profile"
                className="inline-flex items-center gap-2 rounded-md border border-stone-200 bg-white px-3 py-2 text-sm shadow-sm"
              >
                <UserCircle size={17} aria-hidden="true" />
                Lv.{user.level} {user.name}
              </Link>
              <LogoutButton>
                <LogOut size={17} aria-hidden="true" />
              </LogoutButton>
            </>
          ) : (
            <>
              <Link className="rounded-md px-4 py-2 text-sm font-medium hover:bg-stone-100" href="/login">
                Login
              </Link>
              <Link
                className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700"
                href="/register"
              >
                Start
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
