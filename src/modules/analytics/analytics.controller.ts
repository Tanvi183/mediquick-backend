import { Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import * as analyticsService from './analytics.service';
import { AuthenticatedRequest } from '../../middlewares/auth';

export const getStats = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const result = await analyticsService.getDashboardStats();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Platform statistics and metrics retrieved successfully!',
    data: result,
  });
});
