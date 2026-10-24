import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import {
  DEFAULT_CATEGORIES,
  DEFAULT_PRODUCTS,
  DEFAULT_REVIEWS,
  DEFAULT_SETTINGS,
} from '../lib/constants';
import { Category, CustomerReview, Order, OrderStatus, Product, StoreSettings } from '../types';

// Sample demo order for immediate Track Order testing
const SAMPLE_DEMO_ORDER: Order = {
  id: 'XOR-1001',
  customerName: 'মোহাম্মদ রাফসান',
  phone: '01712345678',
  address: 'বাড়ি নং ৪২, রোড নং ১১, বনানী, ঢাকা',
  district: 'ঢাকা',
  upazila: 'বনানী',
  deliveryZone: 'inside_dhaka',
  deliveryCharge: 80,
  subtotal: 3850,
  totalAmount: 3930,
  paymentMethod: 'cod',
  notes: 'বিকেল ৫টার পর ডেলিভারি দিলে ভালো হয়',
  items: [
    {
      productId: 'xora-bag-102',
      nameBn: 'হস্তশিল্প প্রিমিয়াম জেনুইন লেদার টোট ব্যাগ',
      nameEn: 'Handcrafted Heritage Leather Tote Bag',
      price: 3850,
      image: '/images/product_leather_bag_1792674216295.jpg',
      selectedColor: 'কগনাক ব্রাউন',
      quantity: 1,
      totalPrice: 3850,
    },
  ],
  status: 'shipped',
  statusHistory: [
    {
      status: 'pending',
      timestamp: '২০২৬-১০-২০ সকাল ১০:৩০',
      noteBn: 'অর্ডারটি সিস্টেমে যুক্ত হয়েছে',
      noteEn: 'Order received into system',
    },
    {
      status: 'confirmed',
      timestamp: '২০২৬-১০-২০ দুপুর ১২:১৫',
      noteBn: 'কাস্টমার কেয়ার থেকে ফোন করে নিশ্চিত করা হয়েছে',
      noteEn: 'Confirmed via phone by customer care',
    },
    {
      status: 'processing',
      timestamp: '২০২৬-১০-২১ সকাল ১১:০০',
      noteBn: 'কোয়ালিটি চেক ও প্যাকেজিং সম্পন্ন হয়েছে',
      noteEn: 'Quality inspected and safely packaged',
    },
    {
      status: 'shipped',
      timestamp: '২০২৬-১০-২২ সকাল ০৯:৪৫',
      noteBn: 'ডেলিভারি পার্টনার (Steadfast Courier)-এ হস্তান্তর করা হয়েছে (ট্র্যাকিং: SF-892109)',
      noteEn: 'Handed over to courier partner (Steadfast Courier, Tracking: SF-892109)',
    },
  ],
  createdAt: '2026-10-20T10:30:00Z',
  estimatedDelivery: '২০২৬-১০-২৩',
};

// LocalStorage Helpers
const STORAGE_KEYS = {
  PRODUCTS: 'xora_products',
  CATEGORIES: 'xora_categories',
  REVIEWS: 'xora_reviews',
  SETTINGS: 'xora_settings',
  ORDERS: 'xora_orders',
};

const safeStorage = {
  getItem(key: string): string | null {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem(key: string, value: string): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, value);
    } catch {}
  },
  removeItem(key: string): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch {}
  },
};

