import { Server } from 'http';
import app from './app';
import { config } from './config';

let server: Server;

async function bootstrap() {
  try {
    server = app.listen(config.port, () => {
      console.log(`🚀 [MediQuick API]: Server running on port ${config.port} (${config.env})`);
      console.log(`🔗 Health Check: ${config.appUrl}/health`);
      console.log(`📡 API Base: ${config.appUrl}/api/v1`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }

  const exitHandler = () => {
    if (server) {
      server.close(() => {
        console.log('Server gracefully closed.');
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  };

  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception detected:', error);
    exitHandler();
  });

  process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection detected:', error);
    exitHandler();
  });
}

bootstrap();
