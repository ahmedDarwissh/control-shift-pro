
<<<<<<< HEAD
<<<<<<< HEAD
import React, { useContext, useState } from 'react';
import { useLanguageContext } from '../hooks/useLanguage';
import { ThemeContext, ToastContext, LoggedInUser } from '../App';
import { Firestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { LeaveRequestStatus } from '../types';

// Heroicon for Leave Request (e.g., PaperAirplaneIcon)
const PaperAirplaneIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
);

interface LeaveRequestViewProps {
  db: Firestore; 
  loggedInUser: LoggedInUser | null;
}

const LeaveRequestView: React.FC<LeaveRequestViewProps> = ({ db, loggedInUser }) => {
=======
=======
>>>>>>> 96a8f29 (First commit)
import React, { useContext, useState }from 'react';
import { useLanguageContext } from '../hooks/useLanguage';
import { ThemeContext } from '../contexts/ThemeContext'; 
import { ToastContext } from '../contexts/ToastContext'; // UPDATED IMPORT
import { LoggedInUser, LeaveRequestStatus, TranslationSet } from '../types'; 
import { PaperAirplaneIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';


interface LeaveRequestViewProps {
  loggedInUser: LoggedInUser | null;
}

const LeaveRequestView: React.FC<LeaveRequestViewProps> = ({ loggedInUser }) => {
<<<<<<< HEAD
>>>>>>> bee2d85 (updated)
=======
>>>>>>> 96a8f29 (First commit)
  const { t, language } = useLanguageContext();
  const { theme } = React.useContext(ThemeContext);
  const { addToast } = useContext(ToastContext);

  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

<<<<<<< HEAD
<<<<<<< HEAD
=======
  // Mock remaining leave days
  const mockRemainingLeaveDays = 12; 

>>>>>>> bee2d85 (updated)
=======
  // Mock remaining leave days
  const mockRemainingLeaveDays = 12; 

>>>>>>> 96a8f29 (First commit)
  const handleSubmitRequest = async () => {
    if (!loggedInUser) {
      addToast(language === 'ar' ? 'يجب تسجيل الدخول أولاً لتقديم طلب إجازة.' : 'You must be logged in to submit a leave request.', 'alert');
      return;
    }
    if (!leaveType || !startDate || !endDate || !reason) {
      addToast(language === 'ar' ? 'من فضلك املأ جميع الحقول المطلوبة.' : 'Please fill all required fields.', 'alert');
      return;
    }
    
    setIsSubmitting(true);
<<<<<<< HEAD
<<<<<<< HEAD
    try {
      const newLeaveRequest = {
        userId: loggedInUser.firebaseUid,
        leaveType,
        startDate,
        endDate,
        reason,
        status: LeaveRequestStatus.Pending,
        createdAt: serverTimestamp(), 
      };
      await addDoc(collection(db, "leaveRequests"), newLeaveRequest); 
      addToast(t('leaveRequestSubmitSuccess'), 'success');
      setLeaveType(''); setStartDate(''); setEndDate(''); setReason('');
    } catch (error: any) {
      console.error("Error submitting leave request:", error);
      let specificErrorMessage = language === 'ar' ? 'حدث خطأ أثناء تقديم الطلب. تحقق من اتصالك وحاول مرة أخرى.' : 'Error submitting request. Check your connection and try again.';
      if (error.message && error.message.toLowerCase().includes("offline") || error.code === 'unavailable') {
          specificErrorMessage = language === 'ar' ? 'لا يمكن تقديم الطلب (أنت غير متصل بالإنترنت غالباً). سيتم حفظ الطلب محلياً وإرساله عند عودة الاتصال.' : 'Cannot submit request (likely offline). Your request will be saved locally and sent when connection returns.';
      }
      addToast(specificErrorMessage, 'alert');
    } finally {
      setIsSubmitting(false);
    }
=======
=======
>>>>>>> 96a8f29 (First commit)
    setTimeout(() => {
        console.log("Mock Leave Request Submitted:", {
            userId: loggedInUser.firebaseUid || loggedInUser.id,
            leaveType,
            startDate,
            endDate,
            reason,
            status: LeaveRequestStatus.Pending,
            createdAt: new Date(), 
          });
      addToast(t('leaveRequestSubmitSuccess'), 'success');
      setLeaveType(''); setStartDate(''); setEndDate(''); setReason('');
      setIsSubmitting(false);
    }, 1000);
<<<<<<< HEAD
>>>>>>> bee2d85 (updated)
=======
>>>>>>> 96a8f29 (First commit)
  };

  const inputBaseClasses = "w-full p-3 border rounded-lg shadow-sm focus:ring-2 text-sm";
  const lightInputClasses = "bg-white border-gray-300 text-gray-800 focus:ring-blue-600 focus:border-blue-600 placeholder-gray-500";
  const darkInputClasses = "bg-gray-700 border-gray-600 text-gray-100 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400";
  const themedInputClasses = theme === 'dark' ? darkInputClasses : lightInputClasses;
  
  const pageTitleColor = theme === 'dark' ? 'text-orange-400' : 'text-orange-500';
  const cardBg = theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const labelColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
  const submitButtonClasses = `w-full mt-6 py-3 px-5 rounded-lg font-semibold transition-colors transform hover:scale-[1.02] shadow-md
    ${isSubmitting 
      ? (theme === 'dark' ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-gray-300 text-gray-500 cursor-not-allowed')
      : (theme === 'dark' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700')
    }`;


  return (
    <div className={`p-4 md:p-6 ${language === 'ar' ? 'font-cairo text-right' : 'font-poppins text-left'}`}>
      <h1 className={`text-2xl md:text-3xl font-bold mb-6 ${pageTitleColor}`}>
        {t('leaveRequestTitle')}
      </h1>
      
      <div className={`p-6 md:p-8 rounded-xl shadow-xl ${cardBg}`}>
        <div className="flex justify-center mb-6">
            <PaperAirplaneIcon className={`h-16 w-16 ${theme === 'dark' ? 'text-blue-500' : 'text-blue-600'}`} />
        </div>
<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> 96a8f29 (First commit)

        <div className={`mb-6 p-3 rounded-md text-sm text-center ${theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-blue-50 text-blue-700'}`}>
            <CalendarDaysIcon className="h-5 w-5 inline-block mr-1.5 rtl:ml-1.5"/>
            {language === 'ar' ? `رصيد الإجازات المتبقي (تجريبي): ${mockRemainingLeaveDays} أيام` : `Remaining Leave Days (Demo): ${mockRemainingLeaveDays} days`}
        </div>
<<<<<<< HEAD
>>>>>>> bee2d85 (updated)
=======
>>>>>>> 96a8f29 (First commit)
        
        <form onSubmit={(e) => { e.preventDefault(); handleSubmitRequest(); }} className="space-y-5 text-left">
          <div>
            <label htmlFor="leaveType" className={`block text-sm font-medium mb-1.5 ${labelColor}`}>{language === 'ar' ? 'نوع الإجازة' : 'Leave Type'}</label>
            <select id="leaveType" value={leaveType} onChange={e => setLeaveType(e.target.value)} 
              className={`${inputBaseClasses} ${themedInputClasses}`} required>
              <option value="">{language === 'ar' ? 'اختر النوع...' : 'Select type...'}</option>
              <option value="annual">{language === 'ar' ? 'سنوية' : 'Annual'}</option>
              <option value="sick">{language === 'ar' ? 'مرضية' : 'Sick'}</option>
              <option value="emergency">{language === 'ar' ? 'عارضة' : 'Emergency'}</option>
<<<<<<< HEAD
<<<<<<< HEAD
=======
              <option value="unpaid">{language === 'ar' ? 'بدون مرتب' : 'Unpaid'}</option>
              <option value="other">{language === 'ar' ? 'أخرى (وضح في السبب)' : 'Other (Specify in reason)'}</option>
>>>>>>> bee2d85 (updated)
=======
              <option value="unpaid">{language === 'ar' ? 'بدون مرتب' : 'Unpaid'}</option>
              <option value="other">{language === 'ar' ? 'أخرى (وضح في السبب)' : 'Other (Specify in reason)'}</option>
>>>>>>> 96a8f29 (First commit)
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="startDate" className={`block text-sm font-medium mb-1.5 ${labelColor}`}>{language === 'ar' ? 'تاريخ البدء' : 'Start Date'}</label>
              <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} 
                className={`${inputBaseClasses} ${themedInputClasses}`} required />
            </div>
            <div>
              <label htmlFor="endDate" className={`block text-sm font-medium mb-1.5 ${labelColor}`}>{language === 'ar' ? 'تاريخ الانتهاء' : 'End Date'}</label>
              <input type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} 
                className={`${inputBaseClasses} ${themedInputClasses}`} required />
            </div>
          </div>
          <div>
            <label htmlFor="reason" className={`block text-sm font-medium mb-1.5 ${labelColor}`}>{language === 'ar' ? 'السبب' : 'Reason'}</label>
            <textarea id="reason" value={reason} onChange={e => setReason(e.target.value)} rows={4} 
              className={`${inputBaseClasses} ${themedInputClasses}`}
              placeholder={language === 'ar' ? 'اكتب سبب طلب الإجازة...' : 'Enter reason for leave...'} required></textarea>
          </div>
          <button 
            type="submit"
            disabled={isSubmitting}
            className={submitButtonClasses}
          >
            {isSubmitting ? (language === 'ar' ? 'جاري الإرسال...' : 'Submitting...') : (language === 'ar' ? 'قدم طلب الإجازة' : 'Submit Leave Request')}
          </button>
        </form>
      </div>

      <p className={`mt-8 text-xs md:text-sm text-center ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
        {t('leaveRequestDescription')}
      </p>
    </div>
  );
};

export default LeaveRequestView;