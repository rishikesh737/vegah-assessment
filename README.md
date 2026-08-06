# Next.js + NestJS Production Starter

A production-ready monorepo template featuring Next.js 14 frontend and NestJS backend with PostgreSQL, Docker, and CI/CD.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10-red?logo=nestjs)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)](https://www.docker.com/)

---

## Why This Starter?

After building 10+ production applications, I created this starter to encapsulate patterns that work at scale:

- **Monorepo structure** that scales with your team
- **Type-safe API layer** with shared types between frontend and backend
- **Authentication ready** with JWT + refresh tokens
- **Database migrations** with Prisma
- **Docker Compose** for local development
- **CI/CD pipeline** with GitHub Actions
- **Production deployment** configurations for Vercel + Railway/Render

---

## Project Structure

```
├── apps/
│   ├── web/                 # Next.js 14 frontend
│   │   ├── src/
│   │   │   ├── app/         # App Router pages
│   │   │   ├── components/  # React components
│   │   │   ├── hooks/       # Custom hooks
│   │   │   ├── lib/         # Utilities
│   │   │   └── types/       # Frontend types
│   │   └── ...
│   │
│   └── api/                 # NestJS backend
│       ├── src/
│       │   ├── modules/     # Feature modules
│       │   │   ├── auth/
│       │   │   ├── users/
│       │   │   └── ...
│       │   ├── common/      # Shared utilities
│       │   ├── config/      # Configuration
│       │   └── prisma/      # Database client
│       └── ...
│
├── packages/
│   └── shared/              # Shared types & utilities
│       ├── types/           # API contracts
│       └── utils/           # Shared helpers
│
├── docker-compose.yml       # Local development
├── .github/workflows/       # CI/CD
└── turbo.json               # Monorepo config
```

---

## Features

### Frontend (Next.js 14)

- **App Router** with layouts and loading states
- **Server Components** by default, Client Components where needed
- **TailwindCSS** with custom design system
- **React Query** for server state management
- **Zod** for runtime validation
- **next-auth** ready authentication

### Backend (NestJS)

- **Modular architecture** with feature-based organization
- **Prisma ORM** with PostgreSQL
- **JWT authentication** with refresh token rotation
- **Role-based access control** (RBAC)
- **Request validation** with class-validator
- **Swagger/OpenAPI** documentation
- **Rate limiting** and security headers
- **Logging** with Pino

### DevOps

- **Docker Compose** for local PostgreSQL + Redis
- **GitHub Actions** CI/CD pipeline
- **Husky** pre-commit hooks
- **ESLint + Prettier** code formatting
- **Jest** testing setup

---

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+
- Docker (for local database)

### Setup

```bash
# Clone the repository
git clone https://github.com/dsamdave/nextjs-nestjs-starter.git
cd nextjs-nestjs-starter

# Install dependencies
pnpm install

# Start local database
docker-compose up -d

# Setup environment variables
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# Run database migrations
pnpm db:migrate

# Seed the database (optional)
pnpm db:seed

# Start development servers
pnpm dev
```

The frontend will be available at `http://localhost:3000` and the API at `http://localhost:4000`.

---

## Architecture Decisions

### Why Monorepo?

- **Shared types** prevent frontend/backend drift
- **Atomic changes** across the stack in single PRs
- **Simplified CI/CD** with Turborepo caching

### Why NestJS over Express?

- **Dependency injection** makes testing easier
- **Module system** enforces code organization
- **First-class TypeScript** support
- **Built-in validation, guards, interceptors**

### Why Prisma over TypeORM?

- **Type-safe queries** generated from schema
- **Intuitive migrations** workflow
- **Excellent DX** with auto-completion

---

## Environment Variables

### API (`apps/api/.env`)

```env
DATABASE_URL="postgresql://user:pass@localhost:5432/dbname"
JWT_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret"
REDIS_URL="redis://localhost:6379"
```

### Web (`apps/web/.env`)

```env
NEXT_PUBLIC_API_URL="http://localhost:4000"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
```

---

## Scripts

```bash
# Development
pnpm dev           # Start all apps
pnpm dev:web       # Start frontend only
pnpm dev:api       # Start backend only

# Database
pnpm db:migrate    # Run migrations
pnpm db:generate   # Generate Prisma client
pnpm db:studio     # Open Prisma Studio
pnpm db:seed       # Seed database

# Testing
pnpm test          # Run all tests
pnpm test:e2e      # Run E2E tests

# Build
pnpm build         # Build all apps
pnpm lint          # Lint all apps
pnpm typecheck     # Type check all apps
```

---

## Deployment

### Frontend (Vercel)

1. Connect your repository to Vercel
2. Set root directory to `apps/web`
3. Add environment variables
4. Deploy

### Backend (Railway/Render)

1. Create a new project
2. Set root directory to `apps/api`
3. Add PostgreSQL addon
4. Set environment variables
5. Deploy

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

---

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## License

MIT License - feel free to use this for your projects.

---

## Author

**David Sampson** — Senior Full Stack Engineer

- [Portfolio](https://davidsampson.vercel.app)
- [GitHub](https://github.com/dsamdave)
- [LinkedIn](https://linkedin.com/in/YOUR_LINKEDIN)
