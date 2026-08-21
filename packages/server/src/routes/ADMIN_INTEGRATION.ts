// Add to packages/server/src/index.ts - Import and register admin routes

import { adminRouter } from './routes/admin';

// ... existing code ...

// Register admin routes
fastify.register(adminRouter, { prefix: '/api/v1/admin' });
