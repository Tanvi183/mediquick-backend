import { Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import * as paymentService from './payment.service';
import { AuthenticatedRequest } from '../../middlewares/auth';

export const initiate = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const result = await paymentService.initiateCheckout(req.user!.id, req.body.orderId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Stripe checkout session initiated!',
    data: result,
  });
});

export const verify = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const result = await paymentService.verifyPaymentSession(req.body.sessionId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Payment verified and order marked as PAID successfully!',
    data: result,
  });
});

export const getStatus = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const result = await paymentService.getPaymentStatus(req.params.orderId as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Payment status retrieved!',
    data: result,
  });
});
