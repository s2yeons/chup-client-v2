import type { JobType } from '@chup/core/entities';
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@chup/ui';
import { CalendarDays } from 'lucide-react';

interface JobCardProps {
  job: JobType;
  onOpen: (job: JobType) => void;
}

const JobCard = ({ job, onOpen }: JobCardProps) => {
  return (
    <Card
      className="group cursor-pointer border-border/80 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
      onClick={() => onOpen(job)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-secondary text-lg font-bold text-primary">
            {job.company.slice(0, 1)}
          </div>
          <Badge variant={job.dday <= 5 && job.dday >= 0 ? 'destructive' : 'secondary'}>
            {job.dday >= 0 ? `D-${job.dday}` : '마감'}
          </Badge>
        </div>
        <div className="pt-3">
          <CardTitle className="text-lg">{job.company}</CardTitle>
          <CardDescription className="mt-1 line-clamp-2">{job.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {job.positions.map((position) => (
            <Badge key={position} variant="outline">
              {position}
            </Badge>
          ))}
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{job.employment}</span>
          <span className="flex items-center gap-1">
            <CalendarDays className="size-4" />
            {job.deadline}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;
