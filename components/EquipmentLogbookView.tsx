
import React, { useState, FormEvent, useContext, useEffect } from 'react';
import { useLanguageContext } from '../hooks/useLanguage';
import { ThemeContext } from '../contexts/ThemeContext';
import { ToastContext } from '../contexts/ToastContext'; // UPDATED IMPORT
import { EquipmentLogbookItem } from '../types';
import { MOCK_EQUIPMENT_LOGBOOK_ENTRIES } from '../constants'; // Assuming mock data is here
import { ArchiveBoxIcon, PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';

const EquipmentLogbookView: React.FC = () => {
  const { t, language, translations } = useLanguageContext(); // Added translations
  const { theme } = React.useContext(ThemeContext);
  const { addToast } = useContext(ToastContext);

  const [logEntries, setLogEntries] = useState<EquipmentLogbookItem[]>(MOCK_EQUIPMENT_LOGBOOK_ENTRIES);
  const [equipmentName, setEquipmentName] = useState('');
  const [logEntryText, setLogEntryText] = useState('');
  const [loggedBy, setLoggedBy] = useState('');
  const [category, setCategory] = useState<string>('routine'); // Ensure keys match translation options
  const [status, setStatus] = useState<'open' | 'inProgress' | 'resolved' | 'pendingParts'>('open'); // Ensure keys match translation options
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium'); // Ensure keys match translation options
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!equipmentName.trim() || !logEntryText.trim() || !loggedBy.trim()) {
      addToast(t('loginFailedError' as any, language === 'ar' ? 'من فضلك املأ جميع الحقول الإلزامية يا فهلوي!' : 'Please fill all required fields, Fahlawy!'), 'alert');
      return;
    }
    setIsSubmitting(true);
    const newEntry: EquipmentLogbookItem = {
      id: `log-${Date.now()}`,
      equipmentName,
      logEntry: logEntryText,
      timestamp: new Date(),
      loggedBy,
      category,
      status,
      priority
    };
    setTimeout(() => { // Simulate API call
      setLogEntries(prev => [newEntry, ...prev]);
      addToast(t('equipmentLogbookAddEntry') + ' ' + t('statusSuccessMessage'), 'success');
      setEquipmentName('');
      setLogEntryText('');
      setLoggedBy('');
      setCategory('routine');
      setStatus('open');
      setPriority('medium');
      setIsSubmitting(false);
    }, 500);
  };

  const handleDeleteEntry = (id: string) => {
    if (window.confirm(t('confirmDeletePersonalTask' as any, language === 'ar' ? "متأكد عايز تمسح السجل ده؟ مفيش رجوع!" : "Sure you want to delete this log? No going back!"))) {
      setLogEntries(prev => prev.filter(entry => entry.id !== id));
      addToast(t('personalTaskDeletedSuccess' as any, language === 'ar' ? 'تم حذف السجل بنجاح!' : 'Log deleted successfully!'), 'info');
    }
  };
  
  const pageTitleColor = theme === 'dark' ? 'text-accent-orange' : 'text-accent-orange';
  const cardBg = theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const textColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
  const inputBaseClasses = "w-full p-3 border rounded-lg shadow-sm focus:ring-2 text-sm";
  const themedInputClasses = theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-600 focus:border-blue-600 placeholder-gray-400';
  const labelClass = `block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`;
  const submitButtonClasses = `py-3 px-5 rounded-lg font-semibold transition-colors transform hover:scale-[1.02] shadow-md text-sm flex items-center justify-center gap-2
    ${isSubmitting ? (theme === 'dark' ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-gray-300 text-gray-500 cursor-not-allowed')
                   : (theme === 'dark' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700')}`;


  return (
    <div className={`p-2 md:p-4 animate-fadeInUp ${language === 'ar' ? 'font-cairo' : 'font-poppins'}`}>
      <div className="flex items-center mb-6">
        <ArchiveBoxIcon className={`h-8 w-8 ${pageTitleColor} ${language === 'ar' ? 'ml-3' : 'mr-3'}`} />
        <h1 className={`text-2xl md:text-3xl font-bold ${pageTitleColor}`}>
          {t('equipmentLogbookTitle')}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className={`p-5 md:p-6 rounded-xl shadow-xl mb-6 ${cardBg} border`}>
        <h2 className={`text-xl font-semibold mb-4 ${textColor}`}>{t('equipmentLogbookAddEntry')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="equipmentName" className={labelClass}>{t('equipmentLogbookEquipmentName')}*</label>
            <input type="text" id="equipmentName" value={equipmentName} onChange={e => setEquipmentName(e.target.value)} className={`${inputBaseClasses} ${themedInputClasses}`} required />
          </div>
          <div>
            <label htmlFor="loggedBy" className={labelClass}>{t('equipmentLogbookLoggedBy')}*</label>
            <input type="text" id="loggedBy" value={loggedBy} onChange={e => setLoggedBy(e.target.value)} className={`${inputBaseClasses} ${themedInputClasses}`} required />
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="logEntryText" className={labelClass}>{t('equipmentLogbookLogDetails')}*</label>
          <textarea id="logEntryText" value={logEntryText} onChange={e => setLogEntryText(e.target.value)} rows={3} className={`${inputBaseClasses} ${themedInputClasses}`} required />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
                <label htmlFor="logCategory" className={labelClass}>{t('equipmentLogbookCategory')}</label>
                <select id="logCategory" value={category} onChange={e => setCategory(e.target.value)} className={`${inputBaseClasses} ${themedInputClasses}`}>
                    {Object.entries(translations.equipmentLogbookCategoryOptions).map(([key, val]) => <option key={key} value={key}>{val}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="logStatus" className={labelClass}>{t('equipmentLogbookStatus')}</label>
                <select id="logStatus" value={status} onChange={e => setStatus(e.target.value as any)} className={`${inputBaseClasses} ${themedInputClasses}`}>
                     {Object.entries(translations.equipmentLogbookStatusOptions).map(([key, val]) => <option key={key} value={key}>{val}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="logPriority" className={labelClass}>{t('equipmentLogbookPriority')}</label>
                <select id="logPriority" value={priority} onChange={e => setPriority(e.target.value as any)} className={`${inputBaseClasses} ${themedInputClasses}`}>
                    {Object.entries(translations.equipmentLogbookPriorityOptions).map(([key, val]) => <option key={key} value={key}>{val}</option>)}
                </select>
            </div>
        </div>
        <button type="submit" className={submitButtonClasses} disabled={isSubmitting}>
          <PlusCircleIcon className="h-5 w-5" />
          {isSubmitting ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving...') : t('saveTask')}
        </button>
      </form>

      {logEntries.length === 0 ? (
         <div className={`p-5 md:p-6 rounded-xl shadow-xl ${cardBg} border text-center`}>
            <p className={`${textColor} text-lg`}>{t('equipmentLogbookNoEntries')}</p>
         </div>
      ) : (
        <div className="space-y-4">
          {logEntries.map(entry => (
            <div key={entry.id} className={`p-4 rounded-lg shadow-md ${cardBg} border`}>
              <div className="flex justify-between items-start mb-2">
                <h3 className={`text-md font-semibold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>{entry.equipmentName}</h3>
                <button onClick={() => handleDeleteEntry(entry.id)} className={`p-1.5 rounded-md text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors`} title={t('deleteAction')}>
                    <TrashIcon className="h-4 w-4" />
                </button>
              </div>
              <p className={`text-sm mb-1 ${textColor}`}>{entry.logEntry}</p>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                {t('equipmentLogbookLoggedBy')}: {entry.loggedBy} | {new Date(entry.timestamp).toLocaleString(language)}
              </p>
              <div className={`text-xs mt-1.5 flex flex-wrap gap-x-3 gap-y-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  <span>{t('equipmentLogbookCategory')}: <span className="font-medium">{translations.equipmentLogbookCategoryOptions[entry.category?.toLowerCase() as keyof typeof translations.equipmentLogbookCategoryOptions || 'routine']}</span></span>
                  <span>{t('equipmentLogbookStatus')}: <span className="font-medium">{translations.equipmentLogbookStatusOptions[entry.status?.toLowerCase() as keyof typeof translations.equipmentLogbookStatusOptions || 'open']}</span></span>
                  <span>{t('equipmentLogbookPriority')}: <span className="font-medium">{translations.equipmentLogbookPriorityOptions[entry.priority?.toLowerCase() as keyof typeof translations.equipmentLogbookPriorityOptions || 'medium']}</span></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EquipmentLogbookView;
