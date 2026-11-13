import React, { useState } from 'react';
import { InitialConsonantUnit } from '../../types/initialConsonantTypes';
import { useLanguage } from '../../i18n/LanguageContext';

interface InitialTableOfContentsProps {
  units: InitialConsonantUnit[];
  earnedBeads: Record<string, boolean>;
  onSelectUnit: (unitIndex: number, stepIndex?: number) => void;
  onGoHome: () => void;
}

const InitialTableOfContents: React.FC<InitialTableOfContentsProps> = ({
  units,
  earnedBeads,
  onSelectUnit,
  onGoHome,
}) => {
  const { t } = useLanguage();
  // 기본값: 도깨비 소리구슬 모험 순서 (원고 및 활동지 순서)
  const [sortMode, setSortMode] = useState<'adventure' | 'ganada'>('adventure');

  const indexedUnits = units.map((unit, originalIndex) => ({ unit, originalIndex }));
  const sortedUnits = [...indexedUnits].sort((a, b) =>
    sortMode === 'adventure'
      ? a.unit.adventureOrder - b.unit.adventureOrder
      : a.unit.ganadaOrder - b.unit.ganadaOrder
  );

  const earnedCount = units.filter((u) => earnedBeads[u.consonant]).length;

  return (
    <div className="min-h-[600px] flex flex-col items-center p-3 sm:p-6 bg-sky-50/70 rounded-2xl relative">
      {/* Top Row: Main Dashboard Return Button + Sort Mode Toggle */}
      <div className="w-full max-w-5xl flex flex-wrap items-center justify-between gap-3 mb-4">
        <button
          type="button"
          onClick={onGoHome}
          className="flex items-center px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl shadow hover:bg-emerald-700 transition-colors text-sm sm:text-base"
        >
          <span role="img" aria-label="home icon" className="mr-2">
            🏠
          </span>
          {t('메인화면으로 가기')}
        </button>

        <div className="flex items-center bg-white p-1 rounded-xl border-2 border-sky-200 shadow-sm">
          <button
            type="button"
            onClick={() => setSortMode('adventure')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-black transition-all ${
              sortMode === 'adventure'
                ? 'bg-amber-500 text-white shadow'
                : 'text-gray-600 hover:bg-amber-50'
            }`}
          >
            👹 {t('도깨비 모험 순서')}
          </button>
          <button
            type="button"
            onClick={() => setSortMode('ganada')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-black transition-all ${
              sortMode === 'ganada'
                ? 'bg-sky-600 text-white shadow'
                : 'text-gray-600 hover:bg-sky-50'
            }`}
          >
            🔤 {t('가나다 순서')}
          </button>
        </div>
      </div>

      {/* Header & 14 Sound Beads Progress */}
      <div className="w-full max-w-5xl text-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-black text-sky-900 mb-2">
          {t('한글 자음 소리구슬 모험')}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 font-semibold mb-4">
          {sortMode === 'adventure'
            ? t('동화 속 나래와 산이를 따라 14명의 도깨비를 만나 소리구슬을 모아 보세요!')
            : t('가나다 순서대로 배우고 싶은 한글 자음을 선택해 보세요!')}
        </p>

        {/* 14 Sound Beads Collection Bar */}
        <div className="bg-white/90 border-2 border-amber-200 rounded-2xl px-4 py-3 shadow-sm inline-flex flex-col items-center max-w-full">
          <div className="text-xs font-extrabold text-amber-800 mb-2">
            🔮 모은 도깨비 소리구슬: {earnedCount} / 14개
          </div>
          <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
            {units.map((u, idx) => {
              const collected = !!earnedBeads[u.consonant];
              return (
                <button
                  key={u.consonant}
                  type="button"
                  onClick={() => onSelectUnit(idx, 0)}
                  title={`${u.adventureOrder}장: ${u.goblinTitle}`}
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full font-black text-xs sm:text-sm flex items-center justify-center transition-transform hover:scale-110 ${
                    collected
                      ? 'text-white shadow-md ring-2 ring-amber-300'
                      : 'bg-gray-100 text-gray-400 border border-dashed border-gray-300'
                  }`}
                  style={collected ? { backgroundColor: u.beadColor } : undefined}
                >
                  {u.consonant}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 14 Consonant Unit Cards Grid */}
      <div className="w-full max-w-5xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {sortedUnits.map(({ unit, originalIndex }) => {
          const startPage = originalIndex * 5 + 1;
          const endPage = startPage + 4;
          const collected = !!earnedBeads[unit.consonant];

          return (
            <div
              key={unit.consonant}
              onClick={() => onSelectUnit(originalIndex, 0)}
              className="group cursor-pointer bg-white rounded-2xl p-4 shadow-md border-3 border-transparent hover:border-amber-400 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 flex flex-col justify-between relative"
            >
              {/* Top Adventure Badge & Page Range */}
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-black text-[11px]">
                  모험 {unit.adventureOrder}장
                </span>
                <span className="text-[11px] font-bold text-gray-400">
                  {startPage}~{endPage}쪽
                </span>
              </div>

              {/* Center Consonant & Name */}
              <div className="flex items-center gap-3 my-1">
                <div
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-white font-black text-4xl shadow-sm shrink-0 group-hover:scale-105 transition-transform"
                  style={{ backgroundColor: unit.beadColor }}
                >
                  {unit.consonant}
                </div>
                <div className="text-left min-w-0">
                  <div className="text-xl font-black text-gray-900 leading-tight flex items-center gap-1">
                    <span>{unit.name}</span>
                    {collected && <span title="소리구슬 획득 완료">🔮</span>}
                  </div>
                  <div className="text-xs font-bold text-sky-700 truncate mt-0.5">
                    {unit.goblinTitle}
                  </div>
                </div>
              </div>

              {/* Quick 5-Step Mini Buttons */}
              <div
                className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                {['①쓰기', '②음절', '③낱말', '④놀이', '⑤동시'].map((lbl, sIdx) => (
                  <button
                    key={lbl}
                    type="button"
                    onClick={() => onSelectUnit(originalIndex, sIdx)}
                    className="flex-1 py-1 rounded-md bg-gray-50 hover:bg-amber-100 text-gray-600 hover:text-amber-900 font-bold text-[10px] transition-colors"
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InitialTableOfContents;
