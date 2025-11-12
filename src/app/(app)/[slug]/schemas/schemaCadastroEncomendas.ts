import { z } from "zod";

export const cadastroEncomendaSchema = z.object({
  id_unidade: z.string().uuid("Unidade inválida."),
  tipo_encomenda: z.string().min(3, "Tipo é obrigatório."),
  forma_entrega: z.string().min(3, "Forma de entrega é obrigatória."),
  tamanho: z.string().min(1, "Tamanho é obrigatório."),
  codigo_rastreio: z.string().optional(),
  condicao: z.string().optional(),
});

export type CadastroEncomendaFormData = z.infer<typeof cadastroEncomendaSchema>;
