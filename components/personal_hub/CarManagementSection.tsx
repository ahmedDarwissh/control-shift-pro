
import React, { useState, FormEvent, useContext } from 'react';
import { useLanguageContext } from '../../hooks/useLanguage';
import { LoggedInUser, TranslationSet, CarMaintenanceReminder, CarMaintenanceType, CarFuelLog, CarExpense, CarExpenseCategory, CarDocumentReminder, CarDocumentType, CarRepairLog, CarMileageLog, CarParkingLog } from '../../types';
import { ThemeContext } from '../../contexts/ThemeContext'; 
import { ToastContext } from '../../contexts/ToastContext';
import { SubSectionCard } from './common/HubComponents';
import { TrashIcon, PencilIcon, PlusCircleIcon, TruckIcon, Cog6ToothIcon, MapPinIcon, DocumentTextIcon, AdjustmentsHorizontalIcon, BanknotesIcon, WrenchScrewdriverIcon, MapIcon, CheckCircleIcon, ArrowPathIcon as RenewIcon, BeakerIcon, CurrencyDollarIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/outline';

interface CarManagementSectionProps {
  loggedInUser: LoggedInUser | null;
  showConfirmDelete: (titleKey: keyof TranslationSet, messageKey: keyof TranslationSet, onConfirmAction: () => void) => void;
}

export const CarManagementSection: React.FC<CarManagementSectionProps> = ({ loggedInUser, showConfirmDelete }) => {
  const { t, language } = useLanguageContext();
  const { theme } = useContext(ThemeContext);
  const { addToast } = useContext(ToastContext);
  
  const [openSubSections, setOpenSubSections] = useState<Record<string, boolean>>({
    maintenanceReminders: true, fuelLog: false, carExpenses: false, documentRenewals: false, repairLog: false, mileageLog: false, parkingLog: false,
  });
  const toggleSubSection = (key: string) => setOpenSubSections(prev => ({ ...prev, [key]: !prev[key] }));

  const getCurrentDate = () => new Date().toISOString().split('T')[0];
  const defaultVehicleName = () => t('carMyCarDefault');

  const [maintenanceReminders, setMaintenanceReminders] = useState<CarMaintenanceReminder[]>([]);
  const [maintVehicleName, setMaintVehicleName] = useState(defaultVehicleName());
  const [maintType, setMaintType] = useState<CarMaintenanceType>(CarMaintenanceType.OilChangeCar);
  const [maintNextDate, setMaintNextDate] = useState(getCurrentDate());
  const maintTypeOptions = Object.values(CarMaintenanceType);

  const [documentReminders, setDocumentReminders] = useState<CarDocumentReminder[]>([]);
  const [docVehicleName, setDocVehicleName] = useState(defaultVehicleName());
  const [docType, setDocType] = useState<CarDocumentType>(CarDocumentType.LicenseDoc);
  const [docExpiryDate, setDocExpiryDate] = useState(getCurrentDate());
  const docTypeOptions = Object.values(CarDocumentType);
  const [editingRenewalId, setEditingRenewalId] = useState<string | null>(null);
  const [newExpiryDateForRenewal, setNewExpiryDateForRenewal] = useState('');

  const [fuelLogs, setFuelLogs] = useState<CarFuelLog[]>([]);
  const [fuelVehicleName, setFuelVehicleName] = useState(defaultVehicleName());
  const [fuelDate, setFuelDate] = useState(getCurrentDate());
  const [fuelOdometer, setFuelOdometer] = useState('');
  const [fuelLiters, setFuelLiters] = useState('');
  const [fuelPricePerLiter, setFuelPricePerLiter] = useState('');

  const [carExpenses, setCarExpenses] = useState<CarExpense[]>([]);
  const [expenseVehicleName, setExpenseVehicleName] = useState(defaultVehicleName());
  const [expenseDate, setExpenseDate] = useState(getCurrentDate());
  const [expenseDescription, setExpenseDescription] = useState('');
  const [expenseCategory, setExpenseCategory] = useState<CarExpenseCategory>(CarExpenseCategory.FuelExpense);
  const [expenseAmount, setExpenseAmount] = useState('');
  const carExpenseCategoryOptions = Object.values(CarExpenseCategory);

  // Car Repair Log State
  const [repairLogs, setRepairLogs] = useState<CarRepairLog[]>([]);
  const [repairVehicleName, setRepairVehicleName] = useState(defaultVehicleName());
  const [repairDate, setRepairDate] = useState(getCurrentDate());
  const [repairDescription, setRepairDescription] = useState('');
  const [repairCost, setRepairCost] = useState('');

  // Mileage Log State
  const [mileageLogs, setMileageLogs] = useState<CarMileageLog[]>([]);
  const [mileageVehicleName, setMileageVehicleName] = useState(defaultVehicleName());
  const [mileageDate, setMileageDate] = useState(getCurrentDate());
  const [mileageStartOdo, setMileageStartOdo] = useState('');
  const [mileageEndOdo, setMileageEndOdo] = useState('');
  const [mileagePurpose, setMileagePurpose] = useState('');

  // Parking Log State
  const [parkingLogs, setParkingLogs] = useState<CarParkingLog[]>([]);
  const [parkingVehicleName, setParkingVehicleName] = useState(defaultVehicleName());
  const [parkingLocation, setParkingLocation] = useState('');
  
  const inputBaseClasses = `w-full p-2.5 border rounded-lg shadow-sm focus:ring-2 text-sm transition-colors`;
  const themedInputClasses = theme === 'dark' ? `bg-gray-700 border-gray-600 text-gray-100 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400` : `bg-white border-gray-300 text-gray-800 focus:ring-blue-600 focus:border-blue-600 placeholder-gray-400`;
  const primaryButtonClasses = `py-2.5 px-5 rounded-lg font-semibold text-sm transition-colors shadow-md hover:shadow-lg transform hover:scale-[1.02] ${theme === 'dark' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`;
  const deleteButtonClasses = `p-1.5 rounded-md text-red-500 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-700/30 transition-colors`;
  const secondaryButtonClasses = `py-1.5 px-3 rounded-md text-xs font-medium transition-colors ${theme === 'dark' ? 'bg-gray-600 text-gray-200 hover:bg-gray-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`;

  const carAddMaintenanceReminder = (e: FormEvent) => {
    e.preventDefault();
    if (!loggedInUser) return;
    const newReminder: CarMaintenanceReminder = { id: `maint-${Date.now()}`, userId: loggedInUser.id, vehicleName: maintVehicleName, type: maintType, nextServiceDate: maintNextDate, isCompleted: false, createdAt: new Date() };
    setMaintenanceReminders(p => [newReminder, ...p]);
    addToast(t('carAddMaintenanceReminder') + ' ' + t('statusSuccessMessage' as keyof TranslationSet, 'Success!'), 'success');
    setMaintNextDate(getCurrentDate()); setMaintVehicleName(defaultVehicleName());
  };
  const handleDeleteMaintReminder = (id: string) => {
    showConfirmDelete('carConfirmDeleteReminder', 'carConfirmDeleteReminder', () => {
      setMaintenanceReminders(p => p.filter(item => item.id !== id));
      addToast(t('carDeleteReminder') + ' ' + t('statusSuccessMessage' as keyof TranslationSet, 'Success!'), 'info');
    });
  };
  const toggleMaintReminderCompleted = (id: string) => {
    setMaintenanceReminders(p => p.map(item => item.id === id ? {...item, isCompleted: !item.isCompleted } : item));
    addToast(t('carMarkAsDone') + ' ' + t('statusSuccessMessage' as keyof TranslationSet, 'Success!'), 'success');
  };

  const handleAddDocumentReminder = (e: FormEvent) => {
    e.preventDefault();
    if (!docExpiryDate.trim() || !loggedInUser) return;
    const newDocReminder: CarDocumentReminder = { id: `doc-${Date.now()}`, userId: loggedInUser.id, vehicleName: docVehicleName, documentType: docType, expiryDate: docExpiryDate, reminderDaysBefore: 30, isRenewed: false, createdAt: new Date() };
    setDocumentReminders(p => [newDocReminder, ...p]);
    addToast(t('carAddDocumentReminder') + ' ' + t('statusSuccessMessage' as keyof TranslationSet, 'Success!'), 'success');
    setDocVehicleName(defaultVehicleName()); setDocExpiryDate(getCurrentDate());
  };
  const handleDeleteDocumentReminder = (id: string) => {
    showConfirmDelete('carConfirmDeleteReminder', 'carConfirmDeleteReminder', () => {
        setDocumentReminders(p => p.filter(doc => doc.id !== id));
        addToast(t('carDeleteReminder') + ' ' + t('statusSuccessMessage' as keyof TranslationSet, 'Success!'), 'info');
    });
  };
  const handleOpenRenewalEditor = (doc: CarDocumentReminder) => {
    setEditingRenewalId(doc.id);
    setNewExpiryDateForRenewal(doc.expiryDate);
  };
  const handleConfirmRenewalUpdate = (id: string) => {
    if (!newExpiryDateForRenewal.trim()) {
        addToast(t('carNewExpiryDate') + ' ' + (language === 'ar' ? 'مطلوب!' : 'is required!'), 'alert');
        return;
    }
    setDocumentReminders(prev => prev.map(doc => doc.id === id ? { ...doc, expiryDate: newExpiryDateForRenewal, isRenewed: true } : doc ));
    addToast(t('carUpdateDocumentReminder') + ' ' + t('statusSuccessMessage' as keyof TranslationSet, 'Success!'), 'success');
    setEditingRenewalId(null); setNewExpiryDateForRenewal('');
  };
  const getDocumentStatus = (expiryDateStr: string): { textKey: keyof TranslationSet, colorClass: string } => {
    const expiry = new Date(expiryDateStr + 'T00:00:00');
    const today = new Date(); today.setHours(0,0,0,0);
    const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return { textKey: 'carStatusExpired', colorClass: theme === 'dark' ? 'text-red-400' : 'text-red-600' };
    if (diffDays <= 30) return { textKey: 'carStatusExpiringSoon', colorClass: theme === 'dark' ? 'text-yellow-400' : 'text-yellow-500' };
    return { textKey: 'carStatusValid', colorClass: theme === 'dark' ? 'text-green-400' : 'text-green-500' };
  };

  const handleAddFuelLog = (e: FormEvent) => {
    e.preventDefault();
    if (!fuelOdometer.trim() || !fuelLiters.trim() || !fuelPricePerLiter.trim() || !loggedInUser) return;
    const newLog: CarFuelLog = { id: `fuel-${Date.now()}`, userId: loggedInUser.id, vehicleName: fuelVehicleName, date: fuelDate, odometerReading: parseFloat(fuelOdometer), litersFilled: parseFloat(fuelLiters), pricePerLiter: parseFloat(fuelPricePerLiter), createdAt: new Date() };
    setFuelLogs(p => [newLog, ...p]);
    addToast(t('carSaveFuelLog') + ' ' + t('statusSuccessMessage' as keyof TranslationSet, 'Success!'), 'success');
    setFuelVehicleName(defaultVehicleName()); setFuelOdometer(''); setFuelLiters(''); setFuelPricePerLiter(''); setFuelDate(getCurrentDate());
  };
  const handleDeleteFuelLog = (id: string) => {
    showConfirmDelete('carConfirmDeleteFuelLog', 'carConfirmDeleteFuelLog', () => {
      setFuelLogs(p => p.filter(log => log.id !== id));
      addToast(t('carDeleteFuelLog') + ' ' + t('statusSuccessMessage' as keyof TranslationSet, 'Success!'), 'info');
    });
  };

  const handleAddCarExpense = (e: FormEvent) => {
    e.preventDefault();
    if (!expenseDescription.trim() || !expenseAmount.trim() || !loggedInUser) return;
    const newExpense: CarExpense = { id: `carexp-${Date.now()}`, userId: loggedInUser.id, vehicleName: expenseVehicleName, date: expenseDate, description: expenseDescription, category: expenseCategory, amount: parseFloat(expenseAmount), createdAt: new Date() };
    setCarExpenses(p => [newExpense, ...p]);
    addToast(t('carSaveCarExpense') + ' ' + t('statusSuccessMessage' as keyof TranslationSet, 'Success!'), 'success');
    setExpenseVehicleName(defaultVehicleName()); setExpenseDescription(''); setExpenseAmount(''); setExpenseDate(getCurrentDate());
  };
  const handleDeleteCarExpense = (id: string) => {
    showConfirmDelete('carConfirmDeleteCarExpense', 'carConfirmDeleteCarExpense', () => {
      setCarExpenses(p => p.filter(exp => exp.id !== id));
      addToast(t('carDeleteCarExpense') + ' ' + t('statusSuccessMessage' as keyof TranslationSet, 'Success!'), 'info');
    });
  };

  const handleAddRepairLog = (e: FormEvent) => {
    e.preventDefault();
    if(!repairDescription.trim() || !loggedInUser) return;
    const newLog: CarRepairLog = {id: `repair-${Date.now()}`, userId: loggedInUser.id, vehicleName: repairVehicleName, dateOfRepair: repairDate, description: repairDescription, cost: repairCost ? parseFloat(repairCost) : undefined, createdAt: new Date()};
    setRepairLogs(p => [newLog, ...p]);
    addToast(t('carRepairLogAddedSuccess'), 'success');
    setRepairVehicleName(defaultVehicleName()); setRepairDescription(''); setRepairCost(''); setRepairDate(getCurrentDate());
  };
  const handleDeleteRepairLog = (id: string) => {
    showConfirmDelete('carConfirmDeleteRepairLog', 'carConfirmDeleteRepairLog', () => {
        setRepairLogs(p => p.filter(log => log.id !== id));
        addToast(t('carDeleteRepairLog') + ' ' + t('statusSuccessMessage' as keyof TranslationSet, 'Success!'), 'info');
    });
  };

  const handleAddMileageLog = (e: FormEvent) => {
    e.preventDefault();
    if(!mileageEndOdo.trim() || !loggedInUser) return;
    const newLog: CarMileageLog = {id: `mileage-${Date.now()}`, userId: loggedInUser.id, vehicleName: mileageVehicleName, date: mileageDate, startOdometer: mileageStartOdo ? parseFloat(mileageStartOdo) : undefined, endOdometer: parseFloat(mileageEndOdo), purposeOfTrip: mileagePurpose, createdAt: new Date()};
    setMileageLogs(p => [newLog, ...p]);
    addToast(t('carMileageLogAddedSuccess'), 'success');
    setMileageVehicleName(defaultVehicleName()); setMileageStartOdo(''); setMileageEndOdo(''); setMileagePurpose(''); setMileageDate(getCurrentDate());
  };
  const handleDeleteMileageLog = (id: string) => {
     showConfirmDelete('carConfirmDeleteMileageLog', 'carConfirmDeleteMileageLog', () => {
        setMileageLogs(p => p.filter(log => log.id !== id));
        addToast(t('carDeleteMileageLog') + ' ' + t('statusSuccessMessage' as keyof TranslationSet, 'Success!'), 'info');
    });
  };

  const handleAddParkingLog = (e: FormEvent) => {
    e.preventDefault();
    if(!parkingLocation.trim() || !loggedInUser) return;
    // Clear previous active spots
    const updatedParkingLogs = parkingLogs.map(p => ({...p, isCurrent: false}));
    const newLog: CarParkingLog = {id: `park-${Date.now()}`, userId: loggedInUser.id, vehicleName: parkingVehicleName, locationDescription: parkingLocation, timestamp: new Date(), isCurrent: true, createdAt: new Date()};
    setParkingLogs([...updatedParkingLogs, newLog]);
    addToast(t('carSaveParkingSpot') + ' ' + t('statusSuccessMessage' as keyof TranslationSet, 'Success!'), 'success');
    setParkingVehicleName(defaultVehicleName()); setParkingLocation('');
  };
  const handleDeleteParkingLog = (id: string) => {
    showConfirmDelete('carConfirmDeleteParkingLog', 'carConfirmDeleteParkingLog', () => {
        setParkingLogs(p => p.filter(log => log.id !== id));
        addToast(t('carDeleteParkingLog') + ' ' + t('statusSuccessMessage' as keyof TranslationSet, 'Success!'), 'info');
    });
  };
  const clearActiveParkingSpot = () => {
    setParkingLogs(prev => prev.map(p => p.isCurrent ? {...p, isCurrent: false} : p));
    addToast(t('carClearActiveSpot') + ' ' + t('statusSuccessMessage' as keyof TranslationSet, 'Success!'), 'info');
  };
  const currentActiveSpot = parkingLogs.find(p => p.isCurrent);


  if (!loggedInUser) return null;

  return (
    <>
      {/* Maintenance Reminders */}
      <SubSectionCard titleKey="carMaintenanceReminders" icon={<Cog6ToothIcon/>} isOpen={openSubSections.maintenanceReminders} onToggle={() => toggleSubSection('maintenanceReminders')}>
        <form onSubmit={carAddMaintenanceReminder} className="space-y-3 mb-4 p-3 border rounded-md dark:border-gray-600 bg-slate-50 dark:bg-gray-700/50">
            <input type="text" value={maintVehicleName} onChange={e => setMaintVehicleName(e.target.value)} placeholder={t('carVehicleName')} className={`${inputBaseClasses} ${themedInputClasses}`} />
            <select value={maintType} onChange={e => setMaintType(e.target.value as CarMaintenanceType)} className={`${inputBaseClasses} ${themedInputClasses}`}>
                {maintTypeOptions.map(type => <option key={type} value={type}>{t(`carMaintenanceType${type}` as keyof TranslationSet, type)}</option>)}
            </select>
            <input type="date" value={maintNextDate} onChange={e => setMaintNextDate(e.target.value)} className={`${inputBaseClasses} ${themedInputClasses}`} required title={t('carNextServiceDate')} />
            <button type="submit" className={`${primaryButtonClasses} w-full`}>{t('carAddMaintenanceReminder')}</button>
        </form>
        {maintenanceReminders.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">{t('carNoMaintenanceReminders')}</p>}
        <ul className="space-y-1 max-h-60 overflow-y-auto">
            {maintenanceReminders.map(item => (
                <li key={item.id} className={`flex justify-between items-center p-2 text-xs rounded shadow-sm ${item.isCompleted ? 'bg-green-100 dark:bg-green-800/50' : 'bg-white dark:bg-gray-700'}`}>
                    <div>
                      <span className={item.isCompleted ? 'line-through text-gray-500 dark:text-gray-400' : ''}>{item.vehicleName} - {t(`carMaintenanceType${item.type}` as keyof TranslationSet, item.type)}</span>
                      <span className="block text-gray-500 dark:text-gray-400 text-[10px]">Due: {new Date(item.nextServiceDate + 'T00:00:00').toLocaleDateString()}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => toggleMaintReminderCompleted(item.id)} className={`p-1 text-xs rounded ${item.isCompleted ? 'bg-yellow-500 dark:bg-yellow-600' : 'bg-green-500 dark:bg-green-600'} text-white`}>{item.isCompleted ? t('personalFinanceMarkAsUnpaid' as keyof TranslationSet, 'Mark Undone') : t('carMarkAsDone')}</button>
                      <button onClick={() => handleDeleteMaintReminder(item.id)} className={deleteButtonClasses}><TrashIcon className="h-4 w-4"/></button>
                    </div>
                </li>
            ))}
        </ul>
      </SubSectionCard>
      
      {/* Fuel Log */}
      <SubSectionCard titleKey="carFuelLog" icon={<BeakerIcon/>} isOpen={openSubSections.fuelLog} onToggle={() => toggleSubSection('fuelLog')}>
        <form onSubmit={handleAddFuelLog} className="space-y-3 mb-4 p-3 border rounded-md dark:border-gray-600 bg-slate-50 dark:bg-gray-700/50">
            <input type="text" value={fuelVehicleName} onChange={e => setFuelVehicleName(e.target.value)} placeholder={t('carVehicleName')} className={`${inputBaseClasses} ${themedInputClasses}`} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input type="date" value={fuelDate} onChange={e => setFuelDate(e.target.value)} className={`${inputBaseClasses} ${themedInputClasses}`} required/>
                <input type="number" value={fuelOdometer} onChange={e => setFuelOdometer(e.target.value)} placeholder={t('carOdometerReading')} className={`${inputBaseClasses} ${themedInputClasses}`} required step="0.1"/>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input type="number" value={fuelLiters} onChange={e => setFuelLiters(e.target.value)} placeholder={t('carLitersFilled')} className={`${inputBaseClasses} ${themedInputClasses}`} required step="0.01"/>
                <input type="number" value={fuelPricePerLiter} onChange={e => setFuelPricePerLiter(e.target.value)} placeholder={t('carPricePerLiter')} className={`${inputBaseClasses} ${themedInputClasses}`} required step="0.01"/>
            </div>
            <button type="submit" className={`${primaryButtonClasses} w-full`}>{t('carLogFuelEntry')}</button>
        </form>
        {fuelLogs.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">{t('carNoFuelLogs')}</p>}
        <ul className="space-y-1 max-h-60 overflow-y-auto">
            {fuelLogs.map(log => (
                <li key={log.id} className="p-2 text-xs rounded bg-white dark:bg-gray-700 shadow-sm">
                    <div>{log.vehicleName} - {new Date(log.date+'T00:00:00').toLocaleDateString(language)}: {log.litersFilled.toFixed(2)}{t('carUnitLiters')} @ {log.pricePerLiter.toFixed(2)}{t('currencyEGP')}/{t('carUnitLiters')} = {t('currencyEGP')}{(log.litersFilled * log.pricePerLiter).toFixed(2)} ({log.odometerReading} {t('carUnitKm')})</div>
                    <button onClick={() => handleDeleteFuelLog(log.id)} className={`${deleteButtonClasses} mt-1`}><TrashIcon className="h-4 w-4"/></button>
                </li>
            ))}
        </ul>
      </SubSectionCard>

      {/* Car Expenses */}
      <SubSectionCard titleKey="carExpenses" icon={<CurrencyDollarIcon/>} isOpen={openSubSections.carExpenses} onToggle={() => toggleSubSection('carExpenses')}>
         <form onSubmit={handleAddCarExpense} className="space-y-3 mb-4 p-3 border rounded-md dark:border-gray-600 bg-slate-50 dark:bg-gray-700/50">
            <input type="text" value={expenseVehicleName} onChange={e => setExpenseVehicleName(e.target.value)} placeholder={t('carVehicleName')} className={`${inputBaseClasses} ${themedInputClasses}`} />
            <input type="text" value={expenseDescription} onChange={e => setExpenseDescription(e.target.value)} placeholder={t('carExpenseDescription')} className={`${inputBaseClasses} ${themedInputClasses}`} required />
            <select value={expenseCategory} onChange={e => setExpenseCategory(e.target.value as CarExpenseCategory)} className={`${inputBaseClasses} ${themedInputClasses}`}>
                {carExpenseCategoryOptions.map(cat => <option key={cat} value={cat}>{t(`carExpenseCategory${cat}` as keyof TranslationSet, cat)}</option>)}
            </select>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input type="number" value={expenseAmount} onChange={e => setExpenseAmount(e.target.value)} placeholder={t('carExpenseAmount')} className={`${inputBaseClasses} ${themedInputClasses}`} required step="0.01"/>
                <input type="date" value={expenseDate} onChange={e => setExpenseDate(e.target.value)} className={`${inputBaseClasses} ${themedInputClasses}`} required/>
            </div>
            <button type="submit" className={`${primaryButtonClasses} w-full`}>{t('carLogCarExpense')}</button>
        </form>
        {carExpenses.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">{t('carNoCarExpenses')}</p>}
        <ul className="space-y-1 max-h-60 overflow-y-auto">
            {carExpenses.map(exp => (
                <li key={exp.id} className="flex justify-between items-center p-2 text-xs rounded bg-white dark:bg-gray-700 shadow-sm">
                    <div>{exp.vehicleName} - {exp.description} ({t('currencyEGP')}{exp.amount.toFixed(2)}) - {t(`carExpenseCategory${exp.category}` as keyof TranslationSet, exp.category)} ({new Date(exp.date+'T00:00:00').toLocaleDateString(language)})</div>
                    <button onClick={() => handleDeleteCarExpense(exp.id)} className={deleteButtonClasses}><TrashIcon className="h-4 w-4"/></button>
                </li>
            ))}
        </ul>
      </SubSectionCard>
      
      {/* Document Renewals */}
      <SubSectionCard titleKey="carDocumentRenewals" icon={<DocumentTextIcon/>} isOpen={openSubSections.documentRenewals} onToggle={() => toggleSubSection('documentRenewals')}>
        <form onSubmit={handleAddDocumentReminder} className="space-y-3 mb-4 p-3 border rounded-md dark:border-gray-600 bg-slate-50 dark:bg-gray-700/50">
            <input type="text" value={docVehicleName} onChange={e => setDocVehicleName(e.target.value)} placeholder={t('carVehicleName')} className={`${inputBaseClasses} ${themedInputClasses}`} />
            <select value={docType} onChange={e => setDocType(e.target.value as CarDocumentType)} className={`${inputBaseClasses} ${themedInputClasses}`}>
                {docTypeOptions.map(type => <option key={type} value={type}>{t(`carDocumentType${type}` as keyof TranslationSet, type)}</option>)}
            </select>
            <input type="date" value={docExpiryDate} onChange={e => setDocExpiryDate(e.target.value)} className={`${inputBaseClasses} ${themedInputClasses}`} required title={t('carExpiryDate')} />
            <button type="submit" className={`${primaryButtonClasses} w-full`}>{t('carAddDocumentReminder')}</button>
        </form>
        {documentReminders.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">{t('carNoDocumentReminders')}</p>}
        <ul className="space-y-2 max-h-72 overflow-y-auto">
            {documentReminders.map(doc => {
                const status = getDocumentStatus(doc.expiryDate);
                return (
                    <li key={doc.id} className={`p-3 rounded-md shadow-sm text-xs ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-semibold">{doc.vehicleName} - {t(`carDocumentType${doc.documentType}` as keyof TranslationSet, doc.documentType)}</p>
                                <p className="text-gray-500 dark:text-gray-400">{t('carExpiryDate')}: {new Date(doc.expiryDate + 'T00:00:00').toLocaleDateString(language)}</p>
                                <p className={`font-medium ${status.colorClass}`}>{t(status.textKey)}</p>
                            </div>
                            <div className="flex flex-col items-end gap-1.5 shrink-0 ml-2 rtl:mr-2">
                                <button onClick={() => handleDeleteDocumentReminder(doc.id)} className={`${deleteButtonClasses} !p-1`}><TrashIcon className="h-3.5 w-3.5"/></button>
                                {!doc.isRenewed && status.textKey !== 'carStatusValid' && <button onClick={() => handleOpenRenewalEditor(doc)} className={`${secondaryButtonClasses} !py-1 !px-2 flex items-center gap-1 ${theme === 'dark' ? '!bg-green-700 hover:!bg-green-600' : '!bg-green-500 hover:!bg-green-600'} !text-white`}><RenewIcon className="h-3.5 w-3.5"/> {t('carMarkAsRenewed')}</button>}
                            </div>
                        </div>
                        {editingRenewalId === doc.id && (
                            <div className="mt-2 pt-2 border-t dark:border-gray-600 space-y-2">
                                <label htmlFor={`newExpiry-${doc.id}`} className="text-xs font-medium text-gray-600 dark:text-gray-300 block">{t('carNewExpiryDate')}:</label>
                                <input type="date" id={`newExpiry-${doc.id}`} value={newExpiryDateForRenewal} onChange={e => setNewExpiryDateForRenewal(e.target.value)} className={`${inputBaseClasses} ${themedInputClasses} !text-xs !p-1.5`}/>
                                <div className="flex gap-2">
                                    <button onClick={() => handleConfirmRenewalUpdate(doc.id)} className={`${primaryButtonClasses} !text-xs !py-1.5 flex-1`}>{t('carUpdateDocumentReminder')}</button>
                                    <button onClick={() => setEditingRenewalId(null)} className={`${secondaryButtonClasses} !text-xs !py-1.5 flex-1`}>{t('profileCancelButton')}</button>
                                </div>
                            </div>
                        )}
                    </li>
                );
            })}
        </ul>
      </SubSectionCard>
      
      {/* Car Repair Log */}
      <SubSectionCard titleKey="carRepairLog" icon={<WrenchScrewdriverIcon/>} isOpen={openSubSections.repairLog} onToggle={() => toggleSubSection('repairLog')}>
        <form onSubmit={handleAddRepairLog} className="space-y-3 mb-4 p-3 border rounded-md dark:border-gray-600 bg-slate-50 dark:bg-gray-700/50">
            <input type="text" value={repairVehicleName} onChange={e => setRepairVehicleName(e.target.value)} placeholder={t('carVehicleName')} className={`${inputBaseClasses} ${themedInputClasses}`} />
            <input type="date" value={repairDate} onChange={e => setRepairDate(e.target.value)} className={`${inputBaseClasses} ${themedInputClasses}`} required/>
            <input type="text" value={repairDescription} onChange={e => setRepairDescription(e.target.value)} placeholder={t('carRepairDescription')} className={`${inputBaseClasses} ${themedInputClasses}`} required />
            <input type="number" value={repairCost} onChange={e => setRepairCost(e.target.value)} placeholder={t('carRepairCost')} className={`${inputBaseClasses} ${themedInputClasses}`} step="0.01"/>
            <button type="submit" className={`${primaryButtonClasses} w-full`}>{t('carLogCarRepair')}</button>
        </form>
        {repairLogs.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">{t('carNoCarRepairs')}</p>}
        <ul className="space-y-1 max-h-60 overflow-y-auto">
            {repairLogs.map(log => (
                <li key={log.id} className="flex justify-between items-center p-2 text-xs rounded bg-white dark:bg-gray-700 shadow-sm">
                    <div>{log.vehicleName} - {new Date(log.dateOfRepair+'T00:00:00').toLocaleDateString(language)}: {log.description} {log.cost ? `(${t('currencyEGP')}${log.cost.toFixed(2)})` : ''}</div>
                    <button onClick={() => handleDeleteRepairLog(log.id)} className={deleteButtonClasses}><TrashIcon className="h-4 w-4"/></button>
                </li>
            ))}
        </ul>
      </SubSectionCard>

      {/* Mileage Log */}
      <SubSectionCard titleKey="carMileageLog" icon={<ArrowsRightLeftIcon/>} isOpen={openSubSections.mileageLog} onToggle={() => toggleSubSection('mileageLog')}>
        <form onSubmit={handleAddMileageLog} className="space-y-3 mb-4 p-3 border rounded-md dark:border-gray-600 bg-slate-50 dark:bg-gray-700/50">
            <input type="text" value={mileageVehicleName} onChange={e => setMileageVehicleName(e.target.value)} placeholder={t('carVehicleName')} className={`${inputBaseClasses} ${themedInputClasses}`} />
            <input type="date" value={mileageDate} onChange={e => setMileageDate(e.target.value)} className={`${inputBaseClasses} ${themedInputClasses}`} required/>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input type="number" value={mileageStartOdo} onChange={e => setMileageStartOdo(e.target.value)} placeholder={t('carStartOdometer')} className={`${inputBaseClasses} ${themedInputClasses}`} step="0.1"/>
                <input type="number" value={mileageEndOdo} onChange={e => setMileageEndOdo(e.target.value)} placeholder={t('carEndOdometer')} className={`${inputBaseClasses} ${themedInputClasses}`} required step="0.1"/>
            </div>
            <input type="text" value={mileagePurpose} onChange={e => setMileagePurpose(e.target.value)} placeholder={t('carPurposeOfTrip')} className={`${inputBaseClasses} ${themedInputClasses}`} />
            <button type="submit" className={`${primaryButtonClasses} w-full`}>{t('carLogMileageEntry')}</button>
        </form>
        {mileageLogs.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">{t('carNoMileageLogs')}</p>}
        <ul className="space-y-1 max-h-60 overflow-y-auto">
            {mileageLogs.map(log => (
                 <li key={log.id} className="p-2 text-xs rounded bg-white dark:bg-gray-700 shadow-sm">
                    <div>{log.vehicleName} - {new Date(log.date+'T00:00:00').toLocaleDateString(language)}: {log.startOdometer ? `${log.startOdometer} -> ` : ''}{log.endOdometer} {t('carUnitKm')} {log.startOdometer && log.endOdometer > log.startOdometer ? `(${ (log.endOdometer - (log.startOdometer || 0)).toFixed(1)} ${t('carUnitKm')})` : ''} {log.purposeOfTrip ? `- ${log.purposeOfTrip}`: ''}</div>
                    <button onClick={() => handleDeleteMileageLog(log.id)} className={`${deleteButtonClasses} mt-1`}><TrashIcon className="h-4 w-4"/></button>
                </li>
            ))}
        </ul>
      </SubSectionCard>
      
      {/* Parking Log */}
      <SubSectionCard titleKey="carParkingLog" icon={<MapPinIcon/>} isOpen={openSubSections.parkingLog} onToggle={() => toggleSubSection('parkingLog')}>
        <form onSubmit={handleAddParkingLog} className="space-y-3 mb-4 p-3 border rounded-md dark:border-gray-600 bg-slate-50 dark:bg-gray-700/50">
            <input type="text" value={parkingVehicleName} onChange={e => setParkingVehicleName(e.target.value)} placeholder={t('carVehicleName')} className={`${inputBaseClasses} ${themedInputClasses}`} />
            <input type="text" value={parkingLocation} onChange={e => setParkingLocation(e.target.value)} placeholder={t('carLocationDescription')} className={`${inputBaseClasses} ${themedInputClasses}`} required />
            <button type="submit" className={`${primaryButtonClasses} w-full`}>{t('carLogParkingSpot')}</button>
        </form>
        {currentActiveSpot && (
            <div className="mb-3 p-2 text-xs rounded bg-green-100 dark:bg-green-700/50 text-green-700 dark:text-green-300">
                <strong>{t('carCurrentActiveParkingSpot', {vehicleName: currentActiveSpot.vehicleName, location: currentActiveSpot.locationDescription, time: new Date(currentActiveSpot.timestamp).toLocaleTimeString(language)} as any)}</strong>
                <button onClick={clearActiveParkingSpot} className={`${secondaryButtonClasses} !text-xs !py-1 ml-2 rtl:mr-2`}>{t('carClearActiveSpot')}</button>
            </div>
        )}
        {!currentActiveSpot && <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">{t('carNoActiveParkingSpot')}</p>}

        <h4 className="text-sm font-medium mt-4 mb-2 text-gray-700 dark:text-gray-300">{t('carParkingHistory')}</h4>
        {parkingLogs.filter(p => !p.isCurrent).length === 0 && <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-1">{t('carNoParkingHistory')}</p>}
        <ul className="space-y-1 max-h-40 overflow-y-auto">
            {parkingLogs.filter(p => !p.isCurrent).map(log => (
                <li key={log.id} className="flex justify-between items-center p-2 text-xs rounded bg-white dark:bg-gray-700 shadow-sm">
                    <div>{log.vehicleName} @ {log.locationDescription} ({new Date(log.timestamp).toLocaleString(language)})</div>
                    <button onClick={() => handleDeleteParkingLog(log.id)} className={deleteButtonClasses}><TrashIcon className="h-4 w-4"/></button>
                </li>
            ))}
        </ul>
      </SubSectionCard>
    </>
  );
};
export default CarManagementSection;
