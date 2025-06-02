

<<<<<<< HEAD
<<<<<<< HEAD
import React, { useState, useContext } from 'react';
import { useLanguageContext } from '../hooks/useLanguage'; // Updated path
import { ThemeContext } from '../App';
=======
=======
>>>>>>> 96a8f29 (First commit)

import React, { useState, useContext } from 'react';
import { useLanguageContext } from '../hooks/useLanguage'; // Updated path
import { ThemeContext } from '../contexts/ThemeContext'; // Corrected import path
<<<<<<< HEAD
>>>>>>> bee2d85 (updated)
=======
>>>>>>> 96a8f29 (First commit)

interface TaskCard {
  id: string;
  titleKey: keyof ReturnType<typeof useLanguageContext>['translations'];
  descriptionKey: keyof ReturnType<typeof useLanguageContext>['translations'];
  column: 'todo' | 'inprogress' | 'done';
}

const KanbanView: React.FC = () => {
  const { t, language } = useLanguageContext();
  const { theme } = useContext(ThemeContext);

  const initialTasks: TaskCard[] = [
    { id: 'task1', titleKey: 'kanbanSampleTask1Title', descriptionKey: 'kanbanSampleTask1Desc', column: 'todo' },
    { id: 'task2', titleKey: 'kanbanSampleTask2Title', descriptionKey: 'kanbanSampleTask2Desc', column: 'todo' },
    { id: 'task3', titleKey: 'kanbanSampleTask3Title', descriptionKey: 'kanbanSampleTask3Desc', column: 'inprogress' },
    { id: 'task4', titleKey: 'kanbanSampleTask4Title', descriptionKey: 'kanbanSampleTask4Desc', column: 'inprogress' },
    { id: 'task5', titleKey: 'kanbanSampleTask5Title', descriptionKey: 'kanbanSampleTask5Desc', column: 'done' },
    { id: 'task6', titleKey: 'kanbanSampleTask6Title', descriptionKey: 'kanbanSampleTask6Desc', column: 'done' },
  ];

  const [tasks, setTasks] = useState<TaskCard[]>(initialTasks);

  const moveTask = (taskId: string) => {
    // This is a mock move; in a real app, you'd update the task's column
    setTasks(prevTasks => 
      prevTasks.map(task => {
        if (task.id === taskId) {
          if (task.column === 'todo') return { ...task, column: 'inprogress' };
          if (task.column === 'inprogress') return { ...task, column: 'done' };
          // If done, it stays done or could loop back to todo for testing
        }
        return task;
      })
    );
<<<<<<< HEAD
<<<<<<< HEAD
    alert(`${t('kanbanMoveTask')} (للТаسكاية: ${taskId}) -  ${language === 'ar' ? 'لسه بنظبط السحب والإفلات الحقيقي!' : 'Actual drag & drop coming soon!'}`);
=======
    alert(`${t('kanbanMoveTask')} (للمهمة: ${taskId}) -  ${language === 'ar' ? 'لسه بنظبط السحب والإفلات الحقيقي!' : 'Actual drag & drop coming soon!'}`);
>>>>>>> bee2d85 (updated)
=======
    alert(`${t('kanbanMoveTask')} (للمهمة: ${taskId}) -  ${language === 'ar' ? 'لسه بنظبط السحب والإفلات الحقيقي!' : 'Actual drag & drop coming soon!'}`);
>>>>>>> 96a8f29 (First commit)
  };

  const columns: { id: TaskCard['column']; titleKey: keyof ReturnType<typeof useLanguageContext>['translations'] }[] = [
    { id: 'todo', titleKey: 'kanbanTodo' },
    { id: 'inprogress', titleKey: 'kanbanInProgress' },
    { id: 'done', titleKey: 'kanbanDone' },
  ];

  return (
    <div className={`p-1 ${language === 'ar' ? 'font-cairo text-right' : 'font-poppins text-left'}`}>
<<<<<<< HEAD
<<<<<<< HEAD
      <h1 className={`text-2xl md:text-3xl font-bold mb-6 md:mb-8 ${theme === 'dark' ? 'text-bright-yellow' : 'text-marine-blue'}`}>
=======
      <h1 className={`text-2xl md:text-3xl font-bold mb-6 md:mb-8 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-500'}`}>
>>>>>>> bee2d85 (updated)
=======
      <h1 className={`text-2xl md:text-3xl font-bold mb-6 md:mb-8 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-500'}`}>
>>>>>>> 96a8f29 (First commit)
        {t('kanbanBoardTitle')}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {columns.map(column => (
<<<<<<< HEAD
<<<<<<< HEAD
          <div key={column.id} className={`p-3 rounded-lg shadow-md min-h-[300px] ${theme === 'dark' ? 'bg-dark-card border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
=======
          <div key={column.id} className={`p-3 rounded-lg shadow-md min-h-[300px] ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
>>>>>>> bee2d85 (updated)
=======
          <div key={column.id} className={`p-3 rounded-lg shadow-md min-h-[300px] ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
>>>>>>> 96a8f29 (First commit)
            <h2 className={`text-lg font-semibold mb-4 pb-2 border-b ${theme === 'dark' ? 'text-gray-200 border-gray-600' : 'text-gray-700 border-gray-300'} ${language === 'ar' ? 'font-cairo' : 'font-poppins'}`}>
              {t(column.titleKey)}
            </h2>
            <div className="space-y-3">
              {tasks.filter(task => task.column === column.id).map(task => (
                <div key={task.id} className={`p-3 rounded-md shadow-sm hover:shadow-lg transition-shadow ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-800'}`}>
<<<<<<< HEAD
<<<<<<< HEAD
                  <h3 className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-bright-yellow' : 'text-marine-blue'}`}>{t(task.titleKey)}</h3>
=======
                  <h3 className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`}>{t(task.titleKey)}</h3>
>>>>>>> bee2d85 (updated)
=======
                  <h3 className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`}>{t(task.titleKey)}</h3>
>>>>>>> 96a8f29 (First commit)
                  <p className="text-xs mb-2">{t(task.descriptionKey)}</p>
                  {column.id !== 'done' && (
                    <button 
                      onClick={() => moveTask(task.id)}
                      className={`w-full text-xs py-1 px-2 rounded transition-colors 
                        ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                    >
                      {t('kanbanMoveTask')}
                    </button>
                  )}
                  {column.id === 'done' && (
                     <p className={`text-xs text-center py-1 rounded ${theme === 'dark' ? 'bg-green-800 text-green-300' : 'bg-green-100 text-green-700'}`}>
                        {language === 'ar' ? 'مهمة منتهية يا بطل!' : 'Task Completed, Champ!'}
                     </p>
                  )}
                </div>
              ))}
              {tasks.filter(task => task.column === column.id).length === 0 && (
                <p className={`text-xs text-center italic ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                  {language === 'ar' ? 'العمود ده فاضي يا ريس، شكلك مخلص شغل بدري!' : 'This column is empty, chief! Looks like you finished early!'}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <p className={`mt-8 md:mt-10 text-xs md:text-sm text-center ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
        {t('kanbanFooter')}
      </p>
    </div>
  );
};

export default KanbanView;
