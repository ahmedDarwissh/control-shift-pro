
<<<<<<< HEAD
import React, { useState, useRef, useEffect, useContext } from 'react';
import { useLanguageContext } from '../hooks/useLanguage';
import { ThemeContext, ToastContext } from '../App';
import { Language } from '../types';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Heroicons
const MusicalNoteIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" /></svg>
);
const PuzzlePieceIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.597.484-1.087 1.088-1.087h.003c.603 0 1.087.49 1.087 1.087V6.75M14.25 6.087A2.25 2.25 0 0012 8.25v1.088c0 .597.484 1.087 1.088 1.087h.003c.603 0 1.087-.49 1.087-1.087V9.338c0-.597-.484-1.087-1.088-1.087h-.003A2.25 2.25 0 0112 6v-.088c0-.597.484-1.087 1.088-1.087h.003c.603 0 1.087.49 1.087 1.087V6.75m-2.165 3.203a2.25 2.25 0 00-2.25 2.25V15m0 0A2.25 2.25 0 0012 17.25h1.088c.603 0 1.087-.49 1.087-1.087V15m0 0c0-.597-.484-1.087-1.088-1.087H12.003A2.25 2.25 0 019.75 12v-1.088c0-.597.484-1.087 1.088-1.087H10.5m2.25 4.5H9.75M15 12A2.25 2.25 0 0012.75 9.75V9.338c0-.597.484-1.087 1.088-1.087H13.5m2.25 4.5H15M9 15.087c0 .597-.484 1.087-1.088 1.087h-.003c-.603 0-1.087-.49-1.087-1.087V14.25M9 15.087A2.25 2.25 0 0111.25 12.84v-1.088c0-.597-.484-1.087-1.088-1.087h-.003A2.25 2.25 0 007.912 12v.088c0 .597.484 1.087 1.088 1.087h.003c.603 0 1.087.49 1.087 1.087V14.25m2.165-3.203A2.25 2.25 0 0113.5 12.84v1.088c0 .597-.484-1.087-1.088-1.087h-.003a2.25 2.25 0 00-2.25 2.25V15m0 0A2.25 2.25 0 019.75 17.25h-1.088c-.603 0-1.087-.49-1.087-1.087V15m0 0c0 .597.484 1.087 1.088 1.087H7.997A2.25 2.25 0 015.75 12v-1.088c0-.597.484-1.087 1.088-1.087H7.5M9.75 9H12m0 0A2.25 2.25 0 009.75 6.75V6.662c0-.597.484-1.087 1.088-1.087H10.5m3.75 0A2.25 2.25 0 0012 9.338V9.75M12 6.75H9.75" /></svg>
=======
import React, { useState } from 'react';
import { useLanguageContext } from '../hooks/useLanguage';
import { ThemeContext } from '../contexts/ThemeContext';
import { Language, TranslationSet } from '../types';

// Placeholder icons if needed by FunStuffView, adjust as necessary
const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.567L16.5 21.75l-.398-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.398a2.25 2.25 0 001.423-1.423L16.5 15.75l.398 1.183a2.25 2.25 0 001.423 1.423l1.183.398-1.183.398a2.25 2.25 0 00-1.423 1.423L16.5 21.75z" />
  </svg>
);
const PuzzlePieceIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.597.484-1.087 1.088-1.087h.003c.603 0 1.087.49 1.087 1.087V6.75M14.25 6.087A2.25 2.25 0 0012 8.25v1.088c0 .597.484 1.087 1.088-1.087h.003c.603 0 1.087-.49 1.087-1.087V9.338c0-.597-.484-1.087-1.088-1.087h-.003A2.25 2.25 0 0112 6v-.088c0-.597.484-1.087 1.088-1.087h.003c.603 0 1.087.49 1.087 1.087V6.75m-2.165 3.203a2.25 2.25 0 00-2.25 2.25V15m0 0A2.25 2.25 0 0012 17.25h1.088c.603 0 1.087-.49 1.087-1.087V15m0 0c0-.597-.484-1.087-1.088-1.087H12.003A2.25 2.25 0 019.75 12v-1.088c0-.597.484-1.087 1.088-1.087H10.5m2.25 4.5H9.75M15 12A2.25 2.25 0 0012.75 9.75V9.338c0-.597.484-1.087 1.088-1.087H13.5m2.25 4.5H15M9 15.087c0 .597-.484-1.087-1.088 1.087h-.003c-.603 0-1.087-.49-1.087-1.087V14.25M9 15.087A2.25 2.25 0 0111.25 12.84v-1.088c0-.597-.484-1.087-1.088-1.087h-.003A2.25 2.25 0 007.912 12v.088c0 .597.484 1.087 1.088 1.087h.003c.603 0 1.087.49 1.087 1.087V14.25m2.165-3.203A2.25 2.25 0 0113.5 12.84v1.088c0 .597-.484-1.087-1.088-1.087h-.003a2.25 2.25 0 00-2.25 2.25V15m0 0A2.25 2.25 0 019.75 17.25h-1.088c-.603 0-1.087-.49-1.087-1.087V15m-1.051-4.246A2.25 2.25 0 016.75 8.25H6m5.25 9.75A2.25 2.25 0 019.75 15.75H9" /></svg>
>>>>>>> bee2d85 (updated)
);
const ChatBubbleLeftRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.72.372a11.957 11.957 0 01-3.72.372h-.456a11.957 11.957 0 01-3.72-.372l-3.72-.372A2.25 2.25 0 012.25 15.082V8.511c0-.884.616-1.646 1.448-1.948l.902-.301c.435-.145.92-.302 1.417-.471L8.25 5.69m5.25 0l.752.25M13.5 5.69l-.752.25m-.752-.25h.002M18 18.75V9.75M6 18.75V9.75" /></svg>
);
<<<<<<< HEAD
const FaceSmileIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9 9.75h.008v.008H9V9.75zm.75 3a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm2.25-.75h.008v.008H12v-.008zM15 9.75h.008v.008H15V9.75z" /></svg>
);
const PlayIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" /></svg>;
const PauseIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" /></svg>;
const ForwardIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>;


