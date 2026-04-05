export type Language = 'ko' | 'en' | 'ja' | 'zh' | 'es';

export const LANG_LABELS: Record<Language, string> = {
  ko: '한국어',
  en: 'English',
  ja: '日本語',
  zh: '中文',
  es: 'Español',
};

// Navigation buttons (consonant workbook)
const navKeys: Record<string, Partial<Record<Language, string>>> = {
  "이전": { en: "Prev", ja: "前へ", zh: "上一页", es: "Anterior" },
  "다음": { en: "Next", ja: "次へ", zh: "下一页", es: "Siguiente" },
  "목차": { en: "Contents", ja: "目次", zh: "目录", es: "Índice" },
  "완료": { en: "Finish", ja: "完了", zh: "完成", es: "Terminar" },
};

// Each key is the Korean source string; value is translations per language.
// ko is always the identity (same string).
export const translations: Record<string, Partial<Record<Language, string>>> = {

  // ─── body-pose titles ───────────────────────────────────────────────
  "몸으로 'ㅏ'를 표현해 보세요.": {
    en: "Try forming the letter 'ㅏ' with your body.",
    ja: "体で'ㅏ'を表現してみましょう。",
    zh: "试试用身体表现字母'ㅏ'。",
    es: "Intenta formar la letra 'ㅏ' con tu cuerpo.",
  },
  "몸으로 'ㅑ'를 표현해 보세요.": {
    en: "Try forming the letter 'ㅑ' with your body.",
    ja: "体で'ㅑ'を表現してみましょう。",
    zh: "试试用身体表现字母'ㅑ'。",
    es: "Intenta formar la letra 'ㅑ' con tu cuerpo.",
  },
  "몸으로 'ㅓ'를 표현해 보세요.": {
    en: "Try forming the letter 'ㅓ' with your body.",
    ja: "体で'ㅓ'を表現してみましょう。",
    zh: "试试用身体表现字母'ㅓ'。",
    es: "Intenta formar la letra 'ㅓ' con tu cuerpo.",
  },
  "몸으로 'ㅕ'를 표현해 보세요.": {
    en: "Try forming the letter 'ㅕ' with your body.",
    ja: "体で'ㅕ'を表現してみましょう。",
    zh: "试试用身体表现字母'ㅕ'。",
    es: "Intenta formar la letra 'ㅕ' con tu cuerpo.",
  },
  "몸으로 'ㅗ'를 표현해 보세요.": {
    en: "Try forming the letter 'ㅗ' with your body.",
    ja: "体で'ㅗ'を表現してみましょう。",
    zh: "试试用身体表现字母'ㅗ'。",
    es: "Intenta formar la letra 'ㅗ' con tu cuerpo.",
  },
  "몸으로 'ㅛ'를 표현해 보세요.": {
    en: "Try forming the letter 'ㅛ' with your body.",
    ja: "体で'ㅛ'を表現してみましょう。",
    zh: "试试用身体表现字母'ㅛ'。",
    es: "Intenta formar la letra 'ㅛ' con tu cuerpo.",
  },
  "몸으로 'ㅜ'를 표현해 보세요.": {
    en: "Try forming the letter 'ㅜ' with your body.",
    ja: "体で'ㅜ'を表現してみましょう。",
    zh: "试试用身体表现字母'ㅜ'。",
    es: "Intenta formar la letra 'ㅜ' con tu cuerpo.",
  },
  "몸으로 'ㅠ'를 표현해 보세요.": {
    en: "Try forming the letter 'ㅠ' with your body.",
    ja: "体で'ㅠ'を表現してみましょう。",
    zh: "试试用身体表现字母'ㅠ'。",
    es: "Intenta formar la letra 'ㅠ' con tu cuerpo.",
  },
  "몸으로 'ㅡ'를 표현해 보세요.": {
    en: "Try forming the letter 'ㅡ' with your body.",
    ja: "体で'ㅡ'を表現してみましょう。",
    zh: "试试用身体表现字母'ㅡ'。",
    es: "Intenta formar la letra 'ㅡ' con tu cuerpo.",
  },
  "몸으로 'ㅣ'를 표현해 보세요.": {
    en: "Try forming the letter 'ㅣ' with your body.",
    ja: "体で'ㅣ'を表現してみましょう。",
    zh: "试试用身体表现字母'ㅣ'。",
    es: "Intenta formar la letra 'ㅣ' con tu cuerpo.",
  },

  // ─── body-pose instruction ───────────────────────────────────────────
  "그림을 보고 따라 해보세요!": {
    en: "Look at the picture and follow along!",
    ja: "絵を見て真似してみましょう！",
    zh: "看图片，跟着做！",
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

  "조각을 옮겨서 글자를 완성해보세요.": {
    en: "Move the pieces to complete the letter.",
    ja: "ピースを動かして文字を完成させましょう。",
    zh: "移动拼图完成文字。",
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

  "네모 칸에 맞춰 글자를 예쁘게 써보세요.": {
    en: "Write the letter neatly inside the boxes.",
    ja: "マス目に合わせてきれいに書いてみましょう。",
    zh: "在方格中工整地书写文字。",
    es: "Escribe la letra con cuidado dentro de los cuadros.",
  },

  // ─── word-highlight titles ────────────────────────────────────────────
  "'ㅏ' 낱말 찾기": { en: "Find words with 'ㅏ'", ja: "'ㅏ'の単語を探そう", zh: "找出含'ㅏ'的单词", es: "Encuentra palabras con 'ㅏ'" },
  "'ㅣ' 낱말 찾기": { en: "Find words with 'ㅣ'", ja: "'ㅣ'の単語を探そう", zh: "找出含'ㅣ'的单词", es: "Encuentra palabras con 'ㅣ'" },
  "ㅏ 소리 찾기": { en: "Find the ㅏ sound", ja: "ㅏの音を探そう", zh: "找ㅏ的发音", es: "Encuentra el sonido ㅏ" },
  "ㅓ 소리 찾기": { en: "Find the ㅓ sound", ja: "ㅓの音を探そう", zh: "找ㅓ的发音", es: "Encuentra el sonido ㅓ" },
  "ㅕ 소리 찾기": { en: "Find the ㅕ sound", ja: "ㅕの音を探そう", zh: "找ㅕ的发音", es: "Encuentra el sonido ㅕ" },
  "ㅗ 소리 찾기": { en: "Find the ㅗ sound", ja: "ㅗの音を探そう", zh: "找ㅗ的发音", es: "Encuentra el sonido ㅗ" },
  "ㅜ 소리 찾기": { en: "Find the ㅜ sound", ja: "ㅜの音を探そう", zh: "找ㅜ的发音", es: "Encuentra el sonido ㅜ" },

  "'ㅏ'가 들어가는 낱말을 클릭하세요.": {
    en: "Click on words that contain 'ㅏ'.",
    ja: "'ㅏ'が入っている単語をクリックしてください。",
    zh: "点击含有'ㅏ'的单词。",
    es: "Haz clic en las palabras que contienen 'ㅏ'.",
  },
  "'ㅣ'가 들어가는 낱말을 클릭하세요.": {
    en: "Click on words that contain 'ㅣ'.",
    ja: "'ㅣ'が入っている単語をクリックしてください。",
    zh: "点击含有'ㅣ'的单词。",
    es: "Haz clic en las palabras que contienen 'ㅣ'.",
  },
  "'ㅏ' 소리가 들어간 낱말을 찾아보세요!": {
    en: "Find words that have the 'ㅏ' sound!",
    ja: "'ㅏ'の音が入っている単語を探しましょう！",
    zh: "找出包含'ㅏ'音的单词！",
    es: "¡Busca palabras que tengan el sonido 'ㅏ'!",
  },
  "'ㅓ' 소리가 들어간 낱말을 찾아보세요!": {
    en: "Find words that have the 'ㅓ' sound!",
    ja: "'ㅓ'の音が入っている単語を探しましょう！",
    zh: "找出包含'ㅓ'音的单词！",
    es: "¡Busca palabras que tengan el sonido 'ㅓ'!",
  },
  "'ㅕ'가 들어간 풍선을 찾으세요.": {
    en: "Find the balloon with 'ㅕ'.",
    ja: "'ㅕ'が入っている風船を見つけましょう。",
    zh: "找出含有'ㅕ'的气球。",
    es: "Encuentra el globo con 'ㅕ'.",
  },
  "'ㅗ' 소리가 들어간 낱말을 찾아보세요!": {
    en: "Find words that have the 'ㅗ' sound!",
    ja: "'ㅗ'の音が入っている単語を探しましょう！",
    zh: "找出包含'ㅗ'音的单词！",
    es: "¡Busca palabras que tengan el sonido 'ㅗ'!",
  },
  "'ㅜ' 소리가 들어간 낱말을 찾아보세요!": {
    en: "Find words that have the 'ㅜ' sound!",
    ja: "'ㅜ'の音が入っている単語を探しましょう！",
    zh: "找出包含'ㅜ'音的单词！",
    es: "¡Busca palabras que tengan el sonido 'ㅜ'!",
  },

  // ─── word-image-match ─────────────────────────────────────────────────
  "낱말과 그림 잇기": {
    en: "Match the word with the picture",
    ja: "単語と絵をつなごう",
    zh: "将单词与图片配对",
    es: "Une la palabra con el dibujo",
  },
  "알맞은 낱말과 그림을 선으로 이어보세요.": {
    en: "Draw a line to match each word with the correct picture.",
    ja: "正しい絵と単語を線でつなぎましょう。",
    zh: "用线将单词和正确的图片连起来。",
    es: "Dibuja una línea para unir cada palabra con el dibujo correcto.",
  },

  // ─── vowel-input ──────────────────────────────────────────────────────
  "'ㅏ' 들어간 낱말 만들기": { en: "Make words with 'ㅏ'", ja: "'ㅏ'が入った単語を作ろう", zh: "造含'ㅏ'的单词", es: "Crea palabras con 'ㅏ'" },
  "'ㅑ' 들어간 낱말 만들기": { en: "Make words with 'ㅑ'", ja: "'ㅑ'が入った単語を作ろう", zh: "造含'ㅑ'的单词", es: "Crea palabras con 'ㅑ'" },
  "'ㅓ' 들어간 낱말 만들기": { en: "Make words with 'ㅓ'", ja: "'ㅓ'が入った単語を作ろう", zh: "造含'ㅓ'的单词", es: "Crea palabras con 'ㅓ'" },
  "'ㅕ' 들어간 낱말 만들기": { en: "Make words with 'ㅕ'", ja: "'ㅕ'が入った単語を作ろう", zh: "造含'ㅕ'的单词", es: "Crea palabras con 'ㅕ'" },
  "'ㅗ' 들어간 낱말 만들기": { en: "Make words with 'ㅗ'", ja: "'ㅗ'が入った単語を作ろう", zh: "造含'ㅗ'的单词", es: "Crea palabras con 'ㅗ'" },
  "'ㅛ' 들어간 낱말 만들기": { en: "Make words with 'ㅛ'", ja: "'ㅛ'が入った単語を作ろう", zh: "造含'ㅛ'的单词", es: "Crea palabras con 'ㅛ'" },
  "'ㅜ' 들어간 낱말 만들기": { en: "Make words with 'ㅜ'", ja: "'ㅜ'が入った単語を作ろう", zh: "造含'ㅜ'的单词", es: "Crea palabras con 'ㅜ'" },
  "'ㅠ' 들어간 낱말 만들기": { en: "Make words with 'ㅠ'", ja: "'ㅠ'が入った単語を作ろう", zh: "造含'ㅠ'的单词", es: "Crea palabras con 'ㅠ'" },
  "'ㅡ' 들어간 낱말 만들기": { en: "Make words with 'ㅡ'", ja: "'ㅡ'が入った単語を作ろう", zh: "造含'ㅡ'的单词", es: "Crea palabras con 'ㅡ'" },
  "'ㅣ' 들어간 낱말 만들기": { en: "Make words with 'ㅣ'", ja: "'ㅣ'が入った単語を作ろう", zh: "造含'ㅣ'的单词", es: "Crea palabras con 'ㅣ'" },

  "예시문을 보고 'ㅏ'가 들어간 낱말을 만들어보세요.": {
    en: "Look at the example and make words with 'ㅏ'.",
    ja: "例文を見て'ㅏ'が入った単語を作ってみましょう。",
    zh: "看例句，造含'ㅏ'的单词。",
    es: "Mira el ejemplo y crea palabras con 'ㅏ'.",
  },
  "예시문을 보고 'ㅑ'가 들어간 낱말을 만들어보세요.": {
    en: "Look at the example and make words with 'ㅑ'.",
    ja: "例文を見て'ㅑ'が入った単語を作ってみましょう。",
    zh: "看例句，造含'ㅑ'的单词。",
    es: "Mira el ejemplo y crea palabras con 'ㅑ'.",
  },
  "예시문을 보고 'ㅓ'가 들어간 낱말을 만들어보세요.": {
    en: "Look at the example and make words with 'ㅓ'.",
    ja: "例文を見て'ㅓ'が入った単語を作ってみましょう。",
    zh: "看例句，造含'ㅓ'的单词。",
    es: "Mira el ejemplo y crea palabras con 'ㅓ'.",
  },
  "예시문을 보고 'ㅕ'가 들어간 낱말을 만들어보세요.": {
    en: "Look at the example and make words with 'ㅕ'.",
    ja: "例文を見て'ㅕ'が入った単語を作ってみましょう。",
    zh: "看例句，造含'ㅕ'的单词。",
    es: "Mira el ejemplo y crea palabras con 'ㅕ'.",
  },
  "예시문을 보고 'ㅗ'가 들어간 낱말을 만들어보세요.": {
    en: "Look at the example and make words with 'ㅗ'.",
    ja: "例文を見て'ㅗ'が入った単語を作ってみましょう。",
    zh: "看例句，造含'ㅗ'的单词。",
    es: "Mira el ejemplo y crea palabras con 'ㅗ'.",
  },
  "예시문을 보고 'ㅛ'가 들어간 낱말을 만들어보세요.": {
    en: "Look at the example and make words with 'ㅛ'.",
    ja: "例文を見て'ㅛ'が入った単語を作ってみましょう。",
    zh: "看例句，造含'ㅛ'的单词。",
    es: "Mira el ejemplo y crea palabras con 'ㅛ'.",
  },
  "예시문을 보고 'ㅜ'가 들어간 낱말을 만들어보세요.": {
    en: "Look at the example and make words with 'ㅜ'.",
    ja: "例文を見て'ㅜ'が入った単語を作ってみましょう。",
    zh: "看例句，造含'ㅜ'的单词。",
    es: "Mira el ejemplo y crea palabras con 'ㅜ'.",
  },
  "예시문을 보고 'ㅠ'가 들어간 낱말을 만들어보세요.": {
    en: "Look at the example and make words with 'ㅠ'.",
    ja: "例文を見て'ㅠ'が入った単語を作ってみましょう。",
    zh: "看例句，造含'ㅠ'的单词。",
    es: "Mira el ejemplo y crea palabras con 'ㅠ'.",
  },
  "예시문을 보고 'ㅡ'가 들어간 낱말을 만들어보세요.": {
    en: "Look at the example and make words with 'ㅡ'.",
    ja: "例文を見て'ㅡ'が入った単語を作ってみましょう。",
    zh: "看例句，造含'ㅡ'的单词。",
    es: "Mira el ejemplo y crea palabras con 'ㅡ'.",
  },
  "예시문을 보고 'ㅣ'가 들어간 낱말을 만들어보세요.": {
    en: "Look at the example and make words with 'ㅣ'.",
    ja: "例文を見て'ㅣ'が入った単語を作ってみましょう。",
    zh: "看例句，造含'ㅣ'的单词。",
    es: "Mira el ejemplo y crea palabras con 'ㅣ'.",
  },

  // ─── maze ─────────────────────────────────────────────────────────────
  "미로찾기": {
    en: "Find the Path",
    ja: "迷路",
    zh: "走迷宫",
    es: "Encuentra el camino",
  },
  "낱말을 따라 'ㅑ'가 들어간 길을 찾아가세요.": {
    en: "Follow words with 'ㅑ' to find the right path.",
    ja: "'ㅑ'が入っている単語をたどって正しい道を見つけましょう。",
    zh: "跟着含'ㅑ'的单词找到正确路径。",
    es: "Sigue las palabras con 'ㅑ' para encontrar el camino correcto.",
  },
  "낱말을 따라 'ㅓ'가 들어간 길을 찾아가세요.": {
    en: "Follow words with 'ㅓ' to find the right path.",
    ja: "'ㅓ'が入っている単語をたどって正しい道を見つけましょう。",
    zh: "跟着含'ㅓ'的单词找到正确路径。",
    es: "Sigue las palabras con 'ㅓ' para encontrar el camino correcto.",
  },
  "낱말을 따라 'ㅕ'가 들어간 길을 찾아가세요.": {
    en: "Follow words with 'ㅕ' to find the right path.",
    ja: "'ㅕ'が入っている単語をたどって正しい道を見つけましょう。",
    zh: "跟着含'ㅕ'的单词找到正确路径。",
    es: "Sigue las palabras con 'ㅕ' para encontrar el camino correcto.",
  },
  "낱말을 따라 'ㅛ'가 들어간 길을 찾아가세요.": {
    en: "Follow words with 'ㅛ' to find the right path.",
    ja: "'ㅛ'が入っている単語をたどって正しい道を見つけましょう。",
    zh: "跟着含'ㅛ'的单词找到正确路径。",
    es: "Sigue las palabras con 'ㅛ' para encontrar el camino correcto.",
  },
  "낱말을 따라 'ㅜ'가 들어간 길을 찾아가세요.": {
    en: "Follow words with 'ㅜ' to find the right path.",
    ja: "'ㅜ'が入っている単語をたどって正しい道を見つけましょう。",
    zh: "跟着含'ㅜ'的单词找到正确路径。",
    es: "Sigue las palabras con 'ㅜ' para encontrar el camino correcto.",
  },
  "낱말을 따라 'ㅠ'가 들어간 길을 찾아가세요.": {
    en: "Follow words with 'ㅠ' to find the right path.",
    ja: "'ㅠ'が入っている単語をたどって正しい道を見つけましょう。",
    zh: "跟着含'ㅠ'的单词找到正确路径。",
    es: "Sigue las palabras con 'ㅠ' para encontrar el camino correcto.",
  },

  // ─── word-count ───────────────────────────────────────────────────────
  "낱말 세어보기": {
    en: "Count the words",
    ja: "単語を数えよう",
    zh: "数单词",
    es: "Cuenta las palabras",
  },
  "'ㅠ'가 들어간 낱말은 모두 몇 개인가요?": {
    en: "How many words contain 'ㅠ'?",
    ja: "'ㅠ'が入っている単語はいくつですか？",
    zh: "含有'ㅠ'的单词共有几个？",
    es: "¿Cuántas palabras contienen 'ㅠ'?",
  },

  // ─── drag-drop-fill ───────────────────────────────────────────────────
  "문장 완성하기": {
    en: "Complete the sentence",
    ja: "文章を完成させよう",
    zh: "补全句子",
    es: "Completa la oración",
  },
  "알맞은 글자 구름을 옮겨 문장을 완성해보세요.": {
    en: "Drag the correct letter clouds to complete the sentence.",
    ja: "正しい文字の雲を動かして文章を完成させましょう。",
    zh: "拖动正确的文字云补全句子。",
    es: "Arrastra las nubes de letras correctas para completar la oración.",
  },

  // ─── UI labels ────────────────────────────────────────────────────────
  "나래와 산이의 한글 모험": {
    en: "Narae & Sani's Korean Adventure",
    ja: "ナレとサニのハングル冒険",
    zh: "나래와 산이的韩语冒险",
    es: "La aventura coreana de Narae y Sani",
  },
  "배우고 싶은 내용을 선택해주세요!": {
    en: "Choose what you want to learn!",
    ja: "学びたい内容を選んでください！",
    zh: "请选择您想学习的内容！",
    es: "¡Elige lo que quieres aprender!",
  },
  "받침편": { en: "Final Consonants", ja: "パッチム編", zh: "收音篇", es: "Consonantes finales" },
  "모음편": { en: "Vowels", ja: "母音編", zh: "元音篇", es: "Vocales" },
  "처음으로": { en: "Home", ja: "ホーム", zh: "首页", es: "Inicio" },
  "시작": { en: "Start", ja: "スタート", zh: "开始", es: "Iniciar" },
  "다시하기": { en: "Try Again", ja: "もう一度", zh: "再试一次", es: "Intentar de nuevo" },
  "참 잘했어요!": { en: "Great job!", ja: "よくできました！", zh: "做得很好！", es: "¡Muy bien!" },
  "화면을 눕혀주세요!": {
    en: "Please rotate your screen!",
    ja: "画面を横向きにしてください！",
    zh: "请旋转屏幕！",
    es: "¡Por favor rota la pantalla!",
  },
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
