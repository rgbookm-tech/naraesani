import React from 'react';

interface BodyPoseQuizProps {
  image: string;
}

const BodyPoseQuiz: React.FC<BodyPoseQuizProps> = ({ image }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4">
      <img
        src={image}
        alt="Body pose for vowel"
        className="max-w-full max-h-[400px] h-auto object-contain rounded-lg shadow-lg bg-white"
        aria-label="Vowel body pose guide"
      />
    </div>
  );
};

export default BodyPoseQuiz;
