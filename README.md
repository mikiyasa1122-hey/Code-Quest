# Code Quest

Code Questは、クエストを攻略しながらプログラミングを学ぶフルスタックWebアプリです。

## 技術スタック

- Next.js App Router
- TypeScript
- Prisma
- PostgreSQL
- Tailwind CSS

## セットアップ

1. 依存関係をインストールします。

```bash
pnpm install
```

2. PostgreSQLを起動し、`.env`の`DATABASE_URL`を自分の環境に合わせます。

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/code_quest?schema=public"
AUTH_SECRET="change-this-secret-before-production"
```

3. Prismaのマイグレーションを実行します。

```bash
pnpm prisma:migrate
```

4. 初期データを投入します。

```bash
pnpm db:seed
```

5. 開発サーバーを起動します。

```bash
pnpm dev
```

## seedユーザー

一般ユーザー:

- email: `demo@codequest.local`
- password: `password123`

管理者:

- email: `admin@codequest.local`
- password: `admin12345`

## 主な機能

- ユーザー登録、ログイン、ログアウト
- カテゴリ別クエスト一覧
- 選択式、テキスト入力、コード入力の回答
- 回答履歴のDB保存
- 正解数、XP、レベル、称号の計算
- ストリークとバッジ付与
- 管理者による問題作成、編集

## 重要な実装メモ

- 回答提出は`/api/quests/[questId]/submit`で処理します。
- 採点、提出履歴保存、進捗更新、XP付与、レベル計算、称号更新、ストリーク更新、バッジ判定はDBトランザクション内で行います。
- `CODE_INPUT`は安全のためサーバー上で任意コードを実行しません。MVPでは採点用トークンを`|||`区切りで保存し、回答コードに含まれているかを確認します。
