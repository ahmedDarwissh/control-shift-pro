
import React, { useState, useContext } from 'react';
import { useLanguageContext } from '../hooks/useLanguage';
<<<<<<< HEAD
<<<<<<< HEAD
import { ThemeContext, ToastContext } from '../App';
import { ViewName } from '../types'; 
import { Auth, User, createUserWithEmailAndPassword, updateProfile, deleteUser } from "firebase/auth";
import { Firestore, doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { UserRole } from '../types';

// Heroicons
const ArrowPathIcon: React.FC<{ className?: string }> = ({ className }) => ( // Placeholder for AppLogoIcon
=======
import { ThemeContext } from '../contexts/ThemeContext'; 
import { ToastContext } from '../contexts/ToastContext'; // UPDATED IMPORT
import { ViewName, UserRole, LoggedInUser } from '../types'; 

const ArrowPathIcon: React.FC<{ className?: string }> = ({ className }) => ( 
>>>>>>> bee2d85 (updated)
=======
import { ThemeContext } from '../contexts/ThemeContext'; 
import { ToastContext } from '../contexts/ToastContext'; 
import { ViewName, UserRole, User } from '../types'; // Changed AppUser to User

const ArrowPathIcon: React.FC<{ className?: string }> = ({ className }) => ( 
>>>>>>> 96a8f29 (First commit)
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
);
const UserCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
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
<<<<<<< HEAD
<<<<<<< HEAD

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
    return false; 
  }
}

interface SignupViewProps {
  auth: Auth; 
  db: Firestore; 
  onNavigate: (view: ViewName) => void;
  showErrorModal: (title: string, message: string) => void;
}

const SignupView: React.FC<SignupViewProps> = ({ auth, db, onNavigate, showErrorModal }) => {
  const { t, language } = useLanguageContext();
  const { theme } = useContext(ThemeContext);
  const { addToast } = useContext(ToastContext); // Keep for success messages or non-critical info
=======
=======
>>>>>>> 96a8f29 (First commit)
const FireIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1.001A3.75 3.75 0 0012 18z" />
  </svg>
);

interface SignupViewProps {
  onNavigate: (view: ViewName) => void;
  showErrorModal: (title: string, message: string) => void;
<<<<<<< HEAD
  onMockSignup: (user: Omit<LoggedInUser, 'id' | 'firebaseUid' | 'avatarUrl'>) => void; 
}

const SignupView: React.FC<SignupViewProps> = ({ onNavigate, showErrorModal, onMockSignup }) => {
  const { t, language } = useLanguageContext();
  const { theme } = React.useContext(ThemeContext);
  const { addToast } = useContext(ToastContext);
>>>>>>> bee2d85 (updated)
=======
  onFirebaseSignup: (userData: Omit<User, 'id' | 'avatarUrl'> & { password: string }) => Promise<void>; 
}

const SignupView: React.FC<SignupViewProps> = ({ onNavigate, showErrorModal, onFirebaseSignup }) => {
  const { t, language } = useLanguageContext();
  const { theme } = React.useContext(ThemeContext);
  const { addToast } = useContext(ToastContext);
>>>>>>> 96a8f29 (First commit)

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
<<<<<<< HEAD
<<<<<<< HEAD
=======
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.Employee);

>>>>>>> bee2d85 (updated)
=======
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.Employee);

