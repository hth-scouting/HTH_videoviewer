-- レセプション判定クイズ用のテーブル。
-- Supabase の SQL Editor に貼って一度だけ実行する。
--
-- このプロジェクトは単一チーム・認証なしなので、他のテーブルと同じく
-- anon キーのまま読み書きできるようにしてある。URL を知っている人は
-- 誰でもクイズに回答でき、誰でも成績を見られる。チーム内利用が前提。

-- --- クイズ本体 -------------------------------------------------------
-- questions は次の形の配列:
--   [{ "playId": 42, "start": 104.5, "stop": 111.2, "answer": "option",
--      "label": "Set1 10-08 #12 SAKAI R#" }, ...]
-- answer は 'option' | 'medium' | 'off'。
create table if not exists public.quizzes (
    id          uuid primary key default gen_random_uuid(),
    token       text not null unique,
    title       text,
    match_dvw   text not null,
    youtube_id  text,
    questions   jsonb not null default '[]'::jsonb,
    created_at  timestamptz not null default now()
);

-- --- 回答 -------------------------------------------------------------
-- 同じ背番号が何度でも挑戦できる。1 行 = 1 回の挑戦。
-- answers は [{ "q": 0, "a": "medium", "ok": false }, ...]
create table if not exists public.quiz_results (
    id          uuid primary key default gen_random_uuid(),
    quiz_token  text not null references public.quizzes(token) on delete cascade,
    jersey      int  not null,
    answers     jsonb not null default '[]'::jsonb,
    correct     int  not null default 0,
    total       int  not null default 0,
    created_at  timestamptz not null default now()
);

create index if not exists quiz_results_token_idx on public.quiz_results (quiz_token, created_at desc);

-- --- RLS --------------------------------------------------------------
alter table public.quizzes      enable row level security;
alter table public.quiz_results enable row level security;

drop policy if exists quizzes_anon_all      on public.quizzes;
drop policy if exists quiz_results_anon_all on public.quiz_results;

create policy quizzes_anon_all      on public.quizzes      for all to anon using (true) with check (true);
create policy quiz_results_anon_all on public.quiz_results for all to anon using (true) with check (true);
