import { z } from 'zod';
import { OrderStatus } from '@prisma/client';

export const createOrderSchema = z.object({
  body: z.object({
    shippingAddress: z.string().min(5, 'Shipping address is required'),
    contactPhone: z.string().min(5, 'Contact phone is required'),
    prescriptionId: z.string().optional(),
    items: z.array(
      z.object({
        medicineId: z.string().min(1, 'Medicine ID is required'),
        quantity: z.number().int().positive('Quantity must be positive'),
      })
    ).min(1, 'Order must contain at least one medicine item.'),
  }),
});

export const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.nativeEnum(OrderStatus),
  }),
});
