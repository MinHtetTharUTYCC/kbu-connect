import { z } from 'zod';

export const VerifySchema = z.object({
    code: z.string().regex(/^\d{6}$/, 'Enter the 6-digit code from your email')
});

export type VerifyFormValues = z.infer<typeof VerifySchema>;
