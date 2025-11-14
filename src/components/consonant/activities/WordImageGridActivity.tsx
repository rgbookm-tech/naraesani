import React, { useState } from 'react';
import type { WordImageGridActivity } from '../../types';
import { playSound, SoundType } from '../../../utils/sound';

interface WordImageGridActivityProps {
  activity: WordImageGridActivity;
}

const WordImageGridActivityComponent: React.FC<WordImageGridActivityProps> = ({ activity }) => {
    const [answers, setAnswers] = useState<{ [key: number]: { with: string, without: string } }>({});

    const handleInputChange = (index: number, type: 'with' | 'without', value: string) => {
        setAnswers(prev => ({
            ...prev,
            [index]: {
                ...prev[index],
                [type]: value,
            }
        }));

        const item = activity.items[index];
        const correctAnswer = type === 'with' ? item.wordWith : item.wordWithout;

        if (value === correctAnswer) {
            playSound(SoundType.CORRECT);
        } else if (value.length >= correctAnswer.length) {
            playSound(SoundType.INCORRECT);
        }
    };

    const checkAnswer = (index: number, type: 'with' | 'without') => {
        const item = activity.items[index];
        const userAnswer = answers[index]?.[type];
        if (!userAnswer) return 'border-gray-300';
        
        const correctAnswer = type === 'with' ? item.wordWith : item.wordWithout;
        return userAnswer === correctAnswer ? 'border-green-500' : 'border-red-500';
    };

    return (
        <div>
            <h3 className="text-xl font-semibold mb-6 text-gray-700">
                <span className="bg-orange-200 text-orange-800 text-lg font-bold mr-2 px-2.5 py-0.5 rounded-full">{activity.activityNumber}</span>
                {activity.question}
            </h3>
            {activity.example && (
                <div className="bg-gray-100 p-3 rounded-md mb-4 text-center">
                <p className="text-lg text-gray-700 font-semibold tracking-widest">{activity.example}</p>
                </div>
            )}            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activity.items.map((item, index) => (
                    <div key={index} className="bg-lime-100 p-4 rounded-lg shadow-sm">
                        <div className="grid grid-cols-2 gap-4">
                            {/* Without Batchim */}
                            <div className="flex flex-col items-center space-y-2">
                                <img src={item.imageWithout} alt={item.wordWithout} className="w-24 h-24 rounded-lg border-2 object-contain border-white"/>
                                <input
                                    type="text"
                                    value={answers[index]?.without || ''}
                                    onChange={(e) => handleInputChange(index, 'without', e.target.value)}
                                    className={`w-24 p-2 text-center text-lg font-bold rounded-md border-2 ${checkAnswer(index, 'without')}`}
                                />
                            </div>
                            {/* With Batchim */}
                            <div className="flex flex-col items-center space-y-2">
                                <img src={item.imageWith} alt={item.wordWith} className="w-24 h-24 rounded-lg border-2 object-contain border-white"/>
                                <input
                                    type="text"
                                    value={answers[index]?.with || ''}
                                    onChange={(e) => handleInputChange(index, 'with', e.target.value)}
                                     className={`w-24 p-2 text-center text-lg font-bold rounded-md border-2 ${checkAnswer(index, 'with')}`}
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