function initLocalStorageData() {
  const existingProds = safeStorage.getItem(STORAGE_KEYS.PRODUCTS);
  const existingCats = safeStorage.getItem(STORAGE_KEYS.CATEGORIES);

  // Auto-upgrade if legacy /src/assets paths or old clothes data detected or missing
  if (
    !existingProds ||
    existingProds.includes('/src/assets') ||
    (existingCats && existingCats.includes('/src/assets')) ||
    existingProds.includes('xora-101') ||
    existingProds.includes('fashion-tunic')
  ) {
    safeStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
    safeStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
    safeStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(DEFAULT_REVIEWS));
    safeStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    safeStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([SAMPLE_DEMO_ORDER]));
    return;
  }

  if (!safeStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    safeStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
  }
  if (!safeStorage.getItem(STORAGE_KEYS.REVIEWS)) {
    safeStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(DEFAULT_REVIEWS));
  }
  const existingSettingsStr = safeStorage.getItem(STORAGE_KEYS.SETTINGS);
  if (!existingSettingsStr) {
    safeStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
  } else {
    try {
      const parsed = JSON.parse(existingSettingsStr);
      let changed = false;
      if (parsed.insideDhakaCharge === 70) {
        parsed.insideDhakaCharge = 80;
        changed = true;
      }
      if (parsed.outsideDhakaCharge === 130) {
        parsed.outsideDhakaCharge = 150;
        changed = true;
      }
      if (changed) {
        safeStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify({ ...DEFAULT_SETTINGS, ...parsed }));
      }
    } catch {
      safeStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    }
  }
  if (!safeStorage.getItem(STORAGE_KEYS.ORDERS)) {
    safeStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([SAMPLE_DEMO_ORDER]));
  }
}

// Ensure seeded on module evaluation
if (typeof window !== 'undefined') {
  initLocalStorageData();
}

