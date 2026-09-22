// =====================================================================
// dvw-parser.js — shared DVW parsing core
// Used by app.js (main viewer), summary.html and player.html.
// Pure functions: no DOM access, no globals.
// =====================================================================

// --- Rotation stats (single source of truth for SO/BP math and color thresholds) ---
const ROT_ORDER = [1, 6, 5, 4, 3, 2];
const ROT_THRESHOLDS = { soHigh: 65, soLow: 50, bpHigh: 40, bpLow: 25 };

function computeRotationStats(rallies, side) {
    const opp = side === '*' ? 'a' : '*';
    const rotOf = d => side === '*' ? d.rallyHomeRot : d.rallyAwayRot;
    return ROT_ORDER.map(rot => {
        const so = rallies.filter(d => d.side === opp && rotOf(d) === rot);
        const bp = rallies.filter(d => d.side === side && rotOf(d) === rot);
        const soWon = so.filter(d => d.wonBy === side).length;
        const bpWon = bp.filter(d => d.wonBy === side).length;
        return {
            rot,
            soTot: so.length, soWon, soPct: so.length ? Math.round(soWon / so.length * 100) : 0,
            bpTot: bp.length, bpWon, bpPct: bp.length ? Math.round(bpWon / bp.length * 100) : 0,
            bpAce: bp.filter(d => d.effect === '#').length,
            bpErr: bp.filter(d => d.effect === '=').length,
        };
    });
}
function rotColorSO(pct) { return pct >= ROT_THRESHOLDS.soHigh ? 'var(--danger)' : (pct < ROT_THRESHOLDS.soLow ? 'var(--primary)' : 'var(--text)'); }
function rotColorBP(pct) { return pct >= ROT_THRESHOLDS.bpHigh ? 'var(--danger)' : (pct < ROT_THRESHOLDS.bpLow ? 'var(--primary)' : 'var(--text)'); }

// Display labels for players. A player's identity is (side, jersey number) —
// surnames repeat within a squad, so a shared surname gets the first initial
// appended to keep the two apart on screen.
// Returns key -> { short, full }: `short` for the compact play cards and the
// stats table, `full` where the whole surname fits (share cards, player page).
function buildPlayerLabels(playerMaster) {
    const groups = {};
    Object.keys(playerMaster).forEach(key => {
        const side = key.split('_')[0];
        const short = shortName(playerMaster[key].name);
        (groups[`${side}|${short}`] = groups[`${side}|${short}`] || []).push(key);
    });
    const labels = {};
    Object.values(groups).forEach(keys => {
        keys.forEach(key => {
            const p = playerMaster[key];
            const suffix = (keys.length > 1 && p.firstName) ? ` ${p.firstName.charAt(0)}.` : '';
            labels[key] = { short: shortName(p.name) + suffix, full: p.name + suffix };
        });
    });
    return labels;
}
function shortName(name) { return (name || '').split(' ')[0]; }

