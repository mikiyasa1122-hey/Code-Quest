import { getLevelProgress, getXpForNextLevel } from "@/lib/xp";

type XpBarProps = {
  xp: number;
  level: number;
};

export function XpBar({ xp, level }: XpBarProps) {
  const progress = getLevelProgress(xp, level);

  return (
    <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-stone-500">Level progress</p>
          <p className="mt-1 text-lg font-semibold text-ink">Lv.{level}</p>
        </div>
        <p className="text-sm text-stone-500">
          {xp} / {getXpForNextLevel(level)} XP
        </p>
      </div>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-stone-100">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all"
          style={{ width: `${progress.percent}%` }}
        />
      </div>
    </div>
  );
}
