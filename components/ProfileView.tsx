
<<<<<<< HEAD

import React, { useContext, useState, useEffect } from 'react';
import { useLanguageContext } from '../hooks/useLanguage'; // Updated path
import { ThemeContext, ToastContext, LoggedInUser } from '../App';
import { UserRole, Team } from '../types'; 
=======
import React, { useContext, useState, useEffect, ChangeEvent } from 'react';
import { useLanguageContext } from '../hooks/useLanguage'; 
import { ThemeContext } from '../contexts/ThemeContext'; 
import { ToastContext } from '../contexts/ToastContext'; // UPDATED IMPORT
import { UserRole, Team, LoggedInUser, TranslationSet } from '../types'; 
import { TrophyIcon, ShieldCheckIcon, StarIcon, SparklesIcon, HeartIcon, AcademicCapIcon, PencilIcon, CameraIcon, UserCircleIcon as UserPlaceholderIcon } from '@heroicons/react/24/outline';

>>>>>>> bee2d85 (updated)

type ProfileSection = 'view' | 'editInfo' | 'changePassword' | 'notificationSettings';

interface ProfileViewProps {
  loggedInUser: LoggedInUser;
<<<<<<< HEAD
  updateLoggedInUser: (updatedFields: Partial<Pick<LoggedInUser, 'name' | 'email' | 'phone'>>) => void;
=======
  updateLoggedInUser: (updatedFields: Partial<Pick<LoggedInUser, 'name' | 'email' | 'phone' | 'avatarUrl'>>) => void;
>>>>>>> bee2d85 (updated)
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
<<<<<<< HEAD

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences>({
    emailShifts: true,
    pushTasks: false,
    smsAlerts: true,
  });
=======
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(loggedInUser.avatarUrl || null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);


  const mockBadges = [
    { id: 'b1', nameKey: 'occasionNewYear' as keyof TranslationSet, name: language === 'ar' ? 'نجم الفهلوة' : 'Fahlawa Star', icon: StarIcon, color: 'text-yellow-400' },
    { id: 'b2', nameKey: 'occasionEidAlAdha' as keyof TranslationSet, name: language === 'ar' ? 'أسطى الأمان' : 'Safety Master', icon: ShieldCheckIcon, color: 'text-green-400' },
    { id: 'b3', nameKey: 'occasionRamadan' as keyof TranslationSet, name: language === 'ar' ? 'بطل الإنجاز' : 'Achievement Hero', icon: TrophyIcon, color: 'text-blue-400' },
    { id: 'b4', nameKey: 'occasionLaborDay' as keyof TranslationSet, name: language === 'ar' ? 'مبدع الأسبوع' : 'Innovator of the Week', icon: SparklesIcon, color: 'text-purple-400' },
    { id: 'b5', nameKey: 'occasionOctoberVictory' as keyof TranslationSet, name: language === 'ar' ? 'قلب الفريق' : 'Team Heart', icon: HeartIcon, color: 'text-red-400' },
    { id: 'b6', nameKey: 'occasionProphetBirthday' as keyof TranslationSet,name: language === 'ar' ? 'خبير المعرفة' : 'Knowledge Expert', icon: AcademicCapIcon, color: 'text-indigo-400' },
  ];
>>>>>>> bee2d85 (updated)
  
  useEffect(() => {
    if (loggedInUser) {
      setEditName(loggedInUser.name);
      setEditEmail(loggedInUser.email || '');
      setEditPhone(loggedInUser.phone || '');
<<<<<<< HEAD
=======
      setPreviewAvatar(loggedInUser.avatarUrl || null);
>>>>>>> bee2d85 (updated)
    }
  }, [loggedInUser]);


  const handleSaveUserInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updateLoggedInUser({
      name: editName,
      email: editEmail,
      phone: editPhone,
<<<<<<< HEAD
=======
      avatarUrl: previewAvatar // Also save avatar if it was changed in this flow
>>>>>>> bee2d85 (updated)
    });
    addToast(t('profileUpdateSuccess'), 'success');
    setActiveSection('view');
  };
<<<<<<< HEAD
=======
  
  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreviewAvatar(base64String); // Show preview
        // No immediate save, will be saved with other info or if a dedicated "save avatar" button exists
      };
      reader.readAsDataURL(file);
    }
  };


  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences>({
    emailShifts: true,
    pushTasks: false,
    smsAlerts: true,
  });
>>>>>>> bee2d85 (updated)

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      addToast(language === 'ar' ? 'كلمة المرور الجديدة وتأكيدها مش زي بعض يا ريس!' : 'New password and confirmation do not match, boss!', 'alert');
      return;
    }
<<<<<<< HEAD
    // In a real app, you would call an API to change the password here.
    // For this mock, we'll just show success.
=======
    // Mock password change
>>>>>>> bee2d85 (updated)
    addToast(t('profilePasswordChangeSuccess'), 'success');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setActiveSection('view');
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
<<<<<<< HEAD
    // In a real app, save notificationPrefs to Firestore or backend.
=======
    // Mock save notification preferences
