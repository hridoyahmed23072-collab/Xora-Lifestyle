import React, { useState, useEffect } from 'react';
import { Truck, MapPin, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { storeService } from '../services/storeService';
import { DEFAULT_SETTINGS } from '../lib/constants';
import { StoreSettings } from '../types';

export const DeliveryInfo: React.FC = () => {
  const { language, formatPrice, t } = useLanguage();
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    storeService.getSettings().then((data) => {
      if (data) setSettings(data);
    });
  }, []);

  return (
    <div className="py-10 md:py-16 bg-[#FAF7F2] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-[#962D3E] uppercase tracking-widest">
            {language === 'bn' ? 'সারাদেশে হোম ডেলিভারি' : 'Nationwide Shipping'}
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#1E1E1E] mt-2 mb-3">
            {t('navDelivery')}
          </h1>
          <p className="text-xs sm:text-sm text-[#696156] max-w-md mx-auto leading-relaxed">
            {language === 'bn'
              ? 'বাংলাদেশের ৬৪টি জেলা ও প্রত্যন্ত উপজেলায় নির্ভরযোগ্য হোম ডেলিভারি সেবা।'
              : 'Reliable doorstep parcel delivery across all 64 districts of Bangladesh.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          {/* Inside Dhaka Card */}
          <div className="bg-white p-6 rounded-2xl border border-[#E7E0D3] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-[#FAF0F2] text-[#962D3E] text-xs font-bold rounded-lg">
                  {language === 'bn' ? 'ঢাকার ভেতরে' : 'Inside Dhaka'}
                </span>
                <span className="text-xl font-bold text-[#1E1E1E]">
                  {formatPrice(settings.insideDhakaCharge)}
                </span>
              </div>
              <h2 className="font-bold text-base text-[#1E1E1E] mb-2">
                {language === 'bn' ? 'ঢাকা মেট্রোপলিটন এলাকা' : 'Dhaka Metropolitan Zone'}
              </h2>
              <p className="text-xs text-[#6B6357] leading-relaxed mb-4">
                {language === 'bn'
                  ? 'ধানমন্ডি, গুলশান, বনানী, উত্তরা, মিরপুর, মতিঝিলসহ পুরো ঢাকা শহরের ভেতরে দ্রুততম ডেলিভারি।'
                  : 'Fast delivery across all Dhaka city locations within 2-3 business days.'}
              </p>
            </div>
            <div className="pt-3 border-t border-[#F0EAE0] flex items-center gap-2 text-xs text-[#2E7D32] font-semibold">
              <Clock className="w-4 h-4" />
              <span>{language === 'bn' ? 'ডেলিভারি সময়: ২ থেকে ৩ কার্যদিবস' : 'Timeframe: 2-3 business days'}</span>
            </div>
          </div>

          {/* Outside Dhaka Card */}
          <div className="bg-white p-6 rounded-2xl border border-[#E7E0D3] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-[#FAF0F2] text-[#962D3E] text-xs font-bold rounded-lg">
                  {language === 'bn' ? 'ঢাকার বাইরে' : 'Outside Dhaka'}
                </span>
                <span className="text-xl font-bold text-[#1E1E1E]">
                  {formatPrice(settings.outsideDhakaCharge)}
                </span>
              </div>
              <h2 className="font-bold text-base text-[#1E1E1E] mb-2">
                {language === 'bn' ? 'বাংলাদেশের অন্য সকল ৬৩টি জেলা' : 'Remaining 63 Districts'}
              </h2>
              <p className="text-xs text-[#6B6357] leading-relaxed mb-4">
                {language === 'bn'
                  ? 'চট্টগ্রাম, সিলেট, রাজশাহী, খুলনা, বরিশাল, রংপুর, ময়মনসিংহ ও সকল জেলা সদর ও উপজেলায় হোম ডেলিভারি।'
                  : 'Doorstep parcel delivery to all divisional cities, district sadars, and upazilas.'}
              </p>
            </div>
            <div className="pt-3 border-t border-[#F0EAE0] flex items-center gap-2 text-xs text-[#2E7D32] font-semibold">
              <Clock className="w-4 h-4" />
              <span>{language === 'bn' ? 'ডেলিভারি সময়: ৩ থেকে ৫ কার্যদিবস' : 'Timeframe: 3-5 business days'}</span>
            </div>
          </div>

        </div>

        {/* Free Shipping Highlight Banner */}
        <div className="bg-[#962D3E] text-white p-6 rounded-2xl shadow-md mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-xl">
              <Truck className="w-6 h-6 text-[#E7C677]" />
            </div>
            <div>
              <h3 className="font-bold text-base">
                {language === 'bn'
                  ? `${formatPrice(settings.freeShippingMinAmount || 3000)} টাকার কেনাকাটায় ফ্রি ডেলিভারি!`
                  : `Free Shipping on orders above ${formatPrice(settings.freeShippingMinAmount || 3000)}!`}
              </h3>
              <p className="text-xs text-white/80">
                {language === 'bn'
                  ? `যেকোনো পণ্যের অর্ডারে মোট মূল্য ${formatPrice(settings.freeShippingMinAmount || 3000)} বা তার বেশি হলে সারা বাংলাদেশে সম্পূর্ণ ফ্রি হোম ডেলিভারি।`
                  : `Nationwide zero shipping fee automatically applied at checkout for orders over ${formatPrice(settings.freeShippingMinAmount || 3000)}.`}
              </p>
            </div>
          </div>
        </div>

        {/* Delivery Logistics & Partners */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E7E0D3] shadow-sm flex flex-col gap-6 text-xs sm:text-sm text-[#474036] leading-relaxed">
          <h2 className="font-bold text-base text-[#1E1E1E]">
            {language === 'bn' ? 'আমাদের ডেলিভারি পার্টনার্স' : 'Courier Logistics Partners'}
          </h2>
          <p>
            {language === 'bn'
              ? 'নিরাপদ ও দ্রুততম পার্সেল হ্যান্ডলিং নিশ্চিত করতে আমরা শীর্ষস্থানীয় কুরিয়ার সার্ভিস—Steadfast Courier ও Pathao Courier-এর অফিসিয়াল পার্টনার। অর্ডার পাঠানোর সাথে সাথে আপনার মোবাইল নম্বরে ট্র্যাকিং লিঙ্ক ও ওটিপি পৌঁছে যাবে।'
              : 'We partner with Steadfast Courier and Pathao Courier for prompt, careful parcel handling. Real-time SMS notifications with delivery tracking are dispatched when your parcel leaves our studio.'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E7E0D3] flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#2E7D32] shrink-0" />
              <div>
                <h4 className="font-bold text-xs text-[#1E1E1E] mb-1">
                  {language === 'bn' ? 'ক্যাশ অন ডেলিভারি (COD)' : 'Doorstep Inspection'}
                </h4>
                <p className="text-xs text-[#70675C]">
                  {language === 'bn'
                    ? 'ডেলিভারিম্যানের সামনে প্যাকেট খুলে দেখে নিন এবং সন্তুষ্ট হয়ে টাকা পরিশোধ করুন।'
                    : 'Inspect package condition upon arrival before handing cash to the delivery representative.'}
                </p>
              </div>
            </div>

            <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E7E0D3] flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#962D3E] shrink-0" />
              <div>
                <h4 className="font-bold text-xs text-[#1E1E1E] mb-1">
                  {language === 'bn' ? 'সরাসরি ট্র্যাকিং সুবিধা' : 'Live Online Tracking'}
                </h4>
                <p className="text-xs text-[#70675C]">
                  {language === 'bn'
                    ? 'আমাদের ওয়েবসাইটের "অর্ডার ট্র্যাক" পেইজে গিয়ে যেকোনো সময় পার্সেলের অবস্থান জানুন।'
                    : 'Check your real-time status anytime on our Track Order page using your Order ID.'}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
