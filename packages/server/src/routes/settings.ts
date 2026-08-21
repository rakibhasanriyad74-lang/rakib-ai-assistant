import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { logger } from '../utils/logger';

export async function settingsRouter(fastify: FastifyInstance) {
  // Get settings
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    logger.info('Get settings');
    return {
      success: true,
      data: {
        language: 'en',
        theme: 'dark',
        accentColor: '#3b82f6',
      },
      requestId: request.id,
    };
  });

  // Update settings
  fastify.patch('/', async (request: FastifyRequest, reply: FastifyReply) => {
    logger.info('Update settings');
    return {
      success: true,
      data: { updated: true },
      requestId: request.id,
    };
  });
}
