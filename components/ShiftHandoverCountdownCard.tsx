
import React, { useState, useEffect, useRef } from 'react';
import { useLanguageContext } from '../hooks/useLanguage';
import { ThemeContext } from '../contexts/ThemeContext';
import { playFahlawySound } from '../utils/sounds'; // UPDATED IMPORT
import { Language } from '../types';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const getNextHandoverTime = (): Date => {
  const now = new Date();
  const nextHandover = new Date(now);
  
  // Set to next Tuesday 7:00 AM
  // Day 0 is Sunday, 1 is Monday, 2 is Tuesday
  const currentDay = now.getDay();
  let daysUntilNextTuesday = (2 - currentDay + 7) % 7;

  if (daysUntilNextTuesday === 0 && (now.getHours() >= 7 || (currentDay !== 2))) { 
    // If it's Tuesday 7 AM or later, or if today isn't Tuesday but daysUntilNextTuesday calculation resulted in 0 (meaning it was last Tuesday)
    daysUntilNextTuesday = 7;
  }
  
  nextHandover.setDate(now.getDate() + daysUntilNextTuesday);
  nextHandover.setHours(7, 0, 0, 0); 

  return nextHandover;
};


const calculateTimeLeft = (targetDate: Date): TimeLeft => {
  const difference = +targetDate - +new Date();
  let timeLeft: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }
  return timeLeft;
};

const CountdownSegment: React.FC<{ value: number; label: string }> = ({ value, label }) => {
  const { theme } = React.useContext(ThemeContext);
  const digitColor = 'var(--countdown-digit-text)'; // Defined in global CSS
  const labelColor = 'var(--countdown-label-text)'; // Defined in global CSS
  
  const [displayValue, setDisplayValue] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (value !== displayValue) {
      setIsFlipping(true);
      const timer = setTimeout(() => {
        setDisplayValue(value);
        setIsFlipping(false);
      }, 300); // Corresponds to half of the digit-pop animation duration
      return () => clearTimeout(timer);
    }
  }, [value, displayValue]);


  return (
    <div className="countdown-segment">
      <span className={`countdown-digit ${isFlipping ? 'animate-digit-pop' : ''}`} style={{color: digitColor}}>{String(displayValue).padStart(2, '0')}</span>
      <span className={`countdown-label`} style={{color: labelColor}}>{label}</span>
    </div>
  );
};

const ShiftHandoverCountdownCard: React.FC = () => {
  const { t, language } = useLanguageContext();
  const { theme } = React.useContext(ThemeContext);
  const [targetDate, setTargetDate] = useState(getNextHandoverTime());
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(targetDate));
  const soundPlayedForThisMinuteRef = useRef<number>(-1);


  useEffect(() => {
    const timer = window.setTimeout(() => {
      const newTimeLeft = calculateTimeLeft(targetDate);
      setTimeLeft(newTimeLeft);

      if (newTimeLeft.days === 0 && newTimeLeft.hours === 0 && newTimeLeft.minutes === 0 && newTimeLeft.seconds === 0) {
        playFahlawySound('countdownEnd');
        // Set to next occurrence after countdown ends
        const nextOccurrence = getNextHandoverTime();
        // Ensure it's actually in the future if the calculation lands on the current time
        if (nextOccurrence <= new Date()) {
            nextOccurrence.setDate(nextOccurrence.getDate() + 7); // Add 7 days if it calculated to "now"
        }
        setTargetDate(nextOccurrence); 
      } else {
        // Play tick sound less frequently to avoid annoyance
        if (newTimeLeft.seconds % 15 === 0 && newTimeLeft.minutes !== soundPlayedForThisMinuteRef.current) { 
             playFahlawySound('countdownTick');
             soundPlayedForThisMinuteRef.current = newTimeLeft.minutes; // Avoid playing multiple times in the same minute
        }
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, targetDate]); 

  const cardBg = theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const titleColor = theme === 'dark' ? 'text-bright-yellow' : 'text-marine-blue';
  
  return (
    <div className={`p-4 md:p-5 rounded-xl shadow-xl ${cardBg} border animate-timer-pulse`}>
      <h3 className={`text-md font-semibold mb-3 text-center ${titleColor}`}>
        {t('shiftHandoverCountdown')}
      </h3>
      <div className="countdown-timer-grid">
        <CountdownSegment value={timeLeft.days} label={t('daysUnit')} />
        <CountdownSegment value={timeLeft.hours} label={t('hoursUnit')} />
        <CountdownSegment value={timeLeft.minutes} label={t('minutesUnit')} />
        <CountdownSegment value={timeLeft.seconds} label={t('secondsUnit')} />
      </div>
       <p className={`text-xs text-center mt-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
        {language === Language.AR ? `التسليم القادم يوم ${targetDate.toLocaleDateString('ar-EG-u-nu-latn', { weekday: 'long', timeZone: 'Africa/Cairo'})} الساعة ٧ صباحاً بتوقيت الفهلوة المحلي.` : `Next handover: ${targetDate.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'Africa/Cairo'})} at 7:00 AM local Fahlawa time.`}
      </p>
    </div>
  );
};

export default ShiftHandoverCountdownCard;
