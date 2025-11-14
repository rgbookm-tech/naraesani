import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';

interface DragAndDropFillQuizProps {
  sentenceParts: string[];
  answers: string[];
  choices: string[];
}

const shuffle = (array: string[]) => [...array].sort(() => Math.random() - 0.5);

const Cloud: React.FC<{ word: string; isAnswer: boolean; onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void; onTouchStart: (e: React.TouchEvent<HTMLDivElement>) => void; isPlaced: boolean; style?: React.CSSProperties; isDragging: boolean }> = ({ word, isAnswer, onMouseDown, onTouchStart, isPlaced, style, isDragging }) => {
    const sizeClass = isAnswer ? 'w-20 h-16' : 'w-24 h-20';
    const colorClass = isAnswer ? 'text-blue-500' : 'text-gray-400';
    
    return (
        <div 
            className={`relative flex items-center justify-center cursor-grab active:cursor-grabbing transition-opacity duration-200 ${sizeClass} ${(isPlaced || isDragging) ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            onMouseDown={onMouseDown}
            onTouchStart={onTouchStart}
            style={style}
        >
            <svg viewBox="0 0 120 80" className={`absolute inset-0 w-full h-full filter drop-shadow-md ${colorClass}`} fill="currentColor">
                <path d="M96.5,23.1c-1.3-9.5-9.3-16.9-19.1-16.9c-5.2,0-9.9,2.1-13.2,5.5c-2.3-4.4-6.9-7.4-12.2-7.4c-7.9,0-14.3,6.4-14.3,14.3c0,0.5,0,1,0.1,1.5C18.4,22.1,5.3,34.8,5.3,51.6C5.3,65.1,16.2,76,29.7,76h62.5c10.5,0,19-8.5,19-19C111.2,44.7,105.1,33,96.5,23.1z" />
            </svg>
            <span className="relative text-white font-bold text-xl drop-shadow-sm">{word}</span>
        </div>
    );
};

const DraggedCloud: React.FC<{word: string, isAnswer: boolean, position: {x: number, y: number}, offset: {x: number, y: number}}> = ({ word, isAnswer, position, offset}) => {
    const sizeClass = isAnswer ? 'w-20 h-16' : 'w-24 h-20';
    const colorClass = isAnswer ? 'text-blue-500' : 'text-gray-400';
    
    return (
        <div className={`fixed pointer-events-none z-50 ${sizeClass}`} style={{ left: position.x - offset.x, top: position.y - offset.y }}>
             <div className={`relative flex items-center justify-center w-full h-full`}>
                <svg viewBox="0 0 120 80" className={`absolute inset-0 w-full h-full filter drop-shadow-lg ${colorClass}`} fill="currentColor">
                    <path d="M96.5,23.1c-1.3-9.5-9.3-16.9-19.1-16.9c-5.2,0-9.9,2.1-13.2,5.5c-2.3-4.4-6.9-7.4-12.2-7.4c-7.9,0-14.3,6.4-14.3,14.3c0,0.5,0,1,0.1,1.5C18.4,22.1,5.3,34.8,5.3,51.6C5.3,65.1,16.2,76,29.7,76h62.5c10.5,0,19-8.5,19-19C111.2,44.7,105.1,33,96.5,23.1z" />
                </svg>
                <span className="relative text-white font-bold text-xl drop-shadow-sm">{word}</span>
            </div>
        </div>
    );
}

const DragAndDropFillQuiz: React.FC<DragAndDropFillQuizProps> = ({ sentenceParts, answers, choices }) => {
    const [placed, setPlaced] = useState<Record<number, string | null>>(Object.fromEntries(answers.map((_, i) => [i, null])));
    const [dragged, setDragged] = useState<{ word: string, offset: { x: number, y: number } } | null>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isComplete, setIsComplete] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const dropZoneRefs = useRef<Record<number, HTMLDivElement | null>>({});

    const shuffledChoices = useMemo(() => shuffle(choices), [choices]);

    const startDragging = (word: string, clientX: number, clientY: number, currentTarget: HTMLDivElement) => {
        if (isComplete || isChoicePlaced(word)) return;
        document.body.style.cursor = 'grabbing';
        const rect = currentTarget.getBoundingClientRect();
        const offset = { x: clientX - rect.left, y: clientY - rect.top };
        setPosition({ x: clientX, y: clientY });
        setDragged({ word, offset });
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, word: string) => {
        startDragging(word, e.clientX, e.clientY, e.currentTarget);
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>, word: string) => {
        startDragging(word, e.touches[0].clientX, e.touches[0].clientY, e.currentTarget);
    };
    
    const handleMouseUp = useCallback(() => {
        document.body.style.cursor = '';
        if (!dragged || !containerRef.current) {
            setDragged(null);
            return;
        }

        const containerRect = containerRef.current.getBoundingClientRect();
        
        // Use the latest position from state, but adjust for container offset
        const draggedCenterX = position.x - containerRect.left;
        const draggedCenterY = position.y - containerRect.top;
        
        for (let i = 0; i < answers.length; i++) {
            const dropZone = dropZoneRefs.current[i];
            if (!dropZone || placed[i]) continue;

            const dropZoneRect = dropZone.getBoundingClientRect();
            
            const isOver = draggedCenterX > (dropZoneRect.left - containerRect.left) &&
                           draggedCenterX < (dropZoneRect.right - containerRect.left) &&
                           draggedCenterY > (dropZoneRect.top - containerRect.top) &&
                           draggedCenterY < (dropZoneRect.bottom - containerRect.top);

            if (isOver && dragged.word === answers[i]) {
                setPlaced(p => ({ ...p, [i]: dragged.word }));
                break;
            }
        }
        setDragged(null);
    }, [dragged, answers, placed, position]);
    
    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!dragged) return;
        setPosition({ x: e.clientX, y: e.clientY });
    }, [dragged]);

    useEffect(() => {
        if (dragged) {
            const handleTouchMove = (e: TouchEvent) => {
                e.preventDefault();
                if (!dragged) return;
                setPosition({ x: e.touches[0].clientX, y: e.touches[0].clientY });
            };

            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('touchmove', handleTouchMove, { passive: false });
            window.addEventListener('mouseup', handleMouseUp, { once: true });
            window.addEventListener('touchend', handleMouseUp, { once: true });
            
            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('touchmove', handleTouchMove);
                window.removeEventListener('mouseup', handleMouseUp);
                window.removeEventListener('touchend', handleMouseUp);
            };
        }
    }, [dragged, handleMouseMove, handleMouseUp]);

    useEffect(() => {
        if (Object.values(placed).every(v => v !== null)) {
            setIsComplete(true);
        }
    }, [placed]);
    
    const reset = () => {
        setPlaced(Object.fromEntries(answers.map((_, i) => [i, null])));
        setIsComplete(false);
    };

    const isChoicePlaced = (word: string) => {
        return answers.includes(word) && Object.values(placed).includes(word);
    }
    
    return (
        <div ref={containerRef} className="w-full flex flex-col items-center justify-center p-4 min-h-[400px] touch-none">
            {dragged && (
                <DraggedCloud 
                    word={dragged.word} 
                    isAnswer={answers.includes(dragged.word)} 
                    position={position} 
                    offset={dragged.offset} 
                />
            )}
            
            <div className="flex items-center justify-center text-2xl font-bold mb-10 p-4 bg-yellow-50 rounded-lg flex-wrap">
                {sentenceParts.map((part, index) => (
                    <React.Fragment key={index}>
                        <span className="leading-loose">{part}</span>
                        {index < answers.length && (
                            <div
                                ref={el => { dropZoneRefs.current[index] = el; }}
                                className="mx-1 w-20 h-16 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center bg-white text-blue-600"
                            >
                                {placed[index]}
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>

            <div className="flex flex-wrap justify-center items-center gap-2">
                {shuffledChoices.map((word) => (
                    <Cloud 
                        key={word}
                        word={word} 
                        isAnswer={answers.includes(word)} 
                        onMouseDown={(e) => handleMouseDown(e, word)}
                        onTouchStart={(e) => handleTouchStart(e, word)}
                        isPlaced={isChoicePlaced(word)}
                        isDragging={dragged?.word === word}
                    />
                ))}
            </div>

            {isComplete && (
                <div className="mt-8 text-center">
                    <p className="text-3xl font-bold text-yellow-500 animate-bounce mb-4">참 잘했어요!</p>
                    <button onClick={reset} className="px-6 py-2 bg-gray-500 text-white font-bold rounded-lg hover:bg-gray-600">
                        다시하기
                    </button>
                </div>
            )}
        </div>
    );
};
export default DragAndDropFillQuiz;