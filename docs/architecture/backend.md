# \# Backend Architecture

#

# \## Purpose

#

# This document defines the backend architecture of TomeSphere.

#

# It establishes how server-side responsibilities are organized, how data flows through the application, how business logic is structured, and the engineering standards for building secure, scalable, and maintainable backend functionality.

#

# The backend follows a \*\*server-first\*\*, \*\*domain-driven\*\* architecture built on Next.js App Router and Supabase.

#

# \---

#

# \# Technology Stack

#

# Framework

#

# \- Next.js App Router

#

# Runtime

#

# \- Node.js

#

# Language

#

# \- TypeScript

#

# Database

#

# \- PostgreSQL (Supabase)

#

# Authentication

#

# \- Supabase Auth

#

# Storage

#

# \- Supabase Storage

#

# Validation

#

# \- Zod

#

# Deployment

#

# \- Vercel

#

# \---

#

# \# Backend Philosophy

#

# The backend follows these principles:

#

# 1\. Server-first rendering.

# 2\. Domain-driven business logic.

# 3\. Thin routing layer.

# 4\. Explicit validation.

# 5\. Least-privilege authorization.

# 6\. Strong typing across every layer.

#

# Business rules belong to domain modules—not routes.

#

# \---

#

# \# Backend Layers

#

# ```

# Route

#

# ↓

#

# Screen

#

# ↓

#

# Server Action

#

# ↓

#

# Domain Service

#

# ↓

#

# Repository

#

# ↓

#

# Supabase

# ```

#

# Each layer has a single responsibility.

#

# \---

#

# \# Responsibilities

#

# \## App Router

#

# Responsible for:

#

# \- routing

# \- metadata

# \- redirects

# \- layouts

# \- loading states

# \- error boundaries

#

# Never place business logic here.

#

# \---

#

# \## Server Components

#

# Responsible for:

#

# \- loading data

# \- composing screens

# \- rendering UI

#

# Should never contain mutation logic.

#

# \---

#

# \## Server Actions

#

# Responsible for:

#

# \- validation

# \- authorization

# \- business orchestration

# \- database mutations

#

# Every write operation should pass through a Server Action.

#

# \---

#

# \## Domain Services

#

# Responsible for:

#

# \- business rules

# \- calculations

# \- orchestration

# \- invariants

#

# Services must not contain presentation logic.

#

# \---

#

# \## Repositories

#

# Responsible for:

#

# \- database interaction

# \- persistence

# \- mapping

#

# Repositories isolate Supabase from business logic.

#

# \---

#

# \# Domain Structure

#

# ```

# modules/

#

# reading/

#

# learning/

#

# platform/

#

# shared/

# ```

#

# Each domain owns:

#

# \- actions

# \- services

# \- repositories

# \- types

# \- validation

# \- presentation

#

# Example

#

# ```

# books/

#

# actions/

#

# services/

#

# repositories/

#

# types/

#

# validation/

#

# presentation/

# ```

#

# \---

#

# \# Request Lifecycle

#

# ```

# Browser

#

# ↓

#

# Server Component

#

# ↓

#

# Server Action

#

# ↓

#

# Validation

#

# ↓

#

# Authorization

#

# ↓

#

# Domain Service

#

# ↓

#

# Repository

#

# ↓

#

# Supabase

#

# ↓

#

# Response

# ```

#

# Business logic should never bypass this flow.

#

# \---

#

# \# Rendering Strategy

#

# Default

#

# Server Components

#

# Use Client Components only when browser APIs or interactivity require them.

#

# \---

#

# \# Authentication

#

# Authentication is managed by Supabase.

#

# Every protected request must verify the authenticated user.

#

# Never trust:

#

# \- client IDs

# \- client roles

# \- client ownership

#

# Always derive identity from the authenticated session.

#

# \---

#

# \# Authorization

#

# Authorization is enforced at multiple layers.

#

# 1\. Route protection

# 2\. Server Action

# 3\. Database RLS

#

# Never rely on frontend restrictions alone.

#

# \---

#

# \# Validation

#

# All external input must be validated.

#

# Validation occurs before business logic.

#

# Example

#

# ```

# Request

#

# ↓

#

# Zod Schema

#

# ↓

#

# Server Action

#

# ↓

#

# Service

# ```

#

# Never trust:

#

# \- forms

# \- URL parameters

# \- query strings

# \- JSON payloads

#

# \---

#

# \# Error Handling

#

# Errors should be structured.

#

# ```

# ValidationError

#

# AuthorizationError

#

# NotFoundError

#

# ConflictError

#

# InternalError

# ```

#

# Avoid exposing internal implementation details.

#

# User-facing messages should remain safe and understandable.

#

# \---

#

# \# Database Access

#

# All database operations pass through repositories.

#

# Never scatter Supabase queries throughout components.

#

# Example

#

# ```

# BookService

#

# ↓

#

# BookRepository

#

# ↓

#

# Supabase

# ```

#

# This keeps persistence isolated.

#

# \---

#

# \# Transactions

#

# Use database transactions whenever operations modify multiple related entities.

#

# Examples

#

# \- creating collections

# \- deleting books with dependent records

# \- updating reading progress and statistics

