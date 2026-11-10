import React, { useState, useCallback, useEffect } from 'react';
import { useLanguage, LanguageSelector } from './i18n/LanguageContext';

// 받침편 관련 import
import { workbookActivities as consonantWorkbookActivities } from './data/consonantData';
import { WorkbookActivity as ConsonantActivity, InfoData } from './types/constantTypes';
import ConsonantActivityHost from './components/consonant/ActivityHost';

// 모음편 관련 import
import VowelApp from './VowelApp';

// 통합 대시보드 & 독서·논술 지도안 & NCIC 교육과정 & 회원/관리자 모달 import
import {
  INITIAL_WORKBOOKS,
  INITIAL_ROADMAPS,
  INITIAL_CURRICULUM_STANDARDS,
  WorkbookItem,
  RoadmapTheme,
  CurriculumStandard,
} from './data/studyGuideData';
import {
  getCurrentUserId,
  getSavedMemberUser,
  fetchDashboardData,
  fetchUserWallet,
  UserWallet,
  CreditTransaction,
  RgMemberUser,
  DynamicThemeItem,
} from './services/workbookApi';
import DashboardView from './components/guide/DashboardView';
import StudyGuideWorkbook from './components/guide/StudyGuideWorkbook';
import WalletModal from './components/guide/WalletModal';
import MemberLoginModal from './components/guide/MemberLoginModal';
import AdminConsoleModal from './components/guide/AdminConsoleModal';

// 이미지 경로 헬퍼
import { getImagePath } from './utils/imagePath';

const PortraitOverlay = () => (
  <div className="portrait-overlay fixed inset-0 z-[100] bg-gray-900 flex-col items-center justify-center text-white p-6">
    <div className="animate-pulse mb-6">
      <svg className="w-24 h-24 text-yellow-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h11M9 21V3M17 16l4-4m0 0l-4-4m4 4H9" />
      </svg>
    </div>
    <h2 className="text-3xl font-bold mb-4 text-center text-yellow-300 tracking-tight">화면을 눕혀주세요! / Please rotate!</h2>
    <p className="text-xl text-gray-300 text-center leading-relaxed">
      이 화면은 <span className="font-bold text-white">가로 모드</span>에 맞추어져 있어요.<br />
      스마트폰을 시계 방향으로 돌려주세요.
    </p>
  </div>
);

interface ConsonantAppProps {
  onGoHome: () => void;
  initialPage?: number;
}

const InfoScreen: React.FC<{ data: InfoData; onStart: () => void; onGoHome?: () => void; isLastPage: boolean }> = ({
  data,
  onStart,
  onGoHome,
  isLastPage,
}) => {
  const { t } = useLanguage();
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 md:p-12 w-full max-w-3xl mx-auto text-center border-4 border-[#f9cb9c] relative">
      <h2 className="text-3xl md:text-4xl font-bold text-[#e69138] mb-4">{data.title}</h2>
      <p className="text-lg md:text-xl text-gray-600 mb-8">{data.description}</p>
      <button
        onClick={onStart}
        className="bg-[#f99a4c] text-white font-bold text-xl px-10 py-4 rounded-full shadow-lg hover:bg-[#e69138] transition-transform transform hover:scale-105"
      >
        {isLastPage ? t('다시하기') : t('시작')}
      </button>
      {onGoHome && (
        <button
          onClick={onGoHome}
          className="absolute top-4 left-4 flex items-center px-3 py-1 bg-gray-200 text-gray-700 font-bold rounded-lg shadow-sm hover:bg-gray-300 transition-colors z-10"
        >
          {t('처음으로')}
        </button>
      )}
    </div>
  );
};

const consonantIntroData: InfoData = {
  title: '나래와 산이의 글자 찾기 모험(받침편)',
  description: "나래와 산이와 함께 받침 글자를 찾아 모험을 떠나보아요! '시작' 버튼을 눌러 학습을 시작하세요.",
};

const consonantCompletionData: InfoData = {
  title: '참 잘했어요!',
  description: "모든 활동을 마쳤어요. 받침 박사가 되었네요! '다시하기' 버튼을 눌러 처음부터 다시 학습할 수 있어요.",
};

