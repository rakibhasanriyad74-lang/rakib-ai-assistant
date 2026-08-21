// Remote config management service
export interface RemoteConfig {
  id: string;
  version: string;
  lastUpdated: Date;
  features: Record<string, FeatureConfig>;
  prompts: Record<string, string>;
  hotfixes: HotFix[];
  systemSettings: SystemSettings;
}

export interface FeatureConfig {
  enabled: boolean;
  version: string;
  parameters?: Record<string, any>;
  rolloutPercentage: number; // 0-100 for gradual rollout
}

export interface HotFix {
  id: string;
  enabled: boolean;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  affectedModules: string[];
  override: Record<string, any>; // Configuration to override
  createdAt: Date;
  expiresAt?: Date;
}

export interface SystemSettings {
  maintenanceMode: boolean;
  maintenanceMessage?: string;
  apiEndpoint: string;
  wsEndpoint: string;
  maxRetries: number;
  retryDelay: number;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

export interface AdminPanelConfig {
  adminToken: string;
  adminEndpoint: string;
  syncInterval: number; // ms
  cacheExpiry: number; // ms
  enableRemoteOverride: boolean;
}
