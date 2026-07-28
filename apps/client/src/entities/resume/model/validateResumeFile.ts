export const RESUME_ALLOWED_MIME_TYPE = 'application/pdf';
export const RESUME_MAX_FILE_SIZE = 20 * 1024 * 1024;

export const validateResumeFile = (file: File): string | null => {
  if (file.type !== RESUME_ALLOWED_MIME_TYPE) return 'PDF 파일만 업로드할 수 있습니다.';
  if (file.size > RESUME_MAX_FILE_SIZE) return '파일 크기는 20MB를 초과할 수 없습니다.';

  return null;
};
