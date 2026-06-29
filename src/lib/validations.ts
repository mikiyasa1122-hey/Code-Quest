import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "名前は2文字以上で入力してください。").max(40),
  email: z.string().email("メールアドレスの形式が正しくありません。"),
  password: z.string().min(8, "パスワードは8文字以上で入力してください。")
});

export const loginSchema = z.object({
  email: z.string().email("メールアドレスの形式が正しくありません。"),
  password: z.string().min(1, "パスワードを入力してください。")
});

export const questSubmissionSchema = z.object({
  answer: z.string().default(""),
  choiceId: z.string().optional()
});

export const adminQuestSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/),
  description: z.string().min(10),
  content: z.string().min(10),
  explanation: z.string().min(10),
  type: z.enum(["MULTIPLE_CHOICE", "TEXT_INPUT", "CODE_INPUT"]),
  difficulty: z.enum(["BEGINNER", "NORMAL", "HARD", "BOSS"]),
  xpReward: z.coerce.number().int().positive(),
  expectedAnswer: z.string().optional(),
  starterCode: z.string().optional(),
  categoryId: z.string().min(1),
  isPublished: z.coerce.boolean().default(false),
  choices: z
    .array(
      z.object({
        text: z.string().min(1),
        isCorrect: z.boolean()
      })
    )
    .default([])
});
