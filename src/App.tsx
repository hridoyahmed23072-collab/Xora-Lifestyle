import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { CartDrawer } from './components/CartDrawer';
import { FloatingContactButtons } from './components/FloatingContactButtons';

// Customer Pages
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetails } from './pages/ProductDetails';
import { CartPage } from './pages/CartPage';
import { Checkout } from './pages/Checkout';
import { OrderSuccess } from './pages/OrderSuccess';
import { TrackOrder } from './pages/TrackOrder';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Returns } from './pages/Returns';
import { DeliveryInfo } from './pages/DeliveryInfo';
import { NotFound } from './pages/NotFound';

// Admin Portal Pages
import { AdminLayout } from './admin/AdminLayout';
import { AdminLogin } from './admin/AdminLogin';
import { AdminDashboard } from './admin/AdminDashboard';
import { AdminProducts } from './admin/AdminProducts';
import { AdminCategories } from './admin/AdminCategories';
import { AdminOrders } from './admin/AdminOrders';
import { AdminReviews } from './admin/AdminReviews';
import { AdminSettings } from './admin/AdminSettings';

// Toast Notification component for Add to Cart feedback
const CartNotificationToast: React.FC = () => {
  const { addedToastMessage, dismissToast } = useCart();
  const { language } = useLanguage();

  if (!addedToastMessage) return null;

  return (
    <div className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#1E1E1E] text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-semibold animate-in fade-in slide-in-from-bottom-3 duration-200 border border-[#3A3A3A]">
      <span className="w-2 h-2 rounded-full bg-[#2E7D32]" />
      <span>
        {language === 'bn'
          ? `"${addedToastMessage}" ব্যাগে যোগ হয়েছে`
          : `Added "${addedToastMessage}" to bag`}
      </span>
      <button
        onClick={dismissToast}
        className="text-[#999] hover:text-white ml-2 text-[11px]"
      >
        ✕
      </button>
    </div>
  );
};

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <ErrorBoundary>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
      </ErrorBoundary>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1E1E1E] font-bengali selection:bg-[#962D3E] selection:text-white">
      {/* 1. Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Sticky Header */}
      <Header />

      {/* 3. Main Viewport Content */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success/:id" element={<OrderSuccess />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/returns" element={<Returns />} />
          <Route path="/delivery" element={<DeliveryInfo />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* 4. Footer */}
      <Footer />

      {/* 5. Mobile Bottom Navigation (Ergonomic touch bar) */}
      <MobileBottomNav />

      {/* 6. Slide-Over Cart Drawer */}
      <CartDrawer />

      {/* 7. Floating WhatsApp & Messenger Quick Chat Buttons */}
      <FloatingContactButtons />

      {/* 8. Cart Item Added Toast */}
      <CartNotificationToast />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

