
import React, { useContext, useState, useEffect } from 'react';
import { useLanguageContext } from '../hooks/useLanguage';
import { UserRole, Engineer, Supervisor, Team, Language } from '../types';
import { ThemeContext, ToastContext } from '../App'; 

// Heroicons
const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>
);
const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>
);
const BellAlertIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M12 15.75a.75.75 0 01.75.75v.008a.75.75 0 01-1.5 0v-.008a.75.75 0 01.75-.75z" /></svg>
);
// Simplified icons for WhatsApp/Telegram - ideally use official brand SVGs if available and allowed.
const ChatBubbleOvalLeftEllipsisIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.72.372a11.957 11.957 0 01-3.72.372h-.456a11.957 11.957 0 01-3.72-.372l-3.72-.372A2.25 2.25 0 012.25 15.082V8.511c0-.884.616-1.646 1.448-1.948l.902-.301c.435-.145.92-.302 1.417-.471L8.25 5.69m5.25 0l.752.25M13.5 5.69l-.752.25m-.752-.25h.002M18 18.75V9.75M6 18.75V9.75" /></svg>
  );

interface SettingsViewProps {
  engineers: Engineer[];
  supervisors: Supervisor[];
  teams: Team[];
  currentUserRole: UserRole;
  setCurrentUserRole: (role: UserRole) => void;
}

