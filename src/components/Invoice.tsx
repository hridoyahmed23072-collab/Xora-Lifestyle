import React from 'react';
import { Order } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface InvoiceProps {
  order: Order;
}

export const Invoice: React.FC<InvoiceProps> = ({ order }) => {
  const { formatPrice } = useLanguage();

  return (
    <div className="bg-white p-8 max-w-2xl mx-auto border border-slate-200 rounded-lg shadow-sm text-slate-800 font-sans print:shadow-none print:border-none print:p-0">
      {/* Header */}
      <div className="flex justify-between items-start border-b border-slate-200 pb-6 mb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-rose-950">XORA LIFESTYLE</h1>
          <p className="text-xs text-slate-500 uppercase tracking-widest mt-0.5">Premium Trendy Bags</p>
          <p className="text-xs text-slate-600 mt-2">Dhaka, Bangladesh</p>
        </div>
        <div className="text-right">
          <span className="inline-block bg-rose-100 text-rose-950 font-semibold text-xs px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            INVOICE / রসিদ
          </span>
          <p className="text-sm font-bold text-slate-900">Order ID: <span className="text-rose-900">{order.id}</span></p>
          <p className="text-xs text-slate-500 mt-1">
            Date: {new Date(order.createdAt).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Customer Info */}
      <div className="grid grid-cols-2 gap-4 mb-6 bg-slate-50 p-4 rounded-lg border border-slate-100">
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Customer Info</h3>
          <p className="text-sm font-bold text-slate-800">{order.customerInfo.name}</p>
          <p className="text-xs text-slate-600 mt-1">{order.customerInfo.phone}</p>
          <p className="text-xs text-slate-600">{order.customerInfo.address}, {order.customerInfo.district}</p>
        </div>
        <div className="text-right">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Payment Details</h3>
          <p className="text-sm font-bold text-slate-800 uppercase">{order.paymentMethod}</p>
          <p className="text-xs text-slate-600 mt-1">
            Status: <span className="font-semibold text-amber-700 uppercase">{order.status}</span>
          </p>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-6">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-300 text-slate-500 uppercase text-[11px]">
              <th className="py-2">Item</th>
              <th className="py-2 text-center">Qty</th>
              <th className="py-2 text-right">Price</th>
              <th className="py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {order.items.map((item, index) => (
              <tr key={index}>
                <td className="py-3 font-medium text-slate-800">{item.product.name}</td>
                <td className="py-3 text-center">{item.quantity}</td>
                <td className="py-3 text-right">{formatPrice(item.product.price)}</td>
                <td className="py-3 text-right font-semibold">{formatPrice(item.product.price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="border-t border-slate-200 pt-4 mb-8 flex justify-end">
        <div className="w-1/2 space-y-1.5 text-xs sm:text-sm">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal:</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Delivery Fee:</span>
            <span>{formatPrice(order.shippingFee)}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-rose-950 border-t border-slate-200 pt-2 mt-2">
            <span>Total:</span>
            <span>{formatPrice(order.totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center border-t border-dashed border-slate-200 pt-4 text-xs text-slate-500">
        <p className="font-medium text-slate-700">Thank you for shopping with Xora Lifestyle!</p>
      </div>
    </div>
  );
};
