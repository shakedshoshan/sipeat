'use client';

import { useEffect, useState } from 'react';

export default function LanguageSwitcher() {
  const [currentLocale, setCurrentLocale] = useState('he');
  const isRTL = ['he', 'ar'].includes(currentLocale);
  
  useEffect(() => {
    // Get the saved language from localStorage on component mount
    const savedLanguage = localStorage.getItem('language') || 'he';
    setCurrentLocale(savedLanguage);
    
    // Apply RTL direction for Hebrew and Arabic languages
    document.documentElement.dir = ['he', 'ar'].includes(savedLanguage) ? 'rtl' : 'ltr';
  }, []);

  const handleChange = (newLocale: string) => {
    // Save the new language to localStorage
    localStorage.setItem('language', newLocale);
    setCurrentLocale(newLocale);
    
    // Apply RTL direction for Hebrew and Arabic languages
    document.documentElement.dir = ['he', 'ar'].includes(newLocale) ? 'rtl' : 'ltr';
    
    // Reload the page to apply the language change
    window.location.reload();
  };

  return (
    <div className="relative inline-block text-left">
      <select
        value={currentLocale}
        onChange={(e) => handleChange(e.target.value)}
        className={`appearance-none bg-transparent border space-x-2 border-[#38bdf8] rounded-full px-4 py-1 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#38bdf8] cursor-pointer ${isRTL ? 'pl-8 pr-4' : 'pl-4 pr-8'}`}
      >
        <option value="en">English</option>
        <option value="he">עברית</option>
        <option value="ar">العربية</option>
        <option value="ru">Русский</option>
      </select>
      <div className={`pointer-events-none absolute inset-y-0 flex items-center px-2 ${isRTL ? 'left-0' : 'right-0'}`}>
        <svg className="h-4 w-4 text-[#2563eb]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
} 