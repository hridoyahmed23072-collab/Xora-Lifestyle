import React from 'react';
import { RotateCcw, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Returns: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <div className="py-10 md:py-16 bg-[#FAF7F2] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-[#962D3E] uppercase tracking-widest">
            {language === 'bn' ? 'গ্রাহক অধিকার ও সুরক্ষা' : 'Customer Guarantee'}
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#1E1E1E] mt-2 mb-3">
            {t('navReturns')}
          </h1>
          <p className="text-xs sm:text-sm text-[#696156] max-w-md mx-auto leading-relaxed">
            {language === 'bn'
              ? 'Xora Lifestyle-এ আমরা নিশ্চিত করি শতভাগ গ্রাহক সন্তুষ্টি। আমাদের সহজ ৭ দিনের রিটার্ন পলিসি জানুন।'
              : 'Our straightforward 7-day return and exchange policy guarantees your peace of mind.'}
          </p>
        </div>

        <div className="bg-white p-6 sm:p-10 rounded-2xl border border-[#E7E0D3] shadow-sm flex flex-col gap-8 text-xs sm:text-sm text-[#474036] leading-relaxed">
          
          <div className="flex items-start gap-3.5 pb-6 border-b border-[#F0EAE0]">
            <div className="p-3 rounded-xl bg-[#FAF0F2] text-[#962D3E] shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-base text-[#1E1E1E] mb-1">
                {language === 'bn' ? '৭ দিনের মধ্যে পণ্য পরিবর্তনের সুযোগ' : '7 Days Easy Exchange Window'}
              </h2>
              <p>
                {language === 'bn'
                  ? 'পণ্য হাতে পাওয়ার পর যদি সাইজ না মেলে, কোনো ম্যানুফ্যাকচারিং ত্রুটি থাকে বা ছবিতে প্রদর্শিত রঙের সাথে উল্লেখযোগ্য অমিল পাওয়া যায়, তবে আপনি ৭ দিনের মধ্যে তা পরিবর্তনের জন্য অনুরোধ জানাতে পারবেন।'
                  : 'If the size does not fit comfortably, or if there is any craftsmanship defect, you may request an exchange within 7 days of receiving your order.'}
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-sm text-[#1E1E1E] mb-3">
              {language === 'bn' ? 'রিটার্ন বা পরিবর্তনের নিয়মাবলী:' : 'Conditions for Return / Exchange:'}
            </h3>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />
                <span>{language === 'bn' ? 'পণ্যটি অবশ্যই অব্যবহৃত (unworn), গন্ধহীন ও পরিষ্কার অবস্থায় থাকতে হবে।' : 'The item must be in its original unworn condition.'}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />
                <span>{language === 'bn' ? 'পণ্যের সাথে থাকা অরিজিনাল ট্যাগ ও প্যাকেজিং অক্ষত থাকতে হবে।' : 'Original tags, seals, and bespoke packaging must be intact.'}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />
                <span>{language === 'bn' ? 'ডেলিভারিম্যানের সামনে পণ্য খুলে চেক করে ত্রুটি থাকলে তৎক্ষণাৎ রিটার্ন করা সবচেয়ে সহজ পদ্ধতি।' : 'Inspecting the parcel in the presence of the delivery agent is recommended.'}</span>
              </li>
            </ul>
          </div>

          <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E7E0D3]">
            <h4 className="font-bold text-xs text-[#1E1E1E] mb-1 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-[#962D3E]" />
              <span>{language === 'bn' ? 'রিফান্ড প্রসেসিং সময়' : 'Refund Timeline'}</span>
            </h4>
            <p className="text-xs text-[#6B6357]">
              {language === 'bn'
                ? 'যদি কোনো কারণে পণ্য পরিবর্তন সম্ভব না হয়, তবে রিটার্নকৃত পণ্য আমাদের ওয়্যারহাউসে পৌঁছানোর পর ৩ থেকে ৫ কার্যদিবসের মধ্যে আপনার বিকাশ/নগদ অ্যাকাউন্টে সম্পূর্ণ টাকা রিফান্ড করা হবে।'
                : 'If a replacement is unavailable, full refunds will be disbursed to your bKash or Nagad wallet within 3 to 5 business days after product inspection.'}
            </p>
          </div>

          <div className="pt-2">
            <h4 className="font-bold text-xs text-[#1E1E1E] mb-2">
              {language === 'bn' ? 'রিটার্নের জন্য কীভাবে যোগাযোগ করবেন?' : 'How to initiate a return?'}
            </h4>
            <p className="text-xs text-[#6B6357] mb-4">
              {language === 'bn'
                ? 'আপনার অর্ডার আইডি এবং পণ্যের ছবিসহ আমাদের অফিসিয়াল হোয়াটসঅ্যাপ নম্বরে (+880 1711-234567) মেসেজ দিন।'
                : 'Send your Order ID and photo evidence directly to our WhatsApp support at +880 1711-234567.'}
            </p>
            <a
              href="https://wa.me/8801711234567"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#25D366] text-white text-xs font-bold rounded-xl"
            >
              <span>{language === 'bn' ? 'হোয়াটসঅ্যাপে সাপোর্ট টিম' : 'WhatsApp Support'}</span>
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};
