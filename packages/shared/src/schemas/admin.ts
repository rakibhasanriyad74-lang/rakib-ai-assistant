import { z } from 'zod';

export const FeatureConfigSchema = z.object({
  enabled: z.boolean(),
  version: z.string(),
  parameters: z.record(z.any()).optional(),
  rolloutPercentage: z.number().min(0).max(100),
});

export const HotFixSchema = z.object({
  id: z.string(),
  enabled: z.boolean(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  description: z.string(),
  affectedModules: z.array(z.string()),
  override: z.record(z.any()),
  createdAt: z.date(),
  expiresAt: z.date().optional(),
});

export const SystemSettingsSchema = z.object({
  maintenanceMode: z.boolean(),
  maintenanceMessage: z.string().optional(),
  apiEndpoint: z.string().url(),
  wsEndpoint: z.string().url(),
  maxRetries: z.number().min(1).max(10),
  retryDelay: z.number().min(100),
  logLevel: z.enum(['debug', 'info', 'warn', 'error']),
});

export const RemoteConfigSchema = z.object({
  id: z.string(),
  version: z.string(),
  lastUpdated: z.date(),
  features: z.record(FeatureConfigSchema),
  prompts: z.record(z.string()),
  hotfixes: z.array(HotFixSchema),
  systemSettings: SystemSettingsSchema,
});

export type FeatureConfig = z.infer<typeof FeatureConfigSchema>;
export type HotFix = z.infer<typeof HotFixSchema>;
export type SystemSettings = z.infer<typeof SystemSettingsSchema>;
export type RemoteConfig = z.infer<typeof RemoteConfigSchema>;
