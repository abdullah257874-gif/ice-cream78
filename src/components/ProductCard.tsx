import React from 'react';
import { Plus, Minus, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { formatPKR } from '../config/shopData';
import { ResilientImage } from './ResilientImage';

interface ProductCardProps {
  product: Product;
  quantityInCart: number;
  onAdd: (product: Product) => void;
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  editorialLabel?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  quantityInCart,
  onAdd,
  onUpdateQuantity,
  editorialLabel,
}) => {
  return (
    <article className="group flex flex-col rounded-2xl bg-white border border-[#EFE2DA] overflow-hidden transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-12px_rgba(58,33,22,0.12)]">
      {/* Product Image — 4:3 Studio Frame */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#FAF2EE]">
        <ResilientImage
          src={product.image}
          alt={product.name}
          fallbackTitle={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-5 sm:p-6">
        {/* Clean unboxed metadata kicker */}
        <div className="flex items-center gap-1.5 text-xs text-[#8A6552] mb-1.5">
          <span>{editorialLabel ?? product.category}</span>
          <span aria-hidden="true">·</span>
          <span>{product.servingNote}</span>
        </div>

        <div className="flex items-baseline justify-between gap-3 mb-2">
          <h3 className="font-display text-lg font-bold text-[#3A2116] leading-snug">
            {product.name}
          </h3>
          <span className="text-base font-bold text-[#C8436B] tabular-nums whitespace-nowrap shrink-0">
            {formatPKR(product.price)}
          </span>
        </div>

        <p className="text-sm text-[#6D4C3D] leading-relaxed mb-5 flex-1">
          {product.description}
        </p>

        {/* Action Row: Add to Cart OR Quantity Stepper */}
        <div className="pt-3 border-t border-[#F5EBE4]">
          {quantityInCart === 0 ? (
            <button
              type="button"
              onClick={() => onAdd(product)}
              className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#3A2116] text-[#FFFBF7] text-sm font-semibold inline-flex items-center justify-center gap-2 hover:bg-[#C8436B] active:scale-[0.99] transition-colors duration-150 cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8436B]"
            >
              <ShoppingBag className="w-4 h-4 shrink-0" />
              <span>Add to Cart</span>
            </button>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <div className="inline-flex items-center rounded-xl bg-[#FAF0EB] p-1 border border-[#EADBD2]">
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(product.id, quantityInCart - 1)}
                  aria-label={`Decrease quantity of ${product.name}`}
                  className="w-9 h-9 rounded-lg inline-flex items-center justify-center text-[#3A2116] hover:bg-white transition-colors duration-150 cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-9 text-center text-sm font-bold text-[#3A2116] tabular-nums">
                  {quantityInCart}
                </span>
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(product.id, quantityInCart + 1)}
                  aria-label={`Increase quantity of ${product.name}`}
                  className="w-9 h-9 rounded-lg inline-flex items-center justify-center text-[#3A2116] hover:bg-white transition-colors duration-150 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-xs font-semibold text-[#6D4C3D] tabular-nums whitespace-nowrap">
                In Cart · {formatPKR(product.price * quantityInCart)}
              </span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
