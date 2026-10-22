import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { isFirebaseConfigured } from '../lib/firebase';

export const AdminLogin: React.FC = () => {
  const { login, loginAsDemoAdmin, adminEmail } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState(adminEmail);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      navigate('/admin');
    } else {
      setError(res.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleDemoLogin = () => {
    loginAsDemoAdmin();
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#E7E0D3] p-8 shadow-lg">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <span className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1E1E1E]">
              Xora Lifestyle
            </span>
          </Link>
          <div className="flex items-center justify-center gap-1.5 mt-1">
            <span className="text-[10px] text-[#887F74] tracking-widest uppercase font-semibold">
              Management Portal
            </span>
            <span className="px-1.5 py-0.5 bg-[#962D3E] text-white text-[9px] font-bold rounded">
              ADMIN
            </span>
          </div>
          <p className="text-xs text-[#6B6357] mt-3">
            Sign in with authorized administrator credentials to manage your store.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-[#FDEDED] border border-[#F5C2C7] rounded-xl text-xs text-[#D32F2F] flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-[#3D362C] block mb-1">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8C8377] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@xoralifestyle.com"
                className="w-full pl-9 pr-3.5 py-2.5 bg-[#FAF7F2] border border-[#D5CCC0] rounded-xl text-xs text-[#1E1E1E] focus:bg-white focus:outline-none focus:border-[#962D3E]"
              />
            </div>
            <p className="text-[10px] text-[#7A7165] mt-1">
              Authorized email: <strong className="text-[#1E1E1E]">{adminEmail}</strong>
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#3D362C] block mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8C8377] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 bg-[#FAF7F2] border border-[#D5CCC0] rounded-xl text-xs text-[#1E1E1E] focus:bg-white focus:outline-none focus:border-[#962D3E]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-[#962D3E] hover:bg-[#7D2232] text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* 1-Click Demo Login Helper */}
        <div className="mt-6 pt-5 border-t border-[#F0EAE0] flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-[11px] text-[#7A7165]">
            <span>{isFirebaseConfigured ? 'Firebase Auth Mode' : 'Demo Mode Active'}</span>
            <span className="text-[#2E7D32] font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Protected
            </span>
          </div>

          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-2.5 px-4 bg-[#FAF7F2] hover:bg-[#F2ECE3] text-[#3A352F] border border-[#D5CCC0] rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C49A45]" />
            <span>1-Click Demo Admin Login ({adminEmail})</span>
          </button>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-xs text-[#7A7165] hover:text-[#962D3E] font-medium">
            ← Return to Customer Storefront
          </Link>
        </div>

      </div>
    </div>
  );
};
