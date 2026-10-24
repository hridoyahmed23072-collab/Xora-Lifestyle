import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Truck, ArrowLeft, AlertCircle, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { storeService } from '../services/storeService';
import { useSettings } from '../hooks/useSettings';
import {
  BANGLADESH_LOCATIONS,
  getUpazilasForDistrict,
  isDistrictInsideDhaka,
} from '../lib/bangladeshLocations';
import { OrderItem } from '../types';

export const Checkout: React.FC = () => {
  const { cart = [], subtotal = 0, clearCart } = useCart();
  const { formatPrice = (v: number) => `৳ ${v}` } = useLanguage();
  const settings = useSettings() || {};
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    district: 'ঢাকা',
    upazila: 'ধানমন্ডি',
    notes: '',
    paymentMethod: 'cod' as 'cod' | 'bkash' | 'nagad',
  });

  // Calculate available upazilas dynamically whenever district changes
  const availableUpazilas = useMemo(() => {
    return getUpazilasForDistrict(formData.district);
  }, [formData.district]);

  // Handle District Change & Reset Upazila
  const handleDistrictChange = (selectedDistrict: string) => {
    const upazilas = getUpazilasForDistrict(selectedDistrict);
    setFormData((prev) => ({
      ...prev,
      district: selectedDistrict,
      upazila: upazilas.length > 0 ? upazilas[0].nameBn : '',
    }));
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen bg-rose-50/20 py-16 px-4 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-sm border border-rose-100">
          <ShoppingBag className="w-16 h-16 text-rose-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">আপনার কার্ট খালি!</h2>
          <p className="text-sm text-slate-600 mb-6">চেকআউট করতে প্রথমে পণ্য কার্টে যুক্ত করুন।</p>
          <Link
            to="/shop"
            className="inline-block px-6 py-3 bg-rose-950 text-amber-300 font-semibold rounded-xl text-sm hover:bg-rose-900 transition-colors"
          >
            শপে যান
          </Link>
        </div>
      </div>
    );
  }

  // Delivery Charge Calculation: 80 Inside Dhaka, 150 Outside Dhaka
  const isDhaka = isDistrictInsideDhaka(formData.district);
  const insideDhakaFee = settings.insideDhakaCharge ?? 80;
  const outsideDhakaFee = settings.outsideDhakaCharge ?? 150;
  const deliveryCharge = isDhaka ? insideDhakaFee : outsideDhakaFee;
  const grandTotal = subtotal + deliveryCharge;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError('অনুগ্রহ করে আপনার নাম প্রদান করুন।');
      return;
    }
    if (!formData.phone.trim()) {
      setError('অনুগ্রহ করে আপনার মোবাইল নম্বর প্রদান করুন।');
      return;
    }
    if (!formData.district.trim()) {
      setError('অনুগ্রহ করে আপনার জেলা নির্বাচন করুন।');
      return;
    }
    if (!formData.upazila.trim()) {
      setError('অনুগ্রহ করে আপনার উপজেলা বা থানা নির্বাচন করুন।');
      return;
    }
    if (!formData.address.trim()) {
      setError('অনুগ্রহ করে পূর্ণাঙ্গ ঠিকানা প্রদান করুন।');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const orderItems: OrderItem[] = cart.map((item) => ({
        productId: item.productId,
        nameBn: item.nameBn || item.nameEn || 'ব্যাগ',
        nameEn: item.nameEn || item.nameBn || 'Bag',
        price: item.price,
        image: item.image,
        selectedColor: item.selectedColor || null,
        selectedSize: item.selectedSize || null,
        quantity: item.quantity,
        totalPrice: item.price * item.quantity,
        product: {
          id: item.productId,
          name: item.nameBn || item.nameEn || 'Bag',
          price: item.price,
          images: [item.image],
        },
      }));

      const orderData = {
        customerName: formData.name.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        district: formData.district,
        upazila: formData.upazila,
        deliveryZone: isDhaka ? ('inside_dhaka' as const) : ('outside_dhaka' as const),
        deliveryCharge: deliveryCharge,
        shippingFee: deliveryCharge,
        subtotal: subtotal,
        totalAmount: grandTotal,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes.trim() || undefined,
        items: orderItems,
      };

      const createdOrder = await storeService.createOrder(orderData);

      if (createdOrder) {
        clearCart();
        navigate('/order-success', { state: { order: createdOrder } });
      } else {
        setError('অর্ডারটি সেভ করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।');
      }
    } catch (err) {
      console.error('Checkout Error:', err);
      setError('অর্ডার সম্পন্ন করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-xs font-semibold text-rose-950 mb-6 hover:text-rose-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> কার্টে ফিরে যান
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-rose-950">
            চেকআউট - দ্রুত অর্ডার ফরম
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            সঠিক তথ্য দিয়ে ফর্মটি পূরণ করুন। আমাদের প্রতিনিধি ফোন করে অর্ডারটি নিশ্চিত করবেন।
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Customer & Shipping Details (Left Col) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-[#E7E0D3] space-y-5">
            <div className="flex items-center gap-2 border-b border-[#F0EAE0] pb-3">
              <MapPin className="w-5 h-5 text-rose-900" />
              <h2 className="text-lg font-bold text-slate-800">ডেলিভারি তথ্য</h2>
            </div>

            {/* Customer Name */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                আপনার নাম <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="যেমন: মো: আরিফুল ইসলাম"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-900 focus:border-rose-900 outline-none text-sm text-slate-900 placeholder:text-slate-400"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                মোবাইল নম্বর <span className="text-rose-600">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="যেমন: 01712345678"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-900 focus:border-rose-900 outline-none text-sm text-slate-900 placeholder:text-slate-400"
              />
            </div>

            {/* District & Upazila Cascading Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* District Dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  জেলা <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.district}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-900 focus:border-rose-900 outline-none text-sm text-slate-900 font-semibold cursor-pointer shadow-sm"
                    style={{ backgroundColor: '#ffffff', color: '#0f172a' }}
                  >
                    {BANGLADESH_LOCATIONS.map((dist) => (
                      <option
                        key={dist.id}
                        value={dist.nameBn}
                        className="bg-white text-slate-900 font-medium py-1"
                        style={{ backgroundColor: '#ffffff', color: '#0f172a' }}
                      >
                        {dist.nameBn} ({dist.nameEn})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Upazila Dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  উপজেলা / থানা <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.upazila}
                    onChange={(e) => setFormData({ ...formData, upazila: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-900 focus:border-rose-900 outline-none text-sm text-slate-900 font-semibold cursor-pointer shadow-sm"
                    style={{ backgroundColor: '#ffffff', color: '#0f172a' }}
                  >
                    {availableUpazilas.length === 0 ? (
                      <option value="" className="bg-white text-slate-500">
                        প্রথমে জেলা বেছে নিন
                      </option>
                    ) : (
                      availableUpazilas.map((upa) => (
                        <option
                          key={upa.id}
                          value={upa.nameBn}
                          className="bg-white text-slate-900 font-medium py-1"
                          style={{ backgroundColor: '#ffffff', color: '#0f172a' }}
                        >
                          {upa.nameBn} ({upa.nameEn})
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>
            </div>

            {/* Delivery Charge Display Box */}
            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-amber-700" />
                ডেলিভারি চার্জ ({isDhaka ? 'ঢাকার ভেতরে' : 'ঢাকার বাইরে'}):
              </span>
              <span className="font-bold text-sm text-rose-950">
                {formatPrice(deliveryCharge)}
              </span>
            </div>

            {/* Detailed Address */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                পূর্ণাঙ্গ ঠিকানা (বাসা/রোড/এলাকা) <span className="text-rose-600">*</span>
              </label>
              <textarea
                required
                rows={3}
                placeholder="যেমন: বাড়ি ১২, রোড ৭, সেক্টর ৪ অথবা গ্রাম ও পোস্ট অফিস"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-900 focus:border-rose-900 outline-none text-sm text-slate-900 placeholder:text-slate-400 resize-none"
              ></textarea>
            </div>

            {/* Optional Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                বিশেষ কোনো নির্দেশনা (ঐচ্ছিক)
              </label>
              <input
                type="text"
                placeholder="যেমন: বিকেল ৪টার পর ডেলিভারি দিন"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-900 focus:border-rose-900 outline-none text-sm text-slate-900 placeholder:text-slate-400"
              />
            </div>

            {/* Payment Method */}
            <div className="pt-4 border-t border-[#F0EAE0]">
              <label className="block text-xs font-bold text-slate-800 mb-3">
                পেমেন্ট মেথড পছন্দ করুন
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                  className={`p-3 border text-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    formData.paymentMethod === 'cod'
                      ? 'border-rose-950 bg-rose-950 text-amber-300 shadow-sm'
                      : 'border-slate-300 hover:border-rose-300 text-slate-700 bg-white'
                  }`}
                >
                  ক্যাশ অন ডেলিভারি
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'bkash' })}
                  className={`p-3 border text-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    formData.paymentMethod === 'bkash'
                      ? 'border-pink-600 bg-pink-600 text-white shadow-sm'
                      : 'border-slate-300 hover:border-pink-300 text-slate-700 bg-white'
                  }`}
                >
                  বিকাশ (bKash)
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'nagad' })}
                  className={`p-3 border text-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    formData.paymentMethod === 'nagad'
                      ? 'border-orange-600 bg-orange-600 text-white shadow-sm'
                      : 'border-slate-300 hover:border-orange-300 text-slate-700 bg-white'
                  }`}
                >
                  নগদ (Nagad)
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3.5 bg-rose-50 text-rose-800 text-xs rounded-xl flex items-center gap-2 border border-rose-200">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Order Summary (Right Col) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E7E0D3] space-y-4">
              <h2 className="text-lg font-bold text-slate-800 border-b border-[#F0EAE0] pb-3">
                অর্ডার সারাংশ
              </h2>

              <div className="max-h-64 overflow-y-auto divide-y divide-rose-50 pr-1">
                {cart.map((item, idx) => {
                  const itemName = item.nameBn || item.nameEn || item.product?.name || 'ব্যাগ';
                  const itemImage = item.image || item.product?.images?.[0] || '';
                  const itemPrice = item.price || item.product?.price || 0;

                  return (
                    <div
                      key={`${item.productId}-${idx}`}
                      className="py-3 flex items-center justify-between gap-3"
                    >
                      {itemImage ? (
                        <img
                          src={itemImage}
                          alt={itemName}
                          className="w-12 h-12 object-cover rounded-lg border border-slate-100 shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-rose-50 rounded-lg flex items-center justify-center shrink-0 text-rose-300">
                          <ShoppingBag className="w-6 h-6" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate">{itemName}</p>
                        {item.selectedColor && (
                          <p className="text-[10px] text-slate-500">কালার: {item.selectedColor}</p>
                        )}
                        <p className="text-[11px] text-slate-500">
                          {formatPrice(itemPrice)} × {item.quantity}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-rose-950">
                        {formatPrice(itemPrice * item.quantity)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-[#F0EAE0] pt-3 space-y-2.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>পণ্যের মোট দাম:</span>
                  <span className="font-semibold text-slate-800">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>
                    ডেলিভারি চার্জ ({isDhaka ? 'ঢাকা' : 'ঢাকার বাইরে'}):
                  </span>
                  <span className="font-semibold text-slate-800">
                    {formatPrice(deliveryCharge)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-rose-950 border-t border-[#F0EAE0] pt-3">
                  <span>সর্বমোট:</span>
                  <span>{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-rose-950 text-amber-300 font-bold rounded-xl hover:bg-rose-900 transition-colors shadow-md text-sm disabled:opacity-50 mt-4 cursor-pointer"
              >
                {loading ? 'অর্ডার প্রসেস হচ্ছে...' : 'অর্ডার কনফার্ম করুন'}
              </button>
            </div>

            <div className="bg-rose-900/10 p-4 rounded-xl border border-rose-200/50 text-xs text-rose-950 space-y-2">
              <p className="flex items-center gap-2 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> ১০০% নিরাপদ কেনাকাটা
              </p>
              <p className="flex items-center gap-2 font-semibold">
                <Truck className="w-4 h-4 text-amber-600" /> সারা বাংলাদেশে হোম ডেলিভারি ও ক্যাশ অন ডেলিভারি
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
