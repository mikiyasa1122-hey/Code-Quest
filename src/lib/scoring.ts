import type { Choice, Quest } from "@prisma/client";

type QuestForScoring = Quest & {
  choices: Choice[];
};

export type EvaluationResult = {
  isCorrect: boolean;
  score: number;
  feedback: string;
};

function normalizeAnswer(answer: string): string {
  return answer.trim().replace(/\s+/g, " ").toLowerCase();
}

function normalizeCode(answer: string): string {
  return answer.trim().replace(/\s+/g, " ").toLowerCase();
}

export function evaluateQuestAnswer(
  quest: QuestForScoring,
  params: { answer: string; choiceId?: string }
): EvaluationResult {
  if (quest.type === "MULTIPLE_CHOICE") {
    const selectedChoice = quest.choices.find((choice) => choice.id === params.choiceId);

    if (!selectedChoice) {
      return {
        isCorrect: false,
        score: 0,
        feedback: "選択肢を1つ選んでから提出してください。"
      };
    }

    return {
      isCorrect: selectedChoice.isCorrect,
      score: selectedChoice.isCorrect ? 100 : 0,
      feedback: selectedChoice.isCorrect
        ? "正解です。よく見抜けました。"
        : "惜しいです。解説を読んで、もう一度考えてみましょう。"
    };
  }

  if (!quest.expectedAnswer) {
    return {
      isCorrect: false,
      score: 0,
      feedback: "この問題には採点用の答えがまだ設定されていません。"
    };
  }

  if (quest.type === "TEXT_INPUT") {
    const acceptedAnswers = quest.expectedAnswer.split("|").map(normalizeAnswer);
    const isCorrect = acceptedAnswers.includes(normalizeAnswer(params.answer));

    return {
      isCorrect,
      score: isCorrect ? 100 : 0,
      feedback: isCorrect
        ? "正解です。短い答えでも、要点を押さえられています。"
        : "入力内容が想定と違います。大文字小文字ではなく、キーワードを確認してみましょう。"
    };
  }

  // CODE_INPUTは安全のためサーバー上で任意コードを実行しません。
  // MVPでは、expectedAnswerに「含まれてほしいトークン」を|||区切りで保存し、静的に採点します。
  const requiredTokens = quest.expectedAnswer.split("|||").map(normalizeCode);
  const normalizedCode = normalizeCode(params.answer);
  const isCorrect = requiredTokens.every((token) => normalizedCode.includes(token));

  return {
    isCorrect,
    score: isCorrect ? 100 : 0,
    feedback: isCorrect
      ? "正解です。必要な構文がきちんと入っています。"
      : "必要な構文がまだ足りません。スターターコードとヒントを見直してみましょう。"
  };
}
