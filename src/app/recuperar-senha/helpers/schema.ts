import { z } from "zod";

export const recuperarSenhaSchema = z.object({
  email: z.string().email({ message: "Insira um email válido." }),
});

export type RecuperarSenhaFormValues = z.infer<typeof recuperarSenhaSchema>;