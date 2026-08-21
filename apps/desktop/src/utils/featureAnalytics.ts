// Feature usage analytics for tracking feature effectiveness
import { logger } from './logger';
import { apiClient } from '@/api/client';

interface FeatureEvent {
  featureName: string;
  action: 'enabled' | 'used' | 'error' | 'disabled';
  metadata?: Record<string, any>;
  timestamp: Date;
}

class FeatureAnalytics {
  private events: FeatureEvent[] = [];
  private maxEvents = 500;
  private syncInterval: NodeJS.Timeout | null = null;
  private syncIntervalMs = 300000; // 5 minutes

  trackEvent(featureName: string, action: 'enabled' | 'used' | 'error' | 'disabled', metadata?: Record<string, any>): void {
    const event: FeatureEvent = {
      featureName,
      action,
      metadata,
      timestamp: new Date(),
    };

    this.events.push(event);
    if (this.events.length > this.maxEvents) {
      this.events.shift();
    }

    logger.debug('Feature event tracked', { featureName, action });
  }

  startSync(): void {
    if (this.syncInterval) return;

    this.syncInterval = setInterval(() => {
      this.sync().catch((error) => {
        logger.error('Failed to sync analytics', error);
      });
    }, this.syncIntervalMs);

    logger.info('Feature analytics sync started');
  }

  stopSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      logger.info('Feature analytics sync stopped');
    }
  }

  async sync(): Promise<void> {
    if (this.events.length === 0) return;

    try {
      logger.info('Syncing feature analytics', { eventCount: this.events.length });
      // TODO: Send to backend for storage
      // await apiClient.post('/api/v1/analytics/events', { events: this.events });
      // this.events = []; // Clear after successful sync
    } catch (error) {
      logger.error('Failed to sync analytics', error);
    }
  }

  getEvents(): FeatureEvent[] {
    return this.events;
  }

  clearEvents(): void {
    this.events = [];
  }
}

export const featureAnalytics = new FeatureAnalytics();
