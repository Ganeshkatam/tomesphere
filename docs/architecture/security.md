# Security Architecture

## Purpose

This document defines TomeSphere's security architecture, trust boundaries, authentication model, authorization strategy, and engineering standards for protecting user data and platform resources.

Security is enforced through a defense-in-depth approach where every layer independently validates requests.

---

# Security Philosophy

TomeSphere follows a Zero Trust model.

Principles:

- Never trust client input.
- Authenticate every request.
- Authorize every resource.
- Validate every input.
- Encrypt sensitive data.
- Minimize privilege.
- Log security events.

Security should never depend on frontend behavior.

---

# Trust Boundaries

```
Browser

↓

Next.js Server

↓

Domain Services

↓

Repository

↓

Supabase

↓

Storage
```

Every boundary verifies incoming data independently.

---

# Authentication

Provider

- Supabase Auth

Supported methods

- Email & Password
- OAuth Providers (future)
- Magic Links (future)
- Passkeys (future)

Authentication establishes identity only.

It does not grant permissions.

---

# Session Management

Sessions are managed by Supabase.

Requirements

- Secure cookies
- Automatic refresh
- Session expiration
- Revocation support

Never store authentication tokens in localStorage.

---

# Authorization

Authorization is enforced at three layers.

```
Server Action

↓

Repository

↓

Row-Level Security
```

Every mutation must verify ownership.

Example

```
User

↓

Own Notes

↓

Own Reading Progress

↓

Own Collections
```

Users must never access another user's private resources.

---

# Row-Level Security

Every public table must have RLS enabled.

Requirements

- SELECT policy
- INSERT policy
- UPDATE policy
- DELETE policy

Policies should reference:

```
auth.uid()
```

Never trust IDs supplied by the client.

---

# Input Validation

Every external input is validated.

Sources include:

- forms
- URL parameters
- query strings
- headers
- JSON payloads
- uploaded files

Validation occurs before business logic.

---

# Output Encoding

User-generated content must be safely rendered.

Prevent:

- Cross-Site Scripting (XSS)
- HTML injection
- Script injection

Never render raw HTML unless it has been explicitly sanitized.

---

# CSRF Protection

Mutations must originate from trusted requests.

Server Actions and secure cookies reduce CSRF exposure.

Avoid custom mutation endpoints unless necessary.

---

# XSS Prevention

Requirements

- React escaping
- CSP
- Sanitized rich text
- Safe markdown rendering

Never use:

```
dangerouslySetInnerHTML
```

without sanitization.

---

# Content Security Policy

Recommended policy:

- self for scripts
- trusted image origins
- trusted font sources
- restricted frame ancestors

Third-party origins should be explicitly allowed.

Avoid wildcard policies.

---

# File Security

Uploaded files require:

- MIME validation
- size limits
- extension validation
- ownership checks

Files should never execute as code.

---

# Storage Security

Supabase Storage buckets should use the least permissive access model.

Examples

Public

- book covers

Private

- avatars
- uploaded documents
- user attachments

Access should be mediated through authenticated requests.

---

# Secrets Management

Secrets belong only in environment variables.

Examples

- Supabase Service Key
- API Keys
- OAuth Secrets

Never commit secrets to source control.

Never expose server secrets to the client.

---

# Password Security

Passwords are handled exclusively by Supabase Auth.

The application should never:

- hash passwords
- compare passwords
- store passwords

---

# Multi-Factor Authentication

Future support includes:

- TOTP
- Passkeys
- Security Keys

Security settings belong under:

```
/me/security
```

---

# Rate Limiting

Protect against:

- login abuse
- brute-force attacks
- API abuse
- search spam

Rate limiting should occur before expensive operations.

---

# Abuse Prevention

Monitor for:

- excessive requests
- automated scraping
- unusual login activity
- repeated failures

Suspicious behavior should be logged.

---

# Logging

Security logs should record:

- login events
- logout events
- password changes
- MFA changes
- failed authorization
- suspicious activity

Never log:

- passwords
- tokens
- secrets
- personal credentials

---

# Privacy

Collect only required information.

Store only necessary data.

Respect user deletion requests.

Minimize personally identifiable information.

---

# Encryption

In Transit

HTTPS only.

At Rest

Managed by Supabase.

Sensitive secrets remain encrypted.

---

# Dependency Security

Requirements

- regular dependency updates
- vulnerability scanning
- lockfile verification

Do not ignore critical security advisories.

---

# Security Headers

Recommended headers:

- Content-Security-Policy
- Strict-Transport-Security
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy
- X-Frame-Options

---

# Audit Trail

Important events should be auditable.

Examples

- profile updates
- security changes
- permission changes
- account deletion
- administrative actions

Audit records should be append-only.

---

# Incident Response

When a security issue is detected:

1. Contain.
2. Investigate.
3. Patch.
4. Verify.
5. Document.

Every incident should result in an architectural review.

---

# Security Review Checklist

Before merging security-sensitive code, verify:

- Is authentication required?
- Is authorization enforced?
- Is all input validated?
- Is output safely encoded?
- Is RLS protecting the data?
- Are secrets isolated?
- Are files validated?
- Are security events logged?
- Are dependencies up to date?
- Does the implementation follow least privilege?
