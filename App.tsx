

<<<<<<< HEAD
import React, { useState, useEffect, useCallback, ReactNode } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { useLanguageContext } from './hooks/useLanguage';
import SplashScreen from './components/SplashScreen';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ShiftScheduleView from './components/ShiftScheduleView';
import DailyTasksView from './components/DailyTasksView';
import ShipManagementView from './components/ShipManagementView';
import SettingsView from './components/SettingsView';
import FunStuffView from './components/FunStuffView';
=======
import React, { useState, useEffect, useCallback, ReactNode, Dispatch, SetStateAction, useRef } from 'react';
import { useLanguageContext } from './hooks/useLanguage';
import SplashScreen from './components/SplashScreen';
import { Header } from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ShiftScheduleView from './components/ShiftScheduleView'; 
import DailyTasksView, { DailyTasksViewProps } from './components/DailyTasksView';
import ShipManagementView from './components/ShipManagementView';
import SettingsView, { SettingsViewProps } from './components/SettingsView';
import { FunStuffView } from './components/FunStuffView';
>>>>>>> bee2d85 (updated)
import LeaveRequestView from './components/LeaveRequestView';
import ChatView from './components/ChatView';
import KanbanView from './components/KanbanView';
import PreventiveMaintenanceView from './components/PreventiveMaintenanceView';
import AccidentReportView from './components/AccidentReportView';
import Footer from './components/Footer';
import ProfileView from './components/ProfileView';
import LoginView from './components/LoginView';
<<<<<<< HEAD
import SignupView from './components/SignupView';
import ErrorModal from './components/ErrorModal'; // Import ErrorModal
import { UserRole, Engineer, Supervisor, Team, ShipCargoType, ShipStatus, Ship, Pump, Language, ViewName, Employee, User as AppUserType } from './types';
import { ENGINEERS, SUPERVISORS, TEAMS, EMPLOYEES_TEAM1, initialTranslations } from './constants';
import { auth as appAuth, db as appDb } from './index'; 
import { Auth, User, onAuthStateChanged } from "firebase/auth";
import { Firestore, doc, getDoc, setDoc } from "firebase/firestore";


export type Theme = 'light' | 'dark';
export const ThemeContext = React.createContext<{ theme: Theme; toggleTheme: () => void }>({
  theme: 'light',
  toggleTheme: () => {},
});

type ToastType = 'success' | 'info' | 'alert';
interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

export const ToastContext = React.createContext<{
  addToast: (message: string, type?: ToastType) => void;
}>({
  addToast: () => {},
});

export type LoggedInUser = (Employee | Supervisor | Engineer) & { firebaseUid: string };
=======
import SignupView from './components/SignupView'; 
import ErrorModal from './components/ErrorModal';
// import ComingSoonView from './components/ComingSoonView'; // Replaced by TrainingCoursesView
import TrainingCoursesView from './components/TrainingCoursesView'; // Added
import PersonalHubView from './components/PersonalHubView';
import { AiMaintenanceGuideView } from './components/AiMaintenanceGuideView';
import { AiShiftSchedulerView } from './components/AiShiftSchedulerView';
import SmartShiftEnhancerView from './components/SmartShiftEnhancerView';
import SmartMaintenanceEnhancerView from './components/SmartMaintenanceEnhancerView';
import ActivityLogView from './components/ActivityLogView';
import AdvancedCalculatorView from './components/AdvancedCalculatorView';
// Import new service views
import EquipmentLogbookView from './components/EquipmentLogbookView';
import PermitToWorkView from './components/PermitToWorkView';
import SafetyObservationView from './components/SafetyObservationView';
import ShiftHandoverNotesView from './components/ShiftHandoverNotesView';
import FahlawyKnowledgeBaseView from './components/FahlawyKnowledgeBaseView'; 
import UnitConverterView from './components/UnitConverterView';
import EmergencyContactsProceduresView from './components/EmergencyContactsProceduresView';
import InternalAnnouncementsView from './components/InternalAnnouncementsView';
import ToolboxTalksView from './components/ToolboxTalksView';
import ChemicalReferenceView from './components/ChemicalReferenceView';
import PetroGeniusView from './components/PetroGeniusView';
import PetroWikiView from './components/PetroWikiView';
import AdminDashboardView from './components/AdminDashboardView'; // Added AdminDashboardView


import { UserRole, Engineer, Supervisor, Team, ShipCargoType, ShipStatus, Ship, Pump, Language, ViewName, Employee, LoggedInUser, ActivityLogType, TranslationSet, User, DailyShiftAssignment, ShiftType as AppShiftType } from './types'; // Updated types import
import { ENGINEERS, SUPERVISORS, TEAMS, initialTranslations, COMPANY_SHORT_NAME_EN, COMPANY_SHORT_NAME_AR, APP_NAME, APP_NAME_AR, FAHLOWY_OCCASIONS } from './constants';
import { Theme, ThemeContext } from './contexts/ThemeContext';
import { useActivityLog } from './hooks/useActivityLog';
import { ToastContext, ToastMessage, ToastType } from './contexts/ToastContext'; // UPDATED IMPORT
import { playFahlawySound } from './utils/sounds'; // UPDATED IMPORT

