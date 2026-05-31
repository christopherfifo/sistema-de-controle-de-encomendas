import * as z from "zod";
import { removeCpfPunctuation, validarCpfLocalmente } from "@/helpers/cpf";
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
        .refine(validarCpfLocalmente, {
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
  telefone: z.string().min(1, { message: "Telefone é obrigatório." }),
  planoId: z.string().min(1, { message: "Selecione um plano." }),
  aceiteTermos: z.boolean().refine((val) => val === true, {
    message: "Você deve aceitar as condições contratuais do sistema.",
  }),
  numeroCartao: z.string().min(13, { message: "Número do cartão inválido." }),
  nomeTitularCartao: z
    .string()
    .min(3, { message: "Nome do titular é obrigatório." }),
  validadeCartao: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/?([0-9]{2}|[0-9]{4})$/, {
      message: "Validade inválida (MM/AA ou MM/AAAA).",
    }),
  cvvCartao: z
    .string()
    .min(3, { message: "CVV inválido." })
    .max(4, { message: "CVV inválido." }),
});

export type CadastroFormValues = z.infer<typeof cadastroSchema>;
