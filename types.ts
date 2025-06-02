

export enum Language {
  EN = 'en',
  AR = 'ar',
}

export enum UserRole {
  Employee = 'Employee',
  Supervisor = 'Supervisor',
  Engineer = 'Engineer',
<<<<<<< HEAD
}

export interface User {
  id: string; // This will be Firebase UID
  name: string; // This might be Firebase displayName or from Firestore
  role: UserRole; // This will likely be stored in Firestore
  teamId?: string; // This will likely be stored in Firestore
  email?: string; // Firebase email
  phone?: string; // Store in Firestore
=======
  ProductionOperator = 'ProductionOperator',
  UnitHead = 'UnitHead',
  ShiftSupervisor = 'ShiftSupervisor',
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  teamId?: string;
  email?: string;
  phone?: string;
  expertisePoints: number; // Added to resolve constants.ts errors
  avatarUrl?: string;     // Added to resolve constants.ts errors
>>>>>>> bee2d85 (updated)
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

<<<<<<< HEAD
=======
export type LoggedInUser = (Employee | Supervisor | Engineer) & {
  firebaseUid?: string;
  // expertisePoints and avatarUrl are now part of the base User type,
  // but LoggedInUser might have them as mandatory or with specific nuances if needed.
  // For now, relying on their presence in User.
};

>>>>>>> bee2d85 (updated)
export interface Team {
  id: string;
  name: string;
  supervisorId: string;
  memberIds: string[];
}

export enum ShiftType {
<<<<<<< HEAD
  Morning = 'Morning', // 7:30 AM to 7:30 PM
  Evening = 'Evening', // 7:30 PM to 7:30 AM
=======
  Morning = 'Morning',
  Evening = 'Evening',
>>>>>>> bee2d85 (updated)
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
<<<<<<< HEAD
  id:string; // Firestore document ID
  userId: string;
  description: string;
  timestamp: Date; // Or Firebase Timestamp for server-side consistency
=======
  id:string;
  userId: string;
  description: string;
  timestamp: Date;
>>>>>>> bee2d85 (updated)
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
<<<<<<< HEAD
  quantityRemaining: number; // tons or m^3
  quantityPerHour: number; // rate
  eta?: string; // Estimated Time of Arrival/Departure
  pumps?: Pump[];
  // Add other relevant fields: ارتفاع المركب، سرعة الريح، etc.
=======
  quantityRemaining: number;
  quantityPerHour: number;
  eta?: string;
  pumps?: Pump[];
>>>>>>> bee2d85 (updated)
}

export enum LeaveRequestStatus {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
}

export interface LeaveRequest {
<<<<<<< HEAD
  id?: string; // Firestore document ID
  userId: string;
  leaveType: string;
  startDate: string; // Store as ISO string or Firebase Timestamp
  endDate: string;   // Store as ISO string or Firebase Timestamp
  reason: string;
  status: LeaveRequestStatus;
  createdAt: Date; // Or Firebase Timestamp
=======
  id?: string;
  userId: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveRequestStatus;
  createdAt: Date;
}

export type ViewName =
  | 'dashboard'
  | 'shifts'
  | 'tasks'
  | 'ships'
  | 'settings'
  | 'fun'
  | 'leaveRequest'
  | 'chat'
  | 'kanban'
  | 'preventiveMaintenance'
  | 'accidentReport'
  | 'profile'
  | 'personalHub'
  | 'login'
  | 'signup'
  | 'aiMaintenanceGuide'
  | 'aiShiftScheduler'
  | 'smartShiftEnhancer'
  | 'smartMaintenanceEnhancer'
  | 'activityLog'
  | 'advancedCalculator'
  // New Services from 2nd request
  | 'equipmentLogbook'
  | 'permitToWork'
  | 'safetyObservation'
  | 'shiftHandoverNotes'
  | 'knowledgeBase'
  | 'unitConverter'
  | 'emergencyContactsProcedures'
  | 'internalAnnouncements'
  | 'toolboxTalks'
  | 'chemicalReference'
  | 'trainingCourses'
  | 'petroGenius' // Added PetroGenius
  | 'petroWiki'
  | 'adminDashboard'
  | 'dailyReports'; 

// --- Activity Log Types ---
export enum ActivityLogType {
  TaskAdded = 'TaskAdded',
  TaskCompleted = 'TaskCompleted',
  TaskUncompleted = 'TaskUncompleted',
  TaskDeleted = 'TaskDeleted',
  LeaveRequested = 'LeaveRequested',
  SettingsChanged = 'SettingsChanged',
  ProfileUpdated = 'ProfileUpdated',
  LoggedIn = 'LoggedIn',
  LoggedOut = 'LoggedOut',
  CalculatorUsed = 'CalculatorUsed',
  Generic = 'Generic',
  NewServiceAccessed = 'NewServiceAccessed',
  BiometricLoginAttempt = 'BiometricLoginAttempt',
  PasswordResetRequested = 'PasswordResetRequested',
  PetroGeniusQuery = 'PetroGeniusQuery', // Added for PetroGenius
  PetroWikiSearch = 'PetroWikiSearch',
  ProfilePictureChanged = 'ProfilePictureChanged',
  DailyReportSubmitted = 'DailyReportSubmitted', 
}

export interface ActivityLogEntry {
  id: string;
  type: ActivityLogType;
  timestamp: Date;
  userId?: string;
  userName?: string;
  descriptionKey: keyof TranslationSet;
  details?: Record<string, string | number | undefined>;
}

export interface ActivityLogContextType {
  activityLogEntries: ActivityLogEntry[];
  addActivityLogEntry: (
    type: ActivityLogType,
    descriptionKey: keyof TranslationSet,
    details?: Record<string, string | number | undefined>,
    userNameOverride?: string
  ) => void;
}


// --- Personal Hub Specific Types ---
export enum PersonalTaskCategory { Home = 'Home', Work = 'Work', Errands = 'Errands', Study = 'Study', Health = 'Health', Other = 'Other', }
export enum PersonalTaskPriority { Urgent = 'Urgent', High = 'High', Medium = 'Medium', Low = 'Low',}
export interface PersonalTask { id: string; userId: string; description: string; dueDate?: string; dueTime?: string; isRecurring: boolean; category: PersonalTaskCategory; priority: PersonalTaskPriority; completed: boolean; createdAt: Date; estimatedDuration?: number; isTemplate?: boolean; }
export enum PersonalEventColor { Default = 'Default', WorkEvent = 'Work', PersonalEvent = 'Personal', Appointment = 'Appointment', Holiday = 'Holiday', Important = 'Important', Meeting = 'Meeting', Birthday = 'Birthday', Travel = 'Travel',} // Renamed to avoid conflict
export enum PersonalEventReminder { NoneReminder = 'None', Min15Reminder = 'Min15', Hour1Reminder = 'Hour1', Day1Reminder = 'Day1',} // Renamed
export enum PersonalEventRecurrence { NoneRecurrence = 'None', DailyRecurrence = 'Daily', WeeklyRecurrence = 'Weekly', MonthlyRecurrence = 'Monthly',} // Renamed
export type CalendarViewMode = 'month' | 'week' | 'day';
export interface PersonalEvent { id: string; userId: string; title: string; date: string; startTime?: string; endTime?: string; description?: string; color: PersonalEventColor; reminder: PersonalEventReminder; recurrence: PersonalEventRecurrence; createdAt: Date; }
export enum PersonalExpenseCategory { FoodExpense = 'Food', TransportExpense = 'Transport', BillsExpense = 'Bills', EntertainmentExpense = 'Entertainment', ShoppingExpense = 'Shopping', HealthExpense = 'Health', OtherExpense = 'Other',} 
export interface PersonalExpense { id: string; userId: string; description: string; amount: number; category: PersonalExpenseCategory; date: string; createdAt: Date;}
export interface PersonalIncome { id: string; userId: string; source: string; amount: number; date: string; createdAt: Date;}
export interface PersonalBudget { id: string; userId: string; month: number; year: number; category: PersonalExpenseCategory; allocatedAmount: number; createdAt: Date;}
export enum PersonalDebtType { DebtType = 'Debt', LoanType = 'Loan',} 
export enum PersonalDebtStatus { ActiveStatus = 'Active', PaidStatus = 'Paid',} 
export interface PersonalDebt { id: string; userId: string; description: string; type: PersonalDebtType; counterpartyName: string; totalAmount: number; amountPaid: number; dueDate?: string; status: PersonalDebtStatus; createdAt: Date;}
export enum PersonalInvestmentType { StocksInv = 'Stocks', BondsInv = 'Bonds', CryptoInv = 'Crypto', RealEstateInv = 'RealEstate', OtherInv = 'Other',} 
export interface PersonalInvestment { id: string; userId: string; name: string; type: PersonalInvestmentType; initialInvestment: number; currentValue: number; purchaseDate: string; quantity?: number; notes?: string; createdAt: Date;}
export interface PersonalBillReminder { id: string; userId: string; billName: string; estimatedAmount?: number; dueDate: string; isPaid: boolean; paidDate?: string; notes?: string; createdAt: Date;}
export enum ReportPeriod { Last7DaysPeriod = 'Last7Days', Last30DaysPeriod = 'Last30Days', ThisMonthPeriod = 'ThisMonth', LastMonthPeriod = 'LastMonth', CustomRangePeriod = 'CustomRange'} 
export enum PersonalActivityType { RunningActivity = 'Running', WalkingActivity = 'Walking', CyclingActivity = 'Cycling', GymActivity = 'Gym', SwimmingActivity = 'Swimming', YogaActivity = 'Yoga', SportsActivity = 'Sports', OtherActivity = 'Other',} 
export interface PersonalActivityLog { id: string; userId: string; activityType: PersonalActivityType; durationMinutes: number; distanceKm?: number; caloriesBurned?: number; date: string; notes?: string; createdAt: Date;}
export interface PersonalWeightLog { id: string; userId: string; weightKg: number; date: string; notes?: string; createdAt: Date;}
export enum MealType { BreakfastMeal = 'Breakfast', LunchMeal = 'Lunch', DinnerMeal = 'Dinner', SnackMeal = 'Snack', OtherMeal = 'Other',} 
export interface PersonalCalorieLog { id: string; userId: string; mealType: MealType; foodItem: string; caloriesKcal: number; date: string; time?: string; notes?: string; createdAt: Date;}
export interface PersonalWaterLog { id: string; userId: string; amountMl: number; date: string; time?: string; createdAt: Date;}
export enum SleepQuality { PoorSleep = 'Poor', FairSleep = 'Fair', GoodSleep = 'Good', ExcellentSleep = 'Excellent',} 
export interface PersonalSleepLog { id: string; userId: string; dateWokeUp: string; timeWentToBed: string; timeWokeUp: string; sleepQuality?: SleepQuality; notes?: string; createdAt: Date;}
export enum MedicationDosageUnit { Pill = 'Pill', Mg = 'Mg', MlSmall = 'MlSmall', Drop = 'Drop', Spray = 'Spray', Unit = 'Unit',}
export interface PersonalMedicationReminder { id: string; userId: string; medicationName: string; dosage: string; dosageUnit: MedicationDosageUnit; timesPerDay: number; specificTimes: string[]; startDate: string; endDate?: string; notes?: string; takenLog: Record<string, boolean>; createdAt: Date;}
export interface PersonalBPLog { id: string; userId: string; systolic: number; diastolic: number; pulse?: number; date: string; time: string; notes?: string; createdAt: Date;}
export enum SugarUnit { MgDlUnit = 'MgDl', MmolLUnit = 'MmolL',} 
export enum SugarMeasurementType { FastingSugar = 'Fasting', PostPrandialSugar = 'PostPrandial', RandomSugar = 'Random', HbA1cSugar = 'HbA1c',} 
export interface PersonalSugarLog { id: string; userId: string; sugarLevel: number; unit: SugarUnit; measurementType: SugarMeasurementType; date: string; time: string; notes?: string; createdAt: Date;}
export enum DayOfWeek { SundayDay = 'Sunday', MondayDay = 'Monday', TuesdayDay = 'Tuesday', WednesdayDay = 'Wednesday', ThursdayDay = 'Thursday', FridayDay = 'Friday', SaturdayDay = 'Saturday',} // Renamed
export interface ExerciseDetail { id: string; name: string; sets?: number; reps?: string; durationMinutes?: number; restSeconds?: number; notes?: string;}
export interface PersonalExercisePlan { id: string; userId: string; planName: string; description?: string; scheduledDays: DayOfWeek[]; exercises: ExerciseDetail[]; isActive: boolean; createdAt: Date;}
export interface MealComponent { id: string; name: string; quantity: string;}
export interface PersonalMealLog { id: string; userId: string; mealType: MealType; date: string; time?: string; components: MealComponent[]; totalCaloriesKcal?: number; photoUrl?: string; notes?: string; createdAt: Date;}
export enum HealthReportPeriod { Last7DaysHealth = 'Last7Days', Last30DaysHealth = 'Last30Days', CustomHealth = 'Custom',} // Renamed
export enum ShoppingListCategory { GroceriesCat = 'Groceries', HouseholdCat = 'Household', PharmacyCat = 'Pharmacy', ClothingCat = 'Clothing', ElectronicsCat = 'Electronics', OtherCatShop = 'Other',} 
export interface ShoppingListItem { id: string; userId: string; name: string; quantity?: string; category: ShoppingListCategory; isPurchased: boolean; notes?: string; createdAt: Date;}
export enum HomeInventoryCategory { FoodPantryInv = 'FoodPantry', CleaningSuppliesInv = 'CleaningSupplies', ToiletriesInv = 'Toiletries', OfficeSuppliesInv = 'OfficeSupplies', ToolsInv = 'Tools', LinensInv = 'Linens', DecorationsInv = 'Decorations', OtherInvCat = 'Other',} 
export interface HomeInventoryItem { id: string; userId: string; name: string; category: HomeInventoryCategory; quantity: number; unit: string; minStockLevel?: number; location?: string; notes?: string; createdAt: Date; updatedAt: Date;}
export enum CleaningFrequency { DailyClean = 'Daily', WeeklyClean = 'Weekly', BiWeeklyClean = 'BiWeekly', MonthlyClean = 'Monthly', AsNeededClean = 'AsNeeded',} 
export interface CleaningTask { id: string; userId: string; name: string; frequency: CleaningFrequency; assignedTo?: string; lastCompleted?: string; notes?: string; createdAt: Date;}
export enum MaintenanceItemType { PlumbingMaint = 'Plumbing', ElectricalMaint = 'Electrical', ApplianceMaint = 'Appliance', HVACMaint = 'HVAC', StructuralMaint = 'Structural', PaintingMaint = 'Painting', GardeningMaint = 'Gardening', PestControlMaint = 'PestControl', OtherMaint = 'Other',} 
export enum MaintenanceTaskFrequency { OneTimeMaint = 'OneTime', MonthlyMaint = 'Monthly', QuarterlyMaint = 'Quarterly', SemiAnnuallyMaint = 'SemiAnnually', AnnuallyMaint = 'Annually', AsNeededMaint = 'AsNeeded',} 
export interface HomeMaintenanceLog { id: string; userId: string; itemName: string; type: MaintenanceItemType; frequency: MaintenanceTaskFrequency; lastCompletedDate?: string; nextDueDate?: string; cost?: number; serviceProvider?: string; notes?: string; createdAt: Date;}
export enum HomeBillCategory { ElectricityBill = 'Electricity', WaterBill = 'Water', GasBill = 'Gas', InternetBill = 'Internet', PhoneLandlineBill = 'PhoneLandline', MaintenanceFeesBill = 'MaintenanceFees', MortgageRentBill = 'MortgageRent', OtherHomeBillCat = 'OtherHomeBill',} 
export interface HomeBill { id: string; userId: string; name: string; category: HomeBillCategory; amountDue: number; dueDate: string; isPaid: boolean; paidDate?: string; serviceProvider?: string; accountNumber?: string; notes?: string; createdAt: Date;}
export enum HomeApplianceCategory { KitchenMajorApp = 'KitchenMajor', KitchenSmallApp = 'KitchenSmall', LaundryApp = 'Laundry', EntertainmentApp = 'Entertainment', CleaningApp = 'Cleaning', HVACApp = 'HVAC', OfficeApp = 'Office', OtherApplianceCat = 'OtherAppliance',} 
export interface HomeAppliance { id: string; userId: string; name: string; category: HomeApplianceCategory; brand?: string; modelNumber?: string; serialNumber?: string; purchaseDate?: string; warrantyExpiryDate?: string; manualUrl?: string; notes?: string; createdAt: Date;}
export enum HomeImprovementProjectStatus { PlanningStatus = 'Planning', InProgressStatus = 'InProgress', OnHoldStatus = 'OnHold', CompletedStatus = 'Completed', CancelledStatus = 'Cancelled',} 
export interface HomeImprovementProjectTask { id: string; name: string; isCompleted: boolean; notes?: string;}
export interface HomeImprovementProject { id: string; userId: string; name: string; description?: string; status: HomeImprovementProjectStatus; startDate?: string; endDate?: string; budget?: number; actualCost?: number; tasks: HomeImprovementProjectTask[]; notes?: string; createdAt: Date;}
export interface RentReminder { id: string; userId: string; propertyName: string; rentAmount: number; paymentDay: number; reminderDaysBefore: number; notes?: string; createdAt: Date;}
export enum EnergyType { ElectricityEnergy = 'Electricity', GasEnergy = 'Gas', WaterEnergy = 'Water',} 
export interface EnergyConsumptionLog { id: string; userId: string; type: EnergyType; reading: number; readingDate: string; unit: string; notes?: string; createdAt: Date;}
export enum CarMaintenanceType { OilChangeCar = 'OilChange', TireRotationCar = 'TireRotation', BrakeCheckCar = 'BrakeCheck', BatteryCheckCar = 'BatteryCheck', EngineTuneUpCar = 'EngineTuneUp', AirFilterCar = 'AirFilter', CoolantFlushCar = 'CoolantFlush', OtherCarMaint = 'OtherCarMaintenance',} 
export interface CarMaintenanceReminder { id: string; userId: string; vehicleName?: string; type: CarMaintenanceType; lastServiceDate?: string; lastServiceMileage?: number; nextServiceDate?: string; nextServiceMileage?: number; notes?: string; isCompleted: boolean; createdAt: Date;}
export interface CarFuelLog { id: string; userId: string; vehicleName?: string; date: string; odometerReading: number; litersFilled: number; pricePerLiter: number; totalCost?: number; fuelEfficiency?: number; notes?: string; createdAt: Date;}
export enum CarExpenseCategory { FuelExpense = 'Fuel', MaintenanceRepairExpense = 'MaintenanceRepair', InsuranceExpense = 'Insurance', RegistrationLicensingExpense = 'RegistrationLicensing', ParkingTollsExpense = 'ParkingTolls', WashingCleaningExpense = 'WashingCleaning', AccessoriesPartsExpense = 'AccessoriesParts', OtherCarExpenseCat = 'OtherCarExpense',} 
export interface CarExpense { id: string; userId: string; vehicleName?: string; date: string; description: string; category: CarExpenseCategory; amount: number; notes?: string; createdAt: Date;}
export enum CarDocumentType { LicenseDoc = 'License', InsuranceDoc = 'Insurance', VehicleInspectionDoc = 'VehicleInspection', RegistrationDoc = 'Registration', OtherCarDoc = 'OtherCarDocument',} 
export interface CarDocumentReminder { id: string; userId: string; vehicleName?: string; documentType: CarDocumentType; documentNumber?: string; expiryDate: string; reminderDaysBefore: number; isRenewed: boolean; notes?: string; createdAt: Date;}
export interface CarRepairLog { id: string; userId: string; vehicleName?: string; dateOfRepair: string; description: string; workshopName?: string; odometerAtRepair?: number; cost?: number; notes?: string; createdAt: Date;}
export interface CarMileageLog { id: string; userId: string; vehicleName?: string; date: string; startOdometer?: number; endOdometer: number; tripDistance?: number; purposeOfTrip?: string; notes?: string; createdAt: Date;}
export interface CarParkingLog { id: string; userId: string; vehicleName?: string; locationDescription: string; timestamp: Date; isCurrent: boolean; notes?: string; createdAt: Date;}
export interface PersonalTripPlan { id: string; userId: string; tripName: string; mainDestination: string; startDate: string; endDate: string; budget?: number; transportationDetails?: string; accommodationDetails?: string; notes?: string; createdAt: Date;}
export interface PackingListItem { id: string; name: string; quantity: number; isPacked: boolean;}
export interface PackingList { id: string; userId: string; listName: string; tripId?: string; items: PackingListItem[]; createdAt: Date;}
export enum TravelReminderType { FlightTravel = 'Flight', TrainTravel = 'Train', BusTravel = 'Bus', HotelCheckInTravel = 'HotelCheckIn', ActivityBookingTravel = 'ActivityBooking', OtherTravelReminderCat = 'OtherTravelReminder',} 
export enum TravelReminderLeadTime { NoneLead = 'None', AtTimeLead = 'AtTime', Min15Lead = 'Min15', Min30Lead = 'Min30', Hour1Lead = 'Hour1', Hour3Lead = 'Hour3', Day1Lead = 'Day1', Day2Lead = 'Day2',} 
export interface TravelReminder { id: string; userId: string; tripId?: string; reminderName: string; reminderType: TravelReminderType; eventDateTime: string; leadTime: TravelReminderLeadTime; isDismissed: boolean; notes?: string; createdAt: Date;}
export enum BookingType { FlightBooking = 'Flight', HotelBooking = 'Hotel', TrainBooking = 'Train', CarRentalBooking = 'CarRental', ActivityBookingCat = 'Activity', OtherBookingCat = 'OtherBooking',} 
export interface TravelBooking { id: string; userId: string; tripId?: string; bookingName: string; bookingType: BookingType; confirmationNumber?: string; provider?: string; startDate?: string; endDate?: string; details?: string; cost?: number; currency?: string; documentUrl?: string; notes?: string; createdAt: Date;}
export enum TravelExpenseCategory { AccommodationExpense = 'Accommodation', TransportationExpense = 'Transportation', FoodTravel = 'Food', ActivitiesTravel = 'Activities', ShoppingTravel = 'Shopping', MiscellaneousTravel = 'Miscellaneous',} 
export interface TravelExpense { id: string; userId: string; tripId?: string; expenseName: string; category: TravelExpenseCategory; amount: number; currency?: string; date: string; receiptUrl?: string; notes?: string; createdAt: Date;}

export interface DailyShiftAssignment {
  teamId: string;
  shiftType: ShiftType; // Uses the top-level ShiftType
}
export interface DailyShiftAdjustment { date: string; day_of_week: string; morning_shift_team: string; evening_shift_team: string; notes: string; returning_team_member_name?: string; covering_team_member_name?: string; action_description?: string;}
export interface SpecialPeriodDetails { start_date: string; end_date: string; reason: string; team_on_leave?: string;}
export interface ShiftSuggestion { introduction?: string; special_period_details?: SpecialPeriodDetails; schedule_adjustments: DailyShiftAdjustment[]; return_to_normal_plan?: DailyShiftAdjustment[]; conclusion?: string;}
export interface AiSolution { solution_id: string; title: string; description: string; pros: string[]; cons: string[]; practical_steps?: string[];}
export interface SmartShiftEnhancementSuggestion { fahlawy_assessment: string; suggested_solutions: AiSolution[]; fahlawy_final_word: string;}
export interface MaintenanceSearchHistoryItem { id: string; equipmentName: string; problemDescription: string; timestamp: Date;}
export interface MaintenanceSolution { solution_id: string; title: string; description: string; estimated_time?: string; required_tools?: string[]; safety_precautions?: string[]; steps: string[];}
export interface SmartMaintenanceEnhancementSuggestion { fahlawy_diagnosis: string; recommended_solutions: MaintenanceSolution[]; fahlawy_final_advice: string;}

// --- Prayer Times Types ---
export enum PrayerName {
  FajrPrayer = 'Fajr', 
  DhuhrPrayer = 'Dhuhr', 
  AsrPrayer = 'Asr',   
  MaghribPrayer = 'Maghrib',
  IshaPrayer = 'Isha',    
}

export interface PrayerTimeItem {
  name: PrayerName;
  time: string;
  displayNameKey: keyof TranslationSet;
}

export interface Occasion {
  date: string;
  nameKey: keyof TranslationSet;
  nameEn: string;
  nameAr: string;
  color?: string;
  icon?: string;
}

// Types for new services - Fully defined for CRUD
export interface EquipmentLogbookItem {
  id: string;
  equipmentName: string;
  logEntry: string;
  timestamp: Date;
  loggedBy: string;
  category?: string;
  status?: 'open' | 'inProgress' | 'resolved' | 'pendingParts';
  priority?: 'low' | 'medium' | 'high' | 'critical';
}
export enum PermitStatus { RequestedPermit = 'Requested', ApprovedPermit = 'Approved', ActivePermit = 'Active', ClosedPermit = 'Closed', RejectedPermit = 'Rejected', ExpiredPermit = 'Expired' } 
export interface PermitToWorkItem { id: string; type: string; location: string; description: string; requestedBy: string; status: PermitStatus; requestDate: Date; approvalDate?: Date; expiryDate?: Date; workStartDate?: Date; workEndDate?: Date; notes?: string; involvedPersonnel?: string[]; safetyPrecautions?: string[]; }
export enum SafetyObservationCategory { UnsafeActObs = 'UnsafeAct', UnsafeConditionObs = 'UnsafeCondition', NearMissObs = 'NearMiss', PositiveObservationObs = 'PositiveObservation', EnvironmentalObs = 'Environmental' } 
export interface SafetyObservationItem { id: string; observation: string; location: string; reportedBy: string; timestamp: Date; category: SafetyObservationCategory; recommendedAction?: string; severity?: 'Low' | 'Medium' | 'High' | 'Critical'; followUpStatus?: 'Open' | 'InProgress' | 'Closed' | 'RequiresReview'; }

export enum ShiftHandoverNoteCategory {
    OutgoingGeneralNote = 'OutgoingGeneral', 
    IncomingGeneralNote = 'IncomingGeneral', 
    EquipmentStatusNote = 'EquipmentStatus', 
    SafetyChecklistNote = 'SafetyChecklist', 
    UrgentActionNote = 'UrgentAction' 
}
export interface ShiftHandoverNoteItem { id: string; fromTeamIdOrName: string; toTeamIdOrName: string; note: string; category: ShiftHandoverNoteCategory; timestamp: Date; acknowledgedBy?: string; followUpRequired?: boolean; }
export interface KnowledgeBaseTipItem { id: string; title: string; tip: string; category: string; submittedBy?: string; timestamp: Date; tags?: string[]; upvotes?: number; }
export interface UnitConversionDefinition { id: string, fromUnit: string; toUnit: string; factor: number; category: string; }
export interface UnitConversionItem { id: string, fromUnit: string; toUnit: string; value: number; result: number; timestamp: Date; }
export interface EmergencyContactItem { id: string; name: string; number: string; department: string; type?: 'Internal' | 'External' | 'SiteEmergency' | 'Medical' | 'Security'; notes?: string; lastVerified?: Date; }
export interface EmergencyProcedureItem { id: string; title: string; steps: string[]; lastReviewed?: Date; relatedContacts?: string[]; }
export interface InternalAnnouncementItem { id: string; title: string; content: string; postedBy: string; timestamp: Date; expiryDate?: Date; departmentScope?: string[]; isUrgent?: boolean; attachments?: {name: string, url: string}[]; }
export interface ToolboxTalkItem { id: string; topic: string; date: Date; presenter: string; attendees: string[]; notes?: string; durationMinutes?: number; location?: string; safetyTopicId?: string; }
export interface ChemicalReferenceItem { id: string; chemicalName: string; casNumber?: string; sdsUrl?: string; hazards: string[]; firstAid: string[]; ppe: string[]; storageInfo?: string; disposalInfo?: string; lastUpdated: Date; }

// PetroWiki Specific Type
export interface PetroWikiTerm {
  id: string;
  acronym: string;
  arabicName: string;
  englishName: string;
  category: string;
  comedicDescriptionKey: keyof TranslationSet;
  detailedDescriptionKey: keyof TranslationSet;
  imagePlaceholderUrl?: string;
}

// PetroGenius specific types
export interface PetroGeniusResponse {
  explanation: string;
  steps?: string[];
  safety_warnings?: string[];
  imageUrl?: string; // Optional for placeholder image
}

// Daily Report specific type
export interface ReportItem {
  id: string;
  teamId: string;
  reportDate: string; // YYYY-MM-DD
  shiftType: ShiftType; // Morning, Evening
  reportTitle: string;
  reportContent: string;
  submittedBy: string; // User name or ID
  timestamp: Date;
  attachments?: { name: string; url: string; type: 'image' | 'document' }[];
>>>>>>> bee2d85 (updated)
}


export interface TranslationSet {
<<<<<<< HEAD
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
=======
  appName: string; companyName: string; companyShortName: string; dashboard: string; shifts: string; tasks: string; ships: string; settings: string; notifications: string; language: string; english: string; arabic: string; welcomeMessage: string; currentShift: string; morningShift: string; eveningShift: string; teamOnDuty: string; supervisor: string; members: string; addTask: string; taskDescription: string; saveTask: string; noTasks: string; shipName: string; shipStatus: string; cargoType: string; quantityRemaining: string; quantityPerHour: string; eta: string; pumps: string; noShips: string; userRole: string; selectRole: string; employee: string; supervisorRole: string; engineer: string; engineersList: string; supervisorsList: string; appTheme: string; lightMode: string; darkMode: string; darkModeDescription: string; comedyLevel: string; normal: string; hilarious: string; shiftSchedule: string; team: string; offDuty: string; dailyLog: string; submitEntry: string; entryPlaceholder: string; viewTeamDetails: string; hideTeamDetails: string; pumpName: string; pumpStatus: string; running: string; standby: string; maintenance: string; offline: string; activeShift: string; upcomingShift: string; loadingMessage: string; splashIntro: string; prayerTimes: string; prayerTimesDamietta: string; fajr: string; dhuhr: string; asr: string; maghrib: string; isha: string; salaryNotification: string; salaryNotificationToggle: string; salaryNotificationEnabledMessage: string; quickActions: string; requestLeave: string; funStuff: string; funStuffTitle: string; quranRadio: string; quranRadioPlayerTitle: string; quranRadioNowPlaying: string; quranRadioPlay: string; quranRadioPause: string; quranRadioLoading: string; quranRadioError: string; quranRadioPlaying: string; quranRadioPaused: string; puzzleGame: string; puzzleGameTitle: string; puzzleGamePlay: string; puzzleGameQuestion: string; puzzleGameOptA: string; puzzleGameOptB: string; puzzleGameOptC: string; puzzleGameSubmit: string; puzzleGameCorrect: string; puzzleGameWrong: string; jokesToday: string; chatbotFahlawy: string;
  chatbotPlaceholder: string; chatbotSend: string; chatbotDefaultResponse1: string; chatbotDefaultResponse2: string; chatbotDefaultResponse3: string; import: string; export: string; docked: string; anchored: string;
  dailyTaskPrompt: string;
  shipManagementFooter: string;
  settingsFooter: string;
  sidebarFooter: string; globalFooter: string; footerCompanyName: string;
>>>>>>> bee2d85 (updated)
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
<<<<<<< HEAD
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
=======
  settingsPrayerReminderButton: string; settingsPrayerReminderSet: string; settingsWhatsAppTelegram: string; settingsLinkWhatsApp: string; settingsLinkTelegram: string; settingsLinkSoon: string;
  viewName_dashboard: string; viewName_shifts: string; viewName_tasks: string; viewName_ships: string; viewName_fun: string; viewName_settings: string; viewName_leaveRequest: string; viewName_chat: string; viewName_kanban: string; viewName_profile: string; viewName_preventiveMaintenance: string; viewName_accidentReport: string; viewName_login: string; viewName_signup: string; viewName_personalHub: string;
  viewName_aiMaintenanceGuide: string; viewName_aiShiftScheduler: string; viewName_smartShiftEnhancer: string; viewName_smartMaintenanceEnhancer: string; viewName_activityLog: string; viewName_advancedCalculator: string; viewName_trainingCourses: string;
  viewName_petroGenius: string; // Added PetroGenius view name
  viewName_petroWiki: string;
  viewName_adminDashboard: string;
  kanbanBoardTitle: string;
  kanbanTodo: string; kanbanInProgress: string; kanbanDone: string;
  kanbanSampleTask1Title: string; kanbanSampleTask1Desc: string; kanbanSampleTask2Title: string; kanbanSampleTask2Desc: string; kanbanSampleTask3Title: string; kanbanSampleTask3Desc: string; kanbanSampleTask4Title: string; kanbanSampleTask4Desc: string; kanbanSampleTask5Title: string; kanbanSampleTask5Desc: string; kanbanSampleTask6Title: string; kanbanSampleTask6Desc: string;
  kanbanMoveTask: string; kanbanFooter: string;
  petroleumFlame: string; ugdcWelcome: string;
  myProfile: string; logout: string; logoutSuccess: string;
  leaveRequestTitle: string; leaveRequestDescription: string;
  chatTitle: string; chatDescription: string; chatMessageSent: string;
  shipNameNefertiti: string; shipNameAbuSaree: string; shipNameOmHashem: string; pumpSpareName: string; pumpPamperedName: string; pumpBossRedaName: string;
  comingSoon: string; comingSoonMessage: string; featureUnderConstruction: string;
  settingsChangeSuccess: string; leaveRequestSubmitSuccess: string;
  preventiveMaintenanceTitle: string; preventiveMaintenanceEquipmentList: string; preventiveMaintenanceScheduleMaintenance: string; preventiveMaintenanceUpcoming: string; preventiveMaintenanceNoUpcoming: string; preventiveMaintenanceFooter: string;
  accidentReportTitle: string; accidentReportFormTitle: string; accidentReportDate: string; accidentReportLocation: string; accidentReportType: string; accidentReportDescription: string; accidentReportSubmit: string; accidentReportRecent: string; accidentReportNoRecent: string; accidentReportFooter: string;
  recurringTasksSectionTitle: string;
  recurringTaskCheckValves: string; recurringTaskGeneratorOil: string; recurringTaskSafetyBriefing: string;
  puzzleFetchingError: string;
  jokeFetchingError: string;
  aiFeatureApiKeyMissing: string;
  noNotifications: string;
  profileNameLabel: string; profileRoleLabel: string; profileTeamLabel: string; profileEmailLabel: string; profilePhoneLabel: string; profileLastLoginLabel: string; profileEditButton: string; profileChangePasswordButton: string; profileNotificationSettingsButton: string;
  profileFeatureDevToast: string;
  profileFooterActive: string;
  profileEditInfoTitle: string; profileChangePasswordTitle: string; profileNotificationSettingsTitle: string; profileCurrentPasswordLabel: string; profileNewPasswordLabel: string; profileConfirmNewPasswordLabel: string; profileCurrentPasswordPlaceholder: string; profileNewPasswordPlaceholder: string; profileConfirmNewPasswordPlaceholder: string; profileSaveChangesButton: string; profileUpdatePasswordButton: string; profileSaveNotificationPrefsButton: string; profileCancelButton: string;
  profileNotifyEmailShiftsLabel: string; profileNotifyPushTasksLabel: string; profileNotifySmsAlertsLabel: string;
>>>>>>> bee2d85 (updated)
  profileUpdateSuccess: string;
  profilePasswordChangeSuccess: string;
  profileNotificationSettingsSuccess: string;
  profileFooterEdit: string;
<<<<<<< HEAD
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
=======
  linkWithWhatsAppTitle: string; linkWithTelegramTitle: string; linkQrCodeAlt: string; linkInstructionsWhatsApp: string; linkInstructionsTelegram: string; linkConfirmButton: string; linkCancelButton: string;
  linkSuccessWhatsAppToast: string;
  linkSuccessTelegramToast: string;
  loginTitle: string;
  signupTitle: string;
  emailLabel: string; passwordLabel: string; confirmPasswordLabel: string; loginButton: string; signupButton: string;
  dontHaveAccountPrompt: string;
  alreadyHaveAccountPrompt: string;
  loginFailedError: string;
  loginFailedNetworkError: string;
  signupFailedError: string;
  logoutFailedError: string;
  passwordResetPrompt: string;
  passwordResetSentSuccess: string;
  passwordResetSentError: string;
  profileDataLoadError: string;
  funStuffApiKeyMissingPuzzle: string;
  funStuffApiKeyMissingJoke: string;
  errorModalDefaultTitle: string;
  errorModalCloseButton: string;
  personalHubTitle: string;
  addPersonalTask: string; personalTaskDescription: string; personalTaskDueDate: string; personalTaskRecurring: string; personalTaskCategory: string; personalTaskCategoryHome: string; personalTaskCategoryWork: string; personalTaskCategoryErrands: string; personalTaskCategoryStudy: string; personalTaskCategoryHealth: string; personalTaskCategoryOther: string;
  noPersonalTasks: string;
  personalTaskAddedSuccess: string;
  personalTaskDeletedSuccess: string;
  confirmDeletePersonalTask: string;
  personalTaskEstimatedDuration: string; personalTaskDurationUnit: string; personalTaskDueTime: string; personalTaskPriority: string; personalTaskPriorityUrgent: string; personalTaskPriorityHigh: string; personalTaskPriorityMedium: string; personalTaskPriorityLow: string; personalTaskStatisticsTitle: string; personalTaskTotalTasks: string; personalTaskCompletedTasks: string; personalTaskPendingTasks: string; personalTaskCompletionRate: string; personalTaskStatsByPriority: string;
  personalFinanceTitle: string;
  personalFinanceMyExpenses: string; personalFinanceExpenseDescription: string; personalFinanceAmount: string; personalFinanceCategoryFood: string; personalFinanceCategoryTransport: string; personalFinanceCategoryBills: string; personalFinanceCategoryEntertainment: string; personalFinanceCategoryShopping: string; personalFinanceCategoryHealth: string; personalFinanceCategoryOther: string; personalFinanceAddExpense: string;
  personalFinanceNoExpenses: string;
  personalFinanceMyIncome: string; personalFinanceIncomeSource: string; personalFinanceIncomeAmount: string; personalFinanceAddIncome: string;
  personalFinanceNoIncome: string;
  personalFinanceExpenseAddedSuccess: string;
  personalFinanceExpenseDeletedSuccess: string; personalFinanceConfirmDeleteExpense: string;
  personalFinanceIncomeAddedSuccess: string;
  personalFinanceIncomeDeletedSuccess: string; personalFinanceConfirmDeleteIncome: string;
  personalFinanceMyBudgets: string; personalFinanceAllocatedAmount: string; personalFinanceYear: string; personalFinanceSaveBudget: string; personalFinanceDeleteBudget: string;
  personalFinanceNoBudgets: string;
  personalFinanceConfirmDeleteBudget: string;
  personalFinanceDebtsAndLoans: string; personalFinanceDebtTypeDebt: string; personalFinanceDebtTypeLoan: string; personalFinanceCounterpartyName: string; personalFinanceTotalDebtLoanAmount: string; personalFinanceAmountPaid: string; personalFinanceDueDate: string; personalFinanceDebtLoanStatus: string; personalFinanceStatusActive: string; personalFinanceStatusPaid: string; personalFinanceAddDebtLoan: string;
  personalFinanceNoDebtsLoans: string;
  personalFinanceDebtLoanAddedSuccess: string;
  personalFinanceDebtLoanDeletedSuccess: string; personalFinanceConfirmDeleteDebtLoan: string;
  personalFinanceMyInvestments: string; personalFinanceInvestmentNameSymbol: string; personalFinanceInvestmentTypeStocks: string; personalFinanceInvestmentTypeBonds: string; personalFinanceInvestmentTypeCrypto: string; personalFinanceInvestmentTypeRealEstate: string; personalFinanceInvestmentTypeOther: string; personalFinanceInitialInvestment: string; personalFinanceCurrentValue: string; personalFinancePurchaseDate: string; personalFinanceAddInvestment: string;
  personalFinanceNoInvestments: string;
  personalFinanceInvestmentAddedSuccess: string;
  personalFinanceInvestmentDeletedSuccess: string; personalFinanceConfirmDeleteInvestment: string;
  personalFinanceBillReminders: string; personalFinanceBillName: string; personalFinanceEstAmount: string; personalFinanceAddBillReminder: string;
  personalFinanceNoBillReminders: string;
  personalFinanceBillAddedSuccess: string;
  personalFinanceBillDeletedSuccess: string; personalFinanceConfirmDeleteBill: string; personalFinanceMarkAsPaid: string; personalFinanceMarkAsUnpaid: string;
  personalFinanceBillUpdatedSuccess: string;
  personalFinanceFinancialReports: string; personalFinanceReportPeriod: string; personalFinanceReportPeriodLast7Days: string; personalFinanceReportPeriodLast30Days: string; personalFinanceReportPeriodThisMonth: string; personalFinanceReportPeriodLastMonth: string; personalFinanceReportPeriodCustomRange: string; personalFinanceReportGenerate: string; personalFinanceReportSummaryFor: string; personalFinanceReportTotalIncome: string; personalFinanceReportTotalExpenses: string; personalFinanceReportNetFlow: string;
  personalFinanceTaxEstimator: string;
  personalFinanceAnnualIncome: string; personalFinanceAnnualDeductions: string; personalFinanceCalculateEstimatedTax: string; personalFinanceEstimatedTaxableIncome: string; personalFinanceEstimatedTaxAmount: string;
  personalFinanceTaxDisclaimer: string;
  personalFinanceExportData: string; personalFinanceExportExpensesCSV: string; personalFinanceExportIncomeCSV: string; personalFinanceExportDebtsLoansCSV: string; personalFinanceExportInvestmentsCSV: string;
  personalFinanceDataExportedSuccess: string;
  currencyEGP: string; descriptionLabel: string;
  statusSuccessMessage: string;
  healthFitnessTitle: string;
  healthFitnessActivityLog: string; healthFitnessActivityTypeWalking: string; healthFitnessActivityTypeRunning: string; healthFitnessActivityTypeCycling: string; healthFitnessActivityTypeGym: string; healthFitnessActivityTypeSwimming: string; healthFitnessActivityTypeYoga: string; healthFitnessActivityTypeSports: string; healthFitnessActivityTypeOther: string; healthFitnessDurationMinutes: string; healthFitnessDurationMinutesShortUnit: string; healthFitnessLogNewActivity: string;
  healthFitnessNoActivitiesLogged: string;
  healthFitnessSaveActivity: string;
  healthFitnessDeleteActivity: string;
  healthFitnessConfirmDeleteActivity: string;
  healthFitnessWeightLog: string; healthFitnessWeightKg: string; healthFitnessUnitKg: string; healthFitnessLogNewWeight: string;
  healthFitnessNoWeightLogged: string;
  healthFitnessSaveWeight: string;
  healthFitnessDeleteWeight: string;
  healthFitnessConfirmDeleteWeight: string;
  healthFitnessCalorieLog: string; healthFitnessMealTypeBreakfast: string; healthFitnessMealTypeLunch: string; healthFitnessMealTypeDinner: string; healthFitnessMealTypeSnack: string; healthFitnessMealTypeOther: string; healthFitnessFoodItem: string; healthFitnessCaloriesKcal: string; healthFitnessUnitKcal: string; healthFitnessLogMealSnack: string;
  healthFitnessNoCalorieEntries: string;
  healthFitnessSaveCalorieEntry: string;
  healthFitnessDeleteCalorieEntry: string;
  healthFitnessConfirmDeleteCalorieEntry: string;
  healthFitnessWaterLog: string; healthFitnessWaterAmountMl: string; healthFitnessUnitMl: string; healthFitnessLogWaterIntake: string;
  healthFitnessNoWaterEntries: string;
  healthFitnessSaveWaterEntry: string;
  healthFitnessDeleteWaterEntry: string;
  healthFitnessConfirmDeleteWaterEntry: string;
  healthFitnessQuickAddWater250ml: string; healthFitnessQuickAddWater500ml: string; healthFitnessQuickAddWater1L: string;
  healthFitnessSleepLog: string; healthFitnessDateWokeUp: string; healthFitnessTimeWentToBed: string; healthFitnessTimeWokeUp: string; healthFitnessSleepQuality: string; healthFitnessSleepQualityPoor: string; healthFitnessSleepQualityFair: string; healthFitnessSleepQualityGood: string;
  healthFitnessSleepQualityExcellent: string;
  healthFitnessLogSleepEntry: string;
  healthFitnessNoSleepEntries: string;
  healthFitnessSaveSleepEntry: string;
  healthFitnessDeleteSleepEntry: string;
  healthFitnessConfirmDeleteSleepEntry: string;
  healthFitnessMedicationReminders: string; healthFitnessMedicationName: string; healthFitnessDosage: string; healthFitnessDosageUnit: string; healthFitnessDosageUnitPill: string; healthFitnessDosageUnitMg: string; healthFitnessDosageUnitMlSmall: string; healthFitnessDosageUnitDrop: string; healthFitnessDosageUnitSpray: string; healthFitnessDosageUnitUnit: string; healthFitnessTimesPerDay: string; healthFitnessSpecificTimes: string; healthFitnessStartDate: string; healthFitnessAddMedicationReminder: string;
  healthFitnessNoMedReminders: string;
  healthFitnessSaveMedReminder: string;
  healthFitnessDeleteMedReminder: string;
  healthFitnessConfirmDeleteMedReminder: string;
  healthFitnessMarkAsTaken: string; healthFitnessMarkAsMissed: string; healthFitnessStatusTaken: string;
  healthFitnessVitalSignsLog: string; healthFitnessLogBloodPressure: string; healthFitnessSystolic: string; healthFitnessDiastolic: string; healthFitnessPulse: string; healthFitnessUnitMmhg: string; healthFitnessUnitBpm: string; healthFitnessSaveBPLog: string;
  healthFitnessNoBPLogs: string;
  healthFitnessConfirmDeleteBPLog: string; healthFitnessDeleteBPLog: string;
  healthFitnessLogBloodSugar: string; healthFitnessSugarLevel: string; healthFitnessSugarUnit: string; healthFitnessSugarUnitMgDl: string; healthFitnessSugarUnitMmolL: string; healthFitnessMeasureType: string; healthFitnessMeasureTypeFasting: string; healthFitnessMeasureTypePostPrandial: string; healthFitnessMeasureTypeRandom: string; healthFitnessMeasureTypeHbA1c: string; healthFitnessSaveSugarLog: string;
  healthFitnessNoSugarLogs: string;
  healthFitnessConfirmDeleteSugarLog: string; healthFitnessDeleteSugarLog: string;
  healthFitnessExercisePlans: string; healthFitnessPlanName: string; healthFitnessCreateNewPlan: string;
  healthFitnessNoExercisePlans: string;
  healthFitnessSaveExercisePlan: string;
  healthFitnessDeletePlan: string;
  healthFitnessConfirmDeletePlan: string;
  healthFitnessMealLog: string; healthFitnessMealComponents: string; healthFitnessLogNewMeal: string;
  healthFitnessNoMealsLogged: string;
  healthFitnessSaveMealLog: string;
  healthFitnessDeleteMealLog: string;
  healthFitnessConfirmDeleteMealLog: string;
  healthFitnessReports: string;
  homeManagementTitle: string;
  homeShoppingList: string; homeItemName: string; homeShoppingCategoryGroceries: string; homeShoppingCategoryHousehold: string; homeShoppingCategoryPharmacy: string; homeShoppingCategoryClothing: string; homeShoppingCategoryElectronics: string; homeShoppingCategoryOther: string; homeAddItemToList: string;
  homeNoShoppingItems: string;
  homeItemAddedSuccess: string;
  homeItemDeletedSuccess: string;
  homeConfirmDeleteShoppingItem: string;
  homeItemUpdatedSuccess: string;
  homeInventory: string; homeInventoryCategoryFoodPantry: string; homeInventoryCategoryCleaningSupplies: string; homeInventoryCategoryToiletries: string; homeInventoryCategoryOfficeSupplies: string; homeInventoryCategoryTools: string; homeInventoryCategoryLinens: string; homeInventoryCategoryDecorations: string; homeInventoryCategoryOther: string; homeInventoryQuantity: string; homeInventoryUnit: string; homeAddInventoryItem: string;
  homeNoInventoryItems: string;
  homeInventoryItemAddedSuccess: string;
  homeInventoryItemDeletedSuccess: string;
  homeConfirmDeleteInventoryItem: string;
  homeCleaningSchedule: string; homeCleaningTaskName: string; homeCleaningFrequencyDaily: string; homeCleaningFrequencyWeekly: string; homeCleaningFrequencyBiWeekly: string; homeCleaningFrequencyMonthly: string; homeCleaningFrequencyAsNeeded: string; homeAddCleaningTask: string;
  homeNoCleaningTasks: string;
  homeCleaningTaskAddedSuccess: string;
  homeCleaningTaskDeletedSuccess: string;
  homeConfirmDeleteCleaningTask: string;
  homeCleaningTaskUpdatedSuccess: string;
  homeCleaningLastCompleted: string; homeCleaningMarkAsDoneToday: string;
  homeMaintenanceLog: string; homeMaintenanceItemName: string; homeMaintenanceTypePlumbing: string; homeMaintenanceTypeElectrical: string; homeMaintenanceTypeAppliance: string; homeMaintenanceTypeHVAC: string; homeMaintenanceTypeStructural: string; homeMaintenanceTypePainting: string; homeMaintenanceTypeGardening: string; homeMaintenanceTypePestControl: string; homeMaintenanceTypeOther: string; homeMaintenanceFreqOneTime: string; homeMaintenanceFreqMonthly: string; homeMaintenanceFreqQuarterly: string; homeMaintenanceFreqSemiAnnually: string; homeMaintenanceFreqAnnually: string; homeMaintenanceFreqAsNeeded: string; homeMaintenanceNextDueDate: string; homeLogMaintenanceTask: string;
  homeNoMaintenanceLogs: string;
  homeMaintenanceTaskAddedSuccess: string;
  homeMaintenanceTaskDeletedSuccess: string;
  homeConfirmDeleteMaintenanceLog: string;
  homeMaintenanceTaskUpdatedSuccess: string;
  homeMaintenanceLastCompletedDate: string; homeMaintenanceMarkAsCompletedToday: string;
  homeBills: string; homeBillName: string; homeBillCategoryElectricity: string; homeBillCategoryWater: string; homeBillCategoryGas: string; homeBillCategoryInternet: string; homeBillCategoryPhoneLandline: string; homeBillCategoryMaintenanceFees: string; homeBillCategoryMortgageRent: string; homeBillCategoryOtherHomeBill: string; homeBillAmountDue: string; homeBillDueDate: string; homeAddHomeBill: string;
  homeNoHomeBills: string;
  homeBillAddedSuccess: string;
  homeBillDeletedSuccess: string;
  homeConfirmDeleteBill: string;
  homeBillUpdatedSuccess: string;
  homeStatusPaidOn: string; homeStatusUnpaid: string; homeMarkAsPaid: string; homeMarkAsUnpaid: string;
  homeMyAppliances: string; homeApplianceName: string; homeApplianceCategoryKitchenMajor: string; homeApplianceCategoryKitchenSmall: string; homeApplianceCategoryLaundry: string; homeApplianceCategoryEntertainment: string; homeApplianceCategoryCleaning: string; homeApplianceCategoryHVAC: string; homeApplianceCategoryOffice: string; homeApplianceCategoryOtherAppliance: string; homeAppliancePurchaseDate: string; homeAddAppliance: string;
  homeNoAppliancesLogged: string;
  homeApplianceAddedSuccess: string;
  homeApplianceDeletedSuccess: string;
  homeConfirmDeleteAppliance: string;
  homeApplianceWarrantyStatusActive: string; homeApplianceWarrantyStatusExpired: string; homeApplianceWarrantyStatusExpiringSoon: string;
  homeImprovementProjects: string; homeProjectName: string; homeProjectStatusPlanning: string; homeProjectStatusInProgress: string; homeProjectStatusOnHold: string; homeProjectStatusCompleted: string; homeProjectStatusCancelled: string; homeCreateNewProject: string;
  homeNoImprovementProjects: string;
  homeProjectAddedSuccess: string;
  homeProjectDeletedSuccess: string;
  homeConfirmDeleteProject: string;
  homeRentReminders: string; homePropertyAddress: string; homeRentAmount: string; homeRentPaymentDay: string; homeAddRentReminder: string;
  homeNoRentReminders: string;
  homeRentReminderAddedSuccess: string;
  homeRentReminderDeletedSuccess: string;
  homeConfirmDeleteRentReminder: string;
  homeEnergyConsumption: string; homeEnergyTypeElectricity: string; homeEnergyTypeGas: string; homeEnergyTypeWater: string; homeReading: string; homeUnit: string; homeReadingDate: string; homeAddEnergyLog: string;
  homeNoEnergyLogs: string;
  homeEnergyLogAddedSuccess: string;
  homeEnergyLogDeletedSuccess: string;
  homeConfirmDeleteEnergyLog: string;
  carManagementTitle: string;
  carMaintenanceReminders: string; carVehicleName: string;
  carMyCarDefault: string;
  carMaintenanceTypeOilChange: string; carMaintenanceTypeTireRotation: string; carMaintenanceTypeBrakeCheck: string; carMaintenanceTypeBatteryCheck: string; carMaintenanceTypeEngineTuneUp: string; carMaintenanceTypeAirFilter: string; carMaintenanceTypeCoolantFlush: string; carMaintenanceTypeOtherCarMaintenance: string; carNextServiceDate: string; carAddMaintenanceReminder: string;
  carNoMaintenanceReminders: string;
  carConfirmDeleteReminder: string;
  carDeleteReminder: string;
  carMarkAsDone: string;
  carDocumentRenewals: string; carDocumentTypeLicense: string; carDocumentTypeInsurance: string; carDocumentTypeVehicleInspection: string; carDocumentTypeRegistration: string; carDocumentTypeOtherCarDocument: string; carExpiryDate: string; carAddDocumentReminder: string;
  carNoDocumentReminders: string;
  carStatusExpired: string; carStatusExpiringSoon: string; carStatusValid: string; carMarkAsRenewed: string; carNewExpiryDate: string; carUpdateDocumentReminder: string;
  carFuelLog: string; carOdometerReading: string; carLitersFilled: string; carPricePerLiter: string; carUnitLiters: string; carUnitKm: string; carLogFuelEntry: string;
  carNoFuelLogs: string;
  carSaveFuelLog: string;
  carConfirmDeleteFuelLog: string;
  carDeleteFuelLog: string;
  carExpenses: string; carExpenseDescription: string; carExpenseCategoryFuel: string; carExpenseCategoryMaintenanceRepair: string; carExpenseCategoryInsurance: string; carExpenseCategoryRegistrationLicensing: string; carExpenseCategoryParkingTolls: string; carExpenseCategoryWashingCleaning: string; carExpenseCategoryAccessoriesParts: string; carExpenseCategoryOtherCarExpense: string; carExpenseAmount: string; carLogCarExpense: string;
  carNoCarExpenses: string;
  carSaveCarExpense: string;
  carConfirmDeleteCarExpense: string;
  carDeleteCarExpense: string;
  carRepairLog: string; carRepairDescription: string; carRepairCost: string; carLogCarRepair: string;
  carNoCarRepairs: string;
  carRepairLogAddedSuccess: string;
  carDeleteRepairLog: string;
  carConfirmDeleteRepairLog: string;
  carMileageLog: string; carStartOdometer: string; carEndOdometer: string; carPurposeOfTrip: string; carLogMileageEntry: string;
  carNoMileageLogs: string;
  carMileageLogAddedSuccess: string;
  carDeleteMileageLog: string;
  carConfirmDeleteMileageLog: string;
  carParkingLog: string;
  carLocationDescription: string; carLogParkingSpot: string;
  carCurrentActiveParkingSpot: string;
  carNoActiveParkingSpot: string;
  carClearActiveSpot: string;
  carParkingHistory: string;
  carNoParkingHistory: string;
  carSaveParkingSpot: string;
  carDeleteParkingLog: string;
  carConfirmDeleteParkingLog: string;
  travelAndTripsTitle: string;
  travelMyTrips: string; travelTripName: string; travelMainDestination: string; travelStartDate: string; travelEndDate: string; travelPlanNewTrip: string;
  travelNoTripsPlanned: string;
  travelTripAddedSuccess: string;
  travelTripDeletedSuccess: string;
  travelConfirmDeleteTripPlan: string;
  travelPackingLists: string; travelListName: string; travelCreatePackingList: string;
  travelNoPackingLists: string;
  travelSavePackingList: string;
  travelDeletePackingList: string;
  travelConfirmDeletePackingList: string;
  travelItemName: string; travelQuantity: string; travelAddItemToPackingList: string;
  travelNoItemsInPackingList: string;
  travelPackingItemStatusPacked: string; travelPackingItemStatusUnpacked: string;
  travelRemindersSectionTitle: string; travelReminderName: string; travelReminderTypeFlight: string; travelReminderTypeTrain: string; travelReminderTypeBus: string; travelReminderTypeHotelCheckIn: string; travelReminderTypeActivityBooking: string; travelReminderTypeOtherTravelReminder: string; travelEventDateTime: string; travelLeadTimeNone: string; travelLeadTimeAtTime: string; travelLeadTimeMin15: string; travelLeadTimeMin30: string; travelLeadTimeHour1: string; travelLeadTimeHour3: string; travelLeadTimeDay1: string; travelLeadTimeDay2: string; travelAddReminder: string;
  travelNoReminders: string;
  travelSaveReminder: string;
  travelDeleteReminder: string;
  travelConfirmDeleteReminder: string;
  travelDismissReminder: string;
  travelBookings: string; travelBookingName: string; travelBookingTypeFlight: string; travelBookingTypeHotel: string; travelBookingTypeTrain: string; travelBookingTypeCarRental: string; travelBookingTypeActivity: string; travelBookingTypeOtherBooking: string; travelBookingConfNo: string; travelSaveBooking: string;
  travelNoBookings: string;
  travelBookingAddedSuccess: string;
  travelBookingDeletedSuccess: string;
  travelConfirmDeleteBooking: string;
  travelExpenses: string; travelExpenseName: string; travelExpenseCategoryAccommodation: string; travelExpenseCategoryTransportation: string; travelExpenseCategoryFood: string; travelExpenseCategoryActivities: string; travelExpenseCategoryShopping: string; travelExpenseCategoryMiscellaneous: string; travelExpenseAmount: string; travelAddExpense: string;
  travelNoExpenses: string;
  travelExpenseAddedSuccess: string;
  travelExpenseDeletedSuccess: string;
  travelConfirmDeleteExpense: string;
  aiShiftSchedulerTitle: string;
  aiShiftSchedulerSelectTeamLabel: string; aiShiftSchedulerSelectOccasionLabel: string; aiShiftSchedulerOccasionEidFitr: string; aiShiftSchedulerOccasionEidAdha: string; aiShiftSchedulerOccasionWedding: string; aiShiftSchedulerOccasionEmergency: string; aiShiftSchedulerOccasionRamadan: string; aiShiftSchedulerOccasionNewYear: string; aiShiftSchedulerOccasionShamNessim: string; aiShiftSchedulerOccasionLaborDay: string; aiShiftSchedulerOccasionRevolutionDay: string; aiShiftSchedulerOccasionArmedForcesDay: string; aiShiftSchedulerOccasionProphetBirthday: string; aiShiftSchedulerOccasionYearLabel: string;
  aiShiftSchedulerSuggestButton: string;
  aiShiftSchedulerLoadingSuggestion: string;
  aiShiftSchedulerSuggestionResultTitle: string;
  aiShiftSchedulerNoSuggestionYet: string;
  aiShiftSchedulerError: string;
  aiShiftSchedulerCurrentShiftsContext: string; aiShiftSchedulerExportPDF: string; aiShiftSchedulerShare: string; aiShiftSchedulerPrint: string; aiShiftSchedulerScreenshot: string;
  aiMaintenanceGuideTitle: string;
  aiMaintenanceEquipmentNameLabel: string; aiMaintenanceEquipmentNamePlaceholder: string; aiMaintenanceProblemDescriptionLabel: string; aiMaintenanceProblemDescriptionPlaceholder: string;
  aiMaintenanceGetStepsButton: string;
  aiMaintenanceLoadingSteps: string;
  aiMaintenanceStepsResultTitle: string;
  aiMaintenanceNoStepsYet: string;
  aiMaintenanceError: string;
  aiMaintenanceExportPDF: string; aiMaintenanceShare: string; aiMaintenancePrint: string; aiMaintenanceScreenshot: string;
  aiMaintenanceSearchHistoryTitle: string;
  aiMaintenanceClearHistoryButton: string;
  aiMaintenanceConfirmClearHistoryMessage: string;
  aiMaintenanceUseFromHistory: string;
  smartShiftEnhancerTitle: string;
  smartShiftEnhancerProblemLabel: string; smartShiftEnhancerProblemPlaceholder: string;
  smartShiftEnhancerGetAdviceButton: string;
  smartShiftEnhancerLoadingAdvice: string;
  smartShiftEnhancerSolutionsTitle: string;
  smartShiftEnhancerFahlawyAssessment: string;
  smartShiftEnhancerPros: string; smartShiftEnhancerCons: string;
  smartShiftEnhancerFahlawyFinalWord: string;
  smartShiftEnhancerNoAdviceYet: string;
  smartShiftEnhancerError: string;
  smartShiftEnhancerProblemTypeLabel: string; smartShiftEnhancerProblemTypeOverwork: string; smartShiftEnhancerProblemTypeAbsence: string; smartShiftEnhancerProblemTypeSpecialRequest: string; smartShiftEnhancerProblemTypeOther: string; smartShiftEnhancerExportPDF: string; smartShiftEnhancerShare: string; smartShiftEnhancerPrint: string; smartShiftEnhancerScreenshot: string;
  smartMaintenanceEnhancerTitle: string;
  smartMaintenanceEnhancerEquipmentNameLabel: string; smartMaintenanceEnhancerEquipmentNamePlaceholder: string; smartMaintenanceEnhancerProblemDescriptionLabel: string; smartMaintenanceEnhancerProblemDescriptionPlaceholder: string;
  smartMaintenanceEnhancerGetSolutionsButton: string;
  smartMaintenanceEnhancerLoadingSolutions: string;
  smartMaintenanceEnhancerSolutionsTitle: string;
  smartMaintenanceEnhancerFahlawyDiagnosis: string;
  smartMaintenanceEnhancerEstimatedTime: string; smartMaintenanceEnhancerRequiredTools: string; smartMaintenanceEnhancerSafetyPrecautions: string; smartMaintenanceEnhancerSteps: string;
  smartMaintenanceEnhancerFahlawyFinalAdvice: string;
  smartMaintenanceEnhancerNoSolutionsYet: string;
  smartMaintenanceEnhancerError: string;
  smartMaintenanceEnhancerExportPDF: string; smartMaintenanceEnhancerShare: string; smartMaintenanceEnhancerPrint: string; smartMaintenanceEnhancerScreenshot: string;
  exportSuccess: string;
  printSuccess: string;
  shareSuccess: string;
  screenshotSuccess: string;
  moreAction: string; deleteAction: string; confirmAction: string; N_A: string; previousMonth: string; nextMonth: string; yearlyCalendar: string; daysRemaining: string; workBlockEnds: string; daysUntilNextShift: string; nextShiftStarts: string;
  AIFeatures: string;
  petroTechToolsSectionTitle: string;

