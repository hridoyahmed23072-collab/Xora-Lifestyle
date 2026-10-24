import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Printer,
  Download,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  X,
  Phone,
  MapPin,
  Calendar,
  RefreshCw,
} from 'lucide-react';
import { storeService } from '../services/storeService';
import { useLanguage } from '../context/LanguageContext';
import { isFirebaseConfigured, db } from '../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Order, OrderStatus } from '../types';

export const AdminOrders: React.FC = () => {
  const { formatPrice } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadOrders();

    const handleUpdate = () => {
      storeService.getOrders().then(setOrders);
    };

    window.addEventListener('xora_orders_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    let unsubscribe: (() => void) | undefined;
    if (isFirebaseConfigured && db) {
      try {
        unsubscribe = onSnapshot(
          collection(db, 'orders'),
          () => {
            storeService.getOrders().then(setOrders);
          },
          (err) => {
            console.warn('onSnapshot listener permission notice (auto-polling active):', err.message);
          }
        );
      } catch (e) {
        console.warn('onSnapshot listener error:', e);
      }
    }

    // Auto-refresh orders every 15 seconds to ensure live cross-device sync
    const interval = setInterval(() => {
      storeService.getOrders().then(setOrders);
    }, 15000);

    return () => {
      window.removeEventListener('xora_orders_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      clearInterval(interval);
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    const data = await storeService.getOrders();
    setOrders(data);
    setLoading(false);
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    await storeService.updateOrderStatus(orderId, newStatus);
    await loadOrders();
  };

  // CSV Export with UTF-8 BOM for Bangla text compatibility
  const handleExportCSV = () => {
    if (orders.length === 0) return;

    const headers = [
      'Order ID',
      'Date',
      'Customer Name',
      'Phone',
      'Address',
      'District',
      'Upazila',
      'Delivery Zone',
      'Payment Method',
      'TrxID',
      'Subtotal (BDT)',
      'Delivery Fee (BDT)',
      'Total Amount (BDT)',
      'Status',
    ];

    const rows = filteredOrders.map((o) => [
      `"${o.id}"`,
      `"${o.createdAt.split('T')[0]}"`,
      `"${o.customerName.replace(/"/g, '""')}"`,
      `"${o.phone}"`,
      `"${o.address.replace(/"/g, '""')}"`,
      `"${o.district}"`,
      `"${o.upazila || ''}"`,
      `"${o.deliveryZone}"`,
      `"${o.paymentMethod.toUpperCase()}"`,
      `"${o.trxId || ''}"`,
      o.subtotal,
      o.deliveryCharge,
      o.totalAmount,
      `"${o.status}"`,
    ]);

    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `xora_lifestyle_orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = selectedStatus === 'all' || o.status === selectedStatus;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      o.id.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.phone.includes(q) ||
      o.district.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return 'bg-[#EAF8EE] text-[#1E7E34] border-[#BDE8C6]';
      case 'shipped':
        return 'bg-[#E8F4FD] text-[#0A66C2] border-[#C3E1FC]';
      case 'processing':
        return 'bg-[#FEF9E7] text-[#B78103] border-[#FCEEC0]';
      case 'confirmed':
        return 'bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]';
      case 'cancelled':
        return 'bg-[#FDEDED] text-[#D32F2F] border-[#F5C2C7]';
      default:
        return 'bg-[#FAF0F2] text-[#962D3E] border-[#F5D8E0]';
    }
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1E1E1E]">
            Orders & Shipments
          </h1>
          <p className="text-xs text-[#7A7165] mt-1">
            Track customer orders, verify payments, generate invoices, and update delivery dispatch.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => loadOrders()}
            disabled={loading}
            className="px-3.5 py-2.5 bg-white hover:bg-[#FAF7F2] text-[#2D2A26] border border-[#DDD4C5] text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
            title="Refresh orders list"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#962D3E] ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-white hover:bg-[#FAF7F2] text-[#2D2A26] border border-[#DDD4C5] text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all"
          >
            <Download className="w-4 h-4 text-[#962D3E]" />
            <span>Export Orders (CSV)</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E7E0D3] shadow-sm flex flex-col gap-3">
        
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-[#8C8377] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Order ID, name, or phone..."
              className="w-full pl-9 pr-3.5 py-2 bg-[#FAF7F2] border border-[#D5CCC0] rounded-xl text-xs text-[#1E1E1E] focus:bg-white focus:outline-none focus:border-[#962D3E]"
            />
          </div>

          <span className="text-xs text-[#7A7165] font-semibold self-end sm:self-auto">
            Showing {filteredOrders.length} of {orders.length} orders
          </span>
        </div>

        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#F0EAE0]">
          {(['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'] as const).map(
            (st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  selectedStatus === st
                    ? 'bg-[#962D3E] text-white shadow-xs'
                    : 'bg-[#FAF7F2] text-[#595247] hover:bg-[#EFE9DF]'
                }`}
              >
                {st}
              </button>
            )
          )}
        </div>

      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-[#E7E0D3] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] text-[#696156] font-semibold border-b border-[#F0EAE0]">
              <tr>
                <th className="py-3 px-4">Order ID & Date</th>
                <th className="py-3 px-4">Customer & Phone</th>
                <th className="py-3 px-4">District / Area</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Status & Update</th>
                <th className="py-3 px-4 text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EAE0]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#7A7165]">
                    No orders match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-[#FAF7F2] transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-mono font-bold text-sm text-[#962D3E]">{o.id}</p>
                      <p className="text-[11px] text-[#7A7165] mt-0.5">
                        {o.createdAt.split('T')[0]}
                      </p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-sm text-[#1E1E1E]">{o.customerName}</p>
                      <p className="text-[11px] text-[#7A7165] tabular-nums font-medium">{o.phone}</p>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="font-semibold text-[#1E1E1E]">
                        {o.district}{o.upazila ? ` · ${o.upazila}` : ''}
                      </p>
                      <p className="text-[11px] text-[#7A7165] truncate">{o.address}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-sm text-[#1E1E1E] tabular-nums">
                        {formatPrice(o.totalAmount)}
                      </span>
                      <p className="text-[10px] text-[#7A7165]">
                        ({o.items?.length || 1} items)
                      </p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-[11px] uppercase text-[#3D362C]">
                        {o.paymentMethod}
                      </span>
                      {o.trxId && (
                        <p className="text-[10px] font-mono text-[#0A66C2]">
                          Trx: {o.trxId}
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={o.status}
                        onChange={(e) => handleStatusChange(o.id, e.target.value as OrderStatus)}
                        className={`py-1 px-2.5 rounded-lg border text-xs font-bold capitalize cursor-pointer focus:outline-none ${getStatusBadge(
                          o.status
                        )}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setActiveInvoiceOrder(o)}
                        className="px-3 py-1.5 bg-[#FAF7F2] hover:bg-[#F2ECE3] border border-[#DDD4C5] text-[#2D2A26] rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                        title="View / Print Invoice"
                      >
                        <Printer className="w-3.5 h-3.5 text-[#962D3E]" />
                        <span>Print</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Invoice Modal */}
      {activeInvoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[#E7E0D3] max-w-2xl w-full p-8 shadow-2xl max-h-[95vh] overflow-y-auto relative">
            
            {/* Modal Controls (Hidden in actual print) */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#F0EAE0] print:hidden">
              <span className="text-xs font-bold text-[#7A7165] uppercase tracking-wider">
                Print Customer Invoice
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-[#962D3E] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm hover:bg-[#7D2232]"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Document</span>
                </button>
                <button
                  onClick={() => setActiveInvoiceOrder(null)}
                  className="p-1.5 text-[#7A7165] hover:text-[#1E1E1E] rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Actual Invoice Content (Target for printing) */}
            <div id="printable-invoice" className="text-xs text-[#1E1E1E] flex flex-col gap-6">
              
              {/* Invoice Header */}
              <div className="flex justify-between items-start border-b border-[#1E1E1E] pb-5">
                <div>
                  <h2 className="font-serif-luxury text-2xl font-bold tracking-tight text-[#1E1E1E]">
                    Xora Lifestyle
                  </h2>
                  <p className="text-[11px] text-[#6B6357]">Handcrafted Heritage Bangladesh</p>
                  <p className="text-[11px] text-[#6B6357]">House 12, Road 7, Dhanmondi, Dhaka</p>
                  <p className="text-[11px] text-[#6B6357]">Hotline: +880 1711-234567</p>
                </div>

                <div className="text-right">
                  <h3 className="text-lg font-bold uppercase tracking-wider text-[#962D3E]">
                    INVOICE
                  </h3>
                  <p className="font-mono font-bold text-sm text-[#1E1E1E] mt-0.5">
                    {activeInvoiceOrder.id}
                  </p>
                  <p className="text-[11px] text-[#6B6357]">
                    Date: {activeInvoiceOrder.createdAt.split('T')[0]}
                  </p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold border uppercase bg-[#FAF7F2] text-[#1E1E1E]">
                    {activeInvoiceOrder.status}
                  </span>
                </div>
              </div>

              {/* Bill To & Shipping Details */}
              <div className="grid grid-cols-2 gap-6 bg-[#FAF7F2] p-4 rounded-xl border border-[#E7E0D3]">
                <div>
                  <p className="font-bold text-[#696156] uppercase tracking-wider text-[10px] mb-1">
                    CUSTOMER BILL TO
                  </p>
                  <p className="font-bold text-sm text-[#1E1E1E]">{activeInvoiceOrder.customerName}</p>
                  <p className="font-semibold text-xs mt-0.5">{activeInvoiceOrder.phone}</p>
                </div>
                <div>
                  <p className="font-bold text-[#696156] uppercase tracking-wider text-[10px] mb-1">
                    DELIVERY DESTINATION
                  </p>
                  <p className="text-xs text-[#1E1E1E]">{activeInvoiceOrder.address}</p>
                  <p className="font-bold text-xs text-[#962D3E] mt-0.5">
                    {activeInvoiceOrder.upazila ? `${activeInvoiceOrder.upazila}, ` : ''}{activeInvoiceOrder.district} ({activeInvoiceOrder.deliveryZone})
                  </p>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-left text-xs border border-[#E7E0D3]">
                <thead className="bg-[#FAF7F2] text-[#4A433A] font-bold border-b border-[#E7E0D3]">
                  <tr>
                    <th className="py-2.5 px-3">Item Description</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Unit Price</th>
                    <th className="py-2.5 px-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EAE0]">
                  {activeInvoiceOrder.items?.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-3">
                        <p className="font-semibold">{item.nameEn}</p>
                        <p className="text-[11px] text-[#7A7165] font-bengali">{item.nameBn}</p>
                        {(item.selectedColor || item.selectedSize) && (
                          <span className="text-[10px] text-[#887F74]">
                            {item.selectedColor} · {item.selectedSize}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center tabular-nums font-semibold">
                        {item.quantity}
                      </td>
                      <td className="py-2.5 px-3 text-right tabular-nums">
                        {formatPrice(item.price)}
                      </td>
                      <td className="py-2.5 px-3 text-right tabular-nums font-bold">
                        {formatPrice(item.totalPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pricing Totals */}
              <div className="flex justify-end">
                <div className="w-64 flex flex-col gap-1.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-[#F0EAE0]">
                    <span className="text-[#6B6357]">Subtotal:</span>
                    <span className="font-semibold tabular-nums">
                      {formatPrice(activeInvoiceOrder.subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#F0EAE0]">
                    <span className="text-[#6B6357]">Delivery Charge:</span>
                    <span className="font-semibold tabular-nums">
                      {formatPrice(activeInvoiceOrder.deliveryCharge)}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 text-sm font-bold border-b-2 border-[#1E1E1E]">
                    <span>Total Payable:</span>
                    <span className="text-[#962D3E] tabular-nums">
                      {formatPrice(activeInvoiceOrder.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Details & Note */}
              <div className="pt-2 border-t border-[#F0EAE0] flex flex-col gap-1 text-[11px] text-[#7A7165]">
                <p>
                  Payment Method: <strong>{activeInvoiceOrder.paymentMethod.toUpperCase()}</strong>
                  {activeInvoiceOrder.trxId && <span> · TrxID: <strong>{activeInvoiceOrder.trxId}</strong></span>}
                </p>
                {activeInvoiceOrder.notes && (
                  <p>Order Notes: <em>"{activeInvoiceOrder.notes}"</em></p>
                )}
                <p className="mt-4 text-center text-[10px] text-[#9E9589]">
                  Thank you for supporting authentic Bangladeshi artisans with Xora Lifestyle!
                </p>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
