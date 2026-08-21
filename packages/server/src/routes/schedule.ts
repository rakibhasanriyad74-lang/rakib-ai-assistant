import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { logger } from '../utils/logger';

export async function scheduleRouter(fastify: FastifyInstance) {
  // List schedules
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    logger.info('List schedules');
    return {
      success: true,
      data: [],
      requestId: request.id,
    };
  });

  // Create schedule
  fastify.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    logger.info('Create schedule');
    return {
      success: true,
      data: { id: 'sched_1' },
      requestId: request.id,
    };
  });
}
