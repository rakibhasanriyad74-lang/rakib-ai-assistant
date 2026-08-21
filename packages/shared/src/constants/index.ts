export const AI_STATES = {
  IDLE: 'idle',
  READY: 'ready',
  LISTENING: 'listening',
  THINKING: 'thinking',
  SPEAKING: 'speaking',
  PROCESSING: 'processing',
  ERROR: 'error',
  OFFLINE: 'offline',
} as const;

export const SYSTEM_STATUS = {
  ONLINE: 'ONLINE',
  OFFLINE: 'OFFLINE',
  CONNECTING: 'CONNECTING',
  DEGRADED: 'DEGRADED',
  ERROR: 'ERROR',
} as const;

export const RISK_LEVELS = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
} as const;

export const LANGUAGES = {
  ENGLISH: 'en',
  BANGLA: 'bn',
} as const;

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

export const VOICE_GENDERS = {
  MALE: 'male',
  FEMALE: 'female',
} as const;

export const API_VERSIONS = {
  V1: '/api/v1',
} as const;

export const ENDPOINTS = {
  AUTH: '/auth',
  CONVERSATIONS: '/conversations',
  MESSAGES: '/messages',
  MEMORY: '/memory',
  SETTINGS: '/settings',
  PROVIDERS: '/providers',
  VOICE: '/voice',
  TOOLS: '/tools',
  SCHEDULE: '/schedule',
  SYSTEM: '/system',
} as const;
