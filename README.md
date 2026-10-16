# NextMerce E-Commerce Platform

> **Production-grade Next.js E-Commerce Storefront** built with Next.js 16 (App Router & Turbopack), TypeScript, Redux Toolkit, Supabase (SSR & Database), and Tailwind CSS.

---

## 🏛 Architecture Overview

NextMerce follows a modern hybrid architecture combining Next.js App Router Server Components for database queries and Redux Toolkit for responsive client-side state management (cart, wishlist, modals, interactive preview drawers).

```
                      +-----------------------------+
                      |       Supabase Cloud        |
                      |  - products                 |
                      |  - categories               |
                      |  - storefront_settings      |
                      +--------------+--------------+
                                     |
                         HTTPS / TLS (REST / PostgREST)
                                     |
                                     v
                      +-----------------------------+
                      |   Server Data Access Layer  |
                      |   (src/lib/services/*.ts)   |
                      |  - createPublicClient()     |
                      |  - getProducts()            |
                      |  - getCatData()             |
                      |  - getWebData()             |
                      +--------------+--------------+
                                     |
                                     v
                      +-----------------------------+
                      |     Root Server Layout      |
                      | (src/app/(site)/layout.tsx) |
                      |  - force-dynamic rendering  |
                      |  - Global SEO Metadata      |
                      +--------------+--------------+
                                     |
                                     v
                      +-----------------------------+
                      |      React Context Tree     |
                      |  - ProductProvider          |
                      |  - WebDataProvider          |
                      |  - WebCatProvider           |
                      |  - NewArrivalProvider       |
                      +--------------+--------------+
                                     |
                                     v
                      +-----------------------------+
                      |   Redux State Management    |
                      |  - cartReducer              |
                      |  - wishlistReducer          |
                      |  - quickViewReducer         |
                      |  - productDetailsReducer    |
                      +--------------+--------------+
                                     |
                                     v
                      +-----------------------------+
                      |    Client Component Views   |
                      |  - Shop With Sidebar        |
                      |  - QuickView Modal          |
                      |  - Cart & Checkout          |
                      |  - Responsive Headers/Footers|
                      +-----------------------------+
```

---

## 📁 Repository Structure

```
.
├── public/                     # Static media assets, icons, brands
├── src/
│   ├── app/
│   │   ├── (site)/             # Main storefront route group
│   │   │   ├── (pages)/        # Sub-pages: cart, checkout, wishlist, etc.
│   │   │   ├── layout.tsx      # Root Server Layout with Supabase hydration
│   │   │   └── page.tsx        # Homepage (Hero, BestSeller, Promo, Arrivals)
│   │   ├── context/            # Modal and UI interaction contexts
│   │   ├── css/                # Tailwind global imports & font definitions
│   │   └── fonts/              # Euclid Circular A custom webfonts
│   ├── components/
│   │   ├── Cart/               # Cart page items & subtotal calculation
│   │   ├── Checkout/           # Multi-section billing, shipping & payments
│   │   ├── ClientLayout/       # Client boundary layout wrapper
│   │   ├── Common/             # ProductItem, QuickViewModal, CartSidebar
│   │   ├── Header/             # Main navigation, categories, search & cart
│   │   ├── Home/               # Hero Carousel, BestSeller, PromoBanner
│   │   ├── Shop/               # SingleGridItem & SingleListItem cards
│   │   ├── ShopDetails/        # Comprehensive product detail inspector
│   │   ├── ShopWithSidebar/    # Filterable product catalogue with facets
│   │   └── Wishlist/           # Wishlist item table and availability
│   ├── context/                # Storefront database state providers
│   ├── lib/
│   │   ├── services/           # Decoupled server services for Supabase
│   │   └── supabase/           # Browser & server Supabase SSR clients
│   ├── redux/
│   │   ├── features/           # cart, wishlist, quickView, product-details
│   │   ├── provider.tsx        # Redux Provider client boundary
│   │   └── store.ts            # Root Redux store configuration
│   └── types/                  # TypeScript interface definitions
├── .env.example                # Template for environment variables
├── eslint.config.mjs           # ESLint 9 Flat Config
├── next.config.js              # Next.js remotePatterns & compiler config
├── package.json                # Project dependencies and build scripts
├── postcss.config.js           # PostCSS configuration
├── tailwind.config.ts          # Tailwind styling design tokens
└── tsconfig.json               # TypeScript compiler options
```

---

## 🛠 Issues Analyzed and Resolved

