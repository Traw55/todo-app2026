/**
 * مكون رأس الصفحة - يحتوي على الترحيب، الوقت، التاريخ، وتغيير السمة واللغة
 * Header Component - Contains welcome message, time, date, and theme/language toggles
 */
const Header = ({ 
  isEditingName, 
  userName, 
  setUserName, 
  setIsEditingName, 
  formatDate, 
  formatTime, 
  currentTime, 
  theme, 
  toggleTheme, 
  toggleLang, 
  t 
}) => {
  return (
    <header>
      {/* قسم الترحيب وتحرير اسم المستخدم / Welcome and name editing section */}
      <div className="welcome-section">
        <div className="name-edit-group">
          {isEditingName ? (
            <input
              autoFocus
              className="name-input"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onBlur={() => setIsEditingName(false)}
              onKeyDown={(e) => e.key === "Enter" && setIsEditingName(false)}
              placeholder={t.namePlaceholder}
            />
          ) : (
            <div className="name-display">
              <h2>{t.welcome} {userName || t.guestName} 👋</h2>
              <button className="edit-name-btn" onClick={() => setIsEditingName(true)} title={t.editButton}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
            </div>
          )}
        </div>
        <p className="current-date">{formatDate(currentTime)}</p>
        <p className="current-time">{formatTime(currentTime)}</p>
      </div>

      {/* أزرار التحكم في السمة واللغة / Theme and Language controls */}
      <div className="header-actions">
        {/* زر تغيير السمة (فاتح/داكن) / Theme toggle button */}
        <button className="theme-toggle" onClick={toggleTheme} title={theme === "dark" ? t.lightMode : t.darkMode}>
          {theme === "dark" ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          )}
        </button>
        {/* زر تغيير اللغة / Language toggle button */}
        <button className="lang-toggle" onClick={toggleLang} title={t.switchLang}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
