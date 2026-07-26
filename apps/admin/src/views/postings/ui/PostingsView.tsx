'use client';

import { useState } from 'react';

import { useRecruitment } from '@chup/core/entities';
import {
  Button,
  Calendar,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  toast,
} from '@chup/ui';
import { CalendarDays, Plus, Search, X } from 'lucide-react';

import { StatusBadge } from '@/entities/application';
import { JobStatusButton } from '@/features/job-status';

const POSITION_OPTIONS = ['프론트엔드', '백엔드', 'DevOps', 'AI', '클라우드'];
const EMPLOYMENT_OPTIONS = ['정규직', '산업기능요원', '인턴', '계약직'];

const PostingsView = () => {
  const { jobs, setJobs } = useRecruitment();
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [company, setCompany] = useState<string>('');
  const [employment, setEmployment] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [positions, setPositions] = useState<string[]>([]);
  const [customPosition, setCustomPosition] = useState<string>('');
  const [deadline, setDeadline] = useState<Date | undefined>();
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isDeadlinePickerOpen, setIsDeadlinePickerOpen] = useState<boolean>(false);

  const togglePosition = (position: string) =>
    setPositions((currentPositions) =>
      currentPositions.includes(position)
        ? currentPositions.filter((currentPosition) => currentPosition !== position)
        : [...currentPositions, position],
    );

  const addCustomPosition = () => {
    const position = customPosition.trim();

    if (!position || positions.includes(position)) return;

    setPositions((currentPositions) => [...currentPositions, position]);
    setCustomPosition('');
  };

  const formatDeadline = (date: Date) =>
    `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;

  const handleDeadlineSelect = (date: Date | undefined) => {
    setDeadline(date);
    setIsDeadlinePickerOpen(false);
  };

  const handleAttachmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file && file.type !== 'application/pdf') toast.error('PDF 파일만 추가할 수 있습니다.');
    if (file?.type === 'application/pdf' && attachments.length < 3) {
      setAttachments((currentAttachments) => [...currentAttachments, file]);
    }
    event.target.value = '';
  };

  const createPosting = () => {
    if (
      !company.trim() ||
      !employment ||
      !description.trim() ||
      positions.length === 0 ||
      !deadline
    ) {
      toast.error('회사명, 고용 형태, 회사 소개, 모집 포지션, 마감일을 입력해주세요.');
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDeadline = new Date(deadline);
    selectedDeadline.setHours(0, 0, 0, 0);

    setJobs((currentJobs) => [
      {
        id: Date.now(),
        company: company.trim(),
        description: description.trim(),
        positions,
        employment,
        deadline: formatDeadline(deadline),
        dday: Math.ceil((selectedDeadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
        applicants: 0,
        status: '모집중',
        attachments: attachments.map((file) => file.name),
      },
      ...currentJobs,
    ]);
    setCompany('');
    setEmployment('');
    setDescription('');
    setPositions([]);
    setCustomPosition('');
    setDeadline(undefined);
    setAttachments([]);
    setIsFormOpen(false);
    toast.success('공고가 등록되고 디스코드 알림이 전송되었습니다.');
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
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus />새 공고 등록
        </Button>
      </div>
      {isFormOpen && (
        <Card className="border-primary/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>새 채용 공고</CardTitle>
                <CardDescription>필수 정보를 입력하고 공고를 게시하세요.</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFormOpen(false)}
                aria-label="닫기"
              >
                <X />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Input
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              placeholder="회사명"
            />
            <Select value={employment} onValueChange={(value) => setEmployment(value ?? '')}>
              <SelectTrigger>
                <SelectValue placeholder="고용 형태" />
              </SelectTrigger>
              <SelectContent side="bottom" align="start" alignItemWithTrigger={false}>
                {EMPLOYMENT_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="회사 소개"
              className="border-input focus-visible:border-ring focus-visible:ring-ring/50 [field-sizing:content] min-h-28 resize-none rounded-lg border bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-3 sm:col-span-2"
            />
            <div className="flex flex-wrap gap-2">
              {POSITION_OPTIONS.map((position) => (
                <Button
                  key={position}
                  variant={positions.includes(position) ? 'default' : 'outline'}
                  onClick={() => togglePosition(position)}
                  aria-pressed={positions.includes(position)}
                >
                  {position}
                </Button>
              ))}
              {positions
                .filter((position) => !POSITION_OPTIONS.includes(position))
                .map((position) => (
                  <Button
                    key={position}
                    onClick={() => togglePosition(position)}
                    aria-label={`${position} 삭제`}
                  >
                    {position}
                    <X />
                  </Button>
                ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={customPosition}
                onChange={(event) => setCustomPosition(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    addCustomPosition();
                  }
                }}
                placeholder="직접 입력"
              />
              <Button variant="outline" onClick={addCustomPosition}>
                추가
              </Button>
            </div>
            <Popover open={isDeadlinePickerOpen} onOpenChange={setIsDeadlinePickerOpen}>
              <PopoverTrigger render={<Button variant="outline" />}>
                <CalendarDays />
                {deadline ? formatDeadline(deadline) : '마감일을 선택해주세요'}
              </PopoverTrigger>
              <PopoverContent align="start">
                <Calendar mode="single" selected={deadline} onSelect={handleDeadlineSelect} />
              </PopoverContent>
            </Popover>
            <div className="space-y-2 sm:col-span-2">
              <Input
                type="file"
                accept="application/pdf"
                disabled={attachments.length === 3}
                onChange={handleAttachmentChange}
              />
              {attachments.length === 3 && (
                <p className="text-muted-foreground text-sm">최대 3개까지 등록할 수 있습니다</p>
              )}
              {attachments.map((file) => (
                <div
                  key={`${file.name}-${file.lastModified}`}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm">{file.name}</span>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() =>
                      setAttachments((currentAttachments) =>
                        currentAttachments.filter((attachment) => attachment !== file),
                      )
                    }
                    aria-label={`${file.name} 삭제`}
                  >
                    <X />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 sm:col-span-2">
              <Button variant="outline" onClick={() => setIsFormOpen(false)}>
                취소
              </Button>
              <Button onClick={createPosting}>등록 및 알림 발송</Button>
            </div>
          </CardContent>
        </Card>
      )}
      <Card className="p-0">
        <CardContent className="p-0">
          <div className="flex items-center gap-3 border-b p-4">
            <Search className="text-muted-foreground size-4" />
            <Input
              className="border-0 shadow-none focus-visible:ring-0"
              placeholder="회사명으로 검색"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-sm">
              <thead className="bg-secondary/60 text-muted-foreground text-left">
                <tr>
                  <th className="px-5 py-3 font-medium">회사 / 포지션</th>
                  <th className="px-5 py-3 font-medium">고용 형태</th>
                  <th className="px-5 py-3 font-medium">마감일</th>
                  <th className="px-5 py-3 font-medium">지원자</th>
                  <th className="px-5 py-3 font-medium">상태</th>
                  <th className="px-5 py-3">
                    <span className="sr-only">관리</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} className="border-t">
                    <td className="px-5 py-4">
                      <p className="font-semibold">{job.company}</p>
                      <p className="text-muted-foreground">{job.positions.join(', ')}</p>
                    </td>
                    <td className="px-5 py-4">{job.employment}</td>
                    <td className="px-5 py-4">{job.deadline}</td>
                    <td className="px-5 py-4 font-medium">{job.applicants}명</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={job.status} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <JobStatusButton job={job} />
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
