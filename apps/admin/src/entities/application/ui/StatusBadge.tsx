import type { JobStatusType } from '@chup/core/entities';
import { Badge } from '@chup/ui';

import type { ApplicationStatusType } from '../model/types';

interface StatusBadgeProps {
  status: ApplicationStatusType | JobStatusType | 'RECRUITING' | 'CLOSED';
}

const APPLICATION_STATUS_META: Record<
  ApplicationStatusType,
  { label: string; variant: 'default' | 'secondary'; className: string }
> = {
  APPLIED: {
    label: '지원 완료',
    variant: 'default',
    className: 'bg-primary/10 text-primary hover:bg-primary/10',
  },
  PASSED: {
    label: '서류 합격',
    variant: 'default',
    className: 'bg-success/10 text-success hover:bg-success/10',
  },
  FAILED: { label: '서류 불합격', variant: 'secondary', className: 'text-muted-foreground' },
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  if (status in APPLICATION_STATUS_META) {
    const { label, variant, className } = APPLICATION_STATUS_META[status as ApplicationStatusType];

    return (
      <Badge variant={variant} className={className}>
        {label}
      </Badge>
    );
  }
  if (status === '마감' || status === 'CLOSED') return <Badge variant="secondary">마감</Badge>;
  return (
    <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
      {status === 'RECRUITING' ? '모집중' : status}
    </Badge>
  );
};

export default StatusBadge;
