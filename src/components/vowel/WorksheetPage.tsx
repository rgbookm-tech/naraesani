
import React from 'react';
import type { WorksheetData, ActivityData } from '../../types/vowelTypes'; 
import Header from './Header';
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

interface WorksheetPageProps {
  data: WorksheetData;
  activityIndex: number;
}

const WorksheetPage: React.FC<WorksheetPageProps> = ({ data, activityIndex }) => {
  const activity = data.activities[activityIndex];
  if (!activity) return <div>Activity not found</div>;

  const renderActivity = () => {
    // Cast data to any to avoid complex type assertions in each case
    const activityData: any = activity.data;
    
    switch (activity.type) {
      case 'body-pose':
        return <BodyPoseQuiz {...activityData} />;
      case 'drawing':
        return <DrawingGrid />;
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
        return <div>Unknown activity type</div>;
    }
  };

  return (
    <main className="flex flex-col">
      <Header vowel={data.vowel} pronunciation={data.pronunciation} />
      <div className="flex flex-col items-center justify-center p-4 min-h-96 sm:min-h-[500px]">
        <h2 className="text-2xl font-bold text-center text-amber-700 mb-2">{activity.title}</h2>
        {activity.instruction && <p className="text-center text-gray-600 mb-6">{activity.instruction}</p>}
        {renderActivity()}
      </div>
    </main>
  );
};

export default WorksheetPage;
