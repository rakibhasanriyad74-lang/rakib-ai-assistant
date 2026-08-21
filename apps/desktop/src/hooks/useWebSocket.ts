import { useEffect, useRef, useCallback } from 'react';
import { useSystemStore } from '@/store/system';

interface WebSocketMessage<T = any> {
  type: string;
  requestId: string;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  timestamp: number;
}

const WS_URL = process.env.VITE_WS_URL || 'ws://localhost:3000/ws';

export function useWebSocket() {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const { setConnected, setConnectionMessage } = useSystemStore();
  const messageHandlers = useRef<Map<string, (data: any) => void>>(new Map());

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    try {
      wsRef.current = new WebSocket(WS_URL);

      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        setConnected(true);
        setConnectionMessage('Connected');
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          const handler = messageHandlers.current.get(message.requestId);
          if (handler) {
            handler(message.data);
            messageHandlers.current.delete(message.requestId);
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnected(false);
        setConnectionMessage('Connection error');
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket disconnected');
        setConnected(false);
        setConnectionMessage('Disconnected');
        // Attempt to reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(connect, 3000);
      };
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      setConnected(false);
    }
  }, [setConnected, setConnectionMessage]);

  const send = useCallback(
    (type: string, data?: any, requestId: string = Math.random().toString()): Promise<any> => {
      return new Promise((resolve, reject) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
          reject(new Error('WebSocket not connected'));
          return;
        }

        // Set up handler for response
        if (requestId) {
          messageHandlers.current.set(requestId, resolve);
          // Timeout after 30 seconds
          setTimeout(() => {
            messageHandlers.current.delete(requestId);
            reject(new Error('Request timeout'));
          }, 30000);
        }

        try {
          wsRef.current.send(
            JSON.stringify({
              type,
              data,
              requestId,
              timestamp: Date.now(),
            })
          );
        } catch (error) {
          messageHandlers.current.delete(requestId);
          reject(error);
        }
      });
    },
    []
  );

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setConnected(false);
  }, [setConnected]);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return { send, connect, disconnect, ws: wsRef.current };
}
