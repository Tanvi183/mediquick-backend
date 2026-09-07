import express from 'express';
import * as orderController from './order.controller';
import { auth } from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { validateRequest } from '../../middlewares/validateRequest';
import { createOrderSchema, updateOrderStatusSchema } from './order.validation';

const router = express.Router();

router.post('/', auth(UserRole.CUSTOMER), validateRequest(createOrderSchema), orderController.createOrder);
router.get('/my-orders', auth(UserRole.CUSTOMER), orderController.getMyOrders);
router.get('/', auth(UserRole.PHARMACIST, UserRole.ADMIN), orderController.getAllOrders);
router.get('/:id', auth(), orderController.getOrder);
router.patch('/:id/status', auth(UserRole.PHARMACIST, UserRole.ADMIN), validateRequest(updateOrderStatusSchema), orderController.updateStatus);

export const orderRoutes = router;
