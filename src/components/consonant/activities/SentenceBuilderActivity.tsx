import React, { useState } from 'react';
import type { SentenceBuilderActivity, SentenceBuilderPrompt } from '../../types';
import { speakKorean } from '../../../utils/hangulSpeech';

interface SentenceBuilderActivityProps {
  activity: SentenceBuilderActivity;
}

const SentenceBuilderActivityComponent: React.FC<SentenceBuilderActivityProps> = ({ activity }) => {
  const isSimpleWords = typeof activity.words[0] === 'string';

  const [sentence, setSentence] = useState('');
  const [sentences, setSentences] = useState<string[]>(() => Array(activity.words.length).fill(''));

  const handleSentenceChange = (index: number, value: string) => {
    const newSentences = [...sentences];
    newSentences[index] = value;
    setSentences(newSentences);
  };

  if (isSimpleWords) {
    return (
      <div>
        <h3 className="text-xl font-semibold mb-6 text-gray-700">
          <span className="bg-orange-200 text-orange-800 text-lg font-bold mr-2 px-2.5 py-0.5 rounded-full">
            {activity.activityNumber}
          </span>
          {activity.question}
        </h3>
        <div className="flex flex-wrap items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl mb-6">
          {(activity.words as string[]).map((word, index) => (
            <button
              key={index}
              type="button"
              onClick={() => speakKorean(word)}
              className="px-4 py-2 bg-white hover:bg-emerald-100 rounded-full shadow-sm text-lg font-bold text-gray-800 border border-emerald-200 transition-transform active:scale-95"
              title="클릭하여 소리 듣기"
            >
              🔊 {word}
            </button>
          ))}
        </div>
        <div className="bg-white p-4 rounded-xl border-2 border-dashed border-emerald-300">
          <textarea
            value={sentence}
            onChange={(e) => setSentence(e.target.value)}
            rows={4}
            className="w-full p-3 text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 transition"
            placeholder="여기에 문장을 만들어 보세요..."
          />
          {sentence.trim() && (
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={() => speakKorean(sentence)}
                className="px-4 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-sm"
              >
                🔊 내가 쓴 문장 듣기
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-6 text-gray-700">
        <span className="bg-orange-200 text-orange-800 text-lg font-bold mr-2 px-2.5 py-0.5 rounded-full">
          {activity.activityNumber}
        </span>
        {activity.question}
      </h3>
      <div className="space-y-6">
        {(activity.words as SentenceBuilderPrompt[]).map((prompt, index) => {
          const wordTokens = prompt.word
            .split('/')
            .map((w) => w.trim())
            .filter(Boolean);
          return (
            <div
              key={index}
              className="p-4 bg-emerald-50 rounded-xl border-l-4 border-emerald-400"
            >
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {wordTokens.map((tok) => (
                  <button
                    key={tok}
                    type="button"
                    onClick={() => speakKorean(tok)}
                    className="text-lg sm:text-xl font-bold text-emerald-900 bg-emerald-200 hover:bg-emerald-300 px-3.5 py-1 rounded-lg transition-colors"
                    title="클릭하여 낱말 듣기"
                  >
                    🔊 {tok}
                  </button>
                ))}
                {prompt.example && (
                  <button
                    type="button"
                    onClick={() =>
                      speakKorean(prompt.example!.replace(/[()]/g, ''))
                    }
                    className="ml-2 text-sm sm:text-base text-gray-700 bg-white hover:bg-amber-50 px-3 py-1 rounded-full border border-gray-200 font-medium"
                  >
                    🔊 예: {prompt.example}
                  </button>
                )}
              </div>
              <textarea
                rows={3}
                className="w-full p-3 text-lg border-2 border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 transition"
                placeholder={prompt.placeholder || '여기에 문장을 만들어 보세요...'}
                value={sentences[index]}
                onChange={(e) => handleSentenceChange(index, e.target.value)}
              />
              {sentences[index]?.trim() && (
                <div className="mt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => speakKorean(sentences[index])}
                    className="px-4 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-sm"
                  >
                    🔊 내가 쓴 문장 듣기
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SentenceBuilderActivityComponent;
