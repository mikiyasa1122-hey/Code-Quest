import Link from "next/link";

type CategoryCardProps = {
  category: {
    name: string;
    slug: string;
    description: string;
    accentColor: string;
    _count?: {
      quests: number;
    };
  };
  completedCount?: number;
};

export function CategoryCard({ category, completedCount = 0 }: CategoryCardProps) {
  const totalCount = category._count?.quests ?? 0;
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group rounded-lg border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft"
    >
      <div className="flex items-start justify-between gap-4">
        <span
          className="h-11 w-2 rounded-full"
          style={{ backgroundColor: category.accentColor }}
          aria-hidden="true"
        />
        <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600">
          {totalCount} quests
        </span>
      </div>
      <h2 className="mt-4 text-xl font-bold text-ink">{category.name}</h2>
      <p className="mt-2 min-h-12 text-sm leading-6 text-stone-600">{category.description}</p>
      <div className="mt-5">
        <div className="flex items-center justify-between text-xs text-stone-500">
          <span>Progress</span>
          <span>{percent}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-stone-100">
          <div
            className="h-full rounded-full transition-all group-hover:bg-emerald-500"
            style={{ width: `${percent}%`, backgroundColor: category.accentColor }}
          />
        </div>
      </div>
    </Link>
  );
}
