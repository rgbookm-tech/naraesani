import React, { useState, useEffect } from 'react';
import { WorkbookDetailData, INTERACTIVE_ACTIVITY_TYPES } from '../../data/studyGuideData';
import {
  fetchWorkbookDetail,
  saveDraftSubmission,
  loadSavedDraft,
  evaluateEssaySubmission,
  askAiTutorQuestion,
  AiFeedbackResult,
  UserWallet,
  RgMemberUser,
} from '../../services/workbookApi';
import ConsonantActivityHost from '../consonant/ActivityHost';

interface StudyGuideWorkbookProps {
  workbookCode: string;
  userid: string;
  wallet: UserWallet;
  currentUser?: RgMemberUser | null;
  onWalletChange: (newWallet: UserWallet) => void;
  onOpenWalletModal: () => void;
  onOpenMemberModal?: () => void;
  onOpenAdminModal?: (editCode?: string) => void;
  onGoHome: () => void;
  onSelectWorkbook: (code: string) => void;
}

const SAMPLE_ESSAYS: Record<string, { title: string; text: string }> = {
  mania_essay: {
    title: '불광불급(不狂不及), 시대를 바꾸는 열정의 힘',
    text: `정민 작가의 《미쳐야 미친다》를 관통하는 핵심 정신은 ‘불광불급(不狂不及)’, 즉 미치지 않으면 결코 높은 경지에 도달하지 못한다는 것이다. 여기서 ‘미친다(벽·癖)’는 것은 세상의 기준을 잃은 맹목적인 중독이 아니라, 출세나 생계의 수단을 떠나 대상 자체를 사랑하고 영혼을 쏟아붓는 순수한 몰입을 뜻한다.\n\n책 속에서 가장 깊은 울림을 준 인물은 독서광 김득신이다. 그는 타고난 우둔함 때문에 남들에게 비웃음을 사기도 했지만, 좌절하지 않고 《백이전》을 무려 11만 3천 번이나 되풀이해 읽으며 마침내 당대 최고의 시인이 되었다. 또한 1년 내내 꽃밭에 누워 꽃술과 잎새를 관찰해 《백화보》를 남긴 김덕형과, 제자 황상에게 부지런함의 가치를 일깨운 정약용의 모습은 진정한 앎이 치열한 관찰과 몰입에서 탄생함을 보여준다.\n\n오늘날에도 이러한 ‘벽(癖)’의 정신은 마니아 문화로 이어져 사회 발전의 원동력이 되고 있다. 차고 동호회에서 개인용 컴퓨터를 탄생시킨 해커들이나, 날카로운 눈으로 과학적 진실을 밝혀낸 시민 마니아처럼 능동적인 마니아들은 지식을 생산하고 공유한다. 나 역시 남들의 시선이나 눈앞의 성적에만 급급하기보다, 내가 진정으로 좋아하는 탐구 분야에 김득신처럼 끈기 있게 몰입하는 건전한 ‘벽’을 키워나가고 싶다.`,
  },
  gmo_kid: {
    title: '나무와 할아버지가 알려준 진짜 생명의 가치',
    text: `《GMO 아이》에 나오는 ‘GMO(유전자변형생물체) 아이’는 질병에 걸리지 않고 뛰어난 능력을 갖도록 태어나기 전부터 유전자를 인위적으로 고쳐서 만든 아기를 뜻한다. 주인공 ‘나무’도 우성 유전자를 가지고 태어났지만, 부모님의 사업이 망하자 헌신짝처럼 할아버지 집 앞에 버려지고 말았다.\n\n유전자 조작 기술은 찬성과 반대 입장이 뚜렷하게 나뉜다. 찬성하는 입장에서는 유전자 기술로 고치기 힘든 희귀병을 치료하고 인간의 수명을 늘리며 식량 부족 문제를 해결할 수 있다고 말한다. 하지만 반대하는 입장에서는 부모가 원하는 대로 아기를 물건처럼 디자인하고, ‘나무’처럼 필요 없어지면 버리는 등 생명의 존엄성이 무너질 수 있다고 걱정한다. 또한 돈이 많은 사람만 좋은 유전자를 가지게 되어 불평등이 심해질 수도 있다.\n\n나는 과학 기술로 아픈 사람을 치료하는 것은 좋지만, 인간의 생명을 마음대로 조작하고 차별해서는 안 된다고 생각한다. 할아버지가 냉동 기술 대신 나무와 함께 자전거를 타며 직접 흘린 땀이 아름답다고 깨달은 것처럼, 부족한 점이 있더라도 있는 그대로의 생명을 사랑하고 존중하는 미래가 되었으면 좋겠다.`,
  },
};

