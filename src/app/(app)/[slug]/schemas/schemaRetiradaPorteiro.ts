import { z } from "zod";

export const retiradaEncomendaSchema = z.object({
  tipo_confirmacao: z.enum(["TOKEN", "MANUAL"]),
  token_retirante: z
    .string()
    .min(1, { message: "O token não pode estar vazio." })
    .max(10, { message: "O token é muito longo." }) 
    .optional()
    .nullable(),
  id_usuario_retirada: z.string().optional().nullable(),
  cpf_retirante: z.string().optional().nullable(),
});

export type RetiradaEncomendaFormData = z.infer<typeof retiradaEncomendaSchema>;

export const confirmarChegadaSchema = z.object({
  condicaoPorteiro: z.string().min(3, { message: "Digite uma descrição sobre o estado do pacote." }),
  foto_pacote: z.any().optional(), 
});

export type ConfirmarChegadaFormData = z.infer<typeof confirmarChegadaSchema>;