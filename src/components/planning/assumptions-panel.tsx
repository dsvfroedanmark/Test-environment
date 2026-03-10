export function AssumptionsPanel({ assumptions }: { assumptions: string[] }) {
  return (
    <ul className="space-y-1">
      {assumptions.map((a, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
          <span className="mt-0.5 shrink-0">•</span>
          {a}
        </li>
      ))}
    </ul>
  );
}
