# RAKIB AI Assistant - Desktop Application Setup

## Quick Start

### 1. Prerequisites
- Node.js 20+ LTS
- PostgreSQL 14+
- Rust (for Tauri)
- Git

### 2. Installation

```bash
# Clone repository
git clone https://github.com/rakibhasanriyad74-lang/rakib-ai-assistant.git
cd rakib-ai-assistant

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Edit .env with your configuration
```

### 3. Database Setup

```bash
# Create database
creatdb rakib_ai_assistant

# Push Prisma schema
npm run db:push

# Seed data (optional)
npm run db:seed
```

### 4. Development

```bash
# Start full stack (backend + desktop)
npm run dev

# Or in separate terminals:
# Terminal 1
npm run dev:server

# Terminal 2
npm run dev:desktop
```

## Features

✅ **AI Conversations**
- Real-time chat with streaming responses
- Conversation history
- Multi-turn interactions

✅ **Voice Integration**
- Voice input/output
- Language support (English & Bangla)
- Customizable voice settings

✅ **Memory System**
- Persistent memory storage
- Semantic search
- Memory categorization

✅ **Tool Integration**
- Extensible tool/action system
- Risk-level based approval
- Tool execution tracking

✅ **Customization**
- Dark/Light themes
- Custom accent colors
- Language preferences
- Voice settings

✅ **Real-time Sync**
- WebSocket communication
- Live status updates
- Instant notifications

## Project Structure

```
rakib-ai-assistant/
├── apps/
│   └── desktop/              # Tauri desktop app
│       ├── src/              # React frontend
│       ├── src-tauri/        # Tauri backend (Rust)
│       └── index.html
│
├── packages/
│   ├── server/               # Fastify backend
│   │   ├── src/
│   │   └── prisma/
│   │
│   └── shared/               # Shared types
│       └── src/
│
├── .env.example
├── .gitignore
├── tsconfig.json
├── README.md
├── DEVELOPMENT.md
├── ARCHITECTURE.md
├── CONTRIBUTING.md
└── API.md
```

## Available Commands

### Development
```bash
npm run dev              # Start full stack
npm run dev:server       # Start backend only
npm run dev:desktop      # Start desktop app
```

### Building
```bash
npm run build            # Build all packages
npm run build:server     # Build backend
npm run build:desktop    # Build frontend
npm run tauri:build      # Build desktop binary
```

### Database
```bash
npm run db:push          # Push schema changes
npm run db:migrate       # Run migrations
npm run db:seed          # Seed test data
npm run db:studio        # Open Prisma Studio
```

### Code Quality
```bash
npm run lint             # Run ESLint
npm run format           # Format with Prettier
npm run type-check       # TypeScript check
```

## Environment Variables

Required environment variables (see `.env.example`):

```bash
# Server
NODE_ENV=development
SERVER_PORT=3000
SERVER_HOST=localhost

# Database
DATABASE_URL=postgresql://user:password@localhost/rakib_ai_assistant

# Authentication
JWT_SECRET=your-secret-key
SESSION_SECRET=your-session-secret

# AI Providers
OPENAI_API_KEY=your-key
# ... other provider keys
```

## System Requirements

- **OS**: Windows 10+, macOS 10.15+, Linux (Ubuntu 20+)
- **RAM**: 4GB minimum, 8GB+ recommended
- **Disk**: 500MB for application + dependencies
- **Network**: Internet connection required

## Architecture

### Three-Layer Design
1. **Frontend** (React + Tauri) - User interface
2. **Backend** (Fastify) - API & business logic
3. **Database** (PostgreSQL) - Data persistence

### Real-time Communication
- HTTP REST API for standard operations
- WebSocket for streaming & real-time updates

## API Endpoints

Backend runs on `http://localhost:3000`

### Example Requests

```bash
# Health check
curl http://localhost:3000/health

# Get system status
curl http://localhost:3000/api/v1/system/status

# Create conversation (requires auth)
curl -X POST http://localhost:3000/api/v1/conversations \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json"
```

See [API.md](API.md) for complete API documentation.

## Troubleshooting

### Port Already in Use
```bash
# Check what's using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### Database Connection Failed
```bash
# Verify PostgreSQL is running
pg_isready -h localhost

# Check connection string in .env
# Format: postgresql://username:password@host:port/database
```

### WebSocket Connection Error
- Ensure backend is running
- Check firewall settings
- Verify VITE_WS_URL in frontend config

### Build Errors
```bash
# Clean install
rm -rf node_modules pnpm-lock.yaml
npm install

# Rebuild
npm run build
```

## Support

- 📖 [Development Guide](DEVELOPMENT.md)
- 🏗️ [Architecture Guide](ARCHITECTURE.md)
- 🤝 [Contributing Guidelines](CONTRIBUTING.md)
- 📡 [API Documentation](API.md)

## License

Proprietary - RAKIB PERSONAL AI ASSISTANT

## Author

Rakib Hasan - [GitHub](https://github.com/rakibhasanriyad74-lang)

---

**Happy coding! 🚀**
