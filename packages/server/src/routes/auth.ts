import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { logger } from '../utils/logger';

export async function authRouter(fastify: FastifyInstance) {
  // Login
  fastify.post('/login', async (request: FastifyRequest, reply: FastifyReply) => {
    logger.info('Login route');
    return {
      success: true,
      message: 'Login endpoint',
      requestId: request.id,
    };
  });

  // Register
  fastify.post('/register', async (request: FastifyRequest, reply: FastifyReply) => {
    logger.info('Register route');
    return {
      success: true,
      message: 'Register endpoint',
      requestId: request.id,
    };
  });

  // Logout
  fastify.post('/logout', async (request: FastifyRequest, reply: FastifyReply) => {
    logger.info('Logout route');
    return {
      success: true,
      message: 'Logout endpoint',
      requestId: request.id,
    };
  });

  // Verify token
  fastify.get('/verify', async (request: FastifyRequest, reply: FastifyReply) => {
    logger.info('Verify route');
    return {
      success: true,
      message: 'Verify endpoint',
      requestId: request.id,
    };
  });
}
