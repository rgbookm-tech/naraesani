import React from 'react';
import { speakKorean } from '../../utils/hangulSpeech';

interface BodyPoseQuizProps {
  image: string;
  vowel?: string;
}

const BodyPoseQuiz: React.FC<BodyPoseQuizProps> = ({ image, vowel }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-2">
      <button
        type="button"
        onClick={() => vowel && speakKorean(`${vowel}. 몸으로 ${vowel}를 표현해 보세요!`)}
        className="group relative rounded-2xl shadow-md bg-white p-3 border-2 border-amber-100 hover:border-amber-300 transition-all"
        title="클릭하여 소리 듣기"
      >
        <img
          src={image}
          alt="Body pose for vowel"
          className="max-w-full max-h-[360px] h-auto object-contain rounded-xl"
          aria-label="Vowel body pose guide"
        />
        {vowel && (
          <span className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-extrabold">
            🔊 그림을 눌러 ‘{vowel}’ 소리를 들어 보세요!
          </span>
        )}
      </button>
    </div>
  );
};

export default BodyPoseQuiz;
