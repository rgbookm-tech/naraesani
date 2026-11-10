import React, { useState, useEffect } from 'react';
import {
  GRADE_GROUPS,
  SUBJECT_CATEGORIES,
  BASIC_SKILL_CATEGORIES,
  STANDARD_STEP_TYPES,
  INTERACTIVE_ACTIVITY_TYPES,
  WorkbookItem,
  CurriculumStandard,
  StudyStep,
} from '../../data/studyGuideData';
import {
  searchAdminBooks,
  recommendAdminCurriculum,
  saveAdminCurriculum,
  fetchAdminWorkbookFull,
  saveAdminWorkbook,
  deleteAdminWorkbook,
} from '../../services/workbookApi';

interface AdminConsoleModalProps {
  isOpen: boolean;
  workbooks: WorkbookItem[];
  curriculumStandards: CurriculumStandard[];
  initialEditCode?: string | null;
  onClose: () => void;
  onSaved: () => void;
}

const DEFAULT_STEP_CONTENT_TEMPLATES: Record<string, any> = {
  BOOK_INTRO: {
    book_intro: '이 책의 핵심 배경과 주제를 소개하는 글을 입력하세요.',
    synopsis: '전체 줄거리 요약을 입력하세요.',
    vocabulary: [
      { term: '핵심 어휘 1', meaning: '어휘의 뜻을 쉽게 풀이해 주세요.' },
    ],
    pre_questions: [
      { id: 'pre_1', question: '1. 책을 읽기 전에 제목과 표지를 보며 떠오르는 생각을 적어보세요.' },
    ],
  },
  COMPREHENSION: {
    table_activity: {
      question: '1. 이야기의 흐름에 따라 인물의 마음이나 상황이 어떻게 변하는지 표를 채워보세요.',
      columns: ['구분', '처음 모습', '변화된 모습'],
      rows: [
        { period: '주요 장면 1', col1_placeholder: '예시 힌트 1', col2_placeholder: '예시 힌트 2' },
      ],
    },
    short_questions: [
      {
        id: 'comp_q1',
        question: '2. 주인공이 가장 중요하게 내린 선택은 무엇이며, 그 이유는 무엇인가요?',
        placeholder: '생각을 자유롭게 적어보세요...',
      },
    ],
  },
  DISCUSSION: {
    discussion_topics: [
      {
        id: 'disc_1',
        title: '1. 책 속 쟁점에 대해 찬성과 반대 중 나의 입장을 정하고 근거를 이야기해 봅시다.',
        choices: ['찬성 입장', '반대 입장'],
        hint: '양쪽 입장의 장단점을 모두 고려해 보세요.',
      },
    ],
    research_activities: [
      '활동 1: 우리 주변이나 뉴스에서 이 책의 주제와 비슷한 사례를 찾아 정리해 보세요.',
    ],
  },
  INTERACTIVE_ACTIVITY: {
    activity: {
      page: 1,
      activityNumber: 1,
      title: '재미있는 핵심 낱말 구름 찾기',
      type: 'WORD_CLOUD_SEARCH',
      question: '책에 나오는 핵심 낱말을 구름 속에서 모두 찾아 눌러보세요!',
      words: [
        { text: '생명존중', isTarget: true },
        { text: '과학윤리', isTarget: true },
        { text: '엉뚱한단어', isTarget: false },
        { text: '유전자', isTarget: true },
      ],
    },
  },
  ESSAY_WRITING: {
    default_prompt_code: 'default_essay',
  },
};

