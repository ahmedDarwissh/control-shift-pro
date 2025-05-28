
import React, { useState, useContext } from 'react';
import { useLanguageContext } from '../hooks/useLanguage';
import { ThemeContext, ToastContext } from '../App';
import { ViewName } from '../types'; 
import { Auth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { Firestore, doc, getDoc } from "firebase/firestore";
import { db as appDb } from '../index'; // Import db for reachability check

// Heroicons
const ArrowPathIcon: React.FC<{ className?: string }> = ({ className }) => ( // Placeholder for AppLogoIcon, representing process/control
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
);
const EnvelopeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);
const LockClosedIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

interface LoginViewProps {
  auth: Auth; 
  onNavigate: (view: ViewName) => void;
  showErrorModal: (title: string, message: string) => void;
}

// Firestore Reachability Check Function
async function checkFirestoreReachability(db: Firestore): Promise<boolean> {
  try {
    await getDoc(doc(db, '__ctrlshiftpro_healthcheck__', '__ping__'), { source: 'server' });
    return true;
  } catch (error: any) {
    if (error.code === 'unavailable' || (error.message && error.message.toLowerCase().includes("offline"))) {
      console.warn("Firestore reachability check failed: Offline or unavailable.", error);
      return false;
    }
    console.warn("Firestore reachability check encountered an unknown error:", error);
    return false; // Treat other errors as unreachability for login/signup robustness
  }
}


const LoginView: React.FC<LoginViewProps> = ({ auth, onNavigate, showErrorModal }) => {
  const { t, language } = useLanguageContext();
  const { theme } = useContext(ThemeContext);
  // const { addToast } = useContext(ToastContext); // addToast might still be used for non-critical info

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showErrorModal(t('loginTitle'), language === 'ar' ? 'يا ريس، دخل الإيميل والباسورد الأول!' : 'Boss, enter email and password first!');
      return;
    }
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      const isFirestoreReachable = await checkFirestoreReachability(appDb as Firestore);
      if (!isFirestoreReachable) {
        const dbConnectionErrorMessage = language === 'ar' 
            ? 'فشل تسجيل الدخول: تعذر الاتصال بقاعدة البيانات. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.' 
            : 'Login Failed: Could not connect to the database. Please check your internet connection and try again.';
        
        if (auth.currentUser) { // Sign out if auth succeeded but DB failed
            await signOut(auth);
        }
        showErrorModal(t('loginTitle'), dbConnectionErrorMessage);
        setIsLoading(false);
        return;
      }
      // If reachable, onAuthStateChanged in App.tsx will handle navigation and user data loading.
    } catch (error: any) {
      console.error("Login error:", error);
      let errorTitle = t('loginTitle');
      let errorMessage = t('loginFailedError');
      if (error.code === 'auth/network-request-failed') {
        errorMessage = t('loginFailedNetworkError');
      } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMessage = language === 'ar' ? 'الإيميل أو كلمة المرور غلط يا كبير. راجع تاني كده.' : 'Incorrect email or password. Please check again.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = language === 'ar' ? 'صيغة الإيميل دي مش مظبوطة يا هندسة.' : 'The email format is incorrect, engineer.';
      }
      showErrorModal(errorTitle, errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const pageBg = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
  const secondaryTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const inputBg = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100';
  const inputBorder = theme === 'dark' ? 'border-gray-600 focus:border-blue-500' : 'border-gray-300 focus:border-blue-600';
  const inputPlaceholderColor = theme === 'dark' ? 'placeholder-gray-500' : 'placeholder-gray-400';
  const iconColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const buttonPrimaryBg = theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700';
  const buttonPrimaryText = 'text-white';
  const buttonDisabledBg = theme === 'dark' ? 'bg-gray-600' : 'bg-gray-400';
  const linkColor = theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700';
  const appLogoColor = theme === 'dark' ? 'text-blue-500' : 'text-blue-600';
  
  const inputPadding = language === 'ar' ? 'pr-10' : 'pl-10';
  const iconPosition = language === 'ar' ? 'right-3' : 'left-3';

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${pageBg} ${textColor} ${language === 'ar' ? 'font-cairo' : 'font-poppins'}`}>
      <div className={`w-full max-w-md p-8 md:p-10 rounded-xl shadow-2xl ${cardBg}`}>
        <div className="text-center mb-8">
          <ArrowPathIcon className={`h-12 w-12 mx-auto mb-4 ${appLogoColor}`} />
          <h1 className={`text-2xl md:text-3xl font-bold ${textColor}`}>{t('loginTitle')}</h1>
          <p className={`text-sm mt-2 ${secondaryTextColor}`}>
            {language === 'ar' ? 'مرحباً بك مجدداً! جاهز للشغل؟' : 'Welcome back! Ready for your shift?'}
          </p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className={`block text-sm font-medium mb-1.5 ${secondaryTextColor}`}>{t('emailLabel')}</label>
            <div className="relative">
              <div className={`absolute inset-y-0 ${iconPosition} flex items-center pointer-events-none`}>
                <EnvelopeIcon className={`h-5 w-5 ${iconColor}`} />
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`w-full p-3.5 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 ${inputPadding} ${inputBg} ${inputBorder} ${textColor} ${inputPlaceholderColor}`}
                placeholder={language === 'ar' ? 'ايميلك يا بطل...' : 'Your email, champ...'}
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className={`block text-sm font-medium mb-1.5 ${secondaryTextColor}`}>{t('passwordLabel')}</label>
            <div className="relative">
              <div className={`absolute inset-y-0 ${iconPosition} flex items-center pointer-events-none`}>
                <LockClosedIcon className={`h-5 w-5 ${iconColor}`} />
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`w-full p-3.5 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 ${inputPadding} ${inputBg} ${inputBorder} ${textColor} ${inputPlaceholderColor}`}
                placeholder={language === 'ar' ? 'كلمة المرور السرية...' : 'Your secret password...'}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-base transition-colors duration-150 ease-in-out shadow-md hover:shadow-lg transform hover:scale-[1.02]
              ${isLoading 
                ? `${buttonDisabledBg} text-gray-300 cursor-not-allowed` 
                : `${buttonPrimaryBg} ${buttonPrimaryText}`
              }
            `}
          >
            {isLoading ? (language === 'ar' ? 'لحظات يا ريس...' : 'Logging in...') : t('loginButton')}
          </button>
        </form>
        <div className="mt-8 text-center">
          <button
            onClick={() => onNavigate('signup')}
            className={`text-sm font-medium ${linkColor} transition-colors`}
          >
            {t('dontHaveAccountPrompt')}
          </button>
        </div>
      </div>
      <p className={`mt-8 text-xs text-center ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
        {t('globalFooter')}
      </p>
    </div>
  );
};

export default LoginView;