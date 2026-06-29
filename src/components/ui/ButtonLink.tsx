import Link from "next/link";

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
};

export function ButtonLink({ href, children, variant = "primary" }: ButtonLinkProps) {
  const className =
    variant === "primary"
      ? "inline-flex items-center justify-center rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700"
      : "inline-flex items-center justify-center rounded-md border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-ink shadow-sm transition hover:bg-stone-100";

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
