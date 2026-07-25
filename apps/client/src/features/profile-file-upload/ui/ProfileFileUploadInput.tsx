'use client';

interface ProfileFileUploadInputProps {
  disabled: boolean;
  onAdd: (fileName: string) => void;
}

const ProfileFileUploadInput = ({ disabled, onAdd }: ProfileFileUploadInputProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileName = event.target.files?.[0]?.name;

    if (fileName) onAdd(fileName);
    event.target.value = '';
  };

  return (
    <label className="bg-background inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border px-3 text-sm font-medium">
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
