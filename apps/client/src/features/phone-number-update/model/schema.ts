import { z } from 'zod';

export const PhoneNumberUpdateSchema = z.object({
  phoneNumber: z
    .string()
    .trim()
    .regex(/^010\d{7,8}$/, '010으로 시작하는 휴대폰 번호를 입력해주세요'),
});

export type PhoneNumberUpdateReqType = z.infer<typeof PhoneNumberUpdateSchema>;
