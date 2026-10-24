import React, { useRef } from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle, Package, Home, Printer, MessageCircle } from 'lucide-react';
import { Order } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Invoice } from '../components/Invoice';
import { useSettings } from '../hooks/useSettings';

export const OrderSuccess: React.FC = () => {
  const location = useLocation();
  const settings = useSettings();
  const order = location.state?.order as Order | undefined;
  const invoiceRef = useRef<HTMLDivElement>(null);

  if (!order) {
    return <Navigate to="/" replace />;
  }

  const handlePrint = () => {
    window.print();
  };

  const whatsappNumber = settings.whatsapp || '8801700000000';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `হ্যালো, আমি আমার অর্ডারটি কনফার্ম করতে চাই। অর্ডার আইডি: ${order.id}`
  )}`;

  return (
    <div className="min-h-screen bg-rose-50/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        
        {/* On-screen Notification */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-rose-100 text-center mb-8 print:hidden">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-slate-900 mb-2">আপনার অর্ডারটি সফলভাবে গৃহীত হয়েছে!</h1>
          <p className="text-sm text-slate-600 mb-4">
            অর্ডার আইডি: <span className="font-bold text-rose-950">{order.id}</span>
          </p>
          
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {/* WhatsApp Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-medium text-sm rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              হোয়াটসঅ্যাপে অর্ডার কনফার্ম করুন
            </a>

            {/* Invoice Print Button */}
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-950 text-amber-300 font-medium text-sm rounded-xl hover:bg-rose-900 transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4" />
              ইনভয়েস ডাউনলোড / প্রিন্ট করুন
            </button>

            {/* Track Order Button */}
            <Link
              to="/track-order"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-100 text-rose-950 font-medium text-sm rounded-xl hover:bg-rose-200 transition-colors"
            >
              <Package className="w-4 h-4" />
              অর্ডার ট্র্যাক করুন
            </Link>

            {/* Home Button */}
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-700 font-medium text-sm rounded-xl hover:bg-slate-200 transition-colors"
            >
              <Home className="w-4 h-4" />
              হোমে যান
            </Link>
          </div>
        </div>

        {/* Invoice Area */}
        <div ref={invoiceRef}>
          <Invoice order={order} />
        </div>

      </div>
    </div>
  );
};
