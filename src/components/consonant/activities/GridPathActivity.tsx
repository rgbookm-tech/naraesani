import React, { useState, useEffect } from 'react';
import type { GridPathActivity } from '../../types';
import { playSound, SoundType } from '../../../utils/sound';

interface GridPathActivityProps {
  activity: GridPathActivity;
}

const GridPathActivityComponent: React.FC<GridPathActivityProps> = ({ activity }) => {
  const [path, setPath] = useState<[number, number][]>([activity.start]);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Reset path when activity changes
    setPath([activity.start]);
    setIsComplete(false);
  }, [activity]);

  const handleCellClick = (row: number, col: number) => {
    if (isComplete) return;

    playSound(SoundType.CLICK);

    const currentPathIndex = path.length -1;
    const nextCorrectStep = activity.correctPath[currentPathIndex];
    if (nextCorrectStep && nextCorrectStep[0] === row && nextCorrectStep[1] === col) {
        playSound(SoundType.CORRECT);
        // FIX: TypeScript infers `[row, col]` as `number[]`, but the state `path` expects type `[number, number][]`.
        // Casting `[row, col]` to a tuple `[number, number]` resolves the type mismatch.
        const newPath = [...path, [row, col] as [number, number]];
        setPath(newPath);
        if (newPath.length -1 === activity.correctPath.length) {
            playSound(SoundType.SUCCESS);
            setIsComplete(true);
        }
    } else {
        playSound(SoundType.INCORRECT);
    }
  };
  
  const isCellInPath = (row: number, col: number) => {
    return path.some(([r, c]) => r === row && c === col);
  };
  
  return (
    <div>
      <h3 className="text-xl font-semibold mb-2 text-gray-700">
          <span className="bg-orange-200 text-orange-800 text-lg font-bold mr-2 px-2.5 py-0.5 rounded-full">{activity.activityNumber}</span>
          {activity.question}
      </h3>
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded-md">
        <p className="font-bold">{activity.instructions.title}</p>
        <p>{activity.instructions.description}</p>
      </div>

      <div className="bg-amber-100 p-4 rounded-lg border-2 border-amber-300">
        <div className="grid grid-cols-7 gap-1">
          {activity.grid.map((rowItems, rowIndex) => (
            rowItems.map((item, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                onClick={() => item && handleCellClick(rowIndex, colIndex)}
                className={`flex items-center justify-center h-16 text-lg font-bold rounded-md transition-colors
                  ${!item ? 'bg-transparent' : 'shadow-sm'}
                  ${item && 'cursor-pointer'}
                  ${isCellInPath(rowIndex, colIndex) ? 'bg-green-400 text-white' : ''}
                  ${isComplete && isCellInPath(rowIndex, colIndex) ? 'animate-pulse' : ''}
                `}
              >
                {item}
              </div>
            ))
          ))}
        </div>
      </div>
      {isComplete && <p className="mt-4 text-center text-2xl font-bold text-green-600 animate-bounce">성공!</p>}
    </div>
  );
};

export default GridPathActivityComponent;