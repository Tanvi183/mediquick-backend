import express from 'express';
import * as userController from './user.controller';
import { auth } from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { validateRequest } from '../../middlewares/validateRequest';
import { updateUserRoleSchema, updateUserStatusSchema, updateProfileSchema } from './user.validation';

const router = express.Router();

router.get('/', auth(UserRole.ADMIN), userController.getUsers);
router.patch('/profile', auth(), validateRequest(updateProfileSchema), userController.updateMyProfile);
router.patch('/:id/role', auth(UserRole.ADMIN), validateRequest(updateUserRoleSchema), userController.updateRole);
router.patch('/:id/status', auth(UserRole.ADMIN), validateRequest(updateUserStatusSchema), userController.updateStatus);

export const userRoutes = router;
