import React, { useState } from 'react';
import { Search, Package, Clock, CheckCircle, Truck, AlertCircle, Printer } from 'lucide-react';
import { storeService } from '../services/storeService';
import { Order } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Invoice } from '../components/Invoice';

export const TrackOrder: React.FC = () => {
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { formatPrice } = useLanguage();

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setLoading(true);
    setError(null);
    setOrder(null);
    try {
      const result = await storeService.getOrderById(orderId.trim());
      if (result) {
        const orderPhone = (result.phone || result.customerInfo?.phone || '').replace(/[^0-9]/g, '');
        const checkPhone = phone.trim().replace(/[^0-9]/g, '');

        if (checkPhone && orderPhone && !orderPhone.includes(checkPhone) && !checkPhone.includes(orderPhone)) {
          setError('প্রদত্ত ফোন নম্বরের সাথে অর্ডারের তথ্য মিলছে না।');
        } else {
          setOrder(result);
        }
      } else {
        setError('এই আইডি দিয়ে কোনো অর্ডার পাওয়া যায়নি। অনুগ্রহ করে সঠিক অর্ডার আইডি দিন।');
      }
    } catch (err) {
      setError('অর্ডার ট্র্যাক করতে সমস্যা হয়েছে। পরে চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-rose-50/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Track Form */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-rose-100 print:hidden">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-serif font-bold text-rose-950">আপনার অর্ডার ট্র্যাক করুন</h1>
            <p className="text-xs text-slate-500 mt-1">অর্ডার আইডি (যেমন: XOR-123456) ব্যবহার করে অর্ডারের অবস্থা জানুন</p>
          </div>

          <form onSubmit={handleTrack} className="space-y-4 max-w-md mx-auto">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">অর্ডার আইডি *</label>
              <input
                type="text"
                required
                placeholder="XOR-123456"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full px-4 py-2.5 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-900 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">ফোন নম্বর (ঐচ্ছিক)</label>
              <input
                type="tel"
                placeholder="01700000000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-900 outline-none text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-rose-950 text-amber-300 font-semibold rounded-xl hover:bg-rose-900 transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {loading ? 'খোঁজা হচ্ছে...' : <><Search className="w-4 h-4" /> ট্র্যাক করুন</>}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-rose-50 text-rose-800 text-xs rounded-xl flex items-center gap-2 max-w-md mx-auto">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Order Details & Invoice */}
        {order && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-rose-100 flex justify-between items-center print:hidden">
              <div>
                <h3 className="font-bold text-slate-900">অর্ডার স্থিতি: <span className="text-amber-700 uppercase">{order.status}</span></h3>
                <p className="text-xs text-slate-500">আইডি: {order.id}</p>
              </div>
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-4 py-2 bg-rose-950 text-amber-300 font-medium text-xs rounded-xl hover:bg-rose-900 transition-colors"
              >
                <Printer className="w-4 h-4" />
                ইনভয়েস প্রিন্ট করুন
              </button>
            </div>

            <Invoice order={order} />
          </div>
        )}

      </div>
    </div>
  );
};