const StudyGuideWorkbook: React.FC<StudyGuideWorkbookProps> = ({
  workbookCode,
  userid,
  wallet,
  currentUser,
  onWalletChange,
  onOpenWalletModal,
  onOpenMemberModal,
  onOpenAdminModal,
  onGoHome,
  onSelectWorkbook,
}) => {
  const [detail, setDetail] = useState<WorkbookDetailData | null>(null);
  const [activeStepIdx, setActiveStepIdx] = useState<number>(0);
  const [stepAnswers, setStepAnswers] = useState<Record<string, string>>({});
  const [showTableHints, setShowTableHints] = useState<boolean>(false);

  // AI Tutor Q&A states (마일리지 차감형 AI 질문하기)
  const [isAiTutorOpen, setIsAiTutorOpen] = useState<boolean>(false);
  const [aiQuestion, setAiQuestion] = useState<string>('');
  const [isAskingAi, setIsAskingAi] = useState<boolean>(false);
  const [aiChatHistory, setAiChatHistory] = useState<
    { q: string; a: string; mileageUsed?: number }[]
  >([]);
  const [aiTutorError, setAiTutorError] = useState<string | null>(null);

  // Essay states
  const [essayTitle, setEssayTitle] = useState<string>('');
  const [essayText, setEssayText] = useState<string>('');
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evalError, setEvalError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<AiFeedbackResult | null>(null);

  useEffect(() => {
    let mounted = true;
    fetchWorkbookDetail(workbookCode).then((data) => {
      if (!mounted) return;
      setDetail(data);
      setActiveStepIdx(0);
      setFeedback(null);
      setEvalError(null);
      setAiChatHistory([]);
      setAiTutorError(null);

      const saved = loadSavedDraft(userid, workbookCode);
      if (saved) {
        setEssayTitle(saved.title || '');
        setEssayText(saved.text || '');
        setStepAnswers(saved.step_answers || {});
      } else {
        setEssayTitle('');
        setEssayText('');
        setStepAnswers({});
      }
    });
    return () => {
      mounted = false;
    };
  }, [workbookCode, userid]);

  if (!detail) {
    return (
      <div className="p-12 text-center text-gray-500 font-bold">
        워크북 데이터를 불러오는 중입니다...
      </div>
    );
  }

  const { workbook, steps, writing_prompts, roadmap_books } = detail;
  const currentStep = steps[activeStepIdx] || steps[0];
  const currentPrompt = writing_prompts[0];
  const isElementary =
    workbook.target_group === 'ELEM_LOW' ||
    workbook.target_group === 'ELEM_HIGH' ||
    workbook.grade_group === 'ELEM_LOW' ||
    workbook.grade_group === 'ELEM_MID' ||
    workbook.grade_group === 'ELEM_HIGH';
  const questionMileageCost = workbook.ai_question_mileage || 50;
  const essayMileageCost = workbook.ai_essay_mileage || (isElementary ? 200 : 300);

  const updateAnswer = (key: string, val: string) => {
    setStepAnswers((prev) => ({ ...prev, [key]: val }));
  };

  const handleAskAiTutor = async (presetQuestion?: string) => {
    const qText = (presetQuestion ?? aiQuestion).trim();
    if (qText.length < 2) {
      setAiTutorError('질문 내용을 2자 이상 입력해 주세요.');
      return;
    }

    setIsAskingAi(true);
    setAiTutorError(null);
    try {
      const res = await askAiTutorQuestion({
        userid,
        workbook_code: workbook.code,
        question: qText,
        step_title: currentStep?.step_title || '',
        cost_mileage: questionMileageCost,
      });
      onWalletChange(res.wallet);
      setAiChatHistory((prev) => [
        ...prev,
        {
          q: qText,
          a: res.answer,
          mileageUsed: res.deducted_mileage,
        },
      ]);
      setAiQuestion('');
    } catch (err: any) {
      setAiTutorError(err?.message || 'AI 질문 처리 중 오류가 발생했습니다.');
    } finally {
      setIsAskingAi(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!currentPrompt) return;
    await saveDraftSubmission({
      userid,
      workbook_code: workbook.code,
      prompt_code: currentPrompt.prompt_code,
      submitted_title: essayTitle,
      submitted_text: essayText,
      step_answers: stepAnswers,
    });
    setSaveMessage('💾 초안과 작성한 생각 노트가 무료로 임시저장되었습니다!');
    setTimeout(() => setSaveMessage(null), 3500);
  };

  const handleFillSampleEssay = () => {
    const sample = SAMPLE_ESSAYS[workbook.code] || SAMPLE_ESSAYS.mania_essay;
    setEssayTitle(sample.title);
    setEssayText(sample.text);
  };

  const handleEvaluateEssay = async () => {
    if (!currentPrompt) return;
    const trimmed = essayText.trim();
    if (trimmed.length < 20) {
      setEvalError('글을 최소 20자 이상 작성해 주세요.');
      return;
    }

    setIsEvaluating(true);
    setEvalError(null);
    try {
      const res = await evaluateEssaySubmission({
        userid,
        workbook_code: workbook.code,
        prompt_code: currentPrompt.prompt_code,
        submitted_title: essayTitle,
        submitted_text: trimmed,
        step_answers: stepAnswers,
      });
      onWalletChange(res.wallet);
      setFeedback(res.feedback);
    } catch (err: any) {
      setEvalError(err?.message || 'AI 첨삭 요청 중 오류가 발생했습니다.');
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div
        className={`rounded-3xl p-6 text-white shadow-lg ${
          isElementary
            ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600'
            : 'bg-gradient-to-r from-indigo-700 via-purple-700 to-slate-800'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <button
            onClick={onGoHome}
            className="inline-flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-sm font-bold px-3.5 py-1.5 rounded-xl transition-colors"
          >
            ← 대시보드로 돌아가기
          </button>

          <div className="flex flex-wrap items-center gap-2">
            {onOpenAdminModal && (
              <button
                onClick={() => onOpenAdminModal(workbook.code)}
                className="inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-gray-950 text-xs font-extrabold px-3.5 py-1.5 rounded-xl shadow-sm transition-colors"
              >
                🛠️ 지도안 수정 (관리자)
              </button>
            )}

            {workbook.purchase_url && (
              <a
                href={workbook.purchase_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-white text-indigo-900 hover:bg-indigo-50 text-xs font-extrabold px-3.5 py-1.5 rounded-xl shadow-sm transition-colors"
              >
                🛒 리더스가이드 도서 구매/상세
              </a>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-extrabold bg-black/25 px-3 py-1 rounded-full">
                {workbook.target_label}
              </span>
              <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">
                교과: {workbook.subject_category || '국어'} · 기본학습: {workbook.basic_skill_category || '책읽기'}
              </span>
              <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">
                ⏱️ 소요시간 {workbook.duration_minutes}분
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              {workbook.cover_emoji} {workbook.title}
            </h1>
            <p className="text-sm md:text-base text-white/90 mt-1">
              {workbook.author} | {workbook.publisher} — {workbook.subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAiTutorOpen((prev) => !prev)}
            className="px-4 py-2.5 rounded-2xl bg-white text-indigo-950 hover:bg-indigo-50 font-black text-xs shadow-md shrink-0"
          >
            🤖 AI 도우미에게 질문하기
          </button>
        </div>

        {/* NCIC 국가교육과정 성취기준 & 교육목표 배너 */}
        {workbook.curriculum_links && workbook.curriculum_links.length > 0 && (
          <div className="mt-4 bg-black/20 border border-white/20 rounded-2xl p-3.5 space-y-1.5">
            <div className="text-[11px] font-extrabold text-amber-200">
              🏛️ NCIC 국가교육과정 연계 성취기준 및 교육목표 (2022 개정 교육과정)
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {workbook.curriculum_links.map((lk, lIdx) => (
                <div key={lk.curriculum_id || lIdx} className="bg-white/10 rounded-xl px-3 py-2 text-xs">
                  <div className="font-extrabold text-white flex items-center gap-1.5">
                    <span className="bg-amber-400 text-gray-900 px-1.5 py-0.5 rounded text-[10px] font-black">
                      {lk.achievement_code || lk.curriculum_code}
                    </span>
                    <span>
                      {lk.detail_subject} ({lk.domain_name})
                    </span>
                  </div>
                  <div className="text-white/90 text-[11px] mt-0.5">
                    {lk.achievement_text || lk.educational_goal}
                  </div>
                  {lk.linkage_note && (
                    <div className="text-emerald-200 text-[10px] mt-0.5">💡 활동 초점: {lk.linkage_note}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step Navigation Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-6">
          {steps.map((st, idx) => {
            const active = idx === activeStepIdx;
            return (
              <button
                key={st.id}
                onClick={() => setActiveStepIdx(idx)}
                className={`p-3 rounded-2xl text-left transition-all border ${
                  active
                    ? 'bg-white text-gray-900 border-white shadow-md scale-[1.01]'
                    : 'bg-black/20 text-white/85 border-white/15 hover:bg-black/30'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-bold opacity-80">
                  <span>STEP {st.step_order}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full ${
                      st.step_type === 'ESSAY_WRITING'
                        ? active
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-rose-500/40 text-white'
                        : active
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-white/15 text-white'
                    }`}
                  >
                    {st.step_badge}
                  </span>
                </div>
                <div className="font-extrabold text-sm mt-1 truncate">{st.step_title}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Collapsible AI Tutor Q&A Box (리더스가이드 마일리지 연동) */}
      {isAiTutorOpen && (
        <div className="bg-gradient-to-r from-indigo-50 via-white to-emerald-50 border-2 border-indigo-300 rounded-3xl p-5 shadow-md space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-black text-indigo-950">
                🤖 AI 독서 튜터에게 무엇이든 물어보세요!
              </h3>
              <p className="text-xs text-gray-600 mt-0.5">
                책 속 어려운 어휘, 등장인물의 심리, 과학/역사 배경지식, 글쓰기 아이디어를 질문하면 눈높이에 맞춰 답해 줍니다.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAiTutorOpen(false)}
              className="text-xs font-bold text-gray-500 hover:text-gray-800 px-2.5 py-1 rounded-lg bg-gray-100"
            >
              닫기 ✕
            </button>
          </div>

          {/* Preset Quick Questions */}
          <div className="flex flex-wrap gap-1.5">
            {[
              `《${workbook.title}》의 핵심 주제를 쉽게 설명해 줘`,
              '이 책이 우리나라 교육과정(교과서)과 어떻게 연결되나요?',
              '글쓰기 서론을 어떻게 시작하면 좋을지 힌트를 줘',
            ].map((pq, i) => (
              <button
                key={i}
                type="button"
                disabled={isAskingAi}
                onClick={() => handleAskAiTutor(pq)}
                className="text-xs font-bold bg-indigo-100/80 hover:bg-indigo-200 text-indigo-900 px-3 py-1.5 rounded-full transition-colors"
              >
                💬 {pq}
              </button>
            ))}
          </div>

          {/* Chat History */}
          {aiChatHistory.length > 0 && (
            <div className="space-y-3 max-h-64 overflow-y-auto bg-white rounded-2xl p-4 border border-indigo-100">
              {aiChatHistory.map((item, idx) => (
                <div key={idx} className="space-y-2 pb-3 border-b border-gray-100 last:border-none last:pb-0">
                  <div className="flex items-center justify-between text-xs font-extrabold text-indigo-800">
                    <span>🙋 나의 질문: {item.q}</span>
                    {item.mileageUsed ? (
                      <span className="text-[11px] text-rose-600">-{item.mileageUsed}P 차감</span>
                    ) : null}
                  </div>
                  <div className="text-xs md:text-sm text-gray-800 leading-relaxed whitespace-pre-line bg-slate-50 p-3 rounded-xl">
                    {item.a}
                  </div>
                </div>
              ))}
            </div>
          )}

          {aiTutorError && (
            <div className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-3.5 py-2 rounded-xl">
              ⚠️ {aiTutorError}
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              value={aiQuestion}
              onChange={(e) => setAiQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAskAiTutor();
              }}
              placeholder="궁금한 점을 입력하세요 (예: 불광불급이 오늘날 왜 중요한가요?)"
              className="flex-1 rounded-xl border border-indigo-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <button
              type="button"
              disabled={isAskingAi}
              onClick={() => handleAskAiTutor()}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black text-xs shrink-0 shadow"
            >
              {isAskingAi ? '답변 생성 중...' : '질문하기'}
            </button>
          </div>
        </div>
      )}

      {/* STEP 1: BOOK_INTRO */}
      {currentStep.step_type === 'BOOK_INTRO' && (
        <div className="space-y-6">
          {currentStep.content.quote && (
            <blockquote className="bg-amber-50 border-l-4 border-amber-500 p-5 rounded-2xl text-gray-800 italic font-medium leading-relaxed shadow-sm">
              {currentStep.content.quote}
            </blockquote>
          )}

          {/* 도서 소개 */}
          <div className="bg-white rounded-2xl border-2 border-gray-100 p-6 shadow-sm">
            <h3 className="text-xl font-extrabold text-gray-900 mb-3 flex items-center gap-2">
              <span>📖</span> 작품 / 도서 소개
            </h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line text-base">
              {currentStep.content.book_intro}
            </p>
          </div>

          {/* 작가 소개 & 줄거리 (초등 GMO 아이 등) */}
          {currentStep.content.author_intro && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentStep.content.author_intro.map((au: any, i: number) => (
                <div key={i} className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-5">
                  <div className="font-extrabold text-emerald-800 text-base mb-2">✍️ {au.role}</div>
                  <p className="text-sm text-gray-700 leading-relaxed">{au.bio}</p>
                </div>
              ))}
            </div>
          )}

          {currentStep.content.synopsis && (
            <div className="bg-teal-50/50 border-2 border-teal-200 rounded-2xl p-6">
              <h3 className="text-lg font-extrabold text-teal-900 mb-2">🎬 전체 줄거리</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {currentStep.content.synopsis}
              </p>
            </div>
          )}

          {/* 학습 개요 및 수업 목표 (중·고등 미쳐야 미친다 등) */}
          {currentStep.content.study_overview && (
            <div className="bg-indigo-50/50 border-2 border-indigo-100 rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-extrabold text-indigo-950">🎯 학습 개요 및 수업 목표</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm bg-white p-4 rounded-xl border border-indigo-100">
                <div>
                  <span className="font-bold text-indigo-700">• 주제:</span>{' '}
                  {currentStep.content.study_overview.topic}
                </div>
                <div>
                  <span className="font-bold text-indigo-700">• 대상 / 시간:</span>{' '}
                  {currentStep.content.study_overview.target} ({currentStep.content.study_overview.duration})
                </div>
                <div className="md:col-span-2">
                  <span className="font-bold text-indigo-700">• 관련 논술문제:</span>{' '}
                  {currentStep.content.study_overview.related_exam}
                </div>
                <div className="md:col-span-2">
                  <span className="font-bold text-indigo-700">• 관련 교과:</span>{' '}
                  {currentStep.content.study_overview.related_subject}
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-indigo-100">
                <div className="font-bold text-indigo-900 mb-2 text-sm">📌 수업 목표</div>
                <ul className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                  {currentStep.content.study_overview.objectives.map((obj: string, i: number) => (
                    <li key={i}>{obj}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* 핵심 어휘 카드 */}
          {currentStep.content.vocabulary && (
            <div className="bg-white rounded-2xl border-2 border-gray-100 p-6 shadow-sm">
              <h3 className="text-lg font-extrabold text-gray-900 mb-3">📚 핵심 어휘 짚어보기</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentStep.content.vocabulary.map((v: any, idx: number) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <div className="font-black text-indigo-700 text-base mb-1">{v.term}</div>
                    <div className="text-sm text-gray-700 leading-relaxed">{v.meaning}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 수업 전 준비 질문 */}
          {currentStep.content.pre_questions && (
            <div className="bg-white rounded-2xl border-2 border-indigo-100 p-6 space-y-4">
              <h3 className="text-lg font-extrabold text-indigo-900">✏️ 수업 전 준비 활동</h3>
              {currentStep.content.pre_questions.map((pq: any) => (
                <div key={pq.id} className="space-y-2">
                  <label className="block font-bold text-gray-800 text-sm">{pq.question}</label>
                  <textarea
                    rows={2}
                    value={stepAnswers[pq.id] || ''}
                    onChange={(e) => updateAnswer(pq.id, e.target.value)}
                    placeholder="자신의 경험이나 조사한 내용을 자유롭게 적어보세요..."
                    className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* STEP 2: COMPREHENSION */}
      {currentStep.step_type === 'COMPREHENSION' && (
        <div className="space-y-6">
          {/* GMO 아이: 시기별 태도 변화 표 채우기 */}
          {currentStep.content.table_activity && (
            <div className="bg-white rounded-2xl border-2 border-emerald-200 p-6 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-lg font-extrabold text-emerald-950">
                  📊 {currentStep.content.table_activity.question}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowTableHints((prev) => !prev)}
                  className="text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                >
                  {showTableHints ? '🙈 예시 답안 숨기기' : '💡 예시 답안 힌트 보기'}
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-emerald-200 text-sm">
                  <thead>
                    <tr className="bg-emerald-100 text-emerald-950">
                      {currentStep.content.table_activity.columns.map((col: string, i: number) => (
                        <th key={i} className="border border-emerald-200 px-4 py-3 font-extrabold text-center">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentStep.content.table_activity.rows.map((row: any, rIdx: number) => (
                      <tr key={rIdx} className="bg-white">
                        <td className="border border-emerald-200 px-4 py-3 font-bold text-center bg-emerald-50/50 whitespace-nowrap">
                          {row.period}
                        </td>
                        <td className="border border-emerald-200 p-2">
                          <textarea
                            rows={2}
                            value={stepAnswers[`table_${rIdx}_col1`] || ''}
                            onChange={(e) => updateAnswer(`table_${rIdx}_col1`, e.target.value)}
                            placeholder={showTableHints ? row.col1_placeholder : '할아버지의 태도를 적어보세요...'}
                            className="w-full p-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          />
                          {showTableHints && (
                            <div className="text-xs text-emerald-700 mt-1">💡 예시: {row.col1_placeholder}</div>
                          )}
                        </td>
                        <td className="border border-emerald-200 p-2">
                          <textarea
                            rows={2}
                            value={stepAnswers[`table_${rIdx}_col2`] || ''}
                            onChange={(e) => updateAnswer(`table_${rIdx}_col2`, e.target.value)}
                            placeholder={showTableHints ? row.col2_placeholder : '나무의 태도를 적어보세요...'}
                            className="w-full p-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          />
                          {showTableHints && (
                            <div className="text-xs text-emerald-700 mt-1">💡 예시: {row.col2_placeholder}</div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 단답형 내용 이해 질문 */}
          {currentStep.content.short_questions && (
            <div className="bg-white rounded-2xl border-2 border-gray-100 p-6 space-y-4">
              <h3 className="text-lg font-extrabold text-gray-900">🧐 내용 이해 질문</h3>
              {currentStep.content.short_questions.map((sq: any) => (
                <div key={sq.id} className="space-y-2">
                  <label className="block font-bold text-gray-800 text-sm">{sq.question}</label>
                  <textarea
                    rows={2}
                    value={stepAnswers[sq.id] || ''}
                    onChange={(e) => updateAnswer(sq.id, e.target.value)}
                    placeholder={sq.placeholder}
                    className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          )}

          {/* 미쳐야 미친다: 마니아의 속성 & 인물 분류 & 발췌 독해 */}
          {currentStep.content.mania_attributes && (
            <div className="bg-indigo-50 border-l-4 border-indigo-600 p-5 rounded-2xl">
              <div className="font-extrabold text-indigo-950 mb-1">💡 책에서 말하는 마니아(벽을 가진 사람)의 속성</div>
              <p className="text-sm text-gray-800 leading-relaxed">{currentStep.content.mania_attributes}</p>
            </div>
          )}

          {currentStep.content.people_categories && (
            <div className="bg-white rounded-2xl border-2 border-gray-100 p-6">
              <h3 className="text-lg font-extrabold text-gray-900 mb-3">
                🗂️ 책 속에 소개된 다양한 ‘벽(癖)’이 있는 인물들
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentStep.content.people_categories.map((cat: any, idx: number) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <div className="font-extrabold text-indigo-700 mb-2">&lt;{cat.category}&gt;</div>
                    <ul className="space-y-1 text-sm text-gray-700">
                      {cat.items.map((it: string, j: number) => (
                        <li key={j}>• {it}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep.content.excerpts && (
            <div className="space-y-4">
              {currentStep.content.excerpts.map((ex: any, idx: number) => (
                <div key={idx} className="bg-white rounded-2xl border-2 border-indigo-100 p-6 space-y-3 shadow-sm">
                  <h4 className="font-extrabold text-indigo-950 text-base">{ex.title}</h4>
                  <div className="bg-slate-50 p-4 rounded-xl text-sm text-gray-700 whitespace-pre-line leading-relaxed border border-slate-200">
                    {ex.text}
                  </div>
                  <div className="pt-1">
                    <label className="block font-bold text-gray-800 text-sm mb-1.5">💬 {ex.question}</label>
                    <textarea
                      rows={2}
                      value={stepAnswers[`excerpt_${idx}`] || ''}
                      onChange={(e) => updateAnswer(`excerpt_${idx}`, e.target.value)}
                      placeholder="발췌문을 읽고 떠오른 나의 생각을 정리해 보세요 (4단계 글쓰기에 자동 참조됩니다)..."
                      className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* STEP 3: DISCUSSION */}
      {currentStep.step_type === 'DISCUSSION' && (
        <div className="space-y-6">
          {/* 초등 GMO 아이 토론 주제 */}
          {currentStep.content.discussion_topics && (
            <div className="space-y-4">
              {currentStep.content.discussion_topics.map((dt: any) => (
                <div key={dt.id} className="bg-white rounded-2xl border-2 border-emerald-100 p-6 space-y-3 shadow-sm">
                  <h4 className="font-extrabold text-gray-900 text-base">{dt.title}</h4>
                  {dt.hint && (
                    <div className="text-xs text-emerald-800 bg-emerald-50 px-3 py-2 rounded-lg">
                      💡 생각 도우미: {dt.hint}
                    </div>
                  )}
                  {dt.choices && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {dt.choices.map((ch: string) => {
                        const selected = stepAnswers[`${dt.id}_choice`] === ch;
                        return (
                          <button
                            key={ch}
                            type="button"
                            onClick={() => updateAnswer(`${dt.id}_choice`, ch)}
                            className={`px-4 py-2 rounded-xl text-xs font-extrabold border transition-all ${
                              selected
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-emerald-400'
                            }`}
                          >
                            {selected ? '✓ ' : ''}
                            {ch}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  <textarea
                    rows={2}
                    value={stepAnswers[dt.id] || ''}
                    onChange={(e) => updateAnswer(dt.id, e.target.value)}
                    placeholder="왜 그렇게 생각하는지 나의 이유를 적어보세요..."
                    className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          )}

          {currentStep.content.research_activities && (
            <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 space-y-3">
              <h4 className="font-extrabold text-amber-900 text-base">🔎 활동하기 (조사 및 탐구)</h4>
              <ul className="space-y-2 text-sm text-gray-800">
                {currentStep.content.research_activities.map((act: string, idx: number) => (
                  <li key={idx} className="bg-white p-3 rounded-xl border border-amber-200">
                    {act}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 중·고등 미쳐야 미친다 심화 쟁점 토론 */}
          {currentStep.content.debates && (
            <div className="space-y-4">
              {currentStep.content.debates.map((deb: any) => (
                <div key={deb.id} className="bg-white rounded-2xl border-2 border-indigo-100 p-6 space-y-3 shadow-sm">
                  <h4 className="font-extrabold text-indigo-950 text-base">{deb.title}</h4>
                  {deb.positive && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-gray-800 leading-relaxed">
                        <strong className="text-emerald-800 block mb-1">➕ 긍정적 의미</strong>
                        {deb.positive}
                      </div>
                      <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-xl text-gray-800 leading-relaxed">
                        <strong className="text-rose-800 block mb-1">➖ 부정적 의미</strong>
                        {deb.negative}
                      </div>
                    </div>
                  )}
                  {deb.context && (
                    <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-sm text-gray-700 leading-relaxed">
                      {deb.context}
                    </div>
                  )}
                  <div>
                    <label className="block font-bold text-gray-800 text-sm mb-1.5">🗣️ {deb.prompt}</label>
                    <textarea
                      rows={2}
                      value={stepAnswers[deb.id] || ''}
                      onChange={(e) => updateAnswer(deb.id, e.target.value)}
                      placeholder="나의 주장과 근거를 정리해 보세요..."
                      className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* STEP: INTERACTIVE_ACTIVITY (표준 14종 인터랙티브 워크북 블록) */}
      {currentStep.step_type === 'INTERACTIVE_ACTIVITY' && (
        <div className="bg-white rounded-3xl border-2 border-amber-200 p-6 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-100 pb-3">
            <div>
              <span className="text-xs font-extrabold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
                🎮 표준 인터랙티브 워크북 블록 ({currentStep.content?.activity_type || 'word-search'})
              </span>
              <h3 className="text-lg font-black text-gray-900 mt-1">{currentStep.step_title}</h3>
            </div>
          </div>

          {currentStep.content?.activity_data ? (
            <div className="pt-2">
              <ConsonantActivityHost
                activity={currentStep.content.activity_data}
                onNextPage={() => setActiveStepIdx((i) => Math.min(steps.length - 1, i + 1))}
                onPrevPage={() => setActiveStepIdx((i) => Math.max(0, i - 1))}
                onGoToTOC={() => setActiveStepIdx(0)}
                onNavigateToPage={() => {}}
                isFirstPage={activeStepIdx === 0}
                isLastPage={activeStepIdx === steps.length - 1}
                onComplete={() => setActiveStepIdx((i) => Math.min(steps.length - 1, i + 1))}
              />
            </div>
          ) : (
            <div className="bg-amber-50/70 rounded-2xl p-6 text-center space-y-3 border border-amber-200">
              <div className="text-3xl">🧩</div>
              <div className="font-extrabold text-gray-900 text-base">
                {INTERACTIVE_ACTIVITY_TYPES.find((t) => t.type === currentStep.content?.activity_type)?.label ||
                  '인터랙티브 활동'}
              </div>
              <p className="text-xs text-gray-600">
                {currentStep.content?.instruction ||
                  '제시된 어휘와 문장을 활용하여 인터랙티브 워크북 활동을 수행해 보세요.'}
              </p>
              {currentStep.content?.words && Array.isArray(currentStep.content.words) && (
                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  {currentStep.content.words.map((w: string, i: number) => (
                    <span
                      key={i}
                      className="px-4 py-2 rounded-xl bg-white border-2 border-amber-300 font-black text-amber-900 text-sm shadow-sm"
                    >
                      {w}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* STEP 4: ESSAY_WRITING & AI FEEDBACK */}
      {currentStep.step_type === 'ESSAY_WRITING' && currentPrompt && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Reading Passages & Notes */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-md">
                <div className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">
                  논술·글쓰기 발문
                </div>
                <h3 className="text-base font-extrabold leading-snug">{currentPrompt.question_title}</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">{currentPrompt.question_guide}</p>
              </div>

              {/* 제시문 / 읽기 자료 */}
              <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                {currentPrompt.reading_materials.map((rm, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border-2 border-gray-200 p-5 shadow-sm">
                    <div className="font-extrabold text-indigo-900 text-sm mb-2">📑 {rm.title}</div>
                    <p className="text-xs md:text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                      {rm.content}
                    </p>
                  </div>
                ))}

                {/* 1~3단계에서 작성한 내 메모 모아보기 */}
                {Object.keys(stepAnswers).length > 0 && (
                  <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4">
                    <div className="font-extrabold text-amber-900 text-xs mb-2">
                      📌 내가 1~3단계에서 작성한 생각 노트
                    </div>
                    <div className="space-y-1.5 text-xs text-gray-700">
                      {Object.entries(stepAnswers)
                        .filter(([, v]) => v && v.trim().length > 0)
                        .map(([k, v]) => (
                          <div key={k} className="bg-white p-2 rounded-lg border border-amber-100">
                            {v}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Essay Editor */}
            <div className="lg:col-span-7 bg-white rounded-2xl border-2 border-indigo-200 p-6 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-gray-900 text-lg">✍️ 나의 글쓰기 원고지</span>
                    <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2.5 py-1 rounded-full">
                      권장 {currentPrompt.recommended_length}자 (최소 {currentPrompt.min_length}자)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleFillSampleEssay}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    📝 예시 답안 불러오기 (테스트용)
                  </button>
                </div>

                <input
                  type="text"
                  value={essayTitle}
                  onChange={(e) => setEssayTitle(e.target.value)}
                  placeholder="글의 제목을 입력해 보세요 (예: 불광불급, 나만의 열정을 찾아서)"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 font-bold text-gray-900 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />

                <div className="relative">
                  <textarea
                    rows={12}
                    value={essayText}
                    onChange={(e) => setEssayText(e.target.value)}
                    placeholder="서론(도입) - 본론(근거 및 사례) - 결론(나의 생각과 다짐)의 구조로 자유롭게 글을 작성해 보세요..."
                    className="w-full rounded-2xl border border-gray-300 p-4 text-sm md:text-base leading-relaxed text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                {/* 글자수 게이지 */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-gray-500">
                      현재 글자수:{' '}
                      <strong className="text-indigo-700 text-sm">{essayText.trim().length}자</strong> / 권장{' '}
                      {currentPrompt.recommended_length}자
                    </span>
                    <span
                      className={
                        essayText.trim().length >= currentPrompt.min_length
                          ? 'text-emerald-600'
                          : 'text-amber-600'
                      }
                    >
                      {essayText.trim().length >= currentPrompt.min_length
                        ? '✅ 첨삭 가능 분량 충족'
                        : `최소 ${currentPrompt.min_length}자 이상 권장`}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        essayText.trim().length >= currentPrompt.min_length
                          ? 'bg-emerald-500'
                          : 'bg-indigo-500'
                      }`}
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round((essayText.trim().length / currentPrompt.recommended_length) * 100)
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {saveMessage && (
                <div className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-xl">
                  {saveMessage}
                </div>
              )}

              {evalError && (
                <div className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-4 py-2.5 rounded-xl">
                  ⚠️ {evalError}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="sm:w-1/3 py-3.5 px-4 rounded-xl border-2 border-gray-300 hover:border-gray-400 font-extrabold text-gray-700 text-sm transition-colors"
                >
                  💾 임시저장 (무료)
                </button>
                <button
                  type="button"
                  disabled={isEvaluating}
                  onClick={handleEvaluateEssay}
                  className="sm:w-2/3 py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-60 text-white font-black text-sm shadow-lg transition-all"
                >
                  {isEvaluating
                    ? '🤖 AI 멘토가 지침(Gems)에 따라 꼼꼼히 첨삭 중입니다...'
                    : '✨ AI 멘토 첨삭 받기'}
                </button>
              </div>
            </div>
          </div>

          {/* AI 첨삭 결과 리포트 */}
          {feedback && (
            <div className="bg-gradient-to-br from-indigo-50 via-white to-emerald-50 rounded-3xl border-4 border-indigo-200 p-6 md:p-8 shadow-xl space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-100 pb-4">
                <div>
                  <span className="inline-block text-xs font-extrabold bg-indigo-600 text-white px-3 py-1 rounded-full mb-2">
                    AI 맞춤형 독서논술 첨삭 리포트
                  </span>
                  <h3 className="text-2xl font-black text-gray-900">
                    {isElementary ? '👩‍🏫 다정한 논술 선생님의 피드백' : '🎓 독서논술 멘토의 심층 첨삭'}
                  </h3>
                </div>
                <div className="bg-white px-5 py-3 rounded-2xl border-2 border-indigo-200 text-center shadow-sm">
                  <div className="text-xs font-bold text-gray-500">종합 평가 점수</div>
                  <div className="text-3xl font-black text-indigo-600">{feedback.total_score}점</div>
                </div>
              </div>

              {/* 총평 및 칭찬 */}
              <div className="bg-white rounded-2xl p-5 border border-indigo-100 shadow-sm">
                <div className="font-extrabold text-indigo-900 text-sm mb-1.5">🌟 총평 및 격려</div>
                <p className="text-gray-800 leading-relaxed text-sm md:text-base">{feedback.overall_praise}</p>
              </div>

              {/* 영역별 루브릭 점수 */}
              {feedback.rubric_scores && feedback.rubric_scores.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {feedback.rubric_scores.map((r, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-extrabold text-gray-900 text-sm">{r.criterion}</span>
                        <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                          {r.score} / {r.max_score}점
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                        <div
                          className="h-full bg-indigo-500"
                          style={{ width: `${Math.round((r.score / r.max_score) * 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* 칭찬할 점 & 보완할 점 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-5">
                  <h4 className="font-extrabold text-emerald-900 text-base mb-3">👏 참 잘했어요! (칭찬할 점)</h4>
                  <ul className="space-y-2 text-sm text-gray-800">
                    {feedback.strengths.map((st, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{st}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-5">
                  <h4 className="font-extrabold text-amber-900 text-base mb-3">
                    💡 이렇게 다듬으면 더 돋보여요!
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-800">
                    {feedback.improvements.map((imp, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 문장 교정 예시 */}
              {feedback.sentence_corrections && feedback.sentence_corrections.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
                  <h4 className="font-extrabold text-gray-900 text-base">✏️ 맞춤형 문장 다듬기 제안</h4>
                  {feedback.sentence_corrections.map((sc, i) => (
                    <div key={i} className="bg-slate-50 rounded-xl p-4 space-y-2 text-sm border border-slate-200">
                      <div className="text-rose-700">
                        <span className="font-bold mr-2">[원래 문장]</span>
                        <span className="line-through opacity-80">{sc.original}</span>
                      </div>
                      <div className="text-emerald-800 font-semibold">
                        <span className="font-bold mr-2">[추천 수정]</span>
                        <span>{sc.revised}</span>
                      </div>
                      <div className="text-xs text-gray-600 pt-1">💡 이유: {sc.reason}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* 생각 넓히기 질문 */}
              {feedback.thinking_questions && feedback.thinking_questions.length > 0 && (
                <div className="bg-indigo-900 text-white rounded-2xl p-5">
                  <h4 className="font-extrabold text-amber-300 text-base mb-2">
                    🌱 생각을 한 뼘 더 키우는 질문
                  </h4>
                  <ul className="space-y-2 text-sm text-indigo-100">
                    {feedback.thinking_questions.map((tq, i) => (
                      <li key={i}>{tq}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Bottom Step Prev / Next Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          disabled={activeStepIdx === 0}
          onClick={() => setActiveStepIdx((i) => Math.max(0, i - 1))}
          className="px-5 py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 disabled:opacity-40 font-bold text-gray-700 text-sm"
        >
          ← 이전 단계
        </button>
        {activeStepIdx < steps.length - 1 ? (
          <button
            type="button"
            onClick={() => setActiveStepIdx((i) => Math.min(steps.length - 1, i + 1))}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow"
          >
            다음 단계로 ({steps[activeStepIdx + 1]?.step_title}) →
          </button>
        ) : null}
      </div>

      {/* 연결된 리더스가이드 책지도 (Reading Roadmap) */}
      {roadmap_books && roadmap_books.length > 0 && (
        <div className="bg-slate-50 rounded-3xl border-2 border-slate-200 p-6 mt-6">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <span className="text-xs font-extrabold text-indigo-600 bg-indigo-100 px-2.5 py-0.5 rounded-full">
                리더스가이드 책지도(독서맵) 연동
              </span>
              <h3 className="text-lg font-extrabold text-gray-900 mt-1">
                🗺️ [{workbook.roadmap_name}] 단계별 확장 독서 코스
              </h3>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {roadmap_books.map((rb) => (
              <div
                key={rb.bookno}
                className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <span
                    className={`inline-block text-[11px] font-extrabold px-2.5 py-0.5 rounded-full mb-2 ${
                      rb.difficulty_level === 1
                        ? 'bg-emerald-100 text-emerald-800'
                        : rb.difficulty_level === 2
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    Lv.{rb.difficulty_level}{' '}
                    {rb.difficulty_level === 1 ? '입문' : rb.difficulty_level === 2 ? '교양' : '심화·원전'} ·{' '}
                    {rb.track_tag}
                  </span>
                  <div className="font-extrabold text-gray-900 text-sm">{rb.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {rb.author} | {rb.publisher}
                  </div>
                  <p className="text-xs text-gray-600 mt-2">{rb.curator_note}</p>
                </div>
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
                  <a
                    href={rb.purchase_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                  >
                    🛒 도서 상세/구매 →
                  </a>
                  {rb.linked_workbook_code && rb.linked_workbook_code !== workbook.code && (
                    <button
                      type="button"
                      onClick={() => onSelectWorkbook(rb.linked_workbook_code!)}
                      className="ml-auto text-xs font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg hover:bg-indigo-100"
                    >
                      워크북 열기
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyGuideWorkbook;
