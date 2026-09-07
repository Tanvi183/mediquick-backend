import { OrderStatus, PaymentStatus, UserRole } from '@prisma/client';
import { prisma } from '../../config/prisma';

export const getDashboardStats = async () => {
  const [totalUsers, totalCustomers, totalPharmacists, totalOrders, totalMedicines, revenueResult, pendingPrescriptions] = await Promise.all([
    prisma.user.count({ where: { deletedAt: null } }),
    prisma.user.count({ where: { role: UserRole.CUSTOMER, deletedAt: null } }),
    prisma.user.count({ where: { role: UserRole.PHARMACIST, deletedAt: null } }),
    prisma.order.count({ where: { deletedAt: null } }),
    prisma.medicine.count({ where: { deletedAt: null } }),
    prisma.payment.aggregate({
      where: { status: PaymentStatus.SUCCEEDED },
      _sum: { amount: true },
    }),
    prisma.prescription.count({ where: { status: 'PENDING', deletedAt: null } }),
  ]);

  const recentOrders = await prisma.order.findMany({
    where: { deletedAt: null },
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { customer: { select: { name: true, email: true } }, payment: true },
  });

  return {
    totalRevenue: revenueResult._sum.amount || 0,
    totalOrders,
    totalMedicines,
    totalUsers,
    totalCustomers,
    totalPharmacists,
    pendingPrescriptions,
    recentOrders,
  };
};
