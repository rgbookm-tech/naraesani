import React, { useMemo } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { WorkbookActivity, ActivityType, TableOfContentsActivity } from '../../types';
import { workbookActivities } from '../../data/consonantData';
import WordCloudSearchActivityComponent from './activities/WordCloudSearchActivity';
import GridPathActivityComponent from './activities/GridPathActivity';
import RadialFillInTheBlanksActivityComponent from './activities/RadialFillInTheBlanksActivity';
import FillInTheBlanksActivityComponent from './activities/FillInTheBlanksActivity';
import SentenceBuilderActivityComponent from './activities/SentenceBuilderActivity';
import ConnectPairsActivityComponent from './activities/ConnectPairsActivity';
import WordImageGridActivityComponent from './activities/WordImageGridActivity';
import MultipleChoiceSentenceActivityComponent from './activities/MultipleChoiceSentenceActivity';
import MultipleChoiceImageActivityComponent from './activities/MultipleChoiceImageActivity';
import ConnectTextPairsActivityComponent from './activities/ConnectTextPairsActivity';
import MatchingLadderActivityComponent from './activities/MatchingLadderActivity';
import PathSelectorActivityComponent from './activities/pathSelectorActivity';
import CloudDragAndDropActivityComponent from './activities/CloudDragAndDropActivity';
import FillTheBlankInSyllableActivityComponent from './activities/FillTheBlankInSyllableActivity';
import TableOfContentsActivityComponent, {
  BATCHIM_GROUP_META,
} from './activities/TableOfContentsActivity';
import { playSound, SoundType } from '../../utils/sound';
import { speakKorean } from '../../utils/hangulSpeech';

interface ActivityHostProps {
  activity: WorkbookActivity;
  onNextPage: () => void;
  onPrevPage: () => void;
  onGoToTOC: () => void;
  onNavigateToPage: (page: number) => void;
  isFirstPage: boolean;
  isLastPage: boolean;
  onComplete: () => void;
}

