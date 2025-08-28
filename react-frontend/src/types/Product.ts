export interface Product {
  _id: string;
  id?: string; // Optional for backward compatibility
  slug: string;
  title: string;
  affiliateUrl: string;
  vendor: 'amazon' | 'flipkart';
  images: string[];
  originalPrice: number;
  discountedPrice: number;
  currency: string;
  description: string;
  features: string[];
  specs?: Record<string, any>; // Optional specs
  category: string; // Changed from strict union to string for flexibility
  isActive: boolean;
  tags: string[];
  rating: number;
  reviewCount: number;
  stockStatus?: 'in-stock' | 'out-of-stock' | 'limited';
  clicks?: number; // Optional clicks
  // SEO Fields
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  // Priority/Featured System
  priority?: number;
  isFeatured?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Utility function to calculate discount percentage
export const calculateDiscountPercent = (originalPrice: number, discountedPrice: number): number => {
  if (originalPrice <= 0) return 0;
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
};

// Utility function to calculate savings amount
export const calculateSavings = (originalPrice: number, discountedPrice: number): number => {
  return originalPrice - discountedPrice;
};

// Utility function to format price with currency
export const formatPrice = (price: number, currency: string = 'INR'): string => {
  return `${currency === 'INR' ? '₹' : '$'}${price.toLocaleString()}`;
};

// Utility function to get vendor display name
export const getVendorDisplayName = (vendor: string): string => {
  switch (vendor) {
    case 'amazon':
      return 'Amazon';
    case 'flipkart':
      return 'Flipkart';
    default:
      return 'Other';
  }
};

// Utility function to get category display name
export const getCategoryDisplayName = (category: string): string => {
  switch (category) {
    case 'keyboard':
      return 'Keyboards';
    case 'mouse':
      return 'Mouse & Mousepads';
    case 'furniture':
      return 'Furniture';
    case 'electronics':
      return 'Electronics';
    case 'books':
      return 'Books & Study Material';
    case 'accessories':
      return 'Accessories';
    case 'stationery':
      return 'Stationery';
    case 'cables':
      return 'Cables & Connectors';
    case 'lighting':
      return 'Lighting';
    case 'audio':
      return 'Audio Equipment';
    case 'storage':
      return 'Storage Solutions';
    default:
      return category;
  }
};

// Utility function to get vendor color
export const getVendorColor = (vendor: string): string => {
  switch (vendor) {
    case 'amazon':
      return '#ff9900';
    case 'flipkart':
      return '#2874f0';
    default:
      return '#6b7280';
  }
};
