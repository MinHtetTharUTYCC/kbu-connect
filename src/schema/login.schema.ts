import { z } from 'zod';

export const LoginSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .regex(/@ms\.kbu\.ac\.th$/, 'must be a KBU student email (@ms.kbu.ac.th)')
});

export type LoginFormValues = z.infer<typeof LoginSchema>;
