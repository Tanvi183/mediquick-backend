import { prisma } from '../../config/prisma';
import { AppError } from '../../errors/AppError';

export const createCategory = async (payload: any) => {
  const existing = await prisma.category.findUnique({ where: { slug: payload.slug } });
  if (existing) throw new AppError(409, 'Category with this slug already exists.');

  return prisma.category.create({ data: payload });
};

export const getCategories = async () => {
  return prisma.category.findMany({
    where: { deletedAt: null },
    include: { _count: { select: { medicines: true } } },
    orderBy: { name: 'asc' },
  });
};

export const getCategoryById = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id, deletedAt: null },
    include: { medicines: { where: { deletedAt: null }, take: 10 } },
  });
  if (!category) throw new AppError(404, 'Category not found.');
  return category;
};

export const updateCategory = async (id: string, payload: any) => {
  await getCategoryById(id);
  return prisma.category.update({ where: { id }, data: payload });
};

export const deleteCategory = async (id: string) => {
  await getCategoryById(id);
  return prisma.category.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};
