
import React from 'react';
import { useLanguageContext } from '../hooks/useLanguage';
import { ViewName, Language } from '../types'; 
import { ThemeContext } from '../App'; 

// Heroicons
const HomeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" /></svg>
);
const ClockIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const ListBulletIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h7.5M8.25 12h7.5m-7.5 5.25h7.5M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
);
const TruckIcon: React.FC<{ className?: string }> = ({ className }) => ( // Placeholder for Ship Icon
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v.958m12 0c0 2.278-1.091 4.163-2.638 5.163M12 12.75H3.375m0 0L3 12m0 0l.375-.25M3.375 12.75c0-1.562.796-2.924 2.062-3.75M3.375 12.75c2.953 0 5.479-1.605 6.875-3.75m0-1.51V12.75c0 .932.392 1.79.995 2.395M12 12.75c0 .475.026.944.075 1.405M12 12.75c-.375 0-.75-.068-1.125-.201m-1.125-.201c-.394-.15-.763-.348-1.097-.585M12 12.75c.375 0 .75-.068 1.125-.201m1.125-.201c.394-.15.763-.348 1.097-.585m0 0c1.266.726 2.063 2.188 2.063 3.75" /></svg>
);
const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.25 12L17 13.75M17 10.25l1.25-1.5M14.875 8.375L13.75 7M14.875 15.625L13.75 17M10.125 8.375L11.25 7M10.125 15.625L11.25 17" /></svg>
);
const Cog6ToothIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.003 1.11-1.227l.473-.101c.52-.112.991.303.991.825l-.013.491c.093.065.19.128.287.197l.473.336c.444.315.625.902.42 1.39l-.074.182c-.038.101-.058.21-.058.323s.02.222.058.323l.074.182c.205.488.024 1.075-.42 1.39l-.473.336c-.097.069-.194.132-.287.197l.013.491c0 .522-.47.938-.99.826l-.473-.101c-.55-.224-1.02-.685-1.11-1.227V11.06c-.097.069-.194.132-.287.197l-.474.336c-.444.315-.625.902-.42-1.39l.074.182c.038.101.058.21.058.323s-.02.222-.058.323l-.074.182c-.205-.488-.024-1.075.42 1.39l.474.336c.097.069.193.132.287.197V15.75c.09.542.56 1.004 1.11 1.228l.473.101c.52.112.991-.303.991-.825l-.013-.491c.093-.065.19-.128.287-.197l.473-.336c.444-.315.625.902.42-1.39l-.075-.182c-.037-.101-.057-.21-.057-.323s.02-.222.057-.323l.075-.182c.205-.488.024-1.075-.42-1.39l-.473-.336c-.097-.069-.194-.132-.287-.197l.013-.491c0-.522.47-.938.99-.826l.473.101c.55.224 1.02.685 1.11 1.227V9.34c.097-.069.194-.132.287-.197l.474-.336c.444-.315-.625-.902-.42-1.39l-.074-.182c-.038-.101-.058.21-.058.323s.02-.222.058.323l.074-.182c.205-.488.024-1.075-.42-1.39l-.474-.336c-.097-.069-.193-.132.287-.197V4.249c-.09-.542-.56-1.003-1.11-1.227l-.473-.101c-.52-.112-.991.303-.991.825l.013.491c-.093.065-.19.128.287-.197l-.473.336c-.444-.315-.625.902-.42-1.39l.075-.182c.037-.101.057-.21.057-.323s-.02.222-.057-.323l-.075-.182c-.205-.488-.024-1.075.42-1.39l.473-.336c.097-.069.194-.132.287-.197L9.594 3.94zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" /></svg>
);
const ChatBubbleLeftEllipsisIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-3.862 8.25-8.625 8.25DB4.406 20.25 3 21.75l1.17-3.513A8.25 8.25 0 013 12c0-4.556 3.862-8.25 8.625-8.25s8.625 3.694 8.625 8.25z" /></svg>
);
const ViewColumnsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125z" /></svg>
);
const WrenchScrewdriverIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.528-1.032.996-2.137 1.303-3.296C17.147 5.42 16.57 2.25 13.5 2.25 10.43 2.25 9.853 5.42 11.823 8.844c.307 1.159.775 2.264 1.303 3.296S10.39 14.64 11.42 15.17z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6.677 11.42L11.42 15.17m-.755-6.214c.448-.87.936-1.714 1.482-2.515M11.42 15.17l-3.03 2.496m0 0l-1.097 1.097a2.25 2.25 0 01-3.182 0l-1.097-1.097a2.25 2.25 0 010-3.182l1.097-1.097 3.03-2.496m0 0L6.678 11.42m2.828 2.829l2.122-2.121" /></svg>
);
const ExclamationTriangleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
);
const XMarkIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
);

interface SidebarIconWrapperProps {
  children: React.ReactNode;
  lang: string;
  isActive?: boolean; 
}
const SidebarIconWrapper: React.FC<SidebarIconWrapperProps> = ({ children, lang, isActive }) => {
    const { theme } = React.useContext(ThemeContext);
    let iconColorClass = '';
    if (isActive) {
        iconColorClass = theme === 'dark' ? 'text-gray-900' : 'text-white';
    } else {
        iconColorClass = theme === 'dark' ? 'text-gray-400 group-hover:text-blue-400' : 'text-gray-500 group-hover:text-blue-600';
    }
    return (
        <span className={`inline-block h-5 w-5 transition-colors duration-200 ${iconColorClass} ${lang === 'ar' ? 'ml-3' : 'mr-3'}`}>{children}</span>
    );
};


