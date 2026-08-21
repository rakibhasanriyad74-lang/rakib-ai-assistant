// Global error handler and recovery system
import { logger } from './logger';
import { useSystemStore } from '@/store/system';
import toast from 'react-hot-toast';

interface ErrorHandler {
  id: string;
  condition: (error: any) => boolean;
  handler: (error: any) => void;
  priority: number;
}

class ErrorRecoverySystem {
  private handlers: ErrorHandler[] = [];
  private errorHistory: Array<{ error: any; timestamp: Date; handled: boolean }> = [];
  private maxHistorySize = 100;

  registerHandler(id: string, condition: (error: any) => boolean, handler: (error: any) => void, priority = 0): void {
    this.handlers.push({ id, condition, handler, priority });
    // Sort by priority (higher priority first)
    this.handlers.sort((a, b) => b.priority - a.priority);
    logger.info('Registered error handler', { id, priority });
  }

  unregisterHandler(id: string): void {
    this.handlers = this.handlers.filter((h) => h.id !== id);
    logger.info('Unregistered error handler', { id });
  }

  async handleError(error: any): Promise<void> {
    logger.error('Error occurred', error);

    // Add to history
    this.errorHistory.push({ error, timestamp: new Date(), handled: false });
    if (this.errorHistory.length > this.maxHistorySize) {
      this.errorHistory.shift();
    }

    // Try registered handlers
    for (const handler of this.handlers) {
      if (handler.condition(error)) {
        try {
          logger.info('Applying error handler', { handlerId: handler.id });
          await Promise.resolve(handler.handler(error));
          this.errorHistory[this.errorHistory.length - 1].handled = true;
          return;
        } catch (handlerError) {
          logger.error('Error handler failed', handlerError);
        }
      }
    }

    // Default handling
    const message = error instanceof Error ? error.message : String(error);
    toast.error(`Error: ${message}`);
    useSystemStore.getState().setStatus('ERROR');
  }

  getErrorHistory() {
    return this.errorHistory;
  }

  clearErrorHistory() {
    this.errorHistory = [];
  }
}

export const errorRecoverySystem = new ErrorRecoverySystem();

// Register default handlers
errorRecoverySystem.registerHandler(
  'network-error',
  (error) => error?.code === 'ECONNREFUSED' || error?.message?.includes('network'),
  (error) => {
    logger.warn('Network error detected, attempting reconnection');
    useSystemStore.getState().setStatus('CONNECTING');
  },
  10
);

errorRecoverySystem.registerHandler(
  'auth-error',
  (error) => error?.status === 401,
  (error) => {
    logger.warn('Authentication error, redirecting to login');
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  },
  9
);

errorRecoverySystem.registerHandler(
  'maintenance-mode',
  (error) => error?.data?.maintenanceMode === true,
  (error) => {
    logger.warn('Server in maintenance mode');
    toast.info(error?.data?.maintenanceMessage || 'Server is under maintenance');
    useSystemStore.getState().setStatus('OFFLINE');
  },
  8
);
