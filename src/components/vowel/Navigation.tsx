
import React from 'react';

interface NavigationProps {
  onPrev: () => void;
  onNext: () => void;
}

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const Navigation: React.FC<NavigationProps> = ({ onPrev, onNext }) => {
  return (
    <div className="flex justify-between items-center mt-8">
      <button
        onClick={onPrev}
        className="flex items-center px-4 py-2 bg-amber-500 text-white font-bold rounded-lg shadow-md hover:bg-amber-600 transition-all duration-200 transform hover:-translate-x-1"
      >
        <ArrowLeftIcon />
        <span className="ml-2">이전</span>
      </button>
      <button
        onClick={onNext}
        className="flex items-center px-4 py-2 bg-amber-500 text-white font-bold rounded-lg shadow-md hover:bg-amber-600 transition-all duration-200 transform hover:translate-x-1"
      >
        <span className="mr-2">다음</span>
        <ArrowRightIcon />
      </button>
    </div>
  );
};

export default Navigation;
