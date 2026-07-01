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
    },
    {
      categorySlug: "html",
      title: "画像に説明をつける",
      slug: "html-alt-text",
      description: "アクセシビリティに必要な画像属性を選びます。",
      content: "画像が表示されない場合やスクリーンリーダー向けに、画像の説明文を入れる属性はどれですか？",
      explanation:
        "alt属性は画像の代替テキストです。見た目だけでなく、アクセシビリティや検索エンジンにも関係します。",
      type: "MULTIPLE_CHOICE" as const,
      difficulty: "BEGINNER" as const,
      xpReward: 40,
      choices: [
        { text: "src", isCorrect: false },
        { text: "href", isCorrect: false },
        { text: "alt", isCorrect: true },
        { text: "target", isCorrect: false }
      ]
    },
    {
      categorySlug: "html",
      title: "入力欄とラベルを結ぶ",
      slug: "html-form-label",
      description: "フォームでlabelとinputを関連づける方法を答えます。",
      content: "label要素のfor属性には、input要素のどの属性値を指定しますか？",
      explanation:
        "labelのforにはinputのidを指定します。クリック領域が広がり、支援技術にもフォームの意味が伝わります。",
      type: "TEXT_INPUT" as const,
      difficulty: "NORMAL" as const,
      xpReward: 70,
      expectedAnswer: "id|inputのid|input id"
    },
    {
      categorySlug: "css",
      title: "Gridの列を作る",
      slug: "css-grid-columns",
      description: "CSS Gridで列幅を指定するプロパティを答えます。",
      content: "CSS Gridで、列の数や幅を指定するプロパティ名は何ですか？",
      explanation:
        "grid-template-columnsはGridコンテナの列トラックを定義します。repeat(3, 1fr)のような指定もできます。",
      type: "TEXT_INPUT" as const,
      difficulty: "NORMAL" as const,
      xpReward: 75,
      expectedAnswer: "grid-template-columns"
    },
    {
      categorySlug: "css",
      title: "画面幅に応じる単位",
      slug: "css-responsive-unit",
      description: "ビューポート幅を基準にしたCSS単位を選びます。",
      content: "画面幅の1%を表すCSS単位はどれですか？",
      explanation:
        "vwはviewport widthの略で、1vwは画面幅の1%です。画面高さならvhを使います。",
      type: "MULTIPLE_CHOICE" as const,
      difficulty: "BEGINNER" as const,
      xpReward: 45,
      choices: [
        { text: "em", isCorrect: false },
        { text: "rem", isCorrect: false },
        { text: "vw", isCorrect: true },
        { text: "px", isCorrect: false }
      ]
    },
    {
      categorySlug: "javascript",
      title: "配列を変換するmap",
      slug: "js-map-return",
      description: "数値配列を2倍にした新しい配列を返します。",
      content: "numbers配列の各値を2倍にした新しい配列を返すdouble関数を書いてください。",
      explanation:
        "mapは元の配列をもとに、新しい配列を作ります。各要素を変換したいときに便利です。",
      type: "CODE_INPUT" as const,
      difficulty: "NORMAL" as const,
      xpReward: 85,
      starterCode: "function double(numbers) {\n  // ここに処理を書きます\n}",
      expectedAnswer: "function double|||return|||map|||* 2"
    },
    {
      categorySlug: "javascript",
      title: "Promiseを待つキーワード",
      slug: "js-async-await",
      description: "非同期処理の結果を待つJavaScriptキーワードを答えます。",
      content: "async関数の中でPromiseの完了を待つために使うキーワードは何ですか？",
      explanation:
        "awaitはPromiseの解決を待ちます。awaitを使う関数は基本的にasync関数として定義します。",
      type: "TEXT_INPUT" as const,
      difficulty: "NORMAL" as const,
      xpReward: 70,
      expectedAnswer: "await"
    },
    {
      categorySlug: "typescript",
      title: "状態をUnion型で表す",
      slug: "ts-union-type",
      description: "literal unionで状態を限定します。",
      content: "Status型を、文字列'loading'または'success'または'error'だけを許可する型として定義してください。",
      explanation:
        "Union型を使うと、値の候補を限定できます。状態管理では想定外の文字列を防げます。",
      type: "CODE_INPUT" as const,
      difficulty: "HARD" as const,
      xpReward: 120,
      starterCode: "// Status型を定義してください",
      expectedAnswer: "type status|||loading|||success|||error"
    },
    {
      categorySlug: "typescript",
      title: "任意プロパティを読む",
      slug: "ts-optional-property",
      description: "TypeScriptで省略可能なプロパティを表す記号を答えます。",
      content: "User型のavatarUrlを省略可能なstringプロパティにしたいとき、プロパティ名の後ろにつける記号は何ですか？",
      explanation:
        "?を使うと、そのプロパティは存在しない可能性があることを型で表せます。例: avatarUrl?: string",
      type: "TEXT_INPUT" as const,
      difficulty: "BEGINNER" as const,
      xpReward: 55,
      expectedAnswer: "?|question mark"
    },
    {
      categorySlug: "react",
      title: "親から子へ渡す値",
      slug: "react-props",
      description: "Reactでコンポーネントに値を渡す仕組みを答えます。",
      content: "Reactで親コンポーネントから子コンポーネントへ渡す値のことを何と呼びますか？",
      explanation:
        "propsはコンポーネントへ外から渡される値です。UIを再利用しやすくするための基本です。",
      type: "TEXT_INPUT" as const,
      difficulty: "BEGINNER" as const,
      xpReward: 50,
      expectedAnswer: "props|prop"
    },
    {
      categorySlug: "react",
      title: "リストに必要なkey",
      slug: "react-list-key",
      description: "Reactでリスト描画するときに必要な属性を選びます。",
      content: "配列をmapで描画するとき、各要素を識別するためによく指定する特別な属性はどれですか？",
      explanation:
        "keyはReactがリスト内の要素を識別するために使います。安定したidを使うのが理想です。",
      type: "MULTIPLE_CHOICE" as const,
      difficulty: "NORMAL" as const,
      xpReward: 75,
      choices: [
        { text: "name", isCorrect: false },
        { text: "key", isCorrect: true },
        { text: "idName", isCorrect: false },
        { text: "indexOnly", isCorrect: false }
      ]
    },
    {
      categorySlug: "database",
      title: "主キーの役割",
      slug: "db-primary-key",
      description: "DBでレコードを一意に識別するキーを答えます。",
      content: "データベースのテーブルで、各レコードを一意に識別するためのキーを何と呼びますか？",
      explanation:
        "主キー、またはprimary keyは、テーブル内の各行を一意に識別するための制約です。",
      type: "TEXT_INPUT" as const,
      difficulty: "BEGINNER" as const,
      xpReward: 60,
      expectedAnswer: "主キー|primary key|primarykey"
    },
    {
      categorySlug: "database",
      title: "外部キーでつながる関係",
      slug: "db-relation",
      description: "テーブル同士を結びつけるキーを選びます。",
      content: "別テーブルの主キーを参照して、テーブル同士を関連づけるキーはどれですか？",
      explanation:
        "外部キーは別テーブルの行を参照するためのキーです。リレーション設計の中心になります。",
      type: "MULTIPLE_CHOICE" as const,
      difficulty: "NORMAL" as const,
      xpReward: 80,
      choices: [
        { text: "primary key", isCorrect: false },
        { text: "foreign key", isCorrect: true },
        { text: "access key", isCorrect: false },
        { text: "secret key", isCorrect: false }
      ]
    },
    {
      categorySlug: "database",
      title: "回答保存フローBoss",
      slug: "fullstack-boss-flow",
      description: "回答提出時のサーバー処理順を見極めるBoss問題です。",
      content:
        "学習アプリで回答を提出したとき、履歴保存・進捗更新・XP付与をまとめて安全に行うために使うDBの仕組みはどれですか？",
      explanation:
        "トランザクションを使うと、複数のDB更新をまとめて成功または失敗として扱えます。学習履歴とXPのズレを防げます。",
      type: "MULTIPLE_CHOICE" as const,
      difficulty: "BOSS" as const,
      xpReward: 180,
      choices: [
        { text: "transaction", isCorrect: true },
        { text: "animation", isCorrect: false },
        { text: "stylesheet", isCorrect: false },
        { text: "viewport", isCorrect: false }
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
