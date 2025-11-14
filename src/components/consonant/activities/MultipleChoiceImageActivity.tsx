import React, { useState } from 'react';
import { MultipleChoiceImageActivity as ActivityProps } from '../../types';
import { playSound, SoundType } from '../../../utils/sound';

// 정답/오답 시각적 피드백을 위한 아이콘 컴포넌트
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

interface MultipleChoiceImageActivityProps {
  activity: ActivityProps;
}

const MultipleChoiceImageActivityComponent: React.FC<MultipleChoiceImageActivityProps> = ({ activity }) => {
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>(Array(activity.items.length).fill(null));

  const handleChoiceClick = (itemIndex: number, choice: string) => {
    const currentAnswer = userAnswers[itemIndex];
    // 이미 정답을 맞혔다면 더 이상 선택할 수 없도록 합니다.
    if (currentAnswer !== null && activity.items[itemIndex].correctAnswer.includes(currentAnswer)) {
      return;
    }

    playSound(SoundType.CLICK);
    const newAnswers = [...userAnswers];
    newAnswers[itemIndex] = choice;
    setUserAnswers(newAnswers);

    // 선택한 답이 정답 배열에 포함되어 있는지 확인합니다.
    if (activity.items[itemIndex].correctAnswer.includes(choice)) {
      playSound(SoundType.CORRECT);
    } else {
      playSound(SoundType.INCORRECT);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-6 text-gray-700 text-center">
        {activity.question}
      </h3>
      <div className="space-y-6">
        {activity.items.map((item, itemIndex) => {
          const selectedAnswer = userAnswers[itemIndex];
          const isAnswered = selectedAnswer !== null;
          const isCorrectlyAnswered = isAnswered && item.correctAnswer.includes(selectedAnswer);
          
          return (
            <div key={itemIndex} className="flex items-center justify-center gap-4 p-4 bg-lime-100 rounded-lg">
              {/* 이미지와 왼쪽 텍스트 */}
              <div className="w-2/5 flex items-center justify-end gap-4">
                {item.leftText && <span className="text-2xl font-semibold text-gray-700 text-right">{item.leftText}</span>}
                <img src={item.image} alt={`Activity for ${item.correctAnswer[0]}`} className="w-40 h-28 object-contain rounded-lg shadow-md bg-white p-1" />
              </div>
              
              {/* 선택지와 오른쪽 텍스트 */}
              <div className="w-3/5 flex items-center justify-start gap-4">
                <div className="flex flex-wrap gap-4 items-center">
                    {item.choices.map((choice) => {
                        const isSelected = userAnswers[itemIndex] === choice;
                        const isCorrect = isSelected && item.correctAnswer.includes(choice);
                        
                        let buttonClass = 'bg-white hover:bg-orange-100 border-gray-300';
                        if (isSelected) {
                            buttonClass = isCorrect ? 'bg-green-200 border-green-400' : 'bg-red-200 border-red-400';
                        }

                        return (
                            <button
                            key={choice}
                            onClick={() => handleChoiceClick(itemIndex, choice)}
                            disabled={isCorrectlyAnswered}
                            className={`relative px-6 py-3 text-xl font-semibold rounded-lg border-2 transition-all disabled:cursor-not-allowed ${buttonClass}`}
                            >
                            {choice}
                            {isSelected && (
                                <div className="absolute -top-2 -right-2">
                                    {isCorrect ? <CorrectIcon /> : <IncorrectIcon />}
                                </div>
                            )}
                            </button>
                        );
                    })}
                </div>
                {item.rightText && <span className="text-2xl font-semibold text-gray-700">{item.rightText}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MultipleChoiceImageActivityComponent;
