# SyncScout HTH

DataVolley の .dvw と YouTube 動画を同期して見るビューア。
公開版 SyncScout (https://app.syncscout.courtend.net) の **v1.4.3** を土台に、
HTH 専用として認証まわりを外したもの。ビルド不要の静的サイト。

## 公開版との違い

| | 公開版 | この版 |
|---|---|---|
| ログイン | チームID + 合言葉 (Edge Function `team-login`) | なし。URL を知っていれば誰でも見られる |
| テナント | 複数チーム。全テーブルに `team_id`、RLS でチーム単位に分離 | 単一チーム。テーブルにチーム列なし |
| Supabase | `ciokifeakrkigonhwbyf` | `mqkoahmpuqjttlpubeoo` |
| 共有リンク | `share_links` のトークン (`s.php?p=…`)。失効可、OGPカード付き | 素の URL (`?match=…&t=…`)。失効なし |
| カテゴリ鍵 | カテゴリ別に合言葉をかけられる | なし |
| 利用ログ | `usage_events` に送信 | 送らない (`track()` は空関数) |
| 管理画面 | SaaS 用チーム管理コンソール | HTH 用の試合一覧・一括削除 (`team-admin.html`) |

公開版にあってこの版に無い機能は、ほぼすべて認証があって初めて成立するもの。
ビューア側の機能 (ハイライト抽出、テレストレータ、試合サマリー、プレイリスト、
タグ、PWA、iPad 操作) は公開版と同じものが入っている。

## 共有 URL

| 種類 | 形 | 出し方 |
|---|---|---|
| 試合 | `?match=<dvwのURL>` | メニュー →「試合のURLをコピー」/「試合を共有」/「試合をLINEで共有」 |
| プレー | `?match=…&t=<秒>` | プレーカードの Copy Link / LINE / WhatsApp |
| プレイリスト | `?match=…&ids=<id,id,…>` | 絞り込んだ状態で共有ボタン |
| タグ絞り込み | `?match=…&q=<#タグ>` | — |

いずれも `app.js` の `buildShareURL()` が組み立てる。

リンクプレビュー (LINE や iMessage に出るカード) は、どのリンクでも
`index.html` の og: タグが出る。公開版のようにプレーごとのカードを出すには
サーバ側で HTML を組み立てる必要があり、GitHub Pages ではできない。

## ファイル

| | |
|---|---|
| `index.html` / `app.js` / `style.css` | ビューア本体 |
| `dvw-parser.js` | .dvw パーサ (summary/player と共用) |
| `summary.html` / `player.html` | 試合サマリー・選手別ページ。`ss-common.js` + `ss-pages.css` を使う |
| `team-admin.html` | 試合の一覧・カテゴリ変更・一括削除 |
| `sync_scout_manual.html` | 使い方 (EN/JA) |
| `_legacy/list.txt` | Supabase 移行前の試合一覧。動作には使っていない |

## 公開版から機能を持ってくるとき

1. `curl https://app.syncscout.courtend.net/app.js` などで最新を取る
2. 差分を見て、必要な関数だけ移す
3. 認証依存の箇所を外す: `.eq('team_id', MY_TEAM_ID)`、`getStoredAuth()`、
   `IS_SHARE_VIEW`、`createShareLink()`、Edge Function の呼び出し

Supabase のテーブルにチーム列が無いので、`team_id` / `team_code` を書き込む
insert はそのままでは通らない。
