export interface ExecutionResult {
  success: boolean;
  stepsCompleted: number;
  stepsFailed: number;
  planId: string;
  requestId: string;
  error?: string;
}

export interface StepExecutionResult {
  success: boolean;
  data?: unknown;
  artifacts?: StepArtifact[];
  error?: string;
}

export interface StepArtifact {
  type: string;
  title: string;
  description?: string;
  content: unknown;
}
