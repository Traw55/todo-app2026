import React from 'react';

const BottomNav = ({ activeTab, setActiveTab, t, lang }) => {
  const tabs = [
    { id: 'tasks', label: lang === 'ar' ? 'المهام' : 'Tasks', icon: '/task.png' },
    { id: 'add', label: lang === 'ar' ? 'إضافة مهمة' : 'Add Task', icon: '/add.png' },
    { id: 'stats', label: lang === 'ar' ? 'الإحصائيات' : 'Stats', icon: '/analysis.png' },
  ];

  return (
    <nav className="whatsapp-nav">
      <div className="nav-container">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <div className="nav-icon-wrapper">
              <img src={tab.icon} alt={tab.id} className="nav-icon-img" />
            </div>
            <span className="nav-label">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
