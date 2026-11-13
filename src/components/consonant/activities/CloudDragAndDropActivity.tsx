import React, { useState, useMemo } from 'react';
import { CloudDragAndDropActivity as ActivityProps } from '../../types';
import { playSound, SoundType } from '../../../utils/sound';
import { speakKorean } from '../../../utils/hangulSpeech';

const cloudShapes: { [key: string]: string } = {
  cloud1:
    'M145.7,62.3c-2.3-20.9-20.4-37.2-42.3-37.2c-17.9,0-33.1,11.1-39.1,26.9c-3.9-2.3-8.5-3.6-13.4-3.6c-15.9,0-28.8,12.9-28.8,28.8c0,5.7,1.7,11,4.5,15.4z',
  cloud2:
    'M88.4,30.2c-20-4.2-38.3,9.2-42.5,29.2c-2.1-1.3-4.5-2-7-2c-8.8,0-16,7.2-16,16s7.2,16,16,16h72c13.3,0,24-10.7,24-24C118.8,47.9,105.3,34.4,88.4,30.2z',
  cloud3:
    'M83.4,28.3c-14.4-0.6-27.3,8.4-31.4,21.9c-2.3-1.5-5-2.4-7.9-2.4c-9.8,0-17.7,7.9-17.7,17.7s7.9,17.7,17.7,17.7h72.8c11,0,20-9,20-20s-9-20-20-20C92.3,43.2,87.3,34.5,83.4,28.3z',
};

const DraggableCloud: React.FC<{
  shape: string;
  text: string;
  isSelected?: boolean;
}> = ({ shape, text, isSelected }) => (
  <div
    className={`relative w-40 h-24 cursor-pointer transition-transform ${
      isSelected ? 'scale-110' : 'hover:scale-105'
    }`}
  >
    <svg viewBox="0 0 160 100" className="w-full h-full drop-shadow-lg">
      <path
        d={cloudShapes[shape]}
        fill={isSelected ? '#fef3c7' : '#fff'}
        stroke={isSelected ? '#f59e0b' : '#a7f3d0'}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <text
        x="50%"
        y="50%"
        dy=".3em"
        textAnchor="middle"
        className="text-xl font-bold text-gray-800 select-none fill-current"
      >
        {text}
      </text>
    </svg>
  </div>
);

