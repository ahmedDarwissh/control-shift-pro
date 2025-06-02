
import React, { useState, FormEvent, useContext } from 'react';
import { useLanguageContext } from '../hooks/useLanguage';
import { ThemeContext } from '../contexts/ThemeContext';
import { ToastContext } from '../contexts/ToastContext'; // UPDATED IMPORT
import { PermitToWorkItem, PermitStatus } from '../types';
import { MOCK_PERMITS_TO_WORK } from '../constants';
import { ClipboardDocumentCheckIcon, PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';

const PermitToWorkView: React.FC = () => {
  const { t, language, translations } = useLanguageContext(); // Added translations
  const { theme } = React.useContext(ThemeContext);
  const { addToast } = useContext(ToastContext);

  const [permits, setPermits] = useState<PermitToWorkItem[]>(MOCK_PERMITS_TO_WORK);
  const [permitType, setPermitType] = useState<string>('hotWork'); // Ensure keys match translation options
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [requestedBy, setRequestedBy] = useState('');
  const [involvedPersonnel, setInvolvedPersonnel] = useState('');
  const [safetyPrecautions, setSafetyPrecautions] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!permitType || !location.trim() || !description.trim() || !requestedBy.trim()) {
      addToast(t('loginFailedError' as any, language === 'ar' ? 'من فضلك املأ جميع الحقول الأساسية للتصريح.' : 'Please fill all core permit fields.'), 'alert');
      return;
    }
    setIsSubmitting(true);
    const newPermit: PermitToWorkItem = {
      id: `permit-${Date.now()}`,
      type: permitType,
      location,
      description,
      requestedBy,
      status: PermitStatus.RequestedPermit,
      requestDate: new Date(),
      involvedPersonnel: involvedPersonnel.split(',').map(s => s.trim()).filter(s => s),
      safetyPrecautions: safetyPrecautions.split('\n').map(s => s.trim()).filter(s => s),
    };
    setTimeout(() => {
      setPermits(prev => [newPermit, ...prev]);
      addToast(t('permitToWorkRequestPermit') + ' ' + t('statusSuccessMessage'), 'success');
      setPermitType('hotWork'); setLocation(''); setDescription(''); setRequestedBy(''); setInvolvedPersonnel(''); setSafetyPrecautions('');
      setIsSubmitting(false);
    }, 500);
  };

  const handleDeletePermit = (id: string) => {
    if (window.confirm(t('confirmDeletePersonalTask' as any, language === 'ar' ? "متأكد عايز تمسح التصريح ده؟" : "Sure you want to delete this permit?"))) {
      setPermits(prev => prev.filter(permit => permit.id !== id));
      addToast(t('personalTaskDeletedSuccess' as any, language === 'ar' ? 'تم حذف التصريح!' : 'Permit deleted!'), 'info');
    }
  };
  
  const getStatusColor = (status: PermitStatus) => {
    switch (status) {
        case PermitStatus.ApprovedPermit:
        case PermitStatus.ActivePermit:
            return theme === 'dark' ? 'bg-green-600 text-green-100' : 'bg-green-100 text-green-700';
        case PermitStatus.RequestedPermit:
            return theme === 'dark' ? 'bg-yellow-600 text-yellow-100' : 'bg-yellow-100 text-yellow-700';
        case PermitStatus.RejectedPermit:
        case PermitStatus.ExpiredPermit:
            return theme === 'dark' ? 'bg-red-600 text-red-100' : 'bg-red-100 text-red-700';
        case PermitStatus.ClosedPermit:
            return theme === 'dark' ? 'bg-gray-500 text-gray-100' : 'bg-gray-200 text-gray-600';
        default:
            return theme === 'dark' ? 'bg-gray-600 text-gray-200' : 'bg-gray-300 text-gray-700';
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
        <ClipboardDocumentCheckIcon className={`h-8 w-8 ${pageTitleColor} ${language === 'ar' ? 'ml-3' : 'mr-3'}`} />
        <h1 className={`text-2xl md:text-3xl font-bold ${pageTitleColor}`}>
          {t('permitToWorkTitle')}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className={`p-5 md:p-6 rounded-xl shadow-xl mb-6 ${cardBg} border`}>
        <h2 className={`text-xl font-semibold mb-4 ${textColor}`}>{t('permitToWorkRequestPermit')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="permitType" className={labelClass}>{t('permitToWorkType')}*</label>
            <select id="permitType" value={permitType} onChange={e => setPermitType(e.target.value)} className={`${inputBaseClasses} ${themedInputClasses}`} required>
               {Object.entries(translations.permitTypeOptions).map(([key, val]) => <option key={key} value={key}>{val}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="permitLocation" className={labelClass}>{t('permitToWorkLocation')}*</label>
            <input type="text" id="permitLocation" value={location} onChange={e => setLocation(e.target.value)} className={`${inputBaseClasses} ${themedInputClasses}`} required />
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="permitDescription" className={labelClass}>{t('permitToWorkDescription')}*</label>
          <textarea id="permitDescription" value={description} onChange={e => setDescription(e.target.value)} rows={3} className={`${inputBaseClasses} ${themedInputClasses}`} required />
        </div>
        <div className="mb-4">
          <label htmlFor="requestedBy" className={labelClass}>{t('permitToWorkRequestedBy')}*</label>
          <input type="text" id="requestedBy" value={requestedBy} onChange={e => setRequestedBy(e.target.value)} className={`${inputBaseClasses} ${themedInputClasses}`} required />
        </div>
         <div className="mb-4">
          <label htmlFor="involvedPersonnel" className={labelClass}>{t('permitToWorkInvolvedPersonnel')}</label>
          <input type="text" id="involvedPersonnel" value={involvedPersonnel} onChange={e => setInvolvedPersonnel(e.target.value)} placeholder={language === 'ar' ? 'افصل بينهم بفاصلة' : 'Comma-separated'} className={`${inputBaseClasses} ${themedInputClasses}`} />
        </div>
        <div className="mb-6">
          <label htmlFor="safetyPrecautions" className={labelClass}>{t('permitToWorkSafetyPrecautions')}</label>
          <textarea id="safetyPrecautions" value={safetyPrecautions} onChange={e => setSafetyPrecautions(e.target.value)} rows={3} placeholder={language === 'ar' ? 'كل احتياط في سطر جديد' : 'Each precaution on a new line'} className={`${inputBaseClasses} ${themedInputClasses}`} />
        </div>
        <button type="submit" className={submitButtonClasses} disabled={isSubmitting}>
          <PlusCircleIcon className="h-5 w-5" />
          {isSubmitting ? (language === 'ar' ? 'جاري الطلب...' : 'Requesting...') : t('permitToWorkRequestPermit')}
        </button>
      </form>

      {permits.length === 0 ? (
        <div className={`p-5 md:p-6 rounded-xl shadow-xl ${cardBg} border text-center`}>
            <p className={`${textColor} text-lg`}>{t('permitToWorkNoPermits')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {permits.map(permit => (
            <div key={permit.id} className={`p-4 rounded-lg shadow-md ${cardBg} border`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className={`text-md font-semibold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>{translations.permitTypeOptions[permit.type.toLowerCase() as keyof typeof translations.permitTypeOptions] || permit.type} - {permit.location}</h3>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(permit.status)}`}>
                        {translations.permitStatusOptions[permit.status as keyof typeof translations.permitStatusOptions] || permit.status}
                    </span>
                </div>
                <button onClick={() => handleDeletePermit(permit.id)} className={`p-1.5 rounded-md text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors`} title={t('deleteAction')}>
                    <TrashIcon className="h-4 w-4" />
                </button>
              </div>
              <p className={`text-sm mb-1 ${textColor}`}>{permit.description}</p>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                {t('permitToWorkRequestedBy')}: {permit.requestedBy} | {t('permitToWorkRequestPermit')}: {new Date(permit.requestDate).toLocaleDateString(language)}
                {permit.approvalDate && ` | ${t('permitToWorkApprovalDate')}: ${new Date(permit.approvalDate).toLocaleDateString(language)}`}
                {permit.expiryDate && ` | ${t('permitToWorkExpiryDate')}: ${new Date(permit.expiryDate).toLocaleDateString(language)}`}
              </p>
              {permit.involvedPersonnel && permit.involvedPersonnel.length > 0 && (
                <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    <strong>{t('permitToWorkInvolvedPersonnel')}:</strong> {permit.involvedPersonnel.join(', ')}
                </p>
              )}
              {permit.safetyPrecautions && permit.safetyPrecautions.length > 0 && (
                <div className={`text-xs mt-1.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    <strong>{t('permitToWorkSafetyPrecautions')}:</strong>
                    <ul className={`list-disc ${language === 'ar' ? 'list-inside pr-4' : 'list-inside pl-4'}`}>
                        {permit.safetyPrecautions.map((item, idx) => <li key={idx}>{item}</li>)}
                    </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PermitToWorkView;