>>>>>>> bee2d85 (updated)
    addToast(t('profileNotificationSettingsSuccess'), 'success');
    setActiveSection('view');
  };
  
  const resetEditForm = () => {
    if (loggedInUser) {
      setEditName(loggedInUser.name);
      setEditEmail(loggedInUser.email || '');
      setEditPhone(loggedInUser.phone || '');
<<<<<<< HEAD
=======
      setPreviewAvatar(loggedInUser.avatarUrl || null); // Reset preview
>>>>>>> bee2d85 (updated)
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

<<<<<<< HEAD
  const primaryButtonClasses = `w-full mt-4 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors ${theme === 'dark' ? 'bg-bright-yellow text-marine-blue hover:bg-yellow-300' : 'bg-bright-yellow text-marine-blue hover:bg-yellow-400'}`;
=======
  const primaryButtonClasses = `w-full mt-4 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors ${theme === 'dark' ? 'bg-bright-yellow text-marine-blue hover:bg-yellow-300' : 'bg-marine-blue text-white hover:bg-blue-700'}`;
>>>>>>> bee2d85 (updated)
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
<<<<<<< HEAD
            <div className="flex flex-col items-center mb-6">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl mb-3 
                ${theme === 'dark' ? 'bg-gray-700 text-bright-yellow' : 'bg-slate-200 text-marine-blue'}`}>
                {loggedInUser.name.length > 0 ? (language === 'ar' ? loggedInUser.name[0] : loggedInUser.name[0].toUpperCase()) : (language === 'ar' ? '؟' : '?')}
              </div>
=======
            <div className="flex flex-col items-center mb-6 relative">
              {previewAvatar ? (
                <img src={previewAvatar} alt="User Avatar" className="w-24 h-24 rounded-full object-cover mb-3 shadow-md" />
              ) : (
                <UserPlaceholderIcon className={`w-24 h-24 rounded-full mb-3 text-gray-400 dark:text-gray-500 ${theme === 'dark' ? 'bg-gray-700' : 'bg-slate-200'} p-2`} />
              )}
               <button
                  onClick={() => fileInputRef.current?.click()}
                  className={`absolute bottom-3 ${language === 'ar' ? 'left-1/2 transform -translate-x-1/2 translate-y-1/4' : 'right-1/2 transform translate-x-1/2 translate-y-1/4'} p-1.5 bg-gray-500/70 hover:bg-gray-600/80 text-white rounded-full shadow-md transition-colors`}
                  title={t('profileEditButton')}
                  aria-label={t('profileEditButton')}
                >
                  <PencilIcon className="h-3 w-3" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/*"
                  className="hidden"
                />
>>>>>>> bee2d85 (updated)
              <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>{loggedInUser.name}</h2>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{getRoleDisplayName(loggedInUser.role)}</p>
            </div>

            <dl className="text-sm">
              <InfoRow labelKey="profileTeamLabel" value={getTeamName(loggedInUser.teamId)} />
              <InfoRow labelKey="profileEmailLabel" value={loggedInUser.email || (language === 'ar' ? 'لا يوجد' : 'N/A')} />
              <InfoRow labelKey="profilePhoneLabel" value={loggedInUser.phone || (language === 'ar' ? 'لا يوجد' : 'N/A')} />
<<<<<<< HEAD
              <InfoRow labelKey="profileLastLoginLabel" value={language === 'ar' ? 'منذ لحظات قليلة' : 'A few moments ago'} />
            </dl>
=======
              <InfoRow labelKey="profileExpertiseScoreLabel" value={`${loggedInUser.expertisePoints} ${t('expertisePoints')}`} />
              <InfoRow labelKey="profileLastLoginLabel" value={language === 'ar' ? 'منذ لحظات قليلة' : 'A few moments ago'} />
            </dl>
            
            <div className={`mt-6 pt-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`text-md font-semibold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>{language === 'ar' ? 'شاراتي ومكافآتي' : 'My Badges & Rewards'}</h3>
              {mockBadges.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {mockBadges.map(badge => (
                    <div key={badge.id} title={t(badge.nameKey, badge.name)} className={`p-2.5 rounded-lg flex flex-col items-center space-y-1 w-24 h-24 justify-center transition-all hover:shadow-lg card-interactive ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <badge.icon className={`h-8 w-8 ${badge.color}`} />
                      <span className={`text-[10px] text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{t(badge.nameKey, badge.name)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                 <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{language === 'ar' ? 'لسه مفيش شارات، شد حيلك يا بطل!' : 'No badges yet, keep up the great work!'}</p>
              )}
            </div>
>>>>>>> bee2d85 (updated)

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
<<<<<<< HEAD
=======
            <div className="flex flex-col items-center mb-4 relative">
                {previewAvatar ? (
                  <img src={previewAvatar} alt="Avatar Preview" className="w-20 h-20 rounded-full object-cover mb-2 shadow-sm" />
                ) : (
                  <UserPlaceholderIcon className={`w-20 h-20 rounded-full mb-2 text-gray-400 dark:text-gray-500 ${theme === 'dark' ? 'bg-gray-700' : 'bg-slate-200'} p-2`} />
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`py-1.5 px-3 text-xs rounded-md flex items-center gap-1 ${secondaryButtonClasses} ${theme === 'dark' ? '!bg-gray-600 hover:!bg-gray-500' : '!bg-gray-100 hover:!bg-gray-200'}`}
                >
                  <CameraIcon className="h-4 w-4"/>
                  {language === 'ar' ? 'تغيير الصورة' : 'Change Photo'}
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/*"
                  className="hidden"
                />
            </div>
>>>>>>> bee2d85 (updated)
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
