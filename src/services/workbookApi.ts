import {
  INITIAL_WORKBOOKS,
  INITIAL_ROADMAPS,
  WORKBOOK_DETAILS_MAP,
  WorkbookItem,
  RoadmapTheme,
  WorkbookDetailData,
} from '../data/studyGuideData';

export interface UserWallet {
  userid: string;
  free_trial_credits: number;
  paid_credits: number;
  total_used_credits: number;
  updated_at?: string;
}

export interface CreditTransaction {
  id: number;
  tx_type: 'FREE_GRANT' | 'CHARGE' | 'USE_ESSAY' | 'REFUND';
  amount: number;
  balance_free_after: number;
  balance_paid_after: number;
  payment_amount_krw: number;
  description: string;
  created_at: string;
}

export interface RubricScoreItem {
  criterion: string;
  score: number;
  max_score: number;
  comment: string;
}

export interface SentenceCorrectionItem {
  original: string;
  revised: string;
  reason: string;
}

export interface AiFeedbackResult {
  overall_praise: string;
  total_score: number;
  rubric_scores: RubricScoreItem[];
  strengths: string[];
  improvements: string[];
  sentence_corrections: SentenceCorrectionItem[];
  thinking_questions: string[];
  formatted_markdown?: string;
}

const API_BASE_CANDIDATES = [
  process.env.REACT_APP_API_BASE_URL,
  window.location.hostname === 'localhost' ? 'http://localhost:8000/api/workbook-app' : null,
  'https://www.readersguide.co.kr/api/workbook-app',
].filter(Boolean) as string[];

const LOCAL_WALLET_KEY = 'rg_workbook_wallet_v1';
const LOCAL_TX_KEY = 'rg_workbook_tx_v1';
const LOCAL_SUBMISSIONS_KEY = 'rg_workbook_submissions_v1';

export function getCurrentUserId(): string {
  const params = new URLSearchParams(window.location.search);
  const urlUser = params.get('userid') || params.get('user');
  if (urlUser) {
    localStorage.setItem('rg_workbook_userid', urlUser);
    return urlUser;
  }
  const saved = localStorage.getItem('rg_workbook_userid');
  if (saved) return saved;
  const generated = 'student_' + Math.random().toString(36).substring(2, 9);
  localStorage.setItem('rg_workbook_userid', generated);
  return generated;
}

