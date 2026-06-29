import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/password";
import { calculateLevel, getTitleForLevel } from "../src/lib/xp";

const prisma = new PrismaClient();

async function main() {
  const categories = [
    {
      name: "HTML",
      slug: "html",
      description: "Webページの骨組みを作るマークアップを学びます。",
      accentColor: "#2563eb",
      order: 1
    },
    {
      name: "CSS",
      slug: "css",
      description: "見た目、レイアウト、レスポンシブデザインを学びます。",
      accentColor: "#7c3aed",
      order: 2
    },
    {
      name: "JavaScript",
      slug: "javascript",
      description: "Webに動きを加えるための基本文法と考え方を学びます。",
      accentColor: "#d97706",
      order: 3
    },
    {
      name: "TypeScript",
      slug: "typescript",
      description: "型安全にアプリを作るためのTypeScriptを学びます。",
      accentColor: "#0284c7",
      order: 4
    },
    {
      name: "React",
      slug: "react",
      description: "コンポーネントでUIを組み立てる方法を学びます。",
      accentColor: "#0f766e",
      order: 5
    },
    {
      name: "Database",
      slug: "database",
      description: "データ保存、SQL、PrismaによるDB操作を学びます。",
      accentColor: "#be123c",
      order: 6
    }
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category
    });
  }

  const categoryMap = new Map(
    (await prisma.category.findMany()).map((category) => [category.slug, category.id])
  );

  const quests = [
    {
      categorySlug: "html",
      title: "見出しタグを選ぼう",
      slug: "choose-heading-tag",
      description: "ページの大見出しに使うHTMLタグを選びます。",
      content: "Webページの一番大きな見出しに使う、もっとも適切なタグはどれですか？",
      explanation:
        "h1はページ内でもっとも重要な見出しを表すタグです。見た目だけでなく、文書構造としても意味があります。",
      type: "MULTIPLE_CHOICE" as const,
      difficulty: "BEGINNER" as const,
      xpReward: 40,
      choices: [
        { text: "<section>", isCorrect: false },
        { text: "<h1>", isCorrect: true },
        { text: "<span>", isCorrect: false },
        { text: "<footer>", isCorrect: false }
      ]
    },
    {
      categorySlug: "css",
      title: "中央寄せのFlexbox",
      slug: "center-with-flexbox",
      description: "Flexboxで要素を中央配置するプロパティを答えます。",
      content:
        "親要素にdisplay: flexを指定したとき、横方向の中央寄せに使うCSSプロパティと値を入力してください。",
      explanation:
        "Flexboxの主軸方向の配置にはjustify-contentを使います。横方向が主軸ならjustify-content: centerで中央に寄せられます。",
      type: "TEXT_INPUT" as const,
      difficulty: "BEGINNER" as const,
      xpReward: 45,
      expectedAnswer: "justify-content: center|justify-content:center"
    },
    {
      categorySlug: "javascript",
      title: "配列の合計を返す関数",
      slug: "sum-array-function",
      description: "配列を受け取り、合計値を返す関数を書きます。",
      content:
        "numbersという数値配列を受け取り、すべての値の合計を返すsum関数を完成させてください。",
      explanation:
        "reduceを使うと、配列の各要素を1つの値にまとめられます。初期値0を渡すと空配列にも強くなります。",
      type: "CODE_INPUT" as const,
      difficulty: "NORMAL" as const,
      xpReward: 80,
      starterCode: "function sum(numbers) {\n  // ここに処理を書きます\n}",
      expectedAnswer: "function sum|||return|||reduce|||0"
    },
    {
      categorySlug: "typescript",
      title: "User型を定義する",
      slug: "define-user-type",
      description: "TypeScriptのtypeでUserの形を定義します。",
      content:
        "idがstring、levelがnumberのUser型をtypeで定義してください。型名はUserにします。",
      explanation:
        "TypeScriptではtype User = { id: string; level: number } のように、オブジェクトの形を型として表せます。",
      type: "CODE_INPUT" as const,
      difficulty: "NORMAL" as const,
      xpReward: 90,
      starterCode: "// User型をここに定義してください",
      expectedAnswer: "type user|||id: string|||level: number"
    },
    {
      categorySlug: "react",
      title: "状態を持つためのHook",
      slug: "choose-state-hook",
      description: "Reactで状態管理に使う基本Hookを選びます。",
      content: "Reactコンポーネント内で状態を持つために使う基本的なHookはどれですか？",
      explanation:
        "useStateはコンポーネント内に状態を持たせるためのHookです。入力値や表示切り替えなどによく使います。",
      type: "MULTIPLE_CHOICE" as const,
      difficulty: "BEGINNER" as const,
      xpReward: 50,
      choices: [
        { text: "useState", isCorrect: true },
        { text: "useRouter", isCorrect: false },
        { text: "useMemo", isCorrect: false },
        { text: "useServer", isCorrect: false }
      ]
    },
    {
      categorySlug: "database",
      title: "Prismaで1件取得する",
      slug: "prisma-find-unique",
      description: "Prisma Clientで一意なレコードを取得するメソッドを答えます。",
      content: "Prisma Clientで、idなど一意制約を使ってUserを1件取得する代表的なメソッド名は何ですか？",
      explanation:
        "findUniqueは一意制約に基づいて1件取得するメソッドです。idやuniqueなemailで検索するときに使います。",
      type: "TEXT_INPUT" as const,
      difficulty: "NORMAL" as const,
      xpReward: 75,
      expectedAnswer: "findUnique|prisma.user.findUnique"
    },
    {
      categorySlug: "javascript",
      title: "Falsyを見抜くBoss",
      slug: "falsy-boss",
      description: "JavaScriptの真偽値変換を見極めるBoss問題です。",
      content: "次のうち、JavaScriptでBoolean(value)がfalseになるものはどれですか？",
      explanation:
        "空文字列はFalsyです。文字列'0'や空配列、空オブジェクトはTruthyになる点がよく混乱ポイントです。",
      type: "MULTIPLE_CHOICE" as const,
      difficulty: "BOSS" as const,
      xpReward: 160,
      choices: [
        { text: "\"0\"", isCorrect: false },
        { text: "[]", isCorrect: false },
        { text: "\"\"", isCorrect: true },
        { text: "{}", isCorrect: false }
      ]
    }
  ];

  for (const quest of quests) {
    const categoryId = categoryMap.get(quest.categorySlug);

    if (!categoryId) {
      throw new Error(`Category not found: ${quest.categorySlug}`);
    }

    const savedQuest = await prisma.quest.upsert({
      where: { slug: quest.slug },
      update: {
        title: quest.title,
        description: quest.description,
        content: quest.content,
        explanation: quest.explanation,
        type: quest.type,
        difficulty: quest.difficulty,
        xpReward: quest.xpReward,
        expectedAnswer: quest.expectedAnswer,
        starterCode: quest.starterCode,
        isPublished: true,
        categoryId
      },
      create: {
        title: quest.title,
        slug: quest.slug,
        description: quest.description,
        content: quest.content,
        explanation: quest.explanation,
        type: quest.type,
        difficulty: quest.difficulty,
        xpReward: quest.xpReward,
        expectedAnswer: quest.expectedAnswer,
        starterCode: quest.starterCode,
        isPublished: true,
        categoryId
      }
    });

    await prisma.choice.deleteMany({
      where: { questId: savedQuest.id }
    });

    if ("choices" in quest && quest.choices) {
      await prisma.choice.createMany({
        data: quest.choices.map((choice, index) => ({
          questId: savedQuest.id,
          text: choice.text,
          isCorrect: choice.isCorrect,
          order: index + 1
        }))
      });
    }
  }

  const badges = [
    {
      name: "First Clear",
      description: "はじめてクエストに正解する。",
      icon: "sparkles",
      rule: "FIRST_CORRECT" as const,
      order: 1
    },
    {
      name: "Ten Wins",
      description: "10問に正解する。",
      icon: "trophy",
      rule: "TEN_CORRECT" as const,
      order: 2
    },
    {
      name: "Boss Breaker",
      description: "Boss難易度の問題に正解する。",
      icon: "sword",
      rule: "FIRST_BOSS" as const,
      order: 3
    },
    {
      name: "Seven Day Trail",
      description: "7日連続で学習する。",
      icon: "flame",
      rule: "SEVEN_DAY_STREAK" as const,
      order: 4
    },
    {
      name: "JavaScript Explorer",
      description: "JavaScriptカテゴリの公開クエストをすべてクリアする。",
      icon: "map",
      rule: "CATEGORY_COMPLETE" as const,
      ruleValue: "javascript",
      order: 5
    }
  ];

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: {
        id: badge.name.toLowerCase().replaceAll(" ", "-")
      },
      update: badge,
      create: {
        id: badge.name.toLowerCase().replaceAll(" ", "-"),
        ...badge
      }
    });
  }

  const demoXp = 0;
  const demoCorrect = 0;
  const demoLevel = calculateLevel(demoXp);

  await prisma.user.upsert({
    where: { email: "demo@codequest.local" },
    update: {},
    create: {
      name: "Demo Learner",
      email: "demo@codequest.local",
      passwordHash: await hashPassword("password123"),
      xp: demoXp,
      level: demoLevel,
      title: getTitleForLevel(demoLevel, demoCorrect),
      totalCorrect: demoCorrect,
      streak: {
        create: {}
      }
    }
  });

  await prisma.user.upsert({
    where: { email: "admin@codequest.local" },
    update: {
      role: "ADMIN"
    },
    create: {
      name: "Admin",
      email: "admin@codequest.local",
      passwordHash: await hashPassword("admin12345"),
      role: "ADMIN",
      streak: {
        create: {}
      }
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
