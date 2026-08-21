// Remote configuration synchronization service
import axios, { AxiosInstance } from 'axios';
import { RemoteConfig, HotFix } from '@rakib/shared';
import { logger } from '@/utils/logger';
import { useRemoteConfigStore } from '@/store/remoteConfig';

interface SyncOptions {
  force?: boolean;
  timeout?: number;
}

export class RemoteConfigService {
  private client: AxiosInstance;
  private syncInterval: NodeJS.Timeout | null = null;
  private syncInProgress = false;
  private lastSyncTime = 0;
  private syncInterval_ms = 300000; // 5 minutes default

  constructor(
    private adminEndpoint: string,
    private adminToken: string,
    private cacheExpiry: number = 600000 // 10 minutes
  ) {
    this.client = axios.create({
      baseURL: adminEndpoint,
      timeout: 10000,
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Start automatic synchronization
   */
  async startSync(interval: number = this.syncInterval_ms): Promise<void> {
    this.syncInterval_ms = interval;
    logger.info('Starting remote config sync', { interval });

    // Initial sync
    await this.sync({ force: true });

    // Set up recurring sync
    this.syncInterval = setInterval(() => {
      this.sync().catch((error) => {
        logger.error('Sync error in interval', { error });
      });
    }, interval);
  }

  /**
   * Stop automatic synchronization
   */
  stopSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      logger.info('Stopped remote config sync');
    }
  }

  /**
   * Synchronize configuration from remote server
   */
  async sync(options: SyncOptions = {}): Promise<RemoteConfig | null> {
    const { force = false, timeout = 10000 } = options;

    // Check if sync is already in progress
    if (this.syncInProgress && !force) {
      return useRemoteConfigStore.getState().config;
    }

    // Check cache expiry
    const timeSinceLastSync = Date.now() - this.lastSyncTime;
    if (timeSinceLastSync < this.cacheExpiry && !force) {
      logger.debug('Using cached config', { timeSinceLastSync });
      return useRemoteConfigStore.getState().config;
    }

    this.syncInProgress = true;
    const store = useRemoteConfigStore.getState();
    store.setSyncing(true);

    try {
      logger.info('Syncing remote config');

      const response = await Promise.race([
        this.client.get<RemoteConfig>('/config'),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Sync timeout')), timeout)
        ),
      ]);

      const config = response.data;
      store.setConfig(config);
      store.setError(null);
      store.setLastSyncTime(new Date());
      this.lastSyncTime = Date.now();

      logger.info('Config synced successfully', {
        version: config.version,
        featureCount: Object.keys(config.features).length,
        hotfixCount: config.hotfixes.length,
      });

      return config;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('Failed to sync remote config', { error: errorMessage });
      store.setError(errorMessage);
      return null;
    } finally {
      this.syncInProgress = false;
      store.setSyncing(false);
    }
  }

  /**
   * Get current cached configuration
   */
  getConfig(): RemoteConfig | null {
    return useRemoteConfigStore.getState().config;
  }

  /**
   * Check if a feature is enabled
   */
  isFeatureEnabled(featureName: string): boolean {
    return useRemoteConfigStore.getState().getFeatureStatus(featureName);
  }

  /**
   * Get a prompt from remote config
   */
  getPrompt(promptKey: string): string | undefined {
    return useRemoteConfigStore.getState().getPrompt(promptKey);
  }

  /**
   * Apply hotfixes for a specific module
   */
  applyHotfixes(moduleName: string): Record<string, any> {
    const store = useRemoteConfigStore.getState();
    const config = store.config;

    if (!config) return {};

    const overrides: Record<string, any> = {};

    // Collect all applicable hotfixes
    config.hotfixes.forEach((hotfix) => {
      if (
        hotfix.enabled &&
        hotfix.affectedModules.includes(moduleName) &&
        (!hotfix.expiresAt || new Date() < hotfix.expiresAt)
      ) {
        Object.assign(overrides, hotfix.override);
        logger.debug('Applied hotfix', { hotfixId: hotfix.id, moduleName });
      }
    });

    return overrides;
  }

  /**
   * Check system maintenance mode
   */
  isMaintenanceMode(): boolean {
    return useRemoteConfigStore.getState().config?.systemSettings.maintenanceMode || false;
  }

  /**
   * Get maintenance message
   */
  getMaintenanceMessage(): string | undefined {
    return useRemoteConfigStore.getState().config?.systemSettings.maintenanceMessage;
  }

  /**
   * Get system settings
   */
  getSystemSettings() {
    return useRemoteConfigStore.getState().config?.systemSettings;
  }

  /**
   * Report hotfix effectiveness (telemetry)
   */
  async reportHotfixStatus(hotfixId: string, status: 'success' | 'failure', details?: any): Promise<void> {
    try {
      await this.client.post('/hotfixes/report', {
        hotfixId,
        status,
        details,
        timestamp: new Date(),
      });
    } catch (error) {
      logger.error('Failed to report hotfix status', { error });
    }
  }
}

// Singleton instance
let remoteConfigService: RemoteConfigService | null = null;

export function getRemoteConfigService(): RemoteConfigService {
  if (!remoteConfigService) {
    const adminEndpoint = process.env.VITE_ADMIN_ENDPOINT || 'http://localhost:3001/api/v1/admin';
    const adminToken = localStorage.getItem('adminToken') || '';
    remoteConfigService = new RemoteConfigService(adminEndpoint, adminToken);
  }
  return remoteConfigService;
}

export function setRemoteConfigService(service: RemoteConfigService): void {
  remoteConfigService = service;
}
