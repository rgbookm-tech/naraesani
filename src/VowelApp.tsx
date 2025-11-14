import React, { useState, useCallback } from 'react';
import { worksheetData } from './data/vowelData'; // 경로 수정
import WorksheetPage from './components/vowel/WorksheetPage'; // 경로 수정
import Navigation from './components/vowel/Navigation'; // 경로 수정
import TableOfContents from './components/vowel/TableOfContents'; // 경로 수정

interface VowelAppProps {
  onGoHome: () => void;
}

const VowelApp: React.FC<VowelAppProps> = ({ onGoHome }) => {
  const [currentVowelIndex, setCurrentVowelIndex] = useState(-1);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);

  const handleSelectVowel = useCallback((index: number) => {
    setCurrentVowelIndex(index);
    setCurrentActivityIndex(0);
  }, []);

  if (currentVowelIndex === -1) {
    return <TableOfContents onSelect={handleSelectVowel} />;
  }

  const numActivitiesPerVowel = worksheetData[0]?.activities.length || 5;
  const totalPages = worksheetData.length * numActivitiesPerVowel;
  const currentPageNumber = currentVowelIndex * numActivitiesPerVowel + currentActivityIndex + 1;

  const handleNext = () => {
    const currentVowelActivities = worksheetData[currentVowelIndex].activities.length;
    if (currentActivityIndex < currentVowelActivities - 1) {
      setCurrentActivityIndex(prev => prev + 1);
    } else {
      setCurrentActivityIndex(0);
      setCurrentVowelIndex(prev => (prev + 1) % worksheetData.length);
    }
  };

  const handlePrev = () => {
    if (currentActivityIndex > 0) {
      setCurrentActivityIndex(prev => prev - 1);
    } else {
      const prevVowelIndex = (currentVowelIndex - 1 + worksheetData.length) % worksheetData.length;
      const numActivitiesInPrevVowel = worksheetData[prevVowelIndex].activities.length;
      setCurrentActivityIndex(numActivitiesInPrevVowel - 1);
      setCurrentVowelIndex(prevVowelIndex);
    }
  };

  const currentWorksheet = worksheetData[currentVowelIndex];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-amber-50 text-gray-800">
      <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl p-4 sm:p-8 border-4 border-amber-200 relative">
        <button
          onClick={onGoHome}
          className="absolute top-4 left-4 flex items-center px-3 py-1 bg-gray-200 text-gray-700 font-bold rounded-lg shadow-sm hover:bg-gray-300 transition-colors z-10"
          aria-label="Go to Main Menu"
        >
          <span role="img" aria-label="home icon" className="mr-2">🏠</span>
          처음으로
        </button>
        <div className="absolute top-4 right-4 text-sm font-bold text-amber-500 bg-amber-100 px-3 py-1 rounded-full">
          {currentPageNumber} / {totalPages}
        </div>
        <WorksheetPage 
          data={currentWorksheet} 
          activityIndex={currentActivityIndex} 
        />
        <Navigation onPrev={handlePrev} onNext={handleNext} />
      </div>
      <footer className="mt-6 text-center text-gray-500 text-sm">
        <p>나래와 산이 한글 모험 (모음편)</p>
      </footer>
    </div>
  );
};

export default VowelApp;