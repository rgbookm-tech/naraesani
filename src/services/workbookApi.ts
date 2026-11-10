import {
  INITIAL_WORKBOOKS,
  INITIAL_ROADMAPS,
  INITIAL_CURRICULUM_STANDARDS,
  WORKBOOK_DETAILS_MAP,
  WorkbookItem,
  RoadmapTheme,
  WorkbookDetailData,
  CurriculumStandard,
} from '../data/studyGuideData';

export interface RgMemberUser {
  userid: string;
  nickname: string;
  username?: string;
  mileage: number;
  level?: number;
  permission?: number;
  is_admin: boolean;
}

export interface UserWallet {
  userid: string;
  free_trial_credits: number;
  paid_credits: number;
  total_used_credits: number;
  is_rg_member?: boolean;
  nickname?: string;
  member_mileage?: number;
  is_admin?: boolean;
  updated_at?: string;
}

export interface CreditTransaction {
  id: number;
  tx_type: 'FREE_GRANT' | 'CHARGE' | 'USE_ESSAY' | 'USE_QUESTION' | 'REFUND';
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

export interface DynamicThemeItem {
  key: string;
  label: string;
  count: number;
}

const API_BASE_CANDIDATES = [
  process.env.REACT_APP_API_BASE_URL,
  window.location.hostname === 'localhost' ? 'http://localhost:8000/api/workbook-app' : null,
  'https://www.readersguide.co.kr/api/workbook-app',
].filter(Boolean) as string[];

const LOCAL_WALLET_KEY = 'rg_workbook_wallet_v2';
const LOCAL_TX_KEY = 'rg_workbook_tx_v2';
const LOCAL_SUBMISSIONS_KEY = 'rg_workbook_submissions_v2';
const LOCAL_TOKEN_KEY = 'rg_workbook_jwt_token';
const LOCAL_USER_KEY = 'rg_workbook_member_user';
const LOCAL_CUSTOM_WORKBOOKS_KEY = 'rg_workbook_custom_catalog_v1';
const LOCAL_CUSTOM_DETAILS_KEY = 'rg_workbook_custom_details_v1';
const LOCAL_CUSTOM_CURRICULUM_KEY = 'rg_workbook_custom_curriculum_v1';

export function getAuthToken(): string | null {
  const params = new URLSearchParams(window.location.search);
  const urlToken = params.get('token') || params.get('jwt');
  if (urlToken) {
    localStorage.setItem(LOCAL_TOKEN_KEY, urlToken);
    return urlToken;
  }
  return (
    localStorage.getItem(LOCAL_TOKEN_KEY) ||
    localStorage.getItem('access_token') ||
    localStorage.getItem('jwt_token') ||
    null
  );
}

export function getSavedMemberUser(): RgMemberUser | null {
  const raw = localStorage.getItem(LOCAL_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getCurrentUserId(): string {
  const savedUser = getSavedMemberUser();
  if (savedUser?.userid) return savedUser.userid;

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
  const token = getAuthToken();
  for (const base of API_BASE_CANDIDATES) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), options?.method === 'POST' ? 35000 : 5000);
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...((options?.headers as Record<string, string>) || {}),
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const res = await fetch(`${base}${path}`, {
        ...options,
        headers,
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (res.status === 401 || res.status === 402 || res.status === 400) {
        const errBody = await res.json().catch(() => ({}));
        if (errBody.detail) {
          throw new Error(errBody.detail);
        }
      }
      if (res.ok) {
        return await res.json();
      }
    } catch (err: any) {
      if (
        err?.message?.includes('마일리지') ||
        err?.message?.includes('이용권') ||
        err?.message?.includes('비밀번호') ||
        err?.message?.includes('아이디') ||
        err?.message === 'PAYMENT_REQUIRED'
      ) {
        throw err;
      }
    }
  }
  return null;
}

function getLocalWalletState(userid: string): { wallet: UserWallet; transactions: CreditTransaction[] } {
  const savedUser = getSavedMemberUser();
  const rawW = localStorage.getItem(`${LOCAL_WALLET_KEY}_${userid}`);
  const rawTx = localStorage.getItem(`${LOCAL_TX_KEY}_${userid}`);
  if (rawW && rawTx) {
    const parsedW: UserWallet = JSON.parse(rawW);
    if (savedUser && savedUser.userid === userid) {
      parsedW.is_rg_member = true;
      parsedW.nickname = savedUser.nickname;
      parsedW.is_admin = savedUser.is_admin;
      if (parsedW.member_mileage === undefined) {
        parsedW.member_mileage = savedUser.mileage;
      }
    }
    return {
      wallet: parsedW,
      transactions: JSON.parse(rawTx),
    };
  }
  const now = new Date().toISOString();
  const initialWallet: UserWallet = {
    userid,
    free_trial_credits: 3,
    paid_credits: 0,
    total_used_credits: 0,
    is_rg_member: Boolean(savedUser && savedUser.userid === userid),
    nickname: savedUser?.nickname || '게스트 체험',
    member_mileage: savedUser?.mileage || 0,
    is_admin: Boolean(savedUser?.is_admin),
    updated_at: now,
  };
  const initialTx: CreditTransaction[] = [
    {
      id: 1,
      tx_type: 'FREE_GRANT',
      amount: 3,
      balance_free_after: 3,
      balance_paid_after: initialWallet.member_mileage || 0,
      payment_amount_krw: 0,
      description: '신규 이용자 무료 AI 첨삭 체험권 3회 지급',
      created_at: now,
    },
  ];
  localStorage.setItem(`${LOCAL_WALLET_KEY}_${userid}`, JSON.stringify(initialWallet));
  localStorage.setItem(`${LOCAL_TX_KEY}_${userid}`, JSON.stringify(initialTx));
  return { wallet: initialWallet, transactions: initialTx };
}

// ─── 리더스가이드 회원 로그인 / 로그아웃 / 상태 확인 ─────────────────────────

export async function loginReadersGuideMember(
  userid: string,
  password: string
): Promise<{ user: RgMemberUser; wallet: UserWallet }> {
  const remote = await tryFetchJson('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ userid, password }),
  });
  if (remote && remote.access_token && remote.user) {
    localStorage.setItem(LOCAL_TOKEN_KEY, remote.access_token);
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(remote.user));
    localStorage.setItem('rg_workbook_userid', remote.user.userid);
    if (remote.wallet) {
      localStorage.setItem(`${LOCAL_WALLET_KEY}_${remote.user.userid}`, JSON.stringify(remote.wallet));
    }
    return { user: remote.user, wallet: remote.wallet };
  }

  // Fallback: 리더스가이드 기본 /auth/token/ OAuth2 폼 로그인 시도
  try {
    const formBody = new URLSearchParams();
    formBody.append('username', userid.trim());
    formBody.append('password', password);
    const res = await fetch('https://www.readersguide.co.kr/api/auth/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formBody.toString(),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || '아이디 또는 비밀번호를 확인해 주세요.');
    }
    const tokenData = await res.json();
    const token = tokenData.access_token;
    localStorage.setItem(LOCAL_TOKEN_KEY, token);

    // 회원 프로필 조회
    const meRes = await fetch('https://www.readersguide.co.kr/api/auth/users/me/', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (meRes.ok) {
      const me = await meRes.json();
      const userObj: RgMemberUser = {
        userid: me.userid,
        nickname: me.nickname || me.username || me.userid,
        username: me.username,
        mileage: Number(me.mileage || 0),
        level: Number(me.level || 1),
        permission: Number(me.permission || 1),
        is_admin:
          me.userid === '알지' ||
          me.userid === 'admin' ||
          Number(me.permission || 0) >= 9 ||
          Number(me.level || 0) >= 9,
      };
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(userObj));
      localStorage.setItem('rg_workbook_userid', userObj.userid);
      const wState = getLocalWalletState(userObj.userid);
      wState.wallet.is_rg_member = true;
      wState.wallet.nickname = userObj.nickname;
      wState.wallet.member_mileage = userObj.mileage;
      wState.wallet.is_admin = userObj.is_admin;
      localStorage.setItem(`${LOCAL_WALLET_KEY}_${userObj.userid}`, JSON.stringify(wState.wallet));
      return { user: userObj, wallet: wState.wallet };
    }
  } catch (e: any) {
    throw new Error(e?.message || '로그인에 실패했습니다.');
  }

  throw new Error('로그인 서버에 연결할 수 없습니다.');
}

