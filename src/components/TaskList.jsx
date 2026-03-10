import TaskItem from "./TaskItem";

/**
 * مكون قائمة المهام - يعرض المهام حسب التصنيفات (العاجلة، المنتهية، الحالية، القادمة، المكتملة)
 * Task List Component - Displays tasks by categories (Urgent, Overdue, Current, Upcoming, Completed)
 */
const TaskList = ({ 
  todos, 
  categories, 
  collapsedSections, 
  toggleSection, 
  searchQuery, 
  setSearchQuery, 
  filterTab, 
  setFilterTab, 
  selectionMode, 
  selectedTasks, 
  toggleSelection, 
  startSelectionMode, 
  cancelSelectionMode, 
  bulkDelete, 
  editingIndex, 
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
  getTaskLabel, 
  lang, 
  t 
}) => {

  /**
   * دالة فرعية لعرض قائمة المهام لكل تصنيف
   */
  const renderCategoryList = (taskList, categoryKey) => {
    const isCollapsed = collapsedSections[categoryKey];
    const isEmpty = taskList.length === 0;
    
    if (isEmpty || isCollapsed) return null;

    return (
      <div className={`task-category-list ${categoryKey}-list`}>
        <ul>
          {taskList.map((todo) => {
            const originalIndex = todos.findIndex(item => item === todo);
            return (
              <TaskItem
                key={originalIndex}
                todo={todo}
                index={originalIndex}
                isEditing={editingIndex === originalIndex}
                isSelected={selectedTasks.includes(originalIndex)}
                selectionMode={selectionMode}
                toggleSelection={toggleSelection}
                editTask={editTask}
                setEditTask={setEditTask}
                editDate={editDate}
                setEditDate={setEditDate}
                editTime={editTime}
                setEditTime={setEditTime}
                editReminderOffset={editReminderOffset}
                setEditReminderOffset={setEditReminderOffset}
                saveEdit={saveEdit}
                cancelEditing={cancelEditing}
                toggleTodo={toggleTodo}
                startEditing={startEditing}
                deleteTodo={deleteTodo}
                todayStr={todayStr}
                lang={lang}
                t={t}
              />
            );
          })}
        </ul>
      </div>
    );
  };

  /**
   * دالة لعرض عنوان التصنيف كـ "زر" (للأقسام الخاصة)
   */
  const renderCategoryButton = (taskList, title, categoryKey, icon) => {
    const isCollapsed = collapsedSections[categoryKey];
    const isEmpty = taskList.length === 0;

    return (
      <button 
        className={`bulk-delete-start-btn ${categoryKey}-btn ${isEmpty ? "empty-faded" : "has-life"} ${isCollapsed ? "is-collapsed" : ""}`}
        onClick={() => toggleSection(categoryKey)}
        disabled={isEmpty}
      >
        {icon}
        {title}
      </button>
    );
  };

  /**
   * دالة لعرض الأقسام العادية (الحالية، القادمة، المكتملة)
   */
  const renderStandardCategory = (taskList, title, categoryKey) => {
    if (taskList.length === 0) return null;
    const isCollapsed = collapsedSections[categoryKey];

    return (
      <div className={`task-category standard-category ${categoryKey}-section ${isCollapsed ? "collapsed" : ""}`}>
        <h3 className="category-title" onClick={() => toggleSection(categoryKey)}>
          <span className="title-text">{title}</span>
          <span className="task-count">{taskList.length}</span>
          <svg className="collapse-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </h3>
        {!isCollapsed && (
          <ul>
            {taskList.map((todo) => {
              const originalIndex = todos.findIndex(item => item === todo);
              return (
                <TaskItem
                  key={originalIndex}
                  todo={todo}
                  index={originalIndex}
                  isEditing={editingIndex === originalIndex}
                  isSelected={selectedTasks.includes(originalIndex)}
                  selectionMode={selectionMode}
                  toggleSelection={toggleSelection}
                  editTask={editTask}
                  setEditTask={setEditTask}
                  editDate={editDate}
                  setEditDate={setEditDate}
                  editTime={editTime}
                  setEditTime={setEditTime}
                  editReminderOffset={editReminderOffset}
                  setEditReminderOffset={setEditReminderOffset}
                  saveEdit={saveEdit}
                  cancelEditing={cancelEditing}
                  toggleTodo={toggleTodo}
                  startEditing={startEditing}
                  deleteTodo={deleteTodo}
                  todayStr={todayStr}
                  lang={lang}
                  t={t}
                />
              );
            })}
          </ul>
        )}
      </div>
    );
  };

  const isAnyTaskVisible = Object.values(categories).some(cat => cat.length > 0);

  return (
    <section className="todo-list">
      {/* أدوات التحكم في القائمة (البحث والتبويبات) / List controls (Search and Tabs) */}
      <div className="list-controls">
        <div className="search-bar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            placeholder={t.searchPlaceholder} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-tabs">
          <button className={filterTab === "all" ? "active" : ""} onClick={() => setFilterTab("all")}>{t.allFilter}</button>
          <button className={filterTab === "active" ? "active" : ""} onClick={() => setFilterTab("active")}>{t.activeFilter}</button>
          <button className={filterTab === "completed" ? "active" : ""} onClick={() => setFilterTab("completed")}>{t.completedFilter}</button>
        </div>
      </div>

      {/* شريط الإجراءات العلوي - يحتوي على زر التحديد */}
      {!selectionMode && (
        <div className="top-actions-row single-action-row">
          <div className={`bulk-action-container ${todos.length < 2 ? "empty-faded" : "has-life"}`}>
            <button 
              className="bulk-delete-start-btn" 
              onClick={startSelectionMode}
              disabled={todos.length < 2}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              {t.bulkDelete}
            </button>
          </div>
        </div>
      )}

      {selectionMode && (
         <div className="selection-action-bar">
            <div className="selection-info">
               {lang === "ar" && (selectedTasks.length === 1 || selectedTasks.length === 2) ? (
                 <span className="selection-text">{getTaskLabel(selectedTasks.length)} {t.selected}</span>
               ) : (
                 <>
                   <span className="selection-count">{selectedTasks.length}</span>
                   <span className="selection-text">
                     {lang === "en" ? t.selected : ""} {getTaskLabel(selectedTasks.length)} {lang === "ar" ? t.selected : ""}
                   </span>
                 </>
               )}
             </div>
            <div className="selection-buttons">
              <button className="bulk-cancel-btn" onClick={cancelSelectionMode}>{t.cancelSelection}</button>
              <button 
                className={`bulk-confirm-btn ${selectedTasks.length > 0 ? "active" : ""}`} 
                onClick={bulkDelete}
                disabled={selectedTasks.length === 0}
              >
                {t.confirmDelete}
              </button>
            </div>
          </div>
      )}

      {!isAnyTaskVisible ? (
        <div className="empty-state">
          <div className="empty-icon">
            <img src="/no-task.png" alt="No tasks" className="empty-img" />
          </div>
          <p className="empty-msg">{t.noTasks}</p>
        </div>
      ) : (
        <>
          {/* في وضع التحديد، نعرض جميع المهام الموجودة في المصفوفة الأساسية لتسهيل الاختيار، بغض النظر عن الفلاتر أو الأقسام */}
          {selectionMode ? (
            <div className="task-category-list selection-all-list">
              <ul>
                {todos.map((todo, originalIndex) => {
                  return (
                    <TaskItem
                      key={originalIndex}
                      todo={todo}
                      index={originalIndex}
                      isEditing={editingIndex === originalIndex}
                      isSelected={selectedTasks.includes(originalIndex)}
                      selectionMode={selectionMode}
                      toggleSelection={toggleSelection}
                      editTask={editTask}
                      setEditTask={setEditTask}
                      editDate={editDate}
                      setEditDate={setEditDate}
                      editTime={editTime}
                      setEditTime={setEditTime}
                      editReminderOffset={editReminderOffset}
                      setEditReminderOffset={setEditReminderOffset}
                      saveEdit={saveEdit}
                      cancelEditing={cancelEditing}
                      toggleTodo={toggleTodo}
                      startEditing={startEditing}
                      deleteTodo={deleteTodo}
                      todayStr={todayStr}
                      lang={lang}
                      t={t}
                    />
                  );
                })}
              </ul>
            </div>
          ) : (
            <>
              {/* عرض قوائم الأقسام الخاصة إذا كانت مفتوحة */}
              {renderCategoryList(categories.overdue, "overdue")}
              
              {/* عرض الأقسام العادية */}
              {renderStandardCategory(categories.current, t.currentTasks, "current")}
              {renderStandardCategory(categories.upcoming, t.upcomingTasks, "upcoming")}
              {renderStandardCategory(categories.completed, t.completedTasks, "completed")}
            </>
          )}
        </>
      )}
    </section>
  );
};

export default TaskList;
