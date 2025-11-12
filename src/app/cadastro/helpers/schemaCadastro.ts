import * as z from "zod";
import { isValideCPF, removeCpfPunctuation } from "@/helpers/cpf";
import { isValidCNPJ, removeCnpjPunctuation } from "@/helpers/cnpj";

export const cadastroSchema = z.object({
  nomeCompleto: z.string().min(3, { message: "Nome é obrigatório." }),
  email: z.string().email({ message: "Email inválido." }),
  cpf: z
    .string()
    .transform((val) => removeCpfPunctuation(val))
    .pipe(
      z
        .string()
        .length(11, { message: "CPF deve ter exatamente 11 dígitos." })
        .refine(isValideCPF, {
          message: "Este CPF não é válido.",
        }),
    ),
  senha: z
    .string()
    .min(8, { message: "Senha deve ter no mínimo 8 caracteres." }),
  nomeCondominio: z
    .string()
    .min(3, { message: "Nome do condomínio é obrigatório." }),
  cnpj: z
    .string()
    .transform((val) => removeCnpjPunctuation(val))
    .pipe(
      z
        .string()
        .length(14, { message: "CNPJ deve ter exatamente 14 dígitos." })
        .refine(isValidCNPJ, { message: "CNPJ inválido." }),
    ),
  telefone: z
    .string()
    .transform((val) => val.replace(/\D/g, ""))
    .pipe(
      z.string().refine((v) => v.length === 10 || v.length === 11, {
        message: "Telefone deve ter 10 ou 11 dígitos (DDD + número).",
      }),
    ),
});

export type CadastroFormValues = z.infer<typeof cadastroSchema>;
