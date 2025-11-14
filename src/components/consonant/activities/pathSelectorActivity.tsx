// d:\앱북\나래와산이_받침편\src\components\activities\PathSelectorActivity.tsx
import React, { useState, useEffect } from 'react';
import { PathSelectorActivity as PathSelectorActivityProps } from '../../types';

// 간단한 피드백 아이콘
const CorrectIcon = () => (
  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
);

const IncorrectIcon = () => (
  <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
);

const PathSelectorActivity: React.FC<{ activity: PathSelectorActivityProps }> = ({ activity }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [feedback, setFeedback] = useState<{ step: number; choice: string; status: 'correct' | 'incorrect' } | null>(null);

  // 활동이 변경되면 상태를 초기화합니다.
  useEffect(() => {
    setCurrentStep(0);
    setFeedback(null);
  }, [activity]);

  const handleChoiceClick = (stepIndex: number, choice: { image: string; isCorrect: boolean }) => {
    // 현재 단계가 아니거나 이미 피드백이 진행 중이면 클릭을 무시합니다.
    if (stepIndex !== currentStep || feedback) {
      return;
    }

    setFeedback({ step: stepIndex, choice: choice.image, status: choice.isCorrect ? 'correct' : 'incorrect' });

    setTimeout(() => {
      if (choice.isCorrect) {
        setCurrentStep(prev => prev + 1);
      }
      setFeedback(null);
    }, 1000);
  };

  const isFinished = currentStep >= activity.steps.length;

  return (
    <div className="w-full p-4">
      <h3 className="text-xl font-bold text-center mb-4">{activity.question}</h3>
      <div
        className="relative w-full bg-sky-100 rounded-2xl shadow-lg p-8 flex flex-col-reverse items-center space-y-8 space-y-reverse"
      >
        {/* 출발점 (가장 아래에 표시됨) */}
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold bg-blue-500 text-white px-6 py-2 rounded-full shadow-md">출발</span>
        </div>

        {/* 각 단계 (아래에서 위로 쌓임) */}
        {activity.steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center space-y-2 min-h-[140px]">
            {/* 현재 단계이거나 이미 지난 단계일 때만 렌더링 */}
            {currentStep >= index && (
              <>
                {/* 현재 단계의 선택지 */}
                {currentStep === index && (
                  <>
                    <div className="bg-white/80 px-4 py-1 rounded-full shadow">
                      <span className="text-lg font-bold text-gray-700">{step.prompt}</span>
                    </div>
                    <div className="flex gap-4 mt-2">
                      {step.choices.map((choice, choiceIndex) => {
                        const isSelected = feedback?.choice === choice.image;
                        let animationClass = '';
                        if (isSelected) {
                          animationClass = feedback.status === 'correct' ? 'animate-bounce' : 'animate-shake';
                        }

                        return (
                          <button
                            key={choiceIndex}
                            onClick={() => handleChoiceClick(index, choice)}
                            className={`relative w-28 h-28 p-2 bg-white rounded-2xl shadow-lg border-4 transition-all duration-300 transform hover:scale-105 ${animationClass}
                              ${isSelected && feedback.status === 'correct' ? 'border-green-500' : ''}
                              ${isSelected && feedback.status === 'incorrect' ? 'border-red-500' : ''}
                              ${!isSelected ? 'border-transparent' : ''}
                            `}
                          >
                            <img src={choice.image} alt={step.prompt} className="w-full h-full object-contain" />
                            {isSelected && (
                              <div className="absolute -top-3 -right-3">
                                {feedback.status === 'correct' ? <CorrectIcon /> : <IncorrectIcon />}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}

                {/* 완료된 단계 표시 */}
                {currentStep > index && (
                  <div className="w-28 h-28 flex items-center justify-center bg-green-100 rounded-2xl shadow-inner">
                    <img
                      src={step.choices.find(c => c.isCorrect)?.image}
                      alt={`${step.prompt} 정답`}
                      className="w-24 h-24 object-contain opacity-70"
                    />
                    <div className="absolute">
                      <CorrectIcon />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ))}

        {/* 도착점 (가장 위에 표시됨) */}
        <div className="flex flex-col items-center">
          <span className={`text-2xl font-bold text-white px-6 py-2 rounded-full shadow-md transition-colors ${isFinished ? 'bg-red-500' : 'bg-gray-400'}`}>도착</span>
          {isFinished && (
            <div className="mt-2 text-2xl font-bold text-green-600 animate-bounce">참 잘했어요!</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PathSelectorActivity;
