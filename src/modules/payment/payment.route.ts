import express from 'express';
import * as paymentController from './payment.controller';
import { auth } from '../../middlewares/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.post('/initiate', auth(UserRole.CUSTOMER), paymentController.initiate);
router.post('/verify-session', auth(UserRole.CUSTOMER, UserRole.ADMIN), paymentController.verify);
router.get('/order/:orderId', auth(), paymentController.getStatus);

export const paymentRoutes = router;
