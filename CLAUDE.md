# realestate-app

不動産アプリケーションのプロジェクトです。

## プロジェクト概要

このディレクトリは不動産アプリ (`realestate-app`) のルートです。

## Git 運用ルール

### 基本方針

- **コードを変更するたびに GitHub へプッシュする**
- コミットは変更の意図が伝わる日本語または英語のメッセージで記録する
- `main` ブランチへの直接プッシュを基本とするが、大きな機能追加はフィーチャーブランチを切る

### コミット・プッシュ手順

コードを変更した後は、以下を必ず実行する:

```bash
git add <変更ファイル>
git commit -m "変更内容を端的に表すメッセージ"
git push origin main
```

### コミットメッセージ規則

| プレフィックス | 用途 |
|---|---|
| `feat:` | 新機能の追加 |
| `fix:` | バグ修正 |
| `refactor:` | リファクタリング |
| `style:` | スタイル・フォーマット変更 |
| `docs:` | ドキュメント更新 |
| `chore:` | 設定・依存関係の更新 |

### ブランチ戦略

- `main` — 本番相当の安定ブランチ
- `feature/<名前>` — 機能単位の開発ブランチ
- プルリクエストをマージしたら対応ブランチは削除する

### 注意事項

- `.env` や秘密情報を含むファイルは絶対にコミットしない
- `node_modules/` や `.next/` などビルド成果物はコミットしない
- 強制プッシュ (`git push --force`) は原則禁止

## 技術スタック

| 分類 | 技術 |
|---|---|
| フレームワーク | React 19 + Vite 6 |
| 認証・DB | Supabase |
| ルーティング | React Router v7 |
| スタイリング | CSS Modules |

## プロジェクト構成

```
src/
├── lib/
│   └── supabaseClient.js   # Supabaseクライアント初期化
├── contexts/
│   └── AuthContext.jsx     # 認証状態の管理（ログイン・登録・ログアウト）
├── components/
│   └── PrivateRoute.jsx    # 未ログイン時のリダイレクト処理
├── pages/
│   ├── Login.jsx           # ログイン画面
│   ├── Register.jsx        # 会員登録画面
│   ├── Auth.module.css     # 認証画面共通スタイル
│   ├── Properties.jsx      # 物件一覧画面
│   └── Properties.module.css
├── App.jsx                 # ルーティング設定
├── main.jsx                # エントリーポイント
└── index.css               # グローバルスタイル
```

## 環境変数

`.env` ファイルに以下を設定する（`.gitignore` で除外済み）:

```
VITE_SUPABASE_URL=<SupabaseのProject URL>
VITE_SUPABASE_ANON_KEY=<SupabaseのPublishable key>
```

## デプロイ情報

- 本番URL：https://プロジェクト名.vercel.app
- Supabaseプロジェクト名：realestate-app

## コマンド

```bash
# 開発サーバー起動（http://localhost:5173）
npm run dev

# 本番ビルド
npm run build

# ビルド結果のプレビュー
npm run preview
```
