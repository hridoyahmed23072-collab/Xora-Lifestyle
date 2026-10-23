import React from 'react';
import { useSettings, toWhatsAppNumber } from '../hooks/useSettings';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Truck, ShieldCheck, RefreshCw, Facebook } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const { language, t } = useLanguage();
  const settings = useSettings();

  return (
    <footer className="bg-[#1A1816] text-[#D1C9BE] pt-14 pb-24 md:pb-12 border-t border-[#2D2A26]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Feature Trust Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-[#2C2925]">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-[#262320] text-[#E7C677] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">{t('trustDeliveryTitle')}</h4>
              <p className="text-xs text-[#968E83] mt-0.5">{t('trustDeliveryDesc')}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-[#262320] text-[#E7C677] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">{t('trustCodTitle')}</h4>
              <p className="text-xs text-[#968E83] mt-0.5">{t('trustCodDesc')}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-[#262320] text-[#E7C677] shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">{t('trustReturnTitle')}</h4>
              <p className="text-xs text-[#968E83] mt-0.5">{t('trustReturnDesc')}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-[#262320] text-[#E7C677] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">{t('trustQualityTitle')}</h4>
              <p className="text-xs text-[#968E83] mt-0.5">{t('trustQualityDesc')}</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links & Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-12 border-b border-[#2C2925]">
          {/* Brand Info */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <Link to="/" className="flex flex-col">
              <span className="font-serif-luxury text-2xl font-bold tracking-tight text-white">
                Xora Lifestyle
              </span>
              <span className="text-[11px] text-[#A69E93] tracking-widest uppercase mt-0.5">
                {language === 'bn' ? 'জোড়া লাইফস্টাইল - বাংলাদেশ' : 'Handcrafted Heritage Bangladesh'}
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-[#A69E93] max-w-sm">
              {t('footerAboutText')}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#262320] hover:bg-[#962D3E] text-white flex items-center justify-center transition-colors"
                aria-label="Facebook Page"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${toWhatsAppNumber(settings.whatsapp)}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-full bg-[#262320] hover:bg-[#25D366] text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <span>WhatsApp: {settings.whatsapp}</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <h4 className="text-xs font-bold text-white tracking-wider uppercase">
              {t('quickLinks')}
            </h4>
            <nav className="flex flex-col gap-2 text-xs text-[#A69E93]">
              <Link to="/shop" className="hover:text-white transition-colors">{t('navShop')}</Link>
              <Link to="/shop?category=handbags" className="hover:text-white transition-colors">{language === 'bn' ? 'হ্যান্ডব্যাগ' : 'Handbags'}</Link>
              <Link to="/shop?category=tote-bags" className="hover:text-white transition-colors">{language === 'bn' ? 'টোট ব্যাগ' : 'Tote Bags'}</Link>
              <Link to="/shop?category=backpacks" className="hover:text-white transition-colors">{language === 'bn' ? 'ব্যাকপ্যাক' : 'Backpacks'}</Link>
              <Link to="/shop?category=shoulder-bags" className="hover:text-white transition-colors">{language === 'bn' ? 'শোল্ডার ব্যাগ' : 'Shoulder Bags'}</Link>
              <Link to="/shop?category=clutch-wallets" className="hover:text-white transition-colors">{language === 'bn' ? 'ক্লাচ ও ওয়ালেট' : 'Clutch & Wallets'}</Link>
              <Link to="/shop?category=travel-bags" className="hover:text-white transition-colors">{language === 'bn' ? 'ট্রাভেল ব্যাগ' : 'Travel Bags'}</Link>
            </nav>
          </div>

          {/* Customer Care & Policies */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <h4 className="text-xs font-bold text-white tracking-wider uppercase">
              {t('customerCare')}
            </h4>
            <nav className="flex flex-col gap-2 text-xs text-[#A69E93]">
              <Link to="/track-order" className="hover:text-white transition-colors">{t('navTrackOrder')}</Link>
              <Link to="/returns" className="hover:text-white transition-colors">{t('navReturns')}</Link>
              <Link to="/delivery" className="hover:text-white transition-colors">{t('navDelivery')}</Link>
              <Link to="/about" className="hover:text-white transition-colors">{t('navAbout')}</Link>
              <Link to="/contact" className="hover:text-white transition-colors">{t('navContact')}</Link>
            </nav>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <h4 className="text-xs font-bold text-white tracking-wider uppercase">
              {t('contactInfo')}
            </h4>
            <div className="flex flex-col gap-2.5 text-xs text-[#A69E93]">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#E7C677] shrink-0 mt-0.5" />
                <span>
                  {language === 'bn' ? settings.addressBn : settings.addressEn}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#E7C677] shrink-0" />
                <span>{settings.phone} (সকাল ১০টা - রাত ১০টা)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#E7C677] shrink-0" />
                <span>{settings.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Sub-Footer: Payment Methods & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#7A7268]">
          <div className="flex items-center gap-3">
            <p>{t('copyright')}</p>
            <span aria-hidden="true" className="text-[#38332D]">·</span>
            <Link
              to="/admin/login"
              className="text-[#6E665B] hover:text-[#D1C9BE] text-[11px] underline underline-offset-2 transition-colors"
            >
              Admin
            </Link>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-[#A69E93]">
              {language === 'bn' ? 'স্বীকৃত পেমেন্ট মেথড:' : 'Accepted Payments:'}
            </span>
            <div className="flex items-center gap-2 text-xs font-medium text-white">
              <span className="px-2 py-0.5 bg-[#262320] border border-[#38332D] rounded text-[11px]">
                {language === 'bn' ? 'ক্যাশ অন ডেলিভারি' : 'Cash on Delivery'}
              </span>
              <span className="px-2 py-0.5 bg-[#E2136E] rounded text-white text-[11px] font-bold">
                bKash
              </span>
              <span className="px-2 py-0.5 bg-[#F7931E] rounded text-white text-[11px] font-bold">
                Nagad
              </span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
