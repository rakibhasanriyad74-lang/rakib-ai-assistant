// Integration guide for the Admin Panel

# Admin Panel Integration Guide

## 1. Import Required Files

Add these imports to your main App component:

```typescript
import { useRemoteConfig } from '@/hooks/useRemoteConfig';
import { getRemoteConfigService } from '@/services/remoteConfigService';
import { logger } from '@/utils/logger';
import { errorRecoverySystem } from '@/utils/errorRecovery';
import { featureAnalytics } from '@/utils/featureAnalytics';
```

## 2. Update App.tsx

Add this code to initialize the remote config system:

```typescript
import { useEffect } from 'react';
import { getRemoteConfigService } from '@/services/remoteConfigService';
import { featureAnalytics } from '@/utils/featureAnalytics';

function App() {
  useEffect(() => {
    // Initialize remote config service
    const remoteConfigService = getRemoteConfigService();
    remoteConfigService.startSync(300000); // Sync every 5 minutes
    
    // Initialize feature analytics
    featureAnalytics.startSync();
    
    return () => {
      remoteConfigService.stopSync();
      featureAnalytics.stopSync();
    };
  }, []);

  return (
    // Your existing app code
  );
}
```

## 3. Use in Components

### Example: Feature Flag Check

```typescript
import { useRemoteConfig } from '@/hooks/useRemoteConfig';

function MyComponent() {
  const { isFeatureEnabled, getPrompt } = useRemoteConfig();
  
  const voiceEnabled = isFeatureEnabled('voiceInput');
  const greeting = getPrompt('greeting');
  
  if (!voiceEnabled) {
    return <div>Voice feature is disabled</div>;
  }
  
  return <div>{greeting}</div>;
}
```

### Example: Apply Hotfixes

```typescript
import { getRemoteConfigService } from '@/services/remoteConfigService';

function MyModule() {
  const service = getRemoteConfigService();
  const hotfixOverrides = service.applyHotfixes('conversation');
  
  // Apply overrides to your module
  const config = {
    maxMessageLength: 5000,
    ...hotfixOverrides, // This will override if hotfix exists
  };
  
  return <div>Config: {config.maxMessageLength}</div>;
}
```

## 4. Backend Integration

### Add Admin Router to Fastify Server

Update `packages/server/src/index.ts`:

```typescript
import { adminRouter } from './routes/admin';

// Add this after other route registrations:
fastify.register(adminRouter, { prefix: '/api/v1/admin' });
```

### Set Admin Token

Add to `.env`:

```bash
ADMIN_TOKEN=your-secure-admin-token-here
ADMIN_ENDPOINT=http://localhost:3001/api/v1/admin
```

## 5. Environment Variables

Add to `apps/desktop/.env`:

```bash
VITE_ADMIN_ENDPOINT=http://localhost:3001/api/v1/admin
VITE_ADMIN_TOKEN=your-admin-token
```

## 6. Display Admin Panel

### In Development Mode

Add this to your main layout:

```typescript
import { AdminPanel } from '@/components/admin/AdminPanel';
import { useState } from 'react';

function Layout() {
  const [showAdmin, setShowAdmin] = useState(process.env.NODE_ENV === 'development');
  
  // Toggle with keyboard shortcut (Ctrl+Shift+A)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        setShowAdmin((prev) => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);
  
  return (
    <>
      {showAdmin && <AdminPanel />}
      {/* Your app layout */}
    </>
  );
}
```

## 7. Database Schema (Optional)

If using Prisma, add this to your schema:

```prisma
model RemoteConfig {
  id        String   @id @default(cuid())
  version   String
  config    Json
  hotfixes  Hotfix[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("remote_configs")
}

model Hotfix {
  id          String   @id @default(cuid())
  enabled     Boolean  @default(true)
  priority    String
  description String
  modules     String[] // Array of module names
  override    Json
  configId    String
  config      RemoteConfig @relation(fields: [configId], references: [id])
  createdAt   DateTime @default(now())
  expiresAt   DateTime?

  @@map("hotfixes")
}

model FeatureEvent {
  id          String   @id @default(cuid())
  featureName String
  action      String
  metadata    Json?
  createdAt   DateTime @default(now())

  @@index([featureName])
  @@index([createdAt])
  @@map("feature_events")
}
```

## 8. API Endpoints

### Admin Config Management

**Headers Required:**
```
Authorization: Bearer <ADMIN_TOKEN>
```

#### Get Config
```http
GET /api/v1/admin/config
```

#### Update Config
```http
POST /api/v1/admin/config
Content-Type: application/json

{
  "version": "1.1.0",
  "features": {
    "voiceInput": {
      "enabled": true,
      "rolloutPercentage": 100
    }
  },
  "systemSettings": {
    "maintenanceMode": false
  }
}
```

#### Create Hotfix
```http
POST /api/v1/admin/hotfixes
Content-Type: application/json

{
  "priority": "HIGH",
  "description": "Fix for conversation memory leak",
  "affectedModules": ["conversation", "memory"],
  "override": {
    "maxCacheSize": 50
  }
}
```

#### Update Feature Flag
```http
POST /api/v1/admin/features/voiceInput
Content-Type: application/json

{
  "enabled": true,
  "rolloutPercentage": 80
}
```

## 9. Testing

### Test Remote Config Sync

```bash
# Terminal 1: Start backend
cd packages/server
npm run dev

# Terminal 2: Start frontend
cd apps/desktop
npm run dev:desktop

# Terminal 3: Test admin endpoint
curl -H "Authorization: Bearer your-admin-token" \
  http://localhost:3000/api/v1/admin/config
```

## 10. Monitoring & Debugging

### View Logs

```typescript
import { logger } from '@/utils/logger';

// Get all logs
console.log(logger.getLogs());

// Clear logs
logger.clearLogs();
```

### View Error History

```typescript
import { errorRecoverySystem } from '@/utils/errorRecovery';

// Get error history
console.log(errorRecoverySystem.getErrorHistory());
```

### View Feature Analytics

```typescript
import { featureAnalytics } from '@/utils/featureAnalytics';

// Get events
console.log(featureAnalytics.getEvents());
```

## 11. Security Considerations

1. **Admin Token**: Use strong, random tokens
2. **HTTPS**: Use HTTPS in production
3. **Rate Limiting**: Implement rate limiting on admin endpoints
4. **Audit Logging**: Log all admin actions
5. **Encryption**: Encrypt sensitive config values

## 12. Troubleshooting

### Config Not Syncing
- Check admin token in environment variables
- Verify backend admin routes are registered
- Check browser console for CORS errors
- Verify network connectivity

### Hotfixes Not Applied
- Ensure module name matches exactly
- Check if hotfix is enabled
- Verify hotfix hasn't expired
- Check logs for hotfix application errors

### Admin Panel Not Loading
- Check environment variables
- Verify API endpoint is correct
- Check browser console for errors
- Try manual sync with "Sync Now" button
