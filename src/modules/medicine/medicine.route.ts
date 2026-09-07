import express from 'express';
import * as medicineController from './medicine.controller';
import { auth } from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { validateRequest } from '../../middlewares/validateRequest';
import { createMedicineSchema, updateMedicineSchema } from './medicine.validation';

const router = express.Router();

router.get('/', medicineController.getAllMedicines);
router.get('/:id', medicineController.getMedicine);
router.post('/', auth(UserRole.PHARMACIST, UserRole.ADMIN), validateRequest(createMedicineSchema), medicineController.createMedicine);
router.patch('/:id', auth(UserRole.PHARMACIST, UserRole.ADMIN), validateRequest(updateMedicineSchema), medicineController.updateMedicine);
router.delete('/:id', auth(UserRole.PHARMACIST, UserRole.ADMIN), medicineController.deleteMedicine);

export const medicineRoutes = router;
