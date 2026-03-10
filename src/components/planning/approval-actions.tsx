"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle, MessageSquare, Loader2, ShieldCheck } from "lucide-react";

interface ApprovalActionsProps {
  requestId: string;
}

export function ApprovalActions({ requestId }: ApprovalActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<"approve" | null>(null);
  const [showChanges, setShowChanges] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleApprove() {
    setLoading("approve");
    setError(null);

    try {
      const res = await fetch(`/api/requests/${requestId}/approve`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Approval failed");
      router.push(`/requests/${requestId}/run`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(null);
    }
  }

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardContent className="pt-5 space-y-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <p className="font-semibold text-sm">Ready for your approval</p>
            <p className="text-sm text-muted-foreground">
              Review the plan above. Approve to begin execution, or request changes.
              No actions will be taken without your explicit approval.
            </p>
          </div>
        </div>

        {error && (
          <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
            {error}
          </p>
        )}

        {showChanges ? (
          <div className="space-y-3">
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Describe the changes you'd like to the plan…"
              className="min-h-[100px] text-sm"
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setShowChanges(false); setFeedback(""); }}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={!feedback.trim()}
                onClick={() => {
                  alert("Changes requested. (MVP stub — replanning with feedback is a Phase 2 feature.)");
                  setShowChanges(false);
                }}
              >
                Submit Feedback
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleApprove} disabled={loading !== null}>
              {loading === "approve" ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              Approve & Execute
            </Button>

            <Button
              variant="outline"
              onClick={() => setShowChanges(true)}
              disabled={loading !== null}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Request Changes
            </Button>

            <Button
              variant="ghost"
              className="text-muted-foreground"
              disabled={loading !== null}
              onClick={() => { if (confirm("Cancel this request?")) alert("Cancelled. (MVP stub)"); }}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
