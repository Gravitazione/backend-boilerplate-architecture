# Backend Boilerplate Architecture

NestJS backend boilerplate with Prisma, PostgreSQL, env-based config, health checks, and Git hooks.

## Tech stack

- **Runtime:** Node.js
- **Framework:** [NestJS](https://nestjs.com)
- **ORM:** [Prisma](https://www.prisma.io) (PostgreSQL)
- **Validation:** class-validator + class-transformer
- **Config:** @nestjs/config (`.env` + `.env.{NODE_ENV}`)
- **Git:** Husky, Commitlint (Conventional Commits), lint-staged

## Prerequisites

- Node.js 22+
- pnpm
- Docker & Docker Compose (for local PostgreSQL)

## Setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Environment variables

Env files are loaded in order: **`.env`** then **`.env.{NODE_ENV}`** (e.g. `.env.development`). Copy the examples and set values as needed.

```bash
cp .env.example .env
# optional: cp .env.development.example .env.development
```

Main variables:

| Variable           | Description                    |
| ------------------ | ------------------------------ |
| `NODE_ENV`         | `development` \| `production` \| `test` |
| `DATABASE_HOST`    | PostgreSQL host                |
| `DATABASE_PORT`    | PostgreSQL port (default 5432) |
| `DATABASE_USER`    | DB user                        |
| `DATABASE_PASSWORD`| DB password                    |
| `DATABASE_NAME`    | DB name                        |
| `APP_URL`          | Allowed CORS origin            |
| `PORT`             | Server port (default 3000)     |

### 3. Database

Start PostgreSQL with Docker Compose (matches default `.env`):

```bash
docker compose up -d
```

Apply schema and generate Prisma Client:

```bash
pnpm prisma:generate
pnpm prisma:push
# or for migrations: pnpm prisma:migrate
```

### 4. Run the app

```bash
pnpm start:dev
```

API: `http://localhost:3000` (or your `PORT`). Versioned routes are under **`/api/v1`** (e.g. `/api/v1/users`, `/api/v1/health`).

## Scripts

| Command           | Description                    |
| ----------------- | ------------------------------ |
| `pnpm start`      | Start (NODE_ENV=development)   |
| `pnpm start:dev`  | Start in watch mode            |
| `pnpm start:prod` | Run production build           |
| `pnpm build`      | Build for production           |
| `pnpm test`      | Unit tests (NODE_ENV=test)     |
| `pnpm test:e2e`  | E2E tests                      |
| `pnpm test:cov`  | Test coverage                  |
| `pnpm lint`      | ESLint (fix)                   |
| `pnpm format`    | Prettier                       |
| `pnpm prisma:generate` | Generate Prisma Client   |
| `pnpm prisma:push`    | Push schema (no migrations) |
| `pnpm prisma:migrate` | Migrate dev               |
| `pnpm prisma:studio`  | Open Prisma Studio        |

## Project structure

```
src/
├── app.module.ts          # Root module
├── main.ts                # Bootstrap, CORS, versioning, ValidationPipe
├── prisma/                # PrismaModule, PrismaService
├── user/                  # User CRUD (controller, service, DTOs)
├── health/                # Health check (Terminus)
└── generated/prisma/      # Generated Prisma Client (do not edit)
prisma/
├── schema.prisma          # Prisma schema
```

## API

- **Versioning:** URI prefix `api/v1` (e.g. `GET /api/v1/users`).
- **Health:** `GET /api/v1/health` (or `/health` if not versioned).
- **Users:** CRUD under `/api/v1/users` (POST, GET, GET :id, PATCH :id, DELETE :id).

## Git hooks (Husky)

- **pre-commit:** lint-staged runs ESLint and Prettier on staged `.ts`/`.tsx` files.
- **commit-msg:** Commitlint enforces [Conventional Commits](https://www.conventionalcommits.org) (e.g. `feat: add x`, `fix: y`). Subject lowercase, header ≤ 100 characters, no trailing period.

## License

UNLICENSED.
