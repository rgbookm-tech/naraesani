import React, { createContext, useContext, useState } from 'react';
import { Language, LANG_LABELS, t as translate } from './translations';

interface LanguageContextValue {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'ko',
  setLang: () => {},
  t: (k) => k,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('ko');
  const t = (key: string) => translate(key, lang);
  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

/** Language selector button group – drop anywhere in the UI */
export const LanguageSelector: React.FC = () => {
  const { lang, setLang } = useLanguage();
  return (
    <div className="flex gap-1 flex-wrap justify-center">
      {(Object.entries(LANG_LABELS) as [Language, string][]).map(([code, label]) => (
        <button
          key={code}
          onClick={() => setLang(code)}
          className={`px-2 py-1 rounded-full text-sm font-bold border-2 transition-all duration-200 ${
            lang === code
              ? 'bg-lime-500 text-white border-lime-500 scale-105'
              : 'bg-white text-gray-600 border-gray-300 hover:border-lime-400'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};
