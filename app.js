const SUPABASE_URL = 'https://mqkoahmpuqjttlpubeoo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xa29haG1wdXFqdHRscHViZW9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5MDUyMDQsImV4cCI6MjA4OTQ4MTIwNH0.iIsfV5Cf_rPApNACbMvFVCiPZrLVDeGOYRB4op-0KCI';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function getSafeURLParams() {
    const params = new URLSearchParams(window.location.search);
    let q = params.get('q');
    const href = window.location.href;
    if (!q) {
        if (href.includes('q=#')) q = '#' + href.split('q=#')[1].split('&')[0];
        else if (href.includes('q=%23')) q = '#' + href.split('q=%23')[1].split('&')[0];
    }
    return { match: params.get('match'), t: params.get('t'), q: q ? decodeURIComponent(q) : null };
}

const urlParams = getSafeURLParams();
window.initLinkData = { t: urlParams.t, q: urlParams.q };

let player, allPlays = [], rallies = [], matchMap = {}, playerMaster = {}, allMatchData = [], currentMode = 'rally', currentIndex = -1, checkInterval;
let currentMatchDVW = "", currentCategory = "All", matchComments = {}, matchLikes = {}, matchDrawings = {}, likedPlaysSession = new Set();
const starterTags = ["#MB","#OH","#OP","#S","#L","#Good","#Bad","#System","#Transition","#BlockDefense","#Javi"];

function onYouTubeIframeAPIReady() { 
    player = new YT.Player('player', { 
        height:'100%', width:'100%', 
        playerVars:{'playsinline':1,'rel':0,'modestbranding':1}, 
        events:{'onReady':()=>{initTelestrator();fetchMatchList();},'onStateChange':onPlayerStateChange}
    }); 
}
const tag = document.createElement('script'); tag.src = "https://www.youtube.com/iframe_api"; document.head.appendChild(tag);

async function submitNewMatch() {
    const cat = document.getElementById('am-cat').value.trim();
    const ytUrl = document.getElementById('am-yt').value.trim();
    const fileInput = document.getElementById('am-file');
    
    if(!cat || !ytUrl || !fileInput.files.length) return alert("Please fill all fields.");

    let ytId = ytUrl;
    try {
        if(ytUrl.includes('v=')) ytId = ytUrl.split('v=')[1].split('&')[0];
        else if(ytUrl.includes('youtu.be/')) ytId = ytUrl.split('youtu.be/')[1].split('?')[0];
    } catch(e) {}

    const file = fileInput.files[0];
    const fileName = Date.now() + "_" + file.name;
    const btn = document.getElementById('am-submit-btn');
    btn.innerText = "Uploading..."; btn.disabled = true;

    try {
        const { error: uploadError } = await supabaseClient.storage.from('dvw_files').upload(fileName, file);
        if(uploadError) throw uploadError;

        const { data: urlData } = supabaseClient.storage.from('dvw_files').getPublicUrl(fileName);
        const publicUrl = urlData.publicUrl;

        const { error: dbError } = await supabaseClient.from('matches').insert([{ category: cat, dvw_filename: fileName, dvw_url: publicUrl, youtube_id: ytId }]);
        if(dbError) throw dbError;

        alert("Match added successfully!");
        document.getElementById('add-match-modal').style.display = 'none';
        document.getElementById('am-cat').value = ''; document.getElementById('am-yt').value = ''; document.getElementById('am-file').value = '';
        fetchMatchList(); 
    } catch(e) {
        console.error(e); alert("Failed to add match: " + e.message);
    } finally {
        btn.innerText = "Upload & Save"; btn.disabled = false;
    }
}

function fetchMatchList() {
    Promise.all([
        fetch('list.txt').then(res => res.ok ? res.text() : "").catch(()=>""),
        supabaseClient.from('matches').select('*').order('created_at', { ascending: false })
    ]).then(([txtData, dbRes]) => {
        allMatchData = []; let cats = new Set(["All"]);
        
        if(dbRes && dbRes.data) {
            dbRes.data.forEach(m => {
                allMatchData.push({ cat: m.category, dvw: m.dvw_url, vid: m.youtube_id, display_name: m.dvw_filename });
                cats.add(m.category);
            });
        }
        if(txtData) {
            txtData.split('\n').forEach(line => {
                const p = line.split(',').map(s => s.trim()); 
                if (p.length >= 3) { allMatchData.push({ cat: p[0], dvw: p[1], vid: p[2] }); cats.add(p[0]); }
            });
        }

        renderCategoryTabs(Array.from(cats)); updateMatchDropdown();
        
        const mParam = window.initLinkData.match || urlParams.match;
        if (mParam && matchMap[mParam]) { 
            document.getElementById('matchSelect').value = mParam; 
            onMatchChange(mParam); 
        } else if (allMatchData.length > 0) { 
            onMatchChange(allMatchData[0].dvw); 
            document.getElementById('matchSelect').value = allMatchData[0].dvw; 
        }
    });
}

function renderCategoryTabs(cats) {
    const div = document.getElementById('catTabs'); div.innerHTML = '';
    const mobSelect = document.getElementById('catSelectMobile'); if(mobSelect) mobSelect.innerHTML = '';
    const datalist = document.getElementById('existing-cats'); if(datalist) datalist.innerHTML = '';

    cats.forEach(c => {
        const btn = document.createElement('button'); btn.className = `cat-tab ${c === currentCategory ? 'active' : ''}`;
        btn.innerText = c; btn.onclick = () => { currentCategory = c; renderCategoryTabs(cats); updateMatchDropdown(); };
        div.appendChild(btn);
        
        if(mobSelect) {
            const opt = new Option(c, c);
            if(c === currentCategory) opt.selected = true;
            mobSelect.add(opt);
        }

        if(datalist && c !== "All") {
            const dOpt = document.createElement('option');
            dOpt.value = c;
            datalist.appendChild(dOpt);
        }
    });
}

