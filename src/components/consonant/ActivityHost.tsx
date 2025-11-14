import React from 'react';
import { WorkbookActivity, ActivityType } from '../../types';
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
import TableOfContentsActivityComponent from './activities/TableOfContentsActivity';
import { playSound, SoundType } from '../../utils/sound';

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
  isFirstPage,
  isLastPage,
  onComplete,
  onNavigateToPage,
}) => {
  const renderActivity = () => {
    switch (activity.type) {
      case ActivityType.WordCloudSearch:
        return <WordCloudSearchActivityComponent activity={activity} />;
      case ActivityType.GridPath:
        return <GridPathActivityComponent activity={activity} />;
      case ActivityType.RadialFillInTheBlanks:
        return <RadialFillInTheBlanksActivityComponent activity={activity} />;
      case ActivityType.FillInTheBlanks:
        return <FillInTheBlanksActivityComponent activity={activity} />;
      case ActivityType.SentenceBuilder:
        return <SentenceBuilderActivityComponent activity={activity} />;
      case ActivityType.ConnectPairs:
        return <ConnectPairsActivityComponent activity={activity} />;
      case ActivityType.WordImageGrid:
        return <WordImageGridActivityComponent activity={activity} />;
      case ActivityType.MultipleChoiceSentence:
        return <MultipleChoiceSentenceActivityComponent activity={activity} />;
      case ActivityType.MultipleChoiceImage:
        return <MultipleChoiceImageActivityComponent activity={activity} />;
      case ActivityType.ConnectTextPairs:
        return <ConnectTextPairsActivityComponent activity={activity} />;
      case ActivityType.MatchingLadder:
        return <MatchingLadderActivityComponent activity={activity} />;
      case ActivityType.PathSelector:
        return <PathSelectorActivityComponent activity={activity} />;
      case ActivityType.CloudDragAndDrop:
        return <CloudDragAndDropActivityComponent activity={activity} />;
      case ActivityType.FillTheBlankInSyllable:
        return <FillTheBlankInSyllableActivityComponent activity={activity} />;
      case ActivityType.TableOfContents:
        return <TableOfContentsActivityComponent activity={activity} onNavigateToPage={onNavigateToPage} />;
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

  return (
    <div className="flex flex-col">
      <header className="mb-6">
        <div className="bg-lime-200 p-2 inline-block rounded-md mb-4 border-2 border-lime-300">
           <h2 className="text-2xl font-bold text-lime-800">{activity.title}</h2>
        </div>
      </header>
      <div className="flex-grow mb-8 min-h-[400px]">
        {renderActivity()}
      </div>
      <footer className="flex justify-between items-center">
        <button
          onClick={handlePrevClick}
          disabled={isFirstPage}
          className="px-6 py-2 bg-gray-300 text-white font-bold rounded-lg shadow disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 transition"
        >
          이전
        </button>
         <button
          onClick={handleTOCClick}
          className="px-6 py-2 bg-orange-400 text-white font-bold rounded-lg shadow hover:bg-orange-500 transition"
        >
          목차
        </button>
        {isLastPage ? (
          <button
            onClick={handleCompleteClick}
            className="px-6 py-2 bg-blue-500 text-white font-bold rounded-lg shadow hover:bg-blue-600 transition"
          >
            완료
          </button>
        ) : (
          <button
            onClick={handleNextClick}
            className="px-6 py-2 bg-green-500 text-white font-bold rounded-lg shadow hover:bg-green-600 transition"
          >
            다음
          </button>
        )}
      </footer>
    </div>
  );
};

export default ActivityHost;