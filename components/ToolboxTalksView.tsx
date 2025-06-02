
import React, { useState, FormEvent, useContext } from 'react';
import { useLanguageContext } from '../hooks/useLanguage';
import { ThemeContext } from '../contexts/ThemeContext';
import { ToastContext } from '../contexts/ToastContext';
import { ToolboxTalkItem } from '../types';
import { MOCK_TOOLBOX_TALKS } from '../constants';
import { PresentationChartBarIcon, PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';

const ToolboxTalksView: React.FC = () => {
  const { t, language } = useLanguageContext();
  const { theme } = useContext(ThemeContext);
  const { addToast } = useContext(ToastContext);

  const [talks, setTalks] = useState<ToolboxTalkItem[]>(MOCK_TOOLBOX_TALKS);
  const [topic, setTopic] = useState('');
  const [talkDate, setTalkDate] = useState(new Date().toISOString().split('T')[0]);
  const [presenter, setPresenter] = useState('');
  const [attendees, setAttendees] = useState(''); // Comma-separated string
  const [notes, setNotes] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('');
  const [location, setLocation] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || !talkDate || !presenter.trim()) {
      addToast(t('loginFailedError' as any, language === 'ar' ? 'من فضلك املأ الموضوع والتاريخ واسم المقدم.' : 'Please fill topic, date, and presenter fields.'), 'alert');
      return;
    }
    setIsSubmitting(true);
    const newTalk: ToolboxTalkItem = {
      id: `talk-${Date.now()}`,
      topic,
      date: new Date(talkDate + 'T00:00:00'), // Ensure it's parsed as local date
      presenter,
      attendees: attendees.split(',').map(s => s.trim()).filter(s => s),
      notes: notes.trim() || undefined,
      durationMinutes: durationMinutes ? parseInt(durationMinutes) : undefined,
      location: location.trim() || undefined,
    };
    setTimeout(() => {
      setTalks(prev => [newTalk, ...prev]);
      addToast(t('toolboxTalksAddTalk') + ' ' + t('statusSuccessMessage'), 'success');
      setTopic(''); setTalkDate(new Date().toISOString().split('T')[0]); setPresenter(''); 
      setAttendees(''); setNotes(''); setDurationMinutes(''); setLocation('');
      setIsSubmitting(false);
    }, 500);
  };

  const handleDeleteTalk = (id: string) => {
    if (window.confirm(t('confirmDeletePersonalTask' as any, language === 'ar' ? "متأكد عايز تمسح الحوار ده؟" : "Sure you want to delete this talk?"))) {
      setTalks(prev => prev.filter(talk => talk.id !== id));
      addToast(t('personalTaskDeletedSuccess' as any, language === 'ar' ? 'تم حذف الحوار!' : 'Talk deleted!'), 'info');
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
        <PresentationChartBarIcon className={`h-8 w-8 ${pageTitleColor} ${language === 'ar' ? 'ml-3' : 'mr-3'}`} />
        <h1 className={`text-2xl md:text-3xl font-bold ${pageTitleColor}`}>
          {t('toolboxTalksTitle')}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className={`p-5 md:p-6 rounded-xl shadow-xl mb-6 ${cardBg} border`}>
        <h2 className={`text-xl font-semibold mb-4 ${textColor}`}>{t('toolboxTalksAddTalk')}</h2>
        <div className="mb-4">
          <label htmlFor="talkTopic" className={labelClass}>{t('toolboxTalksTopic')}*</label>
          <input type="text" id="talkTopic" value={topic} onChange={e => setTopic(e.target.value)} className={`${inputBaseClasses} ${themedInputClasses}`} required />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="talkDate" className={labelClass}>{t('toolboxTalksDate')}*</label>
            <input type="date" id="talkDate" value={talkDate} onChange={e => setTalkDate(e.target.value)} className={`${inputBaseClasses} ${themedInputClasses}`} required />
          </div>
          <div>
            <label htmlFor="talkPresenter" className={labelClass}>{t('toolboxTalksPresenter')}*</label>
            <input type="text" id="talkPresenter" value={presenter} onChange={e => setPresenter(e.target.value)} className={`${inputBaseClasses} ${themedInputClasses}`} required />
          </div>
        </div>
        <div className="mb-4">
            <label htmlFor="talkAttendees" className={labelClass}>{t('toolboxTalksAttendees')}</label>
            <input type="text" id="talkAttendees" value={attendees} onChange={e => setAttendees(e.target.value)} placeholder={language === 'ar' ? 'أسماء الحضور مفصولة بفاصلة' : 'Comma-separated names'} className={`${inputBaseClasses} ${themedInputClasses}`} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
                <label htmlFor="talkDuration" className={labelClass}>{t('toolboxTalksDurationMinutes')}</label>
                <input type="number" id="talkDuration" value={durationMinutes} onChange={e => setDurationMinutes(e.target.value)} className={`${inputBaseClasses} ${themedInputClasses}`} />
            </div>
            <div>
                <label htmlFor="talkLocation" className={labelClass}>{t('toolboxTalksLocation')}</label>
                <input type="text" id="talkLocation" value={location} onChange={e => setLocation(e.target.value)} className={`${inputBaseClasses} ${themedInputClasses}`} />
            </div>
        </div>
        <div className="mb-6">
          <label htmlFor="talkNotes" className={labelClass}>{t('toolboxTalksNotes')}</label>
          <textarea id="talkNotes" value={notes} onChange={e => setNotes(e.target.value)} rows={3} className={`${inputBaseClasses} ${themedInputClasses}`} />
        </div>
        <button type="submit" className={submitButtonClasses} disabled={isSubmitting}>
          <PlusCircleIcon className="h-5 w-5" />
          {isSubmitting ? (language === 'ar' ? 'جاري التسجيل...' : 'Recording...') : t('toolboxTalksAddTalk')}
        </button>
      </form>

      {talks.length === 0 ? (
        <div className={`p-5 md:p-6 rounded-xl shadow-xl ${cardBg} border text-center`}>
            <p className={`${textColor} text-lg`}>{t('toolboxTalksNoTalks')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {talks.map(talk => (
            <div key={talk.id} className={`p-4 rounded-lg shadow-md ${cardBg} border`}>
              <div className="flex justify-between items-start mb-2">
                <h3 className={`text-md font-semibold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>{talk.topic}</h3>
                <button onClick={() => handleDeleteTalk(talk.id)} className={`p-1.5 rounded-md text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors`} title={t('deleteAction')}>
                    <TrashIcon className="h-4 w-4" />
                </button>
              </div>
              <p className={`text-sm ${textColor}`}>{t('toolboxTalksPresenter')}: {talk.presenter} | {t('toolboxTalksDate')}: {new Date(talk.date).toLocaleDateString(language)}</p>
              {talk.location && <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{t('toolboxTalksLocation')}: {talk.location}</p>}
              {talk.durationMinutes && <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{t('toolboxTalksDurationMinutes')}: {talk.durationMinutes}</p>}
              {talk.attendees.length > 0 && <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}><strong>{t('toolboxTalksAttendees')}:</strong> {talk.attendees.join(', ')}</p>}
              {talk.notes && <p className={`text-xs italic mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>{t('toolboxTalksNotes')}: {talk.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ToolboxTalksView;
