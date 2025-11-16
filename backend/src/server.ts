/**
 * Express Server Entry Point
 * Weather Combat Game Backend API
 */

import express, { Express } from 'express';
import cors from 'cors';
import { env } from './config/env';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

/**
 * Create and configure Express application
 */
function createApp(): Express {
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // CORS configuration
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) {
          return callback(null, true);
        }

        if (env.cors.allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          logger.warn(`CORS blocked origin: ${origin}`);
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
    })
  );

  // Request logging middleware
  app.use((req, res, next) => {
    logger.debug(`${req.method} ${req.path}`);
    next();
  });

  // API routes
  app.use('/api', routes);

  // 404 handler
  app.use(notFoundHandler);

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
}

/**
 * Start the server
 */
function startServer() {
  const app = createApp();

  const server = app.listen(env.port, () => {
    logger.info('='.repeat(50));
    logger.info('🌦️  Weather Combat Game - Backend API');
    logger.info('='.repeat(50));
    logger.info(`Environment: ${env.nodeEnv}`);
    logger.info(`Server running on port: ${env.port}`);
    logger.info(`API endpoint: http://localhost:${env.port}/api`);
    logger.info(`Health check: http://localhost:${env.port}/api/health`);
    logger.info('='.repeat(50));
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully...');
    server.close(() => {
      logger.info('Server closed');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    logger.info('SIGINT received, shutting down gracefully...');
    server.close(() => {
      logger.info('Server closed');
      process.exit(0);
    });
  });

  return server;
}

// Start server if not in test mode
if (!env.isTest) {
  startServer();
}

// Export for testing
export { createApp, startServer };
