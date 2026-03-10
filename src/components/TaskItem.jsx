/**
 * مكون عنصر المهمة - يمثل مهمة واحدة في القائمة مع إمكانية العرض أو التحرير
 * Task Item Component - Represents a single task in the list with view/edit modes
 */
const TaskItem = ({ 
  todo, 
  index, 
  isEditing, 
  isSelected, 
  selectionMode, 
  toggleSelection, 
  editTask, 
  setEditTask, 
  editDate, 
  setEditDate, 
  editTime, 
  setEditTime, 
  editReminderOffset, 
  setEditReminderOffset, 
  saveEdit, 
  cancelEditing, 
  toggleTodo, 
  startEditing, 
  deleteTodo, 
  todayStr, 
  lang, 
  t 
}) => {
  // دالة لتحويل الوقت من 24 ساعة إلى 12 ساعة
  const formatTime12h = (timeStr) => {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(":");
    let h = parseInt(hours);
    const ampm = h >= 12 ? t.pm : t.am;
    h = h % 12;
    h = h ? h : 12;
    return `${h.toString().padStart(2, "0")}:${minutes} ${ampm}`;
  };

  // منطق اللون حسب حالة المهمة
  const now = new Date();
  const taskDateTime = new Date(`${todo.date}T${todo.time}`);
  let colorClass = "";
  if (taskDateTime < now && !todo.completed) colorClass = "red-task";
  if (taskDateTime < now && todo.completed) colorClass = "green-task";

  return (
    <li 
      className={`${todo.completed ? "completed" : ""} ${isEditing ? "editing" : ""} ${isSelected ? "selected" : ""} ${colorClass}`}
      onClick={() => selectionMode && toggleSelection(index)}
    >
      {/* وضع التحديد / Selection mode checkbox */}
      {selectionMode && (
        <div className="selection-checkbox">
          <div className={`checkbox-custom ${isSelected ? "checked" : ""}`}>
            {isSelected && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            )}
          </div>
        </div>
      )}

      {isEditing ? (
        /* وضع التعديل / Editing mode container */
        <div className="edit-container">
          {/* حقل نص المهمة / Task text input */}
          <input
            className="edit-input"
            value={editTask}
            onChange={(e) => setEditTask(e.target.value)}
            autoFocus
          />
          {/* حقول التاريخ والوقت / Date and Time inputs */}
          <div className="edit-meta">
            <input
              type="date"
              className="edit-date-input"
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
            />
            <input
              type="time"
              className="edit-time-input"
              value={editTime}
              onChange={(e) => setEditTime(e.target.value)}
            />
          </div>
          {/* اختيار التذكير في وضع التعديل / Reminder selection in edit mode */}
          <div className="edit-reminder-group">
            <label>{t.reminderLabel}</label>
            <select 
              className="edit-reminder-select"
              value={editReminderOffset}
              onChange={(e) => setEditReminderOffset(parseInt(e.target.value))}
            >
              <option value="0">{t.noReminder}</option>
              <option value="5">{t.mins5}</option>
              <option value="10">{t.mins10}</option>
              <option value="15">{t.mins15}</option>
              <option value="30">{t.mins30}</option>
            </select>
          </div>
          {/* أزرار الحفظ والإلغاء / Save and Cancel buttons */}
          <div className="edit-actions">
            <button className="save-btn" onClick={() => saveEdit(index)}>{t.saveButton}</button>
            <button className="cancel-btn" onClick={cancelEditing}>{t.cancelButton}</button>
          </div>
        </div>
      ) : (
        /* وضع العرض / Display mode container */
        <>
          <div className="todo-content">
            <span className="todo-text">{todo.text}</span>
            <div className="todo-meta">
              <span className="todo-date">{todo.date}</span>
              <span className="todo-time">{formatTime12h(todo.time)}</span>
            </div>
          </div>
          
          {/* أزرار التحكم (تظهر فقط عند عدم وجود وضع التحديد) / Item actions (only in non-selection mode) */}
          {!selectionMode && (
            <div className="item-actions">
              {/* 1. زر إكمال المهمة / Complete task button */}
              <button 
                className={`complete-btn ${todo.completed ? "done" : ""}`} 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleTodo(index);
                }}
                title={todo.completed ? t.completedTasks : t.addButton}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </button>

              {/* 2. زر تعديل المهمة / Edit task button */}
              <button 
                className="edit-btn" 
                onClick={(e) => {
                  e.stopPropagation();
                  startEditing(index);
                }}
                title={t.editButton}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>

              {/* 3. زر حذف المهمة / Delete task button */}
              <button 
                className="delete-btn" 
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTodo(index);
                }}
                title={t.deleteButton}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          )}
        </>
      )}
    </li>
  );
};

export default TaskItem;
