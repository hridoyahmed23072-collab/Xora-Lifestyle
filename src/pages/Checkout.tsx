import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Truck, ShieldCheck, ArrowRight, CreditCard } from 'lucide-react';

export const Checkout: React.FC = () => {
  const { cart, totalAmount, clearCart } = useCart();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    deliveryArea: 'inside', // 'inside' = 80, 'outside' = 150
    paymentMethod: 'cod', // 'cod', 'bkash', 'nagad'
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delivery calculation based on your current rates (80 Tk / 150 Tk)
  const deliveryFee = formData.deliveryArea === 'inside' ? 80 : 150;
  const grandTotal = totalAmount + deliveryFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) return;

    setIsSubmitting(true);
    
    setTimeout(() => {
      const orderId = 'XORA-' + Math.floor(100000 + Math.random() * 900000);
      clearCart();
      setIsSubmitting(false);
      navigate(`/order-success/${orderId}`);
    }, 800);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
        <ShoppingBag className="w-16 h-16 text-[#962D3E] mb-4 animate-bounce" />
        <h2 className="text-xl font-bold mb-2 text-[#1E1E1E]">
          {language === 'bn' ? 'আপনার ব্যাগটি খালি!' : 'Your bag is empty!'}
        </h2>
        <p className="text-xs text-[#6B6357] mb-6">
          {language === 'bn' ? 'অর্ডার করতে শপ থেকে পণ্য বেছে নিন।' : 'Add products to your bag to place an order.'}
        </p>
        <button
          onClick={() => navigate('/shop')}
          className="px-6 py-3 bg-[#962D3E] text-white text-xs font-bold rounded-xl shadow-md hover:bg-[#7d2232] transition"
        >
          {language === 'bn' ? 'শপে যান' : 'Go to Shop'}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-10 text-[#1E1E1E]">
      <div className="mb-6">
        <h1 className="text-2xl font-serif-luxury font-bold text-[#1E1E1E]">
          {language === 'bn' ? 'অর্ডার সম্পন্ন করুন' : 'Complete Your Order'}
        </h1>
        <p className="text-xs text-[#6B6357] mt-1">
          {language === 'bn' 
            ? 'নিচের তথ্যগুলো পূরণ করে আপনার অর্ডারটি এখনই নিশ্চিত করুন।' 
            : 'Fill in the information below to confirm your order now.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form Column */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 flex flex-col gap-5">
          {/* Section 1: Customer & Shipping Details */}
          <div className="bg-white p-5 rounded-2xl border border-[#E5DDD0] shadow-xs flex flex-col gap-3.5">
            <div className="flex items-center gap-2 pb-2 border-b border-[#F0EAE1]">
              <span className="w-5 h-5 rounded-full bg-[#962D3E] text-white text-[11px] font-bold flex items-center justify-center">1</span>
              <h3 className="text-xs font-bold text-[#1E1E1E] uppercase tracking-wider">
                {language === 'bn' ? 'গ্রাহকের তথ্য ও ডেলিভারি ঠিকানা' : 'Customer & Shipping Address'}
              </h3>
            </div>

            <div>
              <label className="block text-[11px] font-semibold mb-1 text-[#2D2A26]">
                {language === 'bn' ? 'আপনার সম্পূর্ণ নাম *' : 'Full Name *'}
              </label>
              <input
                type="text"
                required
                placeholder={language === 'bn' ? 'যেমন: মোহাম্মদ আরিফ' : 'e.g. John Doe'}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#DDD5C7] text-xs focus:outline-none focus:border-[#962D3E] transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold mb-1 text-[#2D2A26]">
                {language === 'bn' ? 'মোবাইল নম্বর (১১ ডিজিট) *' : 'Phone Number (11 digits) *'}
              </label>
              <input
                type="tel"
                required
                placeholder="017XXXXXXXX"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#DDD5C7] text-xs focus:outline-none focus:border-[#962D3E] transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold mb-1 text-[#2D2A26]">
                {language === 'bn' ? 'সম্পূর্ণ ঠিকানা (বাসা/ফ্ল্যাট, রোড, এলাকা) *' : 'Full Address *'}
              </label>
              <textarea
                required
                rows={2}
                placeholder={language === 'bn' ? 'যেমন: বাড়ি ৫২, রোড ৭, ধানমন্ডি, ঢাকা' : 'House, Street, Area'}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#DDD5C7] text-xs focus:outline-none focus:border-[#962D3E] transition resize-none"
              />
            </div>

            {/* Delivery Area Selection */}
            <div>
              <label className="block text-[11px] font-semibold mb-1.5 text-[#2D2A26]">
                {language === 'bn' ? 'ডেলিভারি এলাকা ও চার্জ *' : 'Delivery Area & Fee *'}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label 
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                    formData.deliveryArea === 'inside' 
                      ? 'border-[#962D3E] bg-[#FAF0F2]' 
                      : 'border-[#DDD5C7] bg-[#FAF8F5]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input 
                      type="radio" 
                      name="deliveryArea" 
                      checked={formData.deliveryArea === 'inside'} 
                      onChange={() => setFormData({ ...formData, deliveryArea: 'inside' })}
                      className="accent-[#962D3E]"
                    />
                    <div>
                      <p className="text-xs font-bold">{language === 'bn' ? 'ঢাকার ভেতরে' : 'Inside Dhaka'}</p>
                      <p className="text-[10px] text-[#6B6357]">{language === 'bn' ? '২-৩ কার্যদিবস' : '2-3 Days'}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#962D3E]">৳৮০</span>
                </label>

                <label 
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                    formData.deliveryArea === 'outside' 
                      ? 'border-[#962D3E] bg-[#FAF0F2]' 
                      : 'border-[#DDD5C7] bg-[#FAF8F5]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input 
                      type="radio" 
                      name="deliveryArea" 
                      checked={formData.deliveryArea === 'outside'} 
                      onChange={() => setFormData({ ...formData, deliveryArea: 'outside' })}
                      className="accent-[#962D3E]"
                    />
                    <div>
                      <p className="text-xs font-bold">{language === 'bn' ? 'ঢাকার বাইরে' : 'Outside Dhaka'}</p>
                      <p className="text-[10px] text-[#6B6357]">{language === 'bn' ? '৩-৫ কার্যদিবস' : '3-5 Days'}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#962D3E]">৳১৫০</span>
                </label>
              </div>
            </div>
          </div>

          {/* Section 2: Payment Method */}
          <div className="bg-white p-5 rounded-2xl border border-[#E5DDD0] shadow-xs flex flex-col gap-3">
            <div className="flex items-center gap-2 pb-2 border-b border-[#F0EAE1]">
              <span className="w-5 h-5 rounded-full bg-[#962D3E] text-white text-[11px] font-bold flex items-center justify-center">2</span>
              <h3 className="text-xs font-bold text-[#1E1E1E] uppercase tracking-wider">
                {language === 'bn' ? 'পেমেন্ট মেথড নির্বাচন করুন' : 'Select Payment Method'}
              </h3>
            </div>

            <div className="flex flex-col gap-2">
              <label className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                formData.paymentMethod === 'cod' ? 'border-[#962D3E] bg-[#FAF0F2]' : 'border-[#DDD5C7] bg-[#FAF8F5]'
              }`}>
                <div className="flex items-center gap-2.5">
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    checked={formData.paymentMethod === 'cod'} 
                    onChange={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                    className="accent-[#962D3E]"
                  />
                  <div>
                    <p className="text-xs font-bold">{language === 'bn' ? 'ক্যাশ অন ডেলিভারি (Cash on Delivery)' : 'Cash on Delivery'}</p>
                    <p className="text-[10px] text-[#6B6357]">{language === 'bn' ? 'পণ্য হাতে পেয়ে টাকা পরিশোধ করবেন' : 'Pay when product is delivered'}</p>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">জনপ্রিয়</span>
              </label>

              <label className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                formData.paymentMethod === 'bkash' ? 'border-[#962D3E] bg-[#FAF0F2]' : 'border-[#DDD5C7] bg-[#FAF8F5]'
              }`}>
                <div className="flex items-center gap-2.5">
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    checked={formData.paymentMethod === 'bkash'} 
                    onChange={() => setFormData({ ...formData, paymentMethod: 'bkash' })}
                    className="accent-[#962D3E]"
                  />
                  <span className="text-xs font-bold">{language === 'bn' ? 'বিকাশ (bKash Send Money)' : 'bKash'}</span>
                </div>
                <span className="text-[10px] bg-[#E2136E] text-white px-2 py-0.5 rounded font-bold">bKash</span>
              </label>
            </div>
          </div>
        </form>

        {/* Right Summary Column */}
        <div className="lg:col-span-5 sticky top-20">
          <div className="bg-white border border-[#E5DDD0] p-5 rounded-2xl shadow-xs">
            <h3 className="text-xs font-bold pb-3 border-b border-[#F0EAE1] text-[#1E1E1E] uppercase tracking-wider">
              {language === 'bn' ? 'অর্ডারের বিবরণ' : 'Order Details'}
            </h3>

            <div className="max-h-60 overflow-y-auto my-3 divide-y divide-[#F0EAE1] pr-1">
              {cart.map((item) => (
                <div key={item.id} className="py-2.5 flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-12 h-12 object-cover rounded-xl border border-[#E5DDD0]"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#1E1E1E] truncate">{item.title}</p>
                    <p className="text-[11px] text-[#6B6357] mt-0.5">
                      পরিমাণ: {item.quantity}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#1E1E1E]">
                    ৳{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#F0EAE1] flex flex-col gap-2 text-xs">
              <div className="flex justify-between text-[#6B6357]">
                <span>সাবটোটাল</span>
                <span className="text-[#1E1E1E] font-medium">৳{totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#6B6357]">
                <span>ডেলিভারি চার্জ</span>
                <span className="text-[#1E1E1E] font-medium">৳{deliveryFee}</span>
              </div>
              <div className="flex justify-between text-base font-bold pt-2 border-t border-[#F0EAE1] text-[#1E1E1E]">
                <span>সর্বমোট</span>
                <span className="text-[#962D3E]">৳{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full mt-5 py-3.5 bg-[#962D3E] hover:bg-[#7D2232] text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition cursor-pointer"
            >
              {isSubmitting ? (
                <span className="animate-pulse">প্রসেসিং হচ্ছে...</span>
              ) : (
                <>
                  <span>অর্ডার কনফার্ম করুন</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="mt-3 text-center text-[10px] text-[#6B6357] flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>কোনো অগ্রিম পেমেন্টের ঝুঁকি নেই, পণ্য হাতে পেয়ে মূল্য দিন</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
