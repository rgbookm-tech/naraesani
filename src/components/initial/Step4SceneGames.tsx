import React, { useState, useEffect } from 'react';
import { Step4Data } from '../../types/initialConsonantTypes';
import { speakKorean } from '../../utils/hangulSpeech';

// ─── 5. ㅋ Mimicry Match & Fill ──────────────────────────────────────────────
export const MimicMatchFillGame: React.FC<{
  data: Extract<Step4Data, { playType: 'mimic-match-fill' }>;
}> = ({ data }) => {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matched, setMatched] = useState<Record<string, string>>({});

  useEffect(() => {
    setSelectedLeft(null);
    setMatched({});
  }, [data]);

  const allDone = Object.keys(matched).length === data.items.length;

  const handleRightTap = (word: string) => {
    speakKorean(word);
    if (!selectedLeft) return;
    const item = data.items.find((it) => it.id === selectedLeft);
    if (item && item.word === word) {
      setMatched((prev) => ({ ...prev, [item.id]: word }));
      setSelectedLeft(null);
    } else {
      speakKorean('어울리는 그림을 다시 찾아보세요');
      setSelectedLeft(null);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <p className="text-sm text-gray-600 mb-4 font-bold">
        왼쪽 그림을 누른 뒤 오른쪽에서 알맞은 ‘ㅋ’ 흉내 말을 눌러 빈칸을 완성해 보세요!
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl items-center">
        {/* Left: 3 Pictures */}
        <div className="flex flex-col gap-4">
          {data.items.map((item) => {
            const done = !!matched[item.id];
            const active = selectedLeft === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (done) {
                    speakKorean(item.word);
                    return;
                  }
                  setSelectedLeft(active ? null : item.id);
                }}
                className={`flex items-center justify-between p-3.5 rounded-2xl border-3 bg-white transition-all ${
                  done
                    ? 'border-emerald-400 bg-emerald-50/40'
                    : active
                    ? 'border-amber-400 bg-amber-50 scale-[1.02] shadow'
                    : 'border-gray-200 hover:border-amber-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img src={item.image} alt={item.desc} className="w-16 h-16 object-contain" />
                  <span className="text-xs sm:text-sm font-bold text-gray-600 text-left">{item.desc}</span>
                </div>
                <span
                  className={`w-5 h-5 rounded-full ${
                    done ? 'bg-emerald-500' : active ? 'bg-amber-500 animate-ping' : 'bg-gray-300'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Right: 3 Word Boxes */}
        <div className="flex flex-col gap-4">
          {data.choices.map((word) => {
            const isUsed = Object.values(matched).includes(word);
            return (
              <button
                key={word}
                type="button"
                onClick={() => handleRightTap(word)}
                className={`flex items-center justify-between p-4 rounded-2xl border-3 transition-all ${
                  isUsed
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                    : 'border-gray-300 bg-white hover:bg-amber-50 text-gray-800'
                }`}
              >
                <span className={`w-4 h-4 rounded-full ${isUsed ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                <div className="flex items-center gap-1.5">
                  {word.split('').map((ch, idx) => (
                    <span
                      key={idx}
                      className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-2xl font-black ${
                        isUsed
                          ? 'border-emerald-500 bg-white text-blue-600'
                          : 'border-gray-800 bg-amber-50/40 text-gray-800'
                      }`}
                    >
                      {ch}
                    </span>
                  ))}
                </div>
                <span className="text-lg">🔊</span>
              </button>
            );
          })}
        </div>
      </div>

      {allDone && (
        <div className="mt-5 px-5 py-2 rounded-xl bg-emerald-500 text-white font-black text-sm shadow animate-bounce">
          🎉 콩콩 · 킁킁 · 쿨쿨! ㅋ 흉내 말을 모두 완성했어요!
        </div>
      )}
    </div>
  );
};

