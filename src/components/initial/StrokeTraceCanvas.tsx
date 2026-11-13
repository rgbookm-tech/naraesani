import React, { useRef, useState, useEffect, useCallback } from 'react';
import { StrokeGuideSegment } from '../../types/initialConsonantTypes';
import { speakKorean } from '../../utils/hangulSpeech';
import { useLanguage } from '../../i18n/LanguageContext';

interface SingleTraceBoxProps {
  guideChar: string;
  strokeGuides?: StrokeGuideSegment[];
  showStrokeArrows?: boolean;
  audioText?: string;
  sizePx?: number;
  clearSignal: number;
  onDrawn?: () => void;
}

const STROKE_COLORS = ['#ec4899', '#f97316', '#10b981', '#6366f1'];

const SingleTraceBox: React.FC<SingleTraceBoxProps> = ({
  guideChar,
  strokeGuides,
  showStrokeArrows = false,
  audioText,
  sizePx = 124,
  clearSignal,
  onDrawn,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const lastPtRef = useRef<{ x: number; y: number } | null>(null);
  const [hasInk, setHasInk] = useState(false);

  const clearCanvas = useCallback(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    setHasInk(false);
  }, []);

  useEffect(() => {
    clearCanvas();
  }, [clearSignal, guideChar, clearCanvas]);

  const getLocalCoords = (clientX: number, clientY: number) => {
    const cvs = canvasRef.current;
    if (!cvs) return { x: 0, y: 0 };
    const rect = cvs.getBoundingClientRect();
    const scaleX = cvs.width / rect.width;
    const scaleY = cvs.height / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startStroke = (clientX: number, clientY: number) => {
    isDrawingRef.current = true;
    const pt = getLocalCoords(clientX, clientY);
    lastPtRef.current = pt;
    const cvs = canvasRef.current;
    const ctx = cvs?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.fillStyle = '#1d4ed8';
      ctx.arc(pt.x, pt.y, 4.5, 0, Math.PI * 2);
      ctx.fill();
    }
    if (!hasInk) {
      setHasInk(true);
      onDrawn?.();
    }
  };

  const moveStroke = (clientX: number, clientY: number) => {
    if (!isDrawingRef.current) return;
    const cvs = canvasRef.current;
    const ctx = cvs?.getContext('2d');
    if (!ctx || !lastPtRef.current) return;
    const pt = getLocalCoords(clientX, clientY);
    ctx.beginPath();
    ctx.strokeStyle = '#1d4ed8';
    ctx.lineWidth = 9;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.moveTo(lastPtRef.current.x, lastPtRef.current.y);
    ctx.lineTo(pt.x, pt.y);
    ctx.stroke();
    lastPtRef.current = pt;
  };

  const endStroke = () => {
    if (isDrawingRef.current && audioText) {
      // Optional gentle feedback; user can also tap speaker button anytime
    }
    isDrawingRef.current = false;
    lastPtRef.current = null;
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className={`relative bg-white border-2 ${
          hasInk ? 'border-sky-500 ring-2 ring-sky-100' : 'border-sky-300'
        } select-none overflow-hidden rounded-lg transition-all`}
        style={{ width: sizePx, height: sizePx, touchAction: 'none' }}
      >
        {/* Dashed Crosshair Guide Lines (깍두기 공책 점선) */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="w-full border-t border-dashed border-sky-200" />
        </div>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-full border-l border-dashed border-sky-200" />
        </div>

        {/* Faint Watermark Character */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span
            className="font-bold text-gray-200 leading-none select-none"
            style={{ fontSize: Math.round(sizePx * 0.62) }}
          >
            {guideChar}
          </span>
        </div>

        {/* SVG Stroke Order Arrows on the first guide cell */}
        {showStrokeArrows && strokeGuides && strokeGuides.length > 0 && (
          <svg
            viewBox="0 0 100 100"
            className="pointer-events-none absolute inset-0 w-full h-full opacity-85"
          >
            <defs>
              {STROKE_COLORS.map((col, idx) => (
                <marker
                  key={idx}
                  id={`arrow-${idx}`}
                  markerWidth="6"
                  markerHeight="6"
                  refX="4"
                  refY="3"
                  orient="auto"
                >
                  <path d="M0,0 L6,3 L0,6 Z" fill={col} />
                </marker>
              ))}
            </defs>
            {strokeGuides.map((seg, idx) => {
              const color = STROKE_COLORS[idx % STROKE_COLORS.length];
              return (
                <g key={idx}>
                  <path
                    d={seg.d}
                    fill="none"
                    stroke={color}
                    strokeWidth="2.8"
                    strokeDasharray="4 2"
                    markerEnd={`url(#arrow-${idx % STROKE_COLORS.length})`}
                  />
                  <circle cx={seg.numX} cy={seg.numY} r="7.5" fill={color} />
                  <text
                    x={seg.numX}
                    y={seg.numY + 3}
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight="bold"
                    fill="#ffffff"
                  >
                    {idx + 1}
                  </text>
                </g>
              );
            })}
          </svg>
        )}

        {/* Interactive Drawing Canvas */}
        <canvas
          ref={canvasRef}
          width={180}
          height={180}
          className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
          style={{ touchAction: 'none' }}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            startStroke(e.clientX, e.clientY);
          }}
          onPointerMove={(e) => moveStroke(e.clientX, e.clientY)}
          onPointerUp={endStroke}
          onPointerCancel={endStroke}
        />

        {/* Completed checkmark badge */}
        {hasInk && (
          <span className="pointer-events-none absolute top-1 right-1 text-[11px] font-black bg-emerald-500 text-white w-4 h-4 rounded-full flex items-center justify-center shadow">
            ✓
          </span>
        )}
      </div>

      {audioText && (
        <button
          type="button"
          onClick={() => speakKorean(audioText)}
          className="mt-1.5 px-2.5 py-0.5 rounded-full bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-extrabold flex items-center gap-1 transition-colors"
        >
          <span>🔊</span>
          <span>{guideChar}</span>
        </button>
      )}
    </div>
  );
};

