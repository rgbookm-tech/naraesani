import React, { useState, useMemo } from 'react';
import { CloudDragAndDropActivity as ActivityProps } from '../../types';
import { playSound, SoundType } from '../../../utils/sound';

const cloudShapes: { [key: string]: string } = {
  cloud1: "M145.7,62.3c-2.3-20.9-20.4-37.2-42.3-37.2c-17.9,0-33.1,11.1-39.1,26.9c-3.9-2.3-8.5-3.6-13.4-3.6c-15.9,0-28.8,12.9-28.8,28.8c0,5.7,1.7,11,4.5,15.4z",
  cloud2: "M88.4,30.2c-20-4.2-38.3,9.2-42.5,29.2c-2.1-1.3-4.5-2-7-2c-8.8,0-16,7.2-16,16s7.2,16,16,16h72c13.3,0,24-10.7,24-24C118.8,47.9,105.3,34.4,88.4,30.2z",
  cloud3: "M83.4,28.3c-14.4-0.6-27.3,8.4-31.4,21.9c-2.3-1.5-5-2.4-7.9-2.4c-9.8,0-17.7,7.9-17.7,17.7s7.9,17.7,17.7,17.7h72.8c11,0,20-9,20-20s-9-20-20-20C92.3,43.2,87.3,34.5,83.4,28.3z"
};

const DraggableCloud = ({ shape, text, ...props }) => (
  <div className="relative w-40 h-24 cursor-grab active:cursor-grabbing" {...props}>
    <svg viewBox="0 0 160 100" className="w-full h-full drop-shadow-lg">
      <path d={cloudShapes[shape]} fill="#fff" stroke="#a7f3d0" strokeWidth="4" strokeLinejoin="round" />
      <text x="50%" y="50%" dy=".3em" textAnchor="middle" className="text-xl font-bold text-gray-700 select-none fill-current">{text}</text>
    </svg>
  </div>
);

const CloudDragAndDropActivityComponent: React.FC<{ activity: ActivityProps }> = ({ activity }) => {
  const [droppedAnswers, setDroppedAnswers] = useState<{ [key: string]: string | null }>({});
  const [feedback, setFeedback] = useState<{ id: string, status: 'correct' | 'incorrect' } | null>(null);

  const handleDragStart = (e: React.DragEvent, answer: string, shape: string) => {
    e.dataTransfer.setData('text/plain', `${answer},${shape}`);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, item: ActivityProps['items'][0]) => {
    e.preventDefault();
    const [droppedAnswer, droppedShape] = e.dataTransfer.getData('text/plain').split(',');

    if (droppedAnswers[item.id]) return;

    if (droppedAnswer === item.answer && droppedShape === item.cloudShape) {
      playSound(SoundType.CORRECT);
      setDroppedAnswers(prev => ({ ...prev, [item.id]: droppedAnswer }));
      setFeedback({ id: item.id, status: 'correct' });
    } else {
      playSound(SoundType.INCORRECT);
      setFeedback({ id: item.id, status: 'incorrect' });
    }
    setTimeout(() => setFeedback(null), 800);
  };

  const shuffledAnswers = useMemo(() =>
    [...activity.items].sort(() => Math.random() - 0.5),
    [activity.items]
  );

  return (
    <div className="p-4">
      <h3 className="text-2xl font-bold text-center mb-8">{activity.question}</h3>

      <div className="space-y-8 mb-12">
        {activity.items.map((item, index) => {
          const isDropped = !!droppedAnswers[item.id];
          let feedbackClass = '';
          if (feedback?.id === item.id) {
            feedbackClass = feedback.status === 'correct' ? 'animate-bounce' : 'animate-shake';
          }

          return (
            <div key={item.id} className={`flex items-center justify-center text-2xl p-4 rounded-lg ${feedbackClass}`}>
              <span className="bg-white/50 px-2 py-1 rounded">{index + 1}</span>
              <span className="ml-4">{item.sentence[0]}</span>
              <div
                onDrop={(e) => handleDrop(e, item)}
                onDragOver={handleDragOver}
                className="relative w-40 h-24 inline-block mx-0"
              >
                <svg viewBox="0 0 160 100" className="w-full h-full">
                  <path d={cloudShapes[item.cloudShape]} fill={isDropped ? "#dcfce7" : "#f3f4f6"} stroke="#9ca3af" strokeWidth="2" strokeDasharray="6" />
                  {isDropped && (
                    <text x="50%" y="50%" dy=".3em" textAnchor="middle" className="text-2xl font-bold text-green-700 fill-current">{droppedAnswers[item.id]}</text>
                  )}
                </svg>
              </div>
              <span>{item.sentence[1]}</span>
            </div>
          );
        })}
      </div>

      <div className="flex justify-around items-center p-4 bg-sky-100 rounded-2xl min-h-[150px]">
        {shuffledAnswers.map(item => {
          const isUsed = Object.values(droppedAnswers).includes(item.answer);
          return (
            <div
              key={item.id}
              draggable={!isUsed}
              onDragStart={(e) => handleDragStart(e, item.answer, item.cloudShape)}
              className={`transition-opacity duration-300 ${isUsed ? 'opacity-20' : 'cursor-grab'}`}
            >
              <DraggableCloud shape={item.cloudShape} text={item.answer} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CloudDragAndDropActivityComponent;
