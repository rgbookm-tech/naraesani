import React, { useState, useCallback, useMemo } from 'react';
import { worksheetData } from './data/vowelData';
import WorksheetPage from './components/vowel/WorksheetPage';
import TableOfContents from './components/vowel/TableOfContents';
import { useLanguage } from './i18n/LanguageContext';
import { speakKorean } from './utils/hangulSpeech';

interface VowelAppProps {
  onGoHome: () => void;
  initialPage?: number;
}

export const VOWEL_META: Record<
  string,
  { korName: string; color: string; sampleWords: string }
> = {
  ㅏ: { korName: '아', color: '#f59e0b', sampleWords: '아기 · 사자 · 가방' },
  ㅑ: { korName: '야', color: '#f97316', sampleWords: '야구 · 고양이 · 야채' },
  ㅓ: { korName: '어', color: '#ec4899', sampleWords: '어머니 · 거미 · 버스' },
  ㅕ: { korName: '여', color: '#8b5cf6', sampleWords: '여우 · 여름 · 별' },
  ㅗ: { korName: '오', color: '#10b981', sampleWords: '오이 · 모자 · 포도' },
  ㅛ: { korName: '요', color: '#06b6d4', sampleWords: '요리 · 학교 · 표범' },
  ㅜ: { korName: '우', color: '#3b82f6', sampleWords: '우유 · 우산 · 수박' },
  ㅠ: { korName: '유', color: '#6366f1', sampleWords: '유리 · 휴지 · 자유' },
  ㅡ: { korName: '으', color: '#14b8a6', sampleWords: '그네 · 그늘 · 슬리퍼' },
  ㅣ: { korName: '이', color: '#ef4444', sampleWords: '이사 · 기차 · 딸기' },
};

export function getVowelStepShortLabel(type: string, idx: number): string {
  const num = idx + 1;
  switch (type) {
    case 'body-pose':
      return `${num}. 몸 표현`;
    case 'stroke-order':
      return `${num}. 쓰는 순서`;
    case 'drawing':
      return `${num}. 따라 쓰기`;
    case 'word-highlight':
      return `${num}. 소리 찾기`;
    case 'word-image-match':
      return `${num}. 그림 잇기`;
    case 'vowel-input':
      return `${num}. 낱말 만들기`;
    case 'maze':
      return `${num}. 미로 찾기`;
    case 'word-count':
      return `${num}. 개수 세기`;
    case 'drag-drop-fill':
      return `${num}. 문장 완성`;
    default:
      return `${num}. 활동`;
  }
}

