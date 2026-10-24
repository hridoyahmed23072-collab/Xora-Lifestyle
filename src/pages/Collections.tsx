import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { storeService } from '../services/storeService';
import { Category, Product } from '../types';

export const Collections: React.FC = () => {
  const { language, t } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    Promise.all([storeService.getCategories(), storeService.getProducts()])
      .then(([cats, prods]) => {
        if (!alive) return;
        setCategories(cats);
        setProducts(prods);
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const countFor = (cat: Category) =>
    products.filter((p) => p.categoryId === cat.id || p.categoryId === cat.slug).length;

  return (
    <div className="py-8 md:py-12 bg-[#FAF7F2] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-serif-luxury text-2xl sm:text-3xl md:text-4xl font-bold text-[#1E1E1E]">
            {t('collectionsTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-[#736A5E] mt-1">{t('collectionsSub')}</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="aspect-[4/3] rounded-2xl bg-[#EAE4D8] animate-pulse" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <p className="text-sm text-[#736A5E]">{t('noProductsFound')}</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {categories.map((cat) => {
              const name = language === 'bn' ? cat.nameBn : cat.nameEn;
              const count = countFor(cat);
              return (
                <Link
                  key={cat.id}
                  to={`/shop?category=${cat.slug}`}
                  className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-[#E7E0D3] shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="aspect-[4/3] bg-[#EAE4D8] overflow-hidden">
                    <img
                      src={cat.image}
                      alt={name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4 flex flex-col gap-1">
                    <h2 className="font-semibold text-sm sm:text-base text-[#1E1E1E] group-hover:text-[#962D3E] transition-colors">
                      {name}
                    </h2>
                    <p className="text-xs text-[#7A7165] line-clamp-2">
                      {language === 'bn' ? cat.descriptionBn : cat.descriptionEn}
                    </p>
                    <div className="flex items-center justify-between mt-2 text-xs">
                      <span className="text-[#8C8377]">
                        {count} {language === 'bn' ? 'টি ব্যাগ' : count === 1 ? 'bag' : 'bags'}
                      </span>
                      <span className="inline-flex items-center gap-1 font-semibold text-[#962D3E]">
                        {language === 'bn' ? 'দেখুন' : 'View'} <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
