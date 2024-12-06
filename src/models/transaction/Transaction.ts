import mongoose, { Document, Model } from 'mongoose';

export type TransactionClassification = 'joint' | 'mine' | 'theirs';

export interface ITransaction extends Document {
  accountId: string;
  plaidTransactionId: string;
  date: string;
  name: string;
  amount: number;
  classification: TransactionClassification; 
  // Future: store split ratio if needed, for now assume joint is 50/50
}

const transactionSchema = new mongoose.Schema<ITransaction>({
  accountId: { type: String, required: true },
  plaidTransactionId: { type: String, required: true },
  date: { type: String, required: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  classification: { type: String, enum: ['joint', 'mine', 'theirs'], default: 'mine' }
});

transactionSchema.index({ accountId: 1 });
transactionSchema.index({ plaidTransactionId: 1 }, { unique: true });

const Transaction: Model<ITransaction> = mongoose.model<ITransaction>('Transaction', transactionSchema);
export default Transaction;
