export type Language = 'bn' | 'en';

export interface ProductVariant {
  name: string; // e.g., 'Color' or 'Size'
  options: string[]; // e.g., ['S', 'M', 'L', 'XL'] or ['Maroon', 'Midnight Navy']
}

export interface Product {
  id: string;
  nameBn: string;
  nameEn: string;
  slug: string;
  categoryId: string;
  categoryNameBn: string;
  categoryNameEn: string;
  price: number;
  originalPrice?: number;
  images: string[];
  shortDescriptionBn: string;
  shortDescriptionEn: string;
  descriptionBn: string;
  descriptionEn: string;
  specificationsBn: Record<string, string>;
  specificationsEn: Record<string, string>;
  variants?: {
    sizes?: string[];
    colors?: { nameBn: string; nameEn: string; hex: string }[];
  };
  inStock: boolean;
  stockCount: number;
  isFeatured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  rating: number;
  reviewsCount: number;
  createdAt: string;
}

export interface Category {
  id: string;
  nameBn: string;
  nameEn: string;
  slug: string;
  image: string;
  descriptionBn: string;
  descriptionEn: string;
  itemCount: number;
}

export interface CartItem {
  productId: string;
  nameBn: string;
  nameEn: string;
  price: number;
  image: string;
  selectedColor?: string;
  selectedSize?: string;
  quantity: number;
  maxStock: number;
}

export type DeliveryZone = 'inside_dhaka' | 'outside_dhaka';
export type PaymentMethod = 'cod' | 'bkash' | 'nagad';
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  nameBn: string;
  nameEn: string;
  price: number;
  image: string;
  selectedColor?: string;
  selectedSize?: string;
  quantity: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  district: string;
  deliveryZone: DeliveryZone;
  deliveryCharge: number;
  subtotal: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentNumber?: string;
  trxId?: string;
  notes?: string;
  items: OrderItem[];
  status: OrderStatus;
  statusHistory?: {
    status: OrderStatus;
    timestamp: string;
    noteBn?: string;
    noteEn?: string;
  }[];
  createdAt: string;
  estimatedDelivery: string;
}

export interface CustomerReview {
  id: string;
  customerNameBn: string;
  customerNameEn: string;
  districtBn: string;
  districtEn: string;
  productNameBn: string;
  productNameEn: string;
  rating: number;
  commentBn: string;
  commentEn: string;
  date: string;
  verified: boolean;
}

export interface District {
  id: string;
  nameBn: string;
  nameEn: string;
  divisionBn: string;
  divisionEn: string;
}

export interface StoreSettings {
  storeName: string;
  taglineBn: string;
  taglineEn: string;
  phone: string;
  whatsapp: string;
  facebookUrl: string;
  email: string;
  addressBn: string;
  addressEn: string;
  insideDhakaCharge: number;
  outsideDhakaCharge: number;
  bkashNumber: string;
  nagadNumber: string;
  freeShippingMinAmount?: number;
}
