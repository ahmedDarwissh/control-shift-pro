
import React, { useState, useContext, useRef } from 'react';
import { useLanguageContext } from '../hooks/useLanguage';
import { ThemeContext } from '../contexts/ThemeContext';
import { ToastContext } from '../contexts/ToastContext'; // UPDATED IMPORT
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { LightBulbIcon, WrenchScrewdriverIcon, SparklesIcon, DocumentArrowDownIcon, ShareIcon, PrinterIcon, CameraIcon } from '@heroicons/react/24/outline';
import { SmartMaintenanceEnhancementSuggestion, MaintenanceSolution, Language, TranslationSet } from '../types';

const API_KEY = process.env.API_KEY;
let ai: GoogleGenAI | null = null;
if (API_KEY) {
  try {
    ai = new GoogleGenAI({ apiKey: API_KEY });
  } catch (e) {
    console.error("Failed to initialize GoogleGenAI for Smart Maintenance Enhancer:", e);
    ai = null;
  }
}

interface SmartMaintenanceEnhancerViewProps {}

const SmartMaintenanceEnhancerView: React.FC<SmartMaintenanceEnhancerViewProps> = () => {
  const { t, language } = useLanguageContext();
  const { theme } = React.useContext(ThemeContext);
  const { addToast } = useContext(ToastContext);
  const solutionsContentRef = useRef<HTMLDivElement>(null);

  const [equipmentName, setEquipmentName] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [solutions, setSolutions] = useState<SmartMaintenanceEnhancementSuggestion | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetSolutions = async () => {
    if (!equipmentName.trim() || !problemDescription.trim()) {
      addToast(language === 'ar' ? 'يا أسطى، اسم المعدة ووصف المشكلة دول أساس الشغلانة!' : 'Boss, equipment name and problem description are essential!', 'alert');
      return;
    }
     if (!ai) {
      addToast(t('aiFeatureApiKeyMissing'), 'alert');
      setSolutions({
        fahlawy_diagnosis: language === 'ar' ? `*** تشخيص مبدئي من الفهلوي أبو العُريف ***\nيا هندسة، بالنسبة لموضوع "${equipmentName}" اللي بيشتكي من "${problemDescription}"، الحكاية شكلها محتاجة شوية فهلوة على السريع.` : `*** Initial Diagnosis from Fahlawy Abu Al-Oreef ***\nEngineer, regarding "${equipmentName}" which is complaining about "${problemDescription}", the story seems to need some quick fahlawa.`,
        recommended_solutions: [
          {
            solution_id: 'mock_sol_1',
            title: language === 'ar' ? "الحل الفهلواني الأول (تجريبي)" : "Mock Fahlawy Solution 1 (Demo)",
            description: language === 'ar' ? "جرب تخبط على الجهاز خبطتين تلاتة، يمكن يفوق ويرجع يشتغل زي الفل." : "Try tapping the device a couple of times, it might wake up and work perfectly.",
            estimated_time: language === 'ar' ? "٣٠ ثانية بالكتير" : "30 seconds max",
            required_tools: [language === 'ar' ? "إيدك الكريمة" : "Your esteemed hand"],
            safety_precautions: [language === 'ar' ? "ماتخبطش جامد لتبوظه أكتر!" : "Don't hit too hard, or you'll break it more!"],
            steps: [language === 'ar' ? "١. سمي الله." : "1. Say Bismillah.", language === 'ar' ? "٢. اخبط خبطتين بالعدد." : "2. Tap exactly twice."]
          },
          {
            solution_id: 'mock_sol_2',
            title: language === 'ar' ? "الحل السحري الثاني (تجريبي)" : "Mock Magical Solution 2 (Demo)",
            description: language === 'ar' ? "اعمل كوباية شاي بالنعناع واشربها بمزاج، وساعات المشاكل بتتحل لوحدها بعد روقان البال." : "Make a cup of mint tea and drink it calmly; sometimes problems solve themselves after a clear mind.",
            estimated_time: language === 'ar' ? "١٠ دقايق" : "10 minutes",
            steps: [language === 'ar' ? "١. اعمل شاي." : "1. Make tea.", language === 'ar' ? "٢. اشرب الشاي." : "2. Drink tea.", language === 'ar' ? "٣. بص على الجهاز تاني." : "3. Look at the device again."]
          }
        ],
        fahlawy_final_advice: language === 'ar' ? "نصيحة أخيرة من قلب الفهلوي: لو الحلول دي منفعتش، يبقى شغل الـAPI يا كبير عشان نجيب الكلام على بلاطة، أو اتصل بالصيانة هما أدرى." : "Final advice from the heart of Fahlawy: If these solutions don't work, then turn on the API, boss, to get the real deal, or call maintenance—they know better."
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setSolutions(null);

    const prompt = language === 'ar' ?
`يا بروفيسور الفهلوة في صيانة المعدات البترولية!
المعدة اللي اسمها "${equipmentName}" بتطلع عيننا بالمشكلة دي: "${problemDescription}".
مطلوب من معاليك روشتة صيانة فكاهية وعملية، بالأسلوب المصري الأصيل بتاعك اللي يوقع من الضحك.
الروشتة لازم تكون JSON صافي، مفيش قبله ولا بعده أي كلام تاني، وبالشكل ده بالظبط:
{
  "fahlawy_diagnosis": "تشخيصك المبدئي للمشكلة بأسلوب كوميدي مصري (مثال: دي شكلها واخدة عين جامدة، أو يمكن بس عايزة شوية تظبيط فهلوي).",
  "recommended_solutions": [
    {
      "solution_id": "unique_solution_id_1",
      "title": "عنوان كوميدي للحل الأول (مثال: وصفة التخليص السريع)",
      "description": "شرح الحل المقترح بالتفصيل الممل وبطريقة فكاهية وعملية.",
      "estimated_time": "الوقت المتوقع للتنفيذ (مثال: نص ساعة بالكتير)",
      "required_tools": ["قائمة بالأدوات المطلوبة (مثال: مفك عادة، شاكوش صغير)", "أداة تانية"],
      "safety_precautions": ["احتياطات السلامة المهمة (مثال: افصل الكهربا الأول يا بطل!)", "تحذير تاني"],
      "steps": ["الخطوة الأولى مفصلة", "الخطوة الثانية بتركيز", "الخطوة الثالثة والأخيرة"]
    },
    {
      "solution_id": "unique_solution_id_2",
      "title": "عنوان كوميدي للحل الثاني (مثال: خطة الإنقاذ الفهلوانية)",
      "description": "شرح حل مختلف ومبتكر، وبرضه فكاهي وعملي.",
      "estimated_time": "الوقت المتوقع",
      "required_tools": ["أدوات الحل التاني"],
      "safety_precautions": ["احتياطات الحل التاني"],
      "steps": ["خطوات الحل التاني بالترتيب"]
    }
  ],
  "fahlawy_final_advice": "نصيحتك الأخيرة والكلمة الختامية بأسلوبك الفكاهي الرنان (مثال: الخلاصة يا هندسة، لو بعد كل ده لسه بايظة، يبقى عليها العوض ومنها العوض، وكلم الوكيل يمكن يرضى يبدلها!)."
}
الأسلوب يكون مصري عامي ومضحك جداً. الإجابة JSON فقط لا غير.`
:
`Oh, Professor of Fahlawa in petroleum equipment maintenance!
The equipment named "${equipmentName}" is giving us a hard time with this problem: "${problemDescription}".
We need from Your Excellency a humorous and practical maintenance prescription, in your authentic Egyptian style that makes one die of laughter.
The prescription MUST be a pure JSON object, with no text before or after it, exactly in this format:
{
  "fahlawy_diagnosis": "Your initial comedic Egyptian-style diagnosis of the problem (e.g., This looks like it got a strong evil eye, or maybe it just needs some fahlawy adjustment).",
  "recommended_solutions": [
    {
      "solution_id": "unique_solution_id_1",
      "title": "Comedic title for the first solution (e.g., The Quick Fix Recipe)",
      "description": "Detailed explanation of the proposed solution in a tedious, humorous, and practical way.",
      "estimated_time": "Estimated time for execution (e.g., Half an hour at most)",
      "required_tools": ["List of required tools (e.g., Regular screwdriver, Small hammer)", "Another tool"],
      "safety_precautions": ["Important safety precautions (e.g., Unplug the electricity first, hero!)", "Another warning"],
      "steps": ["Detailed first step", "Focused second step", "Third and final step"]
    },
    {
      "solution_id": "unique_solution_id_2",
      "title": "Comedic title for the second solution (e.g., The Fahlawanic Rescue Plan)",
      "description": "Explanation of a different and innovative solution, also humorous and practical.",
      "estimated_time": "Estimated time",
      "required_tools": ["Tools for the second solution"],
      "safety_precautions": ["Precautions for the second solution"],
      "steps": ["Steps for the second solution in order"]
    }
  ],
  "fahlawy_final_advice": "Your final advice and concluding words in your resounding humorous style (e.g., The bottom line, engineer, if it's still broken after all this, then it's a lost cause, and call the agent, maybe they'll agree to replace it!)."
}
The style should be very funny Egyptian colloquial. JSON response only.`;

    try {
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      let jsonStr = response.text.trim();
      const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
      const match = jsonStr.match(fenceRegex);
      if (match && match[2]) {
        jsonStr = match[2].trim();
      }
      
      const parsedData = JSON.parse(jsonStr) as SmartMaintenanceEnhancementSuggestion;
      if (parsedData.fahlawy_diagnosis && parsedData.recommended_solutions && Array.isArray(parsedData.recommended_solutions)) {
        setSolutions(parsedData);
      } else {
        console.error("Invalid solutions data structure from AI:", parsedData);
        setError(t('smartMaintenanceEnhancerError'));
        addToast(t('smartMaintenanceEnhancerError'), 'alert');
      }
    } catch (err) {
      console.error("Error fetching solutions from AI:", err);
      setError(t('smartMaintenanceEnhancerError'));
      addToast(t('smartMaintenanceEnhancerError'), 'alert');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = (actionType: 'PDF' | 'Share' | 'Print' | 'Screenshot') => {
    let messageKey: keyof TranslationSet = 'statusSuccessMessage';
    let toastType: 'success' | 'info' | 'alert' = 'success';

    if (!solutions || !solutionsContentRef.current) {
        addToast(t('smartMaintenanceEnhancerNoSolutionsYet'), 'alert');
        return;
    }
    if (actionType === 'Screenshot') {
        messageKey = 'screenshotSuccess';
        toastType = 'info';
        addToast(t(messageKey) + " (" + (language === 'ar' ? "استخدم لقطة شاشة النظام لو سمحت." : "Please use your system's screenshot tool.") + ")", toastType);
        return;
    }
    
    const contentToPrint = solutionsContentRef.current.innerHTML;

    if (actionType === 'PDF' || actionType === 'Print') {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`<html><head><title>${t('smartMaintenanceEnhancerTitle')}</title>`);
            printWindow.document.write('<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">');
            printWindow.document.write(`<style>body{font-family:"Cairo",sans-serif;direction:${language === 'ar' ? 'rtl' : 'ltr'};padding:20px;margin:0;font-size:18px;line-height:1.8;} h3,h4{margin-bottom:0.5em;} h3{font-size:1.6em;color:#D97706;} h4{font-size:1.3em;color:#1E3A8A;} ul,ol{list-style-position:inside;padding-${language === 'ar' ? 'right' : 'left'}:20px;} .final-advice{font-style:italic;font-weight:bold;margin-top:1.5em;}</style></head><body>`);
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
        if (navigator.share && solutionsContentRef.current) {
            navigator.share({
                title: t('smartMaintenanceEnhancerTitle'),
                text: solutionsContentRef.current.innerText.substring(0, 200) + "...",
            }).then(() => {
                addToast(t('shareSuccess'), 'success');
            }).catch(console.error);
            return; 
        } else {
            messageKey = 'shareSuccess';
        }
    }
    addToast(t(messageKey), toastType);
  };

  const pageTitleColor = theme === 'dark' ? 'text-orange-400' : 'text-orange-500';
  const cardBg = theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const inputBaseClasses = "w-full p-3 border rounded-lg shadow-sm focus:ring-2 text-sm";
  const themedInputClasses = theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-600 focus:border-blue-600 placeholder-gray-400';
  const buttonClasses = `w-full py-3 px-5 rounded-lg font-semibold text-sm transition-colors shadow-md hover:shadow-lg transform hover:scale-[1.02] ${theme === 'dark' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`;
  const solutionsBoxBg = theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50/80';
  const solutionItemBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const solutionsTextColor = theme === 'dark' ? 'text-gray-200' : 'text-gray-800';
  const actionButtonClasses = `flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-medium transition-colors shadow-sm hover:shadow-md ${theme === 'dark' ? 'bg-gray-600 text-gray-200 hover:bg-gray-500' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`;
  const contentFontSize = language === 'ar' ? 'text-lg' : 'text-base';

  return (
    <div className={`p-2 md:p-4 ${language === 'ar' ? 'font-cairo' : 'font-poppins'}`}>
      <div className="flex items-center mb-6">
        <WrenchScrewdriverIcon className={`h-8 w-8 ${pageTitleColor} ${language === 'ar' ? 'ml-3' : 'mr-3'}`} />
        <h1 className={`text-2xl md:text-3xl font-bold ${pageTitleColor}`}>
          {t('smartMaintenanceEnhancerTitle')}
        </h1>
      </div>

      <div className={`p-5 md:p-6 rounded-xl shadow-xl mb-6 ${cardBg} border`}>
        <form onSubmit={(e) => { e.preventDefault(); handleGetSolutions(); }} className="space-y-4">
          <div>
            <label htmlFor="equipmentNameSME" className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{t('smartMaintenanceEnhancerEquipmentNameLabel')}</label>
            <input
              type="text"
              id="equipmentNameSME"
              value={equipmentName}
              onChange={(e) => setEquipmentName(e.target.value)}
              placeholder={t('smartMaintenanceEnhancerEquipmentNamePlaceholder')}
              className={`${inputBaseClasses} ${themedInputClasses}`}
            />
          </div>
          <div>
            <label htmlFor="problemDescriptionSME" className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{t('smartMaintenanceEnhancerProblemDescriptionLabel')}</label>
            <textarea
              id="problemDescriptionSME"
              rows={4}
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              placeholder={t('smartMaintenanceEnhancerProblemDescriptionPlaceholder')}
              className={`${inputBaseClasses} ${themedInputClasses}`}
            />
          </div>
          <button type="submit" className={buttonClasses} disabled={isLoading}>
            {isLoading ? (
              <><SparklesIcon className="h-5 w-5 inline animate-spin mr-2 rtl:ml-2" />{t('smartMaintenanceEnhancerLoadingSolutions')}</>
            ) : (
              <><LightBulbIcon className="h-5 w-5 inline mr-2 rtl:ml-2" />{t('smartMaintenanceEnhancerGetSolutionsButton')}</>
            )}
          </button>
        </form>
      </div>

      {(solutions || isLoading || error) && (
        <div className={`p-5 md:p-6 rounded-xl shadow-xl ${cardBg} border`}>
          {isLoading && <p className={`text-center py-4 text-sm ${solutionsTextColor}`}>{t('smartMaintenanceEnhancerLoadingSolutions')}...</p>}
          {error && <p className={`text-center py-4 text-sm text-red-500 dark:text-red-400`}>{error}</p>}
          {!isLoading && !solutions && !error && <p className={`text-center py-4 text-sm ${solutionsTextColor}`}>{t('smartMaintenanceEnhancerNoSolutionsYet')}</p>}
          
          {!isLoading && solutions && (
            <div ref={solutionsContentRef} className={`p-4 rounded-lg ${solutionsBoxBg} ${solutionsTextColor} ${contentFontSize} leading-relaxed`}>
              <div className="mb-6">
                <h3 className={`font-bold ${language === 'ar' ? 'text-xl' : 'text-lg'} mb-2 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>{t('smartMaintenanceEnhancerFahlawyDiagnosis')}</h3>
                <p className="italic">{solutions.fahlawy_diagnosis}</p>
              </div>

              <h3 className={`font-bold ${language === 'ar' ? 'text-xl' : 'text-lg'} mb-3 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>{t('smartMaintenanceEnhancerSolutionsTitle')}</h3>
              <div className="space-y-4 mb-6">
                {solutions.recommended_solutions.map((sol: MaintenanceSolution) => (
                  <div key={sol.solution_id} className={`p-4 rounded-md shadow ${solutionItemBg}`}>
                    <h4 className={`font-semibold ${language === 'ar' ? 'text-lg' : 'text-md'} mb-2 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`}>{sol.title}</h4>
                    <p className={`${language === 'ar' ? 'text-md' : 'text-sm'} mb-2`}>{sol.description}</p>
                    
                    {sol.estimated_time && <p className={`${language === 'ar' ? 'text-md' : 'text-sm'} mb-1`}><strong className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>{t('smartMaintenanceEnhancerEstimatedTime')}:</strong> {sol.estimated_time}</p>}
                    
                    {sol.required_tools && sol.required_tools.length > 0 && (
                        <div className="my-2">
                            <p className={`font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{t('smartMaintenanceEnhancerRequiredTools')}:</p>
                            <ul className={`list-disc list-inside space-y-0.5 ${language === 'ar' ? 'text-md pr-4' : 'text-sm pl-4'}`}>
                                {sol.required_tools.map((tool, i) => <li key={`tool-${i}`}>{tool}</li>)}
                            </ul>
                        </div>
                    )}
                    {sol.safety_precautions && sol.safety_precautions.length > 0 && (
                        <div className="my-2">
                            <p className={`font-medium mb-1 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>{t('smartMaintenanceEnhancerSafetyPrecautions')}:</p>
                            <ul className={`list-disc list-inside space-y-0.5 ${language === 'ar' ? 'text-md pr-4' : 'text-sm pl-4'} ${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-700'}`}>
                                {sol.safety_precautions.map((safety, i) => <li key={`safety-${i}`}>{safety}</li>)}
                            </ul>
                        </div>
                    )}
                     <div className="my-2">
                        <p className={`font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{t('smartMaintenanceEnhancerSteps')}:</p>
                        <ol className={`list-decimal list-inside space-y-0.5 ${language === 'ar' ? 'text-md pr-4' : 'text-sm pl-4'}`}>
                            {sol.steps.map((step, i) => <li key={`step-${i}`}>{step}</li>)}
                        </ol>
                    </div>
                  </div>
                ))}
              </div>
              
              <div>
                <h3 className={`font-bold ${language === 'ar' ? 'text-xl' : 'text-lg'} mb-2 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>{t('smartMaintenanceEnhancerFahlawyFinalAdvice')}</h3>
                <p className="italic">{solutions.fahlawy_final_advice}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-300 dark:border-gray-600 flex flex-wrap gap-2 sm:gap-3 justify-center">
                <button onClick={() => handleAction('PDF')} className={actionButtonClasses}><DocumentArrowDownIcon className="h-4 w-4"/> {t('smartMaintenanceEnhancerExportPDF')}</button>
                <button onClick={() => handleAction('Share')} className={actionButtonClasses}><ShareIcon className="h-4 w-4"/>{t('smartMaintenanceEnhancerShare')}</button>
                <button onClick={() => handleAction('Print')} className={actionButtonClasses}><PrinterIcon className="h-4 w-4"/>{t('smartMaintenanceEnhancerPrint')}</button>
                <button onClick={() => handleAction('Screenshot')} className={actionButtonClasses}><CameraIcon className="h-4 w-4"/>{t('smartMaintenanceEnhancerScreenshot')}</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SmartMaintenanceEnhancerView;
