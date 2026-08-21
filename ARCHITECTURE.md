# RAKIB AI Assistant - Architecture

## System Design

### Three-Layer Architecture

```
┌─────────────────────────────────────┐
│   Frontend Layer (React + Tauri)    │
│  - UI Components                    │
│  - State Management (Zustand)       │
│  - API Communication                │
└──────────────┬──────────────────────┘
               │
        HTTP / WebSocket
               │
┌──────────────▼──────────────────────┐
│   API Layer (Fastify)               │
│  - REST Endpoints                   │
│  - WebSocket Handlers               │
│  - Business Logic                   │
│  - Authentication & Authorization   │
└──────────────┬──────────────────────┘
               │
         Database / Cache
               │
┌──────────────▼──────────────────────┐
│   Data Layer (PostgreSQL)           │
│  - Users & Sessions                 │
│  - Conversations & Messages         │
│  - Settings & Preferences           │
│  - Memory & Embeddings              │
│  - Tools & Executions               │
└─────────────────────────────────────┘
```

## Component Architecture

### Frontend Components

```
App
├── AppShell
│   ├── Sidebar
│   │   ├── Header
│   │   ├── Conversation List
│   │   └── Footer (Settings, Logout)
│   ├── MainContent
│   │   ├── Message Area
│   │   └── Input Area
│   └── RightPanel
│       ├── System Status
│       ├── Memory Browser
│       ├── Tools Panel
│       ├── Statistics
│       └── Settings
```

### State Management (Zustand)

```
Store Hierarchy:
├── AIStore
│   ├── state (AI state: idle, listening, thinking, etc.)
│   ├── isListening
│   ├── isSpeaking
│   └── currentMessage
│
├── ConversationStore
│   ├── conversationId
│   ├── messages
│   ├── isLoading
│   └── error
│
├── SettingsStore
│   ├── language
│   ├── theme
│   ├── accentColor
│   ├── voiceEnabled
│   └── speechRate
│
├── SystemStore
│   ├── status
│   ├── isConnected
│   ├── connectionMessage
│   └── voiceState
│
├── MemoryStore
│   ├── memories
│   ├── isLoading
│   └── searchMemories()
│
└── ThemeStore
    ├── theme
    └── accentColor
```

## Backend Services

### Request Flow

```
1. Client Request
   ↓
2. Fastify Router matches route
   ↓
3. Authentication Middleware (JWT)
   ↓
4. Validation Middleware (Zod)
   ↓
5. Business Logic (Route Handler)
   ↓
6. Database Operation (Prisma)
   ↓
7. Response Format & Return
```

### Service Architecture

```
Fastify App
├── Plugins
│   ├── CORS
│   ├── JWT
│   ├── Cookie
│   └── WebSocket
│
├── Routes
│   ├── /api/v1/auth
│   ├── /api/v1/conversations
│   ├── /api/v1/settings
│   ├── /api/v1/voice
│   ├── /api/v1/memory
│   ├── /api/v1/tools
│   ├── /api/v1/schedule
│   └── /api/v1/system
│
├── WebSocket
│   └── /ws (Real-time communication)
│
└── Utilities
    ├── Logger (Pino)
    ├── Error Handler
    └── Request Validator
```

## Database Schema

### Key Models

```
User
├── id (PK)
├── email (UNIQUE)
├── name
├── password (hashed)
├── createdAt
└── updatedAt

Session
├── id (PK)
├── userId (FK)
├── token (UNIQUE)
├── expiresAt
└── createdAt

Conversation
├── id (PK)
├── userId (FK)
├── title
├── createdAt
└── updatedAt

Message
├── id (PK)
├── conversationId (FK)
├── role (user|assistant)
├── content
└── createdAt

Memory
├── id (PK)
├── userId (FK)
├── category
├── title
├── content
├── embedding (vector)
├── createdAt
└── updatedAt

Settings
├── id (PK)
├── userId (FK UNIQUE)
├── language
├── theme
├── accentColor
├── voiceEnabled
├── speechRate
├── volume
├── createdAt
└── updatedAt

AIProvider
├── id (PK)
├── userId (FK)
├── name
├── apiKey (encrypted)
├── isConfigured
├── connectedAt
├── lastTestedAt
├── createdAt
└── updatedAt

Tool
├── id (PK)
├── userId (FK)
├── name
├── description
├── capability
├── riskLevel
├── enabled
├── requiresApproval
├── createdAt
└── updatedAt

Schedule
├── id (PK)
├── userId (FK)
├── title
├── description
├── enabled
├── recurrence
├── nextExecution
├── lastExecution
├── timezone
├── createdAt
└── updatedAt
```

## Communication Patterns

### REST API
- Standard HTTP methods (GET, POST, PATCH, DELETE)
- JSON request/response format
- Request validation with Zod
- Consistent error responses

### WebSocket
- Real-time message streaming
- AI response streaming
- Status updates
- Event notifications

## Security Layers

1. **Authentication**
   - JWT tokens
   - Session management
   - Token expiration

2. **Authorization**
   - User isolation
   - Resource ownership checks
   - Role-based access control

3. **Data Protection**
   - API key encryption
   - Password hashing (bcrypt)
   - CORS protection
   - HTTPS (in production)

4. **Input Validation**
   - Zod schema validation
   - Type checking
   - Sanitization

## Performance Considerations

- **Caching**: Redis for session/cache layer
- **Database**: Indexes on frequently queried fields
- **API**: Pagination for large datasets
- **WebSocket**: Message compression
- **Frontend**: Lazy loading, code splitting

## Deployment Architecture

```
┌──────────────────────────────────┐
│      User's Machine              │
│  ┌──────────────────────────┐   │
│  │   Tauri Desktop App      │   │
│  │  (React + Bundled)       │   │
│  └────────────┬─────────────┘   │
│               │                 │
│         HTTP/WebSocket         │
│               │                 │
└───────────────┼─────────────────┘
                │
    ┌───────────┴───────────┐
    │                       │
┌───▼────────────┐   ┌──────▼────────┐
│  Fastify API   │   │  PostgreSQL   │
│  (Backend)     │───│  (Database)   │
└────────────────┘   └───────────────┘
```

## Data Flow Examples

### Message Send Flow
```
1. User types message → Frontend
2. Input validation (Zod)
3. POST /api/v1/conversations/:id/messages
4. Backend validates & stores in DB
5. AI processes message via AI provider
6. Stream response via WebSocket
7. Update UI in real-time
```

### Voice Input Flow
```
1. User clicks microphone
2. Tauri captures audio
3. Send audio blob via WebSocket
4. Backend processes with STT
5. Convert to text
6. Process as message
7. Stream response
```

### Memory Search Flow
```
1. User searches in MemoryStore
2. Semantic search via embeddings
3. Query PostgreSQL vector store
4. Return relevant memories
5. Display in RightPanel
```
