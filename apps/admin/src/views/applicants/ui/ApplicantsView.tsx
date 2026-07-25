'use client';

import { useState } from 'react';

import { useRecruitment } from '@chup/core/entities';
import {
  Avatar,
  AvatarFallback,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  toast,
} from '@chup/ui';
import { Download, FileArchive } from 'lucide-react';

import { StatusBadge } from '@/entities/application';
import { ApplicantResultButtons } from '@/features/applicant-result';

const ApplicantsView = () => {
  const { applications } = useRecruitment();
  const [company, setCompany] = useState<string>('전체');
  const companies = [
    '전체',
    ...Array.from(new Set(applications.map((application) => application.company))),
  ];
  const filteredApplications =
    company === '전체'
      ? applications
      : applications.filter((application) => application.company === company);
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-primary text-sm font-semibold">지원자 관리</p>
          <h1 className="mt-1 text-3xl font-bold">지원자와 결과를 관리하세요</h1>
          <p className="text-muted-foreground mt-2">
            회사별 지원 서류를 확인하고 전형 결과를 처리할 수 있어요.
          </p>
        </div>
        <Button
          onClick={() =>
            toast.success(
              `${company === '전체' ? '전체 회사' : company} 지원 서류 ZIP을 준비했습니다.`,
            )
          }
        >
          <FileArchive />
          ZIP 다운로드
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {companies.map((item) => (
          <Button
            key={item}
            size="sm"
            variant={company === item ? 'default' : 'outline'}
            onClick={() => setCompany(item)}
          >
            {item}
          </Button>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{company === '전체' ? '전체 지원자' : `${company} 지원자`}</CardTitle>
          <CardDescription>총 {filteredApplications.length}명의 지원자가 있습니다.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-sm">
              <thead className="bg-secondary/60 text-muted-foreground text-left">
                <tr>
                  <th className="px-5 py-3 font-medium">지원자</th>
                  <th className="px-5 py-3 font-medium">지원 회사</th>
                  <th className="px-5 py-3 font-medium">포지션</th>
                  <th className="px-5 py-3 font-medium">지원 일시</th>
                  <th className="px-5 py-3 font-medium">상태</th>
                  <th className="px-5 py-3 font-medium">처리</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((application) => (
                  <tr key={application.id} className="border-t">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-9">
                          <AvatarFallback>{application.name.slice(0, 1)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">
                            {application.name} · {application.studentId}
                          </p>
                          <p className="text-muted-foreground text-xs">{application.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-medium">{application.company}</td>
                    <td className="px-5 py-4">{application.position}</td>
                    <td className="text-muted-foreground px-5 py-4">
                      {application.date.split(' ')[0]}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={application.status} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            toast.success(
                              `${application.name}_${application.studentId}_${application.position}.pdf 다운로드`,
                            )
                          }
                          aria-label="이력서 다운로드"
                        >
                          <Download />
                        </Button>
                        <ApplicantResultButtons application={application} />
                      </div>
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

export default ApplicantsView;
