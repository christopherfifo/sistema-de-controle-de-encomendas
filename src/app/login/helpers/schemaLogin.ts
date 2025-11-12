
import * as z from "zod";
import { isValideCPF } from "@/helpers/cpf";

function isEmail(value: string): boolean {
  return z.string().email().safeParse(value).success;
}

export const loginSchema = z.object({
  login: z
    .string()
    .min(1, { message: "Email ou CPF é obrigatório." })
    .refine((value) => isEmail(value) || isValideCPF(value), {
      message: "Por favor, insira um email ou CPF válido.",
    }),
  password: z.string().min(8, {
    message: "A senha deve ter no mínimo 8 caracteres.",
  }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
