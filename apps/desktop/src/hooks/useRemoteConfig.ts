// Custom hook for remote config
import { useEffect, useCallback } from 'react';
import { useRemoteConfigStore } from '@/store/remoteConfig';
import { getRemoteConfigService } from '@/services/remoteConfigService';
import { logger } from '@/utils/logger';

export interface UseRemoteConfigOptions {
  autoSync?: boolean;
  syncInterval?: number;
}

export function useRemoteConfig(options: UseRemoteConfigOptions = {}) {
  const { autoSync = true, syncInterval = 300000 } = options;
  const store = useRemoteConfigStore();
  const service = getRemoteConfigService();

  // Initialize and sync
  useEffect(() => {
    if (!autoSync) return;

    logger.info('Initializing remote config');
    service.startSync(syncInterval).catch((error) => {
      logger.error('Failed to start sync', { error });
    });

    return () => {
      service.stopSync();
    };
  }, [autoSync, syncInterval, service]);

  // Manual sync
  const manualSync = useCallback(async () => {
    logger.info('Manual sync triggered');
    await service.sync({ force: true });
  }, [service]);

  // Check if feature is enabled
  const isFeatureEnabled = useCallback((featureName: string): boolean => {
    return service.isFeatureEnabled(featureName);
  }, [service]);

  // Get prompt
  const getPrompt = useCallback((promptKey: string): string | undefined => {
    return service.getPrompt(promptKey);
  }, [service]);

  // Get hotfix overrides
  const getHotfixOverrides = useCallback((moduleName: string): Record<string, any> => {
    return service.applyHotfixes(moduleName);
  }, [service]);

  // Check maintenance mode
  const isInMaintenance = useCallback((): boolean => {
    return service.isMaintenanceMode();
  }, [service]);

  return {
    config: store.config,
    isLoading: store.isLoading,
    isSyncing: store.isSyncing,
    lastSyncTime: store.lastSyncTime,
    error: store.error,
    manualSync,
    isFeatureEnabled,
    getPrompt,
    getHotfixOverrides,
    isInMaintenance,
  };
}
