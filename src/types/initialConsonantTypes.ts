export interface StrokeGuideSegment {
  /** SVG path d in 0..100 coordinate space */
  d: string;
  /** Number badge position (0..100) */
  numX: number;
  numY: number;
}

export interface WordSlotBox {
  /** Pre-printed part shown in light/black text (e.g. 'ㅗ', '곡', '지', '') */
  hintPart?: string;
  /** Position of hint relative to missing consonant: 'vowel-right' | 'vowel-bottom' | 'full-given' | 'empty-syllable' | 'top-given' */
  layout: 'consonant-left' | 'consonant-top' | 'given-syllable' | 'full-blank';
  /** Full target syllable, e.g. '고', '기', '곡' */
  targetSyllable: string;
  /** What token the child selects to fill this box (omit if layout === 'given-syllable') */
  answerToken?: string;
}

export interface WordSlotItem {
  id: string;
  word: string;
  image: string;
  boxes: WordSlotBox[];
}

export interface WordChoiceItem {
  id: string;
  image: string;
  options: [string, string];
  answer: string;
}

export interface WordMatchItem {
  id: string;
  image: string;
  word: string;
}

export type Step3Data =
  | {
      mode: 'slot-fill';
      instruction: string;
      choicesPool: string[];
      items: WordSlotItem[];
    }
  | {
      mode: 'word-choice';
      instruction: string;
      items: WordChoiceItem[];
    }
  | {
      mode: 'tap-match';
      instruction: string;
      items: WordMatchItem[];
      wordOrder: string[];
    };

// ─── Step 4 Specialized Play Union ──────────────────────────────────────────

export type Step4Data =
  | {
      playType: 'color-grid-animal';
      instruction: string;
      rows: number;
      cols: number;
      cells: string[][];
      correctWords: string[];
      animals: Array<{ id: string; name: string; image: string; isCorrect: boolean }>;
      revealHint: string;
    }
  | {
      playType: 'mimic-match-fill';
      instruction: string;
      items: Array<{ id: string; image: string; word: string; desc: string }>;
      choices: string[];
    }
  | {
      playType: 'image-maze-n';
      instruction: string;
      mazeImage: string;
      steps: Array<{
        stepIndex: number;
        options: Array<{
          word: string;
          image: string;
          xPct: number;
          yPct: number;
          isCorrect: boolean;
        }>;
      }>;
    }
  | {
      playType: 'word-search-puzzle';
      instruction: string;
      targetWords: string[];
      grid: string[][];
      solutions: Array<{
        word: string;
        coords: Array<[number, number]>;
      }>;
    }
  | {
      playType: 'board-game-t';
      instruction: string;
      ruleText: string;
      cells: string[];
    }
  | {
      playType: 'hidden-objects-r';
      instruction: string;
      sceneImage: string;
      targets: Array<{
        id: string;
        word: string;
        cardImage?: string;
        zones: Array<{ xPct: number; yPct: number; wPct: number; hPct: number }>;
      }>;
    }
  | {
      playType: 'corridor-maze-m';
      instruction: string;
      mazeImage: string;
      checkpoints: Array<{
        stepIndex: number;
        correct: { word: string; xPct: number; yPct: number };
        wrong: { word: string; xPct: number; yPct: number };
      }>;
    }
  | {
      playType: 'rebus-sentences-b';
      instruction: string;
      sentences: Array<{
        id: string;
        fullAudioText: string;
        segments: Array<
          | { kind: 'text'; text: string }
          | { kind: 'picture-word'; word: string; image: string; meaningHint?: string }
        >;
      }>;
    }
  | {
      playType: 'color-grid-blue-p';
      instruction: string;
      grid: string[][];
      correctWords: string[];
    }
  | {
      playType: 'minimal-pair-circle-s';
      instruction: string;
      items: Array<{
        id: string;
        image: string;
        prefix?: string;
        options: [string, string, string];
        suffix?: string;
        answer: string;
        fullWord: string;
      }>;
    }
  | {
      playType: 'balloon-story-ch';
      instruction: string;
      balloonImage: string;
      storyLines: string[];
      correctExpressions: string[];
      choicesPool: string[];
    }
  | {
      playType: 'picture-diary-ng';
      instruction: string;
      diaryImage: string;
      dateLabel: string;
      segments: Array<
        | { kind: 'text'; text: string }
        | { kind: 'choice'; id: string; options: [string, string]; answer: string }
      >;
      fullText: string;
    }
  | {
      playType: 'walled-maze-h';
      instruction: string;
      grid: string[][];
      /** Walls open between adjacent cells or simple ordered path */
      correctPath: Array<[number, number]>;
      /** Allowed neighbor moves in the maze (key "r,c" -> array of "nr,nc") */
      openMoves: Record<string, string[]>;
    };

export interface Step5PoemData {
  instruction: string;
  title: string;
  lines: string[];
  /** Target jamo(s) to circle, e.g. ['ㄱ'], or ['ㅅ', 'ㅆ'] for ㅅ unit */
  targetConsonants: string[];
  /** Whether standalone jamo characters like 'ㄴ', 'ㄷ', 'ㅈ', 'ㅇ' in poem lines also count */
  includeStandaloneJamo?: boolean;
  /** Match mode: 'initial-only' (초성만) or 'any-position' (초성+종성) */
  matchMode: 'initial-only' | 'any-position';
}

export interface InitialConsonantUnit {
  /** 1..14 in Goblin Adventure Order */
  adventureOrder: number;
  /** 1..14 in standard Ganada Order (ㄱ,ㄴ,ㄷ,ㄹ,ㅁ,ㅂ,ㅅ,ㅇ,ㅈ,ㅊ,ㅋ,ㅌ,ㅍ,ㅎ) */
  ganadaOrder: number;
  consonant: string;
  name: string;
  goblinTitle: string;
  goblinStorySummary: string;
  beadColor: string;
  beadLabel: string;
  strokeGuides: StrokeGuideSegment[];
  step1Instruction: string;
  step2Instruction: string;
  syllables10: string[];
  step3: Step3Data;
  step4: Step4Data;
  step5: Step5PoemData;
}
