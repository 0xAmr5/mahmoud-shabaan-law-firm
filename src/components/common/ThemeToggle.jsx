import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="p-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-amber-600 dark:text-amber-400 border border-slate-300 dark:border-slate-700 transition-all cursor-pointer shadow-xs flex items-center justify-center"
      title={theme === 'dark' ? 'التحويل للوضع الفاتح (Light Mode)' : 'التحويل للوضع الليلي (Dark Mode)'}
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-180 duration-300" />
      ) : (
        <Moon className="w-4 h-4 text-slate-700 animate-in spin-in-180 duration-300" />
      )}
    </button>
  );
};

export default ThemeToggle;