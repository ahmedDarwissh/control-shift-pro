
import React, { useState, FormEvent, useContext } from 'react';
import { useLanguageContext } from '../hooks/useLanguage';
import { ThemeContext } from '../contexts/ThemeContext';
import { ToastContext } from '../contexts/ToastContext'; // UPDATED IMPORT
import { SafetyObservationItem, SafetyObservationCategory } from '../types';
import { MOCK_SAFETY_OBSERVATIONS } from '../constants';
import { MegaphoneIcon, PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';

const SafetyObservationView: React.FC = () => {
  const { t, language, translations } = useLanguageContext();
  const { theme } = React.useContext(ThemeContext);
  const { addToast } = useContext(ToastContext);

  const [observations, setObservations] = useState<SafetyObservationItem[]>(MOCK_SAFETY_OBSERVATIONS);
  const [observationText, setObservationText] = useState('');
  const [location, setLocation] = useState('');
  const [reportedBy, setReportedBy] = useState('');
  const [category, setCategory] = useState<SafetyObservationCategory>(SafetyObservationCategory.UnsafeConditionObs);
  const [recommendedAction, setRecommendedAction] = useState('');
  const [severity, setSeverity] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium'); // Added Critical to match translations
  const [followUpStatus, setFollowUpStatus] = useState<'Open' | 'InProgress' | 'Closed' | 'RequiresReview'>('Open'); // Added RequiresReview

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!observationText.trim() || !location.trim() || !reportedBy.trim()) {
      addToast(t('loginFailedError' as any, language === 'ar' ? 'من فضلك املأ جميع الحقول الإلزامية للملاحظة.' : 'Please fill all required fields for the observation.'), 'alert');
      return;
    }
    setIsSubmitting(true);
    const newObservation: SafetyObservationItem = {
      id: `obs-${Date.now()}`,
      observation: observationText,
      location,
      reportedBy,
      timestamp: new Date(),
      category,
      recommendedAction: recommendedAction.trim() || undefined,
      severity,
      followUpStatus,
    };
    setTimeout(() => { // Simulate API call
      setObservations(prev => [newObservation, ...prev]);
      addToast(t('safetyObservationReport') + ' ' + t('statusSuccessMessage'), 'success');
      setObservationText(''); setLocation(''); setReportedBy(''); setCategory(SafetyObservationCategory.UnsafeConditionObs);
      setRecommendedAction(''); setSeverity('Medium'); setFollowUpStatus('Open');
      setIsSubmitting(false);
    }, 500);
  };

  const handleDeleteObservation = (id: string) => {
    if (window.confirm(t('confirmDeletePersonalTask' as any, language === 'ar' ? "متأكد عايز تمسح الملاحظة دي؟" : "Sure you want to delete this observation?"))) {
      setObservations(prev => prev.filter(obs => obs.id !== id));
      addToast(t('personalTaskDeletedSuccess' as any, language === 'ar' ? 'تم حذف الملاحظة!' : 'Observation deleted!'), 'info');
    }
  };

  const pageTitleColor = theme === 'dark' ? 'text-accent-orange' : 'text-accent-orange';
  const cardBg = theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const textColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
  const inputBaseClasses = "w-full p-3 border rounded-lg shadow-sm focus:ring-2 text-sm";
  const themedInputClasses = theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-600 focus:border-blue-600 placeholder-gray-400';
  const labelClass = `block text-sm font-medium mb-1.5 ${textColor}`;
  const submitButtonClasses = `py-3 px-5 rounded-lg font-semibold transition-colors transform hover:scale-[1.02] shadow-md text-sm flex items-center justify-center gap-2
    ${isSubmitting ? (theme === 'dark' ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-gray-300 text-gray-500 cursor-not-allowed')
                   : (theme === 'dark' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700')}`;

  return (
    <div className={`p-2 md:p-4 animate-fadeInUp ${language === 'ar' ? 'font-cairo' : 'font-poppins'}`}>
      <div className="flex items-center mb-6">
        <MegaphoneIcon className={`h-8 w-8 ${pageTitleColor} ${language === 'ar' ? 'ml-3' : 'mr-3'}`} />
        <h1 className={`text-2xl md:text-3xl font-bold ${pageTitleColor}`}>
          {t('safetyObservationTitle')}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className={`p-5 md:p-6 rounded-xl shadow-xl mb-6 ${cardBg} border`}>
        <h2 className={`text-xl font-semibold mb-4 ${textColor}`}>{t('safetyObservationReport')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="obsLocation" className={labelClass}>{t('permitToWorkLocation')}*</label>
            <input type="text" id="obsLocation" value={location} onChange={e => setLocation(e.target.value)} className={`${inputBaseClasses} ${themedInputClasses}`} required />
          </div>
          <div>
            <label htmlFor="obsReportedBy" className={labelClass}>{t('safetyObservationReportedBy')}*</label>
            <input type="text" id="obsReportedBy" value={reportedBy} onChange={e => setReportedBy(e.target.value)} className={`${inputBaseClasses} ${themedInputClasses}`} required />
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="obsText" className={labelClass}>{t('safetyObservationObservation')}*</label>
          <textarea id="obsText" value={observationText} onChange={e => setObservationText(e.target.value)} rows={3} className={`${inputBaseClasses} ${themedInputClasses}`} required />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="obsCategory" className={labelClass}>{t('safetyObservationCategory')}</label>
            <select id="obsCategory" value={category} onChange={e => setCategory(e.target.value as SafetyObservationCategory)} className={`${inputBaseClasses} ${themedInputClasses}`}>
              {Object.entries(translations.safetyObservationCategoryOptions).map(([key, val]) => <option key={key} value={key.charAt(0).toUpperCase() + key.slice(1) + 'Obs'}>{val}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="obsSeverity" className={labelClass}>{t('safetyObservationSeverity')}</label>
            <select id="obsSeverity" value={severity} onChange={e => setSeverity(e.target.value as any)} className={`${inputBaseClasses} ${themedInputClasses}`}>
              {Object.entries(translations.safetyObservationSeverityOptions).map(([key, val]) => <option key={key} value={key.charAt(0).toUpperCase() + key.slice(1)}>{val}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="obsFollowUp" className={labelClass}>{t('safetyObservationFollowUpStatus')}</label>
            <select id="obsFollowUp" value={followUpStatus} onChange={e => setFollowUpStatus(e.target.value as any)} className={`${inputBaseClasses} ${themedInputClasses}`}>
              {Object.entries(translations.safetyObservationFollowUpOptions).map(([key, val]) => <option key={key} value={key.charAt(0).toUpperCase() + key.slice(1)}>{val}</option>)}
            </select>
          </div>
        </div>
        <div className="mb-6">
          <label htmlFor="obsRecAction" className={labelClass}>{t('safetyObservationRecommendedAction')}</label>
          <textarea id="obsRecAction" value={recommendedAction} onChange={e => setRecommendedAction(e.target.value)} rows={2} className={`${inputBaseClasses} ${themedInputClasses}`} />
        </div>
        <button type="submit" className={submitButtonClasses} disabled={isSubmitting}>
          <PlusCircleIcon className="h-5 w-5" />
          {isSubmitting ? (language === 'ar' ? 'جاري التسجيل...' : 'Recording...') : t('safetyObservationReport')}
        </button>
      </form>

      {observations.length === 0 ? (
        <div className={`p-5 md:p-6 rounded-xl shadow-xl ${cardBg} border text-center`}>
            <p className={`${textColor} text-lg`}>{t('safetyObservationNoObservations')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {observations.map(obs => (
            <div key={obs.id} className={`p-4 rounded-lg shadow-md ${cardBg} border`}>
              <div className="flex justify-between items-start mb-2">
                <h3 className={`text-md font-semibold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>{obs.location} - {translations.safetyObservationCategoryOptions[obs.category as keyof typeof translations.safetyObservationCategoryOptions] || obs.category}</h3>
                <button onClick={() => handleDeleteObservation(obs.id)} className={`p-1.5 rounded-md text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors`} title={t('deleteAction')}>
                    <TrashIcon className="h-4 w-4" />
                </button>
              </div>
              <p className={`text-sm mb-1 ${textColor}`}>{obs.observation}</p>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                {t('safetyObservationReportedBy')}: {obs.reportedBy} | {new Date(obs.timestamp).toLocaleString(language)}
              </p>
              {obs.recommendedAction && <p className={`text-xs italic mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}><strong>{t('safetyObservationRecommendedAction')}:</strong> {obs.recommendedAction}</p>}
              <div className={`text-xs mt-1.5 flex flex-wrap gap-x-3 gap-y-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  <span>{t('safetyObservationSeverity')}: <span className="font-medium">{translations.safetyObservationSeverityOptions[obs.severity as keyof typeof translations.safetyObservationSeverityOptions] || obs.severity}</span></span>
                  <span>{t('safetyObservationFollowUpStatus')}: <span className="font-medium">{translations.safetyObservationFollowUpOptions[obs.followUpStatus as keyof typeof translations.safetyObservationFollowUpOptions] || obs.followUpStatus}</span></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SafetyObservationView;