const AdminConsoleModal: React.FC<AdminConsoleModalProps> = ({
  isOpen,
  workbooks,
  curriculumStandards,
  initialEditCode,
  onClose,
  onSaved,
}) => {
  const [activeTab, setActiveTab] = useState<'WORKBOOK' | 'CURRICULUM'>('WORKBOOK');
  const [selectedCode, setSelectedCode] = useState<string>('NEW');
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // 도서 검색 상태
  const [bookQuery, setBookQuery] = useState('');
  const [bookResults, setBookResults] = useState<any[]>([]);
  const [searchingBook, setSearchingBook] = useState(false);

  // 워크북 기본 폼 상태
  const [code, setCode] = useState('');
  const [bookno, setBookno] = useState<string>('');
  const [isbn, setIsbn] = useState<string>('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publisher, setPublisher] = useState('');
  const [gradeGroup, setGradeGroup] = useState('ELEM_HIGH');
  const [targetLabel, setTargetLabel] = useState('초등고학년 (5~6학년)');
  const [subjectCategory, setSubjectCategory] = useState('국어');
  const [basicSkillCategory, setBasicSkillCategory] = useState('책읽기');
  const [themeCategory, setThemeCategory] = useState('인문·교양');
  const [themeTagsStr, setThemeTagsStr] = useState('인문·교양, 비판적 사고');
  const [keywordsStr, setKeywordsStr] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [coverEmoji, setCoverEmoji] = useState('📘');
  const [badgeColor, setBadgeColor] = useState('emerald');
  const [templateMode, setTemplateMode] = useState('STANDARD_GUIDE');
  const [aiQuestionMileage, setAiQuestionMileage] = useState(50);
  const [aiEssayMileage, setAiEssayMileage] = useState(200);

  // NCIC 국가교육과정 매핑 상태
  const [curriculumLinks, setCurriculumLinks] = useState<
    Array<{ curriculum_id: number; is_primary: number; linkage_note: string }>
  >([]);
  const [recommendingCurr, setRecommendingCurr] = useState(false);

  // 단계별 스텝 상태
  const [steps, setSteps] = useState<Array<{
    step_order: number;
    step_type: string;
    step_title: string;
    step_badge: string;
    content_str: string;
  }>>([]);

  // 글쓰기 발문 & 비공개 Gems 지침 상태
  const [promptTitle, setPromptTitle] = useState('');
  const [promptGuide, setPromptGuide] = useState('');
  const [minLength, setMinLength] = useState(150);
  const [recLength, setRecLength] = useState(400);
  const [readingMaterialsStr, setReadingMaterialsStr] = useState('[]');
  const [gemInstruction, setGemInstruction] = useState('');
  const [gemReferenceContext, setGemReferenceContext] = useState('');

  // 신규 교육과정 목표 등록 폼 상태
  const [currCode, setCurrCode] = useState('');
  const [currGrade, setCurrGrade] = useState('ELEM_HIGH');
  const [currSubject, setCurrSubject] = useState('국어');
  const [currDetailSubj, setCurrDetailSubj] = useState('국어 (초5~6)');
  const [currDomain, setCurrDomain] = useState('');
  const [currGoal, setCurrGoal] = useState('');
  const [currAchCode, setCurrAchCode] = useState('');
  const [currNcicRef, setCurrNcicRef] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialEditCode) {
        loadWorkbookForEdit(initialEditCode);
      } else {
        resetToNewWorkbook();
      }
    }
  }, [isOpen, initialEditCode]);

  if (!isOpen) return null;

  const resetToNewWorkbook = () => {
    setSelectedCode('NEW');
    setCode('wb_' + Math.random().toString(36).substring(2, 7));
    setBookno('');
    setIsbn('');
    setTitle('');
    setSubtitle('');
    setAuthor('');
    setPublisher('');
    setGradeGroup('ELEM_HIGH');
    setTargetLabel('초등고학년 (5~6학년)');
    setSubjectCategory('과학');
    setBasicSkillCategory('책읽기');
    setThemeCategory('생명윤리·미래과학');
    setThemeTagsStr('생명윤리·미래과학, 과학기술');
    setKeywordsStr('과학, 생명, 토론');
    setDurationMinutes(60);
    setCoverEmoji('📘');
    setBadgeColor('emerald');
    setTemplateMode('STANDARD_GUIDE');
    setAiQuestionMileage(50);
    setAiEssayMileage(200);
    setCurriculumLinks([]);
    setSteps([
      {
        step_order: 1,
        step_type: 'BOOK_INTRO',
        step_title: '1단계: 작품·작가 소개 및 줄거리',
        step_badge: '독서 준비',
        content_str: JSON.stringify(DEFAULT_STEP_CONTENT_TEMPLATES.BOOK_INTRO, null, 2),
      },
      {
        step_order: 2,
        step_type: 'COMPREHENSION',
        step_title: '2단계: 내용 이해 및 인물 탐구',
        step_badge: '내용 파악',
        content_str: JSON.stringify(DEFAULT_STEP_CONTENT_TEMPLATES.COMPREHENSION, null, 2),
      },
      {
        step_order: 3,
        step_type: 'DISCUSSION',
        step_title: '3단계: 함께 이야기 나누기 & 활동',
        step_badge: '생각 넓히기',
        content_str: JSON.stringify(DEFAULT_STEP_CONTENT_TEMPLATES.DISCUSSION, null, 2),
      },
      {
        step_order: 4,
        step_type: 'ESSAY_WRITING',
        step_title: '4단계: AI 선생님 첨삭 글쓰기',
        step_badge: 'AI 첨삭 과제',
        content_str: JSON.stringify(DEFAULT_STEP_CONTENT_TEMPLATES.ESSAY_WRITING, null, 2),
      },
    ]);
    setPromptTitle('이 책을 읽고 핵심 쟁점에 대한 자신의 생각을 근거를 들어 글로 써 보세요.');
    setPromptGuide('서론(책 소개 및 내 입장) - 본론(책 속 사례와 근거) - 결론(느낀 점과 다짐)의 3단 구성으로 작성해 보세요.');
    setMinLength(150);
    setRecLength(400);
    setReadingMaterialsStr(
      JSON.stringify([{ title: '글쓰기 도움말', content: '책의 핵심 내용을 떠올리며 자신의 생각을 정리해 보세요.' }], null, 2)
    );
    setGemInstruction(
      '[역할 및 목적]\n너는 학생의 독서 논술을 지도하는 친절하고 전문적인 글쓰기 멘토 선생님이야.\n1) 칭찬할 점을 먼저 구체적으로 언급하고,\n2) 책 속 근거 활용과 서론-본론-결론 구성을 점검하며,\n3) 어색한 문장을 바르게 고쳐 예시를 보여주고,\n4) 생각을 확장하는 질문을 던져줘.'
    );
    setGemReferenceContext('');
    setStatusMsg(null);
  };

  const loadWorkbookForEdit = async (wbCode: string) => {
    setSelectedCode(wbCode);
    setStatusMsg('데이터를 불러오는 중...');
    const detail = await fetchAdminWorkbookFull(wbCode);
    const wb = detail.workbook;
    setCode(wb.code);
    setBookno(wb.bookno ? String(wb.bookno) : '');
    setIsbn(wb.isbn || '');
    setTitle(wb.title || '');
    setSubtitle(wb.subtitle || '');
    setAuthor(wb.author || '');
    setPublisher(wb.publisher || '');
    setGradeGroup((wb.grade_group as string) || wb.target_group || 'ELEM_HIGH');
    setTargetLabel(wb.target_label || '초등고학년');
    setSubjectCategory((wb.subject_category as string) || '국어');
    setBasicSkillCategory((wb.basic_skill_category as string) || '책읽기');
    setThemeCategory(wb.theme_category || '기초문해력');
    setThemeTagsStr((wb.theme_tags || [wb.theme_category]).join(', '));
    setKeywordsStr((wb.keywords || []).join(', '));
    setDurationMinutes(wb.duration_minutes || 60);
    setCoverEmoji(wb.cover_emoji || '📘');
    setBadgeColor(wb.badge_color || 'emerald');
    setTemplateMode((wb.template_mode as string) || (wb.is_builtin_interactive ? 'BUILTIN_CONSONANT' : 'STANDARD_GUIDE'));
    setAiQuestionMileage(wb.ai_question_mileage ?? 50);
    setAiEssayMileage(wb.ai_essay_mileage ?? 200);

    setCurriculumLinks(
      (wb.curriculum_links || []).map((c) => ({
        curriculum_id: c.curriculum_id,
        is_primary: c.is_primary,
        linkage_note: c.linkage_note || '',
      }))
    );

    setSteps(
      (detail.steps || []).map((s: StudyStep, idx: number) => ({
        step_order: s.step_order || idx + 1,
        step_type: s.step_type,
        step_title: s.step_title,
        step_badge: s.step_badge || '독서 활동',
        content_str: JSON.stringify(s.content || {}, null, 2),
      }))
    );

    const wp = detail.writing_prompts?.[0];
    setPromptTitle(wp?.question_title || '');
    setPromptGuide(wp?.question_guide || '');
    setMinLength(wp?.min_length || 150);
    setRecLength(wp?.recommended_length || 400);
    setReadingMaterialsStr(JSON.stringify(wp?.reading_materials || [], null, 2));

    setGemInstruction(detail.gem_config?.system_instruction || '');
    setGemReferenceContext(detail.gem_config?.reference_context || '');
    setStatusMsg(null);
  };

  const handleBookSearch = async () => {
    if (!bookQuery.trim()) return;
    setSearchingBook(true);
    try {
      const res = await searchAdminBooks(bookQuery.trim());
      setBookResults(res);
    } finally {
      setSearchingBook(false);
    }
  };

  const applySelectedBook = (b: any) => {
    setBookno(String(b.bookno || ''));
    setIsbn(b.isbn || '');
    setTitle(`${b.title} - 독서·논술 워크북`);
    setAuthor(b.author || '');
    setPublisher(b.publisher || '');
    if (b.detail) {
      setGemReferenceContext(`도서명: ${b.title} (${b.author} / ${b.publisher})\n책 소개: ${b.detail}`);
    }
    setBookResults([]);
  };

  const handleAiRecommendCurriculum = async () => {
    if (!title.trim()) {
      setStatusMsg('먼저 도서/워크북 제목을 입력해 주세요.');
      return;
    }
    setRecommendingCurr(true);
    setStatusMsg('AI가 NCIC 국가교육과정 교육목표를 분석하여 매칭 중입니다...');
    try {
      const recs = await recommendAdminCurriculum({
        title,
        subtitle,
        grade_group: gradeGroup,
        subject_category: subjectCategory,
        keywords: keywordsStr.split(',').map((k) => k.trim()).filter(Boolean),
        synopsis: gemReferenceContext,
      });
      setCurriculumLinks(recs);
      setStatusMsg(`✅ 국가교육과정 교육목표 ${recs.length}건이 자동 추천·연결되었습니다!`);
    } finally {
      setRecommendingCurr(false);
    }
  };

  const toggleCurriculumLink = (curr: CurriculumStandard) => {
    const exists = curriculumLinks.find((l) => l.curriculum_id === curr.id);
    if (exists) {
      setCurriculumLinks(curriculumLinks.filter((l) => l.curriculum_id !== curr.id));
    } else {
      setCurriculumLinks([
        ...curriculumLinks,
        {
          curriculum_id: curr.id,
          is_primary: curriculumLinks.length === 0 ? 1 : 0,
          linkage_note: `[${curr.grade_label} · ${curr.subject_category}] '${curr.domain_name}' 교육목표 연계 독후활동`,
        },
      ]);
    }
  };

  const handleAddStep = (stepType: string) => {
    const found = STANDARD_STEP_TYPES.find((t) => t.type === stepType);
    const nextOrder = steps.length + 1;
    setSteps([
      ...steps,
      {
        step_order: nextOrder,
        step_type: stepType,
        step_title: `${nextOrder}단계: ${found?.label.split(' (')[0] || '학습 활동'}`,
        step_badge: found?.badge || '독서 활동',
        content_str: JSON.stringify(DEFAULT_STEP_CONTENT_TEMPLATES[stepType] || {}, null, 2),
      },
    ]);
  };

  const handleSaveWorkbook = async () => {
    if (!code.trim() || !title.trim()) {
      setStatusMsg('⚠️ 워크북 고유 코드와 제목은 필수 입력 항목입니다.');
      return;
    }
    setSaving(true);
    setStatusMsg(null);
    try {
      const parsedSteps = steps.map((s, idx) => {
        let parsedContent = {};
        try {
          parsedContent = JSON.parse(s.content_str || '{}');
        } catch {
          parsedContent = { raw_text: s.content_str };
        }
        return {
          step_order: idx + 1,
          step_type: s.step_type,
          step_title: s.step_title,
          step_badge: s.step_badge,
          content: parsedContent,
        };
      });

      let parsedMaterials = [];
      try {
        parsedMaterials = JSON.parse(readingMaterialsStr || '[]');
      } catch {
        parsedMaterials = [];
      }

      const enrichedCurrLinks = curriculumLinks.map((link) => {
        const std = curriculumStandards.find((c) => c.id === link.curriculum_id);
        return {
          ...link,
          curriculum_code: std?.curriculum_code,
          grade_label: std?.grade_label,
          subject_category: std?.subject_category,
          detail_subject: std?.detail_subject,
          domain_name: std?.domain_name,
          educational_goal: std?.educational_goal,
          achievement_code: std?.achievement_code,
        };
      });

      await saveAdminWorkbook({
        code: code.trim(),
        bookno: bookno ? Number(bookno) : null,
        isbn: isbn || null,
        title: title.trim(),
        subtitle: subtitle.trim(),
        author: author.trim(),
        publisher: publisher.trim(),
        grade_group: gradeGroup,
        target_label: targetLabel,
        subject_category: subjectCategory,
        basic_skill_category: basicSkillCategory,
        theme_category: themeCategory.trim(),
        theme_tags: themeTagsStr
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        keywords: keywordsStr
          .split(',')
          .map((k) => k.trim())
          .filter(Boolean),
        duration_minutes: Number(durationMinutes || 60),
        cover_emoji: coverEmoji || '📘',
        badge_color: badgeColor || 'emerald',
        template_mode: templateMode,
        is_builtin_interactive:
          templateMode === 'BUILTIN_VOWEL' ||
          templateMode === 'BUILTIN_CONSONANT' ||
          templateMode === 'INTERACTIVE_WORKBOOK'
            ? 1
            : 0,
        is_free_content: 1,
        ai_question_mileage: Number(aiQuestionMileage || 50),
        ai_essay_mileage: Number(aiEssayMileage || 200),
        curriculum_links: enrichedCurrLinks,
        steps: parsedSteps,
        writing_prompt: promptTitle.trim()
          ? {
              prompt_code: `${code.trim()}_essay`,
              workbook_code: code.trim(),
              question_title: promptTitle.trim(),
              question_guide: promptGuide.trim(),
              min_length: Number(minLength || 150),
              recommended_length: Number(recLength || 400),
              required_credits: Number(aiEssayMileage || 200),
              reading_materials: parsedMaterials,
            }
          : null,
        gem_config: gemInstruction.trim()
          ? {
              gem_code: `GEM_${code.trim().toUpperCase()}`,
              title: `《${title.trim()}》 AI 첨삭 지침`,
              target_audience: targetLabel,
              system_instruction: gemInstruction,
              reference_context: gemReferenceContext,
              rubric: [
                { name: '핵심 개념 및 주제의 이해', weight: 25, desc: '책의 핵심 내용을 정확히 파악했는가' },
                { name: '책 속 근거 활용의 적절성', weight: 25, desc: '인물과 사건을 근거로 들어 논증했는가' },
                { name: '논리 구조(서론-본론-결론) 및 문장력', weight: 25, desc: '문장 호응과 구성이 탄탄한가' },
                { name: '삶과의 연결 및 창의적 성찰', weight: 25, desc: '자신의 삶과 사회에 적용했는가' },
              ],
            }
          : null,
      });

      setStatusMsg('✅ 독서활동(워크북·지도안·교육과정 매핑·AI 지침)이 성공적으로 저장되었습니다!');
      onSaved();
    } catch (err: any) {
      setStatusMsg(`⚠️ 저장 실패: ${err?.message || '오류가 발생했습니다.'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCurrent = async () => {
    if (selectedCode === 'NEW' || !code) return;
    if (!window.confirm(`정말로 '${title}' 워크북을 삭제하시겠습니까?`)) return;
    await deleteAdminWorkbook(code);
    onSaved();
    resetToNewWorkbook();
  };

  const handleSaveNewCurriculum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currCode.trim() || !currDomain.trim() || !currGoal.trim()) {
      setStatusMsg('⚠️ 교육과정 코드, 영역명, 교육목표는 필수입니다.');
      return;
    }
    const gObj = GRADE_GROUPS.find((g) => g.key === currGrade);
    await saveAdminCurriculum({
      id: Date.now(),
      curriculum_code: currCode.trim(),
      revision_year: '2022 개정',
      grade_group: currGrade,
      grade_label: gObj?.label || currGrade,
      subject_category: currSubject,
      detail_subject: currDetailSubj,
      domain_name: currDomain,
      educational_goal: currGoal,
      achievement_code: currAchCode,
      ncic_ref_id: currNcicRef,
      keywords: [],
    });
    setStatusMsg('✅ 새 NCIC 국가교육과정 교육목표가 DB에 등록되었습니다!');
    setCurrCode('');
    setCurrDomain('');
    setCurrGoal('');
    setCurrAchCode('');
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-2 md:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden border border-gray-200">
        {/* Top Bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚙️</span>
            <div>
              <h2 className="text-lg md:text-xl font-black">독서활동앱 통합 관리자 콘솔</h2>
              <p className="text-xs text-slate-300">
                4차원 분류 · 표준형 지도안/인터랙티브 템플릿 조립 · NCIC 국가교육과정 교육목표 DB 매핑 · AI 마일리지 정책 관리
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('WORKBOOK')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-colors ${
                activeTab === 'WORKBOOK' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              📘 워크북 · 독서지도안 추가/수정
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('CURRICULUM')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-colors ${
                activeTab === 'CURRICULUM' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              🏛️ NCIC 국가교육과정 교육목표 DB ({curriculumStandards.length})
            </button>
            <button
              type="button"
              onClick={onClose}
              className="ml-2 px-3 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-bold"
            >
              닫기 ✕
            </button>
          </div>
        </div>

        {statusMsg && (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 text-xs font-extrabold text-amber-900 flex items-center justify-between">
            <span>{statusMsg}</span>
            <button type="button" onClick={() => setStatusMsg(null)} className="text-amber-700 font-bold">
              ✕
            </button>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'WORKBOOK' ? (
            <div className="space-y-6">
              {/* 0. 수정할 워크북 선택 또는 신규 생성 */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-extrabold text-slate-600">대상 선택:</span>
                  <button
                    type="button"
                    onClick={resetToNewWorkbook}
                    className={`px-3.5 py-2 rounded-xl text-xs font-extrabold border ${
                      selectedCode === 'NEW'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    + 새 독서활동(워크북/지도안) 만들기
                  </button>
                  {workbooks.map((w) => (
                    <button
                      key={w.code}
                      type="button"
                      onClick={() => loadWorkbookForEdit(w.code)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold border ${
                        selectedCode === w.code
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-slate-700 border-slate-300 hover:border-indigo-400'
                      }`}
                    >
                      {w.cover_emoji} {w.title}
                    </button>
                  ))}
                </div>

                {selectedCode !== 'NEW' && (
                  <button
                    type="button"
                    onClick={handleDeleteCurrent}
                    className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-extrabold"
                  >
                    🗑️ 이 워크북 삭제
                  </button>
                )}
              </div>

              {/* 1. 리더스가이드 도서(bookinfo) 연동 검색 */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-black text-emerald-950">
                      1. 도서 정보 불러오기 (리더스가이드 도서 DB 연동 · 선택사항)
                    </h3>
                    <p className="text-xs text-emerald-800">
                      도서명, ISBN 또는 책번호(bookno)로 검색하면 저자·출판사·구매링크가 자동 입력됩니다. (별도 앱 단독 배포 시 비워두어도 무방합니다.)
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={bookQuery}
                      onChange={(e) => setBookQuery(e.target.value)}
                      placeholder="예: GMO 아이, 미쳐야 미친다, 32204"
                      className="px-3 py-2 rounded-xl border border-emerald-300 text-xs w-64"
                    />
                    <button
                      type="button"
                      onClick={handleBookSearch}
                      disabled={searchingBook}
                      className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold"
                    >
                      {searchingBook ? '검색 중...' : '🔍 도서 검색'}
                    </button>
                  </div>
                </div>

                {bookResults.length > 0 && (
                  <div className="bg-white rounded-xl border border-emerald-200 divide-y max-h-44 overflow-y-auto">
                    {bookResults.map((b) => (
                      <div key={b.bookno} className="p-2.5 flex items-center justify-between text-xs hover:bg-emerald-50">
                        <div>
                          <strong className="text-gray-900">{b.title}</strong>{' '}
                          <span className="text-gray-500">
                            ({b.author} | {b.publisher} | bookno: {b.bookno})
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => applySelectedBook(b)}
                          className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold"
                        >
                          선택 적용
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. 기본 정보 및 4차원 분류(학년별 / 교과별 / 주제별 / 기본학습) & 마일리지 설정 */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 shadow-sm">
                <h3 className="text-sm font-black text-gray-900">
                  2. 기본 메타데이터 &amp; 4차원 대시보드 분류 &amp; AI 마일리지 차감 설정
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">워크북 고유 코드 (영문/숫자)</label>
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">리더스가이드 책번호 (bookno)</label>
                    <input
                      type="text"
                      value={bookno}
                      onChange={(e) => setBookno(e.target.value)}
                      placeholder="선택사항 (예: 32204)"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">아이콘 이모지</label>
                    <input
                      type="text"
                      value={coverEmoji}
                      onChange={(e) => setCoverEmoji(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">실행 엔진 모드 (표준형 선택)</label>
                    <select
                      value={templateMode}
                      onChange={(e) => setTemplateMode(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold"
                    >
                      <option value="STANDARD_GUIDE">표준 독서지도안 + 인터랙티브 하이브리드</option>
                      <option value="INTERACTIVE_WORKBOOK">인터랙티브 퍼즐 중심 워크북</option>
                      <option value="BUILTIN_VOWEL">나래와 산이 모음편 전용 뷰어</option>
                      <option value="BUILTIN_CONSONANT">나래와 산이 받침편 전용 뷰어</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">독서활동 제목</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="예: GMO 아이 - 초등 독서·논술 지도안"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">부제 (한줄 설명)</label>
                    <input
                      type="text"
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      placeholder="예: 유전자 조작과 생명의 존엄성을 생각하는 독서 워크북"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">저자</label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">출판사</label>
                    <input
                      type="text"
                      value={publisher}
                      onChange={(e) => setPublisher(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-emerald-700 mb-1">
                      💬 AI 질문 1회 차감 마일리지(P)
                    </label>
                    <input
                      type="number"
                      value={aiQuestionMileage}
                      onChange={(e) => setAiQuestionMileage(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-emerald-400 bg-emerald-50/40 text-xs font-extrabold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-indigo-700 mb-1">
                      ✍️ AI 논술첨삭 1회 차감 마일리지(P)
                    </label>
                    <input
                      type="number"
                      value={aiEssayMileage}
                      onChange={(e) => setAiEssayMileage(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-indigo-400 bg-indigo-50/40 text-xs font-extrabold"
                    />
                  </div>
                </div>

                {/* 4차원 분류 지정 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2 border-t border-gray-100">
                  <div>
                    <label className="block text-xs font-extrabold text-gray-800 mb-1">① 학년별 (7단계)</label>
                    <select
                      value={gradeGroup}
                      onChange={(e) => {
                        setGradeGroup(e.target.value);
                        const found = GRADE_GROUPS.find((g) => g.key === e.target.value);
                        if (found) setTargetLabel(found.label);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold"
                    >
                      {GRADE_GROUPS.filter((g) => g.key !== 'ALL').map((g) => (
                        <option key={g.key} value={g.key}>
                          {g.icon} {g.label} ({g.shortLabel})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-gray-800 mb-1">② 교과별 (7대 교과)</label>
                    <select
                      value={subjectCategory}
                      onChange={(e) => setSubjectCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold"
                    >
                      {SUBJECT_CATEGORIES.filter((s) => s.key !== 'ALL').map((s) => (
                        <option key={s.key} value={s.key}>
                          {s.icon} {s.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-gray-800 mb-1">③ 기본학습 (4대 영역)</label>
                    <select
                      value={basicSkillCategory}
                      onChange={(e) => setBasicSkillCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold"
                    >
                      {BASIC_SKILL_CATEGORIES.filter((b) => b.key !== 'ALL').map((b) => (
                        <option key={b.key} value={b.key}>
                          {b.icon} {b.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-gray-800 mb-1">
                      ④ 주제별 (쉼표 구분 → 대시보드 자동반영)
                    </label>
                    <input
                      type="text"
                      value={themeTagsStr}
                      onChange={(e) => {
                        setThemeTagsStr(e.target.value);
                        const first = e.target.value.split(',')[0]?.trim();
                        if (first) setThemeCategory(first);
                      }}
                      placeholder="예: 생명윤리·미래과학, 환경·생태"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* 3. NCIC 국가교육과정 교육목표 매핑 */}
              <div className="bg-indigo-50/60 border border-indigo-200 rounded-2xl p-5 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-black text-indigo-950">
                      3. 우리나라 교육과정(NCIC 2022 개정) 교육목표 · 성취기준 연결
                    </h3>
                    <p className="text-xs text-indigo-800">
                      주교과 및 타교과 융합 교육목표를 연결하면 대시보드와 지도안 상단에 국가교육과정 연계 배지가 표시됩니다.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAiRecommendCurriculum}
                    disabled={recommendingCurr}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow"
                  >
                    {recommendingCurr ? 'AI 분석 중...' : '🤖 AI로 국가교육과정 목표 자동 추천받기'}
                  </button>
                </div>

                {/* 선택된 교육과정 목표 리스트 */}
                {curriculumLinks.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-extrabold text-indigo-900">
                      연결된 교육과정 목표 ({curriculumLinks.length}건):
                    </div>
                    {curriculumLinks.map((link, idx) => {
                      const std = curriculumStandards.find((c) => c.id === link.curriculum_id);
                      return (
                        <div
                          key={link.curriculum_id}
                          className="bg-white rounded-xl p-3 border border-indigo-200 flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs"
                        >
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-0.5 rounded-full font-extrabold text-[11px] ${
                                  link.is_primary
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-200 text-gray-700'
                                }`}
                              >
                                {link.is_primary ? '주교과 연계' : '융합교과 연계'}
                              </span>
                              <strong className="text-gray-900">
                                [{std?.grade_label} · {std?.subject_category}] {std?.domain_name}{' '}
                                <span className="text-indigo-600">{std?.achievement_code}</span>
                              </strong>
                            </div>
                            <input
                              type="text"
                              value={link.linkage_note}
                              onChange={(e) => {
                                const next = [...curriculumLinks];
                                next[idx] = { ...next[idx], linkage_note: e.target.value };
                                setCurriculumLinks(next);
                              }}
                              placeholder="이 책과 해당 교육목표의 연계 해설"
                              className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setCurriculumLinks(curriculumLinks.filter((l) => l.curriculum_id !== link.curriculum_id))
                            }
                            className="px-2.5 py-1 rounded-lg bg-red-50 text-red-600 font-bold self-end md:self-center"
                          >
                            연결 해제
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* 전체 NCIC 목록에서 체크박스 선택 */}
                <details className="bg-white rounded-xl border border-indigo-100 p-3">
                  <summary className="text-xs font-extrabold text-indigo-800 cursor-pointer">
                    + 전체 국가교육과정 교육목표 목록에서 직접 선택/추가하기 ({curriculumStandards.length}종)
                  </summary>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 max-h-56 overflow-y-auto p-1">
                    {curriculumStandards.map((std) => {
                      const checked = curriculumLinks.some((l) => l.curriculum_id === std.id);
                      return (
                        <label
                          key={std.id}
                          className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-start gap-2 ${
                            checked ? 'border-indigo-600 bg-indigo-50/60' : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleCurriculumLink(std)}
                            className="mt-1"
                          />
                          <div>
                            <div className="font-extrabold text-gray-900">
                              [{std.grade_label} · {std.subject_category}] {std.domain_name}{' '}
                              <span className="text-indigo-600">{std.achievement_code}</span>
                            </div>
                            <div className="text-[11px] text-gray-600 mt-0.5">{std.educational_goal}</div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </details>
              </div>

              {/* 4. 표준형 단계별 학습(지도안 블록 & 인터랙티브 퍼즐) 조립 에디터 */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-black text-gray-900">
                      4. 표준형 단계별 학습 조립 에디터 (지도안 블록 + 14종 인터랙티브 퍼즐)
                    </h3>
                    <p className="text-xs text-gray-500">
                      매번 새로 코딩하지 않고 표준 블록을 조합하여 학습 단계를 구성합니다. 인터랙티브 활동(`INTERACTIVE_ACTIVITY`)도 자유롭게 끼워 넣을 수 있습니다.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {STANDARD_STEP_TYPES.map((st) => (
                      <button
                        key={st.type}
                        type="button"
                        onClick={() => handleAddStep(st.type)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-extrabold"
                      >
                        + {st.badge} 추가
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  {steps.map((st, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-2xl p-4 bg-gray-50/60 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1">
                          <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-white text-xs font-extrabold">
                            Step {idx + 1}
                          </span>
                          <select
                            value={st.step_type}
                            onChange={(e) => {
                              const next = [...steps];
                              next[idx] = { ...next[idx], step_type: e.target.value };
                              setSteps(next);
                            }}
                            className="px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs font-bold bg-white"
                          >
                            {STANDARD_STEP_TYPES.map((t) => (
                              <option key={t.type} value={t.type}>
                                {t.type} ({t.badge})
                              </option>
                            ))}
                          </select>
                          <input
                            type="text"
                            value={st.step_title}
                            onChange={(e) => {
                              const next = [...steps];
                              next[idx] = { ...next[idx], step_title: e.target.value };
                              setSteps(next);
                            }}
                            className="flex-1 px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-bold bg-white"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setSteps(steps.filter((_, i) => i !== idx))}
                          className="text-xs text-red-600 font-bold px-2 py-1 hover:bg-red-50 rounded-lg"
                        >
                          삭제
                        </button>
                      </div>

                      {st.step_type === 'INTERACTIVE_ACTIVITY' && (
                        <div className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-2">
                          💡 사용 가능한 14종 표준 인터랙티브 템플릿:{' '}
                          {INTERACTIVE_ACTIVITY_TYPES.map((t) => t.type).join(', ')}
                        </div>
                      )}

                      <textarea
                        rows={5}
                        value={st.content_str}
                        onChange={(e) => {
                          const next = [...steps];
                          next[idx] = { ...next[idx], content_str: e.target.value };
                          setSteps(next);
                        }}
                        className="w-full p-3 rounded-xl border border-gray-300 font-mono text-xs bg-white"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. 글쓰기 발문 및 비공개 AI Gems 지침 */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 shadow-sm">
                <h3 className="text-sm font-black text-gray-900">
                  5. 글쓰기·논술 발문 &amp; 비공개 AI 멘토(Gems) 첨삭 지침
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">글쓰기/논술 발문 제목</label>
                    <input
                      type="text"
                      value={promptTitle}
                      onChange={(e) => setPromptTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">작성 가이드 (힌트)</label>
                    <input
                      type="text"
                      value={promptGuide}
                      onChange={(e) => setPromptGuide(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-indigo-700 mb-1">
                      🔒 비공개 AI Gems 첨삭 지침 (클라이언트 비노출 · 서버 전용)
                    </label>
                    <textarea
                      rows={5}
                      value={gemInstruction}
                      onChange={(e) => setGemInstruction(e.target.value)}
                      className="w-full p-3 rounded-xl border border-indigo-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">
                      참고 도서 줄거리 / 인물 / 제시문 배경지식 (AI 참조용)
                    </label>
                    <textarea
                      rows={5}
                      value={gemReferenceContext}
                      onChange={(e) => setGemReferenceContext(e.target.value)}
                      className="w-full p-3 rounded-xl border border-gray-300 text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 rounded-2xl bg-gray-200 hover:bg-gray-300 text-gray-800 font-extrabold text-sm"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleSaveWorkbook}
                  disabled={saving}
                  className="px-8 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-lg"
                >
                  {saving ? '저장 중...' : '💾 독서활동 및 교육과정 매핑 저장하기'}
                </button>
              </div>
            </div>
          ) : (
            /* NCIC 국가교육과정 교육목표 마스터 관리 탭 */
            <div className="space-y-6">
              <form
                onSubmit={handleSaveNewCurriculum}
                className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-5 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-indigo-950">
                      + 새 국가교육과정(NCIC) 교육목표 · 성취기준 추가
                    </h3>
                    <p className="text-xs text-indigo-800">
                      https://www.ncic.re.kr/inv/org/list.do 의 학년군·교과별 교육목표 및 성취기준을 추가합니다.
                    </p>
                  </div>
                  <a
                    href="https://www.ncic.re.kr/inv/org/list.do"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-white border border-indigo-300 text-indigo-700 text-xs font-extrabold hover:bg-indigo-100"
                  >
                    🏛️ NCIC 국가교육과정정보센터 원문 열기 ↗
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">표준 코드</label>
                    <input
                      type="text"
                      value={currCode}
                      onChange={(e) => setCurrCode(e.target.value)}
                      placeholder="예: 2022-ELEM34-SCI-01"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">대상 학년군</label>
                    <select
                      value={currGrade}
                      onChange={(e) => setCurrGrade(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold"
                    >
                      {GRADE_GROUPS.filter((g) => g.key !== 'ALL').map((g) => (
                        <option key={g.key} value={g.key}>
                          {g.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">교과 분류</label>
                    <select
                      value={currSubject}
                      onChange={(e) => setCurrSubject(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold"
                    >
                      {SUBJECT_CATEGORIES.filter((s) => s.key !== 'ALL').map((s) => (
                        <option key={s.key} value={s.key}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">대표 성취기준 코드</label>
                    <input
                      type="text"
                      value={currAchCode}
                      onChange={(e) => setCurrAchCode(e.target.value)}
                      placeholder="예: [4과03-02]"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">세부 과목명</label>
                    <input
                      type="text"
                      value={currDetailSubj}
                      onChange={(e) => setCurrDetailSubj(e.target.value)}
                      placeholder="예: 과학 (초3~4), 통합사회"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">교과 영역 / 대주제명</label>
                    <input
                      type="text"
                      value={currDomain}
                      onChange={(e) => setCurrDomain(e.target.value)}
                      placeholder="예: 생물의 한살이와 생태계 보전"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    교육목표 및 핵심 아이디어 요약
                  </label>
                  <textarea
                    rows={2}
                    value={currGoal}
                    onChange={(e) => setCurrGoal(e.target.value)}
                    placeholder="NCIC 교육과정에 제시된 핵심 교육목표 및 성취기준 설명을 입력하세요."
                    className="w-full p-3 rounded-xl border border-gray-300 text-xs"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold"
                  >
                    + 교육과정 목표 DB 등록
                  </button>
                </div>
              </form>

              <div className="space-y-2">
                <h4 className="text-xs font-extrabold text-gray-600 uppercase">
                  현재 등록된 국가교육과정 교육목표 ({curriculumStandards.length}건)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {curriculumStandards.map((c) => (
                    <div key={c.curriculum_code} className="p-4 rounded-2xl border border-gray-200 bg-white space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-extrabold">
                          {c.grade_label} · {c.subject_category} ({c.detail_subject})
                        </span>
                        <span className="font-mono text-indigo-600 font-bold">{c.achievement_code}</span>
                      </div>
                      <div className="font-black text-gray-900 text-sm pt-1">{c.domain_name}</div>
                      <p className="text-xs text-gray-600 leading-relaxed">{c.educational_goal}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminConsoleModal;
