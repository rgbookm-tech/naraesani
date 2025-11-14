import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';

type Piece = {
    id: string;
    dims: { width: number, height: number };
    initialPos: { x: number, y: number };
    dropZonePos: React.CSSProperties;
};
type VowelConfig = {
    pieces: Piece[];
    sequence: string[];
    message: string;
    fontSize: string;
};

const BASE_UNIT = 20;
const V_H = BASE_UNIT * 7; // Vertical Height
const H_W = BASE_UNIT * 5; // Horizontal Width
const V_W = BASE_UNIT;     // Vertical Width
const H_H = BASE_UNIT;     // Horizontal Height

const VOWEL_CONFIGS: Record<string, VowelConfig> = {
  'ㅏ': {
    pieces: [
      { id: 'v1', dims: { width: V_W, height: V_H }, initialPos: { x: 40, y: 70 }, dropZonePos: { top: `calc(50% - ${V_H/2}px)`, left: `calc(50% - ${V_W/2}px)` } },
      { id: 'h1', dims: { width: H_W, height: H_H }, initialPos: { x: 240, y: 120 }, dropZonePos: { top: `calc(50% - ${H_H/2}px)`, left: `calc(50% + ${V_W/2 - 2}px)` } },
    ],
    sequence: ['v1', 'h1'], message: '세로 막대를 먼저 옮겨보세요.', fontSize: '160px'
  },
  'ㅑ': {
    pieces: [
      { id: 'v1', dims: { width: V_W, height: V_H }, initialPos: { x: 40, y: 70 }, dropZonePos: { top: `calc(50% - ${V_H/2}px)`, left: `calc(50% - ${V_W/2}px)` } },
      { id: 'h1', dims: { width: H_W, height: H_H }, initialPos: { x: 240, y: 90 }, dropZonePos: { top: `calc(50% - ${H_H/2}px - 20px)`, left: `calc(50% + ${V_W/2 - 2}px)` } },
      { id: 'h2', dims: { width: H_W, height: H_H }, initialPos: { x: 240, y: 150 }, dropZonePos: { top: `calc(50% - ${H_H/2}px + 20px)`, left: `calc(50% + ${V_W/2 - 2}px)` } },
    ],
    sequence: ['v1', 'h1', 'h2'], message: '세로 막대를 먼저 옮겨보세요.', fontSize: '160px'
  },
  'ㅓ': {
    pieces: [
      { id: 'h1', dims: { width: H_W, height: H_H }, initialPos: { x: 240, y: 120 }, dropZonePos: { top: `calc(50% - ${H_H/2}px)`, left: `calc(50% - ${H_W}px + ${V_W/2 + 2}px)` } },
      { id: 'v1', dims: { width: V_W, height: V_H }, initialPos: { x: 40, y: 70 }, dropZonePos: { top: `calc(50% - ${V_H/2}px)`, left: `calc(50% - ${V_W/2}px)` } },
    ],
    sequence: ['h1', 'v1'], message: '가로 막대를 먼저 옮겨보세요.', fontSize: '160px'
  },
  'ㅕ': {
    pieces: [
      { id: 'h1', dims: { width: H_W, height: H_H }, initialPos: { x: 240, y: 90 }, dropZonePos: { top: `calc(50% - ${H_H/2}px - 20px)`, left: `calc(50% - ${H_W}px + ${V_W/2 + 2}px)` } },
      { id: 'h2', dims: { width: H_W, height: H_H }, initialPos: { x: 240, y: 150 }, dropZonePos: { top: `calc(50% - ${H_H/2}px + 20px)`, left: `calc(50% - ${H_W}px + ${V_W/2 + 2}px)` } },
      { id: 'v1', dims: { width: V_W, height: V_H }, initialPos: { x: 40, y: 70 }, dropZonePos: { top: `calc(50% - ${V_H/2}px)`, left: `calc(50% - ${V_W/2}px)` } },
    ],
    sequence: ['h1', 'h2', 'v1'], message: '위쪽 가로 막대를 먼저 옮겨보세요.', fontSize: '160px'
  },
  'ㅗ': {
    pieces: [
      { id: 'v1', dims: { width: V_W, height: V_H/2 }, initialPos: { x: 40, y: 70 }, dropZonePos: { top: `calc(50% - ${V_H/4}px - 20px)`, left: `calc(50% - ${V_W/2}px)` } },
      { id: 'h1', dims: { width: V_H, height: H_H }, initialPos: { x: 200, y: 120 }, dropZonePos: { top: '50%', left: `calc(50% - ${V_H/2}px)` } },
    ],
    sequence: ['v1', 'h1'], message: '짧은 세로 막대를 먼저 옮겨보세요.', fontSize: '160px'
  },
   'ㅛ': {
    pieces: [
      { id: 'v1', dims: { width: V_W, height: V_H/2 }, initialPos: { x: 40, y: 70 }, dropZonePos: { top: `calc(50% - ${V_H/4}px - 20px)`, left: `calc(50% - ${V_W/2}px - 20px)` } },
      { id: 'v2', dims: { width: V_W, height: V_H/2 }, initialPos: { x: 80, y: 70 }, dropZonePos: { top: `calc(50% - ${V_H/4}px - 20px)`, left: `calc(50% - ${V_W/2}px + 20px)` } },
      { id: 'h1', dims: { width: V_H, height: H_H }, initialPos: { x: 200, y: 120 }, dropZonePos: { top: '50%', left: `calc(50% - ${V_H/2}px)` } },
    ],
    sequence: ['v1', 'v2', 'h1'], message: '왼쪽 세로 막대를 먼저 옮겨보세요.', fontSize: '160px'
  },
  'ㅜ': {
    pieces: [
      { id: 'h1', dims: { width: V_H, height: H_H }, initialPos: { x: 200, y: 120 }, dropZonePos: { top: `calc(50% - ${H_H/2}px - 20px)`, left: `calc(50% - ${V_H/2}px)` } },
      { id: 'v1', dims: { width: V_W, height: V_H/2 }, initialPos: { x: 40, y: 70 }, dropZonePos: { top: 'calc(50% + 10px)', left: `calc(50% - ${V_W/2}px)` } },
    ],
    sequence: ['h1', 'v1'], message: '가로 막대를 먼저 옮겨보세요.', fontSize: '160px'
  },
  'ㅠ': {
    pieces: [
      { id: 'h1', dims: { width: V_H, height: H_H }, initialPos: { x: 200, y: 120 }, dropZonePos: { top: `calc(50% - ${H_H/2}px - 20px)`, left: `calc(50% - ${V_H/2}px)` } },
      { id: 'v1', dims: { width: V_W, height: V_H/2 }, initialPos: { x: 40, y: 70 }, dropZonePos: { top: 'calc(50% + 10px)', left: `calc(50% - ${V_W/2}px - 20px)` } },
      { id: 'v2', dims: { width: V_W, height: V_H/2 }, initialPos: { x: 80, y: 70 }, dropZonePos: { top: 'calc(50% + 10px)', left: `calc(50% - ${V_W/2}px + 20px)` } },
    ],
    sequence: ['h1', 'v1', 'v2'], message: '가로 막대를 먼저 옮겨보세요.', fontSize: '160px'
  },
  'ㅡ': {
    pieces: [
      { id: 'h1', dims: { width: V_H, height: H_H }, initialPos: { x: 120, y: 120 }, dropZonePos: { top: `calc(50% - ${H_H/2}px)`, left: `calc(50% - ${V_H/2}px)` } },
    ],
    sequence: ['h1'], message: '가로 막대를 옮겨보세요.', fontSize: '160px'
  },
  'ㅣ': {
    pieces: [
      { id: 'v1', dims: { width: V_W, height: V_H }, initialPos: { x: 150, y: 70 }, dropZonePos: { top: `calc(50% - ${V_H/2}px)`, left: `calc(50% - ${V_W/2}px)` } },
    ],
    sequence: ['v1'], message: '세로 막대를 옮겨보세요.', fontSize: '160px'
  },
};

