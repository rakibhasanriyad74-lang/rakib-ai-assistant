import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import cookie from '@fastify/cookie';
import websocket from '@fastify/websocket';
import { logger } from './utils/logger';
import { authRouter } from './routes/auth';
import { conversationRouter } from './routes/conversations';
import { settingsRouter } from './routes/settings';
import { voiceRouter } from './routes/voice';
import { memoryRouter } from './routes/memory';
import { toolsRouter } from './routes/tools';
import { scheduleRouter } from './routes/schedule';
import { systemRouter } from './routes/system';
import { wsHandler } from './websocket/handler';

const port = parseInt(process.env.SERVER_PORT || '3000', 10);
const host = process.env.SERVER_HOST || 'localhost';
const jwtSecret = process.env.JWT_SECRET || 'secret';
const corsOrigin = process.env.SERVER_CORS_ORIGIN || 'http://localhost:5173';

const fastify = Fastify({
  logger: logger,
});

// Register plugins
fastify.register(cors, {
  origin: corsOrigin.split(','),
  credentials: true,
});

fastify.register(cookie);

fastify.register(jwt, {
  secret: jwtSecret,
});

fastify.register(websocket);

// WebSocket handler
fastify.register(async (fastify) => {
  fastify.get('/ws', { websocket: true }, wsHandler);
});

// API Routes
fastify.register(authRouter, { prefix: '/api/v1/auth' });
fastify.register(conversationRouter, { prefix: '/api/v1/conversations' });
fastify.register(settingsRouter, { prefix: '/api/v1/settings' });
fastify.register(voiceRouter, { prefix: '/api/v1/voice' });
fastify.register(memoryRouter, { prefix: '/api/v1/memory' });
fastify.register(toolsRouter, { prefix: '/api/v1/tools' });
fastify.register(scheduleRouter, { prefix: '/api/v1/schedule' });
fastify.register(systemRouter, { prefix: '/api/v1/system' });

// Health check
fastify.get('/health', async (request, reply) => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Error handler
fastify.setErrorHandler((error, request, reply) => {
  logger.error(error);
  reply.status(500).send({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Internal server error',
      requestId: request.id,
    },
    requestId: request.id,
  });
});

// Start server
const start = async () => {
  try {
    await fastify.listen({ port, host });
    logger.info(`Server running at http://${host}:${port}`);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

start();
