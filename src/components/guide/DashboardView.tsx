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
import { useLanguage } from '../../i18n/LanguageContext';

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
  wallet,
  currentUser,
  onSelectWorkbook,
  onOpenWalletModal,
  onOpenMemberModal,
  onOpenAdminModal,
}) => {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<'WORKBOOKS' | 'CURRICULUM' | 'ROADMAP'>('WORKBOOKS');

  // 4-Dimensional Filter States
  const [selectedBasicSkill, setSelectedBasicSkill] = useState<'ALL' | BasicSkillCategoryKey>('ALL');
  const [selectedGrade, setSelectedGrade] = useState<'ALL' | GradeGroupKey>('ALL');
  const [selectedSubject, setSelectedSubject] = useState<'ALL' | SubjectCategoryKey>('ALL');
  const [selectedThemeTag, setSelectedThemeTag] = useState<string>('ALL');
  const [selectedCurriculumId, setSelectedCurriculumId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Dynamic theme aggregation (combines server dynamicThemes + client workbooks' theme_tags)
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

      // 1. 기본학습 필터
      if (selectedBasicSkill !== 'ALL' && wbBasic !== selectedBasicSkill) {
        return false;
      }

      // 2. 학년별 필터 (주 학년 또는 연계 교육과정 학년 포함)
      if (selectedGrade !== 'ALL') {
        const hasCurriculumGrade = wbLinks.some((lk) => lk.grade_group === selectedGrade);
        if (wbGrade !== selectedGrade && !hasCurriculumGrade) {
          return false;
        }
      }

      // 3. 교과별 필터 (주 교과 또는 융합 연계 교과 포함)
      if (selectedSubject !== 'ALL') {
        const hasCurriculumSubject = wbLinks.some((lk) => lk.subject_category === selectedSubject);
        if (wbSubject !== selectedSubject && !hasCurriculumSubject) {
          return false;
        }
      }

      // 4. NCIC 성취기준/교육목표 드릴다운 필터
      if (selectedCurriculumId !== null) {
        const hasStandard = wbLinks.some((lk) => lk.curriculum_id === selectedCurriculumId);
        if (!hasStandard) return false;
      }

      // 5. 주제별(도서 주제 태그) 필터
      if (selectedThemeTag !== 'ALL') {
        const matchTag =
          wbTags.includes(selectedThemeTag) ||
          (wb.keywords || []).includes(selectedThemeTag) ||
          wb.theme_category === selectedThemeTag;
        if (!matchTag) return false;
      }

      // 6. 검색어 필터
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

  return (
    <div className="space-y-6 pt-1">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-indigo-800 rounded-3xl p-6 md:p-8 text-white shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-extrabold">
                📚 리더스가이드 통합 모듈 · NCIC 국가교육과정 연계
              </span>
              <span className="inline-flex items-center gap-1.5 bg-amber-400/25 border border-amber-300/40 text-amber-200 px-3 py-1 rounded-full text-xs font-extrabold">
                ✨ 2022 개정 교육과정 성취기준 DB 탑재
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tight">
              {t('독서활동앱')}{' '}
              <span className="text-emerald-200 text-lg md:text-2xl font-extrabold">
                — 교과연계 독서·워크북·논술 스튜디오
              </span>
            </h1>
            <p className="text-xs md:text-sm text-emerald-50 max-w-2xl leading-relaxed">
              영유아 한글(《나래와 산이》)부터 초·중·고 7대 교과 연계 독서지도안(《GMO 아이》, 《미쳐야 미친다》 등)까지!
              학년별 · 교과별(NCIC 교육목표) · 주제별 · 기본학습(한국어/책읽기/논술/글쓰기)으로 탐색하고 AI 멘토와 함께 학습하세요.
            </p>
          </div>

          {/* Member & Mileage / Wallet Status Card */}
          <div className="bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl p-4 min-w-[270px] space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="text-xs font-extrabold text-emerald-100">
                {currentUser ? (
                  <span>
                    👤 <strong>{currentUser.nickname || currentUser.userid}</strong>님 ({currentUser.userid})
                  </span>
                ) : (
                  <span>🎟️ 비회원 체험 모드 (리더스가이드 연동)</span>
                )}
              </div>
              <button
                type="button"
                onClick={onOpenMemberModal}
                className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white text-[11px] font-extrabold transition-colors"
              >
                {currentUser ? '계정/로그아웃' : '🔐 회원 로그인'}
              </button>
            </div>

            {currentUser ? (
              <div className="bg-black/20 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-emerald-200 font-bold">리더스가이드 보유 마일리지</div>
                  <div className="text-2xl font-black text-amber-300">
                    {(wallet.member_mileage ?? currentUser.mileage ?? 0).toLocaleString()} P
                  </div>
                </div>
                <div className="text-right text-[11px] text-white/80">
                  <div>AI 질문: -50P</div>
                  <div>AI 첨삭: -200~300P</div>
                </div>
              </div>
            ) : (
              <div className="flex items-baseline justify-between bg-black/20 rounded-xl p-3">
                <div>
                  <span className="text-xs opacity-80">무료체험 </span>
                  <strong className="text-lg font-black text-amber-300">{wallet.free_trial_credits}회</strong>
                </div>
                <div>
                  <span className="text-xs opacity-80">충전권 </span>
                  <strong className="text-lg font-black text-white">{wallet.paid_credits}회</strong>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={onOpenWalletModal}
                className="py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-gray-900 font-extrabold text-xs shadow transition-colors"
              >
                💰 마일리지/이용권 내역
              </button>
              <button
                type="button"
                onClick={() => onOpenAdminModal()}
                className="py-2 px-3 rounded-xl bg-white/20 hover:bg-white/30 text-white font-extrabold text-xs border border-white/30 transition-colors"
              >
                ⚙️ 관리자 메뉴
              </button>
            </div>
          </div>
        </div>

        {/* Main View Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-6 pt-5 border-t border-white/20">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setViewMode('WORKBOOKS')}
              className={`px-4 py-2.5 rounded-xl font-extrabold text-xs md:text-sm transition-all ${
                viewMode === 'WORKBOOKS'
                  ? 'bg-white text-emerald-950 shadow-md'
                  : 'bg-black/20 text-white hover:bg-black/30'
              }`}
            >
              🎯 4차원 통합 대시보드 ({filteredWorkbooks.length}/{workbooks.length})
            </button>
            <button
              type="button"
              onClick={() => setViewMode('CURRICULUM')}
              className={`px-4 py-2.5 rounded-xl font-extrabold text-xs md:text-sm transition-all ${
                viewMode === 'CURRICULUM'
                  ? 'bg-white text-emerald-950 shadow-md'
                  : 'bg-black/20 text-white hover:bg-black/30'
              }`}
            >
              🏛️ NCIC 국가교육과정 교육목표 · 도서 매핑표 ({curriculumStandards.length})
            </button>
            <button
              type="button"
              onClick={() => setViewMode('ROADMAP')}
              className={`px-4 py-2.5 rounded-xl font-extrabold text-xs md:text-sm transition-all ${
                viewMode === 'ROADMAP'
                  ? 'bg-white text-emerald-950 shadow-md'
                  : 'bg-black/20 text-white hover:bg-black/30'
              }`}
            >
              🗺️ 리더스가이드 책지도 ({roadmaps.length})
            </button>
          </div>

          <button
            type="button"
            onClick={() => onOpenAdminModal()}
            className="px-4 py-2 rounded-xl bg-indigo-500/80 hover:bg-indigo-500 text-white font-extrabold text-xs border border-indigo-300/40 shadow-sm"
          >
            + 새 독서활동 · 지도안 추가
          </button>
        </div>
      </div>

      {viewMode === 'WORKBOOKS' && (
        <div className="space-y-5">
          {/* 4-Dimensional Filter Control Panel */}
          <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-5 space-y-5">
            {/* Top Bar: Search & Reset */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-slate-800">🧭 4차원 맞춤 탐색 필터</span>
                <span className="text-xs text-slate-500 font-semibold">
                  (기본학습 · 학년별 · 교과별 · 주제별)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="도서명, 저자, 키워드 검색..."
                  className="rounded-xl border border-slate-300 px-3.5 py-1.5 text-xs font-semibold bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none w-52"
                />
                {(selectedBasicSkill !== 'ALL' ||
                  selectedGrade !== 'ALL' ||
                  selectedSubject !== 'ALL' ||
                  selectedThemeTag !== 'ALL' ||
                  selectedCurriculumId !== null ||
                  searchQuery) && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="px-3 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 font-extrabold text-xs"
                  >
                    ↺ 필터 초기화
                  </button>
                )}
              </div>
            </div>

            {/* Dimension 1: 기본학습 (한국어, 책읽기, 논술, 글쓰기) */}
            <div>
              <div className="text-xs font-extrabold text-slate-500 mb-2">
                1. 기본학습 영역 (한국어 · 책읽기 · 논술 · 글쓰기)
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {BASIC_SKILL_CATEGORIES.map((bs) => {
                  const active = selectedBasicSkill === bs.key;
                  return (
                    <button
                      key={bs.key}
                      type="button"
                      onClick={() => setSelectedBasicSkill(bs.key)}
                      className={`p-3 rounded-2xl border-2 text-left transition-all ${
                        active
                          ? 'border-emerald-600 bg-emerald-50 shadow-sm'
                          : 'border-gray-200 bg-white hover:border-emerald-300'
                      }`}
                    >
                      <div className="font-extrabold text-gray-900 text-xs md:text-sm">
                        {bs.icon} {bs.label}
                      </div>
                      <div className="text-[11px] text-gray-500 mt-0.5 truncate">{bs.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dimension 2: 학년별 (7단계) */}
            <div>
              <div className="text-xs font-extrabold text-slate-500 mb-2">
                2. 학년별 단계 (영유아 ~ 고등학생 7단계)
              </div>
              <div className="flex flex-wrap gap-2">
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
                      className={`px-3.5 py-2 rounded-xl text-xs font-extrabold border transition-all flex items-center gap-1.5 ${
                        active
                          ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-400'
                      }`}
                    >
                      <span>{gr.icon}</span>
                      <span>{gr.label}</span>
                      {gr.key !== 'ALL' && (
                        <span className={`text-[10px] ${active ? 'text-emerald-200' : 'text-gray-400'}`}>
                          ({gr.shortLabel})
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dimension 3: 교과별 (7대 교과 + NCIC 교육과정 성취기준 드릴다운) */}
            <div>
              <div className="text-xs font-extrabold text-slate-500 mb-2">
                3. 교과별 연계 (7대 교과 &amp; NCIC 국가교육과정 교육목표)
              </div>
              <div className="flex flex-wrap gap-2">
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
                      className={`px-3.5 py-2 rounded-xl text-xs font-extrabold border transition-all flex items-center gap-1.5 ${
                        active
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-400'
                      }`}
                    >
                      <span>{sb.icon}</span>
                      <span>{sb.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* NCIC 국가교육과정 성취기준/교육목표 드릴다운 바 */}
              {(selectedGrade !== 'ALL' || selectedSubject !== 'ALL') &&
                matchingCurriculumStandards.length > 0 && (
                  <div className="mt-3 bg-indigo-50/90 border border-indigo-200 rounded-2xl p-4 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-indigo-950">
                        🏛️ NCIC 국가교육과정 교육목표 · 성취기준 세부 선택 ({matchingCurriculumStandards.length}건)
                      </span>
                      {selectedCurriculumId !== null && (
                        <button
                          type="button"
                          onClick={() => setSelectedCurriculumId(null)}
                          className="text-[11px] font-bold text-indigo-600 hover:underline"
                        >
                          성취기준 선택 해제
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
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

            {/* Dimension 4: 주제별 (추가되는 도서 주제 자동 집계) */}
            <div>
              <div className="text-xs font-extrabold text-slate-500 mb-2">
                4. 주제별 태그 (추가되는 도서 주제가 자동으로 모여서 반영됩니다)
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedThemeTag('ALL')}
                  className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition-all ${
                    selectedThemeTag === 'ALL'
                      ? 'bg-teal-700 text-white shadow-sm'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  전체 주제
                </button>
                {aggregatedThemes.map((item) => {
                  const active = selectedThemeTag === item.tag;
                  return (
                    <button
                      key={item.tag}
                      type="button"
                      onClick={() => setSelectedThemeTag(active ? 'ALL' : item.tag)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                        active
                          ? 'bg-teal-700 text-white shadow-sm'
                          : 'bg-white border border-gray-200 text-gray-700 hover:border-teal-400'
                      }`}
                    >
                      #{item.tag}{' '}
                      <span className={`text-[10px] ${active ? 'text-teal-200' : 'text-gray-400'}`}>
                        ({item.count})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Workbook Cards Grid */}
          {filteredWorkbooks.length === 0 ? (
            <div className="bg-white rounded-3xl border-2 border-dashed border-gray-300 p-12 text-center space-y-3">
              <div className="text-4xl">📭</div>
              <div className="text-base font-extrabold text-gray-800">
                선택하신 필터 조건에 해당하는 독서활동 워크북이 없습니다.
              </div>
              <div className="flex justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-extrabold text-xs"
                >
                  필터 초기화하기
                </button>
                <button
                  type="button"
                  onClick={() => onOpenAdminModal()}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-extrabold text-xs"
                >
                  + 관리자 메뉴에서 새 도서 추가하기
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
                      {/* Top Taxonomy Badges */}
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
                            className="text-xs font-bold text-gray-500 hover:text-indigo-700 bg-gray-100 hover:bg-indigo-50 px-2.5 py-1 rounded-full transition-colors"
                          >
                            ✏️ 수정
                          </button>
                        </div>
                      </div>

                      {/* Title & Book Info */}
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

                      {/* NCIC 국가교육과정 성취기준 & 교육목표 박스 */}
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
                                {lk.is_primary === 1 && (
                                  <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded">
                                    주교과
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-gray-600 mt-0.5 line-clamp-1">
                                {lk.achievement_text || lk.educational_goal}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Theme Tags */}
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

                      {/* Mileage Info & Linked Roadmap */}
                      <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-500 bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2">
                        <span>
                          🤖 AI 질문 <strong>-{wb.ai_question_mileage || 50}P</strong> · 첨삭{' '}
                          <strong>-{wb.ai_essay_mileage || 200}P</strong>
                        </span>
                        {wb.roadmap_name && (
                          <button
                            type="button"
                            onClick={() => setViewMode('ROADMAP')}
                            className="text-indigo-600 font-bold hover:underline"
                          >
                            🗺️ 책지도: {wb.roadmap_name}
                          </button>
                        )}
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
                        {isInteractive ? '🎮 인터랙티브 워크북 시작' : '✍️ 독서활동 · 지도안 & AI 첨삭 시작'}
                      </button>

                      {wb.purchase_url && (
                        <a
                          href={wb.purchase_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-3 px-4 rounded-xl border-2 border-gray-200 hover:border-indigo-400 text-gray-700 hover:text-indigo-700 font-extrabold text-xs transition-colors"
                        >
                          🛒 도서 구매
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

      {/* VIEW 2: NCIC 국가교육과정 교육목표 & 도서 매핑 브라우저 */}
      {viewMode === 'CURRICULUM' && (
        <div className="space-y-5">
          <div className="bg-indigo-50 border-2 border-indigo-200 rounded-3xl p-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-black text-indigo-950 text-base md:text-lg">
                🏛️ 국가교육과정정보센터(NCIC) 2022 개정 교육과정 교육목표 · 성취기준 DB
              </h2>
              <p className="text-xs text-indigo-800 mt-1">
                내년부터 강화되는 교과 연계 독서 활동에 맞추어, 각 학년군·교과별 교육목표 및 성취기준과 연결된 도서/워크북을 한눈에 확인하고 바로 학습할 수 있습니다.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onOpenAdminModal()}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow"
            >
              + 성취기준 추가 / 도서 연결 관리
            </button>
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
                      <span className="text-xs font-extrabold text-indigo-700">📚 연계 독서활동 워크북:</span>
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

      {/* VIEW 3: ROADMAP VIEW (책지도: 리더스가이드 데이터 연동) */}
      {viewMode === 'ROADMAP' && (
        <div className="space-y-6">
          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-extrabold text-indigo-950 text-base">
                🗺️ 리더스가이드 책지도 (입문 Lv.1 ➔ 교양 Lv.2 ➔ 심화 Lv.3 독서 로드맵)
              </h2>
              <p className="text-xs text-indigo-800 mt-0.5">
                각 주제별 도서를 단계별로 읽고, 워크북이 연동된 도서는 즉시 독서지도안 학습과 AI 논술 첨삭을 진행할 수 있습니다.
              </p>
            </div>
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
                                워크북·AI첨삭 수록
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
                              📘 워크북·논술 학습하기
                            </button>
                          )}
                          <a
                            href={bk.purchase_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-2 px-3 rounded-xl bg-white border border-gray-300 hover:border-indigo-500 text-gray-700 font-bold text-xs"
                          >
                            🛒 도서 구매/상세
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
