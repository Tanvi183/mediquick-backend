import { z } from 'zod';
import { DosageForm } from '@prisma/client';

export const createMedicineSchema = z.object({
  body: z.object({
    categoryId: z.string().min(1, 'CategoryId is required'),
    name: z.string().min(2, 'Medicine name is required'),
    genericName: z.string().min(2, 'Generic name is required'),
    dosageForm: z.nativeEnum(DosageForm).optional().default(DosageForm.TABLET),
    strength: z.string().min(1, 'Strength is required (e.g. 500mg)'),
    price: z.number().positive('Price must be positive'),
    stockQuantity: z.number().int().nonnegative('Stock cannot be negative'),
    requiresPrescription: z.boolean().optional().default(false),
    manufacturer: z.string().min(1, 'Manufacturer is required'),
    expiryDate: z.string().min(1, 'Expiry date is required'),
    imageUrl: z.string().url().optional(),
  }),
});

export const updateMedicineSchema = z.object({
  body: z.object({
    categoryId: z.string().optional(),
    name: z.string().optional(),
    genericName: z.string().optional(),
    dosageForm: z.nativeEnum(DosageForm).optional(),
    strength: z.string().optional(),
    price: z.number().positive().optional(),
    stockQuantity: z.number().int().nonnegative().optional(),
    requiresPrescription: z.boolean().optional(),
    manufacturer: z.string().optional(),
    expiryDate: z.string().optional(),
    imageUrl: z.string().url().optional(),
  }),
});
