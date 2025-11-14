import React from 'react';
import { worksheetData } from '../../data/vowelData';

interface TableOfContentsProps {
  onSelect: (index: number) => void;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ onSelect }) => {
  const vowels = worksheetData.map(data => data.vowel);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-amber-50">
      <div className="w-full max-w-4xl text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-amber-800 mb-4">
          한글 모음 배우기
        </h1>
        <p className="text-lg text-gray-600 mb-10">
          배우고 싶은 글자를 선택하세요!
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 sm:gap-6">
          {vowels.map((vowel, index) => (
            <button
              key={vowel}
              onClick={() => onSelect(index)}
              className="aspect-square bg-white rounded-2xl shadow-lg border-4 border-transparent hover:border-yellow-400 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex items-center justify-center"
            >
              <span className="text-5xl sm:text-7xl font-extrabold text-rose-500">{vowel}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TableOfContents;
