export interface WorkbookItem {
  id: number;
  code: string;
  bookno: number;
  title: string;
  subtitle: string;
  author: string;
  publisher: string;
  target_group: 'INFANT' | 'ELEM_LOW' | 'ELEM_HIGH' | 'MID_HIGH';
  target_label: string;
  theme_category: string;
  roadmap_theme_id: number;
  roadmap_name: string;
  roadmap_desc: string;
  duration_minutes: number;
  keywords: string[];
  cover_emoji: string;
  badge_color: string;
  is_builtin_interactive: number;
  is_free_content: number;
  book_price?: number;
  purchase_url: string;
}

export interface RoadmapBook {
  bookno: number;
  difficulty_level: number;
  track_tag: string;
  curator_note: string;
  title: string;
  author: string;
  publisher: string;
  pages?: number;
  linked_workbook_code?: string | null;
  purchase_url: string;
}

export interface RoadmapTheme {
  id: number;
  name: string;
  category: string;
  description: string;
  books: RoadmapBook[];
}

export interface StudyStep {
  id: number;
  workbook_code: string;
  step_order: number;
  step_type: 'BOOK_INTRO' | 'COMPREHENSION' | 'DISCUSSION' | 'ESSAY_WRITING';
  step_title: string;
  step_badge: string;
  content: any;
}

export interface WritingPrompt {
  id: number;
  prompt_code: string;
  workbook_code: string;
  question_title: string;
  question_guide: string;
  min_length: number;
  recommended_length: number;
  required_credits: number;
  reading_materials: Array<{ title: string; content: string }>;
}

export interface WorkbookDetailData {
  workbook: WorkbookItem;
  steps: StudyStep[];
  writing_prompts: WritingPrompt[];
  roadmap_books: RoadmapBook[];
}

export const INITIAL_WORKBOOKS: WorkbookItem[] = [
  {
    id: 1,
    code: 'naraesani_vowel',
    bookno: 79546,
    title: '나래와 산이의 한글 모험 - 모음편',
    subtitle: '몸으로 표현하고 미로와 게임으로 깨치는 기초 모음 워크북',
    author: '어린이한글교육연구회',
    publisher: '리더스가이드',
    target_group: 'INFANT',
    target_label: '유아·초등1 (5~8세)',
    theme_category: '기초문해력',
    roadmap_theme_id: 64,
    roadmap_name: '글쓰기 & 문장력 수업 로드맵',
    roadmap_desc: '일기와 에세이 쓰기 첫걸음부터 작가들의 문장론과 스토리텔링 작법까지',
    duration_minutes: 40,
    keywords: ['한글 모음', '기초 문해력', '획순 익히기', '낱말 놀이'],
    cover_emoji: '🌱',
    badge_color: 'amber',
    is_builtin_interactive: 1,
    is_free_content: 1,
    book_price: 12000,
    purchase_url: 'https://www.readersguide.co.kr/book/79546',
  },
  {
    id: 2,
    code: 'naraesani_consonant',
    bookno: 79546,
    title: '나래와 산이의 한글 모험 - 받침편',
    subtitle: '소리와 낱말 퍼즐로 재미있게 완성하는 한글 받침 워크북',
    author: '어린이한글교육연구회',
    publisher: '리더스가이드',
    target_group: 'INFANT',
    target_label: '유아·초등1 (5~8세)',
    theme_category: '기초문해력',
    roadmap_theme_id: 64,
    roadmap_name: '글쓰기 & 문장력 수업 로드맵',
    roadmap_desc: '일기와 에세이 쓰기 첫걸음부터 작가들의 문장론과 스토리텔링 작법까지',
    duration_minutes: 45,
    keywords: ['한글 받침', '낱말 조합', '기초 어휘', '문장 완성'],
    cover_emoji: '🔤',
    badge_color: 'orange',
    is_builtin_interactive: 1,
    is_free_content: 1,
    book_price: 12000,
    purchase_url: 'https://www.readersguide.co.kr/book/79546',
  },
  {
    id: 3,
    code: 'gmo_kid',
    bookno: 32204,
    title: 'GMO 아이 - 초등 독서·논술 지도안',
    subtitle: "유전자 조작과 생명의 존엄성을 주인공 '나무'와 함께 생각하는 독서 워크북",
    author: '문선이 글 · 유준재 그림',
    publisher: '창비',
    target_group: 'ELEM_LOW',
    target_label: '초등 독서지도 (초등 전학년)',
    theme_category: '과학/IT',
    roadmap_theme_id: 62,
    roadmap_name: '생명과학 & 자연·생태 관찰',
    roadmap_desc: '동식물 도감과 생태 에세이부터 진화생물학과 생명윤리 고전까지',
    duration_minutes: 60,
    keywords: ['GMO', '유전자 조작', '생명 존엄성', '과학 윤리', '가족의 의미'],
    cover_emoji: '🧬',
    badge_color: 'emerald',
    is_builtin_interactive: 0,
    is_free_content: 1,
    book_price: 11000,
    purchase_url: 'https://www.readersguide.co.kr/book/32204',
  },
  {
    id: 4,
    code: 'mania_essay',
    bookno: 1103,
    title: '미쳐야 미친다 - 중·고등 심화 논술 지도안',
    subtitle: '불광불급(不狂不及), 18세기 조선 지식인들의 열정과 현대 마니아 문화 심화 논술',
    author: '정민 지음',
    publisher: '푸른역사',
    target_group: 'MID_HIGH',
    target_label: '중·고등 심화 (90분 논술)',
    theme_category: '인문/철학',
    roadmap_theme_id: 30,
    roadmap_name: '인문 고전 & 지성사 입문',
    roadmap_desc: '동서양을 관통하는 필독 인문 고전을 청소년 눈높이부터 벽돌책까지 안내하는 지도',
    duration_minutes: 90,
    keywords: ['불광불급', '벽(癖)', '마니아', '격물치지', '18세기 조선', '대입 논술'],
    cover_emoji: '🔥',
    badge_color: 'indigo',
    is_builtin_interactive: 0,
    is_free_content: 1,
    book_price: 15000,
    purchase_url: 'https://www.readersguide.co.kr/book/1103',
  },
];

