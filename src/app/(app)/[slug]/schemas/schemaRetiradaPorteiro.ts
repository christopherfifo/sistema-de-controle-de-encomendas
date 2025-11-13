import { z } from "zod";

export const retiradaEncomendaSchema = z.object({
  id_usuario_retirada: z
    .string()
    .uuid({ message: "Selecione um morador válido." }),
    
  documento_retirante: z
    .string()
    .min(5, { message: "Documento é obrigatório (mín. 5 caracteres)." }),
});

export type RetiradaEncomendaFormData = z.infer<typeof retiradaEncomendaSchema>;