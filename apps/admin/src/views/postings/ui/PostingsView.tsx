'use client';

import { useState } from 'react';

import { Button, Card, CardContent, Input } from '@chup/ui';
import { CircleAlert, Inbox, Loader2, Plus, Search } from 'lucide-react';

import { StatusBadge } from '@/entities/application';
import {
  type AdminJobPostingType,
  employmentTypeMeta,
  useGetAdminJobs,
} from '@/entities/dashboard';
import { JobRegistrationForm } from '@/features/job-registration';
import { JobStatusButton } from '@/features/job-status';

const PostingsView = () => {
  const [query, setQuery] = useState<string>('');
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingJob, setEditingJob] = useState<AdminJobPostingType | null>(null);
  const { data: jobs, isError, isPending } = useGetAdminJobs({ q: query });

  const handleCreate = () => {
    setEditingJob(null);
    setIsFormOpen(true);
  };

  const handleEdit = (job: AdminJobPostingType) => {
    setEditingJob(job);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingJob(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-primary text-sm font-semibold">공고 관리</p>
          <h1 className="mt-1 text-3xl font-bold">채용 공고를 관리하세요</h1>
          <p className="text-muted-foreground mt-2">
            등록부터 마감까지 한 곳에서 처리할 수 있어요.
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus />새 공고 등록
        </Button>
      </div>
      {isFormOpen && (
        <JobRegistrationForm
          key={editingJob?.id ?? 'new'}
          job={editingJob ?? undefined}
          onClose={handleFormClose}
        />
      )}
      <Card className="p-0">
        <CardContent className="p-0">
          <div className="flex items-center gap-3 border-b p-4">
            <Search className="text-muted-foreground size-4" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="border-0 shadow-none focus-visible:ring-0"
              placeholder="회사명으로 검색"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-sm">
              <thead className="bg-secondary/60 text-muted-foreground text-left">
                <tr>
                  <th className="px-5 py-3 font-medium">회사</th>
                  <th className="px-5 py-3 font-medium">고용 형태</th>
                  <th className="px-5 py-3 font-medium">모집 기간</th>
                  <th className="px-5 py-3 font-medium">상태</th>
                  <th className="px-5 py-3">
                    <span className="sr-only">관리</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {isPending && (
                  <tr>
                    <td colSpan={5} className="text-muted-foreground px-5 py-10 text-center">
                      <Loader2 className="mr-2 inline size-4 animate-spin" />
                      공고를 불러오는 중이에요.
                    </td>
                  </tr>
                )}
                {isError && (
                  <tr>
                    <td colSpan={5} className="text-muted-foreground px-5 py-10 text-center">
                      <CircleAlert className="mr-2 inline size-4" />
                      공고를 불러오지 못했어요. 잠시 후 다시 시도해주세요.
                    </td>
                  </tr>
                )}
                {!isPending && !isError && jobs?.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-muted-foreground px-5 py-10 text-center">
                      <Inbox className="mr-2 inline size-4" />
                      등록된 공고가 없어요.
                    </td>
                  </tr>
                )}
                {jobs?.map((job) => (
                  <tr key={job.id} className="border-t">
                    <td className="px-5 py-4">
                      <p className="font-semibold">{job.companyName}</p>
                      <p className="text-muted-foreground truncate">{job.description}</p>
                    </td>
                    <td className="px-5 py-4">{employmentTypeMeta[job.employmentType].label}</td>
                    <td className="px-5 py-4">
                      {job.recruitStart} ~ {job.recruitEnd}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={job.status} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <JobStatusButton job={job} onEdit={handleEdit} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostingsView;
