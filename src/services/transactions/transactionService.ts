import Transaction, { TransactionClassification } from '@models/transaction/Transaction';
import Account from '@models/account/Account';
import { PlaidAPICall } from '@models/plaid/plaidApi';

export async function fetchAndStoreTransactionsForUser(
    accessToken: string,
    start_date: string,
    end_date: string,
    plaidClient: PlaidAPICall
  ) {
    const transactionsResponse = await plaidClient.transactionsGet({
      access_token: accessToken,
      start_date,
      end_date,
      options: { count: 500, offset: 0 }
    });
  
    const plaidTransactions = transactionsResponse.data.transactions;
  
    for (const ptxn of plaidTransactions) {
      const account = await Account.findOne({ plaidAccountId: ptxn.account_id });
      if (!account) {
        console.warn(`Transaction for unknown account_id ${ptxn.account_id} skipped`);
        continue;
      }
  
      let classification: TransactionClassification = 'mine';
      if (account.shared) {
        // If we never classified before, default to 'joint'
        // If transaction exists, keep old classification
        const existingTxn = await Transaction.findOne({ plaidTransactionId: ptxn.transaction_id });
        if (existingTxn) {
          classification = existingTxn.classification; // preserve existing classification
        } else {
          classification = 'joint';
        }
      }
  
        if (account && account._id) {
            await Transaction.findOneAndUpdate(
                { plaidTransactionId: ptxn.transaction_id },
                {
                  accountId: account._id.toString(),
                  plaidTransactionId: ptxn.transaction_id,
                  date: ptxn.date,
                  name: ptxn.name,
                  amount: ptxn.amount,
                  classification
                },
                { upsert: true, new: true }
              );
      }

    }
  }

export async function getTransactionsForUser(userId: string, start_date: string, end_date: string) {
  const accounts = await Account.find({
    $or: [
      { ownerUserId: userId },
      { sharedWithUserId: userId }
    ]
  });

  const accountIds = accounts.map(a => a._id ? a._id.toString() : "");

  const allTxns = await Transaction.find({
    accountId: { $in: accountIds },
    date: { $gte: start_date, $lte: end_date }
  });

  return allTxns;
}

export async function updateTransactionClassification(transactionId: string, userId: string, classification: TransactionClassification) {
  const txn = await Transaction.findById(transactionId);
  if (!txn) throw new Error('Transaction not found');

  const account = await Account.findById(txn.accountId);
  if (!account) throw new Error('Account not found');

  if (account.ownerUserId !== userId && account.sharedWithUserId !== userId) {
    throw new Error('User not authorized to update this transaction');
  }

  if (!account.shared && classification !== 'mine') {
    throw new Error('Non-shared account transactions cannot be classified as joint/theirs');
  }

  txn.classification = classification;
  await txn.save();
  return txn;
}
