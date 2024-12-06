import plaidClient from '@clients/plaid/plaidClient';
import { Products, CountryCode } from 'plaid';
import User from '@models/user/User';
import dotenv from 'dotenv';


const CURRENT_USER_ID = process.env.CURRENT_USER as string;

export async function createLinkToken(): Promise<string> {
    let user = await User.findOne({ clientUserId: CURRENT_USER_ID });
    if (!user) {
      user = new User({ clientUserId: CURRENT_USER_ID });
      await user.save();
    }
  
    const response = await plaidClient.linkTokenCreate({
      user: {
        client_user_id: CURRENT_USER_ID,
      },
      client_name: 'Parity App',
      products: [Products.Transactions],
      country_codes: [CountryCode.Us],
      language: 'en',
      redirect_uri: "https://parity-redirect.vercel.app/plaid-redirect"
    });
  
    return response.data.link_token;
  }
  
  export async function exchangePublicToken(publicToken: string) {
    const tokenResponse = await plaidClient.itemPublicTokenExchange({ public_token: publicToken });
    const access_token = tokenResponse.data.access_token;
    const item_id = tokenResponse.data.item_id;
  
    await User.findOneAndUpdate(
      { clientUserId: CURRENT_USER_ID },
      { plaidAccessToken: access_token, plaidItemId: item_id },
      { new: true, upsert: true }
    );
  
    return { access_token, item_id };
  }

export async function fetchTransactions(start_date: string, end_date: string) {
    let user = await User.findOne({ clientUserId: CURRENT_USER_ID });
    
if (!user) {
    user = await User.create({ clientUserId: CURRENT_USER_ID });
}

  if (!user.plaidAccessToken) {
    throw new Error('User does not have a linked account');
  }

  const transactionsResponse = await plaidClient.transactionsGet({
    access_token: user.plaidAccessToken,
    start_date,
    end_date,
  });
  

  return transactionsResponse.data;
}
