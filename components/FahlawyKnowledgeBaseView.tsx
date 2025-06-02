
import React, { useState, FormEvent, useContext } from 'react';
import { useLanguageContext } from '../hooks/useLanguage';
import { ThemeContext } from '../contexts/ThemeContext';
import { ToastContext } from '../contexts/ToastContext';
import { KnowledgeBaseTipItem } from '../types'; // Corrected import
import { MOCK_KNOWLEDGE_BASE_TIPS } from '../constants'; // Corrected import
import { AcademicCapIcon, PlusCircleIcon, TrashIcon, TagIcon } from '@heroicons/react/24/outline';

const FahlawyKnowledgeBaseView: React.FC = () => {
  const { t, language, translations } = useLanguageContext();
  const { theme } = useContext(ThemeContext);
  const { addToast } = useContext(ToastContext);

  const [tips, setTips] = useState<KnowledgeBaseTipItem[]>(MOCK_KNOWLEDGE_BASE_TIPS);
  const [title, setTitle] = useState('');
  const [tipContent, setTipContent] = useState('');
  const [category, setCategory] = useState<string>('Troubleshooting'); // Default category
  const [submittedBy, setSubmittedBy] = useState('');
  const [tags, setTags] = useState(''); // Comma-separated string

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !tipContent.trim()) {
      addToast(t('loginFailedError' as any, language === 'ar' ? 'من فضلك املأ عنوان ومحتوى النصيحة.' : 'Please fill title and tip content.'), 'alert');
      return;
    }
    setIsSubmitting(true);
    const newTip: KnowledgeBaseTipItem = {
      id: `fkt-${Date.now()}`,
      title,
      tip: tipContent,
      category,
      submittedBy: submittedBy.trim() || (language === 'ar' ? 'فهلوي مجهول' : 'Anonymous Fahlawy'),
      timestamp: new Date(),
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      upvotes: 0,
    };
    setTimeout(() => {
      setTips(prev => [newTip, ...prev]);
      addToast(t('knowledgeBaseAddTip') + ' ' + t('statusSuccessMessage'), 'success');
      setTitle(''); setTipContent(''); setCategory('Troubleshooting'); setSubmittedBy(''); setTags('');
      setIsSubmitting(false);
    }, 500);
  };

  const handleDeleteTip = (id: string) => {
    if (window.confirm(t('confirmDeletePersonalTask' as any, language === 'ar' ? "متأكد عايز تمسح النصيحة دي؟" : "Sure you want to delete this tip?"))) {
      setTips(prev => prev.filter(tip => tip.id !== id));
      addToast(t('personalTaskDeletedSuccess' as any, language === 'ar' ? 'تم حذف النصيحة!' : 'Tip deleted!'), 'info');
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
        <AcademicCapIcon className={`h-8 w-8 ${pageTitleColor} ${language === 'ar' ? 'ml-3' : 'mr-3'}`} />
        <h1 className={`text-2xl md:text-3xl font-bold ${pageTitleColor}`}>
          {t('knowledgeBaseTitle')}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className={`p-5 md:p-6 rounded-xl shadow-xl mb-6 ${cardBg} border`}>
        <h2 className={`text-xl font-semibold mb-4 ${textColor}`}>{t('knowledgeBaseAddTip')}</h2>
        <div className="mb-4">
          <label htmlFor="fktTitle" className={labelClass}>{t('knowledgeBaseTipTitle')}*</label>
          <input type="text" id="fktTitle" value={title} onChange={e => setTitle(e.target.value)} className={`${inputBaseClasses} ${themedInputClasses}`} required />
        </div>
        <div className="mb-4">
          <label htmlFor="fktTipContent" className={labelClass}>{t('knowledgeBaseTipContent')}*</label>
          <textarea id="fktTipContent" value={tipContent} onChange={e => setTipContent(e.target.value)} rows={4} className={`${inputBaseClasses} ${themedInputClasses}`} required />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="fktCategory" className={labelClass}>{t('knowledgeBaseCategory')}</label>
            <select id="fktCategory" value={category} onChange={e => setCategory(e.target.value)} className={`${inputBaseClasses} ${themedInputClasses}`}>
              {Object.entries(translations.knowledgeCategoryOptions).map(([key, val]) => <option key={key} value={key.charAt(0).toUpperCase() + key.slice(1)}>{val}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="fktSubmittedBy" className={labelClass}>{t('knowledgeBaseSubmittedBy')}</label>
            <input type="text" id="fktSubmittedBy" value={submittedBy} onChange={e => setSubmittedBy(e.target.value)} placeholder={language === 'ar' ? 'اسم الفهلوي (اختياري)' : 'Fahlawy Name (Optional)'} className={`${inputBaseClasses} ${themedInputClasses}`} />
          </div>
        </div>
        <div className="mb-6">
          <label htmlFor="fktTags" className={labelClass}>{t('knowledgeBaseTags')}</label>
          <input type="text" id="fktTags" value={tags} onChange={e => setTags(e.target.value)} placeholder={language === 'ar' ? 'مثال: صمام, تسريب, حل سريع' : 'e.g., valve, leak, quickfix'} className={`${inputBaseClasses} ${themedInputClasses}`} />
        </div>
        <button type="submit" className={submitButtonClasses} disabled={isSubmitting}>
          <PlusCircleIcon className="h-5 w-5" />
          {isSubmitting ? (language === 'ar' ? 'جاري الإضافة...' : 'Adding...') : t('knowledgeBaseAddTip')}
        </button>
      </form>

      {tips.length === 0 ? (
        <div className={`p-5 md:p-6 rounded-xl shadow-xl ${cardBg} border text-center`}>
            <p className={`${textColor} text-lg`}>{t('knowledgeBaseNoTips')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tips.map(tip => (
            <div key={tip.id} className={`p-4 rounded-lg shadow-md ${cardBg} border`}>
              <div className="flex justify-between items-start mb-2">
                <h3 className={`text-md font-semibold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>{tip.title}</h3>
                <button onClick={() => handleDeleteTip(tip.id)} className={`p-1.5 rounded-md text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors`} title={t('deleteAction')}>
                    <TrashIcon className="h-4 w-4" />
                </button>
              </div>
              <p className={`text-sm mb-2 ${textColor}`}>{tip.tip}</p>
              <div className={`text-xs flex flex-wrap gap-x-3 gap-y-1 items-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                <span>{t('knowledgeBaseCategory')}: <span className="font-medium">{translations.knowledgeCategoryOptions[tip.category as keyof typeof translations.knowledgeCategoryOptions] || tip.category}</span></span>
                {tip.submittedBy && <span>{t('knowledgeBaseSubmittedBy')}: {tip.submittedBy}</span>}
                <span>{new Date(tip.timestamp).toLocaleDateString(language)}</span>
              </div>
              {tip.tags && tip.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {tip.tags.map((tag, idx) => (
                    <span key={idx} className={`px-2 py-0.5 text-[10px] rounded-full ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                      <TagIcon className="h-3 w-3 inline mr-1 rtl:ml-1"/>{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FahlawyKnowledgeBaseView;
