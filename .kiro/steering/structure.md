# Project Structure & Organization

## Repository Layout

```
spider-marketplace/
├── apps/
│   ├── web/                    # Next.js frontend application
│   └── api/                    # NestJS backend application
├── packages/
│   ├── shared/                 # Shared TypeScript types and utilities
│   ├── ui/                     # Reusable UI components
│   └── config/                 # Shared configuration files
├── docker-compose.yml          # Local development environment
├── .github/workflows/          # CI/CD pipeline configurations
└── docs/                       # Project documentation
```

## Frontend Structure (apps/web/)

```
apps/web/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (public)/          # Public pages (homepage, services)
│   │   ├── (auth)/            # Authentication pages
│   │   ├── customer/          # Customer portal
│   │   ├── contractor/        # Contractor portal
│   │   ├── admin/             # Admin dashboard
│   │   └── api/               # API routes (if needed)
│   ├── components/            # Reusable UI components
│   │   ├── ui/                # Base UI components (buttons, forms)
│   │   ├── forms/             # Form components
│   │   ├── layout/            # Layout components
│   │   └── features/          # Feature-specific components
│   ├── lib/                   # Utilities and configurations
│   │   ├── auth/              # Authentication utilities
│   │   ├── api/               # API client and hooks
│   │   ├── utils/             # Helper functions
│   │   └── validations/       # Form validation schemas
│   ├── hooks/                 # Custom React hooks
│   ├── stores/                # Zustand state stores
│   ├── types/                 # TypeScript type definitions
│   └── styles/                # Global styles and Tailwind config
├── public/                    # Static assets
├── messages/                  # i18n translation files
└── middleware.ts              # Next.js middleware for auth/i18n
```

## Backend Structure (apps/api/)

```
apps/api/
├── src/
│   ├── modules/               # Feature modules
│   │   ├── auth/              # Authentication & authorization
│   │   ├── users/             # User management
│   │   ├── contractors/       # Contractor profiles & management
│   │   ├── leads/             # Lead capture & processing
│   │   ├── jobs/              # Job & milestone management
│   │   ├── matching/          # Random match engine
│   │   ├── notifications/     # Multi-channel notifications
│   │   ├── reviews/           # Review & rating system
│   │   └── admin/             # Admin operations
│   ├── common/                # Shared utilities
│   │   ├── decorators/        # Custom decorators
│   │   ├── guards/            # Authentication guards
│   │   ├── interceptors/      # Request/response interceptors
│   │   ├── pipes/             # Validation pipes
│   │   └── filters/           # Exception filters
│   ├── config/                # Configuration management
│   ├── database/              # Database configuration & migrations
│   │   ├── migrations/        # Prisma migrations
│   │   ├── seeds/             # Database seed files
│   │   └── schema.prisma      # Prisma schema
│   └── main.ts                # Application entry point
├── test/                      # Integration tests
└── prisma/                    # Prisma configuration
```

## Shared Packages Structure

```
packages/
├── shared/
│   ├── types/                 # Shared TypeScript interfaces
│   │   ├── user.ts            # User-related types
│   │   ├── contractor.ts      # Contractor-related types
│   │   ├── job.ts             # Job & milestone types
│   │   └── api.ts             # API request/response types
│   └── utils/                 # Shared utility functions
├── ui/
│   ├── components/            # Reusable UI components
│   ├── hooks/                 # Shared React hooks
│   └── styles/                # Component styles
└── config/
    ├── eslint/                # ESLint configurations
    ├── typescript/            # TypeScript configurations
    └── tailwind/              # Tailwind CSS configurations
```

## Naming Conventions

### Files & Directories

- **Components**: PascalCase (`UserProfile.tsx`, `ContractorCard.tsx`)
- **Pages**: kebab-case (`contractor-profile/`, `job-details/`)
- **Utilities**: camelCase (`formatCurrency.ts`, `validateEmail.ts`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINTS.ts`, `USER_ROLES.ts`)

### Code Conventions

- **Interfaces**: PascalCase with `I` prefix (`IUser`, `IContractor`)
- **Types**: PascalCase (`UserRole`, `JobStatus`)
- **Enums**: PascalCase (`UserRole`, `MilestoneStatus`)
- **Functions**: camelCase (`getUserById`, `calculateMatchScore`)
- **Variables**: camelCase (`currentUser`, `matchResults`)

## Module Organization Patterns

### Feature-Based Modules

Each feature module should contain:

- **Controller**: HTTP request handling
- **Service**: Business logic implementation
- **Repository**: Data access layer (if needed beyond Prisma)
- **DTOs**: Data transfer objects for validation
- **Entities**: Database entity definitions (Prisma models)
- **Tests**: Unit and integration tests

### Component Organization

- **Atomic Design**: Atoms → Molecules → Organisms → Templates → Pages
- **Feature Folders**: Group related components by feature
- **Shared Components**: Reusable across multiple features
- **Layout Components**: Page structure and navigation

## Import/Export Patterns

```typescript
// Barrel exports for clean imports
export * from './UserProfile';
export * from './ContractorCard';

// Absolute imports using path mapping
import { UserService } from '@/modules/users';
import { Button } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
```

## Configuration Management

- **Environment Variables**: Separate configs for dev/staging/prod
- **Feature Flags**: Toggle features without deployment
- **API Endpoints**: Centralized endpoint definitions
- **Validation Schemas**: Shared between frontend and backend
