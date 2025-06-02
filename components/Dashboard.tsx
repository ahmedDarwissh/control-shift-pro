
<<<<<<< HEAD
import React from 'react';
import { useLanguageContext } from '../hooks/useLanguage';
import { Team, Supervisor, ShiftType, Language, ViewName } from '../types';
import { CURRENT_SHIFT_ASSIGNMENTS, TEAMS, SUPERVISORS, MORNING_SHIFT_START, EVENING_SHIFT_START } from '../constants';
import { ThemeContext } from '../App'; 

// Heroicons (example, replace if specific icons needed for dashboard)
const CalendarDaysIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" /></svg>
);
const DocumentPlusIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
);
const PaperAirplaneIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
);


interface DashboardProps {
  onNavigate: (view: ViewName) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { t, language } = useLanguageContext();
  const { theme } = React.useContext(ThemeContext);

  const getTeamById = (teamId: string): Team | undefined => TEAMS.find(t => t.id === teamId);
  const getSupervisorById = (supervisorId: string): Supervisor | undefined => SUPERVISORS.find(s => s.id === supervisorId);

  const activeShifts = CURRENT_SHIFT_ASSIGNMENTS.filter(sa => sa.shiftType !== ShiftType.Off);

  const Card: React.FC<{ children: React.ReactNode, className?: string, title?: string, titleClassName?: string }> = ({ children, className, title, titleClassName }) => (
    <div className={`p-5 md:p-6 rounded-xl shadow-lg transition-shadow duration-300 ease-in-out ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} ${className}`}>
      {title && <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'} ${language === 'ar' ? 'font-cairo' : 'font-poppins'} ${titleClassName}`}>{title}</h2>}
      {children}
    </div>
  );
  
  const primaryButtonClasses = `flex items-center justify-center gap-2 font-semibold py-3 px-5 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-[1.03] text-sm ${theme === 'dark' ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-blue-600 text-white hover:bg-blue-700'}`;
  const secondaryButtonClasses = `flex items-center justify-center gap-2 font-semibold py-3 px-5 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-[1.03] text-sm ${theme === 'dark' ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`;
  const accentColor = theme === 'dark' ? 'text-orange-400' : 'text-orange-500';

  return (
    <div className={`p-2 ${language === 'ar' ? 'font-cairo text-right' : 'font-poppins text-left'}`}>
      <Card className={`mb-6 border-t-4 ${theme === 'dark' ? 'border-orange-500' : 'border-orange-500'}`}>
        <h1 className={`text-2xl md:text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
          {t('dashboardGreeting').split('!')[0]}!
        </h1>
        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} text-sm md:text-base`}>
          {t('dashboardGreeting').split('!').slice(1).join('!').trim()}
        </p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 mb-6">
        {activeShifts.map(shiftAssignment => {
          const team = getTeamById(shiftAssignment.teamId);
          if (!team) return null;
          const supervisor = getSupervisorById(team.supervisorId);
          const shiftTime = shiftAssignment.shiftType === ShiftType.Morning ? MORNING_SHIFT_START : EVENING_SHIFT_START;
          
          return (
            <Card key={team.id} className={`border-l-4 ${shiftAssignment.shiftType === ShiftType.Morning ? (theme === 'dark' ? 'border-green-500' : 'border-green-500') : (theme === 'dark' ? 'border-indigo-500' : 'border-indigo-500')}`}>
              <h3 className={`text-lg font-semibold mb-3 ${shiftAssignment.shiftType === ShiftType.Morning ? (theme === 'dark' ? 'text-green-400' : 'text-green-600') : (theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600')}`}>
                {shiftAssignment.shiftType === ShiftType.Morning ? t('morningShift') : t('eveningShift')}
              </h3>
              <div className="space-y-2 text-xs md:text-sm">
                <p><strong className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{t('teamOnDuty')}:</strong> <span className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>{team.name}</span></p>
                {supervisor && <p><strong className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{t('supervisor')}:</strong> <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{supervisor.name}</span></p>}
                <p><strong className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{t('members')}:</strong> <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{team.memberIds.length} {t('members').split('(')[0].trim()}</span></p>
                 <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>{t('activeShift')} {language === 'ar' ? 'تبدأ الساعة' : 'starts at'} <span className={accentColor}>{shiftTime}</span></p>
              </div>
            </Card>
          );
        })}
      </div>

      <Card title={t('quickActions')} className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          <button 
            onClick={() => onNavigate('tasks')}
            className={primaryButtonClasses}>
            <DocumentPlusIcon className="h-5 w-5" />
            {t('addTask')}
          </button>
          <button 
            onClick={() => onNavigate('shifts')}
            className={primaryButtonClasses}>
            <CalendarDaysIcon className="h-5 w-5" />
            {t('viewTeamDetails', 'عرض تفاصيل الفرق')}
          </button>
           <button 
            onClick={() => onNavigate('leaveRequest')}
            className={secondaryButtonClasses}>
            <PaperAirplaneIcon className="h-5 w-5" />
            {t('requestLeave')}
          </button>
        </div>
      </Card>
      
      <Card className="text-center">
        <div className={`w-full h-32 md:h-40 rounded-lg flex items-center justify-center mb-3 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <svg className={`w-16 h-16 ${theme === 'dark' ? 'text-orange-500' : 'text-orange-500'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
        </div>
        <p className={`text-sm italic ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            {t('dailyCoffeeStat')}
        </p>
      </Card>

=======
import React, { useState, useEffect, useRef, useContext } from 'react';
import { useLanguageContext } from '../hooks/useLanguage';
import { Team, Supervisor, ShiftType, Language, ViewName, TranslationSet, LoggedInUser } from '../types';
import { CURRENT_SHIFT_ASSIGNMENTS, TEAMS, SUPERVISORS, MORNING_SHIFT_START, EVENING_SHIFT_START } from '../constants';
import { ThemeContext } from '../contexts/ThemeContext';
import { playFahlawySound } from '../utils/sounds';
import { ToastContext } from '../contexts/ToastContext';
import ShiftHandoverCountdownCard from './ShiftHandoverCountdownCard';
import PrayerTimesWidget from './PrayerTimesWidget'; // Assuming this component exists

// Import all necessary icons
import {
  UserCircleIcon, ClockIcon, CalendarDaysIcon, PaperAirplaneIcon, SparklesIcon, LightBulbIcon,
  QueueListIcon, CalculatorIcon, ClipboardDocumentListIcon, ArchiveBoxIcon, ClipboardDocumentCheckIcon,
  ArrowsRightLeftIcon, AcademicCapIcon, MegaphoneIcon, PresentationChartBarIcon, BeakerIcon,
  VariableIcon, PhoneArrowUpRightIcon, NewspaperIcon, StarIcon, UsersIcon,
  FingerPrintIcon as CheckInOutIcon, GiftIcon, SunIcon as WeatherSunIcon, CloudIcon as WeatherCloudIcon,
  ExclamationTriangleIcon, WrenchScrewdriverIcon, TruckIcon, UserIcon as PersonalHubIcon,
  ChatBubbleLeftEllipsisIcon, ViewColumnsIcon, BookOpenIcon, Cog6ToothIcon, AdjustmentsHorizontalIcon, CpuChipIcon
} from '@heroicons/react/24/outline';

interface DashboardProps {
  onNavigate: (view: ViewName) => void;
  loggedInUser: LoggedInUser | null;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, loggedInUser }) => {
  const { t, language } = useLanguageContext();
  const { theme } = useContext(ThemeContext);
  const { addToast } = useContext(ToastContext);

  const [currentMorningTeam, setCurrentMorningTeam] = useState<Team | null>(null);
  const [currentEveningTeam, setCurrentEveningTeam] = useState<Team | null>(null);
  const [morningSupervisor, setMorningSupervisor] = useState<Supervisor | null>(null);
  const [eveningSupervisor, setEveningSupervisor] = useState<Supervisor | null>(null);
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);
  const [suggestionText, setSuggestionText] = useState('');

  useEffect(() => {
    const morningAssignment = CURRENT_SHIFT_ASSIGNMENTS.find(sa => sa.shiftType === ShiftType.Morning);
    const eveningAssignment = CURRENT_SHIFT_ASSIGNMENTS.find(sa => sa.shiftType === ShiftType.Evening);

    if (morningAssignment) {
      const team = TEAMS.find(t => t.id === morningAssignment.teamId);
      setCurrentMorningTeam(team || null);
      if (team) setMorningSupervisor(SUPERVISORS.find(s => s.id === team.supervisorId) || null);
    }
    if (eveningAssignment) {
      const team = TEAMS.find(t => t.id === eveningAssignment.teamId);
      setCurrentEveningTeam(team || null);
      if (team) setEveningSupervisor(SUPERVISORS.find(s => s.id === team.supervisorId) || null);
    }
  }, []);

  const handleCheckInOut = () => {
    addToast(language === 'ar' ? 'تم تسجيل حضورك/انصرافك يا فهلوي!' : 'Your check-in/out has been recorded, Fahlawy!', 'success');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          addToast(language === 'ar' ? `موقعك الحالي: ${position.coords.latitude.toFixed(2)}, ${position.coords.longitude.toFixed(2)}` : `Current location: ${position.coords.latitude.toFixed(2)}, ${position.coords.longitude.toFixed(2)}`, 'info');
        },
        (error) => {
          addToast(language === 'ar' ? 'لم نتمكن من تحديد موقعك.' : 'Could not determine your location.', 'alert');
        }
      );
    } else {
      addToast(language === 'ar' ? 'خاصية تحديد الموقع غير مدعومة في هذا المتصفح.' : 'Geolocation is not supported by this browser.', 'alert');
    }
  };

  const handleOpenSuggestionModal = () => setShowSuggestionModal(true);
  const handleCloseSuggestionModal = () => setShowSuggestionModal(false);
  const handleSubmitSuggestion = () => {
    if (suggestionText.trim()) {
      addToast(language === 'ar' ? 'شكراً على اقتراحك الفهلواني!' : 'Thanks for your Fahlawy suggestion!', 'success');
      setSuggestionText('');
      setShowSuggestionModal(false);
    } else {
      addToast(language === 'ar' ? 'اكتب اقتراحك الأول يا نجم.' : 'Write your suggestion first, star.', 'alert');
    }
  };

  const QuickLinkButton: React.FC<{
    view: ViewName;
    icon: React.ElementType;
    labelKey: keyof TranslationSet;
    colorClass?: string;
    size?: 'small' | 'medium' | 'large';
  }> = ({ view, icon: Icon, labelKey, colorClass, size = 'medium' }) => {
    const baseButtonClasses = `rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 card-interactive flex flex-col items-center justify-center text-center ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-white hover:bg-gray-50 text-gray-700'}`;
    
    let paddingClass = 'p-3';
    let iconSizeClass = 'h-7 w-7 md:h-8 md:w-8';
    let textSizeClass = 'text-xs md:text-sm';

    if (size === 'large') {
      paddingClass = 'p-4 md:p-5';
      iconSizeClass = 'h-10 w-10 md:h-12 md:w-12';
      textSizeClass = 'text-sm md:text-md';
    } else if (size === 'small') {
       paddingClass = 'p-2 md:p-2.5';
       iconSizeClass = 'h-6 w-6';
       textSizeClass = 'text-xs';
    }

    return (
      <button onClick={() => onNavigate(view)} className={`${baseButtonClasses} ${paddingClass}`}>
        <Icon className={`${iconSizeClass} mb-1.5 ${colorClass || (theme === 'dark' ? 'text-blue-400' : 'text-blue-600')}`} />
        <span className={textSizeClass}>{t(labelKey)}</span>
      </button>
    );
  };
  
  const SuperQuickActionButton: React.FC<{
    onClick?: () => void;
    icon: React.ElementType;
    label: string;
    colorClass?: string;
    title?: string;
  }> = ({ onClick, icon: Icon, label, colorClass, title}) => (
    <button onClick={onClick} title={title || label} className={`p-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1.5 flex flex-col items-center justify-center text-center card-interactive ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-white hover:bg-gray-50 text-gray-700'}`}>
        <Icon className={`h-7 w-7 mb-1.5 ${colorClass || (theme === 'dark' ? 'text-sky-400' : 'text-sky-600')}`}/>
        <span className="text-xs">{label}</span>
    </button>
  );


  const mockFahlawyOfTheWeek = { name: language === 'ar' ? 'الأسطى جمعة الفهلوي' : 'Master Gomaa El-Fahlawy', points: 1250, image: UserCircleIcon };
  const mockTopFahlawis = [
    { name: language === 'ar' ? 'البرنس علاء' : 'Prince Alaa', points: 1100 },
    { name: language === 'ar' ? 'المعلم رضا' : 'Boss Reda', points: 1050 },
    { name: language === 'ar' ? 'الكينج هيما' : 'King Hima', points: 980 },
  ];
  
  const operationalTools = [
    { view: 'equipmentLogbook' as ViewName, icon: ArchiveBoxIcon, labelKey: 'viewName_equipmentLogbook' as keyof TranslationSet },
    { view: 'permitToWork' as ViewName, icon: ClipboardDocumentCheckIcon, labelKey: 'viewName_permitToWork' as keyof TranslationSet },
    { view: 'safetyObservation' as ViewName, icon: MegaphoneIcon, labelKey: 'viewName_safetyObservation' as keyof TranslationSet },
    { view: 'shiftHandoverNotes' as ViewName, icon: ArrowsRightLeftIcon, labelKey: 'viewName_shiftHandoverNotes' as keyof TranslationSet },
    { view: 'knowledgeBase' as ViewName, icon: AcademicCapIcon, labelKey: 'viewName_knowledgeBase' as keyof TranslationSet },
    { view: 'unitConverter' as ViewName, icon: VariableIcon, labelKey: 'viewName_unitConverter' as keyof TranslationSet },
    { view: 'emergencyContactsProcedures' as ViewName, icon: PhoneArrowUpRightIcon, labelKey: 'viewName_emergencyContactsProcedures' as keyof TranslationSet },
    { view: 'internalAnnouncements' as ViewName, icon: NewspaperIcon, labelKey: 'viewName_internalAnnouncements' as keyof TranslationSet },
    { view: 'toolboxTalks' as ViewName, icon: PresentationChartBarIcon, labelKey: 'viewName_toolboxTalks' as keyof TranslationSet },
    { view: 'chemicalReference' as ViewName, icon: BeakerIcon, labelKey: 'viewName_chemicalReference' as keyof TranslationSet },
    { view: 'ships' as ViewName, icon: TruckIcon, labelKey: 'viewName_ships' as keyof TranslationSet },
    { view: 'preventiveMaintenance' as ViewName, icon: WrenchScrewdriverIcon, labelKey: 'viewName_preventiveMaintenance' as keyof TranslationSet },
    { view: 'accidentReport' as ViewName, icon: ExclamationTriangleIcon, labelKey: 'viewName_accidentReport' as keyof TranslationSet },
  ];

  const aiAndUtilities = [
     { view: 'aiShiftScheduler' as ViewName, icon: SparklesIcon, labelKey: 'viewName_aiShiftScheduler' as keyof TranslationSet },
     { view: 'aiMaintenanceGuide' as ViewName, icon: LightBulbIcon, labelKey: 'viewName_aiMaintenanceGuide' as keyof TranslationSet },
     { view: 'smartShiftEnhancer' as ViewName, icon: AdjustmentsHorizontalIcon, labelKey: 'viewName_smartShiftEnhancer' as keyof TranslationSet },
     { view: 'smartMaintenanceEnhancer' as ViewName, icon: CpuChipIcon, labelKey: 'viewName_smartMaintenanceEnhancer' as keyof TranslationSet },
     { view: 'petroWiki' as ViewName, icon: BookOpenIcon, labelKey: 'viewName_petroWiki' as keyof TranslationSet },
     { view: 'activityLog' as ViewName, icon: QueueListIcon, labelKey: 'viewName_activityLog' as keyof TranslationSet },
     { view: 'chat' as ViewName, icon: ChatBubbleLeftEllipsisIcon, labelKey: 'viewName_chat' as keyof TranslationSet },
     { view: 'kanban' as ViewName, icon: ViewColumnsIcon, labelKey: 'viewName_kanban' as keyof TranslationSet },
     { view: 'trainingCourses' as ViewName, icon: AcademicCapIcon, labelKey: 'viewName_trainingCourses' as keyof TranslationSet },
     { view: 'fun' as ViewName, icon: SparklesIcon, labelKey: 'viewName_fun' as keyof TranslationSet },
  ];


  const renderSection = (titleKey: keyof TranslationSet, items: Array<{view: ViewName, icon: React.ElementType, labelKey: keyof TranslationSet, colorClass?: string, size?: 'small' | 'medium' | 'large'}>, gridCols: string = 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5') => (
    <div className={`p-4 md:p-5 rounded-xl shadow-xl mb-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
      <h2 className={`text-lg md:text-xl font-semibold mb-4 text-center ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
        {t(titleKey)}
      </h2>
      <div className={`grid ${gridCols} gap-3 md:gap-4`}>
        {items.map(item => (
          <QuickLinkButton
            key={item.view}
            view={item.view}
            icon={item.icon}
            labelKey={item.labelKey}
            colorClass={item.colorClass}
            size={item.size || 'small'}
          />
        ))}
      </div>
    </div>
  );


  return (
    <div className={`p-2 md:p-4 animate-fadeInUp ${language === 'ar' ? 'font-cairo' : 'font-poppins'}`}>
      <h1 className={`text-2xl md:text-3xl font-bold mb-6 text-center ${theme === 'dark' ? 'text-accent-orange' : 'text-accent-orange'}`}>
        {t('dashboard')}
      </h1>
      
      {/* Section 1: Core Shift Information & Countdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <ShiftHandoverCountdownCard />
        </div>
        <div className={`p-4 rounded-xl shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} card-interactive`}>
            <PrayerTimesWidget />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {currentMorningTeam && morningSupervisor && (
             <div className={`p-5 rounded-xl shadow-xl border-l-4 ${theme === 'dark' ? 'bg-gray-800 border-green-500' : 'bg-white border-green-500'}`}>
                <h2 className={`text-lg font-semibold mb-2 flex items-center ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                  <ClockIcon className="h-5 w-5 mr-2 rtl:ml-2" /> {t('morningShift')} <span className="text-xs ml-2 rtl:mr-2">({MORNING_SHIFT_START})</span>
                </h2>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}><strong>{t('teamOnDuty')}:</strong> {currentMorningTeam.name}</p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}><strong>{t('supervisor')}:</strong> {morningSupervisor.name}</p>
             </div>
        )}
         {currentEveningTeam && eveningSupervisor && (
             <div className={`p-5 rounded-xl shadow-xl border-l-4 ${theme === 'dark' ? 'bg-gray-800 border-blue-500' : 'bg-white border-blue-500'}`}>
                <h2 className={`text-lg font-semibold mb-2 flex items-center ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                  <ClockIcon className="h-5 w-5 mr-2 rtl:ml-2" /> {t('eveningShift')} <span className="text-xs ml-2 rtl:mr-2">({EVENING_SHIFT_START})</span>
                </h2>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}><strong>{t('teamOnDuty')}:</strong> {currentEveningTeam.name}</p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}><strong>{t('supervisor')}:</strong> {eveningSupervisor.name}</p>
             </div>
        )}
      </div>
      
      {/* Section 2: Key Performance & Engagement */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className={`p-4 rounded-xl shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} card-interactive`}>
            <h3 className={`text-md font-semibold mb-2 flex items-center ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>
                <StarIcon className="h-5 w-5 mr-2 rtl:ml-2"/>{t('dashboardTaskMastersTitle')}
            </h3>
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <mockFahlawyOfTheWeek.image className={`h-12 w-12 rounded-full ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}/>
                <div>
                    <p className={`font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>{mockFahlawyOfTheWeek.name}</p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-yellow-500' : 'text-yellow-700'}`}>{mockFahlawyOfTheWeek.points} {t('expertisePoints')}</p>
                </div>
            </div>
        </div>
        <div className={`p-4 rounded-xl shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} card-interactive`}>
            <h3 className={`text-md font-semibold mb-2 flex items-center ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                <UsersIcon className="h-5 w-5 mr-2 rtl:ml-2"/>{language === 'ar' ? 'أفضل الفهلوية' : 'Top Fahlawis'}
            </h3>
            <ul className="space-y-1 text-xs">
                {mockTopFahlawis.map(f => (
                    <li key={f.name} className="flex justify-between">
                        <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{f.name}</span>
                        <span className={`${theme === 'dark' ? 'text-green-500' : 'text-green-700'}`}>{f.points}</span>
                    </li>
                ))}
            </ul>
        </div>
         <div className={`p-4 rounded-xl shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} card-interactive`}>
            <h3 className={`text-md font-semibold mb-2 flex items-center ${theme === 'dark' ? 'text-sky-400' : 'text-sky-600'}`}>
                <WeatherSunIcon className="h-5 w-5 mr-2 rtl:ml-2"/>{t('dashboardMarineWeatherTitle')}
            </h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{t('dashboardWeatherConditionClear')}</p>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{language === 'ar' ? 'الأمواج: ٠.٥م، الرياح: ٥ عقدة شمالية' : 'Waves: 0.5m, Wind: 5 knots N'}</p>
        </div>
      </div>

      {/* Section 3: Super Quick Actions & Essential Tools */}
       <div className={`p-4 md:p-5 rounded-xl shadow-xl mb-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
        <h2 className={`text-lg md:text-xl font-semibold mb-4 text-center ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
            {language === 'ar' ? 'الوصول السريع والأساسيات' : 'Quick Access & Essentials'}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 mb-4">
           <SuperQuickActionButton onClick={handleCheckInOut} icon={CheckInOutIcon} label={language === 'ar' ? 'تسجيل حضور/انصراف' : 'Check In/Out'} colorClass={theme === 'dark' ? 'text-green-400' : 'text-green-500'}/>
           <SuperQuickActionButton onClick={handleOpenSuggestionModal} icon={GiftIcon} label={language === 'ar' ? 'صندوق الاقتراحات' : 'Suggestion Box'} colorClass={theme === 'dark' ? 'text-purple-400' : 'text-purple-500'}/>
           <QuickLinkButton view={'petroGenius'} icon={SparklesIcon} labelKey={'viewName_petroGenius' as keyof TranslationSet} colorClass={theme === 'dark' ? 'text-pink-400' : 'text-pink-500'} size="small" />
           <SuperQuickActionButton icon={ExclamationTriangleIcon} label={language === 'ar' ? 'زرار الطوارئ' : 'Panic Button'} title={language === 'ar' ? 'زرار الطوارئ (تجريبي)' : 'Panic Button (Demo)'} colorClass={theme === 'dark' ? 'text-red-400' : 'text-red-500'}/>
           <QuickLinkButton view={'settings'} icon={Cog6ToothIcon} labelKey={'viewName_settings' as keyof TranslationSet} colorClass={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} size="small" />
        </div>
         <hr className={`my-4 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`} />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
            <QuickLinkButton view={'tasks'} icon={ClipboardDocumentListIcon} labelKey={'tasks'} colorClass={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} size="medium"/>
            <QuickLinkButton view={'shifts'} icon={CalendarDaysIcon} labelKey={'shifts'} colorClass={theme === 'dark' ? 'text-green-400' : 'text-green-600'} size="medium"/>
            <QuickLinkButton view={'leaveRequest'} icon={PaperAirplaneIcon} labelKey={'requestLeave'} colorClass={theme === 'dark' ? 'text-yellow-400' : 'text-yellow-500'} size="medium"/>
            <QuickLinkButton view={'personalHub'} icon={PersonalHubIcon} labelKey={'personalHubTitle'} colorClass={theme === 'dark' ? 'text-teal-400' : 'text-teal-500'} size="medium"/>
            <QuickLinkButton view={'advancedCalculator'} icon={CalculatorIcon} labelKey={'advancedCalculatorTitle'} colorClass={theme === 'dark' ? 'text-purple-400' : 'text-purple-500'} size="medium"/>
        </div>
       </div>


      {/* Section 4: Petro-Tech Operations Suite */}
      {renderSection('petroTechToolsSectionTitle', operationalTools, 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6')}

      {/* Section 5: AI Fahlawy & Advanced Utilities */}
      {renderSection('AIFeatures', aiAndUtilities, 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5')}


      {showSuggestionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className={`p-6 rounded-lg shadow-xl w-full max-w-md ${theme === 'dark' ? 'bg-dark-card' : 'bg-white'}`}>
            <h4 className={`text-lg font-semibold mb-3 ${theme === 'dark' ? 'text-bright-yellow' : 'text-marine-blue'}`}>{language === 'ar' ? 'قدم اقتراحك الفهلواني' : 'Submit Your Fahlawy Suggestion'}</h4>
            <textarea 
              value={suggestionText} 
              onChange={(e) => setSuggestionText(e.target.value)}
              rows={4}
              className={`w-full p-2 border rounded-md mb-3 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-500'}`}
              placeholder={language === 'ar' ? 'اكتب اقتراحك هنا يا مبدع...' : 'Write your creative suggestion here...'}
            />
            <div className="flex justify-end gap-3">
              <button onClick={handleCloseSuggestionModal} className={`py-2 px-4 rounded-lg text-xs font-medium ${theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}>{t('profileCancelButton')}</button>
              <button onClick={handleSubmitSuggestion} className={`py-2 px-4 rounded-lg text-xs font-medium ${theme === 'dark' ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}>{t('submitEntry')}</button>
            </div>
          </div>
        </div>
      )}

      <p className={`mt-8 text-xs text-center ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
        {t('dashboardGreeting')}
      </p>
>>>>>>> bee2d85 (updated)
    </div>
  );
};

<<<<<<< HEAD
export default Dashboard;
=======
export default Dashboard;
>>>>>>> bee2d85 (updated)
