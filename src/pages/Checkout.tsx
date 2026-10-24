import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Truck, ArrowLeft, AlertCircle, MapPin, Copy, Check, Info } from 'lucide-react';
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
  const [copied, setCopied] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    district: 'ঢাকা',
    upazila: 'ধানমন্ডি',
    notes: '',
    paymentMethod: 'cod' as 'cod' | 'bkash' | 'nagad',
    paymentNumber: '',
    trxId: '',
  });

  const handleCopy = (text: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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

    if (formData.paymentMethod === 'bkash' || formData.paymentMethod === 'nagad') {
      const methodName = formData.paymentMethod === 'bkash' ? 'বিকাশ' : 'নগদ';
      const cleanPayNum = formData.paymentNumber.trim();
      const cleanTrx = formData.trxId.trim();

      if (!cleanPayNum) {
        setError(`অনুগ্রহ করে যে নম্বর থেকে টাকা পাঠিয়েছেন সেই ১১ ডিজিটের ${methodName} নম্বরটি দিন।`);
        return;
      }

      const bdPhoneRegex = /^01[3-9]\d{8}$/;
      if (!bdPhoneRegex.test(cleanPayNum)) {
        setError(`অনুগ্রহ করে সঠিক ১১ ডিজিটের ${methodName} নম্বর প্রদান করুন (01 দিয়ে শুরু, যেমন: 017XXXXXXXX)।`);
        return;
      }

      if (!cleanTrx) {
        setError('অনুগ্রহ করে Transaction ID (TrxID) প্রদান করুন।');
        return;
      }

      if (cleanTrx.length < 4) {
        setError('অনুগ্রহ করে সঠিক Transaction ID (কমপক্ষে ৪ অক্ষর) প্রদান করুন।');
        return;
      }
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
        paymentNumber: formData.paymentMethod === 'cod' ? undefined : formData.paymentNumber.trim(),
        trxId: formData.paymentMethod === 'cod' ? undefined : formData.trxId.trim().toUpperCase(),
        notes: formData.notes.trim() || undefined,
        items: orderItems,
      };

      const createdOrder = await storeService.createOrder(orderData);

      if (createdOrder) {
        clearCart();
        navigate(`/order-success/${createdOrder.id}`, { state: { order: createdOrder } });
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

              {/* bKash & Nagad Payment Information Box */}
              {formData.paymentMethod !== 'cod' && (
                <div className="mt-4 p-4 sm:p-5 rounded-2xl border transition-all animate-in fade-in duration-200 bg-white shadow-xs border-slate-300">
                  {formData.paymentMethod === 'bkash' ? (
                    <div className="space-y-4">
                      {/* bKash Header & Target Number */}
                      <div className="bg-pink-50 p-4 rounded-xl border border-pink-200">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-pink-600 text-white font-bold text-xs rounded-lg uppercase">
                            বিকাশ (bKash) পেমেন্ট
                          </span>
                          <span className="text-xs font-bold text-pink-900 bg-white px-2.5 py-1 rounded-md border border-pink-200">
                            মোট প্রদেয়: ৳ {grandTotal}
                          </span>
                        </div>

                        <p className="text-xs text-slate-700 mb-1.5 font-medium">
                          টাকা পাঠানোর জন্য আমাদের বিকাশ নম্বর:
                        </p>
                        <div className="flex items-center justify-between bg-white px-3.5 py-2.5 rounded-xl border border-pink-300 shadow-xs">
                          <span className="font-mono font-bold text-base text-pink-700 tracking-wider">
                            {settings.bkashNumber || '01711234567'}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(settings.bkashNumber || '01711234567')}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-pink-100 hover:bg-pink-200 text-pink-800 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                          >
                            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copied ? 'কপি হয়েছে' : 'কপি করুন'}</span>
                          </button>
                        </div>

                        <div className="mt-3 bg-pink-100/70 p-2.5 rounded-lg text-[11px] text-pink-950 space-y-1 border border-pink-200/60">
                          <p className="font-bold flex items-center gap-1 text-pink-900">
                            <Info className="w-3.5 h-3.5 shrink-0 text-pink-700" /> কীভাবে Send Money করবেন:
                          </p>
                          <ol className="list-decimal list-inside space-y-0.5 text-slate-800 pl-1 font-medium">
                            <li>আপনার বিকাশ অ্যাপে যান অথবা *247# ডায়াল করুন।</li>
                            <li><strong>Send Money</strong> অপশন নির্বাচন করে উপরের নম্বরে <strong>৳ {grandTotal}</strong> পাঠান।</li>
                            <li>সফলভাবে টাকা পাঠানোর পর নিচের ঘরে প্রেরক নম্বর ও TrxID লিখুন।</li>
                          </ol>
                        </div>
                      </div>

                      {/* bKash Input Fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-800 mb-1">
                            আপনার বিকাশ নম্বর (যেটি থেকে পাঠিয়েছেন) <span className="text-rose-600">*</span>
                          </label>
                          <input
                            type="tel"
                            required
                            maxLength={11}
                            placeholder="01XXXXXXXXX"
                            value={formData.paymentNumber}
                            onChange={(e) => setFormData({ ...formData, paymentNumber: e.target.value.replace(/[^0-9]/g, '') })}
                            className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-pink-600 focus:border-pink-600 outline-none text-sm text-slate-900 font-mono placeholder:text-slate-400"
                          />
                          <span className="text-[10px] text-slate-500 mt-0.5 block">১১ ডিজিটের মোবাইল নম্বর (01 দিয়ে শুরু)</span>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-800 mb-1">
                            Transaction ID (TrxID) <span className="text-rose-600">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="যেমন: 9J3K8L2P"
                            value={formData.trxId}
                            onChange={(e) => setFormData({ ...formData, trxId: e.target.value.toUpperCase() })}
                            className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-pink-600 focus:border-pink-600 outline-none text-sm text-slate-900 font-mono uppercase placeholder:text-slate-400"
                          />
                          <span className="text-[10px] text-slate-500 mt-0.5 block">টাকা পাঠানোর পর বিকাশ কনফার্মেশন মেসেজের TrxID</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Nagad Header & Target Number */}
                      <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-orange-600 text-white font-bold text-xs rounded-lg uppercase">
                            নগদ (Nagad) পেমেন্ট
                          </span>
                          <span className="text-xs font-bold text-orange-950 bg-white px-2.5 py-1 rounded-md border border-orange-200">
                            মোট প্রদেয়: ৳ {grandTotal}
                          </span>
                        </div>

                        <p className="text-xs text-slate-700 mb-1.5 font-medium">
                          টাকা পাঠানোর জন্য আমাদের নগদ নম্বর:
                        </p>
                        <div className="flex items-center justify-between bg-white px-3.5 py-2.5 rounded-xl border border-orange-300 shadow-xs">
                          <span className="font-mono font-bold text-base text-orange-700 tracking-wider">
                            {settings.nagadNumber || '01711234567'}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(settings.nagadNumber || '01711234567')}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 hover:bg-orange-200 text-orange-800 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                          >
                            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copied ? 'কপি হয়েছে' : 'কপি করুন'}</span>
                          </button>
                        </div>

                        <div className="mt-3 bg-orange-100/70 p-2.5 rounded-lg text-[11px] text-orange-950 space-y-1 border border-orange-200/60">
                          <p className="font-bold flex items-center gap-1 text-orange-900">
                            <Info className="w-3.5 h-3.5 shrink-0 text-orange-700" /> কীভাবে Send Money করবেন:
                          </p>
                          <ol className="list-decimal list-inside space-y-0.5 text-slate-800 pl-1 font-medium">
                            <li>আপনার নগদ অ্যাপে যান অথবা *167# ডায়াল করুন।</li>
                            <li><strong>Send Money</strong> অপশন নির্বাচন করে উপরের নম্বরে <strong>৳ {grandTotal}</strong> পাঠান।</li>
                            <li>সফলভাবে টাকা পাঠানোর পর নিচের ঘরে প্রেরক নম্বর ও TrxID লিখুন।</li>
                          </ol>
                        </div>
                      </div>

                      {/* Nagad Input Fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-800 mb-1">
                            আপনার নগদ নম্বর (যেটি থেকে পাঠিয়েছেন) <span className="text-rose-600">*</span>
                          </label>
                          <input
                            type="tel"
                            required
                            maxLength={11}
                            placeholder="01XXXXXXXXX"
                            value={formData.paymentNumber}
                            onChange={(e) => setFormData({ ...formData, paymentNumber: e.target.value.replace(/[^0-9]/g, '') })}
                            className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-600 focus:border-orange-600 outline-none text-sm text-slate-900 font-mono placeholder:text-slate-400"
                          />
                          <span className="text-[10px] text-slate-500 mt-0.5 block">১১ ডিজিটের মোবাইল নম্বর (01 দিয়ে শুরু)</span>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-800 mb-1">
                            Transaction ID (TrxID) <span className="text-rose-600">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="যেমন: 9J3K8L2P"
                            value={formData.trxId}
                            onChange={(e) => setFormData({ ...formData, trxId: e.target.value.toUpperCase() })}
                            className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-600 focus:border-orange-600 outline-none text-sm text-slate-900 font-mono uppercase placeholder:text-slate-400"
                          />
                          <span className="text-[10px] text-slate-500 mt-0.5 block">টাকা পাঠানোর পর নগদ কনফার্মেশন মেসেজের TrxID</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
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
