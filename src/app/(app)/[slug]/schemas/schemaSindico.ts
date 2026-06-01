import { z } from "zod";
import { removeCpfPunctuation, validarCpfLocalmente } from "@/helpers/cpf";

export const registroUnidadeSchema = z.object({
  bloco_torre: z
    .string()
    .min(1, { message: "O Bloco/Torre é obrigatório." })
    .max(50, { message: "Máximo de 50 caracteres." }),

  numero_unidade: z
    .string()
    .min(1, { message: "O Número da Unidade é obrigatório." })
    .max(10, { message: "Máximo de 10 caracteres." }),
});

export type RegistroUnidadeFormData = z.infer<typeof registroUnidadeSchema>;

export const registroSindicoSchema = z.object({
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

export const edicaoSindicoSchema = z.object({
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

export type RegistroSindicoFormData = z.infer<typeof registroSindicoSchema>;
export type EdicaoSindicoFormData = z.infer<typeof edicaoSindicoSchema>;
