import { PrescriptionStatus } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { AppError } from '../../errors/AppError';

export const uploadPrescription = async (customerId: string, payload: any) => {
  return prisma.prescription.create({
    data: {
      customerId,
      fileUrl: payload.fileUrl,
      notes: payload.notes,
      status: PrescriptionStatus.PENDING,
    },
    include: { customer: { select: { id: true, name: true, email: true } } },
  });
};

export const getMyPrescriptions = async (customerId: string) => {
  return prisma.prescription.findMany({
    where: { customerId, deletedAt: null },
    include: { pharmacist: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' },
  });
};

export const getPendingPrescriptions = async () => {
  return prisma.prescription.findMany({
    where: { status: PrescriptionStatus.PENDING, deletedAt: null },
    include: { customer: { select: { id: true, name: true, email: true, phone: true } } },
    orderBy: { createdAt: 'asc' },
  });
};

export const reviewPrescription = async (pharmacistId: string, prescriptionId: string, payload: any) => {
  const prescription = await prisma.prescription.findUnique({
    where: { id: prescriptionId, deletedAt: null },
  });

  if (!prescription) throw new AppError(404, 'Prescription not found.');

  return prisma.prescription.update({
    where: { id: prescriptionId },
    data: {
      pharmacistId,
      status: payload.status,
      pharmacistFeedback: payload.pharmacistFeedback,
    },
  });
};