interface Step1StrokeActivityProps {
  consonant: string;
  consonantName: string;
  instruction: string;
  strokeGuides: StrokeGuideSegment[];
}

export const Step1StrokeActivity: React.FC<Step1StrokeActivityProps> = ({
  consonant,
  consonantName,
  instruction,
  strokeGuides,
}) => {
  const { t } = useLanguage();
  const [clearSignal, setClearSignal] = useState(0);
  const [drawnBoxes, setDrawnBoxes] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setDrawnBoxes({});
    setClearSignal((c) => c + 1);
  }, [consonant]);

  const completedCount = Object.keys(drawnBoxes).length;

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-8 h-8 rounded-full bg-pink-400 text-white font-black flex items-center justify-center shadow-sm">
          1
        </span>
        <h3 className="text-xl sm:text-2xl font-extrabold text-gray-800">{t(instruction)}</h3>
      </div>

      {/* Consonant Name & Audio Card */}
      <div className="flex flex-wrap items-center justify-center gap-4 my-4 bg-sky-50/80 border-2 border-sky-200 rounded-2xl px-6 py-4 shadow-sm">
        <div className="w-20 h-20 rounded-2xl bg-sky-600 text-white font-black text-5xl flex items-center justify-center shadow-md">
          {consonant}
        </div>
        <div className="text-left">
          <div className="text-xs font-bold text-sky-600 uppercase tracking-wider">자음 이름</div>
          <div className="text-3xl font-black text-gray-800">{consonantName}</div>
        </div>
        <button
          type="button"
          onClick={() => speakKorean(`${consonantName}. ${consonant}`)}
          className="ml-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-sm shadow flex items-center gap-1.5 transition-transform active:scale-95"
        >
          <span>🔊</span>
          <span>{t('소리 듣기')}</span>
        </button>
      </div>

      {/* 5 Tracing Boxes Row */}
      <p className="text-sm text-gray-500 mb-3 font-medium">
        ①번 화살표 방향을 따라 손가락이나 마우스로 5번 직접 써 보세요! ({completedCount} / 5칸 완성)
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 bg-sky-50 p-4 rounded-2xl border-2 border-sky-200">
        {[0, 1, 2, 3, 4].map((idx) => (
          <SingleTraceBox
            key={`${consonant}-${idx}`}
            guideChar={consonant}
            strokeGuides={strokeGuides}
            showStrokeArrows={idx === 0}
            sizePx={122}
            clearSignal={clearSignal}
            onDrawn={() => setDrawnBoxes((prev) => ({ ...prev, [idx]: true }))}
          />
        ))}
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            setDrawnBoxes({});
            setClearSignal((c) => c + 1);
          }}
          className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm shadow transition-colors"
        >
          🧹 {t('다시 써 보기')}
        </button>
        {completedCount >= 5 && (
          <span className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold text-sm animate-bounce">
            🌟 5칸 모두 멋지게 썼어요!
          </span>
        )}
      </div>
    </div>
  );
};

interface Step2SyllableGridProps {
  consonant: string;
  instruction: string;
  syllables10: string[];
}

export const Step2SyllableGridActivity: React.FC<Step2SyllableGridProps> = ({
  consonant,
  instruction,
  syllables10,
}) => {
  const { t } = useLanguage();
  const [clearSignal, setClearSignal] = useState(0);
  const [drawnBoxes, setDrawnBoxes] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setDrawnBoxes({});
    setClearSignal((c) => c + 1);
  }, [consonant]);

  const completedCount = Object.keys(drawnBoxes).length;

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-8 h-8 rounded-full bg-pink-400 text-white font-black flex items-center justify-center shadow-sm">
          2
        </span>
        <h3 className="text-xl sm:text-2xl font-extrabold text-gray-800">{t(instruction)}</h3>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
        <button
          type="button"
          onClick={() => speakKorean(syllables10.join(', '), 0.8)}
          className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow flex items-center gap-1.5 transition-colors"
        >
          <span>🔊</span>
          <span>10글자 전체 이어 듣기</span>
        </button>
        <span className="text-xs sm:text-sm font-bold text-sky-700 bg-sky-50 px-3 py-1.5 rounded-full border border-sky-200">
          글자 아래 🔊 버튼을 누르면 한 글자씩 소리를 들을 수 있어요 ({completedCount} / 10칸)
        </span>
      </div>

      <div className="grid grid-cols-5 gap-2.5 sm:gap-3.5 bg-sky-50/90 p-4 rounded-2xl border-2 border-sky-200">
        {syllables10.map((syl, idx) => (
          <SingleTraceBox
            key={`${consonant}-syl-${idx}`}
            guideChar={syl}
            audioText={syl}
            sizePx={108}
            clearSignal={clearSignal}
            onDrawn={() => setDrawnBoxes((prev) => ({ ...prev, [idx]: true }))}
          />
        ))}
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            setDrawnBoxes({});
            setClearSignal((c) => c + 1);
          }}
          className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm shadow transition-colors"
        >
          🧹 {t('다시 써 보기')}
        </button>
        {completedCount >= 10 && (
          <span className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold text-sm animate-bounce">
            🎉 {syllables10[0]}~{syllables10[9]} 10글자 완성!
          </span>
        )}
      </div>
    </div>
  );
};