// --- START OF MOCK DATA & HELPERS ---
const MOCK_SHIPS: Ship[] = [
  { id: 'ship1', name: 'Nefertiti Gas Carrier', status: ShipStatus.Import, cargoType: ShipCargoType.LPG, quantityRemaining: 15000, quantityPerHour: 500, eta: new Date(Date.now() + 3600000 * 2).toISOString(), pumps: [{id: 'p1', name: 'Main Cargo Pump A', status: 'Running'}, {id: 'p2', name: 'Auxiliary Pump B', status: 'Standby'}] },
  { id: 'ship2', name: 'Abu Saree\' LNG Tanker', status: ShipStatus.Docked, cargoType: ShipCargoType.LNG, quantityRemaining: 25000, quantityPerHour: 1000, pumps: [{id: 'p3', name: 'LNG Pump Alpha', status: 'Running'}, {id: 'p4', name: 'LNG Pump Beta', status: 'Running'}]},
  { id: 'ship3', name: 'Om Hashem Propane Vessel', status: ShipStatus.Export, cargoType: ShipCargoType.Propane, quantityRemaining: 8000, quantityPerHour: 300, eta: new Date(Date.now() + 3600000 * 5).toISOString(), pumps: [{id: 'p5', name: 'Propane Pump X', status: 'Standby'}]},
];

const MOCK_USER_TEMPLATE_BASE: Omit<User & { expertisePoints: number }, 'id' | 'role' | 'avatarUrl'> & { role: UserRole.Engineer } = {
  name: 'خبير بتروتك تجريبي',
  email: 'test@example.com',
  role: UserRole.Engineer,
  teamId: 'team1',
  phone: '01001234567',
  expertisePoints: 50, 
};
// --- END OF MOCK DATA & HELPERS ---

// ToastContext and ToastMessage are now imported from './contexts/ToastContext'
// playFahlawySound is now imported from './utils/sounds'
>>>>>>> bee2d85 (updated)

interface ErrorModalConfig {
  isOpen: boolean;
  title: string;
  message: string;
}

