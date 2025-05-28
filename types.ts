

export enum Language {
  EN = 'en',
  AR = 'ar',
}

export enum UserRole {
  Employee = 'Employee',
  Supervisor = 'Supervisor',
  Engineer = 'Engineer',
}

export interface User {
  id: string; // This will be Firebase UID
  name: string; // This might be Firebase displayName or from Firestore
  role: UserRole; // This will likely be stored in Firestore
  teamId?: string; // This will likely be stored in Firestore
  email?: string; // Firebase email
  phone?: string; // Store in Firestore
}

export interface Engineer extends User {
  role: UserRole.Engineer;
}

export interface Supervisor extends User {
  role: UserRole.Supervisor;
  teamId: string;
}

export interface Employee extends User {
  role: UserRole.Employee;
  teamId: string;
}

export interface Team {
  id: string;
  name: string;
  supervisorId: string;
  memberIds: string[];
}

export enum ShiftType {
  Morning = 'Morning', // 7:30 AM to 7:30 PM
  Evening = 'Evening', // 7:30 PM to 7:30 AM
  Off = 'Off',
}

export interface Shift {
  id: string;
  teamId: string;
  type: ShiftType;
  startDate: Date;
  endDate: Date;
}

export interface DailyTask {
  id:string; // Firestore document ID
  userId: string;
  description: string;
  timestamp: Date; // Or Firebase Timestamp for server-side consistency
  completed: boolean;
  notes?: string;
}

export enum ShipStatus {
  Import = 'Import',
  Export = 'Export',
  Docked = 'Docked',
  Anchored = 'Anchored',
}

export enum ShipCargoType {
  LPG = 'LPG',
  LNG = 'LNG',
  Propane = 'Propane',
}

export interface Pump {
  id: string;
  name: string;
  status: 'Running' | 'Standby' | 'Maintenance' | 'Off';
}
export interface Ship {
  id: string;
  name: string;
  status: ShipStatus;
  cargoType: ShipCargoType;
  quantityRemaining: number; // tons or m^3
  quantityPerHour: number; // rate
  eta?: string; // Estimated Time of Arrival/Departure
  pumps?: Pump[];
  // Add other relevant fields: ارتفاع المركب، سرعة الريح، etc.
}

export enum LeaveRequestStatus {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
}

export interface LeaveRequest {
  id?: string; // Firestore document ID
  userId: string;
  leaveType: string;
  startDate: string; // Store as ISO string or Firebase Timestamp
  endDate: string;   // Store as ISO string or Firebase Timestamp
  reason: string;
  status: LeaveRequestStatus;
  createdAt: Date; // Or Firebase Timestamp
}