// opts.requireTime (default true): skip plays without a video timestamp,
// matching the main viewer's behavior so play ids stay identical across pages.
function parseDVWCore(text, opts = {}) {
    const requireTime = opts.requireTime !== false;
    const allPlays = [], rallies = [], playerMaster = {}, teams = [], setScores = [], points = [];
    const lines = text.split('\n');
    let currentSection = "", runningScore = "00-00", hSets = 0, aSets = 0, tempRally = null;
    let currentHomeRot = null, currentAwayRot = null, pointCodeCount = 0;

    lines.forEach(line => {
        const l = line.trim(); if (l.startsWith('[')) { currentSection = l; return; }
        if (currentSection === "[3TEAMS]") {
            const p = l.split(';'); if (p.length < 2) return;
            if (teams.length < 2) teams.push({ code: p[0], name: (p[1] || '').trim() });
        }
        if (currentSection === "[3PLAYERS-H]" || currentSection === "[3PLAYERS-V]") {
            const p = l.split(';'); const side = currentSection.includes('-H') ? '*' : 'a'; const num = parseInt(p[1]);
            if (!isNaN(num)) {
                const lastName = (p[9] || '').trim(), firstName = (p[10] || '').trim();
                playerMaster[`${side}_${num}`] = { name: lastName || firstName || `Player ${num}`, firstName, num };
            }
        }
        if (currentSection === "[3SCOUT]") {
            const c = l.split(';'); const code = c[0]; if (!code) return;
            if (code.startsWith('**') && code.toLowerCase().includes('set')) {
                const last = runningScore.split('-').map(Number);
                if (last[0] > last[1]) hSets++; else if (last[1] > last[0]) aSets++;
                if (last[0] > 0 || last[1] > 0) setScores.push({ h: last[0], a: last[1] });
                runningScore = "00-00"; return;
            }
            if (code.toLowerCase().match(/^[a-z\*]p/)) {
                const m = code.match(/(\d{1,2})[:.](\d{1,2})/);
                if (m) {
                    const oldH = parseInt(runningScore.split('-')[0]) || 0, oldA = parseInt(runningScore.split('-')[1]) || 0;
                    const newH = parseInt(m[1]) || 0, newA = parseInt(m[2]) || 0;
                    runningScore = `${m[1].padStart(2,'0')}-${m[2].padStart(2,'0')}`;
                    let scorer;
                    if (newH > oldH) scorer = '*'; else if (newA > oldA) scorer = 'a'; else scorer = code.toLowerCase().startsWith('*') ? '*' : 'a';
                    points.push({ setNum: hSets + aSets + 1, h: newH, a: newA, scorer });
                    if (tempRally) {
                        const t12 = parseFloat(c[12]); tempRally.rallyEndTime = isNaN(t12) ? (tempRally.startTime + 7.0) : t12;
                        tempRally.wonBy = scorer;
                    } pointCodeCount++;
                } return;
            }
            const skillChar = code.charAt(3);
            if ("SRABDE".includes(skillChar)) {
                const side = code.charAt(0), num = parseInt(code.substring(1,3)), time = parseFloat(c[12]);
                if (isNaN(num) || (requireTime && isNaN(time))) return;
                const p = playerMaster[`${side}_${num}`] || { name: `Player ${num}`, num };
                let rH = parseInt(c[9]); if (!isNaN(rH)) currentHomeRot = rH; else rH = currentHomeRot;
                let rA = parseInt(c[10]); if (!isNaN(rA)) currentAwayRot = rA; else rA = currentAwayRot;
                const playObj = { id: allPlays.length, time, startTime: time - 2.0, endTime: time + 5.0, score: runningScore, setNum: hSets+aSets+1, hSets, aSets, side, skill: skillChar, effect: code.charAt(5), pName: p.name, pNum: p.num, rot: (side === '*' ? rH : rA) || "?", rallyHomeRot: rH, rallyAwayRot: rA };
                // Extended scout-code fields (zone codes, not coordinates).
                // Layout: [6-7] combination, [9] start zone, [10] end zone, [11] end subzone, [12] hit type, [13] blockers
                const zs = code.charAt(9), ze = code.charAt(10), zsub = code.charAt(11), c4 = code.charAt(4), c12 = code.charAt(12), c13 = code.charAt(13);
                playObj.startZone = (zs >= '1' && zs <= '9') ? parseInt(zs) : null;
                playObj.endZone = (ze >= '1' && ze <= '9') ? parseInt(ze) : null;
                playObj.endSub = (zsub >= 'A' && zsub <= 'D') ? zsub : null;
                playObj.tempo = /^[A-Z]$/.test(c4) ? c4 : null;
                playObj.hitType = /^[A-Z]$/.test(c12) ? c12 : null;
                playObj.blockers = (c13 >= '0' && c13 <= '9') ? parseInt(c13) : null;
                playObj.combo = /^[A-Z0-9]{2}$/.test(code.substring(6, 8)) ? code.substring(6, 8) : null;
                if (skillChar === 'S') { tempRally = playObj; rallies.push(playObj); } else if (tempRally) { playObj.rallyHomeRot = tempRally.rallyHomeRot; playObj.rallyAwayRot = tempRally.rallyAwayRot; }
                allPlays.push(playObj);
            }
        }
    });

    // Final set may end without a "**Nset" marker (live / truncated files)
    const last = runningScore.split('-').map(Number);
    if (last[0] > 0 || last[1] > 0) setScores.push({ h: last[0], a: last[1] });

    const playerLabels = buildPlayerLabels(playerMaster);
    allPlays.forEach(d => {
        const l = playerLabels[`${d.side}_${d.pNum}`];
        d.pLabel = l ? l.short : shortName(d.pName);
        d.pFullLabel = l ? l.full : d.pName;
    });

    return { teams, playerMaster, playerLabels, allPlays, rallies, setScores, points, pointCodeCount };
}
