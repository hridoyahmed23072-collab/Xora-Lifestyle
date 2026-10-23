# Xora Lifestyle (জোড়া লাইফস্টাইল) - Mobile-First E-Commerce & Admin Portal

A production-grade, mobile-first e-commerce web platform for **Xora Lifestyle** (Bangladesh). Designed with high-contrast artisanal aesthetics, bilingual Bengali and English support, full Cash on Delivery (COD) and mobile banking (bKash & Nagad), nationwide shipment coverage across all 64 districts of Bangladesh, and an administrative control panel.

---

## 🌟 Highlights & Key Features

### 🛍️ Customer Storefront
- **Bilingual Interface**: Seamlessly switch between **Bangla (বাংলা, default)** and **English (EN)** across all navigation links, buttons, order statuses, and Bengali numeral formatting for BDT (`৳`).
- **Announcement Bar**: Slim, dismissible top banner highlighting nationwide delivery rates and free shipping.
- **Sticky Header**: Brand wordmark, real-time autocomplete search, language toggle, and live shopping bag with animated badge.
- **Mobile Bottom Navigation**: Ergonomic 5-item thumb bar for mobile shoppers (*Home*, *Shop*, *Categories*, *Cart*, *Track Order*).
- **Home Experience**:
  - Hero campaign with authentic artisanal photography.
  - 4 Curated Category Showcases (*Fashion*, *Accessories*, *Beauty & Wellness*, *Home & Lifestyle*).
  - Interactive Filter Tabs (*Featured*, *New Arrivals*, *Best Sellers*).
  - Verified Bangladeshi customer reviews from Dhaka, Chattogram, and Sylhet.
  - Brand trust badges: Cash on Delivery, 64 districts shipping, 7-day hassle-free returns.
- **Shop Catalog**: Filter by category, search by query, price slider (৳500 – ৳5,000), and sort by popularity, price, or newest.
- **Product Details (PDP)**:
  - Multi-image gallery with high-resolution thumbnails.
  - Variant selectors (Color swatches & Size buttons), quantity steppers, and stock status indicators.
  - **Add to Cart** and direct **Order Now** quick checkout.
  - Specifications table and direct WhatsApp inquiry link.
- **Shopping Bag & Slide-Over Drawer**:
  - Persistent `localStorage` bag with free shipping progress bar (free above ৳3,000).
- **Bangladeshi 1-Page Checkout**:
  - Full Name & **11-digit Bangladesh Phone Validation** (`01XXXXXXXXX`).
  - **Complete dropdown of all 64 districts of Bangladesh**.
  - Dynamic delivery fee computation: **Inside Dhaka (৳70)** vs **Outside Dhaka (৳130)** (Free shipping above ৳3,000).
  - Payment methods: **Cash on Delivery (COD)**, **bKash Send Money** (with TrxID input), and **Nagad Send Money** (with TrxID input).
- **Order Confirmation & Live Order Tracking**:
  - Unique Order ID generation (`XOR-XXXXXX`).
  - Instant **"Confirm Order via WhatsApp"** button with a pre-filled receipt message.
  - Live order tracking timeline (*Placed* $\to$ *Confirmed* $\to$ *Processing* $\to$ *Shipped* $\to$ *Delivered*) with an instant demo order preview (`XOR-1001`).
- **Informational Pages**: About Us, Contact Us, 7-Day Return Policy, Delivery Info, and 404 Not Found.
- **Floating Communication**: Elevated, thumb-friendly floating **WhatsApp** and **Facebook Messenger** chat buttons.

---

### 🛡️ Admin Portal (`/admin`)
- **Protected Access**: Route-level protection requiring login with the authorized email (`VITE_ADMIN_EMAIL`, default: `hridoyahmed23072@gmail.com`).
- **Demo Admin Login**: In demo mode (when Firebase env vars are missing), a 1-click login allows instant exploration and testing of the admin suite.
- **Executive Dashboard**:
  - Real-time revenue total in BDT (`৳`).
  - Total order counts & pending orders requiring confirmation calls.
  - Inventory alerts for items with $\le 10$ units left.
  - Recent order stream with direct status previews.
- **Product Management (`/admin/products`)**:
  - Add, edit, and delete products.
  - Bilingual naming, custom URL slugs, pricing, stock control, and badges (*Featured*, *New*, *Best Seller*).
  - Multi-image management using Cloudinary unsigned upload or direct image URLs.
- **Category Management (`/admin/categories`)**:
  - Create and edit categories with visual covers and bilingual descriptions.
- **Order Fulfillment (`/admin/orders`)**:
  - Filter by fulfillment status (*Pending*, *Confirmed*, *Processing*, *Shipped*, *Delivered*, *Cancelled*).
  - Search by Order ID, Customer Name, or Phone.
  - **Print Invoice**: Clean, print-styled commercial invoice ready for direct thermal or paper printing (`window.print()`).
  - **CSV Export**: One-click download of all orders formatted in UTF-8 with BOM for clean Bengali character rendering in Excel and Google Sheets.
- **Customer Reviews (`/admin/reviews`)**:
  - Moderate testimonials, ratings, and toggle verified purchaser badges.
