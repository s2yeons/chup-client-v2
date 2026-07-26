import type { LucideIcon } from 'lucide-react';

import { Card, CardContent } from './card';

interface StatCardProps {
  label: string;
  value: string;
  note: string;
  icon: LucideIcon;
}

function StatCard({ label, value, note, icon: Icon }: StatCardProps) {
  return (
    <Card className="p-0">
      <CardContent className="flex items-start justify-between p-5">
        <div>
          <p className="text-muted-foreground text-sm">{label}</p>
          <p className="mt-1 text-2xl font-bold">{value}</p>
          <p className="text-muted-foreground mt-2 text-xs">{note}</p>
        </div>
        <div className="bg-primary/10 text-primary rounded-xl p-2.5">
          <Icon className="size-5" />
        </div>
      </CardContent>
    </Card>
  );
}

export { StatCard };
