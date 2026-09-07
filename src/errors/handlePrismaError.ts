import { Prisma } from '@prisma/client';
import { IGenericErrorMessage } from './handleZodError';

export const handlePrismaClientKnownRequestError = (
  error: Prisma.PrismaClientKnownRequestError
) => {
  let statusCode = 400;
  let message = 'Database Error';
  let errors: IGenericErrorMessage[] = [];

  if (error.code === 'P2002') {
    statusCode = 409;
    const target = (error.meta?.target as string[]) || ['field'];
    message = `Duplicate field value: ${target.join(', ')}`;
    errors = target.map((field) => ({
      field,
      message: `${field} already exists.`,
    }));
  } else if (error.code === 'P2025') {
    statusCode = 404;
    message = (error.meta?.cause as string) || 'Record not found in database.';
    errors = [{ field: '', message }];
  } else if (error.code === 'P2003') {
    statusCode = 400;
    message = 'Foreign key constraint violated.';
    errors = [{ field: (error.meta?.field_name as string) || '', message }];
  }

  return { statusCode, message, errors };
};
