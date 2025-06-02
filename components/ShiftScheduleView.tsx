
<<<<<<< HEAD
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
=======
import React, { useState, useEffect, useMemo } from 'react';
import { useLanguageContext } from '../hooks/useLanguage';
import { Team, Supervisor, ShiftType, Language, Occasion, TranslationSet, DailyShiftAssignment } from '../types'; 
import { TEAMS, SUPERVISORS, FAHLOWY_OCCASIONS, EMPLOYEES_TEAM1, EMPLOYEES_TEAM2, EMPLOYEES_TEAM3, EMPLOYEES_TEAM4, TEAM_VISUALS, MORNING_SHIFT_START, EVENING_SHIFT_START } from '../constants';
import { ThemeContext } from '../contexts/ThemeContext'; 
import { ChevronDownIcon, ChevronUpIcon, CalendarDaysIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/outline'; 
import { ToastContext } from '../contexts/ToastContext'; // UPDATED IMPORT


interface ShiftScheduleViewProps {
  teams: Team[]; 
  supervisors: Supervisor[];
}

interface TeamShiftInfo {
  id: string;
  name: string;
  supervisorName: string;
  memberNames: string[];
  currentShiftType?: ShiftType;
  nextShiftType?: ShiftType;
  daysRemainingOnShift?: number; 
  workBlockEndDate?: Date; 
  daysUntilNextShift?: number; 
  nextShiftStartDate?: Date;
  daysWorkedThisMonth?: number;
  daysLeaveThisMonth?: number;
}


const getDayOfYear = (date: Date): number => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = (date.getTime() - start.getTime()) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay); 
};


const getNextTuesday7AM = (fromDate: Date = new Date()): Date => {
    const date = new Date(fromDate);
    date.setHours(7, 0, 0, 0); 
    let daysToAdd = (2 - date.getDay() + 7) % 7;
    if (daysToAdd === 0 && fromDate.getDay() === 2 && fromDate.getHours() >= 7) {
        daysToAdd = 7;
    }
    date.setDate(date.getDate() + daysToAdd);
    return date;
};


const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const calculateDaysDifference = (dateFuture: Date, datePast: Date): number => {
  const futureUTC = Date.UTC(dateFuture.getFullYear(), dateFuture.getMonth(), dateFuture.getDate());
  const pastUTC = Date.UTC(datePast.getFullYear(), datePast.getMonth(), datePast.getDate());
  return Math.floor((futureUTC - pastUTC) / (1000 * 60 * 60 * 24));
};

const isSameDate = (d1: Date, d2: Date): boolean => 
    d1.getFullYear() === d2.getFullYear() && 
    d1.getMonth() === d2.getMonth() && 
    d1.getDate() === d2.getDate();


