import React, { useState } from 'react';
import { TableOfContentsActivity as ActivityProps } from '../../types';
import { playSound, SoundType } from '../../../utils/sound';

interface TableOfContentsActivityComponentProps {
  activity: ActivityProps;
  onNavigateToPage: (page: number) => void;
}

const TableOfContentsActivityComponent: React.FC<TableOfContentsActivityComponentProps> = ({ activity, onNavigateToPage }) => {
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  const handleGroupClick = (groupTitle: string) => {
    playSound(SoundType.CLICK);
    setOpenGroup(prevOpenGroup => (prevOpenGroup === groupTitle ? null : groupTitle));
  };

  const handleItemClick = (page: number) => {
    playSound(SoundType.CLICK);
    onNavigateToPage(page);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="space-y-3">
        {activity.groups.map((group, index) => (
          <div key={index} className="border-2 border-lime-200 rounded-xl overflow-hidden shadow-md bg-white">
            <button
              onClick={() => handleGroupClick(group.title)}
              className="w-full flex justify-between items-center p-4 bg-lime-100 hover:bg-lime-200 transition-colors duration-200"
            >
              <span className="text-2xl font-bold text-lime-800">{group.title}</span>
              <svg
                className={`w-7 h-7 text-lime-700 transition-transform transform ${openGroup === group.title ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            {openGroup === group.title && (
              <div className="p-4">
                <ul className="space-y-2">
                  {group.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <button
                        onClick={() => handleItemClick(item.page)}
                        className="w-full text-left flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <span className="text-xl text-gray-800">{item.title}</span>
                        <span className="text-lg font-semibold text-gray-500">{item.page}쪽</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableOfContentsActivityComponent;