  activityLogTitle: string;
  activityLogNoEntries: string;
  activityLogEntryTaskAdded: string;
  activityLogEntryTaskCompleted: string;
  activityLogEntryTaskUncompleted: string;
  activityLogEntryTaskDeleted: string;
  activityLogEntryLeaveRequested: string;
  activityLogEntrySettingsChanged: string;
  activityLogEntryProfileUpdated: string;
  activityLogEntryLoggedIn: string;
  activityLogEntryLoggedOut: string;
  activityLogEntryCalculatorUsed: string;
  activityLogEntryNewServiceAccessed: string;
  activityLogEntryBiometricLoginAttempt: string;
  activityLogEntryPasswordResetRequested: string;
  activityLogEntryPetroGeniusQuery: string; // Added for PetroGenius
  activityLogEntryPetroWikiSearch: string;
  activityLogEntryProfilePictureChanged: string;
  activityLogEntryDailyReportSubmitted: string; 

  advancedCalculatorTitle: string;
  calculatorButton_0: string; calculatorButton_1: string; calculatorButton_2: string; calculatorButton_3: string; calculatorButton_4: string;
  calculatorButton_5: string; calculatorButton_6: string; calculatorButton_7: string; calculatorButton_8: string; calculatorButton_9: string;
  calculatorButton_decimal: string; calculatorButton_add: string; calculatorButton_subtract: string; calculatorButton_multiply: string;
  calculatorButton_divide: string; calculatorButton_equals: string; calculatorButton_clear: string; calculatorButton_allClear: string;
  calculatorButton_sqrt: string; calculatorButton_power: string;
  calculatorButton_square: string;
  calculatorButton_cube: string;
  calculatorButton_percent: string;
  calculatorButton_openParen: string; calculatorButton_closeParen: string;
  calculatorDisplayError: string;
  calculatorErrorDivisionByZero: string;
  calculatorErrorInvalidInput: string;
  calculatorErrorGeneric: string;
  expertisePointsEarnedToast: string;
  expertisePointsLostToast: string;
  calculatorExpertisePointsEarned: string;

