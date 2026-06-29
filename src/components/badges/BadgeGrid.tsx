import { Flame, Map, Sparkles, Sword, Trophy } from "lucide-react";

type BadgeItem = {
  id: string;
  name: string;
  description: string;
  icon: string;
  users?: {
    earnedAt: Date;
  }[];
};

function BadgeIcon({ icon }: { icon: string }) {
  const className = "h-6 w-6";

  if (icon === "trophy") {
    return <Trophy className={className} aria-hidden="true" />;
  }

  if (icon === "sword") {
    return <Sword className={className} aria-hidden="true" />;
  }

  if (icon === "flame") {
    return <Flame className={className} aria-hidden="true" />;
  }

  if (icon === "map") {
    return <Map className={className} aria-hidden="true" />;
  }

  return <Sparkles className={className} aria-hidden="true" />;
}

export function BadgeGrid({ badges }: { badges: BadgeItem[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {badges.map((badge) => {
        const earned = Boolean(badge.users?.length);

        return (
          <article
            key={badge.id}
            className={`rounded-lg border p-5 shadow-sm ${
              earned ? "border-amber-200 bg-amber-50" : "border-stone-200 bg-white opacity-70"
            }`}
          >
            <div className="flex items-start gap-4">
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                  earned ? "bg-amber-500 text-white" : "bg-stone-100 text-stone-500"
                }`}
              >
                <BadgeIcon icon={badge.icon} />
              </span>
              <div>
                <h2 className="font-bold text-ink">{badge.name}</h2>
                <p className="mt-1 text-sm leading-6 text-stone-600">{badge.description}</p>
                <p className="mt-3 text-xs font-semibold text-stone-500">
                  {earned ? "獲得済み" : "未獲得"}
                </p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
