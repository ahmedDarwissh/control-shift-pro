

<<<<<<< HEAD
<<<<<<< HEAD
import React from 'react';
import { useLanguageContext } from '../hooks/useLanguage'; // Updated path
import { ThemeContext } from '../App';
=======
=======
>>>>>>> 96a8f29 (First commit)

import React from 'react';
import { useLanguageContext } from '../hooks/useLanguage'; // Updated path
import { ThemeContext } from '../contexts/ThemeContext'; // Corrected import path
<<<<<<< HEAD
>>>>>>> bee2d85 (updated)
=======
>>>>>>> 96a8f29 (First commit)

const PreventiveMaintenanceView: React.FC = () => {
  const { t, language } = useLanguageContext();
  const { theme } = React.useContext(ThemeContext);

  const mockEquipment = [
    { id: 'equip1', name: language === 'ar' ? 'مضخة الديزل العملاقة موديل ألفين وحتحتك' : 'Giant Diesel Pump Model 2000-and-something' },
    { id: 'equip2', name: language === 'ar' ? 'كمبروسر الهوا النفاث أبو صوت عالي' : 'Jet Air Compressor (The Loud One)' },
    { id: 'equip3', name: language === 'ar' ? 'مولد الكهربا الاحتياطي (أبو نفس طويل)' : 'Backup Generator (The Enduring One)' },
    { id: 'equip4', name: language === 'ar' ? 'فلتر الزيت بتاع السفينة "أم الخير"' : 'Oil Filter for "Om El Kheir" Ship' },
  ];

  const mockUpcomingMaintenance = [
    { id: 'maint1', equipmentName: mockEquipment[0].name, date: language === 'ar' ? 'بكرة الساعة شاي العصاري' : 'Tomorrow, Tea Time', status: language === 'ar' ? 'متجدولة ومستنية الأسطى' : 'Scheduled & Waiting' },
    { id: 'maint2', equipmentName: mockEquipment[2].name, date: language === 'ar' ? 'الأسبوع الجاي (لو ربنا أراد)' : 'Next Week (God Willing)', status: language === 'ar' ? 'قطع الغيار لسه في السكة' : 'Parts on the Way' },
  ];

  const handleScheduleMaintenance = (equipmentName: string) => {
    alert(`${t('preventiveMaintenanceScheduleMaintenance')} ${language === 'ar' ? 'لـ' : 'for'} ${equipmentName} - ${language === 'ar' ? 'جاري تحديد معاد صيانة بس اصبر علينا شوية!' : 'Scheduling in progress, hang tight!'}`);
  };

  const buttonClasses = `py-1.5 px-3 rounded-md text-xs font-medium transition-colors w-full sm:w-auto ${theme === 'dark' ? 'bg-bright-yellow text-marine-blue hover:bg-yellow-300' : 'bg-bright-yellow text-marine-blue hover:bg-yellow-400'}`;

  return (
    <div className={`p-1 ${language === 'ar' ? 'font-cairo text-right' : 'font-poppins text-left'}`}>
      <h1 className={`text-2xl md:text-3xl font-bold mb-6 md:mb-8 ${theme === 'dark' ? 'text-bright-yellow' : 'text-marine-blue'}`}>
        {t('preventiveMaintenanceTitle')}
      </h1>

      <div className={`p-5 md:p-6 rounded-xl shadow-lg mb-6 ${theme === 'dark' ? 'bg-dark-card border border-gray-700' : 'bg-white border-l-4 border-marine-blue'}`}>
        <h2 className={`text-lg md:text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
          {t('preventiveMaintenanceEquipmentList')}
        </h2>
        <div className="space-y-3">
          {mockEquipment.map(equip => (
            <div key={equip.id} className={`p-3 rounded-md flex flex-col sm:flex-row justify-between items-start sm:items-center ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-slate-50 hover:bg-gray-100'}`}>
              <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2 sm:mb-0`}>{equip.name}</span>
              <button
                onClick={() => handleScheduleMaintenance(equip.name)}
                className={buttonClasses}
              >
                {t('preventiveMaintenanceScheduleMaintenance')}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className={`p-5 md:p-6 rounded-xl shadow-lg ${theme === 'dark' ? 'bg-dark-card border border-gray-700' : 'bg-white border-l-4 border-yellow-500'}`}>
        <h2 className={`text-lg md:text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
          {t('preventiveMaintenanceUpcoming')}
        </h2>
        {mockUpcomingMaintenance.length > 0 ? (
          <ul className="space-y-2 text-sm">
            {mockUpcomingMaintenance.map(maint => (
              <li key={maint.id} className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-yellow-50 text-yellow-700'}`}>
                <strong>{maint.equipmentName}</strong> - {maint.date} ({maint.status})
              </li>
            ))}
          </ul>
        ) : (
          <p className={`text-sm italic ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
            {t('preventiveMaintenanceNoUpcoming')}
          </p>
        )}
      </div>

      <p className={`mt-8 md:mt-10 text-xs md:text-sm text-center ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
        {t('preventiveMaintenanceFooter')}
      </p>
    </div>
  );
};

export default PreventiveMaintenanceView;
