import { z } from "zod";

export const registroEncomendaSchema = z.object({
  id_unidade: z.string().uuid({ message: "Selecione uma unidade válida." }),

  tipo_encomenda: z
    .string()
    .min(3, "O tipo da encomenda é obrigatório (ex: Caixa, Envelope)."),

  forma_entrega: z
    .string()
    .min(3, "A forma de entrega é obrigatória (ex: Correios, Amazon)."),

  tamanho: z
    .string()
    .min(1, "O tamanho é obrigatório (ex: Pequeno, Médio, Grande)."),

  codigo_rastreio: z.string().optional().nullable(),

  condicao: z.string().optional().nullable(),
});

export type RegistroEncomendaFormData = z.infer<typeof registroEncomendaSchema>;
