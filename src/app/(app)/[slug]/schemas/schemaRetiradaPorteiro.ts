import { z } from "zod";

export const retiradaEncomendaSchema = z.object({
  token_retirante: z
    .string()
    .length(6, { message: "O token deve ter exatamente 6 dígitos." })
    .regex(/^\d+$/, { message: "O token deve conter apenas números." }),
});

export type RetiradaEncomendaFormData = z.infer<typeof retiradaEncomendaSchema>;

export const confirmarChegadaSchema = z.object({
  condicaoPorteiro: z.string().min(3, { message: "Digite uma descrição sobre o estado do pacote." }),
  foto_pacote: z.any().optional(), 
});

export type ConfirmarChegadaFormData = z.infer<typeof confirmarChegadaSchema>;