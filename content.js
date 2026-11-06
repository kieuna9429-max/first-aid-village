/* =====================================================================
   응급처치 마을 방범대(EB) – 문항·문구 데이터 (content.js)
   ---------------------------------------------------------------------
   기준: 교육 콘텐츠 기획안 v2.5 · 개발요청서 v2.5 · 체크리스트(2026.11.2.)
   문구를 고칠 때는 이 파일의 글자만 바꾸면 됩니다. (따옴표 " " 는 지우지 마세요)
   ===================================================================== */

window.CONTENT = {

  /* 도구 이름 (화면 제목·QR 이미지에 쓰임). 이야기 속 마을 이름 '응급처치 마을'은 그대로 */
  appName: "응급처치 마을 방범대(EB)",

  /* ---------------------------------------------------------------
     구역 목록 (관리자 화면 카드 · 지도 · 배지)
     x, y : 지도에서 주민이 서 있는 위치 (지도 가로·세로의 %) – 코딩 때 맞춤
     viewX, viewY : 미션 화면 배경으로 확대해 보여 줄 장소의 가운데 (지도 %)
     --------------------------------------------------------------- */
  zones: [
    { id: 1,  name: "너구리",       topic: "화상",            place: "너구리 라면",   char: "zone1_raccoon",    badge: "badge_01", time: 1,    rounds: ["1"],        x: 31, y: 30, viewX: 29, viewY: 17 },
    { id: 2,  name: "제비",         topic: "발목 염좌",        place: "흥부네 집",     char: "zone2_swallow",    badge: "badge_02", time: 1,    rounds: ["2"],        x: 50, y: 28, viewX: 50, viewY: 15 },
    { id: 3,  name: "호랑이",       topic: "영구치 손상",      place: "떡 방앗간",     char: "zone3_tiger",      badge: "badge_03", time: 1,    rounds: ["3"],        x: 82, y: 55, viewX: 86, viewY: 37 },
    { id: 4,  name: "곰돌이",       topic: "벌 쏘임",          place: "꿀벌 꽃밭",     char: "zone4_bear",       badge: "badge_04", time: 1,    rounds: ["4"],        x: 80, y: 65, viewX: 80, viewY: 62 },
    { id: 5,  name: "코끼리",       topic: "코피",             place: "도토리 숲",     char: "zone5_elephant",   badge: "badge_05", time: 1,    rounds: ["5"],        x: 80, y: 86, viewX: 82, viewY: 83 },
    { id: 6,  name: "아기 토끼",    topic: "찰과상·심한 출혈", place: "달리기 운동장", char: "zone6_rabbit",     badge: "badge_06", time: 1.5,  rounds: ["6-1", "6-2"], x: 50, y: 82, viewX: 50, viewY: 87 },
    { id: 7,  name: "악어",         topic: "눈 이물질",        place: "모래 놀이터",   char: "zone7_crocodile",  badge: "badge_07", time: 1,    rounds: ["7"],        x: 22, y: 76, viewX: 22, viewY: 74 },
    { id: 8,  name: "다람쥐",       topic: "아나필락시스",     place: "밤 축제 마당",  char: "zone8_squirrel",   badge: "badge_08", time: 1,    rounds: ["8"],        x: 22, y: 50, viewX: 20, viewY: 48 },
    { id: 9,  name: "딱따구리",     topic: "머리 손상",        place: "숲속 축구장",   char: "zone9_woodpecker", badge: "badge_09", time: 1.5,  rounds: ["9-1", "9-2"], x: 72, y: 20, viewX: 72, viewY: 20 },
    { id: 10, name: "거북이 촌장님", topic: "심폐소생술·AED",  place: "가운데 분수 광장", char: "zone10_turtle", badge: "badge_10", time: 2,   rounds: [],           x: 50, y: 57, viewX: 50, viewY: 50 }
  ],

  /* ---------------------------------------------------------------
     1~9구역 주민 대화 (기획안 4-2 · 체크리스트 7-2)
     first : 대화 첫 대사 / situation : 학생 대답 뒤 상황 대사
     thanks : 미션 완료 감사 인사 (handoff: true 이면 인계 구역)
     link : 6·9구역 1라운드 → 2라운드 연결 대사
     --------------------------------------------------------------- */
  talks: {
    1: { first: "보건 대원! 라면 먹다가 큰일 났어!", situation: "앗 뜨거! 컵라면 국물을 손등에 쏟았어… 빨갛고 화끈거려.", thanks: "덕분에 손이 시원해졌어. 고마워!" },
    2: { first: "보건 대원! 마침 잘 왔어. 박씨를 물어주다 그만… 아야야…", situation: "씨앗을 전해 주다 발목을 헛디뎠어… 퉁퉁 붓고 아파.", thanks: "덕분에 발목이 한결 편해졌어!" },
    3: { first: "보건 대원! 고개에서 떡 하나 뺏어 먹다 그만 꽁꽁 언 떡을 먹었지 뭐야!", situation: "앞니가 쑥 빠졌어! 잇몸에서 피가 나. 아무래도 영구치가 빠진 것 같아!", thanks: "덕분에 치과에 잘 갈 수 있겠어!" },
    4: { first: "아야! 보건 대원, 좀 도와줘!", situation: "꿀을 따다가 벌에 쏘였어! 침이 박혀 있고 부었어.", thanks: "덕분에 덜 아파졌어. 고마워!" },
    5: { first: "보건 대원… 코에서 뭔가 흘러!", situation: "나무에 코를 쿵 부딪혔어… 코피가 주르륵 나.", thanks: "코피가 멈췄어! 고마워!" },
    6: { first: "보건 대원! 달리다가 넘어졌어…", situation: "넘어져서 무릎이 살짝 까졌어. 모래가 조금 묻었고 피는 조금만 나.", link: "앗, 이번엔 팔꿈치에서 피가 많이 나!", handoff: true },
    7: { first: "보건 대원! 눈이 너무 따가워!", situation: "모래가 눈에 들어갔어! 따끔따끔해.", thanks: "눈이 편해졌어. 고마워!" },
    8: { first: "보, 보건 대원… 몸이 이상해…", situation: "밤을 먹었는데… 온몸에 두드러기가 나고 숨쉬기가 힘들어. 어지러워.", handoff: true },
    9: { first: "보건 대원! 축구하다가 머리를…", situation: "축구하다 쿵! 머리를 축구공에 맞았어. 혹이 났어.", link: "조금 뒤… 머리가 점점 더 아프고 속이 메스꺼워. 물건이 두 개로 보여.", handoff: true }
  },

  /* 학생 대답 보기 (공통) – 어느 것을 골라도 상황 대사로 이어짐 */
  replies: ["괜찮아? 무슨 일 있었어?", "어디가 제일 아파?"],

  /* ---------------------------------------------------------------
     1~9구역 라운드 (11개) – 기획안 2장
     items : 물품 6개 [표시 이름, 그림 파일, 정답 여부, 피드백]
     ox    : O/X 문항 / action : 행동 선택 4지선다 (보기 순서 그대로)
     ask   : 행동 선택 말풍선 앞부분 "(상황 한 줄)… 가장 먼저 뭘 해야 할까? 골라 줘!"
     img   : 주민 그림 (hurt / care / done)
     --------------------------------------------------------------- */
  rounds: {

    "1": {
      zone: 1, title: "화상", summary: "컵라면 국물을 손등에 쏟아 붉고 화끈거림",
      img: { hurt: "npc_01_hurt", care: "npc_01_care", done: "npc_01_done" },
      items: [
        { name: "흐르는 시원한 물", img: "water_faucet", correct: true,  fb: "화상 부위의 열을 식히는 것이 우선이에요. 즉시 흐르는 시원한 물로 10분 이상 식혀요." },
        { name: "깨끗한 거즈",      img: "gauze",        correct: false, fb: "충분히 식힌 뒤 필요하면 화상 부위를 깨끗하게 보호하는 데 사용할 수 있어요. 처음 냉각에 꼭 필요한 물품은 아니에요." },
        { name: "화상 연고",        img: "burn_ointment", correct: false, fb: "처음에는 냉각이 우선이며, 연고 사용은 의료진의 안내를 따라요." },
        { name: "냉찜질 팩",        img: "cold_pack",    correct: false, fb: "화상 부위에 냉찜질 팩을 직접 대지 않아요. 흐르는 시원한 물로 10분 이상 식혀요." },
        { name: "된장",             img: "doenjang",     correct: false, fb: "된장을 바르면 상처가 오염될 수 있어요. 화상 부위에는 민간요법을 사용하지 않아요." },
        { name: "치약",             img: "toothpaste",   correct: false, fb: "치약은 화상 처치에 도움이 되지 않고 피부를 자극하거나 오염시킬 수 있어요." }
      ],
      ox: { q: "화상으로 물집이 생기면 바로 터뜨리는 것이 좋다.", answer: "X",
            hint: "물집은 다친 피부를 보호해요. 터뜨리면 어떤 문제가 생길까요?",
            explain: "물집을 일부러 터뜨리면 감염 위험이 높아질 수 있어요." },
      ask: "손등이 빨갛고 화끈거려…",
      action: [
        { text: "아파서 문지르기", correct: false, fb: "아파서 문지르면 연약해진 피부가 쓸려 상처가 더 커져요!" },
        { text: "얼음 주머니 직접 얹기", correct: false, fb: "얼음을 직접 얹으면 동상이 올 수 있어요. 흐르는 시원한 물로 식혀요!" },
        { text: "흐르는 시원한 물로 10분 이상 식힌다.", correct: true, fb: "잘했어! 흐르는 시원한 물로 10분 이상 식혀요." },
        { text: "상처엔 후~ 연고부터 바르기", correct: false, fb: "화상은 연고보다 흐르는 찬물로 열기를 빼는 게 먼저예요! 연고는 다 식힌 다음에 발라요." }
      ],
      notebook: [
        "화상을 입으면 즉시 흐르는 시원한 물로 10분 이상 식혀요.",
        "얼음을 직접 대거나 된장·치약을 바르지 않아요.",
        "물집은 터뜨리지 않고, 충분히 식힌 뒤 깨끗하게 보호해요.",
        "화상이 넓거나 심해 보이면 병원 진료를 받아요."
      ]
    },

    "2": {
      zone: 2, title: "발목 염좌", summary: "씨앗을 전하다 발목을 헛디뎌 붓고 아픔",
      img: { hurt: "npc_02_hurt", care: "npc_02_care", done: "npc_02_done" },
      items: [
        { name: "냉찜질 팩",     img: "cold_pack",       correct: true,  fb: "발목이 삐었을 때 냉찜질은 통증과 부기를 줄이는 데 도움이 돼요." },
        { name: "얇은 수건",     img: "towel",           correct: false, fb: "지금 꼭 챙길 물품은 아니에요. 있으면 냉찜질 팩을 감싸서 쓰면 좋아요." },
        { name: "탄력붕대",      img: "elastic_bandage", correct: true,  fb: "다친 발목을 너무 조이지 않게 감아 압박하면 부기를 줄이는 데 도움이 돼요." },
        { name: "부목",          img: "splint",          correct: true,  fb: "다친 발목이 움직이지 않게 고정해 더 다치지 않도록 도와요." },
        { name: "뜨거운 찜질팩", img: "hot_pack",        correct: false, fb: "다친 직후 뜨거운 찜질은 부기를 악화시킬 수 있어요. 먼저 쉬고 냉찜질해요." },
        { name: "마사지 도구",   img: "massager",        correct: false, fb: "삔 발목을 세게 주무르면 통증과 부기가 심해질 수 있어요. 마사지보다 보호와 휴식이 먼저예요." }
      ],
      ox: { q: "다친 발목을 심장보다 높이 올리면 부기를 줄이는 데 도움이 된다.", answer: "O",
            hint: "부기가 생긴 발목을 어느 높이에 두면 좋을까요?",
            explain: "가능하면 발목을 심장보다 높이 올리면 부기를 줄이는 데 도움이 돼요." },
      ask: "발목이 퉁퉁 붓고 아파…",
      action: [
        { text: "얼마나 다쳤는지 보려고 혼자 힘으로 움직여 보기", correct: false, fb: "다친 인대가 더 늘어나거나 찢어져 더 크게 다칠 수 있어요!" },
        { text: "운동을 멈추고 안전한 곳에서 쉬면서 주변 사람에게 알린다.", correct: true, fb: "활동을 멈추고 주변 사람에게 알려 상태를 살펴요." },
        { text: "붓지 않도록 세게 주무르기", correct: false, fb: "다친 부위가 더 붓고 아파질 수 있어요!" },
        { text: "뜨거운 찜질팩 대주기", correct: false, fb: "다친 직후 뜨거운 찜질은 부기와 멍을 더 심하게 할 수 있어요. 먼저 냉찜질해요!" }
      ],
      notebook: [
        "RICE를 기억해요: R(휴식·안정), I(냉찜질), C(압박), E(올리기). 교과서에 따라 PRICE(보호를 더해)로 배우기도 해요.",
        "다친 후 처음 24~48시간 동안 20분씩 2~3시간 주기로 차가운 찜질을 해요.",
        "운동을 멈추고 쉬며, 탄력붕대로 너무 세지 않게 압박하고 다친 발목을 심장보다 높이 올려요.",
        "많이 아프거나 모양이 이상하면 부목으로 고정하고 병원 진료를 받아요."
      ]
    },

    "3": {
      zone: 3, title: "영구치 손상", summary: "영구치가 완전히 빠져 잇몸에서 피가 남",
      img: { hurt: "npc_03_hurt", care: "npc_03_care", done: "npc_03_done" },
      items: [
        { name: "우유",       img: "milk",       correct: true,  fb: "빠진 영구치가 마르지 않도록 우유에 담아 보관해요. 가능한 즉시 치과에 가요." },
        { name: "생리식염수", img: "saline",     correct: true,  fb: "우유가 없으면 생리식염수에 담아 보관해도 돼요. 치아가 마르지 않게 하는 것이 중요해요." },
        { name: "콜라",       img: "cola",       correct: false, fb: "콜라는 치아를 보관하기에 적절하지 않아요. 우유나 생리식염수를 선택해요." },
        { name: "마른 휴지",  img: "tissue",     correct: false, fb: "마른 휴지에 싸면 치아가 마르고 뿌리 조직이 손상될 수 있어요." },
        { name: "얼음컵",     img: "ice_cup",    correct: false, fb: "얼음컵에 직접 넣어 보관하지 않아요. 너무 차가운 환경은 치아 조직을 손상시킬 수 있어요." },
        { name: "따뜻한 물",  img: "warm_water", correct: false, fb: "따뜻한 물에 담가 보관하지 않아요. 치아 뿌리 조직을 보호할 수 있는 보관액이 필요해요." }
      ],
      ox: { q: "빠진 영구치가 더러우면 뿌리를 휴지로 세게 문질러 닦아야 한다.", answer: "X",
            hint: "치아 뿌리에는 소중한 조직이 있어요. 문질러도 괜찮을까요?",
            explain: "치아 뿌리를 문지르면 손상될 수 있어요. 하얀 윗부분을 잡아요." },
      ask: "앞니가 쑥 빠졌어…",
      action: [
        { text: "휴지에 꽁꽁 싸서 주머니에 넣기", correct: false, fb: "치아가 마르면 다시 심기 어려워질 수 있어요!" },
        { text: "이미 빠졌으니 그냥 버리기", correct: false, fb: "다시 나지 않는 소중한 영구치예요! 다시 심을 수 있는 경우가 있으니 버리지 말고 꼭 챙겨 가요." },
        { text: "빠진 영구치를 우유나 생리식염수에 담아 즉시 치과에 간다.", correct: true, fb: "뿌리는 만지지 않고 보관해 즉시 치과에 가요." },
        { text: "따뜻한 물에 깨끗이 씻어서 보관하기", correct: false, fb: "따뜻한 물로 문질러 씻으면 치아 뿌리 조직이 손상될 수 있어요!" }
      ],
      notebook: [
        "빠진 영구치는 하얀 윗부분을 잡고 뿌리를 만지거나 문지르지 않아요.",
        "우유나 생리식염수에 담아 마르지 않게 보관해요.",
        "피가 나는 잇몸은 깨끗한 거즈로 눌러 지혈해요.",
        "빠진 치아를 가지고 가능한 즉시 치과에 가요."
      ]
    },

    "4": {
      zone: 4, title: "벌 쏘임", summary: "벌에 쏘여 벌침이 남고 부음",
      img: { hurt: "npc_04_hurt", care: "npc_04_care", done: "npc_04_done" },
      items: [
        { name: "플라스틱 카드", img: "plastic_card", correct: true,  fb: "교과서에서는 딱딱한 카드로 남은 벌침을 살살 밀어 제거하도록 안내해요. 가능한 빨리 제거하는 것이 중요해요." },
        { name: "비눗물",        img: "soapy_water",  correct: true,  fb: "벌침을 뺀 뒤 쏘인 부위를 비누와 물로 깨끗하게 씻어요." },
        { name: "냉찜질 팩",     img: "cold_pack",    correct: true,  fb: "쏘인 부위의 통증과 부기를 줄여 줘요. 벌침을 먼저 빼고 사용해요." },
        { name: "핀 바늘",       img: "pin_needle",   correct: false, fb: "핀 바늘로 피부를 찌르면 상처가 더 생기거나 감염될 수 있어요." },
        { name: "된장",          img: "doenjang",     correct: false, fb: "된장은 벌 쏘임 응급처치에 도움이 되지 않고 피부를 오염시킬 수 있어요." },
        { name: "뜨거운 찜질팩", img: "hot_pack",     correct: false, fb: "벌에 쏘인 부위가 붓고 아플 때는 뜨거운 찜질보다 냉찜질이 도움이 돼요." }
      ],
      ox: { q: "벌에 쏘인 뒤 숨쉬기 힘들거나 온몸에 두드러기가 생기면 즉시 119에 신고하거나 병원에 가야 한다.", answer: "O",
            hint: "숨쉬기 어려운 증상은 단순한 가려움과 같을까요?",
            explain: "심한 알레르기 반응일 수 있어 즉시 도움을 요청해야 해요." },
      ask: "벌침이 박혀 있고 부었어…",
      action: [
        { text: "손으로 바깥쪽을 꾹 짜서 침 빼내기", correct: false, fb: "독주머니가 눌려 독이 더 들어갈 수 있어요!" },
        { text: "안전한 장소에서 플라스틱 카드로 남은 벌침을 신속히 제거한다.", correct: true, fb: "벌침을 신속히 제거한 뒤 씻고 냉찜질해요." },
        { text: "된장 발라두고 기다리기", correct: false, fb: "세균이 들어가 염증이 생길 수 있어요!" },
        { text: "그냥 방치하고 뛰어다니기", correct: false, fb: "벌침이 남아 있으면 독이 계속 들어갈 수 있어요. 안전한 곳에서 빨리 처치해요." }
      ],
      notebook: [
        "벌에 쏘이면 먼저 안전한 곳으로 이동해요.",
        "남은 벌침은 딱딱한 카드로 살살 밀어 빨리 빼요.",
        "쏘인 부위를 비누와 물로 씻고, 필요하면 냉찜질을 해요.",
        "[[숨쉬기 힘들거나 온몸에 두드러기가 나면]] 즉시 119에 신고하거나 병원에 가요."
      ]
    },

    "5": {
      zone: 5, title: "코피", summary: "나무에 코를 부딪혀 코피가 남",
      img: { hurt: "npc_05_hurt", care: "npc_05_care", done: "npc_05_done" },
      items: [
        { name: "깨끗한 거즈",   img: "gauze",     correct: true,  fb: "흘러나오는 피를 막는 데 써요. 지혈은 고개를 앞으로 숙이고 콧방울을 누르는 것이 핵심이에요." },
        { name: "휴지",          img: "tissue",    correct: true,  fb: "흘러나오는 피를 닦는 데 써요. 콧방울을 누르는 것과 함께 해요." },
        { name: "냉찜질 팩",     img: "cold_pack", correct: true,  fb: "코나 목 뒤에 냉찜질을 하면 지혈에 도움이 돼요. 콧방울 압박과 함께 해요." },
        { name: "진통제",        img: "painkiller", correct: false, fb: "진통제를 먹는 것으로 코피가 멈추지 않아요. 먼저 올바른 자세로 압박해요." },
        { name: "반창고",        img: "bandage",   correct: false, fb: "반창고를 코에 붙이는 것으로 코피를 지혈할 수 없어요. 콧방울의 부드러운 부분을 눌러요." },
        { name: "뜨거운 찜질팩", img: "hot_pack",  correct: false, fb: "뜨거운 찜질은 코피를 멈추는 데 적절하지 않아요. 콧방울 압박이 우선이에요." }
      ],
      ox: { q: "코피가 멈춘 뒤에는 코를 세게 풀어 남은 피를 빼내는 것이 좋다.", answer: "X",
            hint: "지혈된 자리가 다시 자극되면 어떻게 될까요?",
            explain: "코를 세게 풀면 다시 피가 날 수 있어요." },
      ask: "코피가 주르륵 나…",
      action: [
        { text: "고개를 뒤로 바짝 젖히고 하늘 보기", correct: false, fb: "피가 기도로 넘어가 숨을 못 쉴 수 있어요!" },
        { text: "고개를 약간 앞으로 숙이고 콧방울의 부드러운 부분을 지속적으로 누른다.", correct: true, fb: "고개를 앞으로 숙이고 콧방울을 지속적으로 압박해요." },
        { text: "피가 날 때마다 코피 솜을 빼서 새 솜으로 계속 바꿔 주기", correct: false, fb: "솜을 자꾸 빼면 피가 멈추려고 생긴 딱지가 떨어져 피가 다시 나요! 솜이 젖어도 그대로 두고 콧방울을 계속 눌러요." },
        { text: "코를 누르지 않고 그냥 가만히 두기", correct: false, fb: "그냥 두면 피가 계속 흘러나와요! 콧볼을 눌러 압박해야 해요." }
      ],
      notebook: [
        "앉아서 고개를 약간 앞으로 숙여요. 뒤로 젖히지 않아요.",
        "엄지와 검지로 콧방울을 계속 눌러 지혈해요. 코나 목 뒤에 냉찜질을 하면 도움이 돼요.",
        "목으로 넘어온 피는 삼키지 않고 뱉어요. 멈춘 뒤 코를 세게 풀지 않아요.",
        "피가 멈추지 않으면 병원 진료를 받아요."
      ]
    },

    "6-1": {
      zone: 6, title: "찰과상", summary: "무릎이 살짝 까지고 모래가 조금 묻음, 피는 조금 남",
      img: { hurt: "npc_06_1_hurt", care: "npc_06_1_care" },
      items: [
        { name: "흐르는 물",     img: "water_faucet", correct: true,  fb: "무릎 상처에 묻은 흙과 모래를 씻어낼 때 사용해요. 가벼운 찰과상에서는 깨끗한 세척이 중요해요." },
        { name: "따뜻한 찜질팩", img: "hot_pack",     correct: false, fb: "따뜻한 찜질은 상처를 씻는 데 쓰지 않아요. 먼저 흐르는 물로 흙과 모래를 씻어요." },
        { name: "밴드",          img: "bandage",      correct: true,  fb: "흐르는 물로 깨끗이 씻은 뒤 밴드로 상처를 보호해요." },
        { name: "냉찜질",        img: "cold_pack",    correct: false, fb: "가벼운 찰과상에는 냉찜질이 필요하지 않아요. 깨끗한 물로 씻는 것이 먼저예요." },
        { name: "강한 소독약",   img: "disinfectant", correct: false, fb: "가벼운 상처는 깨끗한 물로 씻고 밴드로 보호하면 충분해요. 강한 소독약은 오히려 상처를 자극할 수 있어요. 상처가 크거나 흙이 많이 묻었다면 먼저 씻은 뒤 보건 선생님과 함께 소독해요." },
        { name: "흙먼지",        img: "dirt",         correct: false, fb: "상처에 흙먼지가 더 들어가면 감염 위험이 커질 수 있어요. 깨끗한 물로 씻어내요." }
      ],
      ox: { q: "상처 주변이 점점 붉어지고 붓거나 고름이 생기면 병원에 가서 진료를 받아야 한다.", answer: "O",
            hint: "상처가 낫는 과정에서 점점 붓고 고름이 생기는 것은 괜찮은 변화일까요?",
            explain: "감염의 신호일 수 있어요. 병원에 가서 진료를 받아야 해요." },
      ask: "무릎이 까지고 모래가 묻었어…",
      action: [
        { text: "흐르는 물로 상처의 흙과 모래를 씻는다.", correct: true, fb: "깨끗한 물로 이물질을 씻어내요." },
        { text: "침을 묻혀서 쓱쓱 문지르기", correct: false, fb: "입속 세균이 들어가 상처가 곪을 수 있어요!" },
        { text: "아무것도 안 바르고 더러운 옷으로 감싸기", correct: false, fb: "옷의 먼지가 달라붙어 염증이 생겨요!" },
        { text: "손으로 흙을 박박 긁어내기", correct: false, fb: "피부가 더 쓸려서 상처가 커져요!" }
      ],
      notebook: [
        "흙이나 모래가 묻은 상처는 흐르는 물로 깨끗이 씻어요.",
        "상처를 세게 문지르지 않고, 씻은 뒤 밴드로 보호해요.",
        "딱지는 억지로 떼지 않아요.",
        "상처가 점점 붉어지고 붓거나 고름이 생기면 병원에 가서 진료받아요."
      ]
    },

    "6-2": {
      zone: 6, title: "심한 출혈", summary: "팔꿈치에 심한 출혈 발생", handoff: true, handoffNearby: true,
      img: { hurt: "npc_06_2_hurt", care: "npc_06_2_care" },
      items: [
        { name: "깨끗한 거즈", img: "gauze",           correct: true,  fb: "피가 많이 날 때 깨끗한 거즈로 상처를 직접 꾹 눌러 지혈해요." },
        { name: "흐르는 물",   img: "water_faucet",    correct: false, fb: "피가 많이 날 때 물로 씻느라 지혈이 늦어지면 안 돼요. 먼저 거즈로 직접 눌러요." },
        { name: "일회용 장갑", img: "gloves",          correct: false, fb: "있으면 좋지만 장갑을 찾느라 직접 압박을 늦추지 않아요. 지금은 거즈로 바로 눌러요." },
        { name: "탄력붕대",    img: "elastic_bandage", correct: false, fb: "처음에는 거즈로 직접 누르는 것이 먼저예요. 붕대를 감느라 압박을 늦추지 않아요." },
        { name: "소독약",      img: "disinfectant",    correct: false, fb: "피가 많이 나는 상황에서는 소독약을 먼저 붓지 않아요. 직접 압박으로 지혈하는 것이 우선이에요." },
        { name: "사탕",        img: "candy",           correct: false, fb: "사탕은 심한 출혈을 멈추는 데 도움이 되지 않아요. 즉시 지혈하고 주변 사람에게 도움을 요청해요." }
      ],
      ox: { q: "피가 멈춘 뒤에는 깨끗한 거즈나 드레싱으로 상처를 보호하는 것이 좋다.", answer: "O",
            hint: "피가 멈춘 뒤 상처에 먼지가 묻지 않게 하려면?",
            explain: "출혈이 조절된 뒤에는 상처를 깨끗하게 보호해요." },
      ask: "팔꿈치에서 피가 많이 나…",
      action: [
        { text: "깨끗한 거즈나 수건으로 상처를 지속적으로 직접 압박한다.", correct: true, fb: "직접 압박하며 주변 사람에게 즉시 도움을 요청해요." },
        { text: "피가 나든 말든 그냥 내버려두고 뛰놀기", correct: false, fb: "피를 계속 흘리면 위험해요! 빨리 지혈해야 해요." },
        { text: "입으로 피를 쭉쭉 빨아내기", correct: false, fb: "세균이 들어가서 상처가 덧나요!" },
        { text: "흐르는 찬물에 20분 동안 씻어내기만 하기", correct: false, fb: "씻는 것보다 피를 멈추는 게 먼저예요! 물로 씻기만 하면 피가 계속 흘러요." }
      ],
      notebook: [
        "피가 많이 나면 깨끗한 거즈로 상처를 꾹 눌러 지혈해요.",
        "누르면서 바로 주변 사람에게 도움을 요청하고, [[멈추지 않으면]] 119에 신고해요.",
        "씻거나 소독하느라 지혈을 늦추지 않아요."
      ]
    },

    "7": {
      zone: 7, title: "눈 이물질", summary: "작은 모래 알갱이가 눈에 들어왔으나 박히지 않음",
      img: { hurt: "npc_07_hurt", care: "npc_07_care", done: "npc_07_done" },
      items: [
        { name: "깨끗한 물",   img: "water_faucet",  correct: true,  fb: "눈에 들어간 작은 모래가 깜빡여도 빠지지 않으면 깨끗한 물로 부드럽게 씻을 수 있어요." },
        { name: "핀 바늘",     img: "pin_needle",    correct: false, fb: "핀 바늘로 눈 속 모래를 빼려 하면 눈을 크게 다칠 수 있어요. 뾰족한 물건은 눈 가까이 대지 않아요." },
        { name: "깨끗한 수건", img: "towel",         correct: false, fb: "수건으로 눈을 비비거나 누르면 모래가 눈을 긁을 수 있어요. 깨끗한 물로 부드럽게 씻어요." },
        { name: "면봉",        img: "cotton_swab",   correct: false, fb: "면봉으로 눈 안을 문지르면 눈 표면에 상처가 생길 수 있어요." },
        { name: "피부 소독약", img: "disinfectant",  correct: false, fb: "피부에 쓰는 소독약을 눈에 넣으면 자극과 손상이 생길 수 있어요." },
        { name: "피부용 연고", img: "skin_ointment", correct: false, fb: "일반 피부용 연고를 눈에 넣지 않아요. 먼저 깜빡여 보고 필요하면 깨끗한 물로 씻어요." }
      ],
      ox: { q: "눈에 이물질이 깊이 박혀 있다면 억지로 빼지 말고 병원에서 진료받아야 한다.", answer: "O",
            hint: "깊이 박힌 물체를 억지로 빼면 눈이 어떻게 될까요?",
            explain: "박힌 이물질은 억지로 제거하지 말고 진료받아요." },
      ask: "모래가 눈에 들어가서 따끔따끔해…",
      action: [
        { text: "손으로 눈을 힘주어 비비기", correct: false, fb: "모래가 눈동자를 긁어 각막에 상처를 내요!" },
        { text: "먼저 눈을 깜빡여 보고 빠지지 않으면 깨끗한 물이나 생리식염수로 부드럽게 씻는다.", correct: true, fb: "먼저 깜빡이고 필요하면 부드럽게 씻어내요." },
        { text: "입김을 불어넣기", correct: false, fb: "입안의 세균이 눈으로 들어가 결막염에 걸려요!" },
        { text: "손가락으로 눈꺼풀 뒤집어서 빼기", correct: false, fb: "전문가가 아니면 눈을 다칠 수 있어 위험해요." }
      ],
      notebook: [
        "눈에 모래가 들어가면 비비지 않고 먼저 눈을 깜빡여 봐요.",
        "빠지지 않으면 깨끗한 물로 눈을 부드럽게 씻어요.",
        "눈에 박힌 이물질은 억지로 빼지 않아요.",
        "통증·충혈·시야 이상이 계속되면 병원 진료를 받아요."
      ]
    },

    "8": {
      zone: 8, title: "아나필락시스", summary: "밤을 먹은 뒤 전신 두드러기·호흡곤란·어지럼", handoff: true,
      img: { hurt: "npc_08_hurt", care: "npc_08_care" },
      items: [
        { name: "본인 처방 에피펜",          img: "epipen",        correct: true,  fb: "다람쥐 본인에게 처방된 에피네프린 자가주사기는 심한 알레르기 반응의 긴급 처치에 중요해요. 신속하게 사용하도록 도와요." },
        { name: "119 신고용 전화기",         img: "phone",         correct: true,  fb: "숨쉬기 어려운 심한 알레르기 반응은 응급상황이에요. 즉시 119에 신고해야 해요." },
        { name: "항히스타민제(알레르기약)",  img: "antihistamine", correct: false, fb: "항히스타민제만으로 호흡곤란이 있는 아나필락시스를 해결할 수 없어요. 에피네프린과 긴급 도움 요청이 우선이에요." },
        { name: "물병",                      img: "water_bottle",  correct: false, fb: "숨쉬기 힘든 사람에게 물을 억지로 마시게 하지 않아요. 즉시 의료 도움을 요청해요." },
        { name: "일반 감기약",               img: "cold_medicine", correct: false, fb: "일반 감기약은 심한 알레르기 반응으로 인한 호흡곤란을 해결할 수 없어요. 즉시 119에 신고하고 처방된 에피네프린 자가주사기 사용을 도와요." },
        { name: "사탕",                      img: "candy",         correct: false, fb: "사탕은 아나필락시스의 응급처치 물품이 아니에요. 음식물을 주지 않아요." }
      ],
      ox: { q: "에피네프린 자가주사기를 사용한 뒤 증상이 좋아지면 병원에 가지 않아도 된다.", answer: "X",
            hint: "심한 알레르기 반응이 잠시 좋아졌다가 다시 나타날 수도 있을까요?",
            explain: "증상이 좋아져도 응급의료기관에서 진료와 관찰을 받아야 해요." },
      ask: "온몸에 두드러기가 나고 숨쉬기가 힘들어…",
      action: [
        { text: "시원한 물 마시고 누워서 잠자기", correct: false, fb: "기도가 부어 숨이 막혔는데 물을 마시면 숨이 완전히 막힐 수 있어요!" },
        { text: "즉시 119에 신고하고 본인에게 처방된 에피펜을 신속하게 사용하도록 돕는다.", correct: true, fb: "119 신고와 처방된 에피네프린 사용 지원을 지체하지 않아요." },
        { text: "집에 가서 혼자 푹 쉬기", correct: false, fb: "가만히 쉬면 숨이 더 가빠져 위험해져요." },
        { text: "남은 밤을 마저 다 먹기", correct: false, fb: "원인 음식을 더 먹으면 증상이 훨씬 심해져요! 절대 안 돼요." }
      ],
      notebook: [
        "음식을 먹은 뒤 [[숨쉬기 힘들고 온몸에 두드러기가 나면]] 심한 알레르기 반응이에요.",
        "즉시 119에 신고하고 주변 사람에게 도움을 요청해요.",
        "본인에게 처방된 에피펜을 바로 사용하도록 도와요.",
        "주사 후 좋아져도 꼭 병원에서 진료받아요."
      ]
    },

    "9-1": {
      zone: 9, title: "머리에 혹", summary: "축구하다 머리를 부딪혀 혹이 남",
      img: { hurt: "npc_09_1_hurt", care: "npc_09_1_care" },
      items: [
        { name: "냉찜질 팩",     img: "cold_pack",  correct: true,  fb: "혹이 난 부위의 통증과 부기를 줄이는 데 도움이 돼요. 운동을 멈추고 주변 사람에게 알리는 것도 잊지 않아요." },
        { name: "얇은 수건",     img: "towel",      correct: false, fb: "지금 꼭 챙길 물품은 아니에요. 있으면 냉찜질 팩을 감싸서 쓰면 좋아요." },
        { name: "깨끗한 거즈",   img: "gauze",      correct: false, fb: "혹이 난 곳에는 피나는 상처가 없어 거즈가 필요하지 않아요." },
        { name: "뜨거운 찜질팩", img: "hot_pack",   correct: false, fb: "머리를 부딪힌 직후 뜨거운 찜질은 우선적인 처치가 아니에요." },
        { name: "마사지 도구",   img: "massager",   correct: false, fb: "혹이 난 곳을 세게 문지르면 통증이 심해질 수 있어요." },
        { name: "진통제",        img: "painkiller", correct: false, fb: "의료진의 판단 없이 약부터 먹이지 않아요. 머리 손상 후 상태를 살피는 것이 중요해요." }
      ],
      ox: { q: "머리를 부딪힌 뒤에는 처음에 괜찮아 보여도 시간이 지나면서 증상이 나타날 수 있다.", answer: "O",
            hint: "다친 직후와 조금 뒤 상태가 항상 같을까요?",
            explain: "머리 손상 증상은 시간이 지나 나타날 수 있어요." },
      ask: "머리에 혹이 났어…",
      action: [
        { text: "혹을 손으로 세게 문질러 누르기", correct: false, fb: "문지르면 더 붓고 아파져요!" },
        { text: "운동을 멈추고 안전한 곳에서 쉬면서 주변 사람에게 알린다.", correct: true, fb: "머리 손상 후에는 활동을 멈추고 주변 사람에게 알려요." },
        { text: "뜨거운 찜질팩 대기", correct: false, fb: "처음에 뜨겁게 하면 더 붓고 피가 날 수 있어요!" },
        { text: "아무에게도 말하지 않고 다시 축구하러 가기", correct: false, fb: "머리를 다쳤을 때는 쉬면서 꼭 주변 사람에게 알려야 해요!" }
      ],
      notebook: [
        "머리를 부딪히면 바로 운동을 멈추고 주변 사람에게 알려요.",
        "안전한 곳에서 쉬며, 붓고 아프면 냉찜질 팩을 대요.",
        "처음에 괜찮아 보여도 시간이 지나 증상이 나타날 수 있어요."
      ]
    },

    "9-2": {
      zone: 9, title: "머리 위험 신호", summary: "조금 뒤 심해지는 두통·메스꺼움·복시", handoff: true,
      img: { hurt: "npc_09_2_hurt", care: "npc_09_2_care" },
      items: [
        { name: "전화기(119 연락하기)", img: "phone",              correct: true,  fb: "위험한 증상이 나타나면 즉시 병원에 가거나 119에 신고해야 해요." },
        { name: "보호자 비상연락망",    img: "emergency_contacts", correct: false, fb: "연락망만으로는 전화할 수 없어요. 위험 신호가 보이면 전화기로 바로 119에 연락해요." },
        { name: "깨끗한 담요",          img: "blanket",            correct: false, fb: "지금은 담요보다 119에 빨리 연락하는 것이 먼저예요." },
        { name: "냉찜질 팩",            img: "cold_pack",          correct: false, fb: "위험 신호가 나타났을 때는 냉찜질보다 119 연락이 먼저예요." },
        { name: "진통제",               img: "painkiller",         correct: false, fb: "의료진의 판단 없이 약부터 먹이지 않아요. 위험 신호를 놓치지 않도록 해야 해요." },
        { name: "물병",                 img: "water_bottle",       correct: false, fb: "구토할 수 있는 환자에게 물을 억지로 마시게 하지 않아요." }
      ],
      ox: { q: "머리를 심하게 다친 사람은 위험한 장소가 아니라면 함부로 움직이지 않고 도움을 기다리는 것이 좋다.", answer: "O",
            hint: "목이나 척추도 다쳤을 가능성이 있다면 움직여도 될까요?",
            explain: "불필요하게 이동시키지 않고 119의 안내를 따라요." },
      ask: "머리가 점점 더 아프고 물건이 두 개로 보여…",
      action: [
        { text: "졸리니까 혼자 집에 가서 자기", correct: false, fb: "혼자 있으면 상태가 나빠져도 도움을 받을 수 없어요!" },
        { text: "즉시 병원에 가거나 119에 신고한다.", correct: true, fb: "위험 신호가 나타나면 즉시 의료 도움을 받아요." },
        { text: "진통제 먹고 참기", correct: false, fb: "약으로 참으면 위험한 상태를 놓칠 수 있어요!" },
        { text: "머리를 흔들어 정신 차리게 하기", correct: false, fb: "머리를 흔들면 더 다칠 수 있어요!" }
      ],
      notebook: [
        "[[머리가 심하게 아프거나, 토하거나, 잠깐 기절했다면]] 위험 신호예요.",
        "[[코나 귀에서 피·맑은 물이 나오거나 물체가 흐릿하게 보여도]] 위험 신호예요.",
        "위험 신호가 보이면 즉시 병원에 가거나 119에 신고해요.",
        "환자를 혼자 두지 않고, 함부로 움직이지 않아요."
      ]
    }
  },

  /* 수첩 문장의 [[ ]] 부분은 위험 신호라서 진한 빨강·굵게·밑줄로 보임 */
  /* 위험 신호 사이렌을 짧게 울리는 라운드 (개발요청서 10장 11번: 8구역, 9구역 2라운드) */
  sirenRounds: ["8", "9-2"],

  /* 모든 수첩 끝 공통 문구 */
  notebookFooter: "※ 친구를 도운 뒤에는 꼭 보건 선생님이나 주변 사람에게 알려요!",

  /* ---------------------------------------------------------------
     10구역 심폐소생술·AED (기획안 3장 · 4-3)
     --------------------------------------------------------------- */
  cpr: {
    patientLabel: "축제에 놀러 온 어른",
    start: [
      "보건 대원! 큰일 났어! 마을 축제에 놀러 온 어른이 광장에서 갑자기 쓰러졌어!",
      "나는 느려서… 네가 도와줄 수 있겠니? 내가 옆에서 하나씩 알려 줄게."
    ],
    startButton: "도와줄게요 ▶",
    safetyGuide: "먼저 주변이 안전한지 보고, 어깨를 두드리며 불러 봐!",
    wrongBubble: "음… 다시 생각해 보자!",

    /* 깨우고 · 알리고 · 누르고 – 3지선다, 정답 위치 ①·②·③ */
    quiz: [
      { step: "깨우고",
        q: "쓰러진 사람을 발견했어! 가장 먼저 무엇을 할까?",
        options: [
          { text: "깨우고: 양쪽 어깨를 가볍게 두드리며 “괜찮으세요? 도와드릴까요?” 하고 의식을 확인한다.", correct: true,
            fb: "쓰러진 사람을 발견하면 양쪽 어깨를 가볍게 두드리면서 의식이 있는지 확인해요." },
          { text: "누르고: 바로 가슴 압박을 시작한다.", correct: false, fb: "먼저 깨워서 의식을 확인해요." },
          { text: "깨울 때까지 어깨를 세게 흔든다.", correct: false, fb: "어깨를 너무 세게 두드리거나 흔들지 않아요." }
        ],
        afterBubble: "대답이 없어! 이제 주변에 알리자!" },
      { step: "알리고",
        q: "대답이 없어! 이제 어떻게 할까?",
        options: [
          { text: "“누가 좀 도와주세요!” 하고 외치기만 한다.", correct: false, fb: "사람을 정해서 부탁해야 서로 미루지 않아요." },
          { text: "알리고: “촌장님, 119에 신고해 주시고, 자동 심장 충격기를 가지고 와 주세요!” 하고 사람을 지목해 부탁한다.", correct: true,
            fb: "주변에 사람이 있으면 지목하여 119 신고를 요청하고 자동 심장 충격기를 가져오도록 해요. 주변에 아무도 없으면 직접 신고해요." },
          { text: "아무에게도 알리지 않고 혼자 가슴 압박만 한다.", correct: false, fb: "알리지 않으면 구급대와 자동 심장 충격기가 늦게 와요." }
        ],
        studentLine: "촌장님, 119에 신고하고 자동 심장 충격기(AED) 가져다 주세요!",
        afterBubble: "알겠어! 내가 119에 신고하고 자동 심장 충격기를 가져올게!",
        afterCard: ["“촌장님, 119에 신고해 주세요!”", "“자동 심장 충격기(AED) 가져다 주세요!”", "한 사람을 콕 집어 부탁해요"] },
      { step: "누르고",
        before: "숨을 제대로 쉬는지 10초 안에 살펴봐!",
        q: "숨을 쉬지 않거나 이상하게 헐떡여! 어떻게 할까?",
        options: [
          { text: "손발을 주무르며 혈액순환이 되도록 마사지한다.", correct: false, fb: "손발을 주물러도 심장이 다시 뛰지 않아요. 헐떡이는 숨도 정상 호흡이 아니니 바로 가슴 압박을 해요." },
          { text: "일으켜 앉혀서 물을 마시게 한다.", correct: false, fb: "바닥이 평평한 장소에 눕히고 바로 가슴 압박을 해요." },
          { text: "누르고: 바닥이 평평한 곳에 눕히고 가슴뼈 아래쪽 1/2 지점을 강하게 압박한다.", correct: true,
            fb: "호흡이 없거나 비정상적이면 가슴 압박을 해요. 주변에 다른 사람이 있다면 2분마다 교대해요." }
        ],
        afterBubble: "좋아! 가슴 압박 방법을 확인하자!",
        afterCard: ["10초 이내 확인해요!", "가슴이 오르내리는지, 배가 움직이는지", "헐떡이는 숨도 심정지 의심"] }
    ],

    /* 가슴 압박 방법 – 06 상체 정면 그림 위에 위치 표시 (그림 가로·세로 %) */
    method: {
      bubble: "두 손을 겹쳐 가슴뼈 아래쪽 절반을 약 5cm 깊이로 강하고 빠르게 눌러!",
      rows: [
        ["위치", "가슴 한가운데, 가슴뼈 아래쪽 절반"],
        ["속도", "분당 100~120회"],
        ["깊이", "약 5cm (6cm를 넘지 않게 · 성인 기준)"],
        ["이완", "누른 뒤 가슴이 완전히 올라오게"],
        ["중단", "멈추는 시간은 10초 이내"]
      ],
      area: { x1: 47.5, x2: 55.5, y1: 54, y2: 66 },
      handPoint: { x: 51.5, y: 59.5 }
    },

    /* 리듬 트레이너 */
    rhythm: {
      total: 30, passGood: 15, bpmMin: 100, bpmMax: 120, metronomeBpm: 110,
      warmup: 4, pauseMs: 2000,
      startNotice: "가슴 압박은 속도만 연습해요. 자세와 위치는 선생님과 함께!",
      bubble: "메트로놈 박자에 맞춰 가슴 압박 30회를 눌러 볼까?",
      guideBeat: "1분에 100~120번 빠르기로 눌러요. 깜빡이는 동그라미에 맞춰 눌러요.",
      guideSet: "30번 눌러요. 박자가 잘 맞으면 “좋아요!”가 나와요.",
      remember: "30회는 이 게임의 리듬 연습 한 세트예요. 실제로는 구급대원이 올 때까지, 사람이 깨어날 때까지 멈추지 않고 계속 눌러요.",
      inputGuide: "[누르기!] 버튼을 터치·클릭하거나 스페이스바로 박자에 맞춰 눌러요.",
      startButton: "연습 시작하기 ▶",
      topBar: "30회는 이 게임의 연습 한 세트 · 실제로는 구급대원이 올 때까지, 사람이 깨어날 때까지 멈추지 않고 계속",
      judge: {
        warmup: "박자를 맞춰 보세요(처음 4번은 준비 구간이에요)",
        slow: "느려요! 박자에 맞춰 조금 더 빠르게 눌러요.",
        fast: "빨라요! 조금 더 천천히 눌러요.",
        good: "좋아요! 지금 속도를 유지해요!",
        paused: "다시 박자를 맞춰 보세요"
      },
      pressButton: "누르기!",
      speedLabel: "지금 속도: 분당 약 {bpm}회",
      result: "30회 중 좋아요 {good}회",
      pass: { bubble: "잘했어! 이 박자를 꼭 기억해!", line1: "박자에 맞춰 잘 눌렀어요!", line2: "통과! 이제 자동 심장 충격기(AED)가 도착했어요.", button: "자동 심장 충격기(AED)가 왔어요 ▶" },
      retry: { bubble: "조금 아쉬워! 한 번 더 해 볼까?", line1: "박자 표시를 보며 다시 30회를 눌러요.", button: "한 번 더 30회 ▶" }
    },

    /* 자동 심장 충격기(AED) */
    aed: {
      arrive: { bubble: "자동 심장 충격기(AED)를 가져왔어! 먼저 전원 버튼을 눌러!", guide: "자동 심장 충격기(AED)를 열고 전원을 켜요. 그다음 음성 안내에 따라 움직여요.", button: "전원 켜기 ▶" },
      padIntro: "패드를 붙일 수 있도록 가까이 살펴보세요!",
      padGuide: "패드를 끌어다 놓거나, 패드를 누른 뒤 붙일 자리를 눌러요. 패드에 그려진 그림을 보고 붙여요.",
      /* 정답 영역 (cpr_torso 그림 가로·세로 %) – A: 환자 오른쪽 쇄골 아래, B: 환자 왼쪽 유두 아래 겨드랑이 선 */
      padZones: {
        A: { pad: "aed_pad_1", x1: 30, x2: 46, y1: 46, y2: 56 },
        B: { pad: "aed_pad_2", x1: 58, x2: 76, y1: 59, y2: 72, stickX: 62, stickY: 65.5, sideways: true }   // 붙는 자리(stickX·stickY)가 유두 아래 몸 옆쪽, 패드는 가로로
      },
      hints: {
        center: "심장을 사이에 두고 양쪽에 붙여요",
        swapped: "패드가 바뀌었어요! 쓰러진 사람 기준으로, 패드에 그려진 그림을 보고 붙여요.",
        tooLow: "너무 아래예요. 가슴 쪽에 붙여요.",
        returned: "패드가 제자리로 돌아갔어요. 힌트를 보고 다시 붙여요."
      },
      padDone: ["잘했어요! 두 패드를 바르게 붙였어요.", "쓰러진 사람 기준 좌우예요", "패드를 붙이면 자동 심장 충격기(AED)가 심장 리듬을 분석해요."],
      voiceAnalyze: "분석 중입니다. 환자에게서 떨어지세요.",
      analyze: { bubble: "분석하는 동안에는 아무도 손대지 않아!", guide: "자동 심장 충격기(AED)가 심장 리듬을 분석해요. 환자에게서 떨어져 기다려요." },
      caseA: {
        bubble: "모두 물러났는지 확인하고 눌러!",
        check: "확인해요! 모두 환자에게서 떨어졌나요?",
        safeButton: "안전 확인",
        shockButton: "충격 버튼 누르기",
        afterBubble: "충격 뒤에는 바로 가슴 압박을 다시 해!",
        afterGuide: "잘했어요! 이번엔 자동 심장 충격기(AED)가 다시 분석했을 때 충격이 필요 없다는 안내를 연습해요.",
        nextButton: "상황 B 연습 ▶"
      },
      caseB: {
        bubble: "자동 심장 충격기(AED)가 뭐라고 했지? 어떻게 할까?",
        shockButton: "충격 버튼 누르기",
        cprButton: "바로 가슴 압박 다시 시작",
        wrong: "자동 심장 충격기(AED)가 충격이 필요 없다고 했어요. 버튼을 누르지 않고 바로 가슴 압박을 다시 해요. 회복된 것은 아니에요!",
        retryButton: "다시 선택하기"
      }
    },

    /* ▼ 기획안에 없어 새로 쓴 문구 (팀 검토 필요) – AED 화면 버튼 위치, 상황별 AED 안내 글자, 단계 이름 */
    aedButtons: { power: { x: 35.6, y: 65.0, r: 6 }, shock: { x: 64.2, y: 65.1, r: 6 } },   // aed_device 그림의 초록·주황 버튼 (%)
    voiceShock: "심장 충격이 필요합니다. 모두 환자에게서 떨어지세요. 깜빡이는 충격 버튼을 누르세요.",
    voiceNoShock: "심장 충격이 필요하지 않습니다. 가슴 압박을 계속하세요.",
    stepNames: ["깨우고", "알리고", "누르고", "가슴 압박 방법", "리듬 연습", "자동 심장 충격기(AED)"],
    countLabel: "전체 압박 {n} / 30",
    goodLabel: "좋아요 {n}회",
    nextHint: "다음으로 ▶",
    metronomeOff: "메트로놈 소리가 꺼져 있어요. 오른쪽 위 소리 버튼에서 켤 수 있어요.",
    /* ▲ 여기까지 새 문구 */

    arrival: { bubble: "구급대가 도착했어! 네가 쉬지 않고 도와준 덕분이야.", title: "구급대 도착", guide: "구급대원에게 맡겼어요.", button: "수첩 보기 ▶" },

    notebook: [
      "깨알누사: 깨우고 → 알리고 → 누르고 → 사용하기",
      "가슴뼈 아래쪽 1/2을 분당 100~120회, 약 5cm 깊이로 강하게 눌러요. 멈추는 시간은 10초 이내예요.",
      "자동 심장 충격기: 전원 켜기 → 패드 부착 → 리듬 분석 → 심장 충격",
      "충격 뒤에는 바로 가슴 압박을 다시 시작해요."
    ],
    complete: { big: "구급대가 올 때까지 쉬지 않고 도왔어요!", small: ["깨우고 → 알리고 → 누르고 → 사용하기", "충격 필요·불필요 두 상황 모두 연습 완료"] }
  },

  /* ---------------------------------------------------------------
     화면 문구 (기획안 4장 · 체크리스트 7-1)  {name} {n} {total} 등은 자동으로 바뀌는 자리
     {name을} → 이름 받침에 맞춰 '을/를' 자동, {name이} → '이/가' 자동
     --------------------------------------------------------------- */
  text: {
    welcome: "응급처치 마을 방범대에 온 걸 환영해! 다친 주민들을 도와줄 보건 대원이 필요해.",
    directorName: "보건소장",
    startButton: "마을로 출동하기",
    locked: "오늘은 들어갈 수 없는 곳이에요.",

    /* 마을 */
    solved: "해결한 주민 {done} / {total}",
    quickMove: "빠른 이동",
    help: "도와주기",
    quickMoveNote: "오늘 고른 구역만 보여요.",
    doneMark: "완료 ✓",
    nextLine: "계속하기 ▶",
    soundOn: "소리 ON", soundOff: "소리 OFF", exit: "나가기",

    /* 미션 공통 */
    stepLabel: "단계 {step}/3",
    bagTodo: "{name을} 도와줄 물품 {n}개를 골라 가방에 담아요!",
    bagCount: "고른 물품 {picked} / {n}",
    bagHelp: "다시 누르면 가방에서 빠져요 · 다 담으면 버튼을 눌러요",
    bagSubmit: "가방 다 쌌어요!",
    bagWrongBubble: "음… 가방을 다시 볼까?",
    bagWrongTitle: "앗, 가방을 다시 챙겨 볼까요?",
    bagWrongExtra: "담으면 안 되는 물품이 {n}개 있어요.",
    bagWrongMissing: "필요한 물품이 아직 {n}개 빠졌어요.",
    bagWrongNote: "물품별 이유는 정답 화면에서 확인해요",
    bagRetry: "다시 담기",
    bagRightPlayer: "{n}개 중 {n}개 다 담았어! 필요한 물품을 잘 골랐어!",
    bagRightCorrectHead: "정답 물품 · 왜 필요한지 확인해요",
    bagRightWrongHead: "오답 물품 · 왜 오답인지 확인해요",
    bagRightBubble: "고마워! 이걸로 도와줄 수 있겠어.",

    oxWrongTitle: "아쉬워요! 다시 한번 생각해 볼까요?",
    oxWrongNote: "힌트를 읽고 다시 고를 수 있어요",
    oxWrongBubble: "음… 이렇게 하는 게 아닌가?",
    retry: "다시 선택하기",
    oxRightTitle: "정답이에요! 정답은 {answer}",
    oxRightBubble: "아~ 그렇구나! 이렇게 해야 하는구나!",

    actionAsk: "{ask} 가장 먼저 뭘 해야 할까? 골라 줘!",
    actionWrongTitle: "아쉬워요!",
    actionWrongWhy: "왜 그럴까요?",
    actionWrongBubble: "윽… 다시 한번 생각해 보자!",
    actionRightTitle: "정답이에요!",
    actionRightBubble: "그렇게 하면 되는구나! 고마워!",

    /* 인계 장면 (6-2 · 8 · 9-2) – 체크리스트 문구 */
    handoffTitle: "정답이에요! 구급대원께 맡겼어요",
    handoffLine: "119에 신고했어요. 구급대원께 맡겼어요. 도와줘서 고마워!",
    handoffNearbyTitle: "정답이에요! 주변 사람에게 알렸어요",   // 6-2구역
    handoffNearbyLine: "주변 사람에게 바로 알렸어요. 꾹 눌러 지혈하며 함께 기다렸어요. 도와줘서 고마워!",

    roundChangeTitle: "잠깐! 상황이 바뀌었어요",
    roundChangeButton: "2라운드 시작 ▶",

    notebookTitle: "나의 응급처치 수첩",
    notebookHead: "꼭 기억해요!",
    notebookDone: "수첩 다 읽었어요",

    missionComplete: "미션 완료!",
    missionCompleteBig: "{name을} 도와주었어요!",
    missionCompleteHandoff: "{name을} 구급대원께 안전하게 맡겼어요!",
    missionCompleteNearby: "{name을} 도와 주변 사람에게 알렸어요!",   // 6구역
    backToVillage: "마을로 돌아가기",
    notebookAgain: "수첩 다시 보기",
    next: "다음으로 ▶",

    /* 예외 화면 */
    villageExitTitle: "정말 나가시겠습니까?",
    villageExitNote: "나가면 처음부터 다시 시작해야 합니다.",
    exitTitle: "미션에서 나갈까요?",
    exitNote: "나가면 이 미션은 처음부터 다시 해요.",
    exitNoteRound2: "1라운드부터 다시 해요.",
    exitContinue: "계속하기",
    exitConfirm: "나가기",
    reloadTitle: "처음부터 다시 시작해요",
    reloadNote: "새로고침을 해서 진행이 처음으로 돌아갔어요. 완료한 다른 구역도 처음부터 다시 해요.",
    ok: "확인",
    badLinkTitle: "링크가 올바르지 않아요",
    badLinkNote: "선생님께 링크나 QR을 다시 받아 주세요.",
    lessonDoneTitle: "오늘의 수업 완료!",
    lessonDoneLine: "오늘 {n}명의 주민을 도와줬어요!",
    lessonDoneNote: "완료한 구역은 다시 해 볼 수 있어요",
    lessonDoneButton: "마을로",

    /* 공통 화면 시안에서 정한 이름표·안내 (기획안에 없던 짧은 문구) */
    playerName: "보건 대원",
    bagTag: "미션 ① 구급가방",
    oxTag: "미션 ② O/X 퀴즈",
    oxGuide: "맞으면 ◯, 틀리면 ×를 눌러요",
    hintLabel: "힌트",
    guideTag: "안내",
    notebookGuide: "수첩을 끝까지 읽어 봐요.",
    replayTag: "(다시 하기)",
    notebookButton: "📒 응급처치 수첩",
    notebookListNote: "도와준 주민의 수첩을 다시 볼 수 있어요. 배지를 눌러 봐요.",
    notebookLocked: "아직 도와주지 않았어요",
    notebookBack: "◀ 수첩 목록",
    close: "닫기",
    moveHelp: "방향키로 움직여요",
    stepNames: ["구급가방", "O/X", "행동 선택"]
  },

  /* 교사용 관리자 화면 문구 (기획안 4-5) */
  teacher: {
    title: "응급처치 마을 방범대(EB) · 교사용 관리자 화면",
    intro: ["교사용 주소로 접속하면 바로 열려요", "저장되는 정보 없음", "학생에게 이 주소는 보여 주지 않아요"],
    zoneHead: "① 오늘 수업할 구역 고르기",
    selectAll: "전체 선택", clearAll: "전체 해제",
    zoneNote: "6·9구역은 두 라운드를 함께 골라요(따로 고를 수 없어요).",
    soundHead: "② 소리 기본값",
    soundNames: { bgm: "배경음", sfx: "효과음", metronome: "메트로놈(10구역)" },
    soundNote: "처음에는 모두 꺼져 있어요. 학생도 화면에서 켜고 끌 수 있어요.",
    checkHead: "③ 확인하기",
    summary: "선택 {n}개 구역 · 예상 시간 약 {time}",
    timeNote: "학생이 직접 해 본 시간을 바탕으로 한 예상 시간이에요.",
    answerPreview: "정답·해설 미리보기",
    answerBag: "구급가방 정답({n}개)",
    answerNote: "교사용 주소에서만 보여요. 학생용 링크에는 정답이 들어가지 않아요.",
    studentPreview: "학생 화면 미리보기",
    studentPreviewNote: "새 창(새 탭)으로 학생 시작 화면이 열려요",
    makeButton: "링크·QR 만들기",
    stickyNone: "구역을 골라 주세요",
    stickyPicked: "{n}개 구역 선택",
    stickyTime: "예상 약 {time}",
    creditsButton: "만든 사람 · 소리 출처",
    noZoneTitle: "구역을 1개 이상 골라 주세요",
    noZoneNote: "구역을 고르지 않으면 링크와 QR을 만들 수 없어요.",
    qrTitle: "응급처치 마을 방범대(EB) · 학생용 링크와 QR",
    qrGuide: "QR을 전자칠판에 크게 띄워 학생에게 보여 주세요",
    qrSettings: "이 링크에 담긴 설정",
    copyLink: "링크 복사", qrBig: "QR 크게 보기(전자칠판)", qrSave: "QR 이미지 저장", reselect: "◀ 구역 다시 고르기",
    qrNote: ["구역을 바꾸면 새 링크가 만들어지고, 이전 링크는 이전 설정 그대로 열려요.", "학생용 링크에는 정답이 들어가지 않아요."],
    qrBigText: "QR을 찍어 응급처치 마을 방범대에 들어와요!"
  },

  /* 만든 사람 · 소리 출처 팝업 (개발요청서 10장 · 체크리스트 붙임 5) */
  credits: {
    maker: "SENSE 초등보건교육연구회 응급처치 소모임 – 조서인·기은아·신정은",
    art: "그림·배경음: SENSE 초등보건교육연구회 응급처치 소모임 공동 제작 (배경음은 Google Gemini로 생성)",
    sounds: [
      "Button Click 1.wav by Mellau – freesound.org/s/506054 – CC BY-NC 4.0",
      "random_UI_selection by harrisonlace – freesound.org/s/713595 – CC0",
      "Item Equip by mrickey13 – freesound.org/s/518850 – CC0",
      "correct by ertfelda – freesound.org/s/243701 – CC0",
      "Incorrect Chime by LaurenPonder – freesound.org/s/639427 – CC0",
      "Level Up 01 by mokasza – freesound.org/s/810753 – CC BY 4.0",
      "Level Up 03 by mokasza – freesound.org/s/810755 – CC BY 4.0",
      "Double Beep by andersmmg – freesound.org/s/511492 – CC BY 4.0",
      "QUIQUEMPOIS_Justine_2016_2017_click.wav by iut_Paris8 – freesound.org/s/390150 – CC0",
      "Laser by jmayoff – freesound.org/s/253446 – CC0",
      "Rising Slide Whistle Siren Alarm [JWmcopa sample] by qubodup – freesound.org/s/870418 – CC0 / Rising Slide Whistle by JWmcopa – freesound.org/s/869126 – CC0",
      "text_click.wav by metalfortress – freesound.org/s/611807 – CC0"
    ],
    notice: "비영리 교육용으로만 사용합니다."
  }
};
