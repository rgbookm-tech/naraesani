import type { WorksheetData } from '../types/vowelTypes';

export const worksheetData: WorksheetData[] = [
  {
    vowel: 'ㅏ',
    pronunciation: 'a',
    activities: [
      {
        type: 'body-pose',
        title: "몸으로 'ㅏ'를 표현해 보세요.",
        instruction: '그림을 보고 따라 해보세요!',
        data: {
          image: './images/sani_ah.png',
        },
      },
      {
        type: 'stroke-order',
        title: 'ㅏ 쓰는 순서 배우기',
        instruction: '조각을 옮겨서 글자를 완성해보세요.',
        data: {},
      },
      {
        type: 'drawing',
        title: 'ㅏ 따라 쓰기',
        instruction: '네모 칸에 맞춰 글자를 예쁘게 써보세요.',
        data: {},
      },
      {
        type: 'word-highlight',
        title: "'ㅏ' 낱말 찾기",
        instruction: "'ㅏ'가 들어가는 낱말을 클릭하세요.",
        data: {
          type: 'findVowel',
          theme: 'grid',
          words: [
            { word: '야구', isCorrect: false }, { word: '사자', isCorrect: true }, { word: '지붕', isCorrect: false }, { word: '이웃', isCorrect: false }, { word: '우주', isCorrect: false },
            { word: '태양', isCorrect: false }, { word: '나리', isCorrect: true }, { word: '여우', isCorrect: false }, { word: '이리', isCorrect: false }, { word: '수영', isCorrect: false },
            { word: '오소리', isCorrect: false }, { word: '아기', isCorrect: true }, { word: '엄마', isCorrect: false }, { word: '안개', isCorrect: true }, { word: '태권도', isCorrect: false },
            { word: '친구', isCorrect: false }, { word: '가방', isCorrect: false }, { word: '이름', isCorrect: false }, { word: '고양이', isCorrect: false }, { word: '구두', isCorrect: false },
            { word: '언니', isCorrect: false }, { word: '아빠', isCorrect: true }, { word: '고기', isCorrect: false }, { word: '오이', isCorrect: false }, { word: '잉어', isCorrect: false },
          ],
        },
      },
      {
        type: 'word-highlight',
        title: 'ㅏ 소리 찾기',
        instruction: "'ㅏ' 소리가 들어간 낱말을 찾아보세요!",
        data: {
          type: 'findVowel',
          theme: 'leaves',
          words: [
            { word: '사과' }, { word: '나무' }, { word: '다리' },
            { word: '오이' }, { word: '아기' }, { word: '거미' },
            { word: '바지' }, { word: '고구마' }, { word: '우유' },
          ],
        },
      },
      {
        type: 'vowel-input',
        title: "'ㅏ' 들어간 낱말 만들기",
        instruction: "예시문을 보고 'ㅏ'가 들어간 낱말을 만들어보세요.",
        data: {
          exampleSentence: '아기가 나비를 따라가요.',
        },
      },
    ],
  },
  {
    vowel: 'ㅑ',
    pronunciation: 'ya',
    activities: [
      {
        type: 'body-pose',
        title: "몸으로 'ㅑ'를 표현해 보세요.",
        instruction: '그림을 보고 따라 해보세요!',
        data: {
          image: './images/sani_ya.png',
        },
      },
      { type: 'stroke-order', title: 'ㅑ 쓰는 순서 배우기', instruction: '조각을 옮겨서 글자를 완성해보세요.', data: {} },
      { type: 'drawing', title: 'ㅑ 따라 쓰기', instruction: '네모 칸에 맞춰 글자를 예쁘게 써보세요.', data: {} },
      {
        type: 'word-image-match',
        title: '낱말과 그림 잇기',
        instruction: '알맞은 낱말과 그림을 선으로 이어보세요.',
        data: {
          pairs: [
            { id: 1, word: '야구', image: './images/yagu.png' },
            { id: 2, word: '고양이', image: './images/cat.png' },
            { id: 3, word: '야자수', image: './images/yajasu.png' },
            { id: 4, word: '야채', image: './images/yachae.png' },
          ],
        },
      },
      {
        type: 'vowel-input',
        title: "'ㅑ' 들어간 낱말 만들기",
        instruction: "예시문을 보고 'ㅑ'가 들어간 낱말을 만들어보세요.",
        data: {
          exampleSentence: '양이가 이야기를 좋아해요.',
        },
      },
      {
        type: 'maze',
        title: '미로찾기',
        instruction: "낱말을 따라 'ㅑ'가 들어간 길을 찾아가세요.",
        data: {
          junctions: [
            { id: 0, choices: [ { word: '야구', leadsTo: 1 }, { word: '엄마', leadsTo: 'deadend-1' },], },
            { id: 1, choices: [ { word: '우유', leadsTo: 'deadend-1' }, { word: '이야기', leadsTo: 2 }, ], },
            { id: 2, choices: [ { word: '학교', leadsTo: 'deadend-2' }, { word: '약국', leadsTo: 3 }, ], },
            { id: 3, choices: [ { word: '양치', leadsTo: 4 }, { word: '소리', leadsTo: 'deadend-3'}], },
            { id: 4, choices: [ { word: '노래', leadsTo: 'deadend-4' }, { word: '야채', leadsTo: 'finish' }, ], },
          ],
        },
      },
    ],
  },
  {
    vowel: 'ㅓ',
    pronunciation: 'eo',
    activities: [
       {
        type: 'body-pose',
        title: "몸으로 'ㅓ'를 표현해 보세요.",
        instruction: '그림을 보고 따라 해보세요!',
        data: {
          image: './images/sani_eo.png',
        },
      },
       { type: 'stroke-order', title: 'ㅓ 쓰는 순서 배우기', instruction: '조각을 옮겨서 글자를 완성해보세요.', data: {} },
       { type: 'drawing', title: 'ㅓ 따라 쓰기', instruction: '네모 칸에 맞춰 글자를 예쁘게 써보세요.', data: {} },
       {
        type: 'vowel-input',
        title: "'ㅓ' 들어간 낱말 만들기",
        instruction: "예시문을 보고 'ㅓ'가 들어간 낱말을 만들어보세요.",
        data: {
          exampleSentence: '너구리가 저기 서 있어요.',
        },
      },
      {
        type: 'word-highlight',
        title: 'ㅓ 소리 찾기',
        instruction: "'ㅓ' 소리가 들어간 낱말을 찾아보세요!",
        data: {
          type: 'findVowel',
          theme: 'leaves',
          words: [
            { word: '어머니' }, { word: '버스' }, { word: '거미' },
            { word: '사과' }, { word: '바나나' }, { word: '너구리' },
            { word: '어깨' }, { word: '저고리' }, { word: '오이' },
          ],
        },
      },
      {
        type: 'maze',
        title: '미로찾기',
        instruction: "낱말을 따라 'ㅓ'가 들어간 길을 찾아가세요.",
        data: {
          junctions: [
            { id: 0, choices: [ { word: '어깨', leadsTo: 1 }, { word: '아름다움', leadsTo: 'deadend-1' },], },
            { id: 1, choices: [ { word: '고양이', leadsTo: 'deadend-1' }, { word: '거미', leadsTo: 2 }, ], },
            { id: 2, choices: [ { word: '기차', leadsTo: 'deadend-2' }, { word: '버스', leadsTo: 3 }, ], },
            { id: 3, choices: [ { word: '아기', leadsTo: 'deadend-3' }, { word: '너구리', leadsTo: 4 }, ], },
            { id: 4, choices: [ { word: '저울', leadsTo: 5 }, { word: '오리', leadsTo: 'deadend-4' }, ], },
            { id: 5, choices: [ { word: '나무', leadsTo: 'deadend-5' }, { word: '건물', leadsTo: 'finish' }, ], },
          ],
        },
      },
    ],
  },
  {
    vowel: 'ㅕ',
    pronunciation: 'yeo',
    activities: [
       {
        type: 'body-pose',
        title: "몸으로 'ㅕ'를 표현해 보세요.",
        instruction: '그림을 보고 따라 해보세요!',
        data: {
          image: './images/sani_yeo.png',
        },
      },
       { type: 'stroke-order', title: 'ㅕ 쓰는 순서 배우기', instruction: '조각을 옮겨서 글자를 완성해보세요.', data: {} },
       {
        type: 'vowel-input',
        title: "'ㅕ' 들어간 낱말 만들기",
        instruction: "예시문을 보고 'ㅕ'가 들어간 낱말을 만들어보세요.",
        data: {
          exampleSentence: '혀를 날름거리는 뱀.',
        },
      },/*
       {
        type: 'word-image-match',
        title: '낱말과 그림 잇기',
        instruction: '알맞은 낱말과 그림을 선으로 이어보세요.',
        data: {
          pairs: [
            { id: 1, word: '여자', image: 'https://via.placeholder.com/100/E91E63/FFFFFF?text=여자' },
            { id: 2, word: '변호사', image: 'https://via.placeholder.com/100/3F51B5/FFFFFF?text=변호사' },
            { id: 3, word: '벼', image: 'https://via.placeholder.com/100/CDDC39/000000?text=벼' },
            { id: 4, word: '편지', image: 'https://via.placeholder.com/100/00BCD4/FFFFFF?text=편지' },
          ],
        },
      },*/
      {
        type: 'word-highlight',
        title: 'ㅕ 소리 찾기',
        instruction: "'ㅕ'가 들어간 풍선을 찾으세요.",
        data: {
          type: 'findVowel',
          theme: 'balloons',
          words: [
            { word: '여자' }, { word: '편지' }, { word: '벼' },
            { word: '여우' }, { word: '여름' }, { word: '겨울' },
            { word: '가을' }, { word: '사과' }, { word: '나무' },
          ],
        },
      },
      {
        type: 'maze',
        title: '미로찾기',
        instruction: "낱말을 따라 'ㅕ'가 들어간 길을 찾아가세요.",
        data: {
          junctions: [
            { id: 0, choices: [ { word: '여우', leadsTo: 1 }, { word: '거울', leadsTo: 'deadend-1'}], },
            { id: 1, choices: [ { word: '사자', leadsTo: 'deadend-1' }, { word: '여름', leadsTo: 2 }, ], },
            { id: 2, choices: [ { word:  '겨울', leadsTo: 3 }, { word: '가을', leadsTo: 'deadend-2'}, ], },
            { id: 3, choices: [ { word: '봄', leadsTo: 'deadend-3' }, { word: '편지', leadsTo: 4 }, ], },
            { id: 4, choices: [ { word: '선물', leadsTo: 'deadend-4' }, { word: '벽', leadsTo: 'finish' }, ], },
          //  { id: 5, choices: [ { word: '문', leadsTo: 'deadend-5' }, { word: '혀', leadsTo:  }, ], },
          ],
        },
      },
    ],
  },
  {
    vowel: 'ㅗ',
    pronunciation: 'o',
    activities: [
       {
        type: 'body-pose',
        title: "몸으로 'ㅗ'를 표현해 보세요.",
        instruction: '그림을 보고 따라 해보세요!',
        data: {
          image: './images/sani_o.png',
        },
      },
       { type: 'drawing', title: 'ㅗ 따라 쓰기', instruction: '네모 칸에 맞춰 글자를 예쁘게 써보세요.', data: {} },
       /*{
        type: 'word-image-match',
        title: '낱말과 그림 잇기',
        instruction: '알맞은 낱말과 그림을 선으로 이어보세요.',
        data: {
          pairs: [
            { id: 1, word: '오이', image: 'https://via.placeholder.com/100/4CAF50/FFFFFF?text=오이' },
            { id: 2, word: '모자', image: 'https://via.placeholder.com/100/9C27B0/FFFFFF?text=모자' },
            { id: 3, word: '포도', image: 'https://via.placeholder.com/100/673AB7/FFFFFF?text=포도' },
            { id: 4, word: '고구마', image: 'https://via.placeholder.com/100/795548/FFFFFF?text=고구마' },
          ],
        },
      },*/
      {
        type: 'word-highlight',
        title: 'ㅗ 소리 찾기',
        instruction: "'ㅗ' 소리가 들어간 낱말을 찾아보세요!",
        data: {
          type: 'findVowel',
          theme: 'leaves',
          words: [
            { word: '오이' }, { word: '모자' }, { word: '포도' },
            { word: '고구마' }, { word: '도로' }, { word: '소나무' },
            { word: '거미' }, { word: '다리' }, { word: '사자' },
          ],
        },
      },
      {
        type: 'vowel-input',
        title: "'ㅗ' 들어간 낱말 만들기",
        instruction: "예시문을 보고 'ㅗ'가 들어간 낱말을 만들어보세요.",
        data: {
          exampleSentence: '고구마와 포도를 먹어요.',
        },
      },
    ],
  },
  {
    vowel: 'ㅛ',
    pronunciation: 'yo',
    activities: [
       {
        type: 'body-pose',
        title: "몸으로 'ㅛ'를 표현해 보세요.",
        instruction: '그림을 보고 따라 해보세요!',
        data: {
          image: './images/sani_yo.png',
        },
      },
       { type: 'stroke-order', title: 'ㅛ 쓰는 순서 배우기', instruction: '조각을 옮겨서 글자를 완성해보세요.', data: {} },
       { type: 'drawing', title: 'ㅛ 따라 쓰기', instruction: '네모 칸에 맞춰 글자를 예쁘게 써보세요.', data: {} },
      {
        type: 'maze',
        title: '미로찾기',
        instruction: "낱말을 따라 'ㅛ'가 들어간 길을 찾아가세요.",
        data: {
          junctions: [
            { id: 0, choices: [ { word: '요리', leadsTo: 1 }, { word: '오리', leadsTo: 'deadend-1' },], },
            { id: 1, choices: [ { word: '운동', leadsTo: 'deadend-1' }, { word: '요트', leadsTo: 2 }, ], },
            { id: 2, choices: [ { word: '쵸콜렛', leadsTo: 3 }, { word: '고구마', leadsTo: 'deadend-2' }, ], },
            { id: 3, choices: [ { word: '학교', leadsTo: 4  }, { word: '학기', leadsTo: 'deadend-3' }, ], },
            { id: 4, choices: [ { word: '선물', leadsTo: 'deadend-4' }, { word: '요요', leadsTo: 5 }, ], },
            { id: 5, choices: [ { word: '장난감', leadsTo: 'deadend-5' }, { word: '요람', leadsTo: 'finish' }, ], },
          ],
        },
      },
      {
        type: 'vowel-input',
        title: "'ㅛ' 들어간 낱말 만들기",
        instruction: "예시문을 보고 'ㅛ'가 들어간 낱말을 만들어보세요.",
        data: {
          exampleSentence: '요리사가 요리를 해요.',
        },
      },
    ],
  },
  {
    vowel: 'ㅜ',
    pronunciation: 'u',
    activities: [
       {
        type: 'body-pose',
        title: "몸으로 'ㅜ'를 표현해 보세요.",
        instruction: '그림을 보고 따라 해보세요!',
        data: {
          image: './images/sani_u.png',
        },
      },
      { type: 'stroke-order', title: 'ㅜ 쓰는 순서 배우기', instruction: '조각을 옮겨서 글자를 완성해보세요.', data: {} },
      {
        type: 'word-highlight',
        title: 'ㅜ 소리 찾기',
        instruction: "'ㅜ' 소리가 들어간 낱말을 찾아보세요!",
        data: {
          type: 'findVowel',
          theme: 'leaves',
          words: [
            { word: '우유' }, { word: '두부' }, { word: '구두' },
            { word: '주스' }, { word: '우산' }, { word: '수박' },
            { word: '사과' }, { word: '바지' }, { word: '고구마' },
          ],
        },
      },
      {
        type: 'maze',
        title: '미로찾기',
        instruction: "낱말을 따라 'ㅜ'가 들어간 길을 찾아가세요.",
        data: {
          junctions: [
            { id: 0, choices: [ { word: '우산', leadsTo: 1 }, ], },
            { id: 1, choices: [ { word: '비', leadsTo: 'deadend-1' }, { word: '구름', leadsTo: 2 }, ], },
            { id: 2, choices: [ { word: '하늘', leadsTo: 'deadend-2' }, { word: '수박', leadsTo: 3 }, ], },
            { id: 3, choices: [ { word: '딸기', leadsTo: 'deadend-3' }, { word: '주머니', leadsTo: 4 }, ], },
            { id: 4, choices: [ { word: '가방', leadsTo: 'deadend-4' }, { word: '우주', leadsTo: 5 }, ], },
            { id: 5, choices: [ { word: '별', leadsTo: 'deadend-5' }, { word: '우리', leadsTo: 'finish' }, ], },
          ],
        },
      },
       { type: 'drawing', title: 'ㅜ 따라 쓰기', instruction: '네모 칸에 맞춰 글자를 예쁘게 써보세요.', data: {} },
       {
        type: 'vowel-input',
        title: "'ㅜ' 들어간 낱말 만들기",
        instruction: "예시문을 보고 'ㅜ'가 들어간 낱말을 만들어보세요.",
        data: {
          exampleSentence: '우리는 우유를 마셔요.',
        },
      },
    ],
  },
  {
    vowel: 'ㅠ',
    pronunciation: 'yu',
    activities: [
      {
        type: 'body-pose',
        title: "몸으로 'ㅠ'를 표현해 보세요.",
        instruction: '그림을 보고 따라 해보세요!',
        data: {
          image: './images/sani_yu.png',
        },
      },
/*
      {
        type: 'word-image-match',
        title: '낱말과 그림 잇기',
        instruction: '알맞은 낱말과 그림을 선으로 이어보세요.',
        data: {
          pairs: [
            { id: 1, word: '우유', image: 'https://via.placeholder.com/100/FFFFFF/000000?text=우유' },
            { id: 2, word: '휴지', image: 'https://via.placeholder.com/100/CFD8DC/000000?text=휴지' },
            { id: 3, word: '유리', image: 'https://via.placeholder.com/100/B2EBF2/000000?text=유리' },
            { id: 4, word: '유치원', image: 'https://via.placeholder.com/100/F44336/FFFFFF?text=유치원' },
          ],
        },
      },*/
      { type: 'stroke-order', title: 'ㅠ 쓰는 순서 배우기', instruction: '조각을 옮겨서 글자를 완성해보세요.', data: {} },      
      { type: 'drawing', title: 'ㅠ 따라 쓰기', instruction: '네모 칸에 맞춰 글자를 예쁘게 써보세요.', data: {} },
      {
        type: 'word-count',
        title: '낱말 세어보기',
        instruction: "'ㅠ'가 들어간 낱말은 모두 몇 개인가요?",
        data: {
          words: [
            { word: '우유' }, { word: '아이' }, { word: '규율' },
            { word: '지구' }, { word: '자유' }, { word: '지윤' },
            { word: '휴식' }, { word: '아야' }, { word: '은유' },
          ],
          correctAnswer: 6,
        },
      },


      {
        type: 'vowel-input',
        title: "'ㅠ' 들어간 낱말 만들기",
        instruction: "예시문을 보고 'ㅠ'가 들어간 낱말을 만들어보세요.",
        data: {
          exampleSentence: '휴지를 아껴 써요.',
        },
      },
      {
        type: 'maze',
        title: '미로찾기',
        instruction: "낱말을 따라 'ㅠ'가 들어간 길을 찾아가세요.",
        data: {
          junctions: [
            { id: 0, choices: [ { word: '유리', leadsTo: 1 }, { word: '우리', leadsTo: 'deadend-1' }], },
            { id: 1, choices: [ { word: '창문', leadsTo: 'deadend-1' }, { word: '휴지', leadsTo: 2 }, ], },
            { id: 2, choices: [ { word: '상자', leadsTo: 'deadend-2' }, { word: '우유', leadsTo: 3 }, ], },
            { id: 3, choices: [ { word: '물', leadsTo: 'deadend-3' }, { word: '규율', leadsTo: 4 }, ], },
            { id: 4, choices: [ { word: '규칙', leadsTo: 'deadend-4' }, { word: '자유', leadsTo: 5 }, ], },
            { id: 5, choices: [ { word: '평화', leadsTo: 'deadend-5' }, { word: '유치원', leadsTo: 'finish' }, ], },
          ],
        },
      },      
    ],
  },
  {
    vowel: 'ㅡ',
    pronunciation: 'eu',
    activities: [
       {
        type: 'body-pose',
        title: "몸으로 'ㅡ'를 표현해 보세요.",
        instruction: '그림을 보고 따라 해보세요!',
        data: {
          image: './images/sani_eu.png',
        },
      },
       {
        type: 'vowel-input',
        title: "'ㅡ' 들어간 낱말 만들기",
        instruction: "예시문을 보고 'ㅡ'가 들어간 낱말을 만들어보세요.",
        data: {
          exampleSentence: '그네가 흔들거려요.',
        },
      },
       { type: 'drawing', title: 'ㅡ 따라 쓰기', instruction: '네모 칸에 맞춰 글자를 예쁘게 써보세요.', data: {} },
      /* {
        type: 'word-image-match',
        title: '낱말과 그림 잇기',
        instruction: '알맞은 낱말과 그림을 선으로 이어보세요.',
        data: {
          pairs: [
            { id: 1, word: '그릇', image: 'https://via.placeholder.com/100/BDBDBD/000000?text=그릇' },
            { id: 2, word: '슬리퍼', image: 'https://via.placeholder.com/100/03A9F4/FFFFFF?text=슬리퍼' },
            { id: 3, word: '으르렁', image: 'https://via.placeholder.com/100/FF5722/FFFFFF?text=으르렁' },
            { id: 4, word: '크레파스', image: 'https://via.placeholder.com/100/FBC02D/000000?text=크레파스' },
          ],
        },
      },*/
      {
        type: 'drag-drop-fill',
        title: '문장 완성하기',
        instruction: '알맞은 글자 구름을 옮겨 문장을 완성해보세요.',
        data: {
          sentenceParts: ['여', '에', ' ', '', '이 최고이다.'],
          answers: ['름', '는', '그', '늘'],
          choices: ['름', '는', '그', '늘', '에', '여', '이', '최고'],
        }
      },
      {
        type: 'vowel-input',
        title: "'ㅡ' 들어간 낱말 만들기",
        instruction: "예시문을 보고 'ㅡ'가 들어간 낱말을 만들어보세요.",
        data: {
          exampleSentence: '슬리퍼를 신고 있어요.',
        },
      },
    ],
  },
  {
    vowel: 'ㅣ',
    pronunciation: 'i',
    activities: [
       {
        type: 'body-pose',
        title: "몸으로 'ㅣ'를 표현해 보세요.",
        instruction: '그림을 보고 따라 해보세요!',
        data: {
          image: './images/sani_i.png',
        },
      },
       { type: 'stroke-order', title: 'ㅣ 쓰는 순서 배우기', instruction: '조각을 옮겨서 글자를 완성해보세요.', data: {} },
       { type: 'drawing', title: 'ㅣ 따라 쓰기', instruction: '네모 칸에 맞춰 글자를 예쁘게 써보세요.', data: {} },
      {
        type: 'word-highlight',
        title: "'ㅣ' 낱말 찾기",
        instruction: "'ㅣ'가 들어가는 낱말을 클릭하세요.",
        data: {
          type: 'findVowel',
          theme: 'grid',
          words: [
            { word: '산', isCorrect: false }, { word: '이사', isCorrect: true }, { word: '아빠', isCorrect: false }, { word: '이야기', isCorrect: true }, { word: '나무', isCorrect: false },
            { word: '강', isCorrect: false }, { word: '이름', isCorrect: true }, { word: '별', isCorrect: false }, { word: '이빨', isCorrect: true }, { word: '달', isCorrect: false },
            { word: '벌', isCorrect: false }, { word: '입', isCorrect: true }, { word: '사자', isCorrect: false }, { word: '인사', isCorrect: true }, { word: '사과', isCorrect: false },
            { word: '상상', isCorrect: false }, { word: '이마', isCorrect: true  }, { word: '토마토', isCorrect: false }, { word: '딸기', isCorrect: true }, { word: '바나나', isCorrect: false },
            { word: '꿀', isCorrect: false }, { word: '이불', isCorrect: true }, { word: '말', isCorrect: false }, { word: '일요일', isCorrect: true }, { word: '그네', isCorrect: false },
          ],
        },
      },
      {
        type: 'vowel-input',
        title: "'ㅣ' 들어간 낱말 만들기",
        instruction: "예시문을 보고 'ㅣ'가 들어간 낱말을 만들어보세요.",
        data: {
          exampleSentence: '기차가 빨리 달려요.',
        },
      },
      /*
       {
        type: 'fill-blanks',
        title: '빈칸 채우기',
        instruction: '동시를 읽고 빈칸에 알맞은 글자를 써보세요.',
        data: {
          poemTitle: '비',
          lines: [
            { line: ['주룩주룩', '옵니다'], answers: ['비가', '주룩주룩'] },
            { line: ['시원한', '입니다'], answers: ['비가', '옵니다'] },
          ],
        },
      },
      */
    ],
  },
];