  dailyTasksLinedPaperDate: string;
  dailyTasksLinedPaperDay: string;
  expertisePoints: string;
  profileExpertiseScoreLabel: string;

  expertUserDefaultName: string;

  settingName_appTheme: string;
  settingName_userRole: string;
  settingName_comedyLevel: string;
  settingName_salaryNotification: string;
  settingName_biometricLogin: string;

  appTheme_light: string;
  appTheme_dark: string;
  userRole_Engineer: string;
  userRole_Supervisor: string;
  userRole_Employee: string;
  userRole_ProductionOperator: string;
  userRole_UnitHead: string;
  userRole_ShiftSupervisor: string;
  comedyLevel_normal: string;
  comedyLevel_hilarious: string;
  salaryNotification_enabled: string;
  salaryNotification_disabled: string;
  biometricLoginEnableLabel: string;
  biometricLoginEnabledToast: string;
  biometricLoginDisabledToast: string;
  biometricLoginNotSupported: string;

  loginForgotPasswordPrompt: string;
  loginPasswordResetSent: string;
  loginWithBiometricsButton: string;
  loginBiometricSuccessToast: string;

  prayerTimesWidgetTitle: string;
  prayerTimeFajr: string;
  prayerTimeDhuhr: string;
  prayerTimeAsr: string;
  prayerTimeMaghrib: string;
  prayerTimeIsha: string;
  prayerTimeNextPrayer: string;
  prayerTimeTimeRemaining: string;
  prayerTimePrayerHasPassed: string;
  prayerTimeAllPrayersDone: string;
  prayerTimeUnableToLoad: string;
  prayerNotificationTitle: string;
  prayerNotificationBodySoon: string;
  prayerNotificationBodyMissed: string;
  prayerNotificationPermissionButton: string;
  prayerNotificationPermissionGranted: string;
  prayerNotificationPermissionDenied: string;

