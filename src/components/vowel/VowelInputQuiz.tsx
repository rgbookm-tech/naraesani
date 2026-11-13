import React, { useState } from 'react';
import { speakKorean } from '../../utils/hangulSpeech';

interface VowelInputQuizProps {
  exampleSentence: string;
  vowel: string;
}

const hasVowel = (word: string, targetVowel: string): boolean => {
  const allVowels = [
    'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ',
    'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ',
  ];
  const targetVowelIndex = allVowels.indexOf(targetVowel);

  if (targetVowelIndex === -1) return false;

  for (const char of word) {
    const charCode = char.charCodeAt(0);
    if (charCode >= 0xac00 && charCode <= 0xd7a3) {
      const vowelIndex = Math.floor(((charCode - 0xac00) % 588) / 28);
      if (vowelIndex === targetVowelIndex) {
        return true;
      }
    }
  }
  return false;
};

const VowelInputQuiz: React.FC<VowelInputQuizProps> = ({ exampleSentence, vowel }) => {
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) {
      return;
    }

    if (hasVowel(trimmed, vowel)) {
      setStatus('correct');
      speakKorean(`${trimmed}! 참 잘했어요!`);
    } else {
      setStatus('incorrect');
      speakKorean(`${vowel} 소리가 들어간 낱말을 다시 생각해 봐요.`);
    }
  };

  const handleReset = () => {
    setInputValue('');
    setStatus('idle');
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'correct':
        return '참 잘했어요!';
      case 'incorrect':
        return `'${vowel}' 소리가 들어간 낱말을 다시 생각해 봐요.`;
      default:
        return '';
    }
  };

  const getInputClasses = () => {
    switch (status) {
      case 'correct':
        return 'border-emerald-500 ring-emerald-500';
      case 'incorrect':
        return 'border-rose-500 ring-rose-500 animate-shake';
      default:
        return 'border-gray-300 focus:border-amber-500 focus:ring-amber-500';
    }
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center p-4">
      <div className="w-full p-4 mb-6 bg-amber-50 border-2 border-dashed border-amber-300 rounded-2xl text-center flex flex-col items-center gap-2">
        <p className="text-xl text-amber-950 font-bold">{exampleSentence}</p>
        <button
          type="button"
          onClick={() => speakKorean(exampleSentence)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-extrabold shadow-sm transition-transform active:scale-95"
        >
          🔊 예시문 듣기
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-2"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={status !== 'idle'}
          placeholder="여기에 낱말을 써 보세요"
          className={`w-full sm:flex-grow text-lg p-3 border-2 rounded-xl transition-all duration-300 focus:ring-2 bg-yellow-50 text-gray-800 placeholder-gray-400 font-bold ${getInputClasses()}`}
        />
        <button
          type="submit"
          disabled={status !== 'idle' || !inputValue.trim()}
          className="w-full sm:w-auto shrink-0 whitespace-nowrap px-6 py-3 bg-emerald-500 text-white font-black rounded-xl hover:bg-emerald-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-sm"
        >
          확인
        </button>
      </form>

      <div className="min-h-[4.5rem] mt-4 flex flex-col items-center justify-center">
        {status !== 'idle' && (
          <>
            <p
              className={`text-xl sm:text-2xl font-bold text-center ${
                status === 'correct' ? 'text-yellow-500 animate-bounce' : 'text-rose-500'
              }`}
            >
              {getStatusMessage()}
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="mt-2 px-4 py-1.5 bg-gray-500 text-white text-sm font-bold rounded-lg hover:bg-gray-600 transition-colors"
            >
              다시 하기
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VowelInputQuiz;
