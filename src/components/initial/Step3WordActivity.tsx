import React, { useState, useEffect } from 'react';
import { Step3Data, WordSlotBox } from '../../types/initialConsonantTypes';
import { speakKorean } from '../../utils/hangulSpeech';
import { useLanguage } from '../../i18n/LanguageContext';

interface Step3WordActivityProps {
  consonant: string;
  data: Step3Data;
}

const Step3WordActivity: React.FC<Step3WordActivityProps> = ({ consonant, data }) => {
  const { t } = useLanguage();

  // State for slot-fill
  const [filledSlots, setFilledSlots] = useState<Record<string, boolean>>({});
  const [selectedToken, setSelectedToken] = useState<string>(consonant);

  // State for word-choice
  const [chosenWords, setChosenWords] = useState<Record<string, string>>({});
  const [wrongChoiceKey, setWrongChoiceKey] = useState<string | null>(null);

  // State for tap-match
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [selectedWordStr, setSelectedWordStr] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({});
  const [wrongMatchFlash, setWrongMatchFlash] = useState(false);

  useEffect(() => {
    setFilledSlots({});
    setSelectedToken(consonant);
    setChosenWords({});
    setWrongChoiceKey(null);
    setSelectedImageId(null);
    setSelectedWordStr(null);
    setMatchedPairs({});
    setWrongMatchFlash(false);
  }, [consonant, data]);

  // ─── 1) SLOT-FILL MODE ──────────────────────────────────────────────────────
  if (data.mode === 'slot-fill') {
    const totalBlankBoxes = data.items.reduce(
      (acc, item) => acc + item.boxes.filter((b) => b.layout !== 'given-syllable').length,
      0
    );
    const filledCount = Object.keys(filledSlots).length;
    const allDone = filledCount >= totalBlankBoxes && totalBlankBoxes > 0;

    const handleSlotClick = (itemId: string, word: string, boxIdx: number, box: WordSlotBox, allBoxes: WordSlotBox[]) => {
      if (box.layout === 'given-syllable') {
        speakKorean(box.targetSyllable);
        return;
      }
      const key = `${itemId}-${boxIdx}`;
      if (filledSlots[key]) {
        speakKorean(box.targetSyllable);
        return;
      }

      // Accept if selectedToken matches consonant OR matches targetSyllable
      if (selectedToken === consonant || selectedToken === box.answerToken || selectedToken === box.targetSyllable) {
        const next = { ...filledSlots, [key]: true };
        setFilledSlots(next);

        // Check if entire word is now completed
        const wordCompleted = allBoxes.every(
          (b, idx) => b.layout === 'given-syllable' || next[`${itemId}-${idx}`]
        );
        if (wordCompleted) {
          speakKorean(word);
        } else {
          speakKorean(box.targetSyllable);
        }
      } else {
        speakKorean('다시 골라 보세요');
      }
    };

    return (
      <div className="w-full flex flex-col items-center">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-8 h-8 rounded-full bg-pink-400 text-white font-black flex items-center justify-center shadow-sm">
            3
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-gray-800">{t(data.instruction)}</h3>
        </div>

        {/* Token Picker Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-5 bg-amber-50 border-2 border-amber-200 px-4 py-2.5 rounded-2xl">
          <span className="text-xs sm:text-sm font-bold text-amber-900 mr-1">
            글자 도장 선택 후 빈칸을 콕! 눌러보세요:
          </span>
          {data.choicesPool.map((tok) => {
            const active = selectedToken === tok;
            return (
              <button
                key={tok}
                type="button"
                onClick={() => {
                  setSelectedToken(tok);
                  speakKorean(tok);
                }}
                className={`px-3.5 py-1.5 rounded-xl font-black text-lg border-2 transition-all ${
                  active
                    ? 'bg-amber-500 text-white border-amber-600 scale-105 shadow'
                    : 'bg-white text-gray-700 border-amber-300 hover:bg-amber-100'
                }`}
              >
                {tok}
              </button>
            );
          })}
        </div>

        {/* 3 Picture Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-4xl">
          {data.items.map((item) => {
            const isItemComplete = item.boxes.every(
              (b, i) => b.layout === 'given-syllable' || filledSlots[`${item.id}-${i}`]
            );
            return (
              <div
                key={item.id}
                className={`flex flex-col items-center justify-between p-4 rounded-2xl border-2 transition-all bg-white shadow-sm ${
                  isItemComplete ? 'border-emerald-400 bg-emerald-50/30 ring-2 ring-emerald-100' : 'border-gray-200'
                }`}
              >
                <div className="relative w-full h-36 flex items-center justify-center mb-3">
                  <img
                    src={item.image}
                    alt={item.word}
                    className="max-h-32 max-w-[150px] object-contain drop-shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => speakKorean(item.word)}
                    title="낱말 소리 듣기"
                    className="absolute top-0 right-0 w-9 h-9 rounded-full bg-sky-100 hover:bg-sky-200 text-sky-700 flex items-center justify-center text-base shadow-sm"
                  >
                    🔊
                  </button>
                </div>

                {/* Syllable Boxes */}
                <div className="flex items-center justify-center gap-1.5">
                  {item.boxes.map((box, bIdx) => {
                    const slotKey = `${item.id}-${bIdx}`;
                    const isFilled = box.layout === 'given-syllable' || !!filledSlots[slotKey];

                    return (
                      <button
                        key={slotKey}
                        type="button"
                        onClick={() => handleSlotClick(item.id, item.word, bIdx, box, item.boxes)}
                        className={`w-16 h-16 sm:w-[70px] sm:h-[70px] rounded-xl border-2 flex items-center justify-center transition-all relative ${
                          isFilled
                            ? 'border-emerald-500 bg-white text-gray-900 shadow-sm'
                            : 'border-gray-800 bg-amber-50/40 hover:bg-amber-100/70 cursor-pointer'
                        }`}
                      >
                        {isFilled ? (
                          <span
                            className={`text-3xl font-black ${
                              box.layout === 'given-syllable' ? 'text-gray-800' : 'text-blue-600'
                            }`}
                          >
                            {box.targetSyllable}
                          </span>
                        ) : box.layout === 'consonant-left' ? (
                          <div className="flex items-center justify-center gap-0.5 w-full px-1">
                            <span className="w-7 h-9 border-2 border-dashed border-rose-400 rounded bg-rose-50/70 text-rose-400 text-xs font-bold flex items-center justify-center animate-pulse">
                              ?
                            </span>
                            <span className="text-2xl font-black text-gray-800">{box.hintPart}</span>
                          </div>
                        ) : box.layout === 'consonant-top' ? (
                          <div className="flex flex-col items-center justify-center leading-none py-1">
                            {box.hintPart === '어(받침)' ? (
                              <>
                                <span className="text-xl font-black text-gray-800 mb-0.5">어</span>
                                <span className="w-9 h-5 border-2 border-dashed border-rose-400 rounded bg-rose-50/70 text-rose-400 text-[10px] font-bold flex items-center justify-center animate-pulse">
                                  ?
                                </span>
                              </>
                            ) : (
                              <>
                                <span className="w-9 h-6 border-2 border-dashed border-rose-400 rounded bg-rose-50/70 text-rose-400 text-xs font-bold flex items-center justify-center animate-pulse mb-0.5">
                                  ?
                                </span>
                                <span className="text-xl font-black text-gray-800">{box.hintPart}</span>
                              </>
                            )}
                          </div>
                        ) : (
                          <span className="w-10 h-10 border-2 border-dashed border-rose-400 rounded bg-rose-50 text-rose-400 font-bold flex items-center justify-center">
                            ?
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {isItemComplete && (
                  <div className="mt-2 text-sm font-black text-emerald-700">✓ {item.word}</div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex items-center gap-3">
          {filledCount > 0 && (
            <button
              type="button"
              onClick={() => setFilledSlots({})}
              className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-sm"
            >
              다시 풀기
            </button>
          )}
          {allDone && (
            <div className="px-5 py-2 rounded-xl bg-emerald-500 text-white font-black text-sm shadow animate-bounce">
              🎉 참 잘했어요! 모든 낱말을 완성했어요!
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── 2) WORD-CHOICE MODE (ㄴ, ㅌ) ───────────────────────────────────────────
  if (data.mode === 'word-choice') {
    const correctCount = data.items.filter((it) => chosenWords[it.id] === it.answer).length;
    const allDone = correctCount === data.items.length;

    const handlePick = (itemId: string, option: string, answer: string) => {
      if (option === answer) {
        setChosenWords((prev) => ({ ...prev, [itemId]: option }));
        setWrongChoiceKey(null);
        speakKorean(option);
      } else {
        setWrongChoiceKey(`${itemId}-${option}`);
        speakKorean('다시 생각해 보세요');
        setTimeout(() => setWrongChoiceKey(null), 700);
      }
    };

    return (
      <div className="w-full flex flex-col items-center">
        <div className="flex items-center gap-2 mb-5">
          <span className="w-8 h-8 rounded-full bg-pink-400 text-white font-black flex items-center justify-center shadow-sm">
            3
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-gray-800">{t(data.instruction)}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          {data.items.map((item) => {
            const solved = chosenWords[item.id] === item.answer;
            return (
              <div
                key={item.id}
                className={`flex flex-col items-center p-5 rounded-2xl border-2 bg-white shadow-sm transition-all ${
                  solved ? 'border-emerald-400 bg-emerald-50/30' : 'border-amber-200'
                }`}
              >
                <div className="relative w-full h-36 flex items-center justify-center mb-4">
                  <img src={item.image} alt={item.answer} className="max-h-32 max-w-[150px] object-contain" />
                  <button
                    type="button"
                    onClick={() => speakKorean(item.answer)}
                    className="absolute top-0 right-0 w-9 h-9 rounded-full bg-sky-100 hover:bg-sky-200 text-sky-700 flex items-center justify-center text-base shadow-sm"
                  >
                    🔊
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5 w-full justify-center">
                  {item.options.map((opt) => {
                    const isCircled = chosenWords[item.id] === opt;
                    const isWrong = wrongChoiceKey === `${item.id}-${opt}`;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handlePick(item.id, opt, item.answer)}
                        className={`relative px-4 py-2.5 rounded-2xl font-black text-lg border-2 transition-all ${
                          isCircled
                            ? 'bg-amber-50 border-rose-500 text-gray-900 shadow-sm'
                            : isWrong
                            ? 'bg-rose-100 border-rose-400 text-rose-700 animate-pulse'
                            : 'bg-rose-50/70 hover:bg-amber-100 border-rose-200 text-gray-800'
                        }`}
                      >
                        <span>{opt}</span>
                        {isCircled && (
                          <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                            <span className="w-12 h-12 rounded-full border-4 border-rose-500 opacity-90" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {allDone && (
          <div className="mt-6 px-5 py-2 rounded-xl bg-emerald-500 text-white font-black text-sm shadow animate-bounce">
            🎉 정답이에요! 그림에 알맞은 낱말을 모두 찾았어요!
          </div>
        )}
      </div>
    );
  }

  // ─── 3) TAP-MATCH MODE (ㅎ) ─────────────────────────────────────────────────
  const matchedCount = Object.keys(matchedPairs).length;
  const allMatched = matchedCount === data.items.length;

  const tryMatch = (imgId: string, wordStr: string) => {
    const targetItem = data.items.find((it) => it.id === imgId);
    if (targetItem && targetItem.word === wordStr) {
      setMatchedPairs((prev) => ({ ...prev, [imgId]: wordStr }));
      setSelectedImageId(null);
      setSelectedWordStr(null);
      speakKorean(wordStr);
    } else {
      setWrongMatchFlash(true);
      speakKorean('다시 짝지어 보세요');
      setTimeout(() => {
        setWrongMatchFlash(false);
        setSelectedImageId(null);
        setSelectedWordStr(null);
      }, 600);
    }
  };

  const handleTapImage = (imgId: string) => {
    if (matchedPairs[imgId]) {
      const w = matchedPairs[imgId];
      speakKorean(w);
      return;
    }
    if (selectedWordStr) {
      tryMatch(imgId, selectedWordStr);
    } else {
      setSelectedImageId(imgId === selectedImageId ? null : imgId);
    }
  };

  const handleTapWord = (wordStr: string) => {
    const alreadyMatched = Object.values(matchedPairs).includes(wordStr);
    speakKorean(wordStr);
    if (alreadyMatched) return;
    if (selectedImageId) {
      tryMatch(selectedImageId, wordStr);
    } else {
      setSelectedWordStr(wordStr === selectedWordStr ? null : wordStr);
    }
  };

  const PAIR_BADGE_COLORS = ['bg-emerald-500', 'bg-sky-500', 'bg-purple-500'];

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-8 h-8 rounded-full bg-pink-400 text-white font-black flex items-center justify-center shadow-sm">
          3
        </span>
        <h3 className="text-xl sm:text-2xl font-extrabold text-gray-800">{t(data.instruction)}</h3>
      </div>

      <p className="text-sm text-gray-500 mb-5">
        위쪽 그림을 누른 뒤 아래쪽에서 어울리는 낱말을 꾹 눌러 짝지어 보세요!
      </p>

      {/* Top Row: Images */}
      <div className="grid grid-cols-3 gap-4 sm:gap-8 w-full max-w-3xl mb-8">
        {data.items.map((item, idx) => {
          const isMatched = !!matchedPairs[item.id];
          const isSelected = selectedImageId === item.id;
          const badgeColor = PAIR_BADGE_COLORS[idx % PAIR_BADGE_COLORS.length];
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleTapImage(item.id)}
              className={`flex flex-col items-center p-4 rounded-2xl border-4 bg-white transition-all ${
                isMatched
                  ? 'border-emerald-400 bg-emerald-50/40'
                  : isSelected
                  ? wrongMatchFlash
                    ? 'border-rose-500 bg-rose-50'
                    : 'border-amber-400 bg-amber-50 scale-105 shadow-md'
                  : 'border-gray-200 hover:border-amber-300'
              }`}
            >
              <img src={item.image} alt={item.word} className="h-28 sm:h-32 object-contain mb-3" />
              <span
                className={`w-5 h-5 rounded-full ${
                  isMatched ? badgeColor : isSelected ? 'bg-amber-500 animate-ping' : 'bg-emerald-300'
                }`}
              />
              {isMatched && (
                <span className="mt-2 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-xs font-black">
                  ✓ {item.word}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Row: Words */}
      <div className="grid grid-cols-3 gap-4 sm:gap-8 w-full max-w-3xl">
        {data.wordOrder.map((w) => {
          const matchedOwnerIdx = data.items.findIndex((it) => matchedPairs[it.id] === w);
          const isMatched = matchedOwnerIdx > -1;
          const isSelected = selectedWordStr === w;
          const badgeColor =
            matchedOwnerIdx > -1 ? PAIR_BADGE_COLORS[matchedOwnerIdx % PAIR_BADGE_COLORS.length] : 'bg-emerald-300';

          return (
            <button
              key={w}
              type="button"
              onClick={() => handleTapWord(w)}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border-4 bg-white transition-all ${
                isMatched
                  ? 'border-emerald-400 bg-emerald-50/40 text-emerald-900'
                  : isSelected
                  ? 'border-amber-400 bg-amber-50 scale-105 shadow-md'
                  : 'border-gray-200 hover:border-amber-300 text-gray-800'
              }`}
            >
              <span className={`w-4 h-4 rounded-full mb-2 ${isMatched ? badgeColor : 'bg-emerald-400'}`} />
              <span className="text-2xl sm:text-3xl font-black">{w}</span>
            </button>
          );
        })}
      </div>

      {allMatched && (
        <div className="mt-6 px-5 py-2 rounded-xl bg-emerald-500 text-white font-black text-sm shadow animate-bounce">
          🎉 호로록 · 후다닥 · 훨훨! 모두 알맞게 연결했어요!
        </div>
      )}
    </div>
  );
};

export default Step3WordActivity;
