import React, { useState, useEffect } from 'react';
import { Star, Plus, Edit2, Trash2, X, CheckCircle2 } from 'lucide-react';
import { storeService } from '../services/storeService';
import { CustomerReview } from '../types';

export const AdminReviews: React.FC = () => {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<CustomerReview | null>(null);

  // Form State
  const [customerNameBn, setCustomerNameBn] = useState('');
  const [customerNameEn, setCustomerNameEn] = useState('');
  const [districtBn, setDistrictBn] = useState('');
  const [districtEn, setDistrictEn] = useState('');
  const [productNameBn, setProductNameBn] = useState('');
  const [productNameEn, setProductNameEn] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [commentBn, setCommentBn] = useState('');
  const [commentEn, setCommentEn] = useState('');
  const [verified, setVerified] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    setLoading(true);
    const data = await storeService.getReviews();
    setReviews(data);
    setLoading(false);
  };

  const openAddModal = () => {
    setEditingReview(null);
    setCustomerNameBn('');
    setCustomerNameEn('');
    setDistrictBn('ধানমন্ডি, ঢাকা');
    setDistrictEn('Dhanmondi, Dhaka');
    setProductNameBn('প্রিমিয়াম হ্যান্ডব্যাগ');
    setProductNameEn('Hand-Embroidered Khadi Tunic Kurta');
    setRating(5);
    setCommentBn('');
    setCommentEn('');
    setVerified(true);
    setIsModalOpen(true);
  };

  const openEditModal = (rev: CustomerReview) => {
    setEditingReview(rev);
    setCustomerNameBn(rev.customerNameBn);
    setCustomerNameEn(rev.customerNameEn);
    setDistrictBn(rev.districtBn);
    setDistrictEn(rev.districtEn);
    setProductNameBn(rev.productNameBn);
    setProductNameEn(rev.productNameEn);
    setRating(rev.rating);
    setCommentBn(rev.commentBn);
    setCommentEn(rev.commentEn);
    setVerified(rev.verified);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      customerNameBn: customerNameBn.trim(),
      customerNameEn: customerNameEn.trim(),
      districtBn: districtBn.trim(),
      districtEn: districtEn.trim(),
      productNameBn: productNameBn.trim(),
      productNameEn: productNameEn.trim(),
      rating,
      commentBn: commentBn.trim(),
      commentEn: commentEn.trim(),
      verified,
    };

    if (editingReview) {
      await storeService.updateReview(editingReview.id, payload);
    } else {
      await storeService.addReview(payload);
    }

    setSaving(false);
    setIsModalOpen(false);
    await loadReviews();
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Delete review from "${name}"?`)) {
      await storeService.deleteReview(id);
      await loadReviews();
    }
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1E1E1E]">
            Customer Reviews & Proof
          </h1>
          <p className="text-xs text-[#7A7165] mt-1">
            Display authentic verified customer testimonials on your home storefront.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-[#962D3E] hover:bg-[#7D2232] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Review</span>
        </button>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white rounded-2xl border border-[#E7E0D3] shadow-sm p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex text-[#E7A823]">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                {rev.verified && (
                  <span className="flex items-center gap-1 text-[10px] text-[#1E7E34] font-semibold bg-[#EAF8EE] px-2 py-0.5 rounded">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified
                  </span>
                )}
              </div>

              <p className="text-xs text-[#3D362C] italic leading-relaxed mb-3">
                "{rev.commentBn || rev.commentEn}"
              </p>

              <p className="text-[11px] text-[#7A7165]">
                Product: <strong>{rev.productNameEn || rev.productNameBn}</strong>
              </p>
            </div>

            <div className="pt-3 mt-3 border-t border-[#F0EAE0] flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-[#1E1E1E]">{rev.customerNameEn} ({rev.customerNameBn})</p>
                <p className="text-[11px] text-[#887F74]">{rev.districtEn || rev.districtBn}</p>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openEditModal(rev)}
                  className="p-1.5 text-[#595247] hover:text-[#962D3E] rounded-lg"
                  title="Edit Review"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(rev.id, rev.customerNameEn)}
                  className="p-1.5 text-[#887F74] hover:text-[#D32F2F] rounded-lg"
                  title="Delete Review"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-[#E7E0D3] max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#F0EAE0] pb-4 mb-5">
              <h2 className="font-serif-luxury text-lg font-bold text-[#1E1E1E]">
                {editingReview ? 'Edit Customer Review' : 'Add Testimonial'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-[#7A7165] hover:text-[#1E1E1E]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#3D362C] block mb-1">Customer Name (En) *</label>
                  <input
                    type="text"
                    required
                    value={customerNameEn}
                    onChange={(e) => setCustomerNameEn(e.target.value)}
                    placeholder="e.g. Nazmin Sultana"
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5CCC0] rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#3D362C] block mb-1">গ্রাহকের নাম (বাংলা) *</label>
                  <input
                    type="text"
                    required
                    value={customerNameBn}
                    onChange={(e) => setCustomerNameBn(e.target.value)}
                    placeholder="নাজমিন সুলতানা"
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5CCC0] rounded-xl font-bengali"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#3D362C] block mb-1">District / Location (En)</label>
                  <input
                    type="text"
                    value={districtEn}
                    onChange={(e) => setDistrictEn(e.target.value)}
                    placeholder="Uttara, Dhaka"
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5CCC0] rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#3D362C] block mb-1">জেলা / এলাকা (বাংলা)</label>
                  <input
                    type="text"
                    value={districtBn}
                    onChange={(e) => setDistrictBn(e.target.value)}
                    placeholder="উত্তরা, ঢাকা"
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5CCC0] rounded-xl font-bengali"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#3D362C] block mb-1">Product Name (En)</label>
                  <input
                    type="text"
                    value={productNameEn}
                    onChange={(e) => setProductNameEn(e.target.value)}
                    placeholder="Hand-Embroidered Kurta"
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5CCC0] rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#3D362C] block mb-1">Star Rating (1-5)</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5CCC0] rounded-xl font-bold"
                  >
                    <option value={5}>5 Stars ★★★★★</option>
                    <option value={4}>4 Stars ★★★★☆</option>
                    <option value={3}>3 Stars ★★★☆☆</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#3D362C] block mb-1">মন্তব্য (বাংলা) *</label>
                <textarea
                  rows={2}
                  required
                  value={commentBn}
                  onChange={(e) => setCommentBn(e.target.value)}
                  placeholder="গ্রাহকের মন্তব্য..."
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5CCC0] rounded-xl font-bengali"
                />
              </div>

              <div>
                <label className="font-semibold text-[#3D362C] block mb-1">Comment (English)</label>
                <textarea
                  rows={2}
                  value={commentEn}
                  onChange={(e) => setCommentEn(e.target.value)}
                  placeholder="Review comment in English..."
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5CCC0] rounded-xl"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer font-medium pt-1">
                <input
                  type="checkbox"
                  checked={verified}
                  onChange={(e) => setVerified(e.target.checked)}
                  className="accent-[#962D3E]"
                />
                <span>Verified Buyer Badge</span>
              </label>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F0EAE0]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#DDD4C5] font-semibold text-[#4A433A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#962D3E] text-white font-bold rounded-xl shadow-sm hover:bg-[#7D2232]"
                >
                  {saving ? 'Saving...' : editingReview ? 'Update Review' : 'Add Review'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
