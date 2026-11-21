# Contributing to EduNexus

Thank you for your interest in contributing to **EduNexus** (*Learn • Practice • Create • Excel*)! This guide covers setting up your local environment, running quality checks, and opening clean pull requests.

---

## Local Development Setup

1. **Fork & Clone**
   ```bash
   git clone https://github.com/nilaysardar04042001/EduNexus.git
   cd EduNexus
   ```

2. **Install Dependencies (Frontend + Backend)**
   ```bash
   npm run install:all
   ```

3. **Configure Environment**
   Copy `backend/.env.example` to `backend/.env`.
   - Leave `TURSO_AUTH_TOKEN` empty to develop against local SQLite (`backend/prisma/dev.db`), or set your Turso `TURSO_DATABASE_URL` and Database Auth Token.
   - **Never commit `backend/.env` or any credentials.**

4. **Initialize Database & Seed Data**
   ```bash
   npm run db:setup
   ```

5. **Run Frontend & Backend Together**
   ```bash
   npm run dev
   ```
   - Frontend: `http://localhost:5173/`
   - Backend API: `http://localhost:4000/api`

---

## Code Quality & Standards

Before opening a pull request, make sure every check passes with **0 warnings and 0 errors**:

```bash
npm run lint
npm run build:all
```

### Guidelines
- **TypeScript**: Keep `strict: true` clean across both `Frontend/` and `backend/` (avoid `any`).
- **Styling**: Use canonical Tailwind CSS v4 utility classes and respect `prefers-reduced-motion`.
- **Accessibility**: Prefer native semantic HTML (`<nav>`, `<header>`, `<main>`, `<dialog>`, `<button>`, `<output>`) with keyboard focus support.
- **Performance**: Avoid unnecessary re-renders, heavy `backdrop-filter` passes, or uncached repeated database queries.

---

## Pull Request Process

1. Create a descriptive branch from `main` (e.g., `feat/course-catalog`, `fix/auth-cookie`).
2. Keep commits focused and well-scoped.
3. Fill out the pull request template with a clear summary and verification notes.
4. Ensure GitHub Actions CI passes cleanly before requesting review.
