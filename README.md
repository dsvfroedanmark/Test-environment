# Orchestrate

**Approval-first AI orchestration workspace.**

Submit a natural-language request → review a structured execution plan → approve → execute.
No AI connector fires before you approve. Every step is logged and reviewable.

---

## What it does

1. You describe a goal in plain language (e.g. "Create a 90-day social media plan for Naturegrass")
2. The system interprets your request and generates a structured plan:
   - Interpreted goal, deliverables, proposed connectors
   - Ordered execution steps with connector assignment
   - Assumptions and expected outputs
3. You review the plan and approve, request changes, or cancel
4. After approval, the execution engine runs steps through connectors
5. Results are presented in a structured, reviewable format

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Database | PostgreSQL + Prisma |
| Validation | Zod |
| Deployment | Vercel |

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment

```bash
cp .env.example .env
# Edit DATABASE_URL to point to your PostgreSQL instance
```

### 3. Set up the database

```bash
npm run db:push       # Apply schema
npm run db:seed       # Load Naturegrass demo data
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Demo

The seed includes a ready-to-review Naturegrass demo request:

> *"Generate a 90-day plan for SoMe posts for the Facebook and Instagram profile 'Naturegrass'..."*

Go to **Dashboard → open the request → review the plan → approve → execute → see results**.

---

## Project Structure

```
src/
  app/              # Pages + API routes
  lib/
    planner/        # Plan generation (rule-based; swap for AI model)
    connectors/     # Connector abstraction + mock connectors
    execution/      # Execution engine
    types/          # Domain types
    schemas/        # Zod validation
  components/       # React components
prisma/
  schema.prisma     # Data model
  seed.ts           # Demo seed
```

See [CLAUDE.md](./CLAUDE.md) for detailed agent guidance.

---

## Scripts

```bash
npm run dev           # Development server
npm run build         # Production build
npm run type-check    # TypeScript check
npm run lint          # ESLint
npm run db:generate   # Re-generate Prisma client
npm run db:push       # Push schema to DB
npm run db:seed       # Seed demo data
npm run db:studio     # Prisma Studio (DB browser)
```

---

## Safety

- No connector action runs before explicit plan approval
- No content is published without a final confirmation layer
- READ and WRITE actions are clearly separated in code and UI
- Every step is persisted and auditable
