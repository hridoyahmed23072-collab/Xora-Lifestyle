import React from 'react';
import { Download, Share2, PlusSquare, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useLanguage } from '../context/LanguageContext';

interface PWAInstallButtonProps {
  variant?: 'header' | 'mobile-menu' | 'floating' | 'banner';
  onInstalled?: () => void;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'header' }) => {
  const { canInstall, isInstalled, installApp, isIOS, showIOSGuide, setShowIOSGuide } = usePWAInstall();
  const { language } = useLanguage();

  if (isInstalled) return null;

  // Render variant styles
  if (variant === 'header') {
    return (
      <>
        <button
          onClick={installApp}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-[#962D3E]/10 hover:bg-[#962D3E] text-[#962D3E] hover:text-white border border-[#962D3E]/30 transition-all shadow-xs"
          title={language === 'bn' ? 'অ্যাপ ইনস্টল করুন' : 'Install App'}
        >
          <Download className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'অ্যাপ ইনস্টল' : 'Install App'}</span>
        </button>

        {showIOSGuide && (
          <IOSInstallModal onClose={() => setShowIOSGuide(false)} language={language} />
        )}
      </>
    );
  }

  if (variant === 'mobile-menu') {
    return (
      <>
        <button
          onClick={installApp}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-[#962D3E] to-[#7D2232] text-white shadow-sm text-sm font-semibold active:scale-[0.99] transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/15 rounded-lg">
              <Download className="w-4 h-4 text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold leading-tight">
                {language === 'bn' ? 'Xora অ্যাপ ইনস্টল করুন' : 'Install Xora App'}
              </p>
              <p className="text-[11px] text-white/80">
                {language === 'bn' ? 'সহজ কেনাকাটা ও অফলাইন সাপোর্ট' : 'Fast shopping & offline access'}
              </p>
            </div>
          </div>
          <span className="text-xs bg-white text-[#962D3E] font-bold px-2 py-0.5 rounded-full">
            {language === 'bn' ? 'ইনস্টল' : 'Install'}
          </span>
        </button>

        {showIOSGuide && (
          <IOSInstallModal onClose={() => setShowIOSGuide(false)} language={language} />
        )}
      </>
    );
  }

  return (
    <>
      <button
        onClick={installApp}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#962D3E] text-white font-medium text-xs hover:bg-[#7D2232] shadow-sm transition-all"
      >
        <Download className="w-4 h-4" />
        <span>{language === 'bn' ? 'অ্যাপ ইনস্টল করুন' : 'Install App'}</span>
      </button>

      {showIOSGuide && (
        <IOSInstallModal onClose={() => setShowIOSGuide(false)} language={language} />
      )}
    </>
  );
};

// Modal for iOS devices where BeforeInstallPrompt is not supported natively
interface IOSModalProps {
  onClose: () => void;
  language: 'bn' | 'en';
}

const IOSInstallModal: React.FC<IOSModalProps> = ({ onClose, language }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-[#FAF7F2] rounded-2xl p-6 shadow-2xl border border-[#E8E1D5] animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#962D3E] flex items-center justify-center text-white font-bold text-lg shadow-sm">
              X
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#1E1E1E]">
                {language === 'bn' ? 'হোম স্ক্রিনে যোগ করুন' : 'Add to Home Screen'}
              </h3>
              <p className="text-xs text-[#7A7268]">Xora Lifestyle iOS App</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#7A7268] hover:text-[#1E1E1E] rounded-full hover:bg-[#EFE9DD]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs text-[#4A443D] my-4">
          <div className="flex items-center gap-3 p-2.5 rounded-lg bg-white border border-[#E8E1D5]">
            <Share2 className="w-5 h-5 text-[#962D3E] shrink-0" />
            <p>
              {language === 'bn'
                ? '১. Safari ব্রাউজারের নিচে শেয়ার (Share) বাটনে ট্যাপ করুন'
                : '1. Tap the Share button at the bottom of Safari'}
            </p>
          </div>
          <div className="flex items-center gap-3 p-2.5 rounded-lg bg-white border border-[#E8E1D5]">
            <PlusSquare className="w-5 h-5 text-[#962D3E] shrink-0" />
            <p>
              {language === 'bn'
                ? '২. নিচের তালিকায় "Add to Home Screen" অপশনটি সিলেক্ট করুন'
                : '2. Scroll down and tap "Add to Home Screen"'}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-[#962D3E] text-white font-semibold rounded-xl text-xs hover:bg-[#7D2232] transition-colors"
        >
          {language === 'bn' ? 'বুঝেছি' : 'Got it'}
        </button>
      </div>
    </div>
  );
};