  shiftWillEndAfter: string;
  shiftWillStartAfter: string;
  days: string;
  onDate: string;
  daysWorkedThisMonth: string;
  daysLeaveThisMonth: string;

  shiftHandoverCountdown: string;
  daysUnit: string;
  hoursUnit: string;
  minutesUnit: string;
  secondsUnit: string;

  occasionEidAlFitr: string;
  occasionEidAlAdha: string;
  occasionRamadan: string;
  occasionNewYear: string;
  occasionChristmas: string;
  occasionLaborDay: string;
  occasionShamElNessim: string;
  occasionOctoberVictory: string;
  occasionRevolutionDayJuly: string;
  occasionSinaiLiberation: string;
  occasionProphetBirthday: string;

  viewName_equipmentLogbook: string;
  description_equipmentLogbook: string;
  equipmentLogbookTitle: string;
  equipmentLogbookAddEntry: string;
  equipmentLogbookEquipmentName: string;
  equipmentLogbookLogDetails: string;
  equipmentLogbookNoEntries: string;
  equipmentLogbookLoggedBy: string;
  equipmentLogbookCategory: string;
  equipmentLogbookStatus: string;
  equipmentLogbookPriority: string;
  equipmentLogbookCategoryOptions: { routine: string; issue: string; maintenance: string; upgrade: string; };
  equipmentLogbookStatusOptions: { open: string; inProgress: string; resolved: string; pendingParts: string; };
  equipmentLogbookPriorityOptions: { low: string; medium: string; high: string; critical: string; };

