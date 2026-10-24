import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  CheckCircle2,
  Truck,
  Smartphone,
  Phone,
  Info,
  Database,
  Trash2,
  UploadCloud,
  AlertTriangle,
  Cloud,
  Copy,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { storeService } from '../services/storeService';
import {
  isFirebaseConfigured,
  firebaseConfig,
  saveFirebaseConfig,
  clearFirebaseConfig,
} from '../lib/firebase';
import { StoreSettings } from '../types';

export const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedToast, setSavedToast] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Firebase Config State
  const [fbApiKey, setFbApiKey] = useState(firebaseConfig.apiKey || '');
  const [fbProjectId, setFbProjectId] = useState(firebaseConfig.projectId || '');
  const [fbAuthDomain, setFbAuthDomain] = useState(firebaseConfig.authDomain || '');
  const [fbStorageBucket, setFbStorageBucket] = useState(firebaseConfig.storageBucket || '');
  const [fbMessagingSenderId, setFbMessagingSenderId] = useState(firebaseConfig.messagingSenderId || '');
  const [fbAppId, setFbAppId] = useState(firebaseConfig.appId || '');
  const [fbPasteSnippet, setFbPasteSnippet] = useState('');
  const [copiedVercel, setCopiedVercel] = useState(false);

  useEffect(() => {
    storeService.getSettings().then((data) => {
      setSettings(data);
      setLoading(false);
    });
  }, []);

  const handleImportSampleData = async () => {
    if (
      !confirm(
        'Import sample bag categories, products, customer reviews, and default settings to your Cloud Firestore database? (This will populate Firestore with valid bag items).'
      )
    ) {
      return;
    }

    setImporting(true);
    setActionMessage(null);
    setActionError(null);
    try {
      const res = await storeService.importSampleDataToFirestore();
      setActionMessage(
        `Success! Imported ${res.counts.products} bag products, ${res.counts.categories} categories, and ${res.counts.reviews} reviews into Firestore.`
      );
    } catch (err: any) {
      setActionError(err.message || 'Failed to import sample data to Firestore');
    } finally {
      setImporting(false);
    }
  };

  const handleDeleteAllProducts = async () => {
    if (
      !confirm(
        'WARNING: This will permanently delete ALL products from both Cloud Firestore and local storage so you can start completely fresh. Proceed?'
      )
    ) {
      return;
    }

    setDeleting(true);
    setActionMessage(null);
    setActionError(null);
    try {
      const res = await storeService.deleteAllProducts();
      setActionMessage(
        `All products have been deleted successfully (${res.deletedCount} items removed from Firestore). The store catalog is now empty.`
      );
    } catch (err: any) {
      setActionError(err.message || 'Failed to delete products');
    } finally {
      setDeleting(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setSaveError(null);
    try {
      await storeService.updateSettings(settings);
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 3500);
    } catch (err: any) {
      setSavedToast(false);
      setSaveError(err?.message || 'Could not save settings to Firebase.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return <div className="p-8 text-center text-xs text-[#7A7165]">Loading settings...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1E1E1E]">
            Store Settings
          </h1>
          <p className="text-xs text-[#7A7165] mt-1">
            Configure delivery charges, bKash/Nagad accounts, contact info, and promotional policies.
          </p>
        </div>

        {saveError && (
          <div className="px-3 py-1.5 bg-[#FDECEC] border border-[#F3B8B8] text-[#B42318] text-xs font-semibold rounded-xl max-w-sm">
            Save failed: {saveError}
          </div>
        )}

        {savedToast && (
          <div className="px-3 py-1.5 bg-[#EAF8EE] border border-[#BDE8C6] text-[#1E7E34] text-xs font-semibold rounded-xl flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings saved successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-6 text-xs text-[#3D362C]">
        
        {/* Section 1: Delivery Charges */}
        <div className="bg-white p-6 rounded-2xl border border-[#E7E0D3] shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-[#F0EAE0] pb-3">
            <Truck className="w-5 h-5 text-[#962D3E]" />
            <h2 className="font-bold text-sm text-[#1E1E1E]">
              Nationwide Delivery Charges (BDT)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold block mb-1">Inside Dhaka Rate (৳) *</label>
              <input
                type="number"
                required
                min="0"
                value={settings.insideDhakaCharge}
                onChange={(e) =>
                  setSettings({ ...settings, insideDhakaCharge: Number(e.target.value) })
                }
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5CCC0] rounded-xl tabular-nums font-bold"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Outside Dhaka Rate (৳) *</label>
              <input
                type="number"
                required
                min="0"
                value={settings.outsideDhakaCharge}
                onChange={(e) =>
                  setSettings({ ...settings, outsideDhakaCharge: Number(e.target.value) })
                }
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5CCC0] rounded-xl tabular-nums font-bold"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Mobile Banking (bKash & Nagad) */}
        <div className="bg-white p-6 rounded-2xl border border-[#E7E0D3] shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-[#F0EAE0] pb-3">
            <Smartphone className="w-5 h-5 text-[#962D3E]" />
            <h2 className="font-bold text-sm text-[#1E1E1E]">
              Mobile Banking Wallet Numbers (Checkout)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold block mb-1 text-[#E2136E]">
                Official bKash Number (Send Money) *
              </label>
              <input
                type="text"
                required
                value={settings.bkashNumber}
                onChange={(e) => setSettings({ ...settings, bkashNumber: e.target.value })}
                placeholder="01711234567"
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5CCC0] rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1 text-[#F7931E]">
                Official Nagad Number (Send Money) *
              </label>
              <input
                type="text"
                required
                value={settings.nagadNumber}
                onChange={(e) => setSettings({ ...settings, nagadNumber: e.target.value })}
                placeholder="01711234567"
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5CCC0] rounded-xl font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Contact & Store Info */}
        <div className="bg-white p-6 rounded-2xl border border-[#E7E0D3] shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-[#F0EAE0] pb-3">
            <Phone className="w-5 h-5 text-[#962D3E]" />
            <h2 className="font-bold text-sm text-[#1E1E1E]">
              Contact Channels & Address
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold block mb-1">Customer Support Hotline *</label>
              <input
                type="text"
                required
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5CCC0] rounded-xl"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">WhatsApp Floating Number *</label>
              <input
                type="text"
                required
                value={settings.whatsapp}
                onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                placeholder="+8801711234567"
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5CCC0] rounded-xl"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Support Email *</label>
              <input
                type="email"
                required
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5CCC0] rounded-xl"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Facebook Page URL *</label>
              <input
                type="url"
                required
                value={settings.facebookUrl}
                onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5CCC0] rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="font-semibold block mb-1">Showroom Address (English)</label>
              <textarea
                rows={2}
                value={settings.addressEn}
                onChange={(e) => setSettings({ ...settings, addressEn: e.target.value })}
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5CCC0] rounded-xl"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">শোরুমের ঠিকানা (বাংলা)</label>
              <textarea
                rows={2}
                value={settings.addressBn}
                onChange={(e) => setSettings({ ...settings, addressBn: e.target.value })}
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5CCC0] rounded-xl font-bengali"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Brand Tagline */}
        <div className="bg-white p-6 rounded-2xl border border-[#E7E0D3] shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-[#F0EAE0] pb-3">
            <Info className="w-5 h-5 text-[#962D3E]" />
            <h2 className="font-bold text-sm text-[#1E1E1E]">Brand Identity & Taglines</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold block mb-1">Tagline (English)</label>
              <input
                type="text"
                value={settings.taglineEn}
                onChange={(e) => setSettings({ ...settings, taglineEn: e.target.value })}
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5CCC0] rounded-xl"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">ট্যাগলাইন (বাংলা)</label>
              <input
                type="text"
                value={settings.taglineBn}
                onChange={(e) => setSettings({ ...settings, taglineBn: e.target.value })}
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5CCC0] rounded-xl font-bengali"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Database & Catalog Management */}
        <div className="bg-white p-6 rounded-2xl border border-[#E7E0D3] shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-[#F0EAE0] pb-3">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-[#962D3E]" />
              <h2 className="font-bold text-sm text-[#1E1E1E]">Firestore Database & Catalog Tools</h2>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isFirebaseConfigured
                  ? 'bg-[#EAF8EE] text-[#1E7E34] border border-[#BDE8C6]'
                  : 'bg-[#FFF9E6] text-[#805B00] border border-[#F0DFA8]'
              }`}
            >
              {isFirebaseConfigured ? 'Firebase Connected' : 'Demo Mode (Local)'}
            </span>
          </div>

          <p className="text-xs text-[#6B6357] leading-relaxed">
            Manage your store data in Google Cloud Firestore. You can seed the official 8-bag sample catalog with 6 categories to Firestore, or wipe all products to begin fresh with your own custom inventory.
          </p>

          {/* Action Alerts */}
          {actionMessage && (
            <div className="p-3 bg-[#EAF8EE] border border-[#BDE8C6] text-[#1E7E34] text-xs font-semibold rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{actionMessage}</span>
            </div>
          )}

          {actionError && (
            <div className="p-3 bg-[#FDF2F2] border border-[#F8B4B4] text-[#9B1C1C] text-xs font-semibold rounded-xl flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{actionError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* 1. Import Sample Data */}
            <div className="p-4 bg-[#FAF7F2] border border-[#E7E0D3] rounded-xl flex flex-col justify-between gap-3">
              <div>
                <h3 className="font-bold text-xs text-[#1E1E1E] flex items-center gap-1.5">
                  <UploadCloud className="w-4 h-4 text-[#962D3E]" />
                  <span>Import Sample Data to Firestore</span>
                </h3>
                <p className="text-[11px] text-[#7A7165] mt-1 leading-normal">
                  Seeds the 6 bag categories, 8 authentic bag products (with HTTPS images), reviews, and default settings directly into your Cloud Firestore collections.
                </p>
              </div>

              <button
                type="button"
                onClick={handleImportSampleData}
                disabled={importing || deleting}
                className="w-full py-2.5 px-4 bg-[#962D3E] hover:bg-[#7D2232] disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>{importing ? 'Importing Data to Firestore...' : 'Import Sample Data to Firestore'}</span>
              </button>
            </div>

            {/* 2. Delete All Products */}
            <div className="p-4 bg-[#FFF5F5] border border-[#FCDAD7] rounded-xl flex flex-col justify-between gap-3">
              <div>
                <h3 className="font-bold text-xs text-[#C53030] flex items-center gap-1.5">
                  <Trash2 className="w-4 h-4 text-[#C53030]" />
                  <span>Delete All Sample Products</span>
                </h3>
                <p className="text-[11px] text-[#822727] mt-1 leading-normal">
                  Cleans out all products from Firestore and local storage so you can start with a 100% empty catalog and enter real inventory.
                </p>
              </div>

              <button
                type="button"
                onClick={handleDeleteAllProducts}
                disabled={importing || deleting}
                className="w-full py-2.5 px-4 bg-[#C53030] hover:bg-[#9B2C2C] disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{deleting ? 'Deleting All Products...' : 'Delete All Sample Products'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Save CTA */}
        <div className="flex items-center justify-end gap-4 py-4">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-[#962D3E] hover:bg-[#7D2232] text-white font-bold rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Settings...' : 'Save All Settings'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
