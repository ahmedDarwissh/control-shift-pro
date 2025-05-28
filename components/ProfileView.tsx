

import React, { useContext, useState, useEffect } from 'react';
import { useLanguageContext } from '../hooks/useLanguage'; // Updated path
import { ThemeContext, ToastContext, LoggedInUser } from '../App';
import { UserRole, Team } from '../types'; 

type ProfileSection = 'view' | 'editInfo' | 'changePassword' | 'notificationSettings';

interface ProfileViewProps {
  loggedInUser: LoggedInUser;
  updateLoggedInUser: (updatedFields: Partial<Pick<LoggedInUser, 'name' | 'email' | 'phone'>>) => void;
  teams: Team[]; 
}

interface NotificationPreferences {
  emailShifts: boolean;
  pushTasks: boolean;
  smsAlerts: boolean;
}

const ProfileView: React.FC<ProfileViewProps> = ({ loggedInUser, updateLoggedInUser, teams }) => {
  const { t, language } = useLanguageContext();
  const { theme } = React.useContext(ThemeContext);
  const { addToast } = useContext(ToastContext);

  const [activeSection, setActiveSection] = useState<ProfileSection>('view');

  const [editName, setEditName] = useState(loggedInUser.name);
  const [editEmail, setEditEmail] = useState(loggedInUser.email || '');
  const [editPhone, setEditPhone] = useState(loggedInUser.phone || '');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences>({
    emailShifts: true,
    pushTasks: false,
    smsAlerts: true,
  });
  
  useEffect(() => {
    if (loggedInUser) {
      setEditName(loggedInUser.name);
      setEditEmail(loggedInUser.email || '');
      setEditPhone(loggedInUser.phone || '');
    }
  }, [loggedInUser]);


  const handleSaveUserInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updateLoggedInUser({
      name: editName,
      email: editEmail,
      phone: editPhone,
    });
    addToast(t('profileUpdateSuccess'), 'success');
    setActiveSection('view');
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      addToast(language === 'ar' ? 'كلمة المرور الجديدة وتأكيدها مش زي بعض يا ريس!' : 'New password and confirmation do not match, boss!', 'alert');
      return;
    }
    // In a real app, you would call an API to change the password here.
    // For this mock, we'll just show success.
    addToast(t('profilePasswordChangeSuccess'), 'success');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setActiveSection('view');
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, save notificationPrefs to Firestore or backend.
    addToast(t('profileNotificationSettingsSuccess'), 'success');
    setActiveSection('view');
  };
  
  const resetEditForm = () => {
    if (loggedInUser) {
      setEditName(loggedInUser.name);
      setEditEmail(loggedInUser.email || '');
      setEditPhone(loggedInUser.phone || '');
    }
  };

  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case UserRole.Employee: return t('employee');
      case UserRole.Supervisor: return t('supervisorRole');
      case UserRole.Engineer: return t('engineer');
      default: return role;
    }
  };

  const getTeamName = (teamId?: string) => {
    if (!teamId) return language === 'ar' ? 'غير محدد' : 'N/A';
    const team = teams.find(t => t.id === teamId);
    return team ? team.name : (language === 'ar' ? 'فريق غير معروف' : 'Unknown Team');
  };

  const InfoRow: React.FC<{ labelKey: keyof ReturnType<typeof useLanguageContext>['translations']; value: string }> = ({ labelKey, value }) => (
    <div className={`flex flex-col sm:flex-row py-3 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
      <dt className={`w-full sm:w-1/3 font-semibold ${theme === 'dark' ? 'text-bright-yellow' : 'text-marine-blue'} ${language === 'ar' ? 'sm:text-right sm:ml-4' : 'sm:text-left sm:mr-4'} mb-1 sm:mb-0`}>{t(labelKey)}:</dt>
      <dd className={`w-full sm:w-2/3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{value}</dd>
    </div>
  );

  const inputBaseClasses = "w-full p-2.5 border rounded-lg shadow-sm focus:ring-2";
  const lightInputClasses = "bg-slate-50 hover:bg-slate-100 border-gray-300 text-gray-800 focus:ring-marine-blue focus:border-marine-blue placeholder-gray-500";
  const darkInputClasses = "bg-gray-700 border-gray-600 text-gray-100 focus:ring-bright-yellow focus:border-bright-yellow placeholder-gray-400";
  const themedInputClasses = theme === 'dark' ? darkInputClasses : lightInputClasses;

  const FormInput: React.FC<{ id: string; labelKey: keyof ReturnType<typeof useLanguageContext>['translations']; type?: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholderKey?: keyof ReturnType<typeof useLanguageContext>['translations'] }> = 
  ({ id, labelKey, type = "text", value, onChange, placeholderKey }) => (
    <div>
      <label htmlFor={id} className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{t(labelKey)}</label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholderKey ? t(placeholderKey) : ''}
        className={`${inputBaseClasses} ${themedInputClasses}`}
      />
    </div>
  );
  
  const ToggleSwitch: React.FC<{ id: string; labelKey: keyof ReturnType<typeof useLanguageContext>['translations']; checked: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = 
  ({ id, labelKey, checked, onChange }) => (
    <label htmlFor={id} className="flex items-center justify-between cursor-pointer py-2">
        <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{t(labelKey)}</span>
        <div className="relative">
            <input type="checkbox" id={id} className="sr-only peer" checked={checked} onChange={onChange} />
            <div className={`block w-10 h-6 rounded-full ${theme === 'dark' ? 'bg-gray-600 peer-checked:bg-bright-yellow' : 'bg-gray-300 peer-checked:bg-marine-blue'}`}></div>
            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-full ${theme === 'dark' ? 'peer-checked:bg-dark-card' : ''}`}></div>
        </div>
    </label>
  );

  const primaryButtonClasses = `w-full mt-4 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors ${theme === 'dark' ? 'bg-bright-yellow text-marine-blue hover:bg-yellow-300' : 'bg-bright-yellow text-marine-blue hover:bg-yellow-400'}`;
  const secondaryButtonClasses = `py-2 px-4 rounded-lg text-xs font-medium transition-colors ${theme === 'dark' ? 'bg-blue-700 hover:bg-blue-600 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`;
  const cancelButtonClasses = `py-2 px-4 rounded-lg text-xs font-medium transition-colors ${theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`;


  if (!loggedInUser) {
    return (
      <div className={`p-4 md:p-6 text-center ${language === 'ar' ? 'font-cairo' : 'font-poppins'}`}>
        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          {language === 'ar' ? 'جاري تحميل بيانات المستخدم...' : 'Loading user data...'}
        </p>
      </div>
    );
  }

  return (
    <div className={`p-4 md:p-6 ${language === 'ar' ? 'font-cairo text-right' : 'font-poppins text-left'}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-2xl md:text-3xl font-bold ${theme === 'dark' ? 'text-bright-yellow' : 'text-marine-blue'}`}>
          {activeSection === 'view' && t('myProfile')}
          {activeSection === 'editInfo' && t('profileEditInfoTitle')}
          {activeSection === 'changePassword' && t('profileChangePasswordTitle')}
          {activeSection === 'notificationSettings' && t('profileNotificationSettingsTitle')}
        </h1>
        {activeSection !== 'view' && (
           <button 
            onClick={() => {
                setActiveSection('view');
                resetEditForm(); 
            }}
            className={cancelButtonClasses}
          >
            {t('profileCancelButton')}
          </button>
        )}
      </div>
      
      <div className={`p-6 rounded-xl shadow-lg ${theme === 'dark' ? 'bg-dark-card border border-gray-700' : 'bg-white border border-gray-200'}`}>
        {activeSection === 'view' && (
          <>
            <div className="flex flex-col items-center mb-6">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl mb-3 
                ${theme === 'dark' ? 'bg-gray-700 text-bright-yellow' : 'bg-slate-200 text-marine-blue'}`}>
                {loggedInUser.name.length > 0 ? (language === 'ar' ? loggedInUser.name[0] : loggedInUser.name[0].toUpperCase()) : (language === 'ar' ? '؟' : '?')}
              </div>
              <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>{loggedInUser.name}</h2>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{getRoleDisplayName(loggedInUser.role)}</p>
            </div>

            <dl className="text-sm">
              <InfoRow labelKey="profileTeamLabel" value={getTeamName(loggedInUser.teamId)} />
              <InfoRow labelKey="profileEmailLabel" value={loggedInUser.email || (language === 'ar' ? 'لا يوجد' : 'N/A')} />
              <InfoRow labelKey="profilePhoneLabel" value={loggedInUser.phone || (language === 'ar' ? 'لا يوجد' : 'N/A')} />
              <InfoRow labelKey="profileLastLoginLabel" value={language === 'ar' ? 'منذ لحظات قليلة' : 'A few moments ago'} />
            </dl>

            <div className={`mt-6 pt-4 border-t grid grid-cols-1 sm:grid-cols-3 gap-3 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <button 
                onClick={() => { setActiveSection('editInfo'); resetEditForm();}}
                className={secondaryButtonClasses}
              >
                {t('profileEditButton')}
              </button>
              <button 
                onClick={() => setActiveSection('changePassword')}
                className={secondaryButtonClasses}
              >
                {t('profileChangePasswordButton')}
              </button>
              <button 
                onClick={() => setActiveSection('notificationSettings')}
                className={secondaryButtonClasses}
              >
                {t('profileNotificationSettingsButton')}
              </button>
            </div>
          </>
        )}

        {activeSection === 'editInfo' && (
          <form onSubmit={handleSaveUserInfo} className="space-y-4 text-left">
            <FormInput id="editName" labelKey="profileNameLabel" value={editName} onChange={e => setEditName(e.target.value)} />
            <FormInput id="editEmail" labelKey="profileEmailLabel" type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} />
            <FormInput id="editPhone" labelKey="profilePhoneLabel" type="tel" value={editPhone} onChange={e => setEditPhone(e.target.value)} />
            <button type="submit" className={primaryButtonClasses}>
              {t('profileSaveChangesButton')}
            </button>
          </form>
        )}

        {activeSection === 'changePassword' && (
          <form onSubmit={handleSavePassword} className="space-y-4 text-left">
            <FormInput id="currentPassword" labelKey="profileCurrentPasswordLabel" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholderKey="profileCurrentPasswordPlaceholder" />
            <FormInput id="newPassword" labelKey="profileNewPasswordLabel" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholderKey="profileNewPasswordPlaceholder"/>
            <FormInput id="confirmNewPassword" labelKey="profileConfirmNewPasswordLabel" type="password" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} placeholderKey="profileConfirmNewPasswordPlaceholder"/>
            <button type="submit" className={primaryButtonClasses}>
              {t('profileUpdatePasswordButton')}
            </button>
          </form>
        )}
        
        {activeSection === 'notificationSettings' && (
          <form onSubmit={handleSaveNotifications} className="space-y-4 text-left">
            <ToggleSwitch 
                id="emailShifts" 
                labelKey="profileNotifyEmailShiftsLabel" 
                checked={notificationPrefs.emailShifts} 
                onChange={e => setNotificationPrefs(p => ({...p, emailShifts: e.target.checked}))} 
            />
            <ToggleSwitch 
                id="pushTasks" 
                labelKey="profileNotifyPushTasksLabel" 
                checked={notificationPrefs.pushTasks} 
                onChange={e => setNotificationPrefs(p => ({...p, pushTasks: e.target.checked}))} 
            />
            <ToggleSwitch 
                id="smsAlerts" 
                labelKey="profileNotifySmsAlertsLabel" 
                checked={notificationPrefs.smsAlerts} 
                onChange={e => setNotificationPrefs(p => ({...p, smsAlerts: e.target.checked}))} 
            />
            <button type="submit" className={primaryButtonClasses}>
              {t('profileSaveNotificationPrefsButton')}
            </button>
          </form>
        )}

      </div>
      <p className={`mt-8 text-xs md:text-sm text-center ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
        {activeSection === 'view' ? t('profileFooterActive') : t('profileFooterEdit')}
      </p>
    </div>
  );
};

export default ProfileView;
