import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const NotFound: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <div className="py-24 px-4 text-center min-h-[60vh] flex flex-col items-center justify-center bg-[#FAF7F2]">
      <span className="font-serif-luxury text-7xl sm:text-8xl font-bold text-[#D8CEBE]">
        404
      </span>
      <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1E1E1E] mt-3 mb-2">
        {language === 'bn' ? 'পৃষ্ঠাটি খুঁজে পাওয়া যায়নি' : 'Page Not Found'}
      </h1>
      <p className="text-xs sm:text-sm text-[#736A5E] max-w-sm mb-8">
        {language === 'bn'
          ? 'দুঃখিত, আপনি যে লিংকটি খুঁজছেন তা স্থানান্তরিত হয়েছে অথবা আর বিদ্যমান নেই।'
          : 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.'}
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-[#962D3E] hover:bg-[#7D2232] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md transition-all active:scale-95"
      >
        <Home className="w-4 h-4" />
        <span>{t('backToHome')}</span>
      </Link>
    </div>
  );
};
