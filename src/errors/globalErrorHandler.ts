import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { AppError } from './AppError';
import { handleZodError, IGenericErrorMessage } from './handleZodError';
import { handlePrismaClientKnownRequestError } from './handlePrismaError';
import { config } from '../config';

export const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = 'Something went wrong!';
  let errors: IGenericErrorMessage[] = [];

  if (err instanceof ZodError) {
    const simplified = handleZodError(err);
    statusCode = simplified.statusCode;
    message = simplified.message;
    errors = simplified.errors;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const simplified = handlePrismaClientKnownRequestError(err);
    statusCode = simplified.statusCode;
    message = simplified.message;
    errors = simplified.errors;
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = [{ field: '', message: err.message }];
  } else if (err instanceof Error) {
    message = err.message;
    errors = [{ field: '', message: err.message }];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
    ...(config.env === 'development' && { stack: err?.stack }),
  });
};
