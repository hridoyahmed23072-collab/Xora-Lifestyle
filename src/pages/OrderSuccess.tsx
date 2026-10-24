import React, { useEffect, useState } from 'react';
import { useLocation, useParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, Home, Printer, MessageCircle, AlertCircle, Search, ArrowRight, Loader2 } from 'lucide-react';
import { Order } from '../types';
import { Invoice } from '../components/Invoice';
import { useSettings } from '../hooks/useSettings';
import { storeService } from '../services/storeService';

export const OrderSuccess: React.FC = () => {
  const location = useLocation();
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const settings = useSettings();

  const stateOrder = location.state?.order as Order | undefined;
  const [order, setOrder] = useState<Order | null>(stateOrder || null);
  const [loading, setLoading] = useState<boolean>(!stateOrder && Boolean(id));
  const [searchId, setSearchId] = useState<string>('');
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    // If order already supplied via router state, make sure state is set
    if (stateOrder) {
      setOrder(stateOrder);
      setLoading(false);
      return;
    }

    // If order ID is in URL params (/order-success/:id), fetch it from storeService
    if (id) {
      setLoading(true);
      setFetchError(null);
      storeService
        .getOrderById(id)
        .then((foundOrder) => {
          if (foundOrder) {
            setOrder(foundOrder);
          } else {
            setFetchError(`অর্ডার নং "${id}" খুঁজে পাওয়া যায়নি। অনুগ্রহ করে সঠিক আইডি দিয়ে চেষ্টা করুন।`);
          }
        })
        .catch((err) => {
          console.error('Error fetching order:', err);
          setFetchError('অর্ডার লোড করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      // If visited /order-success without params or state, check latest order from localStorage as friendly fallback
      try {
        const local = localStorage.getItem('xora_orders');
        if (local) {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.id && parsed[0].id !== 'XOR-1001') {
            setOrder(parsed[0]);
          }
        }
      } catch {}
      setLoading(false);
    }
  }, [id, stateOrder]);

  const handleManualSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    setLoading(true);
    setFetchError(null);
    try {
      const res = await storeService.getOrderById(searchId.trim());
      if (res) {
        setOrder(res);
        navigate(`/order-success/${res.id}`, { replace: true });
      } else {
        setFetchError(`"${searchId.trim()}" আইডি দিয়ে কোনো অর্ডার পাওয়া যায়নি।`);
      }
    } catch {
      setFetchError('অর্ডার খুঁজতে সমস্যা হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const whatsappNumber = settings.whatsapp || '8801711234567';
  const whatsappUrl = order
    ? `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
        `হ্যালো, আমি আমার অর্ডার সম্পর্কে জানতে চাই। অর্ডার আইডি: ${order.id}`
      )}`
    : `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] py-20 px-4 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-rose-900 animate-spin mb-4" />
        <h2 className="text-base font-bold text-slate-800">অর্ডার লোড হচ্ছে...</h2>
        <p className="text-xs text-slate-500 mt-1">অনুগ্রহ করে কয়েক সেকেন্ড অপেক্ষা করুন।</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Success Banner */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#E7E0D3] text-center print:hidden">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50">
            <CheckCircle className="w-9 h-9" />
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-rose-950 mb-2">
            ধন্যবাদ, আপনার অর্ডার সম্পন্ন হয়েছে!
          </h1>
          
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            আমরা আপনার অর্ডারটি সফলভাবে গ্রহণ করেছি। খুব শীঘ্রই আমাদের কাস্টমার কেয়ার প্রতিনিধি ফোন করে অর্ডারটি ভেরিফাই করবেন।
          </p>

          {order && (
            <div className="mt-4 inline-flex items-center gap-2 bg-[#FAF7F2] px-4 py-2 rounded-xl border border-[#E7E0D3]">
              <span className="text-xs text-slate-500">অর্ডার নম্বর:</span>
              <span className="font-mono font-bold text-rose-950 text-sm">{order.id}</span>
              <span className="text-slate-300">|</span>
              <span className="text-xs text-slate-500">
                তারিখ: {new Date(order.createdAt).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6 pt-5 border-t border-[#F0EAE0]">
            {order && (
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-950 text-amber-300 font-bold text-xs sm:text-sm rounded-xl hover:bg-rose-900 transition-all shadow-sm cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                ইনভয়েস প্রিন্ট করুন / PDF ডাউনলোড
              </button>
            )}

            <Link
              to="/track-order"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-100 text-rose-950 font-bold text-xs sm:text-sm rounded-xl hover:bg-rose-200 transition-colors"
            >
              <Package className="w-4 h-4" />
              অর্ডার ট্র্যাক করুন
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs sm:text-sm rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              হোয়াটসঅ্যাপ সহায়তা
            </a>

            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-slate-700 border border-slate-300 font-bold text-xs sm:text-sm rounded-xl hover:bg-slate-50 transition-colors"
            >
              <Home className="w-4 h-4" />
              হোমে ফিরে যান
            </Link>
          </div>
        </div>

        {/* Fallback Search if order wasn't found */}
        {!order && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#E7E0D3] text-center">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-slate-800 mb-1">অর্ডারের তথ্য খুঁজুন</h2>
            <p className="text-xs text-slate-600 mb-6">
              আপনার কাছে থাকা অর্ডার আইডি প্রদান করে ইনভয়েস দেখুন।
            </p>

            <form onSubmit={handleManualSearch} className="max-w-md mx-auto flex gap-2">
              <input
                type="text"
                placeholder="যেমন: XOR-123456"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="flex-1 px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-900 bg-white text-slate-900"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-rose-950 text-white text-xs font-bold rounded-xl hover:bg-rose-900 transition-colors inline-flex items-center gap-1.5"
              >
                <Search className="w-4 h-4" />
                <span>খুঁজুন</span>
              </button>
            </form>

            {fetchError && (
              <p className="text-xs text-rose-600 mt-3 font-semibold">{fetchError}</p>
            )}

            <div className="mt-6 pt-4 border-t border-slate-100">
              <Link to="/track-order" className="text-xs text-rose-900 font-bold inline-flex items-center gap-1 hover:underline">
                ট্র্যাকিং পেজে যান <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* Invoice Printable View */}
        {order && (
          <div className="shadow-sm rounded-2xl overflow-hidden">
            <Invoice order={order} />
          </div>
        )}

      </div>
    </div>
  );
};
