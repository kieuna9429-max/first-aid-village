/* =====================================================================
   공통 기능 (common.js) – 학생·교사 화면이 함께 씀
   링크 설정 읽기/만들기, 조사(을/를) 맞추기, 팝업, 효과음
   ===================================================================== */

/* ---------- 학생용 링크 설정 ----------
   예) index.html?z=1,2,6&s=010&v=1
   z : 고른 구역 번호 (쉼표로 구분, 1~10)
   s : 소리 기본값 3자리 – 배경음·효과음·메트로놈 (1=켜기, 0=끄기)
   v : 링크 형식 버전
   정답은 링크에 넣지 않습니다. */
const LINK_VERSION = '1';

function buildStudentLink(zoneIds, sound) {
  const url = new URL('index.html', location.href);   // 교사용 주소와 같은 폴더의 학생용 시작 화면
  url.search = ''; url.hash = '';
  const z = [...zoneIds].map(Number).sort((a, b) => a - b).join(',');
  const s = [sound.bgm, sound.sfx, sound.metronome].map(on => (on ? '1' : '0')).join('');
  return `${url.href}?z=${z}&s=${s}&v=${LINK_VERSION}`;
}

/** 학생 링크를 읽어 설정 반환. 잘못된 링크면 null */
function readStudentLink(search = location.search) {
  const p = new URLSearchParams(search);
  const zRaw = p.get('z'), sRaw = p.get('s'), v = p.get('v');
  if (!zRaw || !sRaw || v !== LINK_VERSION) return null;
  if (!/^[01]{3}$/.test(sRaw)) return null;
  const ids = zRaw.split(',').map(x => x.trim());
  if (!ids.length || ids.some(x => !/^\d+$/.test(x))) return null;
  const zones = [...new Set(ids.map(Number))];
  const valid = CONTENT.zones.map(z => z.id);
  if (zones.some(id => !valid.includes(id))) return null;
  return {
    zones: zones.sort((a, b) => a - b),
    sound: { bgm: sRaw[0] === '1', sfx: sRaw[1] === '1', metronome: sRaw[2] === '1' }
  };
}

/* ---------- 조사: 이름 받침에 맞춰 을/를, 이/가 ---------- */
function hasBatchim(word) {
  const ch = word.trim().slice(-1);
  const code = ch.charCodeAt(0) - 0xac00;
  if (code < 0 || code > 11171) return false;
  return code % 28 !== 0;
}
function josa(word, pair) {           // pair: '을/를', '이/가', '은/는', '과/와'
  const [withB, withoutB] = pair.split('/');
  return word + (hasBatchim(word) ? withB : withoutB);
}
/** content.js 문구의 {name을} {n} 같은 자리를 채움 */
function fillText(template, vars = {}) {
  return template
    .replace(/\{(\w+)(을|를|이|가|은|는)\}/g, (_, key, j) => {
      const pair = { '을': '을/를', '를': '을/를', '이': '이/가', '가': '이/가', '은': '은/는', '는': '은/는' }[j];
      return josa(String(vars[key] ?? ''), pair);
    })
    .replace(/\{(\w+)\}/g, (_, key) => (vars[key] ?? ''));
}

/* ---------- 효과음 ---------- */
const Sound = {
  sfxOn: false,
  cache: {},
  play(name, volume = 0.6) {
    if (!this.sfxOn) return;
    try {
      const a = this.cache[name] || (this.cache[name] = new Audio(`assets/sounds/${name}.mp3`));
      a.currentTime = 0; a.volume = volume; a.play().catch(() => {});
    } catch (e) { /* 소리가 안 나도 진행에는 문제 없음 */ }
  }
};

/* ---------- 팝업 ----------
   showPopup({ title, body(HTML), buttons:[{label, primary, onClick}] }) */
function showPopup({ title = '', body = '', buttons = [{ label: CONTENT.text.ok, primary: true }], wide = false, sound = true }) {
  if (sound) Sound.play('popup', 0.5);
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.innerHTML = `
    <div class="panel popup${wide ? ' wide' : ''}" role="dialog" aria-modal="true">
      ${title ? `<h2>${title}</h2>` : ''}
      <div class="popup-body">${body}</div>
      <div class="actions"></div>
    </div>`;
  const actions = overlay.querySelector('.actions');
  const close = () => overlay.remove();
  buttons.forEach(b => {
    const btn = document.createElement('button');
    btn.className = 'btn' + (b.primary ? '' : ' secondary');
    btn.textContent = b.label;
    btn.addEventListener('click', () => { close(); b.onClick && b.onClick(); });
    actions.appendChild(btn);
  });
  overlay.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  document.body.appendChild(overlay);
  actions.querySelector('button')?.focus();
  return { overlay, close };
}

/** 잠깐 떴다 사라지는 안내 */
function toast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2200);
}

/** 정답·오답 설명이 화면 밖에 있으면 보이게 스크롤 */
function revealResult(el) {
  if (!el) return;
  requestAnimationFrame(() => el.scrollIntoView({ block: 'nearest', behavior: 'smooth' }));
}

/** HTML에 넣을 글자 안전하게 */
function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/* 예상 시간(분) 글자로: 1.5 → '1분 30초', 12 → '12분' */
function minutesText(m) {
  const whole = Math.floor(m);
  return m > whole ? (whole ? whole + '분 30초' : '30초') : whole + '분';
}