function changeCategoryMobile(val) {
    currentCategory = val;
    const cats = Array.from(document.getElementById('catSelectMobile').options).map(o => o.value);
    renderCategoryTabs(cats);
    updateMatchDropdown();
}

function updateMatchDropdown() {
    const select = document.getElementById('matchSelect'); select.innerHTML = '<option value="">Select Match...</option>';
    matchMap = {};
    allMatchData.filter(m => currentCategory === "All" || m.cat === currentCategory).forEach(m => {
        matchMap[m.dvw] = m.vid; 
        let name = m.display_name ? m.display_name : m.dvw.replace('.dvw','');
        if(m.display_name && name.includes('_')) name = name.substring(name.indexOf('_') + 1); 
        select.add(new Option(name, m.dvw));
    });
}

function onMatchChange(dvw) { 
    if (!dvw || !matchMap[dvw]) return; 
    currentMatchDVW = dvw; 
    player.loadVideoById(matchMap[dvw]); 
    fetch(dvw).then(res => res.text()).then(parseDVW); 
}

function toggleSearchArea() { const area = document.getElementById('searchArea'); area.classList.toggle('show'); document.getElementById('searchArrow').innerText = area.classList.contains('show') ? '▲' : '▼'; }
function toggleShortcuts() { const modal = document.getElementById('shortcut-modal'); modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex'; }

async function loadCloudData() {
    const [cRes, lRes, dRes] = await Promise.all([
        supabaseClient.from('comments').select('*').eq('match_dvw', currentMatchDVW).order('created_at', { ascending: true }),
        supabaseClient.from('likes').select('play_id').eq('match_dvw', currentMatchDVW),
        supabaseClient.from('drawings').select('*').eq('match_dvw', currentMatchDVW).order('created_at', { ascending: false })
    ]);
    matchComments = {}; (cRes.data || []).forEach(r => { if (!matchComments[r.play_id]) matchComments[r.play_id] = []; matchComments[r.play_id].push(r.comment_text); });
    matchLikes = {}; (lRes.data || []).forEach(r => matchLikes[r.play_id] = (matchLikes[r.play_id] || 0) + 1);
    matchDrawings = {}; (dRes.data || []).forEach(r => { if (!matchDrawings[r.play_id]) { try { matchDrawings[r.play_id] = JSON.parse(r.drawing_data); } catch(e){} } });
}

function renderNotifications() {
    let notifArea = document.getElementById('notif-area');
    if (!notifArea) {
        notifArea = document.createElement('div');
        notifArea.id = 'notif-area';
        notifArea.style.cssText = 'background: #e3f2fd; border: 1px solid #bbdefb; border-radius: 8px; padding: 12px; margin-bottom: 15px; display: none;';
        const filterArea = document.getElementById('filterArea');
        filterArea.parentNode.insertBefore(notifArea, filterArea);
    }
    const commentedPlays = allPlays.filter(p => matchComments[p.id] && matchComments[p.id].length > 0);
    if (commentedPlays.length === 0) { notifArea.style.display = 'none'; return; }

    notifArea.style.display = 'block';
    let html = `<div style="font-size: 0.75rem; font-weight: bold; color: var(--primary); margin-bottom: 8px; display: flex; align-items: center; gap: 5px;">
        💬 Commented Plays <span style="background: var(--primary); color: white; padding: 2px 6px; border-radius: 10px; font-size: 0.6rem;">${commentedPlays.length}</span>
    </div>`;
    html += `<div style="display: flex; gap: 6px; flex-wrap: wrap; max-height: 90px; overflow-y: auto;">`;
    
    commentedPlays.forEach(p => {
        const shortName = p.pName.split(' ')[0];
        html += `<button onclick="jumpToPlayId(${p.id})" style="background: #fff; border: 1px solid #90caf9; border-radius: 12px; padding: 4px 8px; font-size: 0.75rem; color: var(--primary); cursor: pointer; font-weight: bold; transition: 0.2s; white-space: nowrap;">
            Set${p.setNum} [${p.score}] ${shortName}
        </button>`;
    });
    html += `</div>`;
    notifArea.innerHTML = html;
}

function jumpToPlayId(id) {
    document.getElementById('searchFilter').value = `id:${id}`;
    const searchArea = document.getElementById('searchArea');
    if (!searchArea.classList.contains('show')) toggleSearchArea();
    if (currentMode === 'stats' || currentMode === 'rotation') setMode('rally');
    render();
    if(currentData.length > 0) { playIndex(0); toggleActions(null, 0, true); }
}

async function parseDVW(text) {
    allPlays = []; rallies = []; playerMaster = {}; 
    const lines = text.split('\n'); 
    let currentSection = "", runningScore = "00-00", hSets = 0, aSets = 0, teamCount = 0, tempRally = null;
    let currentHomeRot = null, currentAwayRot = null;
    let pointCodeCount = 0;

    lines.forEach(line => {
        const l = line.trim(); if (l.startsWith('[')) { currentSection = l; return; }
        if (currentSection === "[3TEAMS]") { 
            const p = l.split(';'); if (p.length < 2) return; 
            if (teamCount === 0) { document.getElementById('ov-h-code').innerText = p[0]; teamCount++; } 
            else { document.getElementById('ov-a-code').innerText = p[0]; } 
        }
        if (currentSection === "[3PLAYERS-H]" || currentSection === "[3PLAYERS-V]") { 
            const p = l.split(';'); const side = currentSection.includes('-H') ? '*' : 'a'; const num = parseInt(p[1]); 
            if (!isNaN(num)) playerMaster[`${side}_${num}`] = { name: (p[9] || p[10] || `Player ${num}`).trim(), num }; 
        }
        if (currentSection === "[3SCOUT]") {
            const c = l.split(';'); const code = c[0]; if (!code) return;

            if (code.startsWith('**') && code.toLowerCase().includes('set')) { 
                const last = runningScore.split('-').map(Number); 
                if (last[0] > last[1]) hSets++; else if (last[1] > last[0]) aSets++; 
                runningScore = "00-00"; return; 
            }
            
            if (code.toLowerCase().startsWith('*p') || code.toLowerCase().startsWith('ap') || code.toLowerCase().startsWith('vp') || code.toLowerCase().match(/^[a-z\*]p/)) { 
                const m = code.match(/(\d{1,2})[:.](\d{1,2})/); 
                if (m) {
                    const oldH = parseInt(runningScore.split('-')[0]) || 0;
                    const oldA = parseInt(runningScore.split('-')[1]) || 0;
                    const newH = parseInt(m[1]) || 0;
                    const newA = parseInt(m[2]) || 0;
                    
                    runningScore = `${m[1].padStart(2,'0')}-${m[2].padStart(2,'0')}`; 
                    
                    if (tempRally) { 
                        tempRally.rallyEndTime = parseFloat(c[12]) || (tempRally.startTime + 6.0); 
                        if (newH > oldH) {
                            tempRally.wonBy = '*';  
                        } else if (newA > oldA) {
                            tempRally.wonBy = 'a'; 
                        } else {
                            tempRally.wonBy = code.toLowerCase().startsWith('*') ? '*' : 'a'; 
                        }
                    } 
                    pointCodeCount++;
                }
                return; 
            }
            
            const skillChar = code.charAt(3); 
            if ("SRABDE".includes(skillChar)) {
                const side = code.charAt(0), num = parseInt(code.substring(1,3)), time = parseFloat(c[12]);
                const p = playerMaster[`${side}_${num}`] || { name: `Player ${num}`, num };
                
                let rH = parseInt(c[9]); if (!isNaN(rH)) currentHomeRot = rH; else rH = currentHomeRot;
                let rA = parseInt(c[10]); if (!isNaN(rA)) currentAwayRot = rA; else rA = currentAwayRot;

                const rawCustom = code.substring(16).replace(/\D/g, '');
                const customCode = /^\d{2,3}/.test(rawCustom) ? rawCustom.match(/^\d{2,3}/)[0] : '';

                const playObj = {
                    id: allPlays.length, time, startTime: time - 2.0, endTime: time + 4.0, score: runningScore,
                    setNum: hSets+aSets+1, hSets, aSets, side, skill: skillChar, effect: code.charAt(5),
                    pName: p.name, pNum: p.num,
                    rot: (side === '*' ? rH : rA) || "?",
                    rallyHomeRot: rH, rallyAwayRot: rA,
                    customCode: skillChar === 'S' ? customCode : ''
                };
                
                if (skillChar === 'S') {
                    tempRally = playObj; 
                    rallies.push(playObj);
                } else if (tempRally) {
                    playObj.rallyHomeRot = tempRally.rallyHomeRot;
                    playObj.rallyAwayRot = tempRally.rallyAwayRot;
                }
                
                allPlays.push(playObj);
            }
        }
    });
    
    const autoNextCb = document.getElementById('autoNext');
    if (autoNextCb) autoNextCb.checked = (pointCodeCount > 0);
    
    updateFilters(); 
    await loadCloudData(); 
    renderNotifications(); 
    
    if (window.initLinkData.q) { 
        document.getElementById('searchFilter').value = window.initLinkData.q; 
        document.getElementById('searchArea').classList.add('show'); 
        document.getElementById('searchArrow').innerText = '▲'; 
    }

    render();

    if (window.initLinkData.t) { 
        setTimeout(() => { 
            const t = parseFloat(window.initLinkData.t); let targetIdx = 0, minDiff = Infinity; 
            currentData.forEach((d,i) => { let diff = Math.abs(d.startTime - t); if (diff < minDiff) { minDiff = diff; targetIdx = i; } }); 
            playIndex(targetIdx); 
            document.getElementById(`actions-${currentData[targetIdx].id}`)?.classList.add('show'); 
        }, 1000); 
    } else if (window.initLinkData.q && currentData.length > 0) {
        setTimeout(() => { playIndex(0); }, 1000);
    }
    
    window.initLinkData = { t: null, q: null, match: null };
}

function updateFilters() {
    const h = document.getElementById('ov-h-code').innerText, a = document.getElementById('ov-a-code').innerText;
    document.getElementById('teamFilterRally').innerHTML = `<option value="">Both Teams</option><option value="*">${h} Serves</option><option value="a">${a} Serves</option>`;
    document.getElementById('teamFilterPlayer').innerHTML = `<option value="">Team</option><option value="*">${h}</option><option value="a">${a}</option>`;
    document.getElementById('score-overlay').style.display = 'flex';
}

function onTeamChangePlayer() {
    const team = document.getElementById('teamFilterPlayer').value, ps = document.getElementById('playerFilter');
    ps.innerHTML = '<option value="">Player</option>'; if (!team) return;
    const seen = new Set(); allPlays.filter(p => p.side === team).forEach(p => { if (!seen.has(p.pName)) { ps.add(new Option(`#${p.pNum} ${p.pName}`, p.pName)); seen.add(p.pName); } }); render();
}

function setMode(m) { 
    currentMode = m; 
    document.querySelectorAll('.mode-tab').forEach(b => b.classList.remove('active')); 
    if(document.getElementById('btn-' + m)) document.getElementById('btn-' + m).classList.add('active'); 
    
    document.getElementById('filterArea').style.display = (m === 'stats' || m === 'rotation') ? 'none' : 'block'; 
    document.getElementById('rally-filters').style.display = (m === 'rally') ? 'block' : 'none'; 
    document.getElementById('player-filters').style.display = (m === 'player') ? 'block' : 'none'; 
    render(); 
}

let currentData = [];
function render() {
    const list = document.getElementById('instanceList'); list.innerHTML = ''; 
    if (currentMode === 'stats') { renderDualTables(); return; }
    if (currentMode === 'rotation') { renderRotationTables(); return; } 
    
    let data = [];
    const q = document.getElementById('searchFilter').value.toLowerCase().trim();

    if (q.startsWith('rot:')) {
        const parts = q.split(','); 
        const tSide = parts[0].replace('rot:', '').trim();
        const phase = parts[1]; 
        const rot = parseInt(parts[2]);
        
        if (phase === 'so') {
            const opp = tSide === '*' ? 'a' : '*'; 
            data = rallies.filter(d => d.side === opp && (tSide === '*' ? d.rallyHomeRot : d.rallyAwayRot) === rot);
        } else if (phase === 'bp') {
            data = rallies.filter(d => d.side === tSide && (tSide === '*' ? d.rallyHomeRot : d.rallyAwayRot) === rot);
        }
    } else if (q.startsWith('id:')) {
        const targetId = parseInt(q.replace('id:', '').trim());
        data = allPlays.filter(d => d.id === targetId);
    } else if (q) {
        data = allPlays.filter(d => `${d.pName} ${d.skill} ${(matchComments[d.id]||[]).join(' ')}`.toLowerCase().includes(q));
    } else {
        if (currentMode === 'rally') { 
            data = rallies;
            const teamF = document.getElementById('teamFilterRally').value; 
            if(teamF) data = data.filter(d => d.side === teamF); 
        } else { 
            data = allPlays;
            const teamF = document.getElementById('teamFilterPlayer').value; 
            if (!teamF) { list.innerHTML = '<div style="padding:20px; color:#888;">Please select a team</div>'; return; } 
            const pF = document.getElementById('playerFilter').value, sF = document.getElementById('skillFilter').value, eF = document.getElementById('effectFilter').value; 
            data = data.filter(d => d.side === teamF && (!pF || d.pName === pF) && (!sF || d.skill === sF) && (!eF || d.effect === eF)); 
        }
    }

    currentData = data;
    
    if (currentData.length === 0) {
        list.innerHTML = `<div style="padding:20px; color:#888;">No plays found.</div>`; return;
    }

    let lastSet = -1;
    currentData.forEach((d, i) => {
        if (d.setNum !== lastSet) { list.innerHTML += `<div class="stats-section-title" style="border:none; text-align:center; background:#eee; font-size:0.7rem;">SET ${d.setNum}</div>`; lastSet = d.setNum; }
        const winC = d.wonBy === '*' ? 'win-home' : (d.wonBy === 'a' ? 'win-away' : '');
        const likes = matchLikes[d.id] || 0, liked = likedPlaysSession.has(d.id) ? 'style="color:#d32f2f;"' : '';
        const btn = document.createElement('div'); btn.className = `instance-btn ${winC}`; btn.id = 'idx-'+i;
        
        // 💡 削除ボタン付きのコメントHTMLを生成
        const commentsHTML = (matchComments[d.id] || []).map(c => `
            <div class="comment-item">
                <span>・${c}</span>
                <span class="del-comment" onclick="event.stopPropagation(); deleteComment(${d.id}, '${c.replace(/'/g, "\\'")}')">✖</span>
            </div>
        `).join('');
        
        const hasDraw = (matchDrawings[d.id] && matchDrawings[d.id].length > 0) ? 'style="background:#ffebee; color:#d32f2f; border: 1px solid #ffcdd2;"' : '';
        
        const commentCount = (matchComments[d.id] || []).length;
        const noteBtnStyle = commentCount > 0 ? 'background:#e3f2fd; color:var(--primary); border:1px solid #bbdefb;' : '';
        const noteBtnText = commentCount > 0 ? `💬 Note (${commentCount})` : '💬 Note';

        btn.innerHTML = `
            <div class="card-main" onclick="playIndex(${i})">
                <div class="score-box">${d.score}</div>
                <div style="flex:1; line-height:1.2;"><strong>#${d.pNum} ${d.pName.split(' ')[0]}</strong><br><small style="color:var(--text-muted);">P${d.rot} | ${d.skill}${d.effect}</small></div>
            </div>
            <div class="top-right-actions">
                <button class="action-sm-btn" ${liked} onclick="event.stopPropagation(); addLike(${d.id})">👍 ${likes}</button>
                <button class="action-sm-btn draw-trigger-btn" ${hasDraw} onclick="event.stopPropagation(); enterDrawMode(${d.id})">✏️ Draw</button>
                <button class="action-sm-btn" style="${noteBtnStyle}" onclick="toggleActions(event, ${i})">${noteBtnText}</button>
            </div>
            <div class="card-actions" id="actions-${i}">
                <div class="comments-display" id="c-disp-${d.id}">${commentsHTML}</div>
                <div class="action-row">
                    <div class="tag-popup" id="tags-${d.id}">${starterTags.map(t => `<div class="tag-chip" onclick="applyTag(${d.id}, '${t}')">${t}</div>`).join('')}</div>
                    <button class="tag-trigger" onclick="event.stopPropagation(); toggleTagPopup(${d.id})">#</button>
                    
                    <div style="flex:1; position:relative;">
                        <input type="text" class="comment-input" id="c-input-${d.id}" placeholder="Add a comment... (e.g. mb, good)" autocomplete="off" oninput="handleSuggestInput(event, ${d.id})" onclick="event.stopPropagation()" style="width:100%;">
                        <div class="auto-suggest-box" id="suggest-${d.id}"></div>
                    </div>

                    <button class="action-btn add-btn" onclick="event.stopPropagation(); addComment(${d.id})">Send</button>
                </div>
                <div class="action-row" style="margin-top:2px;"><button class="action-btn copy-link-btn" onclick="event.stopPropagation(); copyLink(${d.startTime})">Copy Link</button><button class="action-btn line-btn" onclick="event.stopPropagation(); shareLine(${d.id}, ${d.startTime})">Share LINE</button></div>
            </div>
        `;
        list.appendChild(btn);
    });
}

function renderRotationTables() {
    const list = document.getElementById('instanceList'); list.innerHTML = ''; 
    ["*", "a"].forEach(side => { 
        const team = side === "*" ? document.getElementById('ov-h-code').innerText : document.getElementById('ov-a-code').innerText; 
        list.innerHTML += `<div class="stats-section-title">${team} Rotation Phase</div>
                           <div class="stats-container"><table class="stats-table" id="t-rot-${side}"></table></div>`; 
        buildRotationTable(side, `t-rot-${side}`); 
    });
}

function buildRotationTable(side, targetId) {
    let html = `<tr><th rowspan="2">Rot</th><th colspan="3">Side Out Phase</th><th colspan="5">Break Phase</th></tr>
                <tr><th>Tot</th><th>Won</th><th>SO %</th><th>Tot</th><th>Ace</th><th>Err</th><th>Won</th><th>BP %</th></tr>`;
    
    const rotOrder = [1, 6, 5, 4, 3, 2];
    
    rotOrder.forEach(r => {
        const oppSide = side === '*' ? 'a' : '*';
        const soRallies = rallies.filter(d => d.side === oppSide && (side === '*' ? d.rallyHomeRot : d.rallyAwayRot) === r);
        const soTot = soRallies.length;
        const soWon = soRallies.filter(d => d.wonBy === side).length; 
        const soPct = soTot ? Math.round((soWon / soTot) * 100) : 0;
        const soColor = soPct >= 65 ? '#d32f2f' : (soPct < 50 ? '#1976d2' : '#333'); 

        const bpRallies = rallies.filter(d => d.side === side && (side === '*' ? d.rallyHomeRot : d.rallyAwayRot) === r);
        const bpTot = bpRallies.length;
        const bpAce = bpRallies.filter(d => d.effect === '#').length;
        const bpErr = bpRallies.filter(d => d.effect === '=').length;
        const bpWon = bpRallies.filter(d => d.wonBy === side).length; 
        const bpPct = bpTot ? Math.round((bpWon / bpTot) * 100) : 0;
        const bpColor = bpPct >= 40 ? '#d32f2f' : (bpPct < 25 ? '#1976d2' : '#333');

        html += `<tr>
            <td class="p-cell" style="font-weight:bold; background:#f0f7ff;">P${r}</td>
            <td><span class="click-num" onclick="jumpToRotationRallies('${side}', ${r}, 'so')">${soTot}</span></td>
            <td>${soWon}</td>
            <td style="font-weight:bold; color:${soColor}">${soPct}%</td>
            <td><span class="click-num" onclick="jumpToRotationRallies('${side}', ${r}, 'bp')">${bpTot}</span></td>
            <td>${bpAce}</td>
            <td>${bpErr}</td>
            <td>${bpWon}</td>
            <td style="font-weight:bold; color:${bpColor}">${bpPct}%</td>
        </tr>`;
    });
    document.getElementById(targetId).innerHTML = html;
}

function jumpToRotationRallies(side, rNum, phase) {
    document.getElementById('searchFilter').value = `rot:${side},${phase},${rNum}`;
    const searchArea = document.getElementById('searchArea');
    if (!searchArea.classList.contains('show')) toggleSearchArea();
    setMode('rally');
    if(currentData.length > 0) playIndex(0);
}

function handleSuggestInput(e, playId) {
    const val = e.target.value; const cursorStart = e.target.selectionStart; const textBeforeCursor = val.substring(0, cursorStart);
    const words = textBeforeCursor.split(/\s+/); const currentWord = words[words.length - 1]; const suggestBox = document.getElementById(`suggest-${playId}`);
    if (currentWord.length > 0) {
        const searchStr = currentWord.replace(/^#/, '').toLowerCase();
        const matches = starterTags.filter(t => t.toLowerCase().includes(searchStr) || t.toLowerCase().replace(/^#/, '').includes(searchStr));
        if (matches.length > 0) {
            suggestBox.innerHTML = matches.map((m, idx) => `<div class="s-item ${idx === 0 ? 'active' : ''}" onclick="event.stopPropagation(); selectSuggest(${playId}, '${m}')">${m}</div>`).join('');
            suggestBox.style.display = 'block'; suggestBox.dataset.activeIdx = 0; suggestBox.dataset.word = currentWord; return;
        }
    }
    suggestBox.style.display = 'none';
}

function selectSuggest(playId, tag) {
    const input = document.getElementById(`c-input-${playId}`); const suggestBox = document.getElementById(`suggest-${playId}`);
    const currentWord = suggestBox.dataset.word; const val = input.value; const cursorStart = input.selectionStart;
    const textBeforeCursor = val.substring(0, cursorStart); const textAfterCursor = val.substring(cursorStart);
    const newTextBefore = textBeforeCursor.substring(0, textBeforeCursor.length - currentWord.length) + tag + ' ';
    input.value = newTextBefore + textAfterCursor; input.focus(); input.selectionStart = input.selectionEnd = newTextBefore.length; suggestBox.style.display = 'none';
}

function updateSuggestHighlight(suggestBox, index) { const items = suggestBox.querySelectorAll('.s-item'); items.forEach(el => el.classList.remove('active')); if(items[index]) items[index].classList.add('active'); suggestBox.dataset.activeIdx = index; }
function toggleTagPopup(playId) { const alreadyShow = document.getElementById(`tags-${playId}`).classList.contains('show'); hideAllTagPopups(); if(!alreadyShow) document.getElementById(`tags-${playId}`).classList.add('show'); }
function hideAllTagPopups() { document.querySelectorAll('.tag-popup').forEach(p => p.classList.remove('show')); document.querySelectorAll('.auto-suggest-box').forEach(p => p.style.display = 'none'); }
function applyTag(playId, tag) { const input = document.getElementById(`c-input-${playId}`); input.value = (input.value.trim() + " " + tag).trim() + " "; input.focus(); hideAllTagPopups(); }
function toggleActions(event, index, forceShow = false) { if(event) event.stopPropagation(); const actionsDiv = document.getElementById(`actions-${index}`); if(actionsDiv) { if(forceShow) actionsDiv.classList.add('show'); else actionsDiv.classList.toggle('show'); } }


/* =========================================
   お絵かき（Telestrator）機能
   ========================================= */
const canvas = document.getElementById('telestratorCanvas'); 
const ctx = canvas.getContext('2d');
let isDrawingMode = false, isDrawing = false, drawingLines = [], activePlayIdForDraw = null;
let currentDrawTool = 'freehand'; 
let currentShape = null; 
let currentPath = [];

function setDrawTool(tool) {
    currentDrawTool = tool;
    document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('tool-' + tool).classList.add('active');
}

function initTelestrator() { 
    resizeCanvas(); window.addEventListener('resize', resizeCanvas); 
    canvas.addEventListener('mousedown', startDrawing); canvas.addEventListener('mousemove', draw); 
    canvas.addEventListener('mouseup', stopDrawing); 
    canvas.addEventListener('touchstart', startDrawing, {passive:false}); 
    canvas.addEventListener('touchmove', draw, {passive:false}); 
    canvas.addEventListener('touchend', stopDrawing); 
}

function resizeCanvas() { 
    const box = document.getElementById('player-box'); if(!box) return; 
    canvas.width = box.offsetWidth; canvas.height = box.offsetHeight; 
    renderDrawing(); 
}

function getNormPos(e) { 
    const rect = canvas.getBoundingClientRect(); let cX = e.clientX, cY = e.clientY; 
    if (e.touches && e.touches.length > 0) { cX = e.touches[0].clientX; cY = e.touches[0].clientY; } 
    return { x: (cX - rect.left) / canvas.width, y: (cY - rect.top) / canvas.height }; 
}

function startDrawing(e) { 
    if (!isDrawingMode) return; 
    e.preventDefault(); isDrawing = true; 
    const pos = getNormPos(e);
    if (currentDrawTool === 'freehand') {
        currentPath = [pos];
    } else {
        currentShape = { type: currentDrawTool, start: pos, end: pos };
    }
}

function draw(e) { 
    if (!isDrawing || !isDrawingMode) return; 
    e.preventDefault(); 
    const pos = getNormPos(e);
    if (currentDrawTool === 'freehand') {
        currentPath.push(pos);
    } else {
        currentShape.end = pos; 
    }
    renderDrawing(); 
}

function stopDrawing() { 
    if (!isDrawing) return;
    isDrawing = false; 
    if (currentDrawTool === 'freehand' && currentPath.length > 1) {
        drawingLines.push(currentPath);
    } else if (currentShape && (currentShape.start.x !== currentShape.end.x || currentShape.start.y !== currentShape.end.y)) {
        drawingLines.push(currentShape);
    }
    currentPath = []; currentShape = null;
    renderDrawing();
}

function drawItem(ctx, item, w, h) {
    if (Array.isArray(item)) { 
        if (item.length < 2) return;
        ctx.beginPath(); ctx.moveTo(item[0].x * w, item[0].y * h);
        for (let i = 1; i < item.length; i++) ctx.lineTo(item[i].x * w, item[i].y * h);
        ctx.stroke();
    } else if (item.type === 'arrow') {
        const headlen = 15; 
        const dx = item.end.x * w - item.start.x * w; const dy = item.end.y * h - item.start.y * h;
        const angle = Math.atan2(dy, dx);
        ctx.beginPath(); 
        ctx.moveTo(item.start.x * w, item.start.y * h); ctx.lineTo(item.end.x * w, item.end.y * h);
        ctx.lineTo(item.end.x * w - headlen * Math.cos(angle - Math.PI/6), item.end.y * h - headlen * Math.sin(angle - Math.PI/6));
        ctx.moveTo(item.end.x * w, item.end.y * h);
        ctx.lineTo(item.end.x * w - headlen * Math.cos(angle + Math.PI/6), item.end.y * h - headlen * Math.sin(angle + Math.PI/6));
        ctx.stroke();
    } else if (item.type === 'circle') {
        const rx = Math.abs(item.end.x - item.start.x) * w / 2; const ry = Math.abs(item.end.y - item.start.y) * h / 2;
        const cx = (item.start.x + item.end.x) * w / 2; const cy = (item.start.y + item.end.y) * h / 2;
        ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, 2 * Math.PI); ctx.stroke();
    } else if (item.type === 'rect') {
        const x = Math.min(item.start.x, item.end.x) * w; const y = Math.min(item.start.y, item.end.y) * h;
        const width = Math.abs(item.end.x - item.start.x) * w; const height = Math.abs(item.end.y - item.start.y) * h;
        ctx.beginPath(); ctx.rect(x, y, width, height); ctx.stroke();
    }
}

function renderDrawing() { 
    ctx.clearRect(0,0,canvas.width,canvas.height); 
    ctx.strokeStyle = '#d32f2f'; ctx.lineWidth = 4; ctx.lineCap = 'round'; 
    drawingLines.forEach(item => drawItem(ctx, item, canvas.width, canvas.height)); 
    if (isDrawing) {
        if (currentDrawTool === 'freehand' && currentPath.length > 0) { drawItem(ctx, currentPath, canvas.width, canvas.height); } 
        else if (currentShape) { drawItem(ctx, currentShape, canvas.width, canvas.height); }
    }
}

function enterDrawMode(playId) { 
    player.pauseVideo(); isDrawingMode = true; activePlayIdForDraw = playId; 
    canvas.classList.add('drawing-mode'); document.getElementById('draw-toolbar').style.display = 'flex'; 
    resizeCanvas(); drawingLines = matchDrawings[playId] ? JSON.parse(JSON.stringify(matchDrawings[playId])) : []; 
    renderDrawing(); 
}
function exitDrawMode() { 
    isDrawingMode = false; canvas.classList.remove('drawing-mode'); 
    document.getElementById('draw-toolbar').style.display = 'none'; 
    ctx.clearRect(0,0,canvas.width,canvas.height); 
}
function clearCanvas() { drawingLines = []; renderDrawing(); }

// 💡 新設：直前に書いた図形・線を1つ消す
function undoDrawing() {
    if (drawingLines.length > 0) {
        drawingLines.pop();
        renderDrawing();
    }
}

async function saveDrawing() { 
    matchDrawings[activePlayIdForDraw] = JSON.parse(JSON.stringify(drawingLines)); 
    render(); exitDrawMode(); player.playVideo(); 
    await supabaseClient.from('drawings').delete().match({ match_dvw: currentMatchDVW, play_id: activePlayIdForDraw }); 
    await supabaseClient.from('drawings').insert([{ match_dvw: currentMatchDVW, play_id: activePlayIdForDraw, drawing_data: JSON.stringify(matchDrawings[activePlayIdForDraw]) }]); 
}

/* ========================================= */

async function addLike(playId) { if (likedPlaysSession.has(playId)) return; likedPlaysSession.add(playId); matchLikes[playId] = (matchLikes[playId] || 0) + 1; render(); await supabaseClient.from('likes').insert([{ match_dvw: currentMatchDVW, play_id: playId }]); }
async function addComment(playId) { const input = document.getElementById(`c-input-${playId}`); const text = input.value.trim(); if (!text) return; if (!matchComments[playId]) matchComments[playId] = []; matchComments[playId].push(text); input.value = ""; renderNotifications(); render(); await supabaseClient.from('comments').insert([{ match_dvw: currentMatchDVW, play_id: playId, comment_text: text }]); }

// 💡 新設：コメントの削除処理
async function deleteComment(playId, text) {
    if(!confirm("Are you sure you want to delete this comment?")) return;
    
    // ローカル配列から削除
    const idx = matchComments[playId].indexOf(text);
    if(idx > -1) matchComments[playId].splice(idx, 1);
    
    renderNotifications();
    render();
    
    // Supabaseからも削除（テキスト一致で削除）
    await supabaseClient.from('comments').delete().match({ match_dvw: currentMatchDVW, play_id: playId, comment_text: text });
}

function getSafeBaseUrl() { return window.location.origin + window.location.pathname; }
function getLink(startTime) { const u = new URL(getSafeBaseUrl()); u.searchParams.set('match', currentMatchDVW); u.searchParams.set('t', Math.floor(startTime)); return u.toString(); }
function copyLink(startTime) { navigator.clipboard.writeText(getLink(startTime)).then(() => alert("Link copied!")); }
function shareLine(playId, startTime) { const link = getLink(startTime); window.open(`https://line.me/R/msg/text/?${encodeURIComponent("【SyncScout Analysis】Check this play!\n\n" + link)}`, '_blank'); }
function copyPlaylistLink() { const q = document.getElementById('searchFilter').value.trim(); const u = new URL(getSafeBaseUrl()); u.searchParams.set('match', currentMatchDVW); if(q) u.searchParams.set('q',q); navigator.clipboard.writeText(u.toString()).then(() => alert("Playlist link copied!")); }
function sharePlaylist() { const q = document.getElementById('searchFilter').value.trim(); const u = new URL(getSafeBaseUrl()); u.searchParams.set('match', currentMatchDVW); if(q) u.searchParams.set('q',q); window.open(`https://line.me/R/msg/text/?${encodeURIComponent("【SyncScout Playlist】\n" + u.toString())}`, '_blank'); }

function renderDualTables() { const list = document.getElementById('instanceList'); list.innerHTML = ''; ["*", "a"].forEach(side => { const team = side === "*" ? document.getElementById('ov-h-code').innerText : document.getElementById('ov-a-code').innerText; list.innerHTML += `<div class="stats-section-title">${team} Statistics</div><div class="stats-container"><table class="stats-table" id="t-${side}"></table></div>`; buildTable(side, `t-${side}`); }); }
function buildTable(side, targetId) {
    const ps = []; const seen = new Set();
    allPlays.filter(p => p.side === side).forEach(p => { if (!seen.has(p.pName)) { ps.push({ name: p.pName, num: p.pNum }); seen.add(p.pName); } });
    ps.sort((a,b) => a.num - b.num);
    let html = `<tr><th rowspan="2">Player</th><th colspan="3">Serve</th><th colspan="4">Rec</th><th colspan="4">Attack</th></tr><tr><th>Tot</th><th>Ace</th><th>Err</th><th>Tot</th><th>Err</th><th>#+%</th><th>#%</th><th>Tot</th><th>Kill</th><th>Err</th><th>%</th></tr>`;
    ps.forEach(p => {
        const pl = allPlays.filter(play => play.pName === p.name && play.side === side);
        const s = pl.filter(d => d.skill === 'S'), r = pl.filter(d => d.skill === 'R'), a = pl.filter(d => d.skill === 'A');
        const sAce = s.filter(d => d.effect === '#').length, sErr = s.filter(d => d.effect === '=').length; 
        const rErr = r.filter(d => d.effect === '=').length, rPerf = r.filter(d => d.effect === '#').length, rPos = r.filter(d => d.effect === '+').length;
        const aKill = a.filter(d => d.effect === '#').length, aLoss = a.filter(d => d.effect === '=' || d.effect === '/').length;
        const short = p.name.split(' ')[0], esc = p.name.replace(/'/g, "\\'");
        html += `<tr><td class="p-cell">#${p.num} ${short}</td>
            <td><span class="click-num" onclick="jumpToStat('${side}','${esc}','S','')">${s.length}</span></td>
            <td><span class="click-num" onclick="jumpToStat('${side}','${esc}','S','#')">${sAce}</span></td>
            <td><span class="click-num" onclick="jumpToStat('${side}','${esc}','S','=')">${sErr}</span></td>
            <td><span class="click-num" onclick="jumpToStat('${side}','${esc}','R','')">${r.length}</span></td>
            <td><span class="click-num" onclick="jumpToStat('${side}','${esc}','R','=')">${rErr}</span></td>
            <td>${r.length?Math.round((rPerf+rPos)/r.length*100):0}%</td>
            <td>${r.length?Math.round(rPerf/r.length*100):0}%</td>
            <td><span class="click-num" onclick="jumpToStat('${side}','${esc}','A','')">${a.length}</span></td>
            <td><span class="click-num" onclick="jumpToStat('${side}','${esc}','A','#')">${aKill}</span></td>
            <td><span class="click-num" onclick="jumpToStat('${side}','${esc}','A','loss')">${aLoss}</span></td>
            <td>${a.length?((aKill/a.length)*100).toFixed(1):'0.0'}%</td></tr>`;
    });
    document.getElementById(targetId).innerHTML = html;
}

function jumpToStat(side, pName, skill, eff) { 
    document.getElementById('searchFilter').value = ''; 
    document.getElementById('searchArea').classList.remove('show'); 
    setMode('player'); 
    document.getElementById('teamFilterPlayer').value = side; 
    onTeamChangePlayer(); 
    document.getElementById('playerFilter').value = pName; 
    document.getElementById('skillFilter').value = skill; 
    document.getElementById('effectFilter').value = eff; 
    render(); 
    if (currentData.length > 0) playIndex(0); 
}

function playIndex(i) {
    if (i < 0 || i >= currentData.length) return; currentIndex = i; const d = currentData[i]; player.seekTo(d.startTime, true); player.playVideo();
    document.getElementById('ov-h-sets').innerText = d.hSets; document.getElementById('ov-a-sets').innerText = d.aSets;
    const s = d.score.split('-'); document.getElementById('ov-h-score').innerText = parseInt(s[0]) || 0; document.getElementById('ov-a-score').innerText = parseInt(s[1]) || 0;
    resizeCanvas(); if (matchDrawings[d.id]) { drawingLines = matchDrawings[d.id]; renderDrawing(); } else { ctx.clearRect(0,0,canvas.width,canvas.height); }
    document.querySelectorAll('.instance-btn').forEach(b => b.classList.remove('active')); document.getElementById('idx-' + i)?.classList.add('active');
    document.getElementById('idx-' + i)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const scOverlay = document.getElementById('serve-code-overlay');
    if (d.skill === 'S' && d.customCode) { scOverlay.innerText = d.customCode; scOverlay.style.display = 'block'; }
    else { scOverlay.style.display = 'none'; }
}
function playNext() { if (currentIndex < currentData.length - 1) playIndex(currentIndex + 1); }
function playPrev() { if (currentIndex > 0) playIndex(currentIndex - 1); }
function toggleOverlay() { document.querySelectorAll('.vid-ui').forEach(el => { el.style.display = (el.style.display === 'none') ? 'flex' : 'none'; }); }
function onPlayerStateChange(e) { if (e.data == 1 && document.getElementById('autoNext').checked) startTracking(); else clearInterval(checkInterval); }
function startTracking() { clearInterval(checkInterval); checkInterval = setInterval(() => { if (currentIndex >= 0 && currentData[currentIndex]) { const now = player.getCurrentTime(), d = currentData[currentIndex]; let limit = (currentMode === 'player') ? d.endTime : (d.rallyEndTime || (d.startTime + 6.0)); if (now > limit && currentIndex < currentData.length - 1) playNext(); } }, 500); }

window.addEventListener('keydown', (e) => {
    // 💡 新設：お絵かきモード中の Ctrl+Z (Undo)
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (isDrawingMode) { undoDrawing(); e.preventDefault(); return; }
    }

    const isInput = e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA';
    if (isInput && e.target.classList.contains('comment-input')) {
        const playId = e.target.id.split('c-input-')[1];
        const suggestBox = document.getElementById(`suggest-${playId}`);
        const isSuggestOpen = suggestBox && suggestBox.style.display === 'block';

        if (isSuggestOpen) {
            let activeIdx = parseInt(suggestBox.dataset.activeIdx) || 0;
            const items = suggestBox.querySelectorAll('.s-item');
            if (e.key === 'ArrowDown') { e.preventDefault(); activeIdx = (activeIdx + 1) % items.length; updateSuggestHighlight(suggestBox, activeIdx); } 
            else if (e.key === 'ArrowUp') { e.preventDefault(); activeIdx = (activeIdx - 1 + items.length) % items.length; updateSuggestHighlight(suggestBox, activeIdx); } 
            else if (e.key === 'Enter' || e.key === 'Tab') { e.preventDefault(); if (items[activeIdx]) items[activeIdx].click(); } 
            else if (e.key === 'Escape') { suggestBox.style.display = 'none'; }
            if (['ArrowDown', 'ArrowUp', 'Enter', 'Tab', 'Escape'].includes(e.key)) return;
        } else {
            if (e.key === 'Enter') { if (playId) addComment(playId); return; }
        }
        return;
    }
    if (isInput) return;
    const key = e.key.toLowerCase();
    if (key === 'f') playNext(); else if (key === 'd') playPrev(); else if (key === 'r') { player.seekTo(currentData[currentIndex].startTime, true); player.playVideo(); }
    else if (e.key === 'ArrowLeft') { player.seekTo(player.getCurrentTime() - 2, true); e.preventDefault(); }
    else if (e.key === 'ArrowRight') { player.seekTo(player.getCurrentTime() + 2, true); e.preventDefault(); }
    else if (key === 'p') { if (isDrawingMode) saveDrawing(); else if (currentIndex >= 0) enterDrawMode(currentData[currentIndex].id); }
    else if (key === 'c' && currentIndex >= 0) { const pid = currentData[currentIndex].id; toggleActions(null, currentIndex, true); document.getElementById(`c-input-${pid}`).focus(); e.preventDefault(); }
});
