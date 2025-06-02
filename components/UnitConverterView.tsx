
import React, { useState, FormEvent, useContext } from 'react';
import { useLanguageContext } from '../hooks/useLanguage';
import { ThemeContext } from '../contexts/ThemeContext';
import { ToastContext } from '../contexts/ToastContext';
import { UnitConversionDefinition, UnitConversionItem } from '../types';
import { UNIT_CONVERSION_DEFINITIONS } from '../constants';
import { VariableIcon, ArrowsRightLeftIcon, TrashIcon } from '@heroicons/react/24/outline';

const UnitConverterView: React.FC = () => {
  const { t, language, translations } = useLanguageContext();
  const { theme } = useContext(ThemeContext);
  const { addToast } = useContext(ToastContext);

  const [conversionHistory, setConversionHistory] = useState<UnitConversionItem[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [fromUnit, setFromUnit] = useState<string>(UNIT_CONVERSION_DEFINITIONS[0]?.id || 'psi_to_bar');
  const [toUnit, setToUnit] = useState<string>(UNIT_CONVERSION_DEFINITIONS[0]?.toUnit || 'bar'); // Not directly used for selection, derived from fromUnit
  const [result, setResult] = useState<string | null>(null);

  const availableCategories = Array.from(new Set(UNIT_CONVERSION_DEFINITIONS.map(def => def.category)));
  const [selectedCategory, setSelectedCategory] = useState<string>(availableCategories[0] || 'Pressure');

  const filteredDefinitions = UNIT_CONVERSION_DEFINITIONS.filter(def => def.category === selectedCategory);
  
  React.useEffect(() => { // Update fromUnit if category changes and current fromUnit is not in new category
    if (!filteredDefinitions.find(def => def.id === fromUnit)) {
      setFromUnit(filteredDefinitions[0]?.id || '');
    }
  }, [selectedCategory, filteredDefinitions, fromUnit]);


  const handleConvert = (e: FormEvent) => {
    e.preventDefault();
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      addToast(t('calculatorErrorInvalidInput' as any, language === 'ar' ? 'أدخل قيمة رقمية صحيحة للتحويل.' : 'Enter a valid numeric value to convert.'), 'alert');
      setResult(null);
      return;
    }

    const definition = UNIT_CONVERSION_DEFINITIONS.find(def => def.id === fromUnit);
    if (!definition) {
      addToast(language === 'ar' ? 'تعريف التحويل غير موجود.' : 'Conversion definition not found.', 'alert');
      setResult(null);
      return;
    }

    let convertedValue: number;
    if (definition.fromUnit === '°C' && definition.toUnit === '°F') {
      convertedValue = (value * 9/5) + 32;
    } else if (definition.fromUnit === '°F' && definition.toUnit === '°C') {
      convertedValue = (value - 32) * 5/9;
    } else {
      convertedValue = value * definition.factor;
    }
    
    const resultString = `${convertedValue.toLocaleString(language, {maximumFractionDigits: 4})} ${definition.toUnit}`;
    setResult(resultString);

    const historyEntry: UnitConversionItem = {
      id: `conv-${Date.now()}`,
      fromUnit: definition.fromUnit,
      toUnit: definition.toUnit,
      value: value,
      result: convertedValue,
      timestamp: new Date()
    };
    setConversionHistory(prev => [historyEntry, ...prev.slice(0, 9)]); // Keep last 10
  };

  const handleSwapUnits = () => {
    const currentDef = UNIT_CONVERSION_DEFINITIONS.find(def => def.id === fromUnit);
    if (currentDef) {
      const oppositeDef = UNIT_CONVERSION_DEFINITIONS.find(def => def.fromUnit === currentDef.toUnit && def.toUnit === currentDef.fromUnit && def.category === currentDef.category);
      if (oppositeDef) {
        setFromUnit(oppositeDef.id);
        // Swap input and result if possible
        if (result && inputValue) {
            const currentResultVal = parseFloat(result.split(' ')[0]);
            if(!isNaN(currentResultVal)) {
                setInputValue(String(currentResultVal));
                const newInputValue = parseFloat(inputValue);
                if(!isNaN(newInputValue)) {
                     let newConvertedValue: number;
                     if (oppositeDef.fromUnit === '°C' && oppositeDef.toUnit === '°F') newConvertedValue = (newInputValue * 9/5) + 32;
                     else if (oppositeDef.fromUnit === '°F' && oppositeDef.toUnit === '°C') newConvertedValue = (newInputValue - 32) * 5/9;
                     else newConvertedValue = newInputValue * oppositeDef.factor;
                     setResult(`${newConvertedValue.toLocaleString(language, {maximumFractionDigits: 4})} ${oppositeDef.toUnit}`);
                } else { setResult(null); }
            } else { setResult(null); }
        } else { setResult(null); }
      } else {
        addToast(language === 'ar' ? 'لا يوجد تحويل عكسي مباشر متاح.' : 'No direct reverse conversion available.', 'info');
      }
    }
  };

  const clearHistory = () => {
    setConversionHistory([]);
    addToast(t('unitConverterClearHistory') + ' ' + t('statusSuccessMessage'), 'info');
  };

  const pageTitleColor = theme === 'dark' ? 'text-accent-orange' : 'text-accent-orange';
  const cardBg = theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const textColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
  const inputBaseClasses = "w-full p-3 border rounded-lg shadow-sm focus:ring-2 text-sm";
  const themedInputClasses = theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-600 focus:border-blue-600 placeholder-gray-400';
  const labelClass = `block text-sm font-medium mb-1.5 ${textColor}`;
  const submitButtonClasses = `py-3 px-5 rounded-lg font-semibold transition-colors transform hover:scale-[1.02] shadow-md text-sm flex items-center justify-center gap-2 ${theme === 'dark' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`;
  const secondaryButtonClasses = `py-2 px-3 rounded-lg font-medium text-xs transition-colors shadow-sm hover:shadow-md ${theme === 'dark' ? 'bg-gray-600 text-gray-200 hover:bg-gray-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`;

  return (
    <div className={`p-2 md:p-4 animate-fadeInUp ${language === 'ar' ? 'font-cairo' : 'font-poppins'}`}>
      <div className="flex items-center mb-6">
        <VariableIcon className={`h-8 w-8 ${pageTitleColor} ${language === 'ar' ? 'ml-3' : 'mr-3'}`} />
        <h1 className={`text-2xl md:text-3xl font-bold ${pageTitleColor}`}>
          {t('unitConverterTitle')}
        </h1>
      </div>

      <form onSubmit={handleConvert} className={`p-5 md:p-6 rounded-xl shadow-xl mb-6 ${cardBg} border`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="ucCategory" className={labelClass}>{t('unitConverterCategory')}</label>
            <select id="ucCategory" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className={`${inputBaseClasses} ${themedInputClasses}`}>
              {availableCategories.map(cat => <option key={cat} value={cat}>{translations.unitCategoryOptions[cat as keyof typeof translations.unitCategoryOptions] || cat}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label htmlFor="ucFromUnit" className={labelClass}>{t('unitConverterFromUnit')}</label>
            <select id="ucFromUnit" value={fromUnit} onChange={e => setFromUnit(e.target.value)} className={`${inputBaseClasses} ${themedInputClasses}`}>
              {filteredDefinitions.map(def => (
                <option key={def.id} value={def.id}>{def.fromUnit} &rarr; {def.toUnit}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-end gap-4 mb-4">
          <div className="flex-grow">
            <label htmlFor="ucValue" className={labelClass}>{t('unitConverterValue')}</label>
            <input type="number" id="ucValue" value={inputValue} onChange={e => setInputValue(e.target.value)} className={`${inputBaseClasses} ${themedInputClasses}`} step="any" required />
          </div>
          <button type="button" onClick={handleSwapUnits} className={`${secondaryButtonClasses} !py-3`} title={t('unitConverterSwapUnits')}>
            <ArrowsRightLeftIcon className="h-5 w-5" />
          </button>
        </div>
        <button type="submit" className={`${submitButtonClasses} w-full`}>{t('unitConverterTitle')}</button>
        
        {result && (
          <div className={`mt-4 p-3 rounded-lg text-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <span className={`text-lg font-semibold ${textColor}`}>{t('unitConverterResult')}: </span>
            <span className={`text-xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>{result}</span>
          </div>
        )}
      </form>

      {conversionHistory.length > 0 && (
        <div className={`p-5 md:p-6 rounded-xl shadow-xl ${cardBg} border`}>
          <div className="flex justify-between items-center mb-3">
            <h2 className={`text-lg font-semibold ${textColor}`}>{t('unitConverterConversionHistory')}</h2>
            <button onClick={clearHistory} className={`${secondaryButtonClasses} !text-red-500 dark:!text-red-400 hover:!bg-red-100 dark:hover:!bg-red-700/30`}><TrashIcon className="h-4 w-4 inline mr-1"/>{t('unitConverterClearHistory')}</button>
          </div>
          <ul className="space-y-2 max-h-60 overflow-y-auto">
            {conversionHistory.map(item => (
              <li key={item.id} className={`p-2 text-xs rounded-md ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                {item.value.toLocaleString(language)} {item.fromUnit} &rarr; {item.result.toLocaleString(language, {maximumFractionDigits: 4})} {item.toUnit}
                <span className={`block text-[10px] ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>{new Date(item.timestamp).toLocaleTimeString(language)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
       <p className={`mt-6 text-xs text-center ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
        {language === 'ar' ? 'تحويلات دقيقة لفهلوة مظبوطة!' : 'Accurate conversions for precise fahlawa!'}
      </p>
    </div>
  );
};

export default UnitConverterView;
