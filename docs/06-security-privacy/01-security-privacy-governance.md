# TomeSphere — Security, Privacy & Data Governance

**Document Type:** Security Policy & Governance Specification  
**Owner:** Security Lead / Systems Architect  
**Status:** Draft  
**Last Reviewed:** 2026-10-24  
**Dependencies:** `docs/04-architecture/01-system-architecture-boundaries.md`  

---

## 1. Security Philosophy & Invariants

TomeSphere enforces a **defense-in-depth, secure-by-default** posture across its public web frontend, API server, and persistence tiers.

### Core Invariants: What Must NEVER Happen
1. **Never Trust Client Claims**: The server and database must never trust client-asserted permissions, user IDs, or role headers.
2. **Never Expose Secrets in Client Bundles**: Database service role keys, admin secrets, and private environment variables must never be prefixed with `NEXT_PUBLIC_` or shipped in client-side JavaScript.
3. **Never Allow Public Table Mutations Without Server Authorization**: Public anonymous visitors must never have direct `INSERT`, `UPDATE`, or `DELETE` access to catalog tables (`projects`, `profile`, `skills`).
4. **Never Log Sensitive Credentials**: Passwords, tokens, authorization headers, or private contact details must never be written to stdout or application log files.
5. **Never Present Unverified User or Activity Claims**: Metrics and popularity signals must be authenticated from authoritative sources.

---

## 2. Threat Model & Mitigation Matrix

| Threat Category | Potential Impact | Implemented Mitigation | Verification Mechanism |
| :--- | :--- | :--- | :--- |
| **Unauthorized Catalog Mutation** | Malicious alteration of product links or defacement. | Database Row Level Security (RLS) revokes all public `INSERT/UPDATE/DELETE` privileges. Backend routes require `x-admin-key` or `Bearer` token. | `tests/security.test.js`: `anonymous client cannot insert into projects` |
| **Admin Credential Timing Attack** | Secret extraction via timing discrepancies in string comparisons. | `server/auth/admin-auth.js` uses `crypto.timingSafeEqual` over fixed-length buffer hashes. | `tests/security.test.js`: `Security: Admin Authorization Guard` |
| **SQL Injection & ORM Escapes** | Database exfiltration or data corruption. | All queries use parameterized queries through `@supabase/supabase-js` postgrest client and sanitized query builders. | Database trigger search paths locked (`SET search_path = public`). |
| **Cross-Site Scripting (XSS)** | Execution of malicious script in user browser. | React 19 JSX auto-escaping; strict boundary validation on strings (`char_length` bounds in RLS and validators). | Input validation in `project.validator.js` and `guestbook.validator.js`. |
| **Spam & Flooding in Guestbook / Inquiries** | Denial of service or public spam propagation. | Guestbook entries default to `status = 'pending'` and are hidden until admin approval. Strict RLS length limits enforced. | `tests/security.test.js`: `anonymous client cannot insert pre-approved guestbook entries`. |
| **Data Leakage of Private Contacts** | Exposure of visitor email addresses or inquiry messages. | `public.contacts` table has `REVOKE SELECT` for anon/authenticated roles. Only admin API endpoint can query contacts. | `tests/security.test.js`: `anonymous client cannot read contact inquiries`. |
| **Accidental Preview Deployment Leak** | Non-production branches indexed by search engines. | `vercel.json` configures `ignoreCommand` to skip preview deployments on non-production branches. | `tests/security.test.js`: `ignoreCommand skips preview builds`. |

---

## 3. Access Control & Authorization Architecture

### 3.1 Public Layer (Unauthenticated Visitors)
- **Permissions**: Read-only access to published products (`status = 'Live'`), approved guestbook entries (`status = 'approved'`), and public profile info.
- **Write Access**: Restricted to inserting pending guestbook notes and contact inquiries with strict size boundaries.

### 3.2 Administrative Layer (Ecosystem Maintainers)
- **Authentication**: Validated via HTTP headers:
  - `x-admin-key: <ADMIN_SECRET>` OR
  - `Authorization: Bearer <ADMIN_SECRET>`
- **Validation Logic** (`server/auth/admin-auth.js`):
  ```javascript
  const inputHash = crypto.createHash('sha256').update(candidateSecret).digest();
  const secretHash = crypto.createHash('sha256').update(configuredSecret).digest();
  return crypto.timingSafeEqual(inputHash, secretHash);
  ```
- **Privileges**: Full CRUD access over products, contact inquiry triage, guestbook approval, and profile management.

---

## 4. Database Security & Row Level Security (RLS)

All tables in the Supabase PostgreSQL database have RLS permanently enabled:

```sql
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guestbook ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
```

### Table Privilege Breakdown

| Table | `anon` / `authenticated` Roles | Service Role / Admin Backend |
| :--- | :--- | :--- |
| `projects` | `SELECT` (WHERE `status = 'Live'`) | Full `SELECT`, `INSERT`, `UPDATE`, `DELETE` |
| `profile` | `SELECT` (Public details) | Full `SELECT`, `UPDATE` |
| `skills` | `SELECT` (Public list) | Full `SELECT`, `INSERT`, `UPDATE`, `DELETE` |
| `guestbook` | `SELECT` (WHERE `status = 'approved'`), `INSERT` (`status = 'pending'`) | Full Moderation & Management |
| `contacts` | `INSERT` (Write-only, `status = 'unread'`) | Full Read & Triage |

---

## 5. Privacy, Telemetry & Data Retention

1. **User Tracking Policy**: TomeSphere does not deploy third-party advertising cookies, cross-site trackers, or invasive session fingerprinting.
2. **Aggregated Analytics**: Web analytics are collected anonymously via privacy-focused tools (Vercel Analytics) without recording personally identifiable information (PII).
3. **Contact Inquiry Retention**: Contact form submissions are retained in `public.contacts` solely for operational customer response. Inquiries older than 180 days are subject to administrative pruning.
4. **Guestbook Moderation**: Submissions containing hate speech, personal telephone numbers, spam URLs, or abusive content are rejected or purged by administrators.

---

## 6. Three-Tier Status Classification

### 6.1 Verified Current State
- Row Level Security active and verified across all tables in Supabase (`supabase/migrations/20261023000000_init_tomesphere_schema.sql`).
- Timing-safe admin authorization guard implemented in `server/auth/admin-auth.js`.
- Security test suite passing with 29 automated assertions in `tests/security.test.js`.
- Vercel preview deployment suppression active in `vercel.json`.

### 6.2 Approved Decisions
- Admin secrets must be injected strictly through container environment variables (`ADMIN_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`) and never committed to source control.
- In Phase 2, any newly created API route for products (e.g. `/api/v1/projects/slug/:slug`) must inherit the exact public read-only constraints (`status = 'Live'`).

### 6.3 Proposals (Subject to Further Review)
- Implement automated monthly data retention cleanup job in PostgreSQL to purge contact inquiries older than 180 days.
- Add Content Security Policy (CSP) headers to the Next.js frontend to restrict script execution domains.