const SettingsCard: React.FC<{ titleKey: keyof ReturnType<typeof useLanguageContext>['translations'], children: React.ReactNode, descriptionKey?: keyof ReturnType<typeof useLanguageContext>['translations'], icon?: React.ReactNode }> = ({ titleKey, children, descriptionKey, icon }) => {
  const { t, language } = useLanguageContext();
  const { theme } = useContext(ThemeContext);
  return (
    <div className={`p-5 md:p-6 rounded-xl shadow-lg ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border-l-4 border-blue-600'}`}>
      <div className="flex items-center mb-3">
        {icon && <span className={`mr-3 rtl:ml-3 rtl:mr-0 text-xl ${theme === 'dark' ? 'text-orange-400' : 'text-orange-500'}`}>{icon}</span>}
        <h2 className={`text-lg md:text-xl font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'} ${language === 'ar' ? 'font-cairo' : 'font-poppins'}`}>
          {t(titleKey)}
        </h2>
      </div>
      {children}
      {descriptionKey && (
        <p className={`text-xs mt-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          {t(descriptionKey)}
        </p>
      )}
    </div>
  );
};

interface LinkingModalState {
  isOpen: boolean;
  serviceName: 'WhatsApp' | 'Telegram' | null;
}

const SettingsView: React.FC<SettingsViewProps> = ({ engineers, supervisors, teams, currentUserRole, setCurrentUserRole }) => {
  const { t, language } = useLanguageContext();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { addToast } = useContext(ToastContext);
  
  const [salaryToggleChecked, setSalaryToggleChecked] = useState(false);
  const [currentComedyLevel, setCurrentComedyLevel] = useState<'normal' | 'hilarious'>('hilarious');
  const [linkingModalState, setLinkingModalState] = useState<LinkingModalState>({ isOpen: false, serviceName: null });

  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentUserRole(event.target.value as UserRole);
    addToast(t('settingsChangeSuccess'), 'success');
  };

  const handlePrayerReminderClick = () => {
    addToast(t('settingsPrayerReminderSet'), 'success');
  };
  
  const handleSalaryToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSalaryToggleChecked(event.target.checked);
    if (event.target.checked) {
      addToast(t('salaryNotificationEnabledMessage'), 'success');
    }
  };

  const handleComedyLevelChange = (level: 'normal' | 'hilarious') => {
    setCurrentComedyLevel(level);
    addToast(t('settingsChangeSuccess'), 'success');
  };

  const handleLinkService = (serviceName: 'WhatsApp' | 'Telegram') => {
    setLinkingModalState({ isOpen: true, serviceName });
  };

  const handleConfirmLink = () => {
    if (linkingModalState.serviceName === 'WhatsApp') {
      addToast(t('linkSuccessWhatsAppToast'), 'success');
    } else if (linkingModalState.serviceName === 'Telegram') {
      addToast(t('linkSuccessTelegramToast'), 'success');
    }
    setLinkingModalState({ isOpen: false, serviceName: null });
  };

  const mockPrayerTimes = {
    [Language.AR]: { fajr: "٠٤:١٥ ص", dhuhr: "١٢:٠٥ م", asr: "٠٣:٤٠ م", maghrib: "٠٦:٥٥ م", isha: "٠٨:٢٥ م" },
    [Language.EN]: { fajr: "04:15 AM", dhuhr: "12:05 PM", asr: "03:40 PM", maghrib: "06:55 PM", isha: "08:25 PM" },
  };

  const inputBaseClasses = "w-full p-3 border rounded-lg shadow-sm focus:ring-2 text-sm";
  const lightInputClasses = "bg-white border-gray-300 text-gray-800 focus:ring-blue-600 focus:border-blue-600 placeholder-gray-500";
  const darkInputClasses = "bg-gray-700 border-gray-600 text-gray-100 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400";
  const themedInputClasses = theme === 'dark' ? darkInputClasses : lightInputClasses;

  const primaryButtonClasses = `font-medium py-2.5 px-5 rounded-lg text-sm transition-colors shadow-sm hover:shadow-md transform hover:scale-[1.02] ${theme === 'dark' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`;
  const secondaryButtonClasses = `font-medium py-2.5 px-5 rounded-lg text-sm transition-colors shadow-sm hover:shadow-md transform hover:scale-[1.02] ${theme === 'dark' ? 'bg-gray-600 text-gray-200 hover:bg-gray-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`;
  const activeSecondaryButtonClasses = theme === 'dark' ? 'bg-blue-500 text-white' : 'bg-blue-600 text-white';
  const pageTitleColor = theme === 'dark' ? 'text-orange-400' : 'text-orange-500';

  return (
    <div className={`p-2 ${language === 'ar' ? 'font-cairo text-right' : 'font-poppins text-left'}`}>
      <h1 className={`text-2xl md:text-3xl font-bold mb-6 md:mb-8 ${pageTitleColor}`}>
        {t('settings')}
      </h1>

      <div className="space-y-6 md:space-y-8">
        <SettingsCard titleKey="userRole" descriptionKey="settingsRolePrompt">
          <select
            value={currentUserRole}
            onChange={handleRoleChange}
            className={`${inputBaseClasses} ${themedInputClasses}`}
            aria-label={t('selectRole')}
          >
            <option value={UserRole.Employee}>{t('employee')}</option>
            <option value={UserRole.Supervisor}>{t('supervisorRole')}</option>
            <option value={UserRole.Engineer}>{t('engineer')}</option>
          </select>
        </SettingsCard>

        <SettingsCard titleKey="appTheme" descriptionKey="settingsThemePrompt">
          <div className="flex items-center">
            <button 
              onClick={() => { toggleTheme(); addToast(t('settingsChangeSuccess'), 'success'); }}
              className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors w-full text-center text-sm
                ${theme === 'light' ? secondaryButtonClasses : primaryButtonClasses}`}
              aria-pressed={theme === 'dark'}
            >
              {theme === 'light' ? <MoonIcon className="h-5 w-5"/> : <SunIcon className="h-5 w-5"/>}
              {theme === 'light' ? t('darkMode') : t('lightMode')} 
            </button>
          </div>
        </SettingsCard>
        
        <SettingsCard titleKey="comedyLevel" descriptionKey="settingsComedyPrompt">
           <div className="flex items-center space-x-2 sm:space-x-3 rtl:space-x-reverse">
            <button 
              onClick={() => handleComedyLevelChange('normal')}
              className={`flex-1 px-3 py-2.5 rounded-lg transition-colors text-sm 
                ${currentComedyLevel === 'normal' ? activeSecondaryButtonClasses : secondaryButtonClasses}`}>
              {t('normal')} (😑)
            </button>
            <button 
              onClick={() => handleComedyLevelChange('hilarious')}
              className={`flex-1 px-3 py-2.5 rounded-lg transition-colors text-sm 
                ${currentComedyLevel === 'hilarious' ? activeSecondaryButtonClasses : secondaryButtonClasses}`}>
              {t('hilarious')} (😂)
            </button>
          </div>
        </SettingsCard>

        <SettingsCard titleKey="prayerTimes" descriptionKey="settingsPrayerPrompt">
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-slate-100'}`}>
                <h3 className={`text-sm font-semibold mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{t('prayerTimesDamietta')}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {(Object.keys(mockPrayerTimes[language]) as Array<keyof typeof mockPrayerTimes[Language]>).map(prayerKey => (
                        <div key={prayerKey} className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-600 text-gray-200' : 'bg-white text-gray-700 shadow-sm'} flex flex-col items-center text-center`}>
                            <span className="block font-medium text-sm">{t(prayerKey)}</span>
                            <span className="my-1 text-sm font-semibold text-blue-500">{mockPrayerTimes[language][prayerKey]}</span>
                            <button 
                                onClick={handlePrayerReminderClick}
                                className={`mt-1 px-3 py-1 text-xs rounded-md font-medium ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                            >
                                <BellAlertIcon className="h-3 w-3 inline-block mr-1 rtl:ml-1 rtl:mr-0"/> {t('settingsPrayerReminderButton')}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </SettingsCard>
        
        <SettingsCard titleKey="salaryNotification">
            <label htmlFor="salaryToggle" className="flex items-center cursor-pointer">
                <div className="relative">
                    <input type="checkbox" id="salaryToggle" className="sr-only peer" checked={salaryToggleChecked} onChange={handleSalaryToggleChange} />
                    <div className={`block w-11 h-6 rounded-full transition-colors ${theme === 'dark' ? 'bg-gray-600 peer-checked:bg-green-500' : 'bg-gray-300 peer-checked:bg-green-600'}`}></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5 ${theme === 'dark' ? 'peer-checked:bg-gray-800' : ''}`}></div>
                </div>
                <div className={`text-sm ${language === 'ar' ? 'mr-3' : 'ml-3'} ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('salaryNotificationToggle')}
                </div>
            </label>
        </SettingsCard>

        <SettingsCard titleKey="settingsWhatsAppTelegram" descriptionKey="settingsLinkSoon">
          <div className="space-y-3">
            <button 
              onClick={() => handleLinkService('WhatsApp')}
              className={`w-full py-2.5 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2
                ${theme === 'dark' ? 'bg-green-700 text-white hover:bg-green-600' : 'bg-green-500 text-white hover:bg-green-600'}`}>
              <ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5" /> {/* Generic chat icon for WhatsApp */}
              {t('settingsLinkWhatsApp')}
            </button>
            <button 
              onClick={() => handleLinkService('Telegram')}
              className={`w-full py-2.5 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2
                ${theme === 'dark' ? 'bg-sky-600 text-white hover:bg-sky-500' : 'bg-sky-500 text-white hover:bg-sky-600'}`}> {/* Using sky for Telegram */}
                <ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5" /> {/* Generic chat icon for Telegram */}
              {t('settingsLinkTelegram')}
            </button>
          </div>
        </SettingsCard>

        {(currentUserRole === UserRole.Engineer || currentUserRole === UserRole.Supervisor) && (
            <SettingsCard titleKey="engineersList">
                <ul className={`space-y-1.5 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {engineers.map(eng => <li key={eng.id} className={`p-2.5 rounded-md ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'}`}>{eng.name}</li>)}
                </ul>
            </SettingsCard>
        )}

        {currentUserRole === UserRole.Engineer && (
            <SettingsCard titleKey="supervisorsList">
                {teams.map(team => {
                    const supervisor = supervisors.find(s => s.id === team.supervisorId);
                    return (
                        <div key={team.id} className={`mb-3 p-3.5 border rounded-lg ${theme === 'dark' ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                            <h3 className={`font-medium mb-1 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`}>{team.name}</h3>
                            {supervisor && <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{t('supervisor')}: {supervisor.name}</p>}
                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{t('members')}: {team.memberIds.length}</p>
                        </div>
                    );
                })}
            </SettingsCard>
        )}
      </div>
       <p className={`mt-8 md:mt-10 text-xs md:text-sm text-center ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
        {t('settingsFooter')}
      </p>

      {linkingModalState.isOpen && linkingModalState.serviceName && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 backdrop-blur-sm"  onClick={() => setLinkingModalState({ isOpen: false, serviceName: null })}>
          <div 
            className={`p-6 rounded-xl shadow-xl w-full max-w-md ${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}
            onClick={(e) => e.stopPropagation()} 
          >
            <h3 className={`text-xl font-semibold mb-5 ${language === 'ar' ? 'font-cairo' : 'font-poppins'} ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`}>
              {linkingModalState.serviceName === 'WhatsApp' ? t('linkWithWhatsAppTitle') : t('linkWithTelegramTitle')}
            </h3>
            <div className={`flex justify-center mb-5 p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=MockLinkTo${linkingModalState.serviceName}-${Date.now()}&bgcolor=${theme === 'dark' ? '374151' : 'f3f4f6'}&color=${theme === 'dark' ? 'e5e7eb' : '1f2937'}`} 
                alt={t('linkQrCodeAlt')} 
                className={`rounded-md border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}
              />
            </div>
            <p className={`text-sm mb-6 text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {linkingModalState.serviceName === 'WhatsApp' ? t('linkInstructionsWhatsApp') : t('linkInstructionsTelegram')}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setLinkingModalState({ isOpen: false, serviceName: null })}
                className={secondaryButtonClasses}
              >
                {t('linkCancelButton')}
              </button>
              <button
                onClick={handleConfirmLink}
                className={primaryButtonClasses}
              >
                {t('linkConfirmButton')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SettingsView;