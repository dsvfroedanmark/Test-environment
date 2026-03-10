interface ContentCalendarTableProps {
  schedule: Array<Record<string, string>>;
}

export function ContentCalendarTable({ schedule }: ContentCalendarTableProps) {
  if (schedule.length === 0) return null;
  const columns = Object.keys(schedule[0]);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b">
            {columns.map((col) => (
              <th
                key={col}
                className="text-left py-2 pr-4 font-medium text-muted-foreground capitalize"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {schedule.map((row, i) => (
            <tr key={i} className="border-b last:border-0">
              {columns.map((col) => (
                <td key={col} className="py-2 pr-4">
                  {String(row[col] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