>>>>>>> 96a8f29 (First commit)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password || !confirmPassword) {
<<<<<<< HEAD
<<<<<<< HEAD
      showErrorModal(t('signupTitle'), language === 'ar' ? 'يا ريس، كمل بياناتك كلها الأول!' : 'Boss, complete all your details first!');
      return;
    }
    if (password !== confirmPassword) {
      showErrorModal(t('signupTitle'), language === 'ar' ? 'كلمة المرور وتأكيدها مش زي بعض يا هندسة!' : 'Password and confirmation don\'t match, engineer!');
      return;
    }
    setIsLoading(true);
    let firebaseUser: User | null = null; 
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      firebaseUser = userCredential.user;

      if (firebaseUser) {
        
        const isFirestoreReachable = await checkFirestoreReachability(db);
        if (!isFirestoreReachable) {
            const dbConnectionErrorMessage = language === 'ar' 
                ? 'فشل إنشاء الحساب: تعذر الاتصال بقاعدة البيانات. تم إلغاء إنشاء الحساب. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.' 
                : 'Signup Failed: Could not connect to the database. Account creation cancelled. Please check your internet connection and try again.';
          
          if (firebaseUser) { 
            await deleteUser(firebaseUser); 
          }
          showErrorModal(t('signupTitle'), dbConnectionErrorMessage);
          setIsLoading(false);
          return;
        }

        await updateProfile(firebaseUser, { displayName: fullName });

        const userDocRef = doc(db, "users", firebaseUser.uid);
        try {
            await setDoc(userDocRef, {
                name: fullName,
                email: firebaseUser.email,
                role: UserRole.Employee, 
                phone: '', 
                teamId: 'default_team_new_user', 
                createdAt: serverTimestamp(),
            });
            addToast(language === 'ar' ? 'تم إنشاء حسابك بنجاح يا بطل!' : 'Account created successfully, champ!', 'success');
            // onNavigate('dashboard') will be handled by onAuthStateChanged in App.tsx
        } catch (firestoreError: any) {
            console.error("Error saving user to Firestore (after reachability check):", firestoreError);
            let specificErrorMessage = language === 'ar' ? 'تم إنشاء حسابك، ولكن فشل حفظ بعض البيانات. حاول تسجيل الدخول أو اتصل بالدعم.' : 'Account created, but failed to save some profile data. Try logging in or contact support.';
            if (firestoreError.message && firestoreError.message.toLowerCase().includes("offline") || firestoreError.code === 'unavailable') {
                specificErrorMessage = language === 'ar' ? 'تم إنشاء الحساب ولكن لا يمكن حفظ بياناتك الآن (أنت غير متصل). ستتم مزامنتها لاحقاً عند توفر اتصال.' : 'Account created, but profile data can\'t be saved now (offline). It will sync later when connection is available.';
            }
            showErrorModal(t('signupTitle'), specificErrorMessage);
             // Optionally, delete the auth user if Firestore save is absolutely critical for first-time setup
            // if (firebaseUser) { await deleteUser(firebaseUser); }
        }
      } else {
        throw new Error("User creation failed, no user returned from Firebase Auth.");
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      let errorTitle = t('signupTitle');
      let errorMessage = t('signupFailedError');
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = language === 'ar' ? 'الإيميل ده مستخدم قبل كده يا كبير. جرب واحد تاني.' : 'This email is already in use, boss. Try another one.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = language === 'ar' ? 'كلمة المرور دي ضعيفة أوي يا هندسة. قويها شوية.' : 'This password is too weak, engineer. Make it stronger.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = language === 'ar' ? 'صيغة الإيميل دي مش مظبوطة يا ريس.' : 'The email format is incorrect, boss.';
      }
      
      // Avoid showing modal if it's already shown for DB connection error
      const dbConnectionErrorMessages = [
          'فشل إنشاء الحساب: تعذر الاتصال بقاعدة البيانات',
          'Signup Failed: Could not connect to the database'
      ];
      const isDbConnectionError = dbConnectionErrorMessages.some(msg => error.message && error.message.includes(msg));

      if (!isDbConnectionError) { // Only show modal if not already shown for DB issue
           showErrorModal(errorTitle, errorMessage);
      }
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
      showErrorModal(t('signupTitle'), language === 'ar' ? 'يا ريس، كمل بياناتك كلها الأول عشان تنضم للشلة! 😎' : 'Boss, complete all your details first to join the gang! 😎');
      return;
    }
    if (password !== confirmPassword) {
      showErrorModal(t('signupTitle'), language === 'ar' ? 'كلمة المرور وتأكيدها مش زي بعض يا هندسة! ركز معانا شوية. 🤔' : 'Password and confirmation don\'t match, engineer! Focus with us a bit. 🤔');
      return;
    }
    setIsLoading(true);
    
