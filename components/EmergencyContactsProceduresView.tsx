
import React, { useState, FormEvent, useContext } from 'react';
import { useLanguageContext } from '../hooks/useLanguage';
import { ThemeContext } from '../contexts/ThemeContext';
import { ToastContext } from '../contexts/ToastContext';
import { EmergencyContactItem, EmergencyProcedureItem } from '../types';
import { MOCK_EMERGENCY_CONTACTS, MOCK_EMERGENCY_PROCEDURES } from '../constants';
import { PhoneArrowUpRightIcon, PlusCircleIcon, TrashIcon, ListBulletIcon } from '@heroicons/react/24/outline';

const EmergencyContactsProceduresView: React.FC = () => {
  const { t, language, translations } = useLanguageContext();
  const { theme } = useContext(ThemeContext);
  const { addToast } = useContext(ToastContext);

  const [contacts, setContacts] = useState<EmergencyContactItem[]>(MOCK_EMERGENCY_CONTACTS);
  const [procedures] = useState<EmergencyProcedureItem[]>(MOCK_EMERGENCY_PROCEDURES); // Procedures are static for now

  // Form state for new contact
  const [contactName, setContactName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [contactDepartment, setContactDepartment] = useState('');
  const [contactType, setContactType] = useState<'Internal' | 'External' | 'SiteEmergency' | 'Medical' | 'Security'>('Internal');
  const [contactNotes, setContactNotes] = useState('');

  const [isSubmittingContact, setIsSubmittingContact] = useState(false);

  const handleAddContact = (e: FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactNumber.trim()) {
      addToast(t('loginFailedError' as any, language === 'ar' ? 'اسم ورقم جهة الاتصال مطلوبان.' : 'Contact name and number are required.'), 'alert');
      return;
    }
    setIsSubmittingContact(true);
    const newContact: EmergencyContactItem = {
      id: `contact-${Date.now()}`,
      name: contactName,
      number: contactNumber,
      department: contactDepartment,
      type: contactType,
      notes: contactNotes.trim() || undefined,
      lastVerified: new Date(),
    };
    setTimeout(() => {
      setContacts(prev => [newContact, ...prev]);
      addToast(t('emergencyContactsProceduresAddContact') + ' ' + t('statusSuccessMessage'), 'success');
      setContactName(''); setContactNumber(''); setContactDepartment(''); setContactType('Internal'); setContactNotes('');
      setIsSubmittingContact(false);
    }, 500);
  };

  const handleDeleteContact = (id: string) => {
    if (window.confirm(t('confirmDeletePersonalTask' as any, language === 'ar' ? "متأكد عايز تمسح جهة الاتصال دي؟" : "Sure you want to delete this contact?"))) {
      setContacts(prev => prev.filter(contact => contact.id !== id));
      addToast(t('personalTaskDeletedSuccess' as any, language === 'ar' ? 'تم حذف جهة الاتصال!' : 'Contact deleted!'), 'info');
    }
  };

  const pageTitleColor = theme === 'dark' ? 'text-accent-orange' : 'text-accent-orange';
  const cardBg = theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const textColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
  const inputBaseClasses = "w-full p-3 border rounded-lg shadow-sm focus:ring-2 text-sm";
  const themedInputClasses = theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-600 focus:border-blue-600 placeholder-gray-400';
  const labelClass = `block text-sm font-medium mb-1.5 ${textColor}`;
  const submitButtonClasses = `py-3 px-5 rounded-lg font-semibold transition-colors transform hover:scale-[1.02] shadow-md text-sm flex items-center justify-center gap-2
    ${isSubmittingContact ? (theme === 'dark' ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-gray-300 text-gray-500 cursor-not-allowed')
                         : (theme === 'dark' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700')}`;
  
  const contactTypeOptions = translations.emergencyContactTypeOptions || { Internal: 'Internal', External: 'External', SiteEmergency: 'Site Emergency', Medical: 'Medical', Security: 'Security' };


  return (
    <div className={`p-2 md:p-4 animate-fadeInUp ${language === 'ar' ? 'font-cairo' : 'font-poppins'}`}>
      <div className="flex items-center mb-6">
        <PhoneArrowUpRightIcon className={`h-8 w-8 ${pageTitleColor} ${language === 'ar' ? 'ml-3' : 'mr-3'}`} />
        <h1 className={`text-2xl md:text-3xl font-bold ${pageTitleColor}`}>
          {t('emergencyContactsProceduresTitle')}
        </h1>
      </div>

      {/* Add Contact Form */}
      <form onSubmit={handleAddContact} className={`p-5 md:p-6 rounded-xl shadow-xl mb-6 ${cardBg} border`}>
        <h2 className={`text-xl font-semibold mb-4 ${textColor}`}>{t('emergencyContactsProceduresAddContact')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="ecName" className={labelClass}>{t('emergencyContactsProceduresContactName')}*</label>
            <input type="text" id="ecName" value={contactName} onChange={e => setContactName(e.target.value)} className={`${inputBaseClasses} ${themedInputClasses}`} required />
          </div>
          <div>
            <label htmlFor="ecNumber" className={labelClass}>{t('emergencyContactsProceduresContactNumber')}*</label>
            <input type="tel" id="ecNumber" value={contactNumber} onChange={e => setContactNumber(e.target.value)} className={`${inputBaseClasses} ${themedInputClasses}`} required />
          </div>
          <div>
            <label htmlFor="ecDepartment" className={labelClass}>{t('emergencyContactsProceduresDepartment')}</label>
            <input type="text" id="ecDepartment" value={contactDepartment} onChange={e => setContactDepartment(e.target.value)} className={`${inputBaseClasses} ${themedInputClasses}`} />
          </div>
          <div>
            <label htmlFor="ecType" className={labelClass}>{t('emergencyContactsProceduresType')}</label>
            <select id="ecType" value={contactType} onChange={e => setContactType(e.target.value as any)} className={`${inputBaseClasses} ${themedInputClasses}`}>
               {Object.entries(contactTypeOptions).map(([key, val]) => <option key={key} value={key.charAt(0).toUpperCase() + key.slice(1)}>{val}</option>)}
            </select>
          </div>
        </div>
        <div className="mb-6">
          <label htmlFor="ecNotes" className={labelClass}>{t('emergencyContactsProceduresNotes')}</label>
          <textarea id="ecNotes" value={contactNotes} onChange={e => setContactNotes(e.target.value)} rows={2} className={`${inputBaseClasses} ${themedInputClasses}`} />
        </div>
        <button type="submit" className={submitButtonClasses} disabled={isSubmittingContact}>
          <PlusCircleIcon className="h-5 w-5" />
          {isSubmittingContact ? (language === 'ar' ? 'جاري الإضافة...' : 'Adding...') : t('emergencyContactsProceduresAddContact')}
        </button>
      </form>

      {/* Display Contacts */}
      <div className={`p-5 md:p-6 rounded-xl shadow-xl mb-6 ${cardBg} border`}>
        <h2 className={`text-xl font-semibold mb-4 ${textColor}`}>{language === 'ar' ? 'قائمة جهات الاتصال' : 'Contacts List'}</h2>
        {contacts.length === 0 ? (
          <p className={`${textColor} text-center`}>{t('emergencyContactsProceduresNoContacts')}</p>
        ) : (
          <div className="space-y-3">
            {contacts.map(contact => (
              <div key={contact.id} className={`p-3 rounded-md shadow-sm ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={`text-md font-semibold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>{contact.name} <span className="text-sm font-normal text-gray-500 dark:text-gray-400">({contact.number})</span></h3>
                    <p className={`text-xs ${textColor}`}>{contact.department} - {contactTypeOptions[contact.type as keyof typeof contactTypeOptions] || contact.type}</p>
                    {contact.notes && <p className={`text-xs italic mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{contact.notes}</p>}
                  </div>
                  <button onClick={() => handleDeleteContact(contact.id)} className={`p-1.5 rounded-md text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors`} title={t('deleteAction')}>
                      <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Display Procedures */}
      <div className={`p-5 md:p-6 rounded-xl shadow-xl ${cardBg} border`}>
        <h2 className={`text-xl font-semibold mb-4 ${textColor}`}>{language === 'ar' ? 'إجراءات الطوارئ' : 'Emergency Procedures'}</h2>
        {procedures.length === 0 ? (
          <p className={`${textColor} text-center`}>{t('emergencyContactsProceduresNoProcedures')}</p>
        ) : (
          <div className="space-y-4">
            {procedures.map(proc => (
              <div key={proc.id} className={`p-3 rounded-md shadow-sm ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h3 className={`text-md font-semibold mb-2 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>{proc.title}</h3>
                <ol className={`list-decimal text-sm space-y-1 ${language === 'ar' ? 'list-inside pr-4' : 'list-inside pl-4'} ${textColor}`}>
                  {proc.steps.map((step, idx) => <li key={idx}>{step}</li>)}
                </ol>
                {proc.lastReviewed && <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>{language === 'ar' ? 'آخر مراجعة:' : 'Last Reviewed:'} {new Date(proc.lastReviewed).toLocaleDateString(language)}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmergencyContactsProceduresView;
