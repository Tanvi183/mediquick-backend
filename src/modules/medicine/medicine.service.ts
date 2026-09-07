import { Prisma, UserRole } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { calculatePagination } from '../../utils/calculatePagination';
import { AppError } from '../../errors/AppError';

export const createMedicine = async (userId: string, role: UserRole, payload: any) => {
  let pharmacyId: string;

  if (role === UserRole.PHARMACIST) {
    const pharmacy = await prisma.pharmacyProfile.findUnique({ where: { userId } });
    if (!pharmacy) throw new AppError(404, 'Pharmacy profile not found. Please register as a verified pharmacy.');
    pharmacyId = pharmacy.id;
  } else {
    // Admin can attach to default or first pharmacy
    const firstPharmacy = await prisma.pharmacyProfile.findFirst();
    if (!firstPharmacy) throw new AppError(400, 'No pharmacy available. Please seed or create a pharmacy profile first.');
    pharmacyId = firstPharmacy.id;
  }

  const category = await prisma.category.findUnique({ where: { id: payload.categoryId, deletedAt: null } });
  if (!category) throw new AppError(404, 'Selected category does not exist.');

  return prisma.medicine.create({
    data: {
      ...payload,
      pharmacyId,
      expiryDate: new Date(payload.expiryDate),
    },
    include: { category: true, pharmacy: true },
  });
};

export const getAllMedicines = async (filters: any, paginationOptions: any) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(paginationOptions);
  const { search, categoryId, requiresPrescription, minPrice, maxPrice } = filters;

  const andConditions: Prisma.MedicineWhereInput[] = [{ deletedAt: null }];

  if (search) {
    andConditions.push({
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { genericName: { contains: search, mode: 'insensitive' } },
        { manufacturer: { contains: search, mode: 'insensitive' } },
      ],
    });
  }

  if (categoryId) andConditions.push({ categoryId });
  if (requiresPrescription !== undefined) {
    andConditions.push({ requiresPrescription: requiresPrescription === 'true' });
  }

  if (minPrice || maxPrice) {
    andConditions.push({
      price: {
        ...(minPrice && { gte: Number(minPrice) }),
        ...(maxPrice && { lte: Number(maxPrice) }),
      },
    });
  }

  const whereConditions: Prisma.MedicineWhereInput = { AND: andConditions };

  const [medicines, total] = await Promise.all([
    prisma.medicine.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        pharmacy: { select: { id: true, pharmacyName: true, address: true } },
      },
    }),
    prisma.medicine.count({ where: whereConditions }),
  ]);

  return {
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    data: medicines,
  };
};

export const getMedicineById = async (id: string) => {
  const medicine = await prisma.medicine.findUnique({
    where: { id, deletedAt: null },
    include: {
      category: true,
      pharmacy: true,
      reviews: { include: { customer: { select: { name: true, avatar: true } } } },
    },
  });

  if (!medicine) throw new AppError(404, 'Medicine not found.');
  return medicine;
};

export const updateMedicine = async (id: string, payload: any) => {
  await getMedicineById(id);

  return prisma.medicine.update({
    where: { id },
    data: {
      ...payload,
      ...(payload.expiryDate && { expiryDate: new Date(payload.expiryDate) }),
    },
    include: { category: true },
  });
};

export const deleteMedicine = async (id: string) => {
  await getMedicineById(id);

  return prisma.medicine.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};
