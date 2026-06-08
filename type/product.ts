// types/product.ts
export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice: number;
  images: string[];
  category: string;
  tags: string[];
  isFeatured: boolean;
  isNewProduct: boolean;
  rating: number;
  reviewCount: number;
  stock: number;
  colors: string[];
  sizes: string[];
  brand: string;
}

// For cart and product card display (subset of Product)
export interface ProductDisplay {
  _id: string;
  name: string;
  price: number;
  comparePrice: number;
  images: string[];
  brand: string;
  rating: number;
  reviewCount: number;
  stock: number;
  isNewProduct: boolean;
}