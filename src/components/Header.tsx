import React, { useState } from 'react';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { SHOP_INFO, formatPKR } from '../config/shopData';

interface HeaderProps {
  totalItems: number;
  totalPrice: number;
  onOpenCart: () => void;
}

const DESKTOP_NAV_LINKS = [
  { label: 'Our Ice Cream', href: '#our-ice-cream' },
  { label: 'Best Sellers', href: '#best-sellers' },
  { label: 'About Us', href: '#about-us' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Contact Us', href: '#contact' },
];

const MOBILE_NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Our Ice Cream', href: '#our-ice-cream' },
  { label: 'Best Sellers', href: '#best-sellers' },
  { label: 'About Us', href: '#about-us' },
  { label: 'Customer Reviews', href: '#reviews' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact Us', href: '#contact' },
];

export const Header: React.FC<HeaderProps> = ({
  totalItems,
  totalPrice,
  onOpenCart,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FFFBF7]/95 backdrop-blur-md border-b border-[#EFE2DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#home"
          className="font-display text-lg sm:text-xl font-bold tracking-tight text-[#3A2116] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C8436B] rounded-sm"
        >
          {SHOP_INFO.name}
        </a>

        {/* Zone 2: 5 concise single-line text navigation links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#6D4C3D]"
        >
          {DESKTOP_NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="whitespace-nowrap shrink-0 py-1 hover:text-[#3A2116] underline-offset-8 hover:underline decoration-[#C8436B] decoration-2 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C8436B] rounded-sm"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Primary Cart Action (+ Mobile Menu Toggle on small viewports) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onOpenCart}
            aria-label={`Open shopping cart with ${totalItems} items`}
            className="inline-flex items-center gap-2 px-4 py-2 min-h-[42px] rounded-xl bg-[#3A2116] text-[#FFFBF7] text-sm font-semibold hover:bg-[#523021] active:scale-[0.98] transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8436B]"
          >
            <ShoppingBag className="w-4 h-4 shrink-0 text-[#F8D7E0]" />
            <span>Cart ({totalItems})</span>
            {totalItems > 0 && (
              <span className="hidden sm:inline text-[#F8D7E0] font-normal tabular-nums">
                · {formatPKR(totalPrice)}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl border border-[#E5D3C8] text-[#3A2116] hover:bg-[#F8EAE2] transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8436B]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <nav
          aria-label="Mobile Navigation"
          className="lg:hidden border-t border-[#EFE2DA] bg-[#FFFBF7] px-4 py-4 space-y-1 shadow-lg"
        >
          {MOBILE_NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-[#3A2116] hover:bg-[#FAF0EB] transition-colors duration-150"
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
};
