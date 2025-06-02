
import React, { useState, FormEvent, useContext } from 'react';
import { useLanguageContext } from '../../hooks/useLanguage';
import { LoggedInUser, TranslationSet, PersonalExpense, PersonalExpenseCategory, PersonalIncome, PersonalBudget, PersonalDebt, PersonalDebtType, PersonalDebtStatus, PersonalInvestment, PersonalInvestmentType, PersonalBillReminder, ReportPeriod } from '../../types';
import { ThemeContext } from '../../contexts/ThemeContext'; 
import { ToastContext } from '../../contexts/ToastContext';
import { SubSectionCard } from './common/HubComponents'; 
import { TrashIcon, PencilIcon, PlusCircleIcon, BanknotesIcon, WalletIcon, ReceiptPercentIcon, DocumentTextIcon, CreditCardIcon, LightBulbIcon, ArrowDownTrayIcon, CalendarDaysIcon, ShoppingCartIcon, ArrowTrendingUpIcon, VariableIcon, CheckCircleIcon, ChartPieIcon } from '@heroicons/react/24/outline';

interface PersonalFinanceSectionProps {
  loggedInUser: LoggedInUser | null;
  showConfirmDelete: (titleKey: keyof TranslationSet, messageKey: keyof TranslationSet, onConfirmAction: () => void) => void;
}

