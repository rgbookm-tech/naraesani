export type Language = 'ko' | 'en' | 'ja' | 'zh' | 'es';

export const LANG_LABELS: Record<Language, string> = {
  ko: '한국어',
  en: 'English',
  ja: '日本語',
  zh: '中文',
  es: 'Español',
};

// Navigation buttons
const navKeys: Record<string, Partial<Record<Language, string>>> = {
  "이전": { en: "Prev", ja: "前へ", zh: "上一页", es: "Anterior" },
  "다음": { en: "Next", ja: "次へ", zh: "下一页", es: "Siguiente" },
  "목차": { en: "Contents", ja: "目次", zh: "目录", es: "Índice" },
  "완료": { en: "Finish", ja: "完了", zh: "完成", es: "Terminar" },
};

// Each key is the Korean source string; value is translations per language.
export const translations: Record<string, Partial<Record<Language, string>>> = {
  // ─── body-pose titles ───────────────────────────────────────────────
  "몸으로 'ㅏ'를 표현해 보세요.": {
    en: "Try forming the letter 'ㅏ' with your body.",
    ja: "体で「ㅏ」を表現してみましょう。",
    zh: "试试用身体表现字母‘ㅏ’。",
    es: "Intenta formar la letra 'ㅏ' con tu cuerpo.",
  },
  "몸으로 'ㅑ'를 표현해 보세요.": {
    en: "Try forming the letter 'ㅑ' with your body.",
    ja: "体で「ㅑ」を表現してみましょう。",
    zh: "试试用身体表现字母‘ㅑ’。",
    es: "Intenta formar la letra 'ㅑ' con tu cuerpo.",
  },
  "몸으로 'ㅓ'를 표현해 보세요.": {
    en: "Try forming the letter 'ㅓ' with your body.",
    ja: "体で「ㅓ」を表現してみましょう。",
    zh: "试试用身体表现字母‘ㅓ’。",
    es: "Intenta formar la letra 'ㅓ' con tu cuerpo.",
  },
  "몸으로 'ㅕ'를 표현해 보세요.": {
    en: "Try forming the letter 'ㅕ' with your body.",
    ja: "体で「ㅕ」を表現してみましょう。",
    zh: "试试用身体表现字母‘ㅕ’。",
    es: "Intenta formar la letra 'ㅕ' con tu cuerpo.",
  },
  "몸으로 'ㅗ'를 표현해 보세요.": {
    en: "Try forming the letter 'ㅗ' with your body.",
    ja: "体で「ㅗ」を表現してみましょう。",
    zh: "试试用身体表现字母‘ㅗ’。",
    es: "Intenta formar la letra 'ㅗ' con tu cuerpo.",
  },
  "몸으로 'ㅛ'를 표현해 보세요.": {
    en: "Try forming the letter 'ㅛ' with your body.",
    ja: "体で「ㅛ」を表現してみましょう。",
    zh: "试试用身体表现字母‘ㅛ’。",
    es: "Intenta formar la letra 'ㅛ' con tu cuerpo.",
  },
  "몸으로 'ㅜ'를 표현해 보세요.": {
    en: "Try forming the letter 'ㅜ' with your body.",
    ja: "体で「ㅜ」を表現してみましょう。",
    zh: "试试用身体表现字母‘ㅜ’。",
    es: "Intenta formar la letra 'ㅜ' con tu cuerpo.",
  },
  "몸으로 'ㅠ'를 표현해 보세요.": {
    en: "Try forming the letter 'ㅠ' with your body.",
    ja: "体で「ㅠ」を表現してみましょう。",
    zh: "试试用身体表现字母‘ㅠ’。",
    es: "Intenta formar la letra 'ㅠ' con tu cuerpo.",
  },
  "몸으로 'ㅡ'를 표현해 보세요.": {
    en: "Try forming the letter 'ㅡ' with your body.",
    ja: "体で「ㅡ」を表現してみましょう。",
    zh: "试试用身体表现字母‘ㅡ’。",
    es: "Intenta formar la letra 'ㅡ' con tu cuerpo.",
  },
  "몸으로 'ㅣ'를 표현해 보세요.": {
    en: "Try forming the letter 'ㅣ' with your body.",
    ja: "体で「ㅣ」を表現してみましょう。",
    zh: "试试用身体表现字母‘ㅣ’。",
    es: "Intenta formar la letra 'ㅣ' con tu cuerpo.",
  },

  // ─── body-pose instruction ───────────────────────────────────────────
  "그림을 보고 따라 해 보세요!": {
    en: "Look at the picture and follow along!",
    ja: "絵を見て真似してみましょう！",
    zh: "看图片，跟着做吧！",
    es: "¡Mira el dibujo e imítalo!",
  },

  // ─── stroke-order titles ─────────────────────────────────────────────
  "ㅏ 쓰는 순서 배우기": { en: "Learn the stroke order of ㅏ", ja: "ㅏの書き順を学ぼう", zh: "学习ㅏ的笔顺", es: "Aprende el orden de trazos de ㅏ" },
  "ㅑ 쓰는 순서 배우기": { en: "Learn the stroke order of ㅑ", ja: "ㅑの書き順を学ぼう", zh: "学习ㅑ的笔顺", es: "Aprende el orden de trazos de ㅑ" },
  "ㅓ 쓰는 순서 배우기": { en: "Learn the stroke order of ㅓ", ja: "ㅓの書き順を学ぼう", zh: "学习ㅓ的笔顺", es: "Aprende el orden de trazos de ㅓ" },
  "ㅕ 쓰는 순서 배우기": { en: "Learn the stroke order of ㅕ", ja: "ㅕの書き順を学ぼう", zh: "学习ㅕ的笔顺", es: "Aprende el orden de trazos de ㅕ" },
  "ㅛ 쓰는 순서 배우기": { en: "Learn the stroke order of ㅛ", ja: "ㅛの書き順を学ぼう", zh: "学习ㅛ的笔顺", es: "Aprende el orden de trazos de ㅛ" },
  "ㅜ 쓰는 순서 배우기": { en: "Learn the stroke order of ㅜ", ja: "ㅜの書き順を学ぼう", zh: "学习ㅜ的笔顺", es: "Aprende el orden de trazos de ㅜ" },
  "ㅠ 쓰는 순서 배우기": { en: "Learn the stroke order of ㅠ", ja: "ㅠの書き順を学ぼう", zh: "学习ㅠ的笔顺", es: "Aprende el orden de trazos de ㅠ" },
  "ㅣ 쓰는 순서 배우기": { en: "Learn the stroke order of ㅣ", ja: "ㅣの書き順を学ぼう", zh: "学习ㅣ的笔顺", es: "Aprende el orden de trazos de ㅣ" },

  "조각을 옮겨서 글자를 완성해 보세요.": {
    en: "Move the pieces to complete the letter.",
    ja: "ピースを動かして文字を完成させましょう。",
    zh: "移动笔画碎片完成文字吧。",
    es: "Mueve las piezas para completar la letra.",
  },

  // ─── drawing titles ───────────────────────────────────────────────────
  "ㅏ 따라 쓰기": { en: "Trace ㅏ", ja: "ㅏをなぞり書き", zh: "临摹ㅏ", es: "Traza ㅏ" },
  "ㅑ 따라 쓰기": { en: "Trace ㅑ", ja: "ㅑをなぞり書き", zh: "临摹ㅑ", es: "Traza ㅑ" },
  "ㅓ 따라 쓰기": { en: "Trace ㅓ", ja: "ㅓをなぞり書き", zh: "临摹ㅓ", es: "Traza ㅓ" },
  "ㅕ 따라 쓰기": { en: "Trace ㅕ", ja: "ㅕをなぞり書き", zh: "临摹ㅕ", es: "Traza ㅕ" },
  "ㅗ 따라 쓰기": { en: "Trace ㅗ", ja: "ㅗをなぞり書き", zh: "临摹ㅗ", es: "Traza ㅗ" },
  "ㅛ 따라 쓰기": { en: "Trace ㅛ", ja: "ㅛをなぞり書き", zh: "临摹ㅛ", es: "Traza ㅛ" },
  "ㅜ 따라 쓰기": { en: "Trace ㅜ", ja: "ㅜをなぞり書き", zh: "临摹ㅜ", es: "Traza ㅜ" },
  "ㅠ 따라 쓰기": { en: "Trace ㅠ", ja: "ㅠをなぞり書き", zh: "临摹ㅠ", es: "Traza ㅠ" },
  "ㅡ 따라 쓰기": { en: "Trace ㅡ", ja: "ㅡをなぞり書き", zh: "临摹ㅡ", es: "Traza ㅡ" },
  "ㅣ 따라 쓰기": { en: "Trace ㅣ", ja: "ㅣをなぞり書き", zh: "临摹ㅣ", es: "Traza ㅣ" },

  "네모 칸에 맞춰 글자를 예쁘게 써 보세요.": {
    en: "Write the letter neatly inside the boxes.",
    ja: "マス目に合わせてきれいに書いてみましょう。",
    zh: "在方格中工整地书写文字吧。",
    es: "Escribe la letra con cuidado dentro de los cuadros.",
  },

  // ─── word-highlight titles ────────────────────────────────────────────
  "'ㅏ' 낱말 찾기": { en: "Find words with 'ㅏ'", ja: "「ㅏ」の単語を探そう", zh: "找出含‘ㅏ’的单词", es: "Encuentra palabras con 'ㅏ'" },
  "'ㅣ' 낱말 찾기": { en: "Find words with 'ㅣ'", ja: "「ㅣ」の単語を探そう", zh: "找出含‘ㅣ’的单词", es: "Encuentra palabras con 'ㅣ'" },
  "ㅏ 소리 찾기": { en: "Find the ㅏ sound", ja: "ㅏの音を探そう", zh: "找ㅏ的发音", es: "Encuentra el sonido ㅏ" },
  "ㅓ 소리 찾기": { en: "Find the ㅓ sound", ja: "ㅓの音を探そう", zh: "找ㅓ的发音", es: "Encuentra el sonido ㅓ" },
  "ㅕ 소리 찾기": { en: "Find the ㅕ sound", ja: "ㅕの音を探そう", zh: "找ㅕ的发音", es: "Encuentra el sonido ㅕ" },
  "ㅗ 소리 찾기": { en: "Find the ㅗ sound", ja: "ㅗの音を探そう", zh: "找ㅗ的发音", es: "Encuentra el sonido ㅗ" },
  "ㅜ 소리 찾기": { en: "Find the ㅜ sound", ja: "ㅜの音を探そう", zh: "找ㅜ的发音", es: "Encuentra el sonido ㅜ" },

  "'ㅏ'가 들어가는 낱말을 클릭해 주세요.": {
    en: "Please click on words that contain 'ㅏ'.",
    ja: "「ㅏ」が入っている単語をクリックしてください。",
    zh: "请点击含有‘ㅏ’的单词。",
    es: "Haz clic en las palabras que contienen 'ㅏ'.",
  },
  "'ㅣ'가 들어가는 낱말을 클릭해 주세요.": {
    en: "Please click on words that contain 'ㅣ'.",
    ja: "「ㅣ」が入っている単語をクリックしてください。",
    zh: "请点击含有‘ㅣ’的单词。",
    es: "Haz clic en las palabras que contienen 'ㅣ'.",
  },
  "'ㅏ' 소리가 들어간 낱말을 찾아 클릭해 주세요.": {
    en: "Find and click the words with the 'ㅏ' sound.",
    ja: "「ㅏ」の音が入った単語を見つけてクリックしてください。",
    zh: "请找出并点击含‘ㅏ’音的单词。",
    es: "Busca y haz clic en las palabras con el sonido 'ㅏ'.",
  },
  "'ㅓ' 소리가 들어간 낱말을 찾아 클릭해 주세요.": {
    en: "Find and click the words with the 'ㅓ' sound.",
    ja: "「ㅓ」の音が入った単語を見つけてクリックしてください。",
    zh: "请找出并点击含‘ㅓ’音的单词。",
    es: "Busca y haz clic en las palabras con el sonido 'ㅓ'.",
  },
  "'ㅕ'가 들어간 풍선을 클릭해 주세요.": {
    en: "Click on the balloons that contain 'ㅕ'.",
    ja: "「ㅕ」が入っている風船をクリックしてください。",
    zh: "请点击含有‘ㅕ’的气球。",
    es: "Haz clic en los globos que contienen 'ㅕ'.",
  },
  "'ㅗ' 소리가 들어간 낱말을 찾아 클릭해 주세요.": {
    en: "Find and click the words with the 'ㅗ' sound.",
    ja: "「ㅗ」の音が入った単語を見つけてクリックしてください。",
    zh: "请找出并点击含‘ㅗ’音的单词。",
    es: "Busca y haz clic en las palabras con el sonido 'ㅗ'.",
  },
  "'ㅜ' 소리가 들어간 낱말을 찾아 클릭해 주세요.": {
    en: "Find and click the words with the 'ㅜ' sound.",
    ja: "「ㅜ」の音が入った単語を見つけてクリックしてください。",
    zh: "请找出并点击含‘ㅜ’音的单词。",
    es: "Busca y haz clic en las palabras con el sonido 'ㅜ'.",
  },

  // ─── word-image-match ─────────────────────────────────────────────────
  "낱말과 그림 잇기": {
    en: "Match the word with the picture",
    ja: "単語と絵をつなごう",
    zh: "将单词与图片配对",
    es: "Une la palabra con el dibujo",
  },
  "낱말과 어울리는 그림을 찾아 클릭해 주세요.": {
    en: "Find and click the picture that matches each word.",
    ja: "単語に合う絵を見つけてクリックしてください。",
    zh: "找出与单词匹配的图片并点击。",
    es: "Encuentra y haz clic en el dibujo que corresponde a cada palabra.",
  },
  "다음 낱말 중 하나를 사용하여 한 문장으로 말하거나 써 보세요.": {
    en: "Use one of the words below to say or write a sentence.",
    ja: "次の単語の中から1つを使って一文で話すか書いてみましょう。",
    zh: "使用下列单词中的一个说或写一句话。",
    es: "Usa una de las siguientes palabras para decir o escribir una oración.",
  },

  // ─── vowel-input ──────────────────────────────────────────────────────
  "'ㅏ' 들어간 낱말 만들기": { en: "Make words with 'ㅏ'", ja: "「ㅏ」が入った単語を作ろう", zh: "造含‘ㅏ’的单词", es: "Crea palabras con 'ㅏ'" },
  "'ㅑ' 들어간 낱말 만들기": { en: "Make words with 'ㅑ'", ja: "「ㅑ」が入った単語を作ろう", zh: "造含‘ㅑ’的单词", es: "Crea palabras con 'ㅑ'" },
  "'ㅓ' 들어간 낱말 만들기": { en: "Make words with 'ㅓ'", ja: "「ㅓ」が入った単語を作ろう", zh: "造含‘ㅓ’的单词", es: "Crea palabras con 'ㅓ'" },
  "'ㅕ' 들어간 낱말 만들기": { en: "Make words with 'ㅕ'", ja: "「ㅕ」が入った単語を作ろう", zh: "造含‘ㅕ’的单词", es: "Crea palabras con 'ㅕ'" },
  "'ㅗ' 들어간 낱말 만들기": { en: "Make words with 'ㅗ'", ja: "「ㅗ」が入った単語を作ろう", zh: "造含‘ㅗ’的单词", es: "Crea palabras con 'ㅗ'" },
  "'ㅛ' 들어간 낱말 만들기": { en: "Make words with 'ㅛ'", ja: "「ㅛ」が入った単語を作ろう", zh: "造含‘ㅛ’的单词", es: "Crea palabras con 'ㅛ'" },
  "'ㅜ' 들어간 낱말 만들기": { en: "Make words with 'ㅜ'", ja: "「ㅜ」が入った単語を作ろう", zh: "造含‘ㅜ’的单词", es: "Crea palabras con 'ㅜ'" },
  "'ㅠ' 들어간 낱말 만들기": { en: "Make words with 'ㅠ'", ja: "「ㅠ」が入った単語を作ろう", zh: "造含‘ㅠ’的单词", es: "Crea palabras con 'ㅠ'" },
  "'ㅡ' 들어간 낱말 만들기": { en: "Make words with 'ㅡ'", ja: "「ㅡ」が入った単語を作ろう", zh: "造含‘ㅡ’的单词", es: "Crea palabras con 'ㅡ'" },
  "'ㅣ' 들어간 낱말 만들기": { en: "Make words with 'ㅣ'", ja: "「ㅣ」が入った単語を作ろう", zh: "造含‘ㅣ’的单词", es: "Crea palabras con 'ㅣ'" },

  "예시문을 보고 'ㅏ'가 들어간 낱말을 만들어 보세요.": {
    en: "Look at the example and make words with 'ㅏ'.",
    ja: "例文を見て「ㅏ」が入った単語を作ってみましょう。",
    zh: "看例句，造含‘ㅏ’的单词吧。",
    es: "Mira el ejemplo y crea palabras con 'ㅏ'.",
  },
  "예시문을 보고 'ㅑ'가 들어간 낱말을 만들어 보세요.": {
    en: "Look at the example and make words with 'ㅑ'.",
    ja: "例文を見て「ㅑ」が入った単語を作ってみましょう。",
    zh: "看例句，造含‘ㅑ’的单词吧。",
    es: "Mira el ejemplo y crea palabras con 'ㅑ'.",
  },
  "예시문을 보고 'ㅓ'가 들어간 낱말을 만들어 보세요.": {
    en: "Look at the example and make words with 'ㅓ'.",
    ja: "例文を見て「ㅓ」が入った単語を作ってみましょう。",
    zh: "看例句，造含‘ㅓ’的单词吧。",
    es: "Mira el ejemplo y crea palabras con 'ㅓ'.",
  },
  "예시문을 보고 'ㅕ'가 들어간 낱말을 만들어 보세요.": {
    en: "Look at the example and make words with 'ㅕ'.",
    ja: "例文を見て「ㅕ」が入った単語を作ってみましょう。",
    zh: "看例句，造含‘ㅕ’的单词吧。",
    es: "Mira el ejemplo y crea palabras con 'ㅕ'.",
  },
  "예시문을 보고 'ㅗ'가 들어간 낱말을 만들어 보세요.": {
    en: "Look at the example and make words with 'ㅗ'.",
    ja: "例文を見て「ㅗ」が入った単語を作ってみましょう。",
    zh: "看例句，造含‘ㅗ’的单词吧。",
    es: "Mira el ejemplo y crea palabras con 'ㅗ'.",
  },
  "예시문을 보고 'ㅛ'가 들어간 낱말을 만들어 보세요.": {
    en: "Look at the example and make words with 'ㅛ'.",
    ja: "例文を見て「ㅛ」が入った単語を作ってみましょう。",
    zh: "看例句，造含‘ㅛ’的单词吧。",
    es: "Mira el ejemplo y crea palabras con 'ㅛ'.",
  },
  "예시문을 보고 'ㅜ'가 들어간 낱말을 만들어 보세요.": {
    en: "Look at the example and make words with 'ㅜ'.",
    ja: "例文を見て「ㅜ」が入った単語を作ってみましょう。",
    zh: "看例句，造含‘ㅜ’的单词吧。",
    es: "Mira el ejemplo y crea palabras con 'ㅜ'.",
  },
  "예시문을 보고 'ㅠ'가 들어간 낱말을 만들어 보세요.": {
    en: "Look at the example and make words with 'ㅠ'.",
    ja: "例文を見て「ㅠ」が入った単語を作ってみましょう。",
    zh: "看例句，造含‘ㅠ’的单词吧。",
    es: "Mira el ejemplo y crea palabras con 'ㅠ'.",
  },
  "예시문을 보고 'ㅡ'가 들어간 낱말을 만들어 보세요.": {
    en: "Look at the example and make words with 'ㅡ'.",
    ja: "例文を見て「ㅡ」が入った単語を作ってみましょう。",
    zh: "看例句，造含‘ㅡ’的单词吧。",
    es: "Mira el ejemplo y crea palabras con 'ㅡ'.",
  },
  "예시문을 보고 'ㅣ'가 들어간 낱말을 만들어 보세요.": {
    en: "Look at the example and make words with 'ㅣ'.",
    ja: "例文を見て「ㅣ」が入った単語を作ってみましょう。",
    zh: "看例句，造含‘ㅣ’的单词吧。",
    es: "Mira el ejemplo y crea palabras con 'ㅣ'.",
  },

  // ─── maze ─────────────────────────────────────────────────────────────
  "미로 찾기": {
    en: "Find the Path",
    ja: "迷路探し",
    zh: "走迷宫",
    es: "Encuentra el camino",
  },
  "낱말을 따라 'ㅑ'가 들어간 길을 찾아 클릭해 주세요.": {
    en: "Click words with 'ㅑ' to find the right path.",
    ja: "「ㅑ」が入った単語をクリックして道を進みましょう。",
    zh: "请点击含‘ㅑ’的单词找到正确路径。",
    es: "Haz clic en las palabras con 'ㅑ' para seguir el camino.",
  },
  "낱말을 따라 'ㅓ'가 들어간 길을 찾아 클릭해 주세요.": {
    en: "Click words with 'ㅓ' to find the right path.",
    ja: "「ㅓ」が入った単語をクリックして道を進みましょう。",
    zh: "请点击含‘ㅓ’的单词找到正确路径。",
    es: "Haz clic en las palabras con 'ㅓ' para seguir el camino.",
  },
  "낱말을 따라 'ㅕ'가 들어간 길을 찾아 클릭해 주세요.": {
    en: "Click words with 'ㅕ' to find the right path.",
    ja: "「ㅕ」が入った単語をクリックして道を進みましょう。",
    zh: "请点击含‘ㅕ’的单词找到正确路径。",
    es: "Haz clic en las palabras con 'ㅕ' para seguir el camino.",
  },
  "낱말을 따라 'ㅛ'가 들어간 길을 찾아 클릭해 주세요.": {
    en: "Click words with 'ㅛ' to find the right path.",
    ja: "「ㅛ」が入った単語をクリックして道を進みましょう。",
    zh: "请点击含‘ㅛ’的单词找到正确路径。",
    es: "Haz clic en las palabras con 'ㅛ' para seguir el camino.",
  },
  "낱말을 따라 'ㅜ'가 들어간 길을 찾아 클릭해 주세요.": {
    en: "Click words with 'ㅜ' to find the right path.",
    ja: "「ㅜ」が入った単語をクリックして道を進みましょう。",
    zh: "请点击含‘ㅜ’的单词找到正确路径。",
    es: "Haz clic en las palabras con 'ㅜ' para seguir el camino.",
  },
  "낱말을 따라 'ㅠ'가 들어간 길을 찾아 클릭해 주세요.": {
    en: "Click words with 'ㅠ' to find the right path.",
    ja: "「ㅠ」が入った単語をクリックして道を進みましょう。",
    zh: "请点击含‘ㅠ’的单词找到正确路径。",
    es: "Haz clic en las palabras con 'ㅠ' para seguir el camino.",
  },

  // ─── word-count ───────────────────────────────────────────────────────
  "낱말 세어 보기": {
    en: "Count the words",
    ja: "単語を数えよう",
    zh: "数一数单词",
    es: "Cuenta las palabras",
  },
  "'ㅠ'가 들어간 낱말은 모두 몇 개인지 클릭해 주세요.": {
    en: "Click how many words contain 'ㅠ'.",
    ja: "「ㅠ」が入った単語がいくつあるかクリックしてください。",
    zh: "请点击含有‘ㅠ’的单词总数。",
    es: "Haz clic en cuántas palabras contienen 'ㅠ'.",
  },

  // ─── drag-drop-fill ───────────────────────────────────────────────────
  "문장 완성하기": {
    en: "Complete the sentence",
    ja: "文章を完成させよう",
    zh: "补全句子",
    es: "Completa la oración",
  },
  "알맞은 글자 구름을 옮기거나 클릭해 문장을 완성해 보세요.": {
    en: "Drag or click the correct letter clouds to complete the sentence.",
    ja: "正しい文字の雲を動かすかクリックして文章を完成させましょう。",
    zh: "拖动或点击正确的文字云补全句子吧。",
    es: "Arrastra o haz clic en las nubes de letras correctas para completar la oración.",
  },

  // ─── UI & TOC Unified Labels ──────────────────────────────────────────
  "독서활동앱": {
    en: "Reading Activity App",
    ja: "読書活動アプリ",
    zh: "阅读活动应用",
    es: "App de Actividades de Lectura",
  },
  "나래와 산이의 한글 모험": {
    en: "Narae & Sani's Korean Adventure",
    ja: "ナレとサニのハングル冒険",
    zh: "娜莱和山伊的韩语冒险",
    es: "La aventura coreana de Narae y Sani",
  },
  "한글 모음 소리 모험": {
    en: "Korean Vowel Sound Adventure",
    ja: "ハングル母音・音の冒険",
    zh: "韩语元音声音冒险",
    es: "Aventura de vocales coreanas",
  },
  "나래와 산이와 함께 10개 기본 모음의 소리와 모양을 익혀 보세요!": {
    en: "Learn the sounds and shapes of the 10 basic Korean vowels with Narae & Sani!",
    ja: "ナレとサニと一緒に10個の基本母音の音と形を学びましょう！",
    zh: "和娜莱、山伊一起学习10个基本元音的发音和形状吧！",
    es: "¡Aprende los sonidos y formas de las 10 vocales básicas con Narae y Sani!",
  },
  "한글 받침 소리 모험": {
    en: "Korean Final-Consonant Adventure",
    ja: "ハングル・パッチム音の冒険",
    zh: "韩语收音声音冒险",
    es: "Aventura de consonantes finales",
  },
  "나래와 산이와 함께 10개 받침 단원의 소리와 낱말 퍼즐을 완성해 보세요!": {
    en: "Complete 10 final-consonant units and word puzzles with Narae & Sani!",
    ja: "ナレとサニと一緒に10個のパッチム単元と単語パズルを完成させよう！",
    zh: "和娜莱、山伊一起完成10个收音单元的发音与单词拼图吧！",
    es: "¡Completa 10 unidades de consonantes finales y acertijos con Narae y Sani!",
  },
  "받침편": { en: "Final Consonants", ja: "パッチム編", zh: "收音篇", es: "Consonantes finales" },
  "모음편": { en: "Vowels", ja: "母音編", zh: "元音篇", es: "Vocales" },
  "자음편": { en: "Consonants", ja: "子音編", zh: "辅音篇", es: "Consonantes iniciales" },
  "처음으로": { en: "Contents", ja: "目次へ", zh: "返回目录", es: "Índice" },
  "메인화면으로 가기": { en: "Main Menu", ja: "メイン画面へ", zh: "返回主页", es: "Menú principal" },
  "시작": { en: "Start", ja: "スタート", zh: "开始", es: "Iniciar" },
  "다시 하기": { en: "Try Again", ja: "もう一度", zh: "再试一次", es: "Intentar de nuevo" },
  "다시하기": { en: "Try Again", ja: "もう一度", zh: "再试一次", es: "Intentar de nuevo" },
  "다시 써 보기": { en: "Clear & Rewrite", ja: "もう一度書く", zh: "重新书写", es: "Volver a escribir" },
  "소리 듣기": { en: "Listen", ja: "音を聞く", zh: "听发音", es: "Escuchar" },
  "문제 듣기": { en: "Listen", ja: "問題を聞く", zh: "听题目", es: "Escuchar" },
  "참 잘했어요!": { en: "Great job!", ja: "よくできました！", zh: "做得很好！", es: "¡Muy bien!" },
  "화면을 눕혀주세요!": {
    en: "Please rotate your screen!",
    ja: "画面を横向きにしてください！",
    zh: "请旋转屏幕！",
    es: "¡Por favor rota la pantalla!",
  },

  // ─── 받침편 (Final Consonants) ────────────────────────────────────────
  "ㅁ 받침 활동": { en: "ㅁ Batchim Activity", ja: "ㅁパッチム活動", zh: "ㅁ收音活动", es: "Actividad de ㅁ final" },
  "ㅂ 받침 활동": { en: "ㅂ Batchim Activity", ja: "ㅂパッチム活動", zh: "ㅂ收音活动", es: "Actividad de ㅂ final" },
  "ㅇ 받침 활동": { en: "ㅇ Batchim Activity", ja: "ㅇパッチム活動", zh: "ㅇ收音活动", es: "Actividad de ㅇ final" },
  "ㄱ 받침 활동": { en: "ㄱ Batchim Activity", ja: "ㄱパッチム活動", zh: "ㄱ收音活动", es: "Actividad de ㄱ final" },
  "ㄴ 받침 활동": { en: "ㄴ Batchim Activity", ja: "ㄴパッチム活動", zh: "ㄴ收音活动", es: "Actividad de ㄴ final" },
  "ㄹ 받침 활동": { en: "ㄹ Batchim Activity", ja: "ㄹパッチム活動", zh: "ㄹ收音活动", es: "Actividad de ㄹ final" },
  "ㄷ 받침 활동": { en: "ㄷ Batchim Activity", ja: "ㄷパッチム活動", zh: "ㄷ收音活动", es: "Actividad de ㄷ final" },
  "ㅂ 받침 가족(ㅂ, ㅍ) 활동": { en: "ㅂ Family (ㅂ, ㅍ) Activity", ja: "ㅂパッチム家族(ㅂ, ㅍ)活動", zh: "ㅂ收音家族(ㅂ, ㅍ)活动", es: "Familia ㅂ final (ㅂ, ㅍ)" },
  "ㄱ 받침 가족(ㄱ, ㄲ, ㅋ) 활동": { en: "ㄱ Family (ㄱ, ㄲ, ㅋ) Activity", ja: "ㄱパッチム家族(ㄱ, ㄲ, ㅋ)活動", zh: "ㄱ收音家族(ㄱ, ㄲ, ㅋ)活动", es: "Familia ㄱ final (ㄱ, ㄲ, ㅋ)" },
  "ㄷ 받침 가족(ㄷ, ㅌ, ㅅ, ㅈ, ㅊ) 활동": { en: "ㄷ Family (ㄷ, ㅌ, ㅅ, ㅈ, ㅊ) Activity", ja: "ㄷパッチム家族(ㄷ, ㅌ, ㅅ, ㅈ, ㅊ)活動", zh: "ㄷ收音家族(ㄷ, ㅌ, ㅅ, ㅈ, ㅊ)活动", es: "Familia ㄷ final (ㄷ, ㅌ, ㅅ, ㅈ, ㅊ)" },

  // ─── 자음편 (Initial Consonants) ──────────────────────────────────────
  "도깨비 모험 순서": {
    en: "Goblin Story Order",
    ja: "トッケビ冒険順",
    zh: "小鬼冒险顺序",
    es: "Orden de aventura",
  },
  "가나다 순서": {
    en: "Ganada Order",
    ja: "カナダ順",
    zh: "字母表顺序",
    es: "Orden alfabético",
  },
  "한글 자음 소리구슬 모험": {
    en: "Korean Consonant Sound-Bead Adventure",
    ja: "ハングル子音・音の玉の冒険",
    zh: "韩语辅音声音珠冒险",
    es: "Aventura de consonantes coreanas",
  },
  "동화 속 나래와 산이를 따라 14명의 도깨비를 만나 소리구슬을 모아 보세요!": {
    en: "Follow Narae & Sani to meet 14 goblins and collect all Sound Beads!",
    ja: "ナレとサニと一緒に14人のトッケビに会って音の玉を集めよう！",
    zh: "跟随娜莱和山伊遇见14个小鬼，收集声音珠吧！",
    es: "¡Sigue a Narae y Sani para conocer a 14 duendes y reunir las cuentas de sonido!",
  },
  "가나다 순서대로 배우고 싶은 한글 자음을 선택해 보세요!": {
    en: "Choose the Korean consonant you want to learn in alphabetical order!",
    ja: "カナダ順に学びたいハングル子音を選んでみましょう！",
    zh: "按字母顺序选择你想学习的韩语辅音吧！",
    es: "¡Elige la consonante coreana que quieras aprender en orden alfabético!",
  },
  "글자를 따라 쓰며 소리 내어 읽어 보세요.": {
    en: "Trace the letters and read them aloud.",
    ja: "文字をなぞりながら声に出して読んでみましょう。",
    zh: "边描红文字边大声朗读吧。",
    es: "Traza las letras y léelas en voz alta.",
  },
  "그림에 알맞은 낱말을 완성해 보세요.": {
    en: "Complete the word that matches each picture.",
    ja: "絵に合う単語を完成させましょう。",
    zh: "看图补全正确的单词。",
    es: "Completa la palabra adecuada para cada imagen.",
  },
  "그림에 알맞은 낱말을 클릭해 주세요.": {
    en: "Click the word that matches each picture.",
    ja: "絵に合う単語をクリックしてください。",
    zh: "请点击与图片相符的单词。",
    es: "Haz clic en la palabra correcta según la imagen.",
  },
  "그림과 어울리는 말을 차례대로 클릭해 주세요.": {
    en: "Click the matching picture and word in order.",
    ja: "絵と合う言葉を順番にクリックしてください。",
    zh: "请依次点击相符的图片和词语。",
    es: "Haz clic en orden en el dibujo y la palabra correspondientes.",
  },
  "보기 글에서 ‘ㅊ’이 들어간 표현을 찾아 풍선에 써 보세요.": {
    en: "Find expressions with 'ㅊ' in the example text and write them in the balloons.",
    ja: "例文から「ㅊ」が入った表現を見つけて風船に書いてみましょう。",
    zh: "从例文中找出含‘ㅊ’的词语写在气球上吧。",
    es: "Encuentra expresiones con 'ㅊ' en el texto y escríbelas en los globos.",
  },
  "ㄱ을 순서에 따라 써 보세요.": { en: "Trace ㄱ following the stroke order.", ja: "書き順に従って「ㄱ」を書きましょう。", zh: "按笔顺书写 ㄱ。", es: "Escribe ㄱ siguiendo el orden de trazos." },
  "ㅋ을 순서에 따라 써 보세요.": { en: "Trace ㅋ following the stroke order.", ja: "書き順に従って「ㅋ」を書きましょう。", zh: "按笔顺书写 ㅋ。", es: "Escribe ㅋ siguiendo el orden de trazos." },
  "ㄴ을 순서에 따라 써 보세요.": { en: "Trace ㄴ following the stroke order.", ja: "書き順に従って「ㄴ」を書きましょう。", zh: "按笔顺书写 ㄴ。", es: "Escribe ㄴ siguiendo el orden de trazos." },
  "ㄷ을 순서에 따라 써 보세요.": { en: "Trace ㄷ following the stroke order.", ja: "書き順に従って「ㄷ」を書きましょう。", zh: "按笔顺书写 ㄷ。", es: "Escribe ㄷ siguiendo el orden de trazos." },
  "ㅌ을 순서에 따라 써 보세요.": { en: "Trace ㅌ following the stroke order.", ja: "書き順に従って「ㅌ」を書きましょう。", zh: "按笔顺书写 ㅌ。", es: "Escribe ㅌ siguiendo el orden de trazos." },
  "ㄹ을 순서에 따라 써 보세요.": { en: "Trace ㄹ following the stroke order.", ja: "書き順に従って「ㄹ」を書きましょう。", zh: "按笔顺书写 ㄹ。", es: "Escribe ㄹ siguiendo el orden de trazos." },
  "ㅁ을 순서에 따라 써 보세요.": { en: "Trace ㅁ following the stroke order.", ja: "書き順に従って「ㅁ」を書きましょう。", zh: "按笔顺书写 ㅁ。", es: "Escribe ㅁ siguiendo el orden de trazos." },
  "ㅂ을 순서에 따라 써 보세요.": { en: "Trace ㅂ following the stroke order.", ja: "書き順に従って「ㅂ」を書きましょう。", zh: "按笔顺书写 ㅂ。", es: "Escribe ㅂ siguiendo el orden de trazos." },
  "ㅍ을 순서에 따라 써 보세요.": { en: "Trace ㅍ following the stroke order.", ja: "書き順に従って「ㅍ」を書きましょう。", zh: "按笔顺书写 ㅍ。", es: "Escribe ㅍ siguiendo el orden de trazos." },
  "ㅅ을 순서에 따라 써 보세요.": { en: "Trace ㅅ following the stroke order.", ja: "書き順に従って「ㅅ」を書きましょう。", zh: "按笔顺书写 ㅅ。", es: "Escribe ㅅ siguiendo el orden de trazos." },
  "ㅈ을 순서에 따라 써 보세요.": { en: "Trace ㅈ following the stroke order.", ja: "書き順に従って「ㅈ」を書きましょう。", zh: "按笔顺书写 ㅈ。", es: "Escribe ㅈ siguiendo el orden de trazos." },
  "ㅊ을 순서에 따라 써 보세요.": { en: "Trace ㅊ following the stroke order.", ja: "書き順に従って「ㅊ」を書きましょう。", zh: "按笔顺书写 ㅊ。", es: "Escribe ㅊ siguiendo el orden de trazos." },
  "ㅇ을 순서에 따라 써 보세요.": { en: "Trace ㅇ following the stroke order.", ja: "書き順に従って「ㅇ」を書きましょう。", zh: "按笔顺书写 ㅇ。", es: "Escribe ㅇ siguiendo el orden de trazos." },
  "ㅎ을 순서에 따라 써 보세요.": { en: "Trace ㅎ following the stroke order.", ja: "書き順に従って「ㅎ」を書きましょう。", zh: "按笔顺书写 ㅎ。", es: "Escribe ㅎ siguiendo el orden de trazos." },
};

/**
 * Returns the translated string for a given key and language.
 * Falls back to Korean (the key itself) if no translation exists.
 */
export function t(key: string, lang: Language): string {
  if (lang === 'ko') return key;
  const found = { ...navKeys, ...translations }[key];
  return found?.[lang] ?? key;
}
