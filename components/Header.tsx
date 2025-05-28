import React, { useState, useEffect, useRef } from 'react';
import { useLanguageContext } from '../hooks/useLanguage';
import { Language, ViewName } from '../types'; 
import { ThemeContext, ToastContext } from '../App'; 
import { Auth, signOut } from "firebase/auth"; // Changed from compat to modular

// Heroicons
const Bars3Icon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
);
const XMarkIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
);
const BellIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>
);
const GlobeAltIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A11.978 11.978 0 0112 16.5c-2.998 0-5.74-1.1-7.843-2.918m15.686-3.536A8.959 8.959 0 0021 12c0 .778-.099 1.533-.284 2.253m0 0A11.978 11.978 0 0012 16.5c-2.998 0-5.74-1.1-7.843-2.918" /></svg>
);
const UserCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);
const Cog6ToothIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.003 1.11-1.227l.473-.101c.52-.112.991.303.991.825l-.013.491c.093.065.19.128.287.197l.473.336c.444.315.625.902.42 1.39l-.074.182c-.038.101-.058.21-.058.323s.02.222.058.323l.074.182c.205.488.024 1.075-.42 1.39l-.473.336c-.097.069-.194.132-.287.197l.013.491c0 .522-.47.938-.99.826l-.473-.101c-.55-.224-1.02-.685-1.11-1.227V11.06c-.097.069-.194.132-.287.197l-.474.336c-.444.315-.625.902-.42-1.39l.074.182c.038.101.058.21.058.323s-.02.222-.058.323l-.074.182c-.205.488-.024 1.075.42 1.39l.474.336c.097.069.193.132.287.197V15.75c.09.542.56 1.004 1.11 1.228l.473.101c.52.112.991-.303.991-.825l-.013-.491c.093-.065.19-.128.287-.197l.473-.336c.444-.315.625.902.42-1.39l-.075-.182c-.037-.101-.057-.21-.057-.323s.02-.222.057-.323l.075-.182c.205-.488.024-1.075-.42-1.39l-.473-.336c-.097-.069-.194-.132-.287-.197l.013-.491c0-.522.47-.938.99-.826l.473.101c.55.224 1.02.685 1.11 1.227V9.34c.097-.069.194-.132.287-.197l.474-.336c.444-.315.625-.902.42-1.39l-.074-.182c-.038-.101-.058.21-.058.323s.02-.222.058.323l.074-.182c.205-.488.024-1.075-.42-1.39l-.474-.336c-.097-.069-.193-.132.287-.197V4.249c-.09-.542-.56-1.003-1.11-1.227l-.473-.101c-.52-.112-.991.303-.991.825l.013.491c-.093.065-.19.128-.287.197l-.473.336c-.444-.315-.625.902-.42-1.39l.075-.182c.037-.101.057-.21.057-.323s-.02.222-.057-.323l-.075-.182c-.205-.488-.024-1.075.42-1.39l.473-.336c.097-.069.194-.132.287-.197L9.594 3.94zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" /></svg>
);
const ArrowRightOnRectangleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>
);


