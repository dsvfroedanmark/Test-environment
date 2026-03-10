// Auth placeholder — replace with real auth (NextAuth, Clerk, etc.) in Phase 3.
// For now the app uses a single default workspace with no authentication.

export const DEFAULT_WORKSPACE_ID =
  process.env.DEFAULT_WORKSPACE_ID ?? "default-workspace";

export interface SessionUser {
  id: string;
  email: string;
  name?: string;
  workspaceId: string;
}

// Returns a stub session for the current request.
// Replace with real session lookup when auth is implemented.
export function getStubSession(): SessionUser {
  return {
    id: "stub-user",
    email: "user@example.com",
    name: "Demo User",
    workspaceId: DEFAULT_WORKSPACE_ID,
  };
}
