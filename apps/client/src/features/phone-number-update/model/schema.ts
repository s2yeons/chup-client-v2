import { z } from 'zod';

export const PhoneNumberUpdateSchema = z.object({
  phoneNumber: z
    .string()
    .trim()
    .regex(/^010/, '010으로 시작하는 휴대폰 번호를 입력해주세요')
    .regex(/^\d{10,11}$/, '전화번호 자리수를 확인해주세요'),
});

export type PhoneNumberUpdateReqType = z.infer<typeof PhoneNumberUpdateSchema>;
