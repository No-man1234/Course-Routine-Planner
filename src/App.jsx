import { useState, useEffect } from 'react'
import './App.css'
import LandingPage from './LandingPage';
import ImprovedCourseRoutinePlanner from './ImprovedCourseRoutinePlanner';

// Initialize theme immediately to avoid flash
const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    return savedTheme === 'dark';
  }
  // Check system preference
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

// Apply theme immediately to document
const applyTheme = (isDark) => {
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const initialTheme = getInitialTheme();
    applyTheme(initialTheme); // Apply theme immediately
    return initialTheme;
  });
  const [showLandingPage, setShowLandingPage] = useState(true);

  // Update theme when darkMode changes
  useEffect(() => {
    applyTheme(darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Ensure theme is applied on mount (backup check)
  useEffect(() => {
    applyTheme(darkMode);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleGetStarted = () => {
    setShowLandingPage(false);
  };

  if (showLandingPage) {
    return (
      <LandingPage 
        onGetStarted={handleGetStarted} 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <ImprovedCourseRoutinePlanner darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
    </div>
  )
}

export default App
