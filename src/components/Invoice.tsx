import React from 'react';
import { Order } from '../types';

interface InvoiceProps {
  order: Order;
}

export const Invoice: React.FC<InvoiceProps> = ({ order }) => {
  const customerName = order.customerName || order.customerInfo?.name || 'Customer';
  const phone = order.phone || order.customerInfo?.phone || '';
  const address = order.address || order.customerInfo?.address || '';
  const district = order.district || order.customerInfo?.district || '';
  const upazila = order.upazila || order.customerInfo?.upazila || '';
  const shippingCharge = order.deliveryCharge ?? order.shippingFee ?? 0;

  return (
    <div className="bg-white p-6 sm:p-8 max-w-2xl mx-auto border border-slate-200 rounded-xl shadow-sm text-slate-800 font-sans print:shadow-none print:border-none print:p-0">
      {/* Header */}
      <div className="flex justify-between items-start border-b border-slate-200 pb-6 mb-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-rose-950">XORA LIFESTYLE</h1>
          <p className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-widest mt-0.5">Premium Trendy Bags</p>
          <p className="text-xs text-slate-600 mt-2">Dhaka, Bangladesh</p>
        </div>
        <div className="text-right">
          <span className="inline-block bg-rose-100 text-rose-950 font-bold text-[11px] px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            INVOICE / রসিদ
          </span>
          <p className="text-xs sm:text-sm font-bold text-slate-900">অর্ডার আইডি: <span className="text-rose-900">{order.id}</span></p>
          <p className="text-[11px] text-slate-500 mt-1">
            তারিখ: {new Date(order.createdAt).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Customer Info & Payment Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
        <div>
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">ক্রেতার তথ্য ও ডেলিভারি ঠিকানা</h3>
          <p className="text-xs sm:text-sm font-bold text-slate-800">{customerName}</p>
          <p className="text-xs text-slate-600 mt-1">মোবাইল: <span className="font-semibold text-slate-800 font-mono">{phone}</span></p>
          <p className="text-xs text-slate-600 mt-1">
            ঠিকানা: {address}
          </p>
          <p className="text-xs font-semibold text-rose-950 mt-0.5">
            এলাকা/উপজেলা: {upazila ? `${upazila}, ` : ''}{district}
          </p>
        </div>
        <div className="sm:text-right">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">পেমেন্ট ও অর্ডার বিবরণ</h3>
          <p className="text-xs sm:text-sm font-bold text-slate-800">
            {order.paymentMethod === 'cod'
              ? 'ক্যাশ অন ডেলিভারি (COD)'
              : order.paymentMethod === 'bkash'
              ? 'বিকাশ (bKash)'
              : order.paymentMethod === 'nagad'
              ? 'নগদ (Nagad)'
              : String(order.paymentMethod || '').toUpperCase()}
          </p>
          {order.paymentNumber && (
            <p className="text-xs text-slate-600 mt-1">
              প্রেরকের মোবাইল: <span className="font-semibold text-slate-800 font-mono">{order.paymentNumber}</span>
            </p>
          )}
          {order.trxId && (
            <p className="text-xs text-slate-600 mt-1">
              TrxID: <span className="font-bold text-rose-900 font-mono">{order.trxId}</span>
            </p>
          )}
          <p className="text-xs text-slate-600 mt-1">
            অর্ডার স্ট্যাটাস: <span className="font-semibold text-amber-700 uppercase bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block mt-0.5">{order.status}</span>
          </p>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-6 overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-300 text-slate-500 uppercase text-[10px]">
              <th className="py-2.5">পণ্য</th>
              <th className="py-2.5 text-center">পরিমাণ</th>
              <th className="py-2.5 text-right">একক মূল্য</th>
              <th className="py-2.5 text-right">মোট</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(order.items || []).map((item, index) => {
              const itemName = item.nameBn || item.nameEn || item.product?.name || 'ব্যাগ';
              const itemPrice = item.price || item.product?.price || 0;
              const lineTotal = item.totalPrice || itemPrice * item.quantity;
              const itemImage =
                item.image ||
                item.product?.images?.[0] ||
                '/images/product_leather_bag_1792674216295.jpg';

              return (
                <tr key={index}>
                  <td className="py-3 font-medium text-slate-800">
                    <div className="flex items-center gap-3">
                      <img
                        src={itemImage}
                        alt={itemName}
                        className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            '/images/product_leather_bag_1792674216295.jpg';
                        }}
                      />
                      <div>
                        <div className="font-semibold text-slate-900">{itemName}</div>
                        {item.nameEn && item.nameEn !== itemName && (
                          <div className="text-[11px] text-slate-500">{item.nameEn}</div>
                        )}
                        {item.selectedColor && (
                          <span className="text-[11px] text-slate-500 font-normal block mt-0.5">
                            কালার: <span className="font-medium text-slate-700">{item.selectedColor}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-center font-medium">{item.quantity}</td>
                  <td className="py-3 text-right">৳ {itemPrice}</td>
                  <td className="py-3 text-right font-bold text-slate-900">৳ {lineTotal}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="border-t border-slate-200 pt-4 mb-6 flex justify-end">
        <div className="w-1/2 space-y-1 text-xs sm:text-sm">
          <div className="flex justify-between text-slate-600">
            <span>পণ্যের মোট দাম:</span>
            <span>৳ {order.subtotal}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>ডেলিভারি চার্জ:</span>
            <span>৳ {shippingCharge}</span>
          </div>
          <div className="flex justify-between text-sm sm:text-base font-bold text-rose-950 border-t border-slate-200 pt-2 mt-2">
            <span>সর্বমোট:</span>
            <span>৳ {order.totalAmount}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center border-t border-dashed border-slate-200 pt-4 text-xs text-slate-500">
        <p className="font-medium text-slate-700">Xora Lifestyle-এ কেনাকাটার জন্য আপনাকে ধন্যবাদ!</p>
      </div>
    </div>
  );
};
