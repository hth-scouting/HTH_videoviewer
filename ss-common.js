// =====================================================================
// ss-common.js — shared runtime for SyncScout sub-pages
// Used by summary.html and player.html. NOT loaded by index.html
// (app.js has its own i18n runtime based on data-i18n attributes).
//
// Each page defines its own `i18n` dictionary (script-global const)
// in its inline script; t() resolves against it at call time.
// Requires dvw-parser.js to be loaded first (loadMatchData uses it).
// =====================================================================

const PAGE_VERSION = '1.3.0';
const PAGE_PARAMS = new URLSearchParams(window.location.search);
const SRC_DVW = PAGE_PARAMS.get('dvw');
const SRC_DEMO = PAGE_PARAMS.has('demo');

// --- i18n runtime ---
let currentLang = localStorage.getItem('syncscout_lang') || 'en';
function switchLang() {
    currentLang = currentLang === 'en' ? 'ja' : 'en';
    localStorage.setItem('syncscout_lang', currentLang);
    return currentLang;
}
function t(key, rep) {
    let s = (i18n[currentLang] && i18n[currentLang][key]) || i18n.en[key] || key;
    if (rep) Object.keys(rep).forEach(k => { s = s.replace(`{${k}}`, rep[k]); });
    return s;
}
function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

// --- links to the viewer and between sub-pages ---
function appLink(q) {
    if (SRC_DEMO) return `index.html?demo&q=${encodeURIComponent(q)}`;
    return `index.html?match=${encodeURIComponent(SRC_DVW)}&q=${encodeURIComponent(q)}`;
}
function jump(q, label) {
    if (!SRC_DVW && !SRC_DEMO) return `<span class="jump-static">${label}</span>`;
    return `<a class="jump" href="${escapeHtml(appLink(q))}" target="_blank" rel="noopener">${label}</a>`;
}
function jumpIds(ids, label) {
    if (!ids || !ids.length || (!SRC_DVW && !SRC_DEMO)) return `<span class="jump-static">${label}</span>`;
    return jump('ids:' + ids.join(','), label);
}
function pageLink(page, extra) {
    const base = SRC_DEMO
        ? `${page}?v=${PAGE_VERSION}&local=1&demo=1`
        : `${page}?v=${PAGE_VERSION}&dvw=${encodeURIComponent(SRC_DVW)}`;
    return base + (extra || '');
}
function profileLink(side, num, label) {
    if (!SRC_DVW && !SRC_DEMO) return `<span class="jump-static">${label}</span>`;
    return `<a class="jump" href="${escapeHtml(pageLink('player.html', '&player=' + encodeURIComponent(side + '_' + num)))}" target="_blank" rel="noopener">${label}</a>`;
}
function summaryLink() { return pageLink('summary.html'); }
function mainLink() {
    if (SRC_DEMO) return 'index.html?demo';
    if (SRC_DVW) return `index.html?match=${encodeURIComponent(SRC_DVW)}`;
    return 'index.html';
}

// --- data loading (throws an i18n error key on failure) ---
async function loadMatchData() {
    let text = null;
    try {
        if (SRC_DVW) {
            const res = await fetch(SRC_DVW);
            if (!res.ok) throw new Error('fetch failed: ' + res.status);
            text = await res.text();
        } else if (PAGE_PARAMS.has('local')) {
            text = localStorage.getItem('ss_summary_dvw');
        }
    } catch (e) {
        console.error(e);
        throw 'err_fetch';
    }
    if (!text) throw 'err_no_param';
    const data = parseDVWCore(text);
    if (data.allPlays.length === 0) throw 'err_no_data';
    return data;
}
function showError(key) {
    document.getElementById('main').innerHTML = `<div class="empty-msg">${escapeHtml(t(key))}</div>`;
}