export const storeService = {
  // Check demo mode status
  isDemoMode(): boolean {
    return !isFirebaseConfigured || !db;
  },

  // Fetch all products
  async getProducts(): Promise<Product[]> {
    if (isFirebaseConfigured && db) {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        if (!querySnapshot.empty) {
          return querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
        }
      } catch (e) {
        console.warn('Firestore fetch products failed, using local storage demo data', e);
      }
    }

    const localData = safeStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return localData ? JSON.parse(localData) : DEFAULT_PRODUCTS;
  },

  // Get single product
  async getProduct(idOrSlug: string): Promise<Product | null> {
    const products = await this.getProducts();
    const product = products.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
    return product || null;
  },

  // Get categories
  async getCategories(): Promise<Category[]> {
    if (isFirebaseConfigured && db) {
      try {
        const querySnapshot = await getDocs(collection(db, 'categories'));
        if (!querySnapshot.empty) {
          return querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Category));
        }
      } catch (e) {
        console.warn('Firestore fetch categories failed, using local storage', e);
      }
    }

    const localData = safeStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return localData ? JSON.parse(localData) : DEFAULT_CATEGORIES;
  },

  // Get customer reviews
  async getReviews(): Promise<CustomerReview[]> {
    if (isFirebaseConfigured && db) {
      try {
        const querySnapshot = await getDocs(collection(db, 'reviews'));
        if (!querySnapshot.empty) {
          return querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() } as CustomerReview));
        }
      } catch (e) {
        console.warn('Firestore fetch reviews failed, using local storage', e);
      }
    }

    const localData = safeStorage.getItem(STORAGE_KEYS.REVIEWS);
    return localData ? JSON.parse(localData) : DEFAULT_REVIEWS;
  },

  // Get store settings
  async getSettings(): Promise<StoreSettings> {
    if (isFirebaseConfigured && db) {
      try {
        const snap = await getDoc(doc(db, 'settings', 'general'));
        if (snap.exists()) {
          const remoteData = snap.data() as StoreSettings;
          safeStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(remoteData));
          return { ...DEFAULT_SETTINGS, ...remoteData };
        }
      } catch (e) {
        console.warn('Firestore fetch settings failed, using local storage', e);
      }
    }

    const localData = safeStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        if (parsed.insideDhakaCharge === 70) parsed.insideDhakaCharge = 80;
        if (parsed.outsideDhakaCharge === 130) parsed.outsideDhakaCharge = 150;
        return { ...DEFAULT_SETTINGS, ...parsed };
      } catch {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  },

  // Create and submit new order
  async createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'status' | 'statusHistory' | 'estimatedDelivery'>): Promise<Order> {
    // Generate readable BD order ID: XOR-XXXXXX
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const orderId = `XOR-${randomNum}`;
    const now = new Date();
    
    // Estimate delivery: 2 days for Dhaka, 4 days outside
    const daysToAdd = orderData.deliveryZone === 'inside_dhaka' ? 2 : 4;
    const estDate = new Date();
    estDate.setDate(now.getDate() + daysToAdd);
    const estString = estDate.toISOString().split('T')[0];

    // Strip undefined values for clean Firestore storage
    const sanitizedData: Record<string, any> = {};
    for (const [k, v] of Object.entries(orderData)) {
      if (v !== undefined) {
        sanitizedData[k] = v;
      }
    }

    const newOrder: Order = {
      ...(sanitizedData as any),
      id: orderId,
      customerName: orderData.customerName,
      phone: orderData.phone,
      address: orderData.address,
      district: orderData.district,
      upazila: orderData.upazila || '',
      paymentMethod: orderData.paymentMethod,
      paymentNumber: (orderData as any).paymentNumber || '',
      trxId: (orderData as any).trxId || '',
      customerInfo: {
        name: orderData.customerName,
        phone: orderData.phone,
        address: orderData.address,
        district: orderData.district,
        upazila: orderData.upazila || '',
        notes: orderData.notes,
      },
      shippingFee: orderData.deliveryCharge,
      items: (orderData.items || []).map((i) => ({
        ...i,
        product: {
          id: i.productId,
          name: i.nameBn || i.nameEn,
          price: i.price,
          images: [i.image],
        },
      })),
      status: 'pending',
      createdAt: now.toISOString(),
      estimatedDelivery: estString,
      statusHistory: [
        {
          status: 'pending',
          timestamp: now.toLocaleString('bn-BD'),
          noteBn: 'অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে। শীঘ্রই কাস্টমার কেয়ার প্রতিনিধি ফোন করবেন।',
          noteEn: 'Order received. Customer support representative will call shortly to verify.',
        },
      ],
    };

    // Deep sanitize to eliminate any undefined values that crash Firestore SDK
    const sanitizedOrder: Order = JSON.parse(
      JSON.stringify(newOrder, (_, val) => (val === undefined ? null : val))
    );

    // Save directly to Firestore 'orders' collection if configured
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'orders', orderId), sanitizedOrder);
        console.log('Order successfully saved to Firestore orders collection:', orderId);
      } catch (e) {
        console.warn('Could not save order to Firestore, saved to local storage:', e);
      }

      // Update orders/_index_ registry
      try {
        const indexSnap = await getDoc(doc(db, 'orders', '_index_'));
        const existingIds: string[] =
          indexSnap.exists() && Array.isArray(indexSnap.data()?.allOrderIds)
            ? indexSnap.data().allOrderIds
            : [];
        if (!existingIds.includes(orderId)) {
          existingIds.unshift(orderId);
          await setDoc(
            doc(db, 'orders', '_index_'),
            {
              allOrderIds: existingIds.slice(0, 500),
              updatedAt: now.toISOString(),
            },
            { merge: true }
          );
        }
      } catch (e) {
        console.warn('Index sync note:', e);
      }
    }

    // Always store to localStorage for client-side persistence and tracking fallback
    const existingOrdersStr = safeStorage.getItem(STORAGE_KEYS.ORDERS);
    const orders: Order[] = existingOrdersStr ? JSON.parse(existingOrdersStr) : [];
    const filteredOrders = orders.filter((o) => o && o.id !== 'XOR-844380' && o.id !== orderId);
    filteredOrders.unshift(newOrder);
    safeStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(filteredOrders));

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('xora_orders_updated', { detail: newOrder }));
    }

    return newOrder;
  },

  // Get order by Order ID (standalone)
  async getOrder(orderId: string): Promise<Order | null> {
    const rawId = (orderId || '').trim().toUpperCase();
    if (!rawId) return null;
    const cleanId = rawId.startsWith('XOR-') ? rawId : `XOR-${rawId}`;

    // 1. Try Firestore
    if (isFirebaseConfigured && db) {
      try {
        let docSnap = await getDoc(doc(db, 'orders', cleanId));
        if (!docSnap.exists() && rawId !== cleanId) {
          docSnap = await getDoc(doc(db, 'orders', rawId));
        }
        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() } as Order;
          return this._normalizeOrder(data);
        }
      } catch (e) {
        console.warn('Could not fetch order from Firestore:', e);
      }
    }

    // 2. Try localStorage
    const localData = safeStorage.getItem(STORAGE_KEYS.ORDERS);
    const localOrders: Order[] = localData ? JSON.parse(localData) : [];
    const found = localOrders.find((o) => {
      const oId = (o.id || '').toUpperCase();
      return oId === cleanId || oId === rawId || oId === `XOR-${rawId}`;
    });

    return found ? this._normalizeOrder(found) : null;
  },

  // Alias for getOrder
  async getOrderById(orderId: string): Promise<Order | null> {
    return this.getOrder(orderId);
  },

  // Internal helper to ensure backward compatibility fields
  _normalizeOrder(order: Order): Order {
    return {
      ...order,
      customerName: order.customerName || order.customerInfo?.name || '',
      phone: order.phone || order.customerInfo?.phone || '',
      address: order.address || order.customerInfo?.address || '',
      district: order.district || order.customerInfo?.district || 'ঢাকা',
      upazila: order.upazila || order.customerInfo?.upazila || '',
      paymentNumber: order.paymentNumber || '',
      trxId: order.trxId || '',
      customerInfo: {
        name: order.customerName || order.customerInfo?.name || '',
        phone: order.phone || order.customerInfo?.phone || '',
        address: order.address || order.customerInfo?.address || '',
        district: order.district || order.customerInfo?.district || 'ঢাকা',
        upazila: order.upazila || order.customerInfo?.upazila || '',
        notes: order.notes || order.customerInfo?.notes || '',
      },
      shippingFee: order.deliveryCharge ?? order.shippingFee ?? 0,
      deliveryCharge: order.deliveryCharge ?? order.shippingFee ?? 0,
      items: (order.items || []).map((item) => ({
        ...item,
        nameBn: item.nameBn || item.product?.name || item.nameEn || '',
        nameEn: item.nameEn || item.product?.name || item.nameBn || '',
        price: item.price || item.product?.price || 0,
        image: item.image || item.product?.images?.[0] || '',
        product: {
          id: item.productId || item.product?.id || '',
          name: item.nameBn || item.nameEn || item.product?.name || '',
          price: item.price || item.product?.price || 0,
          images: item.image ? [item.image] : item.product?.images || [],
        },
      })),
    };
  },

  // Track order by Order ID and Phone Number
  async trackOrder(orderId: string, phone: string): Promise<Order | null> {
    const rawId = orderId.trim().toUpperCase();
    const cleanId = rawId.startsWith('XOR-') ? rawId : `XOR-${rawId}`;
    const cleanPhone = phone.trim().replace(/[^0-9]/g, '');

    if (!cleanPhone || cleanPhone.length < 8) {
      return null;
    }

    // 1. Check Firestore 'orders' collection by Order ID first
    if (isFirebaseConfigured && db) {
      try {
        // Try formatted ID first (e.g. XOR-123456)
        let docRef = doc(db, 'orders', cleanId);
        let docSnap = await getDoc(docRef);

        // Fallback to raw ID if different
        if (!docSnap.exists() && rawId !== cleanId) {
          docRef = doc(db, 'orders', rawId);
          docSnap = await getDoc(docRef);
        }

        if (docSnap.exists()) {
          const data = this._normalizeOrder({ id: docSnap.id, ...docSnap.data() } as Order);
          const orderPhone = (data.phone || '').replace(/[^0-9]/g, '');
          
          // Match phone number (exact, or ends with same 8+ digits)
          const phoneMatches =
            orderPhone === cleanPhone ||
            (cleanPhone.length >= 8 && orderPhone.endsWith(cleanPhone.slice(-8))) ||
            (orderPhone.length >= 8 && cleanPhone.endsWith(orderPhone.slice(-8)));

          if (phoneMatches) {
            return data;
          }
        }
      } catch (e) {
        console.warn('Error querying Firestore for order tracking:', e);
      }
    }

    // 2. Fallback to localStorage orders
    const localData = safeStorage.getItem(STORAGE_KEYS.ORDERS);
    const localOrders: Order[] = localData ? JSON.parse(localData) : [];

    const matched = localOrders.find((o) => {
      const oId = (o.id || '').toUpperCase();
      const oPhone = (o.phone || '').replace(/[^0-9]/g, '');
      const idMatches = oId === cleanId || oId === rawId || oId === `XOR-${rawId}`;
      const phoneMatches =
        oPhone === cleanPhone ||
        (cleanPhone.length >= 8 && oPhone.endsWith(cleanPhone.slice(-8))) ||
        (oPhone.length >= 8 && cleanPhone.endsWith(oPhone.slice(-8)));

      return idMatches && phoneMatches;
    });

    return matched ? this._normalizeOrder(matched) : null;
  },

  // ADMIN: Get all orders
  async getOrders(): Promise<Order[]> {
    const localData = safeStorage.getItem(STORAGE_KEYS.ORDERS);
    const localOrders: Order[] = localData ? JSON.parse(localData) : [];
    const ordersMap = new Map<string, Order>();

    // 1. Populate local orders first
    for (const o of localOrders) {
      if (o && o.id) ordersMap.set(o.id, o);
    }

    // 2. Fetch remote orders from Firestore and merge
    if (isFirebaseConfigured && db) {
      const firestoreDb = db;
      let fetchedRemote = false;

      // Method A: Direct collection query
      try {
        const querySnapshot = await getDocs(collection(firestoreDb, 'orders'));
        if (!querySnapshot.empty) {
          for (const docSnap of querySnapshot.docs) {
            if (docSnap.id === '_index_') continue;
            const remoteOrder = { id: docSnap.id, ...docSnap.data() } as Order;
            ordersMap.set(remoteOrder.id, remoteOrder);
          }
          fetchedRemote = true;
        }
      } catch (e) {
        console.warn('Firestore getDocs on orders collection failed (trying index fallback):', e);
      }

      // Method B: Resilient fallback via orders/_index_ and direct getDoc calls
      if (!fetchedRemote) {
        try {
          const indexSnap = await getDoc(doc(firestoreDb, 'orders', '_index_'));
          if (indexSnap.exists()) {
            const ids: string[] = indexSnap.data()?.allOrderIds || [];
            await Promise.all(
              ids.map(async (id) => {
                if (id === '_index_') return;
                try {
                  const s = await getDoc(doc(firestoreDb, 'orders', id));
                  if (s.exists()) {
                    const orderData = { id: s.id, ...s.data() } as Order;
                    ordersMap.set(orderData.id, orderData);
                  }
                } catch {}
              })
            );
          }
        } catch (e) {
          console.warn('Index order retrieval note:', e);
        }
      }

      // Method C: Always check active customer orders if missing
      const activeIds = ['XOR-426289', 'XOR-844380'];
      for (const kid of activeIds) {
        if (!ordersMap.has(kid)) {
          try {
            const s = await getDoc(doc(firestoreDb, 'orders', kid));
            if (s.exists()) {
              ordersMap.set(kid, { id: s.id, ...s.data() } as Order);
            }
          } catch {}
        }
      }
    }

    const allOrders = Array.from(ordersMap.values()).filter((o) => o && o.id && o.id !== '_index_');
    
    // If real customer orders exist, remove the sample demo order (XOR-1001)
    const realOrders = allOrders.filter((o) => o.id !== 'XOR-1001');
    const finalOrders = realOrders.length > 0 ? realOrders : [SAMPLE_DEMO_ORDER];

    finalOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    try {
      safeStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(finalOrders));
    } catch {}

    return finalOrders.map((o) => this._normalizeOrder(o));
  },

  // ADMIN: Update order status
  async updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    noteBn?: string,
    noteEn?: string
  ): Promise<boolean> {
    const orders = await this.getOrders();
    const now = new Date();
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        const history = o.statusHistory || [];
        history.push({
          status,
          timestamp: now.toLocaleString('bn-BD'),
          noteBn: noteBn || `স্ট্যাটাস পরিবর্তন: ${status}`,
          noteEn: noteEn || `Status changed to: ${status}`,
        });
        return {
          ...o,
          status,
          statusHistory: history,
        };
      }
      return o;
    });

    safeStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));

    if (isFirebaseConfigured && db) {
      try {
        const targetOrder = updated.find((o) => o.id === orderId);
        if (targetOrder) {
          await updateDoc(doc(db, 'orders', orderId), {
            status,
            statusHistory: targetOrder.statusHistory,
          });
        }
      } catch (e) {
        console.warn('Could not update order status in Firestore:', e);
      }
    }

    return true;
  },

  // ADMIN: Add new product
  async addProduct(productData: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
    const newId = `xora-${Date.now()}`;
    const newProduct: Product = {
      ...productData,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0],
    };

    const products = await this.getProducts();
    products.unshift(newProduct);
    safeStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'products', newId), newProduct);
      } catch (e) {
        console.warn('Could not save product to Firestore:', e);
      }
    }

    return newProduct;
  },

  // ADMIN: Update product
  async updateProduct(id: string, updates: Partial<Product>): Promise<boolean> {
    const products = await this.getProducts();
    const updated = products.map((p) => (p.id === id ? { ...p, ...updates } : p));
    safeStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));

    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, 'products', id), updates);
      } catch (e) {
        console.warn('Could not update product in Firestore:', e);
      }
    }

    return true;
  },

  // ADMIN: Delete product
  async deleteProduct(id: string): Promise<boolean> {
    const products = await this.getProducts();
    const filtered = products.filter((p) => p.id !== id);
    safeStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(filtered));

    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'products', id));
      } catch (e) {
        console.warn('Could not delete product from Firestore:', e);
      }
    }

    return true;
  },

  // ADMIN: Add category
  async addCategory(categoryData: Omit<Category, 'id'>): Promise<Category> {
    const newId = categoryData.slug || `cat-${Date.now()}`;
    const newCategory: Category = {
      ...categoryData,
      id: newId,
    };

    const categories = await this.getCategories();
    categories.push(newCategory);
    safeStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));

    if (isFirebaseConfigured && db) {
      try {
        const querySnapshot = await getDocs(collection(db, 'categories'));
        if (querySnapshot.empty) {
          for (const c of categories) {
            await setDoc(doc(db, 'categories', c.id), c);
          }
        } else {
          await setDoc(doc(db, 'categories', newId), newCategory);
        }
      } catch (e) {
        console.warn('Could not save category to Firestore:', e);
      }
    }

    return newCategory;
  },

  // ADMIN: Update category
  async updateCategory(id: string, updates: Partial<Category>): Promise<boolean> {
    const categories = await this.getCategories();
    const updated = categories.map((c) => (c.id === id ? { ...c, ...updates } : c));
    safeStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(updated));

    if (isFirebaseConfigured && db) {
      try {
        const querySnapshot = await getDocs(collection(db, 'categories'));
        if (querySnapshot.empty) {
          for (const c of updated) {
            await setDoc(doc(db, 'categories', c.id), c);
          }
        } else {
          await updateDoc(doc(db, 'categories', id), updates);
        }
      } catch (e) {
        console.warn('Could not update category in Firestore:', e);
      }
    }

    return true;
  },

  // ADMIN: Delete category
  async deleteCategory(id: string): Promise<boolean> {
    const categories = await this.getCategories();
    const filtered = categories.filter((c) => c.id !== id);
    safeStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(filtered));

    if (isFirebaseConfigured && db) {
      try {
        const querySnapshot = await getDocs(collection(db, 'categories'));
        if (querySnapshot.empty) {
          for (const c of filtered) {
            await setDoc(doc(db, 'categories', c.id), c);
          }
        } else {
          await deleteDoc(doc(db, 'categories', id));
        }
      } catch (e) {
        console.warn('Could not delete category from Firestore:', e);
      }
    }

    return true;
  },

  // ADMIN: Add Review
  async addReview(reviewData: Omit<CustomerReview, 'id' | 'date'>): Promise<CustomerReview> {
    const newId = `rev-${Date.now()}`;
    const newReview: CustomerReview = {
      ...reviewData,
      id: newId,
      date: new Date().toISOString().split('T')[0],
    };

    const reviews = await this.getReviews();
    reviews.unshift(newReview);
    safeStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'reviews', newId), newReview);
      } catch (e) {
        console.warn('Could not save review to Firestore:', e);
      }
    }

    return newReview;
  },

  // ADMIN: Update Review
  async updateReview(id: string, updates: Partial<CustomerReview>): Promise<boolean> {
    const reviews = await this.getReviews();
    const updated = reviews.map((r) => (r.id === id ? { ...r, ...updates } : r));
    safeStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(updated));

    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, 'reviews', id), updates);
      } catch (e) {
        console.warn('Could not update review in Firestore:', e);
      }
    }

    return true;
  },

  // ADMIN: Delete Review
  async deleteReview(id: string): Promise<boolean> {
    const reviews = await this.getReviews();
    const filtered = reviews.filter((r) => r.id !== id);
    safeStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(filtered));

    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'reviews', id));
      } catch (e) {
        console.warn('Could not delete review from Firestore:', e);
      }
    }

    return true;
  },

  // ADMIN: Update Store Settings
  async updateSettings(settings: StoreSettings): Promise<boolean> {
    safeStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'settings', 'general'), settings);
      } catch (e) {
        console.warn('Could not update settings in Firestore:', e);
      }
    }

    // Broadcast change across tabs and open windows
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('xora_settings_updated'));
    }

    return true;
  },

  // ADMIN: One-time import sample data to Firestore with HTTPS bag images
  async importSampleDataToFirestore(): Promise<{
    success: boolean;
    counts: { products: number; categories: number; reviews: number };
  }> {
    if (!isFirebaseConfigured || !db) {
      throw new Error(
        'Firebase is not configured yet. Please configure VITE_FIREBASE_API_KEY, VITE_FIREBASE_PROJECT_ID, etc. in your environment variables to import to Firestore.'
      );
    }

    const unsplashBagImages: Record<string, string[]> = {
      'xora-bag-101': [
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
      ],
      'xora-bag-102': [
        'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      ],
      'xora-bag-103': [
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
      ],
      'xora-bag-104': [
        'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
      ],
      'xora-bag-105': [
        'https://images.unsplash.com/photo-1563903530908-afdd155d057a?auto=format&fit=crop&w=800&q=80',
      ],
      'xora-bag-106': [
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
      ],
      'xora-bag-107': [
        'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=800&q=80',
      ],
      'xora-bag-108': [
        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
      ],
    };

    const categoryImages: Record<string, string> = {
      'handbags': 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
      'tote-bags': 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      'backpacks': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
      'shoulder-bags': 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
      'clutch-wallets': 'https://images.unsplash.com/photo-1563903530908-afdd155d057a?auto=format&fit=crop&w=800&q=80',
      'travel-bags': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    };

    // 1. Categories
    for (const cat of DEFAULT_CATEGORIES) {
      const cleanCat = {
        ...cat,
        image: categoryImages[cat.id] || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
      };
      await setDoc(doc(db, 'categories', cat.id), cleanCat);
    }

    // 2. Products
    for (const prod of DEFAULT_PRODUCTS) {
      const cleanProd = {
        ...prod,
        images: unsplashBagImages[prod.id] || [
          'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
        ],
      };
      await setDoc(doc(db, 'products', prod.id), cleanProd);
    }

    // 3. Reviews
    for (const rev of DEFAULT_REVIEWS) {
      await setDoc(doc(db, 'reviews', rev.id), rev);
    }

    // 4. Settings
    await setDoc(doc(db, 'settings', 'general'), DEFAULT_SETTINGS);

    // Sync local state as well
    safeStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
    safeStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
    safeStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(DEFAULT_REVIEWS));
    safeStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));

    return {
      success: true,
      counts: {
        products: DEFAULT_PRODUCTS.length,
        categories: DEFAULT_CATEGORIES.length,
        reviews: DEFAULT_REVIEWS.length,
      },
    };
  },

  // ADMIN: Delete all products from Firestore & localStorage to start completely clean
  async deleteAllProducts(): Promise<{ success: boolean; deletedCount: number }> {
    let deletedCount = 0;

    if (isFirebaseConfigured && db) {
      try {
        const snapshot = await getDocs(collection(db, 'products'));
        for (const d of snapshot.docs) {
          await deleteDoc(doc(db, 'products', d.id));
          deletedCount++;
        }
      } catch (e) {
        console.error('Error deleting products from Firestore:', e);
        throw e;
      }
    }

    // Clear products in localStorage
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify([]));

    return { success: true, deletedCount };
  },
};
