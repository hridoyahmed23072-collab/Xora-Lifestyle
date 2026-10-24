import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, Globe, Menu, X, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { storeService } from '../services/storeService';
import { Product } from '../types';

export const Header: React.FC = () => {
  const { language, toggleLanguage, t, formatPrice } = useLanguage();
  const { totalItems, openDrawer } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isNewArrivalsPage =
    location.pathname === '/shop' && new URLSearchParams(location.search).get('filter') === 'new';

  useEffect(() => {
    storeService.getProducts().then(setAllProducts);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setSearchQuery('');
  }, [location.pathname]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.toLowerCase();
    const results = allProducts.filter(
      (p) =>
        p.nameBn.toLowerCase().includes(q) ||
        p.nameEn.toLowerCase().includes(q) ||
        p.categoryNameBn.toLowerCase().includes(q) ||
        p.categoryNameEn.toLowerCase().includes(q)
    ).slice(0, 5);
    setSearchResults(results);
  }, [searchQuery, allProducts]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8E1D5] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          
          {/* Mobile Menu Button & Zone 1: Wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -ml-2 text-[#2D2D2D] hover:text-[#962D3E] md:hidden rounded-lg transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link to="/" className="flex flex-col group">
              <span className="font-serif-luxury text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-[#1E1E1E] group-hover:text-[#962D3E] transition-colors leading-none">
                Xora Lifestyle
              </span>
              <span className="text-[10px] text-[#7A7268] tracking-widest uppercase mt-0.5 font-medium">
                {language === 'bn' ? 'জোড়া লাইফস্টাইল' : 'Trendy Premium Bags'}
              </span>
            </Link>
          </div>

          {/* Zone 2: Navigation Links (Clean text links with hover underline) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#4A453F]">
            <Link
              to="/"
              className={`hover:text-[#962D3E] transition-colors pb-0.5 border-b-2 ${
                location.pathname === '/' ? 'border-[#962D3E] text-[#962D3E] font-semibold' : 'border-transparent'
              }`}
            >
              {t('navHome')}
            </Link>
            <Link
              to="/shop"
              className={`hover:text-[#962D3E] transition-colors pb-0.5 border-b-2 ${
                location.pathname === '/shop' && !isNewArrivalsPage ? 'border-[#962D3E] text-[#962D3E] font-semibold' : 'border-transparent'
              }`}
            >
              {t('navShop')}
            </Link>
            <Link
              to="/collections"
              className={`hover:text-[#962D3E] transition-colors pb-0.5 border-b-2 ${
                location.pathname.startsWith('/collections') ? 'border-[#962D3E] text-[#962D3E] font-semibold' : 'border-transparent'
              }`}
            >
              {t('navCollection')}
            </Link>
            <Link
              to="/shop?filter=new"
              className={`hover:text-[#962D3E] transition-colors pb-0.5 border-b-2 ${
                isNewArrivalsPage ? 'border-[#962D3E] text-[#962D3E] font-semibold' : 'border-transparent'
              }`}
            >
              {t('navNewArrivals')}
            </Link>
            <Link
              to="/track-order"
              className={`hover:text-[#962D3E] transition-colors pb-0.5 border-b-2 ${
                location.pathname === '/track-order' ? 'border-[#962D3E] text-[#962D3E] font-semibold' : 'border-transparent'
              }`}
            >
              {t('navTrackOrder')}
            </Link>
            <Link
              to="/about"
              className={`hover:text-[#962D3E] transition-colors pb-0.5 border-b-2 ${
                location.pathname === '/about' ? 'border-[#962D3E] text-[#962D3E] font-semibold' : 'border-transparent'
              }`}
            >
              {t('navAbout')}
            </Link>
          </nav>

          {/* Zone 3: Search, Language Toggle & Shopping Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-[#3A3530] hover:text-[#962D3E] hover:bg-[#F2ECE1] rounded-full transition-colors"
              aria-label="Search items"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Language Toggle Button */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border border-[#DCD3C5] bg-[#FAF7F2] hover:bg-[#F0E9DC] hover:border-[#962D3E] text-[#332E27] transition-all"
              title={language === 'bn' ? 'Switch to English' : 'বাংলায় পরিবর্তন করুন'}
            >
              <Globe className="w-3.5 h-3.5 text-[#962D3E]" />
              <span>{language === 'bn' ? 'EN' : 'বাং'}</span>
            </button>

            {/* Shopping Bag Button with Counter */}
            <button
              onClick={openDrawer}
              className="relative p-2.5 bg-[#962D3E] text-white rounded-full hover:bg-[#7D2232] transition-transform active:scale-95 shadow-sm"
              aria-label="Open Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#1E1E1E] text-white text-[10px] font-bold h-4 min-w-4 px-1 rounded-full flex items-center justify-center border-2 border-[#FAF7F2]">
                  {language === 'bn'
                    ? totalItems.toString().replace(/[0-9]/g, (w) => ['০','১','২','৩','৪','৫','৬','৭','৮','৯'][+w])
                    : totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Search Drawer */}
      {searchOpen && (
        <div className="border-t border-[#E8E1D5] bg-[#FAF7F2] px-4 py-3 shadow-md animate-in slide-in-from-top-2 duration-200">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="w-5 h-5 text-[#887F74] absolute left-3" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full pl-10 pr-24 py-2.5 bg-white border border-[#D5CCC0] rounded-lg text-sm text-[#1E1E1E] placeholder-[#887F74] focus:outline-none focus:border-[#962D3E] focus:ring-1 focus:ring-[#962D3E]"
              />
              <button
                type="submit"
                className="absolute right-2 px-3 py-1 bg-[#962D3E] text-white text-xs font-medium rounded-md hover:bg-[#7D2232] transition-colors"
              >
                {t('filterSort') === 'সাজান' ? 'খুঁজুন' : 'Search'}
              </button>
            </form>

            {/* Quick Live Results */}
            {searchResults.length > 0 && (
              <div className="mt-2 bg-white rounded-lg border border-[#E3DBD0] shadow-lg divide-y divide-[#F1ECE4] max-h-72 overflow-y-auto">
                {searchResults.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    onClick={() => setSearchOpen(false)}
                    className="flex items-center gap-3 p-2.5 hover:bg-[#FAF7F2] transition-colors"
                  >
                    <img
                      src={product.images[0]}
                      alt={language === 'bn' ? product.nameBn : product.nameEn}
                      className="w-12 h-12 object-cover rounded bg-[#F1ECE4] shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[#8A8175] truncate">
                        {language === 'bn' ? product.categoryNameBn : product.categoryNameEn}
                      </p>
                      <p className="text-sm font-medium text-[#1E1E1E] truncate">
                        {language === 'bn' ? product.nameBn : product.nameEn}
                      </p>
                      <p className="text-xs font-semibold text-[#962D3E]">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#A89F93] shrink-0" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E8E1D5] bg-[#FAF7F2] px-6 py-5 shadow-lg">
          <nav className="flex flex-col gap-4 text-base font-medium text-[#38332D]">
            <Link
              to="/"
              className="py-1 hover:text-[#962D3E] transition-colors border-b border-[#F0EAE0]"
            >
              {t('navHome')}
            </Link>
            <Link
              to="/shop"
              className="py-1 hover:text-[#962D3E] transition-colors border-b border-[#F0EAE0]"
            >
              {t('navShop')}
            </Link>
            <Link
              to="/collections"
              className="py-1 hover:text-[#962D3E] transition-colors border-b border-[#F0EAE0]"
            >
              {t('navCollection')}
            </Link>
            <Link
              to="/shop?category=tote-bags"
              className="py-1 hover:text-[#962D3E] transition-colors border-b border-[#F0EAE0]"
            >
              {language === 'bn' ? 'টোট ব্যাগ' : 'Tote Bags'}
            </Link>
            <Link
              to="/shop?filter=new"
              className="py-1 hover:text-[#962D3E] transition-colors border-b border-[#F0EAE0]"
            >
              {t('navNewArrivals')}
            </Link>
            <Link
              to="/shop?category=shoulder-bags"
              className="py-1 hover:text-[#962D3E] transition-colors border-b border-[#F0EAE0]"
            >
              {language === 'bn' ? 'শোল্ডার ব্যাগ' : 'Shoulder Bags'}
            </Link>
            <Link
              to="/shop?category=travel-bags"
              className="py-1 hover:text-[#962D3E] transition-colors border-b border-[#F0EAE0]"
            >
              {language === 'bn' ? 'ট্রাভেল ব্যাগ' : 'Travel Bags'}
            </Link>
            <Link
              to="/track-order"
              className="py-1 hover:text-[#962D3E] transition-colors border-b border-[#F0EAE0]"
            >
              {t('navTrackOrder')}
            </Link>
            <Link
              to="/about"
              className="py-1 hover:text-[#962D3E] transition-colors border-b border-[#F0EAE0]"
            >
              {t('navAbout')}
            </Link>
            <Link
              to="/contact"
              className="py-1 hover:text-[#962D3E] transition-colors"
            >
              {t('navContact')}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
