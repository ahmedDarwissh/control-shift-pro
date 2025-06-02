
import React, { useState, useEffect, useContext } from 'react';
import { useLanguageContext } from '../hooks/useLanguage';
import { ThemeContext } from '../contexts/ThemeContext';
import { PrayerName, TranslationSet } from '../types'; // Assuming PrayerName and TranslationSet are correctly defined
import { SunIcon, MoonIcon, ClockIcon } from '@heroicons/react/24/outline';

interface PrayerTime {
  name: PrayerName;
  time: string; // HH:mm format
  displayNameKey: keyof TranslationSet;
  icon?: React.ElementType;
}

const mockPrayerTimesData: PrayerTime[] = [
  { name: PrayerName.FajrPrayer, time: '04:30', displayNameKey: 'prayerTimeFajr', icon: MoonIcon },
  { name: PrayerName.DhuhrPrayer, time: '12:05', displayNameKey: 'prayerTimeDhuhr', icon: SunIcon },
  { name: PrayerName.AsrPrayer, time: '15:40', displayNameKey: 'prayerTimeAsr', icon: SunIcon },
  { name: PrayerName.MaghribPrayer, time: '18:58', displayNameKey: 'prayerTimeMaghrib', icon: MoonIcon },
  { name: PrayerName.IshaPrayer, time: '20:25', displayNameKey: 'prayerTimeIsha', icon: MoonIcon },
];

const PrayerTimesWidget: React.FC = () => {
  const { t, language } = useLanguageContext();
  const { theme } = useContext(ThemeContext);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  const todayDateStr = currentTime.toISOString().split('T')[0];

  const prayerTimesWithDateTime = mockPrayerTimesData.map(pt => {
    const [hours, minutes] = pt.time.split(':');
    const prayerDateTime = new Date(todayDateStr);
    prayerDateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    return { ...pt, dateTime: prayerDateTime };
  });
  
  const upcomingPrayers = prayerTimesWithDateTime
    .filter(pt => pt.dateTime > currentTime)
    .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());

  const nextPrayer = upcomingPrayers[0] || null;
  let timeRemainingStr = t('prayerTimeAllPrayersDone');

  if (nextPrayer) {
    const diffMs = nextPrayer.dateTime.getTime() - currentTime.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);
    timeRemainingStr = `${String(diffHours).padStart(2, '0')}:${String(diffMinutes).padStart(2, '0')}:${String(diffSeconds).padStart(2, '0')}`;
  }

  const cardBg = theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const titleColor = theme === 'dark' ? 'text-bright-yellow' : 'text-marine-blue';
  const textColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
  const timeColor = theme === 'dark' ? 'text-orange-400' : 'text-orange-500';
  const highlightColor = theme === 'dark' ? 'text-green-400' : 'text-green-600';

  return (
    <div className={`p-4 md:p-5 rounded-xl shadow-xl ${cardBg} border`}>
      <h3 className={`text-md font-semibold mb-3 text-center ${titleColor}`}>
        {t('prayerTimesWidgetTitle')}
      </h3>
      <ul className="space-y-1.5 text-sm">
        {prayerTimesWithDateTime.map(prayer => {
          const isNext = nextPrayer && nextPrayer.name === prayer.name;
          const hasPassed = prayer.dateTime < currentTime && !isNext; // Check if passed and not the current next prayer
          const PrayerIcon = prayer.icon || ClockIcon;
          return (
            <li
              key={prayer.name}
              className={`flex justify-between items-center p-2 rounded-md transition-all
                ${isNext ? (theme === 'dark' ? 'bg-green-700/30 ring-1 ring-green-500' : 'bg-green-100 ring-1 ring-green-300') : (theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50')}
                ${hasPassed ? 'opacity-50' : ''}
              `}
            >
              <div className="flex items-center">
                <PrayerIcon className={`h-4 w-4 mr-2 rtl:ml-2 ${isNext ? highlightColor : (theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}`} />
                <span className={`${textColor} ${isNext ? `font-bold ${highlightColor}` : ''}`}>
                  {t(prayer.displayNameKey)}
                </span>
              </div>
              <span className={`${timeColor} ${isNext ? `font-bold ${highlightColor}` : ''} ${language === 'ar' ? 'font-sans' : ''}`}>
                {new Date(prayer.dateTime).toLocaleTimeString(language, { hour: '2-digit', minute: '2-digit', hour12: true })}
              </span>
            </li>
          );
        })}
      </ul>
      {nextPrayer && (
        <div className={`mt-3 pt-3 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} text-center`}>
          <p className={`text-xs font-medium ${textColor}`}>{t('prayerTimeNextPrayer')}: <span className={highlightColor}>{t(nextPrayer.displayNameKey)}</span></p>
          <p className={`text-lg font-bold ${timeColor}`}>{timeRemainingStr}</p>
        </div>
      )}
      {!nextPrayer && prayerTimesWithDateTime.length > 0 && (
        <div className={`mt-3 pt-3 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} text-center`}>
          <p className={`text-sm ${highlightColor}`}>{timeRemainingStr}</p>
        </div>
      )}
      {prayerTimesWithDateTime.length === 0 && (
         <p className={`text-sm text-center italic ${textColor}`}>{t('prayerTimeUnableToLoad')}</p>
      )}
    </div>
  );
};

export default PrayerTimesWidget;
