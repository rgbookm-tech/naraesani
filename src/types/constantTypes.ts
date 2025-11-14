export enum ActivityType {
  TableOfContents = 'TABLE_OF_CONTENTS',
  WordCloudSearch = 'WORD_CLOUD_SEARCH',
  GridPath = 'GRID_PATH',
  FillInTheBlanks = 'FILL_IN_THE_BLANKS',
  RadialFillInTheBlanks = 'RADIAL_FILL_IN_THE_BLANKS',
  SentenceBuilder = 'SENTENCE_BUILDER',
  ConnectPairs = 'CONNECT_PAIRS',
  WordImageGrid = 'WORD_IMAGE_GRID',
  MultipleChoiceSentence = 'MULTIPLE_CHOICE_SENTENCE',
  MultipleChoiceImage = 'MULTIPLE_CHOICE_IMAGE',
  MatchingLadder = 'MATCHING_LADDER',
  ConnectTextPairs = 'CONNECT_TEXT_PAIRS',
  Info = 'INFO',
  PathSelector = 'PATH_SELECTOR',
  CloudDragAndDrop = 'CLOUD_DRAG_AND_DROP',
  FillTheBlankInSyllable = 'FILL_THE_BLANK_IN_SYLLABLE',
}

export interface BaseActivity {
  page: number;
  title: string;
  activityNumber: number;
}

export interface WordCloudSearchActivity extends BaseActivity {
  type: ActivityType.WordCloudSearch;
  question: string;
  words: { text: string; isTarget: boolean }[];
}

export interface InfoData {
    title: string;
    description: string;
}

export interface GridPathActivity extends BaseActivity {
  type: ActivityType.GridPath;
  question: string;
  instructions: {
    title: string;
    description: string;
  };
  grid: (string | null)[][];
  correctPath: [number, number][]; // Array of [row, col] coordinates
  start: [number, number];
}

export interface FillInTheBlanksActivity extends BaseActivity {
  type: ActivityType.FillInTheBlanks;
  question: string;
  sentences: string[]; // Use a special character like '___' for the blank
  correctAnswer?: string;
}

export interface RadialFillInTheBlanksActivity extends BaseActivity {
  type: ActivityType.RadialFillInTheBlanks;
  question: string;
  words: { text: string; blankPosition: 'before' | 'after' }[];
  correctAnswer: string;
}

export interface SentenceBuilderPrompt {
  word: string;
  example?: string;
  placeholder?: string;
}
export interface SentenceBuilderActivity extends BaseActivity {
  type: ActivityType.SentenceBuilder;
  question: string;
  words: (string | SentenceBuilderPrompt)[];
}

export interface ConnectPairsActivity extends BaseActivity {
  type: ActivityType.ConnectPairs;
  question: string;
  pairs?: {
    word: string;
    image: string;
    id: number;
  }[];
  groups?: {
    word: string;
    image: string;
    id: number;
  }[][];
}

export interface TOCItem {
  title: string;
  page: number;
}

export interface TOCGroup {
  title: string;
  items: TOCItem[];
}

export interface TableOfContentsActivity extends BaseActivity {
  type: ActivityType.TableOfContents;
  groups: TOCGroup[];
}

export interface FillTheBlankInSyllableActivity extends BaseActivity {
  type: ActivityType.FillTheBlankInSyllable;
  question: string;
  choices: string[]; // e.g. ['ㄱ', 'ㄲ']
  items: {
    id: number;
    left: {
      image: string;
      word: string;
    };
    right: {
      image: string;
      wordParts: [string, string]; // e.g., ['하', '교'] for 학교
      correctAnswer: string; // 'ㄱ'
    };
  }[];
}

export interface WordImageGridActivity extends BaseActivity {
  type: ActivityType.WordImageGrid;
  question: string;
  example?: string;
  items: {
      wordWith: string;
      wordWithout: string;
      imageWith: string;
      imageWithout: string;
  }[];
}

export interface MultipleChoiceSentenceActivity extends BaseActivity {
  type: ActivityType.MultipleChoiceSentence;
  question: string;
  items: {
    sentence: string; // "내 ( )의 친구들은 나보다 키가 작다."
    choices: string[];
    correctAnswer: string[];
  }[];
}

export interface MultipleChoiceImageActivity extends BaseActivity {
    type: ActivityType.MultipleChoiceImage;
    question: string;
    items: {
        image: string;
        choices: string[];
        correctAnswer: string[];
        leftText?: string;
        rightText?: string;
    }[];
}

export interface ConnectTextPairsActivity extends BaseActivity {
    type: ActivityType.ConnectTextPairs;
    question: string;
    pairs: {
        left: string;
        right: string;
        id: number;
    }[];
}

export interface MatchingLadderActivity extends BaseActivity {
    type: ActivityType.MatchingLadder;
    question: string;
    topRow: string[];
    bottomRow: string[];
    matches: { [key: string]: string }; // e.g. { '갔다': '같다' }
}

export interface PathSelectorStep {
  prompt: string;
  choices: {
    image: string;
    isCorrect: boolean;
  }[];
}

export interface PathSelectorActivity extends BaseActivity {
  type: ActivityType.PathSelector;
  question: string;
  background: string;
  steps: PathSelectorStep[];
}

export interface CloudDragAndDropActivity extends BaseActivity {
  type: ActivityType.CloudDragAndDrop;
  question: string;
  items: {
    id: string;
    sentence: [string, string]; // e.g. ["가슴이 ", " 했다."]
    answer: string; // "두근두근"
    cloudShape: 'cloud1' | 'cloud2' | 'cloud3';
  }[];
}

export type WorkbookActivity =
  | WordCloudSearchActivity
  | GridPathActivity
  | FillInTheBlanksActivity
  | RadialFillInTheBlanksActivity
  | SentenceBuilderActivity
  | ConnectPairsActivity
  | WordImageGridActivity
  | MultipleChoiceSentenceActivity
  | MultipleChoiceImageActivity
  | ConnectTextPairsActivity
  | MatchingLadderActivity
  | PathSelectorActivity
  | CloudDragAndDropActivity
  | FillTheBlankInSyllableActivity
  | TableOfContentsActivity;

export type Activity =
  | WorkbookActivity
  | InfoData;