| # | Component / File | Issue Description | Root Cause | Resolution |
|---|---|---|---|---|
| **1** | `src/redux/features/quickView-slice.ts` | `TypeScript TS2352 Conversion Error` | Initial state retained old template properties (`title`, `reviews`, `imgs`) incompatible with Supabase `Product` interface (`custom_product_id`, `selling_price`, `cost_price`). | Redesigned `quickView` slice to support `Product \| null` with `null` initial state, matching `product-details.ts`. |
| **2** | `package.json` | `Invalid project directory provided: ...\lint` | Next.js 16 removed `next lint` CLI command. `npm run lint` was trying to load a directory named `lint`. | Updated script to `"lint": "eslint ."` and migrated to ESLint 9 flat configuration. |
| **3** | ESLint Configuration | `ESLint couldn't find an eslint.config.(js\|mjs\|cjs) file` | ESLint 9 requires Flat Config by default; old `.eslintrc.json` was incompatible. | Created `eslint.config.mjs` with `@eslint/eslintrc` `FlatCompat` and added ignores for `.next/**`, `node_modules/**`, and build artifacts. |
| **4** | `package.json` | Phantom bloated dependencies causing timeout / failure | `sanity`, `next-sanity`, `nodemailer`, and `next-auth` were listed as dependencies with hundreds of transitive packages, but never used anywhere in the codebase. | Removed unused packages, drastically accelerating installation and CI builds. |
| **5** | `src/components/ShopDetails/index.tsx` | SSR Crash: `localStorage is not defined` | `localStorage.getItem()` was invoked directly in component body during server-side execution. | Encapsulated local storage sync in client-side `useEffect` with `typeof window !== "undefined"` guards and added robust empty states. |
| **6** | `src/components/ShopDetails/index.tsx` | Fatal TypeError: `undefined.map` on product images | Code assumed `product.imgs.thumbnails` existed, crashing when loading Supabase products that use `image_urls` / `image_url`. | Implemented unified image resolution fallback matching `QuickViewModal` and hooked up Add to Cart. |
| **7** | `src/components/Cart/SingleItem.tsx` & `Wishlist` | Next.js Image crash: `src="undefined"` | Hardcoded `item.imgs?.thumbnails[0]` without fallbacks for Supabase images. | Added fallback chain: `image_url \|\| image_urls[0] \|\| img \|\| imgs?.thumbnails?.[0] \|\| placeholder`. |
| **8** | `src/components/Checkout/Coupon.tsx` | Invalid HTML: Nested `<form>` inside `<form>` | `<Coupon>` rendered `<form>` inside `<form>` in `Checkout/index.tsx`, violating DOM specifications. | Replaced nested `<form>` with `<div>` and `<button type="button">`. |
| **9** | `src/lib/services/*.ts` | Build Failure: `Dynamic server usage: Route couldn't be rendered statically because it used cookies` | Public queries called `createServerClient()` which invoked `cookies()`, causing Next.js static prerender worker to bail out and fail during builds without live network. | Introduced `createPublicClient()` using `@supabase/supabase-js` for cookie-free queries and configured `export const dynamic = "force-dynamic"` in `RootLayout`. |
| **10** | `next.config.js` | Image hostname security rejection | Remote images from Supabase storage (`*.supabase.co`) or Unsplash were not whitelisted. | Added wildcard patterns for `**.supabase.co`, `images.unsplash.com`, and `res.cloudinary.com` in `images.remotePatterns`. |
| **11** | `src/components/Header/CustomSelect.tsx` | Stale closure / listener leak in click outside handler | Missing `isOpen` in dependency array caused dropdown outside click to fail or behave erratically. | Added `[isOpen]` dependency with target containment check. |

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: `v20.x` or `v22.x` (LTS recommended)
- **Package Manager**: `npm` (v10+)

### 2. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Configure your Supabase credentials in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
```

### 3. Installation
```bash
npm install
```

### 4. Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build & Lint Verification
```bash
npm run lint
npm run build
npm run start
```

---

## ☁️ Vercel Deployment Guide

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "fix: resolve vercel deployment issues, types, and build scripts"
   git push origin main
   ```
2. **Import Project to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/new).
   - Select your repository (`nextjs-ecommerce-template`).
3. **Configure Environment Variables**:
   In the Vercel Project Settings > **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://<your-supabase-project>.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` = `<your-publishable-or-anon-key>`
4. **Deploy**:
   - Click **Deploy**.
   - Next.js will build with Turbopack, run ESLint, compile TypeScript, and deploy serverless functions to the edge network automatically.

---

## ⚡ Using with Antigravity IDE

When collaborating in **Antigravity IDE**:
- **Work Directory**: Set workspace root to `C:\Users\Ckavi\Desktop\all repo\ecom\nextjs-ecommerce-template`.
- **Slash Commands Recommended**:
  - `/plan`: Plan new features (e.g. Stripe checkout, customer orders table).
  - `/grill-me`: Interactive architecture review before making large schema modifications.
  - `/goal`: Run end-to-end tests and autonomous refactoring cycles.
- **Diagnostics**:
  - Run `npx tsc --noEmit` to verify type safety across Redux and Supabase models.
  - Run `npm run lint` to enforce clean code conventions before commits.
