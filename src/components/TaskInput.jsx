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
  selectedCategory,
  setSelectedCategory,
  taskNotes,
  setTaskNotes,
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
                  data-custom-text={scheduledDate ? new Date(scheduledDate).toLocaleDateString("ar-SA", { year: "numeric", month: "2-digit", day: "2-digit" }) : ""}
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
                  data-custom-text={
                    scheduledTime 
                      ? new Date(`2000-01-01T${scheduledTime}`).toLocaleTimeString("ar-SA", { hour: '2-digit', minute: '2-digit', hour12: true })
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
                  data-custom-text={scheduledDate ? new Date(scheduledDate).toLocaleDateString("en-US", { year: "numeric", month: "2-digit", day: "2-digit" }) : ""}
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
                  data-custom-text={
                    scheduledTime 
                      ? new Date(`2000-01-01T${scheduledTime}`).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', hour12: true })
                      : ""
                  }
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

        {/* اختيار التصنيف / Category Selection */}
        <div className="category-group">
          <label>{t.categoryLabel}</label>
          <div className="category-options">
            {['work', 'personal', 'study', 'urgent'].map(cat => (
              <button
                key={cat}
                type="button"
                className={`category-btn ${selectedCategory === cat ? 'active' : ''} cat-${cat}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {t[`cat${cat.charAt(0).toUpperCase() + cat.slice(1)}`]}
              </button>
            ))}
          </div>
        </div>

        {/* الملاحظات / Notes */}
        <div className="notes-group">
          <label>{t.notesLabel}</label>
          <textarea
            className="notes-input"
            value={taskNotes}
            onChange={(e) => setTaskNotes(e.target.value)}
            placeholder={t.notesPlaceholder}
            rows="2"
          />
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
