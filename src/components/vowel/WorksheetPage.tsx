import React from 'react';
import type { WorksheetData } from '../../types/vowelTypes';
import DrawingGrid from './DrawingGrid';
import FillInTheBlanks from './FillInTheBlanks';
import MazeQuiz from './MazeQuiz';
import StrokeOrderQuiz from './StrokeOrderQuiz';
import WordCountQuiz from './WordCountQuiz';
import WordHighlightQuiz from './WordHighlightQuiz';
import WordImageMatchQuiz from './WordImageMatchQuiz';
import DragAndDropFillQuiz from './DragAndDropFillQuiz';
import VowelInputQuiz from './VowelInputQuiz';
import BodyPoseQuiz from './BodyPoseQuiz';
import { useLanguage } from '../../i18n/LanguageContext';
import { speakKorean } from '../../utils/hangulSpeech';

interface WorksheetPageProps {
  data: WorksheetData;
  activityIndex: number;
}

const WorksheetPage: React.FC<WorksheetPageProps> = ({ data, activityIndex }) => {
  const { t } = useLanguage();
  const activity = data.activities[activityIndex];
  if (!activity) return <div>활동을 찾을 수 없습니다.</div>;

  const renderActivity = () => {
    const activityData: any = activity.data;
    switch (activity.type) {
      case 'body-pose':
        return <BodyPoseQuiz {...activityData} vowel={data.vowel} />;
      case 'drawing':
        return <DrawingGrid vowel={data.vowel} />;
      case 'fill-blanks':
        return <FillInTheBlanks {...activityData} />;
      case 'maze':
        return <MazeQuiz {...activityData} />;
      case 'stroke-order':
        return <StrokeOrderQuiz vowel={data.vowel} />;
      case 'word-count':
        return <WordCountQuiz {...activityData} />;
      case 'word-highlight':
        return <WordHighlightQuiz {...activityData} vowel={data.vowel} />;
      case 'word-image-match':
        return <WordImageMatchQuiz {...activityData} />;
      case 'drag-drop-fill':
        return <DragAndDropFillQuiz {...activityData} />;
      case 'vowel-input':
        return <VowelInputQuiz {...activityData} vowel={data.vowel} />;
      default:
        return <div>활동을 찾을 수 없습니다.</div>;
    }
  };

  const handleSpeakPrompt = () => {
    const promptText = activity.instruction
      ? `${activity.title}. ${activity.instruction}`
      : activity.title;
    speakKorean(promptText);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {/* Unified Activity Prompt Header (No cluttered top icons!) */}
      <div className="w-full flex flex-col items-center text-center mb-5">
        <div className="flex flex-wrap items-center justify-center gap-2 mb-1.5">
          <h2 className="text-xl sm:text-2xl font-black text-amber-900">
            {t(activity.title)}
          </h2>
          <button
            type="button"
            onClick={handleSpeakPrompt}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs sm:text-sm font-extrabold shadow-sm transition-transform active:scale-95"
            title="문제 소리 듣기"
          >
            🔊 {t('문제 듣기')}
          </button>
        </div>
        {activity.instruction && (
          <p className="text-sm sm:text-base font-semibold text-gray-600">
            {t(activity.instruction)}
          </p>
        )}
      </div>

      {renderActivity()}
    </div>
  );
};

export default WorksheetPage;
