import { useState, useEffect } from "react";
import "./App.css";

// استيراد المكونات / Importing Components
import { translations } from "./components/Translations";
import Header from "./components/Header";
import ProgressBar from "./components/ProgressBar";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";

/**
 * دوال حماية التخزين المحلي / Safe LocalStorage Helpers
 */
const safeGetItem = (key, defaultValue) => {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const safeSetItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

/**
 * المكون الرئيسي للتطبيق - يدير الحالة العامة والمنطق البرمجي
 */
function App() {
  // --- دوال مساعدة للوقت والتاريخ / Date and Time Helpers ---
  const getDefaultTime = () => {
    const d = new Date();
    d.setHours(d.getHours() + 1);
    return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  };

  const getDefaultDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  // --- حالات التطبيق (State Management) ---
  const [userName, setUserName] = useState(() => safeGetItem("userName", ""));
  const [isEditingName, setIsEditingName] = useState(false);
  const [task, setTask] = useState("");
  const [scheduledTime, setScheduledTime] = useState(getDefaultTime());
  const [scheduledDate, setScheduledDate] = useState(getDefaultDate());
  const [reminderOffset, setReminderOffset] = useState(0);
  const [todos, setTodos] = useState(() => safeGetItem("todos", []));
  const [lang, setLang] = useState(() => safeGetItem("lang", "ar"));
  const [theme, setTheme] = useState(() => safeGetItem("theme", "dark"));
  const [currentTime, setCurrentTime] = useState(new Date());
  const [editingIndex, setEditingIndex] = useState(null);
  const [editTask, setEditTask] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editReminderOffset, setEditReminderOffset] = useState(0);
  const [collapsedSections, setCollapsedSections] = useState({
    overdue: false,
    current: false,
    upcoming: false,
    completed: false
  });
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState("all");

  const t = translations[lang];

  // --- دوال منطقية (Logic Functions) ---
  const getTaskLabel = (count) => {
    if (lang === "ar") {
      if (count === 1) return t.task1;
      if (count === 2) return t.task2;
      if (count >= 3 && count <= 10) return t.tasks3to10;
      return t.tasks11plus;
    }
    return count === 1 ? t.taskSingular : t.tasksPlural;
  };

  // --- التأثيرات الجانبية (Effects) ---
  useEffect(() => {
    safeSetItem("userName", userName);
    safeSetItem("todos", todos);
    safeSetItem("lang", lang);
    safeSetItem("theme", theme);
  }, [userName, todos, lang, theme]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // حماية Notification
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const checkNotifications = setInterval(() => {
      const now = new Date();

      setTodos(prevTodos => {
        let hasChanges = false;
        const updatedTodos = prevTodos.map(todo => {
          if (todo.completed) return todo;

          const taskDateTime = new Date(`${todo.date}T${todo.time}`);
          const diffMins = Math.floor((taskDateTime - now) / 60000);

          if ("Notification" in window) {
            // 1. تنبيه مسبق / Pre-reminder
            if (todo.reminderOffset > 0 && diffMins === todo.reminderOffset && !todo.notifiedBefore) {
              new Notification(t.notificationTitle, {
                body: `${t.reminderPrefix} ${todo.text} (${todo.reminderOffset} ${lang === "ar" ? "دقائق" : "mins"})`,
              });
              hasChanges = true;
              return { ...todo, notifiedBefore: true };
            }

            // 2. تنبيه الموعد الفعلي / Exact
            if (diffMins === 0 && !todo.notified) {
              new Notification(t.notificationTitle, {
                body: `${t.duePrefix} ${todo.text}`,
              });
              hasChanges = true;
              return { ...todo, notified: true };
            }
          }

          return todo;
        });

        return hasChanges ? updatedTodos : prevTodos;
      });
    }, 30000);

    return () => clearInterval(checkNotifications);
  }, [lang, t]);

  // --- معالجات الأحداث (Event Handlers) ---
  const addTodo = () => {
    if (task.trim() === "") {
      alert(t.emptyTaskError);
      return;
    }
    setTodos([
      ...todos,
      {
        text: task,
        time: scheduledTime,
        date: scheduledDate,
        reminderOffset: reminderOffset,
        completed: false,
        notified: false,
        notifiedBefore: false,
      },
    ]);
    setTask("");
    setScheduledTime(getDefaultTime());
    setScheduledDate(getDefaultDate());
    setReminderOffset(0);
  };

  const deleteTodo = (index) => {
    if (selectionMode) return;
    const taskToDelete = todos[index];
    if (!taskToDelete) return;

    const taskName = taskToDelete.text;
    const isConfirmed = window.confirm(`${t.deleteConfirm}"${taskName}"`);
    
    if (isConfirmed) {
      setTodos(prevTodos => prevTodos.filter((_, i) => i !== index));
    }
  };

  const toggleTodo = (index) => {
    if (selectionMode) return;
    const newTodos = [...todos];
    newTodos[index].completed = !newTodos[index].completed;
    setTodos(newTodos);
  };

  const toggleSelection = (index) => {
    setSelectedTasks(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const startSelectionMode = () => {
    setSelectionMode(true);
    setSelectedTasks([]);
  };

  const cancelSelectionMode = () => {
    setSelectionMode(false);
    setSelectedTasks([]);
  };

  const bulkDelete = () => {
    if (selectedTasks.length === 0) return;
    
    const count = selectedTasks.length;
    let confirmMessage = "";
    
    if (lang === "ar") {
      const taskLabel = getTaskLabel(count);
      confirmMessage = count === 2 
        ? `هل أنت متأكد من حذف ${taskLabel}؟` 
        : `هل أنت متأكد من حذف ${count} ${taskLabel}؟`;
    } else {
      confirmMessage = `${t.bulkDeleteConfirm} (${count} ${getTaskLabel(count)})`;
    }

    if (window.confirm(confirmMessage)) {
      setTodos(prevTodos => prevTodos.filter((_, index) => !selectedTasks.includes(index)));
      cancelSelectionMode();
    }
  };

  const startEditing = (index) => {
    if (selectionMode) return;
    setEditingIndex(index);
    setEditTask(todos[index].text);
    setEditTime(todos[index].time);
    setEditDate(todos[index].date);
    setEditReminderOffset(todos[index].reminderOffset || 0);
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setEditTask("");
    setEditTime("");
    setEditDate("");
    setEditReminderOffset(0);
  };

  const saveEdit = (index) => {
    if (editTask.trim() === "") return;
    const newTodos = [...todos];
    newTodos[index] = {
      ...newTodos[index],
      text: editTask,
      time: editTime,
      date: editDate,
      reminderOffset: editReminderOffset,
      notified: false,
      notifiedBefore: false,
    };
    setTodos(newTodos);
    cancelEditing();
  };

  const toggleLang = () => setLang(lang === "en" ? "ar" : "en");
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    const ampm = hours >= 12 ? t.pm : t.am;
    hours = hours % 12;
    hours = hours ? hours : 12;
    const hoursStr = hours.toString().padStart(2, "0");
    
    return `${hoursStr}:${minutes}:${seconds} ${ampm}`;
  };

  const formatDate = (date) => {
    try {
      return date.toLocaleDateString(lang === "ar" ? "ar-u-ca-gregory-nu-latn" : "en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return date.toDateString();
    }
  };

  // --- منطق التصنيف والفلترة / Sorting and Filtering Logic ---
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  const currentTimeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
  
  const totalTasks = todos.length;
  const completedTasks = todos.filter(t => t.completed).length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const filteredTodos = todos.filter(todo => 
    todo.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = {
    overdue: filteredTodos.filter(t => !t.completed && (t.date < todayStr || (t.date === todayStr && t.time < currentTimeStr)) && (filterTab === "all" || filterTab === "active")),
    pastOverdue: filteredTodos.filter(t => t.completed && (t.date < todayStr || (t.date === todayStr && t.time < currentTimeStr)) && (filterTab === "all" || filterTab === "completed")),
    current: filteredTodos.filter(t => !t.completed && t.date === todayStr && t.time >= currentTimeStr && (filterTab === "all" || filterTab === "active")),
    upcoming: filteredTodos.filter(t => !t.completed && t.date > todayStr && (filterTab === "all" || filterTab === "active")),
    completed: filteredTodos.filter(t => t.completed && (filterTab === "all" || filterTab === "completed"))
  };

  const toggleSection = (key) => {
    setCollapsedSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // --- عرض المكون (Render) ---
  return (
    <div className={`app-wrapper ${lang === "ar" ? "rtl" : "ltr"} ${theme}-theme`}>
      <div className="web-container">
        <Header 
          isEditingName={isEditingName}
          userName={userName}
          setUserName={setUserName}
          setIsEditingName={setIsEditingName}
          formatDate={formatDate}
          formatTime={formatTime}
          currentTime={currentTime}
          theme={theme}
          toggleTheme={toggleTheme}
          toggleLang={toggleLang}
          t={t}
        />
        <main>
          <h1 className="main-title">{t.title}</h1>
          <ProgressBar 
            totalTasks={totalTasks}
            completedTasks={completedTasks}
            progressPercentage={progressPercentage}
            t={t}
          />
          <TaskInput 
            task={task}
            setTask={setTask}
            scheduledDate={scheduledDate}
            setScheduledDate={setScheduledDate}
            scheduledTime={scheduledTime}
            setScheduledTime={setScheduledTime}
            reminderOffset={reminderOffset}
            setReminderOffset={setReminderOffset}
            addTodo={addTodo}
            t={t}
          />
          <TaskList 
            todos={todos}
            categories={categories}
            collapsedSections={collapsedSections}
            toggleSection={toggleSection}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterTab={filterTab}
            setFilterTab={setFilterTab}
            selectionMode={selectionMode}
            selectedTasks={selectedTasks}
            toggleSelection={toggleSelection}
            startSelectionMode={startSelectionMode}
            cancelSelectionMode={cancelSelectionMode}
            bulkDelete={bulkDelete}
            editingIndex={editingIndex}
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
            getTaskLabel={getTaskLabel}
            lang={lang}
            t={t}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
