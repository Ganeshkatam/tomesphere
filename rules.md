# TomeSphere Engineering Rules

## Core Principle
Think about the entire ecosystem before changing any part. Build incrementally, preserve working behavior, prioritize security and reliability, and verify outcomes with evidence.

## 1. System-Wide Engineering
1. Inspect architecture, dependencies, repository state, configuration, and existing behavior before making changes.
2. Consider product strategy, UI/UX, frontend, backend, APIs, databases, security, testing, infrastructure, deployment, observability, and documentation as interconnected layers.
3. Trace changes across APIs, data flows, permissions, performance, compatibility, migrations, deployment, and recovery.
4. Plan complete user outcomes but implement them in small, coherent steps.
5. Preserve independent products and their interfaces, APIs, databases, and business logic unless an explicitly authorized requirement demands otherwise.
6. Avoid unnecessary rewrites, speculative features, unrelated refactoring, and scope expansion.

## 2. Evidence and Verification
7. Establish the actual system state before acting. Validate assumptions with repository evidence, tests, configuration, and runtime behavior.
8. Define acceptance criteria, risks, and verification methods before substantial implementation.
9. Never claim work is complete without verifying its outcome. A file created, test passed, migration written, or deployment succeeded does not prove the entire task is complete.
10. Run relevant unit, integration, security, regression, compatibility, and end-to-end tests according to the change's scope and risk.
11. Verify affected APIs, authorization, validation, data integrity, edge cases, and user journeys.
12. Report changes, tests performed, results, failures, limitations, and unresolved blockers honestly.
13. Never present assumptions as facts or unverified behavior as verified.

## 3. Database and SQL
14. Inspect the target environment, schema, migration history, dependencies, permissions, constraints, and affected application queries before database changes.
15. Evaluate data loss, backward compatibility, security, deployment order, and recovery options.
16. Every SQL change created must reach an explicitly verified outcome. A migration file alone is not completion.
17. Apply SQL to the intended environment when authorized and safe, then verify the actual database state.
18. If application is blocked, document why and keep the work unresolved. Never claim unapplied SQL is complete.
19. Never run staging fixtures or test mutations against production.
20. Destructive or irreversible production operations require explicit authorization, verified scope, and an appropriate recovery plan. Never change production merely to satisfy a checklist.

## 4. Security and Production
21. Apply least privilege, secure configuration, input validation, appropriate authentication and authorization, and privacy-preserving practices.
22. Never expose credentials, tokens, private keys, or secrets in code, logs, commits, reports, or responses.
23. Evaluate relevant access policies, rate limits, environment variables, dependencies, monitoring, and recovery procedures.
24. After deployment, verify application health and relevant runtime behavior. Deployment success alone does not prove system health.
25. Stop and investigate if the target environment, authorization, dependencies, or consequences are uncertain.

## 5. Branching and Repository Policy
26. Before repository changes, inspect the current branch, upstream, working tree, untracked files, recent commits, existing task branches, open pull requests, and relevant implementation.
27. **Do not create branches unnecessarily.** Every new branch must serve a clear engineering purpose.
28. Prefer the current suitable branch for audits, investigation, documentation, and small safe changes.
29. Reuse an existing suitable task branch after verifying its purpose, base, status, pull request, and unrelated changes.
30. Create a dedicated branch only when justified by risk isolation, independent review, parallel work, or a meaningful release or rollback boundary.
31. Follow repository protections and contribution requirements even when they require a separate branch.
32. Never create duplicate branches, commits, or pull requests just to reorganize existing work.
33. Inspect history and existing pull requests before duplicating implementation. Extend, repair, review, or complete existing work when appropriate.
34. Never overwrite or discard another task's work without authorization.
35. Keep branches and pull requests focused, reviewable, tested, and tied to a defined outcome. Branch creation is not completion.

## 6. Architecture and Product Integrity
36. Understand the relationships between TomeSphere, independent products, shared services, APIs, and databases before changing behavior.
37. Avoid unnecessary coupling, duplicate business logic, incompatible contracts, and unplanned dependencies.
38. Consider accessibility, responsiveness, performance, maintainability, and the complete user journey for product changes.
39. Prefer ecosystem-wide improvements over local optimizations that transfer risk or complexity elsewhere.

## 7. Delivery and Documentation
40. Include relevant implementation, testing, security and regression checks, database work, documentation, deployment considerations, and verification.
41. Update documentation when architecture, APIs, behavior, configuration, schemas, or operational procedures change.
42. Record significant decisions, test results, migration and deployment outcomes, limitations, and unresolved risks.
43. Define success before implementation. If required work remains blocked, state the reason, risk, and next action.
44. Reassess the system after meaningful changes before selecting the next step.

## Mandatory Workflow
1. Inspect the repository, branch, environment, and system state.
2. Understand dependencies, interfaces, data flows, permissions, and user journeys.
3. Define the outcome, acceptance criteria, risks, and verification method.
4. Plan the smallest justified change and determine whether a branch is necessary.
5. Implement focused changes while preserving existing behavior.
6. Run relevant tests and verify actual results.
7. Address affected APIs, databases, security, documentation, and deployment.
8. Report verified results and unresolved work.
9. Reassess system integrity before proceeding.

## Final Standard
Understand the whole. Make the smallest justified change. Preserve what works. Protect production. Avoid unnecessary branches. Apply and verify authorized SQL. Test what matters. Report only what evidence supports. Finish responsibly.

**Success means a secure, reliable, coherent, maintainable TomeSphere ecosystem—not maximum code changes, branches, pull requests, or apparent activity.**