export function logoutReadersGuideMember(): void {
  localStorage.removeItem(LOCAL_TOKEN_KEY);
  localStorage.removeItem(LOCAL_USER_KEY);
  const guestId = 'student_' + Math.random().toString(36).substring(2, 9);
  localStorage.setItem('rg_workbook_userid', guestId);
}

// ─── 대시보드 & 동적 주제 집계 & NCIC 교육과정 조회 ──────────────────────────

function computeDynamicThemes(workbooks: WorkbookItem[]): DynamicThemeItem[] {
  const counter: Record<string, number> = {};
  for (const wb of workbooks) {
    const tags = Array.isArray(wb.theme_tags) && wb.theme_tags.length > 0 ? wb.theme_tags : [wb.theme_category];
    for (const t of tags) {
      if (t) counter[t] = (counter[t] || 0) + 1;
    }
  }
  return Object.entries(counter)
    .sort((a, b) => b[1] - a[1])
    .map(([key, count]) => ({ key, label: key, count }));
}

function mergeLocalCustomWorkbooks(baseList: WorkbookItem[]): WorkbookItem[] {
  const raw = localStorage.getItem(LOCAL_CUSTOM_WORKBOOKS_KEY);
  if (!raw) return baseList;
  try {
    const customs: WorkbookItem[] = JSON.parse(raw);
    const map = new Map<string, WorkbookItem>();
    for (const item of baseList) map.set(item.code, item);
    for (const c of customs) map.set(c.code, c);
    return Array.from(map.values());
  } catch {
    return baseList;
  }
}

