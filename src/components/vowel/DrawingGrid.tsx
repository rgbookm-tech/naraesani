import React, { useState, useCallback, useRef } from 'react';

const GRID_ROWS = 8;
const GRID_COLS = 12;

const DrawingGrid: React.FC = () => {
  const [grid, setGrid] = useState(() =>
    Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill(false))
  );
  const [isDrawing, setIsDrawing] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const lastPaintedCell = useRef<{row: number, col: number} | null>(null);

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
    
    setGrid(prevGrid => {
      if (prevGrid[row][col]) return prevGrid;
      const newGrid = prevGrid.map(r => [...r]);
      newGrid[row][col] = true;
      lastPaintedCell.current = { row, col };
      return newGrid;
    });
  }, []);
  
  const clearGrid = useCallback(() => {
     setGrid(Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill(false)))
  }, []);

  const handleInteractionStart = useCallback((clientX: number, clientY: number) => {
    setIsDrawing(true);
    const cell = getCellFromCoordinates(clientX, clientY);
    if (cell) {
      fillCell(cell.row, cell.col);
    }
  }, [getCellFromCoordinates, fillCell]);

  const handleInteractionMove = useCallback((clientX: number, clientY: number) => {
    if (isDrawing) {
      const cell = getCellFromCoordinates(clientX, clientY);
      if (cell) {
        fillCell(cell.row, cell.col);
      }
    }
  }, [isDrawing, getCellFromCoordinates, fillCell]);

  const handleInteractionEnd = useCallback(() => {
    setIsDrawing(false);
    lastPaintedCell.current = null;
  }, []);

  // Mouse Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    handleInteractionStart(e.clientX, e.clientY);
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    handleInteractionMove(e.clientX, e.clientY);
  };

  // Touch Handlers
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
        className="grid border-2 border-gray-400 select-none touch-none" 
        style={{gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0, 1fr))`}}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleInteractionEnd}
        onMouseLeave={handleInteractionEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleInteractionEnd}
      >
        {grid.map((row, rowIndex) =>
          row.map((isFilled, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`w-7 h-7 sm:w-8 sm:h-8 border border-gray-200 transition-colors duration-150 ${
                isFilled ? 'bg-sky-500' : 'bg-white'
              }`}
            />
          ))
        )}
      </div>
      <button 
        onClick={clearGrid}
        className="mt-4 px-4 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600 transition-colors text-sm"
      >
        다시 써 보기
      </button>
    </div>
  );
};

export default DrawingGrid;