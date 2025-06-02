
import React, { useState, FormEvent, useContext } from 'react';
import { useLanguageContext } from '../../hooks/useLanguage';
import { LoggedInUser, TranslationSet, PersonalTripPlan, PackingList, PackingListItem, TravelReminder, TravelReminderType, TravelReminderLeadTime, TravelBooking, BookingType, TravelExpense, TravelExpenseCategory } from '../../types';
import { ThemeContext } from '../../contexts/ThemeContext'; 
import { ToastContext } from '../../contexts/ToastContext';
import { SubSectionCard } from './common/HubComponents';
import { TrashIcon, PencilIcon, PlusCircleIcon, PaperAirplaneIcon, ListBulletIcon, BellAlertIcon, TicketIcon, CurrencyDollarIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface TravelTripsSectionProps {
  loggedInUser: LoggedInUser | null;
  showConfirmDelete: (titleKey: keyof TranslationSet, messageKey: keyof TranslationSet, onConfirmAction: () => void) => void;
}

export const TravelTripsSection: React.FC<TravelTripsSectionProps> = ({ loggedInUser, showConfirmDelete }) => {
  const { t, language } = useLanguageContext();
  const { theme } = useContext(ThemeContext);
  const { addToast } = useContext(ToastContext);

  const [openSubSections, setOpenSubSections] = useState<Record<string, boolean>>({
    myTrips: true, packingLists: false, travelRemindersSubSection: false, travelBookingsSubSection: false, travelExpensesSubSection: false,
  });
  const toggleSubSection = (key: string) => setOpenSubSections(prev => ({ ...prev, [key]: !prev[key] }));
  
  const getCurrentDate = () => new Date().toISOString().split('T')[0];
  const getCurrentDateTimeLocal = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    return (new Date(now.getTime() - offset)).toISOString().slice(0, 16);
  };


  const [tripPlans, setTripPlans] = useState<PersonalTripPlan[]>([]);
  const [tripName, setTripName] = useState('');
  const [tripDestination, setTripDestination] = useState('');
  const [tripStartDate, setTripStartDate] = useState(getCurrentDate());
  const [tripEndDate, setTripEndDate] = useState(getCurrentDate());

  const [packingLists, setPackingLists] = useState<PackingList[]>([]);
  const [packingListName, setPackingListName] = useState('');
  const [selectedPackingListId, setSelectedPackingListId] = useState<string|null>(null);
  const [newPackingItemName, setNewPackingItemName] = useState('');
  const [newPackingItemQuantity, setNewPackingItemQuantity] = useState('1');


  const [travelReminders, setTravelReminders] = useState<TravelReminder[]>([]);
  const [reminderName, setReminderName] = useState('');
  const [reminderType, setReminderType] = useState<TravelReminderType>(TravelReminderType.FlightTravel);
  const [reminderDateTime, setReminderDateTime] = useState(getCurrentDateTimeLocal());
  const [reminderLeadTime, setReminderLeadTime] = useState<TravelReminderLeadTime>(TravelReminderLeadTime.Hour1Lead);
  const travelReminderTypeOptions = Object.values(TravelReminderType);
  const travelReminderLeadTimeOptions = Object.values(TravelReminderLeadTime);

  // Travel Bookings State
  const [bookings, setBookings] = useState<TravelBooking[]>([]);
  const [bookingName, setBookingName] = useState('');
  const [bookingType, setBookingType] = useState<BookingType>(BookingType.FlightBooking);
  const [bookingConfNo, setBookingConfNo] = useState('');
  const [bookingStartDate, setBookingStartDate] = useState(getCurrentDate());
  const bookingTypeOptions = Object.values(BookingType);

  // Travel Expenses State
  const [travelExpenses, setTravelExpenses] = useState<TravelExpense[]>([]);
  const [expenseName, setExpenseName] = useState('');
  const [expenseCategory, setExpenseCategory] = useState<TravelExpenseCategory>(TravelExpenseCategory.FoodTravel);
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState(getCurrentDate());
  const travelExpenseCategoryOptions = Object.values(TravelExpenseCategory);
  
  const inputBaseClasses = `w-full p-2.5 border rounded-lg shadow-sm focus:ring-2 text-sm transition-colors`;
  const themedInputClasses = theme === 'dark' ? `bg-gray-700 border-gray-600 text-gray-100 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400` : `bg-white border-gray-300 text-gray-800 focus:ring-blue-600 focus:border-blue-600 placeholder-gray-400`;
  const primaryButtonClasses = `py-2.5 px-5 rounded-lg font-semibold text-sm transition-colors shadow-md hover:shadow-lg transform hover:scale-[1.02] ${theme === 'dark' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`;
  const deleteButtonClasses = `p-1.5 rounded-md text-red-500 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-700/30 transition-colors`;


  if (!loggedInUser) return null;

  return (
    <>
      <SubSectionCard titleKey="travelMyTrips" icon={<PaperAirplaneIcon/>} isOpen={openSubSections.myTrips} onToggle={() => toggleSubSection('myTrips')}>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">{t('featureUnderConstruction')}</p>
      </SubSectionCard>

      <SubSectionCard titleKey="travelPackingLists" icon={<ListBulletIcon/>} isOpen={openSubSections.packingLists} onToggle={() => toggleSubSection('packingLists')}>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">{t('featureUnderConstruction')}</p>
      </SubSectionCard>
      
      <SubSectionCard titleKey="travelRemindersSectionTitle" icon={<BellAlertIcon/>} isOpen={openSubSections.travelRemindersSubSection} onToggle={() => toggleSubSection('travelRemindersSubSection')}>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">{t('featureUnderConstruction')}</p>
      </SubSectionCard>

      <SubSectionCard titleKey="travelBookings" icon={<TicketIcon/>} isOpen={openSubSections.travelBookingsSubSection} onToggle={() => toggleSubSection('travelBookingsSubSection')}>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">{t('featureUnderConstruction')}</p>
      </SubSectionCard>

      <SubSectionCard titleKey="travelExpenses" icon={<CurrencyDollarIcon/>} isOpen={openSubSections.travelExpensesSubSection} onToggle={() => toggleSubSection('travelExpensesSubSection')}>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">{t('featureUnderConstruction')}</p>
      </SubSectionCard>
    </>
  );
};
export default TravelTripsSection;
