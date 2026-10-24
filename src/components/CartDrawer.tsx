import React, { useEffect } from 'react';
import { useSettings } from '../hooks/useSettings';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

export const CartDrawer: React.FC = () => {
  const { cart, isDrawerOpen, closeDrawer, updateQuantity, removeFromCart, subtotal, totalItems } = useCart();
  const { language, formatPrice, t } = useLanguage();
  const navigate = useNavigate();

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        closeDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  if (!isDrawerOpen) return null;

  const freeShippingThreshold = useSettings().freeShippingMinAmount || 0;
  const progressPercent = Math.min(100, freeShippingThreshold > 0 ? Math.round((subtotal / freeShippingThreshold) * 100) : 0);
  const amountNeeded = Math.max(0, freeShippingThreshold - subtotal);

  const handleCheckout = () => {
    closeDrawer();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dimmed Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <aside aria-label="Shopping Bag Drawer" className="w-screen max-w-md bg-[#FAF7F2] border-l border-[#E2DAD0] shadow-2xl flex flex-col">
          
          {/* Drawer Header */}
          <div className="px-5 py-4 border-b border-[#E8E1D5] bg-[#FAF7F2] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#962D3E]" />
              <h2 className="font-serif-luxury text-lg font-bold text-[#1E1E1E]">
                {t('cartTitle')} ({totalItems})
              </h2>
            </div>
            <button
              onClick={closeDrawer}
              className="p-1.5 text-[#635B51] hover:text-[#1E1E1E] hover:bg-[#EFE9DF] rounded-full transition-colors"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          {freeShippingThreshold > 0 && (
          <div className="bg-[#F3EDE3] px-5 py-3 border-b border-[#E8E1D5]">
            <div className="flex justify-between items-center text-xs font-medium text-[#4A433A] mb-1.5">
              <span>
                {amountNeeded === 0
                  ? t('freeDeliveryUnlocked')
                  : `${formatPrice(amountNeeded)} ${t('freeDeliveryAway')}`}
              </span>
              <span className="font-semibold text-[#962D3E]">{progressPercent}%</span>
            </div>
            <div className="w-full bg-[#E5DDD0] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#962D3E] h-full transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-5 py-4 divide-y divide-[#EDE5D8]">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#EFE9DF] flex items-center justify-center text-[#8C8274] mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-base font-semibold text-[#1E1E1E] mb-2">{t('cartEmpty')}</p>
                <p className="text-xs text-[#7A7165] max-w-xs mb-6">
                  {language === 'bn'
                    ? 'আমাদের কালেকশন থেকে আপনার পছন্দের ব্যাগ বেছে নিন।'
                    : 'Explore our bag collection and pick your favourite.'}
                </p>
                <button
                  onClick={() => {
                    closeDrawer();
                    navigate('/shop');
                  }}
                  className="px-5 py-2.5 bg-[#962D3E] text-white text-xs font-semibold rounded-lg hover:bg-[#7D2232] transition-colors"
                >
                  {t('continueShopping')}
                </button>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div key={`${item.productId}-${item.selectedColor}-${item.selectedSize}-${idx}`} className="py-4 flex gap-3.5 first:pt-0">
                  <img
                    src={item.image}
                    alt={language === 'bn' ? item.nameBn : item.nameEn}
                    className="w-20 h-20 object-cover rounded-lg bg-[#EAE3D6] shrink-0 border border-[#E0D7C9]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <Link
                          to={`/product/${item.productId}`}
                          onClick={closeDrawer}
                          className="text-sm font-semibold text-[#1E1E1E] hover:text-[#962D3E] transition-colors line-clamp-1"
                        >
                          {language === 'bn' ? item.nameBn : item.nameEn}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.productId, item.selectedColor, item.selectedSize)}
                          className="text-[#968E82] hover:text-[#962D3E] transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Variant Info */}
                      {(item.selectedColor || item.selectedSize) && (
                        <p className="text-xs text-[#7A7165] mt-0.5">
                          {item.selectedColor && <span>{item.selectedColor}</span>}
                          {item.selectedColor && item.selectedSize && <span> · </span>}
                          {item.selectedSize && <span>{item.selectedSize}</span>}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-[#D8CEBE] rounded-md bg-white">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1, item.selectedColor, item.selectedSize)}
                          className="p-1 text-[#665D52] hover:text-[#1E1E1E] hover:bg-[#F3ECE1] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-semibold tabular-nums text-[#1E1E1E]">
                          {language === 'bn'
                            ? item.quantity.toString().replace(/[0-9]/g, (w) => ['০','১','২','৩','৪','৫','৬','৭','৮','৯'][+w])
                            : item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1, item.selectedColor, item.selectedSize)}
                          className="p-1 text-[#665D52] hover:text-[#1E1E1E] hover:bg-[#F3ECE1] transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Price */}
                      <span className="text-sm font-bold text-[#1E1E1E] tabular-nums">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer with Subtotal & Checkout */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-[#E8E1D5] bg-[#FAF7F2] flex flex-col gap-3">
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-medium text-[#595247]">{t('subtotal')}</span>
                <span className="text-lg font-bold text-[#1E1E1E] tabular-nums">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <p className="text-[11px] text-[#7A7165]">
                {language === 'bn'
                  ? 'ডেলিভারি চার্জ চেকআউট পেইজে এলাকা অনুযায়ী নির্ধারিত হবে।'
                  : 'Shipping fee will be calculated at checkout based on your delivery district.'}
              </p>

              <button
                onClick={handleCheckout}
                className="w-full py-3 bg-[#962D3E] text-white font-semibold text-sm rounded-xl hover:bg-[#7D2232] transition-transform active:scale-[0.99] flex items-center justify-center gap-2 shadow-md"
              >
                <span>{t('proceedToCheckout')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#696156] pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D32]" />
                <span>
                  {language === 'bn'
                    ? '১০০% নিরাপদ চেকআউট ও ক্যাশ অন ডেলিভারি'
                    : '100% Secure Checkout & Cash on Delivery'}
                </span>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
