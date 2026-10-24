import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, X, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const WelcomePopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    const hasSeenWelcome = sessionStorage.getItem('xora_welcomed');
    if (!hasSeenWelcome) {
      setIsOpen(true);
      requestAnimationFrame(() => setIsAnimating(true));
    }
  }, []);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsOpen(false);
      sessionStorage.setItem('xora_welcomed', 'true');
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}>
      <div 
        className={`relative w-full max-w-md bg-[#151c18] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-center overflow-hidden transform transition-all duration-300 ease-out ${
          isAnimating ? 'scale-100 translate-y-0' : 'scale-90 translate-y-4'
        }`}
      >
        
        {/* Glowing Background Effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition border border-amber-500/20"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-300 tracking-wider uppercase px-3.5 py-1.5 rounded-full bg-amber-950/60 border border-amber-500/30 mb-5 mx-auto">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{language === 'bn' ? 'বিশেষ অফার ও কালেকশন' : 'Special Collection'}</span>
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
          {language === 'bn' ? 'Xora Lifestyle-এ স্বাগতম!' : 'Welcome to Xora Lifestyle!'}
        </h2>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
          {language === 'bn'
            ? 'চীনের প্রিমিয়াম কোয়ালিটির ট্রেন্ডি ব্যাগ এবং এক্সক্লুসিভ ডিজাইন এখন আপনার হাতের নাগালে। ক্যাশ অন ডেলিভারিতে অর্ডার করুন!'
            : 'Explore premium quality trendy bags imported directly for your everyday elegance. Cash on delivery available!'}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/shop"
            onClick={handleClose}
            className="flex-1 py-3 px-6 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
          >
            <span>{language === 'bn' ? 'শপিং শুরু করুন' : 'Start Shopping'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            onClick={handleClose}
            className="py-3 px-5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl border border-amber-500/20 transition"
          >
            {language === 'bn' ? 'পরে দেখব' : 'Later'}
          </button>
        </div>

      </div>
    </div>
  );
};
