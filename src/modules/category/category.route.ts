import express from 'express';
import * as categoryController from './category.controller';
import { auth } from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { validateRequest } from '../../middlewares/validateRequest';
import { createCategorySchema, updateCategorySchema } from './category.validation';

const router = express.Router();

router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategory);
router.post('/', auth(UserRole.ADMIN), validateRequest(createCategorySchema), categoryController.createCategory);
router.patch('/:id', auth(UserRole.ADMIN), validateRequest(updateCategorySchema), categoryController.updateCategory);
router.delete('/:id', auth(UserRole.ADMIN), categoryController.deleteCategory);

export const categoryRoutes = router;
