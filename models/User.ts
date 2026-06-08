import { Schema, Types, model, models } from 'mongoose';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  role: 'user' | 'admin' | 'seller';
  emailVerified?: Date;
  resetToken?: string;
  resetTokenExpiry?: Date;
  accounts?: IAccount[];
  wishlist: string[];
  cart: ICartItem[];
  addresses: IAddress[];
  twoFactorEnabled?: boolean;
  sessionTimeout?: number;
  isBlocked?: boolean;
  paymentMethods: IPaymentMethod[];
  orders: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IAccount {
  provider: string;
  providerAccountId: string;
  type: string;
  access_token?: string;
  refresh_token?: string;
  expires_at?: number;
}

export interface ICartItem {
  _id?: Types.ObjectId;
  productId: Schema.Types.ObjectId;
  quantity: number;
  size?: string;
  color?: string;
  addedAt: Date;
}

export interface IAddress {
  _id: string;
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
  type?: 'home' | 'work' | 'other';
  createdAt: Date;
}

export interface IPaymentMethod {
  _id: string;
  type: 'card' | 'paypal' | 'bank';
  last4?: string;
  cardType?: string;
  expiryMonth?: number;
  expiryYear?: number;
  encryptedCard?: string;
  cardName?: string;
  isDefault: boolean;
  name: string;
  createdAt: Date;
}

const AccountSchema = new Schema<IAccount>({
  provider: { type: String, required: true },
  providerAccountId: { type: String, required: true },
  type: { type: String, required: true },
  access_token: { type: String },
  refresh_token: { type: String },
  expires_at: { type: Number },
});

const CartItemSchema = new Schema<ICartItem>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  size: { type: String },
  color: { type: String },
  addedAt: { type: Date, default: Date.now },
});

const AddressSchema = new Schema<IAddress>({
  fullName: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
  phone: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
  type: { type: String, enum: ['home', 'work', 'other'], default: 'other' },
  createdAt: { type: Date, default: Date.now },
});

const PaymentMethodSchema = new Schema<IPaymentMethod>({
  _id: { type: String, required: true },
  type: { type: String, enum: ['card', 'paypal', 'bank'], required: true },
  last4: { type: String },
  cardType: { type: String },
  expiryMonth: { type: Number },
  expiryYear: { type: Number },
  encryptedCard: { type: String, select: false },
  cardName: { type: String },
  isDefault: { type: Boolean, default: false },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, select: false },
  avatar: { type: String, default: '' },
  role: { type: String, enum: ['user', 'admin', 'seller'], default: 'user' },
  emailVerified: { type: Date },
  resetToken: { type: String, select: false },
  resetTokenExpiry: { type: Date, select: false },
  accounts: [AccountSchema],
  wishlist: [{ type: Schema.Types.ObjectId, ref: 'Product', default: [] }],
  cart: [CartItemSchema],
  addresses: [AddressSchema],
  twoFactorEnabled: { type: Boolean, default: false },
  sessionTimeout: { type: Number, default: 60 },
  isBlocked: { type: Boolean, default: false },
  paymentMethods: [PaymentMethodSchema],
  orders: [{ type: Schema.Types.ObjectId, ref: 'Order', default: [] }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
});

// Indexes for better performance
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ createdAt: -1 });

export const User = models.User || model<IUser>('User', UserSchema);