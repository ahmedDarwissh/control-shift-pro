
import React from 'react';
import { useLanguageContext } from '../hooks/useLanguage';
import { Ship, ShipStatus, ShipCargoType, Pump, Language } from '../types';
<<<<<<< HEAD
<<<<<<< HEAD
import { ThemeContext } from '../App'; 
=======
import { ThemeContext } from '../contexts/ThemeContext'; 
import { ToastContext } from '../contexts/ToastContext'; // UPDATED IMPORT
import { PlusCircleIcon } from '@heroicons/react/24/outline';
>>>>>>> bee2d85 (updated)
=======
import { ThemeContext } from '../contexts/ThemeContext'; 
import { ToastContext } from '../contexts/ToastContext'; // UPDATED IMPORT
import { PlusCircleIcon } from '@heroicons/react/24/outline';
>>>>>>> 96a8f29 (First commit)

// Heroicon for Ship (using TruckIcon as a placeholder, ideally a better ship icon)
const ShipIconHero: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v.958m12 0c0 2.278-1.091 4.163-2.638 5.163M12 12.75H3.375m0 0L3 12m0 0l.375-.25M3.375 12.75c0-1.562.796-2.924 2.062-3.75M3.375 12.75c2.953 0 5.479-1.605 6.875-3.75m0-1.51V12.75c0 .932.392 1.79.995 2.395M12 12.75c0 .475.026.944.075 1.405M12 12.75c-.375 0-.75-.068-1.125-.201m-1.125-.201c-.394-.15-.763-.348-1.097-.585M12 12.75c.375 0 .75-.068 1.125-.201m1.125-.201c.394-.15.763-.348 1.097-.585m0 0c1.266.726 2.063 2.188 2.063 3.75" /></svg>
);
// Placeholder for Wave icon
const WaveIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.5A.75.75 0 014.5 3.75h15a.75.75 0 01.75.75v9a.75.75 0 01-.75.75h-3.375L12 21l-4.125-6.75H3.75a.75.75 0 01-.75-.75v-9zM4.5 6.75h15M4.5 9.75h15m-7.5 3h7.5" /></svg>;

interface ShipCardProps {
  ship: Ship;
}