async function tryFetchJson(path: string, options?: RequestInit): Promise<any | null> {
  for (const base of API_BASE_CANDIDATES) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), options?.method === 'POST' ? 35000 : 4500);
      const res = await fetch(`${base}${path}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options?.headers || {}),
        },
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (res.status === 402) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.detail || 'PAYMENT_REQUIRED');
      }
      if (res.ok) {
        return await res.json();
      }
    } catch (err: any) {
      if (err?.message?.includes('이용권') || err?.message === 'PAYMENT_REQUIRED') {
        throw err;
      }
      // continue to next candidate or fallback
    }
  }
  return null;
}

function getLocalWalletState(userid: string): { wallet: UserWallet; transactions: CreditTransaction[] } {
  const rawW = localStorage.getItem(`${LOCAL_WALLET_KEY}_${userid}`);
  const rawTx = localStorage.getItem(`${LOCAL_TX_KEY}_${userid}`);
  if (rawW && rawTx) {
    return {
      wallet: JSON.parse(rawW),
      transactions: JSON.parse(rawTx),
    };
  }
  const now = new Date().toISOString();
  const initialWallet: UserWallet = {
    userid,
    free_trial_credits: 3,
    paid_credits: 0,
    total_used_credits: 0,
    updated_at: now,
  };
  const initialTx: CreditTransaction[] = [
    {
      id: 1,
      tx_type: 'FREE_GRANT',
      amount: 3,
      balance_free_after: 3,
      balance_paid_after: 0,
      payment_amount_krw: 0,
      description: '신규 이용자 무료 AI 첨삭 체험권 3회 지급',
      created_at: now,
    },
  ];
  localStorage.setItem(`${LOCAL_WALLET_KEY}_${userid}`, JSON.stringify(initialWallet));
  localStorage.setItem(`${LOCAL_TX_KEY}_${userid}`, JSON.stringify(initialTx));
  return { wallet: initialWallet, transactions: initialTx };
}

export async function fetchDashboardData(): Promise<{
  workbooks: WorkbookItem[];
  roadmaps: RoadmapTheme[];
}> {
  const remote = await tryFetchJson('/dashboard');
  if (remote && Array.isArray(remote.workbooks) && remote.workbooks.length > 0) {
    return {
      workbooks: remote.workbooks,
      roadmaps: Array.isArray(remote.roadmaps) && remote.roadmaps.length > 0 ? remote.roadmaps : INITIAL_ROADMAPS,
    };
  }
  return {
    workbooks: INITIAL_WORKBOOKS,
    roadmaps: INITIAL_ROADMAPS,
  };
}

export async function fetchWorkbookDetail(workbookCode: string): Promise<WorkbookDetailData> {
  const remote = await tryFetchJson(`/workbooks/${workbookCode}`);
  if (remote && remote.workbook && Array.isArray(remote.steps) && remote.steps.length > 0) {
    return remote as WorkbookDetailData;
  }
  return WORKBOOK_DETAILS_MAP[workbookCode] || WORKBOOK_DETAILS_MAP.mania_essay;
}

export async function fetchUserWallet(userid: string): Promise<{
  wallet: UserWallet;
  transactions: CreditTransaction[];
}> {
  const remote = await tryFetchJson(`/wallet?userid=${encodeURIComponent(userid)}`);
  if (remote && remote.wallet) {
    localStorage.setItem(`${LOCAL_WALLET_KEY}_${userid}`, JSON.stringify(remote.wallet));
    if (remote.transactions) {
      localStorage.setItem(`${LOCAL_TX_KEY}_${userid}`, JSON.stringify(remote.transactions));
    }
    return remote;
  }
  return getLocalWalletState(userid);
}

export async function chargeUserWallet(
  userid: string,
  credits: number,
  paymentAmountKrw: number,
  description?: string
): Promise<{ wallet: UserWallet; transactions: CreditTransaction[] }> {
  const remote = await tryFetchJson('/wallet/charge', {
    method: 'POST',
    body: JSON.stringify({
      userid,
      credits,
      payment_amount_krw: paymentAmountKrw,
      description: description || `AI 글쓰기 첨삭권 ${credits}회 충전`,
    }),
  });
  if (remote && remote.wallet) {
    localStorage.setItem(`${LOCAL_WALLET_KEY}_${userid}`, JSON.stringify(remote.wallet));
    if (remote.transactions) {
      localStorage.setItem(`${LOCAL_TX_KEY}_${userid}`, JSON.stringify(remote.transactions));
    }
    return remote;
  }

  // Fallback local wallet update
  const state = getLocalWalletState(userid);
  const now = new Date().toISOString();
  const updatedWallet: UserWallet = {
    ...state.wallet,
    paid_credits: state.wallet.paid_credits + credits,
    updated_at: now,
  };
  const newTx: CreditTransaction = {
    id: Date.now(),
    tx_type: 'CHARGE',
    amount: credits,
    balance_free_after: updatedWallet.free_trial_credits,
    balance_paid_after: updatedWallet.paid_credits,
    payment_amount_krw: paymentAmountKrw,
    description: description || `AI 글쓰기 첨삭권 ${credits}회 충전`,
    created_at: now,
  };
  const updatedTx = [newTx, ...state.transactions].slice(0, 20);
  localStorage.setItem(`${LOCAL_WALLET_KEY}_${userid}`, JSON.stringify(updatedWallet));
  localStorage.setItem(`${LOCAL_TX_KEY}_${userid}`, JSON.stringify(updatedTx));
  return { wallet: updatedWallet, transactions: updatedTx };
}

export async function saveDraftSubmission(params: {
  userid: string;
  workbook_code: string;
  prompt_code: string;
  submitted_title: string;
  submitted_text: string;
  step_answers: Record<string, any>;
}): Promise<{ status: string }> {
  localStorage.setItem(
    `rg_draft_${params.userid}_${params.workbook_code}`,
    JSON.stringify({
      title: params.submitted_title,
      text: params.submitted_text,
      step_answers: params.step_answers,
      saved_at: new Date().toISOString(),
    })
  );
  await tryFetchJson('/submissions/draft', {
    method: 'POST',
    body: JSON.stringify(params),
  });
  return { status: 'saved' };
}

export function loadSavedDraft(userid: string, workbookCode: string): {
  title: string;
  text: string;
  step_answers: Record<string, any>;
  saved_at?: string;
} | null {
  const raw = localStorage.getItem(`rg_draft_${userid}_${workbookCode}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function buildSmartFallbackFeedback(
  workbookCode: string,
  title: string,
  text: string
): AiFeedbackResult {
  const sentences = text
    .split(/(?<=[.?!다요])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 5);

  if (workbookCode === 'gmo_kid') {
    const hasBothSides =
      (text.includes('치료') || text.includes('질병') || text.includes('좋은') || text.includes('찬성') || text.includes('도움')) &&
      (text.includes('나무') || text.includes('버려') || text.includes('반대') || text.includes('문제') || text.includes('생명') || text.includes('윤리'));
    const hasConversational = /했어요|같아요|거든요|인데요|랍니다/.test(text);
    const sampleConversational =
      sentences.find((s) => /했어요|같아요|거든요/.test(s)) ||
      sentences[0] ||
      '유전자 조작은 좋은 점도 있지만 위험한 것 같아요.';
    const revisedSentence = sampleConversational
      .replace(/것 같아요\.?$/, '것이라고 생각한다.')
      .replace(/했어요\.?$/, '했다.')
      .replace(/거든요\.?$/, '기 때문이다.');

    return {
      overall_praise: `🌟 우와! 《GMO 아이》를 읽고 '${title || '유전자 조작과 생명의 소중함'}'에 대해 자기 생각을 총 ${text.length}자로 아주 진지하고 정성스럽게 적어주었네요! 주인공 '나무'와 할아버지의 이야기를 바탕으로 과학기술과 생명의 가치를 스스로 고민한 점이 정말 멋져요! 👏`,
      total_score: hasBothSides ? 92 : 85,
      rubric_scores: [
        {
          criterion: '1. 개념의 쉬운 이해와 정리',
          score: 23,
          max_score: 25,
          comment: '유전자 변경(GMO)의 개념을 어렵지 않게 자기 말로 잘 풀어서 설명했어요.',
        },
        {
          criterion: '2. 찬성과 반대의 균형 잡힌 시각',
          score: hasBothSides ? 24 : 20,
          max_score: 25,
          comment: hasBothSides
            ? '질병 치료라는 장점과 생명 존엄성 문제라는 반대 입장을 모두 공평하게 살펴보았어요!'
            : '내 주장이 뚜렷해요! 여기에 반대편 입장(질병 치료의 장점 또는 나무처럼 버려지는 윤리 문제)도 한 문장 더 비교해주면 훨씬 깊은 글이 될 거예요.',
        },
        {
          criterion: '3. 초등 맞춤형 문장 및 3단 구성',
          score: hasConversational ? 21 : 24,
          max_score: 25,
          comment: hasConversational
            ? '글의 흐름이 자연스러워요. 다만 대화체(~했어요, ~같아요)를 논술문 어조(~다, ~라고 생각한다)로 바꾸면 더 멋져요!'
            : '서론-본론-결론의 흐름과 논술문 문장 어조(~다, ~라고 생각한다)가 아주 깔끔하게 정돈되어 있어요!',
        },
        {
          criterion: '4. 생명에 대한 성찰과 다짐',
          score: 22,
          max_score: 25,
          comment: '할아버지와 나무가 함께 자전거를 타며 흘린 땀의 가치를 통해 생명의 소중함을 잘 짚어냈어요.',
        },
      ],
      strengths: [
        `주인공 '나무'가 겪은 아픔이나 유전자 기술의 특징을 글 속에 자연스럽게 담아내어 읽는 사람이 공감하기 쉬워요.`,
        `${text.length}자 분량 동안 주제를 벗어나지 않고 끝까지 자기 생각을 차근차근 완성한 끈기가 돋보여요!`,
      ],
      improvements: [
        hasBothSides
          ? `찬성과 반대 이유를 잘 적어주었어요! 결론 부분에서 '그래서 우리 사회는 어떤 규칙을 세워야 할까?'에 대한 나만의 해결책을 한 줄 더 적어보면 어떨까요?`
          : `'내가 원하는 대로 디자인하는 아기'의 편리함 이면에 '부모의 사업이 망하자 버려진 나무의 마음'이나 '빈부격차 문제'를 함께 비교해보면 친구들이 더 깊이 이해할 수 있어요!`,
        hasConversational
          ? `대화할 때 쓰는 말투(~했어요, ~인 것 같아요)를 논술문 말투(~다, ~라고 생각한다)로 살짝 다듬어 보면 글이 훨씬 믿음직스러워 보여요.`
          : `문단과 문단 사이에 '첫째, 둘째, 마지막으로' 같은 이어주는 말을 넣으면 글의 구조가 한눈에 쏙 들어올 거예요!`,
      ],
      sentence_corrections: [
        {
          original: sampleConversational,
          revised:
            revisedSentence !== sampleConversational
              ? revisedSentence
              : '유전자 기술은 질병을 치료하는 데 도움을 주지만, 생명을 함부로 다루어서는 안 된다고 생각한다.',
          reason:
            '초등 논술문에서는 "~것 같아요"보다 "~라고 생각한다" 또는 "~다"로 끝맺으면 자기 주장이 훨씬 또렷하게 전달돼요! 😊',
        },
      ],
      thinking_questions: [
        '🌱 만약 미래에 누구나 돈을 내고 아기의 유전자를 마음대로 바꿀 수 있게 된다면, 부자 나라와 가난한 나라 사이에는 어떤 일이 벌어질까요?',
        '🚲 할아버지가 인공지능과 냉동 기술 대신 나무와 함께 자전거를 타며 흘린 땀을 아름답다고 느낀 진짜 이유는 무엇일까요?',
      ],
    };
  }

  // 미쳐야 미친다 (중·고등 논술 멘토 피드백)
  const hasKeyConcept = /불광불급|벽|미쳐야|몰입|열정/.test(text);
  const hasHistoricalPerson = /김득신|백이전|김덕형|백화보|정약용|황상|이옥|정철조|이덕무|허균|홍대용/.test(text);
  const firstSentence = sentences[0] || '미쳐야 미친다를 읽고 마니아에 대해 생각해보았다.';

  return {
    overall_praise: `《미쳐야 미친다》의 핵심 주제인 '불광불급(不狂不及)'과 열정의 가치를 총 ${text.length}자의 글 속에 진지하게 담아낸 훌륭한 논술문이야! ${
      hasHistoricalPerson
        ? '특히 책 속 조선 시대 인물의 구체적인 일화를 근거로 활용하여 주장의 설득력을 높인 점이 아주 돋보여.'
        : '자신이 생각하는 몰입과 마니아 문화의 의미를 진솔하게 풀어낸 점이 인상적이야.'
    }`,
    total_score: (hasKeyConcept ? 24 : 20) + (hasHistoricalPerson ? 24 : 19) + (text.length >= 400 ? 23 : 20) + 22,
    rubric_scores: [
      {
        criterion: '1. 핵심 개념(불광불급·벽) 파악',
        score: hasKeyConcept ? 24 : 20,
        max_score: 25,
        comment: hasKeyConcept
          ? '단순히 맹목적으로 집착하는 것과 자신의 분야에 영혼을 쏟아붓는 창조적 몰입(벽)의 차이를 잘 이해하고 있어.'
          : "'불광불급(미치지 않으면 도달하지 못한다)'의 개념을 서론에서 조금 더 명확히 정의해 주면 글의 중심축이 훨씬 단단해질 거야.",
      },
      {
        criterion: '2. 책 속 인물 근거의 적절성',
        score: hasHistoricalPerson ? 24 : 19,
        max_score: 25,
        comment: hasHistoricalPerson
          ? '책 속 인물의 치열한 일화를 주장의 근거로 적절히 인용하여 현대 사회의 마니아 문화와 잘 연결했어.'
          : '김득신(백이전 11만 번 독서), 김덕형(꽃 관찰), 정약용과 황상 등 책에 등장하는 인물의 구체적 사례를 한 가지 이상 인용해 보면 설득력이 배가될 거야.',
      },
      {
        criterion: '3. 논리 구조(서론-본론-결론) 및 문장력',
        score: text.length >= 400 ? 23 : 20,
        max_score: 25,
        comment:
          text.length >= 400
            ? '권장 분량(500자 내외)에 맞춰 서론-본론-결론의 3단 구성을 안정감 있게 전개했어.'
            : `현재 분량(${text.length}자)도 좋지만, 본론에서 제시문(과학·IT 마니아나 시민과학 사례)의 근거를 조금 더 보충해 500자 내외로 확장해 보면 좋겠어.`,
      },
      {
        criterion: '4. 삶과의 연결성 및 자기 성찰',
        score: 22,
        max_score: 25,
        comment: '옛 선비들의 태도를 오늘날 우리의 삶과 진로 태도로 확장하려는 성찰적 시각이 잘 드러나 있어.',
      },
    ],
    strengths: [
      `주제를 바라보는 자신만의 관점이 뚜렷하고, 마니아 문화가 개인의 취미를 넘어 사회 발전의 원동력이 될 수 있음을 잘 짚어냈어.`,
      hasHistoricalPerson
        ? `책 속 인물의 일화를 단순 나열하지 않고 '끈기와 몰입의 가치'라는 논지의 근거로 삼은 점이 무척 훌륭해.`
        : `자신의 경험과 생각을 솔직하게 서술하여 글에 진정성이 느껴져.`,
    ],
    improvements: [
      hasHistoricalPerson
        ? `이 부분은 인물의 태도가 '현대 사회의 마니아(예: 오픈소스 해커, 시민과학자 등)가 지식을 생산하는 모습'과 어떻게 닮아 있는지 한 문장 더 연결해 주면 주장이 한층 돋보일 것 같아.`
        : `본론에 《백이전》을 11만 3천 번 읽은 김득신이나 하루 종일 꽃을 관찰해 《백화보》를 쓴 김덕형의 사례를 구체적 근거로 넣어보면 어떨까?`,
      `결론부에서 '앞으로 열심히 해야겠다'라는 다짐에서 한 걸음 더 나아가, 내가 현재 가장 몰입하고 싶은 분야(진로·공부·탐구 주제)에 어떤 '벽(癖)'의 태도를 적용할지 구체적으로 적어보면 여운이 깊은 글이 될 거야.`,
    ],
    sentence_corrections: [
      {
        original: firstSentence,
        revised:
          '정민의 《미쳐야 미친다》가 전하는 ‘불광불급(不狂不及)’의 정신은, 남들의 시선에 얽매이지 않고 한 분야에 온전히 몰입할 때 비로소 새로운 경지에 도달할 수 있음을 일깨워 준다.',
        reason:
          '논술문의 첫 문장(도입부)을 핵심 개념어(불광불급)와 책의 주제를 아우르는 문장으로 시작하면 채점자에게 강한 인상을 줄 수 있어.',
      },
    ],
    thinking_questions: [
      '💡 출세나 생계의 수단으로 삼지 않고 오직 좋아서 몰입했던 18세기 선비들의 태도는, 스펙과 결과만 중시하는 오늘날 우리에게 어떤 질문을 던지고 있을까?',
      '🔍 내가 시간 가는 줄 모르고 빠져들 수 있는 나만의 건전한 ‘벽(癖)’은 무엇이며, 그것을 통해 사회에 어떤 긍정적 가치를 나누고 싶니?',
    ],
  };
}

export async function evaluateEssaySubmission(params: {
  userid: string;
  workbook_code: string;
  prompt_code: string;
  submitted_title: string;
  submitted_text: string;
  step_answers: Record<string, any>;
}): Promise<{
  submission_id: number;
  status: string;
  credit_type_used: 'FREE' | 'PAID';
  credits_used: number;
  wallet: UserWallet;
  feedback: AiFeedbackResult;
}> {
  // 1. Try Backend API first (where Hidden Gems prompt is injected on server)
  const remote = await tryFetchJson('/submissions/evaluate', {
    method: 'POST',
    body: JSON.stringify(params),
  });
  if (remote && remote.feedback && remote.wallet) {
    localStorage.setItem(`${LOCAL_WALLET_KEY}_${params.userid}`, JSON.stringify(remote.wallet));
    return remote;
  }

  // 2. Fallback wallet check & deduction if backend server is unreachable
  const state = getLocalWalletState(params.userid);
  const totalAvailable = state.wallet.free_trial_credits + state.wallet.paid_credits;
  if (totalAvailable < 1) {
    throw new Error('글쓰기 AI 첨삭 이용권(크레딧)이 부족합니다. 상단 [이용권 충전] 버튼을 눌러 충전해 주세요.');
  }

  let newFree = state.wallet.free_trial_credits;
  let newPaid = state.wallet.paid_credits;
  let creditType: 'FREE' | 'PAID' = 'FREE';
  if (newFree >= 1) {
    newFree -= 1;
    creditType = 'FREE';
  } else {
    newPaid -= 1;
    creditType = 'PAID';
  }

  const now = new Date().toISOString();
  const updatedWallet: UserWallet = {
    ...state.wallet,
    free_trial_credits: newFree,
    paid_credits: newPaid,
    total_used_credits: state.wallet.total_used_credits + 1,
    updated_at: now,
  };

  const feedback = buildSmartFallbackFeedback(
    params.workbook_code,
    params.submitted_title,
    params.submitted_text
  );

  const subId = Date.now();
  const newTx: CreditTransaction = {
    id: subId,
    tx_type: 'USE_ESSAY',
    amount: -1,
    balance_free_after: newFree,
    balance_paid_after: newPaid,
    payment_amount_krw: 0,
    description: `AI 독서논술 첨삭 (${params.workbook_code === 'gmo_kid' ? 'GMO 아이' : '미쳐야 미친다'}) - ${
      creditType === 'FREE' ? '무료체험권' : '유료이용권'
    } 1회 사용`,
    created_at: now,
  };

  localStorage.setItem(`${LOCAL_WALLET_KEY}_${params.userid}`, JSON.stringify(updatedWallet));
  localStorage.setItem(
    `${LOCAL_TX_KEY}_${params.userid}`,
    JSON.stringify([newTx, ...state.transactions].slice(0, 20))
  );

  const existingSubs = JSON.parse(localStorage.getItem(`${LOCAL_SUBMISSIONS_KEY}_${params.userid}`) || '[]');
  existingSubs.unshift({
    id: subId,
    workbook_code: params.workbook_code,
    prompt_code: params.prompt_code,
    submitted_title: params.submitted_title,
    submitted_text: params.submitted_text,
    char_count: params.submitted_text.length,
    credit_type_used: creditType,
    credits_used: 1,
    feedback,
    created_at: now,
  });
  localStorage.setItem(`${LOCAL_SUBMISSIONS_KEY}_${params.userid}`, JSON.stringify(existingSubs.slice(0, 20)));

  return {
    submission_id: subId,
    status: 'COMPLETED',
    credit_type_used: creditType,
    credits_used: 1,
    wallet: updatedWallet,
    feedback,
  };
}
