const STORAGE_KEY = "codeQuestStaticProgress:v1";

const categories = [
  {
    id: "html",
    name: "HTML",
    description: "Webページの骨組みを作るマークアップを学びます。",
    color: "#2563eb"
  },
  {
    id: "css",
    name: "CSS",
    description: "レイアウトと見た目を整えるCSSを学びます。",
    color: "#7c3aed"
  },
  {
    id: "javascript",
    name: "JavaScript",
    description: "Webに動きを加える基本文法を学びます。",
    color: "#d97706"
  },
  {
    id: "typescript",
    name: "TypeScript",
    description: "型安全なコードの書き方を学びます。",
    color: "#0284c7"
  },
  {
    id: "react",
    name: "React",
    description: "コンポーネントでUIを組み立てる方法を学びます。",
    color: "#0f766e"
  },
  {
    id: "database",
    name: "Database",
    description: "DBとPrismaの基本を学びます。",
    color: "#be123c"
  }
];

const quests = [
  {
    id: "choose-heading-tag",
    categoryId: "html",
    title: "見出しタグを選ぼう",
    description: "ページの大見出しに使うHTMLタグを選びます。",
    content: "Webページの一番大きな見出しに使う、もっとも適切なタグはどれですか？",
    explanation:
      "h1はページ内でもっとも重要な見出しを表すタグです。文書構造としての意味も持ちます。",
    type: "multiple",
    difficulty: "beginner",
    xpReward: 40,
    choices: ["<section>", "<h1>", "<span>", "<footer>"],
    answer: "<h1>"
  },
  {
    id: "center-with-flexbox",
    categoryId: "css",
    title: "中央寄せのFlexbox",
    description: "Flexboxで横方向の中央配置に使う指定を答えます。",
    content:
      "親要素にdisplay: flexを指定したとき、横方向の中央寄せに使うCSSプロパティと値を入力してください。",
    explanation:
      "Flexboxの主軸方向の配置にはjustify-contentを使います。横方向が主軸ならjustify-content: centerです。",
    type: "text",
    difficulty: "beginner",
    xpReward: 45,
    acceptedAnswers: ["justify-content: center", "justify-content:center"]
  },
  {
    id: "sum-array-function",
    categoryId: "javascript",
    title: "配列の合計を返す関数",
    description: "配列を受け取り、合計値を返す関数を書きます。",
    content:
      "numbersという数値配列を受け取り、すべての値の合計を返すsum関数を完成させてください。",
    explanation:
      "reduceを使うと、配列の各要素を1つの値にまとめられます。初期値0を渡すと空配列にも強くなります。",
    type: "code",
    difficulty: "normal",
    xpReward: 80,
    starterCode: "function sum(numbers) {\n  // ここに処理を書きます\n}",
    requiredTokens: ["function sum", "return", "reduce", "0"]
  },
  {
    id: "define-user-type",
    categoryId: "typescript",
    title: "User型を定義する",
    description: "TypeScriptのtypeでUserの形を定義します。",
    content: "idがstring、levelがnumberのUser型をtypeで定義してください。型名はUserにします。",
    explanation:
      "type User = { id: string; level: number } のように、オブジェクトの形を型として表せます。",
    type: "code",
    difficulty: "normal",
    xpReward: 90,
    starterCode: "// User型をここに定義してください",
    requiredTokens: ["type user", "id: string", "level: number"]
  },
  {
    id: "choose-state-hook",
    categoryId: "react",
    title: "状態を持つためのHook",
    description: "Reactで状態管理に使う基本Hookを選びます。",
    content: "Reactコンポーネント内で状態を持つために使う基本的なHookはどれですか？",
    explanation:
      "useStateはコンポーネント内に状態を持たせるためのHookです。入力値や表示切り替えなどによく使います。",
    type: "multiple",
    difficulty: "beginner",
    xpReward: 50,
    choices: ["useState", "useRouter", "useMemo", "useServer"],
    answer: "useState"
  },
  {
    id: "prisma-find-unique",
    categoryId: "database",
    title: "Prismaで1件取得する",
    description: "一意なレコードを取得するPrisma Clientのメソッド名を答えます。",
    content: "Prisma Clientで、idなど一意制約を使ってUserを1件取得する代表的なメソッド名は何ですか？",
    explanation:
      "findUniqueは一意制約に基づいて1件取得するメソッドです。idやuniqueなemailで検索するときに使います。",
    type: "text",
    difficulty: "normal",
    xpReward: 75,
    acceptedAnswers: ["findunique", "prisma.user.findunique"]
  },
  {
    id: "falsy-boss",
    categoryId: "javascript",
    title: "Falsyを見抜くBoss",
    description: "JavaScriptの真偽値変換を見極めるBoss問題です。",
    content: "次のうち、JavaScriptでBoolean(value)がfalseになるものはどれですか？",
    explanation:
      "空文字列はFalsyです。文字列'0'や空配列、空オブジェクトはTruthyになる点がよく混乱ポイントです。",
    type: "multiple",
    difficulty: "boss",
    xpReward: 160,
    choices: ['"0"', "[]", '""', "{}"],
    answer: '""'
  }
];

