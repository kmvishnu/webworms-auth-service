import { Router } from 'express';
import { getAppInfo } from '../controllers/appController';

const router = Router();

router.get('/info', getAppInfo);

export default router;
