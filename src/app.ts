import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import { applicationRoutes } from './routes';
import { globalErrorHandler } from './errors/globalErrorHandler';
import { notFound } from './middlewares/notFound';
import { apiLimiter } from './middlewares/rateLimiter';

const app: Application = express();

// Security Middlewares
app.use(helmet());
app.use(cors({ origin: [config.clientUrl, 'http://localhost:3000'], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(apiLimiter);

// Health Check Endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: '🏥 MediQuick RESTful API Server is live and healthy!',
    timestamp: new Date().toISOString(),
    environment: config.env,
  });
});

// Application Routes (Version 1)
app.use('/api/v1', applicationRoutes);

// Global Error Handler & 404
app.use(globalErrorHandler);
app.use(notFound);

export default app;
