# CLAUDE.md

## Project Overview
This project is an approval-first AI orchestration web app.

A user submits a natural-language request.
The system:
1. interprets the request,
2. proposes an execution plan,
3. asks for user approval,
4. only then executes via selected connectors,
5. returns structured outputs.

This product is not just a chat interface.
It is a planning, orchestration, and execution environment.

---

## Core Product Principles

### 1. Approval first
Never design flows where the system silently acts before showing the plan.
The system must explain intended execution before taking action.

### 2. Transparent orchestration
Users should always be able to see:
- what the system understood,
- which connectors are proposed,
- why each connector is being used,
- what steps will run,
- what outputs are expected.

### 3. Safe by default
No sending, posting, publishing, or destructive actions without explicit final confirmation.

### 4. Planning and execution are separate concerns
The codebase should clearly separate:
- request intake
- planning
- approval
- execution
- results rendering

### 5. Production connectors live in the app backend
Never design runtime behavior that depends on a local Claude Code session, local MCP configuration, or developer machine state.

---

## Tech Preferences
Prefer:
- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Prisma
- PostgreSQL
- Zod

Prioritize:
- strong typing
- modular code
- pragmatic architecture
- clean extension points
- readable code over clever code

---

## Architecture Rules

### Domain separation
Keep the codebase organized by responsibility:
- domain models
- planner
- execution engine
- connectors
- persistence
- UI

### Connector abstraction
All connectors should follow a shared typed contract.

Connectors should describe:
- identity
- capabilities
- auth requirements
- action mode
- execution interface

### Planner contract
Planner output must be strongly typed and schema-validated.
Prefer Zod schemas for request parsing and execution plan validation.

### Execution engine
The execution engine should:
- run steps in order
- track state
- collect outputs
- store structured step results
- handle failures predictably

### UI behavior
The UI should present information in structured views:
- cards
- steps
- tables
- result sections
- statuses

Avoid relying on long unstructured chat transcripts as the primary UX.

---

## Safety Rules
Treat actions in two categories:

### Read actions
Examples:
- inspect public web pages
- retrieve profile metadata
- analyze existing content

### Write actions
Examples:
- send emails
- publish social posts
- create campaigns
- modify records

Write actions must always require explicit final approval.

Do not blur the line between read and write in code or UI.

---

## Implementation Guidance

### Build in phases
Do not try to solve everything at once.
Start with a clean MVP that proves:
- request intake
- plan generation
- approval flow
- connector routing
- execution tracking
- structured results

### Prefer mock implementations first
Mock connectors and mock planner behavior are acceptable for initial scaffolding, as long as the interfaces are production-ready.

### Keep functions small
Prefer small, typed, testable modules over large files.

### Avoid premature async complexity
The first execution engine can be sequential.
Design for future background jobs, but do not introduce queues unless needed.

---

## Expected Initial Features
The MVP should include:
- dashboard
- new request flow
- plan review
- execution view
- results view
- connector settings
- Prisma schema
- mock planner
- mock connectors
- execution engine
- seeded Naturegrass demo flow

---

## File / Folder Conventions
Prefer:
- `src/app` for routes
- `src/components` for UI
- `src/lib` for shared modules
- `src/lib/planner` for planning logic
- `src/lib/execution` for run logic
- `src/lib/connectors` for connector abstractions and implementations
- `src/lib/db` for DB access
- `src/lib/schemas` for Zod schemas
- `src/lib/types` for domain types if needed
- `prisma` for Prisma schema and seeds

Keep UI concerns separate from domain logic.

---

## Coding Style
- Use TypeScript strictly
- Use descriptive names
- Avoid unnecessary comments
- Comment only when intent is not obvious
- Avoid large files when possible
- Keep business logic out of UI components
- Prefer server-side modules for orchestration logic

---

## Before Major Changes
Before large implementation steps or refactors:
1. explain the intended change,
2. outline affected areas,
3. then implement.

---

## After Major Changes
After major changes:
- run lint
- run typecheck
- fix issues introduced
- summarize what changed

---

## Long-Term Direction
The long-term platform should support:
- connector management
- plan approval
- execution logs
- output artifacts
- auditability
- future real integrations for Browser, Outlook, Anthropic, Gemini, Mailchimp, Instagram, Facebook, and LinkedIn

Optimize for that direction without overbuilding the MVP.
