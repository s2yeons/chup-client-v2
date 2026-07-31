'use client';

import { useState } from 'react';

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  toast,
} from '@chup/ui';
import { CircleAlert, FileText, Loader2, X } from 'lucide-react';

import { useDeleteResume, useGetResumes } from '@/entities/resume';
import { useGetMe } from '@/entities/user';
import { PhoneNumberUpdateSchema, usePatchPhoneNumber } from '@/features/phone-number-update';
import { ResumeUploadInput } from '@/features/resume-upload';
import { formatFileSize } from '@/views/profile/lib/formatFileSize';

const RESUME_MAX_COUNT = 3;

const ProfileView = () => {
  const { data: user, isPending: isUserPending, isError: isUserError } = useGetMe();
  const { data: resumes, isPending: isResumePending, isError: isResumeError } = useGetResumes();
  const { mutate: patchPhoneNumber, isPending: isPhoneSaving } = usePatchPhoneNumber();
  const { mutate: deleteResume, isPending: isDeletingResume } = useDeleteResume();

  const [phoneNumber, setPhoneNumber] = useState<string>(
    user?.phoneNumber?.replace(/\D/g, '') ?? '',
  );
  const [syncedPhoneNumber, setSyncedPhoneNumber] = useState<string | null | undefined>(
    user?.phoneNumber,
  );

  if (user?.phoneNumber !== syncedPhoneNumber) {
    setSyncedPhoneNumber(user?.phoneNumber);
    setPhoneNumber(user?.phoneNumber?.replace(/\D/g, '') ?? '');
  }

  const handlePhoneSave = () => {
    const result = PhoneNumberUpdateSchema.safeParse({ phoneNumber });

    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? '전화번호를 확인해주세요.');
      return;
    }

    patchPhoneNumber(result.data);
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
          <CardDescription>이름, 학번, 이메일은 DataGSM 계정에서 연동됩니다.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          {isUserPending && (
            <div className="text-muted-foreground col-span-full flex items-center gap-2 py-6 text-sm">
              <Loader2 className="size-4 animate-spin" />내 정보를 불러오는 중이에요.
            </div>
          )}
          {isUserError && (
            <div className="text-muted-foreground col-span-full flex items-center gap-2 py-6 text-sm">
              <CircleAlert className="size-4" />내 정보를 불러오지 못했어요. 잠시 후 다시
              시도해주세요.
            </div>
          )}
          {user && (
            <>
              {[
                ['이름', user.name],
                ['학번', user.studentId ?? '-'],
                ['이메일', user.email],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-muted-foreground text-sm">{label}</p>
                  <p className="mt-1 font-medium">{value}</p>
                </div>
              ))}
              <div>
                <label htmlFor="phone-number" className="text-muted-foreground text-sm">
                  전화번호
                </label>
                <div className="mt-1 flex gap-2">
                  <div className="min-w-0 flex-1">
                    <Input
                      id="phone-number"
                      type="tel"
                      value={phoneNumber}
                      onChange={(event) =>
                        setPhoneNumber(event.target.value.replace(/\D/g, '').slice(0, 11))
                      }
                      placeholder="전화번호를 입력해주세요"
                      inputMode="numeric"
                    />
                  </div>
                  <Button
                    type="button"
                    disabled={
                      !phoneNumber.trim() ||
                      phoneNumber === (user.phoneNumber ?? '').replace(/\D/g, '') ||
                      isPhoneSaving
                    }
                    onClick={handlePhoneSave}
                  >
                    저장
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>이력서</CardTitle>
          <CardDescription>
            PDF 파일을 최대 {RESUME_MAX_COUNT}개까지 업로드할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {isResumePending && (
            <div className="text-muted-foreground flex items-center gap-2 py-6 text-sm">
              <Loader2 className="size-4 animate-spin" />
              이력서를 불러오는 중이에요.
            </div>
          )}
          {isResumeError && (
            <div className="text-muted-foreground flex items-center gap-2 py-6 text-sm">
              <CircleAlert className="size-4" />
              이력서를 불러오지 못했어요. 잠시 후 다시 시도해주세요.
            </div>
          )}
          {!isResumePending &&
            !isResumeError &&
            (resumes && resumes.length > 0 ? (
              <div className="flex flex-col gap-3">
                {resumes.map((resume) => (
                  <div
                    key={resume.id}
                    className="flex items-center gap-4 rounded-2xl border border-dashed p-5"
                  >
                    <div className="bg-primary/10 text-primary shrink-0 rounded-xl p-3">
                      <FileText className="size-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{resume.fileName}</p>
                      <p className="text-muted-foreground text-sm">
                        {formatFileSize(resume.fileSize)}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      disabled={isDeletingResume}
                      onClick={() => deleteResume(resume.id)}
                      aria-label={`${resume.fileName} 삭제`}
                    >
                      <X />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">등록된 이력서가 없습니다.</p>
            ))}
          <div>
            <ResumeUploadInput disabled={(resumes?.length ?? 0) >= RESUME_MAX_COUNT} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileView;