- **Store Settings (`/admin/settings`)**:
  - Configure delivery charges (Inside Dhaka, Outside Dhaka, Free shipping threshold).
  - Update official bKash and Nagad payment receiving numbers.
  - Update hotline, WhatsApp number, email, and showroom addresses.

---

## ⚡ Dual Mode Architecture (Demo vs. Firebase)

| Feature | DEMO MODE (Default) | FIREBASE MODE |
| :--- | :--- | :--- |
| **Activation** | Active when Firebase environment variables are empty | Automatically activates when `VITE_FIREBASE_*` keys are filled in `.env` |
| **Data Store** | Seeded `localStorage` with 6 bag categories, 8 artisan bag products, reviews, sample orders | Real-time Firebase Firestore database (`products`, `categories`, `orders`, `reviews`, `settings`) |
| **Admin Login** | 1-Click quick login as `hridoyahmed23072@gmail.com` | Firebase Authentication (Email / Password) restricted to `VITE_ADMIN_EMAIL` |
| **Images** | High-fidelity local assets + base64 data URLs | Cloudinary unsigned CDN upload or remote image URLs |

---

## 🔧 Environment Variables Setup

Create a `.env` file in the root directory (refer to `.env.example`):

```bash
# Firebase Credentials (Optional: Leave empty for DEMO mode)
VITE_FIREBASE_API_KEY="AIzaSy..."
VITE_FIREBASE_AUTH_DOMAIN="xora-lifestyle.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="xora-lifestyle"
VITE_FIREBASE_STORAGE_BUCKET="xora-lifestyle.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="1234567890"
VITE_FIREBASE_APP_ID="1:1234567890:web:abcdef"
VITE_ADMIN_EMAIL="hridoyahmed23072@gmail.com"

# Cloudinary Unsigned Image Upload (Optional: base64 fallback in demo mode)
VITE_CLOUDINARY_CLOUD_NAME="your_cloud_name"
VITE_CLOUDINARY_UPLOAD_PRESET="your_unsigned_preset"
```

---

## 🚀 Development & Build

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run TypeScript check
npm run lint

# Build for production
npm run build
```

---

## 📁 Key Directory Structure

```
├── .env.example              # Environment variables template
├── firestore.rules           # Security rules for Firestore collections
├── index.html                # Entry point with Google Fonts (Hind Siliguri & Playfair Display)
├── src/
│   ├── admin/                # Admin Portal
│   │   ├── AdminLayout.tsx   # Protected layout & navigation sidebar
│   │   ├── AdminLogin.tsx    # Admin authentication
│   │   ├── AdminDashboard.tsx# Business analytics & inventory alert
│   │   ├── AdminProducts.tsx # Product inventory & Cloudinary uploader
│   │   ├── AdminCategories.tsx # Category management
│   │   ├── AdminOrders.tsx   # Orders, printable invoice & CSV export
│   │   ├── AdminReviews.tsx  # Customer testimonials manager
│   │   └── AdminSettings.tsx # Store settings & mobile banking numbers
│   ├── components/           # Reusable UI components
│   │   ├── AnnouncementBar.tsx
│   │   ├── Header.tsx
│   │   ├── MobileBottomNav.tsx
│   │   ├── ProductCard.tsx
│   │   ├── CartDrawer.tsx
│   │   ├── Footer.tsx
│   │   └── FloatingContactButtons.tsx
│   ├── context/
│   │   ├── AuthContext.tsx    # Admin authentication context
│   │   ├── LanguageContext.tsx# Bilingual language state (default: 'bn')
│   │   └── CartContext.tsx    # Shopping bag & localStorage persistence
│   ├── lib/
│   │   ├── constants.ts       # 64 BD districts, 4 categories, 8 products
│   │   ├── translations.ts    # Complete bilingual dictionary
│   │   ├── firebase.ts        # Firebase Firestore & Auth initializers
│   │   └── cloudinary.ts      # Cloudinary unsigned upload utility
│   ├── pages/                 # Customer Storefront Pages
│   │   ├── Home.tsx
│   │   ├── Shop.tsx
│   │   ├── ProductDetails.tsx
│   │   ├── CartPage.tsx
│   │   ├── Checkout.tsx
│   │   ├── OrderSuccess.tsx
│   │   ├── TrackOrder.tsx
│   │   ├── About.tsx
│   │   ├── Contact.tsx
│   │   ├── Returns.tsx
│   │   ├── DeliveryInfo.tsx
│   │   └── NotFound.tsx
│   ├── services/
│   │   └── storeService.ts    # Dual-mode data service (Firebase + localStorage)
│   ├── types/
│   │   └── index.ts           # TypeScript interfaces
│   ├── App.tsx                # App routing & providers
│   └── main.tsx               # DOM entry
```

---

## 🛡️ Firestore Security Rules (`firestore.rules`)
- **Public**: Read access for products, categories, reviews, and settings; create order capability for customers.
- **Admin**: Full read, write, update, and delete access for products, categories, orders, reviews, and settings enforced via `request.auth.token.email`.
