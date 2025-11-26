import { z } from "zod";

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