// ─── 6. ㄴ Ring Picture Maze ─────────────────────────────────────────────────
export const ImageMazeNGame: React.FC<{
  data: Extract<Step4Data, { playType: 'image-maze-n' }>;
}> = ({ data }) => {
  const [clearedSteps, setClearedSteps] = useState<number[]>([]);
  const [wrongWord, setWrongWord] = useState<string | null>(null);

  useEffect(() => {
    setClearedSteps([]);
    setWrongWord(null);
  }, [data]);

  const nextStepIdx = clearedSteps.length;
  const allDone = clearedSteps.length === data.steps.length;

  const handleOptionClick = (stepIndex: number, word: string, isCorrect: boolean) => {
    speakKorean(word);
    if (clearedSteps.includes(stepIndex)) return;
    if (stepIndex > nextStepIdx) {
      speakKorean('순서대로 앞에서부터 이동해 보세요!');
      return;
    }
    if (isCorrect) {
      setClearedSteps((prev) => [...prev, stepIndex]);
      setWrongWord(null);
    } else {
      setWrongWord(word);
      setTimeout(() => setWrongWord(null), 700);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative w-full max-w-2xl rounded-2xl overflow-hidden border-4 border-lime-300 shadow-md bg-white">
        <img src={data.mazeImage} alt="ㄴ 미로" className="w-full h-auto block select-none" />

        {data.steps.map((st) =>
          st.options.map((opt) => {
            const isCleared = clearedSteps.includes(st.stepIndex) && opt.isCorrect;
            const isCurrentTarget = st.stepIndex === nextStepIdx;
            const isWrong = wrongWord === opt.word;

            return (
              <button
                key={`${st.stepIndex}-${opt.word}`}
                type="button"
                onClick={() => handleOptionClick(st.stepIndex, opt.word, opt.isCorrect)}
                style={{ left: `${opt.xPct}%`, top: `${opt.yPct}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 px-2.5 py-1 rounded-full font-black text-xs sm:text-sm border-2 shadow transition-all ${
                  isCleared
                    ? 'bg-emerald-500 text-white border-white scale-110 ring-4 ring-emerald-300'
                    : isWrong
                    ? 'bg-rose-500 text-white border-white animate-bounce'
                    : isCurrentTarget
                    ? 'bg-amber-400/95 hover:bg-amber-500 text-amber-950 border-white animate-pulse'
                    : 'bg-white/90 hover:bg-white text-gray-700 border-lime-400'
                }`}
              >
                {isCleared ? `✓ ${opt.word}` : opt.word}
              </button>
            );
          })
        )}
      </div>

      {/* Breadcrumb Trail */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm font-extrabold">
        <span className="px-3 py-1 rounded-full bg-lime-100 text-lime-800">출발 ↓</span>
        {['나비', '너구리', '노래', '누룽지'].map((w, idx) => (
          <React.Fragment key={w}>
            <span className="text-gray-400">→</span>
            <span
              className={`px-3 py-1 rounded-full border ${
                clearedSteps.includes(idx)
                  ? 'bg-emerald-500 text-white border-emerald-600'
                  : 'bg-gray-100 text-gray-400 border-gray-200'
              }`}
            >
              {clearedSteps.includes(idx) ? w : '?'}
            </span>
          </React.Fragment>
        ))}
        <span className="text-gray-400">→</span>
        <span className={`px-3 py-1 rounded-full ${allDone ? 'bg-rose-500 text-white animate-bounce' : 'bg-gray-100 text-gray-400'}`}>
          도착! 🏁
        </span>
      </div>
    </div>
  );
};

// ─── 7. ㅁ Corridor Maze ─────────────────────────────────────────────────────
export const CorridorMazeMGame: React.FC<{
  data: Extract<Step4Data, { playType: 'corridor-maze-m' }>;
}> = ({ data }) => {
  const [cleared, setCleared] = useState<number[]>([]);
  const [wrongWord, setWrongWord] = useState<string | null>(null);

  useEffect(() => {
    setCleared([]);
    setWrongWord(null);
  }, [data]);

  const currentStep = cleared.length;
  const allDone = cleared.length === data.checkpoints.length;

  const handlePick = (stepIdx: number, word: string, isCorrect: boolean) => {
    speakKorean(word);
    if (cleared.includes(stepIdx)) return;
    if (stepIdx > currentStep) {
      speakKorean('출발 깃발부터 차례대로 길을 찾아가 보세요!');
      return;
    }
    if (isCorrect) {
      setCleared((prev) => [...prev, stepIdx]);
      setWrongWord(null);
    } else {
      setWrongWord(word);
      setTimeout(() => setWrongWord(null), 700);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative w-full max-w-2xl rounded-2xl overflow-hidden border-4 border-emerald-300 shadow-md bg-white">
        <img src={data.mazeImage} alt="ㅁ 미로" className="w-full h-auto block select-none" />

        {data.checkpoints.map((cp) => {
          const isStepDone = cleared.includes(cp.stepIndex);
          const isActive = cp.stepIndex === currentStep;
          return (
            <React.Fragment key={cp.stepIndex}>
              {/* Correct Bubble */}
              <button
                type="button"
                onClick={() => handlePick(cp.stepIndex, cp.correct.word, true)}
                style={{ left: `${cp.correct.xPct}%`, top: `${cp.correct.yPct}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-black border-2 transition-all ${
                  isStepDone
                    ? 'bg-emerald-500 text-white border-white ring-4 ring-emerald-300 scale-110'
                    : isActive
                    ? 'bg-yellow-300/95 text-gray-900 border-amber-600 animate-pulse shadow'
                    : 'bg-white/80 hover:bg-yellow-100 text-gray-800 border-gray-400'
                }`}
              >
                {isStepDone ? `✓ ${cp.correct.word}` : cp.correct.word}
              </button>

              {/* Wrong Bubble */}
              <button
                type="button"
                onClick={() => handlePick(cp.stepIndex, cp.wrong.word, false)}
                style={{ left: `${cp.wrong.xPct}%`, top: `${cp.wrong.yPct}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-black border-2 transition-all ${
                  wrongWord === cp.wrong.word
                    ? 'bg-rose-500 text-white border-white animate-bounce'
                    : isActive
                    ? 'bg-yellow-300/95 text-gray-900 border-amber-600 animate-pulse shadow'
                    : 'bg-white/80 hover:bg-rose-50 text-gray-800 border-gray-400'
                }`}
              >
                {cp.wrong.word}
              </button>
            </React.Fragment>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 text-xs sm:text-sm font-extrabold">
        <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900">🚩 출발</span>
        {data.checkpoints.map((cp) => (
          <React.Fragment key={cp.stepIndex}>
            <span className="text-gray-400">→</span>
            <span
              className={`px-2.5 py-1 rounded-full ${
                cleared.includes(cp.stepIndex) ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400'
              }`}
            >
              {cleared.includes(cp.stepIndex) ? cp.correct.word : '?'}
            </span>
          </React.Fragment>
        ))}
        <span className="text-gray-400">→</span>
        <span className={`px-2.5 py-1 rounded-full ${allDone ? 'bg-sky-600 text-white animate-bounce' : 'bg-gray-100 text-gray-400'}`}>
          🏁 도착!
        </span>
      </div>
    </div>
  );
};

// ─── 8. ㅌ Interactive Board Game (주사위 + 가위바위보) ────────────────────────
const BOARD_COLORS = [
  'bg-orange-400 text-white',
  'bg-lime-500 text-white',
  'bg-pink-500 text-white',
  'bg-sky-500 text-white',
  'bg-amber-400 text-gray-900',
  'bg-purple-500 text-white',
];

export const BoardGameT: React.FC<{
  data: Extract<Step4Data, { playType: 'board-game-t' }>;
}> = ({ data }) => {
  const [pos, setPos] = useState(0);
  const [prevPos, setPrevPos] = useState(0);
  const [pendingRead, setPendingRead] = useState(false);
  const [lastMoveMsg, setLastMoveMsg] = useState('주사위를 굴리거나 가위·바위·보 버튼을 눌러 출발해 보세요!');
  const [diceNum, setDiceNum] = useState<number | null>(null);

  useEffect(() => {
    setPos(0);
    setPrevPos(0);
    setPendingRead(false);
    setDiceNum(null);
  }, [data]);

  const maxIdx = data.cells.length - 1;
  const finished = pos >= maxIdx && !pendingRead;

  const moveSteps = (steps: number, label: string) => {
    if (pendingRead || finished) return;
    setPrevPos(pos);
    const next = Math.min(maxIdx, pos + steps);
    setPos(next);
    const landedWord = data.cells[next].replace('도착(', '').replace(')', '');
    setLastMoveMsg(`${label} → ${steps}칸 전진! ‘${landedWord}’ 칸에 도착했어요. 큰 소리로 읽어 보세요!`);
    setPendingRead(true);
    speakKorean(landedWord);
  };

  const rollDice = () => {
    const n = Math.floor(Math.random() * 4) + 1; // 1~4칸으로 적당한 호흡 유지
    setDiceNum(n);
    moveSteps(n, `🎲 주사위 ${n}`);
  };

  const confirmReadSuccess = () => {
    const landedWord = data.cells[pos].replace('도착(', '').replace(')', '');
    speakKorean(`참 잘 읽었어요! ${landedWord}`);
    setPendingRead(false);
    if (pos >= maxIdx) {
      setLastMoveMsg('🎉 와아! 말판 끝 투구 칸까지 완주했어요!');
    } else {
      setLastMoveMsg('잘 읽었어요! 다음 차례를 진행해 보세요.');
    }
  };

  const handleReadRetry = () => {
    setPos(prevPos);
    setPendingRead(false);
    setLastMoveMsg('이전 자리로 한 번 돌아갔어요. 다시 도전해 볼까요?');
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="bg-sky-100/80 border-2 border-sky-300 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-sky-950 font-bold mb-4 max-w-3xl text-center">
        {data.ruleText}
      </div>

      {/* Controls: Dice + Rock-Paper-Scissors */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 mb-4">
        <button
          type="button"
          disabled={pendingRead || finished}
          onClick={rollDice}
          className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-black text-sm shadow flex items-center gap-1.5"
        >
          <span>🎲 주사위 던지기</span>
          {diceNum && <span className="bg-white text-indigo-800 px-2 rounded-full text-xs">{diceNum}</span>}
        </button>

        <button
          type="button"
          disabled={pendingRead || finished}
          onClick={() => moveSteps(3, '✌️ 가위')}
          className="px-3.5 py-2.5 rounded-2xl bg-pink-500 hover:bg-pink-600 disabled:opacity-40 text-white font-black text-sm shadow"
        >
          ✌️ 가위 (+3칸)
        </button>
        <button
          type="button"
          disabled={pendingRead || finished}
          onClick={() => moveSteps(2, '✊ 바위')}
          className="px-3.5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white font-black text-sm shadow"
        >
          ✊ 바위 (+2칸)
        </button>
        <button
          type="button"
          disabled={pendingRead || finished}
          onClick={() => moveSteps(1, '🖐️ 보')}
          className="px-3.5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white font-black text-sm shadow"
        >
          🖐️ 보 (+1칸)
        </button>

        {finished && (
          <button
            type="button"
            onClick={() => {
              setPos(0);
              setPrevPos(0);
              setPendingRead(false);
              setLastMoveMsg('새 게임을 시작해요!');
            }}
            className="px-4 py-2.5 rounded-2xl bg-gray-700 text-white font-black text-sm"
          >
            🔄 다시 놀이하기
          </button>
        )}
      </div>

      {/* Reading Check Prompt Modal Banner */}
      {pendingRead && (
        <div className="mb-4 p-4 rounded-2xl bg-amber-50 border-3 border-amber-400 shadow-md flex flex-wrap items-center justify-center gap-3 animate-pulse">
          <span className="text-lg font-black text-amber-950">
            도착 글자: 「<span className="text-2xl text-rose-600">{data.cells[pos]}</span>」
          </span>
          <button
            type="button"
            onClick={() => speakKorean(data.cells[pos].replace('도착(', '').replace(')', ''))}
            className="px-3 py-1.5 rounded-xl bg-sky-500 text-white font-bold text-xs"
          >
            🔊 발음 듣기
          </button>
          <button
            type="button"
            onClick={confirmReadSuccess}
            className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow"
          >
            🗣️ 바르게 읽었어요! (통과)
          </button>
          <button
            type="button"
            onClick={handleReadRetry}
            className="px-3 py-1.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-xs"
          >
            이전 칸으로
          </button>
        </div>
      )}

      {!pendingRead && (
        <div className="mb-3 text-sm font-extrabold text-indigo-900">{lastMoveMsg}</div>
      )}

      {/* Winding S-Board Grid (5 cols x 4 rows) */}
      <div className="grid grid-cols-5 gap-2 sm:gap-3 w-full max-w-3xl bg-white p-4 rounded-3xl border-4 border-amber-200 shadow-inner">
        {data.cells.map((word, idx) => {
          const isHere = pos === idx;
          const colorCls = BOARD_COLORS[idx % BOARD_COLORS.length];
          return (
            <button
              key={`${idx}-${word}`}
              type="button"
              onClick={() => speakKorean(word.replace('도착(', '').replace(')', ''))}
              className={`relative h-16 sm:h-20 rounded-2xl font-black text-sm sm:text-lg flex flex-col items-center justify-center shadow transition-transform ${colorCls} ${
                isHere ? 'ring-4 ring-gray-900 scale-105 z-10' : 'opacity-90 hover:opacity-100'
              }`}
            >
              <span className="text-[10px] opacity-80 font-bold">#{idx + 1}</span>
              <span>{word}</span>
              {isHere && (
                <span className="absolute -top-3 -right-2 text-2xl drop-shadow animate-bounce">
                  👹
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ─── 9. ㄹ Hidden Objects Scene ──────────────────────────────────────────────
export const HiddenObjectsRGame: React.FC<{
  data: Extract<Step4Data, { playType: 'hidden-objects-r' }>;
}> = ({ data }) => {
  const [foundIds, setFoundIds] = useState<string[]>([]);
  const [hintTargetId, setHintTargetId] = useState<string | null>(null);

  useEffect(() => {
    setFoundIds([]);
    setHintTargetId(null);
  }, [data]);

  const allDone = foundIds.length === data.targets.length;

  const handleZoneFound = (id: string, word: string) => {
    speakKorean(word);
    if (!foundIds.includes(id)) {
      setFoundIds((prev) => [...prev, id]);
    }
    if (hintTargetId === id) {
      setHintTargetId(null);
    }
  };

  const triggerHint = () => {
    const nextUnfound = data.targets.find((t) => !foundIds.includes(t.id));
    if (!nextUnfound) return;
    setHintTargetId(nextUnfound.id);
    speakKorean(`${nextUnfound.word} 그림이 어디 숨어 있을까요?`);
    setTimeout(() => setHintTargetId(null), 2500);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative w-full max-w-3xl rounded-2xl overflow-hidden border-4 border-amber-300 shadow-lg bg-amber-50">
        <img src={data.sceneImage} alt="ㄹ 숨은그림찾기" className="w-full h-auto block select-none" />

        {data.targets.map((target) => {
          const isFound = foundIds.includes(target.id);
          const isHint = hintTargetId === target.id;
          return target.zones.map((z, zIdx) => (
            <button
              key={`${target.id}-${zIdx}`}
              type="button"
              onClick={() => handleZoneFound(target.id, target.word)}
              style={{
                left: `${z.xPct}%`,
                top: `${z.yPct}%`,
                width: `${z.wPct}%`,
                height: `${z.hPct}%`,
              }}
              aria-label={target.word}
              className={`absolute rounded-full transition-all ${
                isFound && zIdx === 0
                  ? 'border-4 border-rose-500 bg-rose-500/15 shadow-md'
                  : isHint && zIdx === 0
                  ? 'border-4 border-yellow-400 bg-yellow-300/35 animate-ping'
                  : 'bg-transparent hover:bg-white/10'
              }`}
            >
              {isFound && zIdx === 0 && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-rose-600 text-white text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full whitespace-nowrap shadow">
                  {target.word}
                </span>
              )}
            </button>
          ));
        })}
      </div>

      {/* Checklist Bar */}
      <div className="mt-4 w-full max-w-3xl bg-stone-100 border-2 border-stone-300 rounded-2xl p-3.5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs sm:text-sm font-black text-stone-700">
            &lt;숨은 그림&gt; 찾은 개수: {foundIds.length} / {data.targets.length}개
          </span>
          {!allDone && (
            <button
              type="button"
              onClick={triggerHint}
              className="px-3 py-1 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs shadow-sm"
            >
              🔍 위치 힌트 보기
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {data.targets.map((target) => {
            const done = foundIds.includes(target.id);
            return (
              <button
                key={target.id}
                type="button"
                onClick={() => speakKorean(target.word)}
                className={`px-3 py-1.5 rounded-xl font-black text-sm border flex items-center gap-1.5 transition-all ${
                  done
                    ? 'bg-emerald-500 text-white border-emerald-600'
                    : 'bg-white text-gray-800 border-gray-300 hover:border-amber-400'
                }`}
              >
                <span>{done ? '✓' : '🔎'}</span>
                <span>{target.word}</span>
              </button>
            );
          })}
        </div>
      </div>

      {allDone && (
        <div className="mt-4 px-5 py-2 rounded-xl bg-emerald-500 text-white font-black text-sm shadow animate-bounce">
          🎉 대단해요! 방 안에 숨어 있던 ‘ㄹ’ 그림 10개를 모두 찾았어요!
        </div>
      )}
    </div>
  );
};

// ─── 10. ㅂ Rebus Picture Sentences ──────────────────────────────────────────
export const RebusSentencesBGame: React.FC<{
  data: Extract<Step4Data, { playType: 'rebus-sentences-b' }>;
}> = ({ data }) => {
  const [readSentences, setReadSentences] = useState<Record<string, boolean>>({});

  return (
    <div className="w-full flex flex-col items-center gap-4 max-w-3xl">
      <p className="text-xs sm:text-sm text-gray-600 font-bold">
        그림을 누르면 낱말 뜻과 소리가 나오고, 오른쪽 🔊 버튼을 누르면 문장 전체를 읽어 주어요!
      </p>

      {data.sentences.map((sent, idx) => {
        const isRead = !!readSentences[sent.id];
        return (
          <div
            key={sent.id}
            className={`w-full p-4 sm:p-5 rounded-2xl border-2 bg-white shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 transition-all ${
              isRead ? 'border-emerald-400 bg-emerald-50/30' : 'border-purple-200'
            }`}
          >
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 text-xl sm:text-2xl font-extrabold text-gray-800 leading-relaxed">
              <span className="w-7 h-7 rounded-full bg-purple-100 text-purple-800 text-xs font-black flex items-center justify-center mr-1">
                {idx + 1}
              </span>
              {sent.segments.map((seg, sIdx) => {
                if (seg.kind === 'text') {
                  return <span key={sIdx}>{seg.text}</span>;
                }
                return (
                  <button
                    key={sIdx}
                    type="button"
                    onClick={() => speakKorean(`${seg.word}. ${seg.meaningHint || ''}`)}
                    title={seg.meaningHint}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 border-2 border-amber-300 text-indigo-900 shadow-sm transition-transform hover:scale-105"
                  >
                    <img src={seg.image} alt={seg.word} className="w-9 h-9 sm:w-11 sm:h-11 object-contain rounded" />
                    <span className="font-black text-blue-700">{seg.word}</span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => {
                speakKorean(sent.fullAudioText, 0.85);
                setReadSentences((prev) => ({ ...prev, [sent.id]: true }));
              }}
              className={`shrink-0 px-4 py-2.5 rounded-xl font-black text-sm shadow flex items-center gap-1.5 ${
                isRead
                  ? 'bg-emerald-500 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              <span>🔊</span>
              <span>{isRead ? '읽기 완료 ✓' : '문장 듣기'}</span>
            </button>
          </div>
        );
      })}
    </div>
  );
};

// ─── 11. ㅅ Minimal-Pair Circle Quiz ─────────────────────────────────────────
export const MinimalPairCircleSGame: React.FC<{
  data: Extract<Step4Data, { playType: 'minimal-pair-circle-s' }>;
}> = ({ data }) => {
  const [picked, setPicked] = useState<Record<string, string>>({});
  const [wrongKey, setWrongKey] = useState<string | null>(null);

  useEffect(() => {
    setPicked({});
  }, [data]);

  const allDone = data.items.every((it) => picked[it.id] === it.answer);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-3xl">
        {data.items.map((item) => {
          const solved = picked[item.id] === item.answer;
          return (
            <div
              key={item.id}
              className={`flex items-center justify-between p-4 rounded-2xl border-2 bg-white shadow-sm ${
                solved ? 'border-emerald-400 bg-emerald-50/30' : 'border-teal-200'
              }`}
            >
              <button
                type="button"
                onClick={() => speakKorean(item.fullWord)}
                className="flex flex-col items-center shrink-0 mr-3"
              >
                <img src={item.image} alt={item.fullWord} className="w-20 h-20 object-contain" />
                <span className="text-[11px] font-bold text-teal-700 mt-1">🔊 듣기</span>
              </button>

              <div className="flex items-center justify-center gap-1 text-xl sm:text-2xl font-black text-gray-800">
                {item.prefix && <span>{item.prefix}</span>}
                <span className="text-gray-400">(</span>
                {item.options.map((opt) => {
                  const isSelected = picked[item.id] === opt;
                  const isWrong = wrongKey === `${item.id}-${opt}`;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        speakKorean(opt);
                        if (opt === item.answer) {
                          setPicked((prev) => ({ ...prev, [item.id]: opt }));
                          setTimeout(() => speakKorean(item.fullWord), 350);
                        } else {
                          setWrongKey(`${item.id}-${opt}`);
                          setTimeout(() => setWrongKey(null), 600);
                        }
                      }}
                      className={`relative w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                        isSelected
                          ? 'text-rose-700 bg-rose-50 scale-110'
                          : isWrong
                          ? 'bg-rose-100 text-rose-500'
                          : 'hover:bg-amber-100 text-gray-800'
                      }`}
                    >
                      <span>{opt}</span>
                      {isSelected && (
                        <span className="pointer-events-none absolute inset-0.5 rounded-full border-4 border-rose-500" />
                      )}
                    </button>
                  );
                })}
                <span className="text-gray-400">)</span>
                {item.suffix && <span>{item.suffix}</span>}
              </div>
            </div>
          );
        })}
      </div>

      {allDone && (
        <div className="mt-5 px-5 py-2 rounded-xl bg-emerald-500 text-white font-black text-sm shadow animate-bounce">
          🎉 소 · 박수 · 씨앗 · 눈썰매! 소리를 정확히 구별했어요!
        </div>
      )}
    </div>
  );
};

// ─── 12. ㅊ Balloon Story Expressions ────────────────────────────────────────
const BALLOON_BOX_POSITIONS = [
  { left: '16.5%', top: '34%', rotate: '-26deg' },
  { left: '32.5%', top: '24.5%', rotate: '-13deg' },
  { left: '50%', top: '21.5%', rotate: '0deg' },
  { left: '67.5%', top: '24.5%', rotate: '13deg' },
  { left: '83.5%', top: '34%', rotate: '26deg' },
];

export const BalloonStoryChGame: React.FC<{
  data: Extract<Step4Data, { playType: 'balloon-story-ch' }>;
}> = ({ data }) => {
  const [filledBalloons, setFilledBalloons] = useState<string[]>([]);
  const [wrongChip, setWrongChip] = useState<string | null>(null);

  useEffect(() => {
    setFilledBalloons([]);
    setWrongChip(null);
  }, [data]);

  const allDone = filledBalloons.length === data.correctExpressions.length;

  const handleSelectWord = (word: string) => {
    speakKorean(word);
    if (filledBalloons.includes(word)) return;
    if (data.correctExpressions.includes(word)) {
      setFilledBalloons((prev) => [...prev, word]);
    } else {
      setWrongChip(word);
      speakKorean('그 낱말에는 ㅊ이 들어 있지 않아요!');
      setTimeout(() => setWrongChip(null), 650);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* 5 Hot-Air Balloons Scene */}
      <div className="relative w-full max-w-2xl rounded-2xl overflow-hidden border-4 border-sky-300 shadow-lg bg-sky-100">
        <img
          src={data.balloonImage}
          alt="열기구 풍선 5개"
          className={`w-full h-auto block select-none transition-transform duration-700 ${
            allDone ? '-translate-y-1 scale-[1.01]' : ''
          }`}
        />

        {BALLOON_BOX_POSITIONS.map((pos, idx) => {
          const text = filledBalloons[idx];
          return (
            <div
              key={idx}
              style={{
                left: pos.left,
                top: pos.top,
                transform: `translate(-50%, -50%) rotate(${pos.rotate})`,
              }}
              className="absolute w-[17%] h-[16%] flex items-center justify-center pointer-events-none"
            >
              {text ? (
                <span className="text-xs sm:text-lg md:text-xl font-black text-blue-700 drop-shadow-sm whitespace-nowrap">
                  {text}
                </span>
              ) : (
                <span className="text-[11px] sm:text-xs font-bold text-gray-300">#{idx + 1}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Story Excerpt Lines from Worksheet Page 12 */}
      <div className="mt-4 w-full max-w-2xl bg-amber-50/90 border-2 border-amber-200 rounded-2xl p-4 text-left space-y-1.5">
        <div className="text-xs font-extrabold text-amber-800 mb-1">
          📖 앞의 이야기 문장에서 ‘ㅊ’이 들어간 표현 5개를 찾아 아래 버튼으로 눌러보세요!
        </div>
        {data.storyLines.map((line, i) => (
          <div key={i} className="text-sm sm:text-base font-bold text-gray-800 flex items-center justify-between gap-2">
            <span>- {line}</span>
            <button
              type="button"
              onClick={() => speakKorean(line)}
              className="text-xs px-2 py-0.5 rounded bg-white border border-amber-200 text-amber-800 shrink-0"
            >
              🔊
            </button>
          </div>
        ))}
      </div>

      {/* Clickable Word Chips */}
      <div className="mt-3 flex flex-wrap justify-center gap-2 max-w-2xl">
        {data.choicesPool.map((word) => {
          const isUsed = filledBalloons.includes(word);
          const isWrong = wrongChip === word;
          return (
            <button
              key={word}
              type="button"
              onClick={() => handleSelectWord(word)}
              className={`px-4 py-2 rounded-full font-black text-sm sm:text-base border-2 transition-all ${
                isUsed
                  ? 'bg-emerald-500 text-white border-emerald-600'
                  : isWrong
                  ? 'bg-rose-500 text-white border-rose-600 animate-bounce'
                  : 'bg-white hover:bg-sky-50 text-gray-800 border-sky-300 shadow-sm'
              }`}
            >
              {isUsed ? `🎈 ${word}` : word}
            </button>
          );
        })}
      </div>

      {allDone && (
        <div className="mt-4 px-5 py-2.5 rounded-2xl bg-emerald-500 text-white font-black text-sm shadow-lg animate-bounce">
          🍬🍭 와아! 풍선 5개를 모두 채워서 맛있는 간식 바구니가 두둥실 날아왔어요!
        </div>
      )}
    </div>
  );
};

// ─── 13. ㅇ Picture Diary Completion ─────────────────────────────────────────
export const PictureDiaryNgGame: React.FC<{
  data: Extract<Step4Data, { playType: 'picture-diary-ng' }>;
}> = ({ data }) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [wrongId, setWrongId] = useState<string | null>(null);

  useEffect(() => {
    setAnswers({});
  }, [data]);

  const choiceSegments = data.segments.filter((s) => s.kind === 'choice');
  const allDone = choiceSegments.every((s) => s.kind === 'choice' && answers[s.id] === s.answer);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-3xl bg-white rounded-3xl border-4 border-gray-800 shadow-lg overflow-hidden">
        {/* Spiral Notebook Top Bar */}
        <div className="bg-stone-100 border-b-2 border-gray-800 px-5 py-3 flex items-center justify-between">
          <span className="font-black text-gray-800 text-base sm:text-lg">{data.dateLabel}</span>
          <button
            type="button"
            onClick={() => speakKorean(data.fullText, 0.85)}
            className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs sm:text-sm shadow flex items-center gap-1"
          >
            <span>🔊</span>
            <span>완성 일기 듣기</span>
          </button>
        </div>

        <div className="p-5 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          {/* Left Illustration */}
          <div className="md:col-span-5 flex justify-center">
            <img
              src={data.diaryImage}
              alt="치과 그림일기"
              className="w-full max-w-[260px] rounded-xl border-2 border-gray-200 shadow-sm"
            />
          </div>

          {/* Right Diary Text with Inline Choices */}
          <div className="md:col-span-7 text-left text-lg sm:text-xl font-bold text-gray-800 leading-loose whitespace-pre-line">
            {data.segments.map((seg, idx) => {
              if (seg.kind === 'text') {
                return <span key={idx}>{seg.text}</span>;
              }
              const solved = answers[seg.id] === seg.answer;
              return (
                <span
                  key={seg.id}
                  className="inline-flex items-center gap-1 mx-1 px-2 py-0.5 rounded-xl bg-amber-50 border border-amber-300 align-middle"
                >
                  <span className="text-gray-400 text-sm">(</span>
                  {seg.options.map((opt, oIdx) => {
                    const isPicked = answers[seg.id] === opt;
                    const isWrong = wrongId === `${seg.id}-${opt}`;
                    return (
                      <React.Fragment key={opt}>
                        {oIdx > 0 && <span className="text-gray-400 text-sm">,</span>}
                        <button
                          type="button"
                          onClick={() => {
                            speakKorean(opt);
                            if (opt === seg.answer) {
                              setAnswers((prev) => ({ ...prev, [seg.id]: opt }));
                            } else {
                              setWrongId(`${seg.id}-${opt}`);
                              setTimeout(() => setWrongId(null), 600);
                            }
                          }}
                          className={`relative px-2 py-0.5 rounded-lg font-black transition-all ${
                            isPicked
                              ? 'text-rose-700 bg-rose-50'
                              : isWrong
                              ? 'bg-rose-200 text-rose-700'
                              : solved
                              ? 'text-gray-400'
                              : 'hover:bg-amber-200 text-indigo-900'
                          }`}
                        >
                          <span>{opt}</span>
                          {isPicked && (
                            <span className="pointer-events-none absolute inset-0 rounded-full border-3 border-rose-500" />
                          )}
                        </button>
                      </React.Fragment>
                    );
                  })}
                  <span className="text-gray-400 text-sm">)</span>
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {allDone && (
        <div className="mt-5 px-5 py-2 rounded-xl bg-emerald-500 text-white font-black text-sm shadow animate-bounce">
          🎉 오후 · 의자 · 입 · 오글오글 · 잉잉! 치과 그림일기를 멋지게 완성했어요!
        </div>
      )}
    </div>
  );
};
