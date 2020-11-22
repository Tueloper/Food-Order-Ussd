import { Router } from 'express';
import userRoutes from './auth';

const router = Router();

router.use('/', userRoutes);

export default router;
