import { Request, Response } from 'express';
import { updateTransactionClassification } from '@services/transactions/transactionService';
import dotenv from 'dotenv';


const CURRENT_USER_ID = process.env.CURRENT_USER as string;

export async function updateTransactionClassificationController(req: Request, res: Response) {
  try {
    const { transactionId, classification } = req.body;
    const validClassifications = ['joint', 'mine', 'theirs'];
    if (!validClassifications.includes(classification)) {
        res.status(400).json({ error: 'Invalid classification' });
        return;
    }
    const txn = await updateTransactionClassification(transactionId, CURRENT_USER_ID, classification);
      res.json({ transaction: txn });
      return;
  } catch (error: any) {
    console.error(error);
      res.status(500).json({ error: 'Error updating transaction classification' });
      return;
  }
}
