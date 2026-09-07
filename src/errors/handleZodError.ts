import { ZodError } from 'zod';

export interface IGenericErrorMessage {
  field: string;
  message: string;
}

export const handleZodError = (error: ZodError) => {
  const errors: IGenericErrorMessage[] = error.issues.map((issue) => ({
    field: String(issue.path[issue.path.length - 1] || 'unknown'),
    message: issue.message,
  }));

  return {
    statusCode: 400,
    message: 'Validation Error',
    errors,
  };
};
