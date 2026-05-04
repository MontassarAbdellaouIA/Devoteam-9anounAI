/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import en from '@/locales/en.json';
import fr from '@/locales/fr.json';
import ar from '@/locales/ar.json';

const translations = { en, fr, ar };

type Language = 'en' | 'fr' | 'ar';
// --- RTL SUPPORT: Define text direction type ---
type Direction = 'ltr' | 'rtl';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translations: any;
  // --- RTL SUPPORT: Expose direction state ---
  dir: Direction;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('fr');
  // --- RTL SUPPORT: Add state for text direction ---
  const [dir, setDir] = useState<Direction>('ltr');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['en', 'fr', 'ar'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
      // --- RTL SUPPORT: Set direction based on saved language ---
      setDir(savedLanguage === 'ar' ? 'rtl' : 'ltr');
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    // --- RTL SUPPORT: Update direction when language changes ---
    setDir(lang === 'ar' ? 'rtl' : 'ltr');
  };

  const value = {
    language,
    setLanguage: handleSetLanguage,
    translations: translations[language],
    // --- RTL SUPPORT: Provide direction in context ---
    dir,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
