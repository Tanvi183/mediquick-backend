import express from 'express';
import { authRoutes } from '../modules/auth/auth.route';
import { userRoutes } from '../modules/user/user.route';
import { categoryRoutes } from '../modules/category/category.route';
import { medicineRoutes } from '../modules/medicine/medicine.route';
import { prescriptionRoutes } from '../modules/prescription/prescription.route';
import { orderRoutes } from '../modules/order/order.route';
import { paymentRoutes } from '../modules/payment/payment.route';
import { analyticsRoutes } from '../modules/analytics/analytics.route';

const router = express.Router();

const moduleRoutes = [
  { path: '/auth', route: authRoutes },
  { path: '/users', route: userRoutes },
  { path: '/categories', route: categoryRoutes },
  { path: '/medicines', route: medicineRoutes },
  { path: '/prescriptions', route: prescriptionRoutes },
  { path: '/orders', route: orderRoutes },
  { path: '/payments', route: paymentRoutes },
  { path: '/admin', route: analyticsRoutes },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export const applicationRoutes = router;