  viewName_permitToWork: string;
  description_permitToWork: string;
  permitToWorkTitle: string;
  permitToWorkRequestPermit: string;
  permitToWorkType: string;
  permitToWorkLocation: string;
  permitToWorkDescription: string;
  permitToWorkNoPermits: string;
  permitToWorkStatus: string;
  permitToWorkRequestedBy: string;
  permitToWorkApprovalDate: string;
  permitToWorkExpiryDate: string;
  permitToWorkInvolvedPersonnel: string;
  permitToWorkSafetyPrecautions: string;
  permitStatusOptions: { Requested: string; Approved: string; Active: string; Closed: string; Rejected: string; Expired: string; };
  permitTypeOptions: { hotWork: string; coldWork: string; confinedSpace: string; electrical: string; excavation: string; };

  viewName_safetyObservation: string;
  description_safetyObservation: string;
  safetyObservationTitle: string;
  safetyObservationReport: string;
  safetyObservationObservation: string;
  safetyObservationCategory: string;
  safetyObservationNoObservations: string;
  safetyObservationReportedBy: string;
  safetyObservationRecommendedAction: string;
  safetyObservationSeverity: string;
  safetyObservationFollowUpStatus: string;
  safetyObservationCategoryOptions: { UnsafeAct: string; UnsafeCondition: string; NearMiss: string; PositiveObservation: string; Environmental: string; };
  safetyObservationSeverityOptions: { Low: string; Medium: string; High: string; Critical: string; };
  safetyObservationFollowUpOptions: { Open: string; InProgress: string; Closed: string; RequiresReview: string; };

