import React, { useState } from 'react';
import { FillTheBlankInSyllableActivity as ActivityProps } from '../../types';
import { playSound, SoundType } from '../../../utils/sound';

const CorrectIcon = () => (
  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
);

const IncorrectIcon = () => (
  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
);

const FillTheBlankInSyllableActivityComponent: React.FC<{ activity: ActivityProps }> = ({ activity }) => {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [feedback, setFeedback] = useState<{ [key: number]: 'correct' | 'incorrect' }>({});

  const handleChoiceClick = (choice: string) => {
    playSound(SoundType.CLICK);
    setSelectedChoice(choice);
  };

  const handleBlankClick = (item: ActivityProps['items'][0]) => {
    if (!selectedChoice || answers[item.id]) return;

    if (selectedChoice === item.right.correctAnswer) {
      playSound(SoundType.CORRECT);
      setAnswers(prev => ({ ...prev, [item.id]: selectedChoice }));
      setFeedback(prev => ({ ...prev, [item.id]: 'correct' }));
    } else {
      playSound(SoundType.INCORRECT);
      setFeedback(prev => ({ ...prev, [item.id]: 'incorrect' }));
      setTimeout(() => {
        setFeedback(prev => {
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
        <span className="text-lg font-semibold">보기:</span>
        {activity.choices.map(choice => (
          <button
            key={choice}
            onClick={() => handleChoiceClick(choice)}
            className={`w-20 h-20 text-3xl font-bold rounded-lg border-4 transition-all ${
              selectedChoice === choice
                ? 'bg-yellow-200 border-yellow-400 scale-110'
                : 'bg-white hover:bg-lime-100 border-gray-300'
            }`}
          >
            {choice}
          </button>
        ))}
      </div>

      <div className="w-full space-y-4">
        {activity.items.map(item => (
          <div key={item.id} className="flex items-center justify-between p-4 bg-lime-50 rounded-xl shadow-sm">
            {/* Left side */}
            <div className="flex items-center justify-center gap-4 w-2/5 p-2 bg-white rounded-lg">
              <img src={item.left.image} alt={item.left.word} className="w-24 h-24 object-contain rounded-lg bg-white p-1 shadow" />
              <span className="text-3xl font-bold">{item.left.word}</span>
            </div>

            {/* Right side */}
            <div className="flex items-center justify-center gap-4 w-2/5 p-2 bg-white rounded-lg">
              <div className="flex items-center gap-1 text-4xl font-bold">
                <div className="flex flex-col items-center leading-none">
                  <span>{item.right.wordParts[0]}</span>
                  <button
                    onClick={() => handleBlankClick(item)}
                    disabled={!!answers[item.id]}
                    className={`relative w-12 h-12 mt-1 rounded-lg border-2 flex items-center justify-center text-2xl font-bold
                      ${feedback[item.id] === 'correct' ? 'bg-green-100 border-green-400' : ''}
                      ${feedback[item.id] === 'incorrect' ? 'bg-red-100 border-red-400 animate-shake' : ''}
                      ${!answers[item.id] ? 'bg-gray-100 border-dashed border-gray-400 cursor-pointer hover:bg-yellow-100' : 'border-transparent'}
                    `}
                  >
                    {answers[item.id]}
                    {feedback[item.id] === 'correct' && <div className="absolute -top-2 -right-2"><CorrectIcon /></div>}
                    {feedback[item.id] === 'incorrect' && <div className="absolute -top-2 -right-2"><IncorrectIcon /></div>}
                  </button>
                </div>
                <span>{item.right.wordParts[1]}</span>
              </div>
              <img src={item.right.image} alt="Correct word" className="w-24 h-24 object-contain" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FillTheBlankInSyllableActivityComponent;