const CloudDragAndDropActivityComponent: React.FC<{ activity: ActivityProps }> = ({ activity }) => {
  const [droppedAnswers, setDroppedAnswers] = useState<{ [key: string]: string | null }>({});
  const [selectedCloud, setSelectedCloud] = useState<{ answer: string; shape: string } | null>(null);
  const [feedback, setFeedback] = useState<{ id: string; status: 'correct' | 'incorrect' } | null>(
    null
  );

  const tryMatchItem = (
    item: ActivityProps['items'][0],
    candidateAnswer: string,
    candidateShape: string
  ) => {
    if (droppedAnswers[item.id]) return;

    if (candidateAnswer === item.answer && candidateShape === item.cloudShape) {
      playSound(SoundType.CORRECT);
      setDroppedAnswers((prev) => ({ ...prev, [item.id]: candidateAnswer }));
      setFeedback({ id: item.id, status: 'correct' });
      speakKorean(`${item.sentence[0]}${candidateAnswer}${item.sentence[1]}`);
      setSelectedCloud(null);
    } else {
      playSound(SoundType.INCORRECT);
      setFeedback({ id: item.id, status: 'incorrect' });
    }
    setTimeout(() => setFeedback(null), 800);
  };

  const handleDragStart = (e: React.DragEvent, answer: string, shape: string) => {
    e.dataTransfer.setData('text/plain', `${answer},${shape}`);
    e.dataTransfer.effectAllowed = 'move';
    speakKorean(answer);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, item: ActivityProps['items'][0]) => {
    e.preventDefault();
    const [droppedAnswer, droppedShape] = e.dataTransfer.getData('text/plain').split(',');
    tryMatchItem(item, droppedAnswer, droppedShape);
  };

  const handleCloudClick = (answer: string, shape: string) => {
    speakKorean(answer);
    playSound(SoundType.CLICK);
    setSelectedCloud((prev) => (prev?.answer === answer ? null : { answer, shape }));
  };

  const handleSlotClick = (item: ActivityProps['items'][0]) => {
    if (droppedAnswers[item.id]) {
      speakKorean(`${item.sentence[0]}${droppedAnswers[item.id]}${item.sentence[1]}`);
      return;
    }
    if (!selectedCloud) return;
    tryMatchItem(item, selectedCloud.answer, selectedCloud.shape);
  };

  const shuffledAnswers = useMemo(
    () => [...activity.items].sort(() => Math.random() - 0.5),
    [activity.items]
  );

  return (
    <div className="p-2 sm:p-4">
      <h3 className="text-xl sm:text-2xl font-bold text-center mb-6 text-gray-700">
        {activity.question}
      </h3>

      <div className="space-y-6 mb-10">
        {activity.items.map((item, index) => {
          const isDropped = !!droppedAnswers[item.id];
          let feedbackClass = '';
          if (feedback?.id === item.id) {
            feedbackClass = feedback.status === 'correct' ? 'animate-bounce' : 'animate-shake';
          }

          return (
            <div
              key={item.id}
              className={`flex flex-wrap items-center justify-center text-xl sm:text-2xl p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 ${feedbackClass}`}
            >
              <span className="bg-emerald-200 text-emerald-900 font-black text-base px-2.5 py-0.5 rounded-full mr-3">
                {index + 1}
              </span>
              <span className="font-semibold">{item.sentence[0]}</span>
              <button
                type="button"
                onClick={() => handleSlotClick(item)}
                onDrop={(e) => handleDrop(e, item)}
                onDragOver={handleDragOver}
                className="relative w-36 h-20 sm:w-40 sm:h-24 inline-block mx-1 focus:outline-none"
                title={isDropped ? '클릭하여 문장 듣기' : '구름을 선택한 뒤 여기를 클릭하세요'}
              >
                <svg viewBox="0 0 160 100" className="w-full h-full">
                  <path
                    d={cloudShapes[item.cloudShape]}
                    fill={isDropped ? '#dcfce7' : selectedCloud ? '#fef9c3' : '#f3f4f6'}
                    stroke={isDropped ? '#22c55e' : selectedCloud ? '#f59e0b' : '#9ca3af'}
                    strokeWidth="2.5"
                    strokeDasharray={isDropped ? undefined : '6'}
                  />
                  {isDropped && (
                    <text
                      x="50%"
                      y="50%"
                      dy=".3em"
                      textAnchor="middle"
                      className="text-2xl font-bold text-green-700 fill-current"
                    >
                      {droppedAnswers[item.id]}
                    </text>
                  )}
                </svg>
              </button>
              <span className="font-semibold">{item.sentence[1]}</span>
              <button
                type="button"
                onClick={() =>
                  speakKorean(
                    `${item.sentence[0]}${droppedAnswers[item.id] || '빈칸'}${item.sentence[1]}`
                  )
                }
                className="ml-3 w-8 h-8 rounded-full bg-white hover:bg-emerald-100 border border-emerald-200 text-sm flex items-center justify-center shadow-sm"
                title="문장 소리 듣기"
              >
                🔊
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap justify-around items-center gap-3 p-4 bg-sky-100 rounded-2xl min-h-[140px]">
        {shuffledAnswers.map((item) => {
          const isUsed = Object.values(droppedAnswers).includes(item.answer);
          return (
            <div
              key={item.id}
              draggable={!isUsed}
              onDragStart={(e) => handleDragStart(e, item.answer, item.cloudShape)}
              onClick={() => !isUsed && handleCloudClick(item.answer, item.cloudShape)}
              className={`transition-opacity duration-300 ${
                isUsed ? 'opacity-20 pointer-events-none' : 'cursor-pointer'
              }`}
            >
              <DraggableCloud
                shape={item.cloudShape}
                text={item.answer}
                isSelected={selectedCloud?.answer === item.answer}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CloudDragAndDropActivityComponent;