  viewName_shiftHandoverNotes: string;
  description_shiftHandoverNotes: string;
  shiftHandoverNotesTitle: string;
  shiftHandoverNotesOutgoing: string;
  shiftHandoverNotesIncoming: string;
  shiftHandoverNotesChecklist: string;
  shiftHandoverNotesAddNote: string;
  shiftHandoverNotesFromTeam: string;
  shiftHandoverNotesToTeam: string;
  shiftHandoverNotesNoteContent: string;
  shiftHandoverNotesCategory: string;
  shiftHandoverNotesAcknowledgedBy: string;
  shiftHandoverNotesFollowUpRequired: string;
  shiftHandoverCategoryOptions: { OutgoingGeneral: string; IncomingGeneral: string; EquipmentStatus: string; SafetyChecklist: string; UrgentAction: string; };

  viewName_knowledgeBase: string;
  description_knowledgeBase: string;
  knowledgeBaseTitle: string;
  knowledgeBaseAddTip: string;
  knowledgeBaseTipTitle: string;
  knowledgeBaseTipContent: string;
  knowledgeBaseNoTips: string;
  knowledgeBaseCategory: string;
  knowledgeBaseTags: string;
  knowledgeBaseSubmittedBy: string;
  knowledgeBaseUpvote: string;
  knowledgeBaseSearchPlaceholder: string;
  knowledgeCategoryOptions: { Troubleshooting: string; Efficiency: string; SafetyHack: string; GeneralInfo: string; EquipmentSpecific: string; };

