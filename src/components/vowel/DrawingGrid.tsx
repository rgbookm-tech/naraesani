import React, { useState, useCallback, useRef } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { speakKorean } from '../../utils/hangulSpeech';

const GRID_ROWS = 8;
const GRID_COLS = 12;

interface DrawingGridProps {
  vowel?: string;
}

const DrawingGrid: React.FC<DrawingGridProps> = ({ vowel }) => {
  const { t } = useLanguage();
  const [grid, setGrid] = useState(() =>
    Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill(false))
  );
  const [isDrawing, setIsDrawing] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const lastPaintedCell = useRef<{ row: number; col: number } | null>(null);

  const getCellFromCoordinates = useCallback((clientX: number, clientY: number) => {
    if (!gridRef.current) return null;
    const rect = gridRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    if (x < 0 || x > rect.width || y < 0 || y > rect.height) return null;

    const cellWidth = rect.width / GRID_COLS;
    const cellHeight = rect.height / GRID_ROWS;

    const col = Math.floor(x / cellWidth);
    const row = Math.floor(y / cellHeight);

    if (row >= 0 && row < GRID_ROWS && col >= 0 && col < GRID_COLS) {
      return { row, col };
    }
    return null;
  }, []);

  const fillCell = useCallback((row: number, col: number) => {
    if (lastPaintedCell.current?.row === row && lastPaintedCell.current?.col === col) {
      return;
    }

    setGrid((prevGrid) => {
      if (prevGrid[row][col]) return prevGrid;
      const newGrid = prevGrid.map((r) => [...r]);
      newGrid[row][col] = true;
      lastPaintedCell.current = { row, col };
      return newGrid;
    });
  }, []);

  const clearGrid = useCallback(() => {
    setGrid(Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill(false)));
  }, []);

  const handleInteractionStart = useCallback(
    (clientX: number, clientY: number) => {
      setIsDrawing(true);
      const cell = getCellFromCoordinates(clientX, clientY);
      if (cell) {
        fillCell(cell.row, cell.col);
      }
    },
    [getCellFromCoordinates, fillCell]
  );

  const handleInteractionMove = useCallback(
    (clientX: number, clientY: number) => {
      if (isDrawing) {
        const cell = getCellFromCoordinates(clientX, clientY);
        if (cell) {
          fillCell(cell.row, cell.col);
        }
      }
    },
    [isDrawing, getCellFromCoordinates, fillCell]
  );

  const handleInteractionEnd = useCallback(() => {
    setIsDrawing(false);
    lastPaintedCell.current = null;
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    handleInteractionStart(e.clientX, e.clientY);
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    handleInteractionMove(e.clientX, e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    handleInteractionStart(e.touches[0].clientX, e.touches[0].clientY);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    handleInteractionMove(e.touches[0].clientX, e.touches[0].clientY);
  };

  return (
    <div className="flex flex-col items-center justify-center p-2">
      <div
        ref={gridRef}
        className="relative grid border-2 border-amber-300 rounded-lg overflow-hidden select-none touch-none shadow-sm"
        style={{ gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0, 1fr))` }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleInteractionEnd}
        onMouseLeave={handleInteractionEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleInteractionEnd}
      >
        {vowel && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-[150px] font-black text-amber-200/45 leading-none select-none">
              {vowel}
            </span>
          </div>
        )}
        {grid.map((row, rowIndex) =>
          row.map((isFilled, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`w-7 h-7 sm:w-8 sm:h-8 border border-gray-200 transition-colors duration-150 relative z-10 ${
                isFilled ? 'bg-amber-500' : 'bg-transparent'
              }`}
            />
          ))
        )}
      </div>
      <div className="mt-4 flex items-center gap-3">
        {vowel && (
          <button
            type="button"
            onClick={() => speakKorean(vowel)}
            className="px-4 py-2 bg-amber-100 text-amber-900 font-bold rounded-xl hover:bg-amber-200 transition-colors text-sm"
          >
            🔊 ‘{vowel}’ 소리 듣기
          </button>
        )}
        <button
          type="button"
          onClick={clearGrid}
          className="px-4 py-2 bg-rose-500 text-white font-bold rounded-xl hover:bg-rose-600 transition-colors text-sm shadow-sm"
        >
          {t('다시 써 보기')}
        </button>
      </div>
    </div>
  );
};

export default DrawingGrid;
