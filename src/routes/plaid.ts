import express from 'express';
import { createLinkTokenController, exchangePublicTokenController, fetchTransactionsController } from '@controllers/plaid/plaidController';

const router = express.Router();

router.post('/create_link_token', createLinkTokenController);
router.post('/get_access_token', exchangePublicTokenController);
router.post('/transactions', fetchTransactionsController);

export default router;