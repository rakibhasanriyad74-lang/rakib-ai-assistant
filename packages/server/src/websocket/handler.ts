import { SocketStream } from '@fastify/websocket';
import { logger } from '../utils/logger';

export async function wsHandler(socket: SocketStream) {
  logger.info('WebSocket client connected');

  socket.on('message', (message: Buffer) => {
    try {
      const data = JSON.parse(message.toString());
      logger.info('WebSocket message received:', data);

      // Echo response
      socket.send(
        JSON.stringify({
          type: 'response',
          requestId: data.requestId,
          data: { received: true },
          timestamp: Date.now(),
        })
      );
    } catch (error) {
      logger.error('WebSocket message error:', error);
      socket.send(
        JSON.stringify({
          type: 'error',
          error: {
            code: 'PARSE_ERROR',
            message: 'Failed to parse message',
          },
          timestamp: Date.now(),
        })
      );
    }
  });

  socket.on('close', () => {
    logger.info('WebSocket client disconnected');
  });

  socket.on('error', (error) => {
    logger.error('WebSocket error:', error);
  });
}
