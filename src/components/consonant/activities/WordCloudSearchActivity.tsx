import React, { useState } from 'react';
import type { WordCloudSearchActivity } from '../../types';
import { playSound, SoundType } from '../../../utils/sound';

interface WordCloudSearchActivityProps {
  activity: WordCloudSearchActivity;
}

const WordCloudSearchActivityComponent: React.FC<WordCloudSearchActivityProps> = ({ activity }) => {
    const [selectedWords, setSelectedWords] = useState<Set<string>>(new Set());

    const handleWordClick = (word: { text: string; isTarget: boolean }) => {
        playSound(SoundType.CLICK);
        if (word.isTarget) {
            playSound(SoundType.CORRECT);
            setSelectedWords(prev => new Set(prev).add(word.text));
        } else {
            playSound(SoundType.INCORRECT);
        }
    };
    
    return (
        <div>
            <h3 className="text-xl font-semibold mb-6 text-gray-700">
                <span className="bg-orange-200 text-orange-800 text-lg font-bold mr-2 px-2.5 py-0.5 rounded-full">{activity.activityNumber}</span>
                {activity.question}
            </h3>
            <div className="relative h-96 w-full bg-lime-100 rounded-lg p-4 border-2 border-dashed border-lime-300 flex items-center justify-center">
                {activity.words.map((word, index) => {
                    const isSelected = selectedWords.has(word.text);
                    const styles = [
                        { top: '15%', left: '10%', transform: 'rotate(-10deg)', fontSize: '1.5rem' },
                        { top: '10%', left: '40%', transform: 'rotate(5deg)', fontSize: '1.8rem' },
                        { top: '20%', left: '70%', transform: 'rotate(-5deg)', fontSize: '1.6rem' },
                        { top: '45%', left: '5%', transform: 'rotate(8deg)', fontSize: '1.7rem' },
                        { top: '60%', left: '30%', transform: 'rotate(-15deg)', fontSize: '2rem' },
                        { top: '80%', left: '65%', transform: 'rotate(12deg)', fontSize: '1.5rem' },
                        { top: '40%', left: '40%', transform: 'rotate(160deg)', fontSize: '2.3rem' },
                        { top: '75%', left: '15%', transform: 'rotate(10deg)', fontSize: '1.6rem' },
                        { top: '65%', left: '80%', transform: 'rotate(-8deg)', fontSize: '1.9rem' },
                        { top: '80%', left: '50%', transform: 'rotate(3deg)', fontSize: '1.7rem' },
                        { top: '30%', left: '25%', transform: 'rotate(0deg)', fontSize: '1.8rem' },
                    ];
                    
                    return (
                        <button
                            key={index}
                            onClick={() => handleWordClick(word)}
                            style={styles[index % styles.length]}
                            className={`absolute font-bold transition-all duration-300 cursor-pointer p-2 rounded-md ${
                                isSelected ? 'bg-green-400 text-white scale-110' : 'bg-transparent text-gray-600 hover:text-orange-500'
                            }`}
                        >
                            {word.text}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default WordCloudSearchActivityComponent;
