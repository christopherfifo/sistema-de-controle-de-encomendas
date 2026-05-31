import * as z from "zod";

export const loginSchema = z.object({
  login: z.string().min(1, { message: "Email ou CPF é obrigatório." }),
  password: z.string().min(8, {
    message: "A senha deve ter no mínimo 8 caracteres.",
  }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
