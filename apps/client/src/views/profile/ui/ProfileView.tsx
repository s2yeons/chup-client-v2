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
import { CircleAlert, FileText, Loader2 } from 'lucide-react';

import { useGetResume } from '@/entities/resume';
import { useGetMe } from '@/entities/user';
import { PhoneNumberUpdateSchema, usePatchPhoneNumber } from '@/features/phone-number-update';
import { ResumeUploadInput } from '@/features/resume-upload';
import { formatFileSize } from '@/views/profile/lib/formatFileSize';

const ProfileView = () => {
  const { data: user, isPending: isUserPending, isError: isUserError } = useGetMe();
  const { data: resume, isPending: isResumePending, isError: isResumeError } = useGetResume();
  const { mutate: patchPhoneNumber, isPending: isPhoneSaving } = usePatchPhoneNumber();

  const [phoneNumber, setPhoneNumber] = useState<string>('');
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
          <CardDescription>PDF 파일을 업로드하면 기존 이력서를 대체합니다.</CardDescription>
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
            (resume ? (
              <div className="flex items-center gap-4 rounded-2xl border border-dashed p-5">
                <div className="bg-primary/10 text-primary shrink-0 rounded-xl p-3">
                  <FileText className="size-6" />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold">{resume.fileName}</p>
                  <p className="text-muted-foreground text-sm">{formatFileSize(resume.fileSize)}</p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">등록된 이력서가 없습니다.</p>
            ))}
          <div>
            <ResumeUploadInput hasResume={!!resume} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileView;
