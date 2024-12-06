import { Request, Response } from 'express';
import { markAccountAsShared, getVisibleAccountsForUser } from '@services/accounts/accountService';
import User from '@models/user/User';
import dotenv from 'dotenv';


const CURRENT_USER_ID = process.env.CURRENT_USER as string;

export async function markAccountSharedController(req: Request, res: Response) {
  try {
    const { accountId } = req.body;
    const user = await User.findOne({ clientUserId: CURRENT_USER_ID });
      if (!user) {
          res.status(401).json({ error: 'User not found' });
          return;
    } else if (!user.partnerUserId) {
          res.status(400).json({ error: 'No partner set up yet' });
          return;
      } else if (user) {
        const account = await markAccountAsShared(accountId, user.clientUserId, user.partnerUserId);
          res.json({ account });
          return;
    }


  } catch (error: any) {
    console.error(error);
      res.status(500).json({ error: 'Error marking account as shared' });
      return;
  }
}

export async function getAccountsController(req: Request, res: Response) {
  try {
    const accounts = await getVisibleAccountsForUser(CURRENT_USER_ID);
      res.json({ accounts });
      return;
  } catch (error: any) {
    console.error(error);
      res.status(500).json({ error: 'Error fetching accounts' });
      return;
  }
}
