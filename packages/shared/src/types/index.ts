// User & Auth
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

// AI & Conversation
export interface Conversation {
  id: string;
  userId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

export type AIState = 
  | 'idle'
  | 'ready'
  | 'listening'
  | 'thinking'
  | 'speaking'
  | 'processing'
  | 'error'
  | 'offline';

// Settings
export interface Settings {
  id: string;
  userId: string;
  language: 'en' | 'bn';
  theme: 'light' | 'dark' | 'system';
  accentColor: string;
  voiceEnabled: boolean;
  voiceLanguage: 'en' | 'bn';
  voiceGender: 'male' | 'female';
  speechRate: number;
  volume: number;
  createdAt: Date;
  updatedAt: Date;
}

// Voice
export interface VoiceConfiguration {
  id: string;
  userId: string;
  language: 'en' | 'bn';
  voiceId: string;
  gender: 'male' | 'female';
  provider: string;
  speechRate: number;
  pitch?: number;
  volume: number;
  interruptionEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Memory
export interface Memory {
  id: string;
  userId: string;
  category: string;
  title: string;
  content: string;
  embedding?: number[];
  createdAt: Date;
  updatedAt: Date;
}

// AI Provider
export interface AIProvider {
  id: string;
  userId: string;
  name: 'openai' | 'anthropic' | 'google';
  apiKey: string; // encrypted
  isConfigured: boolean;
  connectedAt?: Date;
  lastTestedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AIModel {
  id: string;
  provider: string;
  name: string;
  displayName: string;
  capabilities: string[];
}

// Tools
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Tool {
  id: string;
  userId: string;
  name: string;
  description: string;
  capability: string;
  riskLevel: RiskLevel;
  enabled: boolean;
  requiresApproval: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ToolExecution {
  id: string;
  userId: string;
  toolId: string;
  status: 'pending' | 'approved' | 'denied' | 'executing' | 'completed' | 'failed';
  input: Record<string, any>;
  output?: Record<string, any>;
  error?: string;
  executedAt?: Date;
  createdAt: Date;
}

// Schedule
export interface Schedule {
  id: string;
  userId: string;
  title: string;
  description?: string;
  enabled: boolean;
  recurrence?: string;
  nextExecution: Date;
  lastExecution?: Date;
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
}

// System Status
export type SystemStatus = 'ONLINE' | 'OFFLINE' | 'CONNECTING' | 'DEGRADED' | 'ERROR';

export interface SystemState {
  status: SystemStatus;
  connectionState: 'connected' | 'disconnected' | 'reconnecting';
  voiceState: 'ready' | 'listening' | 'processing' | 'speaking' | 'error';
}

// WebSocket Events
export interface WebSocketMessage<T = any> {
  type: string;
  requestId: string;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  timestamp: number;
}

// API Response
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    requestId?: string;
  };
  requestId: string;
}
