import { Schema, model, models } from 'mongoose';

export interface IReview {
  _id: string;
  productId:  Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  rating: number;
  title: string;
  comment: string;
  helpful: number;
  images: string[];
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, required: true },
  comment: { type: String, required: true },
  helpful: { type: Number, default: 0 },
  images: [{ type: String }],
  isApproved: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Index for faster queries
ReviewSchema.index({ productId: 1, isApproved: 1 });
ReviewSchema.index({ userId: 1 });

export const Review = models.Review || model<IReview>('Review', ReviewSchema);