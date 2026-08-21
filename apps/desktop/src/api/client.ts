import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:3000';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    // Request interceptor
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response.data,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
        throw error;
      }
    );
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.client.post('/api/v1/auth/login', { email, password });
  }

  async register(email: string, name: string, password: string) {
    return this.client.post('/api/v1/auth/register', { email, name, password });
  }

  async logout() {
    return this.client.post('/api/v1/auth/logout');
  }

  async verifyToken() {
    return this.client.get('/api/v1/auth/verify');
  }

  // Conversation endpoints
  async getConversations() {
    return this.client.get('/api/v1/conversations');
  }

  async createConversation(title?: string) {
    return this.client.post('/api/v1/conversations', { title });
  }

  async getConversation(id: string) {
    return this.client.get(`/api/v1/conversations/${id}`);
  }

  async sendMessage(conversationId: string, content: string) {
    return this.client.post(`/api/v1/conversations/${conversationId}/messages`, {
      content,
    });
  }

  async getMessages(conversationId: string) {
    return this.client.get(`/api/v1/conversations/${conversationId}/messages`);
  }

  // Settings endpoints
  async getSettings() {
    return this.client.get('/api/v1/settings');
  }

  async updateSettings(settings: Record<string, any>) {
    return this.client.patch('/api/v1/settings', settings);
  }

  // Voice endpoints
  async getVoiceConfig() {
    return this.client.get('/api/v1/voice/config');
  }

  async updateVoiceConfig(config: Record<string, any>) {
    return this.client.patch('/api/v1/voice/config', config);
  }

  // Memory endpoints
  async getMemories() {
    return this.client.get('/api/v1/memory');
  }

  async createMemory(category: string, title: string, content: string) {
    return this.client.post('/api/v1/memory', { category, title, content });
  }

  async searchMemories(query: string) {
    return this.client.post('/api/v1/memory/search', { query });
  }

  // Tools endpoints
  async getTools() {
    return this.client.get('/api/v1/tools');
  }

  async executeTool(toolId: string, input: Record<string, any>) {
    return this.client.post(`/api/v1/tools/${toolId}/execute`, { input });
  }

  // Schedule endpoints
  async getSchedules() {
    return this.client.get('/api/v1/schedule');
  }

  async createSchedule(title: string, recurrence?: string) {
    return this.client.post('/api/v1/schedule', { title, recurrence });
  }

  // System endpoints
  async getSystemStatus() {
    return this.client.get('/api/v1/system/status');
  }

  // Health check
  async healthCheck() {
    return this.client.get('/health');
  }
}

export const apiClient = new ApiClient();
