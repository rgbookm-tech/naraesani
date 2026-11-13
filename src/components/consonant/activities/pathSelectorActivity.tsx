import React, { useState, useEffect } from 'react';
import { PathSelectorActivity as PathSelectorActivityProps } from '../../types';
import { speakKorean } from '../../../utils/hangulSpeech';

const CorrectIcon = () => (
  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IncorrectIcon = () => (
  <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PathSelectorActivity: React.FC<{ activity: PathSelectorActivityProps }> = ({ activity }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [feedback, setFeedback] = useState<{
    step: number;
    choice: string;
    status: 'correct' | 'incorrect';
  } | null>(null);

  useEffect(() => {
    setCurrentStep(0);
    setFeedback(null);
  }, [activity]);

  const handleChoiceClick = (
    stepIndex: number,
    promptWord: string,
    choice: { image: string; isCorrect: boolean }
  ) => {
    if (stepIndex !== currentStep || feedback) {
      return;
    }

    if (choice.isCorrect) {
      speakKorean(`${promptWord}! 정답!`);
    } else {
      speakKorean('다시 골라 보세요.');
    }

    setFeedback({
      step: stepIndex,
      choice: choice.image,
      status: choice.isCorrect ? 'correct' : 'incorrect',
    });

    setTimeout(() => {
      if (choice.isCorrect) {
        setCurrentStep((prev) => prev + 1);
      }
      setFeedback(null);
    }, 900);
  };

  const isFinished = currentStep >= activity.steps.length;

  return (
    <div className="w-full p-2">
      <h3 className="text-xl font-bold text-center mb-4 text-gray-700">{activity.question}</h3>
      <div className="relative w-full bg-sky-100 rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col-reverse items-center space-y-8 space-y-reverse">
        {/* 출발점 */}
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold bg-blue-500 text-white px-6 py-2 rounded-full shadow-md">
            출발
          </span>
        </div>

        {/* 각 단계 */}
        {activity.steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center space-y-2 min-h-[140px]">
            {currentStep >= index && (
              <>
                {currentStep === index && (
                  <>
                    <button
                      type="button"
                      onClick={() => speakKorean(step.prompt)}
                      className="bg-white hover:bg-amber-50 px-5 py-1.5 rounded-full shadow border border-sky-200 flex items-center gap-1.5"
                    >
                      <span className="text-xl font-black text-gray-800">{step.prompt}</span>
                      <span className="text-sm">🔊</span>
                    </button>
                    <div className="flex gap-4 mt-2">
                      {step.choices.map((choice, choiceIndex) => {
                        const isSelected = feedback?.choice === choice.image;
                        let animationClass = '';
                        if (isSelected) {
                          animationClass =
                            feedback.status === 'correct' ? 'animate-bounce' : 'animate-shake';
                        }

                        return (
                          <button
                            key={choiceIndex}
                            type="button"
                            onClick={() => handleChoiceClick(index, step.prompt, choice)}
                            className={`relative w-28 h-28 p-2 bg-white rounded-2xl shadow-lg border-4 transition-all duration-300 transform hover:scale-105 ${animationClass}
                              ${isSelected && feedback.status === 'correct' ? 'border-green-500' : ''}
                              ${isSelected && feedback.status === 'incorrect' ? 'border-red-500' : ''}
                              ${!isSelected ? 'border-transparent' : ''}
                            `}
                          >
                            <img
                              src={choice.image}
                              alt={step.prompt}
                              className="w-full h-full object-contain"
                            />
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

                {currentStep > index && (
                  <button
                    type="button"
                    onClick={() => speakKorean(step.prompt)}
                    className="relative w-28 h-28 flex items-center justify-center bg-green-100 rounded-2xl shadow-inner"
                  >
                    <img
                      src={step.choices.find((c) => c.isCorrect)?.image}
                      alt={`${step.prompt} 정답`}
                      className="w-24 h-24 object-contain opacity-80"
                    />
                    <div className="absolute">
                      <CorrectIcon />
                    </div>
                  </button>
                )}
              </>
            )}
          </div>
        ))}

        {/* 도착점 */}
        <div className="flex flex-col items-center">
          <span
            className={`text-2xl font-bold text-white px-6 py-2 rounded-full shadow-md transition-colors ${
              isFinished ? 'bg-red-500' : 'bg-gray-400'
            }`}
          >
            도착
          </span>
          {isFinished && (
            <div className="mt-2 text-2xl font-bold text-green-600 animate-bounce">
              참 잘했어요!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PathSelectorActivity;
