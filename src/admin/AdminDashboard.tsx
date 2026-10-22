import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  Package,
  Layers,
  Star,
  ArrowRight,
  AlertTriangle,
  Plus,
} from 'lucide-react';
import { storeService } from '../services/storeService';
import { useLanguage } from '../context/LanguageContext';
import { Order, Product } from '../types';

export const AdminDashboard: React.FC = () => {
  const { formatPrice } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [reviewsCount, setReviewsCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      storeService.getOrders(),
      storeService.getProducts(),
      storeService.getReviews(),
    ]).then(([ords, prods, revs]) => {
      setOrders(ords);
      setProducts(prods);
      setReviewsCount(revs.length);
      setLoading(false);
    });
  }, []);

  const totalRevenue = orders.reduce((sum, o) => (o.status !== 'cancelled' ? sum + o.totalAmount : sum), 0);
  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const lowStockProducts = products.filter((p) => p.stockCount <= 10);
  const recentOrders = orders.slice(0, 5);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-[#EAF8EE] text-[#1E7E34] border-[#BDE8C6]';
      case 'shipped':
        return 'bg-[#E8F4FD] text-[#0A66C2] border-[#C3E1FC]';
      case 'processing':
        return 'bg-[#FEF9E7] text-[#B78103] border-[#FCEEC0]';
      case 'cancelled':
        return 'bg-[#FDEDED] text-[#D32F2F] border-[#F5C2C7]';
      default:
        return 'bg-[#FAF0F2] text-[#962D3E] border-[#F5D8E0]';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-[#E5DDD0] rounded w-1/4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-[#E5DDD0] rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      
      {/* Top Welcome & Shortcuts */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1E1E1E]">
            Admin Dashboard
          </h1>
          <p className="text-xs text-[#7A7165] mt-1">
            Real-time business performance for Xora Lifestyle Bangladesh.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/admin/products"
            className="px-4 py-2 bg-[#962D3E] hover:bg-[#7D2232] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
          <Link
            to="/admin/orders"
            className="px-4 py-2 bg-white hover:bg-[#FAF7F2] text-[#2D2A26] border border-[#DDD4C5] text-xs font-bold rounded-xl transition-colors"
          >
            View Orders ({orders.length})
          </Link>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-[#E7E0D3] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-[#7A7165] font-medium uppercase tracking-wider">Total Sales (BDT)</p>
            <p className="text-2xl font-bold text-[#1E1E1E] mt-1 tabular-nums">
              {formatPrice(totalRevenue)}
            </p>
            <span className="text-[11px] text-[#2E7D32] font-semibold mt-1 inline-block">
              {orders.length} orders recorded
            </span>
          </div>
          <div className="p-3 bg-[#EAF8EE] text-[#2E7D32] rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-5 rounded-2xl border border-[#E7E0D3] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-[#7A7165] font-medium uppercase tracking-wider">Pending Orders</p>
            <p className="text-2xl font-bold text-[#962D3E] mt-1 tabular-nums">
              {pendingOrders.length}
            </p>
            <span className="text-[11px] text-[#962D3E] font-semibold mt-1 inline-block">
              Requires confirmation call
            </span>
          </div>
          <div className="p-3 bg-[#FAF0F2] text-[#962D3E] rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-white p-5 rounded-2xl border border-[#E7E0D3] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-[#7A7165] font-medium uppercase tracking-wider">Active Catalog</p>
            <p className="text-2xl font-bold text-[#1E1E1E] mt-1 tabular-nums">
              {products.length} Items
            </p>
            <span className="text-[11px] text-[#595247] mt-1 inline-block">
              Across 4 artisan categories
            </span>
          </div>
          <div className="p-3 bg-[#FAF7F2] text-[#595247] border border-[#E5DDD0] rounded-xl">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Customer Reviews */}
        <div className="bg-white p-5 rounded-2xl border border-[#E7E0D3] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-[#7A7165] font-medium uppercase tracking-wider">Customer Reviews</p>
            <p className="text-2xl font-bold text-[#1E1E1E] mt-1 tabular-nums">
              {reviewsCount}
            </p>
            <span className="text-[11px] text-[#B78103] font-semibold mt-1 inline-block">
              Avg 4.9 ★ satisfaction
            </span>
          </div>
          <div className="p-3 bg-[#FEF9E7] text-[#B78103] rounded-xl">
            <Star className="w-6 h-6 fill-current" />
          </div>
        </div>

      </div>

      {/* Main Grid: Recent Orders (Left) & Low Stock Alerts (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Recent Orders (lg:col-span-8) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#E7E0D3] shadow-sm overflow-hidden">
          <div className="p-5 border-b border-[#F0EAE0] flex items-center justify-between">
            <div>
              <h2 className="font-serif-luxury text-base font-bold text-[#1E1E1E]">
                Recent Orders
              </h2>
              <p className="text-xs text-[#7A7165]">Latest customer purchases awaiting or in fulfillment</p>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-semibold text-[#962D3E] hover:underline flex items-center gap-1"
            >
              <span>All Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F2] text-[#696156] font-semibold border-b border-[#F0EAE0]">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">District</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EAE0]">
                {recentOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-[#FAF7F2] transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#962D3E]">
                      <Link to={`/admin/orders?search=${o.id}`} className="hover:underline">
                        {o.id}
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-[#1E1E1E]">{o.customerName}</p>
                      <p className="text-[11px] text-[#7A7165] tabular-nums">{o.phone}</p>
                    </td>
                    <td className="py-3 px-4 text-[#4A433A]">{o.district}</td>
                    <td className="py-3 px-4 font-bold text-[#1E1E1E] tabular-nums">
                      {formatPrice(o.totalAmount)}
                    </td>
                    <td className="py-3 px-4 uppercase text-[#7A7165] font-semibold text-[11px]">
                      {o.paymentMethod}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border capitalize ${getStatusBadge(o.status)}`}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Watchlist (lg:col-span-4) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#E7E0D3] shadow-sm p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-[#F0EAE0] pb-3">
            <h2 className="font-serif-luxury text-base font-bold text-[#1E1E1E] flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-[#C49A45]" />
              <span>Low Stock Alert</span>
            </h2>
            <span className="text-xs text-[#7A7165]">(&lt; 10 items)</span>
          </div>

          <div className="flex flex-col divide-y divide-[#F0EAE0]">
            {lowStockProducts.length === 0 ? (
              <p className="text-xs text-[#2E7D32] py-4 text-center font-medium">
                All inventory levels are healthy!
              </p>
            ) : (
              lowStockProducts.map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between first:pt-0">
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <img
                      src={p.images[0]}
                      alt={p.nameEn}
                      className="w-10 h-10 object-cover rounded-lg bg-[#FAF7F2] shrink-0 border border-[#E5DDD0]"
                    />
                    <div className="truncate">
                      <p className="text-xs font-semibold text-[#1E1E1E] truncate">{p.nameEn}</p>
                      <p className="text-[11px] text-[#887F74]">{p.categoryNameEn}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-[#FAF0F2] text-[#962D3E] font-bold text-xs rounded border border-[#F5D8E0] tabular-nums shrink-0">
                    {p.stockCount} left
                  </span>
                </div>
              ))
            )}
          </div>

          <Link
            to="/admin/products"
            className="w-full py-2.5 bg-[#FAF7F2] hover:bg-[#F2ECE3] border border-[#DDD4C5] text-xs font-bold text-center rounded-xl text-[#3A352F] transition-colors mt-2"
          >
            Manage Product Inventory
          </Link>
        </div>

      </div>

    </div>
  );
};
