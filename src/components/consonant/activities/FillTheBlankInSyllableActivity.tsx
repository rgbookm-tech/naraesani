import React, { useState } from 'react';
import { FillTheBlankInSyllableActivity as ActivityProps } from '../../types';
import { playSound, SoundType } from '../../../utils/sound';
import { speakKorean } from '../../../utils/hangulSpeech';

const JONGSEONG_INDEX: Record<string, number> = {
  ㄱ: 1,
  ㄲ: 2,
  ㄴ: 4,
  ㄷ: 7,
  ㄹ: 8,
  ㅁ: 16,
  ㅂ: 17,
  ㅅ: 19,
  ㅆ: 20,
  ㅇ: 21,
  ㅈ: 22,
  ㅊ: 23,
  ㅋ: 24,
  ㅌ: 25,
  ㅍ: 26,
  ㅎ: 27,
};

function composeBatchimWord(firstSyllable: string, batchim: string, rest: string): string {
  if (!firstSyllable) return rest;
  const code = firstSyllable.charCodeAt(0);
  const jongIdx = JONGSEONG_INDEX[batchim];
  if (code >= 0xac00 && code <= 0xd7a3 && (code - 0xac00) % 28 === 0 && jongIdx) {
    return String.fromCharCode(code + jongIdx) + rest;
  }
  return `${firstSyllable}${batchim}${rest}`;
}

const CorrectIcon = () => (
  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IncorrectIcon = () => (
  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const FillTheBlankInSyllableActivityComponent: React.FC<{ activity: ActivityProps }> = ({
  activity,
}) => {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [feedback, setFeedback] = useState<{ [key: number]: 'correct' | 'incorrect' }>({});

  const handleChoiceClick = (choice: string) => {
    speakKorean(choice);
    playSound(SoundType.CLICK);
    setSelectedChoice(choice);
  };

  const handleBlankClick = (item: ActivityProps['items'][0]) => {
    if (!selectedChoice || answers[item.id]) return;

    if (selectedChoice === item.right.correctAnswer) {
      playSound(SoundType.CORRECT);
      setAnswers((prev) => ({ ...prev, [item.id]: selectedChoice }));
      setFeedback((prev) => ({ ...prev, [item.id]: 'correct' }));
      const completedWord = composeBatchimWord(
        item.right.wordParts[0],
        selectedChoice,
        item.right.wordParts[1]
      );
      speakKorean(`${completedWord}! 정답!`);
    } else {
      playSound(SoundType.INCORRECT);
      setFeedback((prev) => ({ ...prev, [item.id]: 'incorrect' }));
      setTimeout(() => {
        setFeedback((prev) => {
          const newFeedback = { ...prev };
          delete newFeedback[item.id];
          return newFeedback;
        });
      }, 1000);
    }
    setSelectedChoice(null);
  };

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-xl font-semibold mb-6 text-gray-700 text-center">{activity.question}</h3>

      <div className="flex justify-center items-center gap-6 mb-8">
        <span className="text-lg font-bold text-emerald-900">보기 (받침 선택):</span>
        {activity.choices.map((choice) => (
          <button
            key={choice}
            type="button"
            onClick={() => handleChoiceClick(choice)}
            className={`w-20 h-20 text-3xl font-bold rounded-xl border-4 transition-all ${
              selectedChoice === choice
                ? 'bg-yellow-200 border-yellow-400 scale-110 shadow-md'
                : 'bg-white hover:bg-emerald-100 border-gray-300'
            }`}
          >
            {choice}
          </button>
        ))}
      </div>

      <div className="w-full space-y-4">
        {activity.items.map((item) => {
          const rightComposed = composeBatchimWord(
            item.right.wordParts[0],
            item.right.correctAnswer,
            item.right.wordParts[1]
          );
          return (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl shadow-sm"
            >
              {/* Left side */}
              <button
                type="button"
                onClick={() => speakKorean(item.left.word)}
                className="flex items-center justify-center gap-4 w-full sm:w-[46%] p-2 bg-white hover:bg-emerald-50 rounded-xl transition-colors"
                title="클릭하여 소리 듣기"
              >
                <img
                  src={item.left.image}
                  alt={item.left.word}
                  className="w-24 h-24 object-contain rounded-lg bg-white p-1 shadow"
                />
                <span className="text-3xl font-bold text-gray-800">{item.left.word} 🔊</span>
              </button>

              {/* Right side */}
              <div className="flex items-center justify-center gap-4 w-full sm:w-[46%] p-2 bg-white rounded-xl">
                <div className="flex items-center gap-1 text-4xl font-bold">
                  <div className="flex flex-col items-center leading-none">
                    <span>{item.right.wordParts[0]}</span>
                    <button
                      type="button"
                      onClick={() => handleBlankClick(item)}
                      disabled={!!answers[item.id]}
                      className={`relative w-12 h-12 mt-1 rounded-lg border-2 flex items-center justify-center text-2xl font-bold
                        ${feedback[item.id] === 'correct' ? 'bg-green-100 border-green-400' : ''}
                        ${feedback[item.id] === 'incorrect' ? 'bg-red-100 border-red-400 animate-shake' : ''}
                        ${
                          !answers[item.id]
                            ? 'bg-gray-100 border-dashed border-gray-400 cursor-pointer hover:bg-yellow-100'
                            : 'border-transparent'
                        }
                      `}
                    >
                      {answers[item.id]}
                      {feedback[item.id] === 'correct' && (
                        <div className="absolute -top-2 -right-2">
                          <CorrectIcon />
                        </div>
                      )}
                      {feedback[item.id] === 'incorrect' && (
                        <div className="absolute -top-2 -right-2">
                          <IncorrectIcon />
                        </div>
                      )}
                    </button>
                  </div>
                  <span>{item.right.wordParts[1]}</span>
                </div>
                <button
                  type="button"
                  onClick={() => speakKorean(rightComposed)}
                  className="relative group rounded-lg p-1 hover:bg-emerald-50"
                  title="그림 소리 힌트 듣기"
                >
                  <img src={item.right.image} alt={rightComposed} className="w-24 h-24 object-contain" />
                  <span className="absolute bottom-1 right-1 text-xs bg-emerald-100 text-emerald-800 rounded-full px-1.5 py-0.5 font-bold">
                    🔊
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FillTheBlankInSyllableActivityComponent;
