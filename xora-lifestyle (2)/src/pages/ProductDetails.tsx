import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  Star,
  Check,
  MessageCircle,
} from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { storeService } from '../services/storeService';
import { Product } from '../types';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { language, formatPrice, t } = useLanguage();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'delivery'>('desc');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (!id) return;

    setLoading(true);
    storeService.getProduct(id).then((prod) => {
      if (prod) {
        setProduct(prod);
        setSelectedImage(prod.images[0] || '');
        if (prod.variants?.colors?.length) {
          setSelectedColor(prod.variants.colors[0].nameBn);
        }
        setQuantity(1);

        // Fetch related products from same category
        storeService.getProducts().then((all) => {
          const related = all
            .filter((p) => p.id !== prod.id && p.categoryId === prod.categoryId)
            .slice(0, 4);
          setRelatedProducts(related);
        });
      }
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-square bg-[#E8E1D5] rounded-2xl" />
          <div className="space-y-4">
            <div className="h-8 bg-[#E8E1D5] rounded w-3/4" />
            <div className="h-6 bg-[#E8E1D5] rounded w-1/3" />
            <div className="h-24 bg-[#E8E1D5] rounded w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-[#1E1E1E] mb-3">
          {language === 'bn' ? 'পণ্যটি খুঁজে পাওয়া যায়নি' : 'Product Not Found'}
        </h2>
        <Link
          to="/shop"
          className="inline-block px-5 py-2.5 bg-[#962D3E] text-white text-xs font-semibold rounded-lg"
        >
          {t('continueShopping')}
        </Link>
      </div>
    );
  }

  const name = language === 'bn' ? product.nameBn : product.nameEn;
  const categoryName = language === 'bn' ? product.categoryNameBn : product.categoryNameEn;
  const description = language === 'bn' ? product.descriptionBn : product.descriptionEn;
  const specifications = language === 'bn' ? product.specificationsBn : product.specificationsEn;

  const handleAddToCart = () => {
    addToCart(
      {
        productId: product.id,
        nameBn: product.nameBn,
        nameEn: product.nameEn,
        price: product.price,
        image: selectedImage || product.images[0],
        selectedColor: selectedColor || undefined,
        maxStock: product.stockCount,
      },
      quantity,
      true
    );
  };

  const handleOrderNow = () => {
    addToCart(
      {
        productId: product.id,
        nameBn: product.nameBn,
        nameEn: product.nameEn,
        price: product.price,
        image: selectedImage || product.images[0],
        selectedColor: selectedColor || undefined,
        maxStock: product.stockCount,
      },
      quantity,
      false
    );
    navigate('/checkout');
  };

  const whatsappInquiryUrl = `https://wa.me/8801711234567?text=${encodeURIComponent(
    language === 'bn'
      ? `হ্যালো Xora Lifestyle, আমি "${product.nameBn}" (দাম: ৳${product.price}) সম্পর্কে জানতে চাচ্ছি।`
      : `Hello Xora Lifestyle, I want to inquire about "${product.nameEn}" (Price: ৳${product.price}).`
  )}`;

  return (
    <div className="py-6 md:py-12 bg-[#FAF7F2] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb (Quiet unboxed text) */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#7A7165] mb-6">
          <Link to="/" className="hover:text-[#962D3E]">{t('navHome')}</Link>
          <span aria-hidden="true">/</span>
          <Link to="/shop" className="hover:text-[#962D3E]">{t('navShop')}</Link>
          <span aria-hidden="true">/</span>
          <Link to={`/shop?category=${product.categoryId}`} className="hover:text-[#962D3E]">{categoryName}</Link>
          <span aria-hidden="true">/</span>
          <span className="text-[#1E1E1E] font-medium truncate max-w-xs">{name}</span>
        </nav>

        {/* Main Product Layout: Sticky Gallery (Left) & Contiguous Purchase Module (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Gallery Column (lg:col-span-7) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Primary Main Image Frame */}
            <div className="relative aspect-[4/3] sm:aspect-square bg-[#F2EDE4] rounded-2xl overflow-hidden border border-[#E5DDD0] shadow-sm">
              <img
                src={selectedImage || product.images[0]}
                alt={name}
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="absolute top-4 left-4 bg-[#962D3E] text-white text-xs font-semibold px-2.5 py-1 rounded shadow-sm">
                  {language === 'bn' ? 'বিশেষ ছাড়' : 'Special Offer'}
                </div>
              )}
            </div>

            {/* Thumbnail Row */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImage === img
                        ? 'border-[#962D3E] shadow-sm'
                        : 'border-[#E2DAD0] hover:border-[#B5A997]'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Contiguous Purchase Module (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <div>
              <p className="text-xs uppercase tracking-wider text-[#962D3E] font-semibold mb-1">
                {categoryName}
              </p>
              <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1E1E1E] leading-tight">
                {name}
              </h1>

              {/* Rating and Reviews Counter */}
              <div className="flex items-center gap-2 mt-2 text-xs text-[#7A7165]">
                <div className="flex items-center text-[#E7A823]">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="ml-1 font-bold text-[#1E1E1E] tabular-nums">{product.rating}</span>
                </div>
                <span aria-hidden="true">·</span>
                <span>
                  {language === 'bn'
                    ? `${product.reviewsCount.toString().replace(/[0-9]/g, (w) => ['০','১','২','৩','৪','৫','৬','৭','৮','৯'][+w])}টি কাস্টমার রিভিউ`
                    : `${product.reviewsCount} verified reviews`}
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-[#2E7D32] font-semibold">
                  {product.inStock ? t('inStock') : t('outOfStock')}
                </span>
              </div>
            </div>

            {/* Price Module */}
            <div className="p-4 bg-white rounded-xl border border-[#E7E0D3] flex items-baseline justify-between">
              <div>
                <span className="text-2xl sm:text-3xl font-bold text-[#1E1E1E] tabular-nums">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-[#968E82] line-through ml-2 tabular-nums">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              <span className="text-xs text-[#2E7D32] font-semibold">
                {language === 'bn' ? 'ক্যাশ অন ডেলিভারি প্রযোজ্য' : 'COD Available'}
              </span>
            </div>

            {/* Color Variant Selector */}
            {product.variants?.colors && product.variants.colors.length > 0 && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#3D372F]">{t('selectColor')}:</span>
                  <span className="text-[#7A7165] font-medium">{selectedColor}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {product.variants.colors.map((c) => (
                    <button
                      key={c.nameBn}
                      onClick={() => setSelectedColor(c.nameBn)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        selectedColor === c.nameBn
                          ? 'border-[#962D3E] bg-[#FFF5F6] text-[#962D3E] font-semibold shadow-xs'
                          : 'border-[#DDD4C5] bg-white text-[#4A433A] hover:border-[#962D3E]'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/20"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{language === 'bn' ? c.nameBn : c.nameEn}</span>
                      {selectedColor === c.nameBn && <Check className="w-3 h-3 ml-0.5" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-[#3D372F]">{t('quantity')}:</span>
              <div className="flex items-center border border-[#D5CCC0] rounded-lg bg-white">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="p-2 text-[#5E5549] hover:text-[#1E1E1E] transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center text-xs font-bold text-[#1E1E1E] tabular-nums">
                  {language === 'bn'
                    ? quantity.toString().replace(/[0-9]/g, (w) => ['০','১','২','৩','৪','৫','৬','৭','৮','৯'][+w])
                    : quantity}
                </span>
                <button
                  onClick={() => setQuantity((prev) => Math.min(product.stockCount, prev + 1))}
                  className="p-2 text-[#5E5549] hover:text-[#1E1E1E] transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-[11px] text-[#7A7165]">
                {language === 'bn'
                  ? `(স্টকে ${product.stockCount.toString().replace(/[0-9]/g, (w) => ['০','১','২','৩','৪','৫','৬','৭','৮','৯'][+w])}টি রয়েছে)`
                  : `(${product.stockCount} available)`}
              </span>
            </div>

            {/* Primary Purchase Buttons (Add to Cart & Order Now) */}
            <div className="flex flex-col gap-2.5 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="py-3 px-4 bg-white border-2 border-[#962D3E] text-[#962D3E] text-xs font-bold rounded-xl hover:bg-[#FFF5F6] transition-transform active:scale-[0.98] flex items-center justify-center gap-2 shadow-xs"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{t('addToCart')}</span>
                </button>

                <button
                  onClick={handleOrderNow}
                  disabled={!product.inStock}
                  className="py-3 px-4 bg-[#962D3E] text-white text-xs font-bold rounded-xl hover:bg-[#7D2232] transition-transform active:scale-[0.98] flex items-center justify-center gap-2 shadow-md"
                >
                  <span>{t('orderNow')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* WhatsApp Quick Inquiry Button */}
              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 bg-[#EAF8EE] text-[#1E7E34] hover:bg-[#D7F2DD] border border-[#BDE8C6] text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{language === 'bn' ? 'হোয়াটসঅ্যাপে অর্ডার বা তথ্য জানুন' : 'Inquire on WhatsApp'}</span>
              </a>
            </div>

            {/* Value Guarantees Box */}
            <div className="p-4 bg-[#F2EDE4] rounded-xl border border-[#E2DAD0] flex flex-col gap-2.5 text-xs text-[#524B41]">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#962D3E] shrink-0" />
                <span>{language === 'bn' ? 'ঢাকায় ২-৩ দিন, বাইরে ৩-৫ দিনে ডেলিভারি' : 'Fast 2-5 days home delivery nationwide'}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#962D3E] shrink-0" />
                <span>{language === 'bn' ? '১০০% অকৃত্রিম হ্যান্ডক্রাফটেড পণ্য নিশ্চয়তা' : 'Guaranteed 100% genuine artisan craft'}</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#962D3E] shrink-0" />
                <span>{language === 'bn' ? '৭ দিনের সহজ পণ্য পরিবর্তন বা রিটার্ন সুবিধা' : '7 Days easy return & replacement support'}</span>
              </div>
            </div>

          </div>

        </div>

        {/* Detailed Tabs: Description / Specifications / Shipping */}
        <div className="mt-16 bg-white rounded-2xl border border-[#E7E0D3] overflow-hidden shadow-sm">
          {/* Tab Headers */}
          <div className="flex border-b border-[#E8E1D5] bg-[#F8F5EE]">
            <button
              onClick={() => setActiveTab('desc')}
              className={`px-5 py-3.5 text-xs font-bold transition-colors border-b-2 ${
                activeTab === 'desc'
                  ? 'border-[#962D3E] text-[#962D3E] bg-white'
                  : 'border-transparent text-[#61584C] hover:text-[#1E1E1E]'
              }`}
            >
              {t('description')}
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`px-5 py-3.5 text-xs font-bold transition-colors border-b-2 ${
                activeTab === 'specs'
                  ? 'border-[#962D3E] text-[#962D3E] bg-white'
                  : 'border-transparent text-[#61584C] hover:text-[#1E1E1E]'
              }`}
            >
              {t('specifications')}
            </button>
            <button
              onClick={() => setActiveTab('delivery')}
              className={`px-5 py-3.5 text-xs font-bold transition-colors border-b-2 ${
                activeTab === 'delivery'
                  ? 'border-[#962D3E] text-[#962D3E] bg-white'
                  : 'border-transparent text-[#61584C] hover:text-[#1E1E1E]'
              }`}
            >
              {t('shippingReturn')}
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6 md:p-8">
            {activeTab === 'desc' && (
              <div className="prose max-w-none text-xs sm:text-sm text-[#4A433A] leading-relaxed">
                <p className="mb-4">{description}</p>
                <p>{language === 'bn' ? product.shortDescriptionBn : product.shortDescriptionEn}</p>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="max-w-2xl">
                <table className="w-full text-xs text-[#3D362C]">
                  <tbody>
                    {Object.entries(specifications).map(([key, val], idx) => (
                      <tr key={key} className={idx % 2 === 0 ? 'bg-[#FAF7F2]' : 'bg-white'}>
                        <td className="py-2.5 px-4 font-semibold w-1/3 border-b border-[#EFE9DF]">{key}</td>
                        <td className="py-2.5 px-4 border-b border-[#EFE9DF]">{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'delivery' && (
              <div className="text-xs sm:text-sm text-[#4A433A] leading-relaxed max-w-2xl space-y-3">
                <p>{t('shippingReturnContent')}</p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs">
                  <li><strong>ঢাকার ভেতরে ডেলিভারি:</strong> ৳৭০ (২-৩ কার্যদিবস)</li>
                  <li><strong>ঢাকার বাইরে সমগ্র বাংলাদেশে:</strong> ৳১৩০ (৩-৫ কার্যদিবস)</li>
                  <li><strong>ক্যাশ অন ডেলিভারি:</strong> পণ্য বুঝে পেয়ে মূল্য পরিশোধ করুন</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Grid */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#1E1E1E] mb-6">
              {t('relatedProducts')}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
