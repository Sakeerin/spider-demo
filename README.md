# SPIDER Marketplace

A contractor marketplace platform that connects customers with verified contractors for construction, renovation, interior design, repairs, and smart home installations.

## Features

- **Random Match System**: Unique algorithm that matches customers with qualified contractors
- **Milestone-Based Payments**: Project tracking through defined milestones
- **Multi-User Dashboards**: Specialized interfaces for customers, contractors, and back-office staff
- **Smart Home Integration**: Product catalog with installation services

## Tech Stack

### Frontend

- Next.js 14+ with App Router
- TypeScript
- Tailwind CSS
- React Hook Form
- Zustand & React Query

### Backend

- NestJS (Node.js)
- PostgreSQL with Prisma ORM
- Redis for caching
- JWT authentication

### Infrastructure

- Docker Compose for development
- GitHub Actions for CI/CD
- Vercel for frontend hosting

## Getting Started

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- Git

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd spider-marketplace
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
# Copy environment files
cp .env.example .env
cp apps/web/.env.local.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env
```

4. Start the development environment:

```bash
# Start database and Redis
docker-compose up -d

# Generate Prisma client and run migrations
npm run db:generate --workspace=@spider/api
npm run db:migrate --workspace=@spider/api

# Seed the database
npm run db:seed --workspace=@spider/api

# Start development servers
npm run dev
```

The applications will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Documentation: http://localhost:3001/api/docs
- pgAdmin: http://localhost:8080 (admin@spider.com / admin123)
- Redis Commander: http://localhost:8081

### Development Commands

```bash
# Install dependencies
npm install

# Start development servers
npm run dev

# Build applications
npm run build

# Run tests
npm run test

# Lint code
npm run lint

# Format code
npm run format

# Type checking
npm run type-check

# Database operations
npm run db:generate --workspace=@spider/api
npm run db:migrate --workspace=@spider/api
npm run db:seed --workspace=@spider/api
npm run db:reset --workspace=@spider/api
npm run db:studio --workspace=@spider/api
```

## Project Structure

```
spider-marketplace/
├── apps/
│   ├── web/                    # Next.js frontend
│   └── api/                    # NestJS backend
├── packages/
│   ├── shared/                 # Shared types and utilities
│   ├── ui/                     # Reusable UI components
│   └── config/                 # Shared configurations
├── docker-compose.yml          # Development environment
├── .github/workflows/          # CI/CD pipelines
└── docs/                       # Documentation
```

## Contributing

1. Create a feature branch from `develop`
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

Private - All rights reserved
