
<<<<<<< HEAD
import React, { useState, FormEvent, useEffect, useContext } from 'react';
import { useLanguageContext } from '../hooks/useLanguage';
import { DailyTask } from '../types';
import { ThemeContext, LoggedInUser, ToastContext } from '../App'; 
import { Firestore, collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, deleteDoc, Timestamp } from "firebase/firestore";
import { TrashIcon } from '@heroicons/react/24/outline';
=======
import React, { useState, FormEvent, useEffect, useContext, Dispatch, SetStateAction } from 'react';
import { useLanguageContext } from '../hooks/useLanguage';
import { DailyTask, LoggedInUser, ActivityLogType, TranslationSet } from '../types';
import { ThemeContext } from '../contexts/ThemeContext';
import { ToastContext } from '../contexts/ToastContext'; // UPDATED IMPORT
import { useActivityLog } from '../hooks/useActivityLog';
import { TrashIcon, PlusCircleIcon, CameraIcon, MicrophoneIcon, StarIcon as StarIconSolid, FaceFrownIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/solid'; // Using solid for filled star
>>>>>>> bee2d85 (updated)

interface DailyTaskItemProps {
  task: DailyTask;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
<<<<<<< HEAD
}

const DailyTaskItem: React.FC<DailyTaskItemProps> = ({ task, onToggleComplete, onDelete }) => {
  const { language, t } = useLanguageContext();
  const { theme } = React.useContext(ThemeContext);
  
  const taskTimestamp = task.timestamp; // Assumed to be a JS Date object

  return (
    <div className={`flex items-center justify-between py-3.5 px-4 border-b 
      ${task.completed 
        ? (theme === 'dark' ? 'bg-green-900/20 border-green-700/30' : 'bg-green-50/50 border-green-200/50') 
        : (theme === 'dark' ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-200/70 hover:bg-gray-50/30')} 
      transition-colors group`}>
      <div className="flex items-center">
        <input 
          type="checkbox" 
          checked={task.completed} 
          onChange={() => onToggleComplete(task.id)}
          className={`form-checkbox h-5 w-5 rounded-md transition-all
            ${theme === 'dark' ? 'text-orange-500 focus:ring-orange-400 bg-gray-600 border-gray-500 checked:bg-orange-500 checked:border-orange-500' 
                               : 'text-orange-600 focus:ring-orange-500 border-gray-300 checked:bg-orange-600 checked:border-orange-600'} 
            ${language === 'ar' ? 'ml-3' : 'mr-3'}`}
          aria-label={task.description}
        />
        <span className={`${task.completed ? `line-through ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}` : (theme === 'dark' ? 'text-gray-200' : 'text-gray-800')} text-sm`}>
          {task.description}
        </span>
      </div>
      <div className="flex items-center space-x-2 rtl:space-x-reverse">
        <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
          {taskTimestamp.toLocaleTimeString(language, { hour: '2-digit', minute: '2-digit' })}
        </span>
        <button 
            onClick={() => onDelete(task.id)} 
            className={`p-1.5 rounded-md ${theme === 'dark' ? 'text-red-400 hover:bg-red-700/20 hover:text-red-300' : 'text-red-500 hover:bg-red-100 hover:text-red-600'} opacity-50 group-hover:opacity-100 transition-all`} 
=======
  onAttach: (id: string, type: 'photo' | 'audio') => void;
  onRate: (id: string, rating: 'star' | 'tired' | 'help') => void;
}

const DailyTaskItem: React.FC<DailyTaskItemProps> = ({ task, onToggleComplete, onDelete, onAttach, onRate }) => {
  const { language, t } = useLanguageContext();
  const { theme } = React.useContext(ThemeContext);
  
  const taskTimestamp = typeof task.timestamp === 'string' ? new Date(task.timestamp) : task.timestamp;

  return (
    <li className={`flex items-center justify-between py-3 px-4 border-b
      ${task.completed
        ? (theme === 'dark' ? 'bg-green-900/20 border-green-700/30' : 'bg-green-50/50 border-green-200/50')
        : (theme === 'dark' ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-200/70 hover:bg-gray-50/30')}
      transition-colors group min-h-[30px] leading-[30px]`}>
      <div className="flex items-center flex-grow min-w-0"> {/* Allow text to shrink */}
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleComplete(task.id)}
          className={`form-checkbox h-5 w-5 rounded-md transition-all flex-shrink-0
            ${theme === 'dark' ? 'text-orange-500 focus:ring-orange-400 bg-gray-600 border-gray-500 checked:bg-orange-500 checked:border-orange-500'
                               : 'text-orange-600 focus:ring-orange-500 border-gray-300 checked:bg-orange-600 checked:border-orange-600'}
            ${language === 'ar' ? 'ml-3' : 'mr-3'}`}
          aria-label={task.description}
        />
        <span className={`${task.completed ? `line-through ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}` : (theme === 'dark' ? 'text-gray-200' : 'text-gray-800')} text-sm truncate`}>
          {task.description}
        </span>
      </div>
      <div className="flex items-center space-x-1 rtl:space-x-reverse flex-shrink-0">
        <button onClick={() => onRate(task.id, 'star')} className={`p-1 rounded-md ${theme === 'dark' ? 'text-yellow-400 hover:bg-yellow-700/20' : 'text-yellow-500 hover:bg-yellow-100'} opacity-50 group-hover:opacity-100 focus:opacity-100 transition-opacity`} title={t('taskActionRateStar')} aria-label={t('taskActionRateStar')}><StarIconSolid className="h-4 w-4"/></button>
        <button onClick={() => onRate(task.id, 'tired')} className={`p-1 rounded-md ${theme === 'dark' ? 'text-orange-400 hover:bg-orange-700/20' : 'text-orange-500 hover:bg-orange-100'} opacity-50 group-hover:opacity-100 focus:opacity-100 transition-opacity`} title={t('taskActionRateTired')} aria-label={t('taskActionRateTired')}><FaceFrownIcon className="h-4 w-4"/></button>
        <button onClick={() => onRate(task.id, 'help')} className={`p-1 rounded-md ${theme === 'dark' ? 'text-sky-400 hover:bg-sky-700/20' : 'text-sky-500 hover:bg-sky-100'} opacity-50 group-hover:opacity-100 focus:opacity-100 transition-opacity`} title={t('taskActionRateNeedsHelp')} aria-label={t('taskActionRateNeedsHelp')}><QuestionMarkCircleIcon className="h-4 w-4"/></button>
        <button
            onClick={() => onAttach(task.id, 'photo')}
            className={`p-1 rounded-md ${theme === 'dark' ? 'text-teal-400 hover:bg-teal-700/20' : 'text-teal-500 hover:bg-teal-100'} opacity-50 group-hover:opacity-100 focus:opacity-100 transition-opacity`}
            title={language === 'ar' ? 'إرفاق صورة' : 'Attach Photo'}
            aria-label={language === 'ar' ? `إرفاق صورة لمهمة: ${task.description}` : `Attach photo to task: ${task.description}`}
        >
            <CameraIcon className="h-4 w-4"/>
        </button>
        <button
            onClick={() => onAttach(task.id, 'audio')}
            className={`p-1 rounded-md ${theme === 'dark' ? 'text-purple-400 hover:bg-purple-700/20' : 'text-purple-500 hover:bg-purple-100'} opacity-50 group-hover:opacity-100 focus:opacity-100 transition-opacity`}
            title={language === 'ar' ? 'إرفاق صوت' : 'Attach Audio'}
            aria-label={language === 'ar' ? `إرفاق صوت لمهمة: ${task.description}` : `Attach audio to task: ${task.description}`}
        >
            <MicrophoneIcon className="h-4 w-4"/>
        </button>
        <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
          {taskTimestamp.toLocaleTimeString(language, { hour: '2-digit', minute: '2-digit' })}
        </span>
        <button
            onClick={() => onDelete(task.id)}
            className={`p-1.5 rounded-md ${theme === 'dark' ? 'text-red-400 hover:bg-red-700/20 hover:text-red-300' : 'text-red-500 hover:bg-red-100 hover:text-red-600'} opacity-50 group-hover:opacity-100 focus:opacity-100 transition-all`}
>>>>>>> bee2d85 (updated)
            title={language === 'ar' ? 'حذف المهمة' : 'Delete Task'}
            aria-label={language === 'ar' ? `حذف مهمة: ${task.description}` : `Delete task: ${task.description}`}
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
<<<<<<< HEAD
    </div>
  );
};

