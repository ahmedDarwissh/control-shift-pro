<<<<<<< HEAD
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { ActivityLogEntry, ActivityLogType, Language, LoggedInUser, TranslationSet } from '../types';
import { useLanguageContext } from '../hooks/useLanguage'; // Correct relative path
=======

import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { ActivityLogEntry, ActivityLogType, Language, LoggedInUser, TranslationSet } from '../types';
import { useLanguageContext } from '../hooks/useLanguage'; 
import { db, auth } from '../firebase'; // Firebase integration
import { ref, push, serverTimestamp, query, orderByChild, limitToLast, get, DataSnapshot, set } from 'firebase/database'; // Correct imports for RTDB, added set
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

>>>>>>> 96a8f29 (First commit)

export interface ActivityLogContextType {
  activityLogEntries: ActivityLogEntry[];
  addActivityLogEntry: (
    type: ActivityLogType,
    descriptionKey: keyof TranslationSet,
<<<<<<< HEAD
    details?: Record<string, string | number | undefined>, // Allow undefined for optional details
    userNameOverride?: string
  ) => void;
=======
    details?: Record<string, string | number | undefined>, 
    userNameOverride?: string
  ) => void;
  fetchInitialLogs: (userId: string) => void;
>>>>>>> 96a8f29 (First commit)
}

export const ActivityLogContext = createContext<ActivityLogContextType | undefined>(undefined);

interface ActivityLogProviderProps {
  children: ReactNode;
}

<<<<<<< HEAD
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
=======
const MAX_LOG_ENTRIES_LOCAL = 50; // Limit local state, Firebase can store more

export const ActivityLogProvider: React.FC<ActivityLogProviderProps> = ({ children }) => {
  const [activityLogEntries, setActivityLogEntries] = useState<ActivityLogEntry[]>([]);
  const { language, t } = useLanguageContext(); 
  const [currentFbUser, setCurrentFbUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentFbUser(user);
      if (user) {
        fetchInitialLogs(user.uid);
      } else {
        setActivityLogEntries([]); // Clear logs on logout
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchInitialLogs = useCallback(async (userId: string) => {
    if (!userId) return;
    try {
      const logsRef = query(
        ref(db, `activity_logs/${userId}`),
        orderByChild('timestamp'),
        limitToLast(MAX_LOG_ENTRIES_LOCAL)
      );
      const snapshot: DataSnapshot = await get(logsRef);
      if (snapshot.exists()) {
        const logsData = snapshot.val();
        const fetchedEntries: ActivityLogEntry[] = Object.keys(logsData)
          .map(key => ({
            id: key,
            ...logsData[key],
            timestamp: new Date(logsData[key].timestamp) // Ensure timestamp is a Date object
          }))
          .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()); // Sort descending
        setActivityLogEntries(fetchedEntries);
      } else {
        setActivityLogEntries([]);
      }
    } catch (error) {
      console.error("Error fetching activity logs from Firebase:", error);
    }
  }, []);


  const addActivityLogEntry = useCallback(
    async (
>>>>>>> 96a8f29 (First commit)
      type: ActivityLogType,
      descriptionKey: keyof TranslationSet,
      details?: Record<string, string | number | undefined>,
      userNameOverride?: string
    ) => {
<<<<<<< HEAD
      const newEntry: ActivityLogEntry = {
        id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type,
        timestamp: new Date(),
        userName: userNameOverride || (language === Language.AR ? 'مستخدم فهلوي' : 'Fahlawy User'), // Generic default if no override/user context
=======
      const loggedInUserName = currentFbUser?.displayName || currentFbUser?.email?.split('@')[0] || (language === Language.AR ? 'مستخدم فهلوي' : 'Fahlawy User');
      
      const newEntry: Omit<ActivityLogEntry, 'id'> & { timestamp: any } = { // Use 'any' for serverTimestamp() compatibility
        type,
        timestamp: serverTimestamp(), // Firebase server timestamp
        userName: userNameOverride || loggedInUserName,
>>>>>>> 96a8f29 (First commit)
        descriptionKey,
        details: details || {},
      };

<<<<<<< HEAD
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
=======
      if (currentFbUser) {
        try {
          const userLogRef = ref(db, `activity_logs/${currentFbUser.uid}`);
          const newLogPushRef = push(userLogRef); // Generates a unique ID
          await set(newLogPushRef, newEntry);
          
          // Optimistically update local state
          setActivityLogEntries((prevEntries) => {
            const optimisticEntry: ActivityLogEntry = {
              ...newEntry,
              id: newLogPushRef.key || `local-${Date.now()}`, // Use pushed key or fallback
              timestamp: new Date() // Use local date for optimistic update
            };
            const updatedEntries = [optimisticEntry, ...prevEntries];
            return updatedEntries.slice(0, MAX_LOG_ENTRIES_LOCAL);
          });

        } catch (error) {
          console.error("Error saving activity log to Firebase:", error);
          // Handle error (e.g., show toast)
        }
      } else {
         // Handle case where user is not logged in, perhaps log locally or ignore
         console.warn("User not logged in, activity log not saved to Firebase for type:", type);
         // Fallback to local-only update if desired for offline/anonymous actions
         setActivityLogEntries((prevEntries) => {
            const optimisticEntry: ActivityLogEntry = {
              ...newEntry,
              id: `local-${Date.now()}`, 
              timestamp: new Date() 
            };
            const updatedEntries = [optimisticEntry, ...prevEntries];
            return updatedEntries.slice(0, MAX_LOG_ENTRIES_LOCAL);
          });
      }
    },
    [currentFbUser, language] 
  );

  return (
    <ActivityLogContext.Provider value={{ activityLogEntries, addActivityLogEntry, fetchInitialLogs }}>
>>>>>>> 96a8f29 (First commit)
      {children}
    </ActivityLogContext.Provider>
  );
};
