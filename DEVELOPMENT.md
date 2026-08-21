# RAKIB AI Assistant - Development Guide

## Setup Instructions

### Prerequisites
- Node.js 20+ LTS
- PostgreSQL 14+
- Rust (for Tauri)
- Git

### 1. Clone Repository
```bash
git clone https://github.com/rakibhasanriyad74-lang/rakib-ai-assistant.git
cd rakib-ai-assistant
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
- Database URL
- API keys (OpenAI, Anthropic, etc.)
- JWT secret

### 4. Database Setup
```bash
# Create database
creatdb rakib_ai_assistant

# Push schema
npm run db:push

# Seed data
npm run db:seed
```

### 5. Start Development

**Option A: Full Stack**
```bash
npm run dev
```
Starts both backend (port 3000) and frontend (port 5173)

**Option B: Separate Terminals**
```bash
# Terminal 1 - Backend
npm run dev:server

# Terminal 2 - Desktop App
npm run dev:desktop
```

## Project Structure

```
rakib-ai-assistant/
├── apps/
│   └── desktop/                 # Tauri Desktop App
│       ├── src/                # React frontend
│       ├── src-tauri/          # Tauri backend (Rust)
│       ├── index.html
│       ├── vite.config.ts
│       └── tailwind.config.ts
│
├── packages/
│   ├── server/                 # Fastify Backend
│   │   ├── src/
│   │   │   ├── index.ts       # Server entry
│   │   │   ├── routes/        # API routes
│   │   │   ├── utils/         # Utilities
│   │   │   └── websocket/     # WebSocket handlers
│   │   └── prisma/            # Database schema
│   │
│   └── shared/                 # Shared Types & Utils
│       ├── src/
│       │   ├── types/         # TypeScript types
│       │   ├── schemas/       # Zod schemas
│       │   └── constants/     # Constants
│
├── .env.example
├── tsconfig.json
├── .eslintrc.json
├── .prettierrc
└── package.json
```

## Available Scripts

### Development
- `npm run dev` - Start full stack
- `npm run dev:server` - Start backend only
- `npm run dev:desktop` - Start desktop app

### Building
- `npm run build` - Build all packages
- `npm run build:server` - Build backend
- `npm run build:desktop` - Build desktop app
- `npm run tauri:build` - Build Tauri binary

### Database
- `npm run db:push` - Push schema changes
- `npm run db:migrate` - Run migrations
- `npm run db:seed` - Seed test data
- `npm run db:studio` - Open Prisma Studio

### Code Quality
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run type-check` - Check TypeScript types

## Architecture Overview

### Frontend (React + Tauri)
- **State Management**: Zustand stores
- **Data Fetching**: Axios + TanStack Query
- **Styling**: Tailwind CSS
- **Real-time**: WebSocket
- **UI Framework**: Headless components + Lucide icons

### Backend (Fastify)
- **Framework**: Fastify (Node.js)
- **Database**: PostgreSQL with Prisma ORM
- **Real-time**: WebSocket (@fastify/websocket)
- **Authentication**: JWT tokens
- **Validation**: Zod schemas
- **Logging**: Pino

### Shared
- TypeScript types for frontend/backend communication
- Zod validation schemas
- Constants and enums

## API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/verify` - Verify token

### Conversations
- `GET /api/v1/conversations` - List conversations
- `POST /api/v1/conversations` - Create conversation
- `GET /api/v1/conversations/:id` - Get conversation
- `POST /api/v1/conversations/:id/messages` - Send message
- `GET /api/v1/conversations/:id/messages` - Get messages

### Settings
- `GET /api/v1/settings` - Get user settings
- `PATCH /api/v1/settings` - Update settings

### Voice
- `GET /api/v1/voice/config` - Get voice config
- `PATCH /api/v1/voice/config` - Update voice config

### Memory
- `GET /api/v1/memory` - List memories
- `POST /api/v1/memory` - Create memory
- `POST /api/v1/memory/search` - Search memories

### Tools
- `GET /api/v1/tools` - List tools
- `POST /api/v1/tools/:id/execute` - Execute tool

### Schedule
- `GET /api/v1/schedule` - List schedules
- `POST /api/v1/schedule` - Create schedule

### System
- `GET /api/v1/system/status` - Get system status
- `GET /health` - Health check

## WebSocket

**Connection**: `ws://localhost:3000/ws`

### Message Format
```json
{
  "type": "message-type",
  "requestId": "unique-id",
  "data": { /* payload */ },
  "timestamp": 1234567890
}
```

## Environment Variables

```bash
# Application
NODE_ENV=development
APP_NAME=RAKIB AI Assistant
APP_VERSION=1.0.0

# Server
SERVER_HOST=localhost
SERVER_PORT=3000
SERVER_CORS_ORIGIN=http://localhost:5173

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/rakib_ai_assistant

# Redis
REDIS_URL=redis://localhost:6379

# JWT & Auth
JWT_SECRET=your-secret-key
SESSION_SECRET=your-session-secret

# AI Providers
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GOOGLE_API_KEY=

# Voice/TTS
ELEVENLABS_API_KEY=
GOOGLE_TTS_API_KEY=

# Logging
LOG_LEVEL=info

# Features
ENABLE_VOICE=true
ENABLE_TOOLS=true
ENABLE_MEMORY=true
ENABLE_SCHEDULE=true
```

## Troubleshooting

### Port Already in Use
```bash
# Find and kill process on port 3000
lsof -i :3000
kill -9 <PID>
```

### Database Connection Error
```bash
# Check PostgreSQL is running
pg_isready -h localhost -p 5432

# Verify DATABASE_URL in .env
```

### WebSocket Connection Failed
- Ensure backend is running on correct port
- Check CORS origins in server configuration
- Verify firewall settings

## Contributing

1. Create feature branch: `git checkout -b feature/name`
2. Commit changes: `git commit -m "Feature: description"`
3. Push branch: `git push origin feature/name`
4. Submit Pull Request

## License

Proprietary - RAKIB PERSONAL AI ASSISTANT
