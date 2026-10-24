import React, { useState } from 'react';
import { Search, Package, Truck, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { storeService } from '../services/storeService';
import { Order } from '../types';

export const TrackOrder: React.FC = () => {
  const { language } = useLanguage();
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim() || !phone.trim()) return;

    setLoading(true);
    setError('');
    try {
      const foundOrder = await storeService.trackOrder(orderId.trim(), phone.trim());
      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        setOrder(null);
        setError(language === 'bn' ? 'সঠিক অর্ডার আইডি বা মোবাইল নম্বর পাওয়া যায়নি।' : 'Order not found with given ID and phone.');
      }
      setSearched(true);
    } catch (err) {
      setError(language === 'bn' ? 'ট্র্যাকিং করার সময় সমস্যা হয়েছে।' : 'Error tracking order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 md:py-16 bg-[#0c100e] text-slate-100 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            {language === 'bn' ? 'আপনার অর্ডার ট্র্যাক করুন' : 'Track Your Order'}
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            {language === 'bn' ? 'আপনার অর্ডার আইডি এবং মোবাইল নম্বর দিয়ে বর্তমান অবস্থান জানুন' : 'Enter your order ID and phone number to check status'}
          </p>
        </div>

        {/* Search Card */}
        <div className="bg-[#151c18] p-6 sm:p-8 rounded-2xl border border-amber-500/20 shadow-xl mb-8">
          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {language === 'bn' ? 'অর্ডার আইডি লিখুন' : 'Order ID'}
              </label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder={language === 'bn' ? 'যেমন: XOR-102938' : 'e.g. XOR-102938'}
                required
                className="w-full px-4 py-2.5 bg-[#0c100e] border border-amber-500/30 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {language === 'bn' ? 'অর্ডারে ব্যবহৃত মোবাইল নম্বর' : 'Phone Number'}
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="017xxxxxxxx"
                required
                className="w-full px-4 py-2.5 bg-[#0c100e] border border-amber-500/30 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-bold rounded-xl transition shadow-md flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>{language === 'bn' ? 'ট্র্যাক করুন' : 'Track'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Results Section */}
        {searched && (
          <div className="bg-[#151c18] p-6 sm:p-8 rounded-2xl border border-amber-500/20 shadow-xl">
            {loading ? (
              <div className="text-center py-8 text-slate-400 animate-pulse text-xs">
                {language === 'bn' ? 'তথ্য খোঁজা হচ্ছে...' : 'Searching order...'}
              </div>
            ) : error ? (
              <div className="flex items-center gap-3 p-4 bg-rose-950/40 border border-rose-500/30 text-rose-300 rounded-xl text-xs">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            ) : order ? (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row justify-between pb-4 border-b border-amber-500/10 gap-2">
                  <div>
                    <span className="text-xs text-slate-400">{language === 'bn' ? 'অর্ডার আইডি:' : 'Order ID:'}</span>
                    <h3 className="text-base font-bold text-white">{order.id}</h3>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400">{language === 'bn' ? 'স্ট্যাটাস:' : 'Status:'}</span>
                    <span className="inline-block px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-semibold ml-2">
                      {order.status}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                    {language === 'bn' ? 'অর্ডারের বিবরণ' : 'Order Details'}
                  </h4>
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-xs text-slate-300 bg-[#0c100e] p-3 rounded-xl border border-amber-500/10">
                        <span>{language === 'bn' ? item.nameBn : item.nameEn} (x{item.quantity})</span>
                        <span className="font-bold text-amber-400">৳{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-amber-500/10 flex justify-between items-center text-sm font-bold text-white">
                  <span>{language === 'bn' ? 'মোট মূল্য:' : 'Total:'}</span>
                  <span className="text-amber-400">৳{order.totalAmount}</span>
                </div>
              </div>
            ) : null}
          </div>
        )}

      </div>
    </div>
  );
};
