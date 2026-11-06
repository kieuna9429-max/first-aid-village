/* =====================================================================
   마을 지도 (village.js)
   방향키·가상 조이스틱, 빠른 이동 (안내 문구에는 없지만 W·A·S·D 키도 동작)
   주민 가까이 가면 [도와주기]. 고르지 않은 구역은 잠김 표시
   (가상 조이스틱·미니맵은 2차에서 추가 예정)
   ===================================================================== */
const Village = {
  MAP_W: 2752, MAP_H: 1536,
  NPC_SCALE: 0.62,        // 지도 위 주민 그림 배율 (원본 그림 기준)
  PLAYER_SCALE: 0.82,     // 지도 위 보건 대원 배율 (걷기 그림 한 칸 112×150 기준)
  SPEED: 330,             // 1초에 걷는 거리 (지도 픽셀)
  NEAR: 190,              // [도와주기]가 나오는 거리 (지도 픽셀)
  built: false,
  keys: new Set(),
  pos: { x: 0, y: 0 }, dir: 'down', walkT: 0, moving: false,
  nearId: null, lockedToastId: null, active: false,

  enter() {
    if (!this.built) this.build();
    this.active = true;
    this.refresh();
    this.layout();
    this.loopStart();
  },
  leave() { this.active = false; this.keys.clear(); if (this.joyEnd) this.joyEnd(); },

  build() {
    const C = CONTENT, T = C.text;
    this.world = document.getElementById('world');
    this.view = document.getElementById('village');
    document.getElementById('quickBtn').textContent = T.quickMove;
    document.getElementById('notebookBtn').textContent = T.notebookButton;
    document.getElementById('moveHelp').textContent = T.moveHelp;

    // 주민 10명
    this.npcEls = {};
    C.zones.forEach(z => {
      const el = document.createElement('div');
      el.className = 'npc';
      el.innerHTML = `<span class="marker"></span><img class="pixel" src="assets/chars/${z.char}.png" alt="${esc(z.name)}"><span class="npc-name">${z.id}구역 ${esc(z.name)}</span>`;
      // 머리 위 '!'를 누르면 거리와 상관없이 바로 미션 시작 (완료·잠김 표시는 누르지 않음)
      const marker = el.querySelector('.marker');
      marker.addEventListener('click', () => {
        if (this.active && marker.classList.contains('need')) this.startZone(z.id);
      });
      this.world.appendChild(el);
      this.npcEls[z.id] = el;
    });
    // 보건 대원
    this.player = document.createElement('div');
    this.player.className = 'player-sprite';
    this.world.appendChild(this.player);

    // 시작 위치: 가운데 분수 광장 아래
    this.pos = { x: this.MAP_W * 0.4, y: this.MAP_H * 0.64 };   // 광장 왼쪽 길 (어느 주민과도 조금 떨어진 곳)

    // 키보드
    addEventListener('keydown', e => {
      if (!this.active || document.querySelector('.overlay')) return;
      const k = e.key.toLowerCase();
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'].includes(k)) { this.keys.add(k); e.preventDefault(); }
      if ((k === 'enter' || k === ' ') && this.nearId) { e.preventDefault(); this.help(); }
    });
    addEventListener('keyup', e => this.keys.delete(e.key.toLowerCase()));
    addEventListener('blur', () => this.keys.clear());

    document.getElementById('helpBtn').addEventListener('click', () => this.help());
    document.getElementById('quickBtn').addEventListener('click', () => this.quickMove());
    document.getElementById('notebookBtn').addEventListener('click', () => this.notebookList());
    document.getElementById('villageExitBtn').textContent = T.exit;
    document.getElementById('villageExitBtn').addEventListener('click', () => this.exitConfirm());
    addEventListener('resize', () => this.layout());
    this.buildJoystick();
    this.buildMinimap();
    this.built = true;
  },

  /* 가상 조이스틱: 터치 화면(태블릿·휴대폰)에서만. 동그라미를 끌면 그 방향으로 걸어감 */
  buildJoystick() {
    const touch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
    if (!touch) return;
    this.view.classList.add('touch');
    const base = document.createElement('div');
    base.className = 'joystick'; base.setAttribute('aria-label', '조이스틱');
    base.innerHTML = '<div class="knob"></div>';
    this.view.appendChild(base);
    const knob = base.querySelector('.knob');
    let id = null;
    const move = e => {
      const r = base.getBoundingClientRect(), R = r.width / 2;
      let dx = e.clientX - (r.left + R), dy = e.clientY - (r.top + R);
      const d = Math.hypot(dx, dy), max = R * 0.62;
      if (d > max) { dx = dx / d * max; dy = dy / d * max; }
      knob.style.transform = `translate(${dx}px, ${dy}px)`;
      const k = Math.hypot(dx, dy) / max;
      this.joy = k < 0.15 ? null : { x: dx / max, y: dy / max };
    };
    const end = () => { id = null; this.joy = null; knob.style.transform = ''; };
    base.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); id = e.pointerId; try { base.setPointerCapture(id); } catch (_) {} move(e); });
    base.addEventListener('pointermove', e => { if (e.pointerId === id) move(e); });
    base.addEventListener('pointerup', end); base.addEventListener('pointercancel', end); base.addEventListener('lostpointercapture', end);
    this.joyEnd = end;   // 손을 떼면 바로 멈춤 (미션에 들어갈 때·창을 벗어날 때도)
    addEventListener('blur', end);
  },

  /* 미니맵: 지도(같은 그림)를 작게 보여 주고 주민(! / ✓ / 잠김)과 보건 대원 위치 표시. 누르면 크게, 다시 누르면 원래 크기로 */
  buildMinimap() {
    const mm = document.createElement('div');
    mm.className = 'minimap'; mm.setAttribute('aria-label', '미니맵');
    mm.innerHTML = '<div class="mm-me"></div>' + CONTENT.zones.map(z =>
      `<div class="mm-npc" data-id="${z.id}" style="left:${z.x}%;top:${z.y}%"></div>`).join('');
    this.view.appendChild(mm);
    this.mm = mm;
    mm.addEventListener('click', () => { mm.classList.toggle('big'); Sound.play('click', 0.4); });   // 누르면 크게, 다시 누르면 원래 크기로
  },
  drawMinimap() {
    if (!this.mm) return;
    const me = this.mm.querySelector('.mm-me');
    me.style.left = (this.pos.x / this.MAP_W * 100) + '%';
    me.style.top = (this.pos.y / this.MAP_H * 100) + '%';
  },

  /* 화면 크기에 맞춰 지도 배율 정하기 */
  layout() {
    const W = innerWidth, H = innerHeight;
    this.s = Math.max(H * 1.75 / this.MAP_H, W * 1.15 / this.MAP_W);
    this.world.style.width = (this.MAP_W * this.s) + 'px';
    this.world.style.height = (this.MAP_H * this.s) + 'px';
    CONTENT.zones.forEach(z => {
      const el = this.npcEls[z.id];
      el.style.left = (z.x / 100 * this.MAP_W * this.s) + 'px';
      el.style.top = (z.y / 100 * this.MAP_H * this.s) + 'px';
      el.style.zIndex = Math.round(z.y / 100 * this.MAP_H);   // 아래쪽에 있는 것이 앞에 보이게
      const img = el.querySelector('img');
      const set = () => { img.style.height = (img.naturalHeight * this.NPC_SCALE * this.s) + 'px'; };
      img.complete ? set() : img.addEventListener('load', set, { once: true });
    });
    const k = this.PLAYER_SCALE * this.s;
    Object.assign(this.player.style, { width: 112 * k + 'px', height: 150 * k + 'px', backgroundSize: `${448 * k}px ${600 * k}px` });
    this.draw();
  },

  /* 잠김·도움 필요(!)·완료 표시와 '해결한 주민' 숫자 */
  refresh() {
    const T = CONTENT.text, sel = App.settings.zones;
    CONTENT.zones.forEach(z => {
      const el = this.npcEls[z.id], m = el.querySelector('.marker');
      const selected = sel.includes(z.id), done = App.done.has(z.id);
      el.classList.toggle('locked', !selected);
      m.className = 'marker ' + (!selected ? 'lock' : done ? 'done' : 'need');
      m.textContent = !selected ? '잠김' : done ? T.doneMark : '!';
    });
    if (this.mm) this.mm.querySelectorAll('.mm-npc').forEach(d => {
      const id = +d.dataset.id;
      d.className = 'mm-npc ' + (!sel.includes(id) ? 'lock' : App.done.has(id) ? 'done' : 'need');
    });
    document.getElementById('solvedBox').textContent = fillText(T.solved, { done: sel.filter(id => App.done.has(id)).length, total: sel.length });
  },

  /* ---------- 움직이기 ---------- */
  loopStart() {
    if (this.looping) return;
    this.looping = true;
    let last = performance.now();
    const step = now => {
      const dt = Math.min((now - last) / 1000, 0.05); last = now;
      if (this.active) this.update(dt);
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  },
  update(dt) {
    let vx = 0, vy = 0;
    const K = this.keys;
    if (K.has('arrowleft') || K.has('a')) vx -= 1;
    if (K.has('arrowright') || K.has('d')) vx += 1;
    if (K.has('arrowup') || K.has('w')) vy -= 1;
    if (K.has('arrowdown') || K.has('s')) vy += 1;
    if (!vx && !vy && this.joy) { vx = this.joy.x; vy = this.joy.y; }   // 가상 조이스틱
    this.moving = !!(vx || vy);
    if (this.moving) {
      const len = Math.hypot(vx, vy), sp = this.SPEED * Math.min(1, len);   // 조이스틱은 많이 밀수록 빠르게
      this.pos.x = Math.min(Math.max(this.pos.x + vx / len * sp * dt, 40), this.MAP_W - 40);
      this.pos.y = Math.min(Math.max(this.pos.y + vy / len * sp * dt, 120), this.MAP_H - 10);
      this.dir = Math.abs(vx) > Math.abs(vy) ? (vx > 0 ? 'right' : 'left') : (vy > 0 ? 'down' : 'up');
      this.walkT += dt;
    }
    this.draw();
    this.checkNear();
  },
  draw() {
    if (!this.s) return;
    const k = this.PLAYER_SCALE * this.s, fw = 112 * k, fh = 150 * k;
    // 걷기 그림 칸: 정면(1행)·뒷모습(2행)·오른쪽(3행)·왼쪽(4행)
    const frames = { down: [0, 1, 2, 3].map(c => [0, c]), up: [0, 1, 2, 3].map(c => [1, c]), right: [0, 1, 2, 3].map(c => [2, c]), left: [0, 1, 2, 3].map(c => [3, c]) }[this.dir];
    const f = this.moving ? frames[Math.floor(this.walkT * 8) % frames.length] : frames[0];
    this.player.style.backgroundPosition = `${-f[1] * fw}px ${-f[0] * fh}px`;
    this.player.style.left = (this.pos.x * this.s) + 'px';
    this.player.style.top = (this.pos.y * this.s) + 'px';
    this.player.style.transform = 'translate(-50%, -100%)';
    this.player.style.zIndex = Math.round(this.pos.y);
    // 카메라: 보건 대원을 가운데로 (지도 밖은 안 보이게)
    const W = this.view.clientWidth, H = this.view.clientHeight;
    const cx = Math.min(Math.max(this.pos.x * this.s - W / 2, 0), this.MAP_W * this.s - W);
    const cy = Math.min(Math.max(this.pos.y * this.s - H * 0.55, 0), this.MAP_H * this.s - H);
    this.world.style.transform = `translate(${-cx}px, ${-cy}px)`;
    this.drawMinimap();
  },

  checkNear() {
    let best = null, bestD = Infinity;
    CONTENT.zones.forEach(z => {
      const d = Math.hypot(z.x / 100 * this.MAP_W - this.pos.x, z.y / 100 * this.MAP_H - this.pos.y);
      if (d < bestD) { bestD = d; best = z; }
    });
    const near = bestD < this.NEAR ? best : null;
    const btn = document.getElementById('helpBtn');
    if (near && App.settings.zones.includes(near.id)) {
      this.nearId = near.id; this.lockedToastId = null;
      btn.hidden = false;
      btn.textContent = `${CONTENT.text.help} · ${near.name}${App.done.has(near.id) ? ' ' + CONTENT.text.replayTag : ''}`;
    } else {
      this.nearId = null; btn.hidden = true;
      if (near && this.lockedToastId !== near.id) { this.lockedToastId = near.id; toast(CONTENT.text.locked); }
      if (!near) this.lockedToastId = null;
    }
  },

  help() {
    if (this.nearId) this.startZone(this.nearId);
  },
  startZone(id) {
    Sound.play('click');
    if (id === 10 && typeof CPR === 'undefined') {
      showPopup({ title: '10구역 심폐소생술·AED', body: '<p style="text-align:center">10구역은 3단계에서 이어서 만들어요.</p>' });
      return;
    }
    this.leave();
    document.getElementById('helpBtn').hidden = true;
    App.show('mission');
    if (id === 10) CPR.start(); else Mission.start(id);
  },

  /* 마을 [나가기]: 경고창 뒤 첫 화면으로 (진행 내용은 사라짐) */
  exitConfirm() {
    const T = CONTENT.text;
    showPopup({
      title: T.villageExitTitle, body: `<p style="text-align:center">${esc(T.villageExitNote)}</p>`,
      buttons: [{ label: T.exitContinue }, { label: T.exitConfirm, primary: true, onClick: () => App.leave() }]
    });
  },

  /* 응급처치 수첩 목록: 오늘 고른 구역의 배지. 도와준 구역만 수첩을 열 수 있음 */
  notebookList() {
    const T = CONTENT.text;
    Sound.play('click');
    const cards = App.settings.zones.map(id => {
      const z = CONTENT.zones.find(x => x.id === id), done = App.done.has(id);
      return done
        ? `<button class="nb-card done" data-id="${id}"><img src="assets/badges/${z.badge}.webp" alt="${esc(z.topic)} 배지"><span>${id}구역 · ${esc(z.topic)}</span></button>`
        : `<div class="nb-card locked"><div class="nb-q">?</div><span>${id}구역 · ${esc(z.topic)}</span><span class="note">${esc(T.notebookLocked)}</span></div>`;
    }).join('');
    const { overlay, close } = showPopup({
      title: T.notebookTitle, wide: true,
      body: `<p class="note" style="text-align:center;margin-top:0">${esc(T.notebookListNote)}</p><div class="nb-grid">${cards}</div>`,
      buttons: [{ label: T.close }]
    });
    overlay.querySelectorAll('.nb-card.done').forEach(b => b.addEventListener('click', () => {
      close();
      const z = CONTENT.zones.find(x => x.id === +b.dataset.id);
      const html = z.id === 10 ? CPR.notebookHTML() : Mission.notebookHTML(z);
      showPopup({ body: html, wide: true, buttons: [{ label: T.notebookBack, onClick: () => this.notebookList() }, { label: T.close, primary: true }] });
    }));
  },

  /* 빠른 이동: 오늘 고른 구역만 */
  quickMove() {
    const T = CONTENT.text;
    const items = App.settings.zones.map(id => {
      const z = CONTENT.zones.find(x => x.id === id);
      return `<button class="btn secondary" data-id="${id}"><img class="pixel" src="assets/chars/${z.char}.png" alt="">
        <span>${id}구역 · ${esc(z.topic)}<br><span class="note">${esc(z.place)}</span></span>
        ${App.done.has(id) ? `<span class="done-tag">${esc(T.doneMark)}</span>` : ''}</button>`;
    }).join('');
    const { overlay, close } = showPopup({
      title: T.quickMove, wide: true,
      body: `<div class="quick-list">${items}</div><p class="note" style="text-align:center">${esc(T.quickMoveNote)}</p>`,
      buttons: [{ label: '닫기' }]
    });
    overlay.querySelectorAll('.quick-list .btn').forEach(b => b.addEventListener('click', () => {
      const z = CONTENT.zones.find(x => x.id === +b.dataset.id);
      this.pos = { x: z.x / 100 * this.MAP_W, y: z.y / 100 * this.MAP_H + 70 };
      this.dir = 'up';
      close(); Sound.play('click');
      this.draw(); this.checkNear();
    }));
  }
};
