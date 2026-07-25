'use client';

import { useState } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@chup/ui';
import { FileText } from 'lucide-react';

import { ResumeReplaceInput } from '@/features/resume-replace';

const ProfileView = () => {
  const [fileName, setFileName] = useState<string>('김도윤_2314_이력서.pdf');

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <div>
        <p className="text-sm font-semibold text-primary">내 정보</p>
        <h1 className="mt-1 text-3xl font-bold">프로필과 이력서 관리</h1>
        <p className="mt-2 text-muted-foreground">지원에 사용되는 기본 정보를 확인하세요.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>기본 정보</CardTitle>
          <CardDescription>DataGSM 계정에서 연동된 정보입니다.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          {[
            ['이름', '김도윤'],
            ['학번', '2314'],
            ['이메일', 'doyun@gsm.hs.kr'],
            ['전화번호', '010-2381-7721'],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="mt-1 font-medium">{value}</p>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>이력서</CardTitle>
          <CardDescription>PDF 파일 한 개만 등록할 수 있습니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 rounded-2xl border border-dashed p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-3 text-primary">
                <FileText className="size-6" />
              </div>
              <div>
                <p className="font-semibold">{fileName}</p>
                <p className="text-sm text-muted-foreground">PDF · 1.2 MB · 2026.07.15 수정</p>
              </div>
            </div>
            <ResumeReplaceInput onChange={setFileName} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileView;
