import * as z from "zod";
import { removeCpfPunctuation, validarCpfLocalmente } from "@/helpers/cpf";

export const registroPorteiroSchema = z.object({
  nomeCompleto: z
    .string()
    .min(3, { message: "Nome deve ter no mínimo 3 caracteres." }),
  email: z.string().email({ message: "Email inválido." }),
  cpf: z
    .string()
    .transform((val) => removeCpfPunctuation(val))
    .pipe(
      z
        .string()
        .length(11, { message: "CPF deve ter exatamente 11 dígitos." })
        .refine(validarCpfLocalmente, { message: "Este CPF não é válido." }),
    ),
  telefone: z
    .string()
    .transform((val) => val.replace(/\D/g, ""))
    .pipe(z.string().min(10, { message: "Telefone inválido." })),
  senha: z
    .string()
    .min(6, { message: "A senha deve ter no mínimo 6 caracteres." }),
  moraNoCondominio: z.boolean(),
  id_unidade: z.string(),
});

export const edicaoPorteiroSchema = z.object({
  id_usuario: z.string(),
  nomeCompleto: z
    .string()
    .min(3, { message: "Nome deve ter no mínimo 3 caracteres." }),
  email: z.string().email({ message: "Email inválido." }),
  telefone: z
    .string()
    .transform((val) => val.replace(/\D/g, ""))
    .pipe(z.string().min(10, { message: "Telefone inválido." })),
  moraNoCondominio: z.boolean(),
  id_unidade: z.string(),
});

export type RegistroPorteiroFormData = z.infer<typeof registroPorteiroSchema>;
export type EdicaoPorteiroFormData = z.infer<typeof edicaoPorteiroSchema>;
