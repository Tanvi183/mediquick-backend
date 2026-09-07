import { Request, Response } from 'express';

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `API Endpoint Not Found: ${req.method} ${req.originalUrl}`,
    errors: [
      {
        field: req.originalUrl,
        message: 'The requested route does not exist on this server.',
      },
    ],
  });
};
