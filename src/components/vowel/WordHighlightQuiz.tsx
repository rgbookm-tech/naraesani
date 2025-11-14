import React, { useState } from 'react';
import type { WordSearchWord } from '../types';

interface WordHighlightQuizProps {
  words: WordSearchWord[];
  vowel: string;
  type: 'findVowel' | 'findWord';
  theme?: 'leaves' | 'balloons' | 'grid';
}

const LeafButton: React.FC<{ word: string; onClick: () => void; className: string; }> = ({ word, onClick, className }) => {
    return (
        <button
            onClick={onClick}
            className={`relative w-28 h-28 flex items-center justify-center transition-all duration-300 transform focus:outline-none ${className}`}
        >
            <svg
                viewBox="0 0 100 100"
                className="absolute inset-0 w-full h-full"
                style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))" }}
            >
                <path
                    d="M50 100 C 0 75, 0 25, 50 0 C 100 25, 100 75, 50 100 Z"
                    className="fill-current"
                />
            </svg>
            <span className="relative text-white text-xl sm:text-2xl font-bold z-10 drop-shadow">{word}</span>
        </button>
    );
};

const BalloonButton: React.FC<{ word: string; onClick: () => void; className: string; }> = ({ word, onClick, className }) => {
    const textSize = word.length > 2 ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl';
    
    return (
        <button
            onClick={onClick}
            className={`relative w-28 h-36 flex items-center justify-center transition-all duration-300 transform focus:outline-none ${className}`}
        >
            <svg
                viewBox="0 0 100 120"
                className="absolute inset-0 w-full h-full"
                style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))" }}
            >
                <ellipse cx="50" cy="60" rx="48" ry="58" className="fill-current" />
                <path d="M45 118 Q 50 122 55 118 Z" className="fill-current" />
            </svg>
            <span className={`relative text-white font-bold z-10 drop-shadow ${textSize}`}>{word}</span>
        </button>
    );
};


