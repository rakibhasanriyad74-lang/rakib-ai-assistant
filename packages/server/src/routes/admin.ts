import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { logger } from '../utils/logger';
import { RemoteConfig, HotFix } from '@rakib/shared';

// In-memory storage (replace with database in production)
let remoteConfig: RemoteConfig = {
  id: 'config-v1',
  version: '1.0.0',
  lastUpdated: new Date(),
  features: {
    voiceInput: {
      enabled: true,
      version: '1.0.0',
      rolloutPercentage: 100,
    },
    memorySystem: {
      enabled: true,
      version: '1.0.0',
      rolloutPercentage: 100,
    },
    toolExecution: {
      enabled: true,
      version: '1.0.0',
      rolloutPercentage: 80,
    },
    scheduleManagement: {
      enabled: false,
      version: '1.0.0',
      rolloutPercentage: 0,
    },
  },
  prompts: {
    greeting: 'Hello! I\'m RAKIB, your personal AI assistant.',
    farewell: 'Goodbye! Have a great day!',
  },
  hotfixes: [],
  systemSettings: {
    maintenanceMode: false,
    apiEndpoint: 'http://localhost:3000',
    wsEndpoint: 'ws://localhost:3000/ws',
    maxRetries: 3,
    retryDelay: 1000,
    logLevel: 'info',
  },
};

