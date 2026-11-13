import React, { useState, useEffect, useRef } from 'react';
import type { RadialFillInTheBlanksActivity } from '../../types';
import { playSound, SoundType } from '../../../utils/sound';
import { speakKorean } from '../../../utils/hangulSpeech';

interface RadialFillInTheBlanksActivityProps {
  activity: RadialFillInTheBlanksActivity;
}

const RadialFillInTheBlanksActivityComponent: React.FC<RadialFillInTheBlanksActivityProps> = ({ activity }) => {
  const [answer, setAnswer] = useState('');
  const isCorrect = answer === activity.correctAnswer;
  const hasMounted = useRef(false);

  useEffect(() => {
    if (hasMounted.current) {
      if (isCorrect) {
        playSound(SoundType.SUCCESS);
        speakKorean(`${activity.correctAnswer}! 참 잘했어요!`);
      }
    } else {
      hasMounted.current = true;
    }
  }, [isCorrect, activity.correctAnswer]);

  const words = activity.words;
  const angleStep = 360 / words.length;

  const BlankBox = () => (
    <span className={`w-10 h-10 rounded-md border-2 flex items-center justify-center text-xl font-bold ${isCorrect ? 'bg-green-200 border-green-400' : 'bg-white border-gray-300'}`}>
      {answer}
    </span>
  );

  return (
    <div>
      <h3 className="text-xl font-semibold mb-12 text-gray-700 text-center">
        <span className="bg-orange-200 text-orange-800 text-lg h-7 w-7 font-bold mr-2 px-2.5 py-0.5 rounded-full">{activity.activityNumber}</span>
        {activity.question}
      </h3>
      <div className="relative w-full h-96 flex items-center justify-center">
        {/* Central input box */}
        <div className="z-10">
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            maxLength={1}
            className={`w-24 h-24 p-4 text-5xl text-center font-bold border-4 rounded-full transition-all duration-300 ${
              isCorrect
                ? 'bg-green-200 border-green-500 text-green-600 animate-bounce'
                : 'bg-white border-gray-300 focus:border-orange-400 focus:ring-orange-400'
            }`}
          />
        </div>

        {/* Radial words */}
        {words.map((wordInfo, index) => {
          const angle = angleStep * index - 90; // Start from top
          const radius = 160; // in pixels
          const x = radius * Math.cos((angle * Math.PI) / 180);
          const y = radius * Math.sin((angle * Math.PI) / 180);

          return (
            <div
              key={index}
              className="absolute flex items-center justify-center"
              style={{
                transform: `translate(${x}px, ${y}px)`,
              }}
            >
              <button
                type="button"
                onClick={() => {
                  const filled = answer || '빈칸';
                  const spoken =
                    wordInfo.blankPosition === 'before'
                      ? `${filled}${wordInfo.text}`
                      : `${wordInfo.text}${filled}`;
                  speakKorean(spoken);
                }}
                className="flex items-center gap-1 p-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg shadow-sm transition-transform active:scale-95"
                title="클릭하여 소리 듣기"
              >
                {wordInfo.blankPosition === 'before' && <BlankBox />}
                <span className="text-2xl font-bold">{wordInfo.text}</span>
                {wordInfo.blankPosition === 'after' && <BlankBox />}
              </button>
            </div>
          );
        })}
      </div>
      {isCorrect && <p className="mt-4 text-center text-xl font-bold text-green-600">참 잘했어요!</p>}
    </div>
  );
};

export default RadialFillInTheBlanksActivityComponent;