<<<<<<< HEAD
const ToastNotificationContainer: React.FC<{ toasts: ToastMessage[]; onDismiss: (id: number) => void }> = ({ toasts, onDismiss }) => {
  const { language } = useLanguageContext();
  return (
    <div className={`fixed bottom-5 right-5 z-50 w-auto max-w-xs sm:max-w-sm ${language === 'ar' ? 'right-5 left-auto' : 'left-5 right-auto sm:left-auto sm:right-5'}`}>
      {toasts.map(toast => (
        <ToastNotification key={toast.id} {...toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastNotification: React.FC<ToastMessage & { onDismiss: (id: number) => void }> = ({ id, message, type, onDismiss }) => {
  const { theme } = React.useContext(ThemeContext);
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(id);
    }, 3000); // Default to 3 seconds, can be longer for alerts
    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  let bgColor = '';
  let textColor = 'text-white'; 

  if (theme === 'dark') {
    switch (type) {
      case 'success': bgColor = 'bg-green-500'; break;
      case 'info': bgColor = 'bg-blue-500'; break;
      case 'alert': bgColor = 'bg-red-500'; break;
      default: bgColor = 'bg-gray-700';
    }
  } else { 
    switch (type) {
      case 'success': bgColor = 'bg-green-600'; break;
      case 'info': bgColor = 'bg-blue-600'; break;
      case 'alert': bgColor = 'bg-red-600'; break;
      default: bgColor = 'bg-gray-800';
    }
  }

  return (
    <div className={`toast-notification show ${bgColor} ${textColor} shadow-xl rounded-lg`}>
      {message}
=======
const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const InformationCircleIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>;
const ExclamationTriangleIconReact: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>;

const ToastNotificationContainer: React.FC<{ toasts: ToastMessage[]; onDismiss: (id: number) => void }> = ({ toasts, onDismiss }) => {
  const { language } = useLanguageContext();
  const { theme } = React.useContext(ThemeContext);
  
  return (
    <div className={`fixed bottom-5 z-[200] w-auto max-w-md sm:max-w-lg
      ${language === 'ar' ? 'right-5 left-auto' : 'left-5 right-auto sm:right-5'}`}>
      {toasts.map(toast => {
        let currentBgColor = '';
        let currentTextColor = '';
        let IconComponent: React.FC<{className?: string}> | null = null;

        if (theme === 'dark') {
          switch (toast.type) {
            case 'success': currentBgColor = 'var(--dark-success-bg)'; currentTextColor = 'var(--dark-success-text)'; IconComponent = CheckCircleIcon; break;
            case 'info': currentBgColor = 'var(--dark-info-bg)'; currentTextColor = 'var(--dark-info-text)'; IconComponent = InformationCircleIcon; break;
            case 'alert': currentBgColor = 'var(--dark-alert-bg)'; currentTextColor = 'var(--dark-alert-text)'; IconComponent = ExclamationTriangleIconReact; break;
            default: currentBgColor = 'bg-gray-700'; currentTextColor = 'text-gray-200'; IconComponent = InformationCircleIcon;
          }
        } else {
           switch (toast.type) {
            case 'success': currentBgColor = 'var(--success-bg)'; currentTextColor = 'var(--success-text)'; IconComponent = CheckCircleIcon; break;
            case 'info': currentBgColor = 'var(--info-bg)'; currentTextColor = 'var(--info-text)'; IconComponent = InformationCircleIcon; break;
            case 'alert': currentBgColor = 'var(--alert-bg)'; currentTextColor = 'var(--alert-text)'; IconComponent = ExclamationTriangleIconReact; break;
            default: currentBgColor = 'bg-gray-800'; currentTextColor = 'text-white'; IconComponent = InformationCircleIcon;
          }
        }
        
        return (
            <div key={toast.id}
                 className={`toast-notification show shadow-2xl rounded-xl mb-3 flex items-center space-x-3 rtl:space-x-reverse cursor-pointer`}
                 style={{ backgroundColor: currentBgColor, color: currentTextColor }}
                 onClick={() => onDismiss(toast.id)}
                 role="alert"
                 aria-live="assertive"
            >
              {IconComponent && <IconComponent className="h-6 w-6 flex-shrink-0" />}
              <span className="text-sm">{toast.message}</span>
            </div>
        );
    })}
>>>>>>> bee2d85 (updated)
    </div>
  );
};

const OfflineBanner: React.FC = () => {
<<<<<<< HEAD
  const { language } = useLanguageContext();
  const { theme } = React.useContext(ThemeContext);
  return (
    <div className={`p-2 text-center text-xs font-medium w-full fixed top-0 left-0 z-[100]
      ${theme === 'dark' ? 'bg-red-700 text-white' : 'bg-red-600 text-white'}
      ${language === 'ar' ? 'font-cairo' : 'font-poppins'}`}
    >
      {language === 'ar' ? '⚠️ أنت غير متصل بالإنترنت حالياً. بعض الميزات قد لا تعمل بشكل صحيح.' : '⚠️ You are currently offline. Some features may not work correctly.'}
=======
  const { language, t } = useLanguageContext();
  const { theme } = React.useContext(ThemeContext);
  return (
    <div className={`p-3 text-center text-sm font-semibold w-full fixed top-0 left-0 z-[100]
      ${theme === 'dark' ? 'bg-red-700 text-red-100' : 'bg-red-600 text-white'}
      ${language === 'ar' ? 'font-cairo' : 'font-poppins'}`}
    >
      {t('offlineMessage' as keyof TranslationSet, language === 'ar' ? '⚠️ أنت غير متصل بالإنترنت حالياً. بعض الميزات قد لا تعمل بشكل صحيح.' : '⚠️ You are currently offline. Some features may not work correctly.')}
>>>>>>> bee2d85 (updated)
    </div>
  );
};

<<<<<<< HEAD

const AppContent: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [currentView, setCurrentView] = useState<ViewName>('login');
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>(UserRole.Employee);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [engineers] = useState<Engineer[]>(ENGINEERS);
  const [supervisors] = useState<Supervisor[]>(SUPERVISORS);
  const [teamsData] = useState<Team[]>(TEAMS);

  const { language, t, setLanguage: setContextLanguage } = useLanguageContext();
  const { theme, toggleTheme: contextToggleTheme } = React.useContext(ThemeContext);
  const { addToast } = React.useContext(ToastContext);

  const [loggedInUser, setLoggedInUser] = useState<LoggedInUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [errorModalConfig, setErrorModalConfig] = useState<ErrorModalConfig | null>(null);
=======
const QURAN_RADIO_URL = "http://stream.radiojar.com/8s5u5tpdtwzuv";

interface AppContentProps {
  isRadioPlaying: boolean;
  isRadioLoading: boolean;
  toggleRadio: () => void;
  isFocusMode: boolean;
  toggleFocusMode: () => void;
}

const AppContent: React.FC<AppContentProps> = ({ 
  isRadioPlaying, isRadioLoading, toggleRadio,
  isFocusMode, toggleFocusMode 
}) => {
  const [showSplash, setShowSplash] = useState(true);
  const [currentView, setCurrentView] = useState<ViewName>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { language, t } = useLanguageContext();
  const { theme } = React.useContext(ThemeContext);
  const { addToast } = React.useContext(ToastContext); // Using imported ToastContext
  const { addActivityLogEntry } = useActivityLog();

  const [loggedInUser, setLoggedInUser] = useState<LoggedInUser | null>(null);
  const [errorModalConfig, setErrorModalConfig] = useState<ErrorModalConfig | null>(null);
  
  const [ships] = useState<Ship[]>(MOCK_SHIPS);
  const [engineersList] = useState<Engineer[]>(ENGINEERS);
  const [supervisorsList] = useState<Supervisor[]>(SUPERVISORS);
  const [teamsData] = useState<Team[]>(TEAMS);

>>>>>>> bee2d85 (updated)

  const showErrorModal = (title: string, message: string) => {
    setErrorModalConfig({ isOpen: true, title, message });
  };
  const closeErrorModal = () => {
    setErrorModalConfig(null);
  };

<<<<<<< HEAD

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    if (storedTheme && storedTheme !== theme) {
        contextToggleTheme(); 
    }
    const storedLanguage = localStorage.getItem('appLanguage') as Language | null;
    if (storedLanguage) {
      setContextLanguage(storedLanguage);
    }

    const splashTimeout = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(splashTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);


  const updateLoggedInUser = useCallback(async (updatedFields: Partial<Pick<LoggedInUser, 'name' | 'email' | 'phone'>>) => {
    if (loggedInUser) {
      const newUser = { ...loggedInUser, ...updatedFields };
      setLoggedInUser(newUser);
      
      const userDocRef = doc(appDb, "users", loggedInUser.firebaseUid);
      try {
        await setDoc(userDocRef, { 
          name: newUser.name, 
          email: newUser.email, 
          phone: newUser.phone 
        }, { merge: true });
        console.log("User profile updated in Firestore.");
      } catch (error: any) {
        console.error("Error updating user profile in Firestore:", error);
        let specificErrorMessage = t('profileDataLoadError');
        if (error.message && error.message.toLowerCase().includes("offline") || error.code === 'unavailable') {
             specificErrorMessage = language === 'ar' ? 'فشل تحديث الملف الشخصي (أنت غير متصل).' : 'Profile update failed (offline).';
        }
        addToast(specificErrorMessage, 'alert');
      }
    }
  }, [loggedInUser, addToast, t, appDb, language]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(appAuth as Auth, async (firebaseUser: User | null) => {
      setAuthLoading(true);
      if (firebaseUser) {
        const userDocRef = doc(appDb, "users", firebaseUser.uid);
        try {
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
              const firestoreData = userDocSnap.data() as AppUserType;
              const roleFromFirestore = firestoreData.role as UserRole;

              const baseProps = {
                id: firebaseUser.uid,
                firebaseUid: firebaseUser.uid,
                name: firebaseUser.displayName || firestoreData.name || "New User",
                email: firebaseUser.email || firestoreData.email || "no-email@example.com",
                phone: firebaseUser.phoneNumber || firestoreData.phone || "",
              };

              let userToSet: LoggedInUser;

              switch (roleFromFirestore) {
                case UserRole.Employee:
                  userToSet = {
                    ...baseProps,
                    role: UserRole.Employee,
                    teamId: firestoreData.teamId || EMPLOYEES_TEAM1[0]?.teamId || 'default_team_employee',
                  };
                  break;
                case UserRole.Supervisor:
                  userToSet = {
                    ...baseProps,
                    role: UserRole.Supervisor,
                    teamId: firestoreData.teamId || SUPERVISORS[0]?.teamId || 'default_team_supervisor',
                  };
                  break;
                case UserRole.Engineer:
                  userToSet = {
                    ...baseProps,
                    role: UserRole.Engineer,
                    teamId: firestoreData.teamId || '', 
                  };
                  break;
                default:
                  console.warn(`Invalid or missing role ('${roleFromFirestore}') in Firestore for user ${firebaseUser.uid}. Defaulting to Employee.`);
                  const defaultTeamIdForUnknownRole = EMPLOYEES_TEAM1[0]?.teamId || 'default_team_unknown';
                  userToSet = {
                    ...baseProps,
                    role: UserRole.Employee,
                    teamId: defaultTeamIdForUnknownRole,
                  };
              }
              setLoggedInUser(userToSet);
              setCurrentUserRole(userToSet.role);
              setCurrentView('dashboard'); 
              addToast(t('welcomeMessage', `Welcome back, ${userToSet.name}!`), 'success');

            } else {
              console.error(`User ${firebaseUser.uid} authenticated but no Firestore document found. This indicates a data inconsistency or a new user whose document creation failed or is pending.`);
              const isNewUser = firebaseUser.metadata.creationTime === firebaseUser.metadata.lastSignInTime;
              if (isNewUser) {
                  addToast(language === 'ar' ? 'جاري إعداد حسابك...' : 'Finalizing your account setup...', 'info');
              } else {
                  // For existing users missing Firestore doc, this is a more critical error
                  showErrorModal(
                    t('profileDataLoadError'),
                    language === 'ar' ? 'فشل تحميل بيانات الملف الشخصي (ملف المستخدم غير موجود في قاعدة البيانات). يرجى الاتصال بالدعم الفني.' : 'Profile data could not be loaded (User record missing from database). Please contact support.'
                  );
              }
              const fallbackUser: LoggedInUser = {
                id: firebaseUser.uid,
                firebaseUid: firebaseUser.uid,
                name: firebaseUser.displayName || "New User (Incomplete Profile)",
                email: firebaseUser.email || "no-email@example.com",
                role: UserRole.Employee, 
                teamId: EMPLOYEES_TEAM1[0]?.teamId || 'default_fallback_team', 
                phone: firebaseUser.phoneNumber || "",
              };
              setLoggedInUser(fallbackUser);
              setCurrentUserRole(UserRole.Employee); 
              setCurrentView('dashboard'); // Or 'profile' to encourage completion
            }
        } catch (error: any) {
          console.error("Error fetching user document from Firestore:", error); 
          let specificErrorMessage = t('profileDataLoadError'); // General fallback
          let modalTitle = t('profileDataLoadError');

          if (error.code === 'unavailable' || (error.message && error.message.toLowerCase().includes("offline"))) {
            specificErrorMessage = language === 'ar' 
                ? 'فشل تحميل بيانات الملف الشخصي: الجهاز غير متصل بالإنترنت. يرجى التحقق من اتصالك. بعض البيانات المعروضة قد تكون قديمة أو غير مكتملة.' 
                : 'Profile Load Failed: Device is offline. Please check your internet connection. Displayed data may be outdated or incomplete.';
          } else if (error.message && error.message.toLowerCase().includes("failed to get document because the client is offline")) {
            specificErrorMessage = language === 'ar' 
                ? 'فشل تحميل بيانات الملف الشخصي (الجهاز غير متصل). تحقق من اتصالك بالإنترنت. البيانات قد تكون غير مكتملة.' 
                : 'Profile Load Failed (Client Offline). Check internet. Data may be incomplete.';
          }
          // Use modal for these critical profile load errors too
          showErrorModal(modalTitle, specificErrorMessage);

          const fallbackUserOnError: LoggedInUser = {
            id: firebaseUser.uid,
            firebaseUid: firebaseUser.uid,
            name: firebaseUser.displayName || "User (Error)",
            email: firebaseUser.email || "no-email@example.com",
            role: UserRole.Employee,
            teamId: EMPLOYEES_TEAM1[0]?.teamId || 'default_fallback_team',
            phone: firebaseUser.phoneNumber || "",
          };
          setLoggedInUser(fallbackUserOnError);
          setCurrentUserRole(UserRole.Employee);
          setCurrentView('dashboard');
        }
      } else {
        setLoggedInUser(null);
        setCurrentView('login');
        setCurrentUserRole(UserRole.Employee); 
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appAuth, addToast, t, appDb, setLoggedInUser, setCurrentUserRole, setCurrentView, setAuthLoading, language]); 

  const handleNavigation = (view: ViewName) => {
    setCurrentView(view);
    setIsSidebarOpen(false); 
=======
  useEffect(() => {
    if (loggedInUser && !showSplash) {
        const welcomeMsg = t('welcomeMessage' as keyof TranslationSet, language === Language.AR ? `يا صباح الفل يا ${loggedInUser.name}!` : `Welcome back, ${loggedInUser.name}!`);
        addToast(welcomeMsg.replace('{name}', loggedInUser.name), 'success');
    }
    const splashTimeout = setTimeout(() => setShowSplash(false), 1500);
    return () => clearTimeout(splashTimeout);
  }, [loggedInUser, showSplash, addToast, t, language]);


  const updateLoggedInUser = useCallback(async (updatedFields: Partial<Omit<LoggedInUser, 'role' | 'teamId' | 'expertisePoints'>> & { role?: UserRole; teamId?: string; avatarUrl?: string; expertisePoints?: number }) => {
    setLoggedInUser(prevUser => {
      if (!prevUser) return null;
  
      const newRole = updatedFields.role || prevUser.role;
      const newTeamId = updatedFields.teamId || (prevUser as Employee | Supervisor).teamId; 
      const newAvatarUrl = updatedFields.avatarUrl !== undefined ? updatedFields.avatarUrl : prevUser.avatarUrl;
      const newExpertisePoints = updatedFields.expertisePoints !== undefined ? updatedFields.expertisePoints : (prevUser.expertisePoints || 0);
  
      let finalUser: LoggedInUser;
  
      const baseProperties: Omit<LoggedInUser, 'role' | 'teamId'> = {
        id: prevUser.id,
        firebaseUid: prevUser.firebaseUid,
        name: updatedFields.name !== undefined ? updatedFields.name : prevUser.name,
        email: updatedFields.email !== undefined ? updatedFields.email : prevUser.email,
        phone: updatedFields.phone !== undefined ? updatedFields.phone : prevUser.phone,
        avatarUrl: newAvatarUrl, 
        expertisePoints: newExpertisePoints,
      };
  
      if (newRole === UserRole.Engineer || newRole === UserRole.ProductionOperator || newRole === UserRole.UnitHead) {
        finalUser = {
          ...baseProperties,
          role: newRole,
        } as Engineer & { firebaseUid?: string; expertisePoints: number; avatarUrl?: string; }; 
      } else if (newRole === UserRole.Supervisor || newRole === UserRole.Employee || newRole === UserRole.ShiftSupervisor) {
        finalUser = {
          ...baseProperties,
          role: newRole,
          teamId: newTeamId || `defaultTeamId_${newRole.toLowerCase()}_update`, 
        } as (Employee | Supervisor) & { firebaseUid?: string; expertisePoints: number; avatarUrl?: string; }; 
      } else {
        
        console.warn("Updating user with an unhandled role or missing teamId logic:", newRole);
        finalUser = {
            ...baseProperties,
            role: UserRole.Employee, 
            teamId: newTeamId || 'defaultTeamId_fallback_update',
        } as Employee & { firebaseUid?: string; expertisePoints: number; avatarUrl?: string; };
      }
  
      if (updatedFields.name || updatedFields.email || updatedFields.phone || updatedFields.role ) {
           addActivityLogEntry(
            ActivityLogType.ProfileUpdated,
            'activityLogEntryProfileUpdated',
            { userName: finalUser.name }
          );
      }
       if (updatedFields.avatarUrl !== undefined && updatedFields.avatarUrl !== prevUser.avatarUrl) { 
          addActivityLogEntry(
            ActivityLogType.ProfilePictureChanged,
            'activityLogEntryProfilePictureChanged',
            { userName: finalUser.name }
          );
      }
      return finalUser;
    });
  }, [setLoggedInUser, addActivityLogEntry]);

  const handleNavigation = (view: ViewName) => {
    if (!loggedInUser && view !== 'login' && view !== 'signup') {
      setCurrentView('login');
      addToast(t('loginRequired' as keyof TranslationSet, language === Language.AR ? 'سجل دخولك الأول يا ريس عشان تشوف باقي الشغل!' : 'Log in first, boss, to see the rest of the work!'), 'alert');
    } else {
      setCurrentView(view);
       if (loggedInUser) {
        addActivityLogEntry(ActivityLogType.NewServiceAccessed, 'activityLogEntryNewServiceAccessed', { userName: loggedInUser.name, serviceName: t(`viewName_${view}` as keyof TranslationSet, view)});
      }
    }
    setIsSidebarOpen(false);
>>>>>>> bee2d85 (updated)
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

<<<<<<< HEAD
  const renderView = () => {
    if (authLoading) {
      return <SplashScreen />; 
    }
    if (!loggedInUser) {
        if (currentView === 'signup') return <SignupView auth={appAuth as Auth} db={appDb as Firestore} onNavigate={handleNavigation} showErrorModal={showErrorModal} />;
        return <LoginView auth={appAuth as Auth} onNavigate={handleNavigation} showErrorModal={showErrorModal} />;
    }
    
    const MOCK_PUMPS_1: Pump[] = [
        { id: 'p1', name: t('pumpSpareName'), status: 'Running' },
        { id: 'p2', name: t('pumpPamperedName'), status: 'Standby' },
    ];
    const MOCK_PUMPS_2: Pump[] = [
        { id: 'p3', name: t('pumpBossRedaName'), status: 'Maintenance' },
    ];

    const MOCK_SHIPS: Ship[] = [
        { id: 'ship1', name: t('shipNameNefertiti'), status: ShipStatus.Docked, cargoType: ShipCargoType.LPG, quantityRemaining: 15000, quantityPerHour: 300, pumps: MOCK_PUMPS_1, eta: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() },
        { id: 'ship2', name: t('shipNameAbuSaree'), status: ShipStatus.Import, cargoType: ShipCargoType.LNG, quantityRemaining: 25000, quantityPerHour: 500, eta: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() },
        { id: 'ship3', name: t('shipNameOmHashem'), status: ShipStatus.Export, cargoType: ShipCargoType.Propane, quantityRemaining: 8000, quantityPerHour: 200, pumps: MOCK_PUMPS_2, eta: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString() },
    ];


    switch (currentView) {
      case 'dashboard': return <Dashboard onNavigate={handleNavigation} />;
      case 'shifts': return <ShiftScheduleView teams={teamsData} supervisors={supervisors} />;
      case 'tasks': return <DailyTasksView db={appDb as Firestore} loggedInUser={loggedInUser} />;
      case 'ships': return <ShipManagementView ships={MOCK_SHIPS} />;
      case 'settings': return <SettingsView engineers={engineers} supervisors={supervisors} teams={teamsData} currentUserRole={currentUserRole} setCurrentUserRole={setCurrentUserRole} />;
      case 'fun': return <FunStuffView />;
      case 'leaveRequest': return <LeaveRequestView db={appDb as Firestore} loggedInUser={loggedInUser} />;
=======
  const handleAppLogout = () => {
    if (loggedInUser) {
      addActivityLogEntry(ActivityLogType.LoggedOut, 'activityLogEntryLoggedOut', { userName: loggedInUser.name });
    }
    setLoggedInUser(null);
    setCurrentView('login');
    addToast(t('logoutSuccess'), 'success');
  };

  const handleMockLogin = (userCreds: Pick<LoggedInUser, 'name' | 'email'>) => {
     const userToLogin: LoggedInUser = {
        ...MOCK_USER_TEMPLATE_BASE, 
        id: `mockuser-${Date.now()}`,
        firebaseUid: `mockuser-${Date.now()}`,
        name: userCreds.name,
        email: userCreds.email,
        expertisePoints: Math.floor(Math.random() * 50) + 20,
        avatarUrl: undefined, 
     };
     setLoggedInUser(userToLogin);
     setCurrentView('dashboard');
     addActivityLogEntry(ActivityLogType.LoggedIn, 'activityLogEntryLoggedIn', { userName: userToLogin.name });
  };

  const handleMockSignup = (newUserCreds: Omit<LoggedInUser, 'id' | 'firebaseUid' | 'avatarUrl'>) => { 
    const newUser: LoggedInUser = {
        ...newUserCreds, 
        id: `mockuser_signup_${Date.now()}`,
        firebaseUid: `mockuser_signup_${Date.now()}`,
        avatarUrl: undefined,
    } as LoggedInUser; 
    setLoggedInUser(newUser);
    setCurrentView('dashboard');
    addActivityLogEntry(ActivityLogType.LoggedIn, 'activityLogEntryLoggedIn', { userName: newUser.name });
  };

  const renderView = (): ReactNode => {
    if (!loggedInUser && currentView !== 'login' && currentView !== 'signup') {
        return <LoginView onNavigate={handleNavigation} showErrorModal={showErrorModal} onMockLogin={(user) => handleMockLogin({name: user.name, email: user.email || ''})} />;
    }

    switch (currentView) {
      case 'dashboard': return <Dashboard onNavigate={handleNavigation} loggedInUser={loggedInUser} />;
      case 'shifts': return <ShiftScheduleView teams={teamsData} supervisors={supervisorsList} />;
      case 'tasks': return loggedInUser ? <DailyTasksView loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} /> : <LoginView onNavigate={handleNavigation} showErrorModal={showErrorModal} onMockLogin={(user) => handleMockLogin({name: user.name, email: user.email || ''})} />;
      case 'ships': return <ShipManagementView ships={ships} />;
      case 'settings': return <SettingsView engineers={engineersList} supervisors={supervisorsList} teams={teamsData} currentUserRole={loggedInUser?.role || UserRole.Employee} setCurrentUserRole={(role) => updateLoggedInUser({ role })} loggedInUser={loggedInUser} />;
      case 'fun': return <FunStuffView />;
      case 'leaveRequest': return <LeaveRequestView loggedInUser={loggedInUser} />;
>>>>>>> bee2d85 (updated)
      case 'chat': return <ChatView />;
      case 'kanban': return <KanbanView />;
      case 'preventiveMaintenance': return <PreventiveMaintenanceView />;
      case 'accidentReport': return <AccidentReportView />;
<<<<<<< HEAD
      case 'profile': return <ProfileView loggedInUser={loggedInUser} updateLoggedInUser={updateLoggedInUser} teams={teamsData} />;
      case 'login': return <LoginView auth={appAuth as Auth} onNavigate={handleNavigation} showErrorModal={showErrorModal} />; 
      case 'signup': return <SignupView auth={appAuth as Auth} db={appDb as Firestore} onNavigate={handleNavigation} showErrorModal={showErrorModal} />; 
      default:
        console.warn("Unhandled view in AppContent:", currentView);
        return <Dashboard onNavigate={handleNavigation}/>; 
    }
  };

  if (showSplash && authLoading) {
    return <SplashScreen />;
  }

  const mainContentPadding = loggedInUser && isSidebarOpen && window.innerWidth >= 768 
    ? (language === 'ar' ? { paddingRight: '17rem' } : { paddingLeft: '17rem' }) 
    : {};

  return (
    <div className={`flex flex-col min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <Header 
        onNavigate={handleNavigation} 
        toggleSidebar={toggleSidebar} 
        isSidebarOpen={isSidebarOpen}
        isLoggedIn={!!loggedInUser}
        auth={appAuth as Auth}
        setCurrentView={setCurrentView}
      />
      <div className="flex flex-1 overflow-hidden">
        {loggedInUser && <Sidebar 
          onNavigate={handleNavigation} 
          currentView={currentView} 
          isOpen={isSidebarOpen} 
          toggleSidebar={toggleSidebar}
          isLoggedIn={!!loggedInUser}
        />}
        <main 
          className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto transition-all duration-300 ease-in-out"
          style={mainContentPadding}
          id="main-content"
          role="main"
        >
          {renderView()}
        </main>
      </div>
      <Footer />
      {errorModalConfig && errorModalConfig.isOpen && (
        <ErrorModal
          isOpen={errorModalConfig.isOpen}
          title={errorModalConfig.title}
          message={errorModalConfig.message}
          onClose={closeErrorModal}
        />
      )}
=======
      case 'profile': return loggedInUser ? <ProfileView loggedInUser={loggedInUser} updateLoggedInUser={updateLoggedInUser} teams={teamsData} /> : <LoginView onNavigate={handleNavigation} showErrorModal={showErrorModal} onMockLogin={(user) => handleMockLogin({name: user.name, email: user.email || ''})} />;
      case 'personalHub': return <PersonalHubView loggedInUser={loggedInUser} />;
      case 'aiMaintenanceGuide': return <AiMaintenanceGuideView />;
      case 'aiShiftScheduler': return <AiShiftSchedulerView />;
      case 'smartShiftEnhancer': return <SmartShiftEnhancerView />;
      case 'smartMaintenanceEnhancer': return <SmartMaintenanceEnhancerView />;
      case 'activityLog': return <ActivityLogView />;
      case 'advancedCalculator': return loggedInUser ? <AdvancedCalculatorView loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} /> : <LoginView onNavigate={handleNavigation} showErrorModal={showErrorModal} onMockLogin={(user) => handleMockLogin({name: user.name, email: user.email || ''})} />;
      case 'login': return <LoginView onNavigate={handleNavigation} showErrorModal={showErrorModal} onMockLogin={(user) => handleMockLogin({name: user.name, email: user.email || ''})} />;
      case 'signup': return <SignupView onNavigate={handleNavigation} showErrorModal={showErrorModal} onMockSignup={handleMockSignup} />;
      
      case 'equipmentLogbook': return <EquipmentLogbookView />;
      case 'permitToWork': return <PermitToWorkView />;
      case 'safetyObservation': return <SafetyObservationView />;
      case 'shiftHandoverNotes': return <ShiftHandoverNotesView />;
      case 'knowledgeBase': return <FahlawyKnowledgeBaseView />; 
      case 'unitConverter': return <UnitConverterView />;
      case 'emergencyContactsProcedures': return <EmergencyContactsProceduresView />;
      case 'internalAnnouncements': return <InternalAnnouncementsView />;
      case 'toolboxTalks': return <ToolboxTalksView />;
      case 'chemicalReference': return <ChemicalReferenceView />;
      case 'petroGenius': return loggedInUser ? <PetroGeniusView /> : <LoginView onNavigate={handleNavigation} showErrorModal={showErrorModal} onMockLogin={(user) => handleMockLogin({name: user.name, email: user.email || ''})} />;
      case 'petroWiki': return loggedInUser ? <PetroWikiView /> : <LoginView onNavigate={handleNavigation} showErrorModal={showErrorModal} onMockLogin={(user) => handleMockLogin({name: user.name, email: user.email || ''})} />;
      case 'trainingCourses': return <TrainingCoursesView />;
      case 'adminDashboard': return <AdminDashboardView onNavigate={handleNavigation} />;


      default: return <Dashboard onNavigate={handleNavigation} loggedInUser={loggedInUser} />;
    }
  };

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <div className={`flex h-screen overflow-hidden ${theme === 'dark' ? 'bg-dark-bg' : 'bg-light-gray'}`}>
      {loggedInUser && <Sidebar isOpen={isSidebarOpen} onNavigate={handleNavigation} currentView={currentView} />}
      <div className="flex-1 flex flex-col overflow-hidden">
        {loggedInUser && <Header 
                            onNavigate={handleNavigation} 
                            isLoggedIn={!!loggedInUser} 
                            onLogout={handleAppLogout} 
                            setCurrentView={setCurrentView} 
                            toggleSidebar={toggleSidebar} 
                            isSidebarOpen={isSidebarOpen}
                            isRadioPlaying={isRadioPlaying}
                            isRadioLoading={isRadioLoading}
                            toggleRadio={toggleRadio}
                            isFocusMode={isFocusMode}
                            toggleFocusMode={toggleFocusMode}
                            loggedInUser={loggedInUser} 
                             />}
        <main className={`flex-1 overflow-y-auto p-3 md:p-4 ${loggedInUser && (language === 'ar' ? 'md:mr-72' : 'md:ml-72')} transition-all duration-300 ease-in-out`}>
          {renderView()}
        </main>
        {loggedInUser && <Footer />}
      </div>
      {errorModalConfig && <ErrorModal {...errorModalConfig} onClose={closeErrorModal} />}
>>>>>>> bee2d85 (updated)
    </div>
  );
};

<<<<<<< HEAD

const App: React.FC = () => {
    const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'light');
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);


    const toggleTheme = () => {
        setTheme(prevTheme => {
            const newTheme = prevTheme === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            return newTheme;
        });
    };
    
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            document.body.classList.add('dark');
            document.body.classList.remove('bg-gray-50'); 
            document.body.classList.add('bg-gray-900');
        } else {
            document.documentElement.classList.remove('dark');
            document.body.classList.remove('dark');
            document.body.classList.remove('bg-gray-900'); 
            document.body.classList.add('bg-gray-50');
        }
    }, [theme]);


    const addToastCallback = useCallback((message: string, type: ToastType = 'info') => {
        setToasts(prevToasts => [...prevToasts, { id: Date.now(), message, type }]);
    }, []);

    const removeToast = (id: number) => {
        setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    };
    
    const defaultLanguage = Language.AR; 

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <LanguageProvider defaultLanguage={defaultLanguage}>
                <ToastContext.Provider value={{ addToast: addToastCallback }}>
                    {!isOnline && <OfflineBanner />}
                    <div className={!isOnline ? 'pt-8' : ''}> {/* Add padding top if banner is shown */}
                        <AppContent />
                    </div>
                    <ToastNotificationContainer toasts={toasts} onDismiss={removeToast} />
                </ToastContext.Provider>
            </LanguageProvider>
        </ThemeContext.Provider>
    );
=======
const App: React.FC = () => {
  const { language, t, setLanguage } = useLanguageContext();
  const [userSelectedTheme, setUserSelectedTheme] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem('appTheme') as Theme | null;
    return storedTheme || 'light';
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const [isRadioPlaying, setIsRadioPlaying] = useState(false);
  const [isRadioLoading, setIsRadioLoading] = useState(false);
  const audioRefRadio = useRef<HTMLAudioElement>(null);
  const [isFocusMode, setIsFocusMode] = useState(false);

  const toggleTheme = () => {
    setUserSelectedTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('appTheme', newTheme);
      return newTheme;
    });
  };

  const toggleFocusMode = () => {
    setIsFocusMode(prevFocusMode => {
        const newFocusMode = !prevFocusMode;
        addToast(
            language === 'ar' 
            ? `وضع التركيز ${newFocusMode ? 'مفعل' : 'معطل'}` 
            : `Focus Mode ${newFocusMode ? 'Activated' : 'Deactivated'}`,
            'info'
        );
        return newFocusMode;
    });
  };
  
  useEffect(() => {
    const root = window.document.documentElement;
    if (userSelectedTheme === 'dark') {
      root.classList.add('dark');
      document.body.classList.remove('light'); 
      document.body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark');
      document.body.classList.add('light'); 
    }
  }, [userSelectedTheme]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const newToast = { id: Date.now(), message, type };
    setToasts(prevToasts => [newToast, ...prevToasts.slice(0, 4)]); 
    playFahlawySound(`toast${type.charAt(0).toUpperCase() + type.slice(1)}` as any); // Using imported playFahlawySound
    setTimeout(() => {
      setToasts(prevToasts => prevToasts.filter(t => t.id !== newToast.id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);


  const playRadio = () => {
    if (audioRefRadio.current) {
      setIsRadioLoading(true);
      audioRefRadio.current.src = QURAN_RADIO_URL;
      audioRefRadio.current.play()
        .then(() => {
          setIsRadioPlaying(true);
          setIsRadioLoading(false);
          addToast(t('quranRadioPlaying'), 'info');
        })
        .catch(error => {
          console.error("Error playing radio:", error);
          addToast(t('quranRadioError'), 'alert');
          setIsRadioLoading(false);
          setIsRadioPlaying(false);
        });
    }
  };

  const pauseRadio = () => {
    if (audioRefRadio.current) {
      audioRefRadio.current.pause();
      setIsRadioPlaying(false);
      addToast(t('quranRadioPaused'), 'info');
    }
  };
  
  const toggleRadio = () => {
    if(isRadioPlaying) {
      pauseRadio();
    } else {
      playRadio();
    }
  };

  return (
    <ThemeContext.Provider value={{ theme: userSelectedTheme, toggleTheme }}>
      <ToastContext.Provider value={{ addToast }}>
        <div className={`app-container ${userSelectedTheme} ${language === 'ar' ? 'font-cairo' : 'font-poppins'}`}>
          <audio ref={audioRefRadio} loop={false} />
          <AppContent 
            isRadioPlaying={isRadioPlaying} 
            isRadioLoading={isRadioLoading} 
            toggleRadio={toggleRadio} 
            isFocusMode={isFocusMode}
            toggleFocusMode={toggleFocusMode}
          />
          <ToastNotificationContainer toasts={toasts} onDismiss={dismissToast} />
          {!isOnline && <OfflineBanner />}
        </div>
      </ToastContext.Provider>
    </ThemeContext.Provider>
  );
>>>>>>> bee2d85 (updated)
};

export default App;