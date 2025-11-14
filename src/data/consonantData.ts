import { Activity, ActivityType } from '../types/consonantTypes';

export const workbookActivities: Activity[] = [
  {
    page: 0,
    title: '목차',
    activityNumber: 0,
    type: ActivityType.TableOfContents,
    groups: [
      {
        title: 'ㅁ받침 활동',
        items: [
          { title: '낱말 찾기', page: 2 },
          { title: '받침 오리기', page: 3 },
          { title: '공통 글자 찾기', page: 4 },
          { title: '문장 만들기', page: 5 },
        ],
      },
       {
        title: 'ㄱ 받침 활동',
        items: [
          { title: '낱말 찾기', page: 14 },
          { title: '길 찾기', page: 15 },
          { title: '공통 글자 찾기', page: 16 },
          { title: '문장 완성하기', page: 17 },
        ],
      },
      {
        title: 'ㄴ 받침 활동',
        items: [
          { title: '낱말 찾기', page: 18 },
          { title: '낱말-그림 쓰기', page: 19 },
          { title: '공통 글자 찾기', page: 20 },
          { title: '구름 끌어다 놓기', page: 21 },
        ],
      },
      {
        title: 'ㄹ 받침 활동',
        items: [
          { title: '낱말 찾기', page: 22 },
          { title: '낱말-그림 쓰기', page: 23 },
          { title: '공통 글자 찾기', page: 24 },
          { title: '구름 끌어다 놓기', page: 25 },
        ],
      },
      {
        title: 'ㄷ 받침 활동',
        items: [
          { title: '낱말 찾기', page: 26 },
          { title: '그림 연결하기', page: 27 },
          { title: '공통 글자 찾기', page: 28 },
          { title: '문장 만들기', page: 29 },
        ],
      },
      {
        title: 'ㅂ 받침 가족 활동',
        items: [
          { title: '낱말 찾기', page: 30 },
          { title: '그림 연결하기', page: 31 },
          { title: '문장 완성하기', page: 32 },
          { title: '맞는 표현 고르기', page: 33 },
        ],
      },
      {
        title: 'ㄱ 받침 가족 활동',
        items: [
          { title: '낱말 찾기', page: 34 },
          { title: '받침 채우기', page: 35 },
          { title: '알맞은 글자 고르기', page: 36 },
          { title: '문장 만들기', page: 37 },
        ],
      },
      {
        title: 'ㄷ 받침 가족 활동',
        items: [
          { title: '낱말 찾기', page: 39 },
          { title: '사다리 타기', page: 40 },
          { title: '그림 보고 글자 고르기', page: 41 },
          { title: '문장 만들기', page: 42 },
        ],
      },
    ],
  },
{
    page: 2,
    title: 'ㅁ 받침 활동',
    activityNumber: 1,
    type: ActivityType.WordCloudSearch,
    question: 'ㅁ 받침 낱말을 찾아요.',
    words: [
      { text: '황금', isTarget: true },
      { text: '난쟁이', isTarget: false },
      { text: '대답', isTarget: false },
      { text: '맹꽁이', isTarget: false },
      { text: '조심', isTarget: true },
      { text: '마음', isTarget: true },
      { text: '솜사탕', isTarget: true },
      { text: '방법', isTarget: false },
      { text: '순간', isTarget: false },
      { text: '바람', isTarget: true },
      { text: '참나무', isTarget: true },
    ],
  },
  {
    page: 3,
    title: 'ㅁ 받침 활동',
    activityNumber: 2,
    type: ActivityType.GridPath,
    question: '받침이 있고 없고, 뜻이 달라져요.',
    instructions: {
        title: '받침 달리기',
        description: '"ㅁ" 받침 글자가 들어간 낱말로만 이동하여 돌아오면 성공'
    },
    grid: [
        ['나', '사람', '사라', '소', '솜', '햄', '해'],
        ['남', null, null, null, null, null, '배'],
        ['출발', null, null, null, null, null, '뱀'],
        ['몸', '새', '샘', '가자', '감자', '참', '차'],
    ],
    start: [2, 0],
    correctPath: [ [1,0], [0,1], [0,4], [0,5], [2,6], [3,5], [3,4], [3,2] , [3,0] ]
  },
  {
    page: 4,
    title: 'ㅁ 받침 활동',
    activityNumber: 3,
    type: ActivityType.FillInTheBlanks,
    question: '빈 칸에 공통으로 들어갈 글자를 쓰고, 그림으로 그려보세요.',
    sentences: [
      '___집이 크니 ___무게가 많이 나간다.',
      '___살이 났다. 온 ___이 아프다.',
      '___부림 치지말고 ___가짐을 바르게 하렴.'
    ],
    correctAnswer: '몸',
  },
  {
    page: 5,
    title: 'ㅁ 받침 활동',
    activityNumber: 4,
    type: ActivityType.SentenceBuilder,
    question: '다음 낱말을 사용하여 한 문장으로 말하거나 써 보세요.',
    words: ['김', '밤', '감자', '김치', '감', '곰국', '햄'],
  },
  {
    page: 6,
    title: 'ㅂ 받침 활동',
    activityNumber: 1,
    type: ActivityType.WordCloudSearch,
    question: 'ㅂ 받침 낱말을 찾아요.',
    words: [
        { text: '입구', isTarget: true },
        { text: '컵', isTarget: true },
        { text: '갑자기', isTarget: true },
        { text: '가방', isTarget: false },
        { text: '집게', isTarget: true },
        { text: '굽이굽이', isTarget: true },
        { text: '모습', isTarget: true },
        { text: '감자', isTarget: false },
        { text: '손잡이', isTarget: true },
        { text: '어둡다', isTarget: true },
    ],
  },
  {
    page: 7,
    title: 'ㅂ 받침 활동',
    activityNumber: 2,
    type: ActivityType.ConnectPairs,
    question: '낱말과 어울리는 그림을 찾아 연결해보세요.',
  pairs: [
    { word: '집게', image: './images/b_jipgae.png', id: 1 },
    { word: '춥다', image: './images/b_chupda.png', id: 2 },
    { word: '잡다', image: './images/b_japda.png', id: 3 },
    { word: '자다', image: './images/b_jada.png', id: 4 },
    { word: '추다', image: './images/b_chuda.png', id: 5 },
    { word: '지게', image: './images/b_jigae.png', id: 6 },
  ],
  },
  {
    page: 8,
    title: 'ㅂ 받침 활동',
    activityNumber: 3,
    type: ActivityType.RadialFillInTheBlanks,
    question: '공통으로 들어갈 숨은 글자를 찾아 가운데 ___ 안에 써 보세요.',
    words: [ { text: '주걱', blankPosition: 'before' }, { text: '상', blankPosition: 'before' }, { text: '보리', blankPosition: 'after' }, { text: '김', blankPosition: 'after' }, { text: '개', blankPosition: 'after' }, { text: '솥', blankPosition: 'after' }, { text: '그릇', blankPosition: 'before' }, { text: '콩', blankPosition: 'after' }, { text: '찰', blankPosition: 'after' }, { text: '된', blankPosition: 'after' } ],
    correctAnswer: '밥'
  },
  {
    page: 9,
    title: 'ㅂ 받침 활동',
    activityNumber: 4,
    type: ActivityType.SentenceBuilder,
    question: '밥이 들어가는 문장을 만들어 써 보세요.',
    words: [
      { 
        word: '밥', 
        example: '(밥)을 먹으니 배가 든든하다.',
        placeholder: '나는 밥곡이 좋다.\n쌀이 익으면 밥이 된다.\n누구나 밥을 먹어야 살 수 있다.'
      }
    ],
  },
  {
    page: 10,
    title: 'ㅇ 받침 활동',
    activityNumber: 1,
    type: ActivityType.WordCloudSearch,
    question: 'ㅇ 받침 낱말을 찾아요.',
    words: [
      { text: '보슬비', isTarget: false },
      { text: '동굴', isTarget: true },
      { text: '지렁이', isTarget: true },
      { text: '여행', isTarget: true },
      { text: '입구', isTarget: false},
      { text: '몽글몽글', isTarget: true },
      { text: '벌레', isTarget: false },
      { text: '쿵쾅쿵쾅', isTarget: true },
      { text: '구멍', isTarget: true },
      { text: '뽀송뽀송', isTarget: true },
    ],
  },
  {
    page: 11,
    title: 'ㅇ 받침 활동',
    activityNumber: 2,
    type: ActivityType.WordImageGrid,
    question: '받침이 있고 없고, 뜻이 달라져요. 그림에 맞는 낱말을 찾아 써보세요.',
    example: '차 창 코 콩 토 통 혀 형',
  items: [
    { wordWithout: '토', wordWith: '통', imageWithout: './images/o_to.png', imageWith: './images/o_tong.png' },
    { wordWithout: '혀', wordWith: '형', imageWithout: './images/o_hyo.png', imageWith: './images/o_hyong.png' },
    { wordWithout: '차', wordWith: '창', imageWithout: './images/o_char.png', imageWith: './images/o_chang.png' },
    { wordWithout: '코', wordWith: '콩', imageWithout: './images/o_ko.png', imageWith: './images/o_kong.png' },
  ]
  },
  {
    page: 12,
    title: 'ㅇ 받침 활동',
    activityNumber: 3,
    type: ActivityType.FillInTheBlanks,
    question: '빈 칸에 공통으로 들어갈 글자를 쓰고, 그림으로 그려보세요.',
    sentences: [
      '나는 친구들이 놀릴까 봐 학교에선 ___을 싸기 싫다.',
      '그런데 오늘 아침에 아무리 ___을 누려고 해도 ___이 나오지 않았다.',
      '살살 배가 아프다. 어떡하지? 그때 나래가 \"선생님. 저 ___마려워요.\" 하면서 화장실로 달려갔다. 나도 가고 싶다.'
    ],
    correctAnswer: '똥',
  },
  {
    page: 13,
    title: 'ㅇ 받침 활동',
    activityNumber: 4,
    type: ActivityType.SentenceBuilder,
    question: '용기가 들어가는 문장을 만들어 써 보세요.',
    words: [
      { 
        word: '용기', 
        example: '미안하다고 사과하려면 (용기)를 내야 한다.',
        placeholder: '나는 용기를 내어 큰 목소리로 발표를 했다.'
      }
    ],
  },
  {
    page: 14,
    title: 'ㄱ 받침 활동',
    activityNumber: 1,
    type: ActivityType.WordCloudSearch,
    question: 'ㄱ 받침 낱말을 찾아요.',
    words: [
        { text: '미역국', isTarget: true },
        { text: '도둑', isTarget: true },
        { text: '벽', isTarget: true },
        { text: '동굴', isTarget: false },
        { text: '사각사각', isTarget: false },
        { text: '콩닥콩닥', isTarget: true },
        { text: '슥삭슥삭', isTarget: true },
        { text: '식탁', isTarget: true },
        { text: '옥수수', isTarget: true },
        { text: '가방', isTarget: false },
    ],
  },
  {
    page: 15,
    title: 'ㄱ 받침 활동',
    activityNumber: 2,
    type: ActivityType.PathSelector,
    question: '글자에 맞는 그림을 선택해보세요.',
  background: './images/k_background.png',
  steps: [
    { prompt: '색', choices: [{ image: './images/k_saek.png', isCorrect: true }, { image: './images/k_sae.png', isCorrect: false }] },
    { prompt: '벼', choices: [{ image: './images/k_byok.png', isCorrect: false }, { image: './images/k_byo.png', isCorrect: true } ] },
    { prompt: '약국', choices: [{ image: './images/k_yagoo.png', isCorrect: false },{ image: './images/k_yakguk.png', isCorrect: true } ] },
    { prompt: '악기', choices: [{ image: './images/k_akki.png', isCorrect: true }, { image: './images/k_aki.png', isCorrect: false }] },
  ]
  },
  {
    page: 16,
    title: 'ㄱ 받침 활동',
    activityNumber: 3,
    type: ActivityType.FillInTheBlanks,
    question: '빈 칸에 공통으로 들어갈 글자를 쓰고, 그림으로 그려보세요.',
    sentences: [
      '도서실에서는 작은 ___소리로 말하기',
      '나는 ___청이 크다.',
      '반짝반짝 ___걸이가 예쁘다.',
      '컥컥, ___구멍에 가시가 걸린 것 같다.',
      '___도리를 하니 따뜻하다.',
      '양말 ___이 늘어났다.',
    ],
    correctAnswer: '목',
  },
  {
      page: 17,
      title: 'ㄱ 받침 활동',
      activityNumber: 4,
      type: ActivityType.MultipleChoiceSentence,
      question: '문장에 맞는 글자를 아래 보기에서 찾아보세요.',
      items: [
          { sentence: '새끼 손가락 걸고 꼭꼭 ___ ___해요.', choices: ['약', '속', '꼭', '해'], correctAnswer: ['약', '속'] },
          { sentence: '사랑하는 친구의 생일을 ___ ___합니다.', choices: ['추', '하', '축', '생'], correctAnswer: ['축', '하'] },
          { sentence: '후루룩 짭짭 맛있는 ___ ___', choices: ['국', '밥', '물', '면'], correctAnswer: ['국', '물'] },
      ]
  },
  {
    page: 18,
    title: 'ㄴ 받침 활동',
    activityNumber: 1,
    type: ActivityType.WordCloudSearch,
    question: 'ㄴ 받침 낱말을 찾아요.',
    words: [
        { text: '초인종', isTarget: true },
        { text: '괜찮다', isTarget: true },
        { text: '난쟁이', isTarget: true },
        { text: '은혜', isTarget: true },
        { text: '변신', isTarget: true },
        { text: '거인', isTarget: true },
        { text: '금빛', isTarget: false },
        { text: '갑자기', isTarget: false },
        { text: '마술사', isTarget: false },
        { text: '사탕', isTarget: false },
    ],
  },
  {
    page: 19,
    title: 'ㄴ 받침 활동',
    activityNumber: 2,
    type: ActivityType.WordImageGrid,
    question: '받침이 있고 없고, 뜻이 달라져요. 낱말과 어울리는 그림은 무엇일까요?',
    example: '거물 건물 기부 기분 나리 난리 이사 인사',
  items: [
    { wordWithout: '인사', wordWith: '이사', imageWithout: './images/n_insa.png', imageWith: './images/n_isa.png' },
    { wordWithout: '기부', wordWith: '기분', imageWithout: './images/n_gibu.png', imageWith: './images/n_gibun.png' },
    { wordWithout: '나리', wordWith: '난리', imageWithout: './images/n_nari.png', imageWith: './images/n_nanri.png' },
    { wordWithout: '건물', wordWith: '거물', imageWithout: './images/n_geonmul.png', imageWith: './images/n_geomul.png' },
  ]
  },
  {
    page: 20,
    title: 'ㄴ 받침 활동',
    activityNumber: 3,
    type: ActivityType.FillInTheBlanks,
    question: '빈 칸에 공통으로 들어갈 글자를 쓰고, 그림으로 그려보세요.',
    sentences: [
      '___물이 흐르다             ___짓을 하다',
      '___을 뜨다 속              ___썹이 길다',
      '___알을 굴리다             ___을 뜨다',
      '게 ___ 감추듯 사라지다     소의 커다란___망울'
    ],
    correctAnswer: '눈',
  },
  {
      page: 21,
      title: 'ㄴ 받침 활동',
      activityNumber: 4,
      type: ActivityType.CloudDragAndDrop,
      question: '아래 문장의 구름 뒤에 숨어 있는 말은 무엇일까요?',
      items: [
        {
          id: '1',
          sentence: ['입학식 전날 가슴이 ', ' 했다.'],
          answer: '두근두근',
          cloudShape: 'cloud1',
        },
        {
          id: '2',
          sentence: ['밤하늘의 별이 ', ' 빛났다.'],
          answer: '반짝반짝',
          cloudShape: 'cloud2',
        },
        {
          id: '3',
          sentence: ['뒤꿈치를 들고 ', ' 걸어봐.'],
          answer: '사뿐사뿐',
          cloudShape: 'cloud3',
        },
      ],
  },
  {
      page: 22,
      title: 'ㄹ 받침 활동',
      activityNumber: 1,
      type: ActivityType.WordCloudSearch,
      question: 'ㄹ 받침 낱말을 찾아요.',
      words: [
          { text: '괴물', isTarget: true },
          { text: '대답', isTarget: false },
          { text: '구덩이', isTarget: false },
          { text: '등껍질', isTarget: true },
          { text: '꽃밭', isTarget: false },
          { text: '언덕', isTarget: false },
          { text: '울퉁불퉁', isTarget: true },
          { text: '살금살금', isTarget: true },
          { text: '오솔길', isTarget: true },
          { text: '구불구불', isTarget: true },
      ]
  },
  {
      page: 23,
      title: 'ㄹ 받침 활동',
      activityNumber: 2,
      type: ActivityType.WordImageGrid,
      question: '받침이 있고 없고, 뜻이 달라져요. 낱말과 어울리는 그림은 무엇일까요?',
      example: '도 돌 다리기 달리기 따기 딸기 벼 별',
    items: [
      { wordWithout: '따기', wordWith: '딸기', imageWithout: './images/r_ddagi.png', imageWith: './images/r_ddalgi.png' },
      { wordWithout: '벼', wordWith: '별', imageWithout: './images/r_byo.png', imageWith: './images/r_byol.png' },
      { wordWithout: '도', wordWith: '돌', imageWithout: './images/r_do.png', imageWith: './images/r_dol.png' },
      { wordWithout: '다리기', wordWith: '달리기', imageWithout: './images/r_darigi.png', imageWith: './images/r_daligi.png' },
    ]
  },
  {
    page: 24,
    title: 'ㄹ 받침 활동',
    activityNumber: 3,
    type: ActivityType.FillInTheBlanks,
    question: '빈 칸에 공통으로 들어갈 글자를 쓰고, 그림으로 그려보세요.',
    sentences: [
      '손___                     ___바닥',
      '___가락                                마당___',
      '오리___             왼___               집게___',
      '___목                      ___자국'
    ],
    correctAnswer: '발',
  },
  {
      page: 25,
      title: 'ㄹ 받침 활동',
      activityNumber: 4,
      type: ActivityType.CloudDragAndDrop,
      question: '아래 문장의 구름 뒤에 숨어 있는 말은 무엇일까요?',
      items: [
        {
          id: '1',
          sentence: ['우는 아기를 ', ' 기 쉽지 않다.'],
          answer: '달래',
          cloudShape: 'cloud3',
        },
        {
          id: '2',
          sentence: ['형은 종종 내 별명으로 나를 놀', '다.'],
          answer: '린',
          cloudShape: 'cloud2',
        },
        {
          id: '3',
          sentence: ['휴일에는 늦게까지 ', '지게 잠자고 싶다.'],
          answer: '늘어',
          cloudShape: 'cloud1',
        },
      ],
  },
  {
      page: 26,
      title: 'ㄷ 받침 활동',
      activityNumber: 1,
      type: ActivityType.WordCloudSearch,
      question: 'ㄷ 받침 낱말을 찾아요.',
      words: [
          { text: '편지', isTarget: false },
          { text: '믿다', isTarget: true },
          { text: '돋보기', isTarget: false },
          { text: '곧', isTarget: true },
          { text: '걷다', isTarget: true },
          { text: '열쇠', isTarget: false },
          { text: '뜯다', isTarget: true },
          { text: '묻다', isTarget: true },
          { text: '박사', isTarget: false },
          { text: '얻다', isTarget: true },
      ]
  },
  {
    page: 27,
    title: 'ㄷ 받침 활동',
    activityNumber: 2,
    type: ActivityType.ConnectPairs,
    question: '낱말과 어울리는 그림을 찾아 연결해보세요.',
  pairs: [
    { word: '시다', image: './images/d_sida.png', id: 1 },
    { word: '싣다', image: './images/d_sitda.png', id: 2 },
    { word: '뜨다', image: './images/d_ttuda.png', id: 3 },
    { word: '뜯다', image: './images/d_ttutda.png', id: 4 },
  ],
  },
  {
    page: 28,
   title: 'ㄷ 받침 활동',
    activityNumber: 3,
    type: ActivityType.FillInTheBlanks,
    question: '빈 칸에 공통으로 들어갈 글자를 쓰고, 그림으로 그려보세요.',
    sentences: [
      '친구와 편지를 주고 ___다.',
      '위인을 본___다.',
      '나의 실력을 인정___다.',
      '빌려주었던 것을 돌려___다.'
    ],
    correctAnswer: '받',
  },
  {
    page: 29,
    title: 'ㄷ 받침 활동',
    activityNumber: 4,
    type: ActivityType.SentenceBuilder,
    question: '한 문장으로 말해요.',
    words: [
      { 
        word: '돋보기/ 받아쓰기', 
        example: '곧장 : 집으로 곧장 가렴',
        placeholder: '돋보기 \n받아쓰기'
      }
    ],
  },
  {
    page: 30,
    title: 'ㅂ 받침 가족 활동',
    activityNumber: 1,
    type: ActivityType.WordCloudSearch,
    question: 'ㅂ 받침 가족 낱말을 찾아요.',
    words: [
        { text: '잎', isTarget: true },
        { text: '놀이', isTarget: false },
        { text: '밥', isTarget: true },
        { text: '방법', isTarget: true },
        { text: '늪', isTarget: true },
        { text: '꽃', isTarget: false },
        { text: '나뭇잎', isTarget: true },
        { text: '국수', isTarget: false },
        { text: '입구', isTarget: true },
        { text: '단풍', isTarget: false },
    ],
  },
  {
    page: 31,
    title: 'ㅂ 받침 가족 활동',
    activityNumber: 2,
    type: ActivityType.ConnectPairs,
    question: '낱말과 어울리는 그림을 찾아 연결해보세요.',
    groups: [
      [
        { word: '이', image: './images/bf_yi.png', id: 1 },
        { word: '입', image: './images/bf_lip.png', id: 2 },
        { word: '잎', image: './images/bf_leap.png', id: 3 },
      ],
      [
        { word: '지다', image: './images/bf_jida.png', id: 4 },
        { word: '집다', image: './images/bf_jifda.png', id: 5 },
        { word: '짚다', image: './images/bf_jipda.png', id: 6 },
      ],
      [
        { word: '집', image: './images/bf_jif.png', id: 7 },
        { word: '짚', image: './images/bf_gip.png', id: 8 },
      ],
      [
        { word: '덥다', image: './images/bf_dupda.png', id: 9 },
        { word: '덮다', image: './images/bf_dufda.png', id: 10 },
      ]
    ],
  },
  {
    page: 32,
    title: 'ㅂ 받침 가족 활동',
    activityNumber: 3,
    type: ActivityType.MultipleChoiceSentence,
    question: '다음 빈칸에 들어갈 말을 선택하세요.',
    items: [
      {
        sentence: '___학, ___맛, ___다',
        choices: ['입', '잎'],
        correctAnswer: ['입'],
      },
      {
        sentence: '___이',
        choices: ['깊', '깁'],
        correctAnswer: ['깊'],
      },
      {
        sentence: '___개',
        choices: ['덥', '덮'],
        correctAnswer: ['덮'],
      },
    ],
  },
  {
    page: 33,
    title: 'ㅂ 받침 가족 활동',
    activityNumber: 4,
    type: ActivityType.MultipleChoiceSentence,
    question: '맞는 표현을 선택 하세요.',
    items: [
        { sentence: '구덩이에서 빠져나갈 ( )을 찾았다.', choices: ['방법을', '방범을'], correctAnswer: ['방법을'] },
        { sentence: '내 ( )의 친구들은 나보다 키가 작다.', choices: ['앞', '압'], correctAnswer: ['앞'] },
        { sentence: '강물이 ( ) 위험하다.', choices: ['깁어서', '깊어서'], correctAnswer: ['깊어서'] },
    ]
  },
  {
    page: 34,
    title: 'ㄱ 받침 가족 활동',
    activityNumber: 1,
    type: ActivityType.WordCloudSearch,
    question: 'ㄱ 받침 가족 낱말을 찾아요.',
    words: [
      { text: '먹다', isTarget: true },
      { text: '창밖', isTarget: true },
      { text: '깎다', isTarget: true },
      { text: '입구', isTarget: false },
      { text: '낚싯대', isTarget: true },
      { text: '부엌', isTarget: true },
      { text: '겪은 일', isTarget: true },
      { text: '꽃잎', isTarget: false },
      { text: '떡볶이', isTarget: true },
    ]
  },
  {
    page: 35,
    title: 'ㄱ 받침 가족 활동',
    activityNumber: 2,
    type: ActivityType.FillTheBlankInSyllable,
    question: '빈 칸에 알맞은 받침을 선택하여 낱말을 완성해보세요.',
    choices: ['ㄱ', 'ㄲ'],
    items: [
      {
        id: 1,
        left: { image: './../../public/images/kf_hagyo.png', word: '하교' },
        right: { image: './images/kf_hakgyo.png', wordParts: ['하', '교'], correctAnswer: 'ㄱ' },
      },
      {
        id: 2,
        left: { image: './images/kf_made.png', word: '마대' },
        right: { image: './images/kf_magde.png', wordParts: ['마', '대'], correctAnswer: 'ㄱ' },
      },
      {
        id: 3,
        left: { image: './images/kf_boda.png', word: '보다' },
        right: { image: './images/kf_bogda.png', wordParts: ['보', '다'], correctAnswer: 'ㄲ' },
      },
      {
        id: 4,
        left: { image: './images/kf_kkada.png', word: '까다' },
        right: { image: './images/kf_kkagda.png', wordParts: ['까', '다'], correctAnswer: 'ㄲ' },
      },
    ],
  },
  {
    page: 36,
    title: 'ㄱ 받침 가족 활동',
    activityNumber: 3,
    type: ActivityType.MultipleChoiceSentence,
    question: '알맞은 글자에 O 표 하세요.',
    items: [
      { sentence: '( )에는 어떤 물건이 있을까?', choices: ['부얶', '부억', '부엌'], correctAnswer: ['부엌'] },
      { sentence: '( )도 보이고', choices: ['식탁', '식탂', '식탘'], correctAnswer: ['식탁'] },
      { sentence: '( )도 보이네?', choices: ['국자', '굮자', '궄자'], correctAnswer: ['국자'] },
      { sentence: '( )으로 바람이 불어와요.', choices: ['창박', '창밖', '창밬'], correctAnswer: ['창밖'] },
      { sentence: '( ) 중 어떤 음식을 좋아하니?', choices: ['복음밥', '볶음밥', '보끔밥'], correctAnswer: ['볶음밥'] },
    ],
  },
  {
    page: 37,
    title: 'ㄱ 받침 가족 활동',
    activityNumber: 4,
    type: ActivityType.SentenceBuilder,
    question: '한 문장으로 말해요.',
    words: [
      { 
        word: '볶음 / 해 질 녘 / 낚싯대', 
        example: '떡뽂이: 나는 떡볶이를 좋아한다.',
        placeholder: '볶음: 나는 어제 멸치볶음을 먹었다. \n 해 질 녘 : 해 질 녘에 산책을 나갔다. \n 낚싯대: 아빠는 낚싯대를 챙겨 낚시를 갔다.'
      }
    ],
  },
  {
    page: 39,
    title: 'ㄷ 받침 가족 활동',
    activityNumber: 1,
    type: ActivityType.WordCloudSearch,
    question: 'ㄷ 받침 가족 낱말을 찾아요.',
    words: [
      { text: '다섯', isTarget: true },
      { text: '웃다', isTarget: true },
      { text: '곰', isTarget: false },
      { text: '깎다', isTarget: false },
      { text: '빛', isTarget: true },
      { text: '꽃', isTarget: true },
      { text: '낚시', isTarget: true },
      { text: '밑', isTarget: true },
      { text: '컵', isTarget: false },
      { text: '옆', isTarget: false },
    ],
  },
  {
    page: 40,
    title: 'ㄷ 받침 가족 활동',
    activityNumber: 2,
    type: ActivityType.MatchingLadder,
    question: '같은 소리가 나는 낱말을 함게 클릭해 보세요.',
    topRow: ['갔다', '빛', '밭', '잊다', '낮', '젖'],
    bottomRow: ['낫', '받', '빗', '같다', '젓', '있다'],
    matches: {
        '갔다': '같다',
        '빛': '빗',
        '밭': '받',
        '잊다': '있다',
        '낮': '낫',
        '젖': '젓',
    }
  },
  {
    page: 41,
    title: 'ㄷ 받침 가족 활동',
    activityNumber: 3,
    type: ActivityType.MultipleChoiceImage,
    question: '그림에 어울리는 글자를 고르세요.',
    items: [
    { 
      image: './images/df_rain.png', 
            choices: ['빛소리', '빗소리'], 
            correctAnswer: ['빗소리'],
            rightText: '가 난다.'
        },
        { 
      image: './images/df_dog.png', 
            choices: ['짖는다', '짓는다'], 
            correctAnswer: ['짖는다'],
            leftText: '강아지가 큰 소리로'
        },
        { 
      image: './images/df_bitda.png', 
            choices: ['빛다', '빗다'], 
            correctAnswer: ['빗다'],
            leftText: '머리카락을'
        },
        { 
      image: './images/df_biti.png', 
            choices: ['빚이', '빛이'], 
            correctAnswer: ['빛이'],
            rightText: '나는 것 같다.'
        },
    ]
  },
  {
    page: 42,
    title: 'ㄷ 받침 가족 활동',
    activityNumber: 4,
    type: ActivityType.SentenceBuilder,
    question: '빛을 나타내는 말을 써 보세요.',
    words: [
      {
        word:'빛 / 달빛 / 별빛 / 풀빛 / 눈빛 / 빛깔 / 빛나다',
        placeholder: '빛: 나는 빛을 좋아한다.\n달빛: 달빛이 밝다.\n별빛: 별빛이 반짝인다.\n풀빛: 풀빛이 곱다.\n눈빛: 눈빛이 맑다.\n빛깔: 꽃의 빛깔이 곱다.\n빛나다: 네가 빛난다.'
      }
    ],
  },

];