<<<<<<< HEAD
    setTimeout(() => {
      if (password.length < 6) {
        showErrorModal(t('signupTitle'), language === 'ar' ? 'كلمة المرور لازم تكون 6 حروف على الأقل عشان تبقى خبير صح. 💪' : 'Password must be at least 6 characters to be a true Expert. 💪');
        setIsLoading(false);
        return;
      }

      const mockNewUserBase: Omit<LoggedInUser, 'id' | 'firebaseUid' | 'avatarUrl' | 'role' | 'teamId'> = {
        name: fullName,
        email: email,
        phone: '', 
        expertisePoints: 0,
      };
      
      let finalMockUserRole: UserRole.Employee | UserRole.Supervisor | UserRole.Engineer;
      let finalMockTeamId: string | undefined = undefined;

      if (selectedRole === UserRole.Engineer || selectedRole === UserRole.ProductionOperator || selectedRole === UserRole.UnitHead) {
        finalMockUserRole = UserRole.Engineer;
      } else if (selectedRole === UserRole.Supervisor || selectedRole === UserRole.ShiftSupervisor) {
        finalMockUserRole = UserRole.Supervisor;
        finalMockTeamId = 'team_mock_signup'; 
      } else { // UserRole.Employee
        finalMockUserRole = UserRole.Employee;
        finalMockTeamId = 'team_mock_signup';
      }

      const finalMockUser: Omit<LoggedInUser, 'id' | 'firebaseUid' | 'avatarUrl'> = {
        ...mockNewUserBase,
        role: finalMockUserRole,
        ...(finalMockTeamId && { teamId: finalMockTeamId }),
      };


      addToast(language === 'ar' ? `أهلاً بيك في فريق بترو-تك يا ${fullName}! حسابك التجريبي جاهز. 🎉` : `Welcome to the Petro-Tech team, ${fullName}! Your mock account is ready. 🎉`, 'success');
      onMockSignup(finalMockUser); 
      setIsLoading(false);
    }, 1500);
=======
    const userData = {
        name: fullName,
        email,
        password,
        role: selectedRole,
        teamId: selectedRole === UserRole.Employee || selectedRole === UserRole.Supervisor ? 'default_team_on_signup' : undefined,
        phone: '',
        expertisePoints: 0, 
      };

    await onFirebaseSignup(userData); 
    setIsLoading(false);
>>>>>>> 96a8f29 (First commit)
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
  const buttonDisabledBg = theme === 'dark' ? 'bg-gray-600' : 'bg-gray-400';
  const linkColor = theme === 'dark' ? 'text-bright-yellow hover:text-yellow-300' : 'text-marine-blue hover:text-blue-700';
  const appLogoColor = theme === 'dark' ? 'text-bright-yellow' : 'text-marine-blue';
<<<<<<< HEAD
>>>>>>> bee2d85 (updated)
=======
>>>>>>> 96a8f29 (First commit)

  const inputPadding = language === 'ar' ? 'pr-10' : 'pl-10';
  const iconPosition = language === 'ar' ? 'right-3' : 'left-3';

<<<<<<< HEAD
<<<<<<< HEAD

