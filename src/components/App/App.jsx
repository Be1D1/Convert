import React, { useState, useEffect } from 'react';
import Header from '../Header/Header';
import Tools from '../Tools/Tools';
import './App.css'

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConverter, setSelectedConverter] = useState('');
  const [darkMode, setDarkMode] = useState(() => {
    // Проверяем localStorage при инициализации
    const savedTheme = localStorage.getItem('darkMode');
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  useEffect(() => {
    // Применяем класс темы к body при загрузке
    if (darkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
    if (newDarkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  };

  return (
    <div className={`app ${darkMode ? 'dark-theme' : ''}`}>
      <Header 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm}
        onConverterSelect={setSelectedConverter}
        darkMode={darkMode}
        toggleTheme={toggleTheme}
      />
      <main>
        <Tools 
          searchTerm={searchTerm} 
          selectedConverter={selectedConverter} 
          darkMode={darkMode}
        />
      </main>
    </div>
  );
}

export default App;