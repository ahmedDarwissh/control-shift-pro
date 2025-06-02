
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
<<<<<<< HEAD
import { Language, Translations, TranslationSet } from '../types';
import { initialTranslations } from '../constants';

export interface LanguageContextType { // Exported for use in the hook
  language: Language;
  setLanguage: (language: Language) => void;
  translations: TranslationSet;
  t: (key: keyof TranslationSet, fallback?: string) => string;
=======
import { Language, TranslationSet } from '../types'; 
import { initialTranslations } from '@/constants'; // Changed import path

export interface LanguageContextType { 
  language: Language;
  setLanguage: (language: Language) => void;
  translations: TranslationSet;
  t: (key: keyof TranslationSet, detailsOrFallback?: string | Record<string, any>) => string;
>>>>>>> bee2d85 (updated)
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
  defaultLanguage?: Language;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children, defaultLanguage = Language.AR }) => {
<<<<<<< HEAD
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
=======
  const [language, setLanguageState] = useState<Language>(defaultLanguage);

  useEffect(() => {
    document.body.className = ''; 
>>>>>>> bee2d85 (updated)
    document.body.classList.add(language === Language.AR ? 'lang-ar' : 'lang-en');
    document.documentElement.lang = language;
    document.documentElement.dir = language === Language.AR ? 'rtl' : 'ltr';
    localStorage.setItem('appLanguage', language);
  }, [language]);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
  };

<<<<<<< HEAD
  const t = useCallback((key: keyof TranslationSet, fallback?: string): string => {
    const translation = initialTranslations[language][key] || fallback || initialTranslations[Language.EN][key] || String(key);
    // Replace {year}, {appName}, {companyShortName} placeholders
    return translation
        .replace('{year}', new Date().getFullYear().toString())
        .replace('{appName}', initialTranslations[language].appName || initialTranslations[Language.EN].appName)
        .replace('{companyShortName}', initialTranslations[language].footerCompanyName || initialTranslations[Language.EN].footerCompanyName);
=======
  const t = useCallback((key: keyof TranslationSet, detailsOrFallback?: string | Record<string, any>): string => {
    const currentTranslations = initialTranslations[language];
    const englishTranslations = initialTranslations[Language.EN]; // Fallback to English

    let rawTranslationString: string | undefined;

    // 1. Try current language
    if (currentTranslations && typeof currentTranslations[key] === 'string') {
      rawTranslationString = currentTranslations[key] as string;
    } 
    // 2. If not found, and detailsOrFallback is a string, use it as string fallback
    else if (typeof detailsOrFallback === 'string') {
      rawTranslationString = detailsOrFallback;
    } 
    // 3. If not found and no string fallback, try English
    else if (englishTranslations && typeof englishTranslations[key] === 'string') {
      rawTranslationString = englishTranslations[key] as string;
    } 
    // 4. If still not found, use the key itself as the string
    else {
      rawTranslationString = String(key);
    }

    let populatedTranslation = rawTranslationString;

    // Interpolate details if detailsOrFallback is an object (for dynamic values)
    if (typeof detailsOrFallback === 'object' && detailsOrFallback !== null) {
      Object.entries(detailsOrFallback).forEach(([placeholderKey, placeholderValue]) => {
        if (typeof placeholderValue === 'string' || typeof placeholderValue === 'number' || typeof placeholderValue === 'boolean') {
          const regex = new RegExp(`{${placeholderKey}}`, 'g');
          populatedTranslation = populatedTranslation.replace(regex, String(placeholderValue));
        }
      });
    }
    
    // Global replacements (ensure these keys exist or have simple string fallbacks to avoid recursion)
    const appName = initialTranslations[language]?.appName || initialTranslations[Language.EN]?.appName || "App";
    const companyShortName = initialTranslations[language]?.companyShortName || initialTranslations[Language.EN]?.companyShortName || "Company";

    populatedTranslation = populatedTranslation
        .replace(/{year}/g, new Date().getFullYear().toString())
        .replace(/{appName}/g, appName)
        .replace(/{companyShortName}/g, companyShortName);

    return populatedTranslation;
>>>>>>> bee2d85 (updated)
  }, [language]);
  

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations: initialTranslations[language], t }}>
      {children}
    </LanguageContext.Provider>
  );
};
<<<<<<< HEAD

// useLanguageContext is now in hooks/useLanguage.ts
=======
>>>>>>> bee2d85 (updated)
