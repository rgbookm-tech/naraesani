import React, { useState, useCallback } from 'react';

// 받침편 관련 import
import { workbookActivities as consonantWorkbookActivities } from './data/consonantData';
import { WorkbookActivity as ConsonantActivity, InfoData } from './types/constantTypes';
import ConsonantActivityHost from './components/consonant/ActivityHost';

// 모음편 관련 import
import VowelApp from './VowelApp';

interface ConsonantAppProps {
  onGoHome: () => void;
}

const InfoScreen: React.FC<{ data: InfoData, onStart: () => void, onGoHome?: () => void, isLastPage: boolean }> = ({ data, onStart, onGoHome, isLastPage }) => (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 md:p-12 w-full max-w-3xl mx-auto text-center border-4 border-[#f9cb9c] relative">
        <h2 className="text-3xl md:text-4xl font-bold text-[#e69138] mb-4">{data.title}</h2>
        <p className="text-lg md:text-xl text-gray-600 mb-8">{data.description}</p>
        <button 
            onClick={onStart} 
            className="bg-[#f99a4c] text-white font-bold text-xl px-10 py-4 rounded-full shadow-lg hover:bg-[#e69138] transition-transform transform hover:scale-105"
        >
            {isLastPage ? '다시하기' : '시작'}
        </button>
        {onGoHome && (
          <button
            onClick={onGoHome}
            className="absolute top-4 left-4 flex items-center px-3 py-1 bg-gray-200 text-gray-700 font-bold rounded-lg shadow-sm hover:bg-gray-300 transition-colors z-10"
          >
            처음으로
          </button>
        )}
    </div>
);

const consonantIntroData: InfoData = {
  title: "나래와 산이의 글자 찾기 모험(받침편)",
  description: "나래와 산이와 함께 받침 글자를 찾아 모험을 떠나보아요! '시작' 버튼을 눌러 학습을 시작하세요."
};
    
const consonantCompletionData: InfoData = {
  title: "참 잘했어요!",
  description: "모든 활동을 마쳤어요. 받침 박사가 되었네요! '다시하기' 버튼을 눌러 처음부터 다시 학습할 수 있어요."
};
    
const ConsonantApp: React.FC<ConsonantAppProps> = ({ onGoHome }) => {
  const [currentPageIndex, setCurrentPageIndex] = useState<number | null>(null);
  const [appState, setAppState] = useState<'intro' | 'workbook' | 'completion'>('intro');

  const handleNavigateToPage = useCallback((page: number) => {
    const pageIndex = consonantWorkbookActivities.findIndex(act => act.page === page);
    if (pageIndex > -1) {
      setCurrentPageIndex(pageIndex);
    }
  }, []);

  const handleGoToTOC = useCallback(() => {
    const tocIndex = consonantWorkbookActivities.findIndex(act => act.page === 0);
    setCurrentPageIndex(tocIndex > -1 ? tocIndex : 0);
  }, []);

  const handleNextPage = useCallback(() => {
    if (currentPageIndex !== null && currentPageIndex < consonantWorkbookActivities.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    }
  }, [currentPageIndex]);

  const handlePrevPage = useCallback(() => {
    if (currentPageIndex !== null && currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  }, [currentPageIndex]);

  const handleStartConsonantWorkbook = useCallback(() => {
    setAppState('workbook');
    const tocIndex = consonantWorkbookActivities.findIndex(act => act.page === 0);
    setCurrentPageIndex(tocIndex > -1 ? tocIndex : 0);
  }, []);

  const handleRestart = useCallback(() => {
    setAppState('intro');
    setCurrentPageIndex(null);
  }, []);

  const handleComplete = useCallback(() => {
    setAppState('completion');
  }, []);

  const currentConsonantActivity: ConsonantActivity | null =
    currentPageIndex !== null && consonantWorkbookActivities[currentPageIndex]
      ? (consonantWorkbookActivities[currentPageIndex] as ConsonantActivity)
      : null;

  const renderContent = () => {
    switch (appState) {
      case 'intro':
        return <InfoScreen data={consonantIntroData} onStart={handleStartConsonantWorkbook} onGoHome={onGoHome} isLastPage={false} />;
      case 'completion':
        return <InfoScreen data={consonantCompletionData} onStart={handleRestart} onGoHome={onGoHome} isLastPage={true} />;
      case 'workbook':
        if (currentConsonantActivity === null) {
          const tocIndex = consonantWorkbookActivities.findIndex(act => act.page === 0);
          setCurrentPageIndex(tocIndex > -1 ? tocIndex : 0);
          return null;
        }
        return (
          <>
            <button
              onClick={onGoHome}
              className="absolute top-4 left-4 flex items-center px-3 py-1 bg-gray-200 text-gray-700 font-bold rounded-lg shadow-sm hover:bg-gray-300 transition-colors z-10"
            >
              처음으로
            </button>
            <ConsonantActivityHost
              activity={currentConsonantActivity}
              onNextPage={handleNextPage}
              onPrevPage={handlePrevPage}
              onGoToTOC={handleGoToTOC}
              onNavigateToPage={handleNavigateToPage}
              isFirstPage={currentPageIndex === 0}
              isLastPage={currentPageIndex === consonantWorkbookActivities.length - 1}
              onComplete={handleComplete}
            />
          </>
        );
      default:
        return <InfoScreen data={consonantIntroData} onStart={handleStartConsonantWorkbook} onGoHome={onGoHome} isLastPage={false} />;
    }
  };

  return <>{renderContent()}</>;
};

// 메인 메뉴 컴포넌트
const MenuScreen: React.FC<{ onSelectBook: (book: 'consonant' | 'vowel') => void }> = ({ onSelectBook }) => (
  <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 md:p-12 w-full max-w-3xl mx-auto text-center border-4 border-lime-200">
    <h1 className="text-4xl md:text-5xl font-bold text-lime-700 mb-6">
      나래와 산이의 한글 모험
    </h1>
    <p className="text-lg md:text-xl text-gray-600 mb-10">
      배우고 싶은 내용을 선택해주세요!
    </p>
    <div className="flex flex-col md:flex-row gap-6 justify-center">
      <button
        onClick={() => onSelectBook('consonant')}
        className="bg-[#f99a4c] text-white font-bold text-2xl px-12 py-6 rounded-2xl shadow-lg hover:bg-[#e69138] transition-transform transform hover:scale-105"
      >
        받침편
      </button>
      <button
        onClick={() => onSelectBook('vowel')}
        className="bg-lime-500 text-white font-bold text-2xl px-12 py-6 rounded-2xl shadow-lg hover:bg-lime-600 transition-transform transform hover:scale-105"
      >
        모음편
      </button>
    </div>
  </div>
);

// 메인 App 컴포넌트
const App: React.FC = () => {
  const [appState, setAppState] = useState<'menu' | 'consonant_workbook' | 'vowel_workbook'>('menu');

  const handleSelectBook = (book: 'consonant' | 'vowel') => {
    if (book === 'consonant') {
      setAppState('consonant_workbook');
    } else {
      setAppState('vowel_workbook');
    }
  };

  const renderContent = () => {
    switch (appState) {
      case 'consonant_workbook':
        return <ConsonantApp onGoHome={() => setAppState('menu')} />;
      case 'vowel_workbook':
        return <VowelApp onGoHome={() => setAppState('menu')} />;
      default:
        return <MenuScreen onSelectBook={handleSelectBook} />;
    }
  };

  return (
    <div className="min-h-screen bg-lime-50 text-gray-800 flex items-center justify-center p-4">
      {/* 모음편은 더 넓은 레이아웃을 사용하므로 max-w-5xl로 확장합니다. */}
      <main className={`w-full ${appState === 'vowel_workbook' ? 'max-w-5xl' : 'max-w-4xl'} mx-auto`}>
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 border-4 border-lime-200 relative">
          <div className="absolute top-4 right-4 flex space-x-2">
             <img src="./images/bookcover.jpg" alt="book cover" className="w-12 h-20 border-2 border-orange-300"/>
             <img src="./images/rglogo.png" alt="readersguide" className="w-12 h-20 border-2 border-green-300"/>
          </div>
          {renderContent()}
        </div>
        <footer className="text-center mt-4 text-lime-600 font-semibold">
           나래와 산이의 한글 모험
        </footer>
      </main>
    </div>
  );
};

export default App;

