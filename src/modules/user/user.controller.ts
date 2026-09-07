import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { pick } from '../../utils/pick';
import { paginationFields } from '../../constants/pagination';
import * as userService from './user.service';
import { AuthenticatedRequest } from '../../middlewares/auth';

export const getUsers = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ['search', 'role', 'status']);
  const pagination = pick(req.query, paginationFields);
  const result = await userService.getAllUsers(filters, pagination);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Users retrieved successfully!',
    meta: result.meta,
    data: result.data,
  });
});

export const updateRole = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.updateUserRole(req.params.id as string, req.body.role);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User role updated successfully!',
    data: result,
  });
});

export const updateStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.updateUserStatus(req.params.id as string, req.body.status);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User status updated successfully!',
    data: result,
  });
});

export const updateMyProfile = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const result = await userService.updateProfile(req.user!.id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Profile updated successfully!',
    data: result,
  });
});
