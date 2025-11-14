import React, { useState, useEffect } from 'react';
import type { MultipleChoiceSentenceActivity } from '../../types';
import { playSound, SoundType } from '../../../utils/sound';

interface MultipleChoiceSentenceActivityProps {
  activity: MultipleChoiceSentenceActivity;
}

const getBlanks = (sentence: string) => {
  const blankRegex = /___|\( \)/g;
  return sentence.match(blankRegex) || [];
};
const MultipleChoiceSentenceActivityComponent: React.FC<MultipleChoiceSentenceActivityProps> = ({ activity }) => {
  const [userAnswers, setUserAnswers] = useState<string[][]>(() =>
    activity.items.map(item => Array(getBlanks(item.sentence).length).fill(''))
  );
  const [currentBlankIndices, setCurrentBlankIndices] = useState<number[]>(() =>
    activity.items.map(() => 0)
  );
  const [isCorrect, setIsCorrect] = useState<Array<boolean | null>>(() =>
    activity.items.map(() => null)
  );

  useEffect(() => {
    setUserAnswers(activity.items.map(item => Array(getBlanks(item.sentence).length).fill('')));
    setCurrentBlankIndices(activity.items.map(() => 0));
    setIsCorrect(activity.items.map(() => null));
  }, [activity]);

  const handleChoiceClick = (itemIndex: number, choice: string) => {
    if (isCorrect[itemIndex]) {
      return;
    }    
    
    playSound(SoundType.CLICK);
    
    const item = activity.items[itemIndex];
    const numBlanks = getBlanks(item.sentence).length;
    const isCommonCharCase = item.correctAnswer.length === 1 && numBlanks > 1;

    if (isCommonCharCase) {
      const isAnswerCorrect = choice === item.correctAnswer[0];
      
      const filledAnswers = userAnswers.map((arr, idx) => 
          idx === itemIndex ? Array(numBlanks).fill(choice) : arr
      );
      setUserAnswers(filledAnswers);

      const newIsCorrect = [...isCorrect];
      newIsCorrect[itemIndex] = isAnswerCorrect;
      setIsCorrect(newIsCorrect);

      if (isAnswerCorrect) {
        playSound(SoundType.SUCCESS);
      } else {
        playSound(SoundType.INCORRECT);
        setTimeout(() => {
          const resetUserAnswers = userAnswers.map((arr, idx) => idx === itemIndex ? Array(numBlanks).fill('') : arr);
          setUserAnswers(resetUserAnswers);
          const resetIsCorrect = [...isCorrect];
          resetIsCorrect[itemIndex] = null;
          setIsCorrect(resetIsCorrect);
        }, 1000);
      }
    } else {
      const currentBlankIndex = currentBlankIndices[itemIndex];

      if (currentBlankIndex >= numBlanks) {
        return;
      }

      const newUserAnswers = userAnswers.map(arr => [...arr]);
      newUserAnswers[itemIndex][currentBlankIndex] = choice;
      setUserAnswers(newUserAnswers);

      const newCurrentBlankIndices = [...currentBlankIndices];
      const nextBlankIndex = currentBlankIndex + 1;
      newCurrentBlankIndices[itemIndex] = nextBlankIndex;
      setCurrentBlankIndices(newCurrentBlankIndices);

      if (nextBlankIndex === numBlanks) {
        const isAnswerCorrect = newUserAnswers[itemIndex].every(
          (answer, answerIndex) => answer === item.correctAnswer[answerIndex]
        );

        const newIsCorrect = [...isCorrect];
        newIsCorrect[itemIndex] = isAnswerCorrect;
        setIsCorrect(newIsCorrect);

        if (isAnswerCorrect) {
          playSound(SoundType.SUCCESS);
        } else {
          playSound(SoundType.INCORRECT);
          setTimeout(() => {
            const resetUserAnswers = userAnswers.map((arr, idx) => idx === itemIndex ? Array(numBlanks).fill('') : arr);
            setUserAnswers(resetUserAnswers);

            const resetBlankIndices = [...currentBlankIndices];
            resetBlankIndices[itemIndex] = 0;
            setCurrentBlankIndices(resetBlankIndices);

            const resetIsCorrect = [...isCorrect];
            resetIsCorrect[itemIndex] = null;
            setIsCorrect(resetIsCorrect);
          }, 1000);
        }
      }
    }
  };

  const renderSentenceWithBlanks = (index: number) => {
    const item = activity.items[index];
    const sentence = item.sentence;
    const answers = userAnswers[index];
    const currentBlankIndex = currentBlankIndices[index];
    const itemIsCorrect = isCorrect[index];

    const blankRegex = /___|\( \)/g;
    const parts = sentence.split(blankRegex);
    const numBlanks = (sentence.match(blankRegex) || []).length;
    const elements: React.ReactNode[] = [];

    for (let i = 0; i < numBlanks; i++) {
      elements.push(<span key={`part-${i}`}>{parts[i]}</span>);

      const isAnswered = answers[i] !== '';
      const isCurrentBlank = i === currentBlankIndex && itemIsCorrect === null;

      let blankClassName = "inline-flex items-center justify-center text-center w-24 mx-1 px-2 py-1 rounded-md border-2 font-bold min-h-7 ";
      if (itemIsCorrect === true) {
        blankClassName += "bg-green-200 border-green-400 text-green-700";
      } else if (itemIsCorrect === false) {
        blankClassName += "bg-red-200 border-red-400 text-red-700 animate-shake";
      } else if (isCurrentBlank) {
        blankClassName += "bg-yellow-100 border-orange-400 animate-pulse";
      } else if (isAnswered) {
        blankClassName += "bg-gray-200 border-gray-400";
      } else {
        blankClassName += "bg-white border-gray-300";
      }

      elements.push(
        <span key={`blank-${i}`} className={blankClassName}>
          {answers[i] || ''}
        </span>
      );
    }
    elements.push(<span key={`part-${numBlanks}`}>{parts[numBlanks]}</span>);

    return <p className="text-2xl mb-4 text-center h-16 flex items-center justify-center">{elements}</p>
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-6 text-gray-700">
        <span className="bg-orange-200 text-orange-800 text-lg font-bold mr-2 px-2.5 py-0.5 rounded-full">{activity.activityNumber}</span>
        {activity.question}
      </h3>
      <div className="space-y-8">
        {activity.items.map((item, index) => {
          const itemIsCorrect = isCorrect[index];

          return (
              <div key={index} className="p-6 bg-lime-100 rounded-lg shadow-sm">
              {renderSentenceWithBlanks(index)}
              <div className="flex flex-wrap gap-4 justify-center mt-4">
                {item.choices.map((choice) => (
                  <button
                    key={choice}
                    onClick={() => handleChoiceClick(index, choice)}
                    disabled={itemIsCorrect === true}
                    className="px-6 py-2 text-xl font-semibold bg-white rounded-lg border-2 border-gray-300 hover:bg-orange-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {choice}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MultipleChoiceSentenceActivityComponent;
