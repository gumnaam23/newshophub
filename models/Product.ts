import { Schema, model, models } from 'mongoose';

export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  longDescription?: string;
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
  revenue: number;
  colors: string[];
  sizes: string[];
  brand: string;
  specifications?: Map<string, string>;
  features?: string[];
  views: number;
  soldCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, required: true },
  longDescription: { type: String },
  price: { type: Number, required: true, min: 0 },
  comparePrice: { type: Number, default: 0, min: 0 },
  images: [{ type: String, required: true }],
  category: { type: String, required: true, index: true },
  tags: [{ type: String }],
  isFeatured: { type: Boolean, default: false },
  isNewProduct: { type: Boolean, default: false },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  stock: { type: Number, required: true, default: 0, min: 0 },
  revenue: {type: Number, default: 0},
  colors: [{ type: String }],
  sizes: [{ type: String }],
  brand: { type: String, required: true },
  specifications: { type: Map, of: String },
  features: [{ type: String }],
  views: { type: Number, default: 0 },
  soldCount: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Create indexes for better search performance
ProductSchema.index({ name: 'text', description: 'text', brand: 'text', tags: 'text' });
ProductSchema.index({ category: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ rating: -1 });
ProductSchema.index({ createdAt: -1 });

// Pre-save middleware to generate slug
ProductSchema.pre('save', function() {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
});

export const Product = models.Product || model<IProduct>('Product', ProductSchema);