
import React, { useState, FormEvent, useContext } from 'react';
import { useLanguageContext } from '../../hooks/useLanguage';
import { LoggedInUser, TranslationSet, PersonalActivityLog, PersonalActivityType, PersonalWeightLog, PersonalCalorieLog, MealType, PersonalWaterLog, PersonalSleepLog, SleepQuality, PersonalMedicationReminder, MedicationDosageUnit, PersonalBPLog, PersonalSugarLog, SugarUnit, SugarMeasurementType, PersonalExercisePlan, ExerciseDetail, DayOfWeek, MealComponent, PersonalMealLog } from '../../types';
import { ThemeContext } from '../../contexts/ThemeContext'; 
import { ToastContext } from '../../contexts/ToastContext';
import { SubSectionCard } from './common/HubComponents';
import { TrashIcon, PencilIcon, PlusCircleIcon, HeartIcon, BoltIcon, MoonIcon, BeakerIcon, ClipboardDocumentCheckIcon, PresentationChartLineIcon, SparklesIcon, FireIcon, CubeIcon, UserGroupIcon, AdjustmentsHorizontalIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';


interface HealthFitnessSectionProps {
  loggedInUser: LoggedInUser | null;
  showConfirmDelete: (titleKey: keyof TranslationSet, messageKey: keyof TranslationSet, onConfirmAction: () => void) => void;
}

export const HealthFitnessSection: React.FC<HealthFitnessSectionProps> = ({ loggedInUser, showConfirmDelete }) => {
  const { t, language } = useLanguageContext();
  const { theme } = useContext(ThemeContext);
  const { addToast } = useContext(ToastContext);
  
  const [openSubSections, setOpenSubSections] = useState<Record<string, boolean>>({
    activityLog: true, weightLog: false, calorieLog: false, waterLog: false, sleepLog: false, medicationReminders: false, vitalSignsLog: false, exercisePlans: false, mealLog: false, healthReports: false,
  });
  const toggleSubSection = (key: string) => setOpenSubSections(prev => ({ ...prev, [key]: !prev[key] }));

  const getCurrentDate = () => new Date().toISOString().split('T')[0];
  const getCurrentTime = () => new Date().toTimeString().split(' ')[0].substring(0,5);

  const [activityType, setActivityType] = useState<PersonalActivityType>(PersonalActivityType.WalkingActivity);
  const [activityDuration, setActivityDuration] = useState('');
  const [activityDate, setActivityDate] = useState(getCurrentDate());
  const activityTypeOptions = Object.values(PersonalActivityType);
  const [activities, setActivities] = useState<PersonalActivityLog[]>([]);

  const [weightKg, setWeightKg] = useState('');
  const [weightDate, setWeightDate] = useState(getCurrentDate());
  const [weights, setWeights] = useState<PersonalWeightLog[]>([]);

  const [calorieMealType, setCalorieMealType] = useState<MealType>(MealType.BreakfastMeal);
  const [calorieFoodItem, setCalorieFoodItem] = useState('');
  const [calorieKcal, setCalorieKcal] = useState('');
  const [calorieDate, setCalorieDate] = useState(getCurrentDate());
  const [calories, setCalories] = useState<PersonalCalorieLog[]>([]);
  const mealTypeOptions = Object.values(MealType);

  const [waterAmountMl, setWaterAmountMl] = useState('');
  const [waterDate, setWaterDate] = useState(getCurrentDate());
  const [waterLogs, setWaterLogs] = useState<PersonalWaterLog[]>([]);

  const [sleepDateWokeUp, setSleepDateWokeUp] = useState(getCurrentDate());
  const [sleepTimeWentToBed, setSleepTimeWentToBed] = useState('22:00');
  const [sleepTimeWokeUp, setSleepTimeWokeUp] = useState('06:00');
  const [sleepQuality, setSleepQuality] = useState<SleepQuality | undefined>(undefined);
  const [sleepLogs, setSleepLogs] = useState<PersonalSleepLog[]>([]);
  const sleepQualityOptions = Object.values(SleepQuality);

  // Medication Reminders State
  const [medReminders, setMedReminders] = useState<PersonalMedicationReminder[]>([]);
  const [medName, setMedName] = useState('');
  const [medDosage, setMedDosage] = useState('');
  const [medDosageUnit, setMedDosageUnit] = useState<MedicationDosageUnit>(MedicationDosageUnit.Pill);
  const [medTimesPerDay, setMedTimesPerDay] = useState('1');
  const [medSpecificTimes, setMedSpecificTimes] = useState<string[]>(['08:00']); // Default to one time
  const [medStartDate, setMedStartDate] = useState(getCurrentDate());
  const medicationDosageUnitOptions = Object.values(MedicationDosageUnit);

  // Vital Signs State
  const [bpLogs, setBpLogs] = useState<PersonalBPLog[]>([]);
  const [bpSystolic, setBpSystolic] = useState('');
  const [bpDiastolic, setBpDiastolic] = useState('');
  const [bpPulse, setBpPulse] = useState('');
  const [bpDate, setBpDate] = useState(getCurrentDate());
  const [bpTime, setBpTime] = useState(getCurrentTime());

  const [sugarLogs, setSugarLogs] = useState<PersonalSugarLog[]>([]);
  const [sugarLevel, setSugarLevel] = useState('');
  const [sugarUnit, setSugarUnit] = useState<SugarUnit>(SugarUnit.MgDlUnit);
  const [sugarMeasurementType, setSugarMeasurementType] = useState<SugarMeasurementType>(SugarMeasurementType.FastingSugar);
  const [sugarDate, setSugarDate] = useState(getCurrentDate());
  const [sugarTime, setSugarTime] = useState(getCurrentTime());
  const sugarUnitOptions = Object.values(SugarUnit);
  const sugarMeasurementTypeOptions = Object.values(SugarMeasurementType);

  // Exercise Plans State
  const [exercisePlans, setExercisePlans] = useState<PersonalExercisePlan[]>([]);
  const [planName, setPlanName] = useState('');
  // Full exercise detail management is complex for this pass.

  // Meal Log State
  const [mealLogs, setMealLogs] = useState<PersonalMealLog[]>([]);
  const [mealLogType, setMealLogType] = useState<MealType>(MealType.BreakfastMeal);
  const [mealLogDate, setMealLogDate] = useState(getCurrentDate());
  const [mealLogComponentsStr, setMealLogComponentsStr] = useState(''); // Simplified: comma-separated components


  // Common UI Elements
  const inputBaseClasses = `w-full p-2.5 border rounded-lg shadow-sm focus:ring-2 text-sm transition-colors`;
  const themedInputClasses = theme === 'dark' ? `bg-gray-700 border-gray-600 text-gray-100 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400` : `bg-white border-gray-300 text-gray-800 focus:ring-blue-600 focus:border-blue-600 placeholder-gray-400`;
  const primaryButtonClasses = `py-2.5 px-5 rounded-lg font-semibold text-sm transition-colors shadow-md hover:shadow-lg transform hover:scale-[1.02] ${theme === 'dark' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`;
  const deleteButtonClasses = `p-1.5 rounded-md text-red-500 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-700/30 transition-colors`;

  const handleSpecificTimeChange = (index: number, value: string) => {
    const newTimes = [...medSpecificTimes];
    newTimes[index] = value;
    setMedSpecificTimes(newTimes);
  };
  const handleTimesPerDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value, 10);
    setMedTimesPerDay(e.target.value);
    if (count > 0 && count <= 10) { // Limit to 10 times for sanity
        setMedSpecificTimes(Array(count).fill(getCurrentTime()));
    } else {
        setMedSpecificTimes([]);
    }
  };

  const handleAddActivity = (e: FormEvent) => {
    e.preventDefault();
    if (!activityDuration || !loggedInUser) return;
    const newActivity: PersonalActivityLog = { id: `act-${Date.now()}`, userId: loggedInUser.id, activityType, durationMinutes: parseInt(activityDuration), date: activityDate, createdAt: new Date() };
    setActivities(p => [newActivity, ...p]);
    addToast(t('healthFitnessSaveActivity') + ' ' + t('statusSuccessMessage'), 'success');
    setActivityDuration(''); setActivityDate(getCurrentDate());
  };
  const handleDeleteActivity = (id: string) => {
    showConfirmDelete('healthFitnessConfirmDeleteActivity', 'healthFitnessConfirmDeleteActivity', () => {
      setActivities(p => p.filter(item => item.id !== id));
      addToast(t('healthFitnessDeleteActivity') + ' ' + t('statusSuccessMessage'), 'info');
    });
  };

  const handleAddWeight = (e: FormEvent) => {
    e.preventDefault();
    if (!weightKg || !loggedInUser) return;
    const newWeight: PersonalWeightLog = { id: `w-${Date.now()}`, userId: loggedInUser.id, weightKg: parseFloat(weightKg), date: weightDate, createdAt: new Date() };
    setWeights(p => [newWeight, ...p]);
    addToast(t('healthFitnessSaveWeight') + ' ' + t('statusSuccessMessage'), 'success');
    setWeightKg(''); setWeightDate(getCurrentDate());
  };
   const handleDeleteWeight = (id: string) => {
    showConfirmDelete('healthFitnessConfirmDeleteWeight', 'healthFitnessConfirmDeleteWeight', () => {
      setWeights(p => p.filter(item => item.id !== id));
      addToast(t('healthFitnessDeleteWeight') + ' ' + t('statusSuccessMessage'), 'info');
    });
  };

  const handleAddCalorieEntry = (e: FormEvent) => {
    e.preventDefault();
    if (!calorieFoodItem.trim() || !calorieKcal.trim() || !loggedInUser) return;
    const newEntry: PersonalCalorieLog = {id: `cal-${Date.now()}`, userId: loggedInUser.id, mealType: calorieMealType, foodItem: calorieFoodItem, caloriesKcal: parseInt(calorieKcal), date: calorieDate, createdAt: new Date() };
    setCalories(p => [newEntry, ...p]);
    addToast(t('healthFitnessSaveCalorieEntry') + ' ' + t('statusSuccessMessage'), 'success');
    setCalorieFoodItem(''); setCalorieKcal(''); setCalorieDate(getCurrentDate());
  };
  const handleDeleteCalorieEntry = (id: string) => {
    showConfirmDelete('healthFitnessConfirmDeleteCalorieEntry', 'healthFitnessConfirmDeleteCalorieEntry', () => {
      setCalories(p => p.filter(item => item.id !== id));
      addToast(t('healthFitnessDeleteCalorieEntry') + ' ' + t('statusSuccessMessage'), 'info');
    });
  };

  const handleAddWaterLog = (e: FormEvent) => {
    e.preventDefault();
    if (!waterAmountMl.trim() || !loggedInUser) return;
    const newLog: PersonalWaterLog = { id: `water-${Date.now()}`, userId: loggedInUser.id, amountMl: parseInt(waterAmountMl), date: waterDate, createdAt: new Date()};
    setWaterLogs(p => [newLog, ...p]);
    addToast(t('healthFitnessSaveWaterEntry') + ' ' + t('statusSuccessMessage'), 'success');
    setWaterAmountMl(''); setWaterDate(getCurrentDate());
  };
  const quickAddWater = (amount: number) => {
    if(!loggedInUser) return;
    const newLog: PersonalWaterLog = { id: `water-${Date.now()}`, userId: loggedInUser.id, amountMl: amount, date: getCurrentDate(), time: getCurrentTime(), createdAt: new Date()};
    setWaterLogs(p => [newLog, ...p]);
    addToast(`${amount}ml ${t('healthFitnessSaveWaterEntry')} ` + t('statusSuccessMessage'), 'success');
  }
  const handleDeleteWaterLog = (id: string) => {
    showConfirmDelete('healthFitnessConfirmDeleteWaterEntry', 'healthFitnessConfirmDeleteWaterEntry', () => {
      setWaterLogs(p => p.filter(item => item.id !== id));
      addToast(t('healthFitnessDeleteWaterEntry') + ' ' + t('statusSuccessMessage'), 'info');
    });
  };

  const handleAddSleepLog = (e: FormEvent) => {
    e.preventDefault();
    if (!sleepTimeWentToBed.trim() || !sleepTimeWokeUp.trim() || !loggedInUser) return;
    const newLog: PersonalSleepLog = { id: `sleep-${Date.now()}`, userId: loggedInUser.id, dateWokeUp: sleepDateWokeUp, timeWentToBed: sleepTimeWentToBed, timeWokeUp: sleepTimeWokeUp, sleepQuality, createdAt: new Date() };
    setSleepLogs(p => [newLog, ...p]);
    addToast(t('healthFitnessSaveSleepEntry') + ' ' + t('statusSuccessMessage'), 'success');
    setSleepDateWokeUp(getCurrentDate()); setSleepQuality(undefined);
  };
  const handleDeleteSleepLog = (id: string) => {
    showConfirmDelete('healthFitnessConfirmDeleteSleepEntry', 'healthFitnessConfirmDeleteSleepEntry', () => {
      setSleepLogs(p => p.filter(item => item.id !== id));
      addToast(t('healthFitnessDeleteSleepEntry') + ' ' + t('statusSuccessMessage'), 'info');
    });
  };
  
  const handleAddMedReminder = (e: FormEvent) => {
    e.preventDefault();
    if (!medName.trim() || !medDosage.trim() || !loggedInUser) return;
    const newReminder: PersonalMedicationReminder = {
        id: `med-${Date.now()}`, userId: loggedInUser.id, medicationName: medName, dosage: medDosage,
        dosageUnit: medDosageUnit, timesPerDay: parseInt(medTimesPerDay) || 1,
        specificTimes: medSpecificTimes.slice(0, parseInt(medTimesPerDay) || 1), // Ensure correct number of times
        startDate: medStartDate, takenLog: {}, createdAt: new Date()
    };
    setMedReminders(p => [newReminder, ...p]);
    addToast(t('healthFitnessSaveMedReminder') + ' ' + t('statusSuccessMessage'), 'success');
    setMedName(''); setMedDosage(''); setMedTimesPerDay('1'); setMedSpecificTimes(['08:00']); setMedStartDate(getCurrentDate());
  };
  const handleDeleteMedReminder = (id: string) => {
    showConfirmDelete('healthFitnessConfirmDeleteMedReminder', 'healthFitnessConfirmDeleteMedReminder', () => {
        setMedReminders(p => p.filter(item => item.id !== id));
        addToast(t('healthFitnessDeleteMedReminder') + ' ' + t('statusSuccessMessage'), 'info');
    });
  };
  const toggleMedTaken = (reminderId: string, timeKey: string) => {
    // This is a simplified mock. A real app would handle dates correctly.
    setMedReminders(prev => prev.map(rem => {
        if (rem.id === reminderId) {
            const updatedTakenLog = {...rem.takenLog, [timeKey]: !rem.takenLog[timeKey]};
            return {...rem, takenLog: updatedTakenLog};
        }
        return rem;
    }));
    addToast(t('healthFitnessMarkAsTaken') + ' / ' + t('healthFitnessMarkAsMissed') + ' ' + t('statusSuccessMessage'), 'success');
  };

  const handleAddBPLog = (e: FormEvent) => {
    e.preventDefault();
    if (!bpSystolic.trim() || !bpDiastolic.trim() || !loggedInUser) return;
    const newLog: PersonalBPLog = {
        id: `bp-${Date.now()}`, userId: loggedInUser.id, systolic: parseInt(bpSystolic), diastolic: parseInt(bpDiastolic),
        pulse: bpPulse ? parseInt(bpPulse) : undefined, date: bpDate, time: bpTime, createdAt: new Date()
    };
    setBpLogs(p => [newLog, ...p]);
    addToast(t('healthFitnessSaveBPLog') + ' ' + t('statusSuccessMessage'), 'success');
    setBpSystolic(''); setBpDiastolic(''); setBpPulse(''); setBpDate(getCurrentDate()); setBpTime(getCurrentTime());
  };
  const handleDeleteBPLog = (id: string) => {
    showConfirmDelete('healthFitnessConfirmDeleteBPLog', 'healthFitnessConfirmDeleteBPLog', () => {
        setBpLogs(p => p.filter(item => item.id !== id));
        addToast(t('healthFitnessDeleteBPLog') + ' ' + t('statusSuccessMessage'), 'info');
    });
  };

  const handleAddSugarLog = (e: FormEvent) => {
    e.preventDefault();
    if (!sugarLevel.trim() || !loggedInUser) return;
    const newLog: PersonalSugarLog = {
        id: `sugar-${Date.now()}`, userId: loggedInUser.id, sugarLevel: parseFloat(sugarLevel),
        unit: sugarUnit, measurementType: sugarMeasurementType, date: sugarDate, time: sugarTime, createdAt: new Date()
    };
    setSugarLogs(p => [newLog, ...p]);
    addToast(t('healthFitnessSaveSugarLog') + ' ' + t('statusSuccessMessage'), 'success');
    setSugarLevel(''); setSugarDate(getCurrentDate()); setSugarTime(getCurrentTime());
  };
  const handleDeleteSugarLog = (id: string) => {
    showConfirmDelete('healthFitnessConfirmDeleteSugarLog', 'healthFitnessConfirmDeleteSugarLog', () => {
        setSugarLogs(p => p.filter(item => item.id !== id));
        addToast(t('healthFitnessDeleteSugarLog') + ' ' + t('statusSuccessMessage'), 'info');
    });
  };

  const handleAddExercisePlan = (e: FormEvent) => {
    e.preventDefault();
    if (!planName.trim() || !loggedInUser) return;
    const newPlan: PersonalExercisePlan = { id: `plan-${Date.now()}`, userId: loggedInUser.id, planName, scheduledDays: [], exercises: [], isActive: false, createdAt: new Date() };
    setExercisePlans(p => [newPlan, ...p]);
    addToast(t('healthFitnessSaveExercisePlan') + ' ' + t('statusSuccessMessage'), 'success');
    setPlanName('');
  };
  const handleDeleteExercisePlan = (id: string) => {
    showConfirmDelete('healthFitnessConfirmDeletePlan', 'healthFitnessConfirmDeletePlan', () => {
      setExercisePlans(p => p.filter(item => item.id !== id));
      addToast(t('healthFitnessDeletePlan') + ' ' + t('statusSuccessMessage'), 'info');
    });
  };

  const handleAddMealLog = (e: FormEvent) => {
    e.preventDefault();
    if (!mealLogComponentsStr.trim() || !loggedInUser) return;
    const components: MealComponent[] = mealLogComponentsStr.split(',').map((compStr, index) => {
        const parts = compStr.trim().split(' ');
        const quantity = parts.pop() || '1'; // last part as quantity
        const name = parts.join(' ').trim() || compStr.trim();
        return { id: `comp-${Date.now()}-${index}`, name, quantity };
    });
    const newLog: PersonalMealLog = { id: `meal-${Date.now()}`, userId: loggedInUser.id, mealType: mealLogType, date: mealLogDate, components, createdAt: new Date() };
    setMealLogs(p => [newLog, ...p]);
    addToast(t('healthFitnessSaveMealLog') + ' ' + t('statusSuccessMessage'), 'success');
    setMealLogComponentsStr(''); setMealLogDate(getCurrentDate());
  };
  const handleDeleteMealLog = (id: string) => {
    showConfirmDelete('healthFitnessConfirmDeleteMealLog', 'healthFitnessConfirmDeleteMealLog', () => {
      setMealLogs(p => p.filter(item => item.id !== id));
      addToast(t('healthFitnessDeleteMealLog') + ' ' + t('statusSuccessMessage'), 'info');
    });
  };


  if (!loggedInUser) return null;

  return (
    <>
      {/* Activity Log */}
      <SubSectionCard titleKey="healthFitnessActivityLog" icon={<BoltIcon/>} isOpen={openSubSections.activityLog} onToggle={() => toggleSubSection('activityLog')}>
        <form onSubmit={handleAddActivity} className="space-y-3 mb-4 p-3 border rounded-md dark:border-gray-600 bg-slate-50 dark:bg-gray-700/50">
            <select value={activityType} onChange={e => setActivityType(e.target.value as PersonalActivityType)} className={`${inputBaseClasses} ${themedInputClasses}`}>
                {activityTypeOptions.map(type => <option key={type} value={type}>{t(`healthFitnessActivityType${type}` as keyof TranslationSet, type)}</option>)}
            </select>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input type="number" value={activityDuration} onChange={e => setActivityDuration(e.target.value)} placeholder={t('healthFitnessDurationMinutes')} className={`${inputBaseClasses} ${themedInputClasses}`} required/>
                <input type="date" value={activityDate} onChange={e => setActivityDate(e.target.value)} className={`${inputBaseClasses} ${themedInputClasses}`} required/>
            </div>
            <button type="submit" className={`${primaryButtonClasses} w-full`}>{t('healthFitnessLogNewActivity')}</button>
        </form>
        {activities.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">{t('healthFitnessNoActivitiesLogged')}</p>}
        <ul className="space-y-1 max-h-60 overflow-y-auto">
          {activities.map(act => (
            <li key={act.id} className="flex justify-between items-center p-2 text-xs rounded bg-white dark:bg-gray-700 shadow-sm">
              <div>{t(`healthFitnessActivityType${act.activityType}` as keyof TranslationSet, act.activityType)} - {act.durationMinutes} {t('healthFitnessDurationMinutesShortUnit')} ({new Date(act.date + 'T00:00:00').toLocaleDateString(language)})</div>
              <button onClick={() => handleDeleteActivity(act.id)} className={deleteButtonClasses}><TrashIcon className="h-4 w-4"/></button>
            </li>
          ))}
        </ul>
      </SubSectionCard>

      {/* Weight Log */}
      <SubSectionCard titleKey="healthFitnessWeightLog" icon={<SparklesIcon/>} isOpen={openSubSections.weightLog} onToggle={() => toggleSubSection('weightLog')}>
        <form onSubmit={handleAddWeight} className="space-y-3 mb-4 p-3 border rounded-md dark:border-gray-600 bg-slate-50 dark:bg-gray-700/50">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input type="number" value={weightKg} onChange={e => setWeightKg(e.target.value)} placeholder={t('healthFitnessWeightKg')} className={`${inputBaseClasses} ${themedInputClasses}`} required step="0.1"/>
                <input type="date" value={weightDate} onChange={e => setWeightDate(e.target.value)} className={`${inputBaseClasses} ${themedInputClasses}`} required/>
            </div>
            <button type="submit" className={`${primaryButtonClasses} w-full`}>{t('healthFitnessLogNewWeight')}</button>
        </form>
        {weights.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">{t('healthFitnessNoWeightLogged')}</p>}
        <ul className="space-y-1 max-h-60 overflow-y-auto">
          {weights.map(w => (
            <li key={w.id} className="flex justify-between items-center p-2 text-xs rounded bg-white dark:bg-gray-700 shadow-sm">
              <div>{w.weightKg.toFixed(1)} {t('healthFitnessUnitKg')} ({new Date(w.date + 'T00:00:00').toLocaleDateString(language)})</div>
              <button onClick={() => handleDeleteWeight(w.id)} className={deleteButtonClasses}><TrashIcon className="h-4 w-4"/></button>
            </li>
          ))}
        </ul>
      </SubSectionCard>
      
      {/* Calorie Log */}
      <SubSectionCard titleKey="healthFitnessCalorieLog" icon={<FireIcon/>} isOpen={openSubSections.calorieLog} onToggle={() => toggleSubSection('calorieLog')}>
        <form onSubmit={handleAddCalorieEntry} className="space-y-3 mb-4 p-3 border rounded-md dark:border-gray-600 bg-slate-50 dark:bg-gray-700/50">
          <select value={calorieMealType} onChange={e => setCalorieMealType(e.target.value as MealType)} className={`${inputBaseClasses} ${themedInputClasses}`}>
            {mealTypeOptions.map(type => <option key={type} value={type}>{t(`healthFitnessMealType${type}` as keyof TranslationSet, type)}</option>)}
          </select>
          <input type="text" value={calorieFoodItem} onChange={e => setCalorieFoodItem(e.target.value)} placeholder={t('healthFitnessFoodItem')} className={`${inputBaseClasses} ${themedInputClasses}`} required />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input type="number" value={calorieKcal} onChange={e => setCalorieKcal(e.target.value)} placeholder={t('healthFitnessCaloriesKcal')} className={`${inputBaseClasses} ${themedInputClasses}`} required />
            <input type="date" value={calorieDate} onChange={e => setCalorieDate(e.target.value)} className={`${inputBaseClasses} ${themedInputClasses}`} required />
          </div>
          <button type="submit" className={`${primaryButtonClasses} w-full`}>{t('healthFitnessLogMealSnack')}</button>
        </form>
        {calories.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">{t('healthFitnessNoCalorieEntries')}</p>}
         <ul className="space-y-1 max-h-60 overflow-y-auto">
          {calories.map(cal => (
            <li key={cal.id} className="flex justify-between items-center p-2 text-xs rounded bg-white dark:bg-gray-700 shadow-sm">
              <div>{cal.foodItem} ({cal.caloriesKcal} {t('healthFitnessUnitKcal')}) - {t(`healthFitnessMealType${cal.mealType}` as keyof TranslationSet, cal.mealType)} ({new Date(cal.date + 'T00:00:00').toLocaleDateString(language)})</div>
              <button onClick={() => handleDeleteCalorieEntry(cal.id)} className={deleteButtonClasses}><TrashIcon className="h-4 w-4"/></button>
            </li>
          ))}
        </ul>
      </SubSectionCard>
      
      {/* Water Log */}
      <SubSectionCard titleKey="healthFitnessWaterLog" icon={<BeakerIcon/>} isOpen={openSubSections.waterLog} onToggle={() => toggleSubSection('waterLog')}>
        <form onSubmit={handleAddWaterLog} className="space-y-3 mb-4 p-3 border rounded-md dark:border-gray-600 bg-slate-50 dark:bg-gray-700/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input type="number" value={waterAmountMl} onChange={e => setWaterAmountMl(e.target.value)} placeholder={t('healthFitnessWaterAmountMl')} className={`${inputBaseClasses} ${themedInputClasses}`} required />
            <input type="date" value={waterDate} onChange={e => setWaterDate(e.target.value)} className={`${inputBaseClasses} ${themedInputClasses}`} required />
          </div>
          <button type="submit" className={`${primaryButtonClasses} w-full`}>{t('healthFitnessLogWaterIntake')}</button>
        </form>
         <div className="grid grid-cols-3 gap-2 mb-4">
            <button onClick={() => quickAddWater(250)} className={`${primaryButtonClasses} !py-1.5 !text-xs`}>{t('healthFitnessQuickAddWater250ml')}</button>
            <button onClick={() => quickAddWater(500)} className={`${primaryButtonClasses} !py-1.5 !text-xs`}>{t('healthFitnessQuickAddWater500ml')}</button>
            <button onClick={() => quickAddWater(1000)} className={`${primaryButtonClasses} !py-1.5 !text-xs`}>{t('healthFitnessQuickAddWater1L')}</button>
        </div>
        {waterLogs.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">{t('healthFitnessNoWaterEntries')}</p>}
        <ul className="space-y-1 max-h-60 overflow-y-auto">
          {waterLogs.map(log => (
            <li key={log.id} className="flex justify-between items-center p-2 text-xs rounded bg-white dark:bg-gray-700 shadow-sm">
              <div>{log.amountMl} {t('healthFitnessUnitMl')} ({new Date(log.date + 'T00:00:00').toLocaleDateString(language)}{log.time ? ` ${log.time}` : ''})</div>
              <button onClick={() => handleDeleteWaterLog(log.id)} className={deleteButtonClasses}><TrashIcon className="h-4 w-4"/></button>
            </li>
          ))}
        </ul>
      </SubSectionCard>

      {/* Sleep Log */}
      <SubSectionCard titleKey="healthFitnessSleepLog" icon={<MoonIcon/>} isOpen={openSubSections.sleepLog} onToggle={() => toggleSubSection('sleepLog')}>
        <form onSubmit={handleAddSleepLog} className="space-y-3 mb-4 p-3 border rounded-md dark:border-gray-600 bg-slate-50 dark:bg-gray-700/50">
          <input type="date" value={sleepDateWokeUp} onChange={e => setSleepDateWokeUp(e.target.value)} className={`${inputBaseClasses} ${themedInputClasses}`} required title={t('healthFitnessDateWokeUp')} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input type="time" value={sleepTimeWentToBed} onChange={e => setSleepTimeWentToBed(e.target.value)} className={`${inputBaseClasses} ${themedInputClasses}`} required title={t('healthFitnessTimeWentToBed')} />
            <input type="time" value={sleepTimeWokeUp} onChange={e => setSleepTimeWokeUp(e.target.value)} className={`${inputBaseClasses} ${themedInputClasses}`} required title={t('healthFitnessTimeWokeUp')} />
          </div>
          <select value={sleepQuality || ''} onChange={e => setSleepQuality(e.target.value as SleepQuality)} className={`${inputBaseClasses} ${themedInputClasses}`} title={t('healthFitnessSleepQuality')}>
            <option value="">{t('healthFitnessSleepQuality') + " (" + t('descriptionLabel') + ")"}</option>
            {sleepQualityOptions.map(q => <option key={q} value={q}>{t(`healthFitnessSleepQuality${q}` as keyof TranslationSet, q)}</option>)}
          </select>
          <button type="submit" className={`${primaryButtonClasses} w-full`}>{t('healthFitnessLogSleepEntry')}</button>
        </form>
        {sleepLogs.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">{t('healthFitnessNoSleepEntries')}</p>}
        <ul className="space-y-1 max-h-60 overflow-y-auto">
          {sleepLogs.map(log => (
            <li key={log.id} className="p-2 text-xs rounded bg-white dark:bg-gray-700 shadow-sm">
              <div>{new Date(log.dateWokeUp + 'T00:00:00').toLocaleDateString(language)}: {log.timeWentToBed} - {log.timeWokeUp} {log.sleepQuality ? `(${t(`healthFitnessSleepQuality${log.sleepQuality}` as keyof TranslationSet, log.sleepQuality)})` : ''}</div>
              <button onClick={() => handleDeleteSleepLog(log.id)} className={`${deleteButtonClasses} mt-1`}><TrashIcon className="h-4 w-4"/></button>
            </li>
          ))}
        </ul>
      </SubSectionCard>

       {/* Medication Reminders */}
       <SubSectionCard titleKey="healthFitnessMedicationReminders" icon={<AdjustmentsHorizontalIcon/>} isOpen={openSubSections.medicationReminders} onToggle={() => toggleSubSection('medicationReminders')}>
        <form onSubmit={handleAddMedReminder} className="space-y-3 mb-4 p-3 border rounded-md dark:border-gray-600 bg-slate-50 dark:bg-gray-700/50">
          <input type="text" value={medName} onChange={e => setMedName(e.target.value)} placeholder={t('healthFitnessMedicationName')} className={`${inputBaseClasses} ${themedInputClasses}`} required />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input type="text" value={medDosage} onChange={e => setMedDosage(e.target.value)} placeholder={t('healthFitnessDosage')} className={`${inputBaseClasses} ${themedInputClasses}`} required />
            <select value={medDosageUnit} onChange={e => setMedDosageUnit(e.target.value as MedicationDosageUnit)} className={`${inputBaseClasses} ${themedInputClasses}`}>
              {medicationDosageUnitOptions.map(unit => <option key={unit} value={unit}>{t(`healthFitnessDosageUnit${unit}` as keyof TranslationSet, unit)}</option>)}
            </select>
          </div>
          <input type="number" value={medTimesPerDay} onChange={handleTimesPerDayChange} placeholder={t('healthFitnessTimesPerDay')} className={`${inputBaseClasses} ${themedInputClasses}`} min="1" max="10" />
          {medSpecificTimes.map((time, index) => (
            <input key={index} type="time" value={time} onChange={e => handleSpecificTimeChange(index, e.target.value)} className={`${inputBaseClasses} ${themedInputClasses} !mt-1`} />
          ))}
          <input type="date" value={medStartDate} onChange={e => setMedStartDate(e.target.value)} className={`${inputBaseClasses} ${themedInputClasses}`} required title={t('healthFitnessStartDate')}/>
          <button type="submit" className={`${primaryButtonClasses} w-full`}>{t('healthFitnessAddMedicationReminder')}</button>
        </form>
        {medReminders.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">{t('healthFitnessNoMedReminders')}</p>}
        <ul className="space-y-2 max-h-72 overflow-y-auto">
          {medReminders.map(rem => (
            <li key={rem.id} className="p-3 text-xs rounded bg-white dark:bg-gray-700 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{rem.medicationName} - {rem.dosage} {t(`healthFitnessDosageUnit${rem.dosageUnit}` as keyof TranslationSet, rem.dosageUnit)}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-[10px]">{t('healthFitnessTimesPerDay')}: {rem.timesPerDay} ({rem.specificTimes.join(', ')}) | {t('healthFitnessStartDate')}: {new Date(rem.startDate+'T00:00:00').toLocaleDateString(language)}</p>
                  <div className="mt-1 space-x-1 rtl:space-x-reverse">
                     {rem.specificTimes.map((time, idx) => {
                        const timeKey = `${rem.startDate}-${time}`; // Simplified key for demo
                        const taken = rem.takenLog[timeKey];
                        return (
                            <button key={idx} onClick={() => toggleMedTaken(rem.id, timeKey)} 
                                    className={`py-0.5 px-1.5 rounded text-[10px] ${taken ? 'bg-green-500 dark:bg-green-600 text-white' : 'bg-gray-300 dark:bg-gray-600'}`}>
                                {time} {taken ? t('healthFitnessStatusTaken') : t('healthFitnessMarkAsTaken')}
                            </button>
                        );
                     })}
                  </div>
                </div>
                <button onClick={() => handleDeleteMedReminder(rem.id)} className={`${deleteButtonClasses} ml-2 rtl:mr-2 shrink-0`}><TrashIcon className="h-4 w-4"/></button>
              </div>
            </li>
          ))}
        </ul>
      </SubSectionCard>

      {/* Vital Signs Log */}
      <SubSectionCard titleKey="healthFitnessVitalSignsLog" icon={<HeartIcon/>} isOpen={openSubSections.vitalSignsLog} onToggle={() => toggleSubSection('vitalSignsLog')}>
        {/* Blood Pressure */}
        <div className="mb-4">
          <h4 className="text-md font-medium mb-2 text-sky-600 dark:text-sky-400">{t('healthFitnessLogBloodPressure')}</h4>
          <form onSubmit={handleAddBPLog} className="space-y-3 p-3 border rounded-md dark:border-gray-600 bg-slate-50 dark:bg-gray-700/50">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input type="number" value={bpSystolic} onChange={e => setBpSystolic(e.target.value)} placeholder={t('healthFitnessSystolic')} className={`${inputBaseClasses} ${themedInputClasses}`} required />
              <input type="number" value={bpDiastolic} onChange={e => setBpDiastolic(e.target.value)} placeholder={t('healthFitnessDiastolic')} className={`${inputBaseClasses} ${themedInputClasses}`} required />
              <input type="number" value={bpPulse} onChange={e => setBpPulse(e.target.value)} placeholder={t('healthFitnessPulse')} className={`${inputBaseClasses} ${themedInputClasses}`} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input type="date" value={bpDate} onChange={e => setBpDate(e.target.value)} className={`${inputBaseClasses} ${themedInputClasses}`} required />
              <input type="time" value={bpTime} onChange={e => setBpTime(e.target.value)} className={`${inputBaseClasses} ${themedInputClasses}`} required />
            </div>
            <button type="submit" className={`${primaryButtonClasses} w-full`}>{t('healthFitnessSaveBPLog')}</button>
          </form>
          {bpLogs.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">{t('healthFitnessNoBPLogs')}</p>}
          <ul className="space-y-1 max-h-40 overflow-y-auto mt-2">
            {bpLogs.map(log => (
              <li key={log.id} className="flex justify-between items-center p-2 text-xs rounded bg-white dark:bg-gray-700 shadow-sm">
                <div>{new Date(log.date+'T'+log.time).toLocaleString(language)}: {log.systolic}/{log.diastolic} {t('healthFitnessUnitMmhg')} {log.pulse ? `(${log.pulse} ${t('healthFitnessUnitBpm')})` : ''}</div>
                <button onClick={() => handleDeleteBPLog(log.id)} className={deleteButtonClasses}><TrashIcon className="h-4 w-4"/></button>
              </li>
            ))}
          </ul>
        </div>
        {/* Blood Sugar */}
        <div>
          <h4 className="text-md font-medium mb-2 text-pink-600 dark:text-pink-400">{t('healthFitnessLogBloodSugar')}</h4>
           <form onSubmit={handleAddSugarLog} className="space-y-3 p-3 border rounded-md dark:border-gray-600 bg-slate-50 dark:bg-gray-700/50">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input type="number" value={sugarLevel} onChange={e => setSugarLevel(e.target.value)} placeholder={t('healthFitnessSugarLevel')} className={`${inputBaseClasses} ${themedInputClasses}`} required step="0.1"/>
                <select value={sugarUnit} onChange={e => setSugarUnit(e.target.value as SugarUnit)} className={`${inputBaseClasses} ${themedInputClasses}`}>
                    {sugarUnitOptions.map(unit => <option key={unit} value={unit}>{t(`healthFitnessSugarUnit${unit}` as keyof TranslationSet, unit)}</option>)}
                </select>
            </div>
            <select value={sugarMeasurementType} onChange={e => setSugarMeasurementType(e.target.value as SugarMeasurementType)} className={`${inputBaseClasses} ${themedInputClasses}`}>
                {sugarMeasurementTypeOptions.map(type => <option key={type} value={type}>{t(`healthFitnessMeasureType${type}` as keyof TranslationSet, type)}</option>)}
            </select>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input type="date" value={sugarDate} onChange={e => setSugarDate(e.target.value)} className={`${inputBaseClasses} ${themedInputClasses}`} required />
                <input type="time" value={sugarTime} onChange={e => setSugarTime(e.target.value)} className={`${inputBaseClasses} ${themedInputClasses}`} required />
            </div>
            <button type="submit" className={`${primaryButtonClasses} w-full`}>{t('healthFitnessSaveSugarLog')}</button>
          </form>
          {sugarLogs.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">{t('healthFitnessNoSugarLogs')}</p>}
          <ul className="space-y-1 max-h-40 overflow-y-auto mt-2">
            {sugarLogs.map(log => (
              <li key={log.id} className="flex justify-between items-center p-2 text-xs rounded bg-white dark:bg-gray-700 shadow-sm">
                <div>{new Date(log.date+'T'+log.time).toLocaleString(language)}: {log.sugarLevel} {t(`healthFitnessSugarUnit${log.unit}` as keyof TranslationSet, log.unit)} ({t(`healthFitnessMeasureType${log.measurementType}` as keyof TranslationSet, log.measurementType)})</div>
                <button onClick={() => handleDeleteSugarLog(log.id)} className={deleteButtonClasses}><TrashIcon className="h-4 w-4"/></button>
              </li>
            ))}
          </ul>
        </div>
      </SubSectionCard>
      
      {/* Exercise Plans */}
      <SubSectionCard titleKey="healthFitnessExercisePlans" icon={<UserGroupIcon/>} isOpen={openSubSections.exercisePlans} onToggle={() => toggleSubSection('exercisePlans')}>
        <form onSubmit={handleAddExercisePlan} className="space-y-3 mb-4 p-3 border rounded-md dark:border-gray-600 bg-slate-50 dark:bg-gray-700/50">
            <input type="text" value={planName} onChange={e => setPlanName(e.target.value)} placeholder={t('healthFitnessPlanName')} className={`${inputBaseClasses} ${themedInputClasses}`} required/>
            <button type="submit" className={`${primaryButtonClasses} w-full`}>{t('healthFitnessCreateNewPlan')}</button>
        </form>
        {exercisePlans.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">{t('healthFitnessNoExercisePlans')}</p>}
        <ul className="space-y-1 max-h-60 overflow-y-auto">
            {exercisePlans.map(plan => (
                <li key={plan.id} className="flex justify-between items-center p-2 text-xs rounded bg-white dark:bg-gray-700 shadow-sm">
                    <span>{plan.planName}</span>
                    <button onClick={() => handleDeleteExercisePlan(plan.id)} className={deleteButtonClasses}><TrashIcon className="h-4 w-4"/></button>
                </li>
            ))}
        </ul>
        <p className="text-xs italic text-gray-500 dark:text-gray-400 mt-2">{language === 'ar' ? 'إدارة تفاصيل التمارين داخل الخطط ستتوفر قريباً.' : 'Managing exercises within plans coming soon.'}</p>
      </SubSectionCard>

      {/* Meal Log */}
      <SubSectionCard titleKey="healthFitnessMealLog" icon={<CalendarDaysIcon/>} isOpen={openSubSections.mealLog} onToggle={() => toggleSubSection('mealLog')}>
        <form onSubmit={handleAddMealLog} className="space-y-3 mb-4 p-3 border rounded-md dark:border-gray-600 bg-slate-50 dark:bg-gray-700/50">
            <select value={mealLogType} onChange={e => setMealLogType(e.target.value as MealType)} className={`${inputBaseClasses} ${themedInputClasses}`}>
                {mealTypeOptions.map(type => <option key={type} value={type}>{t(`healthFitnessMealType${type}` as keyof TranslationSet, type)}</option>)}
            </select>
             <input type="date" value={mealLogDate} onChange={e => setMealLogDate(e.target.value)} className={`${inputBaseClasses} ${themedInputClasses}`} required/>
            <textarea value={mealLogComponentsStr} onChange={e => setMealLogComponentsStr(e.target.value)} placeholder={t('healthFitnessMealComponents') + " (" + (language === 'ar' ? "مثال: خبز أسمر, بيضة مسلوقة" : "e.g., Brown bread, Boiled egg") + ")"} rows={2} className={`${inputBaseClasses} ${themedInputClasses}`}></textarea>
            <button type="submit" className={`${primaryButtonClasses} w-full`}>{t('healthFitnessLogNewMeal')}</button>
        </form>
        {mealLogs.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">{t('healthFitnessNoMealsLogged')}</p>}
        <ul className="space-y-1 max-h-60 overflow-y-auto">
            {mealLogs.map(log => (
                <li key={log.id} className="p-2 text-xs rounded bg-white dark:bg-gray-700 shadow-sm">
                    <div>{t(`healthFitnessMealType${log.mealType}` as keyof TranslationSet, log.mealType)} ({new Date(log.date+'T00:00:00').toLocaleDateString(language)}): {log.components.map(c=>c.name).join(', ')}</div>
                    <button onClick={() => handleDeleteMealLog(log.id)} className={`${deleteButtonClasses} mt-1`}><TrashIcon className="h-4 w-4"/></button>
                </li>
            ))}
        </ul>
      </SubSectionCard>

      <SubSectionCard titleKey="healthFitnessReports" icon={<PresentationChartLineIcon/>} isOpen={openSubSections.healthReports} onToggle={() => toggleSubSection('healthReports')}><p className="text-sm text-gray-600 dark:text-gray-400 text-center py-2">{t('featureUnderConstruction')}</p></SubSectionCard>
    </>
  );
};
export default HealthFitnessSection;
