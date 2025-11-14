import React, { useState } from 'react';

interface VowelInputQuizProps {
  exampleSentence: string;
  vowel: string;
}

const hasVowel = (word: string, targetVowel: string): boolean => {
  const allVowels = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
  const targetVowelIndex = allVowels.indexOf(targetVowel);

  if (targetVowelIndex === -1) return false;

  for (const char of word) {
    const charCode = char.charCodeAt(0);
    if (charCode >= 0xAC00 && charCode <= 0xD7A3) {
      const vowelIndex = Math.floor(((charCode - 0xAC00) % 588) / 28);
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
    if (!inputValue.trim()) {
      return;
    }

    if (hasVowel(inputValue, vowel)) {
      setStatus('correct');
    } else {
      setStatus('incorrect');
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
        return `'${vowel}' 소리가 들어간 낱말을 다시 생각해봐요.`;
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
        return 'border-gray-300 focus:border-sky-500 focus:ring-sky-500';
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center p-4">
      <div className="w-full p-4 mb-6 bg-sky-50 border-2 border-dashed border-sky-300 rounded-lg text-center">
        <p className="text-xl text-sky-800 font-semibold">{exampleSentence}</p>
      </div>
      
      <form onSubmit={handleSubmit} className="w-full flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={status !== 'idle'}
          placeholder="여기에 입력하세요"
          className={`w-full sm:flex-grow text-lg p-3 border-2 rounded-lg transition-all duration-300 focus:ring-2 bg-yellow-100 text-gray-800 placeholder-gray-600 ${getInputClasses()}`}
        />
        <button
          type="submit"
          disabled={status !== 'idle' || !inputValue.trim()}
          className="w-full sm:w-auto px-6 py-3 bg-sky-500 text-white font-bold rounded-lg hover:bg-sky-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          확인
        </button>
      </form>

      <div className="h-16 mt-4 flex flex-col items-center justify-center">
        {status !== 'idle' && (
          <>
            <p className={`text-2xl font-bold ${status === 'correct' ? 'text-yellow-500 animate-bounce' : 'text-rose-500'}`}>
              {getStatusMessage()}
            </p>
            <button
              onClick={handleReset}
              className="mt-2 px-4 py-1 bg-gray-500 text-white text-sm font-bold rounded-lg hover:bg-gray-600 transition-colors"
            >
              다시하기
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VowelInputQuiz;