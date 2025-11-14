import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { ConnectTextPairsActivity } from '../../types';
import { playSound, SoundType } from '../../../utils/sound';

interface ConnectTextPairsActivityProps {
  activity: ConnectTextPairsActivity;
}

const ConnectTextPairsActivityComponent: React.FC<ConnectTextPairsActivityProps> = ({ activity }) => {
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [selectedRight, setSelectedRight] = useState<number | null>(null);
  const [completedPairs, setCompletedPairs] = useState<Set<number>>(new Set());
  const [lines, setLines] = useState<{ startId: string; endId: string }[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  const drawLines = useCallback(() => {
    const newLines = [];
    for (const pairId of completedPairs) {
      newLines.push({ startId: `left-${pairId}`, endId: `right-${pairId}` });
    }
    setLines(newLines);
  }, [completedPairs]);

  useEffect(() => {
    window.addEventListener('resize', drawLines);
    return () => window.removeEventListener('resize', drawLines);
  }, [drawLines]);

  useEffect(() => {
    setCompletedPairs(new Set());
    setSelectedLeft(null);
    setSelectedRight(null);
    setLines([]);
  }, [activity]);

  useEffect(() => {
    if (selectedLeft !== null && selectedRight !== null) {
      if (selectedLeft === selectedRight) {
        playSound(SoundType.SUCCESS);
        setCompletedPairs(prev => {
          const newSet = new Set(prev);
          newSet.add(selectedLeft);
          return newSet;
        });
      } else {
        playSound(SoundType.INCORRECT);
      }
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 300);
    }
  }, [selectedLeft, selectedRight]);

  useEffect(() => {
    drawLines();
  }, [completedPairs, drawLines]);

  const handleLeftClick = (id: number) => {
    playSound(SoundType.CLICK);
    if (!completedPairs.has(id)) setSelectedLeft(id);
  };

  const handleRightClick = (id: number) => {
    playSound(SoundType.CLICK);
    if (!completedPairs.has(id)) setSelectedRight(id);
  };
  
  const getCoords = (id: string) => {
    const el = itemRefs.current[id];
    const container = containerRef.current;
    if (!el || !container) return { x: 0, y: 0 };
    const containerRect = container.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const x = elRect.left + elRect.width / 2 - containerRect.left;
    const y = elRect.top + elRect.height / 2 - containerRect.top;
    return { x, y };
  };

  const lineCoords = lines.map(line => {
    const start = getCoords(line.startId);
    const end = getCoords(line.endId);
    return { x1: start.x, y1: start.y, x2: end.x, y2: end.y };
  });

  // Create a shuffled version of the right-side pairs for display
  const shuffledRightPairs = React.useMemo(() => 
    [...activity.pairs].sort(() => Math.random() - 0.5), 
  [activity.pairs]);

  return (
    <div>
      <h3 className="text-xl font-semibold mb-6 text-gray-700">
        <span className="bg-orange-200 text-orange-800 text-lg font-bold mr-2 px-2.5 py-0.5 rounded-full">{activity.activityNumber}</span>
        {activity.question}
      </h3>
      <div className="relative" ref={containerRef}>
        <div className="flex justify-between items-center">
          {/* Left Column */}
          <div className="w-2/5 space-y-4">
            {activity.pairs.map(pair => (
              <button
                key={`left-${pair.id}`}
                ref={el => { itemRefs.current[`left-${pair.id}`] = el; }}
                onClick={() => handleLeftClick(pair.id)}
                className={`w-full p-4 text-xl font-bold rounded-lg border-2 transition-all ${
                  completedPairs.has(pair.id) ? 'bg-green-200 border-green-400' :
                  selectedLeft === pair.id ? 'bg-orange-200 border-orange-400 scale-105' :
                  'bg-white hover:bg-lime-100 border-gray-300'
                }`}
              >
                {pair.left}
              </button>
            ))}
          </div>
          
          {/* Right Column */}
          <div className="w-2/5 space-y-4">
            {shuffledRightPairs.map(pair => (
              <button
                key={`right-${pair.id}`}
                ref={el => { itemRefs.current[`right-${pair.id}`] = el; }}
                onClick={() => handleRightClick(pair.id)}
                className={`w-full p-4 text-xl font-bold rounded-lg border-2 transition-all ${
                  completedPairs.has(pair.id) ? 'bg-green-200 border-green-400' :
                  selectedRight === pair.id ? 'bg-orange-200 border-orange-400 scale-105' :
                  'bg-white hover:bg-lime-100 border-gray-300'
                }`}
              >
                {pair.right}
              </button>
            ))}
          </div>
        </div>
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {lineCoords.map((coords, i) => (
            <line key={i} {...coords} stroke="#4ade80" strokeWidth="4" strokeLinecap="round" />
          ))}
        </svg>
      </div>
    </div>
  );
};

export default ConnectTextPairsActivityComponent;
