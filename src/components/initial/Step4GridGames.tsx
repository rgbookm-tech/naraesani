import React, { useState, useEffect } from 'react';
import { Step4Data } from '../../types/initialConsonantTypes';
import { speakKorean } from '../../utils/hangulSpeech';

// ─── 1. ㄱ Color Grid + Animal Choice ────────────────────────────────────────
export const ColorGridAnimalGame: React.FC<{
  data: Extract<Step4Data, { playType: 'color-grid-animal' }>;
}> = ({ data }) => {
  const [coloredKeys, setColoredKeys] = useState<Record<string, boolean>>({});
  const [selectedAnimal, setSelectedAnimal] = useState<string | null>(null);
  const [wrongKey, setWrongKey] = useState<string | null>(null);

  useEffect(() => {
    setColoredKeys({});
    setSelectedAnimal(null);
  }, [data]);

  const totalTargets = data.cells.reduce(
    (sum, row) => sum + row.filter((w) => data.correctWords.includes(w)).length,
    0
  );
  const coloredCount = Object.keys(coloredKeys).length;
  const gridDone = coloredCount >= totalTargets;
  const animalDone = selectedAnimal === 'dog';

  const handleCellClick = (r: number, c: number, word: string) => {
    const key = `${r}-${c}`;
    speakKorean(word);
    if (data.correctWords.includes(word)) {
      setColoredKeys((prev) => ({ ...prev, [key]: true }));
    } else {
      setWrongKey(key);
      setTimeout(() => setWrongKey(null), 500);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex flex-col lg:flex-row items-center justify-center gap-6 w-full max-w-4xl">
        {/* 4x6 Word Grid */}
        <div className="bg-amber-50/60 p-3 sm:p-4 rounded-2xl border-2 border-amber-300 shadow-sm">
          <div
            className="grid gap-1.5"
            style={{ gridTemplateColumns: `repeat(${data.cols}, minmax(0, 1fr))` }}
          >
            {data.cells.map((row, rIdx) =>
              row.map((word, cIdx) => {
                const key = `${rIdx}-${cIdx}`;
                const isColored = !!coloredKeys[key];
                const isWrong = wrongKey === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleCellClick(rIdx, cIdx, word)}
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg border-2 font-black text-lg sm:text-xl transition-all ${
                      isColored
                        ? 'bg-amber-400 border-amber-600 text-amber-950 shadow-inner scale-[1.02]'
                        : isWrong
                        ? 'bg-rose-100 border-rose-400 text-rose-700'
                        : 'bg-white hover:bg-amber-50 border-amber-200 text-gray-800'
                    }`}
                  >
                    {word}
                  </button>
                );
              })
            )}
          </div>
          <div className="mt-2.5 text-center text-xs sm:text-sm font-bold text-amber-800">
            색칠한 ‘ㄱ’ 낱말: {coloredCount} / {totalTargets}개
            {gridDone && <span className="ml-2 text-rose-600">✨ ‘개’ 글자가 나타났어요!</span>}
          </div>
        </div>

        {/* Right Side: 3 Animal Options */}
        <div className="flex flex-row lg:flex-col gap-3 items-center justify-center">
          <div className="hidden lg:block text-xs font-extrabold text-gray-500 mb-1">
            어떤 동물일까요?
          </div>
          {data.animals.map((ani) => {
            const isPicked = selectedAnimal === ani.id;
            return (
              <button
                key={ani.id}
                type="button"
                onClick={() => {
                  speakKorean(ani.name);
                  if (ani.isCorrect) {
                    setSelectedAnimal(ani.id);
                  } else {
                    speakKorean('색칠된 글자 모양을 다시 살펴보세요!');
                  }
                }}
                className={`relative p-2.5 rounded-2xl border-3 bg-white shadow-sm flex flex-col items-center transition-all ${
                  isPicked
                    ? 'border-rose-500 bg-rose-50/40 ring-4 ring-rose-200 scale-105'
                    : 'border-gray-200 hover:border-amber-400'
                }`}
              >
                <img src={ani.image} alt={ani.name} className="w-20 h-20 object-contain" />
                <span className="text-xs font-black text-gray-700 mt-1">{ani.name}</span>
                {isPicked && (
                  <span className="pointer-events-none absolute inset-1 rounded-full border-4 border-rose-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {gridDone && animalDone && (
        <div className="mt-5 px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-black text-sm shadow animate-bounce">
          🎉 정답! 색칠된 칸이 ‘개’ 글자를 만들고 있어요! (멍멍 🐶)
        </div>
      )}
    </div>
  );
};

// ─── 2. ㅍ Blue Color Grid ───────────────────────────────────────────────────
export const ColorGridBluePGame: React.FC<{
  data: Extract<Step4Data, { playType: 'color-grid-blue-p' }>;
}> = ({ data }) => {
  const [colored, setColored] = useState<Record<string, boolean>>({});
  const [wrongKey, setWrongKey] = useState<string | null>(null);

  useEffect(() => {
    setColored({});
  }, [data]);

  const totalTargets = data.correctWords.length;
  const coloredCount = Object.keys(colored).length;
  const allDone = coloredCount >= totalTargets;

  return (
    <div className="w-full flex flex-col items-center">
      <div className="bg-sky-50/70 p-4 rounded-2xl border-2 border-sky-200 shadow-sm w-full max-w-3xl">
        <div className="grid grid-cols-5 gap-2 sm:gap-2.5">
          {data.grid.map((row, rIdx) =>
            row.map((word, cIdx) => {
              const key = `${rIdx}-${cIdx}`;
              const isBlue = !!colored[key];
              const isWrong = wrongKey === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    speakKorean(word);
                    if (data.correctWords.includes(word)) {
                      setColored((prev) => ({ ...prev, [key]: true }));
                    } else {
                      setWrongKey(key);
                      setTimeout(() => setWrongKey(null), 500);
                    }
                  }}
                  className={`h-14 sm:h-16 rounded-xl border-2 font-black text-base sm:text-xl transition-all ${
                    isBlue
                      ? 'bg-sky-500 border-sky-700 text-white shadow-md scale-[1.02]'
                      : isWrong
                      ? 'bg-rose-100 border-rose-400 text-rose-700'
                      : 'bg-white hover:bg-sky-50 border-gray-300 text-gray-800'
                  }`}
                >
                  {word}
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <span className="text-sm font-extrabold text-sky-800 bg-sky-100 px-4 py-1.5 rounded-full">
          파란색으로 칠한 ㅍ 낱말: {coloredCount} / {totalTargets}개
        </span>
        {allDone && (
          <span className="px-4 py-1.5 rounded-full bg-emerald-500 text-white font-black text-sm shadow animate-bounce">
            🎉 14개 ㅍ 낱말을 모두 파랗게 색칠했어요!
          </span>
        )}
      </div>
    </div>
  );
};

// ─── 3. ㄷ & ㅈ Word Search Puzzle ───────────────────────────────────────────
export const WordSearchPuzzleGame: React.FC<{
  data: Extract<Step4Data, { playType: 'word-search-puzzle' }>;
}> = ({ data }) => {
  const [selectedCells, setSelectedCells] = useState<Array<[number, number]>>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [hintCoord, setHintCoord] = useState<string | null>(null);

  useEffect(() => {
    setSelectedCells([]);
    setFoundWords([]);
    setHintCoord(null);
  }, [data]);

  const isCellInFoundWord = (r: number, c: number) => {
    return data.solutions.some(
      (sol) =>
        foundWords.includes(sol.word) &&
        sol.coords.some(([sr, sc]) => sr === r && sc === c)
    );
  };

  const isCellSelected = (r: number, c: number) =>
    selectedCells.some(([sr, sc]) => sr === r && sc === c);

  const handleTapCell = (r: number, c: number) => {
    const alreadyIdx = selectedCells.findIndex(([sr, sc]) => sr === r && sc === c);
    let nextSelection: Array<[number, number]>;
    if (alreadyIdx > -1) {
      nextSelection = selectedCells.filter((_, idx) => idx !== alreadyIdx);
    } else {
      nextSelection = [...selectedCells, [r, c]];
    }

    // Check if nextSelection exactly matches any unfound solution (order-independent or in-order)
    const matchedSol = data.solutions.find((sol) => {
      if (foundWords.includes(sol.word)) return false;
      if (sol.coords.length !== nextSelection.length) return false;
      return sol.coords.every(([sr, sc]) =>
        nextSelection.some(([nr, nc]) => nr === sr && nc === sc)
      );
    });

    if (matchedSol) {
      setFoundWords((prev) => [...prev, matchedSol.word]);
      setSelectedCells([]);
      setHintCoord(null);
      speakKorean(matchedSol.word);
      return;
    }

    // If selection is longer than max remaining word or not a subset of any unfound word, reset to current tap
    const isPrefixSubset = data.solutions.some((sol) => {
      if (foundWords.includes(sol.word)) return false;
      return nextSelection.every(([nr, nc]) =>
        sol.coords.some(([sr, sc]) => sr === nr && sc === nc)
      );
    });

    if (!isPrefixSubset) {
      setSelectedCells([[r, c]]);
      speakKorean(data.grid[r][c]);
    } else {
      setSelectedCells(nextSelection);
      speakKorean(data.grid[r][c]);
    }
  };

  const showHint = () => {
    const unfound = data.solutions.find((sol) => !foundWords.includes(sol.word));
    if (!unfound) return;
    const [hr, hc] = unfound.coords[0];
    setHintCoord(`${hr}-${hc}`);
    speakKorean(`${unfound.word}의 첫 글자를 찾아보세요`);
    setTimeout(() => setHintCoord(null), 2200);
  };

  const cols = data.grid[0]?.length || 4;
  const allFound = foundWords.length === data.solutions.length;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Target Word Bank */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-5 bg-amber-50 border-2 border-amber-300 px-4 py-3 rounded-2xl max-w-2xl">
        <span className="text-xs font-extrabold text-amber-800 mr-1">찾을 낱말:</span>
        {data.targetWords.map((w) => {
          const done = foundWords.includes(w);
          return (
            <button
              key={w}
              type="button"
              onClick={() => speakKorean(w)}
              className={`px-3 py-1 rounded-full text-sm sm:text-base font-black border transition-all ${
                done
                  ? 'bg-emerald-500 text-white border-emerald-600 line-through'
                  : 'bg-white text-gray-800 border-amber-300 hover:bg-amber-100'
              }`}
            >
              {done ? `✓ ${w}` : w}
            </button>
          );
        })}
      </div>

      {/* Puzzle Grid */}
      <div className="bg-white p-4 rounded-2xl border-4 border-amber-300 shadow-md">
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {data.grid.map((row, rIdx) =>
            row.map((ch, cIdx) => {
              const selected = isCellSelected(rIdx, cIdx);
              const found = isCellInFoundWord(rIdx, cIdx);
              const isHint = hintCoord === `${rIdx}-${cIdx}`;
              return (
                <button
                  key={`${rIdx}-${cIdx}`}
                  type="button"
                  onClick={() => handleTapCell(rIdx, cIdx)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 font-black text-2xl sm:text-3xl transition-all relative ${
                    selected
                      ? 'bg-amber-300 border-amber-600 text-amber-950 scale-105 shadow'
                      : found
                      ? 'bg-rose-50 border-rose-500 text-rose-900'
                      : isHint
                      ? 'bg-yellow-200 border-yellow-500 animate-bounce'
                      : 'bg-amber-50/30 hover:bg-amber-50 border-amber-200 text-gray-800'
                  }`}
                >
                  {ch}
                  {found && (
                    <span className="pointer-events-none absolute inset-1.5 rounded-full border-3 border-rose-400/80" />
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <span className="text-xs sm:text-sm text-gray-600 font-bold">
          낱말을 이루는 글자 칸을 차례대로 눌러보세요! ({foundWords.length} / {data.solutions.length})
        </span>
        {!allFound && (
          <button
            type="button"
            onClick={showHint}
            className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-extrabold text-xs border border-amber-300"
          >
            💡 첫 글자 힌트
          </button>
        )}
      </div>

      {allFound && (
        <div className="mt-4 px-5 py-2 rounded-xl bg-emerald-500 text-white font-black text-sm shadow animate-bounce">
          🎉 숨어 있던 낱말 {data.solutions.length}개를 모두 찾았어요!
        </div>
      )}
    </div>
  );
};

// ─── 4. ㅎ Walled Grid Maze ──────────────────────────────────────────────────
export const WalledMazeHGame: React.FC<{
  data: Extract<Step4Data, { playType: 'walled-maze-h' }>;
}> = ({ data }) => {
  const [visited, setVisited] = useState<Array<[number, number]>>([[0, 0]]);
  const [wrongCell, setWrongCell] = useState<string | null>(null);

  useEffect(() => {
    setVisited([[0, 0]]);
    setWrongCell(null);
  }, [data]);

  const rows = data.grid.length;
  const cols = data.grid[0].length;
  const currentPos = visited[visited.length - 1];
  const isFinished =
    currentPos[0] === data.correctPath[data.correctPath.length - 1][0] &&
    currentPos[1] === data.correctPath[data.correctPath.length - 1][1];

  const isOpenBetween = (r1: number, c1: number, r2: number, c2: number) => {
    const list = data.openMoves[`${r1},${c1}`] || [];
    return list.includes(`${r2},${c2}`);
  };

  const handleStep = (r: number, c: number) => {
    const word = data.grid[r][c];
    speakKorean(word);

    // Allow clicking already visited cell to backtrack
    const existingIdx = visited.findIndex(([vr, vc]) => vr === r && vc === c);
    if (existingIdx > -1) {
      setVisited(visited.slice(0, existingIdx + 1));
      return;
    }

    const [cr, cc] = currentPos;
    const isAdjacentOpen = isOpenBetween(cr, cc, r, c);
    if (!isAdjacentOpen) {
      setWrongCell(`${r}-${c}`);
      setTimeout(() => setWrongCell(null), 500);
      return;
    }

    // Check if it is a valid 'ㅎ' word on the correct path
    const onCorrectPath = data.correctPath.some(([pr, pc]) => pr === r && pc === c);
    if (onCorrectPath) {
      setVisited((prev) => [...prev, [r, c]]);
    } else {
      setWrongCell(`${r}-${c}`);
      speakKorean(`${word}에는 히읗이 없어요!`);
      setTimeout(() => setWrongCell(null), 650);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <p className="text-xs sm:text-sm text-gray-600 font-bold mb-3">
        초록 화살표(하마)에서 출발해 벽이 열려 있는 ‘ㅎ’ 낱말 칸을 차례대로 눌러 탈출해 보세요!
      </p>

      <div className="relative bg-white p-4 rounded-2xl shadow-md border-2 border-gray-200">
        <div className="flex items-center gap-1 text-emerald-600 font-black text-sm mb-1">
          <span>➡ 출발!</span>
        </div>

        <div
          className="grid border-4 border-gray-900"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {data.grid.map((row, rIdx) =>
            row.map((word, cIdx) => {
              const isVisited = visited.some(([vr, vc]) => vr === rIdx && vc === cIdx);
              const isCurrent = currentPos[0] === rIdx && currentPos[1] === cIdx;
              const isWrong = wrongCell === `${rIdx}-${cIdx}`;

              // Determine cell inner walls
              const wallRight =
                cIdx < cols - 1 ? !isOpenBetween(rIdx, cIdx, rIdx, cIdx + 1) : !(rIdx === 3 && cIdx === 4);
              const wallBottom = rIdx < rows - 1 ? !isOpenBetween(rIdx, cIdx, rIdx + 1, cIdx) : true;
              const wallLeft = cIdx === 0 ? !(rIdx === 0 && cIdx === 0) : false;

              return (
                <button
                  key={`${rIdx}-${cIdx}`}
                  type="button"
                  onClick={() => handleStep(rIdx, cIdx)}
                  className={`w-16 h-16 sm:w-24 sm:h-20 flex items-center justify-center font-black text-sm sm:text-lg transition-all relative ${
                    isCurrent
                      ? 'bg-emerald-400 text-emerald-950'
                      : isVisited
                      ? 'bg-emerald-100 text-emerald-900'
                      : isWrong
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-white hover:bg-amber-50 text-gray-800'
                  }`}
                  style={{
                    borderRight: wallRight ? '4px solid #111827' : '1px dashed #d1d5db',
                    borderBottom: wallBottom ? '4px solid #111827' : '1px dashed #d1d5db',
                    borderLeft: cIdx === 0 && !wallLeft ? '4px solid #10b981' : undefined,
                  }}
                >
                  <span>{word}</span>
                  {isCurrent && <span className="ml-1 text-base">🏃</span>}
                </button>
              );
            })
          )}
        </div>

        <div className="flex justify-end items-center gap-1 text-rose-600 font-black text-sm mt-1">
          <span>탈출 성공! ➡🏁</span>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setVisited([[0, 0]])}
          className="px-4 py-1.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-xs"
        >
          처음부터 다시 가기
        </button>
        {isFinished && (
          <span className="px-5 py-2 rounded-xl bg-emerald-500 text-white font-black text-sm shadow animate-bounce">
            🎉 하마 → 호수 → 해바라기 → 휴지 → 허리 → 혀 → 호루라기 → 하품! 미로 탈출 성공!
          </span>
        )}
      </div>
    </div>
  );
};
