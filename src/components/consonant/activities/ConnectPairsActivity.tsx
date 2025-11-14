import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import type { ConnectPairsActivity } from '../../types';
import { playSound, SoundType } from '../../../utils/sound';

interface ConnectPairsActivityProps {
  activity: ConnectPairsActivity;
}

const ConnectPairsActivityComponent: React.FC<ConnectPairsActivityProps> = ({ activity }) => {
  const [selectedWord, setSelectedWord] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [completedPairs, setCompletedPairs] = useState<Set<number>>(new Set());

  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const updateDimensions = useCallback(() => {
    if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
    }
  }, []);

  useEffect(() => {
    window.addEventListener('resize', updateDimensions);
    updateDimensions();
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [updateDimensions]);
  
  useEffect(() => {
    // 활동이 변경되면 상태 초기화
    setSelectedWord(null);
    setSelectedImage(null);
    setCompletedPairs(new Set());
  }, [activity]);

  useEffect(() => {
    if (selectedWord !== null && selectedImage !== null) {
      if (selectedWord === selectedImage) {
        playSound(SoundType.CORRECT);
        setCompletedPairs(prev => {
            const newSet = new Set(prev);
            newSet.add(selectedWord);
            return newSet;
        });
      } else {
        playSound(SoundType.INCORRECT);
      }
      setTimeout(() => {
        setSelectedWord(null);
        setSelectedImage(null);
      }, 300);
    }
  }, [selectedWord, selectedImage]);

  const handleWordClick = (id: number) => {
    playSound(SoundType.CLICK);
    if (!completedPairs.has(id)) {
      setSelectedWord(id);
    }
  };

  const handleImageClick = (id: number) => {
    playSound(SoundType.CLICK);
    if (!completedPairs.has(id)) {
      setSelectedImage(id);
    }
  };

  const getElementPosition = useCallback((elementId: string) => {
    const element = itemRefs.current[elementId];
    const container = containerRef.current;
    if (!element || !container) {
      return { x: 0, y: 0 };
    }
    const containerRect = container.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    const x = elementRect.left + elementRect.width / 2 - containerRect.left;
    const y = elementRect.top + elementRect.height / 2 - containerRect.top;
    return { x, y };
  }, []);

  const activityGroups = useMemo(() => activity.groups || (activity.pairs ? [activity.pairs] : []), [activity]);

  const imageGroups = useMemo(() => 
    activityGroups.map(group => [...group].sort((a, b) => a.id - b.id)),
  [activityGroups]);

  const lineCoords = useMemo(() => {
    return Array.from(completedPairs).map(pairId => {
        const startPos = getElementPosition(`word-${pairId}`);
        const endPos = getElementPosition(`image-${pairId}`);
        return { x1: startPos.x, y1: startPos.y, x2: endPos.x, y2: endPos.y, id: pairId };
    });
  }, [completedPairs, getElementPosition, dimensions]);

  return (
    <div>
      <h3 className="text-xl font-semibold mb-6 text-gray-700">
        {activity.activityNumber && <span className="bg-orange-200 text-orange-800 text-lg font-bold mr-2 px-2.5 py-0.5 rounded-full">{activity.activityNumber}</span>}
        {activity.question}
      </h3>
      <div className="relative" ref={containerRef}>
        <div className="flex flex-col space-y-4">
           {activityGroups.map((group, index) => (
            <div key={index} className="flex justify-between items-center py-4 bg-lime-50 rounded-lg p-4">
              <div className="w-2/5 space-y-4">
                 {group.map(pair => (
                   <button
                     key={`word-${pair.id}`}
                     ref={el => { itemRefs.current[`word-${pair.id}`] = el; }}
                     onClick={() => handleWordClick(pair.id)}
                     className={`w-full p-4 text-xl font-bold rounded-lg border-2 transition-all ${
                      completedPairs.has(pair.id) ? 'bg-green-200 border-green-400 cursor-default' :
                      selectedWord === pair.id ? 'bg-orange-200 border-orange-400' :
                      'bg-white hover:bg-lime-100 border-gray-300'
                     }`}
                    disabled={completedPairs.has(pair.id)}
                   >
                     {pair.word}
                   </button>
                 ))}
               </div>
              <div className="w-2/5 grid grid-cols-2 gap-4">
                {imageGroups[index].map(pair => (
                  <button
                    key={`image-${pair.id}`}
                    ref={el => { itemRefs.current[`image-${pair.id}`] = el; }}
                    onClick={() => handleImageClick(pair.id)}
                    className={`aspect-square rounded-lg border-4 overflow-hidden transition-all ${
                        completedPairs.has(pair.id) ? 'border-green-400 cursor-default' :
                        selectedImage === pair.id ? 'border-orange-400' :
                        'border-gray-300 hover:border-lime-400'
                    }`}
                    disabled={completedPairs.has(pair.id)}
                  >
                    <img src={pair.image} alt={pair.word} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            </div>
           ))}
         </div>
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ width: dimensions.width, height: dimensions.height }}>
          {lineCoords.map((coords) => (
            <line
              key={coords.id}
              x1={coords.x1}
              y1={coords.y1}
              x2={coords.x2}
              y2={coords.y2}
              stroke="#4ade80"
              strokeWidth="4"
              strokeLinecap="round"
            />
          ))}
        </svg>
      </div>
    </div>
  );
};

export default ConnectPairsActivityComponent;
