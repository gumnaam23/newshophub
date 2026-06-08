import { Schema, model, models } from 'mongoose';

export interface IOrder {
  _id: string;
  orderNumber: string;
  userId: Schema.Types.ObjectId;
  items: IOrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentMethod: string;
  shippingAddress: IShippingAddress;
  trackingNumber?: string;
  carrier?: string;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderItem {
  productId: Schema.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface IShippingAddress {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String, required: true }
});

const ShippingAddressSchema = new Schema<IShippingAddress>({
  fullName: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
  phone: { type: String, required: true }
});

const OrderSchema = new Schema<IOrder>({
  orderNumber: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [OrderItemSchema],
  subtotal: { type: Number, required: true },
  shipping: { type: Number, required: true, default: 0 },
  tax: { type: Number, required: true, default: 0 },
  total: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  paymentMethod: { type: String, required: true },
  shippingAddress: ShippingAddressSchema,
  trackingNumber: { type: String },
  carrier: { type: String },
  adminNotes: { type: String }
}, {
  timestamps: true
});

// Indexes
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ userId: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });

export const Order = models.Order || model<IOrder>('Order', OrderSchema);