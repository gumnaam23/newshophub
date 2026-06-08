import { Schema, model, models } from 'mongoose';

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  icon: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  image: { type: String, default: '' },
  icon: { type: String, default: 'folder-tree' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Index
CategorySchema.index({ slug: 1 });
CategorySchema.index({ order: 1 });

export const Category = models.Category || model<ICategory>('Category', CategorySchema);