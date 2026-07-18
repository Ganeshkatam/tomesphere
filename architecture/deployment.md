# Deployment & Verification Guidelines

TomeSphere is configured for serverless deployment on Vercel.

## 1. Build Verification
Before merging PRs, ensure that:
1. TypeScript compiles with 0 errors:
   ```bash
   npx tsc --noEmit
   ```
2. Lint check passes:
   ```bash
   npm run lint
   ```
3. Production build compiles successfully:
   ```bash
   npm run build
   ```

## 2. Static and Dynamic Routes
- Marketing pages (`about`, `careers`, `terms`, `privacy`) compile as static pages.
- Authenticated app screens (`home`, `library`, `reader`) compile as dynamic routes utilizing Supabase server SSR logic.
