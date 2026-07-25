'use client';

import { cn, toast } from '@chup/ui';

interface ProfileFileUploadInputProps {
  disabled: boolean;
  onAdd: (fileName: string) => void;
}

const ProfileFileUploadInput = ({ disabled, onAdd }: ProfileFileUploadInputProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file && file.type !== 'application/pdf') {
      toast.error('PDF 파일만 추가할 수 있습니다.');
      event.target.value = '';
      return;
    }

    if (file) onAdd(file.name);
    event.target.value = '';
  };

  return (
    <label
      className={cn(
        'bg-background inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-medium',
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
      )}
    >
      <input
        disabled={disabled}
        type="file"
        accept="application/pdf"
        className="sr-only"
        onChange={handleChange}
      />
      파일 추가
    </label>
  );
};

export default ProfileFileUploadInput;
