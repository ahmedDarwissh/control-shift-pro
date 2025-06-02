
import React, { useState, FormEvent, useContext } from 'react';
import { useLanguageContext } from '../hooks/useLanguage';
import { ThemeContext } from '../contexts/ThemeContext';
import { ToastContext } from '../contexts/ToastContext';
import { ShiftHandoverNoteItem, ShiftHandoverNoteCategory } from '../types';
import { MOCK_SHIFT_HANDOVER_NOTES } from '../constants';
import { ArrowsRightLeftIcon, PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';

const ShiftHandoverNotesView: React.FC = () => {
  const { t, language, translations } = useLanguageContext();
  const { theme } = useContext(ThemeContext);
  const { addToast } = useContext(ToastContext);

  const [notes, setNotes] = useState<ShiftHandoverNoteItem[]>(MOCK_SHIFT_HANDOVER_NOTES);
  const [fromTeam, setFromTeam] = useState('');
  const [toTeam, setToTeam] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [category, setCategory] = useState<ShiftHandoverNoteCategory>(ShiftHandoverNoteCategory.OutgoingGeneralNote);
  const [acknowledgedBy, setAcknowledgedBy] = useState('');
  const [followUpRequired, setFollowUpRequired] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!fromTeam.trim() || !toTeam.trim() || !noteContent.trim()) {
      addToast(t('loginFailedError' as any, language === 'ar' ? 'من فضلك املأ حقول الفرق ومحتوى الملاحظة.' : 'Please fill team fields and note content.'), 'alert');
      return;
    }
    setIsSubmitting(true);
    const newNote: ShiftHandoverNoteItem = {
      id: `shn-${Date.now()}`,
      fromTeamIdOrName: fromTeam,
      toTeamIdOrName: toTeam,
      note: noteContent,
      category,
      timestamp: new Date(),
      acknowledgedBy: acknowledgedBy.trim() || undefined,
      followUpRequired,
    };
    setTimeout(() => {
      setNotes(prev => [newNote, ...prev]);
      addToast(t('shiftHandoverNotesAddNote') + ' ' + t('statusSuccessMessage'), 'success');
      setFromTeam(''); setToTeam(''); setNoteContent(''); setCategory(ShiftHandoverNoteCategory.OutgoingGeneralNote);
      setAcknowledgedBy(''); setFollowUpRequired(false);
      setIsSubmitting(false);
    }, 500);
  };

  const handleDeleteNote = (id: string) => {
    if (window.confirm(t('confirmDeletePersonalTask' as any, language === 'ar' ? "متأكد عايز تمسح الملاحظة دي؟" : "Sure you want to delete this note?"))) {
      setNotes(prev => prev.filter(note => note.id !== id));
      addToast(t('personalTaskDeletedSuccess' as any, language === 'ar' ? 'تم حذف الملاحظة!' : 'Note deleted!'), 'info');
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
        <ArrowsRightLeftIcon className={`h-8 w-8 ${pageTitleColor} ${language === 'ar' ? 'ml-3' : 'mr-3'}`} />
        <h1 className={`text-2xl md:text-3xl font-bold ${pageTitleColor}`}>
          {t('shiftHandoverNotesTitle')}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className={`p-5 md:p-6 rounded-xl shadow-xl mb-6 ${cardBg} border`}>
        <h2 className={`text-xl font-semibold mb-4 ${textColor}`}>{t('shiftHandoverNotesAddNote')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="shnFromTeam" className={labelClass}>{t('shiftHandoverNotesFromTeam')}*</label>
            <input type="text" id="shnFromTeam" value={fromTeam} onChange={e => setFromTeam(e.target.value)} className={`${inputBaseClasses} ${themedInputClasses}`} required />
          </div>
          <div>
            <label htmlFor="shnToTeam" className={labelClass}>{t('shiftHandoverNotesToTeam')}*</label>
            <input type="text" id="shnToTeam" value={toTeam} onChange={e => setToTeam(e.target.value)} className={`${inputBaseClasses} ${themedInputClasses}`} required />
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="shnNoteContent" className={labelClass}>{t('shiftHandoverNotesNoteContent')}*</label>
          <textarea id="shnNoteContent" value={noteContent} onChange={e => setNoteContent(e.target.value)} rows={3} className={`${inputBaseClasses} ${themedInputClasses}`} required />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="shnCategory" className={labelClass}>{t('shiftHandoverNotesCategory')}</label>
            <select id="shnCategory" value={category} onChange={e => setCategory(e.target.value as ShiftHandoverNoteCategory)} className={`${inputBaseClasses} ${themedInputClasses}`}>
              {Object.entries(translations.shiftHandoverCategoryOptions).map(([key, val]) => <option key={key} value={key.charAt(0).toUpperCase() + key.slice(1) + 'Note'}>{val}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="shnAcknowledgedBy" className={labelClass}>{t('shiftHandoverNotesAcknowledgedBy')}</label>
            <input type="text" id="shnAcknowledgedBy" value={acknowledgedBy} onChange={e => setAcknowledgedBy(e.target.value)} className={`${inputBaseClasses} ${themedInputClasses}`} />
          </div>
        </div>
        <div className="mb-6">
            <label className="flex items-center">
                <input type="checkbox" checked={followUpRequired} onChange={e => setFollowUpRequired(e.target.checked)} 
                className={`form-checkbox h-5 w-5 rounded ${theme === 'dark' ? 'text-blue-500 bg-gray-600 border-gray-500' : 'text-blue-600 border-gray-300'} focus:ring-blue-500`} />
                <span className={`ml-2 rtl:mr-2 text-sm ${textColor}`}>{t('shiftHandoverNotesFollowUpRequired')}</span>
            </label>
        </div>
        <button type="submit" className={submitButtonClasses} disabled={isSubmitting}>
          <PlusCircleIcon className="h-5 w-5" />
          {isSubmitting ? (language === 'ar' ? 'جاري الإضافة...' : 'Adding...') : t('shiftHandoverNotesAddNote')}
        </button>
      </form>

      {notes.length === 0 ? (
        <div className={`p-5 md:p-6 rounded-xl shadow-xl ${cardBg} border text-center`}>
            <p className={`${textColor} text-lg`}>{language === 'ar' ? 'لا توجد ملاحظات تسليم حالياً.' : 'No handover notes currently.'}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notes.map(note => (
            <div key={note.id} className={`p-4 rounded-lg shadow-md ${cardBg} border`}>
              <div className="flex justify-between items-start mb-2">
                <h3 className={`text-md font-semibold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                  {t('shiftHandoverNotesFromTeam')}: {note.fromTeamIdOrName} &rarr; {t('shiftHandoverNotesToTeam')}: {note.toTeamIdOrName}
                </h3>
                <button onClick={() => handleDeleteNote(note.id)} className={`p-1.5 rounded-md text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors`} title={t('deleteAction')}>
                    <TrashIcon className="h-4 w-4" />
                </button>
              </div>
              <p className={`text-sm mb-1 ${textColor}`}>{note.note}</p>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                {t('shiftHandoverNotesCategory')}: {translations.shiftHandoverCategoryOptions[note.category as keyof typeof translations.shiftHandoverCategoryOptions] || note.category} | {new Date(note.timestamp).toLocaleString(language)}
                {note.acknowledgedBy && ` | ${t('shiftHandoverNotesAcknowledgedBy')}: ${note.acknowledgedBy}`}
                {note.followUpRequired && <span className={`ml-2 rtl:mr-2 px-2 py-0.5 text-xs rounded-full ${theme === 'dark' ? 'bg-yellow-600 text-yellow-100' : 'bg-yellow-200 text-yellow-800'}`}>{t('shiftHandoverNotesFollowUpRequired')}</span>}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShiftHandoverNotesView;
