import express from 'express';
import * as authController from './auth.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import {
  registerValidationSchema,
  loginValidationSchema,
  refreshTokenValidationSchema,
  changePasswordValidationSchema,
} from './auth.validation';
import { auth } from '../../middlewares/auth';

const router = express.Router();

router.post('/register', validateRequest(registerValidationSchema), authController.register);
router.post('/login', validateRequest(loginValidationSchema), authController.login);
router.post('/refresh-token', validateRequest(refreshTokenValidationSchema), authController.refresh);
router.patch('/change-password', auth(), validateRequest(changePasswordValidationSchema), authController.changeUserPassword);
router.get('/me', auth(), authController.getMyProfile);

export const authRoutes = router;