const VowelApp: React.FC<VowelAppProps> = ({ onGoHome, initialPage }) => {
  const { t } = useLanguage();

  const pageOffsets = useMemo(() => {
    const offsets: number[] = [];
    let acc = 0;
    for (const unit of worksheetData) {
      offsets.push(acc);
      acc += unit.activities.length;
    }
    return { offsets, total: acc };
  }, []);

  const resolvePage = useCallback(
    (page?: number): { vowelIdx: number; actIdx: number } => {
      if (page === undefined || page <= 0 || page > pageOffsets.total) {
        return { vowelIdx: -1, actIdx: 0 };
      }
      let remaining = page - 1;
      for (let i = 0; i < worksheetData.length; i++) {
        const len = worksheetData[i].activities.length;
        if (remaining < len) {
          return { vowelIdx: i, actIdx: remaining };
        }
        remaining -= len;
      }
      return { vowelIdx: -1, actIdx: 0 };
    },
    [pageOffsets.total]
  );

  const [currentVowelIndex, setCurrentVowelIndex] = useState<number>(
    () => resolvePage(initialPage).vowelIdx
  );
  const [currentActivityIndex, setCurrentActivityIndex] = useState<number>(
    () => resolvePage(initialPage).actIdx
  );

  const handleSelectVowel = useCallback((index: number, activityIdx = 0) => {
    setCurrentVowelIndex(index);
    setCurrentActivityIndex(activityIdx);
  }, []);

  const handleGoToTOC = useCallback(() => {
    setCurrentVowelIndex(-1);
    setCurrentActivityIndex(0);
  }, []);

  if (currentVowelIndex === -1) {
    return (
      <TableOfContents
        onSelect={handleSelectVowel}
        onGoHome={onGoHome}
        pageOffsets={pageOffsets.offsets}
      />
    );
  }

  const currentWorksheet = worksheetData[currentVowelIndex];
  const meta = VOWEL_META[currentWorksheet.vowel] || {
    korName: currentWorksheet.vowel,
    color: '#f59e0b',
    sampleWords: '',
  };
  const currentPageNumber =
    pageOffsets.offsets[currentVowelIndex] + currentActivityIndex + 1;
  const totalPages = pageOffsets.total;

  const isLastOverall =
    currentVowelIndex === worksheetData.length - 1 &&
    currentActivityIndex === currentWorksheet.activities.length - 1;

  const handleNext = () => {
    const currentVowelActivities = currentWorksheet.activities.length;
    if (currentActivityIndex < currentVowelActivities - 1) {
      setCurrentActivityIndex((prev) => prev + 1);
    } else if (currentVowelIndex < worksheetData.length - 1) {
      setCurrentVowelIndex((prev) => prev + 1);
      setCurrentActivityIndex(0);
    } else {
      handleGoToTOC();
    }
  };

  const handlePrev = () => {
    if (currentActivityIndex > 0) {
      setCurrentActivityIndex((prev) => prev - 1);
    } else if (currentVowelIndex > 0) {
      const prevVowelIndex = currentVowelIndex - 1;
      setCurrentVowelIndex(prevVowelIndex);
      setCurrentActivityIndex(worksheetData[prevVowelIndex].activities.length - 1);
    } else {
      handleGoToTOC();
    }
  };

  return (
    <div className="min-h-[600px] flex flex-col items-center justify-center p-2 sm:p-4 bg-amber-50/70 rounded-2xl text-gray-800">
      <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-4 sm:p-8 border-4 border-amber-200 relative">
        {/* Top-Left: Go to TOC ('처음으로') */}
        <button
          type="button"
          onClick={handleGoToTOC}
          className="absolute top-4 left-4 flex items-center px-3 py-1 bg-gray-200 text-gray-700 font-bold rounded-lg shadow-sm hover:bg-gray-300 transition-colors z-10"
          aria-label="Go to Table of Contents"
        >
          <span role="img" aria-label="home icon" className="mr-2">
            🏠
          </span>
          {t('처음으로')}
        </button>

        {/* Top-Right: Page Counter Badge */}
        <div className="absolute top-4 right-4 text-sm font-bold text-amber-700 bg-amber-100 px-3.5 py-1 rounded-full">
          {currentPageNumber} / {totalPages}
        </div>

        {/* Clean Unified Unit Header & Step Pill Tabs */}
        <div className="pt-9 pb-4 mb-5 border-b-2 border-amber-100 flex flex-col items-center">
          <div className="flex flex-wrap items-center justify-center gap-3 mb-3">
            <button
              type="button"
              onClick={() => speakKorean(`${meta.korName}. ${meta.sampleWords.replace(/·/g, ',')}`)}
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-sm transition-transform hover:scale-105"
              style={{ backgroundColor: meta.color }}
              title="모음 소리 듣기"
            >
              {currentWorksheet.vowel}
            </button>
            <div className="text-left">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-black text-xs">
                  모음 {currentVowelIndex + 1}단원
                </span>
                <span className="text-lg sm:text-xl font-black text-gray-900">
                  {currentWorksheet.vowel} ({meta.korName}) · 모음 소리 익히기
                </span>
                <button
                  type="button"
                  onClick={() => speakKorean(`${meta.korName}. ${meta.sampleWords.replace(/·/g, ',')}`)}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-extrabold transition-colors"
                >
                  🔊 {t('소리 듣기')}
                </button>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 font-semibold mt-0.5">
                대표 낱말: {meta.sampleWords}
              </p>
            </div>
          </div>

          {/* Step Pill Tabs */}
          <div className="flex flex-wrap justify-center gap-1.5">
            {currentWorksheet.activities.map((act, idx) => {
              const active = idx === currentActivityIndex;
              return (
                <button
                  key={`${currentWorksheet.vowel}-step-${idx}`}
                  type="button"
                  onClick={() => setCurrentActivityIndex(idx)}
                  className={`px-3 py-1 rounded-full text-xs sm:text-sm font-extrabold transition-all ${
                    active
                      ? 'bg-amber-500 text-white shadow-sm scale-105'
                      : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
                  }`}
                >
                  {getVowelStepShortLabel(act.type, idx)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Step Body */}
        <div className="min-h-[380px] flex items-center justify-center py-2">
          <WorksheetPage
            key={`${currentVowelIndex}-${currentActivityIndex}`}
            data={currentWorksheet}
            activityIndex={currentActivityIndex}
          />
        </div>

        {/* Unified Bottom Prev / TOC / Next Navigation */}
        <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrev}
            className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-sm sm:text-base shadow transition-transform active:scale-95"
          >
            ◀ {t('이전')}
          </button>

          <button
            type="button"
            onClick={handleGoToTOC}
            className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs sm:text-sm"
          >
            📑 {t('목차')} ({currentVowelIndex + 1} / {worksheetData.length}단원)
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm sm:text-base shadow transition-transform active:scale-95"
          >
            {isLastOverall ? `${t('완료')} 🎉` : `${t('다음')} ▶`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VowelApp;
