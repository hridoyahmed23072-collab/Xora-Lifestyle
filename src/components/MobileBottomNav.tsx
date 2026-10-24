import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, LayoutGrid, ShoppingBag, Truck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';

export const MobileBottomNav: React.FC = () => {
  const { t, language } = useLanguage();
  const { totalItems, openDrawer } = useCart();

  return (
    <nav aria-label="Mobile Navigation" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#E8E1D5] px-2 py-1.5 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      <div className="grid grid-cols-5 items-center justify-around">
        {/* Home */}
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 transition-colors ${
              isActive ? 'text-[#962D3E]' : 'text-[#6B645B] hover:text-[#1E1E1E]'
            }`
          }
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-medium tracking-tight">{t('navHome')}</span>
        </NavLink>

        {/* Shop */}
        <NavLink
          to="/shop"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 transition-colors ${
              isActive ? 'text-[#962D3E]' : 'text-[#6B645B] hover:text-[#1E1E1E]'
            }`
          }
        >
          <Compass className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-medium tracking-tight">{t('navShop')}</span>
        </NavLink>

        {/* Categories Shortcut */}
        <NavLink
          to="/collections"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 transition-colors ${
              isActive ? 'text-[#962D3E]' : 'text-[#6B645B] hover:text-[#1E1E1E]'
            }`
          }
        >
          <LayoutGrid className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-medium tracking-tight">{t('navCollection')}</span>
        </NavLink>

        {/* Cart Trigger */}
        <button
          onClick={openDrawer}
          className="relative flex flex-col items-center justify-center py-1 text-[#6B645B] hover:text-[#962D3E] transition-colors"
          aria-label="View Shopping Cart"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 mb-0.5" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#962D3E] text-white text-[9px] font-bold h-3.5 min-w-3.5 px-0.5 rounded-full flex items-center justify-center border border-white">
                {language === 'bn'
                  ? totalItems.toString().replace(/[0-9]/g, (w) => ['০','১','২','৩','৪','৫','৬','৭','৮','৯'][+w])
                  : totalItems}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium tracking-tight">{t('navCart')}</span>
        </button>

        {/* Track Order */}
        <NavLink
          to="/track-order"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 transition-colors ${
              isActive ? 'text-[#962D3E]' : 'text-[#6B645B] hover:text-[#1E1E1E]'
            }`
          }
        >
          <Truck className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-medium tracking-tight">{t('navTrackOrder')}</span>
        </NavLink>
      </div>
    </nav>
  );
};
