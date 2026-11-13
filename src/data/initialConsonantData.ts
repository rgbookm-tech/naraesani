import { InitialConsonantUnit } from '../types/initialConsonantTypes';

const IMG = (file: string) => `./images/initial/${file}`;

export const INITIAL_CONSONANT_UNITS: InitialConsonantUnit[] = [
  // =========================================================================
  // 1. ㄱ (기역) — 거꾸로도깨비 (모험 1번째 / 가나다 1번째)
  // =========================================================================
  {
    adventureOrder: 1,
    ganadaOrder: 1,
    consonant: 'ㄱ',
    name: '기역',
    goblinTitle: '거꾸로도깨비의 수수께끼',
    goblinStorySummary: '물구나무를 선 거꾸로도깨비의 수수께끼를 풀고 첫 번째 ㄱ 소리구슬을 되찾아요!',
    beadColor: '#ef4444',
    beadLabel: '빨간 ㄱ 소리구슬',
    strokeGuides: [
      { d: 'M 22 28 L 76 28 L 70 76', numX: 18, numY: 22 },
    ],
    step1Instruction: 'ㄱ을 순서에 따라 써 보세요.',
    step2Instruction: '글자를 따라 쓰며 소리 내어 읽어 보세요.',
    syllables10: ['가', '갸', '거', '겨', '고', '교', '구', '규', '그', '기'],
    step3: {
      mode: 'slot-fill',
      instruction: '그림에 알맞은 낱말을 완성해 보세요.',
      choicesPool: ['ㄱ', '고', '기', '가', '게', '계'],
      items: [
        {
          id: 'g1',
          word: '고기',
          image: IMG('g_meat.png'),
          boxes: [
            { layout: 'consonant-top', hintPart: 'ㅗ', targetSyllable: '고', answerToken: 'ㄱ' },
            { layout: 'consonant-left', hintPart: 'ㅣ', targetSyllable: '기', answerToken: 'ㄱ' },
          ],
        },
        {
          id: 'g2',
          word: '가게',
          image: IMG('g_shop.png'),
          boxes: [
            { layout: 'consonant-left', hintPart: 'ㅏ', targetSyllable: '가', answerToken: 'ㄱ' },
            { layout: 'consonant-left', hintPart: 'ㅔ', targetSyllable: '게', answerToken: 'ㄱ' },
          ],
        },
        {
          id: 'g3',
          word: '계곡',
          image: IMG('g_valley.png'),
          boxes: [
            { layout: 'consonant-left', hintPart: 'ㅖ', targetSyllable: '계', answerToken: 'ㄱ' },
            { layout: 'given-syllable', hintPart: '곡', targetSyllable: '곡' },
          ],
        },
      ],
    },
    step4: {
      playType: 'color-grid-animal',
      instruction: '‘ㄱ’ 글자가 들어간 낱말을 모두 클릭해 색칠하고, 나타나는 글자가 표현하는 동물을 클릭해 주세요.',
      rows: 4,
      cols: 6,
      cells: [
        ['코', '콩', '알', '길', '빛', '귀'],
        ['감', '곰', '꿈', '굴', '게', '공'],
        ['깨', '강', '코', '각', '둑', '귤'],
        ['껌', '말', '꽃', '책', '산', '금'],
      ],
      correctWords: ['길', '귀', '감', '곰', '굴', '게', '공', '강', '각', '귤', '책', '금'],
      animals: [
        { id: 'dog', name: '개', image: IMG('g_dog.png'), isCorrect: true },
        { id: 'cow', name: '소', image: IMG('g_cow.png'), isCorrect: false },
        { id: 'horse', name: '말', image: IMG('g_horse.png'), isCorrect: false },
      ],
      revealHint: '색칠된 칸들을 멀리서 보면 ‘개’라는 글자 모양이 나타나요!',
    },
    step5: {
      instruction: '동시를 소리 내어 읽고 ‘ㄱ’을 찾아 클릭해 주세요.',
      title: '가거고구그기',
      lines: [
        '거꾸로도깨비 만나',
        '수수께끼 풀어 보자',
        '추장보다 높은 건',
        '고 고 고 추장',
        '피 안 나는 칼은',
        '칼 칼 머리칼',
        '가거고구그기',
      ],
      targetConsonants: ['ㄱ'],
      matchMode: 'any-position',
    },
  },

  // =========================================================================
  // 2. ㅋ (키읔) — 킁킁 꼬물벌레와 키득벌레 (모험 2번째 / 가나다 11번째)
  // =========================================================================
  {
    adventureOrder: 2,
    ganadaOrder: 11,
    consonant: 'ㅋ',
    name: '키읔',
    goblinTitle: '킁킁 소리가 멈췄어!',
    goblinStorySummary: '거꾸로도깨비 콧속의 꼬물벌레와 키득벌레를 물리치고 ㅋ 소리구슬을 찾아요!',
    beadColor: '#f97316',
    beadLabel: '주황 ㅋ 소리구슬',
    strokeGuides: [
      { d: 'M 22 26 L 76 26 L 70 78', numX: 18, numY: 20 },
      { d: 'M 24 50 L 68 50', numX: 18, numY: 50 },
    ],
    step1Instruction: 'ㅋ을 순서에 따라 써 보세요.',
    step2Instruction: '글자를 따라 쓰며 소리 내어 읽어 보세요.',
    syllables10: ['카', '캬', '커', '켜', '코', '쿄', '쿠', '큐', '크', '키'],
    step3: {
      mode: 'slot-fill',
      instruction: '그림에 알맞은 낱말을 완성해 보세요.',
      choicesPool: ['ㅋ', '키', '쿠', '코'],
      items: [
        {
          id: 'k1',
          word: '키',
          image: IMG('k_height.png'),
          boxes: [
            { layout: 'consonant-left', hintPart: 'ㅣ', targetSyllable: '키', answerToken: 'ㅋ' },
          ],
        },
        {
          id: 'k2',
          word: '쿠키',
          image: IMG('k_cookie.png'),
          boxes: [
            { layout: 'consonant-top', hintPart: 'ㅜ', targetSyllable: '쿠', answerToken: 'ㅋ' },
            { layout: 'consonant-left', hintPart: 'ㅣ', targetSyllable: '키', answerToken: 'ㅋ' },
          ],
        },
        {
          id: 'k3',
          word: '코코아',
          image: IMG('k_cocoa.png'),
          boxes: [
            { layout: 'consonant-top', hintPart: 'ㅗ', targetSyllable: '코', answerToken: 'ㅋ' },
            { layout: 'consonant-top', hintPart: 'ㅗ', targetSyllable: '코', answerToken: 'ㅋ' },
            { layout: 'given-syllable', hintPart: '아', targetSyllable: '아' },
          ],
        },
      ],
    },
    step4: {
      playType: 'mimic-match-fill',
      instruction: '‘ㅋ’이 들어가는 흉내 내는 말입니다. 어울리는 그림과 말을 차례대로 클릭해 주세요.',
      items: [
        { id: 'kk1', image: IMG('k_kongkong.png'), word: '콩콩', desc: '제자리에서 뛰는 모양' },
        { id: 'kk2', image: IMG('k_keungkeung.png'), word: '킁킁', desc: '코로 냄새를 맡는 소리' },
        { id: 'kk3', image: IMG('k_kulkul.png'), word: '쿨쿨', desc: '새근새근 깊이 자는 소리' },
      ],
      choices: ['킁킁', '콩콩', '쿨쿨'],
    },
    step5: {
      instruction: '동시를 소리 내어 읽고 ‘ㅋ’을 찾아 클릭해 주세요.',
      title: '카커코쿠크키',
      lines: [
        '이백 년 동안',
        '킁킁 콧물이 나와',
        '킁킁 코가 간지러워',
        '꼬물꼬물 꼬물벌레',
        '콧속을 들락달락',
        '키득키득 키득벌레',
        '조심조심 제거해 줘',
        '카커코쿠크키',
      ],
      targetConsonants: ['ㅋ'],
      matchMode: 'any-position',
    },
  },

  // =========================================================================
  // 3. ㄴ (니은) — 닐리리이 나발도깨비 (모험 3번째 / 가나다 2번째)
  // =========================================================================
  {
    adventureOrder: 3,
    ganadaOrder: 2,
    consonant: 'ㄴ',
    name: '니은',
    goblinTitle: '닐리리이 나발도깨비',
    goblinStorySummary: '나팔꽃 모양 나발을 부는 나발도깨비와 함께 노란 ㄴ 소리구슬을 찾아요!',
    beadColor: '#eab308',
    beadLabel: '노란 ㄴ 소리구슬',
    strokeGuides: [
      { d: 'M 26 24 L 26 74 L 78 74', numX: 20, numY: 20 },
    ],
    step1Instruction: 'ㄴ을 순서에 따라 써 보세요.',
    step2Instruction: '글자를 따라 쓰며 소리 내어 읽어 보세요.',
    syllables10: ['나', '냐', '너', '녀', '노', '뇨', '누', '뉴', '느', '니'],
    step3: {
      mode: 'word-choice',
      instruction: '그림에 알맞은 낱말을 클릭해 주세요.',
      items: [
        { id: 'n1', image: IMG('n_yellow.png'), options: ['노랑', '파랑'], answer: '노랑' },
        { id: 'n2', image: IMG('n_screw.png'), options: ['나사', '도사'], answer: '나사' },
        { id: 'n3', image: IMG('n_silkworm.png'), options: ['누에', '가에'], answer: '누에' },
      ],
    },
    step4: {
      playType: 'image-maze-n',
      instruction: '‘ㄴ’ 글자가 있는 이름을 가진 그림을 차례대로 클릭해 주세요.',
      mazeImage: IMG('n_maze.jpg'),
      steps: [
        {
          stepIndex: 0,
          options: [
            { word: '바다', image: IMG('n_sea.jpg'), xPct: 19, yPct: 32, isCorrect: false },
            { word: '나비', image: IMG('n_butterfly.jpg'), xPct: 37.5, yPct: 30, isCorrect: true },
          ],
        },
        {
          stepIndex: 1,
          options: [
            { word: '고구마', image: IMG('n_sweetpotato.jpg'), xPct: 22, yPct: 69, isCorrect: false },
            { word: '너구리', image: IMG('n_raccoon.jpg'), xPct: 43.5, yPct: 69, isCorrect: true },
          ],
        },
        {
          stepIndex: 2,
          options: [
            { word: '노래', image: IMG('n_song.png'), xPct: 54.5, yPct: 73, isCorrect: true },
            { word: '고래', image: IMG('n_whale.jpg'), xPct: 76, yPct: 71, isCorrect: false },
          ],
        },
        {
          stepIndex: 3,
          options: [
            { word: '둘(브이)', image: IMG('n_two.jpg'), xPct: 53.5, yPct: 28, isCorrect: false },
            { word: '누룽지', image: IMG('n_nurungji.jpg'), xPct: 77.5, yPct: 29, isCorrect: true },
          ],
        },
      ],
    },
    step5: {
      instruction: '동시를 소리 내어 읽고 ‘ㄴ’을 찾아 클릭해 주세요.',
      title: '나너노누느니',
      lines: [
        '나발도깨비 만나',
        'ㄴ 단어 외치네',
        '나풀나풀 나비',
        '누룽누룽 누룽지',
        '나무나무 느티나무',
        '나너노누느니',
      ],
      targetConsonants: ['ㄴ'],
      includeStandaloneJamo: true,
      matchMode: 'any-position',
    },
  },

  // =========================================================================
  // 4. ㄷ (디귿) — 둥두둥둥 북도깨비 (모험 4번째 / 가나다 3번째)
  // =========================================================================
  {
    adventureOrder: 4,
    ganadaOrder: 3,
    consonant: 'ㄷ',
    name: '디귿',
    goblinTitle: '둥두둥둥 북도깨비',
    goblinStorySummary: '커다란 북이 된 북도깨비의 둥둥 장단에 맞춰 ㄷ 단어를 외쳐요!',
    beadColor: '#d97706',
    beadLabel: '호박색 ㄷ 소리구슬',
    strokeGuides: [
      { d: 'M 24 26 L 76 26', numX: 20, numY: 19 },
      { d: 'M 26 26 L 26 74 L 78 74', numX: 18, numY: 52 },
    ],
    step1Instruction: 'ㄷ을 순서에 따라 써 보세요.',
    step2Instruction: '글자를 따라 쓰며 소리 내어 읽어 보세요.',
    syllables10: ['다', '댜', '더', '뎌', '도', '됴', '두', '듀', '드', '디'],
    step3: {
      mode: 'slot-fill',
      instruction: '그림에 알맞은 낱말을 완성해 보세요.',
      choicesPool: ['ㄷ', '다', '두', '더', '도'],
      items: [
        {
          id: 'd1',
          word: '다리',
          image: IMG('d_leg.png'),
          boxes: [
            { layout: 'consonant-left', hintPart: 'ㅏ', targetSyllable: '다', answerToken: 'ㄷ' },
            { layout: 'given-syllable', hintPart: '리', targetSyllable: '리' },
          ],
        },
        {
          id: 'd2',
          word: '두더지',
          image: IMG('d_mole.png'),
          boxes: [
            { layout: 'consonant-top', hintPart: 'ㅜ', targetSyllable: '두', answerToken: 'ㄷ' },
            { layout: 'consonant-left', hintPart: 'ㅓ', targetSyllable: '더', answerToken: 'ㄷ' },
            { layout: 'given-syllable', hintPart: '지', targetSyllable: '지' },
          ],
        },
        {
          id: 'd3',
          word: '도토리',
          image: IMG('d_acorn.png'),
          boxes: [
            { layout: 'consonant-top', hintPart: 'ㅗ', targetSyllable: '도', answerToken: 'ㄷ' },
            { layout: 'given-syllable', hintPart: '토', targetSyllable: '토' },
            { layout: 'given-syllable', hintPart: '리', targetSyllable: '리' },
          ],
        },
      ],
    },
    step4: {
      playType: 'word-search-puzzle',
      instruction: '퍼즐에서 낱말에 알맞은 글자를 찾아 클릭해 주세요.',
      targetWords: ['다람쥐', '더위', '도깨비', '두꺼비'],
      grid: [
        ['다', '더', '위', '이'],
        ['람', '라', '드', '비'],
        ['쥐', '디', '코', '꺼'],
        ['도', '깨', '비', '두'],
      ],
      solutions: [
        { word: '다람쥐', coords: [[0, 0], [1, 0], [2, 0]] },
        { word: '더위', coords: [[0, 1], [0, 2]] },
        { word: '도깨비', coords: [[3, 0], [3, 1], [3, 2]] },
        { word: '두꺼비', coords: [[3, 3], [2, 3], [1, 3]] },
      ],
    },
    step5: {
      instruction: '동시를 소리 내어 읽고 ‘ㄷ’을 찾아 클릭해 주세요.',
      title: '다더도두드디',
      lines: [
        '둥둥 북도깨비 나타나',
        'ㄷ 단어 외치네',
        '다람다람 다람쥐',
        '더듬더듬 더듬이',
        '다리다리 돌다리',
        '다더도두드디',
      ],
      targetConsonants: ['ㄷ'],
      includeStandaloneJamo: true,
      matchMode: 'any-position',
    },
  },

  // =========================================================================
  // 5. ㅌ (티읕) — 탁탁 딱지도깨비 (모험 5번째 / 가나다 12번째)
  // =========================================================================
  {
    adventureOrder: 5,
    ganadaOrder: 12,
    consonant: 'ㅌ',
    name: '티읕',
    goblinTitle: '탁탁 딱지도깨비와 딱지 한 판',
    goblinStorySummary: '납작한 딱지도깨비와 신나는 말판·딱지 대결을 펼쳐 ㅌ 소리구슬을 얻어요!',
    beadColor: '#ec4899',
    beadLabel: '분홍 ㅌ 소리구슬',
    strokeGuides: [
      { d: 'M 24 25 L 76 25', numX: 19, numY: 19 },
      { d: 'M 26 50 L 72 50', numX: 19, numY: 46 },
      { d: 'M 26 25 L 26 75 L 78 75', numX: 16, numY: 68 },
    ],
    step1Instruction: 'ㅌ을 순서에 따라 써 보세요.',
    step2Instruction: '글자를 따라 쓰며 소리 내어 읽어 보세요.',
    syllables10: ['타', '탸', '터', '텨', '토', '툐', '투', '튜', '트', '티'],
    step3: {
      mode: 'word-choice',
      instruction: '그림에 알맞은 낱말을 클릭해 주세요.',
      items: [
        { id: 't1', image: IMG('t_triangle.png'), options: ['트라이앵글', '터라이앵글'], answer: '트라이앵글' },
        { id: 't2', image: IMG('t_clover.png'), options: ['투끼풀', '토끼풀'], answer: '토끼풀' },
        { id: 't3', image: IMG('t_tshirt.png'), options: ['티셔츠', '트셔츠'], answer: '티셔츠' },
      ],
    },
    step4: {
      playType: 'board-game-t',
      instruction: '친구와 말판 놀이를 합니다.',
      ruleText: '주사위를 던지거나 가위(3칸)·바위(2칸)·보(1칸)를 선택해 말판을 이동하고, 도착한 곳의 낱말을 소리 내어 읽어 보세요!',
      cells: [
        '출발',
        '타',
        '타조',
        '터',
        '타이어',
        '투',
        '토',
        '토끼',
        '투수',
        '투구',
        '티',
        '토스트',
        '트',
        '타다',
        '타월',
        '트로피',
        '토기',
        '트럭',
        '토실',
        '도착(투구)',
      ],
    },
    step5: {
      instruction: '동시를 소리 내어 읽고 ‘ㅌ’을 찾아 클릭해 주세요.',
      title: '타터토투트티',
      lines: [
        '딱지도깨비와',
        '딱지 한 판',
        '타닥타닥 타조, 얍',
        '토실토실 토끼, 얍',
        '탈탈탈탈 트럭, 얍',
        '타터토투 얍!',
      ],
      targetConsonants: ['ㅌ'],
      matchMode: 'any-position',
    },
  },

  // =========================================================================
  // 6. ㄹ (리을) — 리리 릿자도깨비 (모험 6번째 / 가나다 4번째)
  // =========================================================================
  {
    adventureOrder: 6,
    ganadaOrder: 4,
    consonant: 'ㄹ',
    name: '리을',
    goblinTitle: '리리 릿자도깨비의 레몬 바람',
    goblinStorySummary: '상큼한 레몬 향 바람을 일으키는 릿자도깨비와 함께 숨은 ㄹ 그림을 찾아요!',
    beadColor: '#84cc16',
    beadLabel: '레몬색 ㄹ 소리구슬',
    strokeGuides: [
      { d: 'M 24 22 L 74 22 L 74 47', numX: 19, numY: 18 },
      { d: 'M 24 47 L 74 47', numX: 19, numY: 44 },
      { d: 'M 24 47 L 24 76 L 78 76', numX: 16, numY: 66 },
    ],
    step1Instruction: 'ㄹ을 순서에 따라 써 보세요.',
    step2Instruction: '글자를 따라 쓰며 소리 내어 읽어 보세요.',
    syllables10: ['라', '랴', '러', '려', '로', '료', '루', '류', '르', '리'],
    step3: {
      mode: 'slot-fill',
      instruction: '그림에 알맞은 낱말을 완성해 보세요.',
      choicesPool: ['ㄹ', '라', '리', '래'],
      items: [
        {
          id: 'r1',
          word: '라면',
          image: IMG('r_ramen.png'),
          boxes: [
            { layout: 'consonant-left', hintPart: 'ㅏ', targetSyllable: '라', answerToken: 'ㄹ' },
            { layout: 'given-syllable', hintPart: '면', targetSyllable: '면' },
          ],
        },
        {
          id: 'r2',
          word: '리본',
          image: IMG('r_ribbon.png'),
          boxes: [
            { layout: 'consonant-left', hintPart: 'ㅣ', targetSyllable: '리', answerToken: 'ㄹ' },
            { layout: 'given-syllable', hintPart: '본', targetSyllable: '본' },
          ],
        },
        {
          id: 'r3',
          word: '노래',
          image: IMG('n_song.png'),
          boxes: [
            { layout: 'given-syllable', hintPart: '노', targetSyllable: '노' },
            { layout: 'consonant-left', hintPart: 'ㅐ', targetSyllable: '래', answerToken: 'ㄹ' },
          ],
        },
      ],
    },
    step4: {
      playType: 'hidden-objects-r',
      instruction: '‘ㄹ’이 들어간 낱말의 그림을 모두 찾아 클릭해 주세요.',
      sceneImage: IMG('r_hidden_room.jpg'),
      targets: [
        {
          id: 'radio',
          word: '라디오',
          cardImage: IMG('r_radio.jpg'),
          zones: [{ xPct: 15, yPct: 23, wPct: 15, hPct: 16 }],
        },
        {
          id: 'robot',
          word: '로봇',
          cardImage: IMG('r_robot.jpg'),
          zones: [{ xPct: 24, yPct: 41, wPct: 12, hPct: 26 }],
        },
        {
          id: 'rocket',
          word: '로켓',
          cardImage: IMG('r_rocket.jpg'),
          zones: [
            { xPct: 33, yPct: 12, wPct: 9, hPct: 26 },
            { xPct: 72, yPct: 0, wPct: 10, hPct: 15 },
            { xPct: 66, yPct: 52, wPct: 10, hPct: 11 },
          ],
        },
        {
          id: 'remote',
          word: '리모컨',
          cardImage: IMG('r_remote.jpg'),
          zones: [{ xPct: 36, yPct: 42, wPct: 9, hPct: 9 }],
        },
        {
          id: 'recorder',
          word: '리코더',
          cardImage: IMG('r_recorder.jpg'),
          zones: [{ xPct: 73, yPct: 22, wPct: 10, hPct: 31 }],
        },
        {
          id: 'lego',
          word: '레고',
          cardImage: IMG('r_lego.jpg'),
          zones: [
            { xPct: 44, yPct: 78, wPct: 17, hPct: 14 },
            { xPct: 61, yPct: 69, wPct: 17, hPct: 18 },
          ],
        },
        {
          id: 'lemon',
          word: '레몬',
          zones: [{ xPct: 60, yPct: 47, wPct: 9, hPct: 10 }],
        },
        {
          id: 'bridge',
          word: '다리',
          cardImage: IMG('r_bridge.jpg'),
          zones: [{ xPct: 50, yPct: 72, wPct: 14, hPct: 12 }],
        },
        {
          id: 'duck',
          word: '오리',
          cardImage: IMG('r_duck.jpg'),
          zones: [{ xPct: 30, yPct: 63, wPct: 9, hPct: 17 }],
        },
        {
          id: 'whale',
          word: '고래',
          cardImage: IMG('r_whale_card.jpg'),
          zones: [
            { xPct: 11, yPct: 74, wPct: 18, hPct: 21 },
            { xPct: 74, yPct: 56, wPct: 10, hPct: 10 },
          ],
        },
      ],
    },
    step5: {
      instruction: '동시를 소리 내어 읽고 ‘ㄹ’을 찾아 클릭해 주세요.',
      title: '라러로루 루우 루우 루우우',
      lines: [
        '레몬 향 바람이 불어오네',
        '앗 차가워',
        '릿자도깨비 만나',
        '개구리 너구리 목소리 병아리 유리항아리',
        '거머리 꾀꼬리 보따리 사다리 오리 한 마리',
        '레몬색 구슬 반짝이네',
      ],
      targetConsonants: ['ㄹ'],
      matchMode: 'any-position',
    },
  },

  // =========================================================================
  // 7. ㅁ (미음) — 말랑숲 수염도깨비·흉내도깨비 (모험 7번째 / 가나다 5번째)
  // =========================================================================
  {
    adventureOrder: 7,
    ganadaOrder: 5,
    consonant: 'ㅁ',
    name: '미음',
    goblinTitle: '말랑말랑 수염·흉내도깨비',
    goblinStorySummary: '모든 것이 말랑거리는 숲에서 ㅁ 흉내 내는 말을 외치고 민트색 구슬을 받아요!',
    beadColor: '#10b981',
    beadLabel: '민트색 ㅁ 소리구슬',
    strokeGuides: [
      { d: 'M 24 24 L 24 76', numX: 17, numY: 45 },
      { d: 'M 24 24 L 76 24 L 76 76', numX: 48, numY: 17 },
      { d: 'M 24 76 L 76 76', numX: 48, numY: 85 },
    ],
    step1Instruction: 'ㅁ을 순서에 따라 써 보세요.',
    step2Instruction: '글자를 따라 쓰며 소리 내어 읽어 보세요.',
    syllables10: ['마', '먀', '머', '며', '모', '묘', '무', '뮤', '므', '미'],
    step3: {
      mode: 'slot-fill',
      instruction: '그림에 알맞은 낱말을 완성해 보세요.',
      choicesPool: ['ㅁ', '모', '미', '마'],
      items: [
        {
          id: 'm1',
          word: '모자',
          image: IMG('m_hat.png'),
          boxes: [
            { layout: 'consonant-top', hintPart: 'ㅗ', targetSyllable: '모', answerToken: 'ㅁ' },
            { layout: 'given-syllable', hintPart: '자', targetSyllable: '자' },
          ],
        },
        {
          id: 'm2',
          word: '미술',
          image: IMG('m_art.png'),
          boxes: [
            { layout: 'consonant-left', hintPart: 'ㅣ', targetSyllable: '미', answerToken: 'ㅁ' },
            { layout: 'given-syllable', hintPart: '술', targetSyllable: '술' },
          ],
        },
        {
          id: 'm3',
          word: '엄마',
          image: IMG('m_mom.png'),
          boxes: [
            { layout: 'consonant-top', hintPart: '어(받침)', targetSyllable: '엄', answerToken: 'ㅁ' },
            { layout: 'consonant-left', hintPart: 'ㅏ', targetSyllable: '마', answerToken: 'ㅁ' },
          ],
        },
      ],
    },
    step4: {
      playType: 'corridor-maze-m',
      instruction: '‘ㅁ’이 들어간 낱말을 클릭해 주세요. 길을 따라 도착점까지 이동합니다.',
      mazeImage: IMG('m_maze.jpg'),
      checkpoints: [
        {
          stepIndex: 0,
          correct: { word: '맴맴', xPct: 29.5, yPct: 40 },
          wrong: { word: '앵앵', xPct: 25.5, yPct: 31 },
        },
        {
          stepIndex: 1,
          correct: { word: '음매음매', xPct: 59, yPct: 48 },
          wrong: { word: '삐약삐약', xPct: 68.5, yPct: 39.5 },
        },
        {
          stepIndex: 2,
          correct: { word: '우물쭈물', xPct: 43.5, yPct: 65 },
          wrong: { word: '웅성웅성', xPct: 37.5, yPct: 48 },
        },
        {
          stepIndex: 3,
          correct: { word: '뭉게뭉게', xPct: 34, yPct: 74.5 },
          wrong: { word: '반짝반짝', xPct: 44.5, yPct: 83 },
        },
        {
          stepIndex: 4,
          correct: { word: '밍기적밍기적', xPct: 84, yPct: 92 },
          wrong: { word: '두리번두리번', xPct: 76, yPct: 84 },
        },
      ],
    },
    step5: {
      instruction: '동시를 소리 내어 읽고 ‘ㅁ’을 찾아 클릭해 주세요.',
      title: '바위도, 나무도, 길도',
      lines: [
        '말랑말랑 몰랑몰랑 물렁물렁',
        '말캉말캉 몰캉몰캉 물컹물컹',
        '수염도깨비, 흉내도깨비 만나',
        '마머모무! 머뭇머뭇!',
        '마머모무! 미끌미끌!',
        '마머모무! 메롱메롱!',
        '민트색 구슬 하나 어느새 내 손에',
      ],
      targetConsonants: ['ㅁ'],
      matchMode: 'any-position',
    },
  },

  // =========================================================================
  // 8. ㅂ (비읍) — 보글보글 불도깨비 (모험 8번째 / 가나다 6번째)
  // =========================================================================
  {
    adventureOrder: 8,
    ganadaOrder: 6,
    consonant: 'ㅂ',
    name: '비읍',
    goblinTitle: '보글보글 강가와 불도깨비',
    goblinStorySummary: '보글보글 강가의 징검돌을 건너며 ㅂ 노래를 불러 불도깨비를 만나요!',
    beadColor: '#8b5cf6',
    beadLabel: '보라색 ㅂ 소리구슬',
    strokeGuides: [
      { d: 'M 25 22 L 25 76', numX: 18, numY: 32 },
      { d: 'M 75 22 L 75 76', numX: 82, numY: 32 },
      { d: 'M 25 48 L 75 48', numX: 50, numY: 42 },
      { d: 'M 25 76 L 75 76', numX: 50, numY: 85 },
    ],
    step1Instruction: 'ㅂ을 순서에 따라 써 보세요.',
    step2Instruction: '글자를 따라 쓰며 소리 내어 읽어 보세요.',
    syllables10: ['바', '뱌', '버', '벼', '보', '뵤', '부', '뷰', '브', '비'],
    step3: {
      mode: 'slot-fill',
      instruction: '그림에 알맞은 낱말을 완성해 보세요.',
      choicesPool: ['ㅂ', '바', '버', '비'],
      items: [
        {
          id: 'b1',
          word: '바지',
          image: IMG('b_pants.png'),
          boxes: [
            { layout: 'consonant-left', hintPart: 'ㅏ', targetSyllable: '바', answerToken: 'ㅂ' },
            { layout: 'given-syllable', hintPart: '지', targetSyllable: '지' },
          ],
        },
        {
          id: 'b2',
          word: '버스',
          image: IMG('b_bus.png'),
          boxes: [
            { layout: 'consonant-left', hintPart: 'ㅓ', targetSyllable: '버', answerToken: 'ㅂ' },
            { layout: 'given-syllable', hintPart: '스', targetSyllable: '스' },
          ],
        },
        {
          id: 'b3',
          word: '비행기',
          image: IMG('b_plane.png'),
          boxes: [
            { layout: 'consonant-left', hintPart: 'ㅣ', targetSyllable: '비', answerToken: 'ㅂ' },
            { layout: 'given-syllable', hintPart: '행', targetSyllable: '행' },
            { layout: 'given-syllable', hintPart: '기', targetSyllable: '기' },
          ],
        },
      ],
    },
    step4: {
      playType: 'rebus-sentences-b',
      instruction: '그림을 보며 ‘ㅂ’이 들어간 문장을 소리 내어 읽어 보세요.',
      sentences: [
        {
          id: 'bs1',
          fullAudioText: '밤하늘에 별이 반짝반짝 빛나요.',
          segments: [
            { kind: 'picture-word', word: '밤하늘', image: IMG('b_nightsky.png'), meaningHint: '어두운 밤의 하늘' },
            { kind: 'text', text: '에 ' },
            { kind: 'picture-word', word: '별', image: IMG('b_star.jpg'), meaningHint: '반짝이는 별' },
            { kind: 'text', text: '이 반짝반짝 빛나요.' },
          ],
        },
        {
          id: 'bs2',
          fullAudioText: '저는 밥보다 빵을 더 좋아해요.',
          segments: [
            { kind: 'text', text: '저는 ' },
            { kind: 'picture-word', word: '밥', image: IMG('b_rice.png'), meaningHint: '따뜻한 쌀밥' },
            { kind: 'text', text: '보다 ' },
            { kind: 'picture-word', word: '빵', image: IMG('b_bread.png'), meaningHint: '폭신한 식빵' },
            { kind: 'text', text: '을 더 좋아해요.' },
          ],
        },
        {
          id: 'bs3',
          fullAudioText: '배 위에서 배를 먹으니 배가 불러요.',
          segments: [
            { kind: 'picture-word', word: '배', image: IMG('b_ship.jpg'), meaningHint: '물에 떠서 가는 배' },
            { kind: 'text', text: ' 위에서 ' },
            { kind: 'picture-word', word: '배', image: IMG('b_pear.jpg'), meaningHint: '달콤하고 아삭한 과일 배' },
            { kind: 'text', text: '를 먹으니 ' },
            { kind: 'picture-word', word: '배', image: IMG('b_belly.jpg'), meaningHint: '우리 몸의 배' },
            { kind: 'text', text: '가 불러요.' },
          ],
        },
      ],
    },
    step5: {
      instruction: '동시를 소리 내어 읽고 ‘ㅂ’을 찾아 클릭해 주세요.',
      title: '바버보부브비',
      lines: [
        '바버보부 보글보글 빙글빙글',
        '바버보부 반짝반짝 번쩍번쩍',
        '바버보부 손발 굴러 노래하며',
        '보글보글 강가 지나',
        '불도깨비 찾아가네',
      ],
      targetConsonants: ['ㅂ'],
      matchMode: 'any-position',
    },
  },

  // =========================================================================
  // 9. ㅍ (피읖) — 펄럭펄럭 포대기도깨비 (모험 9번째 / 가나다 13번째)
  // =========================================================================
  {
    adventureOrder: 9,
    ganadaOrder: 13,
    consonant: 'ㅍ',
    name: '피읖',
    goblinTitle: '펄럭펄럭 포대기도깨비',
    goblinStorySummary: '푸른 계곡에서 펄럭펄럭 춤추는 포대기도깨비와 함께 파란 ㅍ 칸을 색칠해요!',
    beadColor: '#3b82f6',
    beadLabel: '파란 ㅍ 소리구슬',
    strokeGuides: [
      { d: 'M 20 25 L 80 25', numX: 50, numY: 17 },
      { d: 'M 36 25 L 36 75', numX: 28, numY: 50 },
      { d: 'M 64 25 L 64 75', numX: 72, numY: 50 },
      { d: 'M 18 75 L 82 75', numX: 50, numY: 85 },
    ],
    step1Instruction: 'ㅍ을 순서에 따라 써 보세요.',
    step2Instruction: '글자를 따라 쓰며 소리 내어 읽어 보세요.',
    syllables10: ['파', '퍄', '퍼', '펴', '포', '표', '푸', '퓨', '프', '피'],
    step3: {
      mode: 'slot-fill',
      instruction: '그림에 알맞은 낱말을 완성해 보세요.',
      choicesPool: ['ㅍ', '파', '포', '피'],
      items: [
        {
          id: 'p1',
          word: '파랑',
          image: IMG('p_blue.png'),
          boxes: [
            { layout: 'consonant-left', hintPart: 'ㅏ', targetSyllable: '파', answerToken: 'ㅍ' },
            { layout: 'given-syllable', hintPart: '랑', targetSyllable: '랑' },
          ],
        },
        {
          id: 'p2',
          word: '포도',
          image: IMG('p_grape.png'),
          boxes: [
            { layout: 'consonant-top', hintPart: 'ㅗ', targetSyllable: '포', answerToken: 'ㅍ' },
            { layout: 'given-syllable', hintPart: '도', targetSyllable: '도' },
          ],
        },
        {
          id: 'p3',
          word: '피아노',
          image: IMG('p_piano.png'),
          boxes: [
            { layout: 'consonant-left', hintPart: 'ㅣ', targetSyllable: '피', answerToken: 'ㅍ' },
            { layout: 'given-syllable', hintPart: '아', targetSyllable: '아' },
            { layout: 'given-syllable', hintPart: '노', targetSyllable: '노' },
          ],
        },
      ],
    },
    step4: {
      playType: 'color-grid-blue-p',
      instruction: '‘ㅍ’ 낱말이 있는 칸을 클릭해 주세요.',
      grid: [
        ['파도', '편지', '풍선', '팔', '푸르다'],
        ['미소', '파', '타조', '펭귄', '노랑'],
        ['고래', '판다', '도토리', '풀', '가게'],
        ['표범', '퍼즐', '피하다', '표지판', '팽이'],
      ],
      correctWords: [
        '파도', '편지', '풍선', '팔', '푸르다',
        '파', '펭귄',
        '판다', '풀',
        '표범', '퍼즐', '피하다', '표지판', '팽이',
      ],
    },
    step5: {
      instruction: '동시를 소리 내어 읽고 ‘ㅍ’을 찾아 클릭해 주세요.',
      title: '파퍼포푸프피',
      lines: [
        '팥빵은 폭신폭신 팽이는 팽글팽글',
        '팔랑개비 팔랑팔랑 풀벌레는 폴짝폴짝',
        '펄럭펄럭 춤추는 포대기도깨비',
        '푸른 계곡에서 도깨비춤을 추네',
      ],
      targetConsonants: ['ㅍ'],
      matchMode: 'any-position',
    },
  },

  // =========================================================================
  // 10. ㅅ (시옷) — 사자머리 씨름도깨비 (모험 10번째 / 가나다 7번째)
  // =========================================================================
  {
    adventureOrder: 10,
    ganadaOrder: 7,
    consonant: 'ㅅ',
    name: '시옷',
    goblinTitle: '사자머리 씨름도깨비',
    goblinStorySummary: '사자머리를 흔드는 씨름도깨비와 힘을 겨루며 ㅅ과 ㅆ 소리를 구별해요!',
    beadColor: '#14b8a6',
    beadLabel: '청록 ㅅ 소리구슬',
    strokeGuides: [
      { d: 'M 50 22 L 20 76', numX: 38, numY: 22 },
      { d: 'M 46 42 L 80 76', numX: 62, numY: 44 },
    ],
    step1Instruction: 'ㅅ을 순서에 따라 써 보세요.',
    step2Instruction: '글자를 따라 쓰며 소리 내어 읽어 보세요.',
    syllables10: ['사', '샤', '서', '셔', '소', '쇼', '수', '슈', '스', '시'],
    step3: {
      mode: 'slot-fill',
      instruction: '그림에 알맞은 낱말을 완성해 보세요.',
      choicesPool: ['ㅅ', '사', '소'],
      items: [
        {
          id: 's1',
          word: '사과',
          image: IMG('s_apple.png'),
          boxes: [
            { layout: 'consonant-left', hintPart: 'ㅏ', targetSyllable: '사', answerToken: 'ㅅ' },
            { layout: 'given-syllable', hintPart: '과', targetSyllable: '과' },
          ],
        },
        {
          id: 's2',
          word: '주사기',
          image: IMG('s_syringe.png'),
          boxes: [
            { layout: 'given-syllable', hintPart: '주', targetSyllable: '주' },
            { layout: 'consonant-left', hintPart: 'ㅏ', targetSyllable: '사', answerToken: 'ㅅ' },
            { layout: 'given-syllable', hintPart: '기', targetSyllable: '기' },
          ],
        },
        {
          id: 's3',
          word: '소나무',
          image: IMG('s_pine.png'),
          boxes: [
            { layout: 'consonant-top', hintPart: 'ㅗ', targetSyllable: '소', answerToken: 'ㅅ' },
            { layout: 'given-syllable', hintPart: '나', targetSyllable: '나' },
            { layout: 'given-syllable', hintPart: '무', targetSyllable: '무' },
          ],
        },
      ],
    },
    step4: {
      playType: 'minimal-pair-circle-s',
      instruction: '그림에 알맞은 글자를 찾아 클릭해 주세요.',
      items: [
        { id: 'sp1', image: IMG('s_cow.png'), options: ['소', '쏘', '쪼'], answer: '소', fullWord: '소' },
        { id: 'sp2', image: IMG('s_clap.png'), prefix: '박', options: ['수', '쑤', '쭈'], answer: '수', fullWord: '박수' },
        { id: 'sp3', image: IMG('s_seed.png'), options: ['시', '씨', '찌'], suffix: '앗', answer: '씨', fullWord: '씨앗' },
        { id: 'sp4', image: IMG('s_sled.jpg'), prefix: '눈', options: ['설', '썰', '쩔'], suffix: '매', answer: '썰', fullWord: '눈썰매' },
      ],
    },
    step5: {
      instruction: '동시를 소리 내어 읽고 ‘ㅅ’과 ‘ㅆ’을 찾아 클릭해 주세요.',
      title: '사서소수시',
      lines: [
        '사자머리 흔드는',
        '씨름도깨비 나와라',
        '사서소수 얍! 솟구쳐라 얍!',
        '씨름 좋아하는 씨름도깨비',
        '소나무에 묶었지',
        '아 시원해 쿵쿵!',
      ],
      targetConsonants: ['ㅅ', 'ㅆ'],
      matchMode: 'any-position',
    },
  },

  // =========================================================================
  // 11. ㅈ (지읒) — 자루도깨비와 ㅈ도깨비들 (모험 11번째 / 가나다 9번째)
  // =========================================================================
  {
    adventureOrder: 11,
    ganadaOrder: 9,
    consonant: 'ㅈ',
    name: '지읒',
    goblinTitle: '자루도깨비 주문을 외자!',
    goblinStorySummary: '자루도깨비를 말아 날려 보내고 지게·작대기·저고리·주걱 도깨비를 구해요!',
    beadColor: '#6366f1',
    beadLabel: '남색 ㅈ 소리구슬',
    strokeGuides: [
      { d: 'M 22 25 L 78 25 L 22 76', numX: 20, numY: 18 },
      { d: 'M 48 48 L 80 76', numX: 66, numY: 48 },
    ],
    step1Instruction: 'ㅈ을 순서에 따라 써 보세요.',
    step2Instruction: '글자를 따라 쓰며 소리 내어 읽어 보세요.',
    syllables10: ['자', '쟈', '저', '져', '조', '죠', '주', '쥬', '즈', '지'],
    step3: {
      mode: 'slot-fill',
      instruction: '그림에 알맞은 낱말을 완성해 보세요.',
      choicesPool: ['ㅈ', '자', '주', '저'],
      items: [
        {
          id: 'j1',
          word: '자루',
          image: IMG('j_sack.png'),
          boxes: [
            { layout: 'consonant-left', hintPart: 'ㅏ', targetSyllable: '자', answerToken: 'ㅈ' },
            { layout: 'given-syllable', hintPart: '루', targetSyllable: '루' },
          ],
        },
        {
          id: 'j2',
          word: '주걱',
          image: IMG('j_spatula.png'),
          boxes: [
            { layout: 'consonant-top', hintPart: 'ㅜ', targetSyllable: '주', answerToken: 'ㅈ' },
            { layout: 'given-syllable', hintPart: '걱', targetSyllable: '걱' },
          ],
        },
        {
          id: 'j3',
          word: '저고리',
          image: IMG('j_jeogori.jpg'),
          boxes: [
            { layout: 'consonant-left', hintPart: 'ㅓ', targetSyllable: '저', answerToken: 'ㅈ' },
            { layout: 'given-syllable', hintPart: '고', targetSyllable: '고' },
            { layout: 'given-syllable', hintPart: '리', targetSyllable: '리' },
          ],
        },
      ],
    },
    step4: {
      playType: 'word-search-puzzle',
      instruction: '퍼즐에서 ‘ㅈ’이 들어간 낱말을 찾아 클릭해 주세요.',
      targetWords: ['저고리', '가지', '장소', '지게', '종이', '가족', '자장가', '지렁이'],
      grid: [
        ['자', '장', '가', '족'],
        ['갸', '멍', '소', '저'],
        ['오', '지', '게', '고'],
        ['리', '렁', '발', '리'],
        ['종', '니', '톱', '이'],
      ],
      solutions: [
        { word: '자장가', coords: [[0, 0], [0, 1], [0, 2]] },
        { word: '가족', coords: [[0, 2], [0, 3]] },
        { word: '장소', coords: [[0, 1], [1, 2]] },
        { word: '가지', coords: [[0, 2], [2, 1]] },
        { word: '지게', coords: [[2, 1], [2, 2]] },
        { word: '지렁이', coords: [[2, 1], [3, 1], [4, 3]] },
        { word: '종이', coords: [[4, 0], [4, 3]] },
        { word: '저고리', coords: [[1, 3], [2, 3], [3, 3]] },
      ],
    },
    step5: {
      instruction: '동시를 소리 내어 읽고 ‘ㅈ’을 찾아 클릭해 주세요.',
      title: '자저조주지',
      lines: [
        '주문을 외자',
        '지직지직 금이 간다',
        '조심조심 걸어라',
        '자저조주! 자루도깨비 말아라 얍!',
        '저 멀리 날려 버린 자루도깨비 뒤로',
        '지게 작대기 저고리 주걱',
        'ㅈ 도깨비들 살아났지',
        '잘했어 쿵쿵!',
      ],
      targetConsonants: ['ㅈ'],
      includeStandaloneJamo: true,
      matchMode: 'any-position',
    },
  },

  // =========================================================================
  // 12. ㅊ (치읓) — 용감한 창도깨비 (모험 12번째 / 가나다 10번째)
  // =========================================================================
  {
    adventureOrder: 12,
    ganadaOrder: 10,
    consonant: 'ㅊ',
    name: '치읓',
    goblinTitle: '창도깨비 내 창을 받아라!',
    goblinStorySummary: '창도깨비가 멋진 창을 던져 그림자도깨비를 쫓아내고 ㅊ 소리구슬을 지켜요!',
    beadColor: '#0ea5e9',
    beadLabel: '하늘색 ㅊ 소리구슬',
    strokeGuides: [
      { d: 'M 38 14 L 62 14', numX: 32, numY: 13 },
      { d: 'M 22 32 L 78 32 L 22 80', numX: 18, numY: 28 },
      { d: 'M 48 54 L 80 80', numX: 66, numY: 54 },
    ],
    step1Instruction: 'ㅊ을 순서에 따라 써 보세요.',
    step2Instruction: '글자를 따라 쓰며 소리 내어 읽어 보세요.',
    syllables10: ['차', '챠', '처', '쳐', '초', '쵸', '추', '츄', '츠', '치'],
    step3: {
      mode: 'slot-fill',
      instruction: '그림에 알맞은 낱말을 완성해 보세요.',
      choicesPool: ['ㅊ', '치', '추', '차'],
      items: [
        {
          id: 'ch1',
          word: '치마',
          image: IMG('ch_skirt.png'),
          boxes: [
            { layout: 'consonant-left', hintPart: 'ㅣ', targetSyllable: '치', answerToken: 'ㅊ' },
            { layout: 'given-syllable', hintPart: '마', targetSyllable: '마' },
          ],
        },
        {
          id: 'ch2',
          word: '고추',
          image: IMG('ch_pepper.png'),
          boxes: [
            { layout: 'given-syllable', hintPart: '고', targetSyllable: '고' },
            { layout: 'consonant-top', hintPart: 'ㅜ', targetSyllable: '추', answerToken: 'ㅊ' },
          ],
        },
        {
          id: 'ch3',
          word: '자동차',
          image: IMG('ch_car.png'),
          boxes: [
            { layout: 'given-syllable', hintPart: '자', targetSyllable: '자' },
            { layout: 'given-syllable', hintPart: '동', targetSyllable: '동' },
            { layout: 'consonant-left', hintPart: 'ㅏ', targetSyllable: '차', answerToken: 'ㅊ' },
          ],
        },
      ],
    },
    step4: {
      playType: 'balloon-story-ch',
      instruction: '보기 글에서 ‘ㅊ’이 들어간 표현을 찾아 풍선에 써 보세요.',
      balloonImage: IMG('ch_balloons.jpg'),
      storyLines: [
        '갑자기 천둥 같은 고함이 터졌어.',
        '여러 개로 쪼개져 천천히 움직여.',
        '그림자도깨비는 채찍이 되어 산이의 발목을 낚아챘어.',
        '그림자도깨비는 “치잇” 콧방귀를 뀌며, 몸을 흔들어 댔어.',
      ],
      correctExpressions: ['천둥', '천천히', '채찍', '낚아챘어', '치잇'],
      choicesPool: ['천둥', '고함', '천천히', '채찍', '발목', '낚아챘어', '치잇', '콧방귀'],
    },
    step5: {
      instruction: '동시를 소리 내어 읽고 ‘ㅊ’을 찾아 클릭해 주세요.',
      title: '차처초추치',
      lines: [
        '창창창 청청청',
        '차처초추 내 창을 받아라!',
        '차처초추 내 창을 받아라!',
        '창도깨비 창을 던져',
        '그림자도깨비 쫓아냈지',
        '칭찬해 쿵쿵!',
        '잘했어 쿵쿵!',
      ],
      targetConsonants: ['ㅊ'],
      matchMode: 'any-position',
    },
  },

  // =========================================================================
  // 13. ㅇ (이응) — 알쏭달쏭 열쇠도깨비 (모험 13번째 / 가나다 8번째)
  // =========================================================================
  {
    adventureOrder: 13,
    ganadaOrder: 8,
    consonant: 'ㅇ',
    name: '이응',
    goblinTitle: '알쏭달쏭 열쇠도깨비 암호',
    goblinStorySummary: 'ㅇ 하나에 옷·입·용·알, ㅇ 두 개에 아이·여우·오이·얼음! 열쇠도깨비를 깨워요!',
    beadColor: '#a855f7',
    beadLabel: '무지개빛 ㅇ 소리구슬',
    strokeGuides: [
      { d: 'M 50 22 A 28 28 0 1 0 50.1 22', numX: 50, numY: 14 },
    ],
    step1Instruction: 'ㅇ을 순서에 따라 써 보세요.',
    step2Instruction: '글자를 따라 쓰며 소리 내어 읽어 보세요.',
    syllables10: ['아', '야', '어', '여', '오', '요', '우', '유', '으', '이'],
    step3: {
      mode: 'slot-fill',
      instruction: '그림에 알맞은 낱말을 완성해 보세요.',
      choicesPool: ['ㅇ', '우', '유', '오', '아', '이'],
      items: [
        {
          id: 'ng1',
          word: '우유',
          image: IMG('ng_milk.png'),
          boxes: [
            { layout: 'consonant-top', hintPart: 'ㅜ', targetSyllable: '우', answerToken: 'ㅇ' },
            { layout: 'consonant-top', hintPart: 'ㅠ', targetSyllable: '유', answerToken: 'ㅇ' },
          ],
        },
        {
          id: 'ng2',
          word: '오이',
          image: IMG('ng_cucumber.png'),
          boxes: [
            { layout: 'consonant-top', hintPart: 'ㅗ', targetSyllable: '오', answerToken: 'ㅇ' },
            { layout: 'consonant-left', hintPart: 'ㅣ', targetSyllable: '이', answerToken: 'ㅇ' },
          ],
        },
        {
          id: 'ng3',
          word: '아이',
          image: IMG('ng_kids.png'),
          boxes: [
            { layout: 'consonant-left', hintPart: 'ㅏ', targetSyllable: '아', answerToken: 'ㅇ' },
            { layout: 'consonant-left', hintPart: 'ㅣ', targetSyllable: '이', answerToken: 'ㅇ' },
          ],
        },
      ],
    },
    step4: {
      playType: 'picture-diary-ng',
      instruction: '알맞은 낱말을 클릭해 주세요. 일기가 완성됩니다.',
      diaryImage: IMG('ng_diary.png'),
      dateLabel: 'O월 O일  날씨: 구름 조금 ⛅',
      fullText: '오후에 엄마랑 치과에 갔다. 의자에 누워 입을 크게 벌렸다. 치료가 끝나고 입을 헹궜다. 오글오글 푸우! 잉잉, 치과는 무섭다.',
      segments: [
        { kind: 'choice', id: 'dg1', options: ['오후', '노후'], answer: '오후' },
        { kind: 'text', text: '에 엄마랑 치과에 갔다. ' },
        { kind: 'choice', id: 'dg2', options: ['으자', '의자'], answer: '의자' },
        { kind: 'text', text: '에 누워 ' },
        { kind: 'choice', id: 'dg3', options: ['입', '빕'], answer: '입' },
        { kind: 'text', text: '을 크게 벌렸다.\n치료가 끝나고 입을 헹궜다.\n' },
        { kind: 'choice', id: 'dg4', options: ['보글보글', '오글오글'], answer: '오글오글' },
        { kind: 'text', text: ' 푸우!\n' },
        { kind: 'choice', id: 'dg5', options: ['잉잉', '싱싱'], answer: '잉잉' },
        { kind: 'text', text: ', 치과는 무섭다.' },
      ],
    },
    step5: {
      instruction: '동시를 소리 내어 읽고 ‘ㅇ’을 찾아 클릭해 주세요.',
      title: '아어오우으이',
      lines: [
        '알쏭달쏭 ‘ㅇ’ 암호',
        'ㅇ 하나에',
        '옷, 입, 용, 알',
        'ㅇ 두 개에',
        '아이, 여우, 오이, 얼음',
        '으랏차차!',
        '드디어 살아난 열쇠도깨비',
      ],
      targetConsonants: ['ㅇ'],
      includeStandaloneJamo: true,
      matchMode: 'any-position',
    },
  },

  // =========================================================================
  // 14. ㅎ (히읗) — 호리병에 호로록 그림자도깨비 (모험 14번째 / 가나다 14번째)
  // =========================================================================
  {
    adventureOrder: 14,
    ganadaOrder: 14,
    consonant: 'ㅎ',
    name: '히읗',
    goblinTitle: '호리병 속에 호로록!',
    goblinStorySummary: '그림자도깨비를 호리병 속에 호로록 가두고 14개 소리구슬을 모두 완성해요!',
    beadColor: '#f43f5e',
    beadLabel: '황금빛 ㅎ 소리구슬',
    strokeGuides: [
      { d: 'M 38 16 L 62 16', numX: 30, numY: 15 },
      { d: 'M 18 32 L 82 32', numX: 14, numY: 31 },
      { d: 'M 50 44 A 18 18 0 1 0 50.1 44', numX: 25, numY: 62 },
    ],
    step1Instruction: 'ㅎ을 순서에 따라 써 보세요.',
    step2Instruction: '글자를 따라 쓰며 소리 내어 읽어 보세요.',
    syllables10: ['하', '햐', '허', '혀', '호', '효', '후', '휴', '흐', '히'],
    step3: {
      mode: 'tap-match',
      instruction: '그림과 어울리는 말을 차례대로 클릭해 주세요.',
      items: [
        { id: 'hm1', image: IMG('h_slurp.png'), word: '호로록' },
        { id: 'hm2', image: IMG('h_dash.png'), word: '후다닥' },
        { id: 'hm3', image: IMG('h_fly.png'), word: '훨훨' },
      ],
      wordOrder: ['후다닥', '훨훨', '호로록'],
    },
    step4: {
      playType: 'walled-maze-h',
      instruction: '‘ㅎ’이 들어가는 낱말을 차례대로 클릭해 주세요.',
      grid: [
        ['하마', '코끼리', '다리', '우유', '히히히'],
        ['호수', '해바라기', '소나기', '주루룩', '호랑이'],
        ['포도', '휴지', '허리', '나무', '효도'],
        ['기차', '바지', '혀', '호루라기', '하품'],
      ],
      correctPath: [
        [0, 0],
        [1, 0],
        [1, 1],
        [2, 1],
        [2, 2],
        [3, 2],
        [3, 3],
        [3, 4],
      ],
      openMoves: {
        '0,0': ['0,1', '1,0'],
        '0,1': ['0,0', '0,2'],
        '0,2': ['0,1', '1,2'],
        '0,3': ['0,4', '1,3'],
        '0,4': ['0,3'],
        '1,0': ['0,0', '1,1', '2,0'],
        '1,1': ['1,0', '2,1'],
        '1,2': ['0,2', '1,3'],
        '1,3': ['0,3', '1,2', '1,4'],
        '1,4': ['1,3', '2,4'],
        '2,0': ['1,0', '3,0'],
        '2,1': ['1,1', '2,2', '3,1'],
        '2,2': ['2,1', '2,3', '3,2'],
        '2,3': ['2,2', '3,3'],
        '2,4': ['1,4'],
        '3,0': ['2,0', '3,1'],
        '3,1': ['2,1', '3,0'],
        '3,2': ['2,2', '3,3'],
        '3,3': ['2,3', '3,2', '3,4'],
        '3,4': ['3,3'],
      },
    },
    step5: {
      instruction: '동시를 소리 내어 읽고 ‘ㅎ’을 찾아 클릭해 주세요.',
      title: '하허호후흐히',
      lines: [
        '휘익휘익 흉내도깨비',
        '활활 불도깨비',
        '호리병 속에 호로록',
        '제 꾀에 넘어간 그림자도깨비',
        '도깨비들의 환호 소리',
        '하허호후흐히',
      ],
      targetConsonants: ['ㅎ'],
      matchMode: 'any-position',
    },
  },
];
