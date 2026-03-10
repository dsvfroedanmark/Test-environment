"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Sparkles, Info } from "lucide-react";
import { DEFAULT_WORKSPACE_ID } from "@/lib/auth/auth-placeholder";

const EXAMPLE_REQUEST = `Generate a 90-day plan for SoMe posts for the Facebook and Instagram profile 'Naturegrass'. The plan must include a minimum of 12 posts relevant to promoting the Naturegrass webshop and/or its products. For each post, create 3 drafts. Each draft must include finished ad copy and a graphic for the SoMe posts.`;

export function RequestForm() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim() || loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawInput: value.trim(),
          workspaceId: DEFAULT_WORKSPACE_ID,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to create request");

      router.push(`/requests/${data.requestId}/plan`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* How it works */}
      <Card className="mb-6 bg-muted/40 border-muted">
        <CardContent className="pt-4">
          <div className="flex gap-3">
            <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <div className="text-sm text-muted-foreground space-y-1">
              <p className="font-medium text-foreground">How it works</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Describe your goal in plain language</li>
                <li>The system generates a structured execution plan</li>
                <li>You review and approve the plan</li>
                <li>Execution only begins after your approval</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Describe your request</CardTitle>
          <CardDescription>
            Be specific about goals, platforms, quantities, and constraints.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="e.g. Generate a 90-day social media plan for Facebook and Instagram..."
            className="min-h-[160px] resize-y text-sm"
            disabled={loading}
          />

          <div>
            <button
              type="button"
              onClick={() => setValue(EXAMPLE_REQUEST)}
              className="text-xs text-primary hover:underline"
              disabled={loading}
            >
              Load example request (Naturegrass demo)
            </button>
          </div>

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
              {error}
            </p>
          )}

          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-muted-foreground">{value.length} characters</p>
            <Button type="submit" disabled={value.trim().length < 10 || loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating plan…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Plan
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
