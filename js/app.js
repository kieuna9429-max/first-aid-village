/* =====================================================================
   학생 화면 전체 흐름 (app.js)
   시작 화면 → 마을 → 미션 → 마을 … → 오늘의 수업 완료
   진행 상황은 실행 중 메모리에만 있고, 새로고침하면 처음부터 (저장하지 않음)
   ===================================================================== */
const App = {
  settings: null,
  done: new Set(),            // 완료한 구역 번호
  lessonShown: false,
  bgm: null,

  init() {
    const C = CONTENT, T = C.text;
    document.getElementById('appName').textContent = C.appName;
    document.getElementById('dirName').textContent = T.directorName;
    document.getElementById('welcome').textContent = T.welcome;
    const go = document.getElementById('goBtn');
    go.textContent = T.startButton;
    const start = document.getElementById('start');
    setPlaceBackground(start, C.zones.find(z => z.id === 10), 1.6);
    sizeActors(start, 0.8);

    this.settings = readStudentLink();
    if (!this.settings) {
      go.disabled = true;
      showPopup({ title: T.badLinkTitle, body: `<p style="text-align:center">${esc(T.badLinkNote)}</p>`, buttons: [], sound: false });
      return;
    }
    this.sound = { ...this.settings.sound };   // 학생이 바꿀 수 있는 현재 소리 설정
    Sound.sfxOn = this.sound.sfx;
    ['soundBtnV', 'soundBtnM'].forEach(id => {
      const b = document.getElementById(id);
      b.addEventListener('click', () => this.soundPopup());
    });
    this.refreshSoundButtons();

    // 새로고침으로 다시 열린 경우 안내
    const nav = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
    if (nav && nav.type === 'reload') {
      showPopup({ title: T.reloadTitle, body: `<p style="text-align:center">${esc(T.reloadNote)}</p>`, sound: false });
    }

    go.addEventListener('click', () => {
      Sound.play('click');
      this.show('village');
      Village.enter();
    });
  },

  show(id) {
    document.querySelectorAll('.screen').forEach(s => { s.hidden = s.id !== id; });
    this.updateBgm(id === 'village');
  },

  /* ---------- 소리 ---------- */
  refreshSoundButtons() {
    const any = this.sound.bgm || this.sound.sfx || this.sound.metronome;
    const label = any ? '🔊 ' + CONTENT.text.soundOn : '🔇 ' + CONTENT.text.soundOff;
    ['soundBtnV', 'soundBtnM'].forEach(id => { document.getElementById(id).textContent = label; });
  },
  soundPopup() {
    const names = CONTENT.teacher.soundNames;
    const body = `<div class="sound-row" style="justify-content:center">${['bgm', 'sfx', 'metronome'].map(k =>
      `<button class="switch" data-k="${k}" aria-pressed="${this.sound[k]}">${esc(names[k])} <span class="state">${this.sound[k] ? '켜기' : '끄기'}</span></button>`).join('')}</div>
      <p class="note" style="text-align:center">소리를 꺼도 글자로 모두 알려 줘요.</p>`;
    const { overlay } = showPopup({ title: '소리 설정', body });
    overlay.querySelectorAll('.switch').forEach(b => b.addEventListener('click', () => {
      const k = b.dataset.k; this.sound[k] = !this.sound[k];
      b.setAttribute('aria-pressed', this.sound[k]);
      b.querySelector('.state').textContent = this.sound[k] ? '켜기' : '끄기';
      Sound.sfxOn = this.sound.sfx;
      this.refreshSoundButtons();
      this.updateBgm(!document.getElementById('village').hidden);
    }));
  },
  /* 배경음: 마을 탐험 중에만 반복, 미션(문제 읽기) 중에는 일시정지 */
  updateBgm(inVillage) {
    if (!this.bgm) { this.bgm = new Audio('assets/sounds/bgm.mp3'); this.bgm.loop = true; this.bgm.volume = 0.35; }
    if (inVillage && this.sound && this.sound.bgm) this.bgm.play().catch(() => {});
    else this.bgm.pause();
  },

  /* ---------- 구역 완료 ---------- */
  completeZone(id) { this.done.add(id); },
  allDone() { return this.settings.zones.every(id => this.done.has(id)); },

  /* 선택 구역을 모두 마쳤을 때 (마을로 돌아온 뒤 한 번) */
  maybeLessonComplete() {
    if (this.lessonShown || !this.allDone()) return;
    this.lessonShown = true;
    const T = CONTENT.text;
    Sound.play('lesson_complete');
    const badges = this.settings.zones.map(id => {
      const z = CONTENT.zones.find(x => x.id === id);
      return `<img src="assets/badges/${z.badge}.webp" alt="${esc(z.topic)} 배지">`;
    }).join('');
    showPopup({
      title: T.lessonDoneTitle, wide: true, sound: false,
      body: `<div style="text-align:center"><div style="display:flex;justify-content:center;margin-bottom:6px"><img class="pixel" src="assets/player/player_happy.png" style="height:150px" alt=""></div>
        <p class="big-title" style="font-size:26px">${esc(fillText(T.lessonDoneLine, { n: this.done.size }))}</p>
        <div class="badge-row">${badges}</div>
        <p class="note">${esc(T.lessonDoneNote)}</p></div>`,
      buttons: [{ label: T.lessonDoneButton, primary: true }]
    });
  }
};
