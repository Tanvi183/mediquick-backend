import express from 'express';
import * as prescriptionController from './prescription.controller';
import { auth } from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { validateRequest } from '../../middlewares/validateRequest';
import { uploadPrescriptionSchema, reviewPrescriptionSchema } from './prescription.validation';

const router = express.Router();

router.post('/upload', auth(UserRole.CUSTOMER), validateRequest(uploadPrescriptionSchema), prescriptionController.upload);
router.get('/my', auth(UserRole.CUSTOMER), prescriptionController.getMyList);
router.get('/pending', auth(UserRole.PHARMACIST, UserRole.ADMIN), prescriptionController.getPendingQueue);
router.patch('/:id/review', auth(UserRole.PHARMACIST, UserRole.ADMIN), validateRequest(reviewPrescriptionSchema), prescriptionController.review);

export const prescriptionRoutes = router;
