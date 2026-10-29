import React, { useState } from 'react';
import { WorkbookItem, RoadmapTheme } from '../../data/studyGuideData';
import { UserWallet } from '../../services/workbookApi';
import { useLanguage } from '../../i18n/LanguageContext';

interface DashboardViewProps {
  workbooks: WorkbookItem[];
  roadmaps: RoadmapTheme[];
  wallet: UserWallet;
  onSelectWorkbook: (code: string) => void;
  onOpenWalletModal: () => void;
}

const AGE_FILTERS = [
  { key: 'ALL', label: '전체 연령·수준', icon: '🌈', desc: '유아 한글부터 중고등 대입 논술까지' },
  { key: 'INFANT', label: '유아·한글입문', icon: '🌱', desc: '5~8세 · 나래와 산이 모음·받침' },
  { key: 'ELEM_LOW', label: '초등 독서·논술', icon: '🧬', desc: '초등 전학년 · GMO 아이 등' },
  { key: 'MID_HIGH', label: '중·고등 심화 논술', icon: '🔥', desc: '중·고등 · 미쳐야 미친다 등' },
];

const THEME_FILTERS = [
  { key: 'ALL', label: '전체 주제' },
  { key: '기초문해력', label: '🔤 기초문해력·한글' },
  { key: '과학/IT', label: '🧬 과학·생명윤리 (GMO)' },
  { key: '인문/철학', label: '📜 인문·철학·역사 (불광불급)' },
];

