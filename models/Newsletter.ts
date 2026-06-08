import { Schema, model, models } from 'mongoose';

export interface INewsletter {
  _id: string;
  email: string;
  name: string;
  preferences: {
    promotions: boolean;
    newArrivals: boolean;
    deals: boolean;
    weeklyDigest: boolean;
  };
  subscribedAt: Date;
  unsubscribedAt?: Date;
  lastEmailSent?: Date;
  status: 'active' | 'unsubscribed' | 'bounced';
  source: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface INewsletterCampaign {
  _id: string;
  subject: string;
  content: string;
  type: 'promotional' | 'newsletter' | 'update';
  segment: string;
  recipientsCount: number;
  successfulCount: number;
  failedCount: number;
  sentAt: Date;
  sentBy: string;
}

const NewsletterPreferencesSchema = new Schema({
  promotions: { type: Boolean, default: true },
  newArrivals: { type: Boolean, default: true },
  deals: { type: Boolean, default: true },
  weeklyDigest: { type: Boolean, default: false }
});

const NewsletterSchema = new Schema<INewsletter>({
  email: { type: String, required: true, unique: true },
  name: { type: String, default: '' },
  preferences: { type: NewsletterPreferencesSchema, default: () => ({}) },
  subscribedAt: { type: Date, default: Date.now },
  unsubscribedAt: { type: Date },
  lastEmailSent: { type: Date },
  status: { 
    type: String, 
    enum: ['active', 'unsubscribed', 'bounced'],
    default: 'active'
  },
  source: { type: String, default: 'website' },
  ipAddress: { type: String },
  userAgent: { type: String }
}, {
  timestamps: true
});

const NewsletterCampaignSchema = new Schema<INewsletterCampaign>({
  subject: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['promotional', 'newsletter', 'update'], required: true },
  segment: { type: String, default: 'all' },
  recipientsCount: { type: Number, default: 0 },
  successfulCount: { type: Number, default: 0 },
  failedCount: { type: Number, default: 0 },
  sentAt: { type: Date, default: Date.now },
  sentBy: { type: String, ref: 'User', required: true }
}, {
  timestamps: true
});

export const Newsletter = models.Newsletter || model<INewsletter>('Newsletter', NewsletterSchema);
export const NewsletterCampaign = models.NewsletterCampaign || model<INewsletterCampaign>('NewsletterCampaign', NewsletterCampaignSchema);