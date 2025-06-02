
import React, { useState, useContext, useEffect } from 'react';
import { useLanguageContext } from '../hooks/useLanguage';
import { ThemeContext } from '../contexts/ThemeContext';
import { ToastContext } from '../contexts/ToastContext'; // UPDATED IMPORT
import { useActivityLog } from '../hooks/useActivityLog';
import { LoggedInUser, ActivityLogType, TranslationSet } from '../types'; 

interface AdvancedCalculatorViewProps {
  loggedInUser: LoggedInUser | null;
  setLoggedInUser: React.Dispatch<React.SetStateAction<LoggedInUser | null>>;
}

const AdvancedCalculatorView: React.FC<AdvancedCalculatorViewProps> = ({ loggedInUser, setLoggedInUser }) => {
  const { t, language } = useLanguageContext();
  const { theme } = useContext(ThemeContext);
  const { addToast } = useContext(ToastContext);
  const { addActivityLogEntry } = useActivityLog();

  const [displayValue, setDisplayValue] = useState<string>("0");
  const [currentValue, setCurrentValue] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState<boolean>(false);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplayValue(digit);
      setWaitingForOperand(false);
    } else {
      setDisplayValue(displayValue === "0" ? digit : displayValue + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplayValue("0.");
      setWaitingForOperand(false);
    } else if (displayValue.indexOf('.') === -1) {
      setDisplayValue(displayValue + ".");
    }
  };

  const clearDisplay = (allClear: boolean = false) => {
    setDisplayValue("0");
    if (allClear) {
      setCurrentValue(null);
      setOperator(null);
      setWaitingForOperand(false);
    }
  };

  const performOperation = (nextOperator: string) => {
    const inputValue = parseFloat(displayValue);

    if (currentValue === null) {
      setCurrentValue(displayValue);
    } else if (operator) {
      const result = calculate(parseFloat(currentValue), inputValue, operator);
      if (result === null) return; 
      
      const resultString = String(result);
      const calculationDetail = `${currentValue} ${operator} ${displayValue} = ${resultString}`;
      addActivityLogEntry(ActivityLogType.CalculatorUsed, 'activityLogEntryCalculatorUsed', { userName: loggedInUser?.name, calculationDetail });
      
      setDisplayValue(resultString);
      setCurrentValue(resultString);
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };
  
  const handleAdvancedOperation = (opType: 'sqrt' | 'square' | 'percent' | 'power') => {
    const inputValue = parseFloat(displayValue);
    let result: number | null = null;
    let calculationDetail = "";
    let pointsAwarded = false;

    if (isNaN(inputValue) && opType !== 'power') { // Power can start with an operator display
        addToast(t('calculatorErrorInvalidInput'), 'alert');
        return;
    }

    switch (opType) {
        case 'sqrt':
            if (inputValue < 0) {
                addToast(t('calculatorErrorInvalidInput'), 'alert'); 
                return;
            }
            result = Math.sqrt(inputValue);
            calculationDetail = `√(${displayValue}) = ${result}`;
            pointsAwarded = true;
            break;
        case 'square':
            result = inputValue * inputValue;
            calculationDetail = `${displayValue}² = ${result}`;
            pointsAwarded = true;
            break;
        case 'percent':
            if(currentValue && operator) { // Calculate percent of current value if mid-operation
                 const baseValue = parseFloat(currentValue);
                 result = baseValue * (inputValue / 100);
                 calculationDetail = `${currentValue} ${operator} ${displayValue}% (${result})`
            } else { // Simple percent
                result = inputValue / 100;
                calculationDetail = `${displayValue}% = ${result}`;
            }
            pointsAwarded = true;
            break;
        case 'power': 
            setCurrentValue(displayValue);
            setOperator('^'); 
            setWaitingForOperand(true);
            setDisplayValue('^'); 
            addToast(language === 'ar' ? 'دخل الأس يا فنان!' : 'Enter the exponent, artist!', 'info');
            return; 
    }

    if (result !== null) {
        const resultString = String(result);
        setDisplayValue(resultString);
        addActivityLogEntry(ActivityLogType.CalculatorUsed, 'activityLogEntryCalculatorUsed', { userName: loggedInUser?.name, calculationDetail });
        if (pointsAwarded && loggedInUser && setLoggedInUser) {
            setLoggedInUser(prevUser => prevUser ? { ...prevUser, expertisePoints: (prevUser.expertisePoints || 0) + 2 } : null);
            addToast(t('expertisePointsEarnedToast', { points: 2 } as any), 'success');
        }
        setCurrentValue(resultString); 
        setWaitingForOperand(true); 
        setOperator(null); 
    }
  };


  const calculate = (firstOperand: number, secondOperand: number, op: string): number | null => {
    switch (op) {
      case '+': return firstOperand + secondOperand;
      case '-': return firstOperand - secondOperand;
      case '*': return firstOperand * secondOperand;
      case '/':
        if (secondOperand === 0) {
          addToast(t('calculatorErrorDivisionByZero'), 'alert');
          setDisplayValue(t('calculatorDisplayError'));
          return null;
        }
        return firstOperand / secondOperand;
      case '^': 
        return Math.pow(firstOperand, secondOperand);
      default: return secondOperand;
    }
  };

  const handleEquals = () => {
    if (!operator || currentValue === null) return; 
    const inputValue = parseFloat(displayValue);
    const result = calculate(parseFloat(currentValue), inputValue, operator);

    if (result !== null) {
        const resultString = String(result);
        const calculationDetail = `${currentValue} ${operator} ${displayValue} = ${resultString}`;
        addActivityLogEntry(ActivityLogType.CalculatorUsed, 'activityLogEntryCalculatorUsed', { userName: loggedInUser?.name, calculationDetail });
      
        setDisplayValue(resultString);
        setCurrentValue(null); 
        setOperator(null);
        setWaitingForOperand(false);
    }
  };

  const buttonClass = `py-4 sm:py-5 px-2 rounded-xl text-xl sm:text-2xl font-medium transition-all duration-150 ease-out shadow-md active:shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-60`;
  const numButtonClass = `${buttonClass} ${theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500 text-white focus:ring-gray-400 active:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-400 active:bg-gray-300'}`;
  const opButtonClass = `${buttonClass} ${theme === 'dark' ? 'bg-blue-700 hover:bg-blue-600 text-white focus:ring-blue-500 active:bg-blue-600' : 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-400 active:bg-blue-600'}`;
  const specialButtonClass = `${buttonClass} ${theme === 'dark' ? 'bg-orange-600 hover:bg-orange-500 text-white focus:ring-orange-400 active:bg-orange-500' : 'bg-orange-500 hover:bg-orange-600 text-white focus:ring-orange-400 active:bg-orange-600'}`;
  const displayClass = `w-full p-4 sm:p-6 mb-5 text-4xl sm:text-5xl text-right rounded-lg shadow-inner break-all ${theme === 'dark' ? 'bg-gray-800 text-white border border-gray-700' : 'bg-gray-100 text-gray-900 border border-gray-300'}`;

  const buttons = [
    { labelKey: 'calculatorButton_allClear', action: () => clearDisplay(true), style: specialButtonClass, span: 1 },
    { labelKey: 'calculatorButton_clear', action: () => clearDisplay(), style: specialButtonClass, span: 1 },
    { labelKey: 'calculatorButton_percent', action: () => handleAdvancedOperation('percent'), style: opButtonClass, span: 1 },
    { labelKey: 'calculatorButton_divide', action: () => performOperation('/'), style: opButtonClass, span: 1 },

    { labelKey: 'calculatorButton_7', action: () => inputDigit('7'), style: numButtonClass, span: 1 },
    { labelKey: 'calculatorButton_8', action: () => inputDigit('8'), style: numButtonClass, span: 1 },
    { labelKey: 'calculatorButton_9', action: () => inputDigit('9'), style: numButtonClass, span: 1 },
    { labelKey: 'calculatorButton_multiply', action: () => performOperation('*'), style: opButtonClass, span: 1 },
    
    { labelKey: 'calculatorButton_4', action: () => inputDigit('4'), style: numButtonClass, span: 1 },
    { labelKey: 'calculatorButton_5', action: () => inputDigit('5'), style: numButtonClass, span: 1 },
    { labelKey: 'calculatorButton_6', action: () => inputDigit('6'), style: numButtonClass, span: 1 },
    { labelKey: 'calculatorButton_subtract', action: () => performOperation('-'), style: opButtonClass, span: 1 },

    { labelKey: 'calculatorButton_1', action: () => inputDigit('1'), style: numButtonClass, span: 1 },
    { labelKey: 'calculatorButton_2', action: () => inputDigit('2'), style: numButtonClass, span: 1 },
    { labelKey: 'calculatorButton_3', action: () => inputDigit('3'), style: numButtonClass, span: 1 },
    { labelKey: 'calculatorButton_add', action: () => performOperation('+'), style: opButtonClass, span: 1 },

    { labelKey: 'calculatorButton_sqrt', action: () => handleAdvancedOperation('sqrt'), style: opButtonClass, span: 1 },
    { labelKey: 'calculatorButton_0', action: () => inputDigit('0'), style: numButtonClass, span: 1 },
    { labelKey: 'calculatorButton_decimal', action: inputDecimal, style: numButtonClass, span: 1 },
    { labelKey: 'calculatorButton_equals', action: handleEquals, style: specialButtonClass, span: 1 },
    
    { labelKey: 'calculatorButton_square' as keyof TranslationSet, symbol: 'x²', action: () => handleAdvancedOperation('square'), style: opButtonClass, span: 2 },
    { labelKey: 'calculatorButton_power' as keyof TranslationSet, symbol: 'xʸ', action: () => handleAdvancedOperation('power'), style: opButtonClass, span: 2 },
  ];


  return (
    <div className={`p-2 md:p-4 animate-fadeInUp min-h-[calc(100vh-120px)] flex flex-col justify-center ${language === 'ar' ? 'font-cairo text-right' : 'font-poppins text-left'}`}>
      <h1 className={`text-2xl md:text-3xl font-bold mb-6 text-center ${theme === 'dark' ? 'text-accent-orange' : 'text-accent-orange'}`}>
        {t('viewName_advancedCalculator')}
      </h1>
      <div className={`w-full max-w-md mx-auto p-4 sm:p-5 rounded-xl shadow-2xl ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-200'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}>
        <div className={displayClass} dir="ltr" role="status" aria-live="polite">{displayValue}</div>
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {buttons.map((btn, index) => (
            <button 
              key={index} 
              onClick={btn.action} 
              className={`${btn.style} col-span-${btn.span}`}
              aria-label={t(btn.labelKey as keyof TranslationSet)}
            >
              {btn.symbol || t(btn.labelKey as keyof TranslationSet)}
            </button>
          ))}
        </div>
      </div>
      <p className={`mt-6 text-xs text-center ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
        {language === 'ar' ? 'نصيحة فهلوانية: استخدم الآلة الحاسبة بحكمة، الأرقام مبتكدبش!' : 'Fahlawy Tip: Use the calculator wisely, numbers don\'t lie!'}
      </p>
    </div>
  );
};

export default AdvancedCalculatorView;