  viewName_unitConverter: string;
  description_unitConverter: string;
  unitConverterTitle: string;
  unitConverterFromUnit: string;
  unitConverterToUnit: string;
  unitConverterValue: string;
  unitConverterResult: string;
  unitConverterCategory: string;
  unitConverterSwapUnits: string;
  unitConverterConversionHistory: string;
  unitConverterNoHistory: string;
  unitConverterClearHistory: string;
  unitCategoryOptions: { Pressure: string; Temperature: string; Volume: string; Mass: string; FlowRate: string; Density: string; };

  viewName_emergencyContactsProcedures: string;
  description_emergencyContactsProcedures: string;
  emergencyContactsProceduresTitle: string;
  emergencyContactsProceduresAddContact: string;
  emergencyContactsProceduresContactName: string;
  emergencyContactsProceduresContactNumber: string;
  emergencyContactsProceduresDepartment: string;
  emergencyContactsProceduresNoContacts: string;
  emergencyContactsProceduresType: string;
  emergencyContactsProceduresNotes: string;
  emergencyContactsProceduresAddProcedure: string;
  emergencyContactsProceduresProcedureTitle: string;
  emergencyContactsProceduresProcedureSteps: string;
  emergencyContactsProceduresNoProcedures: string;
  emergencyContactTypeOptions: { Internal: string; External: string; SiteEmergency: string; Medical: string; Security: string; };

