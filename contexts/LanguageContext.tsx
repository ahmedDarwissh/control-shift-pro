
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Language, Translations, TranslationSet } from '../types';
import { initialTranslations } from '../constants';

export interface LanguageContextType { // Exported for use in the hook
  language: Language;
  setLanguage: (language: Language) => void;
  translations: TranslationSet;
  t: (key: keyof TranslationSet, fallback?: string) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
  defaultLanguage?: Language;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children, defaultLanguage = Language.AR }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const storedLang = localStorage.getItem('appLanguage') as Language;
    return storedLang || defaultLanguage;
  });

  useEffect(() => {
    // Set initial language if not already set by localStorage
    const currentStoredLang = localStorage.getItem('appLanguage') as Language;
    if (!currentStoredLang) {
      setLanguageState(defaultLanguage);
    }
  }, [defaultLanguage]);


  useEffect(() => {
    document.body.className = ''; // Clear previous language classes
    document.body.classList.add(language === Language.AR ? 'lang-ar' : 'lang-en');
    document.documentElement.lang = language;
    document.documentElement.dir = language === Language.AR ? 'rtl' : 'ltr';
    localStorage.setItem('appLanguage', language);
  }, [language]);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
  };

  const t = useCallback((key: keyof TranslationSet, fallback?: string): string => {
    const translation = initialTranslations[language][key] || fallback || initialTranslations[Language.EN][key] || String(key);
    // Replace {year}, {appName}, {companyShortName} placeholders
    return translation
        .replace('{year}', new Date().getFullYear().toString())
        .replace('{appName}', initialTranslations[language].appName || initialTranslations[Language.EN].appName)
        .replace('{companyShortName}', initialTranslations[language].footerCompanyName || initialTranslations[Language.EN].footerCompanyName);
  }, [language]);
  

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations: initialTranslations[language], t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// useLanguageContext is now in hooks/useLanguage.ts
