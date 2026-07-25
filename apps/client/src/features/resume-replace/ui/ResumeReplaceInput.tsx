'use client';

import { useState } from 'react';

import { Upload } from 'lucide-react';
import { toast } from 'sonner';

interface ResumeReplaceInputProps {
  onChange: (fileName: string) => void;
}

const ResumeReplaceInput = ({ onChange }: ResumeReplaceInputProps) => {
  const [inputKey, setInputKey] = useState<number>(0);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileName = event.target.files?.[0]?.name;

    if (!fileName) return;

    onChange(fileName);
    setInputKey((currentKey) => currentKey + 1);
    toast.success('이력서가 교체되었습니다.');
  };

  return (
    <label className="bg-background inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border px-3 text-sm font-medium">
      <input
        key={inputKey}
        type="file"
        accept="application/pdf"
        className="sr-only"
        onChange={handleChange}
      />
      <Upload className="size-4" />
      파일 교체
    </label>
  );
};

export default ResumeReplaceInput;
