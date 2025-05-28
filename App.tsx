

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
import LeaveRequestView from './components/LeaveRequestView';
import ChatView from './components/ChatView';
import KanbanView from './components/KanbanView';
import PreventiveMaintenanceView from './components/PreventiveMaintenanceView';
import AccidentReportView from './components/AccidentReportView';
import Footer from './components/Footer';
import ProfileView from './components/ProfileView';
import LoginView from './components/LoginView';
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

interface ErrorModalConfig {
  isOpen: boolean;
  title: string;
  message: string;
}

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
    </div>
  );
};

const OfflineBanner: React.FC = () => {
  const { language } = useLanguageContext();
  const { theme } = React.useContext(ThemeContext);
  return (
    <div className={`p-2 text-center text-xs font-medium w-full fixed top-0 left-0 z-[100]
      ${theme === 'dark' ? 'bg-red-700 text-white' : 'bg-red-600 text-white'}
      ${language === 'ar' ? 'font-cairo' : 'font-poppins'}`}
    >
      {language === 'ar' ? '⚠️ أنت غير متصل بالإنترنت حالياً. بعض الميزات قد لا تعمل بشكل صحيح.' : '⚠️ You are currently offline. Some features may not work correctly.'}
    </div>
  );
};


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

  const showErrorModal = (title: string, message: string) => {
    setErrorModalConfig({ isOpen: true, title, message });
  };
  const closeErrorModal = () => {
    setErrorModalConfig(null);
  };


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
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

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
      case 'chat': return <ChatView />;
      case 'kanban': return <KanbanView />;
      case 'preventiveMaintenance': return <PreventiveMaintenanceView />;
      case 'accidentReport': return <AccidentReportView />;
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
    </div>
  );
};


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
};

export default App;