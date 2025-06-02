
import React, { useState, useContext, useRef, useEffect } from 'react';
import { useLanguageContext } from '../hooks/useLanguage';
import { ThemeContext } from '../contexts/ThemeContext';
import { ToastContext } from '../contexts/ToastContext'; // UPDATED IMPORT
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { SparklesIcon, CogIcon as WrenchScrewdriverIcon, LightBulbIcon, DocumentArrowDownIcon, ShareIcon, PrinterIcon, CameraIcon, TrashIcon, ArrowPathIcon as RefreshIcon } from '@heroicons/react/24/outline'; // Using CogIcon as WrenchScrewdriverIcon
import { MaintenanceSearchHistoryItem, Language, TranslationSet } from '../types';

const API_KEY = process.env.API_KEY;
let ai: GoogleGenAI | null = null;
if (API_KEY) {
  try {
    ai = new GoogleGenAI({ apiKey: API_KEY });
  } catch (e) {
    console.error("Failed to initialize GoogleGenAI for Maintenance Guide:", e);
    ai = null;
  }
}

export const AiMaintenanceGuideView: React.FC = () => {
  const { t, language } = useLanguageContext();
  const { theme } = React.useContext(ThemeContext);
  const { addToast } = useContext(ToastContext);
  const stepsContentRef = useRef<HTMLDivElement>(null);

  const [equipmentName, setEquipmentName] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [maintenanceSteps, setMaintenanceSteps] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<MaintenanceSearchHistoryItem[]>([]);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('aiMaintenanceSearchHistory');
      if (storedHistory) {
        setSearchHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Failed to load search history from localStorage", e);
      localStorage.removeItem('aiMaintenanceSearchHistory'); 
    }
  }, []);

  const saveSearchToHistory = (equipment: string, problem: string) => {
    const newSearchItem: MaintenanceSearchHistoryItem = {
      id: `hist-${Date.now()}`,
      equipmentName: equipment,
      problemDescription: problem,
      timestamp: new Date()
    };
    setSearchHistory(prevHistory => {
      const updatedHistory = [newSearchItem, ...prevHistory].slice(0, 10); 
      try {
        localStorage.setItem('aiMaintenanceSearchHistory', JSON.stringify(updatedHistory));
      } catch (e) {
        console.error("Failed to save search history to localStorage", e);
      }
      return updatedHistory;
    });
  };

  const clearSearchHistory = () => {
    if(window.confirm(t('aiMaintenanceConfirmClearHistoryMessage'))) {
        setSearchHistory([]);
        localStorage.removeItem('aiMaintenanceSearchHistory');
        addToast(t('aiMaintenanceClearHistoryButton') + ' ' + t('statusSuccessMessage'), 'success');
    }
  };

  const useHistoryItem = (item: MaintenanceSearchHistoryItem) => {
    setEquipmentName(item.equipmentName);
    setProblemDescription(item.problemDescription);
    handleGetSteps(item.equipmentName, item.problemDescription);
  };


  const handleGetSteps = async (currentEquipmentName = equipmentName, currentProblemDescription = problemDescription) => {
    if (!currentEquipmentName.trim() || !currentProblemDescription.trim()) {
      addToast(language === 'ar' ? 'يا هندسة، اسم المعدة ووصف المشكلة لازم يتكتبوا الأول!' : 'Engineer, equipment name and problem description are required first!', 'alert');
      return;
    }
    if (!ai) {
      addToast(t('aiFeatureApiKeyMissing'), 'alert');
      // Provide mock steps if API key is missing
      setMaintenanceSteps([
        language === 'ar' ? '١. اتأكد إن المعدة متوصلة بالكهربا صح.' : '1. Ensure the equipment is properly connected to power.',
        language === 'ar' ? '٢. حاول تقفلها وتفتحها تاني (ساعات بتجيب نتيجة).' : '2. Try turning it off and on again (sometimes it works).',
        language === 'ar' ? '٣. لو لسه بايظة، كلم عم حسين بتاع الصيانة، هو فاهم شغله.' : '3. If still broken, call Uncle Hussein from maintenance, he knows his stuff.',
        language === 'ar' ? '٤. متنساش تقول للمشرف عشان يبقى في الصورة.' : '4. Don\'t forget to inform the supervisor to keep them in the loop.',
      ]);
      saveSearchToHistory(currentEquipmentName, currentProblemDescription);
      return;
    }

    setIsLoading(true);
    setError(null);
    setMaintenanceSteps([]);

    const prompt = language === Language.AR ?
      `يا فهلوي الصيانة، عندنا معدة اسمها "${currentEquipmentName}" بتعاني من المشكلة دي: "${currentProblemDescription}".\nاديني خطوات صيانة مفصلة وواضحة باللهجة المصرية العامية الكوميدية عشان أحل المشكلة دي. الخطوات تكون مرقمة، وكل خطوة في سطر لوحدها. متشكرين يا كبير الفهلوية!` :
      `Hey Maintenance Fahlawy, we have equipment named "${currentEquipmentName}" experiencing this problem: "${currentProblemDescription}".\nGive me detailed and clear maintenance steps in a comedic Egyptian colloquial Arabic to solve this issue. The steps should be numbered, and each step on its own line. Thanks, O Great Fahlawy!`;

    try {
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17",
        contents: prompt
      });
      const steps = response.text.split('\n').map(step => step.trim()).filter(step => step.length > 0);
      setMaintenanceSteps(steps);
      saveSearchToHistory(currentEquipmentName, currentProblemDescription);
    } catch (err) {
      console.error("Error fetching maintenance steps from AI:", err);
      setError(t('aiMaintenanceError'));
      addToast(t('aiMaintenanceError'), 'alert');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleGetSteps();
  };

  const handleAction = (actionType: 'PDF' | 'Share' | 'Print' | 'Screenshot') => {
    let messageKey: keyof TranslationSet = 'statusSuccessMessage';
    let toastType: 'success' | 'info' | 'alert' = 'success';

    if (maintenanceSteps.length === 0 || !stepsContentRef.current) {
        addToast(t('aiMaintenanceNoStepsYet'), 'alert');
        return;
    }
    if (actionType === 'Screenshot') {
        messageKey = 'screenshotSuccess';
        toastType = 'info';
        addToast(t(messageKey) + " (" + (language === 'ar' ? "استخدم لقطة شاشة النظام لو سمحت." : "Please use your system's screenshot tool.") + ")", toastType);
        return;
    }
    
    const contentToPrint = stepsContentRef.current.innerHTML;

    if (actionType === 'PDF' || actionType === 'Print') {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`<html><head><title>${t('aiMaintenanceStepsResultTitle')}</title>`);
            printWindow.document.write('<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">');
            printWindow.document.write(`<style>body{font-family:"Cairo",sans-serif;direction:${language === 'ar' ? 'rtl' : 'ltr'};padding:20px;margin:0;} h2{font-size:1.5em;color:#D97706;} ol{padding-${language === 'ar' ? 'right' : 'left'}:20px; line-height: 1.8;}</style></head><body>`);
            printWindow.document.write(contentToPrint);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.focus();
            if (actionType === 'Print') {
                 setTimeout(() => { if(printWindow) { printWindow.print(); printWindow.close(); } }, 250);
            }
            messageKey = actionType === 'PDF' ? 'exportSuccess' : 'printSuccess';
        } else {
            messageKey = 'featureUnderConstruction';
            toastType = 'alert';
        }
    } else if (actionType === 'Share') {
        if (navigator.share && stepsContentRef.current) {
            navigator.share({
                title: t('aiMaintenanceStepsResultTitle'),
                text: stepsContentRef.current.innerText.substring(0, 200) + "...",
            }).then(() => {
                addToast(t('shareSuccess'), 'success');
            }).catch(console.error);
            return; // Avoid double toast
        } else {
            messageKey = 'shareSuccess'; // Fallback if navigator.share is not available
        }
    }
    addToast(t(messageKey), toastType);
};


  const pageTitleColor = theme === 'dark' ? 'text-orange-400' : 'text-orange-500';
  const cardBg = theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const inputBaseClasses = "w-full p-3 border rounded-lg shadow-sm focus:ring-2 text-sm";
  const themedInputClasses = theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-600 focus:border-blue-600 placeholder-gray-400';
  const buttonClasses = `w-full py-3 px-5 rounded-lg font-semibold text-sm transition-colors shadow-md hover:shadow-lg transform hover:scale-[1.02] ${theme === 'dark' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`;
  const stepsBoxBg = theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50/80';
  const stepsTextColor = theme === 'dark' ? 'text-gray-200' : 'text-gray-800';
  const actionButtonClasses = `flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-medium transition-colors shadow-sm hover:shadow-md ${theme === 'dark' ? 'bg-gray-600 text-gray-200 hover:bg-gray-500' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`;


  return (
    <div className={`p-2 md:p-4 ${language === 'ar' ? 'font-cairo' : 'font-poppins'}`}>
      <div className="flex items-center mb-6">
        <WrenchScrewdriverIcon className={`h-8 w-8 ${pageTitleColor} ${language === 'ar' ? 'ml-3' : 'mr-3'}`} />
        <h1 className={`text-2xl md:text-3xl font-bold ${pageTitleColor}`}>
          {t('aiMaintenanceGuideTitle')}
        </h1>
      </div>

      <div className={`p-5 md:p-6 rounded-xl shadow-xl mb-6 ${cardBg} border`}>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label htmlFor="equipmentName" className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{t('aiMaintenanceEquipmentNameLabel')}</label>
            <input
              type="text"
              id="equipmentName"
              value={equipmentName}
              onChange={(e) => setEquipmentName(e.target.value)}
              placeholder={t('aiMaintenanceEquipmentNamePlaceholder')}
              className={`${inputBaseClasses} ${themedInputClasses}`}
            />
          </div>
          <div>
            <label htmlFor="problemDescription" className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{t('aiMaintenanceProblemDescriptionLabel')}</label>
            <textarea
              id="problemDescription"
              rows={3}
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              placeholder={t('aiMaintenanceProblemDescriptionPlaceholder')}
              className={`${inputBaseClasses} ${themedInputClasses}`}
            />
          </div>
          <button type="submit" className={buttonClasses} disabled={isLoading}>
            {isLoading ? (
              <><SparklesIcon className="h-5 w-5 inline animate-spin mr-2 rtl:ml-2" />{t('aiMaintenanceLoadingSteps')}</>
            ) : (
              <><LightBulbIcon className="h-5 w-5 inline mr-2 rtl:ml-2" />{t('aiMaintenanceGetStepsButton')}</>
            )}
          </button>
        </form>
      </div>
      
      {searchHistory.length > 0 && (
        <div className={`p-4 md:p-5 rounded-xl shadow-lg mb-6 ${cardBg} border`}>
            <div className="flex justify-between items-center mb-2">
                <h3 className={`text-md font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>{t('aiMaintenanceSearchHistoryTitle')}</h3>
                <button onClick={clearSearchHistory} className={`${actionButtonClasses} !text-xs !py-1 !px-2 ${theme === 'dark' ? '!bg-red-700/50 !hover:bg-red-600/50' : '!bg-red-100 !hover:bg-red-200'} !text-red-500 dark:!text-red-300`}><TrashIcon className="h-3.5 w-3.5"/> {t('aiMaintenanceClearHistoryButton')}</button>
            </div>
            <ul className="space-y-1.5 max-h-40 overflow-y-auto text-xs">
                {searchHistory.map(item => (
                    <li key={item.id} className={`p-2 rounded-md flex justify-between items-center ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'}`}>
                        <div className="truncate">
                            <span className={`font-medium ${stepsTextColor}`}>{item.equipmentName}:</span> <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{item.problemDescription.substring(0,50)}{item.problemDescription.length > 50 ? '...' : ''}</span>
                        </div>
                        <button onClick={() => useHistoryItem(item)} className={`${actionButtonClasses} !text-[10px] !py-0.5 !px-1.5 ml-2 rtl:mr-2`} title={t('aiMaintenanceUseFromHistory')}><RefreshIcon className="h-3 w-3"/></button>
                    </li>
                ))}
            </ul>
        </div>
      )}

      {(maintenanceSteps.length > 0 || isLoading || error) && (
        <div className={`p-5 md:p-6 rounded-xl shadow-xl ${cardBg} border`}>
          <h2 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
            {t('aiMaintenanceStepsResultTitle')}
          </h2>
          {isLoading && <p className={`text-center py-4 text-sm ${stepsTextColor}`}>{t('aiMaintenanceLoadingSteps')}...</p>}
          {error && <p className={`text-center py-4 text-sm text-red-500 dark:text-red-400`}>{error}</p>}
          {!isLoading && maintenanceSteps.length === 0 && !error && <p className={`text-center py-4 text-sm ${stepsTextColor}`}>{t('aiMaintenanceNoStepsYet')}</p>}
          
          {!isLoading && maintenanceSteps.length > 0 && (
            <>
                <div ref={stepsContentRef} className={`p-4 rounded-lg ${stepsBoxBg} ${stepsTextColor}`}>
                    <ol className={`list-decimal space-y-2 ${language === 'ar' ? 'pr-6 text-lg' : 'pl-6 text-base'} leading-relaxed`}>
                    {maintenanceSteps.map((step, index) => (
                        <li key={index} className="mb-1">{step}</li>
                    ))}
                    </ol>
                </div>
                 <div className="mt-6 pt-4 border-t border-gray-300 dark:border-gray-600 flex flex-wrap gap-2 sm:gap-3 justify-center">
                    <button onClick={() => handleAction('PDF')} className={actionButtonClasses}><DocumentArrowDownIcon className="h-4 w-4"/> {t('aiMaintenanceExportPDF')}</button>
                    <button onClick={() => handleAction('Share')} className={actionButtonClasses}><ShareIcon className="h-4 w-4"/>{t('aiMaintenanceShare')}</button>
                    <button onClick={() => handleAction('Print')} className={actionButtonClasses}><PrinterIcon className="h-4 w-4"/>{t('aiMaintenancePrint')}</button>
                    <button onClick={() => handleAction('Screenshot')} className={actionButtonClasses}><CameraIcon className="h-4 w-4"/>{t('aiMaintenanceScreenshot')}</button>
                </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