export async function adminRouter(fastify: FastifyInstance) {
  // Middleware: Verify admin token
  fastify.addHook('preHandler', async (request, reply) => {
    const token = request.headers.authorization?.split(' ')[1];
    const adminToken = process.env.ADMIN_TOKEN || 'admin-secret-token';
    
    if (token !== adminToken) {
      reply.status(401).send({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid admin token',
          requestId: request.id,
        },
        requestId: request.id,
      });
    }
  });

  // GET /admin/config - Get current remote configuration
  fastify.get('/config', async (request: FastifyRequest, reply: FastifyReply) => {
    logger.info('Admin: Get config');
    return {
      success: true,
      data: remoteConfig,
      requestId: request.id,
    };
  });

  // POST /admin/config - Update remote configuration
  fastify.post('/config', async (request: FastifyRequest, reply: FastifyReply) => {
    const { version, features, prompts, hotfixes, systemSettings } = request.body as any;

    logger.info('Admin: Update config', { version });

    remoteConfig = {
      ...remoteConfig,
      ...(version && { version }),
      ...(features && { features: { ...remoteConfig.features, ...features } }),
      ...(prompts && { prompts: { ...remoteConfig.prompts, ...prompts } }),
      ...(hotfixes && { hotfixes }),
      ...(systemSettings && { systemSettings: { ...remoteConfig.systemSettings, ...systemSettings } }),
      lastUpdated: new Date(),
    };

    return {
      success: true,
      data: remoteConfig,
      requestId: request.id,
    };
  });

  // POST /admin/features/:name - Toggle feature flag
  fastify.post('/features/:name', async (request: FastifyRequest, reply: FastifyReply) => {
    const { name } = request.params as { name: string };
    const { enabled, rolloutPercentage } = request.body as any;

    logger.info('Admin: Update feature', { name, enabled, rolloutPercentage });

    if (!remoteConfig.features[name]) {
      remoteConfig.features[name] = {
        enabled: true,
        version: '1.0.0',
        rolloutPercentage: 100,
      };
    }

    if (enabled !== undefined) remoteConfig.features[name].enabled = enabled;
    if (rolloutPercentage !== undefined) remoteConfig.features[name].rolloutPercentage = rolloutPercentage;
    remoteConfig.lastUpdated = new Date();

    return {
      success: true,
      data: remoteConfig.features[name],
      requestId: request.id,
    };
  });

  // POST /admin/hotfixes - Create new hotfix
  fastify.post('/hotfixes', async (request: FastifyRequest, reply: FastifyReply) => {
    const { priority, description, affectedModules, override } = request.body as any;

    logger.info('Admin: Create hotfix', { priority, description });

    const hotfix: HotFix = {
      id: `hotfix-${Date.now()}`,
      enabled: true,
      priority,
      description,
      affectedModules,
      override,
      createdAt: new Date(),
    };

    remoteConfig.hotfixes.push(hotfix);
    remoteConfig.lastUpdated = new Date();

    return {
      success: true,
      data: hotfix,
      requestId: request.id,
    };
  });

  // DELETE /admin/hotfixes/:id - Delete hotfix
  fastify.delete('/hotfixes/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };

    logger.info('Admin: Delete hotfix', { id });

    const index = remoteConfig.hotfixes.findIndex((hf) => hf.id === id);
    if (index === -1) {
      return reply.status(404).send({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Hotfix not found',
          requestId: request.id,
        },
        requestId: request.id,
      });
    }

    remoteConfig.hotfixes.splice(index, 1);
    remoteConfig.lastUpdated = new Date();

    return {
      success: true,
      data: { deleted: true },
      requestId: request.id,
    };
  });

  // PATCH /admin/hotfixes/:id - Update hotfix
  fastify.patch('/hotfixes/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const { enabled, description, priority, override } = request.body as any;

    logger.info('Admin: Update hotfix', { id });

    const hotfix = remoteConfig.hotfixes.find((hf) => hf.id === id);
    if (!hotfix) {
      return reply.status(404).send({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Hotfix not found',
          requestId: request.id,
        },
        requestId: request.id,
      });
    }

    if (enabled !== undefined) hotfix.enabled = enabled;
    if (description) hotfix.description = description;
    if (priority) hotfix.priority = priority;
    if (override) hotfix.override = override;
    remoteConfig.lastUpdated = new Date();

    return {
      success: true,
      data: hotfix,
      requestId: request.id,
    };
  });

  // PATCH /admin/prompts/:key - Update prompt
  fastify.patch('/prompts/:key', async (request: FastifyRequest, reply: FastifyReply) => {
    const { key } = request.params as { key: string };
    const { content } = request.body as any;

    logger.info('Admin: Update prompt', { key });

    remoteConfig.prompts[key] = content;
    remoteConfig.lastUpdated = new Date();

    return {
      success: true,
      data: { key, content },
      requestId: request.id,
    };
  });

  // PATCH /admin/system-settings - Update system settings
  fastify.patch('/system-settings', async (request: FastifyRequest, reply: FastifyReply) => {
    const settings = request.body as any;

    logger.info('Admin: Update system settings');

    remoteConfig.systemSettings = {
      ...remoteConfig.systemSettings,
      ...settings,
    };
    remoteConfig.lastUpdated = new Date();

    return {
      success: true,
      data: remoteConfig.systemSettings,
      requestId: request.id,
    };
  });

  // POST /admin/hotfixes/report - Report hotfix effectiveness
  fastify.post('/hotfixes/report', async (request: FastifyRequest, reply: FastifyReply) => {
    const { hotfixId, status, details } = request.body as any;

    logger.info('Admin: Hotfix report', { hotfixId, status, details });

    // Log telemetry data
    // TODO: Store in database for analytics

    return {
      success: true,
      data: { received: true },
      requestId: request.id,
    };
  });

  // GET /admin/stats - Get admin statistics
  fastify.get('/stats', async (request: FastifyRequest, reply: FastifyReply) => {
    logger.info('Admin: Get stats');

    return {
      success: true,
      data: {
        configVersion: remoteConfig.version,
        featureCount: Object.keys(remoteConfig.features).length,
        enabledFeatures: Object.values(remoteConfig.features).filter((f) => f.enabled).length,
        hotfixCount: remoteConfig.hotfixes.length,
        activeHotfixes: remoteConfig.hotfixes.filter((hf) => hf.enabled).length,
        promptCount: Object.keys(remoteConfig.prompts).length,
        maintenanceMode: remoteConfig.systemSettings.maintenanceMode,
        lastUpdated: remoteConfig.lastUpdated,
      },
      requestId: request.id,
    };
  });
}
