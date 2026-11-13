import React, { useState } from 'react';
import type { WordImageGridActivity } from '../../types';
import { playSound, SoundType } from '../../../utils/sound';
import { speakKorean } from '../../../utils/hangulSpeech';

interface WordImageGridActivityProps {
  activity: WordImageGridActivity;
}

const WordImageGridActivityComponent: React.FC<WordImageGridActivityProps> = ({ activity }) => {
  const [answers, setAnswers] = useState<{ [key: number]: { with: string; without: string } }>({});

  const handleInputChange = (index: number, type: 'with' | 'without', value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        [type]: value,
      },
    }));

    const item = activity.items[index];
    const correctAnswer = type === 'with' ? item.wordWith : item.wordWithout;

    if (value === correctAnswer) {
      playSound(SoundType.CORRECT);
      speakKorean(correctAnswer);
    } else if (value.length >= correctAnswer.length) {
      playSound(SoundType.INCORRECT);
    }
  };

  const checkAnswer = (index: number, type: 'with' | 'without') => {
    const item = activity.items[index];
    const userAnswer = answers[index]?.[type];
    if (!userAnswer) return 'border-gray-300';

    const correctAnswer = type === 'with' ? item.wordWith : item.wordWithout;
    return userAnswer === correctAnswer ? 'border-emerald-500 bg-emerald-50' : 'border-red-500';
  };

  const exampleTokens = activity.example
    ? activity.example.split(/\s+/).filter(Boolean)
    : [];

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4 text-gray-700">
        <span className="bg-orange-200 text-orange-800 text-lg font-bold mr-2 px-2.5 py-0.5 rounded-full">
          {activity.activityNumber}
        </span>
        {activity.question}
      </h3>
      {exampleTokens.length > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl mb-5 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs font-extrabold text-emerald-800 mr-1">보기 (클릭하여 소리 듣기):</span>
          {exampleTokens.map((tok, idx) => (
            <button
              key={`${tok}-${idx}`}
              type="button"
              onClick={() => speakKorean(tok)}
              className="px-3 py-1 rounded-full bg-white hover:bg-emerald-100 border border-emerald-200 text-gray-800 font-bold text-base shadow-sm transition-transform active:scale-95"
            >
              🔊 {tok}
            </button>
          ))}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activity.items.map((item, index) => (
          <div key={index} className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-xl shadow-sm">
            <div className="grid grid-cols-2 gap-4">
              {/* Without Batchim */}
              <div className="flex flex-col items-center space-y-2">
                <button
                  type="button"
                  onClick={() => speakKorean(item.wordWithout)}
                  className="group relative rounded-xl border-2 border-white bg-white p-1 shadow-sm hover:border-emerald-300 transition-all"
                  title="그림 소리 힌트 듣기"
                >
                  <img
                    src={item.imageWithout}
                    alt={item.wordWithout}
                    className="w-24 h-24 rounded-lg object-contain"
                  />
                  <span className="absolute bottom-1 right-1 text-xs bg-emerald-100 text-emerald-800 rounded-full px-1.5 py-0.5 font-bold">
                    🔊
                  </span>
                </button>
                <input
                  type="text"
                  value={answers[index]?.without || ''}
                  onChange={(e) => handleInputChange(index, 'without', e.target.value)}
                  placeholder="낱말 쓰기"
                  className={`w-28 p-2 text-center text-lg font-bold rounded-lg border-2 ${checkAnswer(
                    index,
                    'without'
                  )}`}
                />
              </div>
              {/* With Batchim */}
              <div className="flex flex-col items-center space-y-2">
                <button
                  type="button"
                  onClick={() => speakKorean(item.wordWith)}
                  className="group relative rounded-xl border-2 border-white bg-white p-1 shadow-sm hover:border-emerald-300 transition-all"
                  title="그림 소리 힌트 듣기"
                >
                  <img
                    src={item.imageWith}
                    alt={item.wordWith}
                    className="w-24 h-24 rounded-lg object-contain"
                  />
                  <span className="absolute bottom-1 right-1 text-xs bg-emerald-100 text-emerald-800 rounded-full px-1.5 py-0.5 font-bold">
                    🔊
                  </span>
                </button>
                <input
                  type="text"
                  value={answers[index]?.with || ''}
                  onChange={(e) => handleInputChange(index, 'with', e.target.value)}
                  placeholder="낱말 쓰기"
                  className={`w-28 p-2 text-center text-lg font-bold rounded-lg border-2 ${checkAnswer(
                    index,
                    'with'
                  )}`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WordImageGridActivityComponent;
