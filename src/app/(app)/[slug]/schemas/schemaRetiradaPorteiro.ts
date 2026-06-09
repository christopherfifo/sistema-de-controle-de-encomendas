import { z } from "zod";
import { validarCpfLocalmente, removeCpfPunctuation } from "@/helpers/cpf";

export const retiradaEncomendaSchema = z.object({
  tipo_confirmacao: z.enum(["TOKEN", "MANUAL"]),
  token_retirante: z
    .string()
    .optional()
    .nullable(),
  id_usuario_retirada: z.string().optional().nullable(),
  cpf_retirante: z.string().optional().nullable(),
}).superRefine((data, ctx) => {
  if (data.tipo_confirmacao === "MANUAL") {
    if (!data.cpf_retirante || data.cpf_retirante.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["cpf_retirante"],
        message: "O campo CPF é obrigatório para a baixa manual.",
      });
      return;
    }

    const cpfLimpo = removeCpfPunctuation(data.cpf_retirante);

    if (cpfLimpo.length !== 11) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["cpf_retirante"],
        message: "CPF deve ter exatamente 11 dígitos.",
      });
      return;
    }

    if (!validarCpfLocalmente(cpfLimpo)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["cpf_retirante"],
        message: "Este CPF não é válido.",
      });
    }
  } else if (data.tipo_confirmacao === "TOKEN") {
    if (!data.token_retirante || data.token_retirante.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["token_retirante"],
        message: "O token é obrigatório.",
      });
    } else if (data.token_retirante.length > 10) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["token_retirante"],
        message: "O token é muito longo.",
      });
    }
  }
});

export type RetiradaEncomendaFormData = z.infer<typeof retiradaEncomendaSchema>;

export const confirmarChegadaSchema = z.object({
  condicaoPorteiro: z
    .string()
    .min(3, { message: "Digite uma descrição sobre o estado do pacote." }),
  foto_pacote: z.any().optional(),
});

export type ConfirmarChegadaFormData = z.infer<typeof confirmarChegadaSchema>;
