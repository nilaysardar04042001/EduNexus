# EduNexus — Learn • Practice • Create • Excel

[![License: MIT](https://img.shields.io/badge/License-MIT-cyan.svg)](./LICENSE)
[![CI](https://github.com/nilaysardar04042001/EduNexus/actions/workflows/ci.yml/badge.svg)](https://github.com/nilaysardar04042001/EduNexus/actions/workflows/ci.yml)
![React 19](https://img.shields.io/badge/React-19-149eca)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178c6)
![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-06b6d4)
![Express 5](https://img.shields.io/badge/Express-5-0f172a)
![Turso libSQL](https://img.shields.io/badge/Database-Turso_libSQL-10b981)

**EduNexus** is a modern full-stack learning and practice platform structured as a clean `Frontend/` + `backend/` monorepo, powered by **React 19**, **Vite 8**, **TypeScript (`strict`)**, **Tailwind CSS v4**, **Express 5**, **Prisma 6**, and **Turso Cloud (`libSQL`)** with automatic local SQLite fallback.

---

## Project Structure

```text
EduNexus/
├── .github/
│   ├── ISSUE_TEMPLATE/        # Structured Bug Report & Feature Request YAML forms
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── workflows/ci.yml       # Automated GitHub Actions CI (lint + full build)
├── Frontend/                  # React 19 + Vite 8 + TypeScript + Tailwind CSS v4
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts         # Proxies /api -> http://localhost:4000
│   ├── tsconfig*.json
│   └── src/
│       ├── components/        # Modular Navbar & Header UI primitives
│       ├── App.tsx
│       ├── main.tsx
│       └── index.css
├── backend/                   # Express 5 + TypeScript + Prisma 6 + Turso libSQL
│   ├── .env.example           # Environment variable template
│   ├── package.json
│   ├── prisma/                # 10-model schema, SQL migrations, Turso runner & seed
│   └── src/                   # Routes: /health, /auth, /courses, /platform, /progress
├── scripts/
│   └── dev.mjs                # Starts Frontend + Backend concurrently with prefixed logs
├── .oxlintrc.json             # Strict workspace Oxlint configuration (157 rules)
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── LICENSE                    # MIT License
├── SECURITY.md
└── package.json               # Root monorepo scripts
```

---

## Quick Start

### 1. Install Dependencies
```powershell
npm run install:all
```

### 2. Configure Backend Environment
Copy [`backend/.env.example`](./backend/.env.example) to `backend/.env` and add your Turso `TURSO_DATABASE_URL` and **Database Auth Token** (or leave `TURSO_AUTH_TOKEN` empty to run against local SQLite `backend/prisma/dev.db`).

### 3. Generate Prisma Client, Migrate & Seed
```powershell
npm run db:setup
```

### 4. Start Frontend & Backend Together
```powershell
npm run dev
```
- **Frontend**: `http://localhost:5173/` (proxies `/api/*` → `http://localhost:4000`)
- **Backend API**: `http://localhost:4000/api`

---

## Backend API Overview

| Method & Endpoint | Description |
| :--- | :--- |
| `GET /api/health` | Live database probe (`turso-libsql` or `local-sqlite`), latency, and row counts |
| `POST /api/auth/register` | Register a new learner account (`scrypt` hash + `HttpOnly` DB session cookie) |
| `POST /api/auth/login` | Constant-time credential verification and session creation |
| `POST /api/auth/logout` | Server-side session revocation and cookie cleanup |
| `GET /api/auth/me` | Retrieve current authenticated user session |
| `PATCH /api/auth/me` | Update display name and daily study goal |
| `GET /api/courses` | List published courses (`?featured=`, `?pillar=`, `?level=`, `?search=`) |
| `GET /api/courses/:slug` | Full course detail including modules, lessons, and practice questions |
| `GET /api/platform/stats` | Aggregated live catalog metrics, difficulty breakdown, and course workloads |
| `GET /api/progress/:slug` | Retrieve signed-in learner's completed lessons for a course |
| `PUT /api/progress/lessons/:lessonId` | Persist lesson completion and recalculate enrollment progress |

---

## Available Root Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` / `npm run dev:all` | Start **both** Frontend (`Frontend/`) and Backend (`backend/`) simultaneously |
| `npm run dev:frontend` | Start Vite frontend dev server only |
| `npm run dev:backend` | Start Express + TypeScript backend only (`tsx watch`) |
| `npm run build` / `npm run build:frontend` | Strict TypeScript check (`tsc -b`) and Vite production build (`Frontend/dist`) |
| `npm run build:backend` | Compile backend TypeScript to `backend/dist/` |
| `npm run build:all` | Build both Frontend and Backend |
| `npm run lint` | Run Oxlint across `Frontend/`, `backend/`, and `scripts/` (157 rules) |
| `npm run install:all` | Install dependencies for both `Frontend/` and `backend/` |
| `npm run db:setup` | Generate Prisma Client, apply Turso migrations, and seed database |
| `npm run db:migrate:turso` | Apply pending SQL migrations to Turso Cloud |
| `npm run db:seed` | Idempotently seed courses, modules, lessons, and practice questions |
| `npm run db:studio` | Open Prisma Studio |

---

## Community & Governance
- **Contributing**: See [CONTRIBUTING.md](./CONTRIBUTING.md)
- **Code of Conduct**: See [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)
- **Security Policy**: See [SECURITY.md](./SECURITY.md)
- **License**: Released under the [MIT License](./LICENSE)
