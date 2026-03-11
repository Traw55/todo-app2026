/**
 * مكون إدخال المهام - يحتوي على نموذج لإضافة مهام جديدة مع الوقت والتاريخ والتذكير
 * Task Input Component - Contains form for adding new tasks with time, date, and reminder
 */
const TaskInput = ({
  task,
  setTask,
  scheduledDate,
  setScheduledDate,
  scheduledTime,
  setScheduledTime,
  reminderOffset,
  setReminderOffset,
  addTodo,
  t
}) => {
  // Helper to show user-friendly date
  const formatDisplayDate = (isoDate, locale = navigator.language || "en-US") => {
    if (!isoDate) return "";
    const dateObj = new Date(isoDate);
    return dateObj.toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const locale = navigator.language || "en-US";
  const displayDate = formatDisplayDate(scheduledDate, locale);

  return (
    <aside className="input-section">
      <div className="input-group">
        {/* حقل نص المهمة / Task text field */}
        <input
          className="task-input"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder={t.placeholder}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
        />

        <div className="date-time-grid">
          {/* التاريخ */}
          <div className="schedule-group">
            <label>{t.scheduleDateLabel}</label>
            <input
              type="date"
              className="date-input"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              pattern="\d{4}-\d{2}-\d{2}"
              inputMode="numeric"
              lang={locale}
            />
            <div className="date-display">
              {displayDate && (
                <span style={{ fontSize: "0.9em", color: "#888" }}>
                  {displayDate}
                </span>
              )}
            </div>
          </div>

          {/* الوقت */}
          <div className="schedule-group">
            <label>{t.scheduleTimeLabel}</label>
            <input
              type="time"
              className="time-input"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              inputMode="numeric"
              lang={locale}
            />
          </div>
        </div>

        {/* اختيار وقت التذكير / Reminder offset selection */}
        <div className="reminder-group">
          <label>{t.reminderLabel}</label>
          <select
            className="reminder-select"
            value={reminderOffset}
            onChange={(e) => setReminderOffset(parseInt(e.target.value))}
          >
            <option value="0">{t.noReminder}</option>
            <option value="5">{t.mins5}</option>
            <option value="10">{t.mins10}</option>
            <option value="15">{t.mins15}</option>
            <option value="30">{t.mins30}</option>
          </select>
        </div>

        {/* زر الإضافة / Add task button */}
        <button className="add-btn" onClick={addTodo}>
          {t.addButton}
        </button>
      </div>
    </aside>
  );
};

export default TaskInput;