interface HeaderProps {
  onNavigate: (view: ViewName) => void;
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
  isLoggedIn: boolean;
  auth: Auth; // Changed to modular Auth
  setCurrentView: (view: ViewName) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, toggleSidebar, isSidebarOpen, isLoggedIn, auth, setCurrentView }) => {
  const { language, setLanguage, t } = useLanguageContext();
  const [currentTime, setCurrentTime] = useState(new Date());
  const { theme } = React.useContext(ThemeContext);
  const { addToast } = React.useContext(ToastContext);
  
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const notificationDropdownRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const timerId = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target as Node)) {
        setIsNotificationPanelOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth); // Use modular signOut
      addToast(t('logoutSuccess'), 'success');
      setCurrentView('login');
      setProfileDropdownOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
      addToast(t('logoutFailedError', 'Logout failed. Please try again.'), 'alert');
    }
  };

  const headerBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
  const iconColor = theme === 'dark' ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600';
  const buttonBgHover = theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100';
  const dropdownBg = theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white';
  const dropdownItemHover = theme === 'dark' ? 'hover:bg-gray-700 hover:text-blue-400' : 'hover:bg-gray-100 hover:text-blue-600';
  const appNameColor = theme === 'dark' ? 'text-blue-400' : 'text-blue-600';

  return (
    <header className={`p-3 shadow-md flex items-center justify-between relative z-40 ${headerBg} ${textColor}`}>
      <div className="flex items-center">
        {isLoggedIn && (
          <button 
            onClick={toggleSidebar} 
            className={`p-2 rounded-md focus:outline-none focus:ring-2 ${theme === 'dark' ? 'focus:ring-blue-500' : 'focus:ring-blue-500'} ${buttonBgHover} ${iconColor}`}
            aria-label={language === 'ar' ? (isSidebarOpen ? 'إغلاق القائمة' : 'فتح القائمة') : (isSidebarOpen ? 'Close menu' : 'Open menu')}
          >
            {isSidebarOpen ? <XMarkIcon className="h-6 w-6"/> : <Bars3Icon className="h-6 w-6"/>}
          </button>
        )}
         <h1 className={`text-lg sm:text-xl font-semibold ${appNameColor} ${language === Language.AR ? 'font-cairo mr-3' : 'font-poppins ml-3'}`}>
          {t('appName')}
        </h1>
      </div>
      <div className={`flex items-center ${language === Language.AR ? 'space-x-reverse space-x-2 sm:space-x-3' : 'space-x-2 sm:space-x-3'}`}>
        <div className={`text-xs text-center ${language === Language.AR ? 'font-cairo' : 'font-poppins'} ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          <div>{currentTime.toLocaleDateString(language === Language.AR ? 'ar-EG-u-nu-latn' : 'en-US', { month: 'short', day: 'numeric' })}</div>
          <div className={`${theme === 'dark' ? 'text-orange-400' : 'text-orange-500'} font-medium`}>{currentTime.toLocaleTimeString(language === Language.AR ? 'ar-EG-u-nu-latn' : 'en-US', {hour: '2-digit', minute: '2-digit'})}</div>
        </div>
        
        {isLoggedIn && (
          <div className="relative">
              <button 
                  title={t('notifications')} 
                  className={`p-2 rounded-full transition-colors relative ${iconColor}`}
                  aria-label={t('notifications')}
                  onClick={() => setIsNotificationPanelOpen(!isNotificationPanelOpen)}
              >
                <BellIcon className="h-5 w-5" />
              </button>
              {isNotificationPanelOpen && (
                  <div ref={notificationDropdownRef} 
                      className={`absolute mt-2 w-64 sm:w-72 rounded-lg shadow-xl py-1 text-sm z-50
                          ${language === Language.AR ? 'left-0' : 'right-0'} 
                          ${dropdownBg} ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                      <div className={`px-3 py-2 font-semibold border-b ${theme === 'dark' ? 'border-gray-700 text-orange-400' : 'border-gray-200 text-orange-600'}`}>{t('notifications')}</div>
                      <div className={`p-4 text-center text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {t('noNotifications')}
                          <br/>
                          <span className="mt-1 inline-block text-xl">📭</span>
                      </div>
                  </div>
              )}
          </div>
        )}

        <div className="relative">
          <button
            onClick={() => setLanguage(language === Language.EN ? Language.AR : Language.EN)}
            className={`flex items-center px-2 py-1.5 sm:px-3 rounded-lg transition-colors text-xs 
              ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
            title={t('language')}
            aria-label={t('language')}
          >
            <GlobeAltIcon className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`} />
            <span className={`${language === Language.AR ? 'mr-1.5' : 'ml-1.5'}`}>
              {language === Language.EN ? t('arabic') : t('english')}
            </span>
          </button>
        </div>

        {isLoggedIn && (
          <div className="relative" ref={profileDropdownRef}>
              <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className={`p-1.5 rounded-full transition-colors ${iconColor}`}
                  title={t('myProfile')}
                  aria-label={t('myProfile')}
                  aria-expanded={profileDropdownOpen}
              >
                  <UserCircleIcon className="h-6 w-6" />
              </button>
              {profileDropdownOpen && (
                  <div className={`absolute mt-2 w-48 rounded-lg shadow-xl py-1 text-sm z-50
                      ${language === Language.AR ? 'left-0' : 'right-0'} 
                      ${dropdownBg} ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                      <a
                          href="#"
                          onClick={(e) => { 
                              e.preventDefault(); 
                              onNavigate('profile');
                              setProfileDropdownOpen(false); 
                          }}
                          className={`flex items-center gap-2 px-3 py-2 ${dropdownItemHover}`}
                      >
                          <UserCircleIcon className="h-4 w-4 opacity-70" />
                          {t('myProfile')}
                      </a>
                      <a
                          href="#"
                          onClick={(e) => { e.preventDefault(); onNavigate('settings'); setProfileDropdownOpen(false); }}
                          className={`flex items-center gap-2 px-3 py-2 ${dropdownItemHover}`}
                      >
                          <Cog6ToothIcon className="h-4 w-4 opacity-70" />
                          {t('settings')}
                      </a>
                      <div className={`my-1 ${theme === 'dark' ? 'border-t border-gray-700' : 'border-t border-gray-100'}`}></div>
                      <a
                          href="#"
                          onClick={(e) => { 
                              e.preventDefault(); 
                              handleLogout();
                          }}
                          className={`flex items-center gap-2 px-3 py-2 ${theme === 'dark' ? 'text-red-400 hover:bg-red-700/30 hover:text-red-300' : 'text-red-600 hover:bg-red-100 hover:text-red-700'}`}
                      >
                          <ArrowRightOnRectangleIcon className="h-4 w-4 opacity-70" />
                          {t('logout')}
                      </a>
                  </div>
              )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
