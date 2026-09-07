import { Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { pick } from '../../utils/pick';
import { paginationFields } from '../../constants/pagination';
import * as orderService from './order.service';
import { AuthenticatedRequest } from '../../middlewares/auth';

export const createOrder = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const result = await orderService.createOrder(req.user!.id, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Order created successfully!',
    data: result,
  });
});

export const getMyOrders = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const pagination = pick(req.query, paginationFields);
  const result = await orderService.getMyOrders(req.user!.id, pagination);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Order history retrieved successfully!',
    meta: result.meta,
    data: result.data,
  });
});

export const getAllOrders = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const pagination = pick(req.query, paginationFields);
  const result = await orderService.getAllOrders(pagination);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All platform orders retrieved successfully!',
    meta: result.meta,
    data: result.data,
  });
});

export const getOrder = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const result = await orderService.getOrderById(req.params.id as string, req.user!);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Order details and invoice retrieved!',
    data: result,
  });
});

export const updateStatus = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const result = await orderService.updateOrderStatus(req.params.id as string, req.body.status);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Order status updated to ${req.body.status}!`,
    data: result,
  });
});
