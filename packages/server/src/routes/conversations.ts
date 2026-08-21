import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { logger } from '../utils/logger';

export async function conversationRouter(fastify: FastifyInstance) {
  // List conversations
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    logger.info('List conversations');
    return {
      success: true,
      data: [],
      requestId: request.id,
    };
  });

  // Create conversation
  fastify.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    logger.info('Create conversation');
    return {
      success: true,
      data: { id: 'conv_1' },
      requestId: request.id,
    };
  });

  // Get conversation
  fastify.get('/:conversationId', async (request: FastifyRequest, reply: FastifyReply) => {
    logger.info('Get conversation');
    return {
      success: true,
      data: { id: (request.params as any).conversationId },
      requestId: request.id,
    };
  });

  // Send message
  fastify.post('/:conversationId/messages', async (request: FastifyRequest, reply: FastifyReply) => {
    logger.info('Send message');
    return {
      success: true,
      data: { id: 'msg_1' },
      requestId: request.id,
    };
  });

  // Get messages
  fastify.get('/:conversationId/messages', async (request: FastifyRequest, reply: FastifyReply) => {
    logger.info('Get messages');
    return {
      success: true,
      data: [],
      requestId: request.id,
    };
  });
}
