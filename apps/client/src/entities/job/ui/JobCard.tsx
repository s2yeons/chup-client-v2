import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@chup/ui';
import { CalendarDays } from 'lucide-react';

import { employmentTypeMeta, type JobPostingSummaryType } from '../model/types';

interface JobCardProps {
  job: JobPostingSummaryType;
  onOpen: (jobId: number) => void;
}

const JobCard = ({ job, onOpen }: JobCardProps) => {
  return (
    <button
      type="button"
      className="group w-full text-left focus-visible:outline-none"
      onClick={() => onOpen(job.id)}
    >
      <Card className="border-border/80 group-hover:border-primary/30 group-focus-visible:border-primary group-focus-visible:ring-primary/30 h-full justify-between transition-all group-hover:-translate-y-0.5 group-hover:shadow-md">
        <CardHeader className="pb-3">
          <Badge>모집중</Badge>
          <div className="pt-3">
            <CardTitle className="text-lg">{job.companyName}</CardTitle>
            {job.positions.length > 0 && (
              <CardDescription className="mt-1 line-clamp-2">
                {job.positions.map((position) => position.name).join(', ')}
              </CardDescription>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="text-muted-foreground flex items-center justify-between text-sm">
            <span>{employmentTypeMeta[job.employmentType].label}</span>
            <span className="flex items-center gap-1">
              <CalendarDays className="size-4" />
              {job.recruitEnd}
            </span>
          </div>
        </CardContent>
      </Card>
    </button>
  );
};

export default JobCard;
