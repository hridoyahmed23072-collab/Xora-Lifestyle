import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Sparkles, CheckCircle2, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
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

  const heroBgImage = "https://res.cloudinary.com/utod2jrs/image/upload/v1792817996/360_F_218404814_qrf76E5CfJ1WdTGE7qsiahYPNuqMKML1.jpg";

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 text-slate-900">
      
      {/* 1. Hero Campaign Section */}
      <section className="relative min-h-[580px] md:min-h-[640px] flex items-center bg-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroBgImage} 
            alt="Hero Background" 
            className="w-full h-full object-cover object-top opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/75 to-slate-950/30 md:to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 w-full">
          <div className="max-w-2xl flex flex-col items-start gap-5">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-rose-300 tracking-wider uppercase px-3.5 py-1.5 rounded-full bg-rose-950/40 backdrop-blur-md border border-rose-500/30">
              <Sparkles className="w-4 h-4 text-rose-400" />
              <span>{language === 'bn' ? 'আভিজাত্যের দেশীয় রূপ' : 'Pure Bangladeshi Craftsmanship'}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              {t('heroHeadline')}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl font-normal">
              {t('heroSub')}
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-3">
              <Link
                to="/shop"
                className="px-7 py-3.5 bg-rose-900 hover:bg-rose-800 text-white text-sm font-semibold rounded-xl shadow-lg shadow-rose-950/50 transition duration-300 flex items-center gap-2 transform hover:-translate-y-0.5"
              >
                <span>{t('heroCta')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/about"
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-sm font-semibold rounded-xl border border-white/25 transition duration-300"
              >
                {t('heroSecondary')}
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm text-slate-300 pt-6 border-t border-white/15 w-full mt-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{language === 'bn' ? 'ক্যাশ অন ডেলিভারি' : 'Cash on Delivery'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{language === 'bn' ? '৬৪ জেলায় হোম ডেলিভারি' : '64 Districts Delivery'}</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{language === 'bn' ? '৭ দিনের সহজ রিটার্ন' : '7 Days Easy Return'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Modern Curated Categories */}
      <section className="py-14 md:py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-rose-800 tracking-widest uppercase mb-1 block">
                {t('exploreCategories')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {t('categoriesSub')}
              </h2>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-900 hover:text-rose-700 transition"
            >
              <span>{t('viewAll')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/shop?category=${cat.slug}`}
                className="group relative flex flex-col bg-slate-50 rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-rose-200 transition-all duration-300 hover:-translate-y-1.5"
              >
                <div className="aspect-[4/3] bg-slate-200 overflow-hidden relative">
                  <img
                    src={cat.image}
                    alt={language === 'bn' ? cat.nameBn : cat.nameEn}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-4 flex flex-col bg-white">
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-rose-900 transition">
                    {language === 'bn' ? cat.nameBn : cat.nameEn}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                    {language === 'bn' ? cat.descriptionBn : cat.descriptionEn}
                  </p>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* 3. Products Showcase */}
      <section className="py-14 md:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col items-center text-center mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              {language === 'bn' ? 'জনপ্রিয় ব্যাগ কালেকশন' : 'Popular Bags Collection'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-lg">
              {language === 'bn'
                ? 'অনন্য ডিজাইন ও নিখুঁত ফিনিশিংয়ে তৈরি আমাদের সর্বাধিক সমাদৃত ব্যাগ'
                : 'Handbags, totes, backpacks, and travel gear crafted for everyday elegance'}
            </p>

            <div className="flex items-center gap-1.5 p-1.5 bg-slate-200/70 backdrop-blur-md rounded-2xl mt-7 border border-slate-300/50">
              <button
                onClick={() => setActiveTab('featured')}
                className={`px-5 py-2 text-xs font-bold rounded-xl transition-all ${
                  activeTab === 'featured'
                    ? 'bg-white text-rose-900 shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t('featuredProducts')}
              </button>
              <button
                onClick={() => setActiveTab('new')}
                className={`px-5 py-2 text-xs font-bold rounded-xl transition-all ${
                  activeTab === 'new'
                    ? 'bg-white text-rose-900 shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t('newArrivals')}
              </button>
              <button
                onClick={() => setActiveTab('bestseller')}
                className={`px-5 py-2 text-xs font-bold rounded-xl transition-all ${
                  activeTab === 'bestseller'
                    ? 'bg-white text-rose-900 shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t('bestSellers')}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-[3/4] bg-slate-200 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 text-xs font-extrabold rounded-xl shadow-sm transition hover:shadow-md"
            >
              <span>{t('viewAll')}</span>
              <ArrowRight className="w-4 h-4 text-rose-900" />
            </Link>
          </div>

        </div>
      </section>

      {/* 4. Editorial Story Banner */}
      <section className="py-14 md:py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="flex flex-col gap-5">
              <span className="text-xs font-extrabold text-rose-900 tracking-widest uppercase">
                {language === 'bn' ? 'আমাদের দর্শন' : 'Our Philosophy'}
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                {language === 'bn'
                  ? 'চীনের প্রিমিয়াম কোয়ালিটির ট্রেন্ডি ব্যাগ এখন বাংলাদেশে'
                  : 'Premium-Quality Trendy Bags from China, Now in Bangladesh'}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {language === 'bn'
                  ? 'আমরা সরাসরি প্রিমিয়াম ইমপোর্টেড কোয়ালিটি সুনিয়ন্ত্রিত মান পরীক্ষার মাধ্যমে সংগ্রহ করি, যাতে প্রতিটি ডিজাইনে পান আভিজাত্য ও স্থায়িত্ব।'
                  : 'Modern design with premium finishing imported directly for your everyday lifestyle.'}
              </p>
              <div className="pt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-sm font-bold text-rose-900 hover:text-rose-700 transition"
                >
                  <span>{language === 'bn' ? 'আমাদের পুরো গল্পটি পড়ুন' : 'Read Our Full Story'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-md border border-slate-200">
                <img
                  src="/src/assets/images/bag_commuter_backpack_1792675617985.jpg"
                  alt="Commuter Backpack"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square rounded-2xl overflow-hidden shadow-md border border-slate-200 mt-6">
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
      <section className="py-14 md:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-rose-900 tracking-widest uppercase block mb-1">
              {t('customerReviews')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {t('reviewsSub')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-md transition"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-4">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                    "{language === 'bn' ? rev.commentBn : rev.commentEn}"
                  </p>
                </div>

                <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      {language === 'bn' ? rev.customerNameBn : rev.customerNameEn}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {language === 'bn' ? rev.districtBn : rev.districtEn}
                    </p>
                  </div>
                  <span className="text-[11px] bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-1 rounded-md border border-emerald-200/60">
                    {t('verifiedBuyer')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
