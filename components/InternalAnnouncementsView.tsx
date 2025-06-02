
import React, { useState, FormEvent, useContext } from 'react';
import { useLanguageContext } from '../hooks/useLanguage';
import { ThemeContext } from '../contexts/ThemeContext';
import { ToastContext } from '../contexts/ToastContext';
import { InternalAnnouncementItem } from '../types';
import { MOCK_INTERNAL_ANNOUNCEMENTS } from '../constants';
import { NewspaperIcon, PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';

const InternalAnnouncementsView: React.FC = () => {
  const { t, language } = useLanguageContext();
  const { theme } = useContext(ThemeContext);
  const { addToast } = useContext(ToastContext);

  const [announcements, setAnnouncements] = useState<InternalAnnouncementItem[]>(MOCK_INTERNAL_ANNOUNCEMENTS);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [postedBy, setPostedBy] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [departmentScope, setDepartmentScope] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !postedBy.trim()) {
      addToast(t('loginFailedError' as any, language === 'ar' ? 'من فضلك املأ العنوان والمحتوى واسم الناشر.' : 'Please fill title, content, and posted by fields.'), 'alert');
      return;
    }
    setIsSubmitting(true);
    const newAnnouncement: InternalAnnouncementItem = {
      id: `ann-${Date.now()}`,
      title,
      content,
      postedBy,
      timestamp: new Date(),
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
      departmentScope: departmentScope.split(',').map(s => s.trim()).filter(s => s),
      isUrgent,
    };
    setTimeout(() => {
      setAnnouncements(prev => [newAnnouncement, ...prev]);
      addToast(t('internalAnnouncementsAdd') + ' ' + t('statusSuccessMessage'), 'success');
      setTitle(''); setContent(''); setPostedBy(''); setExpiryDate(''); setDepartmentScope(''); setIsUrgent(false);
      setIsSubmitting(false);
    }, 500);
  };

  const handleDeleteAnnouncement = (id: string) => {
    if (window.confirm(t('confirmDeletePersonalTask' as any, language === 'ar' ? "متأكد عايز تمسح الإعلان ده؟" : "Sure you want to delete this announcement?"))) {
      setAnnouncements(prev => prev.filter(ann => ann.id !== id));
      addToast(t('personalTaskDeletedSuccess' as any, language === 'ar' ? 'تم حذف الإعلان!' : 'Announcement deleted!'), 'info');
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
        <NewspaperIcon className={`h-8 w-8 ${pageTitleColor} ${language === 'ar' ? 'ml-3' : 'mr-3'}`} />
        <h1 className={`text-2xl md:text-3xl font-bold ${pageTitleColor}`}>
          {t('internalAnnouncementsTitle')}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className={`p-5 md:p-6 rounded-xl shadow-xl mb-6 ${cardBg} border`}>
        <h2 className={`text-xl font-semibold mb-4 ${textColor}`}>{t('internalAnnouncementsAdd')}</h2>
        <div className="mb-4">
          <label htmlFor="annTitle" className={labelClass}>{t('internalAnnouncementsAnnouncementTitle')}*</label>
          <input type="text" id="annTitle" value={title} onChange={e => setTitle(e.target.value)} className={`${inputBaseClasses} ${themedInputClasses}`} required />
        </div>
        <div className="mb-4">
          <label htmlFor="annContent" className={labelClass}>{t('internalAnnouncementsContent')}*</label>
          <textarea id="annContent" value={content} onChange={e => setContent(e.target.value)} rows={4} className={`${inputBaseClasses} ${themedInputClasses}`} required />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="annPostedBy" className={labelClass}>{t('internalAnnouncementsPostedBy')}*</label>
            <input type="text" id="annPostedBy" value={postedBy} onChange={e => setPostedBy(e.target.value)} className={`${inputBaseClasses} ${themedInputClasses}`} required />
          </div>
          <div>
            <label htmlFor="annExpiryDate" className={labelClass}>{t('internalAnnouncementsExpiryDate')}</label>
            <input type="date" id="annExpiryDate" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} className={`${inputBaseClasses} ${themedInputClasses}`} />
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="annDeptScope" className={labelClass}>{t('internalAnnouncementsDepartmentScope')}</label>
          <input type="text" id="annDeptScope" value={departmentScope} onChange={e => setDepartmentScope(e.target.value)} placeholder={language === 'ar' ? 'مثال: الصيانة, التشغيل (اترك فارغاً للكل)' : 'e.g., Maintenance, Operations (leave blank for all)'} className={`${inputBaseClasses} ${themedInputClasses}`} />
        </div>
        <div className="mb-6">
            <label className="flex items-center">
                <input type="checkbox" checked={isUrgent} onChange={e => setIsUrgent(e.target.checked)} 
                className={`form-checkbox h-5 w-5 rounded ${theme === 'dark' ? 'text-red-500 bg-gray-600 border-gray-500' : 'text-red-600 border-gray-300'} focus:ring-red-500`} />
                <span className={`ml-2 rtl:mr-2 text-sm ${textColor}`}>{t('internalAnnouncementsIsUrgent')}</span>
            </label>
        </div>
        <button type="submit" className={submitButtonClasses} disabled={isSubmitting}>
          <PlusCircleIcon className="h-5 w-5" />
          {isSubmitting ? (language === 'ar' ? 'جاري النشر...' : 'Posting...') : t('internalAnnouncementsAdd')}
        </button>
      </form>

      {announcements.length === 0 ? (
        <div className={`p-5 md:p-6 rounded-xl shadow-xl ${cardBg} border text-center`}>
            <p className={`${textColor} text-lg`}>{t('internalAnnouncementsNoAnnouncements')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map(ann => (
            <div key={ann.id} className={`p-4 rounded-lg shadow-md ${cardBg} border ${ann.isUrgent ? (theme === 'dark' ? 'border-l-4 border-red-500' : 'border-l-4 border-red-600') : (theme === 'dark' ? 'border-l-4 border-blue-500' : 'border-l-4 border-blue-600')}`}>
              <div className="flex justify-between items-start mb-1">
                <h3 className={`text-md font-semibold ${ann.isUrgent ? (theme === 'dark' ? 'text-red-400' : 'text-red-600') : (theme === 'dark' ? 'text-blue-400' : 'text-blue-600')}`}>{ann.title}</h3>
                <button onClick={() => handleDeleteAnnouncement(ann.id)} className={`p-1.5 rounded-md text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors`} title={t('deleteAction')}>
                    <TrashIcon className="h-4 w-4" />
                </button>
              </div>
              <p className={`text-sm mb-2 whitespace-pre-wrap ${textColor}`}>{ann.content}</p>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                {t('internalAnnouncementsPostedBy')}: {ann.postedBy} | {new Date(ann.timestamp).toLocaleString(language)}
                {ann.expiryDate && ` | ${t('internalAnnouncementsExpiryDate')}: ${new Date(ann.expiryDate).toLocaleDateString(language)}`}
              </p>
              {ann.departmentScope && ann.departmentScope.length > 0 && (
                <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                    {t('internalAnnouncementsDepartmentScope')}: {ann.departmentScope.join(', ')}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InternalAnnouncementsView;
