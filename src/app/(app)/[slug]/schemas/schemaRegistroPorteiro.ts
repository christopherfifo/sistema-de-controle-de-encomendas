import { z } from "zod";

export const registroEncomendaSchema = z.object({
  id_usuario_morador: z.string().optional().nullable(),
  nome_manual_retirante: z.string().optional().nullable(),
  bloco_manual: z.string().min(1, { message: "Informe o Bloco/Torre." }),
  apartamento_manual: z.string().min(1, { message: "Informe o Apartamento." }),
  tipo_encomenda: z.string().min(1, { message: "Selecione o tipo da encomenda." }),
  forma_entrega: z.string().min(1, { message: "Selecione a empresa/forma de entrega." }),
  codigo_rastreio: z.string().optional().nullable(),
  condicao: z.string().min(3, { message: "Descreva o estado físico do pacote." }),
  foto_pacote: z.any().optional(),
});

export type RegistroEncomendaFormData = z.infer<typeof registroEncomendaSchema>;