const ShipCard: React.FC<ShipCardProps> = ({ ship }) => {
  const { t, language } = useLanguageContext();
  const { theme } = React.useContext(ThemeContext);

  const getStatusClasses = (status: ShipStatus): { bg: string; text: string; border: string } => {
    if (theme === 'dark') {
      switch (status) {
        case ShipStatus.Import: return { bg: 'bg-blue-700', text: 'text-blue-200', border: 'border-blue-500' };
        case ShipStatus.Export: return { bg: 'bg-green-700', text: 'text-green-200', border: 'border-green-500' };
        case ShipStatus.Docked: return { bg: 'bg-yellow-700', text: 'text-yellow-200', border: 'border-yellow-500' };
        case ShipStatus.Anchored: return { bg: 'bg-gray-600', text: 'text-gray-300', border: 'border-gray-500' };
        default: return { bg: 'bg-gray-600', text: 'text-gray-300', border: 'border-gray-500' };
      }
    } else {
      switch (status) {
        case ShipStatus.Import: return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-500' };
        case ShipStatus.Export: return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-500' };
        case ShipStatus.Docked: return { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-500' };
        case ShipStatus.Anchored: return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-400' };
        default: return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-400' };
      }
    }
  };
  
  const getShipStatusTranslationKey = (status: ShipStatus): keyof ReturnType<typeof useLanguageContext>['translations'] => {
    const keyMap: Record<ShipStatus, keyof ReturnType<typeof useLanguageContext>['translations']> = {
      [ShipStatus.Import]: 'import',
      [ShipStatus.Export]: 'export',
      [ShipStatus.Docked]: 'docked',
      [ShipStatus.Anchored]: 'anchored',
    };
    return keyMap[status] || (status.toLowerCase() as keyof ReturnType<typeof useLanguageContext>['translations']);
  };

  const getPumpStatusColor = (status: Pump['status']): string => {
    switch (status) {
      case 'Running': return theme === 'dark' ? 'text-green-400' : 'text-green-600';
      case 'Standby': return theme === 'dark' ? 'text-yellow-400' : 'text-yellow-500';
      case 'Maintenance': return theme === 'dark' ? 'text-orange-400' : 'text-orange-500';
      case 'Off': return theme === 'dark' ? 'text-red-400' : 'text-red-500';
      default: return theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
    }
  };
  
  const getPumpStatusTextKey = (status: Pump['status']): keyof ReturnType<typeof useLanguageContext>['translations'] => {
    const keyMap: Record<Pump['status'], keyof ReturnType<typeof useLanguageContext>['translations']> = {
      'Running': 'running',
      'Standby': 'standby',
      'Maintenance': 'maintenance',
      'Off': 'offline',
    };
    return keyMap[status] || (status as keyof ReturnType<typeof useLanguageContext>['translations']);
  };
  
  const statusColors = getStatusClasses(ship.status);
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
  const secondaryTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const labelColor = theme === 'dark' ? 'text-gray-500' : 'text-gray-500';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const shipNameColor = theme === 'dark' ? 'text-orange-400' : 'text-orange-600';

  return (
    <div className={`p-5 md:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out border-l-4 ${cardBg} ${statusColors.border}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
        <h2 className={`text-lg md:text-xl font-semibold ${shipNameColor} mb-1 sm:mb-0`}>{ship.name}</h2>
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColors.bg} ${statusColors.text}`}>
          {t(getShipStatusTranslationKey(ship.status))}
        </span>
      </div>
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2.5 text-xs md:text-sm ${secondaryTextColor}`}>
        <p><strong className={labelColor}>{t('cargoType')}:</strong> {ship.cargoType}</p>
        <p><strong className={labelColor}>{t('quantityRemaining')}:</strong> {ship.quantityRemaining.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')} {ship.cargoType === ShipCargoType.LNG ? 'م³' : (language === 'ar' ? 'طن' : 'tons')}</p>
        <p><strong className={labelColor}>{t('quantityPerHour')}:</strong> {ship.quantityPerHour.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')} {ship.cargoType === ShipCargoType.LNG ? (language === 'ar' ? 'م³/س' : 'm³/hr') : (language === 'ar' ? 'طن/س' : 'tons/hr')}</p>
        {ship.eta && <p><strong className={labelColor}>{t('eta')}:</strong> {new Date(ship.eta).toLocaleString(language === Language.AR ? 'ar-EG-u-nu-latn' : 'en-GB', { dateStyle: 'short', timeStyle: 'short' })}</p>}
      </div>
      {ship.pumps && ship.pumps.length > 0 && (
        <div className={`mt-4 border-t pt-3 ${borderColor}`}>
          <h3 className={`text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{t('pumps')}</h3>
          <ul className="space-y-1.5">
            {ship.pumps.map(pump => (
              <li key={pump.id} className="flex justify-between items-center text-xs">
                <span className={secondaryTextColor}>{pump.name}:</span>
                <span className={`font-medium ${getPumpStatusColor(pump.status)}`}>
                  {t(getPumpStatusTextKey(pump.status))}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className={`mt-5 text-center`}>
        <ShipIconHero className={`h-10 w-10 mx-auto ${theme === 'dark' ? 'text-blue-500 opacity-70' : 'text-blue-600 opacity-80'}`} /> 
        <p className={`text-xs mt-1.5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>{t('shipDockedMessage')}</p>
      </div>
    </div>
  );
};

interface ShipManagementViewProps {
  ships: Ship[];
}

const ShipManagementView: React.FC<ShipManagementViewProps> = ({ ships }) => {
  const { t, language } = useLanguageContext();
  const { theme } = React.useContext(ThemeContext);
<<<<<<< HEAD
<<<<<<< HEAD
  const pageTitleColor = theme === 'dark' ? 'text-orange-400' : 'text-orange-500';

  return (
    <div className={`p-2 ${language === 'ar' ? 'font-cairo text-right' : 'font-poppins text-left'}`}>
      <h1 className={`text-2xl md:text-3xl font-bold mb-6 md:mb-8 ${pageTitleColor}`}>{t('ships')}</h1>
=======
=======
>>>>>>> 96a8f29 (First commit)
  const { addToast } = React.useContext(ToastContext);
  const pageTitleColor = theme === 'dark' ? 'text-orange-400' : 'text-orange-500';

  const handleLogNewCargo = () => {
    addToast(t('shipLogNewCargoToast'), 'info');
  };

  return (
    <div className={`p-2 ${language === 'ar' ? 'font-cairo text-right' : 'font-poppins text-left'}`}>
      <div className="flex justify-between items-center mb-6 md:mb-8">
        <h1 className={`text-2xl md:text-3xl font-bold ${pageTitleColor}`}>{t('ships')}</h1>
        <button 
            onClick={handleLogNewCargo}
            className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors shadow-md flex items-center gap-2
                ${theme === 'dark' ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-green-500 text-white hover:bg-green-600'}`}
            aria-label={t('shipLogNewCargoButton')}
        >
            <PlusCircleIcon className="h-5 w-5"/>
            {t('shipLogNewCargoButton')}
        </button>
      </div>
<<<<<<< HEAD
>>>>>>> bee2d85 (updated)
=======
>>>>>>> 96a8f29 (First commit)
      {ships.length === 0 ? (
        <div className={`text-center py-12 px-4 rounded-xl shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <WaveIcon className={`h-16 w-16 mx-auto mb-4 ${theme === 'dark' ? 'text-blue-500' : 'text-blue-600'}`} />
          <p className={`text-xl mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{t('noShips')}</p>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
            {t('noShipsFunny')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
          {ships.map(ship => (
            <ShipCard key={ship.id} ship={ship} />
          ))}
        </div>
      )}
       <p className={`mt-8 md:mt-10 text-xs md:text-sm text-center ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
        {t('shipManagementFooter')}
      </p>
    </div>
  );
};

<<<<<<< HEAD
<<<<<<< HEAD
export default ShipManagementView;
=======
export default ShipManagementView;
>>>>>>> bee2d85 (updated)
=======
export default ShipManagementView;
>>>>>>> 96a8f29 (First commit)
