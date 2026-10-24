import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Sparkles, CheckCircle2 } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { useLanguage } from '../context/LanguageContext';
import { storeService } from '../services/storeService';
import { Category, CustomerReview, Product } from '../types';

export const Home: React.FC = () => {
  const { language, t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [activeTab, setActiveTab] = useState<'featured' | 'new' | 'bestseller'>('featured');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      storeService.getProducts(),
      storeService.getCategories(),
      storeService.getReviews(),
    ]).then(([prodData, catData, revData]) => {
      setProducts(prodData);
      setCategories(catData);
      setReviews(revData);
      setLoading(false);
    });
  }, []);

  const filteredProducts = products.filter((p) => {
    if (activeTab === 'featured') return p.isFeatured;
    if (activeTab === 'new') return p.isNew;
    if (activeTab === 'bestseller') return p.isBestSeller;
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. Hero Campaign Section - Full Width Background with Local Image Fallback */}
      <section className="relative min-h-[580px] md:min-h-[640px] flex items-center bg-gray-900 text-white overflow-hidden border-b border-[#E8E1D5]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/src/assets/images/hero_luxury_bag_model_1792783113964.jpg" 
            alt="Hero Background" 
            className="w-full h-full object-cover object-top"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              target.onerror = null;
              target.src = '/images/hero_luxury_bag_model_1792783113964.jpg';
            }}
          />
          {/* Dark Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/40 md:to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 w-full">
          <div className="max-w-2xl flex flex-col items-start gap-4 md:gap-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-300 tracking-wider uppercase px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{language === 'bn' ? 'আভিজাত্যের দেশীয় রূপ' : 'Pure Bangladeshi Craftsmanship'}</span>
            </div>

            <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15] text-balance">
              {t('heroHeadline')}
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-gray-200 leading-relaxed max-w-xl">
              {t('heroSub')}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/shop"
                className="px-6 py-3.5 bg-[#962D3E] hover:bg-[#7D2232] text-white text-sm font-semibold rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-2"
              >
                <span>{t('heroCta')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/about"
                className="px-5 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-sm font-semibold rounded-xl border border-white/30 transition-all"
              >
                {t('heroSecondary')}
              </Link>
            </div>

            {/* Micro Trust Points */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-300 pt-3 border-t border-white/15 w-full mt-2">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{language === 'bn' ? 'ক্যাশ অন ডেলিভারি' : 'Cash on Delivery'}</span>
              </div>
              <span aria-hidden="true" className="text-gray-500">·</span>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>{language === 'bn' ? '৬৪ জেলায় হোম ডেলিভারি' : '64 Districts Delivery'}</span>
              </div>
              <span aria-hidden="true" className="text-gray-500">·</span>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span>{language === 'bn' ? '৭ দিনের সহজ রিটার্ন' : '7 Days Easy Return'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Curated Categories Showcase */}
      <section className="py-12 md:py-16 bg-[#F6F2EA] border-b border-[#E8E1D5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <p className="text-xs font-semibold text-[#962D3E] tracking-wider uppercase mb-1">
                {t('exploreCategories')}
              </p>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1E1E1E]">
                {t('categoriesSub')}
              </h2>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#962D3E] hover:text-[#7D2232] transition-colors"
            >
              <span>{t('viewAll')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/shop?category=${cat.slug}`}
                className="group relative flex flex-col bg-white rounded-xl overflow-hidden border border-[#E7E0D3] shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <div className="aspect-[4/3] bg-[#EAE4D8] overflow-hidden">
                  <img
                    src={cat.image}
                    alt={language === 'bn' ? cat.nameBn : cat.nameEn}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-3.5 flex flex-col">
                  <h3 className="font-semibold text-sm sm:text-base text-[#1E1E1E] group-hover:text-[#962D3E] transition-colors">
                    {language === 'bn' ? cat.nameBn : cat.nameEn}
                  </h3>
                  <p className="text-xs text-[#7A7165] mt-0.5 line-clamp-1">
                    {language === 'bn' ? cat.descriptionBn : cat.descriptionEn}
                  </p>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* 3. Products Showcase */}
      <section className="py-12 md:py-20 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col items-center text-center mb-8">
            <h2 className="font-serif-luxury text-2xl sm:text-3xl md:text-4xl font-bold text-[#1E1E1E]">
              {language === 'bn' ? 'জনপ্রিয় ব্যাগ কালেকশন' : 'Popular Bags Collection'}
            </h2>
            <p className="text-xs sm:text-sm text-[#736A5E] mt-1 max-w-lg">
              {language === 'bn'
                ? 'অনন্য ডিজাইন ও নিখুঁত ফিনিশিংয়ে তৈরি আমাদের সর্বাধিক সমাদৃত ব্যাগ'
                : 'Handbags, totes, backpacks, and travel gear crafted for everyday elegance'}
            </p>

            <div className="flex items-center gap-1.5 p-1 bg-[#ECE5D8] rounded-xl mt-6">
              <button
                onClick={() => setActiveTab('featured')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'featured'
                    ? 'bg-white text-[#962D3E] shadow-sm'
                    : 'text-[#635B50] hover:text-[#1E1E1E]'
                }`}
              >
                {t('featuredProducts')}
              </button>
              <button
                onClick={() => setActiveTab('new')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'new'
                    ? 'bg-white text-[#962D3E] shadow-sm'
                    : 'text-[#635B50] hover:text-[#1E1E1E]'
                }`}
              >
                {t('newArrivals')}
              </button>
              <button
                onClick={() => setActiveTab('bestseller')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'bestseller'
                    ? 'bg-white text-[#962D3E] shadow-sm'
                    : 'text-[#635B50] hover:text-[#1E1E1E]'
                }`}
              >
                {t('bestSellers')}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-[3/4] bg-[#EBE4D8] rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#FAF7F2] hover:bg-[#F0E9DC] text-[#2D2A26] border border-[#CFC5B4] text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              <span>{t('viewAll')}</span>
              <ArrowRight className="w-4 h-4 text-[#962D3E]" />
            </Link>
          </div>

        </div>
      </section>

      {/* 4. Editorial Banner */}
      <section className="py-12 md:py-16 bg-[#F1EAE0] border-y border-[#E2D9CC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="flex flex-col gap-4">
              <span className="text-xs font-bold text-[#962D3E] tracking-widest uppercase">
                {language === 'bn' ? 'আমাদের দর্শন' : 'Our Philosophy'}
              </span>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1E1E1E]">
                {language === 'bn'
                  ? 'চীনের প্রিমিয়াম কোয়ালিটির ট্রেন্ডি ব্যাগ এখন বাংলাদেশে'
                  : 'Premium-Quality Trendy Bags from China, Now in Bangladesh'}
              </h2>
              <p className="text-xs sm:text-sm text-[#5C5449] leading-relaxed">
                {language === 'bn'
                  ? 'আধুনিক ডিজাইন - আকর্ষণীয় লুক'
                  : 'Modern Design - Attractive Look'}
              </p>
              <div className="pt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#962D3E] hover:underline"
                >
                  <span>{language === 'bn' ? 'আমাদের পুরো গল্পটি পড়ুন' : 'Read Our Full Story'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square rounded-xl overflow-hidden shadow-sm">
                <img
                  src="/src/assets/images/bag_commuter_backpack_1792675617985.jpg"
                  alt="Commuter Backpack"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square rounded-xl overflow-hidden shadow-sm mt-6">
                <img
                  src="/src/assets/images/bag_crescent_shoulder_1792675618851.jpg"
                  alt="Crescent Shoulder Bag"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Customer Reviews */}
      <section className="py-12 md:py-16 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-bold text-[#962D3E] tracking-wider uppercase mb-1">
              {t('customerReviews')}
            </p>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1E1E1E]">
              {t('reviewsSub')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white p-6 rounded-xl border border-[#E7E0D3] shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-[#E7A823] mb-3">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm text-[#3E3932] leading-relaxed italic">
                    "{language === 'bn' ? rev.commentBn : rev.commentEn}"
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#F2ECE3]">
                  <p className="text-xs font-bold text-[#1E1E1E]">
                    {language === 'bn' ? rev.customerNameBn : rev.customerNameEn}
                  </p>
                  <p className="text-[11px] text-[#857B6F]">
                    {language === 'bn' ? rev.districtBn : rev.districtEn}
                    <span aria-hidden="true"> · </span>
                    <span className="text-[#2E7D32] font-medium">{t('verifiedBuyer')}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