function mergeLocalCustomCurriculum(baseList: CurriculumStandard[]): CurriculumStandard[] {
  const raw = localStorage.getItem(LOCAL_CUSTOM_CURRICULUM_KEY);
  if (!raw) return baseList;
  try {
    const customs: CurriculumStandard[] = JSON.parse(raw);
    const map = new Map<string, CurriculumStandard>();
    for (const item of baseList) map.set(item.curriculum_code, item);
    for (const c of customs) map.set(c.curriculum_code, c);
    return Array.from(map.values());
  } catch {
    return baseList;
  }
}

export async function fetchDashboardData(): Promise<{
  workbooks: WorkbookItem[];
  curriculum_standards: CurriculumStandard[];
  dynamic_themes: DynamicThemeItem[];
  roadmaps: RoadmapTheme[];
}> {
  const remote = await tryFetchJson('/dashboard');
  if (remote && Array.isArray(remote.workbooks) && remote.workbooks.length > 0) {
    const mergedWbs = mergeLocalCustomWorkbooks(remote.workbooks);
    const mergedCurr = mergeLocalCustomCurriculum(
      Array.isArray(remote.curriculum_standards) && remote.curriculum_standards.length > 0
        ? remote.curriculum_standards
        : INITIAL_CURRICULUM_STANDARDS
    );
    return {
      workbooks: mergedWbs,
      curriculum_standards: mergedCurr,
      dynamic_themes: computeDynamicThemes(mergedWbs),
      roadmaps: Array.isArray(remote.roadmaps) && remote.roadmaps.length > 0 ? remote.roadmaps : INITIAL_ROADMAPS,
    };
  }
  const fallbackWbs = mergeLocalCustomWorkbooks(INITIAL_WORKBOOKS);
  const fallbackCurr = mergeLocalCustomCurriculum(INITIAL_CURRICULUM_STANDARDS);
  return {
    workbooks: fallbackWbs,
    curriculum_standards: fallbackCurr,
    dynamic_themes: computeDynamicThemes(fallbackWbs),
    roadmaps: INITIAL_ROADMAPS,
  };
}

