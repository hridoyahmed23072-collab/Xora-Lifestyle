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
            {language === 'bn' ? 'আমাদের গল্প ও দর্শন' : 'Our Story & Heritage'}
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold text-[#1E1E1E] mt-2 mb-4">
            Xora Lifestyle
          </h1>
          <p className="text-sm sm:text-base text-[#61594F] max-w-xl mx-auto leading-relaxed">
            {language === 'bn'
              ? 'মাস্টার কারিগরদের নিখুঁত হাতে গড়া প্রিমিয়াম লেদার ও দৈনন্দিন ব্যাগের শীর্ষ বাংলাদেশি ব্র্যান্ড।'
              : 'Connecting generations of master Bangladeshi leather artisans with refined modern bag essentials.'}
          </p>
        </div>

        {/* Hero Visual Card */}
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-[#E7E0D3] shadow-md mb-12">
          <img
            src="/src/assets/images/product_leather_bag_1792674216295.jpg"
            alt="Xora Lifestyle Handcrafted Leather Bags"
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
              ? 'Xora Lifestyle-এর জন্ম একটি বিশ্বস্ত ফেসবুক পেজ থেকে। আমাদের লক্ষ্য ছিল অত্যন্ত স্পষ্ট—বিদেশি সস্তা রেক্সিন ও ক্ষণস্থায়ী সিন্থেটিক ব্যাগের পরিবর্তে বাংলাদেশের সেরা ট্যানারির ফুল-গ্রেইন চামড়া এবং মজবুত ওয়াটার-রেজিস্ট্যান্ট ক্যানভাস দিয়ে এমন সব ব্যাগ তৈরি করা, যা দেখতে যেমন চমৎকার তেমনি বছরের পর বছর টিকে থাকবে।'
              : 'Xora Lifestyle began as a dedicated community page on Facebook. Our mission was uncompromising: to replace cheap synthetic pleather bags with genuine, ethically sourced full-grain leather and heavy-duty canvas bags that age with dignity and last for years.'}
          </p>
          <p>
            {language === 'bn'
              ? 'আমাদের প্রতিটি হ্যান্ডব্যাগ, টোট, ব্যাকপ্যাক ও ট্রাভেল ব্যাগে রয়েছে দক্ষ কারিগরের হাতের যত্ন, মজবুত স্টিচিং এবং টেকসই ব্রাস ফিটিংস। আমরা কোনো ধরনের গণ-উৎপাদন (mass production) করি না; বরং ছোট ছোট ব্যাচে সততা ও নিষ্ঠার সাথে প্রতিটি ব্যাগের প্রিমিয়াম কোয়ালিটি নিশ্চিত করি।'
              : 'Each handbag, commuter backpack, structured tote, and travel duffel is engineered with reinforced stress points, Japanese YKK zippers, and solid brass hardware. We produce in intentional small batches to ensure unmatched quality control.'}
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
                {language === 'bn' ? '১০০% অকৃত্রিম হস্তশিল্প' : 'Authentic Handcraft'}
              </h3>
              <p className="text-xs text-[#70675C]">
                {language === 'bn'
                  ? 'কোনো প্রকার প্লাস্টিক বা কৃত্রিম লেদার নয়; শুধুমাত্র বিশুদ্ধ প্রাকৃতিক উপাদান।'
                  : 'Zero synthetic leather or mass plastic. Strictly pure organic raw materials.'}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#E7E0D3] shadow-xs flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-[#FAF0F2] text-[#962D3E] shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#1E1E1E] mb-1">
                {language === 'bn' ? 'দেশীয় কারিগরদের ক্ষমতায়ন' : 'Artisan Empowerment'}
              </h3>
              <p className="text-xs text-[#70675C]">
                {language === 'bn'
                  ? 'ন্যায্য পারিশ্রমিক ও নিরাপদ কর্মপরিবেশের মাধ্যমে প্রান্তিক তাঁতি ও শিল্পীদের সহায়তা।'
                  : 'Fair trade wages directly supporting master weavers and craft clusters across Bangladesh.'}
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
                {language === 'bn' ? 'পরিবেশবান্ধব ও টেকসই' : 'Sustainable Living'}
              </h3>
              <p className="text-xs text-[#70675C]">
                {language === 'bn'
                  ? 'পাট, মাটি ও পুনর্ব্যবহারযোগ্য প্যাকেজিংয়ের মাধ্যমে প্রকৃতির প্রতি ভালোবাসা।'
                  : 'Eco-conscious packaging with biodegradable jute, cotton, and reusable craft containers.'}
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