const DashboardView: React.FC<DashboardViewProps> = ({
  workbooks,
  roadmaps,
  wallet,
  onSelectWorkbook,
  onOpenWalletModal,
}) => {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<'WORKBOOKS' | 'ROADMAP'>('WORKBOOKS');
  const [selectedAge, setSelectedAge] = useState<string>('ALL');
  const [selectedTheme, setSelectedTheme] = useState<string>('ALL');

  const filteredWorkbooks = workbooks.filter((wb) => {
    const matchAge =
      selectedAge === 'ALL' ||
      wb.target_group === selectedAge ||
      (selectedAge === 'ELEM_LOW' && (wb.target_group === 'ELEM_LOW' || wb.target_group === 'ELEM_HIGH'));
    const matchTheme = selectedTheme === 'ALL' || wb.theme_category === selectedTheme;
    return matchAge && matchTheme;
  });

  return (
    <div className="space-y-6 pt-2">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-lime-600 via-emerald-600 to-teal-700 rounded-3xl p-6 md:p-8 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-extrabold">
              <span>📚 리더스가이드 책지도(독서맵) &amp; AI 첨삭 연동</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tight">
              {t('나래와 산이의 한글 모험')} &amp; 독서·논술 스튜디오
            </h1>
            <p className="text-sm md:text-base text-emerald-50 max-w-2xl">
              유아 기초 한글 워크북부터 초등 독서지도안(《GMO 아이》), 중·고등 심화 논술(《미쳐야 미친다》)까지!
              연령별·주제별·책지도로 탐색하고 맞춤형 AI 멘토 첨삭을 받아보세요.
            </p>
          </div>

          {/* Wallet Status Card */}
          <div className="bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl p-4 min-w-[230px]">
            <div className="text-xs font-bold text-emerald-100">🎟️ 나의 AI 글쓰기 첨삭 이용권</div>
            <div className="flex items-baseline gap-3 mt-1">
              <div>
                <span className="text-xs opacity-80">무료체험 </span>
                <strong className="text-xl font-black text-amber-300">{wallet.free_trial_credits}회</strong>
              </div>
              <div>
                <span className="text-xs opacity-80">유료권 </span>
                <strong className="text-xl font-black text-white">{wallet.paid_credits}회</strong>
              </div>
            </div>
            <button
              type="button"
              onClick={onOpenWalletModal}
              className="mt-3 w-full py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-gray-900 font-extrabold text-xs shadow transition-colors"
            >
              + 이용권 충전 및 사용내역 보기
            </button>
          </div>
        </div>

        {/* Main View Switcher: Workbooks vs Reading Roadmap */}
        <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-white/20">
          <button
            type="button"
            onClick={() => setViewMode('WORKBOOKS')}
            className={`px-5 py-2.5 rounded-xl font-extrabold text-sm transition-all ${
              viewMode === 'WORKBOOKS'
                ? 'bg-white text-emerald-900 shadow-md'
                : 'bg-black/20 text-white hover:bg-black/30'
            }`}
          >
            🎯 연령별 · 주제별 워크북 &amp; 지도안 ({workbooks.length})
          </button>
          <button
            type="button"
            onClick={() => setViewMode('ROADMAP')}
            className={`px-5 py-2.5 rounded-xl font-extrabold text-sm transition-all ${
              viewMode === 'ROADMAP'
                ? 'bg-white text-emerald-900 shadow-md'
                : 'bg-black/20 text-white hover:bg-black/30'
            }`}
          >
            🗺️ 책지도 (리더스가이드 독서맵 · 도서 구매 연동) ({roadmaps.length})
          </button>
        </div>
      </div>

      {viewMode === 'WORKBOOKS' ? (
        <div className="space-y-6">
          {/* 1. Age Group Selector Cards */}
          <div>
            <h2 className="text-sm font-extrabold text-gray-500 uppercase tracking-wider mb-3">
              1. 나이 · 학습 수준별 선택
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {AGE_FILTERS.map((af) => {
                const active = selectedAge === af.key;
                return (
                  <button
                    key={af.key}
                    type="button"
                    onClick={() => setSelectedAge(af.key)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
                      active
                        ? 'border-emerald-600 bg-emerald-50/70 shadow-md scale-[1.01]'
                        : 'border-gray-200 bg-white hover:border-emerald-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{af.icon}</div>
                    <div className="font-extrabold text-gray-900 text-sm md:text-base">{af.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{af.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Theme Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-extrabold text-gray-500 mr-2">2. 주제별 필터:</span>
            {THEME_FILTERS.map((tf) => {
              const active = selectedTheme === tf.key;
              return (
                <button
                  key={tf.key}
                  type="button"
                  onClick={() => setSelectedTheme(tf.key)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all ${
                    active
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tf.label}
                </button>
              );
            })}
          </div>

          {/* 3. Workbook Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredWorkbooks.map((wb) => {
              const isInteractive = wb.is_builtin_interactive === 1;
              return (
                <div
                  key={wb.code}
                  className="bg-white rounded-3xl border-2 border-gray-200 hover:border-emerald-500 p-6 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <span
                        className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                          wb.target_group === 'INFANT'
                            ? 'bg-amber-100 text-amber-800'
                            : wb.target_group === 'MID_HIGH'
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {wb.target_label}
                      </span>
                      <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                        {wb.theme_category} · {wb.duration_minutes}분
                      </span>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="text-4xl bg-gray-50 p-3 rounded-2xl border border-gray-100">
                        {wb.cover_emoji}
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-gray-900 leading-snug">{wb.title}</h3>
                        <p className="text-xs font-semibold text-gray-500 mt-0.5">
                          {wb.author} | {wb.publisher}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mt-3 leading-relaxed">{wb.subtitle}</p>

                    {/* Keywords */}
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {wb.keywords.map((kw, i) => (
                        <span
                          key={i}
                          className="text-[11px] font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md"
                        >
                          #{kw}
                        </span>
                      ))}
                    </div>

                    {/* Linked Roadmap Info */}
                    {wb.roadmap_name && (
                      <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-gray-600 flex items-center justify-between">
                        <span>
                          🗺️ 연결 책지도: <strong className="text-gray-800">{wb.roadmap_name}</strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => setViewMode('ROADMAP')}
                          className="text-indigo-600 font-bold hover:underline ml-2"
                        >
                          지도 보기
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => onSelectWorkbook(wb.code)}
                      className={`flex-1 py-3 px-5 rounded-xl font-black text-sm text-white shadow-md transition-transform transform hover:scale-[1.01] ${
                        isInteractive
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600'
                          : wb.target_group === 'MID_HIGH'
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                          : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'
                      }`}
                    >
                      {isInteractive ? '🎮 인터랙티브 워크북 시작' : '✍️ 독서지도안 & AI 첨삭 글쓰기 시작'}
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
        </div>
      ) : (
        /* ROADMAP VIEW (책지도: 리더스가이드 데이터 연동) */
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
