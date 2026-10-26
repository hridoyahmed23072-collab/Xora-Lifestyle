import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const OfflineIndicator: React.FC = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showReconnected, setShowReconnected] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOffline) {
    return (
      <aside aria-label="Offline notice" className="fixed top-0 left-0 right-0 z-50 bg-[#801F30] text-white text-xs py-2 px-4 shadow-lg text-center flex items-center justify-center gap-2 border-b border-[#5C101F] animate-in slide-in-from-top duration-300">
        <WifiOff className="w-4 h-4 shrink-0 animate-pulse text-[#FCEFD2]" />
        <span>
          {language === 'bn'
            ? 'আপনি অফলাইনে আছেন। ক্যাশ করা প্রোডাক্ট ও পেজগুলো ব্রাউজ করতে পারবেন।'
            : "You're offline. Previously loaded bags and pages remain accessible."}
        </span>
      </aside>
    );
  }

  if (showReconnected) {
    return (
      <aside aria-label="Back online notice" className="fixed top-0 left-0 right-0 z-50 bg-[#2E7D32] text-white text-xs py-1.5 px-4 shadow-md text-center flex items-center justify-center gap-2 animate-in slide-in-from-top duration-300">
        <Wifi className="w-4 h-4 shrink-0 text-[#E8F5E9]" />
        <span>
          {language === 'bn'
            ? 'ইন্টারনেট সংযোগ পুনরুদ্ধার হয়েছে!'
            : 'Back online! Live syncing restored.'}
        </span>
      </aside>
    );
  }

  return null;
};
