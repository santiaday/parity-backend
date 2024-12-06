// src/controllers/userController.ts

import { Request, Response } from 'express';
import User from '@models/user/User';
import Account from '@models/account/Account';
import Transaction from '@models/transaction/Transaction';
import plaidClient from '@clients/plaid/plaidClient';
import { fetchAndStoreTransactionsForUser } from '@services/transactions/transactionService';
import { addOrUpdateAccounts } from '@services/accounts/accountService';
import { PlaidAccount } from '@models/account/PlaidAccount';
import dotenv from 'dotenv';


const CURRENT_USER_ID = process.env.CURRENT_USER as string;

export async function syncUserDataController(req: Request, res: Response) {
  console.log("Syncing users")
  try {
    const user = await User.findOne({ clientUserId: CURRENT_USER_ID });
    if (!user || !user.plaidAccessToken) {
      console.log("No user found")
      res.status(400).json({ error: 'User not linked to Plaid.' });
      return
    }

    const access_token = user.plaidAccessToken;

    const accountsResp = await plaidClient.accountsGet({ access_token });
    const plaidAccounts = accountsResp.data.accounts as PlaidAccount[];
    console.log("Plaid accounts: " + plaidAccounts)

    await addOrUpdateAccounts(user.clientUserId, plaidAccounts);

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);
    const formatter = new Intl.DateTimeFormat('en-CA');
    const start_date = formatter.format(startDate);
    const end_date = formatter.format(endDate);

    await fetchAndStoreTransactionsForUser(access_token, start_date, end_date, plaidClient);

    const accounts = await Account.find({
      $or: [
        { ownerUserId: user.clientUserId },
        { sharedWithUserId: user.clientUserId }
      ]
    }).lean();

    console.log("accounts: " + accounts)

    const accountIds = accounts.map(a => a._id.toString());

    const transactions = await Transaction.find({
      accountId: { $in: accountIds },
      date: { $gte: start_date, $lte: end_date }
    }).lean();

    console.log("transactions: " + transactions)

    res.status(200).json({ accounts, transactions });
    return;
  } catch (error: any) {
    console.error('Error syncing user data:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
}
