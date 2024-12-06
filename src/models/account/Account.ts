import mongoose, { Document, Model } from 'mongoose';

export interface IAccount extends Document {
  ownerUserId: string;
  plaidAccountId: string;
  shared: boolean;
  sharedWithUserId?: string | null;
  name: string;
  officialName?: string;
  type?: string;
  subtype?: string;
}

const accountSchema = new mongoose.Schema<IAccount>({
  ownerUserId: { type: String, required: true },
  plaidAccountId: { type: String, required: true },
  shared: { type: Boolean, default: false },
  sharedWithUserId: { type: String, default: null },
  name: { type: String, required: true },
  officialName: { type: String },
  type: { type: String },
  subtype: { type: String }
});

// Ensure no two identical plaidAccountIds
accountSchema.index({ plaidAccountId: 1 }, { unique: true });

const Account: Model<IAccount> = mongoose.model<IAccount>('Account', accountSchema);
export default Account;