interface DailyTasksViewProps {
  db: Firestore;
  loggedInUser: LoggedInUser | null;
}

const DailyTasksView: React.FC<DailyTasksViewProps> = ({ db, loggedInUser }) => {
  const { t, language } = useLanguageContext();
  const { theme } = React.useContext(ThemeContext);
  const { addToast } = useContext(ToastContext);

  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loggedInUser?.firebaseUid) {
      setIsLoading(false);
      setTasks([]); // Clear tasks if user logs out or not available
      return;
    }
    setIsLoading(true);
    const tasksRef = collection(db, `users/${loggedInUser.firebaseUid}/dailyTasks`);
    const q = query(tasksRef, orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedTasks: DailyTask[] = [];
      querySnapshot.forEach((docSnapshot) => { // Renamed doc to docSnapshot to avoid conflict
        const data = docSnapshot.data();
        // Ensure timestamp is converted to Date, handling cases where it might be null or already a Date
        let timestampDate: Date;
        if (data.timestamp instanceof Timestamp) {
            timestampDate = data.timestamp.toDate();
        } else if (data.timestamp instanceof Date) {
            timestampDate = data.timestamp;
        } else if (typeof data.timestamp === 'object' && data.timestamp && 'seconds' in data.timestamp && 'nanoseconds' in data.timestamp) {
            // Handle Firestore Timestamp-like object that isn't an instance of Timestamp (e.g. from cache)
            timestampDate = new Timestamp(data.timestamp.seconds, data.timestamp.nanoseconds).toDate();
        } else {
            timestampDate = new Date(); // Fallback for unexpected format
            console.warn("Task timestamp was not in expected Firestore Timestamp format:", data.timestamp);
        }

        fetchedTasks.push({
          id: docSnapshot.id,
          userId: data.userId,
          description: data.description,
          timestamp: timestampDate,
          completed: data.completed,
          notes: data.notes,
        });
      });
      setTasks(fetchedTasks);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching tasks:", error);
      let specificErrorMessage = t('profileDataLoadError'); // General fallback
      if (error.code === 'unavailable' || (error.message && error.message.toLowerCase().includes("offline"))) {
         specificErrorMessage = language === 'ar' 
            ? 'فشل تحميل المهام: أنت غير متصل. حاول مرة أخرى عندما يكون هناك اتصال.' 
            : 'Failed to load tasks: You are offline. Try again when connected.';
      }
      addToast(specificErrorMessage, 'alert');
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [db, loggedInUser?.firebaseUid, addToast, language, t]);


  const handleAddTask = async (e: FormEvent) => {
    e.preventDefault();
    if (!newTaskDescription.trim() || !loggedInUser?.firebaseUid) {
      addToast(language === 'ar' ? 'اكتب وصف المهمة أولاً يا بطل.' : 'Enter task description first, champ.', 'alert');
      return;
    }

    try {
      const tasksRef = collection(db, `users/${loggedInUser.firebaseUid}/dailyTasks`);
      await addDoc(tasksRef, {
        userId: loggedInUser.firebaseUid,
        description: newTaskDescription,
        timestamp: serverTimestamp(),
        completed: false,
      });
      setNewTaskDescription('');
      addToast(language === 'ar' ? 'تم إضافة المهمة بنجاح!' : 'Task added successfully!', 'success');
    } catch (error: any) {
      console.error("Error adding task:", error);
      let specificErrorMessage = language === 'ar' ? 'فشل إضافة المهمة. حاول مرة أخرى.' : 'Failed to add task. Try again.';
      if (error.message && error.message.toLowerCase().includes("offline") || error.code === 'unavailable') {
          specificErrorMessage = language === 'ar' ? 'فشل إضافة المهمة (أنت غير متصل). سيتم المحاولة تلقائياً عند عودة الاتصال.' : 'Failed to add task (offline). Will retry automatically when connected.';
      }
      addToast(specificErrorMessage, 'alert');
    }
  };

  const handleToggleComplete = async (id: string) => {
    if (!loggedInUser?.firebaseUid) return;
    const task = tasks.find(t => t.id === id);
    if (task) {
      const taskRef = doc(db, `users/${loggedInUser.firebaseUid}/dailyTasks`, id);
      try {
        await updateDoc(taskRef, { completed: !task.completed });
        // Optional: Add toast for completion
      } catch (error: any) {
        console.error("Error updating task:", error);
        let specificErrorMessage = language === 'ar' ? 'فشل تحديث حالة المهمة.' : 'Failed to update task status.';
        if (error.message && error.message.toLowerCase().includes("offline") || error.code === 'unavailable') {
          specificErrorMessage = language === 'ar' ? 'فشل تحديث المهمة (أنت غير متصل).' : 'Failed to update task (offline).';
        }
        addToast(specificErrorMessage, 'alert');
      }
=======
    </li>
  );
};

