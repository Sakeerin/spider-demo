# Technology Stack & Build System

## Frontend Stack

- **Framework**: Next.js 14+ with App Router (SSR/ISR for SEO optimization)
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS (utility-first, responsive design)
- **Forms**: React Hook Form with validation
- **State Management**: Zustand (client-side), React Query (server state)
- **UI Components**: Custom components with accessibility focus

## Backend Stack

- **Framework**: NestJS (Node.js) for scalable API architecture
- **Database**: PostgreSQL with Prisma ORM (type-safe operations)
- **Caching**: Redis for sessions and performance
- **Queue System**: Bull Queue for background jobs
- **Authentication**: JWT with role-based access control (RBAC)

## Infrastructure & Services

- **Frontend Hosting**: Vercel with edge functions
- **Backend Hosting**: Railway/Render
- **File Storage**: AWS S3 with CDN
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry for error tracking
- **External APIs**: LINE Official Account, Google Maps, Email/SMS providers

## Development Environment

- **Database**: Docker Compose for local PostgreSQL and Redis
- **Package Manager**: npm/yarn
- **Code Quality**: ESLint, Prettier, TypeScript strict mode
- **Testing**: Jest (unit), Playwright (E2E)

## Common Commands

### Development Setup

```bash
# Install dependencies
npm install

# Start development environment
docker-compose up -d  # Database and Redis
npm run dev          # Frontend development server
npm run dev:api      # Backend development server
```

### Database Operations

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database
npx prisma db seed

# Reset database
npx prisma migrate reset
```

### Testing & Quality

```bash
# Run all tests
npm test

# Run E2E tests
npm run test:e2e

# Lint and format
npm run lint
npm run format

# Type checking
npm run type-check
```

### Build & Deploy

```bash
# Build for production
npm run build

# Start production server
npm start

# Deploy to staging
npm run deploy:staging

# Deploy to production
npm run deploy:prod
```

## Performance Requirements

- **Core Web Vitals**: LCP ≤ 2.5s, CLS ≤ 0.1, TBT ≤ 200ms
- **Accessibility**: WCAG 2.2 AA compliance
- **Mobile-First**: Responsive design with touch-friendly interfaces
- **Internationalization**: Thai/English language support
