import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DraftVariantCard } from "./draft-variant-card";
import { ContentCalendarTable } from "./content-calendar-table";
import { FileText, BarChart2, ImageIcon, Mail, FileImage } from "lucide-react";
import type { ArtifactType, DraftPost } from "@/types";

interface ArtifactCardProps {
  type: ArtifactType;
  title: string;
  description?: string | null;
  contentJson: unknown;
}

export function ArtifactCard({ type, title, description, contentJson }: ArtifactCardProps) {
  const content = contentJson as Record<string, unknown>;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <ArtifactIcon type={type} />
          {title}
          <span className="ml-auto text-xs font-normal text-muted-foreground">{type}</span>
        </CardTitle>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        <ArtifactBody type={type} content={content} />
      </CardContent>
    </Card>
  );
}

function ArtifactBody({ type, content }: { type: ArtifactType; content: Record<string, unknown> }) {
  if (type === "SOCIAL_POST" && Array.isArray(content.drafts)) {
    return (
      <div className="space-y-4">
        {(content.drafts as DraftPost[]).map((draft) => (
          <DraftVariantCard key={draft.draftNumber} draft={draft} />
        ))}
      </div>
    );
  }

  if (type === "DATA" && Array.isArray(content.schedule)) {
    return <ContentCalendarTable schedule={content.schedule as Array<Record<string, string>>} />;
  }

  if (type === "DOCUMENT") {
    const brand = content.brand as string | undefined;
    const totalPosts = content.totalPosts as string | number | undefined;
    const periodDays = content.periodDays as string | number | undefined;
    return (
      <div className="space-y-2">
        {brand && (
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><span className="text-muted-foreground">Brand:</span> {brand}</div>
            {totalPosts != null && <div><span className="text-muted-foreground">Posts:</span> {String(totalPosts)}</div>}
            {periodDays != null && <div><span className="text-muted-foreground">Duration:</span> {String(periodDays)} days</div>}
          </div>
        )}
        {Array.isArray(content.themes) && (
          <div>
            <p className="text-xs text-muted-foreground mb-1">Themes</p>
            <div className="flex flex-wrap gap-1">
              {(content.themes as string[]).map((t) => (
                <span key={t} className="text-xs bg-secondary px-2 py-0.5 rounded-full">{t}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <pre className="text-xs text-muted-foreground bg-muted rounded p-3 overflow-auto max-h-48 whitespace-pre-wrap">
      {JSON.stringify(content, null, 2)}
    </pre>
  );
}

function ArtifactIcon({ type }: { type: ArtifactType }) {
  const cls = "h-4 w-4 text-muted-foreground";
  const icons: Record<ArtifactType, React.ReactNode> = {
    TEXT: <FileText className={cls} />,
    IMAGE: <ImageIcon className={cls} />,
    DOCUMENT: <FileText className={cls} />,
    DATA: <BarChart2 className={cls} />,
    SOCIAL_POST: <FileImage className={cls} />,
    EMAIL: <Mail className={cls} />,
    REPORT: <FileText className={cls} />,
  };
  return <>{icons[type]}</>;
}
