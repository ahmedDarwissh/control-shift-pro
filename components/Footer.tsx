
import React from 'react';
import { useLanguageContext } from '../hooks/useLanguage';
<<<<<<< HEAD
import { ThemeContext } from '../App';
=======
import { ThemeContext } from '../contexts/ThemeContext'; 
>>>>>>> bee2d85 (updated)

const Footer: React.FC = () => {
  const { t, language } = useLanguageContext();
  const { theme } = React.useContext(ThemeContext);

  return (
    <footer className={`py-4 px-5 text-center text-xs border-t
<<<<<<< HEAD
      ${theme === 'dark' ? 'bg-gray-800 text-gray-500 border-gray-700' : 'bg-gray-100 text-gray-500 border-gray-200'}
=======
      ${theme === 'dark' ? 'bg-dark-card text-gray-500 border-gray-700' : 'bg-gray-100 text-gray-500 border-gray-200'}
>>>>>>> bee2d85 (updated)
      ${language === 'ar' ? 'font-cairo' : 'font-poppins'}`}
    >
      <p>{t('globalFooter')}</p>
    </footer>
  );
};

export default Footer;