export interface DailyTasksViewProps { 
  loggedInUser: LoggedInUser | null;
  setLoggedInUser: Dispatch<SetStateAction<LoggedInUser | null>>;
}

const MOCK_TASKS_INITIAL: DailyTask[] = [
  { id: 'task-mock-1', userId: 'mockuser001', description: 'فحص مستوى زيت المولد الاحتياطي', timestamp: new Date(Date.now() - 3600000 * 2), completed: false, notes: 'تم التأجيل بسبب المطر' },
  { id: 'task-mock-2', userId: 'mockuser001', description: 'تأكيد إغلاق جميع صمامات الغاز بعد تفريغ الشحنة', timestamp: new Date(Date.now() - 3600000 * 1), completed: true },
  { id: 'task-mock-3', userId: 'mockuser001', description: 'كتابة تقرير الوردية المسائية', timestamp: new Date(), completed: false },
];

const DailyTasksView: React.FC<DailyTasksViewProps> = ({ loggedInUser, setLoggedInUser }) => {
  const { t, language } = useLanguageContext();
  const { theme } = React.useContext(ThemeContext);
  const { addToast } = useContext(ToastContext);
  const { addActivityLogEntry } = useActivityLog();

  const [tasks, setTasks] = useState<DailyTask[]>(MOCK_TASKS_INITIAL);
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddTask = async (e: FormEvent) => {
    e.preventDefault();
    if (!newTaskDescription.trim() || !loggedInUser) {
      addToast(language === 'ar' ? 'اكتب وصف المهمة أولاً يا بطل.' : 'Enter task description first, champ.', 'alert');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
        const newTask: DailyTask = {
            id: `task-local-${Date.now()}`,
            userId: loggedInUser.id,
            description: newTaskDescription,
            timestamp: new Date(),
            completed: false,
        };
        setTasks(prevTasks => [newTask, ...prevTasks]);
        addActivityLogEntry(ActivityLogType.TaskAdded, 'activityLogEntryTaskAdded', { userName: loggedInUser.name, taskDescription: newTask.description });
        setNewTaskDescription('');
        addToast(t('personalTaskAddedSuccess' as keyof TranslationSet, 'Task added!'), 'success');
        setIsLoading(false);
    }, 500);
  };

  const handleToggleComplete = async (id: string) => {
    let taskDescriptionForLog = "";
    let pointsChange = 0;
    let newCompletionStatus = false;

    setTasks(prevTasks =>
        prevTasks.map(task => {
            if (task.id === id) {
                taskDescriptionForLog = task.description;
                newCompletionStatus = !task.completed;
                pointsChange = newCompletionStatus ? 10 : -10;
                return { ...task, completed: newCompletionStatus };
            }
            return task;
        })
    );

    if (loggedInUser && setLoggedInUser) {
      setLoggedInUser(prevUser => {
        if (!prevUser) return null;
        const currentPoints = prevUser.expertisePoints || 0;
        const updatedPoints = newCompletionStatus ? currentPoints + 10 : Math.max(0, currentPoints - 10);
        addToast(t(newCompletionStatus ? 'expertisePointsEarnedToast' : 'expertisePointsLostToast', {points: Math.abs(pointsChange)} as any), 'success');
        addActivityLogEntry(
            newCompletionStatus ? ActivityLogType.TaskCompleted : ActivityLogType.TaskUncompleted,
            newCompletionStatus ? 'activityLogEntryTaskCompleted' : 'activityLogEntryTaskUncompleted',
            { userName: loggedInUser.name, taskDescription: taskDescriptionForLog, points: Math.abs(pointsChange) }
        );
        return { ...prevUser, expertisePoints: updatedPoints };
      });
>>>>>>> bee2d85 (updated)
    }
  };

  const handleDeleteTask = async (id: string) => {
<<<<<<< HEAD
    if (!loggedInUser?.firebaseUid) return;
    if (window.confirm(language === 'ar' ? 'هل أنت متأكد أنك تريد حذف هذه المهمة؟ مفيش رجوع في الكلام ده!' : 'Are you sure you want to delete this task? No take-backsies!')) {
      const taskRef = doc(db, `users/${loggedInUser.firebaseUid}/dailyTasks`, id);
      try {
        await deleteDoc(taskRef);
        addToast(language === 'ar' ? 'تم حذف المهمة. مع السلامة يا مهمة!' : 'Task deleted. Bye-bye task!', 'info');
      } catch (error: any) {
        console.error("Error deleting task:", error);
         let specificErrorMessage = language === 'ar' ? 'فشل حذف المهمة.' : 'Failed to delete task.';
        if (error.message && error.message.toLowerCase().includes("offline") || error.code === 'unavailable') {
          specificErrorMessage = language === 'ar' ? 'فشل حذف المهمة (أنت غير متصل).' : 'Failed to delete task (offline).';
        }
        addToast(specificErrorMessage, 'alert');
      }
    }
  };
  
  const pageTitleColor = theme === 'dark' ? 'text-orange-400' : 'text-orange-500';
  const cardBg = theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const inputBaseClasses = "w-full p-3 border rounded-lg shadow-sm focus:ring-2 text-sm";
  const lightInputClasses = "bg-white border-gray-300 text-gray-800 focus:ring-blue-600 focus:border-blue-600 placeholder-gray-500";
  const darkInputClasses = "bg-gray-700 border-gray-600 text-gray-100 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400";
  const themedInputClasses = theme === 'dark' ? darkInputClasses : lightInputClasses;
  const submitButtonClasses = `py-3 px-5 rounded-lg font-semibold transition-colors transform hover:scale-[1.02] shadow-md text-sm
    ${theme === 'dark' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`;

