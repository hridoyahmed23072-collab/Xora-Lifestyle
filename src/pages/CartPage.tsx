import React from 'react';
import { useSettings } from '../hooks/useSettings';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

export const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, subtotal, totalItems } = useCart();
  const { language, formatPrice, t } = useLanguage();
  const navigate = useNavigate();

  const freeShippingThreshold = useSettings().freeShippingMinAmount || 0;
  const progressPercent = Math.min(100, freeShippingThreshold > 0 ? Math.round((subtotal / freeShippingThreshold) * 100) : 0);
  const amountNeeded = Math.max(0, freeShippingThreshold - subtotal);

  if (cart.length === 0) {
    return (
      <div className="py-20 px-4 max-w-lg mx-auto text-center min-h-[60vh] flex flex-col justify-center items-center">
        <div className="w-20 h-20 rounded-full bg-[#EFE9DF] flex items-center justify-center text-[#8C8274] mb-4">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="font-serif-luxury text-2xl font-bold text-[#1E1E1E] mb-2">
          {t('cartEmpty')}
        </h1>
        <p className="text-xs sm:text-sm text-[#7A7165] mb-6">
          {language === 'bn'
            ? 'আমাদের কালেকশন থেকে আপনার পছন্দের ব্যাগ বেছে নিন।'
            : 'Explore our bag collection and pick your favourite.'}
        </p>
        <Link
          to="/shop"
          className="px-6 py-3 bg-[#962D3E] text-white text-xs font-bold rounded-xl hover:bg-[#7D2232] transition-colors"
        >
          {t('continueShopping')}
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-12 bg-[#FAF7F2] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1E1E1E] mb-8">
          {t('cartTitle')} ({totalItems})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Cart Items Column (lg:col-span-8) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-[#E7E0D3] p-5 sm:p-6 shadow-sm flex flex-col divide-y divide-[#F0EAE0]">
            
            {/* Free Shipping Strip */}
            {freeShippingThreshold > 0 && (
            <div className="pb-5">
              <div className="flex justify-between items-center text-xs font-semibold text-[#4A433A] mb-1.5">
                <span>
                  {amountNeeded === 0
                    ? t('freeDeliveryUnlocked')
                    : `${formatPrice(amountNeeded)} ${t('freeDeliveryAway')}`}
                </span>
                <span className="text-[#962D3E]">{progressPercent}%</span>
              </div>
              <div className="w-full bg-[#EFE9DF] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#962D3E] h-full transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            )}

            {/* Items */}
            {cart.map((item, idx) => (
              <div key={`${item.productId}-${item.selectedColor}-${item.selectedSize}-${idx}`} className="py-5 flex gap-4 first:pt-5">
                <img
                  src={item.image}
                  alt={language === 'bn' ? item.nameBn : item.nameEn}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl bg-[#F0EAE0] border border-[#E2DAD0] shrink-0"
                  referrerPolicy="no-referrer"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <Link
                        to={`/product/${item.productId}`}
                        className="text-sm sm:text-base font-semibold text-[#1E1E1E] hover:text-[#962D3E] transition-colors line-clamp-1"
                      >
                        {language === 'bn' ? item.nameBn : item.nameEn}
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.productId, item.selectedColor, item.selectedSize)}
                        className="text-[#9C9488] hover:text-[#962D3E] p-1 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {(item.selectedColor || item.selectedSize) && (
                      <p className="text-xs text-[#7A7165] mt-1">
                        {item.selectedColor && <span>কালার: {item.selectedColor}</span>}
                        {item.selectedColor && item.selectedSize && <span> · </span>}
                        {item.selectedSize && <span>সাইজ: {item.selectedSize}</span>}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    {/* Stepper */}
                    <div className="flex items-center border border-[#D5CCC0] rounded-lg bg-[#FAF7F2]">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1, item.selectedColor, item.selectedSize)}
                        className="p-1.5 text-[#595247] hover:text-[#1E1E1E] transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-[#1E1E1E] tabular-nums">
                        {language === 'bn'
                          ? item.quantity.toString().replace(/[0-9]/g, (w) => ['০','১','২','৩','৪','৫','৬','৭','৮','৯'][+w])
                          : item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1, item.selectedColor, item.selectedSize)}
                        className="p-1.5 text-[#595247] hover:text-[#1E1E1E] transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Total Price */}
                    <span className="text-base font-bold text-[#1E1E1E] tabular-nums">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Column (lg:col-span-4) */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-[#E7E0D3] p-6 shadow-sm flex flex-col gap-5 sticky top-24">
            <h2 className="font-serif-luxury text-lg font-bold text-[#1E1E1E]">
              {t('orderSummary')}
            </h2>

            <div className="flex flex-col gap-3 text-xs sm:text-sm text-[#544C41] border-b border-[#F0EAE0] pb-4">
              <div className="flex justify-between">
                <span>{t('subtotal')}</span>
                <span className="font-semibold text-[#1E1E1E] tabular-nums">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('deliveryFee')}</span>
                <span className="text-[#887F74]">
                  {language === 'bn' ? 'পরবর্তী ধাপে নির্ধারিত হবে' : 'Calculated at checkout'}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-baseline">
              <span className="text-base font-bold text-[#1E1E1E]">{t('total')}</span>
              <span className="text-xl font-bold text-[#962D3E] tabular-nums">{formatPrice(subtotal)}</span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-3.5 bg-[#962D3E] text-white font-bold text-sm rounded-xl hover:bg-[#7D2232] transition-transform active:scale-[0.99] flex items-center justify-center gap-2 shadow-md"
            >
              <span>{t('proceedToCheckout')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              to="/shop"
              className="text-center text-xs text-[#7A7165] hover:text-[#962D3E] font-medium"
            >
              {t('continueShopping')}
            </Link>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#696156] pt-2 border-t border-[#F0EAE0]">
              <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
              <span>
                {language === 'bn'
                  ? 'ক্যাশ অন ডেলিভারি ও নিরাপদ পেমেন্ট গ্যারান্টি'
                  : 'Cash on delivery and secure payment guarantee'}
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
