import express from 'express';
import { updateTransactionClassificationController } from '@controllers/transactions/transactionController';

const router = express.Router();

router.post('/classify', updateTransactionClassificationController);

export default router;