=======
    const taskToDelete = tasks.find(task => task.id === id);
    if (window.confirm(language === 'ar' ? 'هل أنت متأكد أنك تريد حذف هذه المهمة؟ مفيش رجوع في الكلام ده!' : 'Are you sure you want to delete this task? No take-backsies!')) {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
        if (loggedInUser && taskToDelete) {
            addActivityLogEntry(ActivityLogType.TaskDeleted, 'activityLogEntryTaskDeleted', { userName: loggedInUser.name, taskDescription: taskToDelete.description });
        }
        addToast(t('personalTaskDeletedSuccess' as keyof TranslationSet, 'Task deleted!'), 'info');
    }
  };

  const handleRateTask = (taskId: string, rating: 'star' | 'tired' | 'help') => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    let toastMessageKey: keyof TranslationSet;
    switch (rating) {
        case 'star': toastMessageKey = 'taskRatedStarToast'; break;
        case 'tired': toastMessageKey = 'taskRatedTiredToast'; break;
        case 'help': toastMessageKey = 'taskRatedNeedsHelpToast'; break;
        default: toastMessageKey = 'statusSuccessMessage'; // Fallback
    }
    addToast(t(toastMessageKey), 'info');
    console.log(`Task ${taskId} (${task.description}) rated as ${rating} by ${loggedInUser?.name}`);
  };

  const handleAttachToTask = (taskId: string, attachmentType: 'photo' | 'audio') => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      addToast(
        language === 'ar' 
        ? `ميزة إرفاق ${attachmentType === 'photo' ? 'صورة' : 'صوت'} للمهمة "${task.description}" هتكون موجودة قريب يا فهلوي!` 
        : `Attach ${attachmentType} to task "${task.description}" feature coming soon, Fahlawy!`,
        'info'
      );
      if (attachmentType === 'photo') {
        console.log("Mock: Requesting camera for task: ", taskId);
      } else {
        console.log("Mock: Requesting microphone for task: ", taskId);
      }
    }
  };

  const pageTitleColor = theme === 'dark' ? 'text-orange-400' : 'text-orange-500';
  const cardBg = theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const inputBaseClasses = "w-full p-3 border rounded-lg shadow-sm focus:ring-2 text-sm";
  const themedInputClasses = theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-600 focus:border-blue-600 placeholder-gray-500';
  const submitButtonClasses = `py-3 px-5 rounded-lg font-semibold transition-colors transform hover:scale-[1.02] shadow-md text-sm flex items-center justify-center gap-2
    ${theme === 'dark' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`;

  const today = new Date();
  const formattedDate = today.toLocaleDateString(language, { year: 'numeric', month: 'long', day: 'numeric' });
  const formattedDay = today.toLocaleDateString(language, { weekday: 'long' });
