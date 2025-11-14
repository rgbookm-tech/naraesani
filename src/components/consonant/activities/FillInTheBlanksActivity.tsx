import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { FillInTheBlanksActivity } from '../../types';
import { playSound, SoundType } from '../../../utils/sound';

interface FillInTheBlanksActivityProps {
  activity: FillInTheBlanksActivity;
}

const FillInTheBlanksActivityComponent: React.FC<FillInTheBlanksActivityProps> = ({ activity }) => {
  const [answer, setAnswer] = useState('');
  const isCorrect = activity.correctAnswer ? answer === activity.correctAnswer : false;
  const hasMounted = useRef(false);

  // Canvas state and refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    // Play sound only on subsequent updates, not on initial mount
    if (hasMounted.current) {
      if (isCorrect) {
        playSound(SoundType.SUCCESS);
      }
    } else {
      hasMounted.current = true;
    }
  }, [isCorrect]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas dimensions to match the display size for high DPI screens
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width * window.devicePixelRatio; 
    canvas.height = height * window.devicePixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const context = canvas.getContext('2d');
    if (!context) return;
    
    context.scale(window.devicePixelRatio, window.devicePixelRatio);
    context.lineCap = 'round';
    context.strokeStyle = '#4b5563'; // gray-600
    context.lineWidth = 4;
    contextRef.current = context;
  }, []);

  const getCoords = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>): { x: number; y: number } | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      
      const rect = canvas.getBoundingClientRect();

      if ('touches' in event.nativeEvent) {
          const touch = event.nativeEvent.touches[0];
          if (!touch) return null;
          return {
              x: touch.clientX - rect.left,
              y: touch.clientY - rect.top
          };
      }
      
      const mouseEvent = event as React.MouseEvent<HTMLCanvasElement>;
      return {
          x: mouseEvent.nativeEvent.offsetX,
          y: mouseEvent.nativeEvent.offsetY
      };
  };

  const startDrawing = useCallback((event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const context = contextRef.current;
    const coords = getCoords(event);
    if (!context || !coords) return;
    
    context.beginPath();
    context.moveTo(coords.x, coords.y);
    setIsDrawing(true);
    event.preventDefault();
  }, []);

  const draw = useCallback((event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const context = contextRef.current;
    const coords = getCoords(event);
    if (!context || !coords) return;
    
    context.lineTo(coords.x, coords.y);
    context.stroke();
    event.preventDefault();
  }, [isDrawing]);

  const finishDrawing = useCallback(() => {
    const context = contextRef.current;
    if (!context) return;
    
    context.closePath();
    setIsDrawing(false);
  }, []);
  
  const clearCanvas = () => {
      playSound(SoundType.CLICK);
      const canvas = canvasRef.current;
      const context = contextRef.current;
      if (!canvas || !context) return;

      context.clearRect(0, 0, canvas.width, canvas.height);
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-6 text-gray-700">
        <span className="bg-orange-200 text-orange-800 text-lg h-7 w-7 font-bold mr-2 px-2.5 py-0.5 rounded-full">{activity.activityNumber}</span>
        {activity.question}
      </h3>
      <div className="space-y-4 text-lg">
        {activity.sentences.map((sentence, index) => {
          const parts = sentence.split('___');
          return (
            <p key={index} className="bg-lime-100 p-3 rounded-md leading-loose whitespace-pre-wrap tracking-wider">
              {parts.map((part, i) => (
                <React.Fragment key={i}>
                  {part}
                  {i < parts.length - 1 && (
                    <span className={`inline-flex items-center justify-center align-bottom text-center w-8 min-h-7 ml-1 mr-1 rounded-md border-2 ${isCorrect ? 'bg-green-200 border-green-400' : 'bg-white border-gray-300'}`}>
                      {answer}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </p>
          );
        })}
      </div>
      <div className="mt-8 flex flex-col md:flex-row items-center gap-6 p-4 border-2 border-dashed border-lime-300 rounded-lg">
        <div className="flex-1 w-full">
            <h4 className="font-semibold mb-2 text-center">글씨를 써보세요.</h4>
            <input 
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                maxLength={1}
                className={`w-full p-4 text-4xl text-center font-bold border-2 rounded-lg ${isCorrect ? 'border-green-500 text-green-600' : 'border-gray-300 focus:border-orange-400 focus:ring-orange-400'}`}
            />
        </div>
        <div className="flex-1 w-11/12 h-full flex flex-col">
            <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold">그림으로 그려 보세요.</h4>
                <button onClick={clearCanvas} className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-md transition-colors">지우기</button>
            </div>
            <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={finishDrawing}
                onMouseLeave={finishDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={finishDrawing}
                className="w-full h-32 bg-gray-100 rounded-lg cursor-crosshair touch-none"
            />
        </div>
      </div>
      {isCorrect && <p className="mt-4 text-center text-xl font-bold text-green-600">참 잘했어요!</p>}
    </div>
  );
};

export default FillInTheBlanksActivityComponent;