import React, { useState } from 'react';
import type { WordSearchWord } from '../types';

interface WordCountQuizProps {
  words: WordSearchWord[];
  correctAnswer: number;
}

const BUTTON_STYLES = [
  'bg-sky-400 text-white rounded-lg shadow-md hover:bg-sky-500',
  'bg-rose-400 text-white rounded-full shadow-md hover:bg-rose-500',
  'bg-emerald-400 text-white rounded-xl shadow-md hover:bg-emerald-500 transform -rotate-2 hover:rotate-0',
  'bg-amber-400 text-gray-800 rounded-lg shadow-md hover:bg-amber-500',
  'bg-violet-400 text-white rounded-2xl shadow-md hover:bg-violet-500',
  'bg-lime-400 text-gray-800 rounded-lg shadow-md hover:bg-lime-500 transform rotate-2 hover:rotate-0',
  'bg-cyan-400 text-white rounded-full shadow-md hover:bg-cyan-500',
  'bg-fuchsia-400 text-white rounded-lg shadow-md hover:bg-fuchsia-500',
  'bg-orange-400 text-white rounded-xl shadow-md hover:bg-orange-500 transform rotate-1 hover:rotate-0',
];

const WordCountQuiz: React.FC<WordCountQuizProps> = ({ words, correctAnswer }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [status, setStatus] = useState<'playing' | 'correct' | 'incorrect'>('playing');

  const answerOptions = [correctAnswer - 2, correctAnswer - 1, correctAnswer, correctAnswer + 1].filter(n => n > 0);

  const handleAnswerSelect = (answer: number) => {
    if (status !== 'playing') return;

    setSelectedAnswer(answer);
    if (answer === correctAnswer) {
      setStatus('correct');
    } else {
      setStatus('incorrect');
    }
  };

  const handleReset = () => {
    setSelectedAnswer(null);
    setStatus('playing');
  };

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center justify-center p-4">
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 w-full">
        {words.map((word, index) => (
          <div
            key={index}
            className={`flex items-center justify-center p-3 sm:p-4 text-xl sm:text-2xl font-bold transition-all duration-200 h-20 sm:h-24 ${BUTTON_STYLES[index % BUTTON_STYLES.length]}`}
          >
            {word.word}
          </div>
        ))}
      </div>
      
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-700 mb-4">'ㅠ'가 들어간 낱말은 모두 몇 개인가요?</p>
        <div className="flex justify-center space-x-3 sm:space-x-4">
          {answerOptions.map((option) => {
            const isSelected = selectedAnswer === option;
            let buttonClass = 'bg-gray-200 hover:bg-gray-300';
            if (isSelected) {
              if (status === 'correct') {
                buttonClass = 'bg-green-500 text-white';
              } else if (status === 'incorrect') {
                buttonClass = 'bg-red-500 text-white animate-shake';
              }
            } else if (status === 'correct' && option === correctAnswer) {
                buttonClass = 'bg-green-500 text-white';
            }

            return (
              <button
                key={option}
                onClick={() => handleAnswerSelect(option)}
                disabled={status !== 'playing'}
                className={`w-16 h-16 sm:w-20 sm:h-20 text-3xl sm:text-4xl font-bold rounded-full transition-colors duration-200 flex items-center justify-center shadow-sm ${buttonClass}`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
      
      {status !== 'playing' && (
        <div className="mt-6 text-center">
          <p className={`text-2xl font-bold mb-3 ${status === 'correct' ? 'text-yellow-500 animate-bounce' : 'text-red-500'}`}>
            {status === 'correct' ? '참 잘했어요!' : '아쉽지만, 다시 세어보세요!'}
          </p>
          <button
            onClick={handleReset}
            className="px-6 py-2 bg-gray-500 text-white font-bold rounded-lg hover:bg-gray-600 transition-colors"
          >
            다시하기
          </button>
        </div>
      )}
    </div>
  );
};

export default WordCountQuiz;
