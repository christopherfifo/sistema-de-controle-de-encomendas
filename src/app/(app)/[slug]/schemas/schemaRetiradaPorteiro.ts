import { z } from "zod";

export const retiradaEncomendaSchema = z.object({
  token_retirante: z
    .string()
    .length(6, { message: "O token deve ter exatamente 6 dígitos." })
    .regex(/^\d+$/, { message: "O token deve conter apenas números." }),
});

export type RetiradaEncomendaFormData = z.infer<typeof retiradaEncomendaSchema>;