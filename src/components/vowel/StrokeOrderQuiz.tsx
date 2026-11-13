import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { speakKorean } from '../../utils/hangulSpeech';

type Piece = {
  id: string;
  dims: { width: number; height: number };
  initialPos: { x: number; y: number };
  dropZonePos: React.CSSProperties;
};
type VowelConfig = {
  pieces: Piece[];
  sequence: string[];
  message: string;
  fontSize: string;
};

const BASE_UNIT = 20;
const V_H = BASE_UNIT * 7; // Vertical Height (140)
const H_W = BASE_UNIT * 5; // Horizontal Width (100)
const V_W = BASE_UNIT;     // Vertical Width (20)
const H_H = BASE_UNIT;     // Horizontal Height (20)

const VOWEL_CONFIGS: Record<string, VowelConfig> = {
  'ㅏ': {
    pieces: [
      { id: 'v1', dims: { width: V_W, height: V_H }, initialPos: { x: 24, y: 40 }, dropZonePos: { top: `calc(50% - ${V_H / 2}px)`, left: `calc(50% - ${V_W / 2}px)` } },
      { id: 'h1', dims: { width: H_W, height: H_H }, initialPos: { x: 210, y: 90 }, dropZonePos: { top: `calc(50% - ${H_H / 2}px)`, left: `calc(50% + ${V_W / 2 - 2}px)` } },
    ],
    sequence: ['v1', 'h1'],
    message: '세로 막대를 먼저 옮겨 보세요.',
    fontSize: '160px',
  },
  'ㅑ': {
    pieces: [
      { id: 'v1', dims: { width: V_W, height: V_H }, initialPos: { x: 24, y: 40 }, dropZonePos: { top: `calc(50% - ${V_H / 2}px)`, left: `calc(50% - ${V_W / 2}px)` } },
      { id: 'h1', dims: { width: H_W, height: H_H }, initialPos: { x: 210, y: 65 }, dropZonePos: { top: `calc(50% - ${H_H / 2}px - 20px)`, left: `calc(50% + ${V_W / 2 - 2}px)` } },
      { id: 'h2', dims: { width: H_W, height: H_H }, initialPos: { x: 210, y: 125 }, dropZonePos: { top: `calc(50% - ${H_H / 2}px + 20px)`, left: `calc(50% + ${V_W / 2 - 2}px)` } },
    ],
    sequence: ['v1', 'h1', 'h2'],
    message: '세로 막대를 먼저 옮겨 보세요.',
    fontSize: '160px',
  },
  'ㅓ': {
    pieces: [
      { id: 'h1', dims: { width: H_W, height: H_H }, initialPos: { x: 210, y: 90 }, dropZonePos: { top: `calc(50% - ${H_H / 2}px)`, left: `calc(50% - ${H_W}px + ${V_W / 2 + 2}px)` } },
      { id: 'v1', dims: { width: V_W, height: V_H }, initialPos: { x: 24, y: 40 }, dropZonePos: { top: `calc(50% - ${V_H / 2}px)`, left: `calc(50% - ${V_W / 2}px)` } },
    ],
    sequence: ['h1', 'v1'],
    message: '가로 막대를 먼저 옮겨 보세요.',
    fontSize: '160px',
  },
  'ㅕ': {
    pieces: [
      { id: 'h1', dims: { width: H_W, height: H_H }, initialPos: { x: 210, y: 65 }, dropZonePos: { top: `calc(50% - ${H_H / 2}px - 20px)`, left: `calc(50% - ${H_W}px + ${V_W / 2 + 2}px)` } },
      { id: 'h2', dims: { width: H_W, height: H_H }, initialPos: { x: 210, y: 125 }, dropZonePos: { top: `calc(50% - ${H_H / 2}px + 20px)`, left: `calc(50% - ${H_W}px + ${V_W / 2 + 2}px)` } },
      { id: 'v1', dims: { width: V_W, height: V_H }, initialPos: { x: 24, y: 40 }, dropZonePos: { top: `calc(50% - ${V_H / 2}px)`, left: `calc(50% - ${V_W / 2}px)` } },
    ],
    sequence: ['h1', 'h2', 'v1'],
    message: '위쪽 가로 막대를 먼저 옮겨 보세요.',
    fontSize: '160px',
  },
  'ㅗ': {
    pieces: [
      { id: 'v1', dims: { width: V_W, height: V_H / 2 }, initialPos: { x: 24, y: 55 }, dropZonePos: { top: `calc(50% - ${V_H / 4}px - 20px)`, left: `calc(50% - ${V_W / 2}px)` } },
      { id: 'h1', dims: { width: V_H, height: H_H }, initialPos: { x: 185, y: 95 }, dropZonePos: { top: '50%', left: `calc(50% - ${V_H / 2}px)` } },
    ],
    sequence: ['v1', 'h1'],
    message: '짧은 세로 막대를 먼저 옮겨 보세요.',
    fontSize: '160px',
  },
  'ㅛ': {
    pieces: [
      { id: 'v1', dims: { width: V_W, height: V_H / 2 }, initialPos: { x: 24, y: 55 }, dropZonePos: { top: `calc(50% - ${V_H / 4}px - 20px)`, left: `calc(50% - ${V_W / 2}px - 20px)` } },
      { id: 'v2', dims: { width: V_W, height: V_H / 2 }, initialPos: { x: 64, y: 55 }, dropZonePos: { top: `calc(50% - ${V_H / 4}px - 20px)`, left: `calc(50% - ${V_W / 2}px + 20px)` } },
      { id: 'h1', dims: { width: V_H, height: H_H }, initialPos: { x: 185, y: 95 }, dropZonePos: { top: '50%', left: `calc(50% - ${V_H / 2}px)` } },
    ],
    sequence: ['v1', 'v2', 'h1'],
    message: '왼쪽 세로 막대를 먼저 옮겨 보세요.',
    fontSize: '160px',
  },
  'ㅜ': {
    pieces: [
      { id: 'h1', dims: { width: V_H, height: H_H }, initialPos: { x: 185, y: 95 }, dropZonePos: { top: `calc(50% - ${H_H / 2}px - 20px)`, left: `calc(50% - ${V_H / 2}px)` } },
      { id: 'v1', dims: { width: V_W, height: V_H / 2 }, initialPos: { x: 24, y: 55 }, dropZonePos: { top: 'calc(50% + 10px)', left: `calc(50% - ${V_W / 2}px)` } },
    ],
    sequence: ['h1', 'v1'],
    message: '가로 막대를 먼저 옮겨 보세요.',
    fontSize: '160px',
  },
  'ㅠ': {
    pieces: [
      { id: 'h1', dims: { width: V_H, height: H_H }, initialPos: { x: 185, y: 95 }, dropZonePos: { top: `calc(50% - ${H_H / 2}px - 20px)`, left: `calc(50% - ${V_H / 2}px)` } },
      { id: 'v1', dims: { width: V_W, height: V_H / 2 }, initialPos: { x: 24, y: 55 }, dropZonePos: { top: 'calc(50% + 10px)', left: `calc(50% - ${V_W / 2}px - 20px)` } },
      { id: 'v2', dims: { width: V_W, height: V_H / 2 }, initialPos: { x: 64, y: 55 }, dropZonePos: { top: 'calc(50% + 10px)', left: `calc(50% - ${V_W / 2}px + 20px)` } },
    ],
    sequence: ['h1', 'v1', 'v2'],
    message: '가로 막대를 먼저 옮겨 보세요.',
    fontSize: '160px',
  },
  'ㅡ': {
    pieces: [
      { id: 'h1', dims: { width: V_H, height: H_H }, initialPos: { x: 95, y: 35 }, dropZonePos: { top: `calc(50% - ${H_H / 2}px)`, left: `calc(50% - ${V_H / 2}px)` } },
    ],
    sequence: ['h1'],
    message: '가로 막대를 옮겨 보세요.',
    fontSize: '160px',
  },
  'ㅣ': {
    pieces: [
      { id: 'v1', dims: { width: V_W, height: V_H }, initialPos: { x: 35, y: 40 }, dropZonePos: { top: `calc(50% - ${V_H / 2}px)`, left: `calc(50% - ${V_W / 2}px)` } },
    ],
    sequence: ['v1'],
    message: '세로 막대를 옮겨 보세요.',
    fontSize: '160px',
  },
};

