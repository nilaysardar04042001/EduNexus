# EduNexus — Learn • Practice • Create • Excel

**EduNexus** is a full-stack learning and practice platform organized as a clean `Frontend/` + `backend/` project built with **React 19**, **TypeScript**, **Tailwind CSS v4**, **Vite 8**, **Express 5**, **Prisma 6**, and **Turso Cloud (libSQL)** (with automatic local SQLite fallback).

---

## Project Structure

```text
EduNexus/
├── Frontend/                  # React 19 + Vite 8 + TypeScript + Tailwind CSS v4
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts         # Proxies /api -> http://localhost:4000
│   ├── tsconfig*.json
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── index.css
│       └── vite-env.d.ts
├── backend/                   # Express 5 + TypeScript + Prisma 6 + Turso libSQL
│   ├── .env                   # Local secrets (gitignored)
│   ├── package.json
│   ├── prisma/                # Relational schema, SQL migrations, Turso runner & seed
│   └── src/                   # API routes (health, auth, courses, platform, progress)
├── scripts/
│   └── dev.mjs                # Starts Frontend + Backend concurrently with prefixed logs
├── .oxlintrc.json             # Strict workspace Oxlint configuration (157 rules)
└── package.json               # Root monorepo scripts
```

---

## Quick Start

### 1. Install Dependencies (Frontend + Backend)
```powershell
npm run install:all
```

### 2. Configure Backend Environment
Copy [`backend/.env.example`](./backend/.env.example) to `backend/.env` and provide your Turso URL and **Database Auth Token** (or leave `TURSO_AUTH_TOKEN` empty to use local SQLite `backend/prisma/dev.db`).

### 3. Generate Prisma Client, Migrate & Seed
```powershell
npm run db:setup
```

### 4. Run Both Frontend & Backend Together
```powershell
npm run dev
```
- **Frontend**: `http://localhost:5173/` (proxies `/api/*` → `http://localhost:4000`)
- **Backend API**: `http://localhost:4000/api`

---

## Available Root Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` / `npm run dev:all` | Start **both** Frontend (`Frontend/`) and Backend (`backend/`) simultaneously |
| `npm run dev:frontend` | Start Vite frontend dev server only |
| `npm run dev:backend` | Start Express + TypeScript backend only (`tsx watch`) |
| `npm run build` / `npm run build:frontend` | Strict TypeScript check (`tsc -b`) and production Vite build (`Frontend/dist`) |
| `npm run build:backend` | Compile backend TypeScript to `backend/dist/` |
| `npm run build:all` | Build both Frontend and Backend |
| `npm run lint` | Run Oxlint across `Frontend/`, `backend/`, and `scripts/` |
| `npm run install:all` | Install dependencies for both `Frontend/` and `backend/` |
| `npm run db:setup` | Generate Prisma Client, apply Turso migrations, and seed database |
| `npm run db:migrate:turso` | Apply pending SQL migrations to Turso Cloud |
| `npm run db:seed` | Seed courses, modules, lessons, and practice questions |
| `npm run db:studio` | Open Prisma Studio |
