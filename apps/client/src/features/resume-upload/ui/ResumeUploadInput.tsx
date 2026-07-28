'use client';

import { useState } from 'react';

import { cn, toast } from '@chup/ui';

import { usePutResume, validateResumeFile } from '@/entities/resume';

interface ResumeUploadInputProps {
  hasResume: boolean;
}

const ResumeUploadInput = ({ hasResume }: ResumeUploadInputProps) => {
  const [progress, setProgress] = useState<number>(0);
  const { mutate, isPending } = usePutResume();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    const errorMessage = validateResumeFile(file);

    if (errorMessage) {
      toast.error(errorMessage);
      return;
    }

    setProgress(0);
    mutate({ file, onUploadProgress: setProgress });
  };

  return (
    <label
      className={cn(
        'bg-background inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-medium',
        isPending ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
      )}
    >
      <input
        disabled={isPending}
        type="file"
        accept="application/pdf"
        className="sr-only"
        onChange={handleChange}
      />
      {isPending ? `업로드 중... ${progress}%` : hasResume ? '이력서 교체' : '이력서 업로드'}
    </label>
  );
};

export default ResumeUploadInput;
