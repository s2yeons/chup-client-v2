'use client';

import { useState } from 'react';

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@chup/ui';
import { FileText, Trash2 } from 'lucide-react';

import { ProfileFileUploadInput } from '@/features/profile-file-upload';
import {
  addProfileFile,
  initialProfileFiles,
  isProfileFileLimitReached,
  type ProfileFileType,
  removeProfileFile,
} from '@/views/profile/model/profileFiles';

const ProfileView = () => {
  const [files, setFiles] = useState<ProfileFileType[]>(initialProfileFiles);

  const isLimitReached = isProfileFileLimitReached(files);

  const handleAdd = (fileName: string) => {
    setFiles((currentFiles) =>
      addProfileFile(currentFiles, { id: crypto.randomUUID(), name: fileName }),
    );
  };

  const handleRemove = (fileId: string) => {
    setFiles((currentFiles) => removeProfileFile(currentFiles, fileId));
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-primary text-sm font-semibold">내 정보</p>
        <h1 className="mt-1 text-3xl font-bold">프로필과 이력서 관리</h1>
        <p className="text-muted-foreground mt-2">지원에 사용되는 기본 정보를 확인하세요.</p>
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
              <p className="text-muted-foreground text-sm">{label}</p>
              <p className="mt-1 font-medium">{value}</p>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>첨부 파일</CardTitle>
          <CardDescription>PDF 파일을 최대 3개까지 등록할 수 있습니다.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-dashed p-5"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="bg-primary/10 text-primary shrink-0 rounded-xl p-3">
                  <FileText className="size-6" />
                </div>
                <p className="truncate font-semibold">{file.name}</p>
              </div>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleRemove(file.id)}
                aria-label={`${file.name} 삭제`}
              >
                <Trash2 />
              </Button>
            </div>
          ))}
          <div className="flex flex-wrap items-center gap-3">
            <ProfileFileUploadInput disabled={isLimitReached} onAdd={handleAdd} />
            {isLimitReached && (
              <p className="text-muted-foreground text-sm">최대 3개까지 등록할 수 있습니다.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileView;