export const generateCorrectedYearShiftSchedule = (year: number, teamsInput: Team[], anchorDateForT1T2StartMorning: Date): Record<string, DailyShiftAssignment[]> => {
  const schedule: Record<string, DailyShiftAssignment[]> = {};
  teamsInput.forEach(team => schedule[team.id] = Array(366).fill(null).map(() => ({ teamId: team.id, shiftType: ShiftType.Off })));

  const teamIds = teamsInput.map(t => t.id);
  if (teamIds.length !== 4) {
      console.error("This scheduling logic requires exactly 4 teams.");
      return schedule;
  }

  const teamBaseShiftTypePreference: Record<string, ShiftType.Morning | ShiftType.Evening> = {
      [teamIds[0]]: ShiftType.Morning, 
      [teamIds[1]]: ShiftType.Evening,  
      [teamIds[2]]: ShiftType.Morning, 
      [teamIds[3]]: ShiftType.Evening,  
  };

  const pair1_firstTeam = teamIds[0]; 
  const pair1_secondTeam = teamIds[1]; 
  const pair2_firstTeam = teamIds[2]; 
  const pair2_secondTeam = teamIds[3]; 
  
  for (let dayOffset = 0; dayOffset < (new Date(year, 11, 31).getFullYear() % 4 === 0 && new Date(year, 11, 31).getFullYear() % 100 !== 0 || new Date(year, 11, 31).getFullYear() % 400 === 0 ? 366 : 365) ; dayOffset++) {
      const currentDate = new Date(year, 0, 1);
      currentDate.setDate(currentDate.getDate() + dayOffset);

      teamsInput.forEach(team => {
        let assignedShiftType = ShiftType.Off;
        let teamWorkCycleStartRef: Date;
        let isTeamInPair1 = team.id === pair1_firstTeam || team.id === pair1_secondTeam;

        if (isTeamInPair1) { 
            teamWorkCycleStartRef = anchorDateForT1T2StartMorning;
        } else { 
            teamWorkCycleStartRef = addDays(anchorDateForT1T2StartMorning, 7);
        }
        
        const daysFromTeamPairCycleStart = calculateDaysDifference(currentDate, teamWorkCycleStartRef);
        const cycleDayWithin28DayRotation = (daysFromTeamPairCycleStart % 28 + 28) % 28; 

        if (cycleDayWithin28DayRotation < 7) { 
            const isShiftSwapped = Math.floor(daysFromTeamPairCycleStart / 14) % 2 !== 0;
            let baseShift = teamBaseShiftTypePreference[team.id];
            if (isShiftSwapped) {
                 baseShift = baseShift === ShiftType.Morning ? ShiftType.Evening : ShiftType.Morning;
            }
            
            if (team.id === pair1_firstTeam || team.id === pair2_firstTeam) { 
                assignedShiftType = baseShift;
            } else { 
                assignedShiftType = baseShift === ShiftType.Morning ? ShiftType.Evening : ShiftType.Morning;
            }

        } else if (cycleDayWithin28DayRotation >= 7 && cycleDayWithin28DayRotation < 14) { 
            assignedShiftType = ShiftType.Off;
        } else if (cycleDayWithin28DayRotation >= 14 && cycleDayWithin28DayRotation < 21) { 
            let baseShift = teamBaseShiftTypePreference[team.id];
            baseShift = baseShift === ShiftType.Morning ? ShiftType.Evening : ShiftType.Morning;
             const isShiftSwapped = Math.floor(daysFromTeamPairCycleStart / 14) % 2 !== 0; 
             if (isShiftSwapped) { 
                baseShift = baseShift === ShiftType.Morning ? ShiftType.Evening : ShiftType.Morning;
             }

            if (team.id === pair1_firstTeam || team.id === pair2_firstTeam) {
                assignedShiftType = baseShift;
            } else {
                assignedShiftType = baseShift === ShiftType.Morning ? ShiftType.Evening : ShiftType.Morning;
            }
        } else { 
             assignedShiftType = ShiftType.Off;
        }
        
        const dayOfYearIndex = getDayOfYear(currentDate) -1; 
        if (dayOfYearIndex >= 0 && dayOfYearIndex < schedule[team.id].length) {
           schedule[team.id][dayOfYearIndex] = { teamId: team.id, shiftType: assignedShiftType };
        }
      });
  }
  return schedule;
};


