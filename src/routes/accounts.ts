import express from 'express';
import { markAccountSharedController, getAccountsController } from '@controllers/accounts/accountController';

const router = express.Router();

router.post('/mark_shared', markAccountSharedController);
router.get('/list', getAccountsController);

export default router;
