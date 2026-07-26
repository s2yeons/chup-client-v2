export interface ProfileFileType {
  id: string;
  name: string;
}

export const MAX_PROFILE_FILE_COUNT = 3;

export const initialProfileFiles: ProfileFileType[] = [
  { id: 'resume', name: '김도윤_2314_이력서.pdf' },
];

export const addProfileFile = (files: ProfileFileType[], file: ProfileFileType) =>
  files.length >= MAX_PROFILE_FILE_COUNT ? files : [...files, file];

export const isProfileFileLimitReached = (files: ProfileFileType[]) =>
  files.length >= MAX_PROFILE_FILE_COUNT;

export const removeProfileFile = (files: ProfileFileType[], fileId: string) =>
  files.filter((file) => file.id !== fileId);