const ShiftCalendar: React.FC<{
  displayMonthDate: Date;
  yearSchedule: Record<string, DailyShiftAssignment[]>;
  occasions: Occasion[];
}> = ({ displayMonthDate, yearSchedule, occasions }) => {
    const { t, language } = useLanguageContext();
    const { theme } = React.useContext(ThemeContext);

    const year = displayMonthDate.getFullYear();
    const month = displayMonthDate.getMonth(); 

    const daysInMonthCount = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay(); 

    const dayNames = useMemo(() => {
      const formatter = new Intl.DateTimeFormat(language, { weekday: 'short' });
      return Array.from({ length: 7 }, (_, i) => {
          const date = new Date(2023, 0, 1 + i); 
          return formatter.format(date);
      });
    }, [language]);

    const calendarCells: JSX.Element[] = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarCells.push(<div key={`empty-${i}`} className="border border-transparent p-1"></div>);
    }

    for (let day = 1; day <= daysInMonthCount; day++) {
        const currentDate = new Date(year, month, day);
        const dayOfYear = getDayOfYear(currentDate);
        
        const dailyOccasions = occasions.filter(occ => {
            const [occMonth, occDay] = occ.date.split('-').map(Number);
            return occMonth - 1 === month && occDay === day;
        });

        const teamsOnShiftMorning: string[] = [];
        const teamsOnShiftEvening: string[] = [];
        
        TEAMS.forEach(team => { 
            const shiftAssignment = yearSchedule[team.id]?.[dayOfYear - 1];
            if (shiftAssignment) {
                if (shiftAssignment.shiftType === ShiftType.Morning) {
                    teamsOnShiftMorning.push(TEAM_VISUALS[team.id]?.symbol || team.id.slice(-1));
                } else if (shiftAssignment.shiftType === ShiftType.Evening) {
                    teamsOnShiftEvening.push(TEAM_VISUALS[team.id]?.symbol || team.id.slice(-1));
                }
            }
        });
        
        const cellBg = theme === 'dark' ? 'bg-gray-700/50 hover:bg-gray-600/50' : 'bg-white hover:bg-gray-50';
        const todayBg = isSameDate(currentDate, new Date()) ? (theme === 'dark' ? 'bg-blue-700' : 'bg-blue-200') : '';
        const textColor = theme === 'dark' ? 'text-gray-200' : 'text-gray-800';

        calendarCells.push(
            <div key={`day-${day}`} className={`border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'} p-1.5 text-xs h-24 flex flex-col justify-between ${cellBg} ${todayBg} transition-colors`}>
                <span className={`font-medium ${textColor}`}>{day}</span>
                <div className="mt-auto text-center overflow-hidden">
                    {dailyOccasions.map(occ => (
                         <div key={occ.nameKey} className={`px-1 py-0.5 rounded-full text-[9px] font-semibold mb-0.5 truncate ${occ.color || (theme === 'dark' ? 'bg-pink-700 text-pink-100' : 'bg-pink-100 text-pink-700')}`} title={t(occ.nameKey)}>
                            {occ.icon} {t(occ.nameKey).substring(0,12)}
                        </div>
                    ))}
                    {teamsOnShiftMorning.length > 0 && <div className="text-[9px] text-yellow-500 truncate" title={t('morningShift') + ": " + teamsOnShiftMorning.join(', ')}>{teamsOnShiftMorning.join(' ')}☀️</div>}
                    {teamsOnShiftEvening.length > 0 && <div className="text-[9px] text-indigo-400 truncate" title={t('eveningShift') + ": " + teamsOnShiftEvening.join(', ')}>{teamsOnShiftEvening.join(' ')}🌙</div>}
                </div>
            </div>
        );
    }

    return (
         <div className="grid grid-cols-7 gap-px">
            {dayNames.map(name => (
                <div key={name} className={`text-center py-2 text-xs font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{name}</div>
            ))}
            {calendarCells}
        </div>
    );
};

const ShiftScheduleView: React.FC<ShiftScheduleViewProps> = ({ teams: propTeams, supervisors: propSupervisors }) => {
  const { t, language } = useLanguageContext();
  const { theme } = React.useContext(ThemeContext);
  const { addToast } = React.useContext(ToastContext);
  const [expandedTeamId, setExpandedTeamId] = useState<string | null>(null);
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());
  
  const anchorDateForT1T2Start = useMemo(() => getNextTuesday7AM(new Date()), []); 

  const yearlySchedule = useMemo(() => {
    return generateCorrectedYearShiftSchedule(currentMonthDate.getFullYear(), TEAMS, anchorDateForT1T2Start); 
  }, [currentMonthDate, anchorDateForT1T2Start]);

  const teamShiftInfos = useMemo(() => {
    const today = new Date();
    today.setHours(0,0,0,0); 

    return TEAMS.map(team => { 
      const supervisor = SUPERVISORS.find(s => s.id === team.supervisorId); 
      let members: string[] = [];
      if (team.id === 'team1') members = EMPLOYEES_TEAM1.map(e => e.name);
      else if (team.id === 'team2') members = EMPLOYEES_TEAM2.map(e => e.name);
      else if (team.id === 'team3') members = EMPLOYEES_TEAM3.map(e => e.name);
      else if (team.id === 'team4') members = EMPLOYEES_TEAM4.map(e => e.name);

      const teamScheduleForYear = yearlySchedule[team.id];
      const currentDayOfYearIndex = getDayOfYear(today) -1; 

      let currentShiftType: ShiftType | undefined = undefined;
      let nextShiftType: ShiftType | undefined = undefined;
      let workBlockEndDate: Date | undefined = undefined;
      let nextShiftStartDate: Date | undefined = undefined;
      let daysRemainingOnShift: number | undefined = undefined;
      let daysUntilNextShift: number | undefined = undefined;
      
      if (teamScheduleForYear && teamScheduleForYear[currentDayOfYearIndex]) {
        currentShiftType = teamScheduleForYear[currentDayOfYearIndex].shiftType;

        if (currentShiftType !== ShiftType.Off) {
          let endOffset = currentDayOfYearIndex;
          while (endOffset < teamScheduleForYear.length && teamScheduleForYear[endOffset].shiftType === currentShiftType) {
            endOffset++;
          }
          workBlockEndDate = addDays(today, endOffset - 1 - currentDayOfYearIndex); 
          daysRemainingOnShift = calculateDaysDifference(workBlockEndDate, today) + 1; 

          let nextBlockStartOffset = endOffset;
           while (nextBlockStartOffset < teamScheduleForYear.length && teamScheduleForYear[nextBlockStartOffset].shiftType === ShiftType.Off) {
               nextBlockStartOffset++;
           }
           if (nextBlockStartOffset < teamScheduleForYear.length) {
               nextShiftStartDate = addDays(today, nextBlockStartOffset - currentDayOfYearIndex);
               nextShiftType = teamScheduleForYear[nextBlockStartOffset].shiftType;
           }
        } else { 
          let startNextShiftOffset = currentDayOfYearIndex;
          while (startNextShiftOffset < teamScheduleForYear.length && teamScheduleForYear[startNextShiftOffset].shiftType === ShiftType.Off) {
            startNextShiftOffset++;
          }
          if (startNextShiftOffset < teamScheduleForYear.length) {
            nextShiftStartDate = addDays(today, startNextShiftOffset - currentDayOfYearIndex);
            nextShiftType = teamScheduleForYear[startNextShiftOffset].shiftType;
            daysUntilNextShift = calculateDaysDifference(nextShiftStartDate, today);
          }
        }
      }
      
      let daysWorkedThisMonth = 0;
      let daysLeaveThisMonth = 0;
      const currentMonth = today.getMonth();
      const currentYearNum = today.getFullYear();
      const daysInCurrentMonth = new Date(currentYearNum, currentMonth + 1, 0).getDate();

      for (let day = 1; day <= daysInCurrentMonth; day++) {
          const dateInMonth = new Date(currentYearNum, currentMonth, day);
          const dayOfYearForMonthDayIndex = getDayOfYear(dateInMonth) - 1;
          if (teamScheduleForYear && teamScheduleForYear[dayOfYearForMonthDayIndex]) {
              if (teamScheduleForYear[dayOfYearForMonthDayIndex].shiftType !== ShiftType.Off) {
                  daysWorkedThisMonth++;
              } else {
                  daysLeaveThisMonth++;
              }
          }
      }

      return {
        id: team.id,
        name: team.name,
        supervisorName: supervisor?.name || t('N_A'),
        memberNames: members,
        currentShiftType,
        nextShiftType,
        daysRemainingOnShift,
        workBlockEndDate,
        daysUntilNextShift,
        nextShiftStartDate,
        daysWorkedThisMonth,
        daysLeaveThisMonth,
      };
    });
  }, [yearlySchedule, currentMonthDate.getFullYear(), language, t, anchorDateForT1T2Start]);
>>>>>>> bee2d85 (updated)

  const toggleTeamDetails = (teamId: string) => {
    setExpandedTeamId(expandedTeamId === teamId ? null : teamId);
  };
  
<<<<<<< HEAD
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
=======
  const changeMonth = (direction: 'prev' | 'next') => {
    setCurrentMonthDate(prev => {
        const newDate = new Date(prev);
        newDate.setDate(1); 
        newDate.setMonth(prev.getMonth() + (direction === 'prev' ? -1 : 1));
        return newDate;
    });
  };

  const handleRequestShiftSwap = (teamName: string) => {
    addToast(language === 'ar' ? `طلب تبديل وردية لفريق ${teamName} (تجريبي). سيتم إخطار المشرف.` : `Shift swap request for team ${teamName} (Demo). Supervisor will be notified.`, 'info');
  };

  const pageTitleColor = theme === 'dark' ? 'text-accent-orange' : 'text-accent-orange';
  const cardBg = theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const textColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
  const secondaryTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  
  const getShiftTypeColor = (shiftType?: ShiftType) => {
    if (!shiftType) return theme === 'dark' ? 'text-gray-500' : 'text-gray-400';
    switch (shiftType) {
        case ShiftType.Morning: return theme === 'dark' ? 'text-green-400' : 'text-green-600';
        case ShiftType.Evening: return theme === 'dark' ? 'text-blue-400' : 'text-blue-600';
        case ShiftType.Off: return theme === 'dark' ? 'text-red-400' : 'text-red-500';
        default: return textColor;
    }
  };

  return (
    <div className={`p-2 md:p-4 animate-fadeInUp ${language === 'ar' ? 'font-cairo' : 'font-poppins'}`}>
      <h1 className={`text-2xl md:text-3xl font-bold mb-6 text-center ${pageTitleColor}`}>
        {t('shiftSchedule')}
      </h1>
      
      <div className={`p-3 md:p-4 rounded-xl shadow-xl mb-6 ${cardBg} border`}>
        <div className="flex justify-between items-center mb-4 px-2">
            <button onClick={() => changeMonth('prev')} className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`} aria-label={t('previousMonth')}>&lt;</button>
            <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>{currentMonthDate.toLocaleString(language, { month: 'long', year: 'numeric' })}</h2>
            <button onClick={() => changeMonth('next')} className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`} aria-label={t('nextMonth')}>&gt;</button>
        </div>
        <ShiftCalendar displayMonthDate={currentMonthDate} yearSchedule={yearlySchedule} occasions={FAHLOWY_OCCASIONS}/>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {teamShiftInfos.map(info => (
          <div key={info.id} className={`p-4 md:p-5 rounded-xl shadow-xl ${cardBg} border-l-4 ${TEAM_VISUALS[info.id]?.borderColorLight || 'border-gray-300'} dark:${TEAM_VISUALS[info.id]?.borderColorDark || 'border-gray-600'}`}>
            <div className="flex justify-between items-center mb-3">
              <h2 className={`text-md font-semibold flex items-center ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                <span className="text-xl mr-2 rtl:ml-2">{TEAM_VISUALS[info.id]?.symbol || '👥'}</span>
                {info.name}
              </h2>
              <button onClick={() => toggleTeamDetails(info.id)} className={`p-1.5 rounded-md ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`} aria-expanded={expandedTeamId === info.id} aria-controls={`team-details-${info.id}`}>
                {expandedTeamId === info.id ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
              </button>
            </div>
            
            <div className={`text-sm space-y-1.5 ${textColor}`}>
                <p><strong>{t('supervisor')}:</strong> {info.supervisorName}</p>
                <p>
                    <strong>{t('currentShift')}:</strong> 
                    <span className={`font-medium ml-1 rtl:mr-1 ${getShiftTypeColor(info.currentShiftType)}`}>
                        {info.currentShiftType ? t((info.currentShiftType.toLowerCase() + 'Shift') as keyof TranslationSet, info.currentShiftType) : t('N_A')}
                    </span>
                </p>
                {info.currentShiftType !== ShiftType.Off && info.daysRemainingOnShift !== undefined && info.workBlockEndDate && (
                     <p className={`text-xs ${secondaryTextColor}`}>{t('shiftWillEndAfter', {days: info.daysRemainingOnShift, daysUnit: info.daysRemainingOnShift === 1 ? (language === Language.AR ? 'يوم' : 'day') : t('daysUnit'), date: info.workBlockEndDate.toLocaleDateString(language, { year: 'numeric', month: 'long', day: 'numeric'})} as any)}</p>
                )}
                 {info.currentShiftType === ShiftType.Off && info.daysUntilNextShift !== undefined && info.nextShiftStartDate && (
                     <p className={`text-xs ${secondaryTextColor}`}>{t('shiftWillStartAfter', {days: info.daysUntilNextShift, daysUnit: info.daysUntilNextShift === 1 ? (language === Language.AR ? 'يوم' : 'day') : t('daysUnit'), date: info.nextShiftStartDate.toLocaleDateString(language, { year: 'numeric', month: 'long', day: 'numeric'})} as any)}</p>
                )}
            </div>

            {expandedTeamId === info.id && (
              <div id={`team-details-${info.id}`} className={`mt-4 pt-3 border-t text-xs space-y-1 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} ${secondaryTextColor}`}>
                <p><strong>{t('members', { count: info.memberNames.length } as any)}:</strong> {info.memberNames.join(', ') || t('N_A')}</p>
                <p><strong>{t('daysWorkedThisMonth')}:</strong> {info.daysWorkedThisMonth ?? t('N_A')}</p>
                <p><strong>{t('daysLeaveThisMonth')}:</strong> {info.daysLeaveThisMonth ?? t('N_A')}</p>
                {info.nextShiftStartDate && info.nextShiftType && (
                     <p><strong>{t('nextShiftStarts')}:</strong> {info.nextShiftStartDate.toLocaleDateString(language, { year: 'numeric', month: 'long', day: 'numeric'})} (<span className={getShiftTypeColor(info.nextShiftType)}>{t((info.nextShiftType.toLowerCase() + 'Shift') as keyof TranslationSet, info.nextShiftType)}</span>)</p>
                )}
                <button 
                    onClick={() => handleRequestShiftSwap(info.name)}
                    className={`mt-2 w-full py-1.5 px-3 rounded-md text-xs font-medium flex items-center justify-center gap-1.5 transition-colors
                    ${theme === 'dark' ? 'bg-purple-600 hover:bg-purple-500 text-white' : 'bg-purple-500 hover:bg-purple-600 text-white'}`}
                >
                    <ArrowsRightLeftIcon className="h-3.5 w-3.5"/>
                    {language === 'ar' ? 'طلب تبديل وردية (تجريبي)' : 'Request Shift Swap (Demo)'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      <p className={`mt-8 text-xs text-center ${secondaryTextColor}`}>
        {language === 'ar' ? 'جداول الورديات دي كنز يا فهلوي، استخدمها بحكمة!' : 'These shift schedules are a treasure, Fahlawy, use them wisely!'}
>>>>>>> bee2d85 (updated)
      </p>
    </div>
  );
};

<<<<<<< HEAD
export default ShiftScheduleView;
=======
export default ShiftScheduleView;
>>>>>>> bee2d85 (updated)