const badges = [
  {
    id: "first-clear",
    name: "First Clear",
    description: "はじめてクエストに正解する。",
    short: "1st",
    isEarned: (state) => state.totalCorrect >= 1
  },
  {
    id: "five-clear",
    name: "Five Wins",
    description: "5問に正解する。",
    short: "5x",
    isEarned: (state) => state.totalCorrect >= 5
  },
  {
    id: "boss-breaker",
    name: "Boss Breaker",
    description: "Boss難易度の問題に正解する。",
    short: "B",
    isEarned: (state) => state.completedQuestIds.includes("falsy-boss")
  },
  {
    id: "js-explorer",
    name: "JavaScript Explorer",
    description: "JavaScriptカテゴリのクエストをすべてクリアする。",
    short: "JS",
    isEarned: (state) => {
      const jsQuestIds = quests.filter((quest) => quest.categoryId === "javascript").map((quest) => quest.id);
      return jsQuestIds.every((questId) => state.completedQuestIds.includes(questId));
    }
  }
];

const emptyState = {
  xp: 0,
  totalCorrect: 0,
  completedQuestIds: [],
  submissions: []
};

const app = document.querySelector("#app");

function loadState() {
  try {
    const storedState = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return {
      ...emptyState,
      ...storedState,
      completedQuestIds: Array.isArray(storedState?.completedQuestIds)
        ? storedState.completedQuestIds
        : [],
      submissions: Array.isArray(storedState?.submissions) ? storedState.submissions : []
    };
  } catch {
    return { ...emptyState };
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function calculateLevel(xp) {
  return Math.floor(Math.sqrt(Math.max(xp, 0) / 120)) + 1;
}

function getTitle(level, totalCorrect) {
  if (totalCorrect >= 7) return "Code Quest Master";
  if (level >= 5) return "TypeScript Knight";
  if (level >= 3) return "React Explorer";
  return "Novice Adventurer";
}

function getCategory(categoryId) {
  return categories.find((category) => category.id === categoryId);
}

function normalizeAnswer(answer) {
  return String(answer).trim().replace(/\s+/g, " ").toLowerCase();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setCurrentNav() {
  const route = getRoute();
  document.querySelectorAll(".top-nav a").forEach((link) => {
    const href = link.getAttribute("href");
    const isCurrent =
      href === "#/" ? route.name === "home" : route.name !== "home" && href?.includes(route.name);
    if (isCurrent) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function getRoute() {
  const hash = window.location.hash || "#/";
  const parts = hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  if (parts[0] === "quests") return { name: "quests" };
  if (parts[0] === "quest" && parts[1]) return { name: "quest", questId: parts[1] };
  if (parts[0] === "history") return { name: "history" };
  if (parts[0] === "badges") return { name: "badges" };
  return { name: "home" };
}

function renderStatCards(state) {
  const level = calculateLevel(state.xp);
  const earnedBadgeCount = badges.filter((badge) => badge.isEarned(state)).length;
  return `
    <section class="stats-grid" aria-label="進捗サマリー">
      <article class="stat-card"><span>Level</span><strong>${level}</strong></article>
      <article class="stat-card"><span>XP</span><strong>${state.xp}</strong></article>
      <article class="stat-card"><span>Cleared</span><strong>${state.completedQuestIds.length}/${quests.length}</strong></article>
      <article class="stat-card"><span>Badges</span><strong>${earnedBadgeCount}</strong></article>
    </section>
  `;
}

function renderQuestCard(quest, state) {
  const category = getCategory(quest.categoryId);
  const completed = state.completedQuestIds.includes(quest.id);
  return `
    <a class="quest-card" href="#/quest/${quest.id}">
      <div>
        <div class="card-topline">
          <span class="pill category" style="background:${category.color}">${category.name}</span>
          <span class="pill ${quest.difficulty}">${quest.difficulty.toUpperCase()}</span>
        </div>
        <h3>${escapeHtml(quest.title)}</h3>
        <p>${escapeHtml(quest.description)}</p>
      </div>
      <div>
        <div class="progress-track" aria-hidden="true">
          <div class="progress-bar" style="width:${completed ? 100 : 0}%; background:${category.color}"></div>
        </div>
        <div class="quest-meta" style="margin-top:12px">
          <strong>${quest.xpReward} XP</strong>
          <span class="hint">${completed ? "Completed" : "Start"}</span>
        </div>
      </div>
    </a>
  `;
}

function renderHome() {
  const state = loadState();
  const level = calculateLevel(state.xp);
  const nextQuest = quests.find((quest) => !state.completedQuestIds.includes(quest.id)) ?? quests[0];
  app.innerHTML = `
    <section class="hero-grid">
      <div class="hero">
        <p class="eyebrow">Static GitHub Pages Edition</p>
        <h1>Code Quest</h1>
        <p>
          URLを開くだけで遊べるDBなし版です。問題、採点、XP、レベル、回答履歴はブラウザ内で動きます。
          本格運用向けのPrisma/PostgreSQL版は、このリポジトリのsrcとprismaに残しています。
        </p>
        <div class="hero-actions">
          <a class="button primary" href="#/quest/${nextQuest.id}">次のクエスト</a>
          <a class="button secondary" href="#/quests">一覧を見る</a>
        </div>
      </div>
      <img class="map-visual" src="./assets/code-quest-map.svg" alt="Code Questの学習マップ" />
    </section>
    ${renderStatCards(state)}
    <section class="panel" style="margin-top:18px">
      <h2>現在の称号</h2>
      <p class="lead">${getTitle(level, state.totalCorrect)}</p>
      <div class="progress-track" aria-label="全体の進捗">
        <div class="progress-bar" style="width:${Math.round((state.completedQuestIds.length / quests.length) * 100)}%"></div>
      </div>
    </section>
    <div class="section-head">
      <div>
        <h2>おすすめクエスト</h2>
        <p class="hint">未クリアの問題から表示しています。</p>
      </div>
      <a class="button secondary" href="#/quests">すべて見る</a>
    </div>
    <section class="quest-grid">
      ${quests
        .filter((quest) => !state.completedQuestIds.includes(quest.id))
        .slice(0, 3)
        .map((quest) => renderQuestCard(quest, state))
        .join("")}
    </section>
    <p class="footer-note">
      この静的版の進捗は端末ごとに保存されます。ログインや全端末共有が必要になったら、本格版をVercel + PostgreSQLで動かします。
    </p>
  `;
}

function renderQuests() {
  const state = loadState();
  app.innerHTML = `
    <section>
      <p class="eyebrow">Quest list</p>
      <h1 class="page-title">クエスト一覧</h1>
      <p class="lead">DBなし版でも、正解するとXPと履歴がブラウザに保存されます。</p>
    </section>
    <div class="toolbar" style="margin:20px 0">
      ${categories
        .map(
          (category) => `
            <a class="button secondary" href="#/quests" data-category-filter="${category.id}">
              ${category.name}
            </a>
          `
        )
        .join("")}
    </div>
    <section class="quest-grid" id="quest-grid">
      ${quests.map((quest) => renderQuestCard(quest, state)).join("")}
    </section>
  `;

  document.querySelectorAll("[data-category-filter]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const categoryId = button.getAttribute("data-category-filter");
      const filteredQuests = quests.filter((quest) => quest.categoryId === categoryId);
      document.querySelector("#quest-grid").innerHTML = filteredQuests
        .map((quest) => renderQuestCard(quest, loadState()))
        .join("");
    });
  });
}

function evaluateQuest(quest, formData) {
  if (quest.type === "multiple") {
    const selected = formData.get("answer");
    const isCorrect = selected === quest.answer;
    return {
      answer: selected || "",
      isCorrect,
      feedback: isCorrect ? "正解です。よく見抜けました。" : "惜しいです。解説を読んでもう一度挑戦しましょう。"
    };
  }

  const answer = formData.get("answer") || "";

  if (quest.type === "text") {
    const normalized = normalizeAnswer(answer);
    const isCorrect = quest.acceptedAnswers.map(normalizeAnswer).includes(normalized);
    return {
      answer,
      isCorrect,
      feedback: isCorrect
        ? "正解です。要点を押さえられています。"
        : "入力内容が想定と違います。スペルやキーワードを確認しましょう。"
    };
  }

  const normalizedCode = normalizeAnswer(answer);
  const isCorrect = quest.requiredTokens.every((token) => normalizedCode.includes(normalizeAnswer(token)));
  return {
    answer,
    isCorrect,
    feedback: isCorrect
      ? "正解です。必要な構文が入っています。"
      : "必要な構文がまだ足りません。スターターコードとヒントを見直しましょう。"
  };
}

function renderAnswerControl(quest) {
  if (quest.type === "multiple") {
    return `
      <fieldset class="choice-list">
        <legend class="hint">選択肢を1つ選んでください</legend>
        ${quest.choices
          .map(
            (choice) => `
              <label class="choice-option">
                <input type="radio" name="answer" value="${escapeHtml(choice)}" required />
                <span>${escapeHtml(choice)}</span>
              </label>
            `
          )
          .join("")}
      </fieldset>
    `;
  }

  if (quest.type === "text") {
    return `
      <label>
        <span class="hint">回答</span>
        <input class="answer-input" name="answer" placeholder="答えを入力" required />
      </label>
    `;
  }

  return `
    <label>
      <span class="hint">コード</span>
      <textarea class="code-input" name="answer" spellcheck="false" required>${escapeHtml(
        quest.starterCode
      )}</textarea>
    </label>
  `;
}

function renderQuest(questId) {
  const state = loadState();
  const quest = quests.find((item) => item.id === questId);

  if (!quest) {
    app.innerHTML = `<section class="panel"><h1>クエストが見つかりません</h1><a class="button primary" href="#/quests">一覧へ戻る</a></section>`;
    return;
  }

  const category = getCategory(quest.categoryId);
  const completed = state.completedQuestIds.includes(quest.id);
  app.innerHTML = `
    <section class="quest-layout">
      <article class="panel">
        <div class="quest-meta">
          <span class="pill category" style="background:${category.color}">${category.name}</span>
          <span class="pill ${quest.difficulty}">${quest.difficulty.toUpperCase()}</span>
          <span class="pill hard">${quest.xpReward} XP</span>
        </div>
        <h1 class="page-title" style="font-size:42px">${escapeHtml(quest.title)}</h1>
        <p class="lead">${escapeHtml(quest.description)}</p>
        <div class="question-box">${escapeHtml(quest.content)}</div>
        <form id="answer-form">
          ${renderAnswerControl(quest)}
          <div class="card-actions" style="margin-top:16px">
            <button class="button primary" type="submit">回答を提出</button>
            <a class="button secondary" href="#/quests">一覧へ戻る</a>
          </div>
        </form>
        <div id="result-slot"></div>
      </article>
      <aside class="panel">
        <h2>Your progress</h2>
        <p class="hint">${completed ? "このクエストはクリア済みです。" : "初回正解でXPを獲得できます。"}</p>
        <div class="progress-track" aria-hidden="true">
          <div class="progress-bar" style="width:${completed ? 100 : 0}%; background:${category.color}"></div>
        </div>
        <p class="footer-note">
          DBなし版では回答履歴はこのブラウザに保存されます。別端末とは共有されません。
        </p>
      </aside>
    </section>
  `;

  document.querySelector("#answer-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const evaluation = evaluateQuest(quest, formData);
    const currentState = loadState();
    const alreadyCompleted = currentState.completedQuestIds.includes(quest.id);
    const xpEarned = evaluation.isCorrect && !alreadyCompleted ? quest.xpReward : 0;
    const nextCompletedQuestIds =
      evaluation.isCorrect && !alreadyCompleted
        ? [...currentState.completedQuestIds, quest.id]
        : currentState.completedQuestIds;

    const nextState = {
      ...currentState,
      xp: currentState.xp + xpEarned,
      totalCorrect: currentState.totalCorrect + (evaluation.isCorrect && !alreadyCompleted ? 1 : 0),
      completedQuestIds: nextCompletedQuestIds,
      submissions: [
        {
          id: `${quest.id}-${Date.now()}`,
          questId: quest.id,
          questTitle: quest.title,
          categoryName: category.name,
          answer: evaluation.answer,
          isCorrect: evaluation.isCorrect,
          xpEarned,
          createdAt: new Date().toISOString()
        },
        ...currentState.submissions
      ].slice(0, 60)
    };

    saveState(nextState);
    const level = calculateLevel(nextState.xp);
    const earnedBadgeNames = badges.filter((badge) => badge.isEarned(nextState)).map((badge) => badge.name);

    document.querySelector("#result-slot").innerHTML = `
      <section class="result-panel ${evaluation.isCorrect ? "correct" : "retry"}">
        <h3>${evaluation.isCorrect ? "正解" : "もう一歩"}</h3>
        <p>${escapeHtml(evaluation.feedback)}</p>
        <p><strong>獲得XP:</strong> ${xpEarned}</p>
        <p><strong>現在:</strong> Lv.${level} / ${getTitle(level, nextState.totalCorrect)}</p>
        <div class="question-box" style="background:white">
          <strong>解説</strong>
          <p>${escapeHtml(quest.explanation)}</p>
        </div>
        ${
          earnedBadgeNames.length
            ? `<p><strong>獲得済みバッジ:</strong> ${earnedBadgeNames.map(escapeHtml).join(", ")}</p>`
            : ""
        }
      </section>
    `;
  });
}

function renderHistory() {
  const state = loadState();
  app.innerHTML = `
    <section>
      <p class="eyebrow">Submission history</p>
      <h1 class="page-title">回答履歴</h1>
      <p class="lead">このブラウザに保存された提出履歴です。</p>
      <div class="card-actions">
        <button class="button danger" id="reset-progress" type="button">進捗をリセット</button>
      </div>
    </section>
    <section class="history-list" style="margin-top:20px">
      ${
        state.submissions.length
          ? state.submissions
              .map(
                (submission) => `
                  <article class="history-item">
                    <div>
                      <strong>${escapeHtml(submission.questTitle)}</strong>
                      <p class="hint">${escapeHtml(submission.categoryName)} / ${new Intl.DateTimeFormat("ja-JP", {
                        dateStyle: "medium",
                        timeStyle: "short"
                      }).format(new Date(submission.createdAt))}</p>
                    </div>
                    <span class="pill ${submission.isCorrect ? "beginner" : "hard"}">
                      ${submission.isCorrect ? "Correct" : "Retry"}
                    </span>
                    <strong>${submission.xpEarned} XP</strong>
                  </article>
                `
              )
              .join("")
          : `<p class="empty-state">まだ回答履歴がありません。</p>`
      }
    </section>
  `;

  document.querySelector("#reset-progress").addEventListener("click", () => {
    const confirmed = window.confirm("このブラウザのCode Quest進捗をリセットしますか？");
    if (!confirmed) return;
    saveState({ ...emptyState });
    renderHistory();
  });
}

function renderBadges() {
  const state = loadState();
  app.innerHTML = `
    <section>
      <p class="eyebrow">Achievements</p>
      <h1 class="page-title">バッジ</h1>
      <p class="lead">正解数やBossクリアに応じて、このブラウザ内でバッジが解放されます。</p>
    </section>
    <section class="badge-grid" style="margin-top:20px">
      ${badges
        .map((badge) => {
          const earned = badge.isEarned(state);
          return `
            <article class="badge-card ${earned ? "" : "locked"}">
              <span class="badge-icon">${badge.short}</span>
              <h2>${escapeHtml(badge.name)}</h2>
              <p>${escapeHtml(badge.description)}</p>
              <strong>${earned ? "獲得済み" : "未獲得"}</strong>
            </article>
          `;
        })
        .join("")}
    </section>
  `;
}

function renderApp() {
  setCurrentNav();
  const route = getRoute();
  if (route.name === "quests") renderQuests();
  else if (route.name === "quest") renderQuest(route.questId);
  else if (route.name === "history") renderHistory();
  else if (route.name === "badges") renderBadges();
  else renderHome();
  app.focus({ preventScroll: true });
}

window.addEventListener("hashchange", renderApp);
renderApp();
