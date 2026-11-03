/* =====================================================================
   교사용 관리자 화면 (teacher.js)
   비밀번호 없음 · 저장되는 정보 없음. 고른 설정은 학생용 링크에만 담김(정답 제외)
   ===================================================================== */
(function () {
  const C = CONTENT, T = C.teacher;
  const $ = id => document.getElementById(id);

  // 지금 고른 설정 (새로고침하면 처음으로)
  const state = {
    zones: new Set(),
    sound: { bgm: false, sfx: false, metronome: false },   // 처음에는 모두 꺼짐
    link: ''
  };
  Sound.sfxOn = true;   // 교사 화면 팝업 소리

  /* ---------- 글자 채우기 ---------- */
  document.title = T.title;
  $('pageTitle').textContent = T.title;
  $('introChips').innerHTML = T.intro.map(t => `<span class="chip">${esc(t)}</span>`).join('');
  $('zoneHead').textContent = T.zoneHead;
  $('selectAll').textContent = T.selectAll;
  $('clearAll').textContent = T.clearAll;
  $('zoneNote').textContent = T.zoneNote;
  $('soundHead').textContent = T.soundHead;
  $('soundNote').textContent = T.soundNote;
  $('checkHead').textContent = T.checkHead;
  $('timeNote').textContent = T.timeNote;
  $('answerBtn').textContent = T.answerPreview;
  $('previewBtn').textContent = T.studentPreview;
  $('previewNote').textContent = T.studentPreviewNote;
  $('makeBtn').textContent = T.makeButton;
  $('creditsBtn').textContent = $('creditsBtn2').textContent = T.creditsButton;
  $('qrTitle').textContent = T.qrTitle;
  $('qrGuide').textContent = T.qrGuide;
  $('qrSettingsHead').textContent = T.qrSettings;
  $('copyBtn').textContent = T.copyLink;
  $('bigBtn').textContent = T.qrBig;
  $('saveBtn').textContent = T.qrSave;
  $('backBtn').textContent = T.reselect;
  $('qrNote').innerHTML = T.qrNote.map(esc).join('<br>');

  /* ---------- ① 구역 카드 10장 ---------- */
  const grid = $('zoneGrid');
  C.zones.forEach(z => {
    const card = document.createElement('button');
    card.className = 'zone-card';
    card.setAttribute('aria-pressed', 'false');
    const rounds = z.rounds.length === 2 ? ' · 2라운드' : '';
    card.innerHTML = `
      <div class="pic"><img class="pixel" src="assets/chars/${z.char}.png" alt=""></div>
      <div class="zname">${z.id}구역 · ${esc(z.topic)}</div>
      <div class="zplace">${esc(z.name)} · ${esc(z.place)}${rounds}</div>
      <div class="ztime">${z.time[0]}~${z.time[1]}분</div>`;
    card.addEventListener('click', () => { toggleZone(z.id); });
    card.dataset.id = z.id;
    grid.appendChild(card);
  });

  function toggleZone(id, on) {
    const want = on ?? !state.zones.has(id);
    want ? state.zones.add(id) : state.zones.delete(id);
    render();
  }
  $('selectAll').addEventListener('click', () => { C.zones.forEach(z => state.zones.add(z.id)); render(); });
  $('clearAll').addEventListener('click', () => { state.zones.clear(); render(); });

  /* ---------- ② 소리 기본값 ---------- */
  ['bgm', 'sfx', 'metronome'].forEach(key => {
    const b = document.createElement('button');
    b.className = 'switch';
    b.dataset.key = key;
    b.addEventListener('click', () => { state.sound[key] = !state.sound[key]; render(); });
    $('soundRow').appendChild(b);
  });

  /* ---------- 화면 다시 그리기 ---------- */
  function render() {
    grid.querySelectorAll('.zone-card').forEach(c => c.setAttribute('aria-pressed', state.zones.has(+c.dataset.id)));
    $('soundRow').querySelectorAll('.switch').forEach(b => {
      const on = state.sound[b.dataset.key];
      b.setAttribute('aria-pressed', on);
      b.innerHTML = `${esc(T.soundNames[b.dataset.key])} <span class="state">${on ? '켜기' : '끄기'}</span>`;
    });
    const picked = C.zones.filter(z => state.zones.has(z.id));
    const min = picked.reduce((s, z) => s + z.time[0], 0);
    const max = picked.reduce((s, z) => s + z.time[1], 0);
    $('summary').textContent = fillText(T.summary, { n: picked.length, min, max });
  }
  render();

  /* ---------- 정답·해설 미리보기 (교사용 주소에서만) ---------- */
  $('answerBtn').addEventListener('click', () => {
    const list = state.zones.size ? C.zones.filter(z => state.zones.has(z.id)) : C.zones;
    let html = `<p class="note" style="margin-top:0">${esc(T.answerNote)}${state.zones.size ? '' : ' (구역을 고르지 않아 전체를 보여 줘요)'}</p>`;
    list.forEach(z => {
      html += `<div class="answer-zone"><h3>${z.id}구역 · ${esc(z.name)} · ${esc(z.topic)}</h3>`;
      if (z.id === 10) {
        const q = C.cpr.quiz;
        html += '<dl>' + q.map(s => `<dt>${esc(s.step)}</dt><dd>${esc(s.options.find(o => o.correct).text)}</dd>`).join('') +
          `<dt>리듬 트레이너</dt><dd>30회 중 좋아요 ${C.cpr.rhythm.passGood}회 이상 통과 (기준 숫자는 학생 화면에 보이지 않음)</dd>` +
          `<dt>AED 패드</dt><dd>오른쪽 쇄골 아래 · 왼쪽 유두 아래 겨드랑이 선 (쓰러진 사람 기준)</dd>` +
          `<dt>충격</dt><dd>상황 A 충격 필요 → 안전 확인 후 충격 → 즉시 가슴 압박 / 상황 B 충격 불필요 → 버튼 누르지 않고 즉시 가슴 압박</dd></dl>`;
      } else {
        z.rounds.forEach(rid => {
          const r = C.rounds[rid];
          const correctItems = r.items.filter(i => i.correct).map(i => i.name);
          const act = r.action.find(a => a.correct);
          const label = z.rounds.length === 2 ? `<b style="display:block;margin:6px 0 2px">${rid.endsWith('1') ? '1' : '2'}라운드 · ${esc(r.title)}</b>` : '';
          html += `${label}<dl>
            <dt>${esc(fillText(T.answerBag, { n: correctItems.length }))}</dt><dd>${correctItems.map(esc).join(', ')}</dd>
            <dt>O/X</dt><dd>${esc(r.ox.q)} → <b>${r.ox.answer === 'O' ? '◯' : '×'}</b><br><span class="note">${esc(r.ox.explain)}</span></dd>
            <dt>행동 선택 정답</dt><dd>${esc(act.text)}</dd></dl>`;
        });
      }
      html += '</div>';
    });
    showPopup({ title: T.answerPreview, body: html, wide: true });
  });

  /* ---------- 학생 화면 미리보기: 새 탭 (관리자 화면은 그대로) ---------- */
  $('previewBtn').addEventListener('click', () => {
    if (!state.zones.size) return noZone();
    window.open(buildStudentLink(state.zones, state.sound), '_blank');
  });

  /* ---------- 링크·QR 만들기 ---------- */
  function noZone() {
    showPopup({ title: T.noZoneTitle, body: `<p style="text-align:center">${esc(T.noZoneNote)}</p>` });
  }
  $('makeBtn').addEventListener('click', () => {
    if (!state.zones.size) return noZone();
    state.link = buildStudentLink(state.zones, state.sound);
    $('linkText').textContent = state.link;
    const names = C.zones.filter(z => state.zones.has(z.id)).map(z => `${z.id}구역 ${z.topic}`).join(', ');
    const onoff = v => (v ? '켜기' : '끄기');
    $('qrSettings').innerHTML =
      `${esc(names)}<br>소리: 배경음 ${onoff(state.sound.bgm)} · 효과음 ${onoff(state.sound.sfx)} · 메트로놈 ${onoff(state.sound.metronome)}`;
    drawQR($('qrCanvas'), state.link, 8);
    $('setupView').hidden = true;
    $('qrView').hidden = false;
    window.scrollTo(0, 0);
  });
  $('backBtn').addEventListener('click', () => {
    $('qrView').hidden = true;
    $('setupView').hidden = false;
  });

  /* QR 그리기 – 검은 칸만, 테두리 여백 4칸 */
  function drawQR(canvas, text, cell) {
    const qr = makeQR(text, 'M');
    const n = qr.getModuleCount(), margin = 4, size = (n + margin * 2) * cell;
    canvas.width = canvas.height = size;
    const g = canvas.getContext('2d');
    g.fillStyle = '#fff'; g.fillRect(0, 0, size, size);
    g.fillStyle = '#000';
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++)
      if (qr.isDark(r, c)) g.fillRect((c + margin) * cell, (r + margin) * cell, cell, cell);
    return size;
  }

  /* 링크 복사 */
  $('copyBtn').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(state.link); }
    catch (e) {
      const ta = document.createElement('textarea'); ta.value = state.link; document.body.appendChild(ta);
      ta.select(); document.execCommand('copy'); ta.remove();
    }
    toast('링크를 복사했어요');
  });

  /* QR 크게 보기 (전자칠판) – 누르면 닫힘 */
  $('bigBtn').addEventListener('click', () => {
    const full = document.createElement('div');
    full.className = 'qr-full';
    const side = Math.min(window.innerWidth * 0.8, window.innerHeight * 0.68);
    const cv = document.createElement('canvas');
    const qr = makeQR(state.link, 'M');
    const cell = Math.max(4, Math.floor(side / (qr.getModuleCount() + 8)));
    drawQR(cv, state.link, cell);
    full.innerHTML = `<div class="big-text">${esc(T.qrBigText)}</div>`;
    full.appendChild(cv);
    full.insertAdjacentHTML('beforeend', '<div class="close-note">화면을 누르면 닫혀요</div>');
    full.addEventListener('click', () => full.remove());
    document.addEventListener('keydown', function esc_(e) { if (e.key === 'Escape') { full.remove(); document.removeEventListener('keydown', esc_); } });
    document.body.appendChild(full);
  });

  /* QR 이미지 저장 (PNG) – 제목과 안내 글자 포함 */
  $('saveBtn').addEventListener('click', async () => {
    try { await document.fonts.ready; } catch (e) {}
    const qrCv = document.createElement('canvas');
    const qrSize = drawQR(qrCv, state.link, 12);
    const pad = 40, top = 120, bottom = 90;
    const out = document.createElement('canvas');
    out.width = qrSize + pad * 2; out.height = qrSize + top + bottom;
    const g = out.getContext('2d');
    g.fillStyle = '#fff'; g.fillRect(0, 0, out.width, out.height);
    g.fillStyle = '#4a3530'; g.textAlign = 'center';
    g.font = '700 38px Galmuri11, sans-serif';
    g.fillText(C.appName, out.width / 2, 70);
    g.font = '400 24px Galmuri11, sans-serif';
    g.fillText(T.qrBigText, out.width / 2, 106);
    g.drawImage(qrCv, pad, top);
    const names = C.zones.filter(z => state.zones.has(z.id)).map(z => z.id).join('·');
    g.font = '400 22px Galmuri9, sans-serif';
    g.fillText(`구역 ${names}`, out.width / 2, top + qrSize + 50);
    out.toBlob(blob => {
      const a = document.createElement('a');
      a.download = `응급처치마을방범대_QR_구역${names.replace(/·/g, '-')}.png`;
      a.href = URL.createObjectURL(blob);
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    }, 'image/png');
  });

  /* ---------- 만든 사람 · 소리 출처 ---------- */
  function credits() {
    const cr = C.credits;
    const body = `
      <p><b>만든 사람</b><br>${esc(cr.maker)}</p>
      <p>${esc(cr.art)}</p>
      <p><b>효과음 출처</b></p>
      <ol style="font-size:16px;padding-left:24px;margin:0">${cr.sounds.map(s => `<li>${esc(s)}</li>`).join('')}</ol>
      <p><b>글꼴</b><br><span style="font-size:16px">갈무리(Galmuri) © Lee Minseo (Quiple) – SIL Open Font License 1.1</span></p>
      <p><b>QR 코드</b><br><span style="font-size:16px">QRCode for JavaScript © Kazuhiko Arase – MIT License. "QR Code"는 DENSO WAVE의 등록 상표예요.</span></p>
      <p style="text-align:center"><b>${esc(cr.notice)}</b></p>`;
    showPopup({ title: T.creditsButton, body, wide: true });
  }
  $('creditsBtn').addEventListener('click', credits);
  $('creditsBtn2').addEventListener('click', credits);
})();