const ConsonantApp: React.FC<ConsonantAppProps> = ({ onGoHome, initialPage }) => {
  const [currentPageIndex, setCurrentPageIndex] = useState<number | null>(() => {
    if (initialPage !== undefined) {
      const pageIndex = consonantWorkbookActivities.findIndex((act) => act.page === initialPage);
      return pageIndex > -1 ? pageIndex : null;
    }
    return null;
  });
  const [appState, setAppState] = useState<'intro' | 'workbook' | 'completion'>(() => {
    if (initialPage !== undefined) {
      const pageIndex = consonantWorkbookActivities.findIndex((act) => act.page === initialPage);
      if (pageIndex > -1) return 'workbook';
    }
    return 'intro';
  });

  const handleNavigateToPage = useCallback((page: number) => {
    const pageIndex = consonantWorkbookActivities.findIndex((act) => act.page === page);
    if (pageIndex > -1) {
      setCurrentPageIndex(pageIndex);
    }
  }, []);

  const handleGoToTOC = useCallback(() => {
    const tocIndex = consonantWorkbookActivities.findIndex((act) => act.page === 0);
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
    const tocIndex = consonantWorkbookActivities.findIndex((act) => act.page === 0);
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
          const tocIndex = consonantWorkbookActivities.findIndex((act) => act.page === 0);
          setCurrentPageIndex(tocIndex > -1 ? tocIndex : 0);
          return null;
        }
        return (
          <>
            <GoHomeButton onClick={onGoHome} />
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

const GoHomeButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const { t } = useLanguage();
  return (
    <button
      onClick={onClick}
      className="absolute top-4 left-4 flex items-center px-3 py-1 bg-gray-200 text-gray-700 font-bold rounded-lg shadow-sm hover:bg-gray-300 transition-colors z-10"
    >
      {t('처음으로')}
    </button>
  );
};

type AppRouteState = 'dashboard' | 'consonant_workbook' | 'vowel_workbook' | 'study_guide';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<RgMemberUser | null>(() => getSavedMemberUser());
  const [userid, setUserid] = useState<string>(() => getCurrentUserId());
  const [workbooks, setWorkbooks] = useState<WorkbookItem[]>(INITIAL_WORKBOOKS);
  const [roadmaps, setRoadmaps] = useState<RoadmapTheme[]>(INITIAL_ROADMAPS);
  const [curriculumStandards, setCurriculumStandards] = useState<CurriculumStandard[]>(
    INITIAL_CURRICULUM_STANDARDS
  );
  const [dynamicThemes, setDynamicThemes] = useState<DynamicThemeItem[]>([]);
  const [wallet, setWallet] = useState<UserWallet>({
    userid,
    free_trial_credits: 3,
    paid_credits: 0,
    total_used_credits: 0,
    member_mileage: currentUser?.mileage ?? 0,
    is_rg_member: !!currentUser,
  });
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);

  // Modal states
  const [isWalletModalOpen, setIsWalletModalOpen] = useState<boolean>(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [adminEditCode, setAdminEditCode] = useState<string | null>(null);

  const [selectedGuideCode, setSelectedGuideCode] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    const book = params.get('book');
    if (book === 'gmo_kid' || book === 'gmo') return 'gmo_kid';
    if (book === 'mania_essay' || book === 'mania') return 'mania_essay';
    if (book) return book;
    return 'mania_essay';
  });

  const [appState, setAppState] = useState<AppRouteState>(() => {
    const params = new URLSearchParams(window.location.search);
    const book = params.get('book');
    if (book === 'consonant' || book === 'naraesani_consonant') return 'consonant_workbook';
    if (book === 'vowel' || book === 'naraesani_vowel') return 'vowel_workbook';
    if (book) {
      return 'study_guide';
    }
    return 'dashboard';
  });

  const [initialPage, setInitialPage] = useState<number | undefined>(() => {
    const params = new URLSearchParams(window.location.search);
    const pageStr = params.get('page');
    const page = pageStr ? parseInt(pageStr, 10) : undefined;
    return page !== undefined && !isNaN(page) ? page : undefined;
  });

  const refreshAllData = useCallback(
    (activeUid?: string) => {
      const targetUid = activeUid || userid;
      fetchDashboardData().then((data) => {
        setWorkbooks(data.workbooks);
        setRoadmaps(data.roadmaps);
        if (data.curriculum_standards && data.curriculum_standards.length > 0) {
          setCurriculumStandards(data.curriculum_standards);
        }
        if (data.dynamic_themes) {
          setDynamicThemes(data.dynamic_themes);
        }
      });
      fetchUserWallet(targetUid).then((wData) => {
        setWallet(wData.wallet);
        setTransactions(wData.transactions || []);
      });
    },
    [userid]
  );

  useEffect(() => {
    refreshAllData(userid);
  }, [userid, refreshAllData]);

  const handleLoginSuccess = (user: RgMemberUser, newWallet: UserWallet) => {
    setCurrentUser(user);
    setUserid(user.userid);
    setWallet(newWallet);
    refreshAllData(user.userid);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    const nextGuestId = getCurrentUserId();
    setUserid(nextGuestId);
    refreshAllData(nextGuestId);
  };

  const handleOpenAdminModal = (editCode?: string) => {
    setAdminEditCode(editCode || null);
    setIsAdminModalOpen(true);
  };

  const handleSelectWorkbook = (code: string) => {
    setInitialPage(undefined);
    if (code === 'consonant' || code === 'naraesani_consonant') {
      setAppState('consonant_workbook');
    } else if (code === 'vowel' || code === 'naraesani_vowel') {
      setAppState('vowel_workbook');
    } else {
      setSelectedGuideCode(code);
      setAppState('study_guide');
    }
  };

  const handleGoHome = () => {
    setInitialPage(undefined);
    setAppState('dashboard');
    window.history.replaceState(null, '', window.location.pathname);
    refreshAllData(userid);
  };

  const handleWalletUpdated = (newWallet: UserWallet, newTx: CreditTransaction[]) => {
    setWallet(newWallet);
    setTransactions(newTx);
  };

  const renderContent = () => {
    switch (appState) {
      case 'consonant_workbook':
        return <ConsonantApp onGoHome={handleGoHome} initialPage={initialPage} />;
      case 'vowel_workbook':
        return <VowelApp onGoHome={handleGoHome} initialPage={initialPage} />;
      case 'study_guide':
        return (
          <StudyGuideWorkbook
            workbookCode={selectedGuideCode}
            userid={userid}
            wallet={wallet}
            currentUser={currentUser}
            onWalletChange={(nw) => {
              setWallet(nw);
              fetchUserWallet(userid).then((d) => setTransactions(d.transactions || []));
            }}
            onOpenWalletModal={() => setIsWalletModalOpen(true)}
            onOpenMemberModal={() => setIsMemberModalOpen(true)}
            onOpenAdminModal={handleOpenAdminModal}
            onGoHome={handleGoHome}
            onSelectWorkbook={handleSelectWorkbook}
          />
        );
      default:
        return (
          <DashboardView
            workbooks={workbooks}
            roadmaps={roadmaps}
            curriculumStandards={curriculumStandards}
            dynamicThemes={dynamicThemes}
            wallet={wallet}
            currentUser={currentUser}
            onSelectWorkbook={handleSelectWorkbook}
            onOpenWalletModal={() => setIsWalletModalOpen(true)}
            onOpenMemberModal={() => setIsMemberModalOpen(true)}
            onOpenAdminModal={handleOpenAdminModal}
          />
        );
    }
  };

  const isInfantInteractive = appState === 'consonant_workbook' || appState === 'vowel_workbook';

  return (
    <div className="min-h-screen bg-lime-50 text-gray-800 flex items-center justify-center p-3 md:p-6">
      {isInfantInteractive && <PortraitOverlay />}
      <main className={`w-full ${isInfantInteractive ? 'max-w-5xl' : 'max-w-6xl'} mx-auto`}>
        <div className="bg-white rounded-3xl shadow-lg p-5 md:p-8 border-4 border-lime-200 relative">
          {/* Top Bar with Language Selector, Member Status, Admin Menu & Brand Logos */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-lime-100">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={handleGoHome}>
              <img
                src={getImagePath('/images/rglogo.png')}
                alt="readersguide"
                className="w-8 h-10 object-contain rounded border border-green-300"
              />
              <div>
                <div className="font-black text-emerald-900 text-base md:text-lg leading-none flex items-center gap-2">
                  <span>독서활동앱</span>
                  <span className="text-[11px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    ReadersGuide 모듈
                  </span>
                </div>
                <div className="text-[11px] text-gray-500 mt-0.5">
                  학년별 · 7대 교과별(NCIC 교육과정) · 주제별 · 기본학습(한국어/책읽기/논술/글쓰기)
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={() => setIsMemberModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-extrabold transition-colors"
              >
                {currentUser
                  ? `👤 ${currentUser.nickname || currentUser.userid} (${(wallet.member_mileage ?? currentUser.mileage ?? 0).toLocaleString()}P)`
                  : '🔐 리더스가이드 로그인'}
              </button>
              <button
                type="button"
                onClick={() => handleOpenAdminModal()}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-extrabold transition-colors"
              >
                ⚙️ 관리자 메뉴
              </button>
              <LanguageSelector />
              <img
                src={getImagePath('/images/bookcover.jpg')}
                alt="book cover"
                className="w-8 h-11 object-cover rounded border border-orange-300 hidden sm:block"
              />
            </div>
          </div>

          {renderContent()}
        </div>
        <footer className="text-center mt-4 text-emerald-800 font-semibold text-xs md:text-sm">
          © ReadersGuide (리더스가이드) · 독서활동앱 (NCIC 국가교육과정 연계 독서·워크북·논술 플랫폼)
        </footer>
      </main>

      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        wallet={wallet}
        currentUser={currentUser}
        transactions={transactions}
        onWalletUpdated={handleWalletUpdated}
        onOpenMemberModal={() => setIsMemberModalOpen(true)}
      />

      <MemberLoginModal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        currentUser={currentUser}
        wallet={wallet}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
      />

      <AdminConsoleModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        workbooks={workbooks}
        curriculumStandards={curriculumStandards}
        initialEditCode={adminEditCode}
        onSaved={() => refreshAllData(userid)}
      />
    </div>
  );
};

export default App;
