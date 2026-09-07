import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { pick } from '../../utils/pick';
import { paginationFields } from '../../constants/pagination';
import * as medicineService from './medicine.service';
import { AuthenticatedRequest } from '../../middlewares/auth';

export const createMedicine = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const result = await medicineService.createMedicine(req.user!.id, req.user!.role, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Medicine added to catalog successfully!',
    data: result,
  });
});

export const getAllMedicines = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ['search', 'categoryId', 'requiresPrescription', 'minPrice', 'maxPrice']);
  const pagination = pick(req.query, paginationFields);
  const result = await medicineService.getAllMedicines(filters, pagination);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Medicines retrieved successfully!',
    meta: result.meta,
    data: result.data,
  });
});

export const getMedicine = catchAsync(async (req: Request, res: Response) => {
  const result = await medicineService.getMedicineById(req.params.id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Medicine details retrieved successfully!',
    data: result,
  });
});

export const updateMedicine = catchAsync(async (req: Request, res: Response) => {
  const result = await medicineService.updateMedicine(req.params.id as string, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Medicine updated successfully!',
    data: result,
  });
});

export const deleteMedicine = catchAsync(async (req: Request, res: Response) => {
  const result = await medicineService.deleteMedicine(req.params.id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Medicine soft-deleted successfully!',
    data: result,
  });
});
