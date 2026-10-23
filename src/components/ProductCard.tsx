import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Check } from 'lucide-react';
import { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { language, formatPrice, t } = useLanguage();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const primaryImage = product.images[0] || '/images/product_leather_bag_1792674216295.jpg';
  const name = language === 'bn' ? product.nameBn : product.nameEn;
  const categoryName = language === 'bn' ? product.categoryNameBn : product.categoryNameEn;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Pick first color if available
    const defaultColor = product.variants?.colors?.[0]?.nameBn || undefined;

    addToCart(
      {
        productId: product.id,
        nameBn: product.nameBn,
        nameEn: product.nameEn,
        price: product.price,
        image: primaryImage,
        selectedColor: defaultColor,
        maxStock: product.stockCount,
      },
      1,
      true // open drawer
    );
  };

  const handleOrderNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const defaultColor = product.variants?.colors?.[0]?.nameBn || undefined;

    addToCart(
      {
        productId: product.id,
        nameBn: product.nameBn,
        nameEn: product.nameEn,
        price: product.price,
        image: primaryImage,
        selectedColor: defaultColor,
        maxStock: product.stockCount,
      },
      1,
      false
    );

    navigate('/checkout');
  };

  return (
    <article className="group flex flex-col bg-white rounded-xl border border-[#E7E0D3] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(30,30,30,0.06)]">
      {/* Product Image Slot */}
      <Link to={`/product/${product.id}`} className="relative aspect-[4/3] sm:aspect-square bg-[#F3EFE9] overflow-hidden block">
        <img
          src={primaryImage}
          alt={name}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            target.onerror = null;
            target.src = 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Stock / Sale Notice (Restrained, quiet unboxed text tag) */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="bg-[#962D3E] text-white text-[11px] font-semibold px-2 py-0.5 rounded-sm shadow-sm">
              {language === 'bn' ? 'ছাড়' : 'Save'}
            </span>
          )}
          {!product.inStock && (
            <span className="bg-[#3D3A37] text-white text-[11px] font-semibold px-2 py-0.5 rounded-sm">
              {t('outOfStock')}
            </span>
          )}
        </div>
      </Link>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Quiet Category Metadata */}
          <p className="text-[11px] tracking-wider uppercase text-[#887F74] font-medium mb-1 truncate">
            {categoryName}
          </p>

          {/* Product Title */}
          <Link
            to={`/product/${product.id}`}
            className="block text-sm sm:text-base font-semibold text-[#1E1E1E] group-hover:text-[#962D3E] transition-colors line-clamp-2 leading-snug"
          >
            {name}
          </Link>
        </div>

        {/* Price & Action Module */}
        <div className="pt-2 border-t border-[#F2EDE5] flex flex-col gap-2.5">
          <div className="flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-bold text-[#1E1E1E] tabular-nums">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-[#999083] line-through tabular-nums">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Primary Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleQuickAdd}
              disabled={!product.inStock}
              className="px-2.5 py-1.5 text-xs font-medium text-[#2D2A26] bg-[#F7F3EC] border border-[#DDD4C5] rounded-lg hover:bg-[#EDE5D8] hover:border-[#962D3E] transition-all flex items-center justify-center gap-1 active:scale-95 disabled:opacity-50"
              title={t('addToCart')}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="truncate">{t('addToCart')}</span>
            </button>

            <button
              onClick={handleOrderNow}
              disabled={!product.inStock}
              className="px-2.5 py-1.5 text-xs font-semibold text-white bg-[#962D3E] rounded-lg hover:bg-[#7D2232] transition-all flex items-center justify-center gap-1 active:scale-95 disabled:opacity-50 shadow-sm"
              title={t('orderNow')}
            >
              <span className="truncate">{t('orderNow')}</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
