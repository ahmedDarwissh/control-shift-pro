
import React from 'react';
import { useLanguageContext } from '../hooks/useLanguage';
import { ThemeContext } from '../App';

// Heroicon for error indication
const ExclamationTriangleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
  </svg>
);

interface ErrorModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ isOpen, title, message, onClose }) => {
  const { t, language } = useLanguageContext();
  const { theme } = React.useContext(ThemeContext);

  if (!isOpen) return null;

  const modalBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const titleColor = theme === 'dark' ? 'text-red-400' : 'text-red-600';
  const textColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
  const buttonBg = theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300';
  const buttonText = theme === 'dark' ? 'text-gray-200' : 'text-gray-700';

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 transition-opacity duration-300 ease-in-out"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="error-modal-title"
      aria-describedby="error-modal-message"
      onClick={onClose} // Close on overlay click
    >
      <div 
        className={`w-full max-w-md p-6 rounded-xl shadow-2xl transform transition-all duration-300 ease-in-out scale-100 ${modalBg} ${language === 'ar' ? 'font-cairo' : 'font-poppins'}`}
        onClick={(e) => e.stopPropagation()} // Prevent close on modal content click
      >
        <div className="flex flex-col items-center text-center">
          <ExclamationTriangleIcon className={`h-12 w-12 mb-4 ${titleColor}`} />
          <h2 id="error-modal-title" className={`text-xl font-semibold mb-2 ${titleColor}`}>
            {title || t('errorModalDefaultTitle')}
          </h2>
          <p id="error-modal-message" className={`text-sm mb-6 ${textColor}`}>
            {message}
          </p>
          <button
            onClick={onClose}
            className={`w-full sm:w-auto py-2.5 px-6 rounded-lg font-medium text-sm transition-colors ${buttonBg} ${buttonText} shadow-md hover:shadow-lg`}
            aria-label={t('errorModalCloseButton')}
          >
            {t('errorModalCloseButton')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
