
import React, { useState } from 'react';
import { useLanguageContext } from '../hooks/useLanguage';
import { Team, Supervisor, ShiftType, Language } from '../types';
import { CURRENT_SHIFT_ASSIGNMENTS, EMPLOYEES_TEAM1, EMPLOYEES_TEAM2, EMPLOYEES_TEAM3, EMPLOYEES_TEAM4 } from '../constants';
import { ThemeContext } from '../App'; 
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'; // Example, if you use a library

const ChevronDown: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>;
const ChevronUp: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" /></svg>;


interface ShiftScheduleViewProps {
  teams: Team[];
  supervisors: Supervisor[];
}

const ShiftScheduleView: React.FC<ShiftScheduleViewProps> = ({ teams, supervisors }) => {
  const { t, language } = useLanguageContext();
  const { theme } = React.useContext(ThemeContext);
  const [expandedTeamId, setExpandedTeamId] = useState<string | null>(null);

  const getTeamMembers = (teamId: string) => {
    const allEmployees = [...EMPLOYEES_TEAM1, ...EMPLOYEES_TEAM2, ...EMPLOYEES_TEAM3, ...EMPLOYEES_TEAM4];
    return allEmployees.filter(emp => emp.teamId === teamId);
  };

  const toggleTeamDetails = (teamId: string) => {
    setExpandedTeamId(expandedTeamId === teamId ? null : teamId);
  };
  
  const getShiftDisplayName = (shiftType: ShiftType) => {
    switch(shiftType) {
      case ShiftType.Morning: return t('morningShift');
      case ShiftType.Evening: return t('eveningShift');
      case ShiftType.Off: return t('offDuty');
      default: return '';
    }
  };

  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
  const secondaryTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const accentColor = theme === 'dark' ? 'text-orange-400' : 'text-orange-500';
  const detailsButtonClass = `text-sm font-medium mt-3 mb-2 transition-colors px-4 py-2 rounded-lg flex items-center gap-2
    ${theme === 'dark' 
      ? 'bg-gray-700 text-blue-400 hover:bg-gray-600' 
      : 'bg-gray-100 text-blue-600 hover:bg-gray-200'
    }`;
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`p-2 ${language === 'ar' ? 'font-cairo text-right' : 'font-poppins text-left'}`}>
      <h1 className={`text-2xl md:text-3xl font-bold mb-6 md:mb-8 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-500'}`}>
        {t('shiftSchedule')}
      </h1>
      
      <div className="space-y-5 md:space-y-6">
        {CURRENT_SHIFT_ASSIGNMENTS.map(assignment => {
          const team = teams.find(tm => tm.id === assignment.teamId);
          if (!team) return null;
          const supervisor = supervisors.find(sup => sup.id === team.supervisorId);
          const teamMembers = getTeamMembers(team.id);
          const isExpanded = expandedTeamId === team.id;

          return (
            <div key={team.id} className={`p-5 md:p-6 rounded-xl shadow-lg border-l-4 hover:shadow-xl transition-shadow duration-300 ease-in-out
              ${cardBg}
              ${assignment.shiftType === ShiftType.Morning ? 'border-green-500' : ''}
              ${assignment.shiftType === ShiftType.Evening ? 'border-indigo-500' : ''}
              ${assignment.shiftType === ShiftType.Off ? (theme === 'dark' ? 'border-gray-600' : 'border-gray-400') : ''}
            `}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
                <h2 className={`text-lg md:text-xl font-semibold ${textColor}`}>
                  {t('team')}: <span className={accentColor}>{team.name}</span>
                </h2>
                <span 
                  className={`mt-2 sm:mt-0 px-3 py-1 text-xs md:text-sm font-medium rounded-full
                    ${assignment.shiftType === ShiftType.Morning ? (theme === 'dark' ? 'bg-green-700 text-green-200' : 'bg-green-100 text-green-700') : ''}
                    ${assignment.shiftType === ShiftType.Evening ? (theme === 'dark' ? 'bg-indigo-700 text-indigo-200' : 'bg-indigo-100 text-indigo-700') : ''}
                    ${assignment.shiftType === ShiftType.Off ? (theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700') : ''}
                  `}
                >
                  {getShiftDisplayName(assignment.shiftType)}
                </span>
              </div>
              
              {supervisor && (
                <p className={`${secondaryTextColor} mb-1 text-sm md:text-base`}>
                  <span className="font-medium">{t('supervisor')}:</span> {supervisor.name}
                </p>
              )}
              
              <button 
                onClick={() => toggleTeamDetails(team.id)}
                className={detailsButtonClass}
                aria-expanded={isExpanded}
              >
                {isExpanded ? t('hideTeamDetails') : t('viewTeamDetails')}
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>

              {isExpanded && (
                <div className={`mt-3 border-t pt-4 ${borderColor}`}>
                  <h3 className={`text-md font-semibold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>{t('members')}:</h3>
                  <ul className={`list-disc list-inside space-y-1 text-xs md:text-sm ${secondaryTextColor} ${language === 'ar' ? 'pr-4' : 'pl-4'}`}>
                    {teamMembers.map(member => (
                      <li key={member.id}>{member.name}</li>
                    ))}
                    {teamMembers.length === 0 && <li>{language === 'ar' ? 'مفيش حد في الفريق ده ولا إيه؟!' : 'No members in this team yet?!'}</li>}
                  </ul>
                </div>
              )}
              
              {assignment.shiftType !== ShiftType.Off && (
                <div className={`mt-4 p-3 rounded-lg text-xs md:text-sm ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-slate-100 text-gray-700'}`}>
                  <p>
                    {language === 'ar' ? 'الوردية تبدأ من ' : 'Shift from '} 
                    <strong className={accentColor}>{assignment.shiftType === ShiftType.Morning ? '07:30' : '19:30'}</strong> 
                    {language === 'ar' ? ' حتى ' : ' to '} 
                    <strong className={accentColor}>{assignment.shiftType === ShiftType.Morning ? '19:30' : '07:30'}</strong>.
                  </p>
                  <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {t('shiftFocusMessage')}
                  </p>
                </div>
              )}
               {assignment.shiftType === ShiftType.Off && (
                <div className={`mt-4 p-3 rounded-lg text-xs md:text-sm ${theme === 'dark' ? 'bg-yellow-700/70 text-yellow-200' : 'bg-yellow-50 text-yellow-700'}`}>
                  <p className="font-medium">
                    {t('shiftEnjoyBreak')}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <p className={`mt-8 text-xs md:text-sm text-center ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
        {language === 'ar' ? 'جدول الورديات ده معمول عشان راحتك، متنساش تشيك عليه كل يوم الصبح وبالليل قبل ما تنام عشان متلبسش في الحيط.' : 'This schedule is for your convenience. Check it daily so you don\'t get surprised!'} 😉
      </p>
    </div>
  );
};

export default ShiftScheduleView;