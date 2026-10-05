# OWASP Top 10 Security Review

This document audits StoryNest against the OWASP Top 10 Web Application Security Risks.

| Vulnerability | Status | Mitigation Implemented |
| :--- | :---: | :--- |
| **A01: Broken Access Control** | **PASS** | `requireAuth()` and `requireRole(Role.ADMIN)` check every admin server action and route. Instant session invalidation if `user.isBanned`. |
| **A02: Cryptographic Failures** | **PASS** | Passwords hashed with `bcrypt` (12 rounds). Session cookies signed via JWT HMAC-SHA256 (`AUTH_SECRET`). All cloud DB connections require `sslmode=require`. |
| **A03: Injection (SQL / XSS)** | **PASS** | Prisma parameterized queries prevent SQL injection. `sanitize-html` strict allowlist strips all `<script>`, `<iframe>`, and `<img src>` from user/editor input. |
| **A04: Insecure Design** | **PASS** | No public reader login exists (no credentials to steal). Device ID is a signed random UUID cookie. Mandatory server-side 18+ confirmation before publishing. |
| **A05: Security Misconfiguration**| **PASS** | Security headers configured in `next.config.mjs` (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`). |
| **A06: Vulnerable Dependencies** | **PASS** | Locked versions in `package.json`, regular `npm audit` scanning. |
| **A07: Identification & Auth Failures**| **PASS** | `/admin/login` rate-limited to 5 attempts per 15 minutes per IP. Generic error messages prevent username enumeration. Password reset tokens expire in 1 hour. |
| **A08: Software & Data Integrity**| **PASS** | Cookies are `httpOnly`, `sameSite=lax`, and `secure` in production. |
| **A09: Logging & Monitoring** | **PASS** | AuditLog records all administrative operations (create, update, delete, role change, unpublish). No raw IPs are ever stored (hashed IPs only). |
| **A10: SSRF** | **PASS** | No arbitrary external HTTP requests initiated based on untrusted user parameters. |
