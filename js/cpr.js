/* =====================================================================
   10구역 심폐소생술·AED (cpr.js)
   발견 → 안전·반응(깨우고) → 119·AED 요청(알리고) → 호흡 확인(누르고)
   → 가슴 압박 방법 → 리듬 트레이너 30회 → AED(전원·패드·분석·충격 A/B) → 구급대 도착 → 수첩·배지
   그림은 cpr 폴더의 확정 그림만 사용. 대화창·팝업은 공통 미션 화면(Mission)을 함께 씀
   ===================================================================== */
const CPR = {
  get P() { return CONTENT.cpr; },
  zone: null,

  start() {
    const C = CONTENT, T = C.text;
    this.zone = C.zones.find(z => z.id === 10);
    Mission.el = document.getElementById('mission');
    Mission.zone = this.zone;
    const $ = id => document.getElementById(id);
    $('mWhoImg').src = `assets/chars/${this.zone.char}.png`;
    $('mZone').textContent = `10구역 ${this.zone.name}`;
    $('mSummary').textContent = this.zone.topic + ' · ' + this.zone.place;
    $('exitBtn').textContent = T.exit;
    $('exitBtn').onclick = () => this.exitConfirm();
    setPlaceBackground(Mission.el, this.zone);
    this.stopMetronome();
    this.discover();
  },

  /* ---------- 화면 조각 ---------- */
  chip(i) {
    const c = document.getElementById('mStep');
    c.hidden = i == null;
    if (i != null) c.textContent = this.P.stepNames[i];
  },
  turtle(bubble) {
    const img = document.getElementById('npcImg');
    img.src = `assets/chars/${this.zone.char}.png`; img.alt = this.zone.name;
    Mission.bubble('npcBubble', bubble);
    sizeActors(Mission.el);
  },
  player(face, bubble) { document.getElementById('playerActor').style.visibility = ''; Mission.setPlayer(face, bubble); },
  /* 압박하는 보건 대원이 화면 가운데 나올 때는 오른쪽에 서 있는 보건 대원을 숨김 (같은 인물이 두 번 보이지 않게) */
  hidePlayer() { document.getElementById('playerActor').style.visibility = 'hidden'; Mission.bubble('playerBubble', ''); },
  /* 가슴 압박 장면: 팀이 준 '두 사람이 함께 있는 그림'(cpr_press, 체크무늬 배경만 지움)
     누를 때마다 그림이 살짝 눌렸다 올라오고, 손 위치(가로 46.6%·세로 57.5%)에 '꾹' 표시 */
  pressScene(h) {
    return `<div class="cpr-figure press-scene" style="height:${h}px">
      <img class="pixel presser" src="assets/cpr/cpr_press.webp" alt="쓰러진 사람의 가슴을 압박하는 보건 대원">
      <span class="press-ring" style="left:46.6%;top:57.5%"></span></div>`;
  },

  say(line, opts = {}) { Mission.setDialog({ name: this.zone.name, line, ...opts }); },
  /* 그림 위에 겹쳐 표시하는 틀: 원본 비율 그대로, 표시는 % 좌표 */
  figure(src, maxH, extra = '') {
    return `<div class="cpr-figure" style="height:${maxH}"><img class="pixel" src="${src}" alt="">${extra}</div>`;
  },

  /* ---------- 0. 쓰러진 사람 발견 ---------- */
  discover() {
    const P = this.P;
    this.chip(null);
    this.turtle(); this.player('surprised');
    Mission.setMain(`<div class="complete-box">${this.figure('assets/cpr/cpr_patient.webp', 'min(270px, 34vh)')}
      <span class="npc-name" style="font-size:22px;padding:2px 12px">${esc(P.patientLabel)}</span></div>`);
    this.say(P.start[0], { type: true, next: () => {
      this.player('explain');
      this.say(P.start[1], { type: true, action: { label: P.startButton, onClick: () => {
        this.say(P.safetyGuide, { type: true, next: () => this.quiz(0) });
      } } });
    } });
  },

  /* ---------- 1. 깨우고 · 알리고 · 누르고 (3지선다) ---------- */
  quiz(k) {
    const P = this.P, q = P.quiz[k], T = CONTENT.text, nums = ['①', '②', '③'];
    const ask = () => {
      this.chip(k);
      this.turtle(); this.player('think');
      const main = Mission.setMain(`<div class="board" style="width:100%">
        <p style="margin:0 0 10px;font-weight:700;font-size:22px">${esc(q.q)}</p>
        <div class="choices compact" style="grid-template-columns:1fr">${q.options.map((o, i) =>
          `<button class="choice" data-i="${i}"><span class="num">${nums[i]}</span><span>${esc(o.text)}</span></button>`).join('')}</div>
        <div id="qRes" style="margin-top:10px"></div></div>`);
      this.say(q.q);
      main.querySelectorAll('.choice').forEach(c => c.addEventListener('click', () => {
        const o = q.options[+c.dataset.i], res = main.querySelector('#qRes');
        if (!o.correct) {
          Sound.play('wrong');
          c.classList.add('wrong');
          this.turtle(P.wrongBubble); this.player('worry');
          res.innerHTML = `<div class="result no"><span class="icon">✕</span><div>${esc(o.fb)}</div></div>`;
          revealResult(res);
          return;
        }
        Sound.play('correct');
        c.classList.add('right');
        main.querySelectorAll('.choice').forEach(x => { x.disabled = true; });
        const card = q.afterCard ? `<div class="result hint" style="margin-top:8px"><span class="icon">💡</span><div>${q.afterCard.map(esc).join('<br>')}</div></div>` : '';
        res.innerHTML = `<div class="result ok"><span class="icon">✓</span><div><b>정답이에요!</b><br>${esc(o.fb)}</div></div>${card}`;
        revealResult(res);
        if (k === 1) this.player('call', q.studentLine); else this.player('thumb');
        this.turtle(q.afterBubble);
        this.say(q.afterBubble, { action: { label: T.next, onClick: () => (k < 2 ? this.quiz(k + 1) : this.method()) } });
      }));
    };
    // 누르고 앞에는 호흡 확인 안내가 먼저
    if (q.before) {
      this.chip(k); this.turtle(); this.player('explain');
      Mission.setMain(`<div class="complete-box">${this.figure('assets/cpr/cpr_patient.webp', 'min(270px, 34vh)')}</div>`);
      this.say(q.before, { type: true, next: ask });
    } else ask();
  },

  /* ---------- 2. 가슴 압박 방법: 상체 정면 그림 위에 위치 표시 ---------- */
  method() {
    const P = this.P, m = P.method, a = m.area, T = CONTENT.text;
    this.chip(3);
    this.turtle(); this.player('explain');
    const hi = `<div class="zone-hi" style="left:${a.x1}%;top:${a.y1}%;width:${a.x2 - a.x1}%;height:${a.y2 - a.y1}%"></div>
      <div class="hand-dot" style="left:${m.handPoint.x}%;top:${m.handPoint.y}%"></div>`;
    Mission.setMain(`<div style="display:flex;gap:18px;align-items:center;width:100%;justify-content:center">
      ${this.figure('assets/cpr/cpr_torso.webp', 'min(470px, 58vh)', hi)}
      <div class="board" style="flex:1;max-width:420px"><dl class="method-list">${m.rows.map(r =>
        `<dt>${esc(r[0])}</dt><dd>${esc(r[1])}</dd>`).join('')}</dl></div></div>`);
    this.say(m.bubble, { action: { label: T.next, onClick: () => this.rhythmIntro() } });
  },

  /* ---------- 3. 리듬 트레이너 ---------- */
  rhythmIntro() {
    const R = this.P.rhythm;
    this.chip(4);
    this.turtle(); this.hidePlayer();   // 촌장님 말은 아래 대화창에 나오므로 말풍선은 생략 (글상자 자리 확보)
    Mission.setMain(`<div class="board rhythm-guide">
      <div class="result hint"><span class="icon">💡</span><div><b>${esc(R.startNotice)}</b></div></div>
      <div class="rg-row">
        ${this.pressScene(Math.min(190, innerHeight * 0.22))}
        <div class="rg-text"><div>⏱ ${esc(R.guideBeat)}</div><div>🔢 ${esc(R.guideSet)}</div>
          <div class="note">${esc(R.inputGuide)}</div></div>
      </div>
      <div class="result ok"><span class="icon">✓</span><div>${esc(R.remember)}</div></div></div>`);
    this.say(R.bubble, { action: { label: R.startButton, onClick: () => this.rhythm() } });
  },

  rhythm() {
    const P = this.P, R = P.rhythm;
    this.chip(4);
    this.turtle(); this.hidePlayer();
    const main = Mission.setMain(`<div class="rhythm">
      <div class="rhythm-top note">${esc(R.topBar)}</div>
      <div class="rhythm-body">
        ${this.pressScene(Math.min(330, innerHeight * 0.41))}
        <div class="rhythm-panel board">
          <div class="beat" id="beat" aria-hidden="true"></div>
          <div class="counters"><span id="rCount"></span><span id="rGood"></span></div>
          <div id="rSpeed" class="note"></div>
          <div id="rJudge" class="judge"></div>
          ${App.sound.metronome ? '' : `<div class="note">🔇 ${esc(P.metronomeOff)}</div>`}
        </div>
      </div>
      <button class="btn press-btn" id="pressBtn">${esc(R.pressButton)}</button></div>`);
    this.say(R.inputGuide);
    const $ = id => main.querySelector('#' + id);
    const st = { total: 0, good: 0, seg: [], last: 0, over: false };
    const show = (judgeKey, cls) => {
      $('rCount').textContent = fillText(P.countLabel, { n: st.total });
      $('rGood').textContent = fillText(P.goodLabel, { n: st.good });
      if (judgeKey) { const j = $('rJudge'); j.textContent = R.judge[judgeKey]; j.className = 'judge ' + (cls || ''); }
    };
    show('warmup');
    $('rSpeed').textContent = fillText(R.speedLabel, { bpm: '–' });

    // 시각 박자(110 BPM)는 소리를 꺼도 항상 / 메트로놈 소리는 설정이 켜져 있을 때만
    this.startMetronome(R.metronomeBpm, () => {
      const b = main.querySelector('#beat'); if (!b) return;
      b.classList.remove('on'); void b.offsetWidth; b.classList.add('on');
    });

    const press = () => {
      if (st.over) return;
      const now = performance.now();
      main.querySelectorAll('.presser, .press-ring').forEach(el => { el.classList.remove('down'); void el.offsetWidth; el.classList.add('down'); });
      let paused = false;
      if (st.total > 0 && now - st.last >= R.pauseMs) { st.seg = []; paused = true; }   // 2초 넘게 멈춤: 속도 계산만 처음부터
      st.last = now; st.total++; st.seg.push(now);
      if (st.seg.length <= R.warmup) {
        show(paused ? 'paused' : 'warmup');
        if (st.seg.length === 1) $('rSpeed').textContent = fillText(R.speedLabel, { bpm: '–' });
      } else {
        const t = st.seg.slice(-(R.warmup + 1));               // 최근 4개 간격
        const avg = (t[t.length - 1] - t[0]) / (t.length - 1);
        const bpm = 60000 / avg;                                // 반올림 전 값으로 판정
        $('rSpeed').textContent = fillText(R.speedLabel, { bpm: Math.round(bpm) });
        if (bpm < R.bpmMin) { show('slow', 'bad'); Sound.play('beep', 0.4); }
        else if (bpm > R.bpmMax) { show('fast', 'bad'); Sound.play('beep', 0.4); }
        else { st.good++; show('good', 'good'); }
      }
      if (st.total >= R.total) { st.over = true; setTimeout(() => this.rhythmResult(st.good), 400); }
    };
    $('pressBtn').addEventListener('pointerdown', e => { e.preventDefault(); press(); });
    main.querySelector('.press-scene').addEventListener('pointerdown', e => { e.preventDefault(); press(); });
    this.keyHandler = e => {
      if (e.code === 'Space' && !e.repeat && !document.querySelector('.overlay')) { e.preventDefault(); press(); }
    };
    addEventListener('keydown', this.keyHandler);
  },
  rhythmResult(good) {
    const R = this.P.rhythm;
    this.stopMetronome();
    const pass = good >= R.passGood;                           // 기준 숫자 15는 화면에 보이지 않음
    const result = fillText(R.result, { good });
    if (pass) {
      Sound.play('correct');
      this.turtle(R.pass.bubble); this.player('thumb');   // 결과 화면에서는 다시 서 있는 보건 대원
      Mission.setMain(`<div class="board complete-box"><p class="big-title">${esc(result)}</p>
        <div class="result ok"><span class="icon">✓</span><div>${esc(R.pass.line1)}<br><b>${esc(R.pass.line2)}</b></div></div></div>`);
      this.say(R.pass.bubble, { action: { label: R.pass.button, onClick: () => this.aedArrive() } });
    } else {
      Sound.play('wrong');
      this.turtle(R.retry.bubble); this.player('worry');
      Mission.setMain(`<div class="board complete-box"><p class="big-title">${esc(result)}</p>
        <div class="result hint"><span class="icon">💡</span><div>${esc(R.retry.line1)}</div></div></div>`);
      this.say(R.retry.bubble, { action: { label: R.retry.button, onClick: () => this.rhythm() } });   // 0/30·좋아요 0회부터
    }
  },

  /* 110 BPM 박자: 시각 표시는 항상, 클릭음은 메트로놈이 켜져 있을 때만 (소리는 코드로 생성) */
  /* 110 BPM 박자: 박자 한 칸 길이(60/110초)의 소리를 만들어 끊김 없이 반복 재생 → 기기가 정확한 간격으로 '딱'
     시각 박자(깜빡이는 동그라미)도 같은 시계에 맞춰 움직임. 메트로놈이 꺼져 있으면 시각 박자만 */
  startMetronome(bpm, onBeat) {
    this.stopMetronome();
    const period = 60 / bpm;
    let clock = null;                                    // 지금 몇 초째인지 알려 주는 시계
    if (App.sound.metronome) {
      try {
        if (navigator.audioSession) navigator.audioSession.type = 'playback';   // 아이패드 무음 모드에서도 소리 나게
        const ctx = this.audioCtx || (this.audioCtx = new (window.AudioContext || window.webkitAudioContext)());
        ctx.resume();
        // 아이패드: 소리 없는 파일을 함께 틀어 두면 무음 스위치가 켜져 있어도 박자 소리가 남
        if (!this.silence) { this.silence = new Audio('assets/sounds/silence.mp3'); this.silence.loop = true; }
        this.silence.play().catch(() => {});
        const sr = ctx.sampleRate, len = Math.round(period * sr);
        const buf = ctx.createBuffer(1, len, sr), d = buf.getChannelData(0);
        for (let i = 0; i < Math.min(len, sr * 0.06); i++) d[i] = 0.6 * Math.sin(2 * Math.PI * 1000 * i / sr) * Math.exp(-i / (sr * 0.012));
        const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
        const gain = ctx.createGain(); gain.gain.value = 0.9;
        src.connect(gain).connect(ctx.destination);
        const t0 = ctx.currentTime + 0.05;
        src.start(t0);
        this.metroSrc = src;
        clock = () => ctx.currentTime - t0;
      } catch (e) { clock = null; }
    }
    if (!clock) { const s0 = performance.now(); clock = () => (performance.now() - s0) / 1000; }
    let last = -1;
    const frame = () => {
      const beat = Math.floor(clock() / period);
      if (beat >= 0 && beat !== last) { last = beat; onBeat(); }
      this.metroRaf = requestAnimationFrame(frame);
    };
    this.metroRaf = requestAnimationFrame(frame);
  },
  stopMetronome() {
    cancelAnimationFrame(this.metroRaf);
    clearInterval(this.metroTimer);
    if (this.metroSrc) { try { this.metroSrc.stop(); } catch (e) {} this.metroSrc = null; }
    if (this.silence) this.silence.pause();
    if (this.keyHandler) { removeEventListener('keydown', this.keyHandler); this.keyHandler = null; }
  },


  /* ---------- 4. 자동 심장 충격기(AED) ---------- */
  aedFigure(extra = '') {
    const B = this.P.aedButtons;
    const hot = (k, label) => `<button class="aed-btn" data-k="${k}" aria-label="${label}"
      style="left:${B[k].x}%;top:${B[k].y}%;width:${B[k].r * 2}%;"></button>`;
    return this.figure('assets/cpr/aed_device.webp', 'min(330px, 44vh)', hot('power', '전원 버튼') + hot('shock', '충격 버튼') + extra);
  },
  aedArrive() {
    const A = this.P.aed;
    this.chip(5);
    this.turtle(A.arrive.bubble); this.player('explain');
    const main = Mission.setMain(`<div class="complete-box">${this.aedFigure()}<div class="result hint" style="background:rgba(225,239,251,.96)"><span class="icon">💡</span><div>${esc(A.arrive.guide)}</div></div></div>`);
    const powerOn = () => { Sound.play('click'); this.pads(); };
    main.querySelector('.aed-btn[data-k="power"]').addEventListener('click', powerOn);
    main.querySelector('.aed-btn[data-k="power"]').classList.add('glow');
    this.say(A.arrive.bubble, { action: { label: A.arrive.button, onClick: powerOn } });
  },

  /* 패드 붙이기: 끌어다 놓기 또는 패드를 누른 뒤 붙일 곳 누르기 */
  pads() {
    const A = this.P.aed, Z = A.padZones;
    this.chip(5);
    this.turtle(); this.player('think');
    const main = Mission.setMain(`<div style="display:flex;gap:16px;align-items:center;width:100%;justify-content:center">
      ${this.figure('assets/cpr/cpr_torso.webp', 'min(470px, 58vh)', '<div class="zone-flash" id="flashA"></div><div class="zone-flash" id="flashB"></div>')}
      <div class="pad-tray board">
        <button class="pad" data-z="A"><img class="pixel" src="assets/cpr/${Z.A.pad}.webp" alt="패드 1"></button>
        <button class="pad" data-z="B"><img class="pixel" src="assets/cpr/${Z.B.pad}.webp" alt="패드 2"></button>
      </div></div>`);
    this.say(A.padIntro, { note: A.padGuide });
    const fig = main.querySelector('.cpr-figure');
    ['A', 'B'].forEach(k => {
      const f = main.querySelector('#flash' + k), z = Z[k];
      Object.assign(f.style, { left: z.x1 + '%', top: z.y1 + '%', width: (z.x2 - z.x1) + '%', height: (z.y2 - z.y1) + '%' });
    });
    const wrongs = { A: 0, B: 0 }, placed = { A: false, B: false };
    let selected = null;

    // 그림 안 위치(%)로 바꾸기 – 그림 크기가 바뀌어도 같은 자리
    const toPct = (cx, cy) => {
      const r = fig.querySelector('img').getBoundingClientRect();
      return { x: (cx - r.left) / r.width * 100, y: (cy - r.top) / r.height * 100, inside: cx >= r.left && cx <= r.right && cy >= r.top && cy <= r.bottom };
    };
    const inZone = (p, z) => p.x >= z.x1 && p.x <= z.x2 && p.y >= z.y1 && p.y <= z.y2;
    const hintFor = (k, p) => {
      const other = k === 'A' ? Z.B : Z.A;
      if (inZone(p, other)) return A.hints.swapped;
      if (p.y > 75) return A.hints.tooLow;
      if (p.x > 44 && p.x < 58) return A.hints.center;
      return A.hints.returned;
    };
    const stick = (k, padEl) => {
      const z = Z[k];
      const stuck = document.createElement('img');
      stuck.className = 'pixel pad-stuck'; stuck.src = padEl.querySelector('img').src; stuck.alt = '';
      Object.assign(stuck.style, { left: (z.x1 + z.x2) / 2 + '%', top: (z.y1 + z.y2) / 2 + '%' });
      fig.appendChild(stuck);
      padEl.style.visibility = 'hidden';
      placed[k] = true;
      main.querySelector('#flash' + k).classList.remove('on');
      Sound.play('pad_stick');
      if (placed.A && placed.B) {
        main.querySelector('.pad-tray').style.visibility = 'hidden';   // 두 패드를 다 붙이면 빈 상자 숨김
        this.player('thumb');
        this.say(A.padDone[0], { note: A.padDone.slice(1).join(' · '), action: { label: CONTENT.text.next, onClick: () => this.analyze('A') } });
      } else this.say(A.padIntro, { note: A.padGuide });
    };
    const drop = (k, padEl, cx, cy) => {
      const p = toPct(cx, cy);
      if (!p.inside) return;                    // 그림 밖: 그냥 제자리
      if (inZone(p, Z[k])) return stick(k, padEl);
      Sound.play('wrong');
      wrongs[k]++;
      this.player('worry');
      this.say(hintFor(k, p), { note: A.hints.returned });
      if (wrongs[k] >= 2) main.querySelector('#flash' + k).classList.add('on');   // 두 번 틀리면 정답 자리 은은하게 깜빡
    };

    main.querySelectorAll('.pad').forEach(padEl => {
      const k = padEl.dataset.z;
      let drag = null;
      padEl.addEventListener('pointerdown', e => {
        e.preventDefault();
        padEl.setPointerCapture(e.pointerId);
        drag = { x: e.clientX, y: e.clientY, moved: false };
      });
      padEl.addEventListener('pointermove', e => {
        if (!drag) return;
        const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
        if (Math.hypot(dx, dy) > 8) drag.moved = true;
        if (drag.moved) { padEl.style.transform = `translate(${dx}px, ${dy}px)`; padEl.classList.add('dragging'); }
      });
      padEl.addEventListener('pointerup', e => {
        if (!drag) return;
        padEl.style.transform = ''; padEl.classList.remove('dragging');
        if (drag.moved) {
          // 패드 가운데가 놓인 곳으로 판정
          drop(k, padEl, e.clientX, e.clientY);
        } else {
          // 누르기만 함: 패드 고르기 → 붙일 곳 누르기
          main.querySelectorAll('.pad').forEach(x => x.classList.remove('selected'));
          selected = selected === k ? null : k;
          if (selected) padEl.classList.add('selected');
        }
        drag = null;
      });
    });
    fig.addEventListener('click', e => {
      if (!selected) return;
      const k = selected; selected = null;
      const padEl = main.querySelector(`.pad[data-z="${k}"]`);
      padEl.classList.remove('selected');
      drop(k, padEl, e.clientX, e.clientY);
    });
  },

  /* 리듬 분석 → 상황 A(충격 필요) / 상황 B(충격 불필요) */
  analyze(caseName) {
    const A = this.P.aed;
    this.chip(5);
    this.turtle(A.analyze.bubble); this.player('surprised');
    Sound.play('aed', 0.5);
    Mission.setMain(`<div class="complete-box">${this.aedFigure()}
      <div class="aed-voice">🔊 “${esc(A.voiceAnalyze)}”</div><div class="result hint" style="background:rgba(225,239,251,.96)"><span class="icon">💡</span><div>${esc(A.analyze.guide)}</div></div></div>`);
    Mission.$('mMain').querySelectorAll('.aed-btn').forEach(b => { b.disabled = true; });
    this.say(A.analyze.bubble);
    clearTimeout(this.anTimer);
    this.anTimer = setTimeout(() => (caseName === 'A' ? this.caseA() : this.caseB()), 2600);
  },
  caseA() {
    const A = this.P.aed, a = A.caseA;
    this.turtle(a.bubble); this.player('think');
    const main = Mission.setMain(`<div class="complete-box">${this.aedFigure()}
      <div class="aed-voice">🔊 “${esc(this.P.voiceShock)}”</div>
      <div class="result hint" id="checkCard"><span class="icon">💡</span><div>${esc(a.check)}</div></div></div>`);
    const shockBtn = main.querySelector('.aed-btn[data-k="shock"]');
    main.querySelector('.aed-btn[data-k="power"]').disabled = true;
    shockBtn.disabled = true;
    let safe = false;
    const doShock = () => {
      if (!safe) return;
      Sound.play('aed', 0.6);
      this.turtle(a.afterBubble); this.hidePlayer();
      // 충격 직후 바로 가슴 압박 장면 (깨어나는 연출 없음)
      Mission.setMain(`<div style="display:flex;gap:18px;align-items:center">${this.pressScene(Math.min(300, innerHeight * 0.37))}
        <div class="board" style="max-width:460px"><div class="result ok"><span class="icon">✓</span><div>${esc(a.afterGuide)}</div></div></div></div>`);
      this.say(a.afterBubble, { action: { label: a.nextButton, onClick: () => this.analyze('B') } });
    };
    const safeCheck = () => {
      safe = true;
      main.querySelector('#checkCard').className = 'result ok';
      main.querySelector('#checkCard .icon').textContent = '✓';
      shockBtn.disabled = false; shockBtn.classList.add('glow');
      this.say(a.bubble, { action: { label: a.shockButton, onClick: doShock } });
    };
    shockBtn.addEventListener('click', doShock);
    this.say(a.bubble, { action: { label: a.safeButton, onClick: safeCheck } });
  },
  caseB() {
    const A = this.P.aed, b = A.caseB;
    this.turtle(b.bubble); this.player('think');
    const main = Mission.setMain(`<div class="complete-box">${this.aedFigure()}
      <div class="aed-voice">🔊 “${esc(this.P.voiceNoShock)}”</div></div>`);
    main.querySelectorAll('.aed-btn').forEach(x => { x.disabled = true; });
    const wrong = () => {
      Sound.play('wrong'); this.player('worry');
      showPopup({ title: CONTENT.text.actionWrongTitle, sound: false, body: `<div class="result no" style="text-align:left"><span class="icon">✕</span><div>${esc(b.wrong)}</div></div>`,
        buttons: [{ label: b.retryButton, primary: true, onClick: () => this.player('think') }] });
    };
    const right = () => {
      Sound.play('correct'); this.player('thumb');
      this.arrival();
    };
    Mission.setDialog({ name: this.zone.name, line: b.bubble, buttons: [
      { label: b.shockButton, onClick: wrong },
      { label: b.cprButton, primary: true, onClick: right }
    ] });
  },

  /* ---------- 5. 구급대 도착 → 수첩 → 완료 ---------- */
  arrival() {
    const V = this.P.arrival;
    this.chip(null);
    this.turtle(V.bubble); this.hidePlayer();
    Mission.setMain(`<div style="display:flex;gap:18px;align-items:center">${this.pressScene(Math.min(300, innerHeight * 0.37))}
      <div class="board complete-box"><p class="big-title">${esc(V.title)}</p><div>${esc(V.guide)}</div></div></div>`);
    this.say(V.bubble, { action: { label: V.button, onClick: () => this.notebook() } });
  },
  notebookHTML() {
    const C = CONTENT, T = C.text, P = this.P, a = P.method.area, nums = ['①', '②', '③', '④'];
    this.zone = this.zone || C.zones.find(z => z.id === 10);   // 마을에서 수첩만 열 때도 쓰도록
    const hi = `<div class="zone-hi" style="left:${a.x1}%;top:${a.y1}%;width:${a.x2 - a.x1}%;height:${a.y2 - a.y1}%"></div>`;
    return `<div class="notebook" style="display:flex;gap:16px;align-items:flex-start">
      ${this.figure('assets/cpr/cpr_torso.webp', '230px', hi)}
      <div style="flex:1"><h2 style="margin:0">${esc(T.notebookTitle)} <span class="note">· 10구역 ${esc(this.zone.topic)}</span></h2>
      <div class="sub">${esc(T.notebookHead)}</div>
      <ol>${P.notebook.map((l, i) => `<li>${nums[i]} ${esc(l)}</li>`).join('')}</ol>
      <div class="foot">${esc(C.notebookFooter)}</div></div></div>`;
  },
  notebook() {
    const T = CONTENT.text;
    this.turtle(); this.player('explain');
    Mission.setMain(this.notebookHTML());
    Mission.setDialog({ name: T.notebookTitle, line: T.notebookGuide, action: { label: T.notebookDone, onClick: () => this.complete() } });
  },
  complete() {
    const T = CONTENT.text, c = this.P.complete;
    App.completeZone(10);
    Sound.play('badge');
    this.turtle(); this.player('thumb');
    Mission.setMain(`<div class="board complete-box">
      <p class="big-title" style="margin:0">${esc(T.missionComplete)}</p>
      <img class="badge" src="assets/badges/${this.zone.badge}.webp" alt="심폐소생술 배지">
      <p class="big-title" style="font-size:24px;margin:0">${esc(c.big)}</p>
      <div class="note">${c.small.map(esc).join('<br>')}</div></div>`);
    Mission.setDialog({
      name: this.zone.name, line: this.P.arrival.bubble,
      buttons: [
        { label: T.backToVillage, primary: true, onClick: () => this.back() },
        { label: T.notebookAgain, onClick: () => showPopup({ body: this.notebookHTML(), wide: true }) }
      ]
    });
  },
  back() { this.stopMetronome(); clearTimeout(this.anTimer); Mission.backToVillage(); },
  exitConfirm() {
    const T = CONTENT.text;
    if (Mission.$('mMain').querySelector('.badge')) return this.back();
    showPopup({
      title: T.exitTitle, body: `<p style="text-align:center">${esc(T.exitNote)}</p>`,
      buttons: [{ label: T.exitContinue }, { label: T.exitConfirm, primary: true, onClick: () => this.back() }]
    });
  }
};
