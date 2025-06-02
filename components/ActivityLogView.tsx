import React from 'react';
import { useLanguageContext } from '../hooks/useLanguage';
import { useActivityLog } from '../hooks/useActivityLog';
import { ThemeContext } from '../contexts/ThemeContext';
import { ActivityLogEntry, ActivityLogType } from '../types';
import {
  PlusCircleIcon, CheckCircleIcon, XCircleIcon, TrashIcon, CalendarDaysIcon, Cog6ToothIcon, UserCircleIcon,
  ArrowRightOnRectangleIcon, ArrowLeftOnRectangleIcon, CalculatorIcon, ChatBubbleOvalLeftEllipsisIcon, LightBulbIcon
} from '@heroicons/react/24/outline';

const ActivityIcon: React.FC<{ type: ActivityLogType, className?: string }> = ({ type, className = "h-5 w-5" }) => {
  switch (type) {
    case ActivityLogType.TaskAdded: return <PlusCircleIcon className={className} />;
    case ActivityLogType.TaskCompleted: return <CheckCircleIcon className={`${className} text-green-500`} />;
    case ActivityLogType.TaskUncompleted: return <XCircleIcon className={`${className} text-yellow-500`} />;
    case ActivityLogType.TaskDeleted: return <TrashIcon className={`${className} text-red-500`} />;
    case ActivityLogType.LeaveRequested: return <CalendarDaysIcon className={className} />;
    case ActivityLogType.SettingsChanged: return <Cog6ToothIcon className={className} />;
    case ActivityLogType.ProfileUpdated: return <UserCircleIcon className={className} />;
    case ActivityLogType.LoggedIn: return <ArrowRightOnRectangleIcon className={className} />;
    case ActivityLogType.LoggedOut: return <ArrowLeftOnRectangleIcon className={className} />;
    case ActivityLogType.CalculatorUsed: return <CalculatorIcon className={className} />;
    default: return <LightBulbIcon className={className} />; // Generic icon
  }
};

const ActivityLogView: React.FC = () => {
  const { t, language } = useLanguageContext();
  const { theme } = React.useContext(ThemeContext);
  const { activityLogEntries } = useActivityLog();

  const pageTitleColor = theme === 'dark' ? 'text-orange-400' : 'text-orange-500';
  const cardBg = theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const textColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
  const timestampColor = theme === 'dark' ? 'text-gray-500' : 'text-gray-400';
  const userNameColor = theme === 'dark' ? 'text-blue-400' : 'text-blue-600';

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(language === 'ar' ? 'ar-EG-u-nu-latn' : 'en-GB', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
    }).format(date);
  };

  return (
    <div className={`p-2 md:p-4 animate-fadeInUp ${language === 'ar' ? 'font-cairo text-right' : 'font-poppins text-left'}`}>
      <h1 className={`text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center ${pageTitleColor}`}>
        {t('viewName_activityLog')}
      </h1>

      <div className={`rounded-xl shadow-xl ${cardBg} border`}>
        {activityLogEntries.length === 0 ? (
          <div className="p-8 text-center">
            <ChatBubbleOvalLeftEllipsisIcon className={`h-16 w-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
            <p className={`text-lg ${textColor}`}>{t('activityLogNoEntries')}</p>
            <p className={`text-xs mt-1 ${timestampColor}`}>
              {language === 'ar' ? 'شكلك لسه مبدأتش الفهلوة، ابدأ اعمل حاجة عشان نسجلهالك هنا!' : 'Looks like you haven\'t started the Fahlawa yet. Do something so we can log it!'}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[calc(100vh-250px)] overflow-y-auto">
            {activityLogEntries.map((entry) => (
              <li key={entry.id} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-start space-x-3 rtl:space-x-reverse">
                  <div className={`flex-shrink-0 mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    <ActivityIcon type={entry.type} className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${textColor}`}>
                      <strong className={`${userNameColor}`}>{entry.userName || (language === 'ar' ? 'مستخدم فهلوي' : 'Fahlawy User')}</strong>:{' '}
                      {t(entry.descriptionKey, entry.details as any)}
                    </p>
                    <p className={`text-xs ${timestampColor} mt-0.5`}>
                      {formatDate(entry.timestamp)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
        {activityLogEntries.length > 0 && (
             <div className={`p-3 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} text-center text-xs ${timestampColor}`}>
                {language === 'ar' ? 'نهاية التقرير يا ريس! كل حركاتك متسجلة بالمللي.' : 'End of report, ya Rayes! All your moves are recorded precisely.'}
             </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLogView;