#

# Business consistency is more important than minimizing queries.

#

# \---

#

# \# File Storage

#

# Supabase Storage is responsible for:

#

# \- book covers

# \- PDFs

# \- EPUB files

# \- avatars

#

# Database tables should store references—not binary content.

#

# \---

#

# \# Reader Backend

#

# The Reader owns:

#

# \- progress

# \- bookmarks

# \- highlights

# \- annotations

# \- reading sessions

#

# Reading state is synchronized through dedicated reader services.

#

# The Reader should remain independent of learning features.

#

# \---

#

# \# Learning Backend

#

# Learning builds on Reading.

#

# Examples

#

# \- notes

# \- flashcards

# \- citations

# \- vocabulary

# \- practice tests

#

# Learning entities should reference books rather than duplicate book data.

#

# \---

#

# \# Background Jobs

#

# Background tasks should be isolated from request handling.

#

# Examples

#

# \- recommendation generation

# \- statistics aggregation

# \- activity processing

# \- notification scheduling

#

# Long-running work should never block user requests.

#

# \---

#

# \# Scheduling

#

# Scheduled jobs should execute through cron or background workers.

#

# Current examples include:

#

# \- activity processing

# \- recommendation refresh

# \- analytics aggregation

#

# Scheduled logic must be idempotent.

#

# \---

#

# \# Caching

#

# Prefer cache hierarchy:

#

# 1\. Next.js Route Cache

# 2\. Data Cache

# 3\. Database

#

# Invalidate only affected resources.

#

# Avoid global cache invalidation.

#

# \---

#

# \# Revalidation

#

# After mutations, revalidate only impacted routes.

#

# Examples

#

# ```

# Library

#

# Book

#

# Profile

#

# Personal Center

# ```

#

# Do not revalidate unrelated pages.

#

# \---

#

# \# Logging

#

# Application logs should include:

#

# \- timestamp

# \- operation

# \- authenticated user (where appropriate)

# \- duration

# \- result

#

# Sensitive information must never be logged.

#

# \---

#

# \# Observability

#

# Monitor:

#

# \- request duration

# \- database latency

# \- cache hit rates

# \- error rates

# \- background job failures

#

# Production systems should be observable.

#

# \---

#

# \# Security

#

# Follow Zero Trust principles.

#

# Requirements:

#

# \- validate all input

# \- authorize every mutation

# \- enforce RLS

# \- sanitize outputs

# \- protect secrets

# \- use HTTPS

# \- prevent privilege escalation

#

# \---

#

# \# Performance

#

# Prioritize:

#

# \- Server Components

# \- streaming

# \- minimal client JavaScript

# \- batched queries

# \- pagination

# \- optimized indexes

#

# Avoid:

#

# \- N+1 queries

# \- unnecessary database calls

# \- duplicate fetching

#

# \---

#

# \# Concurrency

#

# Mutations should be safe under concurrent access.

#

# Examples

#

# \- reading progress

# \- likes

# \- collections

# \- recommendations

#

# Use database constraints where possible instead of application-only checks.

#

# \---

#

# \# API Routes

#

# Use Route Handlers only when necessary.

#

# Examples:

#

# \- webhooks

# \- file uploads

# \- external integrations

# \- cron endpoints

#

# Internal application mutations should prefer Server Actions.

#

# \---

#

# \# External Services

#

# External providers should be wrapped behind services.

#

# Never call third-party APIs directly from presentation code.

#

# Example

#

# ```

# RecommendationService

#

# ↓

#

# OpenAIService

#

# ↓

#

# External API

# ```

#

# This keeps integrations replaceable.

#

# \---

#

# \# Configuration

#

# Configuration belongs in environment variables.

#

# Never hardcode:

#

# \- API keys

# \- database URLs

# \- secrets

# \- storage credentials

#

# Validate required configuration during startup.

#

# \---

#

# \# Dependency Rules

#

# Allowed

#

# ```

# Route

#

# ↓

#

# Server Action

#

# ↓

#

# Service

#

# ↓

#

# Repository

#

# ↓

#

# Database

# ```

#

# Not allowed

#

# ```

# Repository

#

# ↓

#

# Server Action

# ```

#

# or

#

# ```

# Presentation

#

# ↓

#

# Supabase

# ```

#

# Dependencies must remain acyclic.

#

# \---

#

# \# Engineering Standards

#

# Always

#

# \- validate input

# \- authorize access

# \- use repositories

# \- keep actions thin

# \- colocate backend logic with its domain

# \- return typed results

# \- handle failures explicitly

#

# Never

#

# \- perform writes inside Server Components

# \- expose database details to UI

# \- bypass validation

# \- bypass authorization

# \- duplicate business rules

# \- scatter Supabase queries across the codebase

#

# \---

#

# \# Backend Review Checklist

#

# Before merging backend code, verify:

#

# \- Does it belong to the correct domain?

# \- Is validation performed first?

# \- Is authorization enforced?

# \- Is business logic inside services?

# \- Is persistence isolated in repositories?

# \- Are types shared correctly?

# \- Are routes thin?

# \- Are queries efficient?

# \- Is RLS respected?

# \- Is the implementation observable and testable?
