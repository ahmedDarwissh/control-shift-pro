import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { ActivityLogEntry, ActivityLogType, Language, LoggedInUser, TranslationSet } from '../types';
import { useLanguageContext } from '../hooks/useLanguage'; // Correct relative path

export interface ActivityLogContextType {
  activityLogEntries: ActivityLogEntry[];
  addActivityLogEntry: (
    type: ActivityLogType,
    descriptionKey: keyof TranslationSet,
    details?: Record<string, string | number | undefined>, // Allow undefined for optional details
    userNameOverride?: string
  ) => void;
}

export const ActivityLogContext = createContext<ActivityLogContextType | undefined>(undefined);

interface ActivityLogProviderProps {
  children: ReactNode;
}

const MAX_LOG_ENTRIES = 100; // Limit the number of log entries stored

export const ActivityLogProvider: React.FC<ActivityLogProviderProps> = ({ children }) => {
  const [activityLogEntries, setActivityLogEntries] = useState<ActivityLogEntry[]>([]);
  const { language, t } = useLanguageContext(); // Get language and t for potential default user name

  // Load entries from localStorage on mount
  useEffect(() => {
    try {
      const storedEntries = localStorage.getItem('appActivityLog');
      if (storedEntries) {
        const parsedEntries: ActivityLogEntry[] = JSON.parse(storedEntries).map((entry: any) => ({
          ...entry,
          timestamp: new Date(entry.timestamp), // Ensure timestamp is a Date object
        }));
        setActivityLogEntries(parsedEntries);
      }
    } catch (error) {
      console.error("Error loading activity log from localStorage:", error);
      // Optional: Clear corrupted data
      // localStorage.removeItem('appActivityLog');
    }
  }, []);

  // Save entries to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('appActivityLog', JSON.stringify(activityLogEntries));
    } catch (error) {
      console.error("Error saving activity log to localStorage:", error);
    }
  }, [activityLogEntries]);

  const addActivityLogEntry = useCallback(
    (
      type: ActivityLogType,
      descriptionKey: keyof TranslationSet,
      details?: Record<string, string | number | undefined>,
      userNameOverride?: string
    ) => {
      const newEntry: ActivityLogEntry = {
        id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type,
        timestamp: new Date(),
        userName: userNameOverride || (language === Language.AR ? 'مستخدم فهلوي' : 'Fahlawy User'), // Generic default if no override/user context
        descriptionKey,
        details: details || {},
      };

      setActivityLogEntries((prevEntries) => {
        const updatedEntries = [newEntry, ...prevEntries];
        if (updatedEntries.length > MAX_LOG_ENTRIES) {
          return updatedEntries.slice(0, MAX_LOG_ENTRIES); // Keep only the latest MAX_LOG_ENTRIES
        }
        return updatedEntries;
      });
    },
    [language] // Add language dependency if default userName uses it
  );

  return (
    <ActivityLogContext.Provider value={{ activityLogEntries, addActivityLogEntry }}>
      {children}
    </ActivityLogContext.Provider>
  );
};
