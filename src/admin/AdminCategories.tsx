import React, { useState, useEffect } from 'react';
import { Layers, Plus, Edit2, Trash2, Upload, X, Image as ImageIcon } from 'lucide-react';
import { storeService } from '../services/storeService';
import { uploadToCloudinary } from '../lib/cloudinary';
import { Category } from '../types';

export const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form State
  const [nameBn, setNameBn] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [slug, setSlug] = useState('');
  const [descriptionBn, setDescriptionBn] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [image, setImage] = useState('');
  const [directUrl, setDirectUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    const data = await storeService.getCategories();
    setCategories(data);
    setLoading(false);
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setNameBn('');
    setNameEn('');
    setSlug('');
    setDescriptionBn('');
    setDescriptionEn('');
    setImage('/src/assets/images/product_leather_bag_1792674216295.jpg');
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setNameBn(cat.nameBn);
    setNameEn(cat.nameEn);
    setSlug(cat.slug);
    setDescriptionBn(cat.descriptionBn || '');
    setDescriptionEn(cat.descriptionEn || '');
    setImage(cat.image);
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setImage(url);
    } catch (err: any) {
      alert(`Image upload error: ${err.message || 'Check Cloudinary settings'}`);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameBn.trim() || !nameEn.trim()) {
      alert('Please fill both Bangla and English category names');
      return;
    }

    setSaving(true);
    const payload = {
      nameBn: nameBn.trim(),
      nameEn: nameEn.trim(),
      slug: slug.trim() || nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      descriptionBn,
      descriptionEn,
      image: image || '/src/assets/images/product_leather_bag_1792674216295.jpg',
      itemCount: editingCategory?.itemCount || 0,
    };

    if (editingCategory) {
      await storeService.updateCategory(editingCategory.id, payload);
    } else {
      await storeService.addCategory(payload);
    }

    setSaving(false);
    setIsModalOpen(false);
    await loadCategories();
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete category "${name}"?`)) {
      await storeService.deleteCategory(id);
      await loadCategories();
    }
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1E1E1E]">
            Store Categories
          </h1>
          <p className="text-xs text-[#7A7165] mt-1">
            Organize products into curated lifestyle departments.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-[#962D3E] hover:bg-[#7D2232] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-2xl border border-[#E7E0D3] shadow-sm overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="aspect-[16/10] bg-[#FAF7F2] overflow-hidden relative border-b border-[#F0EAE0]">
                <img
                  src={cat.image}
                  alt={cat.nameEn}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2.5 right-2.5 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                  /{cat.slug}
                </span>
              </div>

              <div className="p-4 flex flex-col gap-1">
                <h3 className="font-bold text-sm text-[#1E1E1E]">{cat.nameEn}</h3>
                <p className="text-xs text-[#962D3E] font-medium font-bengali">{cat.nameBn}</p>
                <p className="text-xs text-[#7A7165] line-clamp-2 mt-1">
                  {cat.descriptionEn || cat.descriptionBn}
                </p>
              </div>
            </div>

            <div className="p-3 border-t border-[#F0EAE0] bg-[#FAF7F2] flex items-center justify-between text-xs">
              <span className="text-[#7A7165] font-semibold">{cat.itemCount || 0} Products</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openEditModal(cat)}
                  className="p-1.5 text-[#595247] hover:text-[#962D3E] rounded-lg"
                  title="Edit Category"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(cat.id, cat.nameEn)}
                  className="p-1.5 text-[#887F74] hover:text-[#D32F2F] rounded-lg"
                  title="Delete Category"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-[#E7E0D3] max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#F0EAE0] pb-4 mb-5">
              <h2 className="font-serif-luxury text-lg font-bold text-[#1E1E1E]">
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-[#7A7165] hover:text-[#1E1E1E]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
              <div>
                <label className="font-semibold text-[#3D362C] block mb-1">
                  Category Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={nameEn}
                  onChange={(e) => {
                    setNameEn(e.target.value);
                    if (!editingCategory) {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                    }
                  }}
                  placeholder="e.g. Fashion & Apparel"
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5CCC0] rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-[#3D362C] block mb-1">
                  ক্যাটাগরি নাম (বাংলা) *
                </label>
                <input
                  type="text"
                  required
                  value={nameBn}
                  onChange={(e) => setNameBn(e.target.value)}
                  placeholder="যেমন: ফ্যাশন ও পোশাক"
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5CCC0] rounded-xl font-bengali"
                />
              </div>

              <div>
                <label className="font-semibold text-[#3D362C] block mb-1">Slug *</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="fashion"
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5CCC0] rounded-xl font-mono text-[11px]"
                />
              </div>

              {/* Image preview & upload */}
              <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E7E0D3] flex flex-col gap-2">
                <label className="font-bold text-[#1E1E1E] flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-[#962D3E]" />
                  <span>Category Visual Cover</span>
                </label>
                <div className="flex gap-3 items-center">
                  {image && (
                    <img
                      src={image}
                      alt="Category preview"
                      className="w-14 h-14 object-cover rounded-lg border border-[#D5CCC0] shrink-0"
                    />
                  )}
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="py-1.5 px-3 border border-dashed border-[#962D3E] bg-white rounded-lg text-center cursor-pointer hover:bg-[#FAF0F2] font-semibold text-[#962D3E]">
                      {uploading ? 'Uploading...' : 'Upload Image File'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="url"
                      value={directUrl}
                      onChange={(e) => {
                        setDirectUrl(e.target.value);
                        setImage(e.target.value);
                      }}
                      placeholder="Or paste direct image URL..."
                      className="w-full px-2.5 py-1.5 bg-white border border-[#D5CCC0] rounded-lg text-[11px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#3D362C] block mb-1">
                  Description (English)
                </label>
                <input
                  type="text"
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  placeholder="Short tagline..."
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5CCC0] rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-[#3D362C] block mb-1">
                  বিবরণ (বাংলা)
                </label>
                <input
                  type="text"
                  value={descriptionBn}
                  onChange={(e) => setDescriptionBn(e.target.value)}
                  placeholder="সংক্ষিপ্ত তথ্য..."
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5CCC0] rounded-xl font-bengali"
                />
              </div>

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
                  {saving ? 'Saving...' : editingCategory ? 'Update' : 'Create'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
