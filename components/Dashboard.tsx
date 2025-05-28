
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

    </div>
  );
};

export default Dashboard;