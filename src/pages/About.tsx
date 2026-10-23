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
              ? 'সরাসরি চীন থেকে আমদানিকৃত বিশ্বমানের এক্সক্লুসিভ ডিজাইন ও প্রিমিয়াম কোয়ালিটি ব্যাগের শীর্ষ ব্র্যান্ড।'
              : 'Directly imported world-class exclusive designs and premium quality bags for everyday elegance.'}
          </p>
        </div>

        {/* Hero Visual Card */}
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-[#E7E0D3] shadow-md mb-12">
          <img
            src="/images/product_leather_bag_1792674216295.jpg"
            alt="Xora Lifestyle Handcrafted Leather Bags"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              target.onerror = null;
              target.src = 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80';
            }}
          />
        </div>

        {/* Narrative Section */}
        <div className="bg-white p-6 sm:p-10 rounded-2xl border border-[#E7E0D3] shadow-sm mb-12 flex flex-col gap-5 text-xs sm:text-sm text-[#474036] leading-relaxed">
          <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#1E1E1E]">
            {language === 'bn' ? 'যেভাবে আমাদের পথচলা শুরু' : 'How It All Began'}
          </h2>
          <h3 className="text-sm sm:text-base font-bold text-[#962D3E] -mt-1">
            {language === 'bn'
              ? 'Xora Lifestyle — সরাসরি সেরা প্রিমিয়াম আমদানির নিশ্চয়তা'
              : 'Xora Lifestyle — Guaranteed Premium Direct Import'}
          </h3>
          <p>
            {language === 'bn'
              ? 'আমরা কোনো লোকাল প্রস্তুতকারক নই; Xora Lifestyle সরাসরি চীন থেকে বিশ্বমানের সেরা ও প্রিমিয়াম কোয়ালিটির প্রোডাক্ট ইম্পোর্ট (Import) করে থাকে। আমাদের একমাত্র লক্ষ্য—আপনাকে আন্তর্জাতিক মানের এক্সক্লুসিভ ডিজাইন ও সেরা ফিনিশিংয়ের অ্যাক্সেস দেওয়া।'
              : 'We are not a local manufacturer; Xora Lifestyle directly imports world-class premium quality products from China. Our primary focus is granting you direct access to international exclusive designs and superior craftsmanship.'}
          </p>
          <p>
            {language === 'bn'
              ? 'আমাদের প্রতিটি ব্যাগ, টোট ও অ্যাক্সেসরিজ সরাসরি সোর্সিংয়ের সময় কঠোরভাবে কোয়ালিটি চেক করা হয়, যাতে সস্তা বা নরমাল কোনো প্রোডাক্ট আপনার হাতে না পৌঁছায়। কোনো থার্ড-পার্টি নয়, সরাসরি ইম্পোর্ট করার কারণে আমরা নিশ্চিত করি আসল প্রিমিয়াম কোয়ালিটি ও দীর্ঘস্থায়িত্ব।'
              : 'Every bag, tote, and accessory undergoes rigorous direct-sourcing quality control, ensuring sub-par or ordinary products never reach you. With no middlemen, our direct imports guarantee authentic premium grade durability and longevity.'}
          </p>
          <div className="mt-1 pt-3.5 border-t border-[#F0EAE1] bg-[#FAF7F2] p-3.5 rounded-xl text-xs sm:text-sm font-semibold text-[#7D2232] text-center sm:text-left">
            {language === 'bn'
              ? '💎 সেরা আন্তর্জাতিক ডিজাইন | ✈️ সরাসরি চীন থেকে ইম্পোর্টেড | 🛡️ ১০০% কোয়ালিটি এস্যুরেন্স'
              : '💎 International Exclusive Design | ✈️ Directly Imported from China | 🛡️ 100% Quality Assurance'}
          </div>
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
