import { Types } from "mongoose";

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

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  icon: string;
  productCount: number;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image: string;
  total: number;
  stock: number;
}

export interface CartSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  itemCount?: number;
  totalQuantity?: number;
}



export interface Address {
  _id: string;
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}


export interface IReview {
  _id: string;
  productId:  Types.ObjectId;
  userId:  {
    name: string;
    avatar: string;
  };
  rating: number;
  title: string;
  comment: string;
  helpful: number;
  images: string[];
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}