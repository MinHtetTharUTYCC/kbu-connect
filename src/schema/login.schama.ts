import { z } from "zod";

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .refine((e) => e.endsWith("@ms.kbu.ac.th"), {
      message: "Must be a KBU student email (@ms.kbu.ac.th)",
    }),
});

export type LoginFormValues = z.infer<typeof LoginSchema>;
