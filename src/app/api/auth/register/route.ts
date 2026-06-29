import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setSessionCookie } from "@/lib/auth";
import { hashPassword } from "@/lib/password";
import { registerSchema } from "@/lib/validations";
import { calculateLevel, getTitleForLevel } from "@/lib/xp";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "入力内容を確認してください。" }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: parsed.data.email }
  });

  if (existingUser) {
    return NextResponse.json({ error: "このメールアドレスはすでに登録されています。" }, { status: 409 });
  }

  const level = calculateLevel(0);
  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash: await hashPassword(parsed.data.password),
      level,
      title: getTitleForLevel(level, 0),
      streak: {
        create: {}
      }
    },
    select: {
      id: true,
      name: true,
      email: true,
      level: true,
      title: true
    }
  });

  await setSessionCookie(user.id);

  return NextResponse.json({ user }, { status: 201 });
}
