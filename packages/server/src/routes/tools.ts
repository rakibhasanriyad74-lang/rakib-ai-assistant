import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { logger } from '../utils/logger';

export async function toolsRouter(fastify: FastifyInstance) {
  // List tools
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    logger.info('List tools');
    return {
      success: true,
      data: [],
      requestId: request.id,
    };
  });

  // Execute tool
  fastify.post('/:toolId/execute', async (request: FastifyRequest, reply: FastifyReply) => {
    logger.info('Execute tool');
    return {
      success: true,
      data: { id: 'exec_1' },
      requestId: request.id,
    };
  });
}
