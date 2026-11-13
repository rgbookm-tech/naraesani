import React from 'react';
import { worksheetData } from '../../data/vowelData';
import { VOWEL_META } from '../../VowelApp';
import { useLanguage } from '../../i18n/LanguageContext';
import { speakKorean } from '../../utils/hangulSpeech';

interface TableOfContentsProps {
  onSelect: (index: number, activityIdx?: number) => void;
  onGoHome?: () => void;
  pageOffsets?: number[];
}

const MINI_STEP_NAMES: Record<string, string> = {
  'body-pose': '몸표현',
  'stroke-order': '획순',
  drawing: '쓰기',
  'word-highlight': '찾기',
  'word-image-match': '잇기',
  'vowel-input': '낱말',
  maze: '미로',
  'word-count': '세기',
  'drag-drop-fill': '문장',
};

const CIRCLE_NUMS = ['①', '②', '③', '④', '⑤', '⑥'];

const TableOfContents: React.FC<TableOfContentsProps> = ({
  onSelect,
  onGoHome,
  pageOffsets,
}) => {
  const { t } = useLanguage();

  return (
    <div className="min-h-[600px] flex flex-col items-center p-3 sm:p-6 bg-amber-50/70 rounded-2xl relative">
      {/* Top Row: Main Dashboard Return Button */}
      <div className="w-full max-w-5xl flex flex-wrap items-center justify-between gap-3 mb-4">
        {onGoHome && (
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
        )}
      </div>

      {/* Header & 10 Vowels Sound Preview Bar */}
      <div className="w-full max-w-5xl text-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-black text-amber-900 mb-2">
          {t('한글 모음 소리 모험')}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 font-semibold mb-4">
          {t('나래와 산이와 함께 10개 기본 모음의 소리와 모양을 익혀 보세요!')}
        </p>

        {/* Quick 10-Vowel Audio Preview Strip */}
        <div className="bg-white/90 border-2 border-amber-200 rounded-2xl px-4 py-3 shadow-sm inline-flex flex-col items-center max-w-full">
          <div className="text-xs font-extrabold text-amber-800 mb-2">
            🔊 글자 동그라미를 누르면 모음 소리를 들을 수 있어요!
          </div>
          <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
            {worksheetData.map((u) => {
              const meta = VOWEL_META[u.vowel] || {
                korName: u.vowel,
                color: '#f59e0b',
                sampleWords: '',
              };
              return (
                <button
                  key={`sound-${u.vowel}`}
                  type="button"
                  onClick={() => speakKorean(meta.korName)}
                  title={`${u.vowel} (${meta.korName}) 소리 듣기`}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full text-white font-black text-sm flex items-center justify-center shadow-sm transition-transform hover:scale-110"
                  style={{ backgroundColor: meta.color }}
                >
                  {u.vowel}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 10 Vowel Unit Cards Grid */}
      <div className="w-full max-w-5xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {worksheetData.map((unit, index) => {
          const meta = VOWEL_META[unit.vowel] || {
            korName: unit.vowel,
            color: '#f59e0b',
            sampleWords: '',
          };
          const startPage = (pageOffsets ? pageOffsets[index] : index * 5) + 1;
          const endPage = startPage + unit.activities.length - 1;

          return (
            <div
              key={unit.vowel}
              onClick={() => onSelect(index, 0)}
              className="group cursor-pointer bg-white rounded-2xl p-4 shadow-md border-2 border-transparent hover:border-amber-400 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 flex flex-col justify-between relative"
            >
              {/* Top Unit Badge & Page Range */}
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-black text-[11px]">
                  모음 {index + 1}단원
                </span>
                <span className="text-[11px] font-bold text-gray-400">
                  {startPage}~{endPage}쪽
                </span>
              </div>

              {/* Center Vowel Badge & Name */}
              <div className="flex items-center gap-3 my-1">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-4xl shadow-sm shrink-0 group-hover:scale-105 transition-transform"
                  style={{ backgroundColor: meta.color }}
                >
                  {unit.vowel}
                </div>
                <div className="text-left min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xl font-black text-gray-900 leading-tight">
                      {meta.korName}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        speakKorean(`${meta.korName}. ${meta.sampleWords.replace(/·/g, ',')}`);
                      }}
                      className="w-7 h-7 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs flex items-center justify-center shrink-0"
                      title="소리 듣기"
                    >
                      🔊
                    </button>
                  </div>
                  <div className="text-[11px] font-bold text-gray-500 truncate mt-0.5">
                    {meta.sampleWords}
                  </div>
                </div>
              </div>

              {/* Quick Step Mini Buttons */}
              <div
                className="mt-3 pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                {unit.activities.slice(0, 5).map((act, sIdx) => (
                  <button
                    key={`${unit.vowel}-mini-${sIdx}`}
                    type="button"
                    onClick={() => onSelect(index, sIdx)}
                    className="flex-1 py-1 px-0.5 rounded-md bg-gray-50 hover:bg-amber-100 text-gray-600 hover:text-amber-900 font-bold text-[10px] transition-colors whitespace-nowrap"
                  >
                    {CIRCLE_NUMS[sIdx]}
                    {MINI_STEP_NAMES[act.type] || '활동'}
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

export default TableOfContents;
