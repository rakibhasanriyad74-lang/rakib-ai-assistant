# Contributing to RAKIB AI Assistant

## Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors.

## Getting Started

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/rakib-ai-assistant.git
   cd rakib-ai-assistant
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the existing code style
   - Write meaningful commit messages
   - Test your changes

4. **Run quality checks**
   ```bash
   npm run lint
   npm run format
   npm run type-check
   ```

5. **Push and create a Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

## Development Guidelines

### Code Style

- **TypeScript**: Strict mode enabled
- **Naming**: camelCase for variables/functions, PascalCase for components/classes
- **Formatting**: Prettier (2 spaces, single quotes)
- **Linting**: ESLint with TypeScript support

### Folder Structure

#### Frontend (`apps/desktop/src/`)
```
src/
├── components/       # React components
│   ├── layout/       # Layout components
│   ├── ui/          # Reusable UI components
│   └── features/    # Feature-specific components
├── store/           # Zustand stores
├── hooks/           # Custom React hooks
├── api/             # API client
├── utils/           # Utility functions
├── types/           # TypeScript types
└── App.tsx          # Main app component
```

#### Backend (`packages/server/src/`)
```
src/
├── routes/          # API route handlers
├── middleware/      # Express middleware
├── services/        # Business logic
├── utils/           # Utility functions
├── websocket/       # WebSocket handlers
├── types/           # TypeScript types
└── index.ts         # Server entry point
```

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style changes
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Test additions/changes
- `chore`: Build/dependency updates

**Example:**
```
feat(conversation): add message streaming support

Implement WebSocket streaming for real-time message updates
from AI provider. Adds new message event emitter and handlers.

Closes #42
```

### Component Development

#### React Component Template
```typescript
import { FC, ReactNode } from 'react';

interface ComponentProps {
  children?: ReactNode;
  // Other props
}

export const Component: FC<ComponentProps> = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
};
```

#### Zustand Store Template
```typescript
import { create } from 'zustand';

interface StoreState {
  // State properties
  setValue: (value: any) => void;
}

export const useStore = create<StoreState>((set) => ({
  // Initial state
  setValue: (value) => set({ value }),
}));
```

### API Route Template
```typescript
import { FastifyInstance } from 'fastify';
import { logger } from '../utils/logger';

export async function routeHandler(fastify: FastifyInstance) {
  fastify.get('/', async (request, reply) => {
    logger.info('Route handler');
    return {
      success: true,
      data: {},
      requestId: request.id,
    };
  });
}
```

## Testing

### Frontend Tests
```bash
# Run tests
npm run test -w apps/desktop

# Watch mode
npm run test:watch -w apps/desktop

# Coverage
npm run test:coverage -w apps/desktop
```

### Backend Tests
```bash
# Run tests
npm run test -w packages/server
```

### Test File Naming
- Component tests: `Component.test.tsx`
- Hook tests: `useHook.test.ts`
- Utility tests: `util.test.ts`

## Pull Request Process

1. **Update documentation** if adding/changing features
2. **Add tests** for new functionality
3. **Run full test suite** locally
4. **Create PR** with clear description
5. **Link related issues** with "Closes #number"
6. **Request reviews** from maintainers
7. **Address feedback** and update PR
8. **Merge** when approved

### PR Title Format
```
[scope]: description

Example:
[frontend]: add dark mode toggle to settings
[backend]: implement memory search with embeddings
[docs]: update architecture documentation
```

## Issue Templates

### Bug Report
```markdown
**Description**
Clear description of the bug

**Steps to Reproduce**
1. Step 1
2. Step 2

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- OS: 
- Node version: 
- App version: 
```

### Feature Request
```markdown
**Description**
Clear description of desired feature

**Use Case**
Why this feature is needed

**Implementation Suggestion**
Optional implementation approach
```

## Performance Guidelines

### Frontend
- Use React.memo for expensive components
- Implement code splitting for large routes
- Optimize images and assets
- Use Zustand selectors to prevent unnecessary re-renders
- Debounce/throttle frequent events

### Backend
- Use database indexes for frequently queried fields
- Implement pagination for large datasets
- Cache responses where appropriate
- Use connection pooling
- Profile and optimize slow queries

## Security Guidelines

1. **Input Validation**
   - Always validate user input
   - Use Zod schemas for API endpoints
   - Sanitize HTML content

2. **Authentication**
   - Use strong JWT secrets
   - Implement token expiration
   - Validate tokens on protected routes

3. **Authorization**
   - Check user ownership of resources
   - Implement role-based access control
   - Never trust client-side permissions

4. **Data Protection**
   - Hash passwords with bcrypt
   - Encrypt sensitive data
   - Use HTTPS in production
   - Never log sensitive data

## Documentation

- Add JSDoc comments to functions
- Document complex algorithms
- Update README for new features
- Keep ARCHITECTURE.md current
- Add inline comments for non-obvious code

## Questions?

Open an issue with the `question` label or reach out to the maintainers.

Happy coding! 🚀