export const INITIAL_ROADMAPS: RoadmapTheme[] = [
  {
    id: 64,
    name: '글쓰기 & 문장력 수업 로드맵',
    category: '문학/예술',
    description: '기초 한글 문해력부터 일기·에세이 쓰기, 작가들의 문장론과 스토리텔링 작법까지 단계별로 성장하는 독서 지도',
    books: [
      {
        bookno: 79546,
        difficulty_level: 1,
        track_tag: '입문/어린이',
        curator_note: '워크북 수록 도서 · 나래와 산이의 기초 한글·문해력 모험',
        title: '나래와 산이의 글자 찾기 모험',
        author: '어린이한글교육연구회',
        publisher: '리더스가이드',
        pages: 120,
        linked_workbook_code: 'naraesani_vowel',
        purchase_url: 'https://www.readersguide.co.kr/book/79546',
      },
      {
        bookno: 22990,
        difficulty_level: 1,
        track_tag: '입문/청소년',
        curator_note: '솔직한 마음 표현과 글쓰기의 즐거움을 일깨우는 창작동화',
        title: '나의 비밀 일기장',
        author: '문선이',
        publisher: '푸른놀이터',
        pages: 184,
        purchase_url: 'https://www.readersguide.co.kr/book/22990',
      },
      {
        bookno: 1103,
        difficulty_level: 3,
        track_tag: '원전/심화',
        curator_note: '워크북 수록 도서 · 조선 지식인들의 치열한 독서와 집필 정신',
        title: '미쳐야 미친다',
        author: '정민',
        publisher: '푸른역사',
        pages: 316,
        linked_workbook_code: 'mania_essay',
        purchase_url: 'https://www.readersguide.co.kr/book/1103',
      },
    ],
  },
  {
    id: 62,
    name: '생명과학 & 과학 윤리 로드맵',
    category: '과학/IT',
    description: '유전자 조작(GMO)과 생명 존엄성을 다룬 어린이 동화부터 현대 생명공학 교양서까지 이어지는 책지도',
    books: [
      {
        bookno: 32204,
        difficulty_level: 1,
        track_tag: '입문/청소년',
        curator_note: '워크북 수록 도서 · 생명윤리와 유전자 기술을 다룬 창작동화 (초등 독서지도)',
        title: '지엠오 아이 (GMO 아이)',
        author: '문선이',
        publisher: '창비',
        pages: 188,
        linked_workbook_code: 'gmo_kid',
        purchase_url: 'https://www.readersguide.co.kr/book/32204',
      },
      {
        bookno: 28204,
        difficulty_level: 2,
        track_tag: '교양/해설',
        curator_note: '핵심 맥락을 잡아주는 어린이·청소년 과학 교양서',
        title: 'GMO : 유전자 조작 식품은 안전할까?',
        author: '김훈기',
        publisher: '풀빛',
        pages: 160,
        purchase_url: 'https://www.readersguide.co.kr/book/28204',
      },
      {
        bookno: 26832,
        difficulty_level: 3,
        track_tag: '원전/심화',
        curator_note: '깊이 있는 사유로 나아가는 심화 과학·사회 비평서',
        title: 'GMO, 우리는 날마다 논란을 먹는다',
        author: '존 T. 랭',
        publisher: '풀빛',
        pages: 320,
        purchase_url: 'https://www.readersguide.co.kr/book/26832',
      },
    ],
  },
  {
    id: 30,
    name: '인문 고전 & 지성사 입문 로드맵',
    category: '인문/철학',
    description: '18세기 조선 르네상스 지식인들의 열정(불광불급)부터 동서양 고전까지 탐험하는 인문 독서 지도',
    books: [
      {
        bookno: 1103,
        difficulty_level: 2,
        track_tag: '교양/해설',
        curator_note: '워크북 수록 도서 · 18세기 조선 지식인들의 불광불급 열정 (심화 논술)',
        title: '미쳐야 미친다',
        author: '정민',
        publisher: '푸른역사',
        pages: 316,
        linked_workbook_code: 'mania_essay',
        purchase_url: 'https://www.readersguide.co.kr/book/1103',
      },
    ],
  },
];

