
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations } from '../locales';
import type { Language } from '../locales/types';

// Define TranslationKeys type based on the structure of translations
export type TranslationKeys = typeof translations.en;

interface LanguageContextType {
  language: Language;
  t: TranslationKeys;
  setLanguage: (lang: Language) => void;
}

const defaultLanguage: Language = 'fr';

// Create the language context
const LanguageContext = createContext<LanguageContextType>({
  language: defaultLanguage,
  t: translations[defaultLanguage],
  setLanguage: () => {},
});

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(defaultLanguage);
  const [translations_, setTranslations] = useState<TranslationKeys>(translations[defaultLanguage]);

  // Detect browser language when component mounts
  useEffect(() => {
    const detectLanguage = () => {
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'fr') {
        return 'fr';
      }
      return 'en'; // Default to English for any other language
    };
    
    const detectedLang = detectLanguage() as Language;
    setLanguage(detectedLang);
    setTranslations(translations[detectedLang]);
  }, []);

  // Update translations when language changes
  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setTranslations(translations[lang]);
    // Optionally, save to localStorage for persistence
    localStorage.setItem('app-language', lang);
  };

  return (
    <LanguageContext.Provider 
      value={{ 
        language, 
        t: translations_, 
        setLanguage: handleLanguageChange 
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
