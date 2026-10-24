import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, Sparkles, Award } from 'lucide-react';

export const About: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div className="py-12 md:py-20 bg-[#0c100e] text-slate-100 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-amber-400 tracking-widest uppercase block mb-2">
            {language === 'bn' ? 'আমাদের গল্প ও দর্শন' : 'Our Story & Philosophy'}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Xora Lifestyle
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {language === 'bn'
              ? 'সরাসরি চীন থেকে আমদানিকৃত বিশ্বমানের এক্সক্লুসিভ ডিজাইন ও প্রিমিয়াম কোয়ালিটি ব্যাগের শীর্ষ ব্র্যান্ড।'
              : 'The leading brand of world-class exclusive design and premium quality bags imported directly from China.'}
          </p>
        </div>

        {/* Image Box */}
        <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-12 border border-amber-500/20 shadow-xl bg-[#151c18]">
          <img
            src="https://res.cloudinary.com/utod2jrs/image/upload/v1792817996/360_F_218404814_qrf76E5CfJ1WdTGE7qsiahYPNuqMKML1.jpg"
            alt="Xora Lifestyle Bags"
            className="w-full h-full object-cover opacity-80"
          />
        </div>

        {/* Content Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#151c18] p-6 rounded-2xl border border-amber-500/20">
            <Sparkles className="w-8 h-8 text-amber-400 mb-3" />
            <h3 className="font-bold text-white text-sm mb-2">
              {language === 'bn' ? 'এক্সক্লুসিভ ডিজাইন' : 'Exclusive Design'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'bn' ? 'প্রতিটি ব্যাগ আধুনিক ট্রেন্ড ও আন্তর্জাতিক মানের কথা মাথায় রেখে বাছাই করা।' : 'Every bag is curated keeping modern trends and international standards in mind.'}
            </p>
          </div>

          <div className="bg-[#151c18] p-6 rounded-2xl border border-amber-500/20">
            <ShieldCheck className="w-8 h-8 text-amber-400 mb-3" />
            <h3 className="font-bold text-white text-sm mb-2">
              {language === 'bn' ? 'প্রিমিয়াম কোয়ালিটি' : 'Premium Quality'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'bn' ? 'সরাসরি মান পরীক্ষার মাধ্যমে সংগৃহীত টেকসই ও আকর্ষণীয় ফিনিশিং।' : 'Durable and attractive finishing sourced through rigorous quality checks.'}
            </p>
          </div>

          <div className="bg-[#151c18] p-6 rounded-2xl border border-amber-500/20">
            <Award className="w-8 h-8 text-amber-400 mb-3" />
            <h3 className="font-bold text-white text-sm mb-2">
              {language === 'bn' ? 'গ্রাহক সন্তুষ্টি' : 'Customer Satisfaction'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'bn' ? '৬৪ জেলায় ক্যাশ অন ডেলিভারি এবং ৭ দিনের সহজ রিটার্ন সুবিধা।' : 'Cash on delivery across 64 districts and 7 days easy return facility.'}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
