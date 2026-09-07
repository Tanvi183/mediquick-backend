import { z } from 'zod';
import { UserRole, UserStatus } from '@prisma/client';

export const updateUserRoleSchema = z.object({
  body: z.object({
    role: z.nativeEnum(UserRole),
  }),
});

export const updateUserStatusSchema = z.object({
  body: z.object({
    status: z.nativeEnum(UserStatus),
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    avatar: z.string().url().optional(),
  }),
});
