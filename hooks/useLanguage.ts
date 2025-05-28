
import { useContext } from 'react';
import { LanguageContext, LanguageContextType } from '../contexts/LanguageContext'; // Adjusted path

export const useLanguageContext = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguageContext must be used within a LanguageProvider');
  }
  return context;
};
