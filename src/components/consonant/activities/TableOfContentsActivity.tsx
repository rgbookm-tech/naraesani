import React from 'react';
import { TableOfContentsActivity as ActivityProps } from '../../types';
import { playSound, SoundType } from '../../../utils/sound';
import { useLanguage } from '../../../i18n/LanguageContext';
import { speakKorean } from '../../../utils/hangulSpeech';

export interface BatchimUnitMeta {
  badge: string;
  color: string;
  sampleWords: string;
}

export const BATCHIM_GROUP_META: BatchimUnitMeta[] = [
  { badge: 'ㅁ', color: '#f59e0b', sampleWords: '마음 · 바람 · 몸' },
  { badge: 'ㅂ', color: '#ec4899', sampleWords: '입구 · 집게 · 밥' },
  { badge: 'ㅇ', color: '#8b5cf6', sampleWords: '동굴 · 지렁이 · 용기' },
  { badge: 'ㄱ', color: '#3b82f6', sampleWords: '미역국 · 식탁 · 목' },
  { badge: 'ㄴ', color: '#10b981', sampleWords: '초인종 · 변신 · 눈' },
  { badge: 'ㄹ', color: '#06b6d4', sampleWords: '오솔길 · 딸기 · 발' },
  { badge: 'ㄷ', color: '#f97316', sampleWords: '믿다 · 돋보기 · 받다' },
  { badge: 'ㅂ·ㅍ', color: '#e11d48', sampleWords: '입 · 잎 · 깊다 · 덮다' },
  { badge: 'ㄱ·ㅋ', color: '#4f46e5', sampleWords: '학교 · 창밖 · 부엌' },
  { badge: 'ㄷ·ㅅ', color: '#0d9488', sampleWords: '다섯 · 빛 · 꽃 · 낮' },
];

const CIRCLE_NUMS = ['①', '②', '③', '④', '⑤'];

interface TableOfContentsActivityComponentProps {
  activity: ActivityProps;
  onNavigateToPage: (page: number) => void;
  onGoHome?: () => void;
}

const TableOfContentsActivityComponent: React.FC<TableOfContentsActivityComponentProps> = ({
  activity,
  onNavigateToPage,
  onGoHome,
}) => {
  const { t } = useLanguage();

  const handleItemClick = (page: number) => {
    playSound(SoundType.CLICK);
    onNavigateToPage(page);
  };

  return (
    <div className="min-h-[600px] flex flex-col items-center p-3 sm:p-6 bg-emerald-50/70 rounded-2xl relative">
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

      {/* Header & 10 Final-Consonant Sound Preview Bar */}
      <div className="w-full max-w-5xl text-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-black text-emerald-950 mb-2">
          {t('한글 받침 소리 모험')}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 font-semibold mb-4">
          {t('나래와 산이와 함께 10개 받침 단원의 소리와 낱말 퍼즐을 완성해 보세요!')}
        </p>

        {/* Quick 10-Batchim Audio Preview Strip */}
        <div className="bg-white/90 border-2 border-emerald-200 rounded-2xl px-4 py-3 shadow-sm inline-flex flex-col items-center max-w-full">
          <div className="text-xs font-extrabold text-emerald-800 mb-2">
            🔊 받침 동그라미를 누르면 단원 소리와 대표 낱말을 들을 수 있어요!
          </div>
          <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
            {activity.groups.map((group, idx) => {
              const meta = BATCHIM_GROUP_META[idx] || {
                badge: '한',
                color: '#10b981',
                sampleWords: '',
              };
              return (
                <button
                  key={`preview-${idx}`}
                  type="button"
                  onClick={() =>
                    speakKorean(`${group.title}. ${meta.sampleWords.replace(/·/g, ',')}`)
                  }
                  title={group.title}
                  className="px-2.5 h-8 sm:h-9 min-w-[2.25rem] rounded-full text-white font-black text-xs flex items-center justify-center shadow-sm transition-transform hover:scale-110"
                  style={{ backgroundColor: meta.color }}
                >
                  {meta.badge}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 10 Batchim Unit Cards Grid */}
      <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {activity.groups.map((group, index) => {
          const meta = BATCHIM_GROUP_META[index] || {
            badge: '한',
            color: '#10b981',
            sampleWords: '',
          };
          const firstPage = group.items[0]?.page ?? 1;
          const lastPage = group.items[group.items.length - 1]?.page ?? firstPage;

          return (
            <div
              key={group.title}
              onClick={() => handleItemClick(firstPage)}
              className="group cursor-pointer bg-white rounded-2xl p-4 shadow-md border-2 border-transparent hover:border-emerald-400 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 flex flex-col justify-between relative"
            >
              {/* Top Unit Badge & Page Range */}
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-black text-[11px]">
                  받침 {index + 1}단원
                </span>
                <span className="text-[11px] font-bold text-gray-400">
                  {firstPage}~{lastPage}쪽
                </span>
              </div>

              {/* Center Badge & Group Title */}
              <div className="flex items-center gap-3 my-1">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-sm shrink-0 group-hover:scale-105 transition-transform px-1"
                  style={{ backgroundColor: meta.color }}
                >
                  {meta.badge}
                </div>
                <div className="text-left min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-base sm:text-lg font-black text-gray-900 leading-tight truncate">
                      {t(group.title)}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        speakKorean(`${group.title}. ${meta.sampleWords.replace(/·/g, ',')}`);
                      }}
                      className="w-7 h-7 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs flex items-center justify-center shrink-0"
                      title="소리 듣기"
                    >
                      🔊
                    </button>
                  </div>
                  <div className="text-xs font-bold text-gray-500 truncate mt-0.5">
                    {meta.sampleWords}
                  </div>
                </div>
              </div>

              {/* Quick 4-Step Mini Buttons */}
              <div
                className="mt-3 pt-2 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                {group.items.map((item, sIdx) => (
                  <button
                    key={item.page}
                    type="button"
                    onClick={() => handleItemClick(item.page)}
                    className="py-1 px-1 rounded-md bg-gray-50 hover:bg-emerald-100 text-gray-600 hover:text-emerald-900 font-bold text-[10px] transition-colors truncate"
                    title={item.title}
                  >
                    {CIRCLE_NUMS[sIdx] || `${sIdx + 1}.`} {item.title}
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

export default TableOfContentsActivityComponent;
