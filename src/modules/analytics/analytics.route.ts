import express from 'express';
import * as analyticsController from './analytics.controller';
import { auth } from '../../middlewares/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();
router.get('/dashboard-stats', auth(UserRole.ADMIN), analyticsController.getStats);

export const analyticsRoutes = router;
