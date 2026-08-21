# API Documentation

## Base URL
```
http://localhost:3000/api/v1
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Response Format

All responses follow this format:
```json
{
  "success": true,
  "data": { /* response data */ },
  "error": null,
  "requestId": "unique-request-id"
}
```

## Error Handling

Error responses:
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "requestId": "unique-request-id"
  }
}
```

## Endpoints

### Authentication

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "data": {
    "token": "jwt-token",
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "name": "User Name"
    }
  }
}
```

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "User Name",
  "password": "password123"
}
```

#### Logout
```http
POST /auth/logout
Authorization: Bearer <token>
```

#### Verify Token
```http
GET /auth/verify
Authorization: Bearer <token>
```

### Conversations

#### List Conversations
```http
GET /conversations
Authorization: Bearer <token>

Query Parameters:
- limit: number (default: 20)
- offset: number (default: 0)

Response:
{
  "success": true,
  "data": [
    {
      "id": "conv-id",
      "title": "Conversation Title",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Create Conversation
```http
POST /conversations
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "New Conversation" // optional
}
```

#### Get Conversation
```http
GET /conversations/:conversationId
Authorization: Bearer <token>
```

#### Send Message
```http
POST /conversations/:conversationId/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Message content"
}

Response:
{
  "success": true,
  "data": {
    "id": "msg-id",
    "conversationId": "conv-id",
    "role": "user",
    "content": "Message content",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

#### Get Messages
```http
GET /conversations/:conversationId/messages
Authorization: Bearer <token>

Query Parameters:
- limit: number (default: 50)
- offset: number (default: 0)
```

### Settings

#### Get Settings
```http
GET /settings
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "id": "settings-id",
    "language": "en",
    "theme": "dark",
    "accentColor": "#3b82f6",
    "voiceEnabled": true,
    "voiceLanguage": "en",
    "voiceGender": "male",
    "speechRate": 1.0,
    "volume": 1.0
  }
}
```

#### Update Settings
```http
PATCH /settings
Authorization: Bearer <token>
Content-Type: application/json

{
  "language": "en",
  "theme": "dark",
  "accentColor": "#3b82f6",
  "voiceEnabled": true,
  "speechRate": 1.0,
  "volume": 0.8
}
```

### Voice

#### Get Voice Configuration
```http
GET /voice/config
Authorization: Bearer <token>
```

#### Update Voice Configuration
```http
PATCH /voice/config
Authorization: Bearer <token>
Content-Type: application/json

{
  "language": "en",
  "voiceId": "voice-id",
  "gender": "male",
  "speechRate": 1.0,
  "pitch": 1.0,
  "volume": 1.0
}
```

### Memory

#### List Memories
```http
GET /memory
Authorization: Bearer <token>

Query Parameters:
- category: string (optional)
- limit: number (default: 20)
- offset: number (default: 0)
```

#### Create Memory
```http
POST /memory
Authorization: Bearer <token>
Content-Type: application/json

{
  "category": "people",
  "title": "Memory Title",
  "content": "Memory content"
}
```

#### Search Memories
```http
POST /memory/search
Authorization: Bearer <token>
Content-Type: application/json

{
  "query": "search term",
  "limit": 10
}
```

### Tools

#### List Tools
```http
GET /tools
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": [
    {
      "id": "tool-id",
      "name": "Tool Name",
      "description": "Tool description",
      "riskLevel": "LOW",
      "enabled": true,
      "requiresApproval": false
    }
  ]
}
```

#### Execute Tool
```http
POST /tools/:toolId/execute
Authorization: Bearer <token>
Content-Type: application/json

{
  "input": {
    "param1": "value1",
    "param2": "value2"
  }
}

Response:
{
  "success": true,
  "data": {
    "id": "execution-id",
    "toolId": "tool-id",
    "status": "completed",
    "output": { /* execution result */ }
  }
}
```

### Schedule

#### List Schedules
```http
GET /schedule
Authorization: Bearer <token>
```

#### Create Schedule
```http
POST /schedule
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Schedule Title",
  "description": "Optional description",
  "recurrence": "daily", // daily, weekly, monthly
  "timezone": "UTC"
}
```

### System

#### Get System Status
```http
GET /system/status

Response:
{
  "success": true,
  "data": {
    "status": "ONLINE",
    "connectionState": "connected",
    "voiceState": "ready"
  }
}
```

#### Health Check
```http
GET /health

Response:
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## WebSocket

### Connection
```javascript
const ws = new WebSocket('ws://localhost:3000/ws');

ws.onopen = () => {
  console.log('Connected');
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log('Message:', message);
};
```

### Message Format
```json
{
  "type": "message-type",
  "requestId": "unique-id",
  "data": { /* payload */ },
  "timestamp": 1234567890
}
```

### Example Events

#### AI Response Stream
```json
{
  "type": "ai-response-chunk",
  "requestId": "msg-123",
  "data": {
    "chunk": "This is a part of the response",
    "messageId": "msg-id"
  }
}
```

#### Voice Input
```json
{
  "type": "voice-input",
  "requestId": "voice-123",
  "data": {
    "audio": "base64-encoded-audio",
    "format": "wav",
    "language": "en"
  }
}
```

## Rate Limiting

- API requests: 100 requests per minute per user
- WebSocket messages: 50 messages per minute per connection

## Pagination

Endpoints supporting pagination:
- `limit`: Number of items (default: 20, max: 100)
- `offset`: Number of items to skip (default: 0)

## Timestamps

All timestamps are in ISO 8601 format (UTC):
```
2024-01-01T00:00:00Z
```
