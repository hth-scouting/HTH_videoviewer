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

## レセプション判定クイズ

`#/+/!` のレセプションを見せて、セッターが使えた選択肢が
**オプション / ミディアム / オフ** のどれだったかを当てさせる。公開版には無い、この版だけの機能。

**出題側** — メニュー →「クイズ」。作成パネルは動画の脇（狭い画面では下）に寄り、映像を見ながら作れる。開いている試合の `#/+/!` レセプションが並ぶので、
まず出題対象のチームを選ぶ（1本のクイズは片方のチームのレセプションだけを扱う。既定は自チーム）。
あとは1件ずつクリップを見て答えを決める。答えを押すと次の候補へ自動で進み、Skip なら出題から外す。作成するとURLが出る。発行済みクイズの一覧から
URLの再コピー・成績表示・削除ができる。成績は選手別の集計（挑戦回数・正解率・正解の種類ごとの正答率）、
設問別の正答率、回答ログの3段で見られる。

**回答側** — 配られた `?quiz=<token>` を開く。表示は英語のみ。背番号を入れると1問ずつ動画が流れ、
止まったところで大きな選択肢が出る。正誤はその場では出さず、最後にまとめて答え合わせを表示して成績を保存する。
回答モードでは送り・シーク・プレー一覧をすべて隠している。残すと先を見て答えられてしまう。

**出題区間** — サーブの1.5秒前から、次のアタック接触の `tail` 秒後まで（既定1.5秒）。
実データではレセプションからアタックまで中央値2秒だが、まれに9秒開く。そのままだと
ラリーの結末まで見せてしまうので、レセプション+5.5秒で頭打ちにしてある
(`quiz.js` の `MAX_AFTER_R`)。DVWの時刻は秒単位なので、下限も3.2秒で押さえている。

**構成** — `quiz.js` と `quiz.css` に閉じている。app.js 側のフックは3箇所だけ:
`getSafeURLParams()` の `quiz`、`parseDVW()` 末尾の `Quiz.onMatchParsed()`、
メニューの `openQuizAdmin()`。テーブルは `supabase/quiz.sql` を一度実行して作る。

認証が無いので、URLを知っていれば誰でも管理画面を開ける。他の機能（試合の追加・削除）と同じ前提。

## ファイル

| | |
|---|---|
| `index.html` / `app.js` / `style.css` | ビューア本体 |
| `dvw-parser.js` | .dvw パーサ (summary/player と共用) |
| `summary.html` / `player.html` | 試合サマリー・選手別ページ。`ss-common.js` + `ss-pages.css` を使う |
| `quiz.js` / `quiz.css` | レセプション判定クイズ。テーブルは `supabase/quiz.sql` |
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
