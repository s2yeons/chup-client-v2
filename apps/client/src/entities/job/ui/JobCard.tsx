import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@chup/ui';
import { CalendarDays } from 'lucide-react';

import { employmentTypeMeta, type JobPostingType } from '../model/types';

interface JobCardProps {
  job: JobPostingType;
  onOpen: (jobId: number) => void;
}

const JobCard = ({ job, onOpen }: JobCardProps) => {
  return (
    <Card
      className="group border-border/80 hover:border-primary/30 cursor-pointer justify-between transition-all hover:-translate-y-0.5 hover:shadow-md"
      onClick={() => onOpen(job.id)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="bg-secondary text-primary flex size-11 items-center justify-center rounded-xl text-lg font-bold">
            {job.companyName.slice(0, 1)}
          </div>
          <Badge variant={job.status === 'RECRUITING' ? 'default' : 'secondary'}>
            {job.status === 'RECRUITING' ? '모집중' : '마감'}
          </Badge>
        </div>
        <div className="pt-3">
          <CardTitle className="text-lg">{job.companyName}</CardTitle>
          <CardDescription className="mt-1 line-clamp-2">{job.description}</CardDescription>
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
