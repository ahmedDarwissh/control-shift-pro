
import React, { useState, useContext, useEffect } from 'react';
import { useLanguageContext } from '../hooks/useLanguage';
import { ThemeContext } from '../contexts/ThemeContext';
import { ToastContext } from '../contexts/ToastContext';
import { PetroWikiTerm, Language, TranslationSet } from '../types';
import { MOCK_PETRO_WIKI_TERMS } from '../constants';
import { AcademicCapIcon, MagnifyingGlassIcon, DocumentTextIcon, LightBulbIcon, XMarkIcon } from '@heroicons/react/24/outline';

const PetroWikiView: React.FC = () => {
  const { t, language } = useLanguageContext();
  const { theme } = useContext(ThemeContext);
  const { addToast } = useContext(ToastContext);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTerms, setFilteredTerms] = useState<PetroWikiTerm[]>(MOCK_PETRO_WIKI_TERMS);
  const [selectedTerm, setSelectedTerm] = useState<PetroWikiTerm | null>(null);
  
  const [selectedCategory, setSelectedCategory] = useState<string>(''); 
  const availableCategories = Array.from(new Set(MOCK_PETRO_WIKI_TERMS.map(term => term.category)));


  useEffect(() => {
    let results = MOCK_PETRO_WIKI_TERMS;
    if (searchTerm.trim() !== '') {
      results = results.filter(term =>
        term.acronym.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t(term.arabicName as keyof TranslationSet, term.arabicName).toLowerCase().includes(searchTerm.toLowerCase()) ||
        term.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t(term.comedicDescriptionKey as keyof TranslationSet, '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCategory) {
      results = results.filter(term => term.category === selectedCategory);
    }
    setFilteredTerms(results);
  }, [searchTerm, selectedCategory, t, language]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (filteredTerms.length === 0) {
        addToast(t('petroWikiNoResults'), 'info');
    }
  };

  const handleTermClick = (term: PetroWikiTerm) => {
    setSelectedTerm(term);
  };

  const handleCloseDetailCard = () => {
    setSelectedTerm(null);
  };
  
  const handleSaveTerm = (term: PetroWikiTerm) => {
    addToast(`${t('petroWikiSaveTermButton')} (${term.acronym}) - ${language === 'ar' ? 'قريباً يا فنان!' : 'Coming soon, artist!'}`, 'info');
  };

  const handleAskGenius = (term: PetroWikiTerm) => {
    addToast(`${t('petroWikiAskGeniusButton')} (${term.acronym}) - ${language === 'ar' ? 'قريباً يا خبير!' : 'Coming soon, expert!'}`, 'info');
    // Potentially navigate to PetroGeniusView with pre-filled question in future
  };

  const pageTitleColor = theme === 'dark' ? 'text-accent-orange' : 'text-accent-orange';
  const cardBg = theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const inputBaseClasses = "w-full p-3 border rounded-lg shadow-sm focus:ring-2 text-sm";
  const themedInputClasses = theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-600 focus:border-blue-600 placeholder-gray-400';
  const buttonClasses = `py-3 px-5 rounded-lg font-semibold text-sm transition-colors shadow-md hover:shadow-lg transform hover:scale-[1.02] ${theme === 'dark' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`;
  const tableHeaderBg = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100';
  const tableCellBorder = theme === 'dark' ? 'border-gray-600' : 'border-gray-300';
  const tableRowHover = theme === 'dark' ? 'hover:bg-gray-700/70' : 'hover:bg-gray-50/70';
  const detailCardBg = theme === 'dark' ? 'bg-dark-card' : 'bg-white';


  return (
    <div className={`p-2 md:p-4 animate-fadeInUp ${language === 'ar' ? 'font-cairo' : 'font-poppins'}`}>
      <div className="flex items-center mb-6">
        <AcademicCapIcon className={`h-8 w-8 ${pageTitleColor} ${language === 'ar' ? 'ml-3' : 'mr-3'}`} />
        <h1 className={`text-2xl md:text-3xl font-bold ${pageTitleColor}`}>{t('petroWikiTitle')}</h1>
      </div>
      <p className={`mb-6 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{t('petroWikiDescription')}</p>

      <form onSubmit={handleSearch} className={`p-5 md:p-6 rounded-xl shadow-xl mb-6 ${cardBg} border flex flex-col sm:flex-row gap-3 items-center`}>
        <div className="relative flex-grow w-full sm:w-auto">
            <div className={`absolute inset-y-0 ${language === 'ar' ? 'right-3' : 'left-3'} flex items-center pointer-events-none`}>
                <MagnifyingGlassIcon className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('petroWikiSearchPlaceholder')}
            className={`${inputBaseClasses} ${themedInputClasses} ${language === 'ar' ? 'pr-10' : 'pl-10'}`}
            />
        </div>
        <div className="w-full sm:w-auto sm:min-w-[150px]">
           <label htmlFor="categoryFilter" className="sr-only">{t('petroWikiCategoryFilterLabel')}</label>
           <select 
            id="categoryFilter" 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`${inputBaseClasses} ${themedInputClasses}`}
           >
             <option value="">{t('petroWikiCategoryAll')}</option>
             {availableCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option> 
             ))}
           </select>
        </div>
        <button type="submit" className={`${buttonClasses} w-full sm:w-auto`}>{t('petroWikiSearchButton')}</button>
      </form>

      <div className={`rounded-xl shadow-xl overflow-hidden ${cardBg} border`}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className={`${tableHeaderBg} ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              <tr>
                <th className="p-3 text-left">{t('petroWikiTableAcronym')}</th>
                <th className="p-3 text-left">{t('petroWikiTableArabicName')}</th>
                <th className="p-3 text-left">{t('petroWikiTableEnglishName')}</th>
                <th className="p-3 text-left">{t('petroWikiTableDiagram')}</th>
                <th className="p-3 text-left">{t('petroWikiTableComedicDesc')}</th>
              </tr>
            </thead>
            <tbody className={`${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'} ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              {filteredTerms.map(term => (
                <tr key={term.id} className={`${tableRowHover} cursor-pointer`} onClick={() => handleTermClick(term)}>
                  <td className={`p-3 whitespace-nowrap border-t ${tableCellBorder}`}>{term.acronym}</td>
                  <td className={`p-3 whitespace-nowrap border-t ${tableCellBorder}`}>{term.arabicName}</td>
                  <td className={`p-3 whitespace-nowrap border-t ${tableCellBorder}`}>{term.englishName}</td>
                  <td className={`p-3 border-t ${tableCellBorder}`}>
                    {term.imagePlaceholderUrl ? 
                        <img src={term.imagePlaceholderUrl} alt={term.acronym} className="h-10 w-auto rounded" /> : 
                        <DocumentTextIcon className="h-6 w-6 text-gray-400"/>
                    }
                  </td>
                  <td className={`p-3 border-t ${tableCellBorder} max-w-xs truncate`}>{t(term.comedicDescriptionKey)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredTerms.length === 0 && !searchTerm && (
            <p className={`p-4 text-center text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                {language === 'ar' ? 'ابدأ بكتابة مصطلح في البحث أعلاه يا فهلوي!' : 'Start typing a term in the search above, Fahlawy!'}
            </p>
        )}
        {filteredTerms.length === 0 && searchTerm && (
            <p className={`p-4 text-center text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>{t('petroWikiNoResults')}</p>
        )}
      </div>

      {selectedTerm && (
        <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fadeInUp"
            onClick={handleCloseDetailCard}
            role="dialog"
            aria-modal="true"
            aria-labelledby="petrowiki-term-title"
        >
          <div 
            className={`p-6 rounded-lg shadow-xl w-full max-w-lg ${detailCardBg} ${theme === 'dark' ? 'text-gray-200 border border-gray-700' : 'text-gray-800'} max-h-[80vh] overflow-y-auto`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
                <h3 id="petrowiki-term-title" className={`text-xl font-semibold ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`}>
                    {selectedTerm.acronym}: {selectedTerm.englishName} ({selectedTerm.arabicName})
                </h3>
                <button onClick={handleCloseDetailCard} className={`p-1 rounded-full ${theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`} aria-label={t('errorModalCloseButton' as keyof TranslationSet, 'Close')}>
                    <XMarkIcon className="h-5 w-5"/>
                </button>
            </div>
            {selectedTerm.imagePlaceholderUrl && (
                <img src={selectedTerm.imagePlaceholderUrl} alt={selectedTerm.acronym} className="w-1/2 mx-auto my-3 rounded-md shadow-md" />
            )}
            <p className="mb-2 text-sm"><strong>{t('petroWikiTableComedicDesc')}:</strong> <em className={`${language === 'ar' ? 'text-md' : 'text-sm'}`}>{t(selectedTerm.comedicDescriptionKey)}</em></p>
            <p className="mb-4 text-sm leading-relaxed"><strong>{t('petroWikiDetailedCardTitle')}:</strong> {t(selectedTerm.detailedDescriptionKey)}</p>
            
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t dark:border-gray-600">
                <button 
                    onClick={() => handleSaveTerm(selectedTerm)}
                    className={`py-2 px-4 text-xs font-medium rounded-md flex items-center gap-1.5 ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                >
                    <DocumentTextIcon className="h-4 w-4"/>{t('petroWikiSaveTermButton')}
                </button>
                <button 
                    onClick={() => handleAskGenius(selectedTerm)}
                    className={`py-2 px-4 text-xs font-medium rounded-md flex items-center gap-1.5 ${theme === 'dark' ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
                >
                    <LightBulbIcon className="h-4 w-4"/>{t('petroWikiAskGeniusButton')}
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetroWikiView;
