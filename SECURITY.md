# Security Policy

## Supported Versions

Security fixes are applied to the active `main` branch of **EduNexus**.

| Branch | Supported |
| :--- | :---: |
| `main` | Yes |

---

## Built-In Security Architecture

EduNexus applies defense-in-depth practices across the stack:
- **Password Storage**: Async Node.js `crypto.scrypt` memory-hard hashing with random per-user salts, `crypto.timingSafeEqual` verification, and constant-time dummy hashing on unknown accounts.
- **Session Management**: 256-bit cryptographically random tokens stored exclusively as SHA-256 hashes in the `Session` table and delivered via `HttpOnly; SameSite=Lax` cookies (`Secure` in production), with immediate server-side revocation on logout.
- **API Hardening**: `helmet` security headers, Zod input validation, sliding-window rate limiting on auth routes, `Cache-Control: no-store` on authenticated responses, and strict CORS origin checks.
- **Secret Hygiene**: All credentials (`backend/.env`, Turso Database Auth Tokens) are gitignored and never stored in source control.

---

## Reporting a Vulnerability

Please **do not** open a public GitHub issue for security vulnerabilities.

Instead, report security concerns privately by:
1. Opening a private security advisory via the repository's **Security** tab (if enabled), or
2. Emailing the maintainer directly at `mister.nilay.sardar.04042001@gmail.com` with:
   - A clear description of the vulnerability and affected files/endpoints
   - Steps to reproduce or a minimal proof of concept
   - Suggested remediation (if known)

You can expect an initial acknowledgment within 72 hours.
