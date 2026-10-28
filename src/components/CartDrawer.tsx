import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowLeft,
  MessageCircle,
  Check,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { CartItem } from '../types';
import {
  formatPKR,
  buildWhatsAppOrderUrl,
  WHATSAPP_NUMBER,
} from '../config/shopData';
import { ResilientImage } from './ResilientImage';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

type DrawerStep = 'cart' | 'checkout' | 'confirmed';

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [step, setStep] = useState<DrawerStep>('cart');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [validationError, setValidationError] = useState('');
  const [copied, setCopied] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<{
    url: string;
    message: string;
    total: number;
  } | null>(null);

  useEffect(() => {
    if (!isOpen) {
      // Reset back to cart view when reopened unless cart is empty
      setValidationError('');
      if (step === 'confirmed') {
        setStep('cart');
      }
    }
  }, [isOpen, step]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const deliveryFee = 0; // Free insulated local delivery
  const total = subtotal + deliveryFee;
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const isFormValid =
    customerName.trim().length >= 2 && deliveryAddress.trim().length >= 5;

  const liveOrderPreview = buildWhatsAppOrderUrl({
    customerName: customerName || 'Your Name',
    deliveryAddress: deliveryAddress || 'Your Delivery Address',
    customerPhone,
    notes,
    items: items.map((i) => ({
      name: i.product.name,
      quantity: i.quantity,
      price: i.product.price,
    })),
    totalPrice: total,
  });

  const handleValidateAttempt = (e: React.MouseEvent) => {
    if (!isFormValid) {
      e.preventDefault();
      if (customerName.trim().length < 2) {
        setValidationError('Please enter your full name so we know who to prepare the order for.');
      } else {
        setValidationError('Please enter your complete delivery address.');
      }
      return;
    }

    setValidationError('');
    setSubmittedOrder({
      url: liveOrderPreview.url,
      message: liveOrderPreview.message,
      total,
    });
    onClearCart();
    setStep('confirmed');
  };

  const handleCopyMessage = async (textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart and Checkout"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#25140D]/50 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative z-10 w-full max-w-md bg-[#FFFBF7] h-full shadow-2xl flex flex-col border-l border-[#EFE2DA]">
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-[#EFE2DA] flex items-center justify-between gap-4 bg-white">
          <div className="flex items-center gap-2.5">
            {step === 'checkout' && (
              <button
                type="button"
                onClick={() => {
                  setValidationError('');
                  setStep('cart');
                }}
                aria-label="Back to cart items"
                className="p-1.5 -ml-1.5 rounded-lg text-[#6D4C3D] hover:text-[#3A2116] hover:bg-[#FAF0EB] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <h2 className="font-display text-xl font-bold text-[#3A2116]">
              {step === 'cart' && `Your Cart (${totalCount})`}
              {step === 'checkout' && 'WhatsApp Checkout'}
              {step === 'confirmed' && 'Order Ready on WhatsApp'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart drawer"
            className="w-9 h-9 rounded-lg inline-flex items-center justify-center text-[#6D4C3D] hover:text-[#3A2116] hover:bg-[#FAF0EB] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: CART ITEMS */}
        {step === 'cart' && (
          <>
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#FCE8EE] text-[#C8436B] flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8" strokeWidth={1.75} />
                </div>
                <h3 className="font-display text-xl font-bold text-[#3A2116] mb-2">
                  Your scoop bowl is empty
                </h3>
                <p className="text-sm text-[#6D4C3D] max-w-xs mb-6 leading-relaxed">
                  Explore our freshly churned flavors, sundaes, and family tubs starting from just Rs. 150.
                </p>
                <a
                  href="#our-ice-cream"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-[#3A2116] text-[#FFFBF7] text-sm font-semibold hover:bg-[#C8436B] transition-colors whitespace-nowrap"
                >
                  Browse Ice Cream Menu
                </a>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-5 divide-y divide-[#EFE2DA]">
                  {items.map(({ product, quantity }) => (
                    <div
                      key={product.id}
                      className="py-4 first:pt-0 last:pb-0 flex gap-4"
                    >
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#FAF2EE] shrink-0 border border-[#EFE2DA]">
                        <ResilientImage
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-sm text-[#3A2116] truncate">
                            {product.name}
                          </h3>
                          <button
                            type="button"
                            onClick={() => onRemoveItem(product.id)}
                            aria-label={`Remove ${product.name} from cart`}
                            className="p-1 text-[#9A7765] hover:text-[#C8436B] transition-colors cursor-pointer shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="text-xs text-[#8A6552] tabular-nums mt-0.5">
                          {formatPKR(product.price)} each
                        </p>

                        <div className="flex items-center justify-between gap-2 mt-3">
                          <div className="inline-flex items-center rounded-lg bg-white border border-[#E5D3C8] p-0.5">
                            <button
                              type="button"
                              onClick={() =>
                                onUpdateQuantity(product.id, quantity - 1)
                              }
                              aria-label={`Decrease quantity of ${product.name}`}
                              className="w-7 h-7 rounded-md inline-flex items-center justify-center text-[#3A2116] hover:bg-[#FAF0EB] transition-colors cursor-pointer"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-center text-xs font-bold text-[#3A2116] tabular-nums">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                onUpdateQuantity(product.id, quantity + 1)
                              }
                              aria-label={`Increase quantity of ${product.name}`}
                              className="w-7 h-7 rounded-md inline-flex items-center justify-center text-[#3A2116] hover:bg-[#FAF0EB] transition-colors cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <span className="text-sm font-bold text-[#3A2116] tabular-nums">
                            {formatPKR(product.price * quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cart Summary Footer */}
                <div className="p-6 bg-white border-t border-[#EFE2DA] space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between text-[#6D4C3D]">
                      <span>Subtotal ({totalCount} {totalCount === 1 ? 'item' : 'items'})</span>
                      <span className="font-medium tabular-nums">{formatPKR(subtotal)}</span>
                    </div>
                    <div className="flex items-center justify-between text-[#6D4C3D]">
                      <span>Insulated Thermal Delivery</span>
                      <span className="font-medium text-[#2E7D52]">Free</span>
                    </div>
                    <div className="pt-2 border-t border-[#F5EBE4] flex items-center justify-between text-base font-bold text-[#3A2116]">
                      <span>Total Payable (PKR)</span>
                      <span className="text-lg text-[#C8436B] tabular-nums">
                        {formatPKR(total)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep('checkout')}
                    className="w-full min-h-[48px] px-5 py-3 rounded-xl bg-[#C8436B] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 hover:bg-[#B03459] active:scale-[0.99] transition-all duration-150 cursor-pointer whitespace-nowrap"
                  >
                    <span>Checkout via WhatsApp</span>
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {/* STEP 2: WHATSAPP CHECKOUT DETAILS */}
        {step === 'checkout' && (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              <p className="text-sm text-[#6D4C3D] leading-relaxed">
                Enter your delivery details below. Clicking the button at the bottom opens WhatsApp with your complete pre-filled order message.
              </p>

              {validationError && (
                <div
                  role="alert"
                  className="p-3.5 rounded-xl bg-[#FDF2F5] border border-[#F2C6D2] text-xs font-medium text-[#A62B4E]"
                >
                  {validationError}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="checkout-name"
                    className="block text-xs font-semibold text-[#3A2116] mb-1.5"
                  >
                    Your Full Name *
                  </label>
                  <input
                    id="checkout-name"
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      if (validationError) setValidationError('');
                    }}
                    placeholder="e.g., Ayesha Khan"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DEC9BD] text-sm text-[#3A2116] placeholder:text-[#AD8E7E] focus:outline-none focus:border-[#C8436B] focus:ring-2 focus:ring-[#F8D7E0]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="checkout-phone"
                    className="block text-xs font-semibold text-[#3A2116] mb-1.5"
                  >
                    Phone Number (Optional)
                  </label>
                  <input
                    id="checkout-phone"
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g., 0300 1234567"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DEC9BD] text-sm text-[#3A2116] placeholder:text-[#AD8E7E] focus:outline-none focus:border-[#C8436B] focus:ring-2 focus:ring-[#F8D7E0]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="checkout-address"
                    className="block text-xs font-semibold text-[#3A2116] mb-1.5"
                  >
                    Delivery Address *
                  </label>
                  <textarea
                    id="checkout-address"
                    rows={3}
                    required
                    value={deliveryAddress}
                    onChange={(e) => {
                      setDeliveryAddress(e.target.value);
                      if (validationError) setValidationError('');
                    }}
                    placeholder="House / Flat #, Street, Block / Sector, Nearby Landmark"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DEC9BD] text-sm text-[#3A2116] placeholder:text-[#AD8E7E] focus:outline-none focus:border-[#C8436B] focus:ring-2 focus:ring-[#F8D7E0] resize-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="checkout-notes"
                    className="block text-xs font-semibold text-[#3A2116] mb-1.5"
                  >
                    Special Instructions (Optional)
                  </label>
                  <input
                    id="checkout-notes"
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g., Extra waffle cones or ring doorbell"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DEC9BD] text-sm text-[#3A2116] placeholder:text-[#AD8E7E] focus:outline-none focus:border-[#C8436B] focus:ring-2 focus:ring-[#F8D7E0]"
                  />
                </div>
              </div>

              {/* Order Summary Box */}
              <div className="p-4 rounded-xl bg-[#FAF2EE] border border-[#EADBD2] space-y-2.5">
                <div className="flex items-center justify-between text-xs font-semibold text-[#6D4C3D]">
                  <span>Order Summary ({totalCount} items)</span>
                  <span>Cash on Delivery</span>
                </div>
                <ul className="space-y-1 text-xs text-[#3A2116]">
                  {items.map(({ product, quantity }) => (
                    <li
                      key={product.id}
                      className="flex items-center justify-between gap-2 tabular-nums"
                    >
                      <span className="truncate">
                        {product.name} × {quantity}
                      </span>
                      <span className="font-semibold shrink-0">
                        {formatPKR(product.price * quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="pt-2 border-t border-[#E5D3C8] flex items-center justify-between text-sm font-bold text-[#3A2116] tabular-nums">
                  <span>Total Amount</span>
                  <span className="text-[#C8436B]">{formatPKR(total)}</span>
                </div>
              </div>
            </div>

            {/* WhatsApp Submit Footer */}
            <div className="p-6 bg-white border-t border-[#EFE2DA] space-y-2.5">
              <a
                href={isFormValid ? liveOrderPreview.url : '#checkout'}
                target={isFormValid ? '_blank' : undefined}
                rel={isFormValid ? 'noopener noreferrer' : undefined}
                onClick={handleValidateAttempt}
                className="w-full min-h-[48px] px-5 py-3 rounded-xl bg-[#25D366] text-[#112A1A] text-sm font-bold inline-flex items-center justify-center gap-2 hover:bg-[#20BD5A] transition-colors duration-150 cursor-pointer whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>Send Order on WhatsApp · {formatPKR(total)}</span>
              </a>
              <p className="text-[11px] text-center text-[#8A6552]">
                Recipient WhatsApp: <span className="font-mono">{WHATSAPP_NUMBER}</span>
              </p>
            </div>
          </>
        )}

        {/* STEP 3: ORDER READY / CONFIRMATION RECEIPT */}
        {step === 'confirmed' && submittedOrder && (
          <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#E7F7EE] text-[#1E7B46] flex items-center justify-center">
                <Check className="w-6 h-6" strokeWidth={2.5} />
              </div>

              <div>
                <h3 className="font-display text-2xl font-bold text-[#3A2116] mb-1.5">
                  Your WhatsApp order is ready!
                </h3>
                <p className="text-sm text-[#6D4C3D] leading-relaxed">
                  WhatsApp has opened in a new tab with your pre-filled order message. Simply press <strong>Send</strong> in WhatsApp to confirm your delivery.
                </p>
              </div>

              <div className="rounded-xl bg-[#FAF2EE] border border-[#EADBD2] p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[#6D4C3D]">
                    Pre-filled WhatsApp Message
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyMessage(submittedOrder.message)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C8436B] hover:text-[#3A2116] transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Text</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="text-xs text-[#3A2116] whitespace-pre-wrap font-sans leading-relaxed max-h-56 overflow-y-auto">
                  {submittedOrder.message}
                </pre>
              </div>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-[#EFE2DA]">
              <a
                href={submittedOrder.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-[#25D366] text-[#112A1A] text-sm font-bold inline-flex items-center justify-center gap-2 hover:bg-[#20BD5A] transition-colors whitespace-nowrap"
              >
                <ExternalLink className="w-4 h-4 shrink-0" />
                <span>Open WhatsApp Again</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  setStep('cart');
                  onClose();
                }}
                className="w-full min-h-[44px] px-4 py-2.5 rounded-xl border border-[#DEC9BD] text-sm font-semibold text-[#3A2116] hover:bg-[#FAF0EB] transition-colors cursor-pointer"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
