
import React, { useState, FormEvent, useContext, useMemo, useEffect, useRef } from 'react';
import { useLanguageContext } from '../hooks/useLanguage'; // Corrected path
import {
  LoggedInUser,
  TranslationSet
  // Other types specific to PersonalHub if any, but mostly handled in subsections
} from '../types'; // Corrected path
import { ThemeContext } from '../contexts/ThemeContext'; // Corrected path
import { ToastContext } from '../contexts/ToastContext'; // Corrected path, assuming ToastContext is exported from here after refactor

// Heroicons (ensure all listed are imported)
import {
  TrashIcon, PlusCircleIcon, CalendarDaysIcon, ClockIcon, ArrowPathIcon as RefreshIcon, TagIcon,
  ExclamationTriangleIcon, ArrowUpIcon, ArrowSmallUpIcon, Bars3BottomLeftIcon, ChartPieIcon,
  ChevronDownIcon, ChevronUpIcon, MagnifyingGlassIcon, XCircleIcon, BellIcon, BellAlertIcon,
  BuildingStorefrontIcon, ChevronLeftIcon, ChevronRightIcon,
  CurrencyDollarIcon, ArrowTrendingUpIcon, PencilIcon, CheckCircleIcon, XMarkIcon, BanknotesIcon, WalletIcon, ReceiptPercentIcon, DocumentTextIcon, CreditCardIcon, LightBulbIcon,
  HeartIcon, BoltIcon, AdjustmentsHorizontalIcon, FireIcon, BeakerIcon, MoonIcon, ClipboardDocumentListIcon, PresentationChartLineIcon, ListBulletIcon, CakeIcon, ChartBarIcon,
  HomeModernIcon, ShoppingCartIcon, InboxStackIcon, SunIcon, WrenchScrewdriverIcon, CpuChipIcon, InformationCircleIcon, LinkIcon, ArrowDownTrayIcon,
  TruckIcon, MapIcon, Cog6ToothIcon, MapPinIcon, PaperAirplaneIcon, IdentificationIcon, SparklesIcon, VariableIcon
} from '@heroicons/react/24/outline'; // Completed import

// Import sub-sections
import PersonalFinanceSection from './personal_hub/PersonalFinanceSection';
import HealthFitnessSection from './personal_hub/HealthFitnessSection';
import HomeManagementSection from './personal_hub/HomeManagementSection';
import CarManagementSection from './personal_hub/CarManagementSection';
import { TravelTripsSection } from './personal_hub/TravelTripsSection';

// Import common components for Personal Hub
import { SubSectionCard, ConfirmDeleteModal, SubSectionCardProps, ConfirmDeleteModalProps } from './personal_hub/common/HubComponents';


// Props for PersonalHubView
interface PersonalHubViewProps {
  loggedInUser: LoggedInUser | null;
}


const PersonalHubView: React.FC<PersonalHubViewProps> = ({ loggedInUser }) => {
  const { t, language } = useLanguageContext();
  const { theme } = useContext(ThemeContext);

  const [confirmModal, setConfirmModal] = useState<{isOpen: boolean; titleKey: keyof TranslationSet; messageKey: keyof TranslationSet; onConfirmAction: () => void}>({
    isOpen: false, titleKey: 'confirmAction', messageKey: 'confirmAction', onConfirmAction: () => {}
  });

  const showConfirmDelete = (titleKey: keyof TranslationSet, messageKey: keyof TranslationSet, onConfirmAction: () => void) => {
    setConfirmModal({isOpen: true, titleKey, messageKey, onConfirmAction});
  };

  const handleConfirm = () => {
    confirmModal.onConfirmAction();
    setConfirmModal(prev => ({...prev, isOpen: false}));
  };

  const handleCancel = () => {
    setConfirmModal(prev => ({...prev, isOpen: false}));
  };

  if (!loggedInUser) {
    return <div className="p-4 text-center">{t('loginRequired' as any, 'Please log in to view your personal hub, Fahlawy!')}</div>;
  }

  // Define the main sections to be rendered in the Personal Hub
  const mainHubSections = [
    { 
      key: 'finance', 
      Component: PersonalFinanceSection, 
      icon: <CurrencyDollarIcon className="w-6 h-6" />, 
      titleKey: 'personalFinanceTitle' as keyof TranslationSet
    },
    { 
      key: 'health', 
      Component: HealthFitnessSection, 
      icon: <HeartIcon className="w-6 h-6" />,
      titleKey: 'healthFitnessTitle' as keyof TranslationSet
    },
    { 
      key: 'homeMgmt', 
      Component: HomeManagementSection, 
      icon: <HomeModernIcon className="w-6 h-6" />,
      titleKey: 'homeManagementTitle' as keyof TranslationSet
    },
    { 
      key: 'carMgmt', 
      Component: CarManagementSection, 
      icon: <TruckIcon className="w-6 h-6" />,
      titleKey: 'carManagementTitle' as keyof TranslationSet
    },
    { 
      key: 'travel', 
      Component: TravelTripsSection, 
      icon: <PaperAirplaneIcon className="w-6 h-6" />,
      titleKey: 'travelAndTripsTitle' as keyof TranslationSet
    },
  ];
  
  const [expandedTopLevelSection, setExpandedTopLevelSection] = useState<string | null>(mainHubSections[0]?.key || null);


  return (
    <div className={`p-2 md:p-4 animate-fadeInUp ${language === 'ar' ? 'font-cairo' : 'font-poppins'}`}>
      <h1 className={`text-2xl md:text-3xl font-bold mb-6 text-center ${theme === 'dark' ? 'text-bright-yellow' : 'text-marine-blue'}`}>
        {t('personalHubTitle')}
      </h1>

      <div className="space-y-6">
        {mainHubSections.map(section => (
          <div key={section.key} className={`rounded-xl shadow-lg overflow-hidden ${theme === 'dark' ? 'bg-dark-card border border-gray-700' : 'bg-white border border-gray-200'}`}>
             <button
                onClick={() => setExpandedTopLevelSection(expandedTopLevelSection === section.key ? null : section.key)}
                className={`w-full flex items-center justify-between p-4 md:p-5 text-left transition-colors ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-gray-100' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
                aria-expanded={expandedTopLevelSection === section.key}
                aria-controls={`toplevel-section-${section.key}`}
              >
                <div className="flex items-center">
                  <span className={`w-6 h-6 ${language === 'ar' ? 'ml-3' : 'mr-3'} ${theme === 'dark' ? 'text-bright-yellow' : 'text-marine-blue'}`}>{section.icon}</span>
                  <h2 className="text-lg md:text-xl font-semibold">{t(section.titleKey)}</h2>
                </div>
                <ChevronDownIcon className={`w-6 h-6 transform transition-transform ${expandedTopLevelSection === section.key ? 'rotate-180' : ''}`} />
              </button>
              {expandedTopLevelSection === section.key && (
                <div id={`toplevel-section-${section.key}`} className={`p-3 md:p-4 border-t ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'} animate-fadeInUp`}>
                  <section.Component loggedInUser={loggedInUser} showConfirmDelete={showConfirmDelete} />
                </div>
              )}
          </div>
        ))}
      </div>
      <ConfirmDeleteModal 
        isOpen={confirmModal.isOpen}
        title={t(confirmModal.titleKey)}
        message={t(confirmModal.messageKey)}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default PersonalHubView;
