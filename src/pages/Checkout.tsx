import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Truck, ArrowLeft, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { storeService } from '../services/storeService';
import { useSettings } from '../hooks/useSettings';
import { BANGLADESH_DISTRICTS } from '../lib/constants';

export const Checkout: React.FC = () => {
  const { cart = [], totalAmount = 0, clearCart } = useCart();
  const { formatPrice = (v: number) => `৳ ${v}` } = useLanguage();
  const settings = useSettings() || {};
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    district: 'Dhaka',
    notes: '',
    paymentMethod: 'cod' as 'cod' | 'bkash' | 'nagad',
  });

  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen bg-rose-50/20 py-16 px-4 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-sm border border-rose-100">
          <ShoppingBag className="w-16 h-16 text-rose-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Apnar cart khali!</h2>
          <p className="text-sm text-slate-600 mb-6">Checkout korte prothome bag cart-e jog korun.</p>
          <Link to="/shop" className="inline-block px-6 py-3 bg-rose-950 text-amber-300 font-semibold rounded-xl text-sm">
            Shop-e jaan
          </Link>
        </div>
      </div>
    );
  }

  const shippingFee =
    formData.district === 'Dhaka'
      ? (settings.shippingFeeInsideDhaka ?? 70)
      : (settings.shippingFeeOutsideDhaka ?? 130);

  const freeDeliveryThreshold = settings.freeShippingThreshold ?? 2000;
  const finalShippingFee = totalAmount >= freeDeliveryThreshold ? 0 : shippingFee;
  const grandTotal = totalAmount + finalShippingFee;

  const districtsList = BANGLADESH_DISTRICTS || ['Dhaka', 'Chattogram', 'Sylhet', 'Rajshahi', 'Khulna', 'Barishal', 'Rangpur', 'Mymensingh'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setError('Anugraho kore naam, phone nombor o sompurno thikana din.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const orderData = {
        items: cart.map((item) => ({
          product: item.product,
          quantity: item.quantity,
        })),
        customerInfo: {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          district: formData.district,
          notes: formData.notes.trim(),
        },
        paymentMethod: formData.paymentMethod,
        subtotal: totalAmount,
        shippingFee: finalShippingFee,
        totalAmount: grandTotal,
      };

      const createdOrder = await storeService.createOrder(orderData);

      if (createdOrder) {
        clearCart();
        navigate('/order-success', { state: { order: createdOrder } });
      } else {
        setError('Order-ti save kora jayni. Abar chesta korun.');
      }
    } catch (err) {
      console.error('Checkout Error:', err);
      setError('Order somponno korte somosha hoyeche. Abar chesta korun.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-rose-50/20 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <Link to="/cart" className="inline-flex items-center gap-2 text-xs font-semibold text-rose-950 mb-6 hover:text-rose-700">
          <ArrowLeft className="w-4 h-4" /> Cart-e phire jaan
        </Link>

        <h1 className="text-2xl font-serif font-bold text-rose-950 mb-8">Checkout - Order Form</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-rose-100 space-y-5">
            <h2 className="text-lg font-bold text-slate-800 border-b border-rose-100 pb-3">Delivery Tottho</h2>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Apnar Naam *</label>
              <input
                type="text"
                required
                placeholder="Apnar purno naam"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-900 outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Nombor *</label>
              <input
                type="tel"
                required
                placeholder="01XXXXXXXXX"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-900 outline-none text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Zela *</label>
                <select
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full px-4 py-2.5 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-900 outline-none text-sm bg-white"
                >
                  {districtsList.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Charge</label>
                <div className="px-4 py-2.5 border border-slate-100 bg-slate-50 rounded-xl text-sm font-semibold text-rose-950">
                  {finalShippingFee === 0 ? 'Free Delivery!' : formatPrice(finalShippingFee)}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Purnango Thikana *</label>
              <textarea
                required
                rows={3}
                placeholder="Bari/holding nombor, road, elaka/thana"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2.5 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-900 outline-none text-sm resize-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Special Instruction (Oichhik)</label>
              <input
                type="text"
                placeholder="Jemon: Bikel-e delivery din"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-2.5 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-900 outline-none text-sm"
              />
            </div>

            <div className="pt-4 border-t border-rose-100">
              <label className="block text-xs font-bold text-slate-700 mb-3">Payment Method Posondo Korun</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                  className={`p-3 border text-center rounded-xl text-xs font-bold transition-all ${
                    formData.paymentMethod === 'cod'
                      ? 'border-rose-950 bg-rose-950 text-amber-300 shadow-sm'
                      : 'border-slate-200 hover:border-rose-300 text-slate-700'
                  }`}
                >
                  Cash on Delivery
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'bkash' })}
                  className={`p-3 border text-center rounded-xl text-xs font-bold transition-all ${
                    formData.paymentMethod === 'bkash'
                      ? 'border-pink-600 bg-pink-600 text-white shadow-sm'
                      : 'border-slate-200 hover:border-pink-300 text-slate-700'
                  }`}
                >
                  bKash
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'nagad' })}
                  className={`p-3 border text-center rounded-xl text-xs font-bold transition-all ${
                    formData.paymentMethod === 'nagad'
                      ? 'border-orange-600 bg-orange-600 text-white shadow-sm'
                      : 'border-slate-200 hover:border-orange-300 text-slate-700'
                  }`}
                >
                  Nagad
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 text-rose-800 text-xs rounded-xl flex items-center gap-2 border border-rose-200">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-rose-100 space-y-4">
              <h2 className="text-lg font-bold text-slate-800 border-b border-rose-100 pb-3">Order Summary</h2>

              <div className="max-h-60 overflow-y-auto divide-y divide-rose-50 pr-1">
                {cart.map((item) => (
                  <div key={item.product.id} className="py-3 flex items-center justify-between gap-3">
                    <img src={item.product.images?.[0]} alt={item.product.name} className="w-12 h-12 object-cover rounded-lg border border-slate-100" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">{item.product.name}</p>
                      <p className="text-[11px] text-slate-500">{formatPrice(item.product.price)} × {item.quantity}</p>
                    </div>
                    <span className="text-xs font-bold text-rose-950">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-rose-100 pt-3 space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Ponyer mot dam:</span>
                  <span className="font-semibold text-slate-800">{formatPrice(totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery charge:</span>
                  <span className="font-semibold text-slate-800">
                    {finalShippingFee === 0 ? 'Free!' : formatPrice(finalShippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-rose-950 border-t border-rose-100 pt-2 text-base">
                  <span>Sorbomot:</span>
                  <span>{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-rose-950 text-amber-300 font-bold rounded-xl hover:bg-rose-900 transition-colors shadow-md text-sm disabled:opacity-50 mt-4"
              >
                {loading ? 'Order process hocche...' : 'Order Confirm Korun'}
              </button>
            </div>

            <div className="bg-rose-900/10 p-4 rounded-xl border border-rose-200/50 text-xs text-rose-950 space-y-2">
              <p className="flex items-center gap-2 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> 100% Nirapod Kenakata
              </p>
              <p className="flex items-center gap-2 font-semibold">
                <Truck className="w-4 h-4 text-amber-600" /> Cash on Delivery subidha
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