interface SidebarProps {
  onNavigate: (view: ViewName) => void;
  currentView: ViewName;
  isOpen: boolean;
  toggleSidebar: () => void;
  isLoggedIn: boolean; 
}

type NavItemKey = 
  'viewName_dashboard' | 'viewName_shifts' | 'viewName_tasks' | 
  'viewName_ships' | 'viewName_kanban' | 'viewName_preventiveMaintenance' | 
  'viewName_accidentReport' | 'viewName_chat' | 'viewName_fun' | 'viewName_settings';

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, currentView, isOpen, toggleSidebar, isLoggedIn }) => {
  const { t, language } = useLanguageContext();
  const { theme } = React.useContext(ThemeContext);
  
  const navItems: { view: ViewName; labelKey: NavItemKey; shortLabelKey: string; icon: React.ElementType }[] = [
    { view: 'dashboard', labelKey: 'viewName_dashboard', shortLabelKey: 'الرئيسية', icon: HomeIcon },
    { view: 'shifts', labelKey: 'viewName_shifts', shortLabelKey: 'الورديات', icon: ClockIcon },
    { view: 'tasks', labelKey: 'viewName_tasks', shortLabelKey: 'مهام يومية', icon: ListBulletIcon },
    { view: 'ships', labelKey: 'viewName_ships', shortLabelKey: 'المراكب', icon: TruckIcon }, // Replaced ShipIcon
    { view: 'kanban', labelKey: 'viewName_kanban', shortLabelKey: 'مهمات دورية', icon: ViewColumnsIcon },
    { view: 'preventiveMaintenance', labelKey: 'viewName_preventiveMaintenance', shortLabelKey: 'صيانة', icon: WrenchScrewdriverIcon },
    { view: 'accidentReport', labelKey: 'viewName_accidentReport', shortLabelKey: 'حوادث', icon: ExclamationTriangleIcon },
    { view: 'chat', labelKey: 'viewName_chat', shortLabelKey: 'شات الفريق', icon: ChatBubbleLeftEllipsisIcon },
    { view: 'fun', labelKey: 'viewName_fun', shortLabelKey: 'ترفيه', icon: SparklesIcon },
    { view: 'settings', labelKey: 'viewName_settings', shortLabelKey: 'الضبط', icon: Cog6ToothIcon },
  ];

  const getLabel = (item: typeof navItems[0]) => {
    return language === Language.AR ? item.shortLabelKey : t(item.labelKey).split('(')[0].trim();
  };

  if (!isLoggedIn) { 
    return null;
  }

  const getNavItemClasses = (view: ViewName) => {
    const isActive = currentView === view;
    let baseClasses = `w-full flex items-center py-2.5 px-3.5 rounded-lg transition-all duration-200 ease-in-out text-sm group ${language === 'ar' ? 'font-cairo text-right justify-end' : 'font-poppins text-left justify-start'}`;
    
    if (theme === 'dark') {
      if (isActive) {
        baseClasses += ' bg-blue-500 text-gray-900 shadow-md transform scale-105';
      } else {
        baseClasses += ' text-gray-300 hover:bg-gray-700 hover:text-blue-400';
      }
    } else { 
      if (isActive) {
        baseClasses += ' bg-blue-600 text-white shadow-md transform scale-105';
      } else {
        baseClasses += ' text-gray-700 hover:bg-blue-50 hover:text-blue-600';
      }
    }
    return baseClasses;
  };
  
  const closeButtonColor = theme === 'dark' ? 'text-gray-400 hover:text-gray-100 hover:bg-gray-700' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100';
  const sidebarBg = theme === 'dark' ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-white shadow-xl border-gray-200';
  const appNameColor = theme === 'dark' ? 'text-blue-400' : 'text-blue-600';

  return (
    <aside className={`fixed inset-y-0 z-30 flex flex-col p-4 sidebar-transition transform
      ${language === Language.AR ? 'right-0 border-l' : 'left-0 border-r'}
      ${isOpen ? (language === Language.AR ? 'translate-x-0' : 'translate-x-0') : (language === Language.AR ? 'translate-x-full' : '-translate-x-full')}
      w-60 sm:w-64 md:w-68 
      ${sidebarBg}`}>
      
      <div className={`flex items-center justify-between mb-6 pt-1`}>
        <span className={`text-xl font-semibold ${appNameColor} ${language === 'ar' ? 'font-cairo' : 'font-poppins'}`}>
          {t('appName')}
        </span>
        <button onClick={toggleSidebar} className={`p-1.5 rounded-md md:hidden ${closeButtonColor}`} aria-label="Close sidebar">
            <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto space-y-2">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => { onNavigate(item.view); }}
              className={getNavItemClasses(item.view)}
              aria-label={t(item.labelKey)}
            >
              {language === 'ar' && <span className="flex-1 text-right whitespace-normal break-words">{getLabel(item)}</span>}
              <SidebarIconWrapper lang={language} isActive={isActive}>
                <IconComponent />
              </SidebarIconWrapper>
              {language === 'en' && <span className="flex-1 text-left whitespace-normal break-words">{getLabel(item)}</span>}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;