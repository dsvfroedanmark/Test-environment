import type { DraftPost } from "@/types";

export function DraftVariantCard({ draft }: { draft: DraftPost }) {
  return (
    <div className="border rounded-md p-4 space-y-3">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        Draft {draft.draftNumber}
        {draft.platform && ` · ${draft.platform}`}
      </p>
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-1">Ad Copy</p>
        <p className="text-sm whitespace-pre-wrap">{draft.adCopy}</p>
      </div>
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-1">Graphic Description</p>
        <p className="text-sm text-muted-foreground italic">{draft.graphicDescription}</p>
      </div>
    </div>
  );
}