const WordHighlightQuiz: React.FC<WordHighlightQuizProps> = ({ words, vowel, type, theme }) => {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);

  const isCorrect = (word: string) => {
    const wordData = words.find(w => w.word === word);
    if (wordData && typeof wordData.isCorrect === 'boolean') {
      return wordData.isCorrect;
    }

    if (type === 'findVowel') {
      const allVowels = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
      const targetVowelIndex = allVowels.indexOf(vowel);

      if (targetVowelIndex === -1) {
        return false;
      }

      for (const char of word) {
        const charCode = char.charCodeAt(0);
        
        if (charCode >= 0xAC00 && charCode <= 0xD7A3) {
          const vowelIndex = Math.floor(((charCode - 0xAC00) % 588) / 28);
          if (vowelIndex === targetVowelIndex) {
            return true;
          }
        }
      }
      return false;
    }
    return wordData ? !wordData.hidden : false;
  };

  const handleWordClick = (word: string) => {
    if (!isCorrect(word) && selectedWords.includes(word)) {
        return;
    }
    
    if (selectedWords.includes(word)) {
      setSelectedWords(current => current.filter(w => w !== word));
    } else {
      setSelectedWords(current => [...current, word]);
    }
  };

  const getWordClasses = (word: string) => {
    if (!selectedWords.includes(word)) {
      return "bg-gray-200 hover:bg-gray-300";
    }
    if (isCorrect(word)) {
      return "bg-emerald-500 text-white";
    }
    return "bg-rose-500 text-white animate-shake";
  };
  
  const getLeafClasses = (word: string) => {
    if (!selectedWords.includes(word)) {
      return "text-orange-500 hover:text-orange-400 hover:scale-110";
    }
    if (isCorrect(word)) {
      return "text-emerald-500 scale-105";
    }
    return "text-rose-500 animate-shake";
  };

  const getBalloonClasses = (word: string) => {
    if (!selectedWords.includes(word)) {
      return "text-sky-500 hover:text-sky-400 hover:scale-110";
    }
    if (isCorrect(word)) {
      return "text-emerald-500 scale-105";
    }
    return "text-rose-500 animate-shake";
  };
  
  const allCorrectWords = words.filter(w => isCorrect(w.word)).map(w => w.word);
  const allFound = allCorrectWords.length > 0 && allCorrectWords.every(w => selectedWords.includes(w));
  const hasIncorrectSelection = selectedWords.some(w => !isCorrect(w));

  if (theme === 'leaves') {
    const leafStyles: React.CSSProperties[] = [
      { top: '0%', left: '40%', transform: 'rotate(-15deg)' },
      { top: '12%', right: '30%', transform: 'rotate(20deg)' },
      { top: '25%', left: '18%', transform: 'rotate(-25deg)' },
      { top: '38%', right: '15%', transform: 'rotate(25deg)' },
      { top: '50%', left: '30%', transform: 'rotate(-5deg)' },
      { top: '60%', right: '35%', transform: 'rotate(15deg)' },
      { top: '72%', left: '10%', transform: 'rotate(-35deg)' },
      { top: '80%', right: '10%', transform: 'rotate(35deg)' },
      { top: '85%', left: '45%', transform: 'rotate(-10deg)' },
    ];

    return (
      <div className="flex flex-col items-center p-2 sm:p-4 w-full">
        <div className="relative w-full max-w-xs sm:max-w-sm mx-auto h-[450px] sm:h-[500px]">
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 500">
            <path d="M50 0 C 60 100, 40 250, 50 500" stroke="#6B4226" strokeWidth="8" strokeLinecap="round" fill="none" />
          </svg>
          
          {words.map(({ word }, index) => (
            <div
              key={word}
              className="absolute"
              style={leafStyles[index % leafStyles.length]}
            >
              <LeafButton
                word={word}
                onClick={() => handleWordClick(word)}
                className={getLeafClasses(word)}
              />
            </div>
          ))}
        </div>
        {allFound && !hasIncorrectSelection && (
          <p className="mt-4 text-2xl sm:text-3xl font-bold text-yellow-500 animate-bounce">
            참 잘했어요!
          </p>
        )}
      </div>
    );
  } else if (theme === 'balloons') {
    const balloonPositions = [
      { top: '5%', left: '50%' }, { top: '15%', left: '25%' }, { top: '15%', left: '75%' },
      { top: '30%', left: '10%' }, { top: '30%', left: '90%' }, { top: '38%', left: '40%' },
      { top: '38%', left: '60%' }, { top: '55%', left: '22%' }, { top: '55%', left: '78%' },
      { top: '70%', left: '35%' }, { top: '70%', left: '65%' }, { top: '80%', left: '10%' },
      { top: '80%', left: '90%' },
    ];
    
    const sortedWords = [...words].sort((a, b) => a.word.localeCompare(b.word));

    return (
      <div className="flex flex-col items-center p-2 sm:p-4 w-full">
        <div className="relative w-full max-w-lg mx-auto h-[450px] sm:h-[500px]">
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 500">
             {sortedWords.map((_, index) => {
                const pos = balloonPositions[index % balloonPositions.length];
                const endX = (parseInt(pos.left) / 100) * 400;
                const endY = (parseInt(pos.top) / 100) * 500 + 60;
                return (
                  <path 
                    key={`string-${index}`}
                    d={`M 200 500 Q ${180 + Math.random() * 40} 350 ${endX} ${endY}`}
                    stroke="#A3A3A3" strokeWidth="2" fill="none"
                  />
                )
             })}
          </svg>
          
          {sortedWords.map(({ word }, index) => {
             const pos = balloonPositions[index % balloonPositions.length];
             return (
                <div
                  key={word}
                  className="absolute"
                  style={{
                    top: pos.top,
                    left: pos.left,
                    transform: `translateX(-50%) rotate(${(index % 3 - 1) * (index % 5 + 5)}deg)`
                  }}
                >
                  <BalloonButton
                    word={word}
                    onClick={() => handleWordClick(word)}
                    className={getBalloonClasses(word)}
                  />
                </div>
            )
          })}
        </div>
        {allFound && !hasIncorrectSelection && (
          <p className="mt-4 text-2xl sm:text-3xl font-bold text-yellow-500 animate-bounce">
            참 잘했어요!
          </p>
        )}
      </div>
    );
  } else if (theme === 'grid') {
    return (
      <div className="flex flex-col items-center p-2 sm:p-4 w-full">
        <div className="grid grid-cols-5 gap-2 sm:gap-4">
          {words.map(({ word }) => (
            <button
              key={word}
              onClick={() => handleWordClick(word)}
              className={`w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-xl sm:text-2xl font-bold rounded-lg transition-all duration-200 shadow-md ${getWordClasses(word)}`}
            >
              {word}
            </button>
          ))}
        </div>
        {allFound && !hasIncorrectSelection && (
          <p className="mt-4 text-2xl sm:text-3xl font-bold text-yellow-500 animate-bounce">
            참 잘했어요!
          </p>
        )}
      </div>
    );
  }


  return (
    <div className="flex flex-col items-center p-4 w-full">
      <div className="flex flex-wrap justify-center gap-4">
        {words.map(({ word }) => (
          <button
            key={word}
            onClick={() => handleWordClick(word)}
            className={`px-5 py-3 rounded-lg text-2xl font-bold transition-all duration-200 shadow-sm ${getWordClasses(word)}`}
          >
            {word}
          </button>
        ))}
      </div>
      {allFound && !hasIncorrectSelection && (
        <p className="mt-6 text-3xl font-bold text-yellow-500 animate-bounce">
          참 잘했어요!
        </p>
      )}
    </div>
  );
};

export default WordHighlightQuiz;
