
import React, { useContext } from 'react';
import { useLanguageContext } from '../../../hooks/useLanguage';
import { ThemeContext } from '../../../contexts/ThemeContext';
import { TranslationSet } from '../../../types';
import { ChevronDownIcon, ArrowPathIcon as RefreshIcon } from '@heroicons/react/24/outline'; // Ensured this line is correct

export interface SubSectionCardProps {
  titleKey: keyof TranslationSet;
  icon?: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  isLoading?: boolean;
}

export const SubSectionCard: React.FC<SubSectionCardProps> = ({ titleKey, icon, isOpen, onToggle, children, isLoading }) => {
  const { t, language } = useLanguageContext();
  const { theme } = useContext(ThemeContext);

  const headerBg = theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200';
  const headerTextColor = theme === 'dark' ? 'text-gray-100' : 'text-gray-800';
  const iconColor = theme === 'dark' ? 'text-bright-yellow' : 'text-marine-blue';
  const contentBg = theme === 'dark' ? 'bg-dark-card' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-gray-600' : 'border-gray-300';

  return (
    <div className={`mb-4 rounded-lg shadow-md border ${borderColor} overflow-hidden transition-all duration-300`}>
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between p-3 md:p-4 text-left ${headerBg} ${headerTextColor} transition-colors`}
        aria-expanded={isOpen}
        aria-controls={`subsection-${String(titleKey)}`}
      >
        <div className="flex items-center">
          {icon && <span className={`w-5 h-5 ${language === 'ar' ? 'ml-3' : 'mr-3'} ${iconColor}`}>{icon}</span>}
          <h3 className="text-md md:text-lg font-semibold">{t(titleKey)}</h3>
        </div>
        {isLoading ? (
          <RefreshIcon className="w-5 h-5 animate-spin text-gray-500" />
        ) : (
          <ChevronDownIcon className={`w-5 h-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        )}
      </button>
      {isOpen && (
        <div id={`subsection-${String(titleKey)}`} className={`p-3 md:p-4 ${contentBg} border-t ${borderColor} animate-fadeInUp`}>
          {children}
        </div>
      )}
    </div>
  );
};

// Confirm Delete Modal Props
export interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isOpen, title, message, onConfirm, onCancel }) => {
  const { t } = useLanguageContext();
  const { theme } = useContext(ThemeContext);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fadeInUp">
      <div className={`p-6 rounded-lg shadow-xl w-full max-w-sm ${theme === 'dark' ? 'bg-dark-card text-white' : 'bg-white text-black'}`}>
        <h3 className="text-lg font-semibold mb-3">{title}</h3>
        <p className="text-sm mb-4">{message}</p>
        <div className="flex justify-end space-x-3 rtl:space-x-reverse">
          <button
            onClick={onCancel}
            className={`py-2 px-4 rounded text-sm font-medium transition-colors ${theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
          >
            {t('profileCancelButton')}
          </button>
          <button
            onClick={onConfirm}
            className={`py-2 px-4 rounded text-sm font-medium transition-colors ${theme === 'dark' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}`}
          >
            {t('deleteAction')}
          </button>
        </div>
      </div>
    </div>
  );
};
