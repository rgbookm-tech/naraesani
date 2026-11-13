// Hangul Jamo decomposition & Web Speech TTS utilities

const CHOSEONG = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
  'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
];

const JONGSEONG = [
  '', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ',
  'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ',
  'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
];

export function decomposeHangulChar(ch: string): { choseong: string; jongseong: string } | null {
  if (!ch || ch.length === 0) return null;
  const code = ch.charCodeAt(0);
  if (code >= 0xac00 && code <= 0xd7a3) {
    const offset = code - 0xac00;
    const choIdx = Math.floor(offset / (21 * 28));
    const jongIdx = offset % 28;
    return {
      choseong: CHOSEONG[choIdx] || '',
      jongseong: JONGSEONG[jongIdx] || '',
    };
  }
  return null;
}

/**
 * Checks if a single character in a poem should be circled for targetConsonants.
 * Matches the official answer key in 자음활동지.pdf (Pages 15-18), where:
 * - Initial consonants (초성) matching targetConsonants are circled (e.g., ㄱ -> 가, 거, 고, 건; NOT 칼, 각's 받침)
 * - Standalone jamo characters in the poem (e.g. 'ㄴ 단어', 'ㄷ 단어', 'ㅈ도깨비', 'ㅇ하나에') also match!
 */
export function charHasTargetConsonant(
  ch: string,
  targetConsonants: string[],
  matchMode: 'initial-only' | 'any-position' = 'initial-only'
): boolean {
  const trimmed = ch.trim();
  if (!trimmed) return false;

  // Handle ASCII 'o' if ever present for 'ㅇ'
  if (targetConsonants.includes('ㅇ') && (trimmed === 'o' || trimmed === 'O')) {
    return true;
  }

  // Standalone Hangul Jamo (e.g. ㄴ, ㄷ, ㅈ, ㅇ)
  if (targetConsonants.includes(trimmed)) {
    return true;
  }

  const decomp = decomposeHangulChar(trimmed);
  if (!decomp) return false;

  if (targetConsonants.includes(decomp.choseong)) {
    return true;
  }

  if (matchMode === 'any-position' && decomp.jongseong && targetConsonants.includes(decomp.jongseong)) {
    return true;
  }

  return false;
}

const JAMO_SPEECH_MAP: Record<string, string> = {
  ㄱ: '기역',
  ㄲ: '쌍기역',
  ㄴ: '니은',
  ㄷ: '디귿',
  ㄸ: '쌍디귿',
  ㄹ: '리을',
  ㅁ: '미음',
  ㅂ: '비읍',
  ㅃ: '쌍비읍',
  ㅅ: '시옷',
  ㅆ: '쌍시옷',
  ㅇ: '이응',
  ㅈ: '지읒',
  ㅉ: '쌍지읒',
  ㅊ: '치읓',
  ㅋ: '키읔',
  ㅌ: '티읕',
  ㅍ: '피읖',
  ㅎ: '히읗',
  ㅏ: '아',
  ㅐ: '애',
  ㅑ: '야',
  ㅒ: '얘',
  ㅓ: '어',
  ㅔ: '에',
  ㅕ: '여',
  ㅖ: '예',
  ㅗ: '오',
  ㅘ: '와',
  ㅙ: '왜',
  ㅚ: '외',
  ㅛ: '요',
  ㅜ: '우',
  ㅝ: '워',
  ㅞ: '웨',
  ㅟ: '위',
  ㅠ: '유',
  ㅡ: '으',
  ㅢ: '의',
  ㅣ: '이',
};

export function normalizeKoreanForSpeech(raw: string): string {
  if (!raw) return '';
  return raw
    .replace(/_{2,}|\(\s*\)/g, ' 빈칸 ')
    .replace(/[ㄱ-ㅎㅏ-ㅣ]/g, (jamo) => JAMO_SPEECH_MAP[jamo] || jamo)
    .replace(/\s+/g, ' ')
    .trim();
}

export function speakKorean(text: string, rate = 0.88): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  const normalized = normalizeKoreanForSpeech(text);
  if (!normalized) return;
  try {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(normalized);
    utter.lang = 'ko-KR';
    utter.rate = rate;
    utter.pitch = 1.05;
    const voices = window.speechSynthesis.getVoices();
    const koVoice =
      voices.find((v) => v.lang === 'ko-KR' && v.name.includes('Google')) ||
      voices.find((v) => v.lang.startsWith('ko'));
    if (koVoice) {
      utter.voice = koVoice;
    }
    window.speechSynthesis.speak(utter);
  } catch {
    // Ignore speech synthesis errors on unsupported browsers
  }
}
