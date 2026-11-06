/* =====================================================================
   장소 배경 (scene.js)
   주민 대화·구급가방·O/X·행동 선택 화면의 배경으로
   지도(map.webp)에서 그 구역 장소를 확대해 보여 줍니다. 그림은 바꾸지 않고 확대만 합니다.
   ===================================================================== */
const MAP_W = 2752, MAP_H = 1536;   // 지도 원본 크기
const PLACE_ZOOM = 2.6;             // 확대 배율 (화면 가로 기준)

/** el(배경을 깔 칸)에 zone 장소를 확대해 깔기. zone은 content.js의 zones 항목 */
function setPlaceBackground(el, zone, zoom = PLACE_ZOOM) {
  const apply = () => {
    const W = el.clientWidth, H = el.clientHeight;
    const bgW = Math.max(W * zoom, H * MAP_W / MAP_H), bgH = bgW * MAP_H / MAP_W;   // 세로로 긴 화면(휴대폰)에서도 빈칸 없이 채움
    const zy = Math.max(bgH / H, 1.0001);
    const zx = Math.max(bgW / W, 1.0001);
    // 장소 가운데를 화면 가운데로 (지도 밖이 보이지 않게 0~100%로 제한)
    const px = Math.min(Math.max((zone.viewX / 100 * zx - 0.5) / (zx - 1), 0), 1);
    const py = Math.min(Math.max((zone.viewY / 100 * zy - 0.5) / (zy - 1), 0), 1);
    el.style.backgroundImage = 'url(assets/map/map.webp)';
    el.style.backgroundSize = `${bgW}px auto`;
    el.style.backgroundPosition = `${px * 100}% ${py * 100}%`;
  };
  apply();
  window.addEventListener('resize', apply);
}

/** 주민·보건 대원 그림을 원본 비율 그대로, 모두 같은 배율로 표시 (발끝 맞춤은 CSS) */
const ACTOR_SCALE = 0.8;
function sizeActors(root = document, scale = ACTOR_SCALE) {
  root.querySelectorAll('.actor img').forEach(img => {
    const k = (Number(img.dataset.scale) || scale) * Math.min(1, innerHeight / 860);   // 세로가 짧은 화면이면 같은 비율로 조금 작게   // 얼굴만 있는 그림(보건소장)은 data-scale로 따로
    const set = () => { img.style.height = (img.naturalHeight * k) + 'px'; img.style.width = 'auto'; };
    img.complete ? set() : img.addEventListener('load', set);
  });
}
