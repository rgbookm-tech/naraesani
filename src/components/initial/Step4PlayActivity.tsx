import React from 'react';
import { Step4Data } from '../../types/initialConsonantTypes';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  ColorGridAnimalGame,
  ColorGridBluePGame,
  WordSearchPuzzleGame,
  WalledMazeHGame,
} from './Step4GridGames';
import {
  MimicMatchFillGame,
  ImageMazeNGame,
  CorridorMazeMGame,
  BoardGameT,
  HiddenObjectsRGame,
  RebusSentencesBGame,
  MinimalPairCircleSGame,
  BalloonStoryChGame,
  PictureDiaryNgGame,
} from './Step4SceneGames';

interface Step4PlayActivityProps {
  data: Step4Data;
}

const Step4PlayActivity: React.FC<Step4PlayActivityProps> = ({ data }) => {
  const { t } = useLanguage();

  const renderGame = () => {
    switch (data.playType) {
      case 'color-grid-animal':
        return <ColorGridAnimalGame data={data} />;
      case 'color-grid-blue-p':
        return <ColorGridBluePGame data={data} />;
      case 'word-search-puzzle':
        return <WordSearchPuzzleGame data={data} />;
      case 'walled-maze-h':
        return <WalledMazeHGame data={data} />;
      case 'mimic-match-fill':
        return <MimicMatchFillGame data={data} />;
      case 'image-maze-n':
        return <ImageMazeNGame data={data} />;
      case 'corridor-maze-m':
        return <CorridorMazeMGame data={data} />;
      case 'board-game-t':
        return <BoardGameT data={data} />;
      case 'hidden-objects-r':
        return <HiddenObjectsRGame data={data} />;
      case 'rebus-sentences-b':
        return <RebusSentencesBGame data={data} />;
      case 'minimal-pair-circle-s':
        return <MinimalPairCircleSGame data={data} />;
      case 'balloon-story-ch':
        return <BalloonStoryChGame data={data} />;
      case 'picture-diary-ng':
        return <PictureDiaryNgGame data={data} />;
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex items-center gap-2 mb-4 max-w-3xl text-center">
        <span className="shrink-0 w-8 h-8 rounded-full bg-pink-400 text-white font-black flex items-center justify-center shadow-sm">
          4
        </span>
        <h3 className="text-lg sm:text-2xl font-extrabold text-gray-800">{t(data.instruction)}</h3>
      </div>
      {renderGame()}
    </div>
  );
};

export default Step4PlayActivity;
