
import React, { useState } from 'react';
import type { FillBlankItem } from '../types';

interface FillInTheBlanksProps {
  poemTitle: string;
  lines: FillBlankItem[];
}

const FillInTheBlanks: React.FC<FillInTheBlanksProps> = ({ poemTitle, lines }) => {
    const [showAnswers, setShowAnswers] = useState(false);

    return (
        <div className="p-4 bg-green-50 rounded-lg border-2 border-dashed border-green-300 w-full text-center">
            <h4 className="text-xl font-bold text-green-700 mb-4">{poemTitle}</h4>
            <div className="space-y-4">
                {lines.map((line, index) => (
                    <div key={index} className="flex flex-col sm:flex-row items-center justify-center sm:space-x-8 space-y-2 sm:space-y-0 text-lg font-semibold">
                        <span>{line.line[0]}</span>
                        <span>{line.line[1]}</span>
                    </div>
                ))}
            </div>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center sm:space-x-8 space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-2">
                    {lines[0] && Array.from({ length: lines[0].answers[0].length }).map((_, i) => (
                         <div key={`l1_a1_${i}`} className="w-8 h-10 bg-white border-2 border-green-400 rounded-md flex items-center justify-center text-green-800 font-bold text-xl">
                            {showAnswers && lines[0].answers[0][i]}
                        </div>
                    ))}
                </div>
                 <div className="flex items-center space-x-2">
                     {lines[0] && Array.from({ length: lines[0].answers[1].length }).map((_, i) => (
                         <div key={`l1_a2_${i}`} className="w-8 h-10 bg-white border-2 border-green-400 rounded-md flex items-center justify-center text-green-800 font-bold text-xl">
                            {showAnswers && lines[0].answers[1][i]}
                        </div>
                    ))}
                </div>
            </div>
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-center sm:space-x-8 space-y-4 sm:space-y-0">
                 <div className="flex items-center space-x-2">
                     {lines[1] && Array.from({ length: lines[1].answers[0].length }).map((_, i) => (
                         <div key={`l2_a1_${i}`} className="w-8 h-10 bg-white border-2 border-green-400 rounded-md flex items-center justify-center text-green-800 font-bold text-xl">
                            {showAnswers && lines[1].answers[0][i]}
                        </div>
                    ))}
                </div>
                 <div className="flex items-center space-x-2">
                     {lines[1] && Array.from({ length: lines[1].answers[1].length }).map((_, i) => (
                         <div key={`l2_a2_${i}`} className="w-8 h-10 bg-white border-2 border-green-400 rounded-md flex items-center justify-center text-green-800 font-bold text-xl">
                           {showAnswers && lines[1].answers[1][i]}
                        </div>
                    ))}
                </div>
            </div>

            <button
                onClick={() => setShowAnswers(prev => !prev)}
                className="mt-6 px-5 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors"
            >
                {showAnswers ? '정답 숨기기' : '정답 보기'}
            </button>
        </div>
    );
};

export default FillInTheBlanks;
