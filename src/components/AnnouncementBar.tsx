import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const AnnouncementBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const { t } = useLanguage();

  if (!isVisible) return null;

  return (
    <aside aria-label="Announcement" className="bg-[#962D3E] text-[#FFF9F2] text-xs font-medium py-2 px-4 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex-1 flex items-center justify-center text-center gap-2 truncate">
          <Sparkles className="w-3.5 h-3.5 shrink-0 text-[#E7C677]" />
          <span className="truncate tracking-wide">{t('announcement')}</span>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-[#F1D8B4] hover:text-white p-0.5 rounded transition-colors shrink-0"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
