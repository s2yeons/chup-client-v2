'use client';

import { useState } from 'react';

import { useRecruitment } from '@chup/core/entities';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input } from '@chup/ui';
import { Plus, Search, X } from 'lucide-react';
import { toast } from 'sonner';

import { StatusBadge } from '@/entities/application';
import { JobStatusButton } from '@/features/job-status';

const PostingsView = () => {
  const { jobs, setJobs } = useRecruitment();
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [company, setCompany] = useState<string>('');
  const [position, setPosition] = useState<string>('');
  const createPosting = () => { if (!company || !position) { toast.error('회사명과 포지션을 입력해주세요.'); return; } setJobs((currentJobs) => [{ id: Date.now(), company, description: '새롭게 등록된 채용 공고입니다.', positions: [position], employment: '정규직', deadline: '2026.08.20', dday: 31, applicants: 0, status: '모집중' }, ...currentJobs]); setCompany(''); setPosition(''); setIsFormOpen(false); toast.success('공고가 등록되고 디스코드 알림이 전송되었습니다.'); };
  return <div className="flex flex-col gap-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold text-primary">공고 관리</p><h1 className="mt-1 text-3xl font-bold">채용 공고를 관리하세요</h1><p className="mt-2 text-muted-foreground">등록부터 마감까지 한 곳에서 처리할 수 있어요.</p></div><Button onClick={() => setIsFormOpen(true)}><Plus />새 공고 등록</Button></div>{isFormOpen && <Card className="border-primary/30"><CardHeader><div className="flex items-center justify-between"><div><CardTitle>새 채용 공고</CardTitle><CardDescription>필수 정보를 입력하고 공고를 게시하세요.</CardDescription></div><Button variant="ghost" size="icon" onClick={() => setIsFormOpen(false)} aria-label="닫기"><X /></Button></div></CardHeader><CardContent className="grid gap-4 sm:grid-cols-2"><Input value={company} onChange={(event) => setCompany(event.target.value)} placeholder="회사명" /><Input value={position} onChange={(event) => setPosition(event.target.value)} placeholder="모집 포지션" /><div className="flex justify-end gap-2 sm:col-span-2"><Button variant="outline" onClick={() => setIsFormOpen(false)}>취소</Button><Button onClick={createPosting}>등록 및 알림 발송</Button></div></CardContent></Card>}<Card><CardContent className="p-0"><div className="flex items-center gap-3 border-b p-4"><Search className="size-4 text-muted-foreground" /><Input className="border-0 shadow-none focus-visible:ring-0" placeholder="회사명으로 검색" /></div><div className="overflow-x-auto"><table className="w-full min-w-[700px] text-sm"><thead className="bg-secondary/60 text-left text-muted-foreground"><tr><th className="px-5 py-3 font-medium">회사 / 포지션</th><th className="px-5 py-3 font-medium">고용 형태</th><th className="px-5 py-3 font-medium">마감일</th><th className="px-5 py-3 font-medium">지원자</th><th className="px-5 py-3 font-medium">상태</th><th className="px-5 py-3"><span className="sr-only">관리</span></th></tr></thead><tbody>{jobs.map((job) => <tr key={job.id} className="border-t"><td className="px-5 py-4"><p className="font-semibold">{job.company}</p><p className="text-muted-foreground">{job.positions.join(', ')}</p></td><td className="px-5 py-4">{job.employment}</td><td className="px-5 py-4">{job.deadline}</td><td className="px-5 py-4 font-medium">{job.applicants}명</td><td className="px-5 py-4"><StatusBadge status={job.status} /></td><td className="px-5 py-4 text-right"><JobStatusButton job={job} /></td></tr>)}</tbody></table></div></CardContent></Card></div>;
};

export default PostingsView;
