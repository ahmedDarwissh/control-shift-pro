
import React, { useState, useContext, useRef } from 'react';
import { useLanguageContext } from '../hooks/useLanguage';
import { ThemeContext } from '../contexts/ThemeContext';
import { ToastContext } from '../contexts/ToastContext'; // UPDATED IMPORT
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { SparklesIcon, LightBulbIcon, DocumentArrowDownIcon, ShareIcon, PrinterIcon, CameraIcon } from '@heroicons/react/24/outline';
import { SmartShiftEnhancementSuggestion, AiSolution, Language, TranslationSet } from '../types';

const API_KEY = process.env.API_KEY;
let ai: GoogleGenAI | null = null;
if (API_KEY) {
  try {
    ai = new GoogleGenAI({ apiKey: API_KEY });
  } catch (e) {
    console.error("Failed to initialize GoogleGenAI for Smart Shift Enhancer:", e);
    ai = null;
  }
}

interface SmartShiftEnhancerViewProps {}

const SmartShiftEnhancerView: React.FC<SmartShiftEnhancerViewProps> = () => {
  const { t, language } = useLanguageContext();
  const { theme } = React.useContext(ThemeContext);
  const { addToast } = useContext(ToastContext);
  const adviceContentRef = useRef<HTMLDivElement>(null);

  const [problemDescription, setProblemDescription] = useState('');
  const [problemType, setProblemType] = useState<string>(''); 
  const [advice, setAdvice] = useState<SmartShiftEnhancementSuggestion | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const problemTypeOptions: { value: string; labelKey: keyof TranslationSet }[] = [
    { value: 'overwork', labelKey: 'smartShiftEnhancerProblemTypeOverwork' },
    { value: 'absence', labelKey: 'smartShiftEnhancerProblemTypeAbsence' },
    { value: 'special_request', labelKey: 'smartShiftEnhancerProblemTypeSpecialRequest' },
    { value: 'other', labelKey: 'smartShiftEnhancerProblemTypeOther' },
  ];


  const handleGetAdvice = async () => {
    if (!problemDescription.trim()) {
      addToast(language === 'ar' ? 'يا فهلوي، اكتب المشكلة الأول عشان نعرف نحلها!' : 'Fahlawy, describe the problem first so we can solve it!', 'alert');
      return;
    }
    if (!ai) {
      addToast(t('aiFeatureApiKeyMissing'), 'alert');
      setAdvice({
        fahlawy_assessment: language === 'ar' ? `*** تقييم تجريبي من الفهلوي الكبير ***\nيا صاحبي، المشكلة اللي وصفتها دي ("${problemDescription}") محتاجة قعدة شاي بالقرنفل وتفكير عميق. بس مبدئيًا كده، شكلها كركبة وعايزة فهلوة سريعة.` : `*** Mock Assessment from Big Fahlawy ***\nMy friend, the problem you described ("${problemDescription}") needs a cup of clove tea and deep thinking. But initially, it looks like a mess and needs quick fahlawa.`,
        suggested_solutions: [
          { solution_id: 'sol1_mock', title: language === 'ar' ? 'الحل الفنكوشي الأول' : 'The First Fankoush Solution', description: language === 'ar' ? 'نكلم عم عبده السباك، يمكن يكون عنده حل سحري للموضوع ده.' : 'Let\'s call Uncle Abdo the plumber, he might have a magical solution for this.', pros: [language === 'ar' ? 'عم عبده راجل بركة.' : 'Uncle Abdo is a blessed man.'], cons: [language === 'ar' ? 'ممكن يكون نايم دلوقتي.' : 'He might be asleep now.'], practical_steps: [language === 'ar' ? '١. اتصل بعم عبده.' : '1. Call Uncle Abdo.'] },
          { solution_id: 'sol2_mock', title: language === 'ar' ? 'الحل الصاروخي الثاني' : 'The Second Rocket Solution', description: language === 'ar' ? 'نعمل نفسنا مش واخدين بالنا، ويمكن المشكلة تتحل لوحدها (بتحصل!).' : 'Let\'s pretend we didn\'t notice, and maybe the problem will solve itself (it happens!).', pros: [language === 'ar' ? 'مجهود أقل.' : 'Less effort.'], cons: [language === 'ar' ? 'ممكن الدنيا تولع.' : 'Things might catch fire.'] }
        ],
        fahlawy_final_word: language === 'ar' ? 'الخلاصة يا كبير، جرب تشغل الـ API عشان تشوف الحلول اللي بجد، ومتنساش تدعيلي دعوة حلوة من قلبك.' : 'The bottom line, boss, try turning on the API to see the real solutions, and don\'t forget to pray for me from your heart.'
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setAdvice(null);

    const problemTypeString = problemType ? ` (نوع المشكلة: ${t(`smartShiftEnhancerProblemType${problemType.charAt(0).toUpperCase() + problemType.slice(1)}` as keyof TranslationSet, problemType)})` : '';

    const prompt = language === 'ar' ?
`يا معلم الفهلوية، يا أسطورة حل المشاكل المستعصية في ورديات البترول!
عندنا معضلة في الوردية: "${problemDescription}"${problemTypeString}.
مطلوب من خبرة معاليك الفذة، وبأسلوبك المصري الكوميدي الساخر اللي مفيش زيه، تدينا نصيحة ذهب لحل المشكلة دي.
النصيحة لازم تكون على هيئة JSON صافي بدون أي إضافات، زي كده بالظبط:
{
  "fahlawy_assessment": "تقييمك الكوميدي الأولي للمشكلة بلهجة مصرية أصيلة (مثال: يا نهار أبيض على المشكلة دي! دي شكلها عايزة واحد فهلوي زي حالاتي عشان يفك تعقيدها).",
  "suggested_solutions": [
    {
      "solution_id": "unique_solution_id_1",
      "title": "عنوان كوميدي للحل الأول (مثال: خطة الهروب الكبير من المشكلة)",
      "description": "شرح تفصيلي للحل المقترح بأسلوب فكاهي وعملي.",
      "pros": ["قائمة بالإيجابيات (مثال: هنخلص بسرعة ونلحق ماتش الكورة)", "ميزة تانية حلوة"],
      "cons": ["قائمة بالسلبيات (مثال: ممكن المشرف يزعل شوية)", "عيب تاني بس مش مهم أوي"],
      "practical_steps": ["خطوة عملية ١ مفصلة", "خطوة عملية ٢ توضيحية"]
    },
    {
      "solution_id": "unique_solution_id_2",
      "title": "عنوان كوميدي للحل الثاني (مثال: وصفة الفهلوي السحرية)",
      "description": "شرح حل تاني مختلف وبرضه فكاهي وعملي.",
      "pros": ["مزايا الحل ده"],
      "cons": ["عيوب الحل ده"],
      "practical_steps": ["خطوة عملية أولى للحل الثاني", "خطوة عملية تانية دقيقة"]
    }
  ],
  "fahlawy_final_word": "كلمتك الأخيرة ونصيحتك النهائية بأسلوبك الفكاهي المميز (مثال: الخلاصة يا صاحبي، جرب الحل اللي يريحك، ولو الدنيا باظت... يبقى العيب مش فيا، العيب في الشاي!)."
}
افتكر يا فهلوي: الحلول تكون عملية وقابلة للتطبيق في بيئة الشغل بتاعتنا، بس الأسلوب لازم يكون مصري أصيل ومضحك فشخ. ممنوع أي لغة تانية غير العامية المصرية. الإجابة JSON فقط.`
:
`Oh, Master of Fahlawa, legend of solving impossible shift problems in the petroleum industry!
We have a dilemma on the shift: "${problemDescription}"${problemTypeString}.
We need your unique expertise, delivered in your signature hilarious and sarcastic Egyptian comedic style, to give us golden advice to solve this.
The advice MUST be a pure JSON object, with no extra text or markdown, exactly like this:
{
  "fahlawy_assessment": "Your initial comedic assessment of the problem in authentic Egyptian Arabic (e.g., Oh my goodness, this problem! It looks like it needs a fahlawy like me to untangle it).",
  "suggested_solutions": [
    {
      "solution_id": "unique_solution_id_1",
      "title": "Comedic title for the first solution (e.g., The Great Escape Plan from the Problem)",
      "description": "Detailed explanation of the proposed solution in a humorous and practical manner.",
      "pros": ["List of pros (e.g., We'll finish quickly and catch the football match)", "Another cool advantage"],
      "cons": ["List of cons (e.g., The supervisor might get a bit upset)", "Another con, but not too important"],
      "practical_steps": ["Detailed practical step 1", "Illustrative practical step 2"]
    },
    {
      "solution_id": "unique_solution_id_2",
      "title": "Comedic title for the second solution (e.g., Fahlawy's Magic Recipe)",
      "description": "Explanation of another different solution, also humorous and practical.",
      "pros": ["Advantages of this solution"],
      "cons": ["Disadvantages of this solution"],
      "practical_steps": ["First practical step for solution 2", "Precise second practical step"]
    }
  ],
  "fahlawy_final_word": "Your final word and ultimate advice in your distinctive humorous style (e.g., The bottom line, my friend, try the solution that suits you, and if things go wrong... it's not my fault, it's the tea's fault!)."
}
Remember, Fahlawy: Solutions should be practical and applicable in our work environment, but the style must be authentic Egyptian Arabic and hilariously funny. No language other than Egyptian colloquial. JSON response only.`;

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
      
      const parsedData = JSON.parse(jsonStr) as SmartShiftEnhancementSuggestion;
      if (parsedData.fahlawy_assessment && parsedData.suggested_solutions && Array.isArray(parsedData.suggested_solutions)) {
        setAdvice(parsedData);
      } else {
         console.error("Invalid advice data structure from AI:", parsedData);
        setError(t('smartShiftEnhancerError'));
        addToast(t('smartShiftEnhancerError'), 'alert');
      }
    } catch (err) {
      console.error("Error fetching advice from AI:", err);
      setError(t('smartShiftEnhancerError'));
      addToast(t('smartShiftEnhancerError'), 'alert');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = (actionType: 'PDF' | 'Share' | 'Print' | 'Screenshot') => {
    let messageKey: keyof TranslationSet = 'statusSuccessMessage';
    let toastType: 'success' | 'info' | 'alert' = 'success';

    if (!advice || !adviceContentRef.current) {
        addToast(t('smartShiftEnhancerNoAdviceYet'), 'alert');
        return;
    }
     if (actionType === 'Screenshot') {
        messageKey = 'screenshotSuccess';
        toastType = 'info';
        addToast(t(messageKey) + " (" + (language === 'ar' ? "استخدم لقطة شاشة النظام لو سمحت." : "Please use your system's screenshot tool.") + ")", toastType);
        return;
    }
    
    const contentToPrint = adviceContentRef.current.innerHTML;

    if (actionType === 'PDF' || actionType === 'Print') {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`<html><head><title>${t('smartShiftEnhancerTitle')}</title>`);
            printWindow.document.write('<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">');
            printWindow.document.write(`<style>body{font-family:"Cairo",sans-serif;direction:${language === 'ar' ? 'rtl' : 'ltr'};padding:20px;margin:0;font-size:18px;line-height:1.8;} h3,h4{margin-bottom:0.5em;} h3{font-size:1.6em;color:#D97706;} h4{font-size:1.3em;color:#1E3A8A;} ul{list-style-position:inside;padding-${language === 'ar' ? 'right' : 'left'}:20px;} .pros{color:#10B981;} .cons{color:#EF4444;} .final-word{font-style:italic;font-weight:bold;margin-top:1.5em;}</style></head><body>`);
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
        if (navigator.share && adviceContentRef.current) {
            navigator.share({
                title: t('smartShiftEnhancerTitle'),
                text: adviceContentRef.current.innerText.substring(0, 200) + "...",
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
  const adviceBoxBg = theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50/80';
  const solutionItemBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const adviceTextColor = theme === 'dark' ? 'text-gray-200' : 'text-gray-800';
  const prosColor = theme === 'dark' ? 'text-green-400' : 'text-green-600';
  const consColor = theme === 'dark' ? 'text-red-400' : 'text-red-500';
  const actionButtonClasses = `flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-medium transition-colors shadow-sm hover:shadow-md ${theme === 'dark' ? 'bg-gray-600 text-gray-200 hover:bg-gray-500' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`;
  const contentFontSize = language === 'ar' ? 'text-lg' : 'text-base'; // Larger for Arabic

  return (
    <div className={`p-2 md:p-4 ${language === 'ar' ? 'font-cairo' : 'font-poppins'}`}>
      <div className="flex items-center mb-6">
        <SparklesIcon className={`h-8 w-8 ${pageTitleColor} ${language === 'ar' ? 'ml-3' : 'mr-3'}`} />
        <h1 className={`text-2xl md:text-3xl font-bold ${pageTitleColor}`}>
          {t('smartShiftEnhancerTitle')}
        </h1>
      </div>

      <div className={`p-5 md:p-6 rounded-xl shadow-xl mb-6 ${cardBg} border`}>
        <div className="space-y-4">
          <div>
            <label htmlFor="problemDescription" className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{t('smartShiftEnhancerProblemLabel')}</label>
            <textarea
              id="problemDescription"
              rows={4}
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              placeholder={t('smartShiftEnhancerProblemPlaceholder')}
              className={`${inputBaseClasses} ${themedInputClasses}`}
            />
          </div>
          <div>
            <label htmlFor="problemType" className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{t('smartShiftEnhancerProblemTypeLabel')}</label>
            <select 
              id="problemType" 
              value={problemType} 
              onChange={(e) => setProblemType(e.target.value)} 
              className={`${inputBaseClasses} ${themedInputClasses}`}
            >
              <option value="">{language === 'ar' ? 'اختر نوع المشكلة (اختياري)' : 'Select problem type (optional)'}</option>
              {problemTypeOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{t(opt.labelKey)}</option>
              ))}
            </select>
          </div>
          <button onClick={handleGetAdvice} className={buttonClasses} disabled={isLoading}>
            {isLoading ? (
              <><SparklesIcon className="h-5 w-5 inline animate-spin mr-2 rtl:ml-2" />{t('smartShiftEnhancerLoadingAdvice')}</>
            ) : (
              <><LightBulbIcon className="h-5 w-5 inline mr-2 rtl:ml-2" />{t('smartShiftEnhancerGetAdviceButton')}</>
            )}
          </button>
        </div>
      </div>

      {(advice || isLoading || error) && (
        <div className={`p-5 md:p-6 rounded-xl shadow-xl ${cardBg} border`}>
          {isLoading && <p className={`text-center py-4 text-sm ${adviceTextColor}`}>{t('smartShiftEnhancerLoadingAdvice')}...</p>}
          {error && <p className={`text-center py-4 text-sm text-red-500 dark:text-red-400`}>{error}</p>}
          {!isLoading && !advice && !error && <p className={`text-center py-4 text-sm ${adviceTextColor}`}>{t('smartShiftEnhancerNoAdviceYet')}</p>}
          
          {!isLoading && advice && (
            <div ref={adviceContentRef} className={`p-4 rounded-lg ${adviceBoxBg} ${adviceTextColor} ${contentFontSize} leading-relaxed`}>
              <div className="mb-6">
                <h3 className={`font-bold ${language === 'ar' ? 'text-xl' : 'text-lg'} mb-2 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>{t('smartShiftEnhancerFahlawyAssessment')}</h3>
                <p className="italic">{advice.fahlawy_assessment}</p>
              </div>

              <h3 className={`font-bold ${language === 'ar' ? 'text-xl' : 'text-lg'} mb-3 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>{t('smartShiftEnhancerSolutionsTitle')}</h3>
              <div className="space-y-4 mb-6">
                {advice.suggested_solutions.map((sol: AiSolution) => (
                  <div key={sol.solution_id} className={`p-4 rounded-md shadow ${solutionItemBg}`}>
                    <h4 className={`font-semibold ${language === 'ar' ? 'text-lg' : 'text-md'} mb-2 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`}>{sol.title}</h4>
                    <p className={`${language === 'ar' ? 'text-md' : 'text-sm'} mb-2`}>{sol.description}</p>
                    {sol.practical_steps && sol.practical_steps.length > 0 && (
                        <div className="my-2">
                             <p className={`font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{language === 'ar' ? 'الخطوات العملية يا فهلوي:' : 'Practical Fahlawy Steps:'}</p>
                            <ul className={`list-decimal list-inside space-y-0.5 ${language === 'ar' ? 'text-md pr-4' : 'text-sm pl-4'}`}>
                                {sol.practical_steps.map((step, i) => <li key={`step-${i}`}>{step}</li>)}
                            </ul>
                        </div>
                    )}
                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 ${language === 'ar' ? 'text-md' : 'text-sm'}`}>
                      <div>
                        <p className={`font-medium mb-1 ${prosColor}`}>{t('smartShiftEnhancerPros')}:</p>
                        <ul className="list-disc list-inside space-y-0.5">
                          {sol.pros.map((pro, i) => <li key={i}>{pro}</li>)}
                        </ul>
                      </div>
                      <div>
                        <p className={`font-medium mb-1 ${consColor}`}>{t('smartShiftEnhancerCons')}:</p>
                        <ul className="list-disc list-inside space-y-0.5">
                          {sol.cons.map((con, i) => <li key={i}>{con}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div>
                <h3 className={`font-bold ${language === 'ar' ? 'text-xl' : 'text-lg'} mb-2 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>{t('smartShiftEnhancerFahlawyFinalWord')}</h3>
                <p className="italic">{advice.fahlawy_final_word}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-300 dark:border-gray-600 flex flex-wrap gap-2 sm:gap-3 justify-center">
                <button onClick={() => handleAction('PDF')} className={actionButtonClasses}><DocumentArrowDownIcon className="h-4 w-4"/> {t('smartShiftEnhancerExportPDF')}</button>
                <button onClick={() => handleAction('Share')} className={actionButtonClasses}><ShareIcon className="h-4 w-4"/>{t('smartShiftEnhancerShare')}</button>
                <button onClick={() => handleAction('Print')} className={actionButtonClasses}><PrinterIcon className="h-4 w-4"/>{t('smartShiftEnhancerPrint')}</button>
                <button onClick={() => handleAction('Screenshot')} className={actionButtonClasses}><CameraIcon className="h-4 w-4"/>{t('smartShiftEnhancerScreenshot')}</button>
              </div>

            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SmartShiftEnhancerView;
