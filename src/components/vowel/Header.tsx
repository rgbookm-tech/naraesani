
import React from 'react';

interface HeaderProps {
  vowel: string;
  pronunciation: string;
}

const JarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-amber-700" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 1.01L6 1v2h12V1.01zM4 5v14c0 1.66 1.34 3 3 3h10c1.66 0 3-1.34 3-3V5H4zm8 14c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
        <path fill="rgba(255,255,255,0.5)" d="M12 9c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z"/>
    </svg>
);

const StarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
    </svg>
);

const SpeakIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-teal-500" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
    </svg>
);


const Header: React.FC<HeaderProps> = ({ vowel, pronunciation }) => {
  return (
    <header className="flex items-center justify-center space-x-4 sm:space-x-8 md:space-x-12 py-4 mb-4 border-b-2 border-amber-200">
      <JarIcon/>
      <div className="relative flex items-center justify-center">
        <StarIcon />
        <span className="absolute text-5xl font-extrabold text-amber-800">{vowel}</span>
      </div>
      <div className="flex items-center justify-center bg-green-100 rounded-full w-24 h-24">
        <span className="text-4xl font-bold text-green-800">{pronunciation}</span>
      </div>
       <SpeakIcon />
    </header>
  );
};

export default Header;
