import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, ShieldCheck, Users, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const About: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <div className="py-10 md:py-16 bg-[#FAF7F2] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-[#962D3E] uppercase tracking-widest">
            {language === 'bn' ? 'আমাদের গল্প ও দর্শন' : 'Our Story'}
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold text-[#1E1E1E] mt-2 mb-4">
            Xora Lifestyle
          </h1>
          <p className="text-sm sm:text-base text-[#61594F] max-w-xl mx-auto leading-relaxed">
            {language === 'bn'
              ? 'চীনের প্রিমিয়াম কোয়ালিটির ট্রেন্ডি ব্যাগ এখন বাংলাদেশে, আধুনিক ডিজাইন ও আকর্ষণীয় লুকে।'
              : 'Premium-quality trendy bags from China, now in Bangladesh, with modern designs and an attractive look.'}
          </p>
        </div>

        {/* Hero Visual Card */}
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-[#E7E0D3] shadow-md mb-12">
          <img
            src="/src/assets/images/product_leather_bag_1792674216295.jpg"
            alt="Xora Lifestyle Bags"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Narrative Section */}
        <div className="bg-white p-6 sm:p-10 rounded-2xl border border-[#E7E0D3] shadow-sm mb-12 flex flex-col gap-6 text-xs sm:text-sm text-[#474036] leading-relaxed">
          <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#1E1E1E]">
            {language === 'bn' ? 'যেভাবে আমাদের পথচলা শুরু' : 'How It All Began'}
          </h2>
          <p>
            {language === 'bn'
              ? 'Xora Lifestyle-এর যাত্রা শুরু একটি ফেসবুক পেজ থেকে। আমাদের লক্ষ্য চীনের প্রিমিয়াম কোয়ালিটির ট্রেন্ডি ব্যাগ আধুনিক ডিজাইন ও আকর্ষণীয় লুকে বাংলাদেশের ক্রেতাদের কাছে পৌঁছে দেওয়া।'
              : 'Xora Lifestyle began as a Facebook page. Our goal is to bring premium-quality trendy bags from China to customers across Bangladesh, with modern designs and an attractive look.'}
          </p>
          <p>
            {language === 'bn'
              ? 'ক্যাশ অন ডেলিভারিতে পণ্য হাতে পেয়ে দেখে নিয়ে মূল্য পরিশোধ করা যায়। অর্ডারের পর আমাদের প্রতিনিধি নিশ্চিত করতে ফোন করেন।'
              : 'With Cash on Delivery you can inspect your order on arrival before paying. Our team will call to confirm every order.'}
          </p>
        </div>

        {/* 4 Core Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl border border-[#E7E0D3] shadow-xs flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-[#FAF0F2] text-[#962D3E] shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#1E1E1E] mb-1">
                {language === 'bn' ? 'প্রিমিয়াম কোয়ালিটি' : 'Premium Quality'}
              </h3>
              <p className="text-xs text-[#70675C]">
                {language === 'bn'
                  ? 'আধুনিক ডিজাইন ও আকর্ষণীয় লুকের ট্রেন্ডি ব্যাগ।'
                  : 'Trendy bags with modern designs and an attractive look.'}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#E7E0D3] shadow-xs flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-[#FAF0F2] text-[#962D3E] shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#1E1E1E] mb-1">
                {language === 'bn' ? 'সারা বাংলাদেশে ডেলিভারি' : 'Nationwide Delivery'}
              </h3>
              <p className="text-xs text-[#70675C]">
                {language === 'bn'
                  ? 'ঢাকা ও ঢাকার বাইরে ৬৪ জেলায় ডেলিভারি।'
                  : 'Delivery available across all 64 districts of Bangladesh.'}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#E7E0D3] shadow-xs flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-[#FAF0F2] text-[#962D3E] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#1E1E1E] mb-1">
                {language === 'bn' ? 'ক্যাশ অন ডেলিভারি সুরক্ষা' : 'Zero-Risk Delivery'}
              </h3>
              <p className="text-xs text-[#70675C]">
                {language === 'bn'
                  ? 'পণ্য হাতে পেয়ে চেক করার পর মূল্য পরিশোধের পূর্ণ স্বাধীনতা।'
                  : 'Inspect upon arrival with full Cash on Delivery availability across all 64 districts.'}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#E7E0D3] shadow-xs flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-[#FAF0F2] text-[#962D3E] shrink-0">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#1E1E1E] mb-1">
                {language === 'bn' ? 'সহজ এক্সচেঞ্জ' : 'Easy Exchange'}
              </h3>
              <p className="text-xs text-[#70675C]">
                {language === 'bn'
                  ? 'পণ্য হাতে পাওয়ার ৭ দিনের মধ্যে এক্সচেঞ্জের অনুরোধ করা যাবে (শর্ত প্রযোজ্য)।'
                  : 'Exchange requests accepted within 7 days of delivery (terms apply).'}
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#962D3E] text-white text-xs font-bold rounded-xl shadow-md hover:bg-[#7D2232] transition-colors"
          >
            <span>{t('heroCta')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
};
