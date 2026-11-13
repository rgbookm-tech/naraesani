import React, { useState, useEffect, useMemo } from 'react';
import { Step5PoemData } from '../../types/initialConsonantTypes';
import { charHasTargetConsonant, speakKorean } from '../../utils/hangulSpeech';
import { useLanguage } from '../../i18n/LanguageContext';

interface Step5PoemActivityProps {
  consonant: string;
  beadColor: string;
  beadLabel: string;
  goblinTitle: string;
  data: Step5PoemData;
  isBeadEarned: boolean;
  onEarnBead: () => void;
}

const Step5PoemActivity: React.FC<Step5PoemActivityProps> = ({
  consonant,
  beadColor,
  beadLabel,
  goblinTitle,
  data,
  isBeadEarned,
  onEarnBead,
}) => {
  const { t } = useLanguage();
  const [circledKeys, setCircledKeys] = useState<Record<string, boolean>>({});
  const [wrongKey, setWrongKey] = useState<string | null>(null);
  const [hintKey, setHintKey] = useState<string | null>(null);

  useEffect(() => {
    setCircledKeys({});
    setWrongKey(null);
    setHintKey(null);
  }, [consonant, data]);

  // All lines including title as row 0
  const allLines = useMemo(() => [data.title, ...data.lines], [data.title, data.lines]);

  // Compute all valid target character keys
  const targetKeys = useMemo(() => {
    const keys: string[] = [];
    allLines.forEach((line, rIdx) => {
      Array.from(line).forEach((ch, cIdx) => {
        if (charHasTargetConsonant(ch, data.targetConsonants, data.matchMode)) {
          keys.push(`${rIdx}-${cIdx}`);
        }
      });
    });
    return keys;
  }, [allLines, data.targetConsonants, data.matchMode]);

  const foundCount = targetKeys.filter((k) => circledKeys[k]).length;
  const totalCount = targetKeys.length;
  const allFound = totalCount > 0 && foundCount >= totalCount;

  useEffect(() => {
    if (allFound && !isBeadEarned) {
      onEarnBead();
      speakKorean(`참 잘했어요! ${beadLabel}을 획득했어요!`);
    }
  }, [allFound, isBeadEarned, onEarnBead, beadLabel]);

  const handleCharTap = (rIdx: number, cIdx: number, ch: string) => {
    const trimmed = ch.trim();
    if (!trimmed || /[.,!?“”‘’~]/.test(trimmed)) return;

    const key = `${rIdx}-${cIdx}`;
    const isTarget = charHasTargetConsonant(ch, data.targetConsonants, data.matchMode);

    if (isTarget) {
      speakKorean(ch);
      setCircledKeys((prev) => ({ ...prev, [key]: true }));
      if (hintKey === key) setHintKey(null);
    } else {
      setWrongKey(key);
      setTimeout(() => setWrongKey(null), 500);
    }
  };

  const handleShowHint = () => {
    const unfound = targetKeys.find((k) => !circledKeys[k]);
    if (!unfound) return;
    setHintKey(unfound);
    setTimeout(() => setHintKey(null), 2200);
  };

  const handleRevealAll = () => {
    const next: Record<string, boolean> = {};
    targetKeys.forEach((k) => {
      next[k] = true;
    });
    setCircledKeys(next);
  };

  const fullPoemSpeech = `${data.title}. ${data.lines.join('. ')}`;
  const poemBgUrl = './images/initial/poem_bg.jpg';

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex items-center gap-2 mb-3 text-center max-w-3xl">
        <span className="shrink-0 w-8 h-8 rounded-full bg-pink-400 text-white font-black flex items-center justify-center shadow-sm">
          5
        </span>
        <h3 className="text-lg sm:text-2xl font-extrabold text-gray-800">{t(data.instruction)}</h3>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 mb-4">
        <button
          type="button"
          onClick={() => speakKorean(fullPoemSpeech, 0.86)}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow flex items-center gap-1.5"
        >
          <span>🔊</span>
          <span>동시 전체 듣기</span>
        </button>

        <span className="px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-950 font-extrabold text-xs sm:text-sm border border-amber-300">
          찾은 ‘{data.targetConsonants.join('·')}’ 글자: {foundCount} / {totalCount}개
        </span>

        {!allFound && (
          <>
            <button
              type="button"
              onClick={handleShowHint}
              className="px-3 py-1.5 rounded-xl bg-yellow-100 hover:bg-yellow-200 text-yellow-900 font-extrabold text-xs border border-yellow-300"
            >
              💡 힌트
            </button>
            <button
              type="button"
              onClick={handleRevealAll}
              className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-xs border border-gray-300"
            >
              정답 확인
            </button>
          </>
        )}
      </div>

      {/* Sage-Green Notebook Poem Frame */}
      <div
        className="w-full max-w-2xl rounded-3xl p-4 sm:p-7 shadow-lg border-4 border-[#c9d8c5] bg-[#d8e6d4] relative overflow-hidden"
        style={{
          backgroundImage: `url(${poemBgUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="bg-white/92 backdrop-blur-[1px] rounded-2xl border-2 border-[#b5ab99] px-4 py-6 sm:px-8 sm:py-8 shadow-sm">
          <div className="text-xs font-extrabold text-emerald-700 text-center mb-2">
            ✨ {goblinTitle}
          </div>

          <div className="flex flex-col items-center space-y-2.5 sm:space-y-3">
            {allLines.map((line, rIdx) => {
              const isTitleRow = rIdx === 0;
              return (
                <div
                  key={rIdx}
                  className={`flex flex-wrap items-center justify-center gap-y-1 ${
                    isTitleRow ? 'mb-3 pb-2 border-b-2 border-dashed border-amber-200' : ''
                  }`}
                >
                  {Array.from(line).map((ch, cIdx) => {
                    if (ch === ' ') {
                      return <span key={cIdx} className="w-2.5 sm:w-3.5 inline-block" />;
                    }
                    const key = `${rIdx}-${cIdx}`;
                    const isCircled = !!circledKeys[key];
                    const isWrong = wrongKey === key;
                    const isHint = hintKey === key;

                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleCharTap(rIdx, cIdx, ch)}
                        className={`relative px-0.5 sm:px-1 py-0.5 rounded-lg font-extrabold transition-transform select-none ${
                          isTitleRow
                            ? 'text-2xl sm:text-3xl text-amber-950'
                            : 'text-lg sm:text-2xl text-gray-800'
                        } ${
                          isCircled
                            ? 'text-rose-700 scale-105'
                            : isWrong
                            ? 'bg-rose-100 text-rose-500'
                            : isHint
                            ? 'bg-yellow-200 animate-bounce'
                            : 'hover:bg-amber-100/70'
                        }`}
                      >
                        <span>{ch}</span>
                        {isCircled && (
                          <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                            <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-[3px] border-rose-500/90" />
                          </span>
                        )}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => speakKorean(line, 0.88)}
                    title="이 줄 소리 듣기"
                    className="ml-2 w-6 h-6 rounded-full bg-stone-100 hover:bg-amber-100 text-stone-500 hover:text-amber-800 text-xs flex items-center justify-center"
                  >
                    🔈
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Goblin Sound Bead Earned Banner */}
      {(allFound || isBeadEarned) && (
        <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-yellow-50 to-emerald-50 border-2 border-amber-300 shadow-md flex items-center gap-3 animate-bounce">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-xl shadow-inner ring-4 ring-white"
            style={{ backgroundColor: beadColor }}
          >
            {consonant}
          </div>
          <div className="text-left">
            <div className="text-sm sm:text-base font-black text-amber-950">
              🔮 {beadLabel} 획득 성공!
            </div>
            <div className="text-xs font-bold text-emerald-800">
              ‘{consonant}’ 단원의 5가지 활동을 모두 훌륭하게 마쳤어요!
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step5PoemActivity;
