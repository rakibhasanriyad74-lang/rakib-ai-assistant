import { z } from 'zod';

// User schemas
export const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(8),
});

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Message schemas
export const MessageSchema = z.object({
  id: z.string(),
  conversationId: z.string(),
  role: z.enum(['user', 'assistant']),
  content: z.string(),
  createdAt: z.date(),
});

export const CreateMessageSchema = z.object({
  conversationId: z.string(),
  content: z.string().min(1),
});

// Settings schemas
export const SettingsSchema = z.object({
  language: z.enum(['en', 'bn']),
  theme: z.enum(['light', 'dark', 'system']),
  accentColor: z.string(),
  voiceEnabled: z.boolean(),
  voiceLanguage: z.enum(['en', 'bn']),
  voiceGender: z.enum(['male', 'female']),
  speechRate: z.number().min(0.5).max(2.0),
  volume: z.number().min(0).max(1),
});

// Conversation schemas
export const ConversationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateConversationSchema = z.object({
  title: z.string().optional(),
});

// Memory schemas
export const MemorySchema = z.object({
  id: z.string(),
  userId: z.string(),
  category: z.string(),
  title: z.string(),
  content: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateMemorySchema = z.object({
  category: z.string(),
  title: z.string(),
  content: z.string(),
});

// Tool schemas
export const ToolSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  description: z.string(),
  riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  enabled: z.boolean(),
  requiresApproval: z.boolean(),
});

// WebSocket schemas
export const WebSocketMessageSchema = z.object({
  type: z.string(),
  requestId: z.string(),
  data: z.any().optional(),
  error: z.object({
    code: z.string(),
    message: z.string(),
  }).optional(),
  timestamp: z.number(),
});

// API Response schema
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.object({
    code: z.string(),
    message: z.string(),
    requestId: z.string().optional(),
  }).optional(),
  requestId: z.string(),
});

export type CreateUser = z.infer<typeof CreateUserSchema>;
export type User = z.infer<typeof UserSchema>;
export type Message = z.infer<typeof MessageSchema>;
export type CreateMessage = z.infer<typeof CreateMessageSchema>;
export type Settings = z.infer<typeof SettingsSchema>;
export type Conversation = z.infer<typeof ConversationSchema>;
export type CreateConversation = z.infer<typeof CreateConversationSchema>;
export type Memory = z.infer<typeof MemorySchema>;
export type CreateMemory = z.infer<typeof CreateMemorySchema>;
export type WebSocketMessage = z.infer<typeof WebSocketMessageSchema>;
export type ApiResponse = z.infer<typeof ApiResponseSchema>;