export async function fetchWorkbookDetail(workbookCode: string): Promise<WorkbookDetailData> {
  const remote = await tryFetchJson(`/workbooks/${workbookCode}`);
  if (remote && remote.workbook && Array.isArray(remote.steps) && remote.steps.length > 0) {
    return remote as WorkbookDetailData;
  }
  const rawCustom = localStorage.getItem(LOCAL_CUSTOM_DETAILS_KEY);
  if (rawCustom) {
    try {
      const customMap: Record<string, WorkbookDetailData> = JSON.parse(rawCustom);
      if (customMap[workbookCode]) {
        return customMap[workbookCode];
      }
    } catch {
      // ignore
    }
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
      description: description || `AI 마일리지/이용권 충전`,
    }),
  });
  if (remote && remote.wallet) {
    localStorage.setItem(`${LOCAL_WALLET_KEY}_${userid}`, JSON.stringify(remote.wallet));
    if (remote.transactions) {
      localStorage.setItem(`${LOCAL_TX_KEY}_${userid}`, JSON.stringify(remote.transactions));
    }
    return remote;
  }

  const state = getLocalWalletState(userid);
  const now = new Date().toISOString();
  const addedMileage = state.wallet.is_rg_member ? credits * 300 : 0;
  const updatedWallet: UserWallet = {
    ...state.wallet,
    paid_credits: state.wallet.is_rg_member ? state.wallet.paid_credits : state.wallet.paid_credits + credits,
    member_mileage: (state.wallet.member_mileage || 0) + addedMileage,
    updated_at: now,
  };
  const newTx: CreditTransaction = {
    id: Date.now(),
    tx_type: 'CHARGE',
    amount: state.wallet.is_rg_member ? addedMileage : credits,
    balance_free_after: updatedWallet.free_trial_credits,
    balance_paid_after: state.wallet.is_rg_member ? updatedWallet.member_mileage || 0 : updatedWallet.paid_credits,
    payment_amount_krw: paymentAmountKrw,
    description:
      description ||
      (state.wallet.is_rg_member ? `[마일리지 충전] +${addedMileage}P` : `AI 글쓰기 첨삭권 ${credits}회 충전`),
    created_at: now,
  };
  const updatedTx = [newTx, ...state.transactions].slice(0, 20);
  localStorage.setItem(`${LOCAL_WALLET_KEY}_${userid}`, JSON.stringify(updatedWallet));
  localStorage.setItem(`${LOCAL_TX_KEY}_${userid}`, JSON.stringify(updatedTx));
  return { wallet: updatedWallet, transactions: updatedTx };
}

// ─── AI 도우미에게 질문하기 (마일리지 차감 연동) ─────────────────────────────

export async function askAiTutorQuestion(params: {
  userid: string;
  workbook_code: string;
  step_title?: string;
  question: string;
  context_text?: string;
  cost_mileage?: number;
}): Promise<{
  answer: string;
  deducted_mileage: number;
  wallet: UserWallet;
}> {
  const remote = await tryFetchJson('/ai/ask-question', {
    method: 'POST',
    body: JSON.stringify(params),
  });
  if (remote && remote.answer && remote.wallet) {
    localStorage.setItem(`${LOCAL_WALLET_KEY}_${params.userid}`, JSON.stringify(remote.wallet));
    return remote;
  }

  // Fallback local mileage / trial deduction
  const cost = params.cost_mileage || 50;
  const state = getLocalWalletState(params.userid);
  const w = state.wallet;
  const now = new Date().toISOString();

  if (w.is_rg_member && (w.member_mileage || 0) >= cost) {
    w.member_mileage = (w.member_mileage || 0) - cost;
  } else if (w.free_trial_credits > 0) {
    w.free_trial_credits -= 1;
  } else if (w.paid_credits > 0) {
    w.paid_credits -= 1;
  } else {
    throw new Error(`AI 질문에 필요한 마일리지(${cost}P) 또는 무료 체험권이 부족합니다.`);
  }
  w.total_used_credits += 1;
  w.updated_at = now;
  localStorage.setItem(`${LOCAL_WALLET_KEY}_${params.userid}`, JSON.stringify(w));

  return {
    answer: `💡 질문해주신 "${params.question}"에 대해 함께 생각해 볼까요?\n책 속 인물이 처한 상황과 입장을 먼저 떠올려 본 뒤, '왜 그런 선택을 했을까?'와 '내가 그 인물이라면 어떻게 했을까?'를 비교해 보면 훨씬 깊이 있는 답을 찾을 수 있어요!`,
    deducted_mileage: w.is_rg_member ? cost : 0,
    wallet: w,
  };
}

