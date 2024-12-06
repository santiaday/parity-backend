import { Request, Response } from 'express';
import { createLinkToken, exchangePublicToken, fetchTransactions } from '@services/plaid/plaidService';

export async function createLinkTokenController(req: Request, res: Response) {
  try {
    const linkToken = await createLinkToken();
      res.json({ link_token: linkToken });
      return;
  } catch (error) {
    console.error(error);
      res.status(500).json({ error: 'Error creating link token' });
      return;
  }
}

export async function exchangePublicTokenController(req: Request, res: Response) {
  try {
    const { public_token } = req.body;
    const { access_token, item_id } = await exchangePublicToken(public_token);
      res.json({ access_token, item_id });
      return;
  } catch (error) {
    console.error(error);
      res.status(500).json({ error: 'Error exchanging public token' });
      return;
  }
}

export async function fetchTransactionsController(req: Request, res: Response) {
  try {
    const { start_date, end_date } = req.body;
    const transactionsData = await fetchTransactions(start_date, end_date);
      res.json(transactionsData);
      return;
  } catch (error: any) {
    console.error(error);
    if (error.message === 'User does not have a linked account') {
        res.status(400).json({ error: error.message });
        return;
    }
      res.status(500).json({ error: 'Error fetching transactions' });
      return;
  }
}
