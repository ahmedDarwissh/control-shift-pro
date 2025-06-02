import { useContext } from 'react';
import { ActivityLogContext, ActivityLogContextType } from '../contexts/ActivityLogContext'; // Correct relative path

export const useActivityLog = (): ActivityLogContextType => {
  const context = useContext(ActivityLogContext);
  if (context === undefined) {
    throw new Error('useActivityLog must be used within an ActivityLogProvider. Make sure your component is wrapped by it.');
  }
  return context;
};