export const WORKBOOK_DETAILS_MAP: Record<string, WorkbookDetailData> = {
  gmo_kid: {
    workbook: INITIAL_WORKBOOKS[2],
    steps: [
      {
        id: 1,
        workbook_code: 'gmo_kid',
        step_order: 1,
        step_type: 'BOOK_INTRO',
        step_title: '1단계: 작품·작가 소개 및 줄거리',
        step_badge: '독서 준비',
        content: {
          book_intro:
            "'지엠오(GMO, 유전자변형생물체) 아이'는 먼 미래에서 일어날 법한 일을 다룬 환상동화입니다. 현재 문제가 되고 있는 인간의 복제나 장기 이식, 유전자 조작 식품의 피해를 짐작할 수 있도록 미래의 모습을 과학적인 자료조사를 통해 사실적이면서도 흥미진진하게 전개하고 있어요.\n\n유전자 산업의 발달은 유기농 사업을 동시에 필요로 하는 것처럼, 유전자 산업이 성장할수록 강하게 반대 시위도 진행되는 모습을 통해 우리 사회의 나아갈 길을 둘러싼 두 가지의 대립적인 면을 잘 보여주고 있습니다. 작가는 '지엠오'를 찬반론자 입장에서 보지 않고 과학기술의 발달로 인해 펼쳐질 양상들을 여러 가지 입장에서 객관적으로 보려 하고 있습니다. ‘이 동화를 통해 우리 어린이들이 희귀병 환자들의 아픔은 물론 생명의 존엄성과 윤리적 측면을 같이 생각해 볼 수 있었으면’ 좋겠고, ‘어린이들이 살게 될 미래에는 ‘나무’가 겪는 것과 같은 불행한 일’이 일어나지 않았으면 하는 바람을 머리말에서 밝히고 있습니다.",
          author_intro: [
            {
              role: '글쓴이 문선이',
              bio: '서울에서 태어나 경희대학교 국어교육대학원을 졸업했습니다. 문화일보 신춘문예와 눈높이 아동문학상에 동시가 당선되었어요. 2000년 MBC 창작동화대상에 장편동화 《나의 비밀 일기장》이 당선되어 동화를 쓰기 시작했어요. 지은 책으로 《제키의 지구여행》, 《나의 비밀 일기장》, 《양파의 왕따 일기》 등이 있습니다.',
            },
            {
              role: '그린이 유준재',
              bio: '1976년 서울에서 태어나 홍익대학교에서 섬유미술을 공부하였습니다. 《누가 더 높은 곳에서 뛰어내릴까?》로 그림책 작업을 시작하게 되었고, 《화성에 간 내 동생》, 《황소 아저씨》, 《단군신화》, 《고대 이집트》 등에 그림을 그렸습니다.',
            },
          ],
          synopsis:
            "유전자 조작으로 우성유전자를 가지고 태어났지만, 아이다움만은 그대로 간직하고 있는 ‘나무’는 어느 날 유전자 사업을 운영하는 기업 회장인 할아버지의 집 앞에 버려집니다. 갑자기 사업이 망한 ‘나무’의 부모는 유전자 조작으로 태어난 ‘나무’를 헌신짝처럼 버린 거예요.\n\n한편, 유전공학의 발달로 실제 나이보다 젊게 살고 있지만, 냉동되지 않는다면 생명이 몇 년 남지 않은 할아버지는 마지못해 집에 들여온 ‘나무’의 돌출되는 행동이 영 맘에 들지 않지만, 함께 있는 시간이 많아질수록 삶에 있어서 소중한 것이 무엇인가를 ‘나무’를 통해 깨달아 가게 됩니다.\n\n자신이 힘들여 일구어온 유전자 사업 반대 시위에 참여하며 유전자 조작이 없는 마을에 살고 있는 아들과 손자들을 전혀 만나지 않았던 할아버지는 마침내 마음의 문을 엽니다. ‘나무’와 함께 인공 섬에서 자전거 타며 흘린 땀이 얼마나 아름다운지를 깨달으면서요.",
        },
      },
      {
        id: 2,
        workbook_code: 'gmo_kid',
        step_order: 2,
        step_type: 'COMPREHENSION',
        step_title: '2단계: 내용 이해 (인물의 태도 변화)',
        step_badge: '내용 파악',
        content: {
          table_activity: {
            question:
              '1. 할아버지와 나무가 시간이 지나면서 서로를 대하는 태도가 어떻게 달라지는지 빈칸을 채워 설명해 보세요.',
            columns: ['시기', '할아버지', '나무'],
            rows: [
              {
                period: '처음 만나서',
                col1_placeholder: '마지못해 집에 들여놓고 나무의 돌출 행동을 못마땅해함',
                col2_placeholder: '낯선 환경이지만 천진난만하고 아이다운 모습을 보임',
              },
              {
                period: '크리스마스 전후',
                col1_placeholder: '나무에게 조금씩 관심을 보이지만 여전히 거리감을 둠',
                col2_placeholder: '할아버지에게 다가가려 노력하지만 고아원에 보내져 상처받음',
              },
              {
                period: '고아원에서 데려온 이후',
                col1_placeholder: '나무의 소중함을 깨닫고 함께 자전거를 타며 마음의 문을 엶',
                col2_placeholder: '할아버지를 진심으로 따르고 가족의 따뜻함을 느낌',
              },
            ],
          },
          short_questions: [
            {
              id: 'gmo_q2',
              question: "2. '나무'가 할아버지의 집 앞에 버려진 이유가 무엇 때문일까요?",
              placeholder: '부모님의 사업이 갑자기 망하자, 유전자 조작으로 태어난 나무를...',
            },
            {
              id: 'gmo_q3',
              question: '3. 미래에도 유전자 조작 식품을 먹지 않는 사람들이 있을까요? 어떤 사람들일까요?',
              placeholder: '할아버지의 아들 가족처럼 자연 그대로의 삶과 생명 윤리를 소중히 여기는...',
            },
          ],
        },
      },
      {
        id: 3,
        workbook_code: 'gmo_kid',
        step_order: 3,
        step_type: 'DISCUSSION',
        step_title: '3단계: 함께 이야기 나누기 & 활동하기',
        step_badge: '생각 넓히기',
        content: {
          discussion_topics: [
            {
              id: 'gmo_disc_1',
              title:
                '1. 유전자 조작으로 태어난 사람이 유전자 조작 식품을 먹으면 질병이 생길까요? 생긴다면 왜 그렇게 생각하는지 얘기해 봅시다.',
              hint: '인위적으로 변형된 유전자끼리 만나 예상치 못한 부작용이 생길 수 있다는 점과 안전성 논란을 떠올려 보세요.',
            },
            {
              id: 'gmo_disc_2',
              title:
                '2. 모든 것을 로봇이 알아서 척척 해주는 것과 지금 여러분이 살고 있는 삶 중에서 선택할 수 있다면 어떤 것을 선택하고 싶은지 이야기해 보세요.',
              choices: ['로봇이 다 해주는 편리한 삶', '직접 땀 흘리고 부딪히며 살아가는 지금의 삶'],
              hint: '할아버지가 나무와 함께 자전거를 타며 흘린 땀의 아름다움을 깨달은 장면을 함께 생각해 보세요.',
            },
            {
              id: 'gmo_disc_3',
              title:
                '3. 냉동되어 먼 미래에는 질병을 치료하거나 수명을 더 연장할 수 있다면 냉동을 선택할 것인지 이야기해 봅시다. 만약 먼 미래에 다시 깨어나면 어떤 일이 생길까요?',
              hint: '수명 연장이라는 장점과 사랑하는 가족·친구들이 모두 떠나고 혼자 남겨지는 외로움을 비교해 보세요.',
            },
          ],
          research_activities: [
            '활동 1: 우리 집 식탁에서 먹는 음식들(두부, 간장, 식용유, 옥수수 등)에는 어떤 유전자변형식품들이 있는지 조사해 기사로 만들어 보세요.',
            '활동 2: GMO(유전자변형식품)는 반드시 그 표시를 해야 합니다. 인터넷으로 검색을 해서 어떤 식품의 경우에는 법적으로 꼭 표기를 하지 않는지 조사해 봅시다.',
          ],
        },
      },
      {
        id: 4,
        workbook_code: 'gmo_kid',
        step_order: 4,
        step_type: 'ESSAY_WRITING',
        step_title: '4단계: AI 선생님 첨삭 글쓰기',
        step_badge: 'AI 첨삭 과제',
        content: {
          default_prompt_code: 'gmo_debate_essay',
        },
      },
    ],
    writing_prompts: [
      {
        id: 2,
        prompt_code: 'gmo_debate_essay',
        workbook_code: 'gmo_kid',
        question_title:
          '《GMO 아이》를 읽고 유전자 조작 기술(GMO 아이와 유전자변형식품)에 대한 자신의 생각(찬성·반대 입장 비교)과 우리가 생명을 대해야 하는 올바른 태도에 대해 글을 써 보세요.',
        question_guide:
          '1) GMO 아이와 유전자 변형이 무엇인지 쉽게 설명하고, 2) 질병 치료 등 좋은 점과 윤리적 문제(나무의 아픔 등)를 균형 있게 살펴본 뒤, 3) 내 생각과 다짐을 정돈된 문장(~다, ~라고 생각한다)으로 적어보세요.',
        min_length: 150,
        recommended_length: 400,
        required_credits: 1,
        reading_materials: [
          {
            title: '글쓰기 도움말: 《GMO 아이》 핵심 돌아보기',
            content:
              "• 찬성 측 시각: 유전자 기술로 난치병과 유전병을 치료하고, 수명을 연장하며, 식량 부족 문제를 해결할 수 있어요.\n• 반대 측 시각: 부모가 원하는 대로 아기를 디자인하거나 쓸모없어졌다고 '나무'처럼 버리는 등 생명의 존엄성이 훼손되고 빈부격차에 따른 불평등이 생길 수 있어요.\n• 할아버지의 깨달음: 모든 것을 인위적으로 조작하는 삶보다, '나무'와 함께 자전거를 타며 직접 땀 흘리고 사랑하는 삶이 훨씬 아름답다는 것을 깨달았어요.",
          },
        ],
      },
    ],
    roadmap_books: INITIAL_ROADMAPS[1].books,
  },
  mania_essay: {
    workbook: INITIAL_WORKBOOKS[3],
    steps: [
      {
        id: 5,
        workbook_code: 'mania_essay',
        step_order: 1,
        step_type: 'BOOK_INTRO',
        step_title: '1단계: 도서 소개 및 수업 전 준비',
        step_badge: '도서·어휘 탐구',
        content: {
          quote:
            '“사람이 벽(癖)이 없으면 쓸모없는 사람일 뿐이다. 대저 벽이란 글자는 질(疾)에서 나온 것이니, 병중에서도 편벽된 것이다. 하지만 독창적인 정신을 갖추고 전문 기예를 익히는 것은 왕왕 벽이 있는 사람만이 능히 할 수 있다.” - 박제가, 《백화보서》',
          book_intro:
            "꽃에 미친 김덕형, 장황에 고질이 든 방효량, 돌만 보면 벼루를 깎았던 석치(石癡) 정철조, 담배를 너무 좋아해 아예 담배에 관한 기록들을 모아 책을 엮은 이옥, 《백이전》을 1억 1만 3천 번(11만 3천 번)을 읽은 독서광 김득신, 스스로를 간서치(책에 미친 바보)라 했던 이덕무…….\n\n18세기 조선 지식인들의 글에서는 무언가에 온전히 미친 마니아들의 존재가 부쩍 눈에 띈다. 조선의 르네상스라 불리는 이때 쏟아져 나온 방대한 저작들—정약전의 《현산어보》, 김려의 《우해이어보》, 정약용의 그 엄청난 저작들은 모두 '벽(癖)의 추구'가 낳은 새로운 지적 패러다임의 산물이었다.",
          study_overview: {
            topic: '미치지 않으면 미치지 못한다 (不狂不及 - 불광불급)',
            duration: '90분',
            target: '중 / 고등학생',
            keywords: ['벽(癖)', '마니아', '치(痴)', '삶을 바꾼 만남', '일상 속의 깨달음'],
            related_exam: '2000 경희대 수시모집 논술고사 문제 - 학문하는 사람이 지녀야 할 태도',
            related_subject: '고등학교 국사 Ⅵ. 민족 문화의 발달',
            objectives: [
              '무엇인가를 이루기 위해서 과정으로서 그 일에 미쳐야 함(불광불급)을 이해한다.',
              '18세기 조선의 학문의 성과와 그 시대의 문화를 배운다.',
              '조선 시대 예술가·학자들의 벽(癖)이 어떠했는가를 살펴본다.',
            ],
          },
          vocabulary: [
            {
              term: '벽(癖)',
              meaning: '1. 무엇을 너무 지나치게 즐기는 성향. 2. 고치기 어려울 만큼 굳어진 버릇.',
            },
            {
              term: '격물치지(格物致知)',
              meaning: '“사물의 이치를 궁극에까지 이르러 나의 지식을 극진하게 이른다.”',
            },
            {
              term: '불광불급(不狂不及)',
              meaning: '미치지(열정을 다해 몰입하지) 않으면 목표한 경지에 도달하지 못한다.',
            },
          ],
          pre_questions: [
            {
              id: 'mania_pre_1',
              question: '1. 보통 사람들은 하지 않으려는 일에 미쳐서 그 일에 빠져 있는 사례들을 조사해 보자.',
            },
            {
              id: 'mania_pre_2',
              question: '2. 벽(癖)에 가까운 습관을 가진 자신의 이야기를 글로 소개해보자.',
            },
          ],
        },
      },
      {
        id: 6,
        workbook_code: 'mania_essay',
        step_order: 2,
        step_type: 'COMPREHENSION',
        step_title: '2단계: 책 속 내용 따라잡기 (조선의 마니아들)',
        step_badge: '핵심 독해',
        content: {
          mania_attributes:
            '마니아는 그 일에 미쳐야 한다. 그리고 일 자체를 좋아하여야 하고, 그 일을 생계의 수단으로 삼지 않아야 한다. 잊는다(忘). 잊는다는 것은 돌아보지 않는다는 뜻이다. 이것을 해서 먹고사는 데 도움이 될지, 출세에 보탬이 될지 따지지 않는다는 말이다. 그냥 무조건 좋아서, 하지 않을 수 없어서 한다는 말이다.',
          people_categories: [
            {
              category: '만들기',
              items: ['김덕형 - 꽃그림(백화보)', '방효량 - 장황(표구)', '정철조 - 벼루(석치)'],
            },
            {
              category: '수집',
              items: ['김억 - 칼', '김석손 - 매화시광', '이유신 - 수석', '신위 - 돌', '신씨 - 국화', '김홍도 - 매화'],
            },
            {
              category: '기록·책 저술',
              items: ['이옥 - 담배 《연경(燃經)》', '유득공 - 비둘기 《발합경》', '이서구 - 초록 앵무새 《녹앵무경》'],
            },
          ],
          excerpts: [
            {
              title: "① '꽃'에 벽이 있는 김덕형과 예술가의 관찰 (p.17)",
              text: "“《백화보》는 꽃에 미친 김군이 1년 내내 꽃밭 아래서 아침부터 저녁까지 계절에 따라 피고 지는 꽃술의 모양, 잎새의 모습을 그림으로 그려놓은 책이다. 김군은 아침에 눈만 뜨면 꽃밭으로 달려간다. 꽃 아래 아예 자리를 깔고 드러누워 하루 종일 꽃만 본다. (중략) 사람들은 ‘저 사람 완전히 돌았군! 미친 게 틀림없어’ 하며 혀를 차거나 안됐다는 표정을 짓기 일쑤다.”",
              question: "꽃에 벽이 있는 김덕형을 보면서 예술가들이 사물을 바라보는 노력의 모습이 어떠해야 하는지 이야기해 보자.",
            },
            {
              title: '② 타고난 우둔함을 이겨낸 김득신의 치열한 독서기 (p.52~65)',
              text: "• 노력 (p.52): 만 번 이상 읽은 책이 36편에 달하고, 《백이전》은 1억 1만 3천(11만 3천) 번을 읽었다.\n• 우둔함 (p.55~60): 수만 번 읽은 《백이전》 구절을 우연히 길가다 듣지만 무슨 말인지 몰라 하인이 “맨날 서방님이 읽던 백이전 아닙니까?”라고 일러준다. 그러나 그는 안쓰러울 정도로 노력을 거듭해서 마침내 큰 시인이 되었다.\n• 황덕길 (p.65): “부족한 사람은 있어도 부족한 재능은 없다고 했다. 단순무식한 노력 앞에는 배겨날 장사가 없다. 되풀이해서 읽고 또 읽는 동안 내용이 골수에 박히고 정신이 자라, 안목과 식견이 툭 터지게 된다.”",
              question: '김득신의 치열한 독서기를 읽고, 타고난 우둔함을 이겨내는 노력에서 어떠한 교훈을 얻을 수 있을까?',
            },
            {
              title: '③ 권필과 송희갑, 정약용과 황상의 스승과 제자 (p.70~)',
              text: "• 송희갑은 시를 배우기 위해 강화도의 권필을 스승으로 모신다. 권필이 전염병에 걸리자 밤새 잠들지 못하고 약을 달여 올렸으며, 중국에 가서라도 시를 배우라는 스승의 농담 섞인 말에 압록강을 건너려 바다에서 밤낮으로 수영을 연습했다.\n• 황상이 자신은 머리가 나쁘고 앞뒤가 꼭 막혔고 분별력도 모자라 공부를 할 수 있을까 묻는다. 정약용은 부지런함으로 깨우친다면 다시는 막히지 않을 뚫림이 있을 것을 가르친다. 황상은 이 가르침을 60년이 넘도록 강직하게 실천하며 스승의 10주기에 예순이 넘은 나이로 16일 이상을 걸어 추모한다.",
              question: '권필과 송희갑, 정약용과 황상의 관계를 통해 참된 스승과 제자의 모습이 어떠하였는가를 이야기해 보자.',
            },
            {
              title: '④ 로댕과 정약용이 발견한 빛의 섬세한 변화 (p.274~279)',
              text: "• p.274: 정약용이 촛불과 국화로 벽에 그림자를 만든다. 가까운 그림자는 먹으로 그린 것처럼 박아놓았고, 먼 그림자는 불꽃을 따라 흔들리며 달빛에 일렁이는 나무 그림자를 만든다.\n• p.275: 로댕이 램프의 불꽃으로 조각상 위의 작은 요철들을 보여준다. 회전판 위로 돌아가는 조각상은 마치 체온이 느껴질 듯하다.\n• p.279: “그저 주는 눈길에 사물은 결코 제 비밀을 열어 보이지 않는다. 볼 줄 아는 눈, 들을 줄 아는 귀가 없이는 나는 본 것도 없고 들은 것도 없다. 고수들의 눈은 남들이 다 보면서도 보지 못하는 것들을 단번에 읽어낸다. 항상 깨어있기 때문일까?”",
              question: '로댕과 정약용은 예술가와 학자라는 다름에도 빛의 섬세한 변화를 찾아낸다. 이 두 사람의 무엇이 보통 사람이 가지지 못하는 느낌을 깨닫게 되는지 이야기해 보자.',
            },
          ],
        },
      },
      {
        id: 7,
        workbook_code: 'mania_essay',
        step_order: 3,
        step_type: 'DISCUSSION',
        step_title: '3단계: 함께 이야기 나누기 (심화 쟁점 토론)',
        step_badge: '비판적 사고',
        content: {
          debates: [
            {
              id: 'mania_deb_1',
              title: '쟁점 1: 벽(癖)의 긍정적 의미와 부정적 의미',
              positive:
                '긍정적 의미: 명말 문장가 장대(張岱)는 “사람이 벽(癖)이 없으면 더불어 사귈 수가 없다. 깊은 정과 참된 기운이 없기 때문이다”라고 했고, 청나라 장조(張潮)는 《유몽영》에서 “꽃에 나비가 없을 수 없고, 돌에는 이끼가 있어야 제격이고, 사람은 벽(癖)이 없어서는 안 된다”라고 했다.',
              negative:
                '부정적 의미: 벽(癖)이란 어떤 것에 대한 기호가 지나쳐서 억제할 수 없는 병적인 상태가 된 것을 뜻한다. 도벽, 노름벽, 주벽이란 단어들에서 짐작할 수 있듯 부정적인 뜻을 함축한다.',
              prompt: "단순한 중독·집착과 창조적 열정으로서의 '벽(癖)'을 구별하는 기준은 무엇이라고 생각하는가?",
            },
            {
              id: 'mania_deb_2',
              title: '쟁점 2: 이성인가 열정인가?',
              context:
                '벽(癖)은 통제의 영역이 아니라 일탈과 열정의 산물이다. 그럼에도 점잖고 근엄한 선비들이 벽을 옹호한 것은 이성이란 단어만으로는 복잡한 인간의 내면을 다 이해할 수 없으며, 깊고 뜨거운 열정 속에 삶의 비밀스러운 의미가 담겨 있기 때문은 아닐까?',
              prompt: "학문이나 예술에서 '차갑고 객관적인 이성'과 '뜨겁게 몰입하는 열정'은 어떤 관계를 맺어야 할까?",
            },
            {
              id: 'mania_deb_3',
              title: '쟁점 3: 김영의 천문기술과 장영실의 과학기술은 왜 후대로 이어지지 못했을까?',
              context:
                '김영은 뛰어난 천문기술로 벼슬자리까지 얻어 천문관이 되었으나, 그의 기술은 후세에 전하지 않는다. 도자기 기술과 장영실의 과학 기술도 당대로 끝나고 말았다. 조선시대의 신분 계층은 천문, 기술, 장인 등을 제대로 대우하지 않고 이를 문서로 기록하지 않았기 때문이다.',
              prompt: '기술과 장인의 노하우를 기록하고 존중하지 않았던 역사가 오늘날 우리 사회에 주는 시사점은 무엇인가?',
            },
          ],
        },
      },
      {
        id: 8,
        workbook_code: 'mania_essay',
        step_order: 4,
        step_type: 'ESSAY_WRITING',
        step_title: '4단계: 실전 논술 과제 & AI 멘토 첨삭 (500자)',
        step_badge: '실전 논술',
        content: {
          default_prompt_code: 'mania_essay_500',
        },
      },
    ],
    writing_prompts: [
      {
        id: 1,
        prompt_code: 'mania_essay_500',
        workbook_code: 'mania_essay',
        question_title:
          '우리 사회에 다양한 분야의 마니아들이 늘어나고 있다. 《미쳐야 미친다》의 인물들과 아래 읽기 자료를 참고하여, 이 마니아 문화(불광불급의 열정)의 발전이 사회와 나의 삶에 어떠한 영향을 미치는가를 논술하시오. (500자)',
        question_guide:
          '1) 불광불급(미치지 않으면 도달하지 못한다)의 핵심 의미, 2) 김득신·김덕형·정약용 등 책 속 인물의 사례와 현대 마니아 문화(제시문 1·2)의 연결, 3) 서론-본론-결론 3단 구성과 나의 삶(진로·공부·취미)에의 적용을 담아 작성해 보세요.',
        min_length: 300,
        recommended_length: 500,
        required_credits: 1,
        reading_materials: [
          {
            title: '읽기 자료 1: 과학은 마니아를 먹고 자란다 (김동광 / 과학저술가 · 고려대 강사)',
            content:
              "마니아(mania)는 단순한 애호가보다 좀더 적극적이고 능동적인 개념이다. 특정 분야에 관심을 가지고 그것을 즐기는 취미나 애호 차원을 넘어서 다양한 방식으로 참여해서 직접 연구를 하거나 개작 또는 제작을 한다. 수동적으로 받아들이는 소비자에 머물지 않고 해당 지식이나 산물의 생산에 참여하는 적극적 사용자(power user) 또는 개척적 사용자(early adopter)이다.\n\n일본의 ‘오타쿠’는 집요하리만큼 철저하게 한 분야를 파고들어 노벨상을 받은 ‘다나카’와 같은 문화적 토양이 되었고, 미국 1960~70년대 MIT 해커들의 동호회인 ‘홈브루 클럽’에서는 스티브 워즈니악과 스티브 잡스가 최초의 개인용 컴퓨터 애플 II 설계를 완성했다.\n\n최근 한국에서도 디지털 카메라(‘디시인사이드’), 노트북(‘노트북인사이드’, ‘노트기어’) 등 IT 사용자 모임의 ‘사용기’가 일반인들이 가장 신뢰하는 ‘동료평가’(peer review)의 장으로 부상하고 있다. 스스로를 ‘폐인’이라 부르며 실력을 연마한 전문가급 고수들이 아무런 대가 없이 자발적으로 초보들의 문제를 해결해주고 조언을 아끼지 않는 모습은 과학기술 문화의 새로운 움직임을 이끌어낼 맹아로 평가될 수 있다.",
          },
          {
            title: '읽기 자료 2: 시민 마니아가 밝혀낸 과학적 진실 (BRIC 사례)',
            content:
              "<여러분! 이 뉴스를 어떻게 전해야 될까요?>에서 황우석 박사의 줄기세포 논문이 거짓 데이터라는 사실의 결정적 근거를 BRIC(생물학전문연구정보센터 bric.postech.ac.kr)의 한 회원이 밝혔다. 유전생물과 관련하여 대학원에서 전공하였지만, 지금은 시골에서 감자농사를 하는 한 사람의 마니아가 전문가들이 놓친 결정적 증거로 한국을 비롯한 세계를 깜짝 놀라게 할 만한 변화를 일으켰다.",
          },
        ],
      },
    ],
    roadmap_books: INITIAL_ROADMAPS[2].books,
  },
};
