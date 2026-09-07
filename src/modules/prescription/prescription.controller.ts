import { Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import * as prescriptionService from './prescription.service';
import { AuthenticatedRequest } from '../../middlewares/auth';

export const upload = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const result = await prescriptionService.uploadPrescription(req.user!.id, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Prescription uploaded successfully for pharmacist verification!',
    data: result,
  });
});

export const getMyList = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const result = await prescriptionService.getMyPrescriptions(req.user!.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'My prescriptions retrieved successfully!',
    data: result,
  });
});

export const getPendingQueue = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const result = await prescriptionService.getPendingPrescriptions();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Pending prescription verification queue retrieved!',
    data: result,
  });
});

export const review = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const result = await prescriptionService.reviewPrescription(req.user!.id, req.params.id as string, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Prescription status updated to ${req.body.status}!`,
    data: result,
  });
});
