/**
 * مكون شريط التقدم - يعرض نسبة الإنجاز اليومي للمهام
 * Progress Bar Component - Displays the daily task completion progress
 */
const ProgressBar = ({ totalTasks, completedTasks, progressPercentage, t }) => {
  // لا يتم عرض المكون إذا لم تكن هناك مهام / Do not display if there are no tasks
  if (totalTasks === 0) return null;

  return (
    <div className="progress-section">
      {/* رأس قسم التقدم / Progress section header */}
      <div className="progress-header">
        <span className="progress-label">{t.progressTitle}</span>
        <span className="progress-stats">
          {completedTasks} {t.of} {totalTasks} {t.completedTasksCount}
        </span>
      </div>
      
      {/* شريط التقدم الفعلي / The actual progress bar */}
      <div className="progress-bar-container">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      
      {/* النسبة المئوية / Percentage display */}
      <span className="progress-percentage">{progressPercentage}%</span>
    </div>
  );
};

export default ProgressBar;
