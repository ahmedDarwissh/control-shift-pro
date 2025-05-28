
import React from 'react';
import { useLanguageContext } from '../hooks/useLanguage';
import { ThemeContext } from '../App';

const Footer: React.FC = () => {
  const { t, language } = useLanguageContext();
  const { theme } = React.useContext(ThemeContext);

  return (
    <footer className={`py-4 px-5 text-center text-xs border-t
      ${theme === 'dark' ? 'bg-gray-800 text-gray-500 border-gray-700' : 'bg-gray-100 text-gray-500 border-gray-200'}
      ${language === 'ar' ? 'font-cairo' : 'font-poppins'}`}
    >
      <p>{t('globalFooter')}</p>
    </footer>
  );
};

export default Footer;