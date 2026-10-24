import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Star, ShoppingBag, Sparkles } from 'lucide-react';
import { categories, sampleReviews } from '../lib/constants';
import ProductCard from '../components/ProductCard';
import { useLanguage } from '../context/LanguageContext';
import { getProducts, getReviews } from '../services/storeService';
import { Product, Review } from '../types';

export default function Home() {
  const { t, language } = useLanguage();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, reviewsData] = await Promise.all([
          getProducts(),
          getReviews()
        ]);
        
        const featured = productsData.filter(p => p.isFeatured || p.isNew);
        setFeaturedProducts(featured.length > 0 ? featured.slice(0, 8) : productsData.slice(0, 8));
        setReviews(reviewsData.length > 0 ? reviewsData.slice(0, 3) : sampleReviews);
      } catch (error) {
        console.error('Error fetching home page data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const heroBgImage = "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=2000";

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative min-h-[580px] md:min-h-[640px] flex items-center bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroBgImage} 
            alt="Hero Background" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/40 md:to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-medium text-amber-300">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{t('heroSubtag')}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              {t('heroTitle')}
            </h1>

            <p className="text-base sm:text-lg text-gray-200 leading-relaxed max-w-xl">
              {t('heroDesc')}
            </p>

            <div className="pt-2 flex flex-wrap gap-4 items-center">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-rose-700 hover:bg-rose-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-rose-900/30 transition duration-300 transform hover:-translate-y-0.5"
              >
                <span>{t('shopCollection')}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-medium rounded-xl transition duration-300"
              >
                <span>{t('aboutUs')}</span>
              </Link>
            </div>

            <div className="pt-8 border-t border-white/15 grid grid-cols-3 gap-3 text-xs sm:text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{t('codAvailable')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{t('fastDelivery')}</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{t('easyReturn')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {language === 'bn' ? 'ক্যাটাগরি সমূহ' : 'Shop by Category'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {language === 'bn' ? 'আপনার পছন্দের ব্যাগ ক্যাটাগরি বেছে নিন' : 'Find the perfect bag for any occasion'}
            </p>
          </div>
          <Link to="/shop" className="text-rose-700 hover:text-rose-800 text-sm font-semibold flex items-center gap-1">
            <span>{language === 'bn' ? 'সবগুলো দেখুন' : 'View All'}</span>
            <span className="text-lg">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.id}`}
              className="group relative rounded-2xl overflow-hidden bg-gray-100 aspect-square shadow-sm hover:shadow-md transition duration-300"
            >
              <img
                src={cat.image}
                alt={cat.name[language]}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-3">
                <span className="text-white font-medium text-sm sm:text-base text-center w-full">
                  {cat.name[language]}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {language === 'bn' ? 'জনপ্রিয় কালেকশন' : 'Popular Collection'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {language === 'bn' ? 'আমাদের সেরা এবং ট্রেন্ডি ব্যাগসমূহ' : 'Our top rated and trending bags'}
            </p>
          </div>
          <Link to="/shop" className="text-rose-700 hover:text-rose-800 text-sm font-semibold flex items-center gap-1">
            <span>{language === 'bn' ? 'সব ব্যাগ দেখুন' : 'View All Bags'}</span>
            <span className="text-lg">→</span>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-200 rounded-2xl h-72"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Brand Message Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-rose-50 border border-rose-100 rounded-3xl p-8 sm:p-12 text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-block p-3 bg-rose-100 text-rose-700 rounded-2xl">
            <ShoppingBag className="w-8 h-8" />
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {language === 'bn' ? 'চীনের প্রিমিয়াম কোয়ালিটির ট্রেন্ডি ব্যাগ এখন বাংলাদেশে' : 'China Premium Quality Trendy Bags Now in Bangladesh'}
          </h2>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            {language === 'bn' 
              ? 'আমরা সরাসরি চায়না থেকে প্রিমিয়াম কোয়ালিটির ব্যাগের কালেকশন ইমপোর্ট করে আপনার কাছে পৌঁছে দিই। প্রতিটি ব্যাগের আধুনিক ডিজাইন ও প্রিমিয়াম ফিনিশিং।' 
              : 'We import premium quality bag collections directly from China and deliver to your doorstep. Modern design with premium finishing.'}
          </p>
          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-rose-700 text-white font-semibold rounded-xl hover:bg-rose-800 transition"
            >
              <span>{t('shopNow')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      {reviews.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {language === 'bn' ? 'গ্রাহকদের মতামত' : 'Customer Reviews'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {language === 'bn' ? 'আমাদের সম্মানিত ক্রেতাদের সন্তুষ্টির অভিজ্ঞতা' : 'Experiences from our satisfied buyers'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(rev.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm italic">"{rev.comment}"</p>
                <div className="border-t border-gray-50 pt-3 flex justify-between items-center text-xs text-gray-500">
                  <span className="font-semibold text-gray-800">{rev.userName}</span>
                  <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-medium">
                    {language === 'bn' ? 'যাচাইকৃত ক্রেতা' : 'Verified Buyer'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
