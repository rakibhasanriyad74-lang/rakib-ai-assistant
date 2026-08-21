import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { logger } from '../utils/logger';

export async function systemRouter(fastify: FastifyInstance) {
  // Get system status
  fastify.get('/status', async (request: FastifyRequest, reply: FastifyReply) => {
    logger.info('Get system status');
    return {
      success: true,
      data: {
        status: 'ONLINE',
        connectionState: 'connected',
        voiceState: 'ready',
      },
      requestId: request.id,
    };
  });
}
