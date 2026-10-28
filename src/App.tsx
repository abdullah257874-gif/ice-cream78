/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Star,
  ChevronDown,
  MapPin,
  Clock,
  Phone,
  Mail,
  MessageCircle,
  ArrowRight,
} from 'lucide-react';
import { CartItem, Product, ProductCategory } from './types';
import {
  PRODUCTS,
  CUSTOMER_REVIEWS,
  FAQ_ITEMS,
  SHOP_INFO,
  getWhatsAppPhone,
} from './config/shopData';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { CartDrawer } from './components/CartDrawer';
import { ResilientImage } from './components/ResilientImage';

const CART_STORAGE_KEY = 'sweet_scoop_cart_v1';

type CategoryFilter = 'All' | ProductCategory;

const CATEGORY_FILTERS: CategoryFilter[] = [
  'All',
  'Classic Scoops',
  'Sundaes & Shakes',
  'Family Packs',
];

export default function App() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (!saved) return [];
      const parsed: { id: string; quantity: number }[] = JSON.parse(saved);
      return parsed
        .map((entry) => {
          const product = PRODUCTS.find((p) => p.id === entry.id);
          return product && entry.quantity > 0
            ? { product, quantity: entry.quantity }
            : null;
        })
        .filter((item): item is CartItem => item !== null);
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  const [openFaqId, setOpenFaqId] = useState<string>(FAQ_ITEMS[0]?.id ?? '');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Contact form quick WhatsApp inquiry state
  const [contactName, setContactName] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  useEffect(() => {
    try {
      const serializable = cart.map((item) => ({
        id: item.product.id,
        quantity: item.quantity,
      }));
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(serializable));
    } catch {
      // Ignore storage quota errors
    }
  }, [cart]);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 2400);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setToastMessage(`Added ${product.name} to your cart`);
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCart((prev) => prev.filter((item) => item.product.id !== productId));
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const getProductQuantity = (productId: string): number => {
    return cart.find((item) => item.product.id === productId)?.quantity ?? 0;
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const bestSellers = PRODUCTS.filter((p) => p.isBestSeller);
  const filteredProducts =
    selectedCategory === 'All'
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === selectedCategory);

  const cleanWhatsAppNumber = getWhatsAppPhone();

  const contactWhatsAppUrl = `https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent(
    `Hello ${SHOP_INFO.name}!${
      contactName.trim() ? `\nName: ${contactName.trim()}` : ''
    }${contactMessage.trim() ? `\nMessage: ${contactMessage.trim()}` : '\nI have a question about your ice cream menu.'}`
  )}`;

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFBF7] text-[#3A2116]">
      {/* Sticky Top Navigation */}
      <Header
        totalItems={totalItems}
        totalPrice={totalPrice}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="flex-1">
        {/* ================================================================
            1. HOME — HERO SECTION
            ================================================================ */}
        <section
          id="home"
          className="relative overflow-hidden bg-gradient-to-b from-[#FCEEF2]/70 via-[#FFFBF7] to-[#FFFBF7] pt-10 pb-16 lg:pt-16 lg:pb-24"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
              {/* Left Copy Column */}
              <div className="lg:col-span-6 flex flex-col justify-center">
                <p className="text-xs sm:text-sm font-semibold text-[#C8436B] mb-4">
                  Fresh Small-Batch Creamery · Starting from Rs. 150
                </p>

                <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-[#3A2116] leading-[1.08] [text-wrap:balance] mb-5">
                  Make Every Day Sweeter!
                </h1>

                <p className="text-base sm:text-lg text-[#6D4C3D] leading-relaxed max-w-xl mb-8">
                  Discover your favorite ice cream flavors at affordable prices.
                  Churned fresh daily with pure dairy cream, ripe fruits, and rich
                  chocolate—ready for instant ordering on WhatsApp.
                </p>

                <div className="flex flex-wrap items-center gap-3.5">
                  <a
                    href="#our-ice-cream"
                    onClick={(e) => {
                      if (totalItems > 0) {
                        e.preventDefault();
                        setIsCartOpen(true);
                      }
                    }}
                    className="min-h-[48px] px-7 py-3.5 rounded-xl bg-[#C8436B] text-white text-sm sm:text-base font-semibold inline-flex items-center justify-center gap-2 hover:bg-[#B03459] active:scale-[0.99] transition-all duration-150 whitespace-nowrap shrink-0"
                  >
                    <span>Order Now</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </a>

                  <a
                    href="#our-ice-cream"
                    className="min-h-[48px] px-7 py-3.5 rounded-xl bg-white border border-[#DEC9BD] text-[#3A2116] text-sm sm:text-base font-semibold inline-flex items-center justify-center hover:bg-[#FAF0EB] active:scale-[0.99] transition-colors duration-150 whitespace-nowrap shrink-0"
                  >
                    Explore Flavors
                  </a>
                </div>
              </div>

              {/* Right Hero Image Column */}
              <div className="lg:col-span-6 flex">
                <div className="w-full rounded-3xl overflow-hidden border border-[#EFE2DA] bg-[#FAF2EE] shadow-[0_20px_50px_-20px_rgba(58,33,22,0.18)]">
                  <ResilientImage
                    src={SHOP_INFO.heroImage}
                    alt="Three artisanal scoops of strawberry, vanilla bean, and Belgian chocolate ice cream with crisp waffle cones"
                    fallbackTitle="Sweet Scoop Artisanal Ice Cream"
                    className="w-full h-full aspect-[4/3] lg:aspect-auto lg:h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Full-Width 4-Column Creamery Promise Strip */}
            <div className="mt-12 lg:mt-16 pt-8 border-t border-[#EFE2DA] grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              <div>
                <p className="font-display text-xl sm:text-2xl font-bold text-[#3A2116] tabular-nums">
                  100% Pure Dairy
                </p>
                <p className="text-xs sm:text-sm text-[#6D4C3D] mt-1">
                  Churned fresh every morning with real farm cream
                </p>
              </div>
              <div>
                <p className="font-display text-xl sm:text-2xl font-bold text-[#3A2116] tabular-nums">
                  Rs. 150 – Rs. 600
                </p>
                <p className="text-xs sm:text-sm text-[#6D4C3D] mt-1">
                  Pocket-friendly scoops, shakes, sundaes &amp; tubs
                </p>
              </div>
              <div>
                <p className="font-display text-xl sm:text-2xl font-bold text-[#3A2116] tabular-nums">
                  25–35 Min Delivery
                </p>
                <p className="text-xs sm:text-sm text-[#6D4C3D] mt-1">
                  Packed in thermal insulated boxes so scoops stay firm
                </p>
              </div>
              <div>
                <p className="font-display text-xl sm:text-2xl font-bold text-[#3A2116]">
                  1-Tap WhatsApp Order
                </p>
                <p className="text-xs sm:text-sm text-[#6D4C3D] mt-1">
                  No account sign-up needed · Cash on Delivery
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            2. OUR ICE CREAM — FULL MENU & PKR PRICES
            ================================================================ */}
        <section
          id="our-ice-cream"
          className="py-16 lg:py-24 bg-[#FFFBF7] scroll-mt-16"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <p className="text-xs font-semibold text-[#C8436B] mb-2">
                  Freshly Churned Menu · Prices in PKR
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#3A2116] [text-wrap:balance]">
                  Our Ice Cream Flavors
                </h2>
                <p className="text-sm sm:text-base text-[#6D4C3D] mt-2 max-w-xl">
                  Pick your favorite scoops, sundaes, thick shakes, or shareable
                  family tubs and add them straight to your cart.
                </p>
              </div>

              {/* Interactive Segmented Category Filter */}
              <div
                role="tablist"
                aria-label="Filter ice cream by category"
                className="inline-flex flex-wrap items-center gap-1 p-1.5 rounded-xl bg-[#F5EAE3] border border-[#EADBD2] self-start md:self-auto"
              >
                {CATEGORY_FILTERS.map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                        isActive
                          ? 'bg-white text-[#3A2116] shadow-xs'
                          : 'text-[#6D4C3D] hover:text-[#3A2116]'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 8-Product Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  quantityInCart={getProductQuantity(product.id)}
                  onAdd={handleAddToCart}
                  onUpdateQuantity={handleUpdateQuantity}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================
            3. BEST SELLERS — CUSTOMER FAVORITES
            ================================================================ */}
        <section
          id="best-sellers"
          className="py-16 lg:py-24 bg-[#FAF2EE] border-y border-[#EFE2DA] scroll-mt-16"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-10">
              <p className="text-xs font-semibold text-[#C8436B] mb-2">
                Neighborhood Favorites · Most Re-Ordered
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#3A2116] [text-wrap:balance]">
                Best Sellers of the Week
              </h2>
              <p className="text-sm sm:text-base text-[#6D4C3D] mt-2 leading-relaxed">
                Not sure where to start? These three crowd-pleasers top our daily
                WhatsApp orders week after week.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {bestSellers.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  quantityInCart={getProductQuantity(product.id)}
                  onAdd={handleAddToCart}
                  onUpdateQuantity={handleUpdateQuantity}
                  editorialLabel={product.bestSellerRank}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================
            4. ABOUT US — "A LITTLE SCOOP OF HAPPINESS"
            ================================================================ */}
        <section
          id="about-us"
          className="py-16 lg:py-24 bg-[#FFFBF7] scroll-mt-16"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
              <div className="lg:col-span-6 flex">
                <div className="w-full rounded-3xl overflow-hidden border border-[#EFE2DA] bg-[#FAF2EE]">
                  <ResilientImage
                    src={SHOP_INFO.aboutImage}
                    alt="Inside the Sweet Scoop Ice Cream boutique parlor with pastel pink tiles, golden waffle cones, and freshly scooped ice cream"
                    fallbackTitle="Sweet Scoop Creamery Counter"
                    className="w-full h-full aspect-[4/3] lg:aspect-auto lg:h-full object-cover"
                  />
                </div>
              </div>

              <div className="lg:col-span-6 flex flex-col justify-center">
                <p className="text-xs font-semibold text-[#C8436B] mb-3">
                  Our Story · Handcrafted Daily
                </p>

                <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#3A2116] [text-wrap:balance] mb-5">
                  A Little Scoop of Happiness
                </h2>

                <div className="space-y-4 text-base text-[#6D4C3D] leading-relaxed">
                  <p>
                    At <strong className="text-[#3A2116] font-semibold">Sweet Scoop Ice Cream</strong>,
                    we believe everyone deserves premium, freshly churned ice cream
                    without an expensive price tag. What began as a family kitchen
                    passion for pure dairy desserts has grown into your neighborhood’s
                    favorite sweet spot.
                  </p>
                  <p>
                    Every morning, we blend fresh farm cream, real Chaunsa mangoes,
                    ripe strawberries, Madagascar vanilla, and rich cocoa into silky,
                    small-batch scoops. Whether you are treating yourself to a single
                    cone for Rs. 150 or sharing a Family Ice Cream Tub after dinner,
                    we make ordering fast, friendly, and effortless right from
                    WhatsApp.
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-[#EFE2DA] grid grid-cols-3 gap-4">
                  <div>
                    <p className="font-display text-2xl font-bold text-[#3A2116] tabular-nums">
                      8+
                    </p>
                    <p className="text-xs text-[#6D4C3D] mt-0.5">
                      Signature Treats
                    </p>
                  </div>
                  <div>
                    <p className="font-display text-2xl font-bold text-[#3A2116] tabular-nums">
                      100%
                    </p>
                    <p className="text-xs text-[#6D4C3D] mt-0.5">
                      Fresh Pure Cream
                    </p>
                  </div>
                  <div>
                    <p className="font-display text-2xl font-bold text-[#3A2116] tabular-nums">
                      4.9 / 5
                    </p>
                    <p className="text-xs text-[#6D4C3D] mt-0.5">
                      Local Customer Rating
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            5. CUSTOMER REVIEWS
            ================================================================ */}
        <section
          id="reviews"
          className="py-16 lg:py-24 bg-[#FCEEF2]/55 border-y border-[#EFE2DA] scroll-mt-16"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-10">
              <p className="text-xs font-semibold text-[#C8436B] mb-2">
                Verified Local Orders · 4.9 Average Rating
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#3A2116] [text-wrap:balance]">
                What Ice Cream Lovers Say
              </h2>
              <p className="text-sm sm:text-base text-[#6D4C3D] mt-2">
                Real feedback from families and dessert fans ordering across town.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {CUSTOMER_REVIEWS.map((review) => (
                <article
                  key={review.id}
                  className="rounded-2xl bg-white border border-[#EFE2DA] p-6 sm:p-7 flex flex-col justify-between"
                >
                  <div>
                    <div
                      className="flex items-center gap-1 text-[#D97706] mb-4"
                      aria-label={`Rated ${review.rating} out of 5 stars`}
                    >
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-current"
                        />
                      ))}
                      <span className="ml-1.5 text-xs font-semibold text-[#6D4C3D] tabular-nums">
                        {review.rating}.0 / 5
                      </span>
                    </div>

                    <p className="text-sm sm:text-base text-[#3A2116] leading-relaxed mb-6">
                      “{review.comment}”
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#F5EBE4]">
                    <p className="font-semibold text-sm text-[#3A2116]">
                      {review.customerName}
                    </p>
                    <p className="text-xs text-[#8A6552] mt-0.5">
                      {review.location} · Ordered {review.orderedItem}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================
            6. FREQUENTLY ASKED QUESTIONS
            ================================================================ */}
        <section
          id="faq"
          className="py-16 lg:py-24 bg-[#FFFBF7] scroll-mt-16"
        >
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="text-xs font-semibold text-[#C8436B] mb-2">
                Helpful Answers · Delivery &amp; Freshness
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#3A2116] [text-wrap:balance]">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="divide-y divide-[#EFE2DA] border-y border-[#EFE2DA]">
              {FAQ_ITEMS.map((faq) => {
                const isOpen = openFaqId === faq.id;
                return (
                  <div key={faq.id} className="py-4">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenFaqId((prev) => (prev === faq.id ? '' : faq.id))
                      }
                      aria-expanded={isOpen}
                      className="w-full py-2 flex items-center justify-between gap-4 text-left cursor-pointer group"
                    >
                      <span className="font-display text-base sm:text-lg font-semibold text-[#3A2116] group-hover:text-[#C8436B] transition-colors">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-[#8A6552] shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-[#C8436B]' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <p className="pt-2 pb-2 pr-8 text-sm sm:text-base text-[#6D4C3D] leading-relaxed">
                        {faq.answer}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================================================================
            7. CONTACT US
            ================================================================ */}
        <section
          id="contact"
          className="py-16 lg:py-24 bg-[#FAF2EE] border-t border-[#EFE2DA] scroll-mt-16"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
              {/* Parlor Information */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <p className="text-xs font-semibold text-[#C8436B] mb-2">
                    Visit Our Parlor or Chat With Us
                  </p>
                  <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#3A2116] [text-wrap:balance]">
                    Contact Sweet Scoop
                  </h2>
                  <p className="text-sm sm:text-base text-[#6D4C3D] mt-2 leading-relaxed max-w-lg">
                    Planning a birthday party, school event, or late-night family
                    treat? Drop by our parlor or message us directly on WhatsApp.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex items-start gap-3.5">
                    <MapPin className="w-5 h-5 text-[#C8436B] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-[#3A2116]">
                        Parlor Location
                      </p>
                      <p className="text-sm text-[#6D4C3D]">{SHOP_INFO.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <Clock className="w-5 h-5 text-[#C8436B] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-[#3A2116]">
                        Opening Hours
                      </p>
                      <p className="text-sm text-[#6D4C3D]">{SHOP_INFO.hoursWeekday}</p>
                      <p className="text-sm text-[#6D4C3D]">{SHOP_INFO.hoursWeekend}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <Phone className="w-5 h-5 text-[#C8436B] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-[#3A2116]">
                        Phone &amp; WhatsApp
                      </p>
                      <p className="text-sm text-[#6D4C3D] tabular-nums">
                        {SHOP_INFO.phoneDisplay}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <Mail className="w-5 h-5 text-[#C8436B] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-[#3A2116]">Email</p>
                      <p className="text-sm text-[#6D4C3D]">{SHOP_INFO.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick WhatsApp Inquiry Card */}
              <div className="lg:col-span-6">
                <div className="rounded-2xl bg-white border border-[#EFE2DA] p-6 sm:p-8 space-y-5">
                  <div>
                    <h3 className="font-display text-2xl font-bold text-[#3A2116]">
                      Send a Quick Message
                    </h3>
                    <p className="text-sm text-[#6D4C3D] mt-1">
                      Have a question about bulk tubs, party orders, or flavors?
                      Send us a direct WhatsApp message below.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-xs font-semibold text-[#3A2116] mb-1.5"
                      >
                        Your Name
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="e.g., Usman Tariq"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFBF7] border border-[#DEC9BD] text-sm text-[#3A2116] placeholder:text-[#AD8E7E] focus:outline-none focus:border-[#C8436B] focus:ring-2 focus:ring-[#F8D7E0]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-message"
                        className="block text-xs font-semibold text-[#3A2116] mb-1.5"
                      >
                        Your Message
                      </label>
                      <textarea
                        id="contact-message"
                        rows={3}
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder="Ask about flavors, party tubs, or delivery areas..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFBF7] border border-[#DEC9BD] text-sm text-[#3A2116] placeholder:text-[#AD8E7E] focus:outline-none focus:border-[#C8436B] focus:ring-2 focus:ring-[#F8D7E0] resize-none"
                      />
                    </div>

                    <a
                      href={contactWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full min-h-[46px] px-5 py-3 rounded-xl bg-[#3A2116] text-[#FFFBF7] text-sm font-semibold inline-flex items-center justify-center gap-2 hover:bg-[#C8436B] transition-colors duration-150 whitespace-nowrap"
                    >
                      <MessageCircle className="w-4 h-4 shrink-0" />
                      <span>Chat With Us on WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ================================================================
          FOOTER
          ================================================================ */}
      <footer className="bg-[#2D1810] text-[#F5E6DD] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-[#4A2C20]">
            {/* Brand Column */}
            <div className="space-y-3">
              <a
                href="#home"
                className="font-display text-xl font-bold text-[#FFFBF7] tracking-tight inline-block"
              >
                {SHOP_INFO.name}
              </a>
              <p className="text-sm text-[#D6B8A8] leading-relaxed">
                Serving freshly churned, pure-dairy scoops, sundaes, thick shakes,
                and family tubs at everyday affordable prices.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-display text-base font-semibold text-[#FFFBF7] mb-3.5">
                Explore
              </h3>
              <ul className="space-y-2 text-sm text-[#D6B8A8]">
                <li>
                  <a href="#home" className="hover:text-[#F8D7E0] transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#our-ice-cream"
                    className="hover:text-[#F8D7E0] transition-colors"
                  >
                    Our Ice Cream
                  </a>
                </li>
                <li>
                  <a
                    href="#best-sellers"
                    className="hover:text-[#F8D7E0] transition-colors"
                  >
                    Best Sellers
                  </a>
                </li>
                <li>
                  <a
                    href="#about-us"
                    className="hover:text-[#F8D7E0] transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#reviews"
                    className="hover:text-[#F8D7E0] transition-colors"
                  >
                    Customer Reviews
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-[#F8D7E0] transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            {/* Opening Hours */}
            <div>
              <h3 className="font-display text-base font-semibold text-[#FFFBF7] mb-3.5">
                Opening Hours
              </h3>
              <ul className="space-y-2 text-sm text-[#D6B8A8]">
                <li>{SHOP_INFO.hoursWeekday}</li>
                <li>{SHOP_INFO.hoursWeekend}</li>
                <li className="pt-1 text-[#F8D7E0]">
                  Open on Public Holidays &amp; Weekends
                </li>
              </ul>
            </div>

            {/* Contact & Social Media */}
            <div>
              <h3 className="font-display text-base font-semibold text-[#FFFBF7] mb-3.5">
                Contact &amp; Socials
              </h3>
              <ul className="space-y-2 text-sm text-[#D6B8A8] mb-4">
                <li>{SHOP_INFO.address}</li>
                <li className="tabular-nums">{SHOP_INFO.phoneDisplay}</li>
                <li>{SHOP_INFO.email}</li>
              </ul>
              <div className="flex items-center gap-4 text-sm font-medium text-[#F8D7E0]">
                <a
                  href={`https://wa.me/${cleanWhatsAppNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white underline underline-offset-4 transition-colors"
                >
                  WhatsApp
                </a>
                <span aria-hidden="true" className="text-[#7A5240]">·</span>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white underline underline-offset-4 transition-colors"
                >
                  Instagram
                </a>
                <span aria-hidden="true" className="text-[#7A5240]">·</span>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white underline underline-offset-4 transition-colors"
                >
                  Facebook
                </a>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#B99684]">
            <p>
              © {new Date().getFullYear()} {SHOP_INFO.name}. All rights reserved.
            </p>
            <p>{SHOP_INFO.deliveryNote}</p>
          </div>
        </div>
      </footer>

      {/* Subtle Add-to-Cart Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-40 max-w-sm rounded-xl bg-[#3A2116] text-[#FFFBF7] px-4 py-3 shadow-xl border border-[#5A3626] flex items-center gap-3 text-sm"
        >
          <ShoppingBag className="w-4 h-4 text-[#F8D7E0] shrink-0" />
          <span className="font-medium">{toastMessage}</span>
          <button
            type="button"
            onClick={() => {
              setToastMessage(null);
              setIsCartOpen(true);
            }}
            className="ml-2 text-xs font-bold text-[#F8D7E0] hover:text-white underline underline-offset-2 whitespace-nowrap cursor-pointer"
          >
            View Cart
          </button>
        </div>
      )}

      {/* Slide-over Shopping Cart & WhatsApp Checkout Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />
    </div>
  );
}