const API_KEY = process.env.API_KEY;
let ai: GoogleGenAI | null = null;
if (API_KEY) {
  try {
    ai = new GoogleGenAI({ apiKey: API_KEY });
  } catch (e) {
    console.error("Failed to initialize GoogleGenAI:", e);
    ai = null; // Ensure ai is null if initialization fails
  }
} else {
  console.warn("API_KEY for Gemini is not set. FunStuff AI features will be limited to mock data.");
}


interface FunStuffCardProps {
  titleKey: keyof ReturnType<typeof useLanguageContext>['translations'];
  icon?: React.ReactNode; 
  children: React.ReactNode;
  className?: string;
  iconClassName?: string;
  apiKeyMissingMessageKey?: keyof ReturnType<typeof useLanguageContext>['translations'];
}

const FunStuffCard: React.FC<FunStuffCardProps> = ({ titleKey, icon, children, className, iconClassName, apiKeyMissingMessageKey }) => {
  const { t, language } = useLanguageContext();
  const { theme } = React.useContext(ThemeContext);
  const cardBg = theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const titleColor = theme === 'dark' ? 'text-orange-400' : 'text-orange-600';
  const iconBaseColor = theme === 'dark' ? 'text-orange-400' : 'text-orange-500';

  return (
    <div className={`p-5 md:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out text-center ${cardBg} ${className}`}>
      {icon && <div className={`text-3xl md:text-4xl mb-3 ${iconBaseColor} ${iconClassName}`}>{icon}</div>}
      <h3 className={`text-lg font-semibold mb-3 ${titleColor} ${language === 'ar' ? 'font-cairo' : 'font-poppins'}`}>
        {t(titleKey)}
      </h3>
      {children}
      {!ai && apiKeyMissingMessageKey && (
        <p className={`text-xs mt-3 italic ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
          {t(apiKeyMissingMessageKey)}
        </p>
      )}
    </div>
  );
};

type QuranPlayerStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'error';
interface PetroleumPuzzleData {
  question: string;
  options: string[];
  correctOptionIndex: number;
}

const FunStuffView: React.FC = () => {
  const { t, language } = useLanguageContext();
  const { theme } = React.useContext(ThemeContext);
  const { addToast } = useContext(ToastContext);

  const [quranPlayerVisible, setQuranPlayerVisible] = useState(false);
  const [quranPlayerStatus, setQuranPlayerStatus] = useState<QuranPlayerStatus>('idle');
  const audioRef = useRef<HTMLAudioElement>(null);
  const QURAN_RADIO_URL = "http://stream.radiojar.com/8s5u5tpdtwzuv"; 

  useEffect(() => {
    const audio = audioRef.current;
    if (audio && quranPlayerVisible) { 
      const handlePlaying = () => setQuranPlayerStatus('playing');
      const handlePause = () => setQuranPlayerStatus('paused');
      const handleWaiting = () => setQuranPlayerStatus('loading');
      const handleError = () => { setQuranPlayerStatus('error'); };
      const handleCanPlay = () => {
         if (quranPlayerStatus === 'loading') { 
             audio.play().then(handlePlaying).catch(handleError);
         }
      };

      audio.addEventListener('playing', handlePlaying);
      audio.addEventListener('pause', handlePause);
      audio.addEventListener('waiting', handleWaiting);
      audio.addEventListener('error', handleError);
      audio.addEventListener('canplaythrough', handleCanPlay);

      return () => {
        audio.removeEventListener('playing', handlePlaying);
        audio.removeEventListener('pause', handlePause);
        audio.removeEventListener('waiting', handleWaiting);
        audio.removeEventListener('error', handleError);
        audio.removeEventListener('canplaythrough', handleCanPlay);
      };
    } else if (audio && !quranPlayerVisible && quranPlayerStatus !== 'idle') {
        audio.pause();
        audio.src = ""; 
        setQuranPlayerStatus('idle');
    }
  }, [quranPlayerVisible, quranPlayerStatus]);

  const toggleQuranPlayer = () => {
    setQuranPlayerVisible(prev => {
      if (!prev && audioRef.current) { 
        audioRef.current.src = QURAN_RADIO_URL;
        audioRef.current.load(); 
        setQuranPlayerStatus('loading');
      } else if (prev && audioRef.current) { 
        audioRef.current.pause();
        audioRef.current.src = ""; 
        setQuranPlayerStatus('idle');
      }
      return !prev;
    });
  };

  const togglePlayQuran = () => {
    if (audioRef.current) {
      if (quranPlayerStatus === 'playing') {
        audioRef.current.pause();
      } else {
        if (audioRef.current.src !== QURAN_RADIO_URL || audioRef.current.paused) { 
            audioRef.current.src = QURAN_RADIO_URL;
            audioRef.current.load(); 
        }
        setQuranPlayerStatus('loading'); 
      }
    }
  };
  
  const getQuranStatusText = () => {
    switch(quranPlayerStatus) {
      case 'loading': return t('quranRadioLoading');
      case 'playing': return t('quranRadioPlaying');
      case 'paused': return t('quranRadioPaused');
      case 'error': return t('quranRadioError');
      default: return t('quranRadioNowPlaying'); 
    }
  };

  const [puzzleVisible, setPuzzleVisible] = useState(false);
  const [currentPuzzleData, setCurrentPuzzleData] = useState<PetroleumPuzzleData | null>(null);
  const [isPuzzleLoading, setIsPuzzleLoading] = useState(false);
  const [selectedPuzzleAnswer, setSelectedPuzzleAnswer] = useState<string | null>(null);
  const [puzzleResult, setPuzzleResult] = useState<string | null>(null);
  const [puzzleAttempted, setPuzzleAttempted] = useState(false);

  const MOCK_PUZZLE_AR: PetroleumPuzzleData = {
    question: 'لو الدنيا حر، والكمبروسر فصل، تعمل إيه عشان تلحق الوردية؟',
    options: ['أ) تشغل المروحة عليه', 'ب) تكلم الصيانة فوراً وتشوف بديل', 'ج) تجيبله كوباية لمون بالنعناع'],
    correctOptionIndex: 1,
  };
  const MOCK_PUZZLE_EN: PetroleumPuzzleData = {
    question: 'If it\'s hot and the compressor stops, what do you do to save the shift?',
    options: ['A) Turn the fan on it', 'B) Call maintenance immediately and find an alternative', 'C) Get it a lemonade with mint'],
    correctOptionIndex: 1,
  };
  
  const getMockPuzzle = () => language === Language.AR ? MOCK_PUZZLE_AR : MOCK_PUZZLE_EN;


  const fetchNewPuzzle = async () => {
    if (!ai) {
        setCurrentPuzzleData(getMockPuzzle());
        return;
    }
    setIsPuzzleLoading(true);
    setPuzzleResult(null);
    setSelectedPuzzleAnswer(null);
    setPuzzleAttempted(false);

    const promptContent = language === Language.AR ?
    `يا عم الذكاء الاصطناعي الفتك، عايزين منك خدمة على ما تفرج:
اخترعلنا سؤال فزورة كده من بتوع الاختيار من متعدد يكون ليه علاقة بصناعة البترول والغاز والمعدات والسلامة والأدوات، بس يكون كلام يضحك ومفهوم للمهندسين والفنيين والمشرفين اللي زي الورد دول.
السؤال لازم يكون باللهجة المصرية العامية الكوميدية اللي تفرفش كده.
هاتلنا السؤال وتلات اختيارات روشة (أ، ب، ج)، وقولنا أنهي واحد فيهم الصح (يعني الإجابة رقم 0 ولا 1 ولا 2).
المطلوب منك ترجع الكلام ده كله في صيغة JSON نضيف ومفيهوش أي حركات ولا markdown ولا أي حاجة تانية، زي المثال ده بالظبط:
{
  "question": "سؤالك الفكاهي هنا بالعامية المصرية",
  "options": ["الاختيار الأول الروشن", "الاختيار التاني المضحك", "الاختيار التالت اللي يفطس من الضحك"],
  "correctOptionIndex": 1
}
خلي السؤال والاختيارات باللغة المصرية الدارجة وميكونش فيها أي تعقيد، عايزين الناس تضحك وهي بتجاوب.`
    :
    `Generate a multiple-choice question related to the petroleum industry, suitable for engineers, technicians, or supervisors.
The question should be about oil, gas, equipment, safety, or tools.
Provide the question, three distinct answer options (A, B, C), and the index of the correct option (0, 1, or 2).
Return the response as a direct valid JSON object without any additional text or markdown fences, like this example:
{
  "question": "Your question here",
  "options": ["Option A", "Option B", "Option C"],
  "correctOptionIndex": 0
}
Ensure the question and options are in clear English.`;

    try {
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17",
        contents: promptContent,
        config: { responseMimeType: "application/json" }
      });
      
      let jsonStr = response.text.trim();
      const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
      const match = jsonStr.match(fenceRegex);
      if (match && match[2]) {
        jsonStr = match[2].trim();
      }
      
      const parsedData = JSON.parse(jsonStr) as PetroleumPuzzleData;
      if (parsedData.question && parsedData.options && parsedData.options.length === 3 && typeof parsedData.correctOptionIndex === 'number' && parsedData.correctOptionIndex >= 0 && parsedData.correctOptionIndex < 3) {
        setCurrentPuzzleData(parsedData);
      } else {
        console.error("Invalid puzzle format received from API:", parsedData);
        throw new Error("Invalid puzzle format received from API.");
      }
    } catch (error) {
      console.error("Error fetching puzzle:", error);
      addToast(t('puzzleFetchingError'), 'alert');
      setCurrentPuzzleData(getMockPuzzle());
    } finally {
      setIsPuzzleLoading(false);
    }
  };
  
  const handlePuzzleSubmit = () => {
    if (selectedPuzzleAnswer === null || !currentPuzzleData) return;
    setPuzzleAttempted(true);
    const selectedIndex = currentPuzzleData.options.indexOf(selectedPuzzleAnswer);
    const isCorrect = selectedIndex === currentPuzzleData.correctOptionIndex;
    setPuzzleResult(isCorrect ? t('puzzleGameCorrect') : t('puzzleGameWrong'));
    addToast(isCorrect ? t('puzzleGameCorrect') : t('puzzleGameWrong'), isCorrect ? 'success' : 'alert');
  };

  const nextPuzzle = () => {
    fetchNewPuzzle();
    const puzzleCard = document.getElementById('puzzle-card-content');
    if(puzzleCard) {
        puzzleCard.classList.add('animate-pulse-once');
        setTimeout(() => puzzleCard.classList.remove('animate-pulse-once'), 500);
    }
  };

  const togglePuzzleVisibility = () => {
    setPuzzleVisible(prev => {
      if (!prev && !currentPuzzleData) { 
        fetchNewPuzzle();
      }
      return !prev;
    });
  };

  const [currentJokeText, setCurrentJokeText] = useState<string | null>(null);
  const [isJokeLoading, setIsJokeLoading] = useState(false);
  
  const MOCK_JOKE_AR = "مرة مهندس راح يشتري فول وطعمية، البياع قاله: عايز كام برميل يا باشمهندس؟";
  const MOCK_JOKE_EN = "Why did the geologist break up with the biologist? They had different strata-gies in life!";
  const getMockJoke = () => language === Language.AR ? MOCK_JOKE_AR : MOCK_JOKE_EN;

  const fetchNewJoke = async () => {
    if (!ai) {
        setCurrentJokeText(getMockJoke());
        return;
    }
    setIsJokeLoading(true);
    const promptContent = language === Language.AR ? 
    `قولي نكتة قصيرة ومضحكة باللهجة المصرية العامية عن صناعة البترول والغاز، أو المعدات، أو السلامة، أو الأدوات.
النكتة لازم تكون مناسبة للفنيين والمشرفين والمهندسين.
خليها خفيفة الدم وكوميدية.
رجع نص النكتة فقط بدون أي مقدمات أو تعليقات.` 
    : 
    `Tell me a short, funny joke in English about the petroleum industry, gas, equipment, safety, or tools.
The joke should be suitable for technicians, supervisors, and engineers.
Make it light-hearted and comedic.
Return only the joke text itself, without any preambles or comments.`;

    try {
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17",
        contents: promptContent
      });
      setCurrentJokeText(response.text.trim());
    } catch (error) {
      console.error("Error fetching joke:", error);
      addToast(t('jokeFetchingError'), 'alert');
      setCurrentJokeText(getMockJoke());
    } finally {
      setIsJokeLoading(false);
    }
  };
  
  const getNewJoke = () => {
    fetchNewJoke();
    const jokeCard = document.getElementById('joke-card-content');
    if(jokeCard) {
        jokeCard.classList.add('animate-pulse-once');
        setTimeout(() => jokeCard.classList.remove('animate-pulse-once'), 500);
    }
  };

  useEffect(() => { 
    if(!currentJokeText) fetchNewJoke(); 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Fetch initial joke only once

  const [chatbotMessages, setChatbotMessages] = useState<{ user: string; text: string }[]>([]);
  const [chatbotInput, setChatbotInput] = useState('');
  
  const handleChatbotSend = () => {
    if (!chatbotInput.trim()) return;
    const userMessage = { user: 'You', text: chatbotInput };
    const responses = [t('chatbotDefaultResponse1'), t('chatbotDefaultResponse2'), t('chatbotDefaultResponse3')];
    const fahlawyResponse = { user: 'الفهلوي', text: responses[Math.floor(Math.random() * responses.length)] };
    
    setChatbotMessages([...chatbotMessages, userMessage, fahlawyResponse]);
    setChatbotInput('');
    addToast(language === 'ar' ? 'الفهلوي بيرد عليك أهو!' : 'El Fahlawy is responding!', 'info');
  };

  const inputBaseClasses = "border rounded-lg text-sm focus:ring-2 shadow-sm";
  const lightInputClasses = "bg-white border-gray-300 text-gray-800 focus:ring-blue-600 focus:border-blue-600 placeholder-gray-500";
  const darkInputClasses = "bg-gray-700 border-gray-600 text-gray-100 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400";
  const themedInputClasses = theme === 'dark' ? darkInputClasses : lightInputClasses;

  const primaryButtonBaseClasses = "w-full py-2.5 px-4 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md transform hover:scale-[1.02]";
  const primaryButtonColors = theme === 'dark' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700';
  
  const secondaryButtonBaseClasses = "py-2 px-3.5 rounded-lg text-xs font-medium transition-colors shadow-sm hover:shadow-md transform hover:scale-[1.02]";
  const secondaryButtonColors = theme === 'dark' ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-green-500 text-white hover:bg-green-600';
  const secondaryButtonDisabledColors = 'opacity-60 cursor-not-allowed';

  const pageTitleColor = theme === 'dark' ? 'text-orange-400' : 'text-orange-500';

  return (
    <div className={`p-2 ${language === 'ar' ? 'font-cairo text-right' : 'font-poppins text-left'}`}>
      <audio ref={audioRef} preload="none"></audio>
      <h1 className={`text-2xl md:text-3xl font-bold mb-6 md:mb-8 ${pageTitleColor}`}>
        {t('funStuffTitle')}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        
        <FunStuffCard titleKey="quranRadio" icon={<MusicalNoteIcon />} iconClassName="animate-pulse-slow">
          {!quranPlayerVisible ? (
            <>
              <p className={`text-xs mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('quranRadioPlayerTitle')}
              </p>
              <button 
                onClick={toggleQuranPlayer}
                className={`${primaryButtonBaseClasses} ${primaryButtonColors}`}>
                {language === 'ar' ? "شغل الإذاعة" : "Tune In"}
              </button>
            </>
          ) : (
            <div className="text-center space-y-3">
              <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>{t('quranRadioPlayerTitle')}</p>
              <p className={`text-xs min-h-[16px] ${theme === 'dark' ? (quranPlayerStatus === 'error' ? 'text-red-400' : 'text-gray-400') : (quranPlayerStatus === 'error' ? 'text-red-600' : 'text-gray-500')}`}>
                {getQuranStatusText()}
              </p>
              <button 
                onClick={togglePlayQuran}
                disabled={(quranPlayerStatus === 'loading' || (quranPlayerStatus === 'error' && audioRef.current?.src === ""))}
                className={`p-3 rounded-full text-white text-xl transition-colors w-16 h-16 flex items-center justify-center mx-auto shadow-md
                  ${ quranPlayerStatus === 'playing' 
                      ? (theme === 'dark' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600') 
                      : (theme === 'dark' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600')
                  } ${ (quranPlayerStatus === 'loading' || (quranPlayerStatus === 'error' && audioRef.current?.src === "") ) ? secondaryButtonDisabledColors : '' }`}
                  aria-label={quranPlayerStatus === 'playing' ? t('quranRadioPause') : t('quranRadioPlay')}
              >
                {quranPlayerStatus === 'playing' ? <PauseIcon className="h-6 w-6"/> : <PlayIcon className="h-6 w-6"/>}
              </button>
              <button 
                onClick={toggleQuranPlayer}
                className={`mt-2 text-xs ${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}>
                {language === 'ar' ? "إخفاء المشغل" : "Hide Player"}
              </button>
            </div>
          )}
        </FunStuffCard>

        <FunStuffCard titleKey="puzzleGame" icon={<PuzzlePieceIcon />} iconClassName="animate-wiggle" apiKeyMissingMessageKey="funStuffApiKeyMissingPuzzle">
          {!puzzleVisible ? (
            <>
              <p className={`text-xs mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('puzzleGameTitle')}
              </p>
              <button 
                onClick={togglePuzzleVisibility}
                className={`${primaryButtonBaseClasses} ${primaryButtonColors}`}>
                {t('puzzleGamePlay')}
              </button>
            </>
          ) : (
            <div id="puzzle-card-content" className="text-left space-y-3 min-h-[220px]">
              {isPuzzleLoading && <p className={`text-sm text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{language === 'ar' ? 'جاري تحميل فزورة جديدة...' : 'Loading new puzzle...'}</p>}
              {!isPuzzleLoading && currentPuzzleData && (
                <>
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} ${language === 'ar' ? 'text-right' : 'text-left'}`}>{currentPuzzleData.question}</p>
                  {currentPuzzleData.options.map((opt, index) => (
                    <label 
                      key={index} 
                      className={`block p-2.5 rounded-md cursor-pointer text-sm ${language === 'ar' ? 'text-right' : 'text-left'} transition-all
                      ${selectedPuzzleAnswer === opt ? (theme === 'dark' ? 'bg-blue-700 text-white ring-2 ring-blue-500' : 'bg-blue-100 text-blue-800 ring-2 ring-blue-500') 
                                                 : (theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-800')}
                      ${puzzleAttempted && currentPuzzleData.options[currentPuzzleData.correctOptionIndex] !== undefined && opt === currentPuzzleData.options[currentPuzzleData.correctOptionIndex] ? (theme === 'dark' ? '!bg-green-700 text-white' : '!bg-green-100 text-green-800') : ''}
                      ${puzzleAttempted && selectedPuzzleAnswer === opt && (currentPuzzleData.options[currentPuzzleData.correctOptionIndex] === undefined || opt !== currentPuzzleData.options[currentPuzzleData.correctOptionIndex]) ? (theme === 'dark' ? '!bg-red-700 text-white' : '!bg-red-100 text-red-800') : ''}
                      `}>
                      <input type="radio" name="puzzleOption" value={opt} checked={selectedPuzzleAnswer === opt} onChange={(e) => setSelectedPuzzleAnswer(e.target.value)} className={`mr-2 rtl:ml-2 ${theme==='dark' ? 'accent-blue-500' : 'accent-blue-600'}`} disabled={puzzleAttempted} />
                      {opt}
                    </label>
                  ))}
                  {puzzleResult && <p className={`text-xs mt-2 p-2 rounded-md ${puzzleResult === t('puzzleGameCorrect') ? (theme === 'dark' ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-700') : (theme==='dark' ? 'bg-red-800 text-red-200' : 'bg-red-100 text-red-700')}`}>{puzzleResult}</p>}
                  {!puzzleAttempted ? (
                    <button 
                      onClick={handlePuzzleSubmit}
                      disabled={isPuzzleLoading || !currentPuzzleData || !selectedPuzzleAnswer}
                      className={`mt-2 w-full ${secondaryButtonBaseClasses} ${secondaryButtonColors} ${(isPuzzleLoading || !currentPuzzleData || !selectedPuzzleAnswer) ? secondaryButtonDisabledColors : ''}`}>
                      {t('puzzleGameSubmit')}
                    </button>
                  ) : (
                    <button 
                      onClick={nextPuzzle}
                      disabled={isPuzzleLoading}
                      className={`mt-2 w-full ${secondaryButtonBaseClasses} ${theme === 'dark' ? 'bg-sky-600 text-white hover:bg-sky-700' : 'bg-sky-500 text-white hover:bg-sky-600'} ${isPuzzleLoading ? secondaryButtonDisabledColors : ''} flex items-center justify-center gap-1.5`}>
                      {language === 'ar' ? "سؤال تاني يا فنان" : "Next Question!"} <ForwardIcon className="h-4 w-4"/>
                    </button>
                  )}
                </>
              )}
               <button 
                onClick={togglePuzzleVisibility}
                className={`mt-1 w-full text-xs ${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}>
                {language === 'ar' ? "إخفاء الفوازير" : "Hide Puzzles"}
              </button>
            </div>
          )}
        </FunStuffCard>
        
        <FunStuffCard titleKey="chatbotFahlawy" icon={<ChatBubbleLeftRightIcon />} iconClassName="animate-bounceSlow">
          <div className={`h-44 overflow-y-auto mb-2 p-2.5 border rounded-lg text-xs text-left ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
            {chatbotMessages.length === 0 && <p className={`italic ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>{language === 'ar' ? 'الفهلوي مستنيك تسأله أي سؤال وهو هيرد عليك ردود فهلويّة...' : 'El Fahlawy is waiting for your questions with his witty responses...'}</p>}
            {chatbotMessages.map((msg, index) => (
              <div key={index} className={`mb-1.5 p-2 rounded-lg shadow-sm ${msg.user === 'You' ? (theme === 'dark' ? 'bg-blue-700 text-blue-100 ml-auto' : 'bg-blue-100 text-blue-800 ml-auto') : (theme === 'dark' ? 'bg-gray-600 text-gray-200 mr-auto' : 'bg-gray-200 text-gray-700 mr-auto')}`} style={{maxWidth: '85%'}}>
                <strong className={msg.user === 'You' ? '' : (theme === 'dark' ? 'text-orange-400' : 'text-orange-600')}>{msg.user === 'You' ? (language === 'ar' ? 'أنت' : 'You') : msg.user}: </strong>{msg.text}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input 
              type="text"
              value={chatbotInput}
              onChange={(e) => setChatbotInput(e.target.value)}
              placeholder={t('chatbotPlaceholder')}
              className={`flex-grow p-2.5 ${inputBaseClasses} ${themedInputClasses}`} 
              onKeyPress={(e) => e.key === 'Enter' && handleChatbotSend()}
            />
            <button 
              onClick={handleChatbotSend}
              className={`px-4 py-2.5 rounded-lg text-xs font-medium transition-colors shadow-sm ${primaryButtonColors.replace('w-full ', '')}`}>
              {t('chatbotSend')}
            </button>
          </div>
        </FunStuffCard>

        <FunStuffCard titleKey="jokesToday" icon={<FaceSmileIcon />} iconClassName="animate-wiggle" apiKeyMissingMessageKey="funStuffApiKeyMissingJoke">
           <div id="joke-card-content" className={`text-sm min-h-[100px] flex items-center justify-center p-3 rounded-lg ${theme === 'dark' ? 'text-gray-300 bg-gray-700' : 'text-gray-700 bg-gray-50'} ${language === 'ar' ? 'text-right' : 'text-left'}`}>
             {isJokeLoading ? (language === 'ar' ? 'بنحضرلك نكتة بترولية على ما تفرج...' : 'Cooking up a petroleum joke...') : (currentJokeText || (language === 'ar' ? 'مفيش نكت دلوقتي، حاول تاني.' : 'No jokes right now, try again.'))}
           </div>
          <button 
            onClick={getNewJoke}
            disabled={isJokeLoading}
            className={`mt-3 ${primaryButtonBaseClasses} ${secondaryButtonColors} ${isJokeLoading ? secondaryButtonDisabledColors : ''} flex items-center justify-center gap-1.5`}>
            {language === 'ar' ? "نكتة تانية يا ريس!" : "Another One, Boss!"} <ForwardIcon className="h-4 w-4"/>
          </button>
        </FunStuffCard>

      </div>
       <p className={`mt-8 md:mt-10 text-xs md:text-sm text-center ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
        {language === 'ar' ? 'الشغل مهم بس برضه لازم نرفه عن نفسنا شوية عشان نعرف نكمل بنفس الكفاءة! فكها الضحكة بتطول العمر.' : 'Work is important, but entertainment keeps the engine running smoothly! Relax and enjoy.'}
=======
const MusicalNoteIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" /></svg>
  );
  

export const FunStuffView: React.FC = () => {
  const { t: translate, language } = useLanguageContext(); // Renamed t to translate
  const { theme } = React.useContext(ThemeContext);
  const [joke, setJoke] = useState('');
  const [puzzle, setPuzzle] = useState({ question: '', options: [] as string[], answer: '' });

  const fetchJoke = () => {
    setJoke(language === Language.AR ? 'ليه الكمبيوتر دخل السجن؟ عشان عمل ويندو على بيت الجيران! 😂' : 'Why did the computer go to jail? Because it had too many windows on its neighbor\'s house! 😂');
  };

  const fetchPuzzle = () => {
    setPuzzle({
      question: language === Language.AR ? 'ما هو الشيء الذي كلما أخذت منه كبر؟' : 'What is it that the more you take, the larger it grows?',
      options: language === Language.AR ? ['الحفرة', 'العمر', 'الراتب'] : ['A hole', 'Age', 'Salary'],
      answer: language === Language.AR ? 'الحفرة' : 'A hole'
    });
  };

  React.useEffect(() => {
    fetchJoke();
    fetchPuzzle();
  }, [language]);

  const pageTitleColor = theme === 'dark' ? 'text-orange-400' : 'text-orange-500';
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
  const buttonClass = `px-4 py-2 rounded-lg font-medium transition-colors ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`;

  return (
    <div className={`p-4 ${language === 'ar' ? 'font-cairo' : 'font-poppins'}`}>
      <div className="flex items-center mb-6">
        <SparklesIcon className={`h-8 w-8 ${pageTitleColor} ${language === 'ar' ? 'ml-3' : 'mr-3'}`} />
        <h1 className={`text-2xl md:text-3xl font-bold ${pageTitleColor}`}>
          {translate('funStuffTitle')}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Jokes Section */}
        <div className={`p-6 rounded-lg shadow-lg ${cardBg}`}>
          <h2 className={`text-xl font-semibold mb-3 flex items-center ${textColor}`}>
            <ChatBubbleLeftRightIcon className="h-6 w-6 mr-2 rtl:ml-2" /> {translate('jokesToday')}
          </h2>
          <p className={`mb-4 ${textColor}`}>{joke || translate('jokeFetchingError')}</p>
          <button onClick={fetchJoke} className={buttonClass}>
            {language === Language.AR ? 'نكتة تانية بسرعة!' : 'Another Joke!'}
          </button>
        </div>

        {/* Puzzle Section */}
        <div className={`p-6 rounded-lg shadow-lg ${cardBg}`}>
          <h2 className={`text-xl font-semibold mb-3 flex items-center ${textColor}`}>
            <PuzzlePieceIcon className="h-6 w-6 mr-2 rtl:ml-2" /> {translate('puzzleGameTitle')}
          </h2>
          <p className={`mb-3 ${textColor}`}>{puzzle.question || translate('puzzleFetchingError')}</p>
          {/* Puzzle options and submission would go here */}
          {/* If the error was indeed on a title attribute, it would look like this:
           <button onClick={fetchPuzzle} className={buttonClass} title={translate('puzzleGamePlay')}>
          */}
          <button onClick={fetchPuzzle} className={buttonClass}>
            {translate('puzzleGamePlay')}
          </button>
        </div>

        {/* Quran Radio Placeholder - Actual player is in Header */}
        <div className={`p-6 rounded-lg shadow-lg ${cardBg} md:col-span-2`}>
          <h2 className={`text-xl font-semibold mb-3 flex items-center ${textColor}`}>
            <MusicalNoteIcon className="h-6 w-6 mr-2 rtl:ml-2" /> {translate('quranRadio')}
          </h2>
          <p className={`${textColor}`}>
            {language === Language.AR ? 'يمكنك التحكم في إذاعة القرآن الكريم من الشريط العلوي للتطبيق.' : 'You can control the Quran Radio from the top header of the application.'}
          </p>
        </div>
      </div>
       <p className={`mt-8 text-xs text-center ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
        {language === 'ar' ? 'استمتع بوقتك يا فهلوي، بس متنساش الشغل!' : 'Enjoy your time, Fahlawy, but don\'t forget the work!'}
>>>>>>> bee2d85 (updated)
      </p>
    </div>
  );
};
<<<<<<< HEAD

export default FunStuffView;
=======
>>>>>>> bee2d85 (updated)