interface StrokeOrderQuizProps {
    vowel: string;
}

const StrokeOrderQuiz: React.FC<StrokeOrderQuizProps> = ({ vowel }) => {
  const config = useMemo(() => VOWEL_CONFIGS[vowel] || VOWEL_CONFIGS['ㅏ'], [vowel]);

  const [pieces, setPieces] = useState(() => config.pieces.map(p => ({ id: p.id, isPlaced: false })));
  const [positions, setPositions] = useState(() =>
    config.pieces.reduce((acc, p) => ({ ...acc, [p.id]: p.initialPos }), {})
  );
  const [dragging, setDragging] = useState<{ id: string; offset: { x: number; y: number } } | null>(null);
  const [message, setMessage] = useState(config.message);

  const containerRef = useRef<HTMLDivElement>(null);
  const dropZoneRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const stateRef = useRef({ pieces, positions, dragging });
  stateRef.current = { pieces, positions, dragging };

  useEffect(() => {
    reset();
  }, [vowel, config]);

  const startDragging = (id: string, clientX: number, clientY: number, currentTarget: HTMLDivElement) => {
    if (pieces.find(p => p.id === id)?.isPlaced) return;

    const currentStepIndex = pieces.filter(p => p.isPlaced).length;
    const currentStepId = config.sequence[currentStepIndex];

    if (id !== currentStepId) {
        const nextPieceIndex = config.pieces.findIndex(p => p.id === currentStepId);
        const nextPieceIsVertical = config.pieces[nextPieceIndex].dims.height > config.pieces[nextPieceIndex].dims.width;
        setMessage(`순서가 틀렸어요! ${nextPieceIsVertical ? '세로' : '가로'} 막대를 먼저 옮겨주세요.`);
        return;
    }
    
    document.body.style.cursor = 'grabbing';
    const rect = currentTarget.getBoundingClientRect();
    setDragging({
      id,
      offset: { x: clientX - rect.left, y: clientY - rect.top },
    });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, id: string) => {
    e.preventDefault();
    startDragging(id, e.clientX, e.clientY, e.currentTarget);
  };
  
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>, id: string) => {
    startDragging(id, e.touches[0].clientX, e.touches[0].clientY, e.currentTarget);
  };

   const handleMouseUp = useCallback(() => {
      document.body.style.cursor = 'default';

      const { pieces: currentPieces, positions: currentPositions, dragging: currentDragging } = stateRef.current;
      if (!currentDragging) return;

      const dropZoneRef = dropZoneRefs.current[currentDragging.id];
      const dropZoneRect = dropZoneRef?.getBoundingClientRect();
      const containerRect = containerRef.current?.getBoundingClientRect();

      if (!dropZoneRect || !containerRect) {
        setDragging(null);
        return;
      }
      
      const currentPos = currentPositions[currentDragging.id];
      const pieceConfig = config.pieces.find(p => p.id === currentDragging.id)!;
      
      const pieceCenterX = containerRect.left + currentPos.x + pieceConfig.dims.width / 2;
      const pieceCenterY = containerRect.top + currentPos.y + pieceConfig.dims.height / 2;

      const isOverDropZone =
        pieceCenterX > dropZoneRect.left &&
        pieceCenterX < dropZoneRect.right &&
        pieceCenterY > dropZoneRect.top &&
        pieceCenterY < dropZoneRect.bottom;
        
      if (isOverDropZone) {
        setPieces(prev => prev.map(p => p.id === currentDragging.id ? { ...p, isPlaced: true } : p));
        
        const newPlacedCount = currentPieces.filter(p => p.isPlaced).length + 1;
        if (newPlacedCount === config.pieces.length) {
            setMessage('완성! 참 잘했어요!');
        } else {
            setMessage('좋아요! 다음 획을 옮겨보세요.');
        }

      } else {
        setPositions(prev => ({ ...prev, [currentDragging.id]: pieceConfig.initialPos }));
      }

      setDragging(null);
    }, [config]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
      const { dragging: currentDragging } = stateRef.current;
      if (!currentDragging) return;

      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return;

      const x = e.clientX - containerRect.left - currentDragging.offset.x;
      const y = e.clientY - containerRect.top - currentDragging.offset.y;
      
      setPositions(prev => ({ ...prev, [currentDragging.id]: { x, y } }));
    }, []);

  useEffect(() => {
    if (!dragging) return;
    
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const { dragging: currentDragging } = stateRef.current;
      if (!currentDragging) return;
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return;

      const x = e.touches[0].clientX - containerRect.left - currentDragging.offset.x;
      const y = e.touches[0].clientY - containerRect.top - currentDragging.offset.y;
      
      setPositions(prev => ({ ...prev, [currentDragging.id]: { x, y } }));
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
  }, [dragging, handleMouseMove, handleMouseUp]);
  
  const reset = useCallback(() => {
    setPieces(config.pieces.map(p => ({ id: p.id, isPlaced: false })));
    setPositions(config.pieces.reduce((acc, p) => ({ ...acc, [p.id]: p.initialPos }), {}));
    setMessage(config.message);
    setDragging(null);
  }, [config]);

  return (
    <div ref={containerRef} className="relative w-full h-80 sm:h-96 flex flex-col items-center justify-center select-none overflow-hidden touch-none">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-extrabold text-gray-200 pointer-events-none" style={{fontSize: config.fontSize}}>{vowel}</div>
      
      {config.pieces.map(p => (
        <div 
          key={`dz-${p.id}`}
          ref={el => { dropZoneRefs.current[p.id] = el; }}
          className="absolute"
          style={{ width: p.dims.width, height: p.dims.height, ...p.dropZonePos }}
        />
      ))}

      {pieces.map((pState) => {
          if (pState.isPlaced) {
              const pieceConfig = config.pieces.find(p => p.id === pState.id)!;
              return <div key={`placed-${pState.id}`} className="absolute bg-sky-500 rounded-full" style={{ width: pieceConfig.dims.width, height: pieceConfig.dims.height, ...pieceConfig.dropZonePos }}/>
          }
          return null;
      })}
      
      {pieces.map((pState) => {
          if (!pState.isPlaced) {
              const pieceConfig = config.pieces.find(p => p.id === pState.id)!;
              const pos = positions[pState.id];
              return (
                 <div
                    key={`drag-${pState.id}`}
                    onMouseDown={(e) => handleMouseDown(e, pState.id)}
                    onTouchStart={(e) => handleTouchStart(e, pState.id)}
                    className="absolute bg-rose-500 rounded-full cursor-grab active:cursor-grabbing transition-shadow duration-200"
                    style={{ 
                        width: pieceConfig.dims.width, 
                        height: pieceConfig.dims.height, 
                        left: `${pos.x}px`, 
                        top: `${pos.y}px`, 
                        boxShadow: dragging?.id === pState.id ? '0 10px 15px -3px rgba(0, 0, 0, 0.2)' : 'none' 
                    }}
                />
              )
          }
          return null;
      })}

      <div className="absolute bottom-4 text-center w-full">
         <p className="text-base font-semibold text-gray-700 h-6 mb-3">{message}</p>
         <button onClick={reset} className="text-lg font-bold px-8 py-3 bg-yellow-400 text-yellow-900 rounded-lg hover:bg-yellow-500 transition-colors shadow-md">다시하기</button>
      </div>
    </div>
  );
};

export default StrokeOrderQuiz;