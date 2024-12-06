import express from 'express';
import { syncUserDataController } from '@controllers/users/syncUserInfoController';

const router = express.Router();

router.get('/sync', syncUserDataController);

export default router;
