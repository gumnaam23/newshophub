import { Schema, model, models } from 'mongoose';

export interface ICoupon {
  _id: string;
  code: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  minPurchase: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  perUserLimit: number;
  usedBy: string[];
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  applicableProducts?: string[];
  applicableCategories?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema = new Schema<ICoupon>({
  code: { type: String, required: true, unique: true, uppercase: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['percentage', 'fixed'], required: true },
  value: { type: Number, required: true, min: 0 },
  minPurchase: { type: Number, default: 0, min: 0 },
  maxDiscount: { type: Number, min: 0 },
  usageLimit: { type: Number, default: 1, min: 1 },
  usedCount: { type: Number, default: 0, min: 0 },
  perUserLimit: { type: Number, default: 1, min: 1 },
  usedBy: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  applicableProducts: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  applicableCategories: [{ type: String }]
}, {
  timestamps: true
});

// Indexes
CouponSchema.index({ code: 1 });
CouponSchema.index({ isActive: 1, startDate: 1, endDate: 1 });
CouponSchema.index({ usedCount: 1, usageLimit: 1 });

export const Coupon = models.Coupon || model<ICoupon>('Coupon', CouponSchema);