// ─── 글쓰기 초안 저장 및 AI 첨삭 ────────────────────────────────────────────

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
  credit_type_used: 'MILEAGE' | 'FREE' | 'PAID';
  credits_used: number;
  wallet: UserWallet;
  feedback: AiFeedbackResult;
}> {
  const remote = await tryFetchJson('/submissions/evaluate', {
    method: 'POST',
    body: JSON.stringify(params),
  });
  if (remote && remote.feedback && remote.wallet) {
    localStorage.setItem(`${LOCAL_WALLET_KEY}_${params.userid}`, JSON.stringify(remote.wallet));
    return remote;
  }

  const state = getLocalWalletState(params.userid);
  const w = state.wallet;
  const costMileage = params.workbook_code === 'gmo_kid' ? 200 : 300;
  let creditType: 'MILEAGE' | 'FREE' | 'PAID' = 'FREE';
  let newFree = w.free_trial_credits;
  let newPaid = w.paid_credits;
  let newMileage = w.member_mileage || 0;

  if (w.is_rg_member && newMileage >= costMileage) {
    newMileage -= costMileage;
    creditType = 'MILEAGE';
  } else if (newFree >= 1) {
    newFree -= 1;
    creditType = 'FREE';
  } else if (newPaid >= 1) {
    newPaid -= 1;
    creditType = 'PAID';
  } else {
    throw new Error(
      w.is_rg_member
        ? `보유 마일리지(${newMileage}P)가 부족합니다. (필요: ${costMileage}P)`
        : '무료 AI 첨삭 체험권을 모두 사용했습니다. 상단 [회원 로그인] 또는 [이용권 충전]을 이용해 주세요.'
    );
  }

  const now = new Date().toISOString();
  const updatedWallet: UserWallet = {
    ...w,
    free_trial_credits: newFree,
    paid_credits: newPaid,
    member_mileage: newMileage,
    total_used_credits: w.total_used_credits + 1,
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
    amount: creditType === 'MILEAGE' ? -costMileage : -1,
    balance_free_after: newFree,
    balance_paid_after: creditType === 'MILEAGE' ? newMileage : newPaid,
    payment_amount_krw: 0,
    description: `[독서활동앱] AI 글쓰기 첨삭 (${params.workbook_code}) - ${
      creditType === 'MILEAGE' ? `${costMileage} 마일리지 차감` : '무료체험권 사용'
    }`,
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
    credits_used: creditType === 'MILEAGE' ? costMileage : 1,
    feedback,
    created_at: now,
  });
  localStorage.setItem(`${LOCAL_SUBMISSIONS_KEY}_${params.userid}`, JSON.stringify(existingSubs.slice(0, 20)));

  return {
    submission_id: subId,
    status: 'COMPLETED',
    credit_type_used: creditType,
    credits_used: creditType === 'MILEAGE' ? costMileage : 1,
    wallet: updatedWallet,
    feedback,
  };
}

// ─── 관리자 메뉴 전용 API 함수들 ──────────────────────────────────────────────

export async function searchAdminBooks(query: string): Promise<any[]> {
  const remote = await tryFetchJson(`/admin/books/search?q=${encodeURIComponent(query)}`);
  if (remote && Array.isArray(remote.books)) {
    return remote.books;
  }
  return [];
}

