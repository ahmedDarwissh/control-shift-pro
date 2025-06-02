
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
=======
>>>>>>> 96a8f29 (First commit)
import React, { useState, useContext, useEffect } from 'react';
import { useLanguageContext } from '../hooks/useLanguage';
import { ThemeContext } from '../contexts/ThemeContext';
import { ViewName, UserRole, LoggedInUser, ActivityLogType, TranslationSet } from '../types';
<<<<<<< HEAD
import { ToastContext } from '../contexts/ToastContext'; // UPDATED IMPORT
import { useActivityLog } from '../hooks/useActivityLog'; 

>>>>>>> bee2d85 (updated)
=======
import { ToastContext } from '../contexts/ToastContext'; 
import { useActivityLog } from '../hooks/useActivityLog'; 
import { auth } from '../firebase'; // Firebase Auth
import { sendPasswordResetEmail } from 'firebase/auth';


>>>>>>> 96a8f29 (First commit)
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
<<<<<<< HEAD
<<<<<<< HEAD

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
=======
=======
>>>>>>> 96a8f29 (First commit)
const FireIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1.001A3.75 3.75 0 0012 18z" />
  </svg>
);
const QuestionMarkCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
  </svg>
);

const AnimatedFingerprintIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <style>
        {`
          .fp-line {
            stroke-width: 2.5;
            stroke-linecap: round;
            animation: fp-draw 1.8s ease-in-out infinite alternate;
          }
          .fp-line-outer { stroke-dasharray: 120; stroke-dashoffset: 120; animation-delay: 0s; }
          .fp-line-mid1 { stroke-dasharray: 90; stroke-dashoffset: 90; animation-delay: 0.15s; }
          .fp-line-mid2 { stroke-dasharray: 70; stroke-dashoffset: 70; animation-delay: 0.3s; }
          .fp-line-inner { stroke-dasharray: 50; stroke-dashoffset: 50; animation-delay: 0.45s; }
          .fp-scan-line {
            stroke-width: 2;
            stroke-linecap: round;
            animation: fp-scan 1.8s linear infinite;
            opacity: 0.8;
          }
          @keyframes fp-draw {
            to { stroke-dashoffset: 0; }
          }
          @keyframes fp-scan {
            0% { transform: translateY(-12px); opacity: 0; }
            20% { transform: translateY(0px); opacity: 0.7; }
            80% { transform: translateY(60px); opacity: 0.7; }
            100% { transform: translateY(72px); opacity: 0;}
          }
        `}
      </style>
      <g transform="translate(0 -5)">
        <path className="fp-line fp-line-outer" d="M30,40 Q50,20 70,40" fill="none" stroke="currentColor"/>
        <path className="fp-line fp-line-outer" d="M25,50 Q50,30 75,50" fill="none" stroke="currentColor"/>
        <path className="fp-line fp-line-mid1" d="M30,60 Q50,42 70,60" fill="none" stroke="currentColor"/>
        <path className="fp-line fp-line-mid2" d="M35,70 Q50,55 65,70" fill="none" stroke="currentColor"/>
        <path className="fp-line fp-line-mid1" d="M28,80 Q50,65 72,80" fill="none" stroke="currentColor"/>
        <path className="fp-line fp-line-inner" d="M40,88 Q50,78 60,88" fill="none" stroke="currentColor"/>
        <path className="fp-line fp-line-outer" d="M50,25 Q40,40 50,55 Q60,70 50,85" fill="none" stroke="currentColor"/>
      </g>
      <line className="fp-scan-line" x1="20" y1="30" x2="80" y2="30" stroke="currentColor" />
    </svg>
  );

interface LoginViewProps {
  onNavigate: (view: ViewName) => void;
  showErrorModal: (title: string, message: string) => void;
<<<<<<< HEAD
  onMockLogin: (user: LoggedInUser) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onNavigate, showErrorModal, onMockLogin }) => {
=======
  onFirebaseLogin: (emailVal: string, passwordVal: string) => Promise<void>; // Updated prop
  onPasswordReset: (emailVal: string) => Promise<void>; // New prop
}

