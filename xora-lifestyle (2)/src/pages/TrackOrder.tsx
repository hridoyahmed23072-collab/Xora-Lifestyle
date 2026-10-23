import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Truck,
  CheckCircle2,
  Clock,
  Package,
  Check,
  Search,
  AlertCircle,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { storeService } from '../services/storeService';
import { Order, OrderStatus } from '../types';

export const TrackOrder: React.FC = () => {
  const { language, formatPrice, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [orderId, setOrderId] = useState(searchParams.get('id') || '');
  const [phone, setPhone] = useState(searchParams.get('phone') || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-search if id & phone are in URL
  useEffect(() => {
    const urlId = searchParams.get('id');
    const urlPhone = searchParams.get('phone');
    if (urlId && urlPhone) {
      handleSearch(urlId, urlPhone);
    }
  }, [searchParams]);

  const handleSearch = async (targetId?: string, targetPhone?: string) => {
    const idToUse = targetId || orderId;
    const phoneToUse = targetPhone || phone;

    if (!idToUse.trim() || !phoneToUse.trim()) {
      setErrorMsg(
        language === 'bn'
          ? 'অনুগ্রহ করে অর্ডার আইডি এবং মোবাইল নম্বর দুটিই প্রদান করুন।'
          : 'Please enter both Order ID and Phone Number.'
      );
      return;
    }

    setErrorMsg('');
    setLoading(true);
    setSearched(true);

    try {
      const found = await storeService.trackOrder(idToUse, phoneToUse);
      setOrder(found);
    } catch (e) {
      console.error(e);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ id: orderId.trim(), phone: phone.trim() });
    handleSearch();
  };

  const steps: { key: OrderStatus; labelBn: string; labelEn: string; icon: any }[] = [
    { key: 'pending', labelBn: 'অর্ডার গৃহীত', labelEn: 'Order Placed', icon: Clock },
    { key: 'confirmed', labelBn: 'অর্ডার নিশ্চিত', labelEn: 'Confirmed', icon: CheckCircle2 },
    { key: 'processing', labelBn: 'প্যাকিং ও কোয়ালিটি চেক', labelEn: 'Processing', icon: Package },
    { key: 'shipped', labelBn: 'ডেলিভারির পথে', labelEn: 'In Transit', icon: Truck },
    { key: 'delivered', labelBn: 'ডেলিভারি সম্পন্ন', labelEn: 'Delivered', icon: Check },
  ];

  const getStepStatus = (stepKey: OrderStatus, currentStatus: OrderStatus) => {
    const statusOrder: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(stepKey);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="py-8 md:py-14 bg-[#FAF7F2] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1E1E1E]">
            {t('trackOrderTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-[#736A5E] mt-1.5 max-w-md mx-auto">
            {t('trackOrderSub')}
          </p>
        </div>

        {/* Search Input Box */}
        <div className="bg-white p-6 rounded-2xl border border-[#E7E0D3] shadow-sm mb-6">
          <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="text-[11px] font-bold text-[#4A433A] block mb-1">
                {t('enterOrderId')}
              </label>
              <input
                type="text"
                required
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder={t('orderIdPlaceholder')}
                className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D5CCC0] rounded-xl text-xs sm:text-sm text-[#1E1E1E] focus:bg-white focus:outline-none focus:border-[#962D3E]"
              />
            </div>

            <div className="flex-1">
              <label className="text-[11px] font-bold text-[#4A433A] block mb-1">
                {t('enterPhone')}
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="017xxxxxxxx"
                className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D5CCC0] rounded-xl text-xs sm:text-sm text-[#1E1E1E] focus:bg-white focus:outline-none focus:border-[#962D3E]"
              />
            </div>

            <div className="self-end w-full sm:w-auto">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#962D3E] hover:bg-[#7D2232] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all h-[42px]"
              >
                <Search className="w-4 h-4" />
                <span>{loading ? 'অনুসন্ধান...' : t('findOrder')}</span>
              </button>
            </div>
          </form>

          {errorMsg && (
            <p className="text-xs text-[#D32F2F] mt-3 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              <span>{errorMsg}</span>
            </p>
          )}
        </div>

        {/* Results View */}
        {searched && !order && !loading && (
          <div className="bg-white rounded-2xl border border-[#E7E0D3] p-8 text-center my-6 shadow-sm">
            <AlertCircle className="w-10 h-10 text-[#C49A45] mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#1E1E1E] mb-1">
              {t('orderNotFound')}
            </h3>
            <p className="text-xs text-[#7A7165] max-w-sm mx-auto mb-4">
              {language === 'bn'
                ? 'অনুগ্রহ করে অর্ডার আইডির স্পেলিং (যেমন: XOR-1001) এবং চেকআউটে ব্যবহৃত মোবাইল নম্বরটি পুনরায় যাচাই করুন।'
                : 'Please make sure your Order ID format and contact number match your checkout receipt.'}
            </p>
          </div>
        )}

        {order && (
          <div className="bg-white rounded-2xl border border-[#E7E0D3] p-6 sm:p-8 shadow-sm flex flex-col gap-6 animate-in fade-in duration-300">
            
            {/* Order Header Summary */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0EAE0] pb-4">
              <div>
                <span className="text-xs font-semibold text-[#887F74] uppercase tracking-wider">
                  {t('orderIdLabel')}:
                </span>
                <span className="text-lg font-bold text-[#962D3E] font-mono ml-2">
                  {order.id}
                </span>
                <p className="text-xs text-[#7A7165] mt-0.5">
                  {language === 'bn' ? 'গ্রাহক:' : 'Customer:'} {order.customerName} ({order.phone})
                </p>
              </div>

              <div className="sm:text-right">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#EAF8EE] text-[#1E7E34] border border-[#BDE8C6]">
                  {order.status === 'delivered'
                    ? 'ডেলিভারি সম্পন্ন'
                    : order.status === 'shipped'
                    ? 'কুরিয়ারে হস্তান্তর করা হয়েছে'
                    : order.status === 'processing'
                    ? 'প্যাকিং চলছে'
                    : 'অর্ডার প্রক্রিয়াধীন'}
                </span>
                <p className="text-[11px] text-[#7A7165] mt-1">
                  {language === 'bn' ? 'সম্ভাব্য পৌঁছানোর তারিখ:' : 'Est. Delivery:'}{' '}
                  <strong>{order.estimatedDelivery}</strong>
                </p>
              </div>
            </div>

            {/* Stepper Timeline */}
            <div>
              <h3 className="text-xs font-bold text-[#4A433A] uppercase tracking-wider mb-6">
                {t('orderTimeline')}
              </h3>

              <div className="relative flex flex-col gap-6 pl-4 border-l-2 border-[#E8E1D5] ml-3">
                {steps.map((step) => {
                  const state = getStepStatus(step.key, order.status);
                  const Icon = step.icon;

                  return (
                    <div key={step.key} className="relative flex items-start gap-4">
                      {/* Step Circle Indicator */}
                      <div
                        className={`absolute -left-[25px] top-0 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                          state === 'completed'
                            ? 'bg-[#2E7D32] border-[#2E7D32] text-white'
                            : state === 'current'
                            ? 'bg-[#962D3E] border-[#962D3E] text-white ring-4 ring-[#962D3E]/20'
                            : 'bg-white border-[#D5CCC0] text-[#9E9589]'
                        }`}
                      >
                        {state === 'completed' ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <Icon className="w-3.5 h-3.5" />
                        )}
                      </div>

                      <div className="flex-1 -mt-0.5">
                        <p
                          className={`text-xs sm:text-sm font-bold ${
                            state === 'upcoming' ? 'text-[#8E867B]' : 'text-[#1E1E1E]'
                          }`}
                        >
                          {language === 'bn' ? step.labelBn : step.labelEn}
                        </p>
                        
                        {/* History notes if any */}
                        {order.statusHistory?.map((h, i) => {
                          if (h.status === step.key) {
                            return (
                              <div key={i} className="mt-1 text-xs text-[#6B6357] bg-[#FAF7F2] p-2.5 rounded-lg border border-[#EDE5D8]">
                                <p className="font-medium">{language === 'bn' ? h.noteBn : h.noteEn}</p>
                                <span className="text-[10px] text-[#968E82] mt-0.5 block">{h.timestamp}</span>
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Items & Shipping Address */}
            <div className="pt-4 border-t border-[#F0EAE0] grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#524B41]">
              <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E7E0D3]">
                <p className="font-bold text-[#1E1E1E] mb-2">
                  {language === 'bn' ? 'ডেলিভারি ঠিকানা' : 'Shipping Destination'}
                </p>
                <p>{order.address}</p>
                <p className="font-semibold text-[#962D3E] mt-1">{order.district}</p>
              </div>

              <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E7E0D3]">
                <p className="font-bold text-[#1E1E1E] mb-2">
                  {language === 'bn' ? 'পেমেন্ট সারাংশ' : 'Payment Summary'}
                </p>
                <div className="flex justify-between py-0.5">
                  <span>{t('subtotal')}</span>
                  <span className="font-semibold tabular-nums">{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span>{t('deliveryFee')}</span>
                  <span className="font-semibold tabular-nums">{formatPrice(order.deliveryCharge)}</span>
                </div>
                <div className="flex justify-between py-1 border-t border-[#E8E1D5] font-bold text-[#1E1E1E]">
                  <span>{t('total')}</span>
                  <span className="text-[#962D3E] tabular-nums">{formatPrice(order.totalAmount)}</span>
                </div>
                <p className="text-[11px] text-[#7A7165] mt-1">
                  পদ্ধতি: <strong>{order.paymentMethod.toUpperCase()}</strong>
                </p>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
