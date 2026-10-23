import React, { useState } from 'react';
import { useSettings, toWhatsAppNumber } from '../hooks/useSettings';
import { Phone, Mail, MapPin, MessageCircle, Clock, Send, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Contact: React.FC = () => {
  const { language, t } = useLanguage();
  const settings = useSettings();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && message.trim()) {
      setSent(true);
      setTimeout(() => {
        setName('');
        setPhone('');
        setMessage('');
        setSent(false);
      }, 5000);
    }
  };

  return (
    <div className="py-10 md:py-16 bg-[#FAF7F2] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-[#962D3E] uppercase tracking-widest">
            {language === 'bn' ? 'আমরা আপনার অপেক্ষায়' : 'Get In Touch'}
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#1E1E1E] mt-2 mb-3">
            {t('navContact')}
          </h1>
          <p className="text-xs sm:text-sm text-[#696156] max-w-md mx-auto leading-relaxed">
            {language === 'bn'
              ? 'পণ্য সংক্রান্ত যেকোনো জিজ্ঞাসা, বাল্ক অর্ডার বা ডেলিভারির তথ্যের জন্য সরাসরি আমাদের সাথে যোগাযোগ করুন।'
              : 'Feel free to reach out with any inquiries, corporate gifting questions, or product queries.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Contact Details (lg:col-span-5) */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-[#E7E0D3] shadow-sm flex flex-col gap-6">
            <h2 className="font-serif-luxury text-xl font-bold text-[#1E1E1E]">
              {language === 'bn' ? 'সরাসরি যোগাযোগ' : 'Direct Channels'}
            </h2>

            <div className="flex flex-col gap-5 text-xs sm:text-sm text-[#474036]">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-[#FAF0F2] text-[#962D3E] shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-[#1E1E1E]">{language === 'bn' ? 'হটলাইন নম্বর' : 'Hotline Phone'}</p>
                  <p className="tabular-nums text-[#962D3E] font-semibold mt-0.5">{settings.phone}</p>
                  <p className="text-[11px] text-[#7A7165]">সকাল ১০:০০ টা থেকে রাত ১০:০০ টা (প্রতিদিন)</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-[#EAF8EE] text-[#1E7E34] shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-[#1E1E1E]">WhatsApp Support</p>
                  <p className="tabular-nums font-semibold text-[#1E7E34] mt-0.5">{settings.whatsapp}</p>
                  <a
                    href={`https://wa.me/${toWhatsAppNumber(settings.whatsapp)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-[#1E7E34] underline font-medium block mt-0.5"
                  >
                    {language === 'bn' ? 'হোয়াটসঅ্যাপে চ্যাট শুরু করুন' : 'Open WhatsApp chat'}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-[#FAF0F2] text-[#962D3E] shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-[#1E1E1E]">{language === 'bn' ? 'ইমেইল অ্যাড্রেস' : 'Official Email'}</p>
                  <p className="text-[#696156] mt-0.5">{settings.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-[#FAF0F2] text-[#962D3E] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-[#1E1E1E]">{language === 'bn' ? 'শো-রুম ও অফিস' : 'Showroom & Studio'}</p>
                  <p className="text-[#696156] mt-0.5">
                    {language === 'bn' ? settings.addressBn : settings.addressEn}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E7E0D3] flex items-center gap-3">
              <Clock className="w-5 h-5 text-[#962D3E] shrink-0" />
              <p className="text-xs text-[#5C5449]">
                {language === 'bn'
                  ? 'ফেসবুক পেজ মেসেঞ্জার ও হোয়াটসঅ্যাপে আমাদের টিম দ্রুততম সময়ে রিপ্লাই দিয়ে থাকে।'
                  : 'Fast response available via Facebook Messenger and WhatsApp.'}
              </p>
            </div>
          </div>

          {/* Contact Inquiry Form (lg:col-span-7) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-[#E7E0D3] shadow-sm flex flex-col gap-5">
            <h2 className="font-serif-luxury text-xl font-bold text-[#1E1E1E]">
              {language === 'bn' ? 'বার্তা পাঠান' : 'Send a Message'}
            </h2>

            {sent ? (
              <div className="p-6 bg-[#EAF8EE] rounded-xl border border-[#BDE8C6] text-center flex flex-col items-center gap-2">
                <CheckCircle2 className="w-8 h-8 text-[#1E7E34]" />
                <h3 className="font-bold text-sm text-[#1E7E34]">
                  {language === 'bn' ? 'আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে!' : 'Message received!'}
                </h3>
                <p className="text-xs text-[#4E7D59]">
                  {language === 'bn'
                    ? 'আমাদের টিম শীঘ্রই আপনার সাথে যোগাযোগ করবে।'
                    : 'We will respond to your inquiry shortly.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#3D362C] block mb-1">
                    {t('fullName')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('fullNamePlaceholder')}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#D5CCC0] text-sm text-[#1E1E1E] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#962D3E]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#3D362C] block mb-1">
                    {t('phoneNumber')}
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="017xxxxxxxx"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#D5CCC0] text-sm text-[#1E1E1E] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#962D3E]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#3D362C] block mb-1">
                    {language === 'bn' ? 'আপনার বার্তা বা জিজ্ঞাসা *' : 'Your Message / Inquiry *'}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={
                      language === 'bn'
                        ? 'আপনার বার্তা এখানে লিখুন...'
                        : 'Write your inquiry here...'
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#D5CCC0] text-sm text-[#1E1E1E] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#962D3E]"
                  />
                </div>

                <button
                  type="submit"
                  className="py-3 px-6 bg-[#962D3E] hover:bg-[#7D2232] text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 self-start"
                >
                  <Send className="w-4 h-4" />
                  <span>{language === 'bn' ? 'বার্তা পাঠান' : 'Submit Message'}</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
