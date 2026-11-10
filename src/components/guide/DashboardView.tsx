import React, { useState, useMemo } from 'react';
import {
  WorkbookItem,
  RoadmapTheme,
  CurriculumStandard,
  GRADE_GROUPS,
  SUBJECT_CATEGORIES,
  BASIC_SKILL_CATEGORIES,
  GradeGroupKey,
  SubjectCategoryKey,
  BasicSkillCategoryKey,
} from '../../data/studyGuideData';
import { UserWallet, RgMemberUser, DynamicThemeItem } from '../../services/workbookApi';

interface DashboardViewProps {
  workbooks: WorkbookItem[];
  roadmaps: RoadmapTheme[];
  curriculumStandards: CurriculumStandard[];
  dynamicThemes: DynamicThemeItem[];
  wallet: UserWallet;
  currentUser: RgMemberUser | null;
  onSelectWorkbook: (code: string) => void;
  onOpenWalletModal: () => void;
  onOpenMemberModal: () => void;
  onOpenAdminModal: (editCode?: string) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({
  workbooks,
  roadmaps,
  curriculumStandards,
  dynamicThemes,
  currentUser,
  onSelectWorkbook,
  onOpenMemberModal,
  onOpenAdminModal,
}) => {
  // 기본 진입 화면: 바로 리스트가 뜨지 않고 대시보드 허브('HUB')가 먼저 나타남
  const [viewMode, setViewMode] = useState<'HUB' | 'LIST' | 'CURRICULUM' | 'ROADMAP'>('HUB');

  // 4-Dimensional Filter States (LIST 화면에서 활성)
  const [selectedBasicSkill, setSelectedBasicSkill] = useState<'ALL' | BasicSkillCategoryKey>('ALL');
  const [selectedGrade, setSelectedGrade] = useState<'ALL' | GradeGroupKey>('ALL');
  const [selectedSubject, setSelectedSubject] = useState<'ALL' | SubjectCategoryKey>('ALL');
  const [selectedThemeTag, setSelectedThemeTag] = useState<string>('ALL');
  const [selectedCurriculumId, setSelectedCurriculumId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Dynamic theme aggregation (추가되는 도서 주제를 자동으로 모아서 반영)
  const aggregatedThemes = useMemo(() => {
    const counts: Record<string, number> = {};
    workbooks.forEach((wb) => {
      const tags = wb.theme_tags && wb.theme_tags.length > 0 ? wb.theme_tags : wb.keywords || [];
      tags.forEach((tg) => {
        const clean = tg.trim();
        if (clean) counts[clean] = (counts[clean] || 0) + 1;
      });
      if (wb.theme_category) {
        counts[wb.theme_category] = (counts[wb.theme_category] || 0) + 1;
      }
    });
    if (Object.keys(counts).length === 0 && dynamicThemes.length > 0) {
      return dynamicThemes.map((d) => ({ tag: d.label || d.key, count: d.count }));
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([tag, count]) => ({ tag, count }));
  }, [workbooks, dynamicThemes]);

  // 학년별 도서 수 집계
  const getGradeBookCount = (gradeKey: GradeGroupKey) => {
    return workbooks.filter((wb) => {
      const wbGrade = wb.grade_group || wb.target_group;
      const hasCurr = (wb.curriculum_links || []).some((lk) => lk.grade_group === gradeKey);
      return wbGrade === gradeKey || hasCurr;
    }).length;
  };

  // 교과별 도서 수 및 NCIC 성취기준 수 집계
  const getSubjectStats = (subjectKey: SubjectCategoryKey) => {
    const bookCount = workbooks.filter((wb) => {
      const hasCurr = (wb.curriculum_links || []).some((lk) => lk.subject_category === subjectKey);
      return wb.subject_category === subjectKey || hasCurr;
    }).length;
    const standardCount = curriculumStandards.filter((cs) => cs.subject_category === subjectKey).length;
    return { bookCount, standardCount };
  };

  // 기본학습별 도서 수 집계
  const getBasicSkillCount = (skillKey: BasicSkillCategoryKey) => {
    return workbooks.filter((wb) => (wb.basic_skill_category || '책읽기') === skillKey).length;
  };

  // Matching NCIC curriculum standards based on active Grade & Subject filters
  const matchingCurriculumStandards = useMemo(() => {
    return curriculumStandards.filter((cs) => {
      const gradeMatch = selectedGrade === 'ALL' || cs.grade_group === selectedGrade;
      const subjectMatch = selectedSubject === 'ALL' || cs.subject_category === selectedSubject;
      return gradeMatch && subjectMatch;
    });
  }, [curriculumStandards, selectedGrade, selectedSubject]);

  // Filtered workbooks across all 4 dimensions + NCIC curriculum + search
  const filteredWorkbooks = useMemo(() => {
    return workbooks.filter((wb) => {
      const wbGrade = wb.grade_group || wb.target_group || 'ELEM_HIGH';
      const wbSubject = wb.subject_category || '국어';
      const wbBasic = wb.basic_skill_category || '책읽기';
      const wbTags = wb.theme_tags && wb.theme_tags.length > 0 ? wb.theme_tags : wb.keywords || [];
      const wbLinks = wb.curriculum_links || [];

      if (selectedBasicSkill !== 'ALL' && wbBasic !== selectedBasicSkill) {
        return false;
      }

      if (selectedGrade !== 'ALL') {
        const hasCurriculumGrade = wbLinks.some((lk) => lk.grade_group === selectedGrade);
        if (wbGrade !== selectedGrade && !hasCurriculumGrade) {
          return false;
        }
      }

      if (selectedSubject !== 'ALL') {
        const hasCurriculumSubject = wbLinks.some((lk) => lk.subject_category === selectedSubject);
        if (wbSubject !== selectedSubject && !hasCurriculumSubject) {
          return false;
        }
      }

      if (selectedCurriculumId !== null) {
        const hasStandard = wbLinks.some((lk) => lk.curriculum_id === selectedCurriculumId);
        if (!hasStandard) return false;
      }

      if (selectedThemeTag !== 'ALL') {
        const matchTag =
          wbTags.includes(selectedThemeTag) ||
          (wb.keywords || []).includes(selectedThemeTag) ||
          wb.theme_category === selectedThemeTag;
        if (!matchTag) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const hay = `${wb.title} ${wb.author} ${wb.publisher} ${wb.subtitle} ${wbTags.join(' ')}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }

      return true;
    });
  }, [
    workbooks,
    selectedBasicSkill,
    selectedGrade,
    selectedSubject,
    selectedCurriculumId,
    selectedThemeTag,
    searchQuery,
  ]);

  const resetFilters = () => {
    setSelectedBasicSkill('ALL');
    setSelectedGrade('ALL');
    setSelectedSubject('ALL');
    setSelectedThemeTag('ALL');
    setSelectedCurriculumId(null);
    setSearchQuery('');
  };

  // 대시보드 타일 클릭 시 해당 조건으로 리스트 화면 진입
  const openListWithGrade = (gradeKey: GradeGroupKey) => {
    resetFilters();
    setSelectedGrade(gradeKey);
    setViewMode('LIST');
  };

  const openListWithSubject = (subjectKey: SubjectCategoryKey) => {
    resetFilters();
    setSelectedSubject(subjectKey);
    setViewMode('LIST');
  };

  const openListWithBasicSkill = (skillKey: BasicSkillCategoryKey) => {
    resetFilters();
    setSelectedBasicSkill(skillKey);
    setViewMode('LIST');
  };

  const openListWithTheme = (tag: string) => {
    resetFilters();
    setSelectedThemeTag(tag);
    setViewMode('LIST');
  };

  const gradeItemsOnly = GRADE_GROUPS.filter((g) => g.key !== 'ALL') as Array<{
    key: GradeGroupKey;
    label: string;
    shortLabel: string;
    icon: string;
    desc: string;
  }>;

  const subjectItemsOnly = SUBJECT_CATEGORIES.filter((s) => s.key !== 'ALL') as Array<{
    key: SubjectCategoryKey;
    label: string;
    icon: string;
  }>;

  const basicSkillItemsOnly = BASIC_SKILL_CATEGORIES.filter((b) => b.key !== 'ALL') as Array<{
    key: BasicSkillCategoryKey;
    label: string;
    icon: string;
    desc: string;
  }>;

  return (
    <div className="space-y-6 pt-1">
      {/* Top Hero Banner — "독서맵으로 하는 독서활동" 단일 브랜딩 */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-indigo-800 rounded-3xl p-6 md:p-8 text-white shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-extrabold">
                📚 리더스가이드 · NCIC 국가교육과정 연계
              </span>
              <span className="inline-flex items-center gap-1.5 bg-amber-400/25 border border-amber-300/40 text-amber-200 px-3 py-1 rounded-full text-xs font-extrabold">
                ✨ 무료 오픈 운영 중
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              독서맵으로 하는 독서활동
            </h1>
            <p className="text-sm md:text-base text-emerald-50 max-w-2xl leading-relaxed">
              학년별(7단계) · 교과별(7대 교과 및 국가교육과정 교육목표) · 기본학습(한국어/책읽기/논술/글쓰기) · 주제별로
              원하는 독서활동을 선택해 학습하고 AI 멘토 첨삭을 받아보세요.
            </p>
          </div>

          {/* 우측 빠른 실행 & 관리자 진입 카드 (이용권 충전 안내 제거) */}
          <div className="bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl p-4 min-w-[270px] space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="text-xs font-extrabold text-emerald-100">
                {currentUser ? (
                  <span>
                    👤 <strong>{currentUser.nickname || currentUser.userid}</strong>님
                  </span>
                ) : (
                  <span>🌱 누구나 무료로 학습 가능합니다</span>
                )}
              </div>
              <button
                type="button"
                onClick={onOpenMemberModal}
                className="px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-extrabold transition-colors"
              >
                {currentUser ? '계정/로그아웃' : '🔐 리더스가이드 로그인'}
              </button>
            </div>

            <button
              type="button"
              onClick={() => onOpenAdminModal()}
              className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-gray-950 font-black text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>🛠️ 관리자 페이지 열기 (도서·지도안 추가/수정)</span>
            </button>
          </div>
        </div>

        {/* Main View Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2.5 mt-6 pt-5 border-t border-white/20">
          <button
            type="button"
            onClick={() => setViewMode('HUB')}
            className={`px-5 py-2.5 rounded-xl font-black text-sm transition-all ${
              viewMode === 'HUB'
                ? 'bg-white text-emerald-950 shadow-md scale-[1.02]'
                : 'bg-black/25 text-white hover:bg-black/35'
            }`}
          >
            🏠 대시보드 홈 (학년별·교과별·기본학습·주제별)
          </button>
          <button
            type="button"
            onClick={() => setViewMode('LIST')}
            className={`px-5 py-2.5 rounded-xl font-black text-sm transition-all ${
              viewMode === 'LIST'
                ? 'bg-white text-emerald-950 shadow-md scale-[1.02]'
                : 'bg-black/25 text-white hover:bg-black/35'
            }`}
          >
            📚 독서활동 전체 리스트 ({filteredWorkbooks.length})
          </button>
          <button
            type="button"
            onClick={() => setViewMode('CURRICULUM')}
            className={`px-5 py-2.5 rounded-xl font-black text-sm transition-all ${
              viewMode === 'CURRICULUM'
                ? 'bg-white text-emerald-950 shadow-md scale-[1.02]'
                : 'bg-black/25 text-white hover:bg-black/35'
            }`}
          >
            🏛️ 국가교육과정(NCIC) 교육목표 매핑표 ({curriculumStandards.length})
          </button>
          <button
            type="button"
            onClick={() => setViewMode('ROADMAP')}
            className={`px-5 py-2.5 rounded-xl font-black text-sm transition-all ${
              viewMode === 'ROADMAP'
                ? 'bg-white text-emerald-950 shadow-md scale-[1.02]'
                : 'bg-black/25 text-white hover:bg-black/35'
            }`}
          >
            🗺️ 독서맵 / 책지도 ({roadmaps.length})
          </button>
        </div>
      </div>

      {/* =====================================================================
          VIEW 1: 대시보드 홈 ('HUB') — 바로 도서 리스트가 뜨지 않고 대형 카테고리 카드 표시
         ===================================================================== */}
      {viewMode === 'HUB' && (
        <div className="space-y-8">
          {/* 1. 학년별 대시보드 섹션 (7단계 대형 카드) */}
          <section className="bg-emerald-50/60 border-2 border-emerald-200 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="inline-block text-xs font-black bg-emerald-700 text-white px-3 py-1 rounded-full mb-1">
                  DASHBOARD 01 · 학년별
                </span>
                <h2 className="text-xl md:text-2xl font-black text-gray-900">
                  🎓 학년별 독서활동 선택 (영유아 ~ 고등학생)
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  resetFilters();
                  setViewMode('LIST');
                }}
                className="text-xs font-extrabold text-emerald-800 bg-white border border-emerald-300 hover:bg-emerald-100 px-3.5 py-2 rounded-xl"
              >
                전체 학년 도서 보기 →
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
              {gradeItemsOnly.map((gr) => {
                const count = getGradeBookCount(gr.key);
                return (
                  <button
                    key={gr.key}
                    type="button"
                    onClick={() => openListWithGrade(gr.key)}
                    className="group bg-white hover:bg-emerald-600 border-2 border-emerald-200 hover:border-emerald-600 rounded-2xl p-4 text-left shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-3xl">{gr.icon}</span>
                        <span className="text-xs font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 group-hover:bg-white group-hover:text-emerald-900">
                          {count}권
                        </span>
                      </div>
                      <div className="text-base md:text-lg font-black text-gray-900 group-hover:text-white">
                        {gr.label}
                      </div>
                      <div className="text-xs text-gray-500 group-hover:text-emerald-100 mt-1 leading-snug">
                        {gr.desc}
                      </div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-gray-100 group-hover:border-emerald-500 text-xs font-extrabold text-emerald-700 group-hover:text-white flex items-center justify-between">
                      <span>활동 열기</span>
                      <span>→</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 2. 교과별 대시보드 섹션 (7대 교과 대형 카드) */}
          <section className="bg-indigo-50/60 border-2 border-indigo-200 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="inline-block text-xs font-black bg-indigo-700 text-white px-3 py-1 rounded-full mb-1">
                  DASHBOARD 02 · 교과별 (NCIC 교육과정 연계)
                </span>
                <h2 className="text-xl md:text-2xl font-black text-gray-900">
                  📘 교과별 독서활동 선택 (7대 교과 &amp; 국가교육과정 교육목표)
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setViewMode('CURRICULUM')}
                className="text-xs font-extrabold text-indigo-800 bg-white border border-indigo-300 hover:bg-indigo-100 px-3.5 py-2 rounded-xl"
              >
                🏛️ 국가교육과정 성취기준 전체 표 보기 →
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
              {subjectItemsOnly.map((sb) => {
                const { bookCount, standardCount } = getSubjectStats(sb.key);
                return (
                  <button
                    key={sb.key}
                    type="button"
                    onClick={() => openListWithSubject(sb.key)}
                    className="group bg-white hover:bg-indigo-600 border-2 border-indigo-200 hover:border-indigo-600 rounded-2xl p-4 text-left shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-3xl">{sb.icon}</span>
                        <span className="text-xs font-black px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-900 group-hover:bg-white group-hover:text-indigo-900">
                          {bookCount}권
                        </span>
                      </div>
                      <div className="text-base md:text-lg font-black text-gray-900 group-hover:text-white">
                        {sb.label}
                      </div>
                      <div className="text-xs text-indigo-600 group-hover:text-indigo-200 font-bold mt-1">
                        교육목표 {standardCount}건 연계
                      </div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-gray-100 group-hover:border-indigo-500 text-xs font-extrabold text-indigo-700 group-hover:text-white flex items-center justify-between">
                      <span>교과 독서 보기</span>
                      <span>→</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 3. 기본학습 대시보드 섹션 (한국어, 책읽기, 논술, 글쓰기) */}
          <section className="bg-amber-50/60 border-2 border-amber-200 rounded-3xl p-6 space-y-4 shadow-sm">
            <div>
              <span className="inline-block text-xs font-black bg-amber-600 text-white px-3 py-1 rounded-full mb-1">
                DASHBOARD 03 · 기본학습
              </span>
              <h2 className="text-xl md:text-2xl font-black text-gray-900">
                ✍️ 기본학습 영역별 선택 (한국어 · 책읽기 · 논술 · 글쓰기)
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {basicSkillItemsOnly.map((bs) => {
                const count = getBasicSkillCount(bs.key);
                return (
                  <button
                    key={bs.key}
                    type="button"
                    onClick={() => openListWithBasicSkill(bs.key)}
                    className="group bg-white hover:bg-amber-500 border-2 border-amber-200 hover:border-amber-500 rounded-2xl p-5 text-left shadow-sm hover:shadow-lg transition-all flex items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-3xl">{bs.icon}</span>
                        <span className="text-xl font-black text-gray-900 group-hover:text-white">
                          {bs.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 group-hover:text-amber-50">{bs.desc}</p>
                    </div>
                    <span className="shrink-0 text-sm font-black px-3 py-1.5 rounded-xl bg-amber-100 text-amber-900 group-hover:bg-white group-hover:text-amber-900">
                      {count}권 →
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 4. 주제별 모음 (추가되는 도서 주제 자동 반영) & 관리자 바로가기 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <section className="lg:col-span-2 bg-teal-50/60 border-2 border-teal-200 rounded-3xl p-6 space-y-4 shadow-sm">
              <div>
                <span className="inline-block text-xs font-black bg-teal-700 text-white px-3 py-1 rounded-full mb-1">
                  DASHBOARD 04 · 주제별
                </span>
                <h2 className="text-xl font-black text-gray-900">
                  🏷️ 도서 주제별 모음 (추가되는 도서 주제가 자동으로 반영됩니다)
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {aggregatedThemes.map((item) => (
                  <button
                    key={item.tag}
                    type="button"
                    onClick={() => openListWithTheme(item.tag)}
                    className="px-4 py-2.5 rounded-2xl bg-white hover:bg-teal-700 text-gray-800 hover:text-white border-2 border-teal-200 hover:border-teal-700 font-extrabold text-sm shadow-sm transition-all"
                  >
                    #{item.tag} <span className="text-xs opacity-75 ml-1">({item.count})</span>
                  </button>
                ))}
              </div>
            </section>

            {/* 관리자 콘솔 카드 */}
            <section className="bg-slate-900 text-white rounded-3xl p-6 flex flex-col justify-between space-y-4 shadow-md">
              <div className="space-y-2">
                <span className="inline-block text-xs font-black bg-amber-400 text-gray-950 px-3 py-1 rounded-full">
                  ADMIN CONSOLE
                </span>
                <h3 className="text-xl font-black">🛠️ 독서활동 · 지도안 관리자</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  새 도서 워크북/지도안 등록, 표준형 단계 블록(내용이해표·토론·14종 인터랙티브 퍼즐·글쓰기) 구성, NCIC 국가교육과정 성취기준 매핑을 관리합니다.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onOpenAdminModal()}
                className="w-full py-3.5 px-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-gray-950 font-black text-sm shadow transition-colors"
              >
                + 도서 · 지도안 추가 및 수정하기
              </button>
            </section>
          </div>
        </div>
      )}

      {/* =====================================================================
          VIEW 2: 독서활동 도서 리스트 화면 ('LIST') — 대시보드에서 선택한 조건의 목록 표시
         ===================================================================== */}
      {viewMode === 'LIST' && (
        <div className="space-y-5">
          {/* 상단 필터 컨트롤 패널 (크고 선명한 버튼) */}
          <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setViewMode('HUB')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-black text-xs shadow-sm"
                >
                  ← 대시보드 홈으로
                </button>
                <span className="text-base font-black text-slate-900">
                  선택된 독서활동 목록 ({filteredWorkbooks.length}건)
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="도서명, 저자, 주제어 검색..."
                  className="rounded-xl border-2 border-slate-300 px-3.5 py-1.5 text-xs font-bold bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none w-52"
                />
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 font-extrabold text-xs"
                >
                  ↺ 전체 초기화
                </button>
              </div>
            </div>

            {/* 1. 학년별 큰 버튼 바 */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-black text-emerald-900 bg-emerald-100 px-2.5 py-1 rounded-lg mr-1">
                학년별
              </span>
              {GRADE_GROUPS.map((gr) => {
                const active = selectedGrade === gr.key;
                return (
                  <button
                    key={gr.key}
                    type="button"
                    onClick={() => {
                      setSelectedGrade(gr.key);
                      setSelectedCurriculumId(null);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs md:text-sm font-extrabold border-2 transition-all ${
                      active
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                        : 'bg-white text-gray-800 border-gray-200 hover:border-emerald-400'
                    }`}
                  >
                    {gr.icon} {gr.label}
                  </button>
                );
              })}
            </div>

            {/* 2. 교과별 큰 버튼 바 */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-black text-indigo-900 bg-indigo-100 px-2.5 py-1 rounded-lg mr-1">
                교과별
              </span>
              {SUBJECT_CATEGORIES.map((sb) => {
                const active = selectedSubject === sb.key;
                return (
                  <button
                    key={sb.key}
                    type="button"
                    onClick={() => {
                      setSelectedSubject(sb.key);
                      setSelectedCurriculumId(null);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs md:text-sm font-extrabold border-2 transition-all ${
                      active
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white text-gray-800 border-gray-200 hover:border-indigo-400'
                    }`}
                  >
                    {sb.icon} {sb.label}
                  </button>
                );
              })}
            </div>

            {/* 3. 기본학습 & 주제별 바 */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-black text-amber-900 bg-amber-100 px-2.5 py-1 rounded-lg mr-1">
                기본학습
              </span>
              {BASIC_SKILL_CATEGORIES.map((bs) => {
                const active = selectedBasicSkill === bs.key;
                return (
                  <button
                    key={bs.key}
                    type="button"
                    onClick={() => setSelectedBasicSkill(bs.key)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold border-2 transition-all ${
                      active
                        ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                        : 'bg-white text-gray-800 border-gray-200 hover:border-amber-400'
                    }`}
                  >
                    {bs.icon} {bs.label}
                  </button>
                );
              })}

              {selectedThemeTag !== 'ALL' && (
                <span className="ml-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-700 text-white text-xs font-extrabold">
                  주제: #{selectedThemeTag}
                  <button
                    type="button"
                    onClick={() => setSelectedThemeTag('ALL')}
                    className="hover:text-amber-200 font-black"
                  >
                    ✕
                  </button>
                </span>
              )}
            </div>

            {/* NCIC 국가교육과정 성취기준 드릴다운 */}
            {(selectedGrade !== 'ALL' || selectedSubject !== 'ALL') &&
              matchingCurriculumStandards.length > 0 && (
                <div className="bg-indigo-50/90 border border-indigo-200 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-indigo-950">
                      🏛️ 해당 학년·교과의 NCIC 국가교육과정 교육목표 · 성취기준 ({matchingCurriculumStandards.length}건)
                    </span>
                    {selectedCurriculumId !== null && (
                      <button
                        type="button"
                        onClick={() => setSelectedCurriculumId(null)}
                        className="text-xs font-bold text-indigo-600 hover:underline"
                      >
                        성취기준 필터 해제
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-44 overflow-y-auto pr-1">
                    {matchingCurriculumStandards.map((cs) => {
                      const isSelected = selectedCurriculumId === cs.id;
                      return (
                        <button
                          key={cs.id}
                          type="button"
                          onClick={() => setSelectedCurriculumId(isSelected ? null : cs.id)}
                          className={`p-2.5 rounded-xl border text-left transition-all ${
                            isSelected
                              ? 'bg-indigo-700 text-white border-indigo-700 shadow'
                              : 'bg-white text-gray-800 border-indigo-100 hover:border-indigo-400'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 text-[11px] font-extrabold">
                            <span
                              className={`px-2 py-0.5 rounded ${
                                isSelected ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-800'
                              }`}
                            >
                              {cs.achievement_code || cs.curriculum_code}
                            </span>
                            <span>
                              {cs.detail_subject} · {cs.domain_name}
                            </span>
                          </div>
                          <div
                            className={`text-xs font-bold mt-1 line-clamp-1 ${
                              isSelected ? 'text-white' : 'text-gray-900'
                            }`}
                          >
                            {cs.achievement_text}
                          </div>
                          <div
                            className={`text-[11px] mt-0.5 line-clamp-1 ${
                              isSelected ? 'text-indigo-200' : 'text-gray-500'
                            }`}
                          >
                            🎯 교육목표: {cs.educational_goal}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
          </div>

          {/* Workbook Cards Grid */}
          {filteredWorkbooks.length === 0 ? (
            <div className="bg-white rounded-3xl border-2 border-dashed border-gray-300 p-12 text-center space-y-3">
              <div className="text-4xl">📭</div>
              <div className="text-base font-extrabold text-gray-800">
                해당 조건에 등록된 독서활동이 아직 없습니다.
              </div>
              <div className="flex justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-extrabold text-xs"
                >
                  전체 도서 보기
                </button>
                <button
                  type="button"
                  onClick={() => onOpenAdminModal()}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-extrabold text-xs"
                >
                  + 관리자 페이지에서 새 독서활동 추가하기
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredWorkbooks.map((wb) => {
                const isInteractive = wb.is_builtin_interactive === 1;
                const gradeObj = GRADE_GROUPS.find(
                  (g) => g.key === (wb.grade_group || wb.target_group)
                );
                const basicSkill = wb.basic_skill_category || '책읽기';
                const subjectCat = wb.subject_category || '국어';
                const tags = wb.theme_tags && wb.theme_tags.length > 0 ? wb.theme_tags : wb.keywords || [];
                const curriculumLinks = wb.curriculum_links || [];

                return (
                  <div
                    key={wb.code}
                    className="bg-white rounded-3xl border-2 border-gray-200 hover:border-emerald-500 p-6 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900">
                            {gradeObj ? `${gradeObj.icon} ${gradeObj.label}` : wb.target_label}
                          </span>
                          <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-900">
                            교과: {subjectCat}
                          </span>
                          <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900">
                            기본학습: {basicSkill}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                            ⏱️ {wb.duration_minutes}분
                          </span>
                          <button
                            type="button"
                            onClick={() => onOpenAdminModal(wb.code)}
                            title="관리자 수정"
                            className="text-xs font-bold text-gray-600 hover:text-indigo-700 bg-gray-100 hover:bg-indigo-50 px-2.5 py-1 rounded-full transition-colors"
                          >
                            ✏️ 수정
                          </button>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="text-4xl bg-gray-50 p-3 rounded-2xl border border-gray-100 shrink-0">
                          {wb.cover_emoji || '📘'}
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-gray-900 leading-snug">{wb.title}</h3>
                          <p className="text-xs font-semibold text-gray-500 mt-0.5">
                            {wb.author} | {wb.publisher}
                          </p>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mt-3 leading-relaxed">{wb.subtitle}</p>

                      {curriculumLinks.length > 0 && (
                        <div className="mt-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl p-3.5 space-y-1.5">
                          <div className="text-[11px] font-extrabold text-indigo-900 flex items-center justify-between">
                            <span>🏛️ NCIC 국가교육과정 연계 성취기준 · 교육목표</span>
                            <span className="text-[10px] text-indigo-600">{curriculumLinks.length}개 성취기준</span>
                          </div>
                          {curriculumLinks.slice(0, 2).map((lk, lIdx) => (
                            <div
                              key={lk.curriculum_id || lIdx}
                              className="text-xs text-gray-800 bg-white/90 rounded-xl px-2.5 py-1.5 border border-indigo-100/80"
                            >
                              <div className="flex items-center gap-1.5 font-extrabold text-indigo-800">
                                <span>{lk.achievement_code || lk.curriculum_code}</span>
                                <span className="text-[11px] text-gray-500">
                                  ({lk.detail_subject} · {lk.domain_name})
                                </span>
                              </div>
                              <div className="text-[11px] text-gray-600 mt-0.5 line-clamp-1">
                                {lk.achievement_text || lk.educational_goal}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex flex-wrap gap-1.5 mt-3.5">
                        {tags.map((kw, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setSelectedThemeTag(kw)}
                            className="text-[11px] font-bold bg-slate-100 hover:bg-teal-100 text-slate-700 hover:text-teal-900 px-2.5 py-0.5 rounded-md transition-colors"
                          >
                            #{kw}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => onSelectWorkbook(wb.code)}
                        className={`flex-1 py-3 px-5 rounded-xl font-black text-sm text-white shadow-md transition-transform transform hover:scale-[1.01] ${
                          isInteractive
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600'
                            : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'
                        }`}
                      >
                        {isInteractive ? '🎮 인터랙티브 워크북 시작' : '✍️ 독서활동 · 지도안 시작하기'}
                      </button>

                      {wb.purchase_url && (
                        <a
                          href={wb.purchase_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-3 px-4 rounded-xl border-2 border-gray-200 hover:border-indigo-400 text-gray-700 hover:text-indigo-700 font-extrabold text-xs transition-colors"
                        >
                          🛒 도서 정보
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          VIEW 3: NCIC 국가교육과정 교육목표 & 도서 매핑 브라우저
         ===================================================================== */}
      {viewMode === 'CURRICULUM' && (
        <div className="space-y-5">
          <div className="bg-indigo-50 border-2 border-indigo-200 rounded-3xl p-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-black text-indigo-950 text-base md:text-lg">
                🏛️ 국가교육과정정보센터(NCIC) 2022 개정 교육과정 교육목표 · 성취기준 DB
              </h2>
              <p className="text-xs text-indigo-800 mt-1">
                각 학년군·교과별 교육목표 및 성취기준과 연결된 도서/워크북을 한눈에 확인하고 바로 학습할 수 있습니다.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setViewMode('HUB')}
                className="px-4 py-2 rounded-xl bg-white border border-indigo-200 text-indigo-900 font-extrabold text-xs"
              >
                ← 대시보드로
              </button>
              <button
                type="button"
                onClick={() => onOpenAdminModal()}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow"
              >
                + 성취기준 추가 / 도서 연결 관리
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {curriculumStandards.map((cs) => {
              const linkedBooks = workbooks.filter((wb) =>
                (wb.curriculum_links || []).some((lk) => lk.curriculum_id === cs.id)
              );
              return (
                <div
                  key={cs.id}
                  className="bg-white rounded-2xl border-2 border-gray-200 p-5 shadow-sm hover:border-indigo-400 transition-all"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-black bg-indigo-600 text-white px-2.5 py-0.5 rounded-lg">
                        {cs.achievement_code || cs.curriculum_code}
                      </span>
                      <span className="text-xs font-extrabold bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-lg">
                        {cs.grade_label}
                      </span>
                      <span className="text-xs font-extrabold bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded-lg">
                        {cs.subject_category} ({cs.detail_subject}) · {cs.domain_name}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-gray-400">{cs.revision_year} 교육과정</span>
                  </div>

                  <div className="text-sm font-black text-gray-900 mt-1">{cs.achievement_text}</div>
                  <div className="text-xs text-gray-600 mt-1">🎯 교육목표: {cs.educational_goal}</div>

                  {linkedBooks.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap items-center gap-2">
                      <span className="text-xs font-extrabold text-indigo-700">📚 연계 독서활동:</span>
                      {linkedBooks.map((lb) => (
                        <button
                          key={lb.code}
                          type="button"
                          onClick={() => onSelectWorkbook(lb.code)}
                          className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-extrabold text-xs border border-indigo-200"
                        >
                          {lb.cover_emoji} {lb.title} 학습하기 →
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================================
          VIEW 4: ROADMAP VIEW (독서맵 / 책지도)
         ===================================================================== */}
      {viewMode === 'ROADMAP' && (
        <div className="space-y-6">
          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-extrabold text-indigo-950 text-base">
                🗺️ 독서맵 (입문 Lv.1 ➔ 교양 Lv.2 ➔ 심화 Lv.3 독서 로드맵)
              </h2>
              <p className="text-xs text-indigo-800 mt-0.5">
                각 주제별 도서를 단계별로 읽고, 독서활동이 연동된 도서는 즉시 지도안 학습과 AI 논술 첨삭을 진행할 수 있습니다.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setViewMode('HUB')}
              className="px-4 py-2 rounded-xl bg-white border border-indigo-200 text-indigo-900 font-extrabold text-xs"
            >
              ← 대시보드로
            </button>
          </div>

          <div className="space-y-6">
            {roadmaps.map((rm) => (
              <div key={rm.id} className="bg-white rounded-3xl border-2 border-gray-200 p-6 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                  <div>
                    <span className="text-xs font-extrabold bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full">
                      {rm.category}
                    </span>
                    <h3 className="text-xl font-black text-gray-900 mt-1">{rm.name}</h3>
                    <p className="text-xs text-gray-600 mt-0.5">{rm.description}</p>
                  </div>
                </div>

                {rm.books && rm.books.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {rm.books.map((bk) => (
                      <div
                        key={bk.bookno}
                        className={`rounded-2xl p-4 border-2 flex flex-col justify-between ${
                          bk.linked_workbook_code
                            ? 'border-emerald-400 bg-emerald-50/40'
                            : 'border-gray-100 bg-slate-50/60'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-2">
                            <span
                              className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                                bk.difficulty_level === 1
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : bk.difficulty_level === 2
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-purple-100 text-purple-800'
                              }`}
                            >
                              Lv.{bk.difficulty_level}{' '}
                              {bk.difficulty_level === 1
                                ? '입문'
                                : bk.difficulty_level === 2
                                ? '중급·교양'
                                : '심화·원전'}
                            </span>
                            {bk.linked_workbook_code && (
                              <span className="text-[11px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                                독서활동 수록
                              </span>
                            )}
                          </div>
                          <div className="font-extrabold text-gray-900 text-base">{bk.title}</div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {bk.author} | {bk.publisher}
                          </div>
                          <p className="text-xs text-gray-600 mt-2 leading-relaxed">{bk.curator_note}</p>
                        </div>

                        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-200/60">
                          {bk.linked_workbook_code && (
                            <button
                              type="button"
                              onClick={() => onSelectWorkbook(bk.linked_workbook_code!)}
                              className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs text-center shadow-sm"
                            >
                              📘 독서활동 시작하기
                            </button>
                          )}
                          <a
                            href={bk.purchase_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-2 px-3 rounded-xl bg-white border border-gray-300 hover:border-indigo-500 text-gray-700 font-bold text-xs"
                          >
                            🛒 도서 정보
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-gray-400">연결된 도서 목록을 불러오는 중입니다...</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardView;