export async function recommendAdminCurriculum(payload: {
  title: string;
  subtitle?: string;
  grade_group?: string;
  subject_category?: string;
  keywords?: string[];
  synopsis?: string;
}): Promise<Array<{ curriculum_id: number; is_primary: number; linkage_note: string }>> {
  const remote = await tryFetchJson('/admin/curriculum/recommend', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (remote && Array.isArray(remote.recommendations)) {
    return remote.recommendations;
  }
  // 로컬 폴백 추천
  const all = mergeLocalCustomCurriculum(INITIAL_CURRICULUM_STANDARDS);
  const matched = all.filter(
    (c) => c.grade_group === payload.grade_group || c.subject_category === payload.subject_category
  );
  const picks = (matched.length > 0 ? matched : all).slice(0, 2);
  return picks.map((p, idx) => ({
    curriculum_id: p.id,
    is_primary: idx === 0 ? 1 : 0,
    linkage_note: `[${p.grade_label} · ${p.subject_category}] '${p.domain_name}' 교육목표와 연계된 독서·사고력 활동`,
  }));
}

export async function saveAdminCurriculum(payload: CurriculumStandard): Promise<{ status: string }> {
  const remote = await tryFetchJson('/admin/curriculum', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  const raw = localStorage.getItem(LOCAL_CUSTOM_CURRICULUM_KEY);
  const list: CurriculumStandard[] = raw ? JSON.parse(raw) : [];
  const filtered = list.filter((c) => c.curriculum_code !== payload.curriculum_code);
  filtered.push({ ...payload, id: payload.id || Date.now() });
  localStorage.setItem(LOCAL_CUSTOM_CURRICULUM_KEY, JSON.stringify(filtered));
  return remote || { status: 'ok' };
}

export async function fetchAdminWorkbookFull(workbookCode: string): Promise<WorkbookDetailData> {
  const remote = await tryFetchJson(`/admin/workbooks/${workbookCode}/full`);
  if (remote && remote.workbook) {
    return remote as WorkbookDetailData;
  }
  return fetchWorkbookDetail(workbookCode);
}

export async function saveAdminWorkbook(payload: any): Promise<{ status: string; code: string }> {
  const remote = await tryFetchJson('/admin/workbooks', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  // 로컬 캐시에도 반영하여 즉시 대시보드와 상세 화면에서 확인 가능하게 처리
  const rawWbs = localStorage.getItem(LOCAL_CUSTOM_WORKBOOKS_KEY);
  const wbList: WorkbookItem[] = rawWbs ? JSON.parse(rawWbs) : [];
  const wbItem: WorkbookItem = {
    id: payload.id || Date.now(),
    code: payload.code,
    bookno: payload.bookno || null,
    isbn: payload.isbn || null,
    title: payload.title,
    subtitle: payload.subtitle || '',
    author: payload.author || '',
    publisher: payload.publisher || '',
    target_group: payload.grade_group,
    grade_group: payload.grade_group,
    target_label: payload.target_label,
    subject_category: payload.subject_category,
    basic_skill_category: payload.basic_skill_category,
    theme_category: payload.theme_category,
    theme_tags: payload.theme_tags || [payload.theme_category],
    duration_minutes: Number(payload.duration_minutes || 60),
    keywords: payload.keywords || [],
    cover_emoji: payload.cover_emoji || '📘',
    badge_color: payload.badge_color || 'emerald',
    template_mode: payload.template_mode || 'STANDARD_GUIDE',
    is_builtin_interactive: Number(payload.is_builtin_interactive || 0),
    is_free_content: 1,
    ai_question_mileage: Number(payload.ai_question_mileage || 50),
    ai_essay_mileage: Number(payload.ai_essay_mileage || 300),
    purchase_url: payload.bookno ? `https://www.readersguide.co.kr/book/${payload.bookno}` : null,
    curriculum_links: payload.curriculum_links || [],
  };
  const nextList = wbList.filter((w) => w.code !== wbItem.code);
  nextList.push(wbItem);
  localStorage.setItem(LOCAL_CUSTOM_WORKBOOKS_KEY, JSON.stringify(nextList));

  const rawDetails = localStorage.getItem(LOCAL_CUSTOM_DETAILS_KEY);
  const detailsMap: Record<string, WorkbookDetailData> = rawDetails ? JSON.parse(rawDetails) : {};
  detailsMap[wbItem.code] = {
    workbook: wbItem,
    steps: payload.steps || [],
    writing_prompts: payload.writing_prompt ? [payload.writing_prompt] : [],
    roadmap_books: [],
    gem_config: payload.gem_config || null,
  };
  localStorage.setItem(LOCAL_CUSTOM_DETAILS_KEY, JSON.stringify(detailsMap));

  return remote || { status: 'saved', code: payload.code };
}

export async function deleteAdminWorkbook(workbookCode: string): Promise<void> {
  await tryFetchJson(`/admin/workbooks/${workbookCode}`, { method: 'DELETE' });
  const rawWbs = localStorage.getItem(LOCAL_CUSTOM_WORKBOOKS_KEY);
  if (rawWbs) {
    const wbList: WorkbookItem[] = JSON.parse(rawWbs);
    localStorage.setItem(
      LOCAL_CUSTOM_WORKBOOKS_KEY,
      JSON.stringify(wbList.filter((w) => w.code !== workbookCode))
    );
  }
}
