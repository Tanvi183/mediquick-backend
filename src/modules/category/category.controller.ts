import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import * as categoryService from './category.service';

export const createCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryService.createCategory(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Category created successfully!',
    data: result,
  });
});

export const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryService.getCategories();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Categories retrieved successfully!',
    data: result,
  });
});

export const getCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryService.getCategoryById(req.params.id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Category retrieved successfully!',
    data: result,
  });
});

export const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryService.updateCategory(req.params.id as string, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Category updated successfully!',
    data: result,
  });
});

export const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryService.deleteCategory(req.params.id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Category soft-deleted successfully!',
    data: result,
  });
});
