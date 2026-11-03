/* =====================================================================
   1~9구역 공통 미션 (mission.js)
   주민 대화 → ① 구급가방 → ② O/X → ③ 행동 선택
   → (6·9구역: 2라운드) → (6-2·8·9-2: 인계 장면) → 수첩 → 미션 완료·배지
   그림: hurt = 대화·문제 / care = 정답 피드백·수첩 / done = 미션 완료(1·2·3·4·5·7구역)
   ===================================================================== */
const Mission = {
  el: null, zone: null, ri: 0,
  get round() { return CONTENT.rounds[this.zone.rounds[this.ri]]; },
  get roundId() { return this.zone.rounds[this.ri]; },

  start(zoneId) {
    const C = CONTENT, T = C.text;
    this.el = document.getElementById('mission');
    this.zone = C.zones.find(z => z.id === zoneId);
    this.talkData = C.talks[zoneId];
    this.ri = 0;
    const $ = id => document.getElementById(id);
    $('mWhoImg').src = `assets/chars/${this.zone.char}.png`;
    $('mZone').textContent = `${zoneId}구역 ${this.zone.name}`;
    $('exitBtn').textContent = T.exit;
    $('exitBtn').onclick = () => this.exitConfirm();
    setPlaceBackground(this.el, this.zone);
    this.talk();
  },

  /* ---------- 화면 조각 ---------- */
  $(id) { return document.getElementById(id); },
  setBar(stepNo, stepName) {
    const r = this.round, two = this.zone.rounds.length === 2;
    this.$('mSummary').textContent = (two ? `${this.ri + 1}라운드 · ` : '') + r.summary;
    const chip = this.$('mStep');
    chip.hidden = !stepNo;
    if (stepNo) chip.textContent = `${fillText(CONTENT.text.stepLabel, { step: stepNo })} · ${stepName}`;
  },
  setNpc(kind, bubble) {
    const img = this.$('npcImg');
    const file = (kind === 'done' && !this.round.img.done) ? this.round.img.care : (this.round.img[kind] || this.round.img.hurt);
    img.src = `assets/npc/${file}.png`;
    img.alt = this.zone.name;
    this.bubble('npcBubble', bubble);
    sizeActors(this.el);
  },
  setPlayer(face, bubble) {
    this.$('playerImg').src = `assets/player/player_${face}.png`;
    this.bubble('playerBubble', bubble);
    sizeActors(this.el);
  },
  bubble(id, text) { const b = this.$(id); b.hidden = !text; b.textContent = text || ''; },
  setMain(html) { const m = this.$('mMain'); m.innerHTML = html; return m; },
  /* 대화창: name 이름표, line 대사, note 작은 안내, buttons 대답 보기, action 오른쪽 버튼, next 화면 눌러 다음 */
  setDialog({ name = '', line = '', note = '', buttons = [], action = null, type = false, next = null }) {
    const d = this.$('mDialog');
    this.$('mName').textContent = name;
    this.$('mNote').textContent = note;
    const rep = this.$('mReplies'); rep.innerHTML = '';
    const act = this.$('mAction'); act.innerHTML = '';
    const nx = this.$('mNext'); nx.hidden = true; nx.textContent = CONTENT.text.nextLine;
    d.classList.remove('clickable'); d.onclick = null;
    const showRest = () => {
      buttons.forEach(b => {
        const btn = document.createElement('button');
        btn.className = 'btn' + (b.primary ? '' : ' secondary');
        btn.textContent = b.label;
        btn.addEventListener('click', e => { e.stopPropagation(); Sound.play('click'); b.onClick(); });
        rep.appendChild(btn);
      });
      if (action) {
        const btn = document.createElement('button');
        btn.className = 'btn'; btn.textContent = action.label;
        btn.disabled = !!action.disabled;
        btn.addEventListener('click', e => { e.stopPropagation(); Sound.play('click'); action.onClick(); });
        act.appendChild(btn);
        this.actionBtn = btn;
      }
      if (next) {
        nx.hidden = false; d.classList.add('clickable');
        d.onclick = () => { d.onclick = null; Sound.play('click'); next(); };
      }
    };
    this.typeLine(line, type, showRest);
  },
  /* 대사를 한 글자씩 (화면을 누르면 바로 다 보임) */
  typeLine(text, type, done) {
    const el = this.$('mLine'), d = this.$('mDialog');
    clearInterval(this.typer);
    if (!type) { el.textContent = text; done(); return; }
    Sound.play('text', 0.4);
    let i = 0; el.textContent = '';
    const finish = () => { clearInterval(this.typer); el.textContent = text; d.onclick = null; done(); };
    d.onclick = finish;
    this.typer = setInterval(() => { i++; el.textContent = text.slice(0, i); if (i >= text.length) finish(); }, 35);
  },

  /* ---------- 주민 대화 ---------- */
  talk() {
    const t = this.talkData, name = this.zone.name;
    this.setBar(0);
    this.setNpc('hurt'); this.setPlayer('surprised');
    this.setMain('');
    this.setDialog({
      name, line: t.first, type: true,
      buttons: CONTENT.replies.map(label => ({ label, onClick: () => {
        this.setPlayer('explain', label);
        this.setDialog({ name, line: t.situation, type: true, next: () => this.bag() });
      } }))
    });
  },

  /* ---------- ① 구급가방 ---------- */
  bag() {
    const T = CONTENT.text, r = this.round, need = r.items.filter(i => i.correct).length;
    const picked = new Set();
    this.setBar(1, T.stepNames[0]);
    this.setNpc('hurt'); this.setPlayer('kit');
    const main = this.setMain(`<div class="board" style="width:100%">
      <div class="count" style="font-family:var(--font-title);font-weight:700;text-align:right;margin-bottom:8px" id="bagCount"></div>
      <div class="item-grid">${r.items.map((it, i) =>
        `<button class="item-card" data-i="${i}"><img class="pixel" src="assets/items/${it.img}.png" alt="">${esc(it.name)}</button>`).join('')}</div></div>`);
    const count = () => { main.querySelector('#bagCount').textContent = fillText(T.bagCount, { picked: picked.size, n: need }); };
    count();
    main.querySelectorAll('.item-card').forEach(c => c.addEventListener('click', () => {
      const i = +c.dataset.i;
      if (picked.has(i)) { picked.delete(i); Sound.play('click', 0.4); } else { picked.add(i); Sound.play('item'); }
      c.classList.toggle('picked', picked.has(i));
      count();
    }));
    this.setDialog({
      name: T.bagTag,
      line: fillText(T.bagTodo, { name: this.zone.name, n: need }),
      note: T.bagHelp,
      action: { label: T.bagSubmit, onClick: () => submit() }
    });
    const submit = () => {
      const extra = [...picked].filter(i => !r.items[i].correct).length;
      const missing = r.items.filter((it, i) => it.correct && !picked.has(i)).length;
      if (!extra && !missing) return this.bagRight();
      Sound.play('wrong');
      this.setNpc('hurt', T.bagWrongBubble); this.setPlayer('worry');
      const lines = [];
      if (extra) lines.push(fillText(T.bagWrongExtra, { n: extra }));
      if (missing) lines.push(fillText(T.bagWrongMissing, { n: missing }));
      showPopup({
        title: T.bagWrongTitle, sound: false,
        body: `<div class="result no" style="text-align:left"><span class="icon">✕</span><div>${lines.map(esc).join('<br>')}</div></div>
               <p class="note">${esc(T.bagWrongNote)}</p>`,
        buttons: [{ label: T.bagRetry, primary: true, onClick: () => { this.setNpc('hurt'); this.setPlayer('kit'); } }]
      });
    };
  },
  bagRight() {
    const T = CONTENT.text, r = this.round, n = r.items.filter(i => i.correct).length;
    Sound.play('correct');
    this.setNpc('care', T.bagRightBubble); this.setPlayer('happy');
    const row = (it, ok) => `<div class="result ${ok ? 'ok' : 'no'} answer-row"><span class="icon">${ok ? '✓' : '✕'}</span>
      <img class="pixel" src="assets/items/${it.img}.png" alt=""><div><div class="name">${esc(it.name)}</div><div class="fb">${esc(it.fb)}</div></div></div>`;
    const [h1, h2] = [T.bagRightCorrectHead, T.bagRightWrongHead];
    this.setMain(`<div class="board scroll answer-list" style="width:100%">
      <h3>${esc(h1)}</h3>${r.items.filter(i => i.correct).map(it => row(it, true)).join('')}
      <h3>${esc(h2)}</h3>${r.items.filter(i => !i.correct).map(it => row(it, false)).join('')}</div>`);
    this.setDialog({ name: T.playerName, line: fillText(T.bagRightPlayer, { n }), action: { label: T.next, onClick: () => this.ox() } });
  },

  /* ---------- ② O/X ---------- */
  ox() {
    const T = CONTENT.text, r = this.round;
    const sym = a => (a === 'O' ? '◯' : '×');
    this.setBar(2, T.stepNames[1]);
    this.setNpc('hurt'); this.setPlayer('think');
    const main = this.setMain(`<div style="display:flex;flex-direction:column;gap:18px;width:100%;align-items:center">
      <div class="ox"><button class="btn o" data-a="O" aria-label="O">◯</button><button class="btn x" data-a="X" aria-label="X">×</button></div>
      <div id="oxResult" style="width:100%"></div></div>`);
    this.setDialog({ name: T.oxTag, line: r.ox.q, note: T.oxGuide });
    this.$('mLine').style.fontWeight = '700';
    main.querySelectorAll('.ox .btn').forEach(b => b.addEventListener('click', () => {
      if (b.dataset.a === r.ox.answer) {
        Sound.play('correct');
        main.querySelectorAll('.ox .btn').forEach(x => { x.disabled = x !== b; });
        this.setNpc('care', T.oxRightBubble); this.setPlayer('happy');
        main.querySelector('#oxResult').innerHTML = `<div class="result ok" style="background:rgba(227,244,220,.96)"><span class="icon">✓</span>
          <div><b>${esc(fillText(T.oxRightTitle, { answer: sym(r.ox.answer) }))}</b><br>${esc(r.ox.explain)}</div></div>`;
        this.setDialog({ name: T.oxTag, line: r.ox.q, action: { label: T.next, onClick: () => { this.$('mLine').style.fontWeight = ''; this.action(); } } });
      } else {
        Sound.play('wrong');
        this.setNpc('hurt', T.oxWrongBubble); this.setPlayer('worry');
        showPopup({
          title: T.oxWrongTitle, sound: false,
          body: `<div class="result hint" style="text-align:left"><span class="icon">💡</span><div><b>${esc(T.hintLabel)}</b><br>${esc(r.ox.hint)}</div></div>
                 <p class="note">${esc(T.oxWrongNote)}</p>`,
          buttons: [{ label: T.retry, primary: true, onClick: () => { this.setNpc('hurt'); this.setPlayer('think'); } }]
        });
      }
    }));
  },

  /* ---------- ③ 행동 선택 ---------- */
  action() {
    const T = CONTENT.text, r = this.round, nums = ['①', '②', '③', '④'];
    this.setBar(3, T.stepNames[2]);
    this.setNpc('hurt'); this.setPlayer('think');
    const main = this.setMain(`<div class="board" style="width:100%">
      <div class="choices">${r.action.map((a, i) => `<button class="choice" data-i="${i}"><span class="num">${nums[i]}</span><span>${esc(a.text)}</span></button>`).join('')}</div>
      <div id="actResult" style="margin-top:12px"></div></div>`);
    this.setDialog({ name: this.zone.name, line: fillText(T.actionAsk, { ask: r.ask }) });
    main.querySelectorAll('.choice').forEach(c => c.addEventListener('click', () => {
      const a = r.action[+c.dataset.i], res = main.querySelector('#actResult');
      if (a.correct) {
        Sound.play('correct');
        c.classList.add('right');
        main.querySelectorAll('.choice').forEach(x => { x.disabled = true; });
        this.setNpc('care', T.actionRightBubble); this.setPlayer('thumb');
        res.innerHTML = `<div class="result ok"><span class="icon">✓</span><div><b>${esc(T.actionRightTitle)}</b><br>${esc(a.fb)}</div></div>`;
        this.setDialog({ name: this.zone.name, line: fillText(T.actionAsk, { ask: r.ask }), action: { label: T.next, onClick: () => this.afterRound() } });
      } else {
        Sound.play('wrong');
        c.classList.add('wrong');   // 보기는 그대로 남겨 두고 다시 고르기
        this.setNpc('hurt', T.actionWrongBubble); this.setPlayer('worry');
        res.innerHTML = `<div class="result no"><span class="icon">✕</span><div><b>${esc(T.actionWrongTitle)}</b> ${esc(T.actionWrongWhy)}<br>${esc(a.fb)}</div></div>`;
      }
    }));
  },

  /* ---------- 라운드 끝난 뒤 ---------- */
  afterRound() {
    if (this.ri === 0 && this.zone.rounds.length === 2) return this.roundChange();
    if (this.round.handoff) return this.handoff();
    this.notebook();
  },
  /* 6·9구역: 2라운드로 (수첩·배지는 아직 주지 않음) */
  roundChange() {
    const T = CONTENT.text;
    this.ri = 1;
    this.setBar(0);
    this.setNpc('hurt'); this.setPlayer('surprised');
    this.setMain(`<div class="board"><p class="big-title">${esc(T.roundChangeTitle)}</p></div>`);
    this.setDialog({
      name: this.zone.name, line: this.talkData.link, type: true,
      action: { label: T.roundChangeButton, onClick: () => this.bag() }
    });
  },
  /* 6-2·8·9-2구역: 회복 장면 대신 119·어른 인계 */
  handoff() {
    const T = CONTENT.text;
    if (CONTENT.sirenRounds.includes(this.roundId)) Sound.play('siren', 0.5);
    this.setBar(0);
    this.setNpc('care'); this.setPlayer('call');
    this.setMain(`<div class="result ok" style="background:rgba(227,244,220,.96);font-size:24px"><span class="icon">✓</span><div><b>${esc(T.handoffTitle)}</b></div></div>`);
    this.setDialog({ name: T.guideTag, line: T.handoffLine, action: { label: T.next, onClick: () => this.notebook() } });
  },

  /* ---------- 수첩 (6·9구역은 두 라운드를 한 수첩에) ---------- */
  notebookHTML(zone = this.zone) {
    const C = CONTENT, T = C.text, nums = ['①', '②', '③', '④', '⑤'];
    const two = zone.rounds.length === 2;
    const parts = zone.rounds.map((rid, k) => {
      const r = C.rounds[rid];
      return `${two ? `<div class="sub">${k + 1}라운드 · ${esc(r.title)}</div>` : ''}<ol>${r.notebook.map((l, i) => `<li>${nums[i]} ${esc(l)}</li>`).join('')}</ol>`;
    }).join('');
    return `<div class="notebook"><h2 style="margin:0">${esc(T.notebookTitle)} <span class="note">· ${zone.id}구역 ${esc(zone.topic)}</span></h2>
      <div class="sub">${esc(T.notebookHead)}</div>${parts}<div class="foot">${esc(C.notebookFooter)}</div></div>`;
  },
  notebook() {
    const T = CONTENT.text;
    this.setBar(0);
    this.setNpc('care'); this.setPlayer('explain');
    this.setMain(this.notebookHTML());
    this.setDialog({ name: T.notebookTitle, line: T.notebookGuide, action: { label: T.notebookDone, onClick: () => this.complete() } });
  },

  /* ---------- 미션 완료·배지 ---------- */
  complete() {
    const T = CONTENT.text, z = this.zone, handoff = !!this.talkData.handoff;
    App.completeZone(z.id);
    Sound.play('badge');
    this.setBar(0);
    this.setNpc('done'); this.setPlayer('happy');
    this.setMain(`<div class="board complete-box">
      <p class="big-title" style="margin:0">${esc(T.missionComplete)}</p>
      <img class="badge" src="assets/badges/${z.badge}.webp" alt="${esc(z.topic)} 배지">
      <p class="big-title" style="font-size:24px;margin:0">${esc(fillText(handoff ? T.missionCompleteHandoff : T.missionCompleteBig, { name: z.name }))}</p></div>`);
    this.setDialog({
      name: z.name, line: this.talkData.thanks || T.handoffLine,
      buttons: [
        { label: T.backToVillage, primary: true, onClick: () => this.backToVillage() },
        { label: T.notebookAgain, onClick: () => showPopup({ body: this.notebookHTML(), wide: true }) }
      ]
    });
  },

  backToVillage() {
    clearInterval(this.typer);
    App.show('village');
    Village.enter();
    App.maybeLessonComplete();
  },

  /* 미션 나가기: 지금 미션은 처음부터 (6·9구역은 1라운드부터) */
  exitConfirm() {
    const T = CONTENT.text;
    if (App.done.has(this.zone.id) && this.$('mMain').querySelector('.complete-box')) return this.backToVillage();
    const note = T.exitNote + (this.zone.rounds.length === 2 && this.ri === 1 ? ' ' + T.exitNoteRound2 : '');
    showPopup({
      title: T.exitTitle,
      body: `<p style="text-align:center">${esc(note)}</p>`,
      buttons: [{ label: T.exitContinue }, { label: T.exitConfirm, primary: true, onClick: () => this.backToVillage() }]
    });
  }
};
