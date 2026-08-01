import { Badge, Card, CardContent, CardHeader, CardTitle } from '@chup/ui';
import { CalendarDays } from 'lucide-react';

import { employmentTypeMeta, type JobPostingSummaryType } from '../model/types';

interface JobCardProps {
  job: JobPostingSummaryType;
  onOpen: (jobId: number) => void;
}

const JobCard = ({ job, onOpen }: JobCardProps) => {
  return (
    <Card
      className="group border-border/80 hover:border-primary/30 cursor-pointer justify-between transition-all hover:-translate-y-0.5 hover:shadow-md"
      onClick={() => onOpen(job.id)}
    >
      <CardHeader className="pb-3">
        <Badge>모집중</Badge>
        <div className="pt-3">
          <CardTitle className="text-lg">{job.companyName}</CardTitle>
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
  );
};

export default JobCard;
