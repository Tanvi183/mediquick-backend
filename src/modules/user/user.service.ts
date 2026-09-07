import { UserRole, UserStatus, Prisma } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { calculatePagination } from '../../utils/calculatePagination';
import { AppError } from '../../errors/AppError';

export const getAllUsers = async (filters: any, paginationOptions: any) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(paginationOptions);
  const { search, role, status } = filters;

  const andConditions: Prisma.UserWhereInput[] = [{ deletedAt: null }];

  if (search) {
    andConditions.push({
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ],
    });
  }

  if (role) andConditions.push({ role: role as UserRole });
  if (status) andConditions.push({ status: status as UserStatus });

  const whereConditions: Prisma.UserWhereInput = { AND: andConditions };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        phone: true,
        avatar: true,
        createdAt: true,
      },
    }),
    prisma.user.count({ where: whereConditions }),
  ]);

  return {
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    data: users,
  };
};

export const updateUserRole = async (userId: string, role: UserRole) => {
  const user = await prisma.user.findUnique({ where: { id: userId, deletedAt: null } });
  if (!user) throw new AppError(404, 'User not found.');

  return prisma.user.update({
    where: { id: userId },
    data: { role },
    select: { id: true, name: true, email: true, role: true, status: true },
  });
};

export const updateUserStatus = async (userId: string, status: UserStatus) => {
  const user = await prisma.user.findUnique({ where: { id: userId, deletedAt: null } });
  if (!user) throw new AppError(404, 'User not found.');

  return prisma.user.update({
    where: { id: userId },
    data: { status },
    select: { id: true, name: true, email: true, role: true, status: true },
  });
};

export const updateProfile = async (userId: string, payload: any) => {
  return prisma.user.update({
    where: { id: userId },
    data: payload,
    select: { id: true, name: true, email: true, phone: true, avatar: true },
  });
};