=======
>>>>>>> bee2d85 (updated)
=======
>>>>>>> 96a8f29 (First commit)
  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${pageBg} ${textColor} ${language === 'ar' ? 'font-cairo' : 'font-poppins'}`}>
      <div className={`w-full max-w-md p-8 md:p-10 rounded-xl shadow-2xl ${cardBg}`}>
        <div className="text-center mb-8">
<<<<<<< HEAD
<<<<<<< HEAD
          <ArrowPathIcon className={`h-12 w-12 mx-auto mb-4 ${appLogoColor}`} />
          <h1 className={`text-2xl md:text-3xl font-bold ${textColor}`}>{t('signupTitle')}</h1>
          <p className={`text-sm mt-2 ${secondaryTextColor}`}>
            {language === 'ar' ? 'مرحباً بك في فريقنا! جاهز للانضمام؟' : 'Welcome to the team! Ready to join?'}
=======
=======
>>>>>>> 96a8f29 (First commit)
          <FireIcon className={`h-12 w-12 mx-auto mb-2 ${appLogoColor} animate-pulse-slow`} />
          <h1 className={`text-2xl md:text-3xl font-bold ${textColor}`}>{t('signupTitle')}</h1>
          <p className={`text-sm mt-1 ${secondaryTextColor}`}>
            {t('ugdcWelcome')}
<<<<<<< HEAD
>>>>>>> bee2d85 (updated)
=======
>>>>>>> 96a8f29 (First commit)
          </p>
        </div>
        <form onSubmit={handleSignup} className="space-y-5">
          <div>
<<<<<<< HEAD
<<<<<<< HEAD
            <label htmlFor="fullName" className={`block text-sm font-medium mb-1.5 ${secondaryTextColor}`}>{language === 'ar' ? 'الاسم بالكامل' : 'Full Name'}</label>
            <div className="relative">
              <div className={`absolute inset-y-0 ${iconPosition} flex items-center pointer-events-none`}>
                <UserCircleIcon className={`h-5 w-5 ${iconColor}`} />
              </div>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className={`w-full p-3.5 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 ${inputPadding} ${inputBg} ${inputBorder} ${textColor} ${inputPlaceholderColor}`}
                placeholder={language === 'ar' ? 'اسمك يا نجم...' : 'Your name, star...'}
              />
            </div>
          </div>
          <div>
            <label htmlFor="signup-email" className={`block text-sm font-medium mb-1.5 ${secondaryTextColor}`}>{t('emailLabel')}</label>
            <div className="relative">
              <div className={`absolute inset-y-0 ${iconPosition} flex items-center pointer-events-none`}>
                <EnvelopeIcon className={`h-5 w-5 ${iconColor}`} />
              </div>
              <input
                type="email"
                id="signup-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`w-full p-3.5 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 ${inputPadding} ${inputBg} ${inputBorder} ${textColor} ${inputPlaceholderColor}`}
                placeholder={language === 'ar' ? 'ايميلك الشيك...' : 'Your fancy email...'}
              />
            </div>
          </div>
          <div>
            <label htmlFor="signup-password" className={`block text-sm font-medium mb-1.5 ${secondaryTextColor}`}>{t('passwordLabel')}</label>
            <div className="relative">
              <div className={`absolute inset-y-0 ${iconPosition} flex items-center pointer-events-none`}>
                <LockClosedIcon className={`h-5 w-5 ${iconColor}`} />
              </div>
              <input
                type="password"
                id="signup-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`w-full p-3.5 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 ${inputPadding} ${inputBg} ${inputBorder} ${textColor} ${inputPlaceholderColor}`}
                placeholder={language === 'ar' ? 'كلمة مرور قوية...' : 'A strong password...'}
              />
=======
=======
>>>>>>> 96a8f29 (First commit)
            <label htmlFor="fullName" className={`block text-sm font-medium mb-1.5 ${secondaryTextColor}`}>{t('profileNameLabel')}</label>
            <div className="relative">
                <div className={`absolute inset-y-0 ${iconPosition} flex items-center pointer-events-none`}>
                    <UserCircleIcon className={`h-5 w-5 ${iconColor} transition-transform group-focus-within:scale-110`} />
                </div>
                <input type="text" id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required
                    className={`w-full p-3.5 border rounded-lg shadow-sm focus:ring-2 ${inputPadding} ${inputBg} ${inputBorder} ${textColor} ${inputPlaceholderColor} group`}
                    placeholder={language === 'ar' ? 'اسمك بالكامل يا بطل...' : 'Your full name, hero...'} />
            </div>
          </div>
          <div>
            <label htmlFor="signupEmail" className={`block text-sm font-medium mb-1.5 ${secondaryTextColor}`}>{t('emailLabel')}</label>
             <div className="relative">
                <div className={`absolute inset-y-0 ${iconPosition} flex items-center pointer-events-none`}>
                    <EnvelopeIcon className={`h-5 w-5 ${iconColor} transition-transform group-focus-within:scale-110`} />
                </div>
                <input type="email" id="signupEmail" value={email} onChange={(e) => setEmail(e.target.value)} required
                    className={`w-full p-3.5 border rounded-lg shadow-sm focus:ring-2 ${inputPadding} ${inputBg} ${inputBorder} ${textColor} ${inputPlaceholderColor} group`}
                    placeholder={language === 'ar' ? 'ايميلك الشخصي أو بتاع الشغل...' : 'Your personal or work email...'} />
            </div>
          </div>
           <div>
            <label htmlFor="signupRole" className={`block text-sm font-medium mb-1.5 ${secondaryTextColor}`}>{t('userRole')}</label>
             <div className="relative">
                 <select id="signupRole" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                    className={`w-full p-3.5 border rounded-lg shadow-sm focus:ring-2 appearance-none ${inputPadding} ${inputBg} ${inputBorder} ${textColor} group`}>
                    {Object.values(UserRole).map(role => (
                        <option key={role} value={role}>{t(`userRole_${role}` as any, role)}</option>
                    ))}
                </select>
                <div className={`absolute inset-y-0 ${language === 'ar' ? 'left-3' : 'right-3'} flex items-center pointer-events-none`}>
                    <svg className={`h-5 w-5 ${iconColor}`} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </div>
            </div>
          </div>
          <div>
            <label htmlFor="signupPassword" className={`block text-sm font-medium mb-1.5 ${secondaryTextColor}`}>{t('passwordLabel')}</label>
            <div className="relative">
                <div className={`absolute inset-y-0 ${iconPosition} flex items-center pointer-events-none`}>
                    <LockClosedIcon className={`h-5 w-5 ${iconColor} transition-transform group-focus-within:scale-110`} />
                </div>
                <input type="password" id="signupPassword" value={password} onChange={(e) => setPassword(e.target.value)} required
                    className={`w-full p-3.5 border rounded-lg shadow-sm focus:ring-2 ${inputPadding} ${inputBg} ${inputBorder} ${textColor} ${inputPlaceholderColor} group`}
                    placeholder={language === 'ar' ? 'كلمة سر محدش يعرفها غيرك... 😉' : 'Your top-secret password... 😉'} />
<<<<<<< HEAD
>>>>>>> bee2d85 (updated)
=======
>>>>>>> 96a8f29 (First commit)
            </div>
          </div>
          <div>
            <label htmlFor="confirmPassword" className={`block text-sm font-medium mb-1.5 ${secondaryTextColor}`}>{t('confirmPasswordLabel')}</label>
            <div className="relative">
<<<<<<< HEAD
<<<<<<< HEAD
                <div className={`absolute inset-y-0 ${iconPosition} flex items-center pointer-events-none`}>
                    <LockClosedIcon className={`h-5 w-5 ${iconColor}`} />
                </div>
                <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className={`w-full p-3.5 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 ${inputPadding} ${inputBg} ${inputBorder} ${textColor} ${inputPlaceholderColor}`}
                    placeholder={language === 'ar' ? 'اكتبها تاني للتأكيد...' : 'Confirm it here...'}
                />
=======
=======
>>>>>>> 96a8f29 (First commit)
                 <div className={`absolute inset-y-0 ${iconPosition} flex items-center pointer-events-none`}>
                    <LockClosedIcon className={`h-5 w-5 ${iconColor} transition-transform group-focus-within:scale-110`} />
                </div>
                <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
                    className={`w-full p-3.5 border rounded-lg shadow-sm focus:ring-2 ${inputPadding} ${inputBg} ${inputBorder} ${textColor} ${inputPlaceholderColor} group`}
                    placeholder={language === 'ar' ? 'اكتبها تاني للتأكيد يا فنان...' : 'Type it again for confirmation, artist...'} />
<<<<<<< HEAD
>>>>>>> bee2d85 (updated)
=======
>>>>>>> 96a8f29 (First commit)
            </div>
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
            {isLoading ? (language === 'ar' ? 'جاري إنشاء الحساب...' : 'Creating Account...') : t('signupButton')}
=======
=======
>>>>>>> 96a8f29 (First commit)
              ${isLoading
                ? `${buttonDisabledBg} text-gray-300 cursor-not-allowed`
                : `${buttonPrimaryBg}`
              }
            `}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <ArrowPathIcon className="h-5 w-5 animate-spin mr-2 rtl:ml-2" />
                {language === 'ar' ? 'جاري إنشاء حسابك الفهلواني... 🚀' : 'Creating your Fahlawy account... 🚀'}
              </span>
            ) : t('signupButton')}
<<<<<<< HEAD
>>>>>>> bee2d85 (updated)
=======
>>>>>>> 96a8f29 (First commit)
          </button>
        </form>
        <div className="mt-8 text-center">
          <button
            onClick={() => onNavigate('login')}
            className={`text-sm font-medium ${linkColor} transition-colors`}
          >
            {t('alreadyHaveAccountPrompt')}
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
export default SignupView;
=======
export default SignupView;
>>>>>>> bee2d85 (updated)
=======
export default SignupView;
>>>>>>> 96a8f29 (First commit)
