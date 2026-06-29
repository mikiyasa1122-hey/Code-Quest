import { BadgeGrid } from "@/components/badges/BadgeGrid";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function BadgesPage() {
  const user = await requireUser();

  const badges = await prisma.badge.findMany({
    orderBy: { order: "asc" },
    include: {
      users: {
        where: { userId: user.id },
        select: { earnedAt: true }
      }
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-ink">バッジ</h1>
        <p className="mt-2 text-stone-600">正解数、Bossクリア、継続日数でバッジが解放されます。</p>
      </div>
      <BadgeGrid badges={badges} />
    </div>
  );
}
