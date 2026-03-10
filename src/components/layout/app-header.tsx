import { Separator } from "@/components/ui/separator";

interface AppHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function AppHeader({ title, description, actions }: AppHeaderProps) {
  return (
    <div className="border-b border-border">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <Separator />
    </div>
  );
}
