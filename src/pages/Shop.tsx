import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { useLanguage } from '../context/LanguageContext';
import { storeService } from '../services/storeService';
import { Category, Product } from '../types';

export const Shop: React.FC = () => {
  const { language, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get('category') || 'all'
  );
  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams.get('search') || ''
  );
  const [sortBy, setSortBy] = useState<string>('popular');
  const [maxPrice, setMaxPrice] = useState<number>(5000);

  useEffect(() => {
    Promise.all([storeService.getProducts(), storeService.getCategories()]).then(
      ([prodData, catData]) => {
        setProducts(prodData);
        setCategories(catData);
        setLoading(false);
      }
    );
  }, []);

  // Sync state with URL params
  useEffect(() => {
    const urlCat = searchParams.get('category');
    const urlSearch = searchParams.get('search');
    if (urlCat) setSelectedCategory(urlCat);
    if (urlSearch !== null) setSearchQuery(urlSearch);
  }, [searchParams]);

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    if (slug === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', slug);
    }
    setSearchParams(searchParams);
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSortBy('popular');
    setMaxPrice(5000);
    setSearchParams({});
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(
        (p) => p.categoryId === selectedCategory || p.slug.includes(selectedCategory)
      );
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.nameBn.toLowerCase().includes(q) ||
          p.nameEn.toLowerCase().includes(q) ||
          p.categoryNameBn.toLowerCase().includes(q) ||
          p.categoryNameEn.toLowerCase().includes(q)
      );
    }

    // Price filter
    result = result.filter((p) => p.price <= maxPrice);

    // Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      // Default: popularity / rating
      result.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
    }

    return result;
  }, [products, selectedCategory, searchQuery, maxPrice, sortBy]);

  return (
    <div className="py-8 md:py-12 bg-[#FAF7F2] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="mb-8">
          <h1 className="font-serif-luxury text-2xl sm:text-3xl md:text-4xl font-bold text-[#1E1E1E]">
            {t('shopTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-[#736A5E] mt-1">
            {t('shopSub')}
          </p>
        </div>

        {/* Filter & Controls Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E7E0D3] shadow-sm mb-8 flex flex-col gap-4">
          
          {/* Top Row: Search input & Sort dropdown */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#8C8377] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full pl-9 pr-4 py-2 bg-[#FAF7F2] border border-[#DDD4C7] rounded-lg text-xs sm:text-sm text-[#1E1E1E] focus:outline-none focus:border-[#962D3E]"
              />
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-xs font-medium text-[#6B6357] shrink-0">
                {t('filterSort')}:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="py-2 px-3 bg-[#FAF7F2] border border-[#DDD4C7] rounded-lg text-xs font-semibold text-[#1E1E1E] focus:outline-none focus:border-[#962D3E]"
              >
                <option value="popular">{t('sortPopular')}</option>
                <option value="price-asc">{t('sortPriceAsc')}</option>
                <option value="price-desc">{t('sortPriceDesc')}</option>
                <option value="newest">{t('sortNewest')}</option>
              </select>
            </div>
          </div>

          {/* Bottom Row: Category segmented tabs & price range */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-3 border-t border-[#F2ECE3]">
            {/* Category Segmented Control */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => handleCategoryChange('all')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-[#962D3E] text-white shadow-sm'
                    : 'bg-[#F2ECE3] text-[#595247] hover:bg-[#EAE2D5]'
                }`}
              >
                {t('filterAll')}
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleCategoryChange(c.slug)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    selectedCategory === c.slug
                      ? 'bg-[#962D3E] text-white shadow-sm'
                      : 'bg-[#F2ECE3] text-[#595247] hover:bg-[#EAE2D5]'
                  }`}
                >
                  {language === 'bn' ? c.nameBn : c.nameEn}
                </button>
              ))}
            </div>

            {/* Price Slider */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-[#6B6357] whitespace-nowrap">
                {t('filterPrice')}: ৳{maxPrice}
              </span>
              <input
                type="range"
                min="500"
                max="5000"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-28 sm:w-36 accent-[#962D3E] cursor-pointer"
              />
              {(selectedCategory !== 'all' || searchQuery || maxPrice < 5000 || sortBy !== 'popular') && (
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-1 text-[11px] text-[#962D3E] hover:underline font-semibold ml-2"
                  title={t('clearFilters')}
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{t('clearFilters')}</span>
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Results Counter */}
        <div className="mb-4 text-xs text-[#7A7165]">
          <span>
            {language === 'bn'
              ? `মোট ${filteredProducts.length.toString().replace(/[0-9]/g, (w) => ['০','১','২','৩','৪','৫','৬','৭','৮','৯'][+w])}টি ব্যাগ পাওয়া গেছে`
              : `Found ${filteredProducts.length} bags`}
          </span>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-[3/4] bg-[#EBE4D8] rounded-xl" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E7E0D3] p-12 text-center max-w-md mx-auto my-12">
            <SlidersHorizontal className="w-12 h-12 text-[#9E9589] mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#1E1E1E] mb-1">
              {t('noProductsFound')}
            </h3>
            <p className="text-xs text-[#7A7165] mb-5">
              {language === 'bn'
                ? 'অন্য কোনো নাম লিখে সার্চ করুন অথবা ফিল্টার রিসেট করে সব কালেকশন দেখুন।'
                : 'Try searching with different terms or reset your filters.'}
            </p>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 bg-[#962D3E] text-white text-xs font-semibold rounded-lg hover:bg-[#7D2232] transition-colors"
            >
              {t('clearFilters')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
