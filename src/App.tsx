import React, { useState, useCallback } from 'react';

// 받침편 관련 import
import { workbookActivities as consonantWorkbookActivities } from './data/consonantData';
import { WorkbookActivity as ConsonantActivity, InfoData } from './types/constantTypes';
import ConsonantActivityHost from './components/consonant/ActivityHost';

// 모음편 관련 import
import VowelApp from './VowelApp';

// 이미지 경로 헬퍼
import { getImagePath } from './utils/imagePath';

const PortraitOverlay = () => (
  <div className="portrait-overlay fixed inset-0 z-[100] bg-gray-900 flex-col items-center justify-center text-white p-6">
    <div className="animate-pulse mb-6">
      <svg className="w-24 h-24 text-yellow-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {/* Phone rotate icon */}
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h11M9 21V3M17 16l4-4m0 0l-4-4m4 4H9" />
      </svg>
    </div>
    <h2 className="text-3xl font-bold mb-4 text-center text-yellow-300 tracking-tight">화면을 눕혀주세요!</h2>
    <p className="text-xl text-gray-300 text-center leading-relaxed">
      이 화면은 <span className="font-bold text-white">가로 모드</span>에 맞추어져 있어요.<br/>
      스마트폰을 시계 방향으로 돌려주세요.
    </p>
  </div>
);

interface ConsonantAppProps {
  onGoHome: () => void;
  initialPage?: number;
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
    
const ConsonantApp: React.FC<ConsonantAppProps> = ({ onGoHome, initialPage }) => {
  const [currentPageIndex, setCurrentPageIndex] = useState<number | null>(() => {
    if (initialPage !== undefined) {
      const pageIndex = consonantWorkbookActivities.findIndex(act => act.page === initialPage);
      return pageIndex > -1 ? pageIndex : null;
    }
    return null;
  });
  const [appState, setAppState] = useState<'intro' | 'workbook' | 'completion'>(() => {
    if (initialPage !== undefined) {
      const pageIndex = consonantWorkbookActivities.findIndex(act => act.page === initialPage);
      if (pageIndex > -1) return 'workbook';
    }
    return 'intro';
  });

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
  const [appState, setAppState] = useState<'menu' | 'consonant_workbook' | 'vowel_workbook'>(() => {
    const params = new URLSearchParams(window.location.search);
    const book = params.get('book');
    if (book === 'consonant') return 'consonant_workbook';
    if (book === 'vowel') return 'vowel_workbook';
    return 'menu';
  });

  const [initialPage, setInitialPage] = useState<number | undefined>(() => {
    const params = new URLSearchParams(window.location.search);
    const pageStr = params.get('page');
    const page = pageStr ? parseInt(pageStr, 10) : undefined;
    return (page !== undefined && !isNaN(page)) ? page : undefined;
  });

  const handleSelectBook = (book: 'consonant' | 'vowel') => {
    setInitialPage(undefined); // Clear initial page on manual selection
    if (book === 'consonant') {
      setAppState('consonant_workbook');
    } else {
      setAppState('vowel_workbook');
    }
  };

  const handleGoHome = () => {
    setInitialPage(undefined); // Clear initial page
    setAppState('menu');
    // 메뉴로 돌아갈 때 URL 파라미터 초기화
    window.history.replaceState(null, '', window.location.pathname);
  };

  const renderContent = () => {
    switch (appState) {
      case 'consonant_workbook':
        return <ConsonantApp onGoHome={handleGoHome} initialPage={initialPage} />;
      case 'vowel_workbook':
        return <VowelApp onGoHome={handleGoHome} initialPage={initialPage} />;
      default:
        return <MenuScreen onSelectBook={handleSelectBook} />;
    }
  };

  return (
    <div className="min-h-screen bg-lime-50 text-gray-800 flex items-center justify-center p-4">
      <PortraitOverlay />
      {/* 모음편은 더 넓은 레이아웃을 사용하므로 max-w-5xl로 확장합니다. */}
      <main className={`w-full ${appState === 'vowel_workbook' ? 'max-w-5xl' : 'max-w-4xl'} mx-auto`}>
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 border-4 border-lime-200 relative">
          <div className="absolute top-4 right-4 flex space-x-2">
             <img src={getImagePath("/images/bookcover.jpg")} alt="book cover" className="w-12 h-20 border-2 border-orange-300"/>
             <img src={getImagePath("/images/rglogo.png")} alt="readersguide" className="w-12 h-20 border-2 border-green-300"/>
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
