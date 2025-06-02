

<<<<<<< HEAD
import React, { useState } from 'react';
import { useLanguageContext } from '../hooks/useLanguage'; // Updated path
import { ThemeContext } from '../App';
=======

import React, { useState } from 'react';
import { useLanguageContext } from '../hooks/useLanguage'; // Updated path
import { ThemeContext } from '../contexts/ThemeContext'; // Corrected import path
>>>>>>> bee2d85 (updated)

const AccidentReportView: React.FC = () => {
  const { t, language } = useLanguageContext();
  const { theme } = React.useContext(ThemeContext);
  
  const [reportDate, setReportDate] = useState('');
  const [reportLocation, setReportLocation] = useState('');
  const [reportType, setReportType] = useState('');
  const [reportDescription, setReportDescription] = useState('');

  const mockRecentReports = [
    { id: 'rep1', date: language === 'ar' ? 'أول امبارح العصرية' : 'Day before yesterday, afternoon', type: language === 'ar' ? 'انزلاق موظف بسبب بقعة زيت كنتاكي' : 'Employee slipped on a KFC oil stain', location: language === 'ar' ? 'جنب الكافيتريا الجديدة' : 'Near the new cafeteria' },
    { id: 'rep2', date: language === 'ar' ? 'الأسبوع اللي فات يوم الخميس' : 'Last week, Thursday', type: language === 'ar' ? 'قطة نامت جوه موتور المضخة (متسألش إزاي!)' : 'Cat slept inside pump motor (don\'t ask how!)', location: language === 'ar' ? 'المضخة رقم ٧٠٠ ب' : 'Pump 700B' },
  ];

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportDate || !reportLocation || !reportType || !reportDescription) {
      alert(language === 'ar' ? 'يا ريس، املى كل الخانات المهمة الأول!' : 'Boss, fill in all important fields first!');
      return;
    }
    alert(`${t('accidentReportSubmit')} - ${language === 'ar' ? 'التقرير اتسجل في الأرشيف وهنراجع الموضوع.' : 'Report logged and will be reviewed.'}`);
    setReportDate(''); setReportLocation(''); setReportType(''); setReportDescription('');
  };

  const inputBaseClasses = "w-full p-2 border rounded-md focus:ring-2";
  const lightInputClasses = "bg-slate-50 hover:bg-slate-100 border-gray-300 text-gray-800 focus:ring-red-500 focus:border-red-500 placeholder-gray-500";
  const darkInputClasses = "bg-gray-700 border-gray-600 text-gray-100 focus:ring-red-400 focus:border-red-400 placeholder-gray-400";
  const themedInputClasses = theme === 'dark' ? darkInputClasses : lightInputClasses;
  
  const submitButtonClasses = theme === 'dark' 
    ? 'bg-red-700 text-white hover:bg-red-600' 
    : 'bg-red-500 text-white hover:bg-red-600';


  return (
    <div className={`p-1 ${language === 'ar' ? 'font-cairo text-right' : 'font-poppins text-left'}`}>
      <h1 className={`text-2xl md:text-3xl font-bold mb-6 md:mb-8 ${theme === 'dark' ? 'text-bright-yellow' : 'text-marine-blue'}`}>
        {t('accidentReportTitle')}
      </h1>

      <div className={`p-5 md:p-6 rounded-xl shadow-lg mb-6 ${theme === 'dark' ? 'bg-dark-card border border-gray-700' : 'bg-white border-l-4 border-red-500'}`}>
        <h2 className={`text-lg md:text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
          {t('accidentReportFormTitle')}
        </h2>
        <form onSubmit={handleSubmitReport} className="space-y-4">
          <div>
            <label htmlFor="reportDate" className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{t('accidentReportDate')}</label>
            <input type="text" id="reportDate" value={reportDate} onChange={e => setReportDate(e.target.value)} placeholder={language === 'ar' ? "مثال: ٣٠ فبراير ٢٠٢٥" : "e.g., Feb 30, 2025"}
                   className={`${inputBaseClasses} ${themedInputClasses}`} />
          </div>
          <div>
            <label htmlFor="reportLocation" className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{t('accidentReportLocation')}</label>
            <input type="text" id="reportLocation" value={reportLocation} onChange={e => setReportLocation(e.target.value)} placeholder={language === 'ar' ? "مثال: جنب وحدة التحكم" : "e.g., Near Control Unit"}
                   className={`${inputBaseClasses} ${themedInputClasses}`} />
          </div>
          <div>
            <label htmlFor="reportType" className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{t('accidentReportType')}</label>
            <input type="text" id="reportType" value={reportType} onChange={e => setReportType(e.target.value)} placeholder={language === 'ar' ? "مثال: انزلاق، سقوط أداة" : "e.g., Slip, Dropped tool"}
                   className={`${inputBaseClasses} ${themedInputClasses}`} />
          </div>
          <div>
            <label htmlFor="reportDescription" className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{t('accidentReportDescription')}</label>
            <textarea id="reportDescription" value={reportDescription} onChange={e => setReportDescription(e.target.value)} rows={4} placeholder={language === 'ar' ? "صف الواقعة بالتفصيل يا ريس..." : "Describe the incident in detail, boss..."}
                      className={`${inputBaseClasses} ${themedInputClasses}`}></textarea>
          </div>
          <button
            type="submit"
            className={`w-full py-2.5 px-4 rounded-lg font-semibold transition-colors shadow-md transform hover:scale-105 ${submitButtonClasses}`}
          >
            {t('accidentReportSubmit')}
          </button>
        </form>
      </div>

      <div className={`p-5 md:p-6 rounded-xl shadow-lg ${theme === 'dark' ? 'bg-dark-card border border-gray-700' : 'bg-white border-l-4 border-orange-500'}`}>
        <h2 className={`text-lg md:text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
          {t('accidentReportRecent')}
        </h2>
        {mockRecentReports.length > 0 ? (
          <ul className="space-y-3 text-sm">
            {mockRecentReports.map(report => (
              <li key={report.id} className={`p-3 rounded-md ${theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-orange-50 text-orange-700'}`}>
                <strong className={`${theme === 'dark' ? 'text-orange-300' : 'text-orange-600'}`}>{report.date} - {report.location}:</strong> {report.type}
              </li>
            ))}
          </ul>
        ) : (
          <p className={`text-sm italic ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
            {t('accidentReportNoRecent')}
          </p>
        )}
      </div>

      <p className={`mt-8 md:mt-10 text-xs md:text-sm text-center ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
        {t('accidentReportFooter')}
      </p>
    </div>
  );
};

export default AccidentReportView;
