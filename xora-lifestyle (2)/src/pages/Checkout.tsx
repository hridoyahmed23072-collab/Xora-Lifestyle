import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShoppingBag,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { BANGLADESH_DISTRICTS } from '../lib/constants';
import { storeService } from '../services/storeService';
import { DeliveryZone, PaymentMethod } from '../types';

export const Checkout: React.FC = () => {
  const { cart, subtotal, clearCart } = useCart();
  const { language, formatPrice, t } = useLanguage();
  const navigate = useNavigate();

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('dhaka');
  const [deliveryZone, setDeliveryZone] = useState<DeliveryZone>('inside_dhaka');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [senderNumber, setSenderNumber] = useState('');
  const [trxId, setTrxId] = useState('');
  const [notes, setNotes] = useState('');

  // UI / Validation State
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pricing calculation
  const isFreeShipping = subtotal >= 3000;
  const deliveryCharge = isFreeShipping
    ? 0
    : deliveryZone === 'inside_dhaka'
    ? 70
    : 130;
  const grandTotal = subtotal + deliveryCharge;

  // Handle District Change
  const handleDistrictChange = (distId: string) => {
    setSelectedDistrict(distId);
    if (distId === 'dhaka') {
      setDeliveryZone('inside_dhaka');
    } else {
      setDeliveryZone('outside_dhaka');
    }
  };

  // BD Phone Number Validator (11 digits, starts with 013, 014, 015, 016, 017, 018, 019)
  const validatePhone = (input: string): boolean => {
    const clean = input.replace(/[^0-9]/g, '');
    if (clean.length === 11 && clean.startsWith('01')) {
      return true;
    }
    if (clean.length === 13 && clean.startsWith('8801')) {
      return true;
    }
    return false;
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!customerName.trim()) {
      newErrors.name = language === 'bn' ? 'আপনার নাম লিখুন' : 'Please enter your full name';
    }

    if (!validatePhone(phone)) {
      newErrors.phone = t('phoneInvalid');
    }

    if (!address.trim() || address.trim().length < 6) {
      newErrors.address =
        language === 'bn'
          ? 'অনুগ্রহ করে সম্পূর্ণ বিস্তারিত ঠিকানা লিখুন (রোড, এলাকা ইত্যাদি)'
          : 'Please provide detailed delivery address';
    }

    if ((paymentMethod === 'bkash' || paymentMethod === 'nagad') && !trxId.trim()) {
      newErrors.trxId =
        language === 'bn'
          ? 'অনুগ্রহ করে সেন্ড মানি করার পর প্রাপ্ত ট্রানজেকশন আইডি (TrxID) দিন'
          : 'Please provide the transaction ID (TrxID)';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }

    setSubmitting(true);

    try {
      const orderDistrictObj = BANGLADESH_DISTRICTS.find((d) => d.id === selectedDistrict);
      const districtName =
        language === 'bn' ? orderDistrictObj?.nameBn || 'ঢাকা' : orderDistrictObj?.nameEn || 'Dhaka';

      const orderItems = cart.map((i) => ({
        productId: i.productId,
        nameBn: i.nameBn,
        nameEn: i.nameEn,
        price: i.price,
        image: i.image,
        selectedColor: i.selectedColor,
        selectedSize: i.selectedSize,
        quantity: i.quantity,
        totalPrice: i.price * i.quantity,
      }));

      const newOrder = await storeService.createOrder({
        customerName: customerName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        district: districtName,
        deliveryZone,
        deliveryCharge,
        subtotal,
        totalAmount: grandTotal,
        paymentMethod,
        paymentNumber: senderNumber.trim() || undefined,
        trxId: trxId.trim() || undefined,
        notes: notes.trim() || undefined,
        items: orderItems,
      });

      clearCart();
      navigate(`/order-success/${newOrder.id}`);
    } catch (err) {
      console.error('Failed to create order', err);
      setErrors({
        submit:
          language === 'bn'
            ? 'অর্ডার প্রক্রিয়া করতে সাময়িক সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।'
            : 'Something went wrong. Please try again.',
      });
      setSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="py-20 px-4 max-w-md mx-auto text-center min-h-[50vh] flex flex-col justify-center items-center">
        <ShoppingBag className="w-12 h-12 text-[#968E82] mb-3" />
        <h2 className="text-xl font-bold text-[#1E1E1E] mb-2">{t('cartEmpty')}</h2>
        <Link
          to="/shop"
          className="mt-4 px-6 py-2.5 bg-[#962D3E] text-white text-xs font-semibold rounded-lg"
        >
          {t('continueShopping')}
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-12 bg-[#FAF7F2] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1E1E1E]">
            {t('checkoutTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-[#736A5E] mt-1">
            {language === 'bn'
              ? 'নিচের তথ্যগুলো পূরণ করে আপনার অর্ডারটি এখনই নিশ্চিত করুন।'
              : 'Provide shipping and payment details to confirm your order.'}
          </p>
        </div>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Form: Shipping, District & Payment Method (lg:col-span-7) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Step 1: Contact & Delivery Address */}
            <div className="bg-white p-5 sm:p-7 rounded-2xl border border-[#E7E0D3] shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-[#F0EAE0] pb-3">
                <span className="w-6 h-6 rounded-full bg-[#962D3E] text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h2 className="font-semibold text-base text-[#1E1E1E]">
                  {t('contactShipping')}
                </h2>
              </div>

              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#3D362C]">
                  {t('fullName')} <span className="text-[#962D3E]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  placeholder={t('fullNamePlaceholder')}
                  className={`px-3.5 py-2.5 rounded-lg border text-sm text-[#1E1E1E] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:ring-1 transition-all ${
                    errors.name
                      ? 'border-[#D32F2F] focus:ring-[#D32F2F]'
                      : 'border-[#D5CCC0] focus:border-[#962D3E] focus:ring-[#962D3E]'
                  }`}
                />
                {errors.name && <p className="text-[11px] text-[#D32F2F]">{errors.name}</p>}
              </div>

              {/* Phone Number with BD validation */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#3D362C]">
                  {t('phoneNumber')} <span className="text-[#962D3E]">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errors.phone) setErrors({ ...errors, phone: '' });
                  }}
                  placeholder={t('phonePlaceholder')}
                  className={`px-3.5 py-2.5 rounded-lg border text-sm text-[#1E1E1E] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:ring-1 tabular-nums transition-all ${
                    errors.phone
                      ? 'border-[#D32F2F] focus:ring-[#D32F2F]'
                      : 'border-[#D5CCC0] focus:border-[#962D3E] focus:ring-[#962D3E]'
                  }`}
                />
                {errors.phone ? (
                  <p className="text-[11px] text-[#D32F2F] flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.phone}</span>
                  </p>
                ) : (
                  <p className="text-[11px] text-[#80766B]">
                    {language === 'bn'
                      ? 'ডেলিভারির জন্য আপনার সচল নম্বর দিন (যেমন: 01712345678)'
                      : 'We will call this number for order confirmation'}
                  </p>
                )}
              </div>

              {/* 64 Districts Dropdown */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#3D362C]">
                  {t('district')} <span className="text-[#962D3E]">*</span>
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="px-3.5 py-2.5 rounded-lg border border-[#D5CCC0] text-sm text-[#1E1E1E] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#962D3E] focus:ring-1 focus:ring-[#962D3E]"
                >
                  {BANGLADESH_DISTRICTS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {language === 'bn' ? `${d.nameBn} (${d.divisionBn} বিভাগ)` : `${d.nameEn} (${d.divisionEn})`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Full Address */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#3D362C]">
                  {t('fullAddress')} <span className="text-[#962D3E]">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    if (errors.address) setErrors({ ...errors, address: '' });
                  }}
                  placeholder={t('addressPlaceholder')}
                  className={`px-3.5 py-2.5 rounded-lg border text-sm text-[#1E1E1E] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:ring-1 transition-all ${
                    errors.address
                      ? 'border-[#D32F2F] focus:ring-[#D32F2F]'
                      : 'border-[#D5CCC0] focus:border-[#962D3E] focus:ring-[#962D3E]'
                  }`}
                />
                {errors.address && <p className="text-[11px] text-[#D32F2F]">{errors.address}</p>}
              </div>

              {/* Delivery Zone Selector (if Dhaka, can choose inside or sub-district outside) */}
              <div className="pt-2">
                <label className="text-xs font-semibold text-[#3D362C] block mb-2">
                  {t('deliveryMethod')}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                      deliveryZone === 'inside_dhaka'
                        ? 'border-[#962D3E] bg-[#FFF8F9] ring-1 ring-[#962D3E]'
                        : 'border-[#DDD4C5] bg-[#FAF7F2]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="deliveryZone"
                        checked={deliveryZone === 'inside_dhaka'}
                        onChange={() => setDeliveryZone('inside_dhaka')}
                        className="text-[#962D3E] focus:ring-[#962D3E]"
                      />
                      <div>
                        <p className="text-xs font-bold text-[#1E1E1E]">{t('insideDhaka')}</p>
                        <p className="text-[11px] text-[#786F63]">২-৩ কার্যদিবস</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#962D3E]">
                      {isFreeShipping ? 'ফ্রি' : '৳৭০'}
                    </span>
                  </label>

                  <label
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                      deliveryZone === 'outside_dhaka'
                        ? 'border-[#962D3E] bg-[#FFF8F9] ring-1 ring-[#962D3E]'
                        : 'border-[#DDD4C5] bg-[#FAF7F2]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="deliveryZone"
                        checked={deliveryZone === 'outside_dhaka'}
                        onChange={() => setDeliveryZone('outside_dhaka')}
                        className="text-[#962D3E] focus:ring-[#962D3E]"
                      />
                      <div>
                        <p className="text-xs font-bold text-[#1E1E1E]">{t('outsideDhaka')}</p>
                        <p className="text-[11px] text-[#786F63]">৩-৫ কার্যদিবস</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#962D3E]">
                      {isFreeShipping ? 'ফ্রি' : '৳১৩০'}
                    </span>
                  </label>
                </div>
              </div>

              {/* Order Notes (Optional) */}
              <div className="flex flex-col gap-1.5 pt-2">
                <label className="text-xs font-semibold text-[#544C41]">
                  {t('orderNotes')}
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t('orderNotesPlaceholder')}
                  className="px-3.5 py-2 rounded-lg border border-[#D5CCC0] text-xs text-[#1E1E1E] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#962D3E]"
                />
              </div>
            </div>

            {/* Step 2: Payment Methods (COD, bKash, Nagad) */}
            <div className="bg-white p-5 sm:p-7 rounded-2xl border border-[#E7E0D3] shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-[#F0EAE0] pb-3">
                <span className="w-6 h-6 rounded-full bg-[#962D3E] text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h2 className="font-semibold text-base text-[#1E1E1E]">
                  {t('paymentMethod')}
                </h2>
              </div>

              {/* COD Option */}
              <label
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col gap-2 ${
                  paymentMethod === 'cod'
                    ? 'border-[#962D3E] bg-[#FFF8F9] ring-1 ring-[#962D3E]'
                    : 'border-[#DDD4C5] bg-[#FAF7F2]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="text-[#962D3E] focus:ring-[#962D3E]"
                    />
                    <span className="text-sm font-bold text-[#1E1E1E]">
                      {t('paymentCod')}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 bg-[#E8F5E9] text-[#2E7D32] text-[11px] font-bold rounded">
                    জনপ্রিয়
                  </span>
                </div>
                <p className="text-xs text-[#6B6357] pl-6 leading-relaxed">
                  {t('paymentCodDesc')}
                </p>
              </label>

              {/* bKash Option */}
              <label
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col gap-3 ${
                  paymentMethod === 'bkash'
                    ? 'border-[#E2136E] bg-[#FFF0F5] ring-1 ring-[#E2136E]'
                    : 'border-[#DDD4C5] bg-[#FAF7F2]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'bkash'}
                      onChange={() => setPaymentMethod('bkash')}
                      className="text-[#E2136E] focus:ring-[#E2136E]"
                    />
                    <span className="text-sm font-bold text-[#1E1E1E] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#E2136E]" />
                      {t('paymentBkash')}
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 bg-[#E2136E] text-white text-[10px] font-bold rounded">
                    bKash
                  </span>
                </div>

                {paymentMethod === 'bkash' && (
                  <div className="pl-6 pt-2 border-t border-[#F5D8E4] flex flex-col gap-3 text-xs">
                    <p className="text-[#6B6357] leading-relaxed">
                      {t('paymentBkashDesc')}
                    </p>
                    <div className="p-3 bg-white rounded-lg border border-[#F0BED2] flex items-center justify-between">
                      <div>
                        <p className="text-[11px] text-[#7A7165]">{t('sendMoneyTo')}</p>
                        <p className="text-sm font-bold text-[#E2136E] tracking-wider">01711234567</p>
                      </div>
                      <span className="text-[11px] text-[#696156] font-medium bg-[#FFF0F5] px-2 py-1 rounded">
                        পার্সোনাল / সেন্ড মানি
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-[#4A433A] block mb-1">
                          {t('senderNumber')}
                        </label>
                        <input
                          type="tel"
                          value={senderNumber}
                          onChange={(e) => setSenderNumber(e.target.value)}
                          placeholder={t('senderNumberPlaceholder')}
                          className="w-full px-3 py-2 bg-white border border-[#DDD4C5] rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-[#4A433A] block mb-1">
                          {t('trxIdLabel')} <span className="text-[#E2136E]">*</span>
                        </label>
                        <input
                          type="text"
                          value={trxId}
                          onChange={(e) => {
                            setTrxId(e.target.value);
                            if (errors.trxId) setErrors({ ...errors, trxId: '' });
                          }}
                          placeholder={t('trxIdPlaceholder')}
                          className="w-full px-3 py-2 bg-white border border-[#DDD4C5] rounded-lg text-xs font-mono uppercase"
                        />
                        {errors.trxId && <p className="text-[10px] text-[#D32F2F] mt-1">{errors.trxId}</p>}
                      </div>
                    </div>
                  </div>
                )}
              </label>

              {/* Nagad Option */}
              <label
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col gap-3 ${
                  paymentMethod === 'nagad'
                    ? 'border-[#F7931E] bg-[#FFF8F0] ring-1 ring-[#F7931E]'
                    : 'border-[#DDD4C5] bg-[#FAF7F2]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'nagad'}
                      onChange={() => setPaymentMethod('nagad')}
                      className="text-[#F7931E] focus:ring-[#F7931E]"
                    />
                    <span className="text-sm font-bold text-[#1E1E1E] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#F7931E]" />
                      {t('paymentNagad')}
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 bg-[#F7931E] text-white text-[10px] font-bold rounded">
                    Nagad
                  </span>
                </div>

                {paymentMethod === 'nagad' && (
                  <div className="pl-6 pt-2 border-t border-[#F8E2CE] flex flex-col gap-3 text-xs">
                    <p className="text-[#6B6357] leading-relaxed">
                      {t('paymentNagadDesc')}
                    </p>
                    <div className="p-3 bg-white rounded-lg border border-[#F8CFAC] flex items-center justify-between">
                      <div>
                        <p className="text-[11px] text-[#7A7165]">{t('sendMoneyTo')}</p>
                        <p className="text-sm font-bold text-[#F7931E] tracking-wider">01711234567</p>
                      </div>
                      <span className="text-[11px] text-[#696156] font-medium bg-[#FFF8F0] px-2 py-1 rounded">
                        পার্সোনাল / সেন্ড মানি
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-[#4A433A] block mb-1">
                          {t('senderNumber')}
                        </label>
                        <input
                          type="tel"
                          value={senderNumber}
                          onChange={(e) => setSenderNumber(e.target.value)}
                          placeholder={t('senderNumberPlaceholder')}
                          className="w-full px-3 py-2 bg-white border border-[#DDD4C5] rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-[#4A433A] block mb-1">
                          {t('trxIdLabel')} <span className="text-[#F7931E]">*</span>
                        </label>
                        <input
                          type="text"
                          value={trxId}
                          onChange={(e) => {
                            setTrxId(e.target.value);
                            if (errors.trxId) setErrors({ ...errors, trxId: '' });
                          }}
                          placeholder={t('trxIdPlaceholder')}
                          className="w-full px-3 py-2 bg-white border border-[#DDD4C5] rounded-lg text-xs font-mono uppercase"
                        />
                        {errors.trxId && <p className="text-[10px] text-[#D32F2F] mt-1">{errors.trxId}</p>}
                      </div>
                    </div>
                  </div>
                )}
              </label>

            </div>

          </div>

          {/* Right Summary: Items, Subtotal, Delivery Fee & Confirm Button (lg:col-span-5) */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#E7E0D3] shadow-sm flex flex-col gap-5 sticky top-24">
            <h2 className="font-serif-luxury text-lg font-bold text-[#1E1E1E] border-b border-[#F0EAE0] pb-3">
              {t('orderSummary')}
            </h2>

            {/* Cart Items Preview */}
            <div className="divide-y divide-[#F2ECE3] max-h-64 overflow-y-auto pr-1">
              {cart.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={language === 'bn' ? item.nameBn : item.nameEn}
                    className="w-14 h-14 object-cover rounded-lg bg-[#F0EAE0] shrink-0 border border-[#E5DDD0]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#1E1E1E] truncate">
                      {language === 'bn' ? item.nameBn : item.nameEn}
                    </p>
                    <p className="text-[11px] text-[#7A7165]">
                      {item.selectedSize && <span>{item.selectedSize} · </span>}
                      <span>পরিমাণ: {item.quantity}</span>
                    </p>
                    <p className="text-xs font-semibold text-[#962D3E] tabular-nums">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing Breakdown */}
            <div className="pt-3 border-t border-[#F0EAE0] flex flex-col gap-2.5 text-xs sm:text-sm text-[#4A433A]">
              <div className="flex justify-between">
                <span>{t('subtotal')}</span>
                <span className="font-semibold text-[#1E1E1E] tabular-nums">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('deliveryFee')}</span>
                <span className="font-semibold text-[#1E1E1E] tabular-nums">
                  {deliveryCharge === 0 ? (
                    <span className="text-[#2E7D32]">ফ্রি (Free)</span>
                  ) : (
                    formatPrice(deliveryCharge)
                  )}
                </span>
              </div>
              {isFreeShipping && (
                <p className="text-[11px] text-[#2E7D32] bg-[#EAF8EE] p-2 rounded-lg font-medium">
                  {t('freeDeliveryUnlocked')}
                </p>
              )}
            </div>

            {/* Total Payable */}
            <div className="pt-3 border-t border-[#E8E1D5] flex justify-between items-baseline">
              <span className="text-base font-bold text-[#1E1E1E]">{t('total')}</span>
              <span className="text-2xl font-bold text-[#962D3E] tabular-nums">
                {formatPrice(grandTotal)}
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-[#962D3E] hover:bg-[#7D2232] text-white font-bold text-sm rounded-xl transition-all active:scale-[0.99] flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
            >
              {submitting ? (
                <span>{t('placingOrder')}</span>
              ) : (
                <>
                  <span>{t('confirmOrder')}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {errors.submit && (
              <p className="text-xs text-[#D32F2F] text-center font-medium bg-[#FDEDED] p-2.5 rounded-lg">
                {errors.submit}
              </p>
            )}

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#696156] pt-1">
              <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
              <span>
                {language === 'bn'
                  ? 'কোনো অগ্রিম পেমেন্টের ঝুঁকি নেই, পণ্য হাতে পেয়ে মূল্য দিন'
                  : 'Zero upfront risk. Verify and inspect upon doorstep arrival.'}
              </span>
            </div>

          </div>

        </form>

      </div>
    </div>
  );
};