>>>>>>> bee2d85 (updated)

  return (
    <div className={`p-2 ${language === 'ar' ? 'font-cairo text-right' : 'font-poppins text-left'}`}>
      <h1 className={`text-2xl md:text-3xl font-bold mb-6 ${pageTitleColor}`}>
        {t('tasks')}
      </h1>
      <form onSubmit={handleAddTask} className={`p-5 md:p-6 rounded-xl shadow-xl mb-6 ${cardBg} border`}>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            placeholder={t('taskDescription')}
            className={`flex-grow ${inputBaseClasses} ${themedInputClasses}`}
            aria-label={t('taskDescription')}
          />
<<<<<<< HEAD
          <button type="submit" className={submitButtonClasses}>
            {t('addTask')}
=======
          <button type="submit" className={submitButtonClasses} disabled={isLoading}>
            <PlusCircleIcon className="h-5 w-5" />
            {isLoading ? (language === 'ar' ? 'جاري الإضافة...' : 'Adding...') : t('addTask')}
>>>>>>> bee2d85 (updated)
          </button>
        </div>
        <p className={`text-xs mt-3 text-center ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
          {t('dailyTaskPrompt')}
        </p>
      </form>

<<<<<<< HEAD
      <div className={`p-5 md:p-6 rounded-xl shadow-xl ${cardBg} border min-h-[200px]`}>
        {isLoading && <p className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{t('loadingMessage')}</p>}
        {!isLoading && tasks.length === 0 && (
          <p className={`text-center py-10 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
            {t('noTasks')} <span className="text-xl">🎉</span>
          </p>
        )}
        {!isLoading && tasks.length > 0 && (
          <div className="divide-y divide-gray-200 dark:divide-gray-700 -mx-4"> {/* Negative margin to extend dividers */}
            {tasks.map(task => (
              <DailyTaskItem key={task.id} task={task} onToggleComplete={handleToggleComplete} onDelete={handleDeleteTask}/>
            ))}
          </div>
        )}
