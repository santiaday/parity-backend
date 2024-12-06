import mongoose, { Document, Model } from 'mongoose';

export interface IUser extends Document {
  clientUserId: string;
  plaidAccessToken?: string | null;
  plaidItemId?: string | null;
  partnerUserId?: string | null; 
}

const userSchema = new mongoose.Schema<IUser>({
  clientUserId: { type: String, unique: true, required: true },
  plaidAccessToken: { type: String, default: null },
  plaidItemId: { type: String, default: null },
  partnerUserId: { type: String, default: null }
});

userSchema.index({ clientUserId: 1 }, { unique: true });

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
export default User;
