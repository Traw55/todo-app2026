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
  t,
  lang
}) => {


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
          {lang === 'ar' ? (
            <>
              {/* التاريخ - يعرض أولاً ليكون فوق */}
              <div className="schedule-group">
                <label>{t.scheduleDateLabel}</label>
                <input
                  type="date"
                  className="date-input"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  pattern="\d{4}-\d{2}-\d{2}"
                  inputMode="numeric"
                  lang={lang}
                  data-ar-text={lang === 'ar' ? new Date(scheduledDate || new Date()).toLocaleDateString("ar-SA-u-ca-islamic", { year: "numeric", month: "long", day: "numeric" }) : ""}
                />
              </div>

              {/* الوقت - يعرض ثانياً ليكون تحت */}
              <div className="schedule-group">
                <label>{t.scheduleTimeLabel}</label>
                <input
                  type="time"
                  className="time-input"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  inputMode="numeric"
                  lang={lang}
                  data-ar-text={
                    lang === 'ar' && scheduledTime 
                      ? new Date(`2000-01-01T${scheduledTime}`).toLocaleTimeString("ar-SA", { hour: '2-digit', minute: '2-digit' })
                      : ""
                  }
                />
              </div>
            </>
          ) : (
            <>
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
                  lang={lang}
                />
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
                  lang={lang}
                />
              </div>
            </>
          )}
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
