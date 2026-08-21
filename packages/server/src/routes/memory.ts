import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { logger } from '../utils/logger';

export async function memoryRouter(fastify: FastifyInstance) {
  // List memories
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    logger.info('List memories');
    return {
      success: true,
      data: [],
      requestId: request.id,
    };
  });

  // Create memory
  fastify.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    logger.info('Create memory');
    return {
      success: true,
      data: { id: 'mem_1' },
      requestId: request.id,
    };
  });

  // Search memories
  fastify.post('/search', async (request: FastifyRequest, reply: FastifyReply) => {
    logger.info('Search memories');
    return {
      success: true,
      data: [],
      requestId: request.id,
    };
  });
}
