import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { logger } from '../utils/logger';

export async function voiceRouter(fastify: FastifyInstance) {
  // Get voice configuration
  fastify.get('/config', async (request: FastifyRequest, reply: FastifyReply) => {
    logger.info('Get voice config');
    return {
      success: true,
      data: {
        language: 'en',
        voiceId: 'voice_1',
        gender: 'male',
      },
      requestId: request.id,
    };
  });

  // Update voice configuration
  fastify.patch('/config', async (request: FastifyRequest, reply: FastifyReply) => {
    logger.info('Update voice config');
    return {
      success: true,
      data: { updated: true },
      requestId: request.id,
    };
  });
}
