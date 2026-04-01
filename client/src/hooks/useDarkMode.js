import { useState, useEffect } from 'react';

const useDarkMode = () => {
  const [dark, setDark] = useState(() => {
    // Check local storage first
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    // Fallback to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Update the class on the HTML element
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Update local storage
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return [dark, setDark];
};

export default useDarkMode;