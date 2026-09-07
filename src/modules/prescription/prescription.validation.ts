import { z } from 'zod';
import { PrescriptionStatus } from '@prisma/client';

export const uploadPrescriptionSchema = z.object({
  body: z.object({
    fileUrl: z.string().url('Valid file URL is required'),
    notes: z.string().optional(),
  }),
});

export const reviewPrescriptionSchema = z.object({
  body: z.object({
    status: z.nativeEnum(PrescriptionStatus),
    pharmacistFeedback: z.string().optional(),
  }),
});
