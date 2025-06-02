
import React, { useState, useContext, useRef } from 'react';
import { useLanguageContext } from '../hooks/useLanguage';
import { ThemeContext } from '../contexts/ThemeContext';
import { ToastContext } from '../contexts/ToastContext';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { SparklesIcon, LightBulbIcon, DocumentArrowDownIcon, ShareIcon, PrinterIcon, CameraIcon, PaperAirplaneIcon, UserIcon, CogIcon } from '@heroicons/react/24/outline';
import { Language, TranslationSet } from '../types';

const API_KEY = process.env.API_KEY;
let ai: GoogleGenAI | null = null;
if (API_KEY) {
  try {
    ai = new GoogleGenAI({ apiKey: API_KEY });
  } catch (e) {
    console.error("Failed to initialize GoogleGenAI for PetroGeniusView:", e);
    ai = null;
  }
}

interface PetroGeniusResponse {
  explanation: string;
  steps?: string[];
  safety_warnings?: string[];
  imageUrl?: string; 
}

const PetroGeniusView: React.FC = () => {
  const { t, language } = useLanguageContext();
  const { theme } = useContext(ThemeContext);
  const { addToast } = useContext(ToastContext);
  const responseContentRef = useRef<HTMLDivElement>(null);

  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<PetroGeniusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEngineerMode, setIsEngineerMode] = useState(false);

  const handleAskPetroGenius = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) {
      addToast(t('petroGeniusQuestionPlaceholder'), 'alert');
      return;
    }
    if (!ai) {
      addToast(t('aiFeatureApiKeyMissing'), 'alert');
      setApiResponse({
        explanation: t('petroGeniusSampleResponseIntro'),
        steps: [t('petroGeniusSampleResponseStep1'), t('petroGeniusSampleResponseStep2')],
        safety_warnings: [t('petroGeniusSampleResponseSafety')],
        imageUrl: "https://via.placeholder.com/300x200.png?text=Mock+Diagram"
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setApiResponse(null);

    const modeContext = isEngineerMode ? (language === Language.AR ? "الرد موجه لمهندس." : "The response is for an engineer.") : (language === Language.AR ? "الرد موجه لفني." : "The response is for a technician.");

    const prompt = language === Language.AR ?
`يا خبير بتروتك الفذ، بصفتك "الخبير البترولچي"، جالي سؤال من مستخدم بيقول: "${question}". ${modeContext}
المطلوب شرح مفصل للموضوع ده باللهجة المصرية العامية الكوميدية، مع شوية فكاهة كده عشان المعلومة توصل بسهولة.
لو السؤال عن صيانة أو تشغيل، اديني خطوات مرتبة وواضحة (تحت عنوان "الخطوات الفهلوية:").
وماتنساش تحذيرات السلامة المهمة (تحت عنوان "تحذيرات السلامة يا ريس:").
الشرح يكون مبسط.
الرد يكون JSON فقط بالصيغة دي:
{
  "explanation": "الشرح الكوميدي هنا...",
  "steps": ["الخطوة ١...", "الخطوة ٢..."],
  "safety_warnings": ["تحذير ١...", "تحذير ٢..."]
}`
      :
`Oh mighty Petro-Tech expert, as "PetroGenius", a user asks: "${question}". ${modeContext}
Provide a detailed explanation in comedic Egyptian colloquial Arabic.
If about maintenance/operation, give clear, numbered steps (heading "الخطوات الفهلوية:").
Include important safety warnings (heading "تحذيرات السلامة يا ريس:").
Simplify for engineers/technicians.
Respond ONLY with JSON in this format:
{
  "explanation": "Comedic explanation here...",
  "steps": ["Step 1...", "Step 2..."],
  "safety_warnings": ["Warning 1...", "Warning 2..."]
}`;

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

      const parsedData = JSON.parse(jsonStr) as PetroGeniusResponse;
      if (parsedData.explanation) {
        setApiResponse({ ...parsedData, imageUrl: "https://via.placeholder.com/300x200.png?text=AI+Diagram+Placeholder" });
      } else {
        throw new Error("Invalid response structure from AI");
      }
    } catch (err) {
      console.error("Error fetching response from PetroGenius AI:", err);
      setError(t('petroGeniusErrorResponse'));
      addToast(t('petroGeniusErrorResponse'), 'alert');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAction = (actionType: 'PDF' | 'Share' | 'Print' | 'Screenshot') => {
    let messageKey: keyof TranslationSet = 'statusSuccessMessage';
    let toastType: 'success' | 'info' | 'alert' = 'success';

    if (!apiResponse || !responseContentRef.current) {
        addToast(t('aiMaintenanceNoStepsYet' as keyof TranslationSet, 'No explanation to perform action on.'), 'alert');
        return;
    }
     if (actionType === 'Screenshot') {
        messageKey = 'screenshotSuccess';
        toastType = 'info';
        addToast(t(messageKey) + " (" + (language === 'ar' ? "استخدم لقطة شاشة النظام لو سمحت." : "Please use your system's screenshot tool.") + ")", toastType);
        return;
    }
    
    const contentToPrint = responseContentRef.current.innerHTML;

    if (actionType === 'PDF' || actionType === 'Print') {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`<html><head><title>${t('petroGeniusTitle')}</title>`);
            printWindow.document.write('<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">');
            printWindow.document.write(`<style>body{font-family:"Cairo",sans-serif;direction:${language === 'ar' ? 'rtl' : 'ltr'};padding:20px;margin:0;font-size:16px;line-height:1.8;} h2,h3{margin-bottom:0.5em;} h2{font-size:1.5em;color:#D97706;} h3{font-size:1.2em;color:#1E3A8A;} ol,ul{padding-${language === 'ar' ? 'right' : 'left'}:20px;} img{max-width:100%;height:auto;margin:10px 0;border:1px solid #EEE;}</style></head><body>`);
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
        if (navigator.share && responseContentRef.current) {
            navigator.share({
                title: t('petroGeniusTitle'),
                text: responseContentRef.current.innerText.substring(0, 200) + "...",
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
  
  const handleSaveExplanation = () => {
    addToast(t('petroGeniusSaveExplanationButton') + " - " + t('comingSoon'), 'info');
  };

  const pageTitleColor = theme === 'dark' ? 'text-accent-orange' : 'text-accent-orange';
  const cardBg = theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const inputBaseClasses = "w-full p-3 border rounded-lg shadow-sm focus:ring-2 text-sm";
  const themedInputClasses = theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-600 focus:border-blue-600 placeholder-gray-400';
  const buttonClasses = `py-3 px-5 rounded-lg font-semibold text-sm transition-colors shadow-md hover:shadow-lg transform hover:scale-[1.02] ${theme === 'dark' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`;
  const responseBoxBg = theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50/80';
  const responseTextColor = theme === 'dark' ? 'text-gray-200' : 'text-gray-800';
  const actionButtonClasses = `flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-medium transition-colors shadow-sm hover:shadow-md ${theme === 'dark' ? 'bg-gray-600 text-gray-200 hover:bg-gray-500' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`;
  const contentFontSize = language === 'ar' ? 'text-lg' : 'text-base';

  return (
    <div className={`p-2 md:p-4 animate-fadeInUp ${language === 'ar' ? 'font-cairo' : 'font-poppins'}`}>
      <div className="flex items-center mb-6">
        <LightBulbIcon className={`h-8 w-8 ${pageTitleColor} ${language === 'ar' ? 'ml-3' : 'mr-3'}`} />
        <h1 className={`text-2xl md:text-3xl font-bold ${pageTitleColor}`}>{t('petroGeniusTitle')}</h1>
      </div>
      <p className={`mb-6 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{t('petroGeniusDescription')}</p>

      <form onSubmit={handleAskPetroGenius} className={`p-5 md:p-6 rounded-xl shadow-xl mb-6 ${cardBg} border`}>
        <div className="mb-4">
          <label htmlFor="petroQuestion" className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{language === 'ar' ? 'سؤالك للفهلوى:' : 'Your Question for El-Fahlawy:'}</label>
          <textarea
            id="petroQuestion"
            rows={3}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={t('petroGeniusQuestionPlaceholder')}
            className={`${inputBaseClasses} ${themedInputClasses}`}
          />
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
            <div className="flex items-center">
                <span className={`text-xs mr-2 rtl:ml-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{t('petroGeniusModeToggleTechnician')}</span>
                <label htmlFor="modeToggle" className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="modeToggle" className="sr-only peer" checked={isEngineerMode} onChange={() => setIsEngineerMode(!isEngineerMode)} />
                    <div className={`w-11 h-6 rounded-full peer ${theme === 'dark' ? 'bg-gray-600 peer-focus:ring-blue-800' : 'bg-gray-300 peer-focus:ring-blue-300'} peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] rtl:peer-checked:after:-translate-x-full after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${theme === 'dark' ? 'peer-checked:bg-blue-600' : 'peer-checked:bg-blue-500'}`}></div>
                </label>
                 <span className={`text-xs ml-2 rtl:mr-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{t('petroGeniusModeToggleEngineer')}</span>
            </div>
            <button 
              type="button" 
              onClick={() => addToast(t('petroGeniusVoiceInputButton') + " - " + t('comingSoon'), 'info')} 
              className={`${actionButtonClasses} w-full sm:w-auto`}
            >
              {t('petroGeniusVoiceInputButton')}
            </button>
        </div>
        <button type="submit" className={buttonClasses} disabled={isLoading}>
          {isLoading ? (
            <><SparklesIcon className="h-5 w-5 inline animate-spin mr-2 rtl:ml-2" />{t('petroGeniusLoadingResponse')}</>
          ) : (
            <><PaperAirplaneIcon className="h-5 w-5 inline mr-2 rtl:ml-2 transform rtl:rotate-180" />{t('petroGeniusAskButton')}</>
          )}
        </button>
      </form>

      {(apiResponse || isLoading || error) && (
        <div className={`p-5 md:p-6 rounded-xl shadow-xl ${cardBg} border`}>
          {isLoading && <p className={`text-center py-4 text-sm ${responseTextColor}`}>{t('petroGeniusLoadingResponse')}...</p>}
          {error && <p className={`text-center py-4 text-sm text-red-500 dark:text-red-400`}>{error}</p>}
          {!isLoading && !apiResponse && !error && <p className={`text-center py-4 text-sm ${responseTextColor}`}>{language === 'ar' ? 'في انتظار سؤالك الفهلوي...' : 'Awaiting your fahlawy question...'}</p>}
          
          {!isLoading && apiResponse && (
            <div ref={responseContentRef}>
              <p className={`mb-4 ${responseTextColor} ${contentFontSize} whitespace-pre-line leading-relaxed`}>{apiResponse.explanation}</p>
              
              {apiResponse.imageUrl && (
                <div className="my-4 text-center">
                  <img src={apiResponse.imageUrl} alt={t('petroGeniusImagePlaceholderAlt')} className="max-w-xs mx-auto rounded-md shadow-md border dark:border-gray-600" />
                </div>
              )}

              {apiResponse.steps && apiResponse.steps.length > 0 && (
                <div className="my-4">
                  <h3 className={`font-semibold ${contentFontSize} mb-2 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>{language === 'ar' ? 'الخطوات الفهلوية:' : 'Fahlawy Steps:'}</h3>
                  <ol className={`list-decimal space-y-1 ${language === 'ar' ? 'pr-6 text-lg' : 'pl-6 text-base'} ${responseTextColor} leading-relaxed`}>
                    {apiResponse.steps.map((step, index) => <li key={index}>{step}</li>)}
                  </ol>
                </div>
              )}

              {apiResponse.safety_warnings && apiResponse.safety_warnings.length > 0 && (
                <div className="my-4">
                  <h3 className={`font-semibold ${contentFontSize} mb-2 text-red-500 dark:text-red-400`}>{t('petroGeniusSafetyWarningsTitle')}</h3>
                  <ul className={`list-disc space-y-1 ${language === 'ar' ? 'pr-6 text-lg' : 'pl-6 text-base'} ${responseTextColor} leading-relaxed`}>
                    {apiResponse.safety_warnings.map((warn, index) => <li key={index}>{warn}</li>)}
                  </ul>
                </div>
              )}
                <div className="mt-6 pt-4 border-t border-gray-300 dark:border-gray-600 flex flex-wrap gap-2 sm:gap-3 justify-center">
                    <button onClick={handleSaveExplanation} className={actionButtonClasses}>{t('petroGeniusSaveExplanationButton')}</button>
                    <button onClick={() => handleAction('PDF')} className={actionButtonClasses}><DocumentArrowDownIcon className="h-4 w-4"/> {t('aiMaintenanceExportPDF')}</button>
                    <button onClick={() => handleAction('Share')} className={actionButtonClasses}><ShareIcon className="h-4 w-4"/>{t('aiMaintenanceShare')}</button>
                    <button onClick={() => handleAction('Print')} className={actionButtonClasses}><PrinterIcon className="h-4 w-4"/>{t('aiMaintenancePrint')}</button>
                    <button onClick={() => handleAction('Screenshot')} className={actionButtonClasses}><CameraIcon className="h-4 w-4"/>{t('aiMaintenanceScreenshot')}</button>
                </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PetroGeniusView;
