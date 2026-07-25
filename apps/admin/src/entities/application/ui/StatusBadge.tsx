import type { ApplicationStatusType, JobStatusType } from '@chup/core/entities';
import { Badge } from '@chup/ui';

interface StatusBadgeProps {
  status: ApplicationStatusType | JobStatusType;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  if (status === '서류 합격')
    return <Badge className="bg-success/10 text-success hover:bg-success/10">서류 합격</Badge>;
  if (status === '서류 불합격')
    return (
      <Badge variant="secondary" className="text-muted-foreground">
        서류 불합격
      </Badge>
    );
  if (status === '마감') return <Badge variant="secondary">마감</Badge>;
  return <Badge className="bg-primary/10 text-primary hover:bg-primary/10">{status}</Badge>;
};

export default StatusBadge;
