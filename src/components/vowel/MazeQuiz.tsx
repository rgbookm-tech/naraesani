import React, { useState, useMemo, useEffect } from 'react';
import type { MazeJunction, MazeChoice } from '../types';

interface MazeQuizProps {
  junctions: MazeJunction[];
}

const points = {
  start:    { x: 50,  y: 250 },
  j1:       { x: 150, y: 250 },
  d1:       { x: 150, y: 350 },
  j2:       { x: 250, y: 250 },
  d2:       { x: 250, y: 150 },
  j3:       { x: 350, y: 250 },
  d3:       { x: 350, y: 350 },
  j4:       { x: 450, y: 250 },
  d4:       { x: 450, y: 150 },
  j5:       { x: 550, y: 250 },
  d5:       { x: 550, y: 350 },
  finish:   { x: 650, y: 250 },
};

const positionMap: Record<string | number, {x: number, y: number}> = {
  0: points.start,
  1: points.j1,
  2: points.j2,
  3: points.j3,
  4: points.j4,
  5: points.j5, 
  'deadend-1': points.d1,
  'deadend-2': points.d2,
  'deadend-3': points.d3,
  'deadend-4': points.d4,
  'deadend-5': points.d5,
  'finish': points.finish,
};

const BusIcon = () => (
    <div className="w-12 h-12 bg-yellow-400 rounded-t-lg rounded-b-md border-2 border-black flex flex-col items-center relative">
        <div className="w-10 h-4 bg-white rounded-sm mt-1 border border-black flex justify-around items-center">
            <div className="w-1 h-2 bg-gray-500 rounded-full"></div>
            <div className="w-1 h-2 bg-gray-500 rounded-full"></div>
            <div className="w-1 h-2 bg-gray-500 rounded-full"></div>
        </div>
        <div className="absolute bottom-0 left-1 w-3 h-3 bg-gray-700 rounded-full border border-black"></div>
        <div className="absolute bottom-0 right-1 w-3 h-3 bg-gray-700 rounded-full border border-black"></div>
    </div>
);


const MazeQuiz: React.FC<MazeQuizProps> = ({ junctions }) => {
  const initialJunctionId = useMemo(() => {
    const firstJunction = junctions.find(j => j.id === 0);
    if (firstJunction && firstJunction.choices.length === 1 && typeof firstJunction.choices[0].leadsTo === 'number') {
      return firstJunction.choices[0].leadsTo as number;
    }
    return 0;
  }, [junctions]);

  const [currentJunctionId, setCurrentJunctionId] = useState(initialJunctionId);
  const [status, setStatus] = useState<'playing' | 'deadend' | 'finished'>('playing');
  const [characterTarget, setCharacterTarget] = useState(positionMap[initialJunctionId]);
  const [isMoving, setIsMoving] = useState(false);

  useEffect(() => {
    setCurrentJunctionId(initialJunctionId);
    setCharacterTarget(positionMap[initialJunctionId]);
    setStatus('playing');
    setIsMoving(false);
  }, [initialJunctionId]);

  const handleChoice = (choice: MazeChoice) => {
    if (isMoving) return;
    setIsMoving(true);
    const targetPos = positionMap[choice.leadsTo];
    setCharacterTarget(targetPos);

    setTimeout(() => {
      if (typeof choice.leadsTo === 'number') {
        setCurrentJunctionId(choice.leadsTo);
      } else if (String(choice.leadsTo).startsWith('deadend')) {
        setStatus('deadend');
      } else if (choice.leadsTo === 'finish') {
        setStatus('finished');
      }
      setIsMoving(false);
    }, 600); 
  };

  const handleReset = () => {
    setCurrentJunctionId(initialJunctionId);
    setStatus('playing');
    setCharacterTarget(positionMap[initialJunctionId]);
    setIsMoving(false);
  };

  const currentJunction = junctions.find(j => j.id === currentJunctionId);

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center p-2">
      <div className="relative w-full h-[350px] bg-green-50 rounded-lg border-2 border-green-200 overflow-hidden">
        <svg width="100%" height="100%" viewBox="0 0 700 400" className="absolute inset-0">
          <path d="M 50 250 H 650" stroke="#a3a3a3" strokeWidth="15" strokeLinecap="round" fill="none" strokeDasharray="20 10"/>
          <path d="M 150 250 V 350" stroke="#a3a3a3" strokeWidth="15" strokeLinecap="round" fill="none" strokeDasharray="20 10"/>
          <path d="M 250 250 V 150" stroke="#a3a3a3" strokeWidth="15" strokeLinecap="round" fill="none" strokeDasharray="20 10"/>
          <path d="M 350 250 V 350" stroke="#a3a3a3" strokeWidth="15" strokeLinecap="round" fill="none" strokeDasharray="20 10"/>
          <path d="M 450 250 V 150" stroke="#a3a3a3" strokeWidth="15" strokeLinecap="round" fill="none" strokeDasharray="20 10"/>
          <path d="M 550 250 V 350" stroke="#a3a3a3" strokeWidth="15" strokeLinecap="round" fill="none" strokeDasharray="20 10"/>

          <text x="30" y="220" fontSize="24" >🏁</text>
          <text x="25" y="200" fontSize="16" fill="#333" className="font-bold">출발</text>
          <text x="640" y="220" fontSize="24" >⭐</text>
          <text x="635" y="200" fontSize="16" fill="#333" className="font-bold">도착</text>

          <text x="140" y="370" fontSize="24">🚧</text>
          <text x="240" y="140" fontSize="24">🚧</text>
          <text x="340" y="370" fontSize="24">🚧</text>
          <text x="440" y="140" fontSize="24">🚧</text>
          <text x="540" y="370" fontSize="24">🚧</text>
        </svg>

        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{
            top: `${characterTarget.y}px`,
            left: `${characterTarget.x}px`,
            transition: 'all 0.5s ease-in-out',
          }}
        >
          <BusIcon />
        </div>

        {status === 'playing' && currentJunction && (
          <div
            className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center justify-center flex-wrap gap-2 p-2 bg-white/80 backdrop-blur-sm rounded-lg w-11/12 sm:w-auto z-10"
          >
            {currentJunction.choices.map((choice) => (
              <button
                key={choice.word}
                onClick={() => handleChoice(choice)}
                disabled={isMoving}
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-sky-500 text-white font-bold rounded-lg shadow-md hover:bg-sky-600 transition-colors disabled:bg-gray-400 text-sm sm:text-base"
              >
                {choice.word}
              </button>
            ))}
          </div>
        )}

        {(status === 'deadend' || status === 'finished') && (
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-10">
                <p className="text-3xl font-bold text-white mb-4 animate-bounce">
                    {status === 'deadend' ? '막다른 길이에요!' : '도착! 참 잘했어요!'}
                </p>
                <button onClick={handleReset} className="px-6 py-2 bg-yellow-400 text-yellow-900 font-bold rounded-lg hover:bg-yellow-500 transition-colors">
                    다시하기
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default MazeQuiz;