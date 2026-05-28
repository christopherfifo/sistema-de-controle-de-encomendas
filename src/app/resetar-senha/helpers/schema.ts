import { z } from "zod";

export const resetarSenhaSchema = z.object({
  token: z.string().min(1, { message: "Token é obrigatório." }),
  senha: z.string().min(8, { message: "A senha deve ter no mínimo 8 caracteres." }),
  confirmarSenha: z.string().min(8, { message: "A confirmação da senha deve ter no mínimo 8 caracteres." }),
}).refine((data) => data.senha === data.confirmarSenha, {
  message: "As senhas não coincidem.",
  path: ["confirmarSenha"],
});

export type ResetarSenhaFormValues = z.infer<typeof resetarSenhaSchema>;