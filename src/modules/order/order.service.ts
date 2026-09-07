import { OrderStatus, Prisma, UserRole } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { AppError } from '../../errors/AppError';
import { calculatePagination } from '../../utils/calculatePagination';

export const createOrder = async (customerId: string, payload: any) => {
  return prisma.$transaction(async (tx) => {
    let totalAmount = 0;
    const orderItemsData: any[] = [];

    for (const item of payload.items) {
      const medicine = await tx.medicine.findUnique({
        where: { id: item.medicineId, deletedAt: null },
      });

      if (!medicine) {
        throw new AppError(404, `Medicine with ID ${item.medicineId} not found.`);
      }

      if (medicine.stockQuantity < item.quantity) {
        throw new AppError(400, `Insufficient stock for '${medicine.name}'. Available: ${medicine.stockQuantity}, Requested: ${item.quantity}.`);
      }

      // Check prescription constraint
      if (medicine.requiresPrescription && !payload.prescriptionId) {
        throw new AppError(400, `Medicine '${medicine.name}' requires an approved doctor prescription to purchase.`);
      }

      // Deduct stock atomically
      await tx.medicine.update({
        where: { id: item.medicineId },
        data: { stockQuantity: { decrement: item.quantity } },
      });

      const subtotal = medicine.price * item.quantity;
      totalAmount += subtotal;

      orderItemsData.push({
        medicineId: item.medicineId,
        quantity: item.quantity,
        unitPrice: medicine.price,
        subtotal,
      });
    }

    const order = await tx.order.create({
      data: {
        customerId,
        totalAmount,
        shippingAddress: payload.shippingAddress,
        contactPhone: payload.contactPhone,
        prescriptionId: payload.prescriptionId,
        status: OrderStatus.PENDING,
        orderItems: { create: orderItemsData },
      },
      include: {
        orderItems: { include: { medicine: { select: { name: true, strength: true } } } },
      },
    });

    return order;
  });
};

export const getMyOrders = async (customerId: string, paginationOptions: any) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(paginationOptions);

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: { customerId, deletedAt: null },
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        orderItems: { include: { medicine: { select: { name: true, price: true } } } },
        payment: true,
      },
    }),
    prisma.order.count({ where: { customerId, deletedAt: null } }),
  ]);

  return {
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    data: orders,
  };
};

export const getAllOrders = async (paginationOptions: any) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(paginationOptions);

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: { deletedAt: null },
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        customer: { select: { id: true, name: true, email: true } },
        orderItems: true,
        payment: true,
      },
    }),
    prisma.order.count({ where: { deletedAt: null } }),
  ]);

  return {
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    data: orders,
  };
};

export const getOrderById = async (orderId: string, user: { id: string; role: UserRole }) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId, deletedAt: null },
    include: {
      customer: { select: { id: true, name: true, email: true, phone: true } },
      orderItems: { include: { medicine: true } },
      payment: true,
      prescription: true,
    },
  });

  if (!order) throw new AppError(404, 'Order not found.');

  if (user.role === UserRole.CUSTOMER && order.customerId !== user.id) {
    throw new AppError(403, 'Forbidden: You cannot access other users orders.');
  }

  return order;
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
  const order = await prisma.order.findUnique({ where: { id: orderId, deletedAt: null } });
  if (!order) throw new AppError(404, 'Order not found.');

  return prisma.order.update({
    where: { id: orderId },
    data: { status },
    include: { orderItems: true, payment: true },
  });
};