=======
      <div className={`lined-paper-container rounded-xl shadow-xl ${cardBg} border overflow-hidden`}>
        <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'} flex justify-between items-center`}>
          <div>
            <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{t('dailyTasksLinedPaperDate', { date: formattedDate } as any)}</p>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{t('dailyTasksLinedPaperDay', { day: formattedDay } as any)}</p>
          </div>
           {loggedInUser && <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>{t('expertisePoints')}: {loggedInUser.expertisePoints}</p>}
        </div>
        <div className="lined-paper-content">
            {isLoading && tasks.length === 0 && <p className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{t('loadingMessage')}</p>}
            {!isLoading && tasks.length === 0 && (
            <p className={`text-center py-10 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                {t('noTasks')} <span className="text-xl">🎉</span>
            </p>
            )}
            {tasks.length > 0 && (
            <ul className="divide-y-0"> {/* Removed default divide-y for custom border in item */}
                {tasks.map(task => (
                <DailyTaskItem key={task.id} task={task} onToggleComplete={handleToggleComplete} onDelete={handleDeleteTask} onAttach={handleAttachToTask} onRate={handleRateTask}/>
                ))}
            </ul>
            )}
        </div>
>>>>>>> bee2d85 (updated)
      </div>
    </div>
  );
};

export default DailyTasksView;
