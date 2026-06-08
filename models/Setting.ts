import { Schema, model, models } from 'mongoose';

export interface ISetting {
  _id: string;
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  currency: string;
  taxRate: number;
  freeShippingThreshold: number;
  metaTitle: string;
  metaDescription: string;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  smtpFromEmail: string;
  createdAt: Date;
  updatedAt: Date;
}

const SettingSchema = new Schema<ISetting>({
  storeName: { type: String, default: 'ShopHub' },
  storeEmail: { type: String, default: 'info@shophub.com' },
  storePhone: { type: String, default: '' },
  storeAddress: { type: String, default: '' },
  currency: { type: String, default: 'USD' },
  taxRate: { type: Number, default: 10 },
  freeShippingThreshold: { type: Number, default: 50 },
  metaTitle: { type: String, default: '' },
  metaDescription: { type: String, default: '' },
  smtpHost: { type: String, default: '' },
  smtpPort: { type: Number, default: 587 },
  smtpUser: { type: String, default: '' },
  smtpPass: { type: String, default: '' },
  smtpFromEmail: { type: String, default: '' }
}, {
  timestamps: true
});

export const Setting = models.Setting || model<ISetting>('Setting', SettingSchema);