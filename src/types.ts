export type ProductCategory = 'Classic Scoops' | 'Sundaes & Shakes' | 'Family Packs';

export interface Product {
  id: string;
  name: string;
  price: number; // Price in PKR (Rs.)
  description: string;
  category: ProductCategory;
  servingNote: string;
  image: string;
  isBestSeller?: boolean;
  bestSellerRank?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Review {
  id: string;
  customerName: string;
  location: string;
  orderedItem: string;
  rating: number;
  comment: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}
