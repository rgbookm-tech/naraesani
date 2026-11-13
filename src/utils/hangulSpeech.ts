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

export function speakKorean(text: string, rate = 0.88): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
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