interface StrokeOrderQuizProps {
  vowel: string;
}

const SNAP_DISTANCE_THRESHOLD = 75; // 모바일/마우스에서 근처에만 놓아도 자연스럽게 자석처럼 붙도록 넉넉한 허용 오차(75px) 적용

const StrokeOrderQuiz: React.FC<StrokeOrderQuizProps> = ({ vowel }) => {
  const config = useMemo(() => VOWEL_CONFIGS[vowel] || VOWEL_CONFIGS['ㅏ'], [vowel]);

  const [pieces, setPieces] = useState(() => config.pieces.map((p) => ({ id: p.id, isPlaced: false })));
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>(() =>
    config.pieces.reduce((acc, p) => ({ ...acc, [p.id]: p.initialPos }), {})
  );
  const [dragging, setDragging] = useState<{ id: string; offset: { x: number; y: number } } | null>(null);
  const [message, setMessage] = useState(config.message);

  const containerRef = useRef<HTMLDivElement>(null);
  const dropZoneRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const stateRef = useRef({ pieces, positions, dragging });
  stateRef.current = { pieces, positions, dragging };

  const reset = useCallback(() => {
    setPieces(config.pieces.map((p) => ({ id: p.id, isPlaced: false })));
    setPositions(config.pieces.reduce((acc, p) => ({ ...acc, [p.id]: p.initialPos }), {}));
    setMessage(config.message);
    setDragging(null);
  }, [config]);

  useEffect(() => {
    reset();
  }, [vowel, config, reset]);

  const startDragging = (id: string, clientX: number, clientY: number, currentTarget: HTMLDivElement) => {
    const currentPieces = stateRef.current.pieces;
    if (currentPieces.find((p) => p.id === id)?.isPlaced) return;

    const currentStepIndex = currentPieces.filter((p) => p.isPlaced).length;
    const currentStepId = config.sequence[currentStepIndex];

    // 같은 모양(세로획 2개 또는 가로획 2개)인 경우 어느 쪽을 먼저 잡아도 현재 순서의 획으로 자동 매핑하여 튕겨나가지 않게 처리
    let targetPieceId = id;
    if (id !== currentStepId) {
      const clickedPiece = config.pieces.find((p) => p.id === id);
      const expectedPiece = config.pieces.find((p) => p.id === currentStepId);
      if (
        clickedPiece &&
        expectedPiece &&
        clickedPiece.dims.width === expectedPiece.dims.width &&
        clickedPiece.dims.height === expectedPiece.dims.height
      ) {
        targetPieceId = currentStepId;
        // 클릭한 조각의 위치에서 현재 순서의 조각이 바로 드래그되도록 위치 동기화
        const clickedPos = stateRef.current.positions[id] || clickedPiece.initialPos;
        setPositions((prev) => ({
          ...prev,
          [currentStepId]: clickedPos,
          [id]: expectedPiece.initialPos,
        }));
      } else {
        const nextPieceIsVertical =
          expectedPiece && expectedPiece.dims.height > expectedPiece.dims.width;
        setMessage(`순서가 틀렸어요! ${nextPieceIsVertical ? '세로' : '가로'} 막대를 먼저 옮겨 주세요.`);
        return;
      }
    }

    document.body.style.cursor = 'grabbing';
    const rect = currentTarget.getBoundingClientRect();
    setDragging({
      id: targetPieceId,
      offset: { x: clientX - rect.left, y: clientY - rect.top },
    });
  };

  const handlePointerUp = useCallback(() => {
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
    const pieceConfig = config.pieces.find((p) => p.id === currentDragging.id)!;

    const pieceCenterX = containerRect.left + currentPos.x + pieceConfig.dims.width / 2;
    const pieceCenterY = containerRect.top + currentPos.y + pieceConfig.dims.height / 2;

    const dropCenterX = dropZoneRect.left + dropZoneRect.width / 2;
    const dropCenterY = dropZoneRect.top + dropZoneRect.height / 2;

    const distance = Math.hypot(pieceCenterX - dropCenterX, pieceCenterY - dropCenterY);
    const expandedPadding = 40;
    const isInsideExpandedBox =
      pieceCenterX >= dropZoneRect.left - expandedPadding &&
      pieceCenterX <= dropZoneRect.right + expandedPadding &&
      pieceCenterY >= dropZoneRect.top - expandedPadding &&
      pieceCenterY <= dropZoneRect.bottom + expandedPadding;

    if (distance <= SNAP_DISTANCE_THRESHOLD || isInsideExpandedBox) {
      setPieces((prev) => prev.map((p) => (p.id === currentDragging.id ? { ...p, isPlaced: true } : p)));

      const newPlacedCount = currentPieces.filter((p) => p.isPlaced).length + 1;
      if (newPlacedCount === config.pieces.length) {
        setMessage('완성! 참 잘했어요!');
        speakKorean(`${vowel}! 참 잘했어요!`);
      } else {
        setMessage('좋아요! 다음 획을 옮겨 보세요.');
      }
    } else {
      setPositions((prev) => ({ ...prev, [currentDragging.id]: pieceConfig.initialPos }));
    }

    setDragging(null);
  }, [config, vowel]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const { dragging: currentDragging } = stateRef.current;
    if (!currentDragging) return;

    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    const x = e.clientX - containerRect.left - currentDragging.offset.x;
    const y = e.clientY - containerRect.top - currentDragging.offset.y;

    setPositions((prev) => ({ ...prev, [currentDragging.id]: { x, y } }));
  }, []);

  useEffect(() => {
    if (!dragging) return;

    const handleTouchMove = (e: TouchEvent) => {
      if (e.cancelable) e.preventDefault();
      const { dragging: currentDragging } = stateRef.current;
      if (!currentDragging || !e.touches[0]) return;
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return;

      const x = e.touches[0].clientX - containerRect.left - currentDragging.offset.x;
      const y = e.touches[0].clientY - containerRect.top - currentDragging.offset.y;

      setPositions((prev) => ({ ...prev, [currentDragging.id]: { x, y } }));
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchend', handlePointerUp);
    window.addEventListener('touchcancel', handlePointerUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchend', handlePointerUp);
      window.removeEventListener('touchcancel', handlePointerUp);
    };
  }, [dragging, handleMouseMove, handlePointerUp]);

  const currentStepIndex = pieces.filter((p) => p.isPlaced).length;
  const currentStepId = config.sequence[currentStepIndex];

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center select-none">
      {/* 드래그 영역과 하단 버튼을 분리하여 모바일에서도 버튼과 절대 충돌하지 않도록 구성 */}
      <div
        ref={containerRef}
        className="relative w-full h-64 sm:h-72 bg-amber-50/50 rounded-2xl border-2 border-amber-100 flex items-center justify-center overflow-hidden touch-none"
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-extrabold text-gray-200 pointer-events-none leading-none"
          style={{ fontSize: config.fontSize }}
        >
          {vowel}
        </div>

        {/* 가이드 드롭존: 현재 놓아야 할 순서의 획 위치를 점선으로 안내 */}
        {config.pieces.map((p) => {
          const isCurrentTarget = p.id === currentStepId;
          return (
            <div
              key={`dz-${p.id}`}
              ref={(el) => {
                dropZoneRefs.current[p.id] = el;
              }}
              className={`absolute rounded-full transition-all pointer-events-none ${
                isCurrentTarget ? 'border-2 border-dashed border-sky-400 bg-sky-100/40' : ''
              }`}
              style={{ width: p.dims.width, height: p.dims.height, ...p.dropZonePos }}
            />
          );
        })}

        {/* 이미 맞춰진 획 */}
        {pieces.map((pState) => {
          if (pState.isPlaced) {
            const pieceConfig = config.pieces.find((p) => p.id === pState.id)!;
            return (
              <div
                key={`placed-${pState.id}`}
                className="absolute bg-sky-500 rounded-full shadow-sm pointer-events-none"
                style={{
                  width: pieceConfig.dims.width,
                  height: pieceConfig.dims.height,
                  ...pieceConfig.dropZonePos,
                }}
              />
            );
          }
          return null;
        })}

        {/* 드래그할 획 (모바일 터치 영역 확장을 위해 투명 패딩 래퍼 적용) */}
        {pieces.map((pState) => {
          if (!pState.isPlaced) {
            const pieceConfig = config.pieces.find((p) => p.id === pState.id)!;
            const pos = positions[pState.id] || pieceConfig.initialPos;
            const isNextInOrder = pState.id === currentStepId;
            return (
              <div
                key={`drag-${pState.id}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  startDragging(pState.id, e.clientX, e.clientY, e.currentTarget);
                }}
                onTouchStart={(e) => {
                  if (e.touches[0]) {
                    startDragging(pState.id, e.touches[0].clientX, e.touches[0].clientY, e.currentTarget);
                  }
                }}
                className="absolute cursor-grab active:cursor-grabbing flex items-center justify-center"
                style={{
                  width: pieceConfig.dims.width + 24,
                  height: pieceConfig.dims.height + 24,
                  left: `${pos.x - 12}px`,
                  top: `${pos.y - 12}px`,
                  zIndex: dragging?.id === pState.id ? 30 : isNextInOrder ? 20 : 10,
                }}
              >
                <div
                  className={`w-full h-full rounded-full transition-shadow duration-150 ${
                    isNextInOrder ? 'bg-rose-500 ring-4 ring-rose-200' : 'bg-rose-400'
                  }`}
                  style={{
                    width: pieceConfig.dims.width,
                    height: pieceConfig.dims.height,
                    boxShadow:
                      dragging?.id === pState.id ? '0 10px 15px -3px rgba(0, 0, 0, 0.25)' : 'none',
                  }}
                />
              </div>
            );
          }
          return null;
        })}
      </div>

      <div className="mt-4 text-center w-full">
        <p className="text-base font-semibold text-gray-700 min-h-[1.5rem] mb-2">{message}</p>
        <button
          type="button"
          onClick={reset}
          className="text-base font-bold px-6 py-2.5 bg-yellow-400 text-yellow-900 rounded-lg hover:bg-yellow-500 transition-colors shadow-md"
        >
          다시 하기
        </button>
      </div>
    </div>
  );
};

export default StrokeOrderQuiz;
