// =====================================================================
// quiz.js — レセプション判定クイズ
//
// #/+/! のレセプションを見せて、セッターが使えた選択肢が
// オプション / ミディアム / オフ のどれだったかを当てさせる。
//
// app.js のグローバル (player, allPlays, currentMatchDVW, matchMap,
// supabaseClient, escapeHtml, jsAttr, currentLang) を使う。
// app.js 側のフックは3箇所だけ:
//   - getSafeURLParams() に quiz を足す
//   - parseDVW() の末尾で Quiz.onMatchParsed()
//   - メニューの「クイズ」から openQuizAdmin()
// 公開版から app.js を取り直すときは、その3箇所を入れ直せばよい。
// =====================================================================

(function () {
'use strict';

const CHOICES = [
    { key: 'option', ja: 'オプション', en: 'Option', color: '#2F5BEA' },
    { key: 'medium', ja: 'ミディアム', en: 'Medium', color: '#F5A623' },
    { key: 'off',    ja: 'オフ',       en: 'Off',    color: '#E5484D' },
];
const CHOICE_OF = Object.fromEntries(CHOICES.map(c => [c.key, c]));

// 出題対象のレセプション評価。-, /, = は選択肢を考えるまでもないので外す。
const QUIZ_EFFECTS = ['#', '+', '!'];

// アタック接触の何秒前で止めるか。セッターの動きとトスは見せて、
// 打つ瞬間は見せない。
const DEFAULT_STOP_OFFSET = 0.5;

const STR = {
    quiz_menu:        { en: 'Quiz', ja: 'クイズ' },
    quiz_admin_title: { en: 'Reception quiz', ja: 'レセプション判定クイズ' },
    tab_list:         { en: 'Quizzes', ja: 'クイズ一覧' },
    tab_new:          { en: 'New quiz', ja: '新規作成' },
    no_quizzes:       { en: 'No quizzes yet.', ja: 'まだクイズがありません。' },
    load_fail:        { en: 'Could not load.', ja: '読み込めませんでした。' },
    q_title:          { en: 'Title', ja: 'タイトル' },
    q_title_ph:       { en: 'e.g. Reception reading #1', ja: '例: レセプション判定 第1回' },
    stop_offset:      { en: 'Stop before attack', ja: 'アタックの何秒前で止めるか' },
    pick_plays:       { en: 'Pick the receptions to use, and set the answer for each.', ja: '出題するレセプションを選び、1問ずつ正解を設定します。' },
    no_receptions:    { en: 'No #/+/! receptions in this match.', ja: 'この試合に #/+/! のレセプションがありません。' },
    load_match_first: { en: 'Open a match first.', ja: '先に試合を開いてください。' },
    preview:          { en: 'Preview', ja: '試聴' },
    selected_n:       { en: '{n} selected', ja: '{n}問 選択中' },
    unanswered_n:     { en: '{n} still need an answer', ja: '正解が未設定: {n}問' },
    create:           { en: 'Create quiz', ja: 'クイズを作成' },
    creating:         { en: 'Creating...', ja: '作成中...' },
    create_fail:      { en: 'Could not create the quiz.', ja: 'クイズを作成できませんでした。' },
    created:          { en: 'Quiz created. Send this URL to the team.', ja: 'クイズを作成しました。このURLを配ってください。' },
    copy:             { en: 'Copy', ja: 'コピー' },
    copied:           { en: 'Copied', ja: 'コピーしました' },
    results:          { en: 'Results', ja: '成績' },
    del:              { en: 'Delete', ja: '削除' },
    confirm_del:      { en: 'Delete this quiz and all its results?', ja: 'このクイズと回答記録をすべて削除しますか？' },
    del_fail:         { en: 'Could not delete.', ja: '削除できませんでした。' },
    no_results:       { en: 'Nobody has answered yet.', ja: 'まだ回答がありません。' },
    per_question:     { en: 'Correct rate per question', ja: '設問ごとの正答率' },
    attempts:         { en: 'Attempts', ja: '回答一覧' },
    close:            { en: 'Close', ja: '閉じる' },
    back:             { en: 'Back', ja: '戻る' },
    // 回答する側
    enter_jersey:     { en: 'Enter your jersey number', ja: '背番号を入力してください' },
    start_quiz:       { en: 'Start', ja: 'スタート' },
    jersey_required:  { en: 'Enter a number.', ja: '番号を入力してください。' },
    quiz_gone:        { en: 'This quiz no longer exists.', ja: 'このクイズは見つかりませんでした。' },
    loading:          { en: 'Loading...', ja: '読み込み中...' },
    which_options:    { en: 'What could the setter use?', ja: 'セッターが使えたのは？' },
    correct:          { en: 'Correct', ja: '正解' },
    wrong:            { en: 'Wrong', ja: '不正解' },
    answer_was:       { en: 'Answer: {a}', ja: '正解: {a}' },
    replay:           { en: 'Watch again', ja: 'もう一度見る' },
    next_q:           { en: 'Next', ja: '次へ' },
    see_result:       { en: 'See result', ja: '結果を見る' },
    your_score:       { en: 'Your score', ja: 'あなたの成績' },
    saving:           { en: 'Saving...', ja: '保存中...' },
    save_fail:        { en: 'Could not save your result.', ja: '成績を保存できませんでした。' },
    retry:            { en: 'Try again', ja: 'もう一度挑戦' },
    to_viewer:        { en: 'Open the viewer', ja: 'ビューアを開く' },
};

function s(key, rep) {
    const lang = (currentLang === 'ja') ? 'ja' : 'en';
    let out = (STR[key] && STR[key][lang]) || key;
    if (rep) Object.keys(rep).forEach(k => { out = out.replace('{' + k + '}', rep[k]); });
    return out;
}
function choiceLabel(key) {
    const c = CHOICE_OF[key];
    if (!c) return key;
    return (currentLang === 'ja') ? c.ja : c.en;
}
const esc = str => escapeHtml(String(str == null ? "" : str));

// --- 出題区間 --------------------------------------------------------
// サーブから見せて、次のアタックの直前で止める。ラリーをまたがないよう
// 次のサーブに当たったら打ち切る。
//
// レセプションからアタックまでは実データで中央値2秒・95%が3秒以内だが、
// たまに9秒後まで開く。そのままだと切り返しの応酬まで見せてしまい、
// 誰がどう決めたかで答えが割れるので上限をかける。DVW の時刻は秒単位で、
// レセプションとアタックが同じ秒になることもあるため下限も要る。
const MIN_AFTER_R = 1.2;   // パスの行方は必ず見せる
const MAX_AFTER_R = 3.5;   // ラリーの結末は見せない
function questionWindow(play, plays, stopOffset) {
    const i = plays.findIndex(p => p.id === play.id);
    let start = play.time - 3.0;
    for (let j = i - 1; j >= 0; j--) {
        if (plays[j].skill === 'S') { start = plays[j].time - 1.5; break; }
    }
    let attackTime = null;
    for (let j = i + 1; j < plays.length; j++) {
        if (plays[j].skill === 'S') break;
        if (plays[j].skill === 'A') { attackTime = plays[j].time; break; }
    }
    let stop = (attackTime === null) ? play.time + MAX_AFTER_R : attackTime - stopOffset;
    stop = Math.min(stop, play.time + MAX_AFTER_R);
    stop = Math.max(stop, play.time + MIN_AFTER_R);
    return { start: Math.max(0, Math.round(start * 10) / 10), stop: Math.round(stop * 10) / 10 };
}

function playLabel(d) {
    return `Set${d.setNum} ${d.score} #${d.pNum} ${d.pFullLabel || d.pName} (R${d.effect})`;
}

function receptionPlays() {
    const plays = allPlays || [];
    return plays.filter(p => p.skill === 'R' && QUIZ_EFFECTS.includes(p.effect));
}

function newToken() {
    const b = new Uint8Array(8);
    crypto.getRandomValues(b);
    return Array.from(b, x => x.toString(16).padStart(2, '0')).join('');
}

function quizURL(token) {
    const url = new URL(window.location.href);
    url.search = '';
    url.hash = '';
    url.searchParams.set('quiz', token);
    return url.toString();
}

async function copyText(text) {
    if (typeof copyToClipboard === "function") return copyToClipboard(text);
    try { await navigator.clipboard.writeText(text); return true; } catch { prompt('', text); return false; }
}

// 動画を区間再生する。stop で止まったら onStop を呼ぶ。
let clipTimer = null;
function stopClip() { if (clipTimer) { clearInterval(clipTimer); clipTimer = null; } }
function playClip(start, stop, onStop) {
    stopClip();
    if (!player || !player.seekTo) return;
    player.seekTo(start, true);
    player.playVideo();
    clipTimer = setInterval(() => {
        if (!player.getCurrentTime) return;
        const now = player.getCurrentTime();
        if (now >= stop) {
            stopClip();
            player.pauseVideo();
            if (onStop) onStop();
        }
    }, 80);
}

// =====================================================================
// 管理: クイズの作成・一覧・成績
// =====================================================================

function modalShell(inner, width) {
    const old = document.getElementById('quiz-modal');
    if (old) old.remove();
    const m = document.createElement('div');
    m.id = 'quiz-modal';
    m.className = 'quiz-modal';
    m.innerHTML = `<div class="quiz-modal-card" style="max-width:${width || 640}px">${inner}</div>`;
    m.addEventListener('click', e => { if (e.target === m) { stopClip(); m.remove(); } });
    document.body.appendChild(m);
    return m;
}
function closeQuizModal() { stopClip(); const m = document.getElementById('quiz-modal'); if (m) m.remove(); }

function openQuizAdmin() {
    if (!supabaseClient) return;
    renderQuizList();
}

async function renderQuizList() {
    const m = modalShell(`
        <div class="quiz-modal-head">
            <h3>${esc(s('quiz_admin_title'))}</h3>
            <button class="quiz-x" id="qz-close">&times;</button>
        </div>
        <div class="quiz-tabs">
            <button class="quiz-tab active">${esc(s('tab_list'))}</button>
            <button class="quiz-tab" id="qz-tab-new">${esc(s('tab_new'))}</button>
        </div>
        <div id="qz-body" class="quiz-scroll">${esc(s('loading'))}</div>`);
    document.getElementById('qz-close').onclick = closeQuizModal;
    document.getElementById('qz-tab-new').onclick = renderQuizNew;

    const { data, error } = await supabaseClient
        .from('quizzes').select('token, title, match_dvw, questions, created_at')
        .order('created_at', { ascending: false }).limit(100);
    const body = document.getElementById('qz-body');
    if (!body) return;
    if (error) { body.innerHTML = `<p class="quiz-err">${esc(s('load_fail'))}</p>`; return; }
    if (!data || !data.length) { body.innerHTML = `<p class="quiz-muted">${esc(s('no_quizzes'))}</p>`; return; }

    body.innerHTML = data.map(q => {
        const n = Array.isArray(q.questions) ? q.questions.length : 0;
        const when = q.created_at ? new Date(q.created_at).toLocaleDateString() : '';
        const name = q.title || prettyMatchName(q.match_dvw.split('/').pop()) || q.token;
        return `
        <div class="quiz-row">
            <div class="quiz-row-main">
                <div class="quiz-row-title">${esc(name)}</div>
                <div class="quiz-row-sub">${n}Q &middot; ${esc(when)}</div>
            </div>
            <button class="quiz-mini" data-copy="${esc(q.token)}">${esc(s('copy'))}</button>
            <button class="quiz-mini" data-results="${esc(q.token)}">${esc(s('results'))}</button>
            <button class="quiz-mini danger" data-del="${esc(q.token)}">${esc(s('del'))}</button>
        </div>`;
    }).join('');

    body.querySelectorAll('[data-copy]').forEach(b => b.onclick = async () => {
        if (await copyText(quizURL(b.dataset.copy))) { b.textContent = s('copied'); setTimeout(() => { b.textContent = s('copy'); }, 1500); }
    });
    body.querySelectorAll('[data-results]').forEach(b => b.onclick = () => renderQuizResults(b.dataset.results));
    body.querySelectorAll('[data-del]').forEach(b => b.onclick = async () => {
        if (!confirm(s('confirm_del'))) return;
        const { error: e2 } = await supabaseClient.from('quizzes').delete().eq('token', b.dataset.del);
        if (e2) { alert(s('del_fail')); return; }
        renderQuizList();
    });
}

function renderQuizNew() {
    const plays = receptionPlays();
    const head = `
        <div class="quiz-modal-head">
            <h3>${esc(s('tab_new'))}</h3>
            <button class="quiz-x" id="qz-close">&times;</button>
        </div>`;
    if (!currentMatchDVW || !plays.length) {
        modalShell(head + `<p class="quiz-muted">${esc(currentMatchDVW ? s('no_receptions') : s('load_match_first'))}</p>
            <div class="quiz-foot"><button class="quiz-btn" id="qz-back">${esc(s('back'))}</button></div>`);
        document.getElementById('qz-close').onclick = closeQuizModal;
        document.getElementById('qz-back').onclick = renderQuizList;
        return;
    }

    modalShell(head + `
        <div class="quiz-field">
            <label>${esc(s('q_title'))}</label>
            <input type="text" id="qz-title" placeholder="${esc(s('q_title_ph'))}" autocomplete="off">
        </div>
        <div class="quiz-field">
            <label>${esc(s('stop_offset'))}: <b id="qz-off-val">${DEFAULT_STOP_OFFSET.toFixed(1)}s</b></label>
            <input type="range" id="qz-off" min="0" max="2" step="0.1" value="${DEFAULT_STOP_OFFSET}">
        </div>
        <p class="quiz-muted">${esc(s('pick_plays'))}</p>
        <div id="qz-body" class="quiz-scroll"></div>
        <div class="quiz-foot">
            <span class="quiz-count" id="qz-count"></span>
            <button class="quiz-btn" id="qz-back">${esc(s('back'))}</button>
            <button class="quiz-btn primary" id="qz-save">${esc(s('create'))}</button>
        </div>`, 720);

    document.getElementById('qz-close').onclick = closeQuizModal;
    document.getElementById('qz-back').onclick = renderQuizList;

    const picked = new Map();   // playId -> answer key ('' = 未設定)

    document.getElementById('qz-body').innerHTML = plays.map(p => `
        <div class="quiz-pick" data-pid="${p.id}">
            <label class="quiz-pick-head">
                <input type="checkbox" data-chk="${p.id}">
                <span class="quiz-eff eff-${p.effect === '#' ? 'perfect' : (p.effect === '+' ? 'good' : 'poor')}">${esc(p.effect)}</span>
                <span class="quiz-pick-label">${esc(playLabel(p))}</span>
            </label>
            <div class="quiz-pick-body">
                <div class="quiz-ans-row">
                    ${CHOICES.map(c => `<button class="quiz-ans" data-ans="${c.key}" data-pid="${p.id}">${esc(choiceLabel(c.key))}</button>`).join('')}
                </div>
                <button class="quiz-mini" data-prev="${p.id}">${esc(s('preview'))}</button>
            </div>
        </div>`).join('');

    const offEl = document.getElementById('qz-off');
    const offVal = document.getElementById('qz-off-val');
    offEl.oninput = () => { offVal.textContent = parseFloat(offEl.value).toFixed(1) + 's'; };

    function refreshCount() {
        const n = picked.size;
        const missing = [...picked.values()].filter(v => !v).length;
        document.getElementById('qz-count').textContent =
            s('selected_n', { n }) + (missing ? ' / ' + s('unanswered_n', { n: missing }) : '');
    }
    refreshCount();

    const body = document.getElementById('qz-body');
    body.querySelectorAll('[data-chk]').forEach(cb => cb.onchange = () => {
        const id = Number(cb.dataset.chk);
        const row = body.querySelector(`.quiz-pick[data-pid="${id}"]`);
        if (cb.checked) { if (!picked.has(id)) picked.set(id, ''); row.classList.add('on'); }
        else { picked.delete(id); row.classList.remove('on'); }
        refreshCount();
    });
    body.querySelectorAll('[data-ans]').forEach(b => b.onclick = () => {
        const id = Number(b.dataset.pid);
        const cb = body.querySelector(`[data-chk="${id}"]`);
        if (!cb.checked) { cb.checked = true; cb.dispatchEvent(new Event('change')); }
        picked.set(id, b.dataset.ans);
        body.querySelectorAll(`[data-ans][data-pid="${id}"]`).forEach(x => x.classList.remove('on'));
        b.classList.add('on');
        refreshCount();
    });
    body.querySelectorAll('[data-prev]').forEach(b => b.onclick = () => {
        const p = plays.find(x => x.id === Number(b.dataset.prev));
        if (!p) return;
        const w = questionWindow(p, allPlays, parseFloat(offEl.value));
        playClip(w.start, w.stop);
    });

    document.getElementById('qz-save').onclick = async (e) => {
        const ids = [...picked.keys()];
        if (!ids.length) return;
        const missing = ids.filter(id => !picked.get(id));
        if (missing.length) { alert(s('unanswered_n', { n: missing.length })); return; }

        const offset = parseFloat(offEl.value);
        const questions = ids.map(id => {
            const p = plays.find(x => x.id === id);
            const w = questionWindow(p, allPlays, offset);
            return { playId: id, start: w.start, stop: w.stop, answer: picked.get(id), label: playLabel(p) };
        });

        const btn = e.currentTarget;
        btn.disabled = true; btn.textContent = s('creating');
        const token = newToken();
        const { error } = await supabaseClient.from('quizzes').insert([{
            token,
            title: document.getElementById('qz-title').value.trim() || null,
            match_dvw: currentMatchDVW,
            youtube_id: (matchMap || {})[currentMatchDVW] || null,
            questions,
        }]);
        btn.disabled = false; btn.textContent = s('create');
        if (error) { console.error('quiz insert failed:', error); alert(s('create_fail') + '\n' + error.message); return; }
        showCreated(token);
    };
}

function showCreated(token) {
    const url = quizURL(token);
    modalShell(`
        <div class="quiz-modal-head">
            <h3>${esc(s('tab_new'))}</h3>
            <button class="quiz-x" id="qz-close">&times;</button>
        </div>
        <p class="quiz-muted">${esc(s('created'))}</p>
        <input type="text" class="quiz-url" id="qz-url" readonly value="${esc(url)}">
        <div class="quiz-foot">
            <button class="quiz-btn" id="qz-back">${esc(s('back'))}</button>
            <button class="quiz-btn primary" id="qz-copy">${esc(s('copy'))}</button>
        </div>`);
    document.getElementById('qz-close').onclick = closeQuizModal;
    document.getElementById('qz-back').onclick = renderQuizList;
    document.getElementById('qz-url').onclick = e => e.target.select();
    document.getElementById('qz-copy').onclick = async (e) => {
        if (await copyText(url)) { e.currentTarget.textContent = s('copied'); }
    };
}

async function renderQuizResults(token) {
    modalShell(`
        <div class="quiz-modal-head">
            <h3>${esc(s('results'))}</h3>
            <button class="quiz-x" id="qz-close">&times;</button>
        </div>
        <div id="qz-body" class="quiz-scroll">${esc(s('loading'))}</div>
        <div class="quiz-foot"><button class="quiz-btn" id="qz-back">${esc(s('back'))}</button></div>`, 680);
    document.getElementById('qz-close').onclick = closeQuizModal;
    document.getElementById('qz-back').onclick = renderQuizList;

    const [quizRes, resRes] = await Promise.all([
        supabaseClient.from('quizzes').select('questions').eq('token', token).maybeSingle(),
        supabaseClient.from('quiz_results').select('*').eq('quiz_token', token).order('created_at', { ascending: false }).limit(300),
    ]);
    const body = document.getElementById('qz-body');
    if (!body) return;
    if (resRes.error) { body.innerHTML = `<p class="quiz-err">${esc(s('load_fail'))}</p>`; return; }
    const rows = resRes.data || [];
    if (!rows.length) { body.innerHTML = `<p class="quiz-muted">${esc(s('no_results'))}</p>`; return; }

    const questions = (quizRes.data && Array.isArray(quizRes.data.questions)) ? quizRes.data.questions : [];
    const perQ = questions.map((q, i) => {
        const seen = rows.filter(r => (r.answers || []).some(a => a.q === i));
        const ok = seen.filter(r => (r.answers || []).some(a => a.q === i && a.ok)).length;
        return { i, label: q.label || `Q${i + 1}`, answer: q.answer, n: seen.length, ok, pct: seen.length ? Math.round(ok / seen.length * 100) : null };
    });

    body.innerHTML = `
        <h4 class="quiz-sub">${esc(s('per_question'))}</h4>
        <table class="quiz-table">
            ${perQ.map(q => `<tr>
                <td class="qz-n">Q${q.i + 1}</td>
                <td class="qz-l">${esc(q.label)}</td>
                <td class="qz-a">${esc(choiceLabel(q.answer))}</td>
                <td class="qz-p">${q.pct === null ? '&ndash;' : q.pct + '%'}</td>
            </tr>`).join('')}
        </table>
        <h4 class="quiz-sub">${esc(s('attempts'))}</h4>
        <table class="quiz-table">
            ${rows.map(r => `<tr>
                <td class="qz-n">#${esc(r.jersey)}</td>
                <td class="qz-l">${r.total ? Math.round(r.correct / r.total * 100) : 0}%</td>
                <td class="qz-a">${esc(r.correct)} / ${esc(r.total)}</td>
                <td class="qz-p">${esc(r.created_at ? new Date(r.created_at).toLocaleString() : '')}</td>
            </tr>`).join('')}
        </table>`;
}

// =====================================================================
// 回答: ?quiz=<token>
// =====================================================================

let quiz = null;            // quizzes の行
let qIndex = 0;
let qJersey = null;
let qAnswers = [];
let matchReadyResolve = null;

function waitForMatch(dvw) {
    return new Promise(resolve => {
        if (currentMatchDVW === dvw && (allPlays || []).length) return resolve();
        matchReadyResolve = resolve;
        onMatchChange(dvw);
    });
}

function waitForPlayer() {
    return new Promise(resolve => {
        const tick = () => {
            if (player && player.loadVideoById && supabaseClient) resolve();
            else setTimeout(tick, 120);
        };
        tick();
    });
}

function ui() { return document.getElementById('quiz-ui'); }

function screenHTML(inner) { return `<div class="quiz-screen">${inner}</div>`; }

function showLoading() {
    ui().innerHTML = screenHTML(`<p class="quiz-big-muted">${esc(s('loading'))}</p>`);
}

function showGone() {
    ui().innerHTML = screenHTML(`
        <p class="quiz-big-muted">${esc(s('quiz_gone'))}</p>
        <a class="quiz-big-btn" href="${esc(quizExitURL())}">${esc(s('to_viewer'))}</a>`);
}

function quizExitURL() {
    const url = new URL(window.location.href);
    url.search = ''; url.hash = '';
    return url.toString();
}

function showJerseyEntry() {
    ui().innerHTML = screenHTML(`
        <h2 class="quiz-h2">${esc(quiz.title || s('quiz_admin_title'))}</h2>
        <p class="quiz-big-muted">${esc(s('enter_jersey'))}</p>
        <input class="quiz-jersey" id="qz-jersey" type="number" inputmode="numeric" min="0" max="99" autocomplete="off">
        <button class="quiz-big-btn primary" id="qz-go">${esc(s('start_quiz'))}</button>
        <p class="quiz-err" id="qz-jerr"></p>
        <button class="quiz-lang" id="qz-lang">${currentLang === 'ja' ? 'EN' : '日本語'}</button>`);
    const input = document.getElementById('qz-jersey');
    input.focus();
    // クイズのURLを初めて開いた端末は英語表示で始まる。ここでしか
    // 切り替えられないので、メニューが隠れている回答モードでも出しておく。
    document.getElementById('qz-lang').onclick = () => { toggleLang(); showJerseyEntry(); };
    const go = () => {
        const v = parseInt(input.value, 10);
        if (isNaN(v)) { document.getElementById('qz-jerr').textContent = s('jersey_required'); return; }
        qJersey = v;
        qIndex = 0; qAnswers = [];
        runQuestion();
    };
    document.getElementById('qz-go').onclick = go;
    input.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
}

function progressHTML() {
    return `<div class="quiz-progress">
        <span class="quiz-badge">#${esc(qJersey)}</span>
        <span>Q${qIndex + 1} / ${quiz.questions.length}</span>
    </div>`;
}

function runQuestion() {
    const q = quiz.questions[qIndex];
    ui().innerHTML = progressHTML() + `<div class="quiz-wait">${esc(s('which_options'))}</div>`;
    playClip(q.start, q.stop, showChoices);
}

function showChoices() {
    const q = quiz.questions[qIndex];
    ui().innerHTML = progressHTML() + `
        <div class="quiz-choices">
            <p class="quiz-ask">${esc(s('which_options'))}</p>
            <div class="quiz-choice-row">
                ${CHOICES.map(c => `<button class="quiz-choice" data-k="${c.key}" style="--c:${c.color}">${esc(choiceLabel(c.key))}</button>`).join('')}
            </div>
            <button class="quiz-replay" id="qz-replay">${esc(s('replay'))}</button>
        </div>`;
    ui().querySelectorAll('.quiz-choice').forEach(b => b.onclick = () => answer(b.dataset.k));
    document.getElementById('qz-replay').onclick = () => playClip(q.start, q.stop, showChoices);
}

function answer(key) {
    const q = quiz.questions[qIndex];
    const ok = key === q.answer;
    qAnswers.push({ q: qIndex, a: key, ok });
    const last = qIndex === quiz.questions.length - 1;
    ui().innerHTML = progressHTML() + `
        <div class="quiz-choices">
            <p class="quiz-verdict ${ok ? 'ok' : 'ng'}">${esc(ok ? s('correct') : s('wrong'))}</p>
            <p class="quiz-ask">${esc(s('answer_was', { a: choiceLabel(q.answer) }))}</p>
            <div class="quiz-choice-row">
                <button class="quiz-replay" id="qz-replay">${esc(s('replay'))}</button>
                <button class="quiz-big-btn primary" id="qz-next">${esc(last ? s('see_result') : s('next_q'))}</button>
            </div>
        </div>`;
    document.getElementById('qz-replay').onclick = () => playClip(q.start, q.stop);
    document.getElementById('qz-next').onclick = () => {
        stopClip();
        if (last) finish(); else { qIndex++; runQuestion(); }
    };
}

async function finish() {
    if (player && player.pauseVideo) player.pauseVideo();
    const correct = qAnswers.filter(a => a.ok).length;
    const total = quiz.questions.length;
    const pct = total ? Math.round(correct / total * 100) : 0;

    ui().innerHTML = screenHTML(`
        <h2 class="quiz-h2">${esc(s('your_score'))}</h2>
        <div class="quiz-score">${pct}<span>%</span></div>
        <p class="quiz-big-muted">#${esc(qJersey)} &middot; ${correct} / ${total}</p>
        <div class="quiz-review">
            ${qAnswers.map(a => `<span class="quiz-dot ${a.ok ? 'ok' : 'ng'}">${a.q + 1}</span>`).join('')}
        </div>
        <p class="quiz-err" id="qz-serr">${esc(s('saving'))}</p>
        <button class="quiz-big-btn" id="qz-retry">${esc(s('retry'))}</button>
        <a class="quiz-big-btn" href="${esc(quizExitURL())}">${esc(s('to_viewer'))}</a>`);
    document.getElementById('qz-retry').onclick = () => showJerseyEntry();

    const { error } = await supabaseClient.from('quiz_results').insert([{
        quiz_token: quiz.token, jersey: qJersey, answers: qAnswers, correct, total,
    }]);
    const err = document.getElementById('qz-serr');
    if (err) { err.textContent = error ? s('save_fail') : ''; }
    if (error) console.error('quiz result insert failed:', error);
}

async function boot(token) {
    document.body.classList.add('quiz-mode');
    const el = document.createElement('div');
    el.id = 'quiz-ui';
    document.body.appendChild(el);
    showLoading();

    await waitForPlayer();

    const { data, error } = await supabaseClient
        .from('quizzes').select('*').eq('token', token).maybeSingle();
    if (error || !data || !Array.isArray(data.questions) || !data.questions.length) {
        showGone();
        return;
    }
    quiz = data;

    await waitForMatch(quiz.match_dvw);

    // ビューア側の自動送りを止める。クイズは区間再生で自前に進める。
    if (checkInterval) clearInterval(checkInterval);
    currentIndex = -1;
    if (player.pauseVideo) player.pauseVideo();

    showJerseyEntry();
}

// --- app.js から呼ばれる口 ------------------------------------------
window.Quiz = {
    onMatchParsed() {
        if (matchReadyResolve) { const r = matchReadyResolve; matchReadyResolve = null; r(); }
    },
};
window.openQuizAdmin = openQuizAdmin;

const token = new URLSearchParams(window.location.search).get('quiz');
if (token) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => boot(token));
    else boot(token);
}

})();
