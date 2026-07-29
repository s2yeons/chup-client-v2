import { z } from 'zod';

export const JobRegistrationSchema = z
  .object({
    companyName: z.string().trim().min(1, '회사명을 입력해주세요.'),
    description: z.string().trim().min(1, '회사 소개를 입력해주세요.'),
    employmentType: z.enum(['FULL_TIME', 'CONTRACT', 'INTERN', 'INDUSTRIAL_FUNCTIONAL_PERSONNEL']),
    recruitStart: z.string().min(1, '모집 시작일을 선택해주세요.'),
    recruitEnd: z.string().min(1, '마감일을 선택해주세요.'),
    positionNames: z
      .array(z.string().trim().min(1))
      .min(1, '모집 포지션을 하나 이상 선택해주세요.'),
    attachments: z.array(z.instanceof(File)).max(5, '첨부파일은 최대 5개까지 등록할 수 있습니다.'),
  })
  .refine(({ recruitStart, recruitEnd }) => recruitStart <= recruitEnd, {
    path: ['recruitEnd'],
    message: '마감일은 모집 시작일보다 빠를 수 없습니다.',
  });

export type JobRegistrationReqType = z.infer<typeof JobRegistrationSchema>;
