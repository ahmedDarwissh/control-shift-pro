
import React from 'react';
import { useLanguageContext } from '../hooks/useLanguage';
import { ThemeContext } from '../App';

const LoadingSpinnerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );


const SplashScreen: React.FC = () => {
  const { t, language } = useLanguageContext();
  const { theme } = React.useContext(ThemeContext);

  return (
    <div className={`flex flex-col items-center justify-center h-screen p-4 text-center ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="mb-8">
        <LoadingSpinnerIcon className={`h-20 w-20 ${theme === 'dark' ? 'text-blue-500' : 'text-blue-600'}`} />
      </div>
      <h1 className={`text-4xl md:text-5xl font-bold mb-3 ${language === 'ar' ? 'font-cairo' : 'font-poppins'} ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
        {t('appName')}
      </h1>
      <p className={`text-lg md:text-xl mt-1 opacity-90 ${language === 'ar' ? 'font-cairo' : 'font-poppins'} ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
        {t('splashIntro')}
      </p>
      <div className="mt-16 text-sm animate-fadeInUp">
        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{t('loadingMessage')}</p>
        <p className={`text-xs opacity-70 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
            {language === 'ar' ? 'لحظات ونكون جاهزين...' : 'Just a few moments...'}
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;