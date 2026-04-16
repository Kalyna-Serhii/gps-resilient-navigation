import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';

import swaggerSpec from './docs/openapi.js';
import basicAuth from './middlewares/basicAuth.js';
import { alertRouter, authRouter, geocodeRouter, routeRouter, userRouter } from './routes/index.js';
import { errorHandler } from './utils/errorHandler.js';
import logger from './utils/logger.js';

const app = express();

app.use(
  cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization, X-Signature',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  }),
);

// Swagger docs
app.use(
  '/api-docs',
  basicAuth,
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      defaultModelsExpandDepth: -1,
      defaultModelExpandDepth: -1,
      docExpansion: 'none',
    },
  }),
);

app.use((req, res, next) => {
  const startTime = Date.now();
  const originalSend = res.send;

  logger.info(
    {
      method: req.method,
      url: req.url,
      query: req.query,
      body: req.method !== 'GET' ? req.body : undefined,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    },
    'Incoming Request',
  );

  res.send = function (data) {
    const duration = Date.now() - startTime;

    let safeBody;
    try {
      safeBody = typeof data === 'string' ? data : JSON.stringify(data);
    } catch (e) {
      safeBody = '[Unserializable Response]';
    }

    logger.info(
      {
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
      },
      `Response ${res.statusCode}`,
    );

    if (res.statusCode >= 400) {
      logger.error(
        {
          method: req.method,
          url: req.url,
          statusCode: res.statusCode,
          duration: `${duration}ms`,
          responseBody: safeBody,
        },
        `Error Response ${res.statusCode}`,
      );
    }

    return originalSend.call(this, data);
  };

  next();
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static files

// Routes
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/routes', routeRouter);
app.use('/api/geocode', geocodeRouter);
app.use('/api/alerts', alertRouter);

// Health
app.use('/health', (req, res) => res.status(200).json({ status: 'ok' }));

// 404 handler
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// Global error handler
app.use(errorHandler);

export default app;