  viewName_internalAnnouncements: string;
  description_internalAnnouncements: string;
  internalAnnouncementsTitle: string;
  internalAnnouncementsAdd: string;
  internalAnnouncementsAnnouncementTitle: string;
  internalAnnouncementsContent: string;
  internalAnnouncementsNoAnnouncements: string;
  internalAnnouncementsPostedBy: string;
  internalAnnouncementsExpiryDate: string;
  internalAnnouncementsDepartmentScope: string;
  internalAnnouncementsIsUrgent: string;
  internalAnnouncementsFilterScope: string;
  internalAnnouncementsAllDepartments: string;

  viewName_toolboxTalks: string;
  description_toolboxTalks: string;
  toolboxTalksTitle: string;
  toolboxTalksAddTalk: string;
  toolboxTalksTopic: string;
  toolboxTalksPresenter: string;
  toolboxTalksAttendees: string;
  toolboxTalksNoTalks: string;
  toolboxTalksDate: string;
  toolboxTalksDurationMinutes: string;
  toolboxTalksLocation: string;
  toolboxTalksNotes: string;
  toolboxTalksSearchPlaceholder: string;

  viewName_chemicalReference: string;
  description_chemicalReference: string;
  chemicalReferenceTitle: string;
  chemicalReferenceAddChemical: string;
  chemicalReferenceChemicalName: string;
  chemicalReferenceCASNumber: string;
  chemicalReferenceHazards: string;
  chemicalReferenceFirstAid: string;
  chemicalReferencePPE: string;
  chemicalReferenceNoChemicals: string;
  chemicalReferenceSDSUrl: string;
  chemicalReferenceStorageInfo: string;
  chemicalReferenceDisposalInfo: string;
  chemicalReferenceSearchPlaceholder: string;

  dashboardUpcomingShiftNotification: string;
  dashboardMarineWeatherTitle: string;
  dashboardWeatherConditionClear: string;
  dashboardTaskMastersTitle: string;
  taskActionRateStar: string;
  taskActionRateTired: string;
  taskActionRateNeedsHelp: string;
  taskRatedStarToast: string;
  taskRatedTiredToast: string;
  taskRatedNeedsHelpToast: string;
  funWheelOfFortuneTitle: string;
  funSpinTheWheelButton: string;
  funWheelSpinResultToast: string;
  funImBoredButton: string;
  funImBoredSuggestionToast: string;
  chatSendMemeButton: string;
  chatSendMemeToast: string;
  shipLogNewCargoButton: string;
  shipLogNewCargoToast: string;

  // PetroGenius Translations
  petroGeniusTitle: string;
  petroGeniusDescription: string;
  petroGeniusAskButton: string;
  petroGeniusQuestionPlaceholder: string;
  petroGeniusVoiceInputButton: string;
  petroGeniusModeToggleTechnician: string;
  petroGeniusModeToggleEngineer: string;
  petroGeniusSaveExplanationButton: string;
  petroGeniusImagePlaceholderAlt: string;
  petroGeniusSafetyWarningsTitle: string;
  petroGeniusLoadingResponse: string;
  petroGeniusErrorResponse: string;
  petroGeniusSampleResponseIntro: string;
  petroGeniusSampleResponseStep1: string;
  petroGeniusSampleResponseStep2: string;
  petroGeniusSampleResponseSafety: string;

  petroWikiTitle: string;
  petroWikiDescription: string;
  petroWikiSearchButton: string;
  petroWikiSearchPlaceholder: string;
  petroWikiCategoryFilterLabel: string;
  petroWikiCategoryAll: string;
  petroWikiTableAcronym: string;
  petroWikiTableArabicName: string;
  petroWikiTableEnglishName: string;
  petroWikiTableDiagram: string;
  petroWikiTableComedicDesc: string;
  petroWikiNoResults: string;
  petroWikiDetailedCardTitle: string;
  petroWikiSaveTermButton: string;
  petroWikiAskGeniusButton: string;
  petroWikiTermPSVAcronym: string;
  petroWikiTermPSVArabicName: string;
  petroWikiTermPSVEnglishName: string;
  petroWikiTermPSVComedicDesc: string;
  petroWikiTermPSVDetailedDesc: string;
  petroWikiTermPIDAcronym: string;
  petroWikiTermPIDArabicName: string;
  petroWikiTermPIDEnglishName: string;
  petroWikiTermPIDComedicDesc: string;
  petroWikiTermPIDDetailedDesc: string;
  petroWikiTermESDAcronym: string;
  petroWikiTermESDArabicName: string;
  petroWikiTermESDEnglishName: string;
  petroWikiTermESDComedicDesc: string;
  petroWikiTermESDDetailedDesc: string;

  // Admin Dashboard Specific Translations
  adminDashboardOverview: string;
  adminDashboardTotalUsers: string;
  adminDashboardUsersByRole: string;
  adminDashboardActiveShifts: string;
  adminDashboardContentStats: string;
  adminDashboardKnowledgeTips: string;
  adminDashboardInternalAnnouncements: string;
  adminDashboardEquipmentLogs: string;
  adminDashboardOpenPermits: string;
  adminDashboardSafetyObservations: string;
  adminDashboardUserManagement: string;
  adminDashboardUserName: string;
  adminDashboardUserEmail: string;
  adminDashboardUserRole: string;
  adminDashboardUserTeam: string;
  adminDashboardUserActions: string;
  adminDashboardViewDetails: string;
  adminDashboardEditRole: string;
  adminDashboardQuickActions: string;
  adminDashboardViewFullActivityLog: string;
  adminDashboardBroadcastAnnouncement: string;
  adminDashboardSystemHealthCheck: string;
  adminDashboardManageAppSettings: string;
  adminDashboardRecentActivity: string;
  adminDashboardNoActivity: string;
  adminDashboardSystemHealthOK: string;
  adminDashboardModalUserDetailsTitle: string;
  adminDashboardModalEditRoleTitle: string;
  adminDashboardModalCurrentRole: string;
  adminDashboardModalNewRole: string;
  adminDashboardModalSaveChanges: string;
  adminDashboardModalClose: string;
  adminDashboardRoleUpdatedSuccess: string;
  adminDashboardUserPhone: string;
  adminDashboardUserLastLogin: string;
  adminDashboardUserExpertisePoints: string;
  adminDashboardImportantFollowUps: string;
  adminDashboardPendingLeaveRequests: string;
  adminDashboardPermitsAwaitingApproval: string;
  adminDashboardOpenSafetyObservations: string;
  adminDashboardViewButton: string;
  adminDashboardFirebaseSetup: string;
  adminDashboardFirebaseInfo: string;
  adminFirebaseLinkButton: string;
  panicButtonActivatedToast: string;

  // Daily Reports
  viewName_dailyReports: string;
  description_dailyReports: string;
  dailyReportsTitle: string;
  dailyReportsAddReport: string;
  dailyReportsShiftLabel: string;
  dailyReportsReportTitleLabel: string;
  dailyReportsReportContentLabel: string;
  dailyReportsNoReports: string;
  dailyReportSubmittedToast: string;
  dailyReportSelectShiftPlaceholder: string;
}
>>>>>>> bee2d85 (updated)
