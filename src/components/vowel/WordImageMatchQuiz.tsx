import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import type { WordImagePair } from '../types';

interface WordImageMatchQuizProps {
  pairs: WordImagePair[];
}

// Utility to shuffle an array
const shuffle = <T,>(array: T[]): T[] => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

const WordImageMatchQuiz: React.FC<WordImageMatchQuizProps> = ({ pairs }) => {
  const [shuffledImages, setShuffledImages] = useState(() => shuffle([...pairs]));
  const [selectedWord, setSelectedWord] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [incorrectPair, setIncorrectPair] = useState<{ wordId: number; imageId: number } | null>(null);
  const [lines, setLines] = useState<{ x1: number; y1: number; x2: number; y2: number; id: number }[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const imageRefs = useRef<Record<number, HTMLButtonElement | null>>({});

  const words = useMemo(() => pairs.sort((a,b) => a.id - b.id), [pairs]);

  const handleWordSelect = (id: number) => {
    if (matchedPairs.includes(id) || selectedWord === id || incorrectPair) return;
    setSelectedWord(id);
  };

  const handleImageSelect = (id: number) => {
    if (matchedPairs.includes(id) || selectedImage === id || incorrectPair) return;
    setSelectedImage(id);
  };

  useEffect(() => {
    if (selectedWord !== null && selectedImage !== null) {
      if (selectedWord === selectedImage) {
        // Correct match
        setMatchedPairs(prev => [...prev, selectedWord]);
        setSelectedWord(null);
        setSelectedImage(null);
      } else {
        // Incorrect match
        setIncorrectPair({ wordId: selectedWord, imageId: selectedImage });
        setTimeout(() => {
          setIncorrectPair(null);
          setSelectedWord(null);
          setSelectedImage(null);
        }, 1000);
      }
    }
  }, [selectedWord, selectedImage]);

  const calculateLines = useCallback(() => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const newLines = matchedPairs.map(id => {
      const wordEl = wordRefs.current[id];
      const imageEl = imageRefs.current[id];
      if (!wordEl || !imageEl) return null;

      const wordRect = wordEl.getBoundingClientRect();
      const imageRect = imageEl.getBoundingClientRect();

      return {
        id,
        x1: wordRect.right - containerRect.left,
        y1: wordRect.top + wordRect.height / 2 - containerRect.top,
        x2: imageRect.left - containerRect.left,
        y2: imageRect.top + imageRect.height / 2 - containerRect.top,
      };
    }).filter((line): line is { x1: number; y1: number; x2: number; y2: number; id: number } => line !== null);
    setLines(newLines);
  }, [matchedPairs]);

  useEffect(() => {
    calculateLines();
    window.addEventListener('resize', calculateLines);
    return () => window.removeEventListener('resize', calculateLines);
  }, [calculateLines]);

  const reset = useCallback(() => {
    setShuffledImages(shuffle([...pairs]));
    setSelectedWord(null);
    setSelectedImage(null);
    setMatchedPairs([]);
    setIncorrectPair(null);
    setLines([]);
  }, [pairs]);

  const allMatched = matchedPairs.length === pairs.length;

  return (
    <div ref={containerRef} className="relative w-full p-4 flex flex-col items-center">
      {allMatched && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20 rounded-lg">
          <p className="text-3xl font-bold text-white animate-bounce">참 잘했어요!</p>
        </div>
      )}
      <div className="relative w-full flex justify-around items-center">
        {/* Words column */}
        <div className="flex flex-col space-y-4">
          {words.map(item => (
            <button
              key={`word-${item.id}`}
              // Fix: Ref callbacks should not return a value. Use a block body to prevent an implicit return.
              ref={el => { wordRefs.current[item.id] = el; }}
              onClick={() => handleWordSelect(item.id)}
              disabled={matchedPairs.includes(item.id) || !!incorrectPair}
              className={`w-32 py-3 px-4 text-xl font-bold rounded-lg transition-all duration-200
                ${matchedPairs.includes(item.id) ? 'bg-emerald-500 text-white cursor-default' : ''}
                ${selectedWord === item.id ? 'bg-yellow-400 ring-4 ring-yellow-500' : 'bg-sky-100 hover:bg-sky-200'}
                ${incorrectPair?.wordId === item.id ? 'bg-red-500 text-white animate-shake' : ''}
              `}
            >
              {item.word}
            </button>
          ))}
        </div>

        {/* Images column */}
        <div className="flex flex-col space-y-4">
          {shuffledImages.map(item => (
            <button
              key={`image-${item.id}`}
              // Fix: Ref callbacks should not return a value. Use a block body to prevent an implicit return.
              ref={el => { imageRefs.current[item.id] = el; }}
              onClick={() => handleImageSelect(item.id)}
              disabled={matchedPairs.includes(item.id) || !!incorrectPair}
              className={`w-32 h-24 flex items-center justify-center rounded-lg overflow-hidden transition-all duration-200
                ${matchedPairs.includes(item.id) ? 'bg-emerald-500 ring-4 ring-emerald-600 cursor-default' : ''}
                ${selectedImage === item.id ? 'bg-yellow-400 ring-4 ring-yellow-500' : 'bg-gray-100 hover:bg-gray-200'}
                ${incorrectPair?.imageId === item.id ? 'bg-red-500 ring-4 ring-red-600 animate-shake' : ''}
              `}
            >
              <img src={item.image} alt={item.word} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>

        {/* SVG overlay for lines and X's */}
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
          {lines.map(line => (
            <line
              key={`line-${line.id}`}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="#10b981" // emerald-500
              strokeWidth="4"
              strokeLinecap="round"
            />
          ))}
          {incorrectPair && (() => {
            const wordEl = wordRefs.current[incorrectPair.wordId];
            const imageEl = imageRefs.current[incorrectPair.imageId];
            if (!wordEl || !imageEl || !containerRef.current) return null;

            const containerRect = containerRef.current.getBoundingClientRect();
            const wordRect = wordEl.getBoundingClientRect();
            const imageRect = imageEl.getBoundingClientRect();
            
            const x1 = wordRect.right - containerRect.left;
            const y1 = wordRect.top + wordRect.height / 2 - containerRect.top;
            const x2 = imageRect.left - containerRect.left;
            const y2 = imageRect.top + imageRect.height / 2 - containerRect.top;

            return (
              <>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#ef4444" strokeWidth="4" strokeDasharray="5,5" />
                <text x={(x1 + x2) / 2 - 10} y={(y1 + y2) / 2 + 10} fontSize="30" fill="#ef4444" fontWeight="bold">X</text>
              </>
            );
          })()}
        </svg>
      </div>
      <button onClick={reset} className="mt-8 px-6 py-2 bg-gray-500 text-white font-bold rounded-lg hover:bg-gray-600 transition-colors">
        다시하기
      </button>
    </div>
  );
};

export default WordImageMatchQuiz;