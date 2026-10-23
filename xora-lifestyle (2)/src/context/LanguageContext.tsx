import React, { createContext, useContext, useEffect, useState } from 'react';
import { translations } from '../lib/translations';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: keyof typeof translations['bn']) => string;
  formatPrice: (amount: number) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('xora_lang');
    return (saved === 'en' || saved === 'bn') ? saved : 'bn'; // Default Bangla
  });

  useEffect(() => {
    localStorage.setItem('xora_lang', language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState(prev => (prev === 'bn' ? 'en' : 'bn'));
  };

  const t = (key: keyof typeof translations['bn']): string => {
    const dict = translations[language] || translations['bn'];
    return (dict as Record<string, string>)[key] || (translations['bn'] as Record<string, string>)[key] || key;
  };

  // Convert numbers to Bengali numerals if language is Bangla
  const formatPrice = (amount: number): string => {
    const formattedNum = amount.toLocaleString('en-US');
    if (language === 'bn') {
      const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
      const bnNumber = formattedNum.replace(/[0-9]/g, (w) => bnDigits[+w]);
      return `৳${bnNumber}`;
    }
    return `৳${formattedNum}`;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, formatPrice }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
