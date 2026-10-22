import React, { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Star,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { isFirebaseConfigured, db } from '../lib/firebase';

export const AdminLayout: React.FC = () => {
  const { user, isAdmin, loading, logout, adminEmail } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F2EB] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#962D3E] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-[#6B6357] font-medium">Verifying administrator authorization...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#F5F2EB] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-[#E5DDD0] shadow-md text-center flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#FAF0F2] text-[#962D3E] flex items-center justify-center">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-bold text-[#1E1E1E]">Restricted Admin Area</h2>
          <p className="text-xs text-[#6B6357] leading-relaxed">
            You must be signed in with the authorized admin account (<strong>{adminEmail}</strong>) to access the Xora Lifestyle management console.
          </p>
          <div className="flex flex-col sm:flex-row gap-2.5 w-full mt-2">
            <button
              onClick={() => navigate('/admin/login')}
              className="flex-1 py-2.5 bg-[#962D3E] text-white text-xs font-bold rounded-xl hover:bg-[#7D2232] transition-colors"
            >
              Sign In to Admin
            </button>
            <Link
              to="/"
              className="flex-1 py-2.5 bg-[#FAF7F2] text-[#2D2A26] border border-[#DDD4C5] text-xs font-bold rounded-xl hover:bg-[#EFE9DF] transition-colors text-center"
            >
              Back to Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { to: '/admin/products', label: 'Products', icon: Package },
    { to: '/admin/categories', label: 'Categories', icon: Layers },
    { to: '/admin/reviews', label: 'Reviews', icon: Star },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F7F4EE] flex flex-col md:flex-row text-[#1E1E1E]">
      
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-[#1E1E1E] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="font-serif-luxury text-base font-bold text-white tracking-wide">
            Xora Admin
          </span>
          <span className="px-1.5 py-0.5 bg-[#962D3E] text-white text-[9px] font-bold rounded">
            PORTAL
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/"
            target="_blank"
            className="p-1.5 text-[#B3A99B] hover:text-white"
            title="Open Store"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar for Desktop & Mobile Drawer */}
      <aside
        className={`w-full md:w-64 bg-[#1A1816] text-[#D5CEC4] flex flex-col justify-between shrink-0 md:sticky md:top-0 md:h-screen z-40 transition-all ${
          mobileMenuOpen ? 'block' : 'hidden md:flex'
        }`}
      >
        <div>
          {/* Brand Wordmark */}
          <div className="p-6 border-b border-[#2C2925] flex items-center justify-between">
            <div>
              <Link to="/admin" className="font-serif-luxury text-xl font-bold text-white tracking-tight block">
                Xora Lifestyle
              </Link>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-[#A69E93] tracking-widest uppercase">Admin Console</span>
                <span className="px-1.5 py-0.2 bg-[#962D3E] text-white text-[9px] font-bold rounded">
                  PORTAL
                </span>
              </div>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="p-4 flex flex-col gap-1 text-xs font-semibold">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? location.pathname === item.to
                : location.pathname.startsWith(item.to);

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.exact}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                    isActive
                      ? 'bg-[#962D3E] text-white shadow-sm'
                      : 'text-[#A8A094] hover:bg-[#262320] hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#2C2925] flex flex-col gap-3">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-[#A8A094] hover:text-white hover:bg-[#262320] transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-[#E7C677]" />
              <span>Customer Storefront</span>
            </span>
            <span className="text-[10px] text-[#7A7165]">Live</span>
          </Link>

          <div className="flex items-center justify-between pt-2 border-t border-[#2C2925] text-xs">
            <div className="truncate mr-2">
              <p className="text-[11px] text-white font-medium truncate">{user.email}</p>
              <p className="text-[9px] text-[#7A7165]">Administrator</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-[#A8A094] hover:text-[#D32F2F] hover:bg-[#262320] rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Content Canvas */}
      <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
        {/* Live Firebase Connected vs Demo Mode Connection Status Banner */}
        {isFirebaseConfigured && db ? (
          <div className="mb-6 p-3.5 bg-[#EAF8EE] border border-[#BDE8C6] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-[#1E7E34] shrink-0" />
              <div>
                <p className="text-xs font-bold text-[#155724] flex items-center gap-1.5">
                  <span>Live: Firebase connected</span>
                  <span className="text-[10px] font-medium px-2 py-0.5 bg-[#D4EDDA] text-[#155724] rounded-full">
                    Cloud Firestore & Auth Active
                  </span>
                </p>
                <p className="text-[11px] text-[#1E7E34] mt-0.5">
                  Connected to Firebase Project <code className="font-mono font-bold bg-[#D4EDDA] px-1 py-0.5 rounded text-[10px]">{import.meta.env.VITE_FIREBASE_PROJECT_ID || 'Active'}</code>. All order transactions and catalog edits are synced to the cloud.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-[#1E7E34] bg-white px-3 py-1.5 rounded-xl border border-[#BDE8C6] self-start sm:self-auto shrink-0 shadow-2xs">
              Live Cloud Active
            </span>
          </div>
        ) : (
          <div className="mb-6 p-3.5 bg-[#FFF9E6] border border-[#F0DFA8] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-[#E7A823] animate-pulse shrink-0" />
              <div>
                <p className="text-xs font-bold text-[#805B00] flex items-center gap-1.5">
                  <span>Demo Mode</span>
                  <span className="text-[10px] font-medium px-2 py-0.5 bg-[#F6EDD0] text-[#7A5700] rounded-full">
                    LocalStorage Cache
                  </span>
                </p>
                <p className="text-[11px] text-[#8C6D1F] mt-0.5">
                  Currently running in offline demo mode. Provide <code className="font-mono bg-[#FAF2DA] px-1 py-0.5 rounded text-[10px]">VITE_FIREBASE_API_KEY</code> and <code className="font-mono bg-[#FAF2DA] px-1 py-0.5 rounded text-[10px]">VITE_FIREBASE_PROJECT_ID</code> in environment variables to enable live cloud persistence.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-[#805B00] bg-white px-3 py-1.5 rounded-xl border border-[#F0DFA8] self-start sm:self-auto shrink-0 shadow-2xs">
              Demo Active
            </span>
          </div>
        )}

        <Outlet />
      </main>

    </div>
  );
};
