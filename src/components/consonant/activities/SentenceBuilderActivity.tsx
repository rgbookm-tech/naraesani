
import React, { useState } from 'react';
import type { SentenceBuilderActivity, SentenceBuilderPrompt } from '../../types';

interface SentenceBuilderActivityProps {
  activity: SentenceBuilderActivity;
}

const SentenceBuilderActivityComponent: React.FC<SentenceBuilderActivityProps> = ({ activity }) => {
  // Check if the words are simple strings or complex prompts
  const isSimpleWords = typeof activity.words[0] === 'string';

  // Always call hooks at the top level
  const [sentence, setSentence] = useState('');
  const [sentences, setSentences] = useState<string[]>(() => Array(activity.words.length).fill(''));

  const handleSentenceChange = (index: number, value: string) => {
    const newSentences = [...sentences];
    newSentences[index] = value;
    setSentences(newSentences);
  };

  if (isSimpleWords) {
    // Original layout for simple string array
    return (
      <div>
        <h3 className="text-xl font-semibold mb-6 text-gray-700">
          <span className="bg-orange-200 text-orange-800 text-lg font-bold mr-2 px-2.5 py-0.5 rounded-full">{activity.activityNumber}</span>
          {activity.question}
        </h3>
        <div className="flex flex-wrap gap-3 p-4 bg-lime-100 rounded-lg mb-6">
          {(activity.words as string[]).map((word, index) => (
            <span key={index} className="px-4 py-2 bg-white rounded-full shadow-sm text-lg font-medium text-gray-700">
              {word}
            </span>
          ))}
        </div>
        <div className="bg-white p-4 rounded-lg border-2 border-dashed border-lime-300">
          <textarea
            value={sentence}
            onChange={(e) => setSentence(e.target.value)}
            rows={5}
            className="w-full p-3 text-lg border-2 border-gray-200 rounded-md focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition"
            placeholder="여기에 문장을 만들어 보세요..."
          />
        </div>
      </div>
    );
  }

  // New layout for complex prompt objects

  return (
    <div>
      <h3 className="text-xl font-semibold mb-6 text-gray-700">
        <span className="bg-orange-200 text-orange-800 text-lg font-bold mr-2 px-2.5 py-0.5 rounded-full">{activity.activityNumber}</span>
        {activity.question}
      </h3>
      <div className="space-y-6">
        {(activity.words as SentenceBuilderPrompt[]).map((prompt, index) => (
          <div key={index} className="p-4 bg-lime-50 rounded-lg border-l-4 border-lime-300">
            <div className="flex items-center mb-3">
              <span className="text-2xl font-bold text-lime-800 bg-lime-200 px-4 py-1 rounded-md">{prompt.word}</span>
              {prompt.example && <span className="ml-4 text-gray-600 italic">예: {prompt.example}</span>}
            </div>
            <textarea
              rows={3}
              className="w-full p-3 text-lg border-2 border-gray-200 rounded-md focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition"
              placeholder={prompt.placeholder || '여기에 문장을 만들어 보세요...'}
              value={sentences[index]}
              onChange={(e) => handleSentenceChange(index, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SentenceBuilderActivityComponent;
