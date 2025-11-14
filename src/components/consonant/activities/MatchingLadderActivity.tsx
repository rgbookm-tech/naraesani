import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { MatchingLadderActivity } from '../../types';
import { playSound, SoundType } from '../../../utils/sound';

interface MatchingLadderActivityProps {
  activity: MatchingLadderActivity;
}

const MatchingLadderActivityComponent: React.FC<MatchingLadderActivityProps> = ({ activity }) => {
  const [selectedTop, setSelectedTop] = useState<string | null>(null);
  const [selectedBottom, setSelectedBottom] = useState<string | null>(null);
  const [completedPairs, setCompletedPairs] = useState<Set<string>>(new Set());
  const [lines, setLines] = useState<{ startId: string; endId: string }[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  const drawLines = useCallback(() => {
    const newLines = [];
    for (const topWord of completedPairs) {
      const bottomWord = activity.matches[topWord];
      if (bottomWord) {
        newLines.push({ startId: `top-${topWord}`, endId: `bottom-${bottomWord}` });
      }
    }
    setLines(newLines);
  }, [completedPairs, activity.matches]);

  useEffect(() => {
    window.addEventListener('resize', drawLines);
    return () => window.removeEventListener('resize', drawLines);
  }, [drawLines]);

  useEffect(() => {
    setCompletedPairs(new Set());
    setSelectedTop(null);
    setSelectedBottom(null);
  }, [activity]);

  useEffect(() => {
    if (selectedTop && selectedBottom) {
      if (activity.matches[selectedTop] === selectedBottom) {
        playSound(SoundType.SUCCESS);
        setCompletedPairs(prev => new Set(prev).add(selectedTop));
      } else {
        playSound(SoundType.INCORRECT);
      }
      setTimeout(() => {
        setSelectedTop(null);
        setSelectedBottom(null);
      }, 300);
    }
  }, [selectedTop, selectedBottom, activity.matches]);

  useEffect(() => {
    drawLines();
  }, [completedPairs, drawLines]);

  const handleTopClick = (word: string) => {
    playSound(SoundType.CLICK);
    if (!completedPairs.has(word)) setSelectedTop(word);
  };

  const handleBottomClick = (word: string) => {
    playSound(SoundType.CLICK);
    if (
      !Object.values(activity.matches).includes(word) ||
      !completedPairs.has(Object.keys(activity.matches).find(key => activity.matches[key] === word)!)
    ) {
      setSelectedBottom(word);
    }
  };

  // 중앙 좌표로 선이 그려지도록 offset 기준으로 수정
  const getCoords = (id: string) => {
    const el = itemRefs.current[id];
    const container = containerRef.current;
    if (!el || !container) return { x: 0, y: 0 };
    const x = el.offsetLeft + el.offsetWidth / 2;
    const y = el.offsetTop + el.offsetHeight / 2;
    return { x, y };
  };

  const lineCoords = lines.map(line => {
    const start = getCoords(line.startId);
    const end = getCoords(line.endId);
    return { x1: start.x, y1: start.y, x2: end.x, y2: end.y };
  });

  // SVG 높이 동적으로 설정
  const svgHeight = containerRef.current?.offsetHeight || 400;

  return (
    <div>
      <h3 className="text-xl font-semibold mb-6 text-gray-700">
        <span className="bg-orange-200 text-orange-800 text-lg font-bold mr-2 px-2.5 py-0.5 rounded-full">
          {activity.activityNumber}
        </span>
        {activity.question}
      </h3>
      <div className="relative flex flex-col space-y-24" ref={containerRef}>
        {/* Top Row */}
        <div className="flex justify-around">
          {activity.topRow.map(word => (
            <button
              key={`top-${word}`}
              ref={el => {
                itemRefs.current[`top-${word}`] = el;
              }}
              onClick={() => handleTopClick(word)}
              className={`p-4 w-24 text-center text-xl font-bold rounded-lg border-2 transition-all ${
                completedPairs.has(word)
                  ? 'bg-green-200 border-green-400'
                  : selectedTop === word
                  ? 'bg-orange-200 border-orange-400 scale-105'
                  : 'bg-white hover:bg-lime-100 border-gray-300'
              }`}
            >
              {word}
            </button>
          ))}
        </div>

        {/* Bottom Row */}
        <div className="flex justify-around">
          {activity.bottomRow.map(word => (
            <button
              key={`bottom-${word}`}
              ref={el => {
                itemRefs.current[`bottom-${word}`] = el;
              }}
              onClick={() => handleBottomClick(word)}
              className={`p-4 w-24 text-center text-xl font-bold rounded-lg border-2 transition-all ${
                Object.values(activity.matches).includes(word) &&
                completedPairs.has(
                  Object.keys(activity.matches).find(key => activity.matches[key] === word)!
                )
                  ? 'bg-green-200 border-green-400'
                  : selectedBottom === word
                  ? 'bg-orange-200 border-orange-400 scale-105'
                  : 'bg-white hover:bg-lime-100 border-gray-300'
              }`}
            >
              {word}
            </button>
          ))}
        </div>

        <svg
          className="absolute bottom-3 left-0 w-full pointer-events-none"
          height={svgHeight}
          style={{ height: svgHeight }}
        >
          {lineCoords.map((coords, i) => (
            <path
              key={`path-${i}`}
              d={`M ${coords.x1} ${coords.y1} C ${coords.x1} ${(coords.y1 + coords.y2) / 2}, ${coords.x2} ${(coords.y1 + coords.y2) / 2}, ${coords.x2} ${coords.y2}`}
              stroke="#a3e635"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
            />
          ))}
        </svg>
      </div>
    </div>
  );
};

export default MatchingLadderActivityComponent;