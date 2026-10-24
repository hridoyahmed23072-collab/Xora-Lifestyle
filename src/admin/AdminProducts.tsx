import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Upload,
  X,
  Check,
  Image as ImageIcon,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { storeService } from '../services/storeService';
import { uploadToCloudinary } from '../lib/cloudinary';
import { useLanguage } from '../context/LanguageContext';
import { Category, Product } from '../types';

export const AdminProducts: React.FC = () => {
  const { formatPrice } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form Fields
  const [nameBn, setNameBn] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [slug, setSlug] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [originalPrice, setOriginalPrice] = useState<number | undefined>(undefined);
  const [stockCount, setStockCount] = useState<number>(10);
  const [inStock, setInStock] = useState(true);
  const [shortDescriptionBn, setShortDescriptionBn] = useState('');
  const [shortDescriptionEn, setShortDescriptionEn] = useState('');
  const [descriptionBn, setDescriptionBn] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [directImageUrl, setDirectImageUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [colors, setColors] = useState<{ nameBn: string; nameEn: string; hex: string }[]>([]);
  const [newColorBn, setNewColorBn] = useState('');
  const [newColorEn, setNewColorEn] = useState('');
  const [newColorHex, setNewColorHex] = useState('#4A2E18');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [prods, cats] = await Promise.all([
      storeService.getProducts(),
      storeService.getCategories(),
    ]);
    setProducts(prods);
    setCategories(cats);
    if (cats.length > 0 && !categoryId) {
      setCategoryId(cats[0].id);
    }
    setLoading(false);
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setNameBn('');
    setNameEn('');
    setSlug('');
    setCategoryId(categories[0]?.id || 'handbags');
    setPrice(2200);
    setOriginalPrice(undefined);
    setStockCount(15);
    setInStock(true);
    setShortDescriptionBn('');
    setShortDescriptionEn('');
    setDescriptionBn('');
    setDescriptionEn('');
    setImages([]);
    setIsFeatured(false);
    setIsNew(true);
    setIsBestSeller(false);
    setColors([
      { nameBn: 'চকলেট ব্রাউন', nameEn: 'Chocolate Brown', hex: '#4A2E18' },
      { nameBn: 'ক্লাসিক ব্ল্যাক', nameEn: 'Classic Black', hex: '#1E1E1E' },
    ]);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setNameBn(product.nameBn);
    setNameEn(product.nameEn);
    setSlug(product.slug);
    setCategoryId(product.categoryId);
    setPrice(product.price);
    setOriginalPrice(product.originalPrice);
    setStockCount(product.stockCount);
    setInStock(product.inStock);
    setShortDescriptionBn(product.shortDescriptionBn || '');
    setShortDescriptionEn(product.shortDescriptionEn || '');
    setDescriptionBn(product.descriptionBn || '');
    setDescriptionEn(product.descriptionEn || '');
    setImages(product.images || []);
    setIsFeatured(Boolean(product.isFeatured));
    setIsNew(Boolean(product.isNew));
    setIsBestSeller(Boolean(product.isBestSeller));
    setColors(product.variants?.colors || []);
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const uploadedUrl = await uploadToCloudinary(file);
        setImages((prev) => [...prev, uploadedUrl]);
      }
    } catch (err: any) {
      alert(`Image upload error: ${err.message || 'Check Cloudinary settings'}`);
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleAddDirectUrl = () => {
    const trimmed = directImageUrl.trim();
    if (!trimmed) return;
    if (trimmed.startsWith('/src/assets/')) {
      alert('Local /src/assets/ paths cannot be used. Please enter a public https URL (e.g. from Cloudinary).');
      return;
    }
    setImages((prev) => [...prev, trimmed]);
    setDirectImageUrl('');
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddColor = () => {
    if (!newColorBn.trim() || !newColorEn.trim()) return;
    setColors((prev) => [
      ...prev,
      {
        nameBn: newColorBn.trim(),
        nameEn: newColorEn.trim(),
        hex: newColorHex,
      },
    ]);
    setNewColorBn('');
    setNewColorEn('');
  };

  const handleRemoveColor = (index: number) => {
    setColors((prev) => prev.filter((_, i) => i !== index));
  };

  const handleApplyColorPreset = (preset: { nameBn: string; nameEn: string; hex: string }) => {
    if (!colors.some((c) => c.nameEn.toLowerCase() === preset.nameEn.toLowerCase())) {
      setColors((prev) => [...prev, preset]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameBn.trim() || !nameEn.trim() || price <= 0) {
      alert('Please fill product name (Bangla and English) and valid price');
      return;
    }

    // Filter out local /src/assets/ paths so Firestore never stores local paths
    const validImages = images
      .map((img) => img.trim())
      .filter((img) => img.length > 0 && !img.startsWith('/src/assets/'));

    if (validImages.length === 0) {
      alert('Please upload an image via Cloudinary or enter an https image URL. Local asset paths (/src/assets/...) are not allowed.');
      return;
    }

    setSaving(true);
    const catObj = categories.find((c) => c.id === categoryId);
    const categoryNameBn = catObj?.nameBn || 'সাধারণ';
    const categoryNameEn = catObj?.nameEn || 'General';

    const productPayload = {
      nameBn: nameBn.trim(),
      nameEn: nameEn.trim(),
      slug: slug.trim() || nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      categoryId,
      categoryNameBn,
      categoryNameEn,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      images: validImages,
      shortDescriptionBn,
      shortDescriptionEn,
      descriptionBn,
      descriptionEn,
      specificationsBn: editingProduct?.specificationsBn || {},
      specificationsEn: editingProduct?.specificationsEn || {},
      variants: {
        colors: colors.length > 0 ? colors : undefined,
      },
      inStock,
      stockCount: Number(stockCount),
      isFeatured,
      isNew,
      isBestSeller,
      rating: editingProduct?.rating || 5.0,
      reviewsCount: editingProduct?.reviewsCount || 0,
    };

    if (editingProduct) {
      await storeService.updateProduct(editingProduct.id, productPayload);
    } else {
      await storeService.addProduct(productPayload);
    }

    setSaving(false);
    setIsModalOpen(false);
    await loadData();
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      await storeService.deleteProduct(id);
      await loadData();
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.categoryId === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.nameBn.toLowerCase().includes(q) ||
      p.nameEn.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1E1E1E]">
            Products Catalog
          </h1>
          <p className="text-xs text-[#7A7165] mt-1">
            Manage your store inventory, upload high-resolution images, and configure pricing.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-[#962D3E] hover:bg-[#7D2232] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E7E0D3] shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#8C8377] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title or slug..."
            className="w-full pl-9 pr-3.5 py-2 bg-[#FAF7F2] border border-[#D5CCC0] rounded-xl text-xs text-[#1E1E1E] focus:bg-white focus:outline-none focus:border-[#962D3E]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-[#6B6357] font-medium shrink-0">Collection:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="py-2 px-3 bg-[#FAF7F2] border border-[#D5CCC0] rounded-xl text-xs text-[#1E1E1E] focus:outline-none focus:border-[#962D3E]"
          >
            <option value="all">All Collections</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nameEn}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-[#E7E0D3] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] text-[#696156] font-semibold border-b border-[#F0EAE0]">
              <tr>
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">Collection</th>
                <th className="py-3 px-4">Price (BDT)</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Badges</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EAE0]">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-[#FAF7F2] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images?.[0]}
                        alt={p.nameEn}
                        className="w-12 h-12 object-cover rounded-lg bg-[#FAF7F2] border border-[#E5DDD0] shrink-0"
                      />
                      <div className="min-w-0 max-w-xs">
                        <p className="font-semibold text-sm text-[#1E1E1E] truncate">{p.nameEn}</p>
                        <p className="text-xs text-[#7A7165] truncate">{p.nameBn}</p>
                        <span className="text-[10px] text-[#9E9589] font-mono">{p.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-[#4A433A] font-medium">{p.categoryNameEn}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-[#1E1E1E] tabular-nums">
                      {formatPrice(p.price)}
                    </span>
                    {p.originalPrice && (
                      <span className="text-[10px] text-[#9E9589] line-through ml-1 tabular-nums">
                        {formatPrice(p.originalPrice)}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border tabular-nums ${
                        p.stockCount <= 5
                          ? 'bg-[#FDEDED] text-[#D32F2F] border-[#F5C2C7]'
                          : p.stockCount <= 12
                          ? 'bg-[#FEF9E7] text-[#B78103] border-[#FCEEC0]'
                          : 'bg-[#EAF8EE] text-[#1E7E34] border-[#BDE8C6]'
                      }`}
                    >
                      {p.stockCount} in stock
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {p.isFeatured && (
                        <span className="px-1.5 py-0.5 bg-[#FAF0F2] text-[#962D3E] text-[9px] font-bold rounded">
                          Featured
                        </span>
                      )}
                      {p.isNew && (
                        <span className="px-1.5 py-0.5 bg-[#E8F4FD] text-[#0A66C2] text-[9px] font-bold rounded">
                          New Arrival
                        </span>
                      )}
                      {p.isBestSeller && (
                        <span className="px-1.5 py-0.5 bg-[#FEF9E7] text-[#B78103] text-[9px] font-bold rounded">
                          Best Seller
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1.5 text-[#595247] hover:text-[#962D3E] hover:bg-[#FAF7F2] rounded-lg transition-colors"
                        title="Edit Product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.nameEn)}
                        className="p-1.5 text-[#887F74] hover:text-[#D32F2F] hover:bg-[#FAF7F2] rounded-lg transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[#E7E0D3] max-w-3xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#F0EAE0] pb-4 mb-5">
              <h2 className="font-serif-luxury text-xl font-bold text-[#1E1E1E]">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-[#7A7165] hover:text-[#1E1E1E] rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-xs">
              
              {/* Row 1: Bangla & English Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-[#3D362C] block mb-1">
                    Product Title (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={nameEn}
                    onChange={(e) => {
                      setNameEn(e.target.value);
                      if (!editingProduct) {
                        setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                      }
                    }}
                    placeholder="e.g. Hand-Embroidered Khadi Kurta"
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5CCC0] rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#3D362C] block mb-1">
                    পণ্যের নাম (বাংলা) *
                  </label>
                  <input
                    type="text"
                    required
                    value={nameBn}
                    onChange={(e) => setNameBn(e.target.value)}
                    placeholder="যেমন: প্রিমিয়াম হ্যান্ডব্যাগ"
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5CCC0] rounded-xl font-bengali"
                  />
                </div>
              </div>

              {/* Row 2: Category & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-[#3D362C] block mb-1">Collection *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5CCC0] rounded-xl"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nameEn} ({c.nameBn})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-[#3D362C] block mb-1">URL Slug</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="hand-embroidered-khadi-kurta"
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5CCC0] rounded-xl font-mono text-[11px]"
                  />
                </div>
              </div>

              {/* Row 3: Price, Original Price, Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-semibold text-[#3D362C] block mb-1">
                    Regular Price (৳) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5CCC0] rounded-xl tabular-nums font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#3D362C] block mb-1">
                    Original / Strikethrough Price (৳)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={originalPrice || ''}
                    onChange={(e) => setOriginalPrice(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="e.g. 3200 (Optional)"
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5CCC0] rounded-xl tabular-nums"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#3D362C] block mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={stockCount}
                    onChange={(e) => setStockCount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5CCC0] rounded-xl tabular-nums"
                  />
                </div>
              </div>

              {/* Image Upload with Cloudinary & URL */}
              <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E7E0D3] flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[#1E1E1E] flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#962D3E]" />
                    <span>Product Images (Multiple via Cloudinary)</span>
                  </label>
                  <span className="text-[10px] text-[#7A7165]">{images.length} images uploaded</span>
                </div>

                {/* Upload Trigger */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <label className="flex-1 py-2 px-3 border border-dashed border-[#962D3E] bg-white rounded-xl text-center cursor-pointer hover:bg-[#FAF0F2] transition-colors flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4 text-[#962D3E]" />
                    <span className="font-semibold text-[#962D3E]">
                      {uploadingImage ? 'Uploading image...' : 'Upload Image File'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>

                  <div className="flex-1 flex gap-2">
                    <input
                      type="url"
                      value={directImageUrl}
                      onChange={(e) => setDirectImageUrl(e.target.value)}
                      placeholder="Or paste direct image URL..."
                      className="flex-1 px-3 py-2 bg-white border border-[#D5CCC0] rounded-xl text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddDirectUrl}
                      className="px-3 py-2 bg-white border border-[#DDD4C5] font-semibold rounded-xl hover:bg-[#F0EAE0]"
                    >
                      Add URL
                    </button>
                  </div>
                </div>

                {/* Images Preview Strip */}
                {images.length > 0 && (
                  <div className="flex flex-wrap gap-2.5 pt-2">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-[#D5CCC0] group">
                        <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full p-0.5 hover:bg-[#D32F2F] transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        {idx === 0 && (
                          <span className="absolute bottom-0 inset-x-0 bg-[#962D3E] text-white text-[8px] text-center font-bold">
                            Primary
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Color Variants Only (No Size) */}
              <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#E7E0D3] flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-bold text-[#1E1E1E] block">
                      Color Variants (রং বিকল্প)
                    </label>
                    <p className="text-[11px] text-[#7A7165]">
                      Configure available bag colors with custom swatches (No sizes for bags)
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-[#962D3E]">
                    {colors.length} {colors.length === 1 ? 'color' : 'colors'}
                  </span>
                </div>

                {/* Current Active Colors */}
                {colors.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {colors.map((c, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 pl-2 pr-1.5 py-1 bg-white border border-[#DDD4C5] rounded-lg shadow-2xs text-xs font-medium"
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span className="text-[#1E1E1E]">{c.nameEn}</span>
                        <span className="text-[#887F73] text-[11px]">({c.nameBn})</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveColor(idx)}
                          className="p-1 text-[#968E82] hover:text-[#D32F2F] rounded hover:bg-[#FBEBEB] transition-colors"
                          title="Remove color"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quick Bag Color Presets */}
                <div className="pt-2 border-t border-[#EAE3D7]">
                  <p className="text-[11px] font-semibold text-[#665D52] mb-1.5">
                    Quick Add Bag Presets:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { nameEn: 'Chocolate Brown', nameBn: 'চকলেট ব্রাউন', hex: '#4A2E18' },
                      { nameEn: 'Classic Black', nameBn: 'ক্লাসিক ব্ল্যাক', hex: '#1E1E1E' },
                      { nameEn: 'Cognac Tan', nameBn: 'কনিয়াক ট্যান', hex: '#9E5B28' },
                      { nameEn: 'Burgundy Maroon', nameBn: 'বারগেন্ডি মেরুন', hex: '#6B1724' },
                      { nameEn: 'Olive Green', nameBn: 'অলিভ গ্রিন', hex: '#4D583F' },
                      { nameEn: 'Natural Canvas', nameBn: 'ন্যাচারাল ক্যানভাস', hex: '#E3DAC9' },
                    ].map((preset) => (
                      <button
                        key={preset.nameEn}
                        type="button"
                        onClick={() => handleApplyColorPreset(preset)}
                        className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#D5CCC0] rounded-md text-[11px] text-[#3E3830] hover:border-[#962D3E] hover:text-[#962D3E] transition-colors"
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-black/10"
                          style={{ backgroundColor: preset.hex }}
                        />
                        <span>{preset.nameEn}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Add Custom Color Input */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-2 border-t border-[#EAE3D7] items-end">
                  <div className="sm:col-span-4">
                    <label className="text-[11px] font-medium text-[#665D52] block mb-0.5">
                      Color Name (English)
                    </label>
                    <input
                      type="text"
                      value={newColorEn}
                      onChange={(e) => setNewColorEn(e.target.value)}
                      placeholder="e.g. Midnight Black"
                      className="w-full px-2.5 py-1.5 bg-white border border-[#D5CCC0] rounded-lg text-xs"
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <label className="text-[11px] font-medium text-[#665D52] block mb-0.5">
                      রংয়ের নাম (বাংলা)
                    </label>
                    <input
                      type="text"
                      value={newColorBn}
                      onChange={(e) => setNewColorBn(e.target.value)}
                      placeholder="যেমন: প্রিমিয়াম হ্যান্ডব্যাগ"
                      className="w-full px-2.5 py-1.5 bg-white border border-[#D5CCC0] rounded-lg text-xs font-bengali"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-medium text-[#665D52] block mb-0.5">
                      Swatch Hex
                    </label>
                    <div className="flex items-center gap-1.5 bg-white border border-[#D5CCC0] rounded-lg px-2 py-1">
                      <input
                        type="color"
                        value={newColorHex}
                        onChange={(e) => setNewColorHex(e.target.value)}
                        className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent p-0"
                      />
                      <span className="font-mono text-[10px] text-[#7A7165] uppercase">
                        {newColorHex}
                      </span>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <button
                      type="button"
                      onClick={handleAddColor}
                      disabled={!newColorEn.trim() || !newColorBn.trim()}
                      className="w-full py-2 bg-[#962D3E] hover:bg-[#7D2232] disabled:opacity-50 text-white rounded-lg font-semibold text-xs transition-colors"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Short Descriptions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-[#3D362C] block mb-1">
                    Short Summary (English)
                  </label>
                  <textarea
                    rows={2}
                    value={shortDescriptionEn}
                    onChange={(e) => setShortDescriptionEn(e.target.value)}
                    placeholder="Short highlight for cards..."
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5CCC0] rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#3D362C] block mb-1">
                    সংক্ষিপ্ত বিবরণ (বাংলা)
                  </label>
                  <textarea
                    rows={2}
                    value={shortDescriptionBn}
                    onChange={(e) => setShortDescriptionBn(e.target.value)}
                    placeholder="সংক্ষিপ্ত তথ্য..."
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5CCC0] rounded-xl font-bengali"
                  />
                </div>
              </div>

              {/* Detailed Descriptions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-[#3D362C] block mb-1">
                    Full Description (English)
                  </label>
                  <textarea
                    rows={4}
                    value={descriptionEn}
                    onChange={(e) => setDescriptionEn(e.target.value)}
                    placeholder="Full product story and details..."
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5CCC0] rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#3D362C] block mb-1">
                    পূর্ণ বিবরণ (বাংলা)
                  </label>
                  <textarea
                    rows={4}
                    value={descriptionBn}
                    onChange={(e) => setDescriptionBn(e.target.value)}
                    placeholder="বিস্তারিত বিবরণ..."
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5CCC0] rounded-xl font-bengali"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 p-3 bg-[#FAF7F2] rounded-xl border border-[#E7E0D3]">
                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                    className="accent-[#962D3E]"
                  />
                  <span>In Stock</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="accent-[#962D3E]"
                  />
                  <span>Featured Collection</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={isNew}
                    onChange={(e) => setIsNew(e.target.checked)}
                    className="accent-[#962D3E]"
                  />
                  <span>New Arrival (নতুন ব্যাগ)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={isBestSeller}
                    onChange={(e) => setIsBestSeller(e.target.checked)}
                    className="accent-[#962D3E]"
                  />
                  <span>Best Seller</span>
                </label>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F0EAE0]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#DDD4C5] font-semibold text-[#4A433A] hover:bg-[#FAF7F2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-[#962D3E] hover:bg-[#7D2232] text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
