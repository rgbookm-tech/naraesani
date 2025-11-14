export interface WordSearchWord {
  word: string;
  hidden?: boolean;
  isCorrect?: boolean;
}

export interface FillBlankItem {
  line: [string, string];
  answers: [string, string];
}

export interface WordImagePair {
  id: number;
  word: string;
  image: string; // URL or path to image
}

export interface MazeChoice {
  word: string;
  leadsTo: number | string;
}

export interface MazeJunction {
  id: number;
  choices: MazeChoice[];
}

// Data for specific activity types
export interface WordHighlightData {
  words: WordSearchWord[];
  type: 'findVowel' | 'findWord';
  theme?: 'leaves' | 'balloons' | 'grid';
}

export interface FillBlanksData {
  poemTitle: string;
  lines: FillBlankItem[];
}

export interface WordImageMatchData {
  pairs: WordImagePair[];
}

export interface MazeData {
  junctions: MazeJunction[];
}

export interface WordCountData {
  words: WordSearchWord[];
  correctAnswer: number;
}

export interface DragAndDropFillData {
  sentenceParts: string[];
  answers: string[];
  choices: string[];
}

export interface VowelInputData {
  exampleSentence: string;
}

export interface BodyPoseData {
  image: string;
}

// Union type for all activity data
export type ActivityData =
  | WordHighlightData
  | FillBlanksData
  | WordImageMatchData
  | MazeData
  | WordCountData
  | DragAndDropFillData
  | VowelInputData
  | BodyPoseData
  | {}; // For activities with no specific data like 'drawing' or 'stroke-order'

export interface Activity {
  type:
    | 'word-highlight'
    | 'fill-blanks'
    | 'stroke-order'
    | 'word-image-match'
    | 'drawing'
    | 'maze'
    | 'word-count'
    | 'drag-drop-fill'
    | 'vowel-input'
    | 'body-pose';
  title: string;
  instruction?: string;
  data: ActivityData;
}

export interface WorksheetData {
  vowel: string;
  pronunciation: string;
  activities: Activity[];
}