export const PersonalFinanceSection: React.FC<PersonalFinanceSectionProps> = ({ loggedInUser, showConfirmDelete }) => {
  const { t, language } = useLanguageContext();
  const { theme } = useContext(ThemeContext);
  const { addToast } = useContext(ToastContext);

  const [openSubSections, setOpenSubSections] = useState<Record<string, boolean>>({
    expenses: true, income: false, budgets: false, reports: false, debts: false, investments: false, taxEstimator: false, billReminders: false, exportData: false,
  });
  const toggleSubSection = (key: string) => setOpenSubSections(prev => ({ ...prev, [key]: !prev[key] }));

  const getCurrentDate = () => new Date().toISOString().split('T')[0];

  const [currentDescription, setCurrentDescription] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [currentDate, setCurrentDate] = useState(getCurrentDate());
  // const [editingId, setEditingId] = useState<string | null>(null); // Keep for future edit functionality

  // Expenses State
  const [expenses, setExpenses] = useState<PersonalExpense[]>([]);
  const [expenseCategory, setExpenseCategory] = useState<PersonalExpenseCategory>(PersonalExpenseCategory.OtherExpense);
  const expenseCategoryOptions = Object.values(PersonalExpenseCategory);

  // Income State
  const [incomes, setIncomes] = useState<PersonalIncome[]>([]);
  const [incomeSource, setIncomeSource] = useState('');

  // Budget State
  const [budgets, setBudgets] = useState<PersonalBudget[]>([]);
  const [budgetMonth, setBudgetMonth] = useState(new Date().getMonth());
  const [budgetYear, setBudgetYear] = useState(new Date().getFullYear());
  const [budgetCategory, setBudgetCategory] = useState<PersonalExpenseCategory>(PersonalExpenseCategory.FoodExpense);
  const [budgetAllocatedAmount, setBudgetAllocatedAmount] = useState('');

  // Debt State
  const [debts, setDebts] = useState<PersonalDebt[]>([]);
  const [debtDescription, setDebtDescription] = useState('');
  const [debtType, setDebtType] = useState<PersonalDebtType>(PersonalDebtType.DebtType);
  const [debtCounterparty, setDebtCounterparty] = useState('');
  const [debtTotalAmount, setDebtTotalAmount] = useState('');
  const [debtAmountPaid, setDebtAmountPaid] = useState('0');
  const [debtDueDate, setDebtDueDate] = useState('');
  const [debtStatus, setDebtStatus] = useState<PersonalDebtStatus>(PersonalDebtStatus.ActiveStatus);
  const debtTypeOptions = Object.values(PersonalDebtType);
  const debtStatusOptions = Object.values(PersonalDebtStatus);

  // Investment State
  const [investments, setInvestments] = useState<PersonalInvestment[]>([]);
  const [investmentName, setInvestmentName] = useState('');
  const [investmentType, setInvestmentType] = useState<PersonalInvestmentType>(PersonalInvestmentType.StocksInv);
  const [investmentInitial, setInvestmentInitial] = useState('');
  const [investmentCurrentValue, setInvestmentCurrentValue] = useState('');
  const [investmentPurchaseDate, setInvestmentPurchaseDate] = useState(getCurrentDate());
  const investmentTypeOptions = Object.values(PersonalInvestmentType);

  // Bill Reminder State
  const [billReminders, setBillReminders] = useState<PersonalBillReminder[]>([]);
  const [billName, setBillName] = useState('');
  const [billEstAmount, setBillEstAmount] = useState('');
  const [billDueDate, setBillDueDate] = useState(getCurrentDate());

  // Financial Reports State
  const [reportPeriod, setReportPeriod] = useState<ReportPeriod>(ReportPeriod.ThisMonthPeriod);
  const [reportCustomStart, setReportCustomStart] = useState(getCurrentDate());
  const [reportCustomEnd, setReportCustomEnd] = useState(getCurrentDate());
  const [generatedReport, setGeneratedReport] = useState<{period: string, totalIncome: number, totalExpenses: number, netFlow: number} | null>(null);
  const reportPeriodOptions = Object.values(ReportPeriod);
  
  // Tax Estimator State
  const [annualIncome, setAnnualIncome] = useState('');
  const [annualDeductions, setAnnualDeductions] = useState('');
  const [estimatedTaxResult, setEstimatedTaxResult] = useState<{taxableIncome: number, taxAmount: number} | null>(null);
  
  const inputBaseClasses = `w-full p-2.5 border rounded-lg shadow-sm focus:ring-2 text-sm transition-colors`;
  const themedInputClasses = theme === 'dark' ? `bg-gray-700 border-gray-600 text-gray-100 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400` : `bg-white border-gray-300 text-gray-800 focus:ring-blue-600 focus:border-blue-600 placeholder-gray-400`;
  const primaryButtonClasses = `py-2.5 px-5 rounded-lg font-semibold text-sm transition-colors shadow-md hover:shadow-lg transform hover:scale-[1.02] ${theme === 'dark' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`;
  const deleteButtonClasses = `p-1.5 rounded-md text-red-500 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-700/30 transition-colors`;
  // const editButtonClasses = `p-1.5 rounded-md text-sky-500 hover:bg-sky-100 dark:text-sky-400 dark:hover:bg-sky-700/30 transition-colors`; // Kept for future
  const markPaidButtonClasses = `p-1.5 rounded-md text-green-500 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-700/30 transition-colors`;


  const handleAddExpense = (e: FormEvent) => {
    e.preventDefault();
    if (!currentDescription.trim() || !currentAmount.trim() || !loggedInUser) return;
    const newExpense: PersonalExpense = { id: `exp-${Date.now()}`, userId: loggedInUser.id, description: currentDescription, amount: parseFloat(currentAmount), category: expenseCategory, date: currentDate, createdAt: new Date() };
    setExpenses(prev => [newExpense, ...prev]);
    addToast(t('personalFinanceExpenseAddedSuccess'), 'success');
    setCurrentDescription(''); setCurrentAmount(''); setCurrentDate(getCurrentDate());
  };
  const handleDeleteExpense = (id: string) => {
    showConfirmDelete('personalFinanceConfirmDeleteExpense', 'personalFinanceConfirmDeleteExpense', () => {
      setExpenses(prev => prev.filter(exp => exp.id !== id));
      addToast(t('personalFinanceExpenseDeletedSuccess'), 'info');
    });
  };

  const handleAddIncome = (e: FormEvent) => {
    e.preventDefault();
    if (!incomeSource.trim() || !currentAmount.trim() || !loggedInUser) return;
    const newIncome: PersonalIncome = { id: `inc-${Date.now()}`, userId: loggedInUser.id, source: incomeSource, amount: parseFloat(currentAmount), date: currentDate, createdAt: new Date() };
    setIncomes(prev => [newIncome, ...prev]);
    addToast(t('personalFinanceIncomeAddedSuccess'), 'success');
    setIncomeSource(''); setCurrentAmount(''); setCurrentDate(getCurrentDate());
  };
  const handleDeleteIncome = (id: string) => {
     showConfirmDelete('personalFinanceConfirmDeleteIncome', 'personalFinanceConfirmDeleteIncome', () => {
        setIncomes(prev => prev.filter(inc => inc.id !== id));
        addToast(t('personalFinanceIncomeDeletedSuccess'), 'info');
    });
  };

  const handleAddBudget = (e: FormEvent) => {
    e.preventDefault();
    if (!budgetAllocatedAmount.trim() || !loggedInUser) return;
    const newBudget: PersonalBudget = { id: `budget-${budgetYear}-${budgetMonth}-${budgetCategory}`, userId: loggedInUser.id, month: budgetMonth, year: budgetYear, category: budgetCategory, allocatedAmount: parseFloat(budgetAllocatedAmount), createdAt: new Date() };
    setBudgets(prev => {
        const existingIndex = prev.findIndex(b => b.id === newBudget.id);
        if (existingIndex > -1) {
            const updated = [...prev];
            updated[existingIndex] = newBudget;
            return updated;
        }
        return [newBudget, ...prev];
    });
    addToast(t('personalFinanceSaveBudget') + ' ' + t('statusSuccessMessage'), 'success'); 
    setBudgetAllocatedAmount('');
  };
   const handleDeleteBudget = (id: string) => {
     showConfirmDelete('personalFinanceConfirmDeleteBudget', 'personalFinanceConfirmDeleteBudget', () => {
        setBudgets(prev => prev.filter(b => b.id !== id));
        addToast(t('personalFinanceDeleteBudget') + ' ' + t('statusSuccessMessage'), 'info');
    });
  };

  const handleAddDebt = (e: FormEvent) => {
    e.preventDefault();
    if (!debtDescription.trim() || !debtCounterparty.trim() || !debtTotalAmount.trim() || !loggedInUser) return;
    const newDebt: PersonalDebt = {
        id: `debt-${Date.now()}`, userId: loggedInUser.id, description: debtDescription,
        type: debtType, counterpartyName: debtCounterparty, totalAmount: parseFloat(debtTotalAmount),
        amountPaid: parseFloat(debtAmountPaid) || 0, dueDate: debtDueDate || undefined, status: debtStatus, createdAt: new Date()
    };
    setDebts(prev => [newDebt, ...prev]);
    addToast(t('personalFinanceDebtLoanAddedSuccess'), 'success');
    setDebtDescription(''); setDebtCounterparty(''); setDebtTotalAmount(''); setDebtAmountPaid('0'); setDebtDueDate('');
  };
  const handleDeleteDebt = (id: string) => {
    showConfirmDelete('personalFinanceConfirmDeleteDebtLoan', 'personalFinanceConfirmDeleteDebtLoan', () => {
        setDebts(prev => prev.filter(d => d.id !== id));
        addToast(t('personalFinanceDebtLoanDeletedSuccess'), 'info');
    });
  };

  const handleAddInvestment = (e: FormEvent) => {
    e.preventDefault();
    if (!investmentName.trim() || !investmentInitial.trim() || !investmentCurrentValue.trim() || !loggedInUser) return;
    const newInvestment: PersonalInvestment = {
        id: `inv-${Date.now()}`, userId: loggedInUser.id, name: investmentName, type: investmentType,
        initialInvestment: parseFloat(investmentInitial), currentValue: parseFloat(investmentCurrentValue),
        purchaseDate: investmentPurchaseDate, createdAt: new Date()
    };
    setInvestments(prev => [newInvestment, ...prev]);
    addToast(t('personalFinanceInvestmentAddedSuccess'), 'success');
    setInvestmentName(''); setInvestmentInitial(''); setInvestmentCurrentValue(''); setInvestmentPurchaseDate(getCurrentDate());
  };
  const handleDeleteInvestment = (id: string) => {
    showConfirmDelete('personalFinanceConfirmDeleteInvestment', 'personalFinanceConfirmDeleteInvestment', () => {
        setInvestments(prev => prev.filter(inv => inv.id !== id));
        addToast(t('personalFinanceInvestmentDeletedSuccess'), 'info');
    });
  };

  const handleAddBillReminder = (e: FormEvent) => {
    e.preventDefault();
    if (!billName.trim() || !billDueDate.trim() || !loggedInUser) return;
    const newReminder: PersonalBillReminder = {
        id: `bill-${Date.now()}`, userId: loggedInUser.id, billName,
        estimatedAmount: billEstAmount ? parseFloat(billEstAmount) : undefined,
        dueDate: billDueDate, isPaid: false, createdAt: new Date()
    };
    setBillReminders(prev => [newReminder, ...prev]);
    addToast(t('personalFinanceBillAddedSuccess'), 'success');
    setBillName(''); setBillEstAmount(''); setBillDueDate(getCurrentDate());
  };
  const handleDeleteBillReminder = (id: string) => {
    showConfirmDelete('personalFinanceConfirmDeleteBill', 'personalFinanceConfirmDeleteBill', () => {
        setBillReminders(billPrev => billPrev.filter(bill => bill.id !== id));
        addToast(t('personalFinanceBillDeletedSuccess'), 'info');
    });
  };
  const toggleBillPaidStatus = (id: string) => {
    setBillReminders(prev => prev.map(bill => bill.id === id ? { ...bill, isPaid: !bill.isPaid, paidDate: !bill.isPaid ? getCurrentDate() : undefined } : bill ));
    addToast(t('personalFinanceBillUpdatedSuccess'), 'success');
  };

  const handleGenerateReport = (e: FormEvent) => {
    e.preventDefault();
    // Mock report generation
    const mockIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0) * (Math.random() * 0.5 + 0.8); // Simulate some variation
    const mockExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0) * (Math.random() * 0.5 + 0.8);
    
    setGeneratedReport({
        period: t(`personalFinanceReportPeriod${reportPeriod}` as keyof TranslationSet, reportPeriod),
        totalIncome: mockIncome,
        totalExpenses: mockExpenses,
        netFlow: mockIncome - mockExpenses,
    });
    addToast(t('personalFinanceReportGenerate') + ' ' + t('statusSuccessMessage'), 'success');
  };

  const handleCalculateTax = (e: FormEvent) => {
    e.preventDefault();
    const incomeNum = parseFloat(annualIncome);
    const deductionsNum = parseFloat(annualDeductions) || 0;
    if (isNaN(incomeNum)) {
        addToast(t('personalFinanceAnnualIncome') + ' ' + (language === 'ar' ? 'مطلوب!' : 'is required!'), 'alert');
        return;
    }
    const taxableIncome = Math.max(0, incomeNum - deductionsNum);
    const estimatedTax = taxableIncome * 0.15; // Simplified flat tax rate for demo
    setEstimatedTaxResult({taxableIncome, taxAmount: estimatedTax});
    addToast(t('personalFinanceCalculateEstimatedTax') + ' ' + t('statusSuccessMessage'), 'success');
  };

  const handleExportData = (dataType: string) => {
    // Mock export - in a real app, this would generate and download a CSV.
    console.log(`Exporting ${dataType} data...`);
    const filename = `${dataType}_export_${new Date().toISOString().split('T')[0]}.csv`;
    addToast(t('personalFinanceDataExportedSuccess', {filename} as any), 'success');
  };
    
  if (!loggedInUser) return null;

  return (
    <>
      {/* Expenses */}
      <SubSectionCard titleKey="personalFinanceMyExpenses" icon={<ShoppingCartIcon/>} isOpen={openSubSections.expenses} onToggle={() => toggleSubSection('expenses')}>
        <form onSubmit={handleAddExpense} className="space-y-3 mb-4 p-3 border rounded-md dark:border-gray-600 bg-slate-50 dark:bg-gray-700/50">
            <input type="text" value={currentDescription} onChange={e => setCurrentDescription(e.target.value)} placeholder={t('personalFinanceExpenseDescription')} className={`${inputBaseClasses} ${themedInputClasses}`} required/>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input type="number" value={currentAmount} onChange={e => setCurrentAmount(e.target.value)} placeholder={t('personalFinanceAmount')} className={`${inputBaseClasses} ${themedInputClasses}`} required step="0.01"/>
                <input type="date" value={currentDate} onChange={e => setCurrentDate(e.target.value)} className={`${inputBaseClasses} ${themedInputClasses}`} required/>
            </div>
            <select value={expenseCategory} onChange={e => setExpenseCategory(e.target.value as PersonalExpenseCategory)} className={`${inputBaseClasses} ${themedInputClasses}`}>
                {expenseCategoryOptions.map(cat => <option key={cat} value={cat}>{t(`personalFinanceCategory${cat}` as keyof TranslationSet, cat)}</option>)}
            </select>
            <button type="submit" className={`${primaryButtonClasses} w-full`}>{t('personalFinanceAddExpense')}</button>
        </form>
        {expenses.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">{t('personalFinanceNoExpenses')}</p>}
        <ul className="space-y-1 max-h-60 overflow-y-auto">
          {expenses.map(exp => (
            <li key={exp.id} className="flex justify-between items-center p-2 text-xs rounded bg-white dark:bg-gray-700 shadow-sm">
              <div>{exp.description} ({t('currencyEGP')} {exp.amount.toFixed(2)}) - {t(`personalFinanceCategory${exp.category}` as keyof TranslationSet, exp.category)} ({new Date(exp.date + 'T00:00:00').toLocaleDateString(language)})</div>
              <button onClick={() => handleDeleteExpense(exp.id)} className={deleteButtonClasses}><TrashIcon className="h-4 w-4"/></button>
            </li>
          ))}
        </ul>
      </SubSectionCard>

      {/* Income */}
      <SubSectionCard titleKey="personalFinanceMyIncome" icon={<WalletIcon/>} isOpen={openSubSections.income} onToggle={() => toggleSubSection('income')}>
        <form onSubmit={handleAddIncome} className="space-y-3 mb-4 p-3 border rounded-md dark:border-gray-600 bg-slate-50 dark:bg-gray-700/50">
            <input type="text" value={incomeSource} onChange={e => setIncomeSource(e.target.value)} placeholder={t('personalFinanceIncomeSource')} className={`${inputBaseClasses} ${themedInputClasses}`} required/>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input type="number" value={currentAmount} onChange={e => setCurrentAmount(e.target.value)} placeholder={t('personalFinanceIncomeAmount')} className={`${inputBaseClasses} ${themedInputClasses}`} required step="0.01"/>
                <input type="date" value={currentDate} onChange={e => setCurrentDate(e.target.value)} className={`${inputBaseClasses} ${themedInputClasses}`} required/>
            </div>
            <button type="submit" className={`${primaryButtonClasses} w-full`}>{t('personalFinanceAddIncome')}</button>
        </form>
        {incomes.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">{t('personalFinanceNoIncome')}</p>}
        <ul className="space-y-1 max-h-60 overflow-y-auto">
          {incomes.map(inc => (
            <li key={inc.id} className="flex justify-between items-center p-2 text-xs rounded bg-white dark:bg-gray-700 shadow-sm">
              <div>{inc.source} ({t('currencyEGP')} {inc.amount.toFixed(2)}) ({new Date(inc.date + 'T00:00:00').toLocaleDateString(language)})</div>
              <button onClick={() => handleDeleteIncome(inc.id)} className={deleteButtonClasses}><TrashIcon className="h-4 w-4"/></button>
            </li>
          ))}
        </ul>
      </SubSectionCard>
      
      {/* Budgets */}
      <SubSectionCard titleKey="personalFinanceMyBudgets" icon={<ReceiptPercentIcon/>} isOpen={openSubSections.budgets} onToggle={() => toggleSubSection('budgets')}>
        <form onSubmit={handleAddBudget} className="space-y-3 mb-4 p-3 border rounded-md dark:border-gray-600 bg-slate-50 dark:bg-gray-700/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select value={budgetMonth} onChange={e => setBudgetMonth(parseInt(e.target.value))} className={`${inputBaseClasses} ${themedInputClasses}`}>
              {Array.from({length: 12}, (_, i) => 
                <option key={i} value={i}>{new Date(0, i).toLocaleString(language, { month: 'long' })}</option>
              )}
            </select>
            <input type="number" value={budgetYear} onChange={e => setBudgetYear(parseInt(e.target.value))} placeholder={t('personalFinanceYear')} className={`${inputBaseClasses} ${themedInputClasses}`} />
          </div>
          <select value={budgetCategory} onChange={e => setBudgetCategory(e.target.value as PersonalExpenseCategory)} className={`${inputBaseClasses} ${themedInputClasses}`}>
            {expenseCategoryOptions.map(cat => <option key={cat} value={cat}>{t(`personalFinanceCategory${cat}` as keyof TranslationSet, cat)}</option>)}
          </select>
          <input type="number" value={budgetAllocatedAmount} onChange={e => setBudgetAllocatedAmount(e.target.value)} placeholder={t('personalFinanceAllocatedAmount')} className={`${inputBaseClasses} ${themedInputClasses}`} required step="0.01"/>
          <button type="submit" className={`${primaryButtonClasses} w-full`}>{t('personalFinanceSaveBudget')}</button>
        </form>
        {budgets.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">{t('personalFinanceNoBudgets')}</p>}
        <ul className="space-y-1 max-h-60 overflow-y-auto">
          {budgets.map(b => (
            <li key={b.id} className="flex justify-between items-center p-2 text-xs rounded bg-white dark:bg-gray-700 shadow-sm">
              <div>{new Date(b.year, b.month).toLocaleString(language, {month:'long', year:'numeric'})} - {t(`personalFinanceCategory${b.category}` as keyof TranslationSet, b.category)}: {t('currencyEGP')} {b.allocatedAmount.toFixed(2)}</div>
              <button onClick={() => handleDeleteBudget(b.id)} className={deleteButtonClasses}><TrashIcon className="h-4 w-4"/></button>
            </li>
          ))}
        </ul>
      </SubSectionCard>

      {/* Debts & Loans */}
      <SubSectionCard titleKey="personalFinanceDebtsAndLoans" icon={<CreditCardIcon/>} isOpen={openSubSections.debts} onToggle={() => toggleSubSection('debts')}>
        <form onSubmit={handleAddDebt} className="space-y-3 mb-4 p-3 border rounded-md dark:border-gray-600 bg-slate-50 dark:bg-gray-700/50">
            <input type="text" value={debtDescription} onChange={e => setDebtDescription(e.target.value)} placeholder={t('descriptionLabel')} className={`${inputBaseClasses} ${themedInputClasses}`} required/>
            <select value={debtType} onChange={e => setDebtType(e.target.value as PersonalDebtType)} className={`${inputBaseClasses} ${themedInputClasses}`}>
                {debtTypeOptions.map(type => <option key={type} value={type}>{t(`personalFinanceDebtType${type}` as keyof TranslationSet, type)}</option>)}
            </select>
            <input type="text" value={debtCounterparty} onChange={e => setDebtCounterparty(e.target.value)} placeholder={t('personalFinanceCounterpartyName')} className={`${inputBaseClasses} ${themedInputClasses}`} required/>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input type="number" value={debtTotalAmount} onChange={e => setDebtTotalAmount(e.target.value)} placeholder={t('personalFinanceTotalDebtLoanAmount')} className={`${inputBaseClasses} ${themedInputClasses}`} required step="0.01"/>
                <input type="number" value={debtAmountPaid} onChange={e => setDebtAmountPaid(e.target.value)} placeholder={t('personalFinanceAmountPaid')} className={`${inputBaseClasses} ${themedInputClasses}`} step="0.01"/>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input type="date" value={debtDueDate} onChange={e => setDebtDueDate(e.target.value)} className={`${inputBaseClasses} ${themedInputClasses}`} title={t('personalFinanceDueDate')}/>
                <select value={debtStatus} onChange={e => setDebtStatus(e.target.value as PersonalDebtStatus)} className={`${inputBaseClasses} ${themedInputClasses}`}>
                    {debtStatusOptions.map(st => <option key={st} value={st}>{t(`personalFinanceStatus${st}` as keyof TranslationSet, st)}</option>)}
                </select>
            </div>
            <button type="submit" className={`${primaryButtonClasses} w-full`}>{t('personalFinanceAddDebtLoan')}</button>
        </form>
        {debts.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">{t('personalFinanceNoDebtsLoans')}</p>}
        <ul className="space-y-1 max-h-60 overflow-y-auto">
          {debts.map(d => (
            <li key={d.id} className="p-2 text-xs rounded bg-white dark:bg-gray-700 shadow-sm">
              <div>{d.description} ({t(`personalFinanceDebtType${d.type}` as keyof TranslationSet, d.type)} {d.counterpartyName})</div>
              <div>{t('personalFinanceTotalDebtLoanAmount')}: {t('currencyEGP')} {d.totalAmount.toFixed(2)}, {t('personalFinanceAmountPaid')}: {t('currencyEGP')} {d.amountPaid.toFixed(2)}</div>
              {d.dueDate && <div>{t('personalFinanceDueDate')}: {new Date(d.dueDate + 'T00:00:00').toLocaleDateString(language)}</div>}
              <div>{t('personalFinanceDebtLoanStatus')}: {t(`personalFinanceStatus${d.status}` as keyof TranslationSet, d.status)}</div>
              <button onClick={() => handleDeleteDebt(d.id)} className={`${deleteButtonClasses} mt-1`}><TrashIcon className="h-4 w-4"/></button>
            </li>
          ))}
        </ul>
      </SubSectionCard>
      
      {/* Investments */}
      <SubSectionCard titleKey="personalFinanceMyInvestments" icon={<ArrowTrendingUpIcon/>} isOpen={openSubSections.investments} onToggle={() => toggleSubSection('investments')}>
        <form onSubmit={handleAddInvestment} className="space-y-3 mb-4 p-3 border rounded-md dark:border-gray-600 bg-slate-50 dark:bg-gray-700/50">
            <input type="text" value={investmentName} onChange={e => setInvestmentName(e.target.value)} placeholder={t('personalFinanceInvestmentNameSymbol')} className={`${inputBaseClasses} ${themedInputClasses}`} required/>
            <select value={investmentType} onChange={e => setInvestmentType(e.target.value as PersonalInvestmentType)} className={`${inputBaseClasses} ${themedInputClasses}`}>
                {investmentTypeOptions.map(type => <option key={type} value={type}>{t(`personalFinanceInvestmentType${type}` as keyof TranslationSet, type)}</option>)}
            </select>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input type="number" value={investmentInitial} onChange={e => setInvestmentInitial(e.target.value)} placeholder={t('personalFinanceInitialInvestment')} className={`${inputBaseClasses} ${themedInputClasses}`} required step="0.01"/>
                <input type="number" value={investmentCurrentValue} onChange={e => setInvestmentCurrentValue(e.target.value)} placeholder={t('personalFinanceCurrentValue')} className={`${inputBaseClasses} ${themedInputClasses}`} required step="0.01"/>
            </div>
            <input type="date" value={investmentPurchaseDate} onChange={e => setInvestmentPurchaseDate(e.target.value)} className={`${inputBaseClasses} ${themedInputClasses}`} required title={t('personalFinancePurchaseDate')}/>
            <button type="submit" className={`${primaryButtonClasses} w-full`}>{t('personalFinanceAddInvestment')}</button>
        </form>
        {investments.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">{t('personalFinanceNoInvestments')}</p>}
        <ul className="space-y-1 max-h-60 overflow-y-auto">
          {investments.map(inv => (
            <li key={inv.id} className="p-2 text-xs rounded bg-white dark:bg-gray-700 shadow-sm">
              <div>{inv.name} ({t(`personalFinanceInvestmentType${inv.type}` as keyof TranslationSet, inv.type)})</div>
              <div>{t('personalFinanceInitialInvestment')}: {t('currencyEGP')} {inv.initialInvestment.toFixed(2)}, {t('personalFinanceCurrentValue')}: {t('currencyEGP')} {inv.currentValue.toFixed(2)}</div>
              <div>{t('personalFinancePurchaseDate')}: {new Date(inv.purchaseDate + 'T00:00:00').toLocaleDateString(language)}</div>
              <button onClick={() => handleDeleteInvestment(inv.id)} className={`${deleteButtonClasses} mt-1`}><TrashIcon className="h-4 w-4"/></button>
            </li>
          ))}
        </ul>
      </SubSectionCard>

      {/* Bill Reminders */}
      <SubSectionCard titleKey="personalFinanceBillReminders" icon={<CalendarDaysIcon/>} isOpen={openSubSections.billReminders} onToggle={() => toggleSubSection('billReminders')}>
        <form onSubmit={handleAddBillReminder} className="space-y-3 mb-4 p-3 border rounded-md dark:border-gray-600 bg-slate-50 dark:bg-gray-700/50">
            <input type="text" value={billName} onChange={e => setBillName(e.target.value)} placeholder={t('personalFinanceBillName')} className={`${inputBaseClasses} ${themedInputClasses}`} required/>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input type="number" value={billEstAmount} onChange={e => setBillEstAmount(e.target.value)} placeholder={t('personalFinanceEstAmount')} className={`${inputBaseClasses} ${themedInputClasses}`} step="0.01"/>
                <input type="date" value={billDueDate} onChange={e => setBillDueDate(e.target.value)} className={`${inputBaseClasses} ${themedInputClasses}`} required title={t('personalFinanceDueDate')}/>
            </div>
            <button type="submit" className={`${primaryButtonClasses} w-full`}>{t('personalFinanceAddBillReminder')}</button>
        </form>
        {billReminders.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">{t('personalFinanceNoBillReminders')}</p>}
        <ul className="space-y-1 max-h-60 overflow-y-auto">
          {billReminders.map(bill => (
            <li key={bill.id} className={`flex justify-between items-center p-2 text-xs rounded shadow-sm ${bill.isPaid ? 'bg-green-100 dark:bg-green-800/30' : 'bg-white dark:bg-gray-700'}`}>
              <div>{bill.billName} {bill.estimatedAmount ? `(${t('currencyEGP')} ${bill.estimatedAmount.toFixed(2)})` : ''} - Due: {new Date(bill.dueDate + 'T00:00:00').toLocaleDateString(language)}</div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleBillPaidStatus(bill.id)} className={`${bill.isPaid ? markPaidButtonClasses : primaryButtonClasses} !text-xs !py-1 !px-2`}>
                    {bill.isPaid ? <CheckCircleIcon className="h-4 w-4 inline-block mr-1"/> : ''}
                    {bill.isPaid ? t('personalFinanceMarkAsUnpaid') : t('personalFinanceMarkAsPaid')}
                </button>
                <button onClick={() => handleDeleteBillReminder(bill.id)} className={deleteButtonClasses}><TrashIcon className="h-4 w-4"/></button>
              </div>
            </li>
          ))}
        </ul>
      </SubSectionCard>
      
      {/* Financial Reports */}
      <SubSectionCard titleKey="personalFinanceFinancialReports" icon={<ChartPieIcon/>} isOpen={openSubSections.reports} onToggle={() => toggleSubSection('reports')}>
        <form onSubmit={handleGenerateReport} className="space-y-3 mb-4 p-3 border rounded-md dark:border-gray-600 bg-slate-50 dark:bg-gray-700/50">
          <select value={reportPeriod} onChange={e => setReportPeriod(e.target.value as ReportPeriod)} className={`${inputBaseClasses} ${themedInputClasses}`}>
            {reportPeriodOptions.map(period => <option key={period} value={period}>{t(`personalFinanceReportPeriod${period}` as keyof TranslationSet, period)}</option>)}
          </select>
          {reportPeriod === ReportPeriod.CustomRangePeriod && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input type="date" value={reportCustomStart} onChange={e => setReportCustomStart(e.target.value)} className={`${inputBaseClasses} ${themedInputClasses}`} title={t('travelStartDate')}/>
              <input type="date" value={reportCustomEnd} onChange={e => setReportCustomEnd(e.target.value)} className={`${inputBaseClasses} ${themedInputClasses}`} title={t('travelEndDate')}/>
            </div>
          )}
          <button type="submit" className={`${primaryButtonClasses} w-full`}>{t('personalFinanceReportGenerate')}</button>
        </form>
        {generatedReport && (
          <div className="p-3 rounded-md bg-white dark:bg-gray-700 shadow text-sm">
            <h4 className="font-semibold mb-1">{t('personalFinanceReportSummaryFor', {period: generatedReport.period} as any)}</h4>
            <p>{t('personalFinanceReportTotalIncome')}: {t('currencyEGP')} {generatedReport.totalIncome.toFixed(2)}</p>
            <p>{t('personalFinanceReportTotalExpenses')}: {t('currencyEGP')} {generatedReport.totalExpenses.toFixed(2)}</p>
            <p className="font-medium">{t('personalFinanceReportNetFlow')}: {t('currencyEGP')} {generatedReport.netFlow.toFixed(2)}</p>
          </div>
        )}
      </SubSectionCard>

      {/* Tax Estimator */}
      <SubSectionCard titleKey="personalFinanceTaxEstimator" icon={<VariableIcon/>} isOpen={openSubSections.taxEstimator} onToggle={() => toggleSubSection('taxEstimator')}>
         <form onSubmit={handleCalculateTax} className="space-y-3 mb-4 p-3 border rounded-md dark:border-gray-600 bg-slate-50 dark:bg-gray-700/50">
            <input type="number" value={annualIncome} onChange={e => setAnnualIncome(e.target.value)} placeholder={t('personalFinanceAnnualIncome')} className={`${inputBaseClasses} ${themedInputClasses}`} required step="0.01"/>
            <input type="number" value={annualDeductions} onChange={e => setAnnualDeductions(e.target.value)} placeholder={t('personalFinanceAnnualDeductions')} className={`${inputBaseClasses} ${themedInputClasses}`} step="0.01"/>
            <button type="submit" className={`${primaryButtonClasses} w-full`}>{t('personalFinanceCalculateEstimatedTax')}</button>
        </form>
        {estimatedTaxResult && (
           <div className="p-3 rounded-md bg-white dark:bg-gray-700 shadow text-sm">
             <p>{t('personalFinanceEstimatedTaxableIncome')}: {t('currencyEGP')} {estimatedTaxResult.taxableIncome.toFixed(2)}</p>
             <p className="font-medium">{t('personalFinanceEstimatedTaxAmount')}: {t('currencyEGP')} {estimatedTaxResult.taxAmount.toFixed(2)}</p>
           </div>
        )}
         <p className="text-xs italic text-gray-500 dark:text-gray-400 mt-2">{t('personalFinanceTaxDisclaimer')}</p>
      </SubSectionCard>
      
      {/* Export Data */}
      <SubSectionCard titleKey="personalFinanceExportData" icon={<ArrowDownTrayIcon/>} isOpen={openSubSections.exportData} onToggle={() => toggleSubSection('exportData')}>
        <div className="space-y-2">
            <button onClick={() => handleExportData('expenses')} className={`${primaryButtonClasses} w-full`}>{t('personalFinanceExportExpensesCSV')}</button>
            <button onClick={() => handleExportData('income')} className={`${primaryButtonClasses} w-full`}>{t('personalFinanceExportIncomeCSV')}</button>
            <button onClick={() => handleExportData('debts_loans')} className={`${primaryButtonClasses} w-full`}>{t('personalFinanceExportDebtsLoansCSV')}</button>
            <button onClick={() => handleExportData('investments')} className={`${primaryButtonClasses} w-full`}>{t('personalFinanceExportInvestmentsCSV')}</button>
        </div>
      </SubSectionCard>
    </>
  );
};
export default PersonalFinanceSection;
