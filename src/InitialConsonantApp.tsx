import React, { useState, useCallback } from 'react';
import { INITIAL_CONSONANT_UNITS } from './data/initialConsonantData';
import InitialTableOfContents from './components/initial/InitialTableOfContents';
import { Step1StrokeActivity, Step2SyllableGridActivity } from './components/initial/StrokeTraceCanvas';
import Step3WordActivity from './components/initial/Step3WordActivity';
import Step4PlayActivity from './components/initial/Step4PlayActivity';
import Step5PoemActivity from './components/initial/Step5PoemActivity';
import { useLanguage } from './i18n/LanguageContext';
import { speakKorean } from './utils/hangulSpeech';

interface InitialConsonantAppProps {
  onGoHome: () => void;
  initialPage?: number;
}

const BEAD_STORAGE_KEY = 'naraesani_initial_beads_v1';
const STEPS_PER_UNIT = 5;

const STEP_LABELS = [
  '1. 자음 쓰기',
  '2. 글자 읽기',
  '3. 낱말 완성',
  '4. 낱말 놀이',
  '5. 도깨비 동시',
];

const InitialConsonantApp: React.FC<InitialConsonantAppProps> = ({ onGoHome, initialPage }) => {
  const { t } = useLanguage();

  const totalPages = INITIAL_CONSONANT_UNITS.length * STEPS_PER_UNIT; // 70

  const [currentUnitIndex, setCurrentUnitIndex] = useState<number>(() => {
    if (initialPage !== undefined && initialPage > 0 && initialPage <= totalPages) {
      return Math.floor((initialPage - 1) / STEPS_PER_UNIT);
    }
    return -1; // -1 = TOC (목차 바로 진입)
  });

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(() => {
    if (initialPage !== undefined && initialPage > 0 && initialPage <= totalPages) {
      return (initialPage - 1) % STEPS_PER_UNIT;
    }
    return 0;
  });

  const [earnedBeads, setEarnedBeads] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(BEAD_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const handleEarnBead = useCallback((consonant: string) => {
    setEarnedBeads((prev) => {
      const next = { ...prev, [consonant]: true };
      try {
        localStorage.setItem(BEAD_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore storage quota errors
      }
      return next;
    });
  }, []);

  const handleSelectUnit = useCallback((unitIdx: number, stepIdx = 0) => {
    setCurrentUnitIndex(unitIdx);
    setCurrentStepIndex(stepIdx);
  }, []);

  const handleGoToTOC = useCallback(() => {
    setCurrentUnitIndex(-1);
    setCurrentStepIndex(0);
  }, []);

  if (currentUnitIndex === -1) {
    return (
      <InitialTableOfContents
        units={INITIAL_CONSONANT_UNITS}
        earnedBeads={earnedBeads}
        onSelectUnit={handleSelectUnit}
        onGoHome={onGoHome}
      />
    );
  }

  const unit = INITIAL_CONSONANT_UNITS[currentUnitIndex];
  const currentPageNumber = currentUnitIndex * STEPS_PER_UNIT + currentStepIndex + 1;

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((s) => s - 1);
    } else if (currentUnitIndex > 0) {
      setCurrentUnitIndex((u) => u - 1);
      setCurrentStepIndex(STEPS_PER_UNIT - 1);
    } else {
      handleGoToTOC();
    }
  };

  const handleNext = () => {
    if (currentStepIndex < STEPS_PER_UNIT - 1) {
      setCurrentStepIndex((s) => s + 1);
    } else if (currentUnitIndex < INITIAL_CONSONANT_UNITS.length - 1) {
      setCurrentUnitIndex((u) => u + 1);
      setCurrentStepIndex(0);
    } else {
      handleGoToTOC();
    }
  };

  const renderStepBody = () => {
    switch (currentStepIndex) {
      case 0:
        return (
          <Step1StrokeActivity
            consonant={unit.consonant}
            consonantName={unit.name}
            instruction={unit.step1Instruction}
            strokeGuides={unit.strokeGuides}
          />
        );
      case 1:
        return (
          <Step2SyllableGridActivity
            consonant={unit.consonant}
            instruction={unit.step2Instruction}
            syllables10={unit.syllables10}
          />
        );
      case 2:
        return <Step3WordActivity consonant={unit.consonant} data={unit.step3} />;
      case 3:
        return <Step4PlayActivity data={unit.step4} />;
      case 4:
      default:
        return (
          <Step5PoemActivity
            consonant={unit.consonant}
            beadColor={unit.beadColor}
            beadLabel={unit.beadLabel}
            goblinTitle={unit.goblinTitle}
            data={unit.step5}
            isBeadEarned={!!earnedBeads[unit.consonant]}
            onEarnBead={() => handleEarnBead(unit.consonant)}
          />
        );
    }
  };

  return (
    <div className="min-h-[600px] flex flex-col items-center justify-center p-2 sm:p-4 bg-sky-50/70 rounded-2xl text-gray-800">
      <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-4 sm:p-8 border-4 border-sky-200 relative">
        {/* Top-Left: Go to TOC ('처음으로') */}
        <button
          type="button"
          onClick={handleGoToTOC}
          className="absolute top-4 left-4 flex items-center px-3 py-1 bg-gray-200 text-gray-700 font-bold rounded-lg shadow-sm hover:bg-gray-300 transition-colors z-10"
        >
          <span role="img" aria-label="home icon" className="mr-2">
            🏠
          </span>
          {t('처음으로')}
        </button>

        {/* Top-Right: Page Counter Badge ('1 / 70') */}
        <div className="absolute top-4 right-4 text-sm font-bold text-amber-600 bg-amber-100 px-3.5 py-1 rounded-full">
          {currentPageNumber} / {totalPages}
        </div>

        {/* Unit Story Header & 5-Step Tabs */}
        <div className="pt-9 pb-4 mb-5 border-b-2 border-sky-100 flex flex-col items-center">
          <div className="flex flex-wrap items-center justify-center gap-3 mb-3">
            <button
              type="button"
              onClick={() => speakKorean(`${unit.name}. ${unit.goblinTitle}`)}
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-sm transition-transform hover:scale-105"
              style={{ backgroundColor: unit.beadColor }}
              title="소리 듣기"
            >
              {unit.consonant}
            </button>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-black text-xs">
                  도깨비 모험 {unit.adventureOrder}장
                </span>
                <span className="text-lg sm:text-xl font-black text-gray-900">
                  {unit.consonant} ({unit.name}) · 소리구슬 활동
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 font-semibold mt-0.5">
                {unit.goblinStorySummary}
              </p>
            </div>
          </div>

          {/* 5-Step Pill Tabs */}
          <div className="flex flex-wrap justify-center gap-1.5">
            {STEP_LABELS.map((label, idx) => {
              const active = idx === currentStepIndex;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`px-3 py-1 rounded-full text-xs sm:text-sm font-extrabold transition-all ${
                    active
                      ? 'bg-sky-600 text-white shadow-sm scale-105'
                      : 'bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Step Body */}
        <div className="min-h-[380px] flex items-center justify-center py-2">{renderStepBody()}</div>

        {/* Bottom Prev / Next Navigation */}
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
            📑 {t('목차')} ({unit.adventureOrder} / 14단원)
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm sm:text-base shadow transition-transform active:scale-95"
          >
            {currentUnitIndex === INITIAL_CONSONANT_UNITS.length - 1 && currentStepIndex === STEPS_PER_UNIT - 1
              ? `${t('완료')} 🎉`
              : `${t('다음')} ▶`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InitialConsonantApp;
