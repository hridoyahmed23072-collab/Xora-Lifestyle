import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, MessageCircle, Truck, ArrowRight, Copy, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { storeService } from '../services/storeService';
import { Order } from '../types';

export const OrderSuccess: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { language, formatPrice, t } = useLanguage();
  const [order, setOrder] = useState<Order | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (!id) return;

    // Check localStorage orders
    const savedOrdersStr = localStorage.getItem('xora_orders');
    if (savedOrdersStr) {
      const orders: Order[] = JSON.parse(savedOrdersStr);
      const matched = orders.find((o) => o.id === id);
      if (matched) {
        setOrder(matched);
      }
    }
  }, [id]);

  const copyOrderId = () => {
    if (id) {
      navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const whatsappMessage = order
    ? encodeURIComponent(
        language === 'bn'
          ? `হ্যালো Xora Lifestyle, আমার অর্ডার আইডি: ${order.id}, মোট মূল্য: ৳${order.totalAmount}। গ্রাহক: ${order.customerName}, ফোন: ${order.phone}। অনুগ্রহ করে অর্ডারটি কনফার্ম করুন।`
          : `Hello Xora Lifestyle, my Order ID is ${order.id}, Total: ৳${order.totalAmount}. Name: ${order.customerName}, Phone: ${order.phone}. Please confirm my order.`
      )
    : encodeURIComponent(`Hello Xora Lifestyle, I just placed order ${id}.`);

  return (
    <div className="py-12 md:py-16 bg-[#FAF7F2] min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        
        {/* Success Header Card */}
        <div className="bg-white rounded-2xl border border-[#E7E0D3] p-6 sm:p-10 text-center shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#EAF8EE] text-[#2E7D32] flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1E1E1E] mb-2">
            {t('orderSuccessTitle')}
          </h1>

          <p className="text-xs sm:text-sm text-[#696156] max-w-md mx-auto leading-relaxed mb-6">
            {t('orderSuccessSub')}
          </p>

          {/* Order ID Banner */}
          <div className="inline-flex items-center gap-3 bg-[#FAF7F2] border border-[#DDD4C5] rounded-xl px-4 py-2.5 mb-8">
            <span className="text-xs text-[#7A7165] font-medium">{t('orderIdLabel')}:</span>
            <span className="text-base font-bold text-[#962D3E] font-mono tracking-wide">{id}</span>
            <button
              onClick={copyOrderId}
              className="p-1 text-[#7A7165] hover:text-[#1E1E1E] transition-colors"
              title="Copy Order ID"
            >
              {copied ? <Check className="w-4 h-4 text-[#2E7D32]" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* WhatsApp Direct Action Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={`https://wa.me/8801711234567?text=${whatsappMessage}`}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-6 py-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t('confirmViaWhatsApp')}</span>
            </a>

            <Link
              to={`/track-order?id=${id}&phone=${order?.phone || ''}`}
              className="w-full sm:w-auto px-6 py-3 bg-[#FAF7F2] hover:bg-[#EFE9DF] text-[#2D2A26] border border-[#DDD4C5] text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Truck className="w-4 h-4 text-[#962D3E]" />
              <span>{t('trackMyOrder')}</span>
            </Link>
          </div>
        </div>

        {/* Order Details Breakdown Card */}
        {order && (
          <div className="mt-8 bg-white rounded-2xl border border-[#E7E0D3] p-6 shadow-sm flex flex-col gap-5">
            <h2 className="font-semibold text-base text-[#1E1E1E] border-b border-[#F0EAE0] pb-3">
              {language === 'bn' ? 'অর্ডার সংক্রান্ত তথ্য' : 'Order Information'}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#544C41]">
              <div>
                <p className="text-[#887F74] mb-0.5">{language === 'bn' ? 'গ্রাহকের নাম' : 'Customer Name'}</p>
                <p className="font-bold text-[#1E1E1E]">{order.customerName}</p>
              </div>
              <div>
                <p className="text-[#887F74] mb-0.5">{language === 'bn' ? 'মোবাইল নম্বর' : 'Phone'}</p>
                <p className="font-bold text-[#1E1E1E] tabular-nums">{order.phone}</p>
              </div>
              <div>
                <p className="text-[#887F74] mb-0.5">{language === 'bn' ? 'ডেলিভারি ঠিকানা' : 'Address'}</p>
                <p className="font-semibold text-[#1E1E1E]">{order.address}, {order.district}</p>
              </div>
              <div>
                <p className="text-[#887F74] mb-0.5">{language === 'bn' ? 'পেমেন্ট মেথড' : 'Payment Method'}</p>
                <p className="font-bold text-[#962D3E] uppercase">{order.paymentMethod}</p>
              </div>
            </div>

            {/* Itemized summary */}
            <div className="pt-3 border-t border-[#F0EAE0] flex flex-col gap-2.5">
              <p className="text-xs font-bold text-[#1E1E1E]">
                {language === 'bn' ? 'অর্ডারকৃত পণ্যসমূহ:' : 'Ordered Items:'}
              </p>
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs py-1">
                  <span className="text-[#4A433A] truncate max-w-xs">
                    {language === 'bn' ? item.nameBn : item.nameEn} (x{item.quantity})
                  </span>
                  <span className="font-semibold text-[#1E1E1E] tabular-nums">
                    {formatPrice(item.totalPrice)}
                  </span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="pt-3 border-t border-[#F0EAE0] flex justify-between items-baseline text-xs sm:text-sm">
              <span className="font-bold text-[#1E1E1E]">{t('total')}</span>
              <span className="text-lg font-bold text-[#962D3E] tabular-nums">
                {formatPrice(order.totalAmount)}
              </span>
            </div>
          </div>
        )}

        <div className="text-center mt-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#962D3E] hover:underline"
          >
            <span>{t('backToHome')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
};
