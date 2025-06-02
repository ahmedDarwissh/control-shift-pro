
import React, { useState, FormEvent, useContext } from 'react';
import { useLanguageContext } from '../../hooks/useLanguage';
import { LoggedInUser, TranslationSet, ShoppingListItem, ShoppingListCategory, HomeInventoryItem, HomeInventoryCategory, CleaningTask, CleaningFrequency, HomeMaintenanceLog, MaintenanceItemType, MaintenanceTaskFrequency, HomeBill, HomeBillCategory, HomeAppliance, HomeApplianceCategory, HomeImprovementProject, HomeImprovementProjectStatus, RentReminder, EnergyConsumptionLog, EnergyType } from '../../types';
import { ThemeContext } from '../../contexts/ThemeContext'; 
import { ToastContext } from '../../contexts/ToastContext';
import { SubSectionCard } from './common/HubComponents';
import { TrashIcon, PencilIcon, PlusCircleIcon, HomeModernIcon, ShoppingCartIcon, InboxStackIcon, SunIcon, WrenchScrewdriverIcon, CpuChipIcon, InformationCircleIcon, LinkIcon, ReceiptPercentIcon, CheckCircleIcon, BoltIcon, PaintBrushIcon, UserGroupIcon, CurrencyDollarIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

interface HomeManagementSectionProps {
  loggedInUser: LoggedInUser | null;
  showConfirmDelete: (titleKey: keyof TranslationSet, messageKey: keyof TranslationSet, onConfirmAction: () => void) => void;
}

export const HomeManagementSection: React.FC<HomeManagementSectionProps> = ({ loggedInUser, showConfirmDelete }) => {
  const { t, language } = useLanguageContext();
  const { theme } = useContext(ThemeContext);
  const { addToast } = useContext(ToastContext);

  const [openSubSections, setOpenSubSections] = useState<Record<string, boolean>>({
    shoppingList: true, homeInventory: false, cleaningSchedule: false, homeMaintenanceLog: false, homeBills: false, myAppliances: false, homeImprovementProjects: false, rentReminders: false, energyConsumption: false,
  });
  const toggleSubSection = (key: string) => setOpenSubSections(prev => ({ ...prev, [key]: !prev[key] }));

  const getCurrentDate = () => new Date().toISOString().split('T')[0];

  const [shoppingListItems, setShoppingListItems] = useState<ShoppingListItem[]>([]);
  const [shoppingItemName, setShoppingItemName] = useState('');
  const [shoppingItemCategory, setShoppingItemCategory] = useState<ShoppingListCategory>(ShoppingListCategory.GroceriesCat);
  const shoppingCategoryOptions = Object.values(ShoppingListCategory);

  const [inventoryItems, setInventoryItems] = useState<HomeInventoryItem[]>([]);
  const [inventoryItemName, setInventoryItemName] = useState('');
  const [inventoryItemCategory, setInventoryItemCategory] = useState<HomeInventoryCategory>(HomeInventoryCategory.FoodPantryInv);
  const [inventoryQuantity, setInventoryQuantity] = useState('');
  const [inventoryUnit, setInventoryUnit] = useState('pcs');
  const homeInventoryCategoryOptions = Object.values(HomeInventoryCategory);

  const [cleaningTasks, setCleaningTasks] = useState<CleaningTask[]>([]);
  const [cleaningTaskName, setCleaningTaskName] = useState('');
  const [cleaningFrequency, setCleaningFrequency] = useState<CleaningFrequency>(CleaningFrequency.WeeklyClean);
  const cleaningFrequencyOptions = Object.values(CleaningFrequency);

  // Home Maintenance Log State
  const [maintenanceLogs, setMaintenanceLogs] = useState<HomeMaintenanceLog[]>([]);
  const [maintItemName, setMaintItemName] = useState('');
  const [maintItemType, setMaintItemType] = useState<MaintenanceItemType>(MaintenanceItemType.OtherMaint);
  const [maintFrequency, setMaintFrequency] = useState<MaintenanceTaskFrequency>(MaintenanceTaskFrequency.AsNeededMaint);
  const [maintNextDueDate, setMaintNextDueDate] = useState(getCurrentDate());
  const maintenanceItemTypeOptions = Object.values(MaintenanceItemType);
  const maintenanceTaskFrequencyOptions = Object.values(MaintenanceTaskFrequency);

  // Home Bills State
  const [homeBills, setHomeBills] = useState<HomeBill[]>([]);
  const [homeBillName, setHomeBillName] = useState('');
  const [homeBillCategory, setHomeBillCategory] = useState<HomeBillCategory>(HomeBillCategory.OtherHomeBillCat);
  const [homeBillAmount, setHomeBillAmount] = useState('');
  const [homeBillDueDate, setHomeBillDueDate] = useState(getCurrentDate());
  const homeBillCategoryOptions = Object.values(HomeBillCategory);

  // My Appliances State
  const [appliances, setAppliances] = useState<HomeAppliance[]>([]);
  const [applianceName, setApplianceName] = useState('');
  const [applianceCategory, setApplianceCategory] = useState<HomeApplianceCategory>(HomeApplianceCategory.OtherApplianceCat);
  const [appliancePurchaseDate, setAppliancePurchaseDate] = useState(getCurrentDate());
  const homeApplianceCategoryOptions = Object.values(HomeApplianceCategory);

  // Home Improvement Projects State
  const [improvementProjects, setImprovementProjects] = useState<HomeImprovementProject[]>([]);
  const [projectName, setProjectName] = useState('');
  const [projectStatus, setProjectStatus] = useState<HomeImprovementProjectStatus>(HomeImprovementProjectStatus.PlanningStatus);
  const homeImprovementProjectStatusOptions = Object.values(HomeImprovementProjectStatus);

  // Rent Reminders State
  const [rentReminders, setRentReminders] = useState<RentReminder[]>([]);
  const [rentPropertyName, setRentPropertyName] = useState('');
  const [rentAmount, setRentAmount] = useState('');
  const [rentPaymentDay, setRentPaymentDay] = useState('1');

  // Energy Consumption State
  const [energyLogs, setEnergyLogs] = useState<EnergyConsumptionLog[]>([]);
  const [energyType, setEnergyType] = useState<EnergyType>(EnergyType.ElectricityEnergy);
  const [energyReading, setEnergyReading] = useState('');
  const [energyReadingDate, setEnergyReadingDate] = useState(getCurrentDate());
  const [energyUnit, setEnergyUnit] = useState('kWh');
  const energyTypeOptions = Object.values(EnergyType);


  // Common UI Elements
  const inputBaseClasses = `w-full p-2.5 border rounded-lg shadow-sm focus:ring-2 text-sm transition-colors`;
  const themedInputClasses = theme === 'dark' ? `bg-gray-700 border-gray-600 text-gray-100 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400` : `bg-white border-gray-300 text-gray-800 focus:ring-blue-600 focus:border-blue-600 placeholder-gray-400`;
  const primaryButtonClasses = `py-2.5 px-5 rounded-lg font-semibold text-sm transition-colors shadow-md hover:shadow-lg transform hover:scale-[1.02] ${theme === 'dark' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`;
  const deleteButtonClasses = `p-1.5 rounded-md text-red-500 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-700/30 transition-colors`;


  const handleAddShoppingItem = (e: FormEvent) => {
    e.preventDefault();
    if (!shoppingItemName.trim() || !loggedInUser) return;
    const newItem: ShoppingListItem = { id: `shop-${Date.now()}`, userId: loggedInUser.id, name: shoppingItemName, category: shoppingItemCategory, isPurchased: false, createdAt: new Date() };
    setShoppingListItems(p => [newItem, ...p]);
    addToast(t('homeItemAddedSuccess'), 'success');
    setShoppingItemName('');
  };
  const handleDeleteShoppingItem = (id: string) => {
    showConfirmDelete('homeConfirmDeleteShoppingItem', 'homeConfirmDeleteShoppingItem', () => {
      setShoppingListItems(p => p.filter(item => item.id !== id));
      addToast(t('homeItemDeletedSuccess'), 'info');
    });
  };
  const toggleShoppingItemPurchased = (id: string) => {
    setShoppingListItems(p => p.map(item => item.id === id ? {...item, isPurchased: !item.isPurchased } : item));
    addToast(t('homeItemUpdatedSuccess'), 'success');
  };

  const handleAddInventoryItem = (e: FormEvent) => {
    e.preventDefault();
    if (!inventoryItemName.trim() || !inventoryQuantity.trim() || !loggedInUser) return;
    const newItem: HomeInventoryItem = { id: `inv-${Date.now()}`, userId: loggedInUser.id, name: inventoryItemName, category: inventoryItemCategory, quantity: parseInt(inventoryQuantity), unit: inventoryUnit, createdAt: new Date(), updatedAt: new Date()};
    setInventoryItems(p => [newItem, ...p]);
    addToast(t('homeInventoryItemAddedSuccess'), 'success');
    setInventoryItemName(''); setInventoryQuantity(''); setInventoryUnit('pcs');
  };
  const handleDeleteInventoryItem = (id: string) => {
    showConfirmDelete('homeConfirmDeleteInventoryItem', 'homeConfirmDeleteInventoryItem', () => {
      setInventoryItems(p => p.filter(item => item.id !== id));
      addToast(t('homeInventoryItemDeletedSuccess'), 'info');
    });
  };

  const handleAddCleaningTask = (e: FormEvent) => {
    e.preventDefault();
    if(!cleaningTaskName.trim() || !loggedInUser) return;
    const newTask: CleaningTask = { id: `clean-${Date.now()}`, userId: loggedInUser.id, name: cleaningTaskName, frequency: cleaningFrequency, createdAt: new Date() };
    setCleaningTasks(p => [newTask, ...p]);
    addToast(t('homeCleaningTaskAddedSuccess'), 'success');
    setCleaningTaskName('');
  };
  const handleDeleteCleaningTask = (id: string) => {
    showConfirmDelete('homeConfirmDeleteCleaningTask', 'homeConfirmDeleteCleaningTask', () => {
      setCleaningTasks(p => p.filter(item => item.id !== id));
      addToast(t('homeCleaningTaskDeletedSuccess'), 'info');
    });
  };
  const markCleaningTaskDone = (id: string) => {
    setCleaningTasks(p => p.map(task => task.id === id ? {...task, lastCompleted: getCurrentDate()} : task));
    addToast(t('homeCleaningTaskUpdatedSuccess'), 'success');
  };

  const handleAddMaintenanceLog = (e: FormEvent) => {
    e.preventDefault();
    if (!maintItemName.trim() || !loggedInUser) return;
    const newLog: HomeMaintenanceLog = { id: `maint-${Date.now()}`, userId: loggedInUser.id, itemName: maintItemName, type: maintItemType, frequency: maintFrequency, nextDueDate: maintNextDueDate, createdAt: new Date() };
    setMaintenanceLogs(p => [newLog, ...p]);
    addToast(t('homeMaintenanceTaskAddedSuccess'), 'success');
    setMaintItemName(''); setMaintNextDueDate(getCurrentDate());
  };
  const handleDeleteMaintenanceLog = (id: string) => {
    showConfirmDelete('homeConfirmDeleteMaintenanceLog', 'homeConfirmDeleteMaintenanceLog', () => {
      setMaintenanceLogs(p => p.filter(log => log.id !== id));
      addToast(t('homeMaintenanceTaskDeletedSuccess'), 'info');
    });
  };
  const markMaintenanceLogDone = (id: string) => {
    setMaintenanceLogs(p => p.map(log => log.id === id ? {...log, lastCompletedDate: getCurrentDate()} : log));
    addToast(t('homeMaintenanceTaskUpdatedSuccess'), 'success');
  };

  const handleAddHomeBill = (e: FormEvent) => {
    e.preventDefault();
    if (!homeBillName.trim() || !homeBillAmount.trim() || !loggedInUser) return;
    const newBill: HomeBill = { id: `bill-${Date.now()}`, userId: loggedInUser.id, name: homeBillName, category: homeBillCategory, amountDue: parseFloat(homeBillAmount), dueDate: homeBillDueDate, isPaid: false, createdAt: new Date() };
    setHomeBills(p => [newBill, ...p]);
    addToast(t('homeBillAddedSuccess'), 'success');
    setHomeBillName(''); setHomeBillAmount(''); setHomeBillDueDate(getCurrentDate());
  };
  const handleDeleteHomeBill = (id: string) => {
    showConfirmDelete('homeConfirmDeleteBill', 'homeConfirmDeleteBill', () => {
      setHomeBills(p => p.filter(bill => bill.id !== id));
      addToast(t('homeBillDeletedSuccess'), 'info');
    });
  };
  const toggleHomeBillPaid = (id: string) => {
    setHomeBills(p => p.map(bill => bill.id === id ? {...bill, isPaid: !bill.isPaid, paidDate: !bill.isPaid ? getCurrentDate() : undefined} : bill));
    addToast(t('homeBillUpdatedSuccess'), 'success');
  };

  const handleAddAppliance = (e: FormEvent) => {
    e.preventDefault();
    if (!applianceName.trim() || !loggedInUser) return;
    const newAppliance: HomeAppliance = { id: `app-${Date.now()}`, userId: loggedInUser.id, name: applianceName, category: applianceCategory, purchaseDate: appliancePurchaseDate, createdAt: new Date() };
    setAppliances(p => [newAppliance, ...p]);
    addToast(t('homeApplianceAddedSuccess'), 'success');
    setApplianceName(''); setAppliancePurchaseDate(getCurrentDate());
  };
  const handleDeleteAppliance = (id: string) => {
    showConfirmDelete('homeConfirmDeleteAppliance', 'homeConfirmDeleteAppliance', () => {
      setAppliances(p => p.filter(app => app.id !== id));
      addToast(t('homeApplianceDeletedSuccess'), 'info');
    });
  };

  const handleAddImprovementProject = (e: FormEvent) => {
    e.preventDefault();
    if (!projectName.trim() || !loggedInUser) return;
    const newProject: HomeImprovementProject = { id: `proj-${Date.now()}`, userId: loggedInUser.id, name: projectName, status: projectStatus, tasks: [], createdAt: new Date() };
    setImprovementProjects(p => [newProject, ...p]);
    addToast(t('homeProjectAddedSuccess'), 'success');
    setProjectName('');
  };
  const handleDeleteImprovementProject = (id: string) => {
    showConfirmDelete('homeConfirmDeleteProject', 'homeConfirmDeleteProject', () => {
      setImprovementProjects(p => p.filter(proj => proj.id !== id));
      addToast(t('homeProjectDeletedSuccess'), 'info');
    });
  };

  const handleAddRentReminder = (e: FormEvent) => {
    e.preventDefault();
    if (!rentPropertyName.trim() || !rentAmount.trim() || !loggedInUser) return;
    const newReminder: RentReminder = { id: `rent-${Date.now()}`, userId: loggedInUser.id, propertyName: rentPropertyName, rentAmount: parseFloat(rentAmount), paymentDay: parseInt(rentPaymentDay), reminderDaysBefore: 5, createdAt: new Date() };
    setRentReminders(p => [newReminder, ...p]);
    addToast(t('homeRentReminderAddedSuccess'), 'success');
    setRentPropertyName(''); setRentAmount(''); setRentPaymentDay('1');
  };
  const handleDeleteRentReminder = (id: string) => {
    showConfirmDelete('homeConfirmDeleteRentReminder', 'homeConfirmDeleteRentReminder', () => {
      setRentReminders(p => p.filter(rem => rem.id !== id));
      addToast(t('homeRentReminderDeletedSuccess'), 'info');
    });
  };

  const handleAddEnergyLog = (e: FormEvent) => {
    e.preventDefault();
    if (!energyReading.trim() || !loggedInUser) return;
    const newLog: EnergyConsumptionLog = { id: `energy-${Date.now()}`, userId: loggedInUser.id, type: energyType, reading: parseFloat(energyReading), readingDate: energyReadingDate, unit: energyUnit, createdAt: new Date() };
    setEnergyLogs(p => [newLog, ...p]);
    addToast(t('homeEnergyLogAddedSuccess'), 'success');
    setEnergyReading(''); setEnergyReadingDate(getCurrentDate()); setEnergyUnit(energyType === EnergyType.ElectricityEnergy ? 'kWh' : 'm³');
  };
  const handleDeleteEnergyLog = (id: string) => {
    showConfirmDelete('homeConfirmDeleteEnergyLog', 'homeConfirmDeleteEnergyLog', () => {
      setEnergyLogs(p => p.filter(log => log.id !== id));
      addToast(t('homeEnergyLogDeletedSuccess'), 'info');
    });
  };


  if (!loggedInUser) return null;

  return (
    <>
      {/* Shopping List */}
      <SubSectionCard titleKey="homeShoppingList" icon={<ShoppingCartIcon/>} isOpen={openSubSections.shoppingList} onToggle={() => toggleSubSection('shoppingList')}>
        <form onSubmit={handleAddShoppingItem} className="space-y-3 mb-4 p-3 border rounded-md dark:border-gray-600 bg-slate-50 dark:bg-gray-700/50">
            <input type="text" value={shoppingItemName} onChange={e => setShoppingItemName(e.target.value)} placeholder={t('homeItemName')} className={`${inputBaseClasses} ${themedInputClasses}`} required/>
            <select value={shoppingItemCategory} onChange={e => setShoppingItemCategory(e.target.value as ShoppingListCategory)} className={`${inputBaseClasses} ${themedInputClasses}`}>
                {shoppingCategoryOptions.map(cat => <option key={cat} value={cat}>{t(`homeShoppingCategory${cat}` as keyof TranslationSet, cat)}</option>)}
            </select>
            <button type="submit" className={`${primaryButtonClasses} w-full`}>{t('homeAddItemToList')}</button>
        </form>
        {shoppingListItems.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">{t('homeNoShoppingItems')}</p>}
        <ul className="space-y-1 max-h-60 overflow-y-auto">
            {shoppingListItems.map(item => (
                <li key={item.id} className={`flex justify-between items-center p-2 text-xs rounded shadow-sm ${item.isPurchased ? 'bg-green-100 dark:bg-green-800/50' : 'bg-white dark:bg-gray-700'}`}>
                    <div className="flex items-center">
                        <input type="checkbox" checked={item.isPurchased} onChange={() => toggleShoppingItemPurchased(item.id)} className="mr-2 rtl:ml-2 dark:accent-blue-500 accent-blue-600"/>
                        <span className={item.isPurchased ? 'line-through text-gray-500 dark:text-gray-400' : ''}>{item.name} ({t(`homeShoppingCategory${item.category}` as keyof TranslationSet, item.category)})</span>
                    </div>
                    <button onClick={() => handleDeleteShoppingItem(item.id)} className={deleteButtonClasses}><TrashIcon className="h-4 w-4"/></button>
                </li>
            ))}
        </ul>
      </SubSectionCard>

      {/* Home Inventory */}
      <SubSectionCard titleKey="homeInventory" icon={<InboxStackIcon/>} isOpen={openSubSections.homeInventory} onToggle={() => toggleSubSection('homeInventory')}>
        <form onSubmit={handleAddInventoryItem} className="space-y-3 mb-4 p-3 border rounded-md dark:border-gray-600 bg-slate-50 dark:bg-gray-700/50">
          <input type="text" value={inventoryItemName} onChange={e => setInventoryItemName(e.target.value)} placeholder={t('homeItemName')} className={`${inputBaseClasses} ${themedInputClasses}`} required />
          <select value={inventoryItemCategory} onChange={e => setInventoryItemCategory(e.target.value as HomeInventoryCategory)} className={`${inputBaseClasses} ${themedInputClasses}`}>
            {homeInventoryCategoryOptions.map(cat => <option key={cat} value={cat}>{t(`homeInventoryCategory${cat}` as keyof TranslationSet, cat)}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-3">
            <input type="number" value={inventoryQuantity} onChange={e => setInventoryQuantity(e.target.value)} placeholder={t('homeInventoryQuantity')} className={`${inputBaseClasses} ${themedInputClasses}`} required />
            <input type="text" value={inventoryUnit} onChange={e => setInventoryUnit(e.target.value)} placeholder={t('homeInventoryUnit')} className={`${inputBaseClasses} ${themedInputClasses}`} required />
          </div>
          <button type="submit" className={`${primaryButtonClasses} w-full`}>{t('homeAddInventoryItem')}</button>
        </form>
        {inventoryItems.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">{t('homeNoInventoryItems')}</p>}
        <ul className="space-y-1 max-h-60 overflow-y-auto">
            {inventoryItems.map(item => (
                <li key={item.id} className="flex justify-between items-center p-2 text-xs rounded bg-white dark:bg-gray-700 shadow-sm">
                    <div>{item.name} ({item.quantity} {item.unit}) - {t(`homeInventoryCategory${item.category}` as keyof TranslationSet, item.category)}</div>
                    <button onClick={() => handleDeleteInventoryItem(item.id)} className={deleteButtonClasses}><TrashIcon className="h-4 w-4"/></button>
                </li>
            ))}
        </ul>
      </SubSectionCard>

      {/* Cleaning Schedule */}
      <SubSectionCard titleKey="homeCleaningSchedule" icon={<SunIcon/>} isOpen={openSubSections.cleaningSchedule} onToggle={() => toggleSubSection('cleaningSchedule')}>
         <form onSubmit={handleAddCleaningTask} className="space-y-3 mb-4 p-3 border rounded-md dark:border-gray-600 bg-slate-50 dark:bg-gray-700/50">
            <input type="text" value={cleaningTaskName} onChange={e => setCleaningTaskName(e.target.value)} placeholder={t('homeCleaningTaskName')} className={`${inputBaseClasses} ${themedInputClasses}`} required/>
            <select value={cleaningFrequency} onChange={e => setCleaningFrequency(e.target.value as CleaningFrequency)} className={`${inputBaseClasses} ${themedInputClasses}`}>
                {cleaningFrequencyOptions.map(freq => <option key={freq} value={freq}>{t(`homeCleaningFrequency${freq}` as keyof TranslationSet, freq)}</option>)}
            </select>
            <button type="submit" className={`${primaryButtonClasses} w-full`}>{t('homeAddCleaningTask')}</button>
        </form>
        {cleaningTasks.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">{t('homeNoCleaningTasks')}</p>}
        <ul className="space-y-1 max-h-60 overflow-y-auto">
            {cleaningTasks.map(task => (
                <li key={task.id} className="p-2 text-xs rounded bg-white dark:bg-gray-700 shadow-sm">
                    <div className="flex justify-between items-center">
                        <div>
                            <span className={task.lastCompleted === getCurrentDate() ? "line-through text-gray-400 dark:text-gray-500" : ""}>{task.name} ({t(`homeCleaningFrequency${task.frequency}` as keyof TranslationSet, task.frequency)})</span>
                            {task.lastCompleted && <span className="block text-[10px] text-gray-500 dark:text-gray-400">{t('homeCleaningLastCompleted')}: {new Date(task.lastCompleted+'T00:00:00').toLocaleDateString()}</span>}
                        </div>
                        <div className="flex items-center gap-2">
                            {task.lastCompleted !== getCurrentDate() && 
                                <button onClick={() => markCleaningTaskDone(task.id)} className={`${primaryButtonClasses} !text-xs !py-1 !px-2`}><CheckCircleIcon className="h-3.5 w-3.5 inline-block mr-1"/>{t('homeCleaningMarkAsDoneToday')}</button>
                            }
                            <button onClick={() => handleDeleteCleaningTask(task.id)} className={deleteButtonClasses}><TrashIcon className="h-4 w-4"/></button>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
      </SubSectionCard>
      
      {/* Home Maintenance Log */}
      <SubSectionCard titleKey="homeMaintenanceLog" icon={<WrenchScrewdriverIcon/>} isOpen={openSubSections.homeMaintenanceLog} onToggle={() => toggleSubSection('homeMaintenanceLog')}>
        <form onSubmit={handleAddMaintenanceLog} className="space-y-3 mb-4 p-3 border rounded-md dark:border-gray-600 bg-slate-50 dark:bg-gray-700/50">
          <input type="text" value={maintItemName} onChange={e => setMaintItemName(e.target.value)} placeholder={t('homeMaintenanceItemName')} className={`${inputBaseClasses} ${themedInputClasses}`} required/>
          <select value={maintItemType} onChange={e => setMaintItemType(e.target.value as MaintenanceItemType)} className={`${inputBaseClasses} ${themedInputClasses}`}>
            {maintenanceItemTypeOptions.map(type => <option key={type} value={type}>{t(`homeMaintenanceType${type}` as keyof TranslationSet, type)}</option>)}
          </select>
          <select value={maintFrequency} onChange={e => setMaintFrequency(e.target.value as MaintenanceTaskFrequency)} className={`${inputBaseClasses} ${themedInputClasses}`}>
            {maintenanceTaskFrequencyOptions.map(freq => <option key={freq} value={freq}>{t(`homeMaintenanceFreq${freq}` as keyof TranslationSet, freq)}</option>)}
          </select>
          <input type="date" value={maintNextDueDate} onChange={e => setMaintNextDueDate(e.target.value)} className={`${inputBaseClasses} ${themedInputClasses}`} title={t('homeMaintenanceNextDueDate')}/>
          <button type="submit" className={`${primaryButtonClasses} w-full`}>{t('homeLogMaintenanceTask')}</button>
        </form>
        {maintenanceLogs.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">{t('homeNoMaintenanceLogs')}</p>}
        <ul className="space-y-1 max-h-60 overflow-y-auto">
          {maintenanceLogs.map(log => (
            <li key={log.id} className="p-2 text-xs rounded bg-white dark:bg-gray-700 shadow-sm">
              <div>{log.itemName} ({t(`homeMaintenanceType${log.type}` as keyof TranslationSet, log.type)}) - {t('homeMaintenanceNextDueDate')}: {log.nextDueDate ? new Date(log.nextDueDate+'T00:00:00').toLocaleDateString(language) : t('N_A' as keyof TranslationSet)}</div>
              {log.lastCompletedDate && <div className="text-[10px] text-gray-500 dark:text-gray-400">{t('homeMaintenanceLastCompletedDate')}: {new Date(log.lastCompletedDate+'T00:00:00').toLocaleDateString(language)}</div>}
              <div className="flex gap-2 mt-1">
                {!log.lastCompletedDate || log.lastCompletedDate !== getCurrentDate() && <button onClick={() => markMaintenanceLogDone(log.id)} className={`${primaryButtonClasses} !text-xs !py-1 !px-2`}><CheckCircleIcon className="h-3.5 w-3.5 inline"/> {t('homeMaintenanceMarkAsCompletedToday')}</button>}
                <button onClick={() => handleDeleteMaintenanceLog(log.id)} className={deleteButtonClasses}><TrashIcon className="h-4 w-4"/></button>
              </div>
            </li>
          ))}
        </ul>
      </SubSectionCard>
      
      {/* Home Bills */}
      <SubSectionCard titleKey="homeBills" icon={<ReceiptPercentIcon/>} isOpen={openSubSections.homeBills} onToggle={() => toggleSubSection('homeBills')}>
        <form onSubmit={handleAddHomeBill} className="space-y-3 mb-4 p-3 border rounded-md dark:border-gray-600 bg-slate-50 dark:bg-gray-700/50">
          <input type="text" value={homeBillName} onChange={e => setHomeBillName(e.target.value)} placeholder={t('homeBillName')} className={`${inputBaseClasses} ${themedInputClasses}`} required/>
          <select value={homeBillCategory} onChange={e => setHomeBillCategory(e.target.value as HomeBillCategory)} className={`${inputBaseClasses} ${themedInputClasses}`}>
            {homeBillCategoryOptions.map(cat => <option key={cat} value={cat}>{t(`homeBillCategory${cat}` as keyof TranslationSet, cat)}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-3">
            <input type="number" value={homeBillAmount} onChange={e => setHomeBillAmount(e.target.value)} placeholder={t('homeBillAmountDue')} className={`${inputBaseClasses} ${themedInputClasses}`} required step="0.01"/>
            <input type="date" value={homeBillDueDate} onChange={e => setHomeBillDueDate(e.target.value)} className={`${inputBaseClasses} ${themedInputClasses}`} required title={t('homeBillDueDate')}/>
          </div>
          <button type="submit" className={`${primaryButtonClasses} w-full`}>{t('homeAddHomeBill')}</button>
        </form>
        {homeBills.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">{t('homeNoHomeBills')}</p>}
        <ul className="space-y-1 max-h-60 overflow-y-auto">
          {homeBills.map(bill => (
            <li key={bill.id} className={`p-2 text-xs rounded shadow-sm ${bill.isPaid ? 'bg-green-100 dark:bg-green-800/30' : 'bg-white dark:bg-gray-700'}`}>
              <div>{bill.name} ({t('currencyEGP')} {bill.amountDue.toFixed(2)}) - {t('homeBillDueDate')}: {new Date(bill.dueDate+'T00:00:00').toLocaleDateString(language)}</div>
              <div className="text-[10px] text-gray-500 dark:text-gray-400">{t(`homeBillCategory${bill.category}` as keyof TranslationSet, bill.category)} - {bill.isPaid ? t('homeStatusPaidOn', {date: bill.paidDate ? new Date(bill.paidDate+'T00:00:00').toLocaleDateString(language) : ''} as any) : t('homeStatusUnpaid')}</div>
              <div className="flex gap-2 mt-1">
                <button onClick={() => toggleHomeBillPaid(bill.id)} className={`${primaryButtonClasses} !text-xs !py-1 !px-2 ${bill.isPaid ? '!bg-yellow-500 dark:!bg-yellow-600' : ''}`}><CheckCircleIcon className="h-3.5 w-3.5 inline"/> {bill.isPaid ? t('homeMarkAsUnpaid') : t('homeMarkAsPaid')}</button>
                <button onClick={() => handleDeleteHomeBill(bill.id)} className={deleteButtonClasses}><TrashIcon className="h-4 w-4"/></button>
              </div>
            </li>
          ))}
        </ul>
      </SubSectionCard>
      
      {/* My Appliances */}
      <SubSectionCard titleKey="homeMyAppliances" icon={<CpuChipIcon/>} isOpen={openSubSections.myAppliances} onToggle={() => toggleSubSection('myAppliances')}>
        <form onSubmit={handleAddAppliance} className="space-y-3 mb-4 p-3 border rounded-md dark:border-gray-600 bg-slate-50 dark:bg-gray-700/50">
          <input type="text" value={applianceName} onChange={e => setApplianceName(e.target.value)} placeholder={t('homeApplianceName')} className={`${inputBaseClasses} ${themedInputClasses}`} required/>
          <select value={applianceCategory} onChange={e => setApplianceCategory(e.target.value as HomeApplianceCategory)} className={`${inputBaseClasses} ${themedInputClasses}`}>
            {homeApplianceCategoryOptions.map(cat => <option key={cat} value={cat}>{t(`homeApplianceCategory${cat}` as keyof TranslationSet, cat)}</option>)}
          </select>
          <input type="date" value={appliancePurchaseDate} onChange={e => setAppliancePurchaseDate(e.target.value)} className={`${inputBaseClasses} ${themedInputClasses}`} title={t('homeAppliancePurchaseDate')}/>
          <button type="submit" className={`${primaryButtonClasses} w-full`}>{t('homeAddAppliance')}</button>
        </form>
        {appliances.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">{t('homeNoAppliancesLogged')}</p>}
        <ul className="space-y-1 max-h-60 overflow-y-auto">
          {appliances.map(app => (
            <li key={app.id} className="flex justify-between items-center p-2 text-xs rounded bg-white dark:bg-gray-700 shadow-sm">
              <div>{app.name} ({t(`homeApplianceCategory${app.category}` as keyof TranslationSet, app.category)}) {app.purchaseDate ? `- ${t('homeAppliancePurchaseDate')}: ${new Date(app.purchaseDate+'T00:00:00').toLocaleDateString(language)}` : ''}</div>
              <button onClick={() => handleDeleteAppliance(app.id)} className={deleteButtonClasses}><TrashIcon className="h-4 w-4"/></button>
            </li>
          ))}
        </ul>
      </SubSectionCard>
      
      {/* Home Improvement Projects */}
      <SubSectionCard titleKey="homeImprovementProjects" icon={<PaintBrushIcon/>} isOpen={openSubSections.homeImprovementProjects} onToggle={() => toggleSubSection('homeImprovementProjects')}>
         <form onSubmit={handleAddImprovementProject} className="space-y-3 mb-4 p-3 border rounded-md dark:border-gray-600 bg-slate-50 dark:bg-gray-700/50">
          <input type="text" value={projectName} onChange={e => setProjectName(e.target.value)} placeholder={t('homeProjectName')} className={`${inputBaseClasses} ${themedInputClasses}`} required/>
          <select value={projectStatus} onChange={e => setProjectStatus(e.target.value as HomeImprovementProjectStatus)} className={`${inputBaseClasses} ${themedInputClasses}`}>
            {homeImprovementProjectStatusOptions.map(status => <option key={status} value={status}>{t(`homeProjectStatus${status}` as keyof TranslationSet, status)}</option>)}
          </select>
          <button type="submit" className={`${primaryButtonClasses} w-full`}>{t('homeCreateNewProject')}</button>
        </form>
        {improvementProjects.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">{t('homeNoImprovementProjects')}</p>}
        <ul className="space-y-1 max-h-60 overflow-y-auto">
          {improvementProjects.map(proj => (
            <li key={proj.id} className="flex justify-between items-center p-2 text-xs rounded bg-white dark:bg-gray-700 shadow-sm">
              <div>{proj.name} ({t(`homeProjectStatus${proj.status}` as keyof TranslationSet, proj.status)})</div>
              <button onClick={() => handleDeleteImprovementProject(proj.id)} className={deleteButtonClasses}><TrashIcon className="h-4 w-4"/></button>
            </li>
          ))}
        </ul>
        <p className="text-xs italic text-gray-500 dark:text-gray-400 mt-2">{language === 'ar' ? 'إدارة مهام المشاريع ستتوفر قريباً.' : 'Managing project tasks coming soon.'}</p>
      </SubSectionCard>
      
      {/* Rent Reminders */}
      <SubSectionCard titleKey="homeRentReminders" icon={<CalendarDaysIcon/>} isOpen={openSubSections.rentReminders} onToggle={() => toggleSubSection('rentReminders')}>
        <form onSubmit={handleAddRentReminder} className="space-y-3 mb-4 p-3 border rounded-md dark:border-gray-600 bg-slate-50 dark:bg-gray-700/50">
          <input type="text" value={rentPropertyName} onChange={e => setRentPropertyName(e.target.value)} placeholder={t('homePropertyAddress')} className={`${inputBaseClasses} ${themedInputClasses}`} required/>
          <div className="grid grid-cols-2 gap-3">
            <input type="number" value={rentAmount} onChange={e => setRentAmount(e.target.value)} placeholder={t('homeRentAmount')} className={`${inputBaseClasses} ${themedInputClasses}`} required step="0.01"/>
            <input type="number" value={rentPaymentDay} onChange={e => setRentPaymentDay(e.target.value)} placeholder={t('homeRentPaymentDay')} className={`${inputBaseClasses} ${themedInputClasses}`} required min="1" max="31"/>
          </div>
          <button type="submit" className={`${primaryButtonClasses} w-full`}>{t('homeAddRentReminder')}</button>
        </form>
        {rentReminders.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">{t('homeNoRentReminders')}</p>}
        <ul className="space-y-1 max-h-60 overflow-y-auto">
          {rentReminders.map(rem => (
            <li key={rem.id} className="flex justify-between items-center p-2 text-xs rounded bg-white dark:bg-gray-700 shadow-sm">
              <div>{rem.propertyName} - {t('currencyEGP')} {rem.rentAmount.toFixed(2)} ({t('homeRentPaymentDay')} {rem.paymentDay})</div>
              <button onClick={() => handleDeleteRentReminder(rem.id)} className={deleteButtonClasses}><TrashIcon className="h-4 w-4"/></button>
            </li>
          ))}
        </ul>
      </SubSectionCard>
      
      {/* Energy Consumption */}
      <SubSectionCard titleKey="homeEnergyConsumption" icon={<BoltIcon/>} isOpen={openSubSections.energyConsumption} onToggle={() => toggleSubSection('energyConsumption')}>
        <form onSubmit={handleAddEnergyLog} className="space-y-3 mb-4 p-3 border rounded-md dark:border-gray-600 bg-slate-50 dark:bg-gray-700/50">
          <select value={energyType} onChange={e => { setEnergyType(e.target.value as EnergyType); setEnergyUnit(e.target.value === EnergyType.ElectricityEnergy ? 'kWh' : 'm³');}} className={`${inputBaseClasses} ${themedInputClasses}`}>
            {energyTypeOptions.map(type => <option key={type} value={type}>{t(`homeEnergyType${type}` as keyof TranslationSet, type)}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-3">
            <input type="number" value={energyReading} onChange={e => setEnergyReading(e.target.value)} placeholder={t('homeReading')} className={`${inputBaseClasses} ${themedInputClasses}`} required step="0.1"/>
             <input type="text" value={energyUnit} onChange={e => setEnergyUnit(e.target.value)} placeholder={t('homeUnit')} className={`${inputBaseClasses} ${themedInputClasses}`} required />
          </div>
          <input type="date" value={energyReadingDate} onChange={e => setEnergyReadingDate(e.target.value)} className={`${inputBaseClasses} ${themedInputClasses}`} required title={t('homeReadingDate')}/>
          <button type="submit" className={`${primaryButtonClasses} w-full`}>{t('homeAddEnergyLog')}</button>
        </form>
        {energyLogs.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">{t('homeNoEnergyLogs')}</p>}
        <ul className="space-y-1 max-h-60 overflow-y-auto">
          {energyLogs.map(log => (
            <li key={log.id} className="flex justify-between items-center p-2 text-xs rounded bg-white dark:bg-gray-700 shadow-sm">
              <div>{t(`homeEnergyType${log.type}` as keyof TranslationSet, log.type)}: {log.reading} {log.unit} ({new Date(log.readingDate+'T00:00:00').toLocaleDateString(language)})</div>
              <button onClick={() => handleDeleteEnergyLog(log.id)} className={deleteButtonClasses}><TrashIcon className="h-4 w-4"/></button>
            </li>
          ))}
        </ul>
      </SubSectionCard>
    </>
  );
};
export default HomeManagementSection;
