# RAKIB PERSONAL AI ASSISTANT

A production-ready desktop AI assistant application built with React, Tauri, Node.js, and PostgreSQL.

## Features

- 🤖 AI conversation with streaming responses
- 🎙️ Voice input/output with multiple language support (English & Bangla)
- 💾 Persistent memory system with semantic search
- 🛠️ Extensible tool/action system with approval workflows
- 📅 Schedule/task management
- 🎨 Customizable theme and accent colors
- 🔐 Secure API key management
- 🌐 Real-time WebSocket communication
- 📱 Three-column desktop layout

## Project Structure

```
rakib-ai-assistant/
├── apps/
│   └── desktop/              # Tauri desktop application
│       ├── src-tauri/       # Tauri native layer
│       └── src/             # React frontend
├── packages/
│   ├── server/              # Fastify backend
│   └── shared/              # Shared types & utilities
├── .env.example
└── package.json
```

## Tech Stack

- **Frontend**: React 18, TypeScript, Tauri, Vite, Tailwind CSS
- **State Management**: Zustand, TanStack Query, TanStack Router
- **Backend**: Node.js, Fastify, PostgreSQL, Prisma
- **Real-time**: WebSocket
- **Validation**: Zod
- **Localization**: i18next

## Getting Started

### Prerequisites

- Node.js 20+ LTS
- PostgreSQL 14+
- Rust (for Tauri)

### Installation

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Setup database
npm run db:push
npm run db:seed
```

### Development

```bash
# Start both frontend and backend
npm run dev

# Or separately:
npm run dev:server      # Backend on http://localhost:3000
npm run dev:desktop     # Desktop app via Tauri
```

### Building

```bash
# Build all packages
npm run build

# Build desktop app
npm run build:desktop
```

## Architecture

- **Feature-based modules** with clear separation of concerns
- **Single source of truth** for state (Zustand + TanStack Query)
- **Centralized API client** with request validation
- **WebSocket** for real-time AI streaming and events
- **Secure authentication** with session management
- **Database-backed** persistence with Prisma ORM

## API Documentation

Backend API runs on `http://localhost:3000` with versioned endpoints:

- `/api/v1/auth` - Authentication
- `/api/v1/conversations` - Chat management
- `/api/v1/memory` - Memory system
- `/api/v1/settings` - User settings
- `/api/v1/providers` - AI providers
- `/api/v1/tools` - Tools registry
- `/api/v1/schedule` - Task scheduling
- `/api/v1/voice` - Voice configuration

## Contributing

Please maintain the established architecture and follow the master prompts.

## License

Proprietary - RAKIB PERSONAL AI ASSISTANT