export interface TranslationSet {
  [key: string]: string; // Keep it flexible
  appName: string;
  companyName: string;
  dashboard: string;
  shifts: string;
  tasks: string;
  ships: string;
  settings: string;
  notifications: string;
  language: string;
  english: string;
  arabic: string;
  welcomeMessage: string;
  currentShift: string;
  morningShift: string;
  eveningShift: string;
  teamOnDuty: string;
  supervisor: string;
  members: string;
  addTask: string;
  taskDescription: string;
  saveTask: string;
  noTasks: string;
  shipName: string;
  shipStatus: string;
  cargoType: string;
  quantityRemaining: string;
  quantityPerHour: string;
  eta: string;
  pumps: string;
  noShips: string;
  userRole: string;
  selectRole: string;
  employee: string;
  supervisorRole: string;
  engineer: string;
  engineersList: string;
  supervisorsList: string;
  appTheme: string;
  lightMode: string;
  darkMode: string;
  darkModeDescription: string;
  comedyLevel: string;
  normal: string;
  hilarious: string;
  shiftSchedule: string;
  team: string;
  offDuty: string;
  dailyLog: string;
  submitEntry: string;
  entryPlaceholder: string;
  viewTeamDetails: string;
  hideTeamDetails: string;
  pumpName: string;
  pumpStatus: string;
  running: string;
  standby: string;
  maintenance: string;
  offline: string;
  activeShift: string;
  upcomingShift: string;
  loadingMessage: string;
  splashIntro: string;
  prayerTimes: string;
  prayerTimesDamietta: string;
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  salaryNotification: string;
  salaryNotificationToggle: string;
  salaryNotificationEnabledMessage: string;
  quickActions: string;
  requestLeave: string; 
  funStuff: string;
  funStuffTitle: string;
  quranRadio: string;
  quranRadioPlayerTitle: string;
  quranRadioNowPlaying: string;
  quranRadioPlay: string;
  quranRadioPause: string;
  quranRadioLoading: string;
  quranRadioError: string;
  quranRadioPlaying: string;
  quranRadioPaused: string;
  puzzleGame: string;
  puzzleGameTitle: string;
  puzzleGamePlay: string;
  puzzleGameQuestion: string; 
  puzzleGameOptA: string; 
  puzzleGameOptB: string; 
  puzzleGameOptC: string; 
  puzzleGameSubmit: string;
  puzzleGameCorrect: string;
  puzzleGameWrong: string;
  jokesToday: string;
  chatbotFahlawy: string;
  chatbotPlaceholder: string;
  chatbotSend: string;
  chatbotDefaultResponse1: string;
  chatbotDefaultResponse2: string;
  chatbotDefaultResponse3: string;
  import: string;
  export: string;
  docked: string;
  anchored: string;
  dailyTaskPrompt: string;
  shipManagementFooter: string;
  settingsFooter: string;
  sidebarFooter: string; 
  globalFooter: string; 
  dashboardGreeting: string;
  dailyCoffeeStat: string;
  shiftFocusMessage: string;
  shiftEnjoyBreak: string;
  taskPointsMessage: string;
  shipDockedMessage: string;
  noShipsFunny: string;
  settingsRolePrompt: string;
  settingsThemePrompt: string;
  settingsComedyPrompt: string;
  settingsPrayerPrompt: string;
  settingsPrayerReminderButton: string;
  settingsPrayerReminderSet: string;
  settingsWhatsAppTelegram: string;
  settingsLinkWhatsApp: string;
  settingsLinkTelegram: string;
  settingsLinkSoon: string;
  viewName_dashboard: string;
  viewName_shifts: string;
  viewName_tasks: string;
  viewName_ships: string;
  viewName_fun: string;
  viewName_settings: string;
  viewName_leaveRequest: string;
  viewName_chat: string;
  viewName_kanban: string;
  viewName_profile: string; 
  viewName_preventiveMaintenance: string;
  viewName_accidentReport: string;
  viewName_login: string; // Added
  viewName_signup: string; // Added
  kanbanBoardTitle: string;
  kanbanTodo: string;
  kanbanInProgress: string;
  kanbanDone: string;
  kanbanSampleTask1Title: string;
  kanbanSampleTask1Desc: string;
  kanbanSampleTask2Title: string;
  kanbanSampleTask2Desc: string;
  kanbanSampleTask3Title: string;
  kanbanSampleTask3Desc: string;
  kanbanSampleTask4Title: string;
  kanbanSampleTask4Desc: string;
  kanbanSampleTask5Title: string;
  kanbanSampleTask5Desc: string;
  kanbanSampleTask6Title: string;
  kanbanSampleTask6Desc: string;
  kanbanMoveTask: string;
  kanbanFooter: string;
  petroleumFlame: string;
  ugdcWelcome: string;
  footerCompanyName: string;
  myProfile: string;
  logout: string;
  logoutSuccess: string; 
  leaveRequestTitle: string;
  leaveRequestDescription: string;
  chatTitle: string;
  chatDescription: string;
  shipNameNefertiti: string;
  shipNameAbuSaree: string;
  shipNameOmHashem: string;
  pumpSpareName: string;
  pumpPamperedName: string;
  pumpBossRedaName: string;
  comingSoon: string; 
  comingSoonMessage: string; 
  featureUnderConstruction: string; 
  settingsChangeSuccess: string;
  leaveRequestSubmitSuccess: string;
  chatMessageSent: string;
  preventiveMaintenanceTitle: string;
  preventiveMaintenanceEquipmentList: string;
  preventiveMaintenanceScheduleMaintenance: string;
  preventiveMaintenanceUpcoming: string;
  preventiveMaintenanceNoUpcoming: string;
  preventiveMaintenanceFooter: string;
  accidentReportTitle: string;
  accidentReportFormTitle: string;
  accidentReportDate: string;
  accidentReportLocation: string;
  accidentReportType: string;
  accidentReportDescription: string;
  accidentReportSubmit: string;
  accidentReportRecent: string;
  accidentReportNoRecent: string;
  accidentReportFooter: string;
  recurringTasksSectionTitle: string;
  recurringTaskCheckValves: string;
  recurringTaskGeneratorOil: string;
  recurringTaskSafetyBriefing: string;
  puzzleFetchingError: string;
  jokeFetchingError: string;
  noNotifications: string;
  profileNameLabel: string;
  profileRoleLabel: string;
  profileTeamLabel: string;
  profileEmailLabel: string;
  profilePhoneLabel: string;
  profileLastLoginLabel: string;
  profileEditButton: string;
  profileChangePasswordButton: string;
  profileNotificationSettingsButton: string;
  profileFeatureDevToast: string;
  profileFooterActive: string;
  profileEditInfoTitle: string;
  profileChangePasswordTitle: string;
  profileNotificationSettingsTitle: string;
  profileCurrentPasswordLabel: string;
  profileNewPasswordLabel: string;
  profileConfirmNewPasswordLabel: string;
  profileCurrentPasswordPlaceholder: string;
  profileNewPasswordPlaceholder: string;
  profileConfirmNewPasswordPlaceholder: string;
  profileSaveChangesButton: string;
  profileUpdatePasswordButton: string;
  profileSaveNotificationPrefsButton: string;
  profileCancelButton: string;
  profileNotifyEmailShiftsLabel: string;
  profileNotifyPushTasksLabel: string;
  profileNotifySmsAlertsLabel: string;
  profileUpdateSuccess: string;
  profilePasswordChangeSuccess: string;
  profileNotificationSettingsSuccess: string;
  profileFooterEdit: string;
  linkWithWhatsAppTitle: string;
  linkWithTelegramTitle: string;
  linkQrCodeAlt: string;
  linkInstructionsWhatsApp: string;
  linkInstructionsTelegram: string;
  linkConfirmButton: string;
  linkCancelButton: string;
  linkSuccessWhatsAppToast: string;
  linkSuccessTelegramToast: string;
  loginTitle: string; // Added
  signupTitle: string; // Added
  emailLabel: string; // Added
  passwordLabel: string; // Added
  confirmPasswordLabel: string; // Added
  loginButton: string; // Added
  signupButton: string; // Added
  dontHaveAccountPrompt: string; // Added
  alreadyHaveAccountPrompt: string; // Added
  loginFailedError: string; // Added
  loginFailedNetworkError: string; // Added for type safety
  signupFailedError: string; // Added
  logoutFailedError: string; // Added
  passwordResetPrompt: string; // Added
  passwordResetSentSuccess: string; // Added
  passwordResetSentError: string; // Added
  profileDataLoadError: string; // Changed from profileDataLoadErrorOffline
  funStuffApiKeyMissingPuzzle: string;
  funStuffApiKeyMissingJoke: string;
}


export interface Translations {
  [Language.EN]: TranslationSet;
  [Language.AR]: TranslationSet;
}

export interface Evaluation {
  id: string;
  employeeId: string;
  supervisorId: string;
  rating: number; // e.g., 1-5 stars
  comments: string;
  date: Date;
}

export enum RewardType {
  Star = 'Star',
  Medal = 'Medal',
}

export interface Reward {
  id: string;
  employeeId: string;
  type: RewardType;
  reason: string;
  date: Date;
  awardedBy: string; // Supervisor/Engineer ID
}

export interface Jamiyah {
  id: string;
  name: string;
  members: string[]; // User IDs
  contributionAmount: number;
  payoutSchedule: string; // e.g., monthly
  currentTurnHolder?: string; // User ID
}

export { ShipCargoType as ShipType };


export type Theme = 'light' | 'dark';

// Updated ViewName to include new views
export type ViewName = 
  'dashboard' | 'shifts' | 'tasks' | 'ships' | 
  'fun' | 'settings' | 'leaveRequest' | 'chat' | 
  'kanban' | 'preventiveMaintenance' | 'accidentReport' | 
  'profile' | 'login' | 'signup';