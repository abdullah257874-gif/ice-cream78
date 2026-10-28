import { Product, Review, FaqItem } from '../types';

import heroSweetScoopImg from '../assets/images/hero_sweet_scoop_1793015272523.jpg';
import vanillaImg from '../assets/images/vanilla_ice_cream_1793015273127.jpg';
import chocolateImg from '../assets/images/chocolate_ice_cream_1793015274773.jpg';
import strawberryImg from '../assets/images/strawberry_ice_cream_1793015275982.jpg';
import mangoImg from '../assets/images/mango_ice_cream_1793015276960.jpg';
import cookiesCreamImg from '../assets/images/cookies_and_cream_1793015277858.jpg';
import chocolateSundaeImg from '../assets/images/chocolate_sundae_1793015278801.jpg';
import familyTubImg from '../assets/images/family_ice_cream_tub_1793015280050.jpg';
import specialShakeImg from '../assets/images/special_ice_cream_shake_1793015282574.jpg';
import aboutCreameryImg from '../assets/images/about_creamery_craft_1793015284303.jpg';

/**
 * ============================================================================
 * EASY SHOP CONFIGURATION
 * Replace 'YOUR_WHATSAPP_NUMBER' below with your actual WhatsApp phone number
 * in international format without '+' or spaces (for example: '923001234567').
 * ============================================================================
 */
export const WHATSAPP_NUMBER: string = 'YOUR_WHATSAPP_NUMBER';

export function getWhatsAppPhone(): string {
  return WHATSAPP_NUMBER === 'YOUR_WHATSAPP_NUMBER'
    ? 'YOUR_WHATSAPP_NUMBER'
    : WHATSAPP_NUMBER.replace(/[^0-9]/g, '');
}

export const SHOP_INFO = {
  name: 'Sweet Scoop Ice Cream',
  currency: 'Rs.',
  phoneDisplay: '+92 300 1234567',
  email: 'hello@sweetscoop.pk',
  address: 'Shop 14, Blossom Arcade, Main Boulevard, Gulberg, Lahore',
  hoursWeekday: 'Mon – Thu: 12:00 PM – 11:30 PM',
  hoursWeekend: 'Fri – Sun: 12:00 PM – 1:00 AM',
  deliveryNote: 'Free insulated doorstep delivery across town — Cash on Delivery',
  heroImage: heroSweetScoopImg,
  aboutImage: aboutCreameryImg,
};

/**
 * ============================================================================
 * ICE CREAM MENU & PKR PRICES (EASY TO EDIT)
 * Edit product names, descriptions, or PKR prices directly in this array.
 * ============================================================================
 */
export const PRODUCTS: Product[] = [
  {
    id: 'vanilla-ice-cream',
    name: 'Vanilla Ice Cream',
    price: 150,
    description:
      'Velvety Madagascar vanilla bean ice cream churned fresh with pure dairy cream and crisp wafer crunch.',
    category: 'Classic Scoops',
    servingNote: 'Double Scoop',
    image: vanillaImg,
  },
  {
    id: 'chocolate-ice-cream',
    name: 'Chocolate Ice Cream',
    price: 200,
    description:
      'Deep, fudgy Dutch-process cocoa ice cream finished with delicate dark chocolate curls.',
    category: 'Classic Scoops',
    servingNote: 'Double Scoop',
    image: chocolateImg,
  },
  {
    id: 'strawberry-ice-cream',
    name: 'Strawberry Ice Cream',
    price: 180,
    description:
      'Creamy pastel-pink strawberry scoops folded with sweet, sun-ripened real strawberry puree.',
    category: 'Classic Scoops',
    servingNote: 'Double Scoop',
    image: strawberryImg,
  },
  {
    id: 'mango-ice-cream',
    name: 'Mango Ice Cream',
    price: 180,
    description:
      'Golden Pakistani Chaunsa mango ice cream bursting with luscious, sweet orchard fruit flavor.',
    category: 'Classic Scoops',
    servingNote: 'Double Scoop',
    image: mangoImg,
    isBestSeller: true,
    bestSellerRank: '02 · Seasonal Favorite',
  },
  {
    id: 'cookies-and-cream',
    name: 'Cookies & Cream',
    price: 250,
    description:
      'Sweet cream base generously packed with crunchy dark chocolate sandwich cookie chunks in every bite.',
    category: 'Classic Scoops',
    servingNote: 'Double Scoop',
    image: cookiesCreamImg,
    isBestSeller: true,
    bestSellerRank: '01 · Most Ordered',
  },
  {
    id: 'chocolate-sundae',
    name: 'Chocolate Sundae',
    price: 300,
    description:
      'Layered vanilla and rich chocolate scoops topped with warm fudge drizzle, whipped cream, and roasted nuts.',
    category: 'Sundaes & Shakes',
    servingNote: 'Glass Coupe',
    image: chocolateSundaeImg,
  },
  {
    id: 'family-ice-cream-tub',
    name: 'Family Ice Cream Tub',
    price: 600,
    description:
      'Generous 1-liter shareable tub swirling our signature strawberry, vanilla bean, and chocolate flavors.',
    category: 'Family Packs',
    servingNote: '1 Liter Tub (6–8 Scoops)',
    image: familyTubImg,
    isBestSeller: true,
    bestSellerRank: '03 · Best Family Value',
  },
  {
    id: 'special-ice-cream-shake',
    name: 'Special Ice Cream Shake',
    price: 250,
    description:
      'Thick, hand-spun strawberry and vanilla ice cream shake crowned with fresh whipped cream and a wafer roll.',
    category: 'Sundaes & Shakes',
    servingNote: 'Tall Chilled Glass',
    image: specialShakeImg,
  },
];

export const CUSTOMER_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    customerName: 'Ayesha Siddiqui',
    location: 'Gulberg III, Lahore',
    orderedItem: 'Family Ice Cream Tub & Mango Ice Cream',
    rating: 5,
    comment:
      'Ordered two Family Tubs via WhatsApp for our Friday dinner. They arrived rock-solid in insulated packaging within 25 minutes, and the Chaunsa mango tastes like real fruit rather than artificial syrup.',
  },
  {
    id: 'rev-2',
    customerName: 'Bilal Mahmood',
    location: 'DHA Phase 5, Lahore',
    orderedItem: 'Cookies & Cream & Chocolate Sundae',
    rating: 5,
    comment:
      'Hands down the best quality-to-price ratio in town. Getting a loaded Chocolate Sundae for Rs. 300 and Cookies & Cream for Rs. 250 without complicated app signups makes ordering effortless.',
  },
  {
    id: 'rev-3',
    customerName: 'Hira & Usman Tariq',
    location: 'Model Town, Lahore',
    orderedItem: 'Special Ice Cream Shake & Strawberry Ice Cream',
    rating: 5,
    comment:
      'Our kids ask for Sweet Scoop every weekend. The Strawberry Ice Cream has such a fresh, natural creaminess, and WhatsApp checkout takes less than thirty seconds.',
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'How does WhatsApp ordering work?',
    answer:
      'Simply add your favorite flavors to the cart, click Checkout, enter your name and delivery address, and tap "Place Order on WhatsApp". Your complete itemized order and total in PKR are pre-filled automatically—just press send in WhatsApp!',
  },
  {
    id: 'faq-2',
    question: 'How do I pay for my ice cream order?',
    answer:
      'We accept Cash on Delivery (COD) for all orders so you only pay when your fresh scoops arrive at your doorstep. Bank transfer / JazzCash / EasyPaisa details can also be requested directly in the WhatsApp chat.',
  },
  {
    id: 'faq-3',
    question: 'Will my ice cream melt during delivery?',
    answer:
      'Never! Every delivery order is packed inside thermal insulated boxes with food-grade cold packs so your scoops, sundaes, and shakes arrive chilled and firm at your door.',
  },
  {
    id: 'faq-4',
    question: 'Is your ice cream made with 100% pure dairy?',
    answer:
      'Yes. We churn small batches every morning using fresh local farm milk and pure dairy cream—never vegetable fat or artificial frozen-dessert substitutes.',
  },
  {
    id: 'faq-5',
    question: 'Can I order Family Tubs in bulk for birthdays or school events?',
    answer:
      'Absolutely! You can add multiple Family Ice Cream Tubs (Rs. 600 each) directly to your cart or message us on WhatsApp at least 4 hours in advance for custom flavor tubs and party cups.',
  },
];

export function formatPKR(amount: number): string {
  return `${SHOP_INFO.currency} ${amount.toLocaleString('en-PK')}`;
}

export function buildWhatsAppOrderUrl(params: {
  customerName: string;
  deliveryAddress: string;
  customerPhone?: string;
  notes?: string;
  items: { name: string; quantity: number; price: number }[];
  totalPrice: number;
}): { url: string; message: string } {
  const lines: string[] = [
    `*New Order — ${SHOP_INFO.name}*`,
    '',
    `*Customer Name:* ${params.customerName.trim()}`,
  ];

  if (params.customerPhone?.trim()) {
    lines.push(`*Phone:* ${params.customerPhone.trim()}`);
  }

  lines.push(`*Delivery Address:* ${params.deliveryAddress.trim()}`);
  lines.push('');
  lines.push('*Selected Items:*');

  params.items.forEach((item, idx) => {
    const lineTotal = item.price * item.quantity;
    lines.push(
      `${idx + 1}. ${item.name} × ${item.quantity} — ${formatPKR(lineTotal)}`
    );
  });

  lines.push('');
  lines.push(`*Total Price:* ${formatPKR(params.totalPrice)}`);
  lines.push('*Payment Method:* Cash on Delivery');

  if (params.notes?.trim()) {
    lines.push(`*Special Notes:* ${params.notes.trim()}`);
  }

  lines.push('');
  lines.push('Please confirm my order and estimated delivery time. Thank you!');

  const message = lines.join('\n');
  const cleanNumber = getWhatsAppPhone();

  const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
  return { url, message };
}