const ActivityHost: React.FC<ActivityHostProps> = ({
  activity,
  onNextPage,
  onPrevPage,
  onGoToTOC,
  isLastPage,
  onComplete,
  onNavigateToPage,
}) => {
  const { t } = useLanguage();

  const tocInfo = useMemo(() => {
    const tocAct = workbookActivities.find(
      (a) => a.type === ActivityType.TableOfContents
    ) as TableOfContentsActivity | undefined;
    if (!tocAct) return null;
    const groupIdx = tocAct.groups.findIndex((g) =>
      g.items.some((it) => it.page === activity.page)
    );
    if (groupIdx === -1) return { totalGroups: tocAct.groups.length, groupIdx: 0, group: tocAct.groups[0] };
    return {
      totalGroups: tocAct.groups.length,
      groupIdx,
      group: tocAct.groups[groupIdx],
    };
  }, [activity.page]);

  const renderActivity = () => {
    switch (activity.type) {
      case ActivityType.WordCloudSearch:
        return <WordCloudSearchActivityComponent key={activity.page} activity={activity} />;
      case ActivityType.GridPath:
        return <GridPathActivityComponent key={activity.page} activity={activity} />;
      case ActivityType.RadialFillInTheBlanks:
        return <RadialFillInTheBlanksActivityComponent key={activity.page} activity={activity} />;
      case ActivityType.FillInTheBlanks:
        return <FillInTheBlanksActivityComponent key={activity.page} activity={activity} />;
      case ActivityType.SentenceBuilder:
        return <SentenceBuilderActivityComponent key={activity.page} activity={activity} />;
      case ActivityType.ConnectPairs:
        return <ConnectPairsActivityComponent key={activity.page} activity={activity} />;
      case ActivityType.WordImageGrid:
        return <WordImageGridActivityComponent key={activity.page} activity={activity} />;
      case ActivityType.MultipleChoiceSentence:
        return <MultipleChoiceSentenceActivityComponent key={activity.page} activity={activity} />;
      case ActivityType.MultipleChoiceImage:
        return <MultipleChoiceImageActivityComponent key={activity.page} activity={activity} />;
      case ActivityType.ConnectTextPairs:
        return <ConnectTextPairsActivityComponent key={activity.page} activity={activity} />;
      case ActivityType.MatchingLadder:
        return <MatchingLadderActivityComponent key={activity.page} activity={activity} />;
      case ActivityType.PathSelector:
        return <PathSelectorActivityComponent key={activity.page} activity={activity} />;
      case ActivityType.CloudDragAndDrop:
        return <CloudDragAndDropActivityComponent key={activity.page} activity={activity} />;
      case ActivityType.FillTheBlankInSyllable:
        return <FillTheBlankInSyllableActivityComponent key={activity.page} activity={activity} />;
      case ActivityType.TableOfContents:
        return (
          <TableOfContentsActivityComponent
            activity={activity}
            onNavigateToPage={onNavigateToPage}
          />
        );
      default:
        return <div>활동을 찾을 수 없습니다.</div>;
    }
  };

  const handlePrevClick = () => {
    playSound(SoundType.CLICK);
    onPrevPage();
  };

  const handleNextClick = () => {
    playSound(SoundType.CLICK);
    onNextPage();
  };

  const handleCompleteClick = () => {
    playSound(SoundType.CLICK);
    onComplete();
  };

  const handleTOCClick = () => {
    playSound(SoundType.CLICK);
    onGoToTOC();
  };

  const groupIdx = tocInfo?.groupIdx ?? 0;
  const totalGroups = tocInfo?.totalGroups ?? 10;
  const meta = BATCHIM_GROUP_META[groupIdx] || {
    badge: '받침',
    color: '#10b981',
    sampleWords: '',
  };

  const questionText = (activity as any).question as string | undefined;

  return (
    <div className="flex flex-col">
      {/* Unified Unit Header & Step Pill Tabs */}
      <div className="pt-9 pb-4 mb-5 border-b-2 border-emerald-100 flex flex-col items-center">
        <div className="flex flex-wrap items-center justify-center gap-3 mb-3">
          <button
            type="button"
            onClick={() =>
              speakKorean(`${activity.title}. ${meta.sampleWords.replace(/·/g, ',')}`)
            }
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-sm transition-transform hover:scale-105 px-1"
            style={{ backgroundColor: meta.color }}
            title="단원 소리 듣기"
          >
            {meta.badge}
          </button>
          <div className="text-left">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-black text-xs">
                받침 {groupIdx + 1}단원
              </span>
              <span className="text-lg sm:text-xl font-black text-gray-900">
                {t(activity.title)}
              </span>
              {questionText && (
                <button
                  type="button"
                  onClick={() => speakKorean(`${activity.title}. ${questionText}`)}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-extrabold transition-colors"
                >
                  🔊 {t('문제 듣기')}
                </button>
              )}
            </div>
            <p className="text-xs sm:text-sm text-gray-500 font-semibold mt-0.5">
              대표 낱말: {meta.sampleWords}
            </p>
          </div>
        </div>

        {/* Step Pill Tabs within Current Batchim Group */}
        {tocInfo?.group && (
          <div className="flex flex-wrap justify-center gap-1.5">
            {tocInfo.group.items.map((item, idx) => {
              const active = item.page === activity.page;
              return (
                <button
                  key={item.page}
                  type="button"
                  onClick={() => {
                    playSound(SoundType.CLICK);
                    onNavigateToPage(item.page);
                  }}
                  className={`px-3 py-1 rounded-full text-xs sm:text-sm font-extrabold transition-all ${
                    active
                      ? 'bg-emerald-600 text-white shadow-sm scale-105'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200'
                  }`}
                >
                  {idx + 1}. {item.title}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Activity Body */}
      <div className="flex-grow min-h-[380px] py-2">{renderActivity()}</div>

      {/* Unified Bottom Prev / TOC / Next Navigation */}
      <footer className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between">
        <button
          type="button"
          onClick={handlePrevClick}
          className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-sm sm:text-base shadow transition-transform active:scale-95"
        >
          ◀ {t('이전')}
        </button>

        <button
          type="button"
          onClick={handleTOCClick}
          className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs sm:text-sm"
        >
          📑 {t('목차')} ({groupIdx + 1} / {totalGroups}단원)
        </button>

        {isLastPage ? (
          <button
            type="button"
            onClick={handleCompleteClick}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm sm:text-base shadow transition-transform active:scale-95"
          >
            {t('완료')} 🎉
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNextClick}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm sm:text-base shadow transition-transform active:scale-95"
          >
            {t('다음')} ▶
          </button>
        )}
      </footer>
    </div>
  );
};

export default ActivityHost;
