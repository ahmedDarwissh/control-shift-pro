
import React from 'react';
import { useLanguageContext } from '../hooks/useLanguage';
import { ThemeContext } from '../contexts/ThemeContext';
import { AcademicCapIcon } from '@heroicons/react/24/outline';

const TrainingCoursesView: React.FC = () => {
  const { t, language } = useLanguageContext();
  const { theme } = React.useContext(ThemeContext);

  const textColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
  const titleColor = theme === 'dark' ? 'text-orange-400' : 'text-orange-500';
  const iconColor = theme === 'dark' ? 'text-blue-500' : 'text-blue-600';
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';

  return (
    <div className={`flex flex-col items-center justify-center h-full p-6 text-center ${language === 'ar' ? 'font-cairo' : 'font-poppins'} animate-fadeInUp`}>
      <div className={`p-8 md:p-12 rounded-xl shadow-2xl ${cardBg} max-w-lg w-full`}>
        <AcademicCapIcon className={`h-20 w-20 md:h-24 md:w-24 mx-auto mb-6 ${iconColor}`} />
        <h1 className={`text-2xl md:text-3xl font-bold mb-3 ${titleColor}`}>
          {t('viewName_trainingCourses')}
        </h1>
        <p className={`text-md md:text-lg ${textColor}`}>
          {language === 'ar' ? 'مرحباً بك في قسم الدورات التدريبية! هنا ستجد أحدث الدورات لتعزيز مهاراتك الفهلوية.' : 'Welcome to the Training Courses section! Here you will find the latest courses to enhance your Fahlawy skills.'}
        </p>
        <p className={`text-xs mt-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
          {language === 'ar' ? 'جاري العمل على إضافة محتوى الدورات. ترقبوا كل جديد!' : 'Course content is currently being developed. Stay tuned for updates!'}
        </p>
      </div>
    </div>
  );
};

export default TrainingCoursesView;