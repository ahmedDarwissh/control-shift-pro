
import React, { useState, FormEvent, useContext } from 'react';
import { useLanguageContext } from '../hooks/useLanguage';
import { ThemeContext } from '../contexts/ThemeContext';
import { ToastContext } from '../contexts/ToastContext';
import { ChemicalReferenceItem } from '../types';
import { MOCK_CHEMICAL_REFERENCES } from '../constants';
import { BeakerIcon, PlusCircleIcon, TrashIcon, LinkIcon } from '@heroicons/react/24/outline';

const ChemicalReferenceView: React.FC = () => {
  const { t, language } = useLanguageContext();
  const { theme } = useContext(ThemeContext);
  const { addToast } = useContext(ToastContext);

  const [chemicals, setChemicals] = useState<ChemicalReferenceItem[]>(MOCK_CHEMICAL_REFERENCES);
  const [chemicalName, setChemicalName] = useState('');
  const [casNumber, setCasNumber] = useState('');
  const [sdsUrl, setSdsUrl] = useState('');
  const [hazards, setHazards] = useState(''); // Comma-separated
  const [firstAid, setFirstAid] = useState(''); // Comma-separated
  const [ppe, setPpe] = useState(''); // Comma-separated
  const [storageInfo, setStorageInfo] = useState('');
  const [disposalInfo, setDisposalInfo] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!chemicalName.trim() || !hazards.trim() || !firstAid.trim() || !ppe.trim()) {
      addToast(t('loginFailedError' as any, language === 'ar' ? 'اسم المادة، المخاطر، الإسعافات، والوقاية الشخصية حقول إلزامية.' : 'Chemical name, hazards, first aid, and PPE are required fields.'), 'alert');
      return;
    }
    setIsSubmitting(true);
    const newChemical: ChemicalReferenceItem = {
      id: `chem-${Date.now()}`,
      chemicalName,
      casNumber: casNumber.trim() || undefined,
      sdsUrl: sdsUrl.trim() || undefined,
      hazards: hazards.split(',').map(s => s.trim()).filter(s => s),
      firstAid: firstAid.split(',').map(s => s.trim()).filter(s => s),
      ppe: ppe.split(',').map(s => s.trim()).filter(s => s),
      storageInfo: storageInfo.trim() || undefined,
      disposalInfo: disposalInfo.trim() || undefined,
      lastUpdated: new Date(),
    };
    setTimeout(() => {
      setChemicals(prev => [newChemical, ...prev]);
      addToast(t('chemicalReferenceAddChemical') + ' ' + t('statusSuccessMessage'), 'success');
      setChemicalName(''); setCasNumber(''); setSdsUrl(''); setHazards(''); setFirstAid(''); setPpe(''); setStorageInfo(''); setDisposalInfo('');
      setIsSubmitting(false);
    }, 500);
  };

  const handleDeleteChemical = (id: string) => {
    if (window.confirm(t('confirmDeletePersonalTask' as any, language === 'ar' ? "متأكد عايز تمسح بيانات المادة دي؟" : "Sure you want to delete this chemical data?"))) {
      setChemicals(prev => prev.filter(chem => chem.id !== id));
      addToast(t('personalTaskDeletedSuccess' as any, language === 'ar' ? 'تم حذف بيانات المادة!' : 'Chemical data deleted!'), 'info');
    }
  };

  const pageTitleColor = theme === 'dark' ? 'text-accent-orange' : 'text-accent-orange';
  const cardBg = theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const textColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
  const inputBaseClasses = "w-full p-3 border rounded-lg shadow-sm focus:ring-2 text-sm";
  const themedInputClasses = theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-600 focus:border-blue-600 placeholder-gray-400';
  const labelClass = `block text-sm font-medium mb-1.5 ${textColor}`;
  const submitButtonClasses = `py-3 px-5 rounded-lg font-semibold transition-colors transform hover:scale-[1.02] shadow-md text-sm flex items-center justify-center gap-2
    ${isSubmitting ? (theme === 'dark' ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-gray-300 text-gray-500 cursor-not-allowed')
                   : (theme === 'dark' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700')}`;

  return (
    <div className={`p-2 md:p-4 animate-fadeInUp ${language === 'ar' ? 'font-cairo' : 'font-poppins'}`}>
      <div className="flex items-center mb-6">
        <BeakerIcon className={`h-8 w-8 ${pageTitleColor} ${language === 'ar' ? 'ml-3' : 'mr-3'}`} />
        <h1 className={`text-2xl md:text-3xl font-bold ${pageTitleColor}`}>
          {t('chemicalReferenceTitle')}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className={`p-5 md:p-6 rounded-xl shadow-xl mb-6 ${cardBg} border`}>
        <h2 className={`text-xl font-semibold mb-4 ${textColor}`}>{t('chemicalReferenceAddChemical')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="chemName" className={labelClass}>{t('chemicalReferenceChemicalName')}*</label>
            <input type="text" id="chemName" value={chemicalName} onChange={e => setChemicalName(e.target.value)} className={`${inputBaseClasses} ${themedInputClasses}`} required />
          </div>
          <div>
            <label htmlFor="chemCAS" className={labelClass}>{t('chemicalReferenceCASNumber')}</label>
            <input type="text" id="chemCAS" value={casNumber} onChange={e => setCasNumber(e.target.value)} className={`${inputBaseClasses} ${themedInputClasses}`} />
          </div>
        </div>
        <div className="mb-4">
            <label htmlFor="chemSDS" className={labelClass}>{t('chemicalReferenceSDSUrl')}</label>
            <input type="url" id="chemSDS" value={sdsUrl} onChange={e => setSdsUrl(e.target.value)} placeholder="https://example.com/sds.pdf" className={`${inputBaseClasses} ${themedInputClasses}`} />
        </div>
        <div className="mb-4">
          <label htmlFor="chemHazards" className={labelClass}>{t('chemicalReferenceHazards')}* ({language === 'ar' ? 'افصل بفاصلة' : 'Comma-separated'})</label>
          <textarea id="chemHazards" value={hazards} onChange={e => setHazards(e.target.value)} rows={2} className={`${inputBaseClasses} ${themedInputClasses}`} required />
        </div>
        <div className="mb-4">
          <label htmlFor="chemFirstAid" className={labelClass}>{t('chemicalReferenceFirstAid')}* ({language === 'ar' ? 'افصل بفاصلة' : 'Comma-separated'})</label>
          <textarea id="chemFirstAid" value={firstAid} onChange={e => setFirstAid(e.target.value)} rows={2} className={`${inputBaseClasses} ${themedInputClasses}`} required />
        </div>
        <div className="mb-4">
          <label htmlFor="chemPPE" className={labelClass}>{t('chemicalReferencePPE')}* ({language === 'ar' ? 'افصل بفاصلة' : 'Comma-separated'})</label>
          <textarea id="chemPPE" value={ppe} onChange={e => setPpe(e.target.value)} rows={2} className={`${inputBaseClasses} ${themedInputClasses}`} required />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
                <label htmlFor="chemStorage" className={labelClass}>{t('chemicalReferenceStorageInfo')}</label>
                <textarea id="chemStorage" value={storageInfo} onChange={e => setStorageInfo(e.target.value)} rows={2} className={`${inputBaseClasses} ${themedInputClasses}`} />
            </div>
            <div>
                <label htmlFor="chemDisposal" className={labelClass}>{t('chemicalReferenceDisposalInfo')}</label>
                <textarea id="chemDisposal" value={disposalInfo} onChange={e => setDisposalInfo(e.target.value)} rows={2} className={`${inputBaseClasses} ${themedInputClasses}`} />
            </div>
        </div>
        <button type="submit" className={submitButtonClasses} disabled={isSubmitting}>
          <PlusCircleIcon className="h-5 w-5" />
          {isSubmitting ? (language === 'ar' ? 'جاري الإضافة...' : 'Adding...') : t('chemicalReferenceAddChemical')}
        </button>
      </form>

      {chemicals.length === 0 ? (
        <div className={`p-5 md:p-6 rounded-xl shadow-xl ${cardBg} border text-center`}>
            <p className={`${textColor} text-lg`}>{t('chemicalReferenceNoChemicals')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {chemicals.map(chem => (
            <div key={chem.id} className={`p-4 rounded-lg shadow-md ${cardBg} border`}>
              <div className="flex justify-between items-start mb-2">
                <h3 className={`text-md font-semibold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>{chem.chemicalName} {chem.casNumber && `(${chem.casNumber})`}</h3>
                <button onClick={() => handleDeleteChemical(chem.id)} className={`p-1.5 rounded-md text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors`} title={t('deleteAction')}>
                    <TrashIcon className="h-4 w-4" />
                </button>
              </div>
              <div className="text-xs space-y-1.5">
                <p><strong>{t('chemicalReferenceHazards')}:</strong> {chem.hazards.join(', ')}</p>
                <p><strong>{t('chemicalReferenceFirstAid')}:</strong> {chem.firstAid.join(', ')}</p>
                <p><strong>{t('chemicalReferencePPE')}:</strong> {chem.ppe.join(', ')}</p>
                {chem.storageInfo && <p><strong>{t('chemicalReferenceStorageInfo')}:</strong> {chem.storageInfo}</p>}
                {chem.disposalInfo && <p><strong>{t('chemicalReferenceDisposalInfo')}:</strong> {chem.disposalInfo}</p>}
                {chem.sdsUrl && <p><strong>{t('chemicalReferenceSDSUrl')}:</strong> <a href={chem.sdsUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline"><LinkIcon className="h-3 w-3 inline-block mr-1"/>Link</a></p>}
                 <p className={`${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Last Updated: {new Date(chem.lastUpdated).toLocaleDateString(language)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChemicalReferenceView;