const LoginView: React.FC<LoginViewProps> = ({ onNavigate, showErrorModal, onFirebaseLogin, onPasswordReset }) => {
>>>>>>> 96a8f29 (First commit)
  const { t, language } = useLanguageContext();
  const { theme } = React.useContext(ThemeContext);
  const { addToast } = useContext(ToastContext);
  const { addActivityLogEntry } = useActivityLog(); 
<<<<<<< HEAD
>>>>>>> bee2d85 (updated)
=======
>>>>>>> 96a8f29 (First commit)

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> 96a8f29 (First commit)
  const [isBiometricSupportedState, setIsBiometricSupportedState] = useState(false);
  const [isBiometricEnabledState, setIsBiometricEnabledState] = useState(false);

  useEffect(() => {
    const checkBiometricSupport = async () => {
<<<<<<< HEAD
        if (navigator.credentials && typeof navigator.credentials.get === 'function' && PublicKeyCredential && PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) {
=======
        if (navigator.credentials && typeof navigator.credentials.get === 'function' && typeof PublicKeyCredential !== 'undefined' && PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) {
>>>>>>> 96a8f29 (First commit)
            try {
                const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
                setIsBiometricSupportedState(available);
            } catch (e) {
                console.warn("Error checking biometric availability:", e);
                setIsBiometricSupportedState(false);
            }
        } else {
            setIsBiometricSupportedState(false);
        }
    };
    checkBiometricSupport();
    const bioEnabledSetting = localStorage.getItem('biometricLoginEnabled');
    setIsBiometricEnabledState(bioEnabledSetting === 'true');
  }, []);
<<<<<<< HEAD
>>>>>>> bee2d85 (updated)
=======
>>>>>>> 96a8f29 (First commit)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
<<<<<<< HEAD
<<<<<<< HEAD
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
  
=======
=======
>>>>>>> 96a8f29 (First commit)
      showErrorModal(t('loginTitle'), language === 'ar' ? 'يا ريس، دخل الإيميل والباسورد الأول عشان نعرفك! 🧐' : 'Boss, enter email and password first so we know who you are! 🧐');
      return;
    }
    setIsLoading(true);
<<<<<<< HEAD
    setTimeout(() => {
      if (email.toLowerCase() === "test@example.com" && password === "password") {
        const mockUser: LoggedInUser = {
          id: 'mockuser001',
          firebaseUid: 'mockuser001',
          name: t('expertUserDefaultName'),
          email: email,
          role: UserRole.Engineer,
          teamId: 'team1',
          phone: '01001234567',
          expertisePoints: 50,
          avatarUrl: undefined,
        };
        onMockLogin(mockUser);
      } else {
        showErrorModal(t('loginTitle'), t('loginFailedError'));
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleForgotPassword = () => {
    if (!email) {
      addToast(language === 'ar' ? 'دخل ايميلك الأول يا فنان عشان نبعتلك عليه.' : 'Enter your email first, artist, so we can send it there.', 'alert');
      return;
    }
    addToast(t('loginPasswordResetSent'), 'success');
    addActivityLogEntry(ActivityLogType.PasswordResetRequested, 'activityLogEntryPasswordResetRequested', { userName: 'anonymous', email });
=======
    await onFirebaseLogin(email, password); // Use the passed Firebase login function
    setIsLoading(false);
  };

  const handleForgotPassword = () => {
    onPasswordReset(email);
>>>>>>> 96a8f29 (First commit)
  };

  const handleBiometricLogin = () => {
    if (!isBiometricSupportedState) {
        addToast(t('biometricLoginNotSupported'), 'alert');
        addActivityLogEntry(ActivityLogType.BiometricLoginAttempt, 'activityLogEntryBiometricLoginAttempt', { userName: 'anonymous', status: 'not_supported' });
        return;
    }
    if (!isBiometricEnabledState) {
        addToast(language === 'ar' ? 'فعل الدخول بالبصمة من الإعدادات الأول يا بطل.' : 'Enable biometric login from settings first, champ.', 'info');
        addActivityLogEntry(ActivityLogType.BiometricLoginAttempt, 'activityLogEntryBiometricLoginAttempt', { userName: 'anonymous', status: 'not_enabled_in_settings' });
        return;
    }
    setIsLoading(true);
<<<<<<< HEAD
    // Mock Biometric Login
    setTimeout(() => {
        const mockBioUser: LoggedInUser = {
            id: 'mockbiouser007',
            firebaseUid: 'mockbiouser007',
            name: language === 'ar' ? 'مستخدم بصمة خبير' : 'Expert Biometric User',
            email: 'biometric@example.com',
            role: UserRole.Supervisor,
            teamId: 'team2',
            phone: '01220000007',
            expertisePoints: 77,
            avatarUrl: undefined,
          };
        onMockLogin(mockBioUser);
        addToast(t('loginBiometricSuccessToast'), 'success');
        addActivityLogEntry(ActivityLogType.BiometricLoginAttempt, 'activityLogEntryBiometricLoginAttempt', { userName: mockBioUser.name, status: 'success' });
=======
    // Actual biometric login logic will be handled by Firebase if implemented via WebAuthn
    // For this mock, we'll simulate a successful biometric login.
    // In a real app, this would call a function passed from App.tsx that triggers Firebase WebAuthn flow.
    setTimeout(async () => {
        // Simulate successful biometric auth by directly calling onFirebaseLogin with mock/retrieved credentials
        // This is a placeholder. Real biometric would not use email/password.
        // It would verify a credential and then perhaps sign in with a custom token or existing session.
        // For now, let's assume biometric success leads to calling onFirebaseLogin with demo credentials.
        // This part needs to be thought out for a real implementation.
        // For demo purposes, let's use the entered email and a placeholder password.
        if (email) {
             await onFirebaseLogin(email, "biometric_placeholder_password"); // This is NOT secure. For demo only.
        } else {
            showErrorModal(t('loginTitle'), "Email required for biometric demo login.");
        }
        addToast(t('loginBiometricSuccessToast'), 'success');
        addActivityLogEntry(ActivityLogType.BiometricLoginAttempt, 'activityLogEntryBiometricLoginAttempt', { userName: email || 'biometric_user', status: 'success_mock' });
>>>>>>> 96a8f29 (First commit)
        setIsLoading(false);
    }, 1200);
  };

  const pageBg = theme === 'dark' ? 'bg-dark-bg' : 'bg-light-gray';
  const cardBg = theme === 'dark' ? 'bg-dark-card' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
  const secondaryTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const inputBg = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50';
  const inputBorder = theme === 'dark' ? 'border-gray-600 focus:border-bright-yellow' : 'border-gray-300 focus:border-marine-blue';
  const inputPlaceholderColor = theme === 'dark' ? 'placeholder-gray-500' : 'placeholder-gray-400';
  const iconColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const buttonPrimaryBg = theme === 'dark' ? 'bg-bright-yellow hover:bg-yellow-300 text-marine-blue' : 'bg-marine-blue hover:bg-blue-700 text-white';
  const buttonSecondaryBg = theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-700';
  const buttonDisabledBg = theme === 'dark' ? 'bg-gray-600' : 'bg-gray-400';
  const linkColor = theme === 'dark' ? 'text-bright-yellow hover:text-yellow-300' : 'text-marine-blue hover:text-blue-700';
  const appLogoColor = theme === 'dark' ? 'text-bright-yellow' : 'text-marine-blue';

<<<<<<< HEAD
>>>>>>> bee2d85 (updated)
=======
>>>>>>> 96a8f29 (First commit)
  const inputPadding = language === 'ar' ? 'pr-10' : 'pl-10';
  const iconPosition = language === 'ar' ? 'right-3' : 'left-3';

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${pageBg} ${textColor} ${language === 'ar' ? 'font-cairo' : 'font-poppins'}`}>
      <div className={`w-full max-w-md p-8 md:p-10 rounded-xl shadow-2xl ${cardBg}`}>
        <div className="text-center mb-8">
<<<<<<< HEAD
<<<<<<< HEAD
          <ArrowPathIcon className={`h-12 w-12 mx-auto mb-4 ${appLogoColor}`} />
          <h1 className={`text-2xl md:text-3xl font-bold ${textColor}`}>{t('loginTitle')}</h1>
          <p className={`text-sm mt-2 ${secondaryTextColor}`}>
            {language === 'ar' ? 'مرحباً بك مجدداً! جاهز للشغل؟' : 'Welcome back! Ready for your shift?'}
=======
=======
>>>>>>> 96a8f29 (First commit)
          <FireIcon className={`h-12 w-12 mx-auto mb-2 ${appLogoColor} animate-pulse-slow`} />
          <h1 className={`text-2xl md:text-3xl font-bold ${textColor}`}>{t('loginTitle')}</h1>
          <p className={`text-sm mt-1 ${secondaryTextColor}`}>
            {t('ugdcWelcome')}
          </p>
<<<<<<< HEAD
           <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>
            {language === 'ar' ? 'استخدم: test@example.com / password للدخول يا فنان 😉' : 'Use: test@example.com / password to enter, artist 😉'}
>>>>>>> bee2d85 (updated)
          </p>
=======
>>>>>>> 96a8f29 (First commit)
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className={`block text-sm font-medium mb-1.5 ${secondaryTextColor}`}>{t('emailLabel')}</label>
            <div className="relative">
              <div className={`absolute inset-y-0 ${iconPosition} flex items-center pointer-events-none`}>
<<<<<<< HEAD
<<<<<<< HEAD
                <EnvelopeIcon className={`h-5 w-5 ${iconColor}`} />
=======
                <EnvelopeIcon className={`h-5 w-5 ${iconColor} transition-transform group-focus-within:scale-110`} />
>>>>>>> bee2d85 (updated)
=======
                <EnvelopeIcon className={`h-5 w-5 ${iconColor} transition-transform group-focus-within:scale-110`} />
>>>>>>> 96a8f29 (First commit)
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
<<<<<<< HEAD
<<<<<<< HEAD
                className={`w-full p-3.5 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 ${inputPadding} ${inputBg} ${inputBorder} ${textColor} ${inputPlaceholderColor}`}
                placeholder={language === 'ar' ? 'ايميلك يا بطل...' : 'Your email, champ...'}
=======
                className={`w-full p-3.5 border rounded-lg shadow-sm focus:ring-2 ${inputPadding} ${inputBg} ${inputBorder} ${textColor} ${inputPlaceholderColor} group`}
                placeholder={language === 'ar' ? 'ايميلك يا بطل الكون...' : 'Your email, champ of the universe...'}
>>>>>>> bee2d85 (updated)
=======
                className={`w-full p-3.5 border rounded-lg shadow-sm focus:ring-2 ${inputPadding} ${inputBg} ${inputBorder} ${textColor} ${inputPlaceholderColor} group`}
                placeholder={language === 'ar' ? 'ايميلك يا بطل الكون...' : 'Your email, champ of the universe...'}
>>>>>>> 96a8f29 (First commit)
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className={`block text-sm font-medium mb-1.5 ${secondaryTextColor}`}>{t('passwordLabel')}</label>
            <div className="relative">
              <div className={`absolute inset-y-0 ${iconPosition} flex items-center pointer-events-none`}>
<<<<<<< HEAD
<<<<<<< HEAD
                <LockClosedIcon className={`h-5 w-5 ${iconColor}`} />
=======
                <LockClosedIcon className={`h-5 w-5 ${iconColor} transition-transform group-focus-within:scale-110`} />
>>>>>>> bee2d85 (updated)
=======
                <LockClosedIcon className={`h-5 w-5 ${iconColor} transition-transform group-focus-within:scale-110`} />
>>>>>>> 96a8f29 (First commit)
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
<<<<<<< HEAD
<<<<<<< HEAD
                className={`w-full p-3.5 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 ${inputPadding} ${inputBg} ${inputBorder} ${textColor} ${inputPlaceholderColor}`}
                placeholder={language === 'ar' ? 'كلمة المرور السرية...' : 'Your secret password...'}
              />
            </div>
=======
=======
>>>>>>> 96a8f29 (First commit)
                className={`w-full p-3.5 border rounded-lg shadow-sm focus:ring-2 ${inputPadding} ${inputBg} ${inputBorder} ${textColor} ${inputPlaceholderColor} group`}
                placeholder={language === 'ar' ? 'كلمة سر محدش يعرفها غيرك... 😉' : 'Your top-secret password... 😉'}
              />
            </div>
            <div className="mt-2 text-right">
              <button
                type="button"
                onClick={handleForgotPassword}
                className={`text-xs font-medium ${linkColor} transition-colors flex items-center ${language === 'ar' ? 'float-left' : 'float-right'}`}
              >
                <QuestionMarkCircleIcon className={`h-4 w-4 ${language === 'ar' ? 'ml-1' : 'mr-1'}`}/>
                {t('loginForgotPasswordPrompt')}
              </button>
            </div>
<<<<<<< HEAD
>>>>>>> bee2d85 (updated)
=======
>>>>>>> 96a8f29 (First commit)
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-base transition-colors duration-150 ease-in-out shadow-md hover:shadow-lg transform hover:scale-[1.02]
<<<<<<< HEAD
<<<<<<< HEAD
              ${isLoading 
                ? `${buttonDisabledBg} text-gray-300 cursor-not-allowed` 
                : `${buttonPrimaryBg} ${buttonPrimaryText}`
              }
            `}
          >
            {isLoading ? (language === 'ar' ? 'لحظات يا ريس...' : 'Logging in...') : t('loginButton')}
          </button>
=======
=======
>>>>>>> 96a8f29 (First commit)
              ${isLoading
                ? `${buttonDisabledBg} text-gray-300 cursor-not-allowed`
                : `${buttonPrimaryBg}`
              }
            `}
          >
            {isLoading ? (language === 'ar' ? 'لحظات يا كبير الخبراء... ⏳' : 'Logging in, O Great Expert... ⏳') : t('loginButton')}
          </button>

          {isBiometricSupportedState && isBiometricEnabledState && (
             <button
                type="button"
                onClick={handleBiometricLogin}
                disabled={isLoading}
                aria-label={t('loginWithBiometricsButton')}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-sm transition-colors duration-150 ease-in-out shadow-md hover:shadow-lg transform hover:scale-[1.02] flex flex-col items-center justify-center gap-y-1.5
                ${isLoading
                    ? `${buttonDisabledBg} text-gray-400 cursor-not-allowed`
                    : `${buttonSecondaryBg}`
                }`}
              >
               <AnimatedFingerprintIcon className={`h-12 w-12 mb-1 ${isLoading ? (theme === 'dark' ? 'text-gray-500' : 'text-gray-400') : (theme === 'dark' ? 'text-bright-yellow' : 'text-marine-blue') }`} />
                <span className="text-xs">{t('loginWithBiometricsButton')}</span>
              </button>
          )}

<<<<<<< HEAD
>>>>>>> bee2d85 (updated)
=======
>>>>>>> 96a8f29 (First commit)
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

<<<<<<< HEAD
<<<<<<< HEAD
export default LoginView;
=======
export default LoginView;
>>>>>>> bee2d85 (updated)
=======
export default LoginView;
>>>>>>> 96a8f29 (First commit)
