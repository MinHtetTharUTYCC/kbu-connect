import { z } from 'zod';

export const VerifySchema = z.object({
    code: z.string().length(6, 'Code must be 6 digits').regex(/^\d+$/, 'Digits only')
});

export type VerifyFormValues = z.infer<typeof VerifySchema>;
