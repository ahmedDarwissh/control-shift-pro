

import React, { useContext } from 'react';
import { useLanguageContext } from '../hooks/useLanguage';
import { ThemeContext } from '../contexts/ThemeContext';
import { useActivityLog } from '../hooks/useActivityLog';
import { ViewName, UserRole, TranslationSet, ActivityLogEntry, PermitStatus, ShiftType } from '../types';
import { ENGINEERS, SUPERVISORS, EMPLOYEES_TEAM1, EMPLOYEES_TEAM2, EMPLOYEES_TEAM3, EMPLOYEES_TEAM4, MOCK_KNOWLEDGE_BASE_TIPS, MOCK_INTERNAL_ANNOUNCEMENTS, MOCK_EQUIPMENT_LOGBOOK_ENTRIES, MOCK_PERMITS_TO_WORK, MOCK_SAFETY_OBSERVATIONS, CURRENT_SHIFT_ASSIGNMENTS, TEAMS } from '../constants'; // Added TEAMS
import { ToastContext } from '../contexts/ToastContext'; // Added ToastContext
import { UsersIcon, BriefcaseIcon, ClockIcon, DocumentTextIcon, UserGroupIcon, EyeIcon, CogIcon as Cog6ToothIcon, ListBulletIcon, ShieldCheckIcon, PencilIcon, LightBulbIcon, MegaphoneIcon, ArchiveBoxIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline'; // Consolidated icon imports

interface AdminDashboardViewProps {
    onNavigate: (view: ViewName) => void;
}

const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ onNavigate }) => {
  const { t, language } = useLanguageContext();
  const { theme } = useContext(ThemeContext);
  const { activityLogEntries } = useActivityLog();
  const { addToast } = useContext(ToastContext); // Get addToast from context

  const totalUsers = ENGINEERS.length + SUPERVISORS.length + EMPLOYEES_TEAM1.length + EMPLOYEES_TEAM2.length + EMPLOYEES_TEAM3.length + EMPLOYEES_TEAM4.length;
  const totalEmployees = EMPLOYEES_TEAM1.length + EMPLOYEES_TEAM2.length + EMPLOYEES_TEAM3.length + EMPLOYEES_TEAM4.length;
  const usersByRole = [
    { role: t('engineer'), count: ENGINEERS.length },
    { role: t('supervisorRole'), count: SUPERVISORS.length },
    { role: t('employee'), count: totalEmployees },
  ];
  const activeShiftsCount = CURRENT_SHIFT_ASSIGNMENTS.filter(sa => sa.shiftType !== ShiftType.Off).length;
  const openPermitsCount = MOCK_PERMITS_TO_WORK.filter(p => 
    p.status === PermitStatus.ActivePermit || p.status === PermitStatus.ApprovedPermit || p.status === PermitStatus.RequestedPermit
  ).length;

  const contentStats = [
    { labelKey: 'adminDashboardKnowledgeTips' as keyof TranslationSet, count: MOCK_KNOWLEDGE_BASE_TIPS.length, icon: LightBulbIcon },
    { labelKey: 'adminDashboardInternalAnnouncements' as keyof TranslationSet, count: MOCK_INTERNAL_ANNOUNCEMENTS.length, icon: MegaphoneIcon },
    { labelKey: 'adminDashboardEquipmentLogs' as keyof TranslationSet, count: MOCK_EQUIPMENT_LOGBOOK_ENTRIES.length, icon: ArchiveBoxIcon },
    { labelKey: 'adminDashboardOpenPermits' as keyof TranslationSet, count: openPermitsCount, icon: ClipboardDocumentCheckIcon },
    { labelKey: 'adminDashboardSafetyObservations' as keyof TranslationSet, count: MOCK_SAFETY_OBSERVATIONS.length, icon: EyeIcon },
  ];

  const allUsers = [
    ...ENGINEERS.map(u => ({ ...u, teamName: t('N_A') })),
    ...SUPERVISORS.map(u => ({ ...u, teamName: TEAMS.find(team => team.id === u.teamId)?.name || t('N_A') })),
    ...EMPLOYEES_TEAM1.map(u => ({ ...u, teamName: TEAMS.find(team => team.id === u.teamId)?.name || t('N_A') })),
    ...EMPLOYEES_TEAM2.map(u => ({ ...u, teamName: TEAMS.find(team => team.id === u.teamId)?.name || t('N_A') })),
    ...EMPLOYEES_TEAM3.map(u => ({ ...u, teamName: TEAMS.find(team => team.id === u.teamId)?.name || t('N_A') })),
    ...EMPLOYEES_TEAM4.map(u => ({ ...u, teamName: TEAMS.find(team => team.id === u.teamId)?.name || t('N_A') })),
  ];

  const quickActions = [
    { labelKey: 'adminDashboardViewFullActivityLog' as keyof TranslationSet, action: () => onNavigate('activityLog'), icon: ListBulletIcon },
    { labelKey: 'adminDashboardBroadcastAnnouncement' as keyof TranslationSet, action: () => onNavigate('internalAnnouncements'), icon: MegaphoneIcon },
    { labelKey: 'adminDashboardSystemHealthCheck' as keyof TranslationSet, action: () => addToast(t('adminDashboardSystemHealthOK'), 'success'), icon: ShieldCheckIcon },
    { labelKey: 'adminDashboardManageAppSettings' as keyof TranslationSet, action: () => onNavigate('settings'), icon: Cog6ToothIcon },
  ];

  const pageTitleColor = theme === 'dark' ? 'text-accent-orange' : 'text-accent-orange';
  const cardBg = theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const textColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
  const valueColor = theme === 'dark' ? 'text-blue-400' : 'text-blue-600';
  const actionButtonClasses = `py-2 px-4 rounded-lg text-xs font-medium transition-colors shadow-sm hover:shadow-md flex items-center justify-center gap-2 ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`;

  const StatCard: React.FC<{ title: string, value: string | number, icon: React.ElementType }> = ({ title, value, icon: Icon }) => (
    <div className={`p-4 rounded-xl shadow-lg flex items-center space-x-3 rtl:space-x-reverse ${cardBg} border`}>
      <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100/70'}`}>
        <Icon className={`h-6 w-6 ${valueColor}`} />
      </div>
      <div>
        <p className={`text-sm ${textColor}`}>{title}</p>
        <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
      </div>
    </div>
  );

  return (
    <div className={`p-2 md:p-4 animate-fadeInUp ${language === 'ar' ? 'font-cairo' : 'font-poppins'}`}>
      <h1 className={`text-2xl md:text-3xl font-bold mb-6 text-center ${pageTitleColor}`}>
        {t('viewName_adminDashboard')}
      </h1>

      {/* Overview Statistics */}
      <section className="mb-8">
        <h2 className={`text-xl font-semibold mb-4 ${textColor}`}>{t('adminDashboardOverview')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard title={t('adminDashboardTotalUsers')} value={totalUsers} icon={UsersIcon} />
          <StatCard title={t('adminDashboardActiveShifts')} value={activeShiftsCount} icon={ClockIcon} />
          {usersByRole.map(item => (
            <StatCard key={item.role} title={item.role} value={item.count} icon={BriefcaseIcon} />
          ))}
        </div>
      </section>

      {/* Content Statistics */}
      <section className="mb-8">
        <h2 className={`text-xl font-semibold mb-4 ${textColor}`}>{t('adminDashboardContentStats')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {contentStats.map(stat => (
            <StatCard key={String(stat.labelKey)} title={t(stat.labelKey)} value={stat.count} icon={stat.icon} />
          ))}
        </div>
      </section>

      {/* User Management */}
      <section className="mb-8">
        <h2 className={`text-xl font-semibold mb-4 ${textColor}`}>{t('adminDashboardUserManagement')}</h2>
        <div className={`rounded-xl shadow-lg overflow-hidden ${cardBg} border`}>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                <tr>
                  <th className="p-3 text-left">{t('adminDashboardUserName')}</th>
                  <th className="p-3 text-left">{t('adminDashboardUserEmail')}</th>
                  <th className="p-3 text-left">{t('adminDashboardUserRole')}</th>
                  <th className="p-3 text-left">{t('adminDashboardUserTeam')}</th>
                  <th className="p-3 text-left">{t('adminDashboardUserActions')}</th>
                </tr>
              </thead>
              <tbody className={`${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'} ${textColor}`}>
                {allUsers.map(user => (
                  <tr key={user.id} className={`${theme === 'dark' ? 'hover:bg-gray-700/70' : 'hover:bg-gray-50/70'}`}>
                    <td className={`p-3 whitespace-nowrap border-t ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}>{user.name}</td>
                    <td className={`p-3 whitespace-nowrap border-t ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}>{user.email || t('N_A')}</td>
                    <td className={`p-3 whitespace-nowrap border-t ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}>{t(`userRole_${user.role}` as keyof TranslationSet, user.role)}</td>
                    <td className={`p-3 whitespace-nowrap border-t ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}>{user.teamName}</td>
                    <td className={`p-3 whitespace-nowrap border-t ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}>
                      <button className="text-xs text-blue-500 hover:underline mr-2 rtl:ml-2" onClick={() => addToast(t('adminDashboardViewDetails') + ": " + user.name, "info")}>{t('adminDashboardViewDetails')}</button>
                      <button className="text-xs text-yellow-500 hover:underline" onClick={() => addToast(t('adminDashboardEditRole') + ": " + user.name, "info")}>{t('adminDashboardEditRole')}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      
      {/* Quick Actions */}
      <section className="mb-8">
        <h2 className={`text-xl font-semibold mb-4 ${textColor}`}>{t('adminDashboardQuickActions')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map(action => (
            <button key={String(action.labelKey)} onClick={action.action} className={actionButtonClasses}>
              <action.icon className="h-4 w-4" />
              {t(action.labelKey)}
            </button>
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      <section>
        <h2 className={`text-xl font-semibold mb-4 ${textColor}`}>{t('adminDashboardRecentActivity')}</h2>
        <div className={`p-4 rounded-xl shadow-lg ${cardBg} border`}>
          {activityLogEntries.length === 0 ? (
            <p className={`${textColor} text-center`}>{t('adminDashboardNoActivity')}</p>
          ) : (
            <ul className="space-y-2 max-h-60 overflow-y-auto">
              {activityLogEntries.slice(0, 5).map(entry => (
                <li key={entry.id} className={`text-xs p-2 rounded-md ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'}`}>
                  <span className={`font-medium ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>{entry.userName}:</span> {t(entry.descriptionKey, entry.details as any)}
                  <span className={`block text-[10px] ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>{new Date(entry.timestamp).toLocaleString(language)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboardView;