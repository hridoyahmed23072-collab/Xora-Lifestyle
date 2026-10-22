import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const FloatingContactButtons: React.FC = () => {
  const { language } = useLanguage();

  const whatsappMessage = encodeURIComponent(
    language === 'bn'
      ? 'হ্যালো Xora Lifestyle, আমি একটি পণ্যের বিষয়ে জানতে চাচ্ছি।'
      : 'Hello Xora Lifestyle, I would like to know more about your collection.'
  );

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-40 flex flex-col gap-2.5 items-end">
      {/* WhatsApp Floating Button */}
      <a
        href={`https://wa.me/8801711234567?text=${whatsappMessage}`}
        target="_blank"
        rel="noreferrer"
        className="group flex items-center gap-2 bg-[#25D366] text-white p-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
        aria-label="Chat on WhatsApp"
      >
        <span className="hidden md:group-hover:inline-block text-xs font-semibold px-1 whitespace-nowrap">
          {language === 'bn' ? 'হোয়াটসঅ্যাপ চ্যাট' : 'WhatsApp Chat'}
        </span>
        <svg
          className="w-5 h-5 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.301-.15-1.782-.879-2.057-.98-.276-.1-.476-.15-.676.15-.2.301-.776.98-.952 1.18-.175.201-.35.226-.651.076-.301-.15-1.27-.468-2.42-1.493-.894-.798-1.498-1.784-1.674-2.085-.175-.301-.019-.464.132-.614.136-.135.301-.35.451-.526.151-.175.2-.301.3-.501.101-.2.051-.376-.025-.526-.076-.15-.676-1.629-.926-2.23-.244-.587-.492-.507-.676-.516l-.576-.01c-.2 0-.526.075-.802.376s-1.052 1.028-1.052 2.506c0 1.478 1.077 2.907 1.228 3.107.15.201 2.119 3.237 5.134 4.541.717.31 1.277.496 1.713.634.721.229 1.377.197 1.895.12.577-.087 1.782-.728 2.032-1.431.25-.703.25-1.305.175-1.431-.075-.126-.275-.201-.576-.351zM12.051 0C5.402 0 0 5.402 0 12.051c0 2.122.553 4.116 1.517 5.852L0 24l6.326-1.488C8.016 23.47 9.99 24.1 12.051 24.1c6.648 0 12.051-5.402 12.051-12.049C24.102 5.402 18.699 0 12.051 0zm0 22.012c-1.815 0-3.593-.487-5.15-1.411l-.369-.219-3.754.884.901-3.66-.24-.382C2.457 15.608 1.95 13.86 1.95 12.051c0-5.57 4.531-10.102 10.101-10.102 5.57 0 10.102 4.532 10.102 10.102 0 5.571-4.532 10.101-10.102 10.101z" />
        </svg>
      </a>

      {/* Facebook Messenger Floating Button */}
      <a
        href="https://m.me/xoralifestyle.bd"
        target="_blank"
        rel="noreferrer"
        className="group flex items-center gap-2 bg-[#0084FF] text-white p-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
        aria-label="Chat on Facebook Messenger"
      >
        <span className="hidden md:group-hover:inline-block text-xs font-semibold px-1 whitespace-nowrap">
          {language === 'bn' ? 'মেসেঞ্জার চ্যাট' : 'Messenger Chat'}
        </span>
        <MessageCircle className="w-5 h-5" />
      </a>
    </div>
  );
};
