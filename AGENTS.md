# AGENTS.md — VEGAH DevOps & Cloud Assessment Context

This document contains the complete context, local environment setup, assessment requirements, architecture details, and troubleshooting notes for AI coding agents (such as GitHub Copilot CLI) working in this repository.

---

## 1. Local Environment & System Specifications

- **OS / Distro**: Fedora Linux 44 (Workstation Edition) x86_64
- **Kernel**: Linux 7.1.12-200.fc44.x86_64
- **Container Engine**: Podman (using `podman` & `podman-compose` with Docker Compose V2 provider plugin)
- **Node.js Host Version**: v20.x
- **Package Manager**: pnpm (workspace & Turborepo enabled)
- **Primary Tools**: Podman, Node.js, Python 3, Git, GitHub CLI, GitHub Copilot CLI
- **Cloud Platform Target**: Azure (Student Subscription with Azure Credits / GHCR for container registry)

---

## 2. Assessment Objective & Requirements Summary
*(VEGAH DevOps / Cloud Engineering Intern Practical Assessment)*

### **Core Stack**
- **Frontend**: Next.js (port `3000`)
- **Backend API**: NestJS (port `4000`)
- **Database**: PostgreSQL 16 (port `5432`/`5433`)
- **Queue & Background Worker**: Redis 7 + BullMQ worker

### **Mandatory Tasks**
1. **Task 1 — Application Containerization**
   - Multi-stage Dockerfiles for `web` (Next.js) and `api` (NestJS).
   - Docker Compose orchestration with PostgreSQL and Redis supporting services.
   - Persistent volumes for PostgreSQL.
   - Container health checks and single-command startup.
2. **Task 2 — CI/CD Pipeline Implementation**
   - GitHub Actions workflow triggered on push to `main`.
   - Automated dependency check, build validation, Docker image generation.
   - Tagging and pushing container images to GitHub Container Registry (GHCR).
3. **Task 3 — Cloud Deployment**
   - Deploy complete stack to Azure / Cloud provider.
   - Public endpoint for frontend and functioning cross-service communication.
4. **Task 4 — Background Job Processing**
   - End-to-end async job workflow: Frontend UI request -> NestJS API -> Redis Queue (BullMQ) -> Background Worker -> API status lookup -> UI update.
5. **Task 5 — Deployment Reliability & Documentation**
   - Production readiness details: crash handling, secret management, persistence, rollback, monitoring, and architecture README.
   - 3-minute video walkthrough.

---

## 3. Monorepo Architecture Overview

**Base Repository**: `dsamdave/nextjs-nestjs-starter`

```
nextjs-nestjs-starter/
├── apps/
│   ├── api/             # NestJS REST API & BullMQ Queue Producer/Worker
│   └── web/             # Next.js Frontend (App Router, TailwindCSS)
├── packages/
│   └── shared/          # Shared TypeScript types, utilities, schemas
├── docker-compose.yml   # Base compose file (PostgreSQL, Redis)
├── docker-compose.prod.yml # Production compose override (API, Web build containers)
├── pnpm-workspace.yaml  # Workspace configuration
└── AGENTS.md            # Active agent context file
```

---

## 4. Key Build & Container Configurations

### Next.js (`apps/web`)
- Requires `output: 'standalone'` in `apps/web/next.config.js` to enable output tracing for lean Docker images.
- Requires copying `.next/standalone` and `.next/static` into the runner stage.

### NestJS (`apps/api`)
- Compiled output generates to `dist/src/main.js` inside `apps/api`.
- Node entry point MUST be `node dist/src/main.js` from the runner stage working directory (`WORKDIR /app`).
- Uses `@nestjs/bullmq` for Redis job queuing.

### Pnpm & Monorepo Dependencies
- Packages are managed using `pnpm --filter <app> build`.
- In Docker multi-stage builds, production dependencies must be properly copied or installed via `--frozen-lockfile`.

---

## 5. Active Troubleshooting & Status Notes

- **PostgreSQL & Redis**: Running and healthy in Podman container environment (`starter-postgres`, `starter-redis`).
- **Next.js Frontend Container (`starter-web`)**: Successfully builds using standalone output and runs on port 3000.
- **NestJS Container (`starter-api`)**: 
  - Entry point path resolved to `dist/src/main.js`.
  - Current hurdle: Runner stage needs complete node module resolution for root workspace modules (e.g., `@nestjs/core`) installed by `pnpm`.

---

## 6. Guidance for AI Agents & Commands

When assisting in this repository:
1. Always account for **Podman** command syntax (or `podman compose -f docker-compose.yml -f docker-compose.prod.yml`).
2. Maintain strict TypeScript strict-mode adherence.
3. Keep monorepo workspace dependencies intact between `@starter/shared`, `apps/api`, and `apps/web`.
4. Ensure environment variables (`DATABASE_URL`, `REDIS_URL`, `NEXT_PUBLIC_API_URL`, `JWT_SECRET`) are preserved and documented without committing sensitive secrets.