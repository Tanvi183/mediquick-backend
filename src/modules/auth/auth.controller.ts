import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import * as authService from './auth.service';
import { AuthenticatedRequest } from '../../middlewares/auth';

export const register = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.registerUser(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'User registered successfully!',
    data: result,
  });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.loginUser(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Login successful!',
    data: result,
  });
});

export const refresh = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.refreshToken(req.body.refreshToken);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Access token refreshed successfully!',
    data: result,
  });
});

export const changeUserPassword = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const result = await authService.changePassword(req.user!.id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message,
    data: null,
  });
});

export const getMyProfile = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const result = await authService.getMe(req.user!.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User profile retrieved successfully!',
    data: result,
  });
});
