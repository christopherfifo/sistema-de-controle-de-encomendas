"use server";

import { db } from "@/lib/prisma";
import axios from "axios";
import { revalidatePath } from "next/cache";
import { StatusEncomenda } from "@prisma/client";
import { enviarNotificacaoRetiradaTelegram } from "@/lib/telegramService";

import {
  cadastroEncomendaSchema,
  CadastroEncomendaFormData,
} from "../schemas/schemaCadastroEncomendas";

import { retiradaEncomendaSchema } from "../schemas/schemaRetiradaPorteiro";

export async function cancelarEncomendaMorador(
  encomendaId: string,
  userId: string,
  condominioSlug: string,
) {
  if (!userId || !encomendaId) {
    throw new Error("IDs de usuário e encomenda são obrigatórios.");
  }

  const encomenda = await db.encomenda.findUnique({
    where: {
      id_encomenda: encomendaId,
    },
  });

  if (!encomenda) {
    throw new Error("Encomenda não encontrada.");
  }

  if (encomenda.id_usuario_cadastro !== userId) {
    throw new Error("Você não tem permissão para cancelar esta encomenda.");
  }

  if (encomenda.status !== StatusEncomenda.PENDENTE) {
    throw new Error("Esta encomenda não pode mais ser cancelada.");
  }

  await db.encomenda.update({
    where: {
      id_encomenda: encomendaId,
    },
    data: {
      status: StatusEncomenda.CANCELADA,
    },
  });

  revalidatePath(`/${condominioSlug}`);
}

export async function cadastrarEncomendaMorador(
  userId: string,
  condominioSlug: string,
  data: CadastroEncomendaFormData,
) {
  if (!userId) {
    throw new Error("Usuário não autenticado.");
  }

  const validatedData = cadastroEncomendaSchema.safeParse(data);
  if (!validatedData.success) {
    throw new Error(validatedData.error.issues[0].message);
  }

  const {
    id_unidade,
    tipo_encomenda,
    forma_entrega,
    tamanho,
    codigo_rastreio,
    condicao,
  } = validatedData.data;

  const vinculo = await db.moradoresUnidades.findFirst({
    where: {
      id_usuario: userId,
      id_unidade: id_unidade,
    },
  });

  if (!vinculo) {
    throw new Error("Você não tem permissão para cadastrar nesta unidade.");
  }

  await db.encomenda.create({
    data: {
      id_unidade: id_unidade,
      id_usuario_cadastro: userId,
      tipo_encomenda: tipo_encomenda,
      tamanho: tamanho,
      forma_entrega: forma_entrega,
      codigo_rastreio: codigo_rastreio,
      condicao: condicao,
      status: StatusEncomenda.PENDENTE,
      id_porteiro_recebimento: null,
      data_recebimento: null,
    },
  });
}

interface EncomendaData {
  id_usuario_morador?: string;
  bloco_manual?: string;
  apartamento_manual?: string;
  tipo_encomenda: string;
  forma_entrega: string;
  codigo_rastreio?: string;
  condicao?: string;
  foto_pacote?: string;
  nome_manual_retirante?: string;
}

export async function registrarEncomendaPorteiro(
  porteiroId: string,
  condominioId: string,
  data: EncomendaData,
) {
  if (!porteiroId || !condominioId) {
    throw new Error("Usuário ou condomínio não identificado.");
  }

  let unidadeIdFinal = "";

  if (data.id_usuario_morador) {
    const vinculo = await db.moradoresUnidades.findFirst({
      where: { id_usuario: data.id_usuario_morador },
      select: { id_unidade: true }
    });
    if (vinculo) unidadeIdFinal = vinculo.id_unidade;
  }

  if (!unidadeIdFinal) {
    let unidadeExistente = await db.unidade.findFirst({
      where: {
        id_condominio: condominioId,
        bloco_torre: data.bloco_manual || "",
        numero_unidade: data.apartamento_manual || ""
      }
    });

    if (!unidadeExistente) {
      unidadeExistente = await db.unidade.create({
        data: {
          id_condominio: condominioId,
          bloco_torre: data.bloco_manual || "",
                  numero_unidade: data.apartamento_manual || ""
        }
      });
    }
    unidadeIdFinal = unidadeExistente.id_unidade;
  }

  try {
    await db.encomenda.create({
      data: {
        id_unidade: unidadeIdFinal,
        id_porteiro_recebimento: porteiroId,
        data_recebimento: new Date(),
        tipo_encomenda: data.tipo_encomenda,
        forma_entrega: data.forma_entrega,
        codigo_rastreio: data.codigo_rastreio || null, 
        tamanho: "MEDIO",
        condicao: data.condicao,
        status: StatusEncomenda.PENDENTE,
        id_usuario_cadastro: null,
      },
    });

    await enviarNotificacaoTelegram(
      unidadeIdFinal, 
      data.tipo_encomenda, 
      data.forma_entrega,
      data.condicao || "Nenhuma observação.",
      data.foto_pacote
    );

    revalidatePath(`/(app)/[slug]`, "page");
    return { success: true, message: "Encomenda registrada e morador notificado!" };
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao registrar a encomenda na portaria.");
  }
}
export async function getMoradoresDaUnidade(
  unidadeId: string,
  condominioId: string,
) {
  if (!unidadeId || !condominioId) {
    throw new Error("ID da unidade ou condomínio não fornecido.");
  }

  const unidade = await db.unidade.findFirst({
    where: {
      id_unidade: unidadeId,
      id_condominio: condominioId,
    },
  });

  if (!unidade) {
    throw new Error(
      "Unidade não encontrada ou não pertence a este condomínio.",
    );
  }

  const moradores = await db.moradoresUnidades.findMany({
    where: {
      id_unidade: unidadeId,
    },
    include: {
      usuario: {
        select: {
          id_usuario: true,
          nome_completo: true,
        },
      },
    },
  });

  return moradores.map((morador) => morador.usuario);
}

export async function registrarRetiradaEncomenda(
  data: {
    tipo_confirmacao: "TOKEN" | "MANUAL";
    token_retirante?: string | null;
    cpf_retirante?: string | null;
  },
  encomendaId: string,
  porteiroId: string,
) {
  const validatedData = retiradaEncomendaSchema.safeParse(data);
  if (!validatedData.success) {
    throw new Error(validatedData.error.issues[0].message);
  }

  const { tipo_confirmacao, token_retirante, cpf_retirante } = validatedData.data;

  const encomenda = await db.encomenda.findUnique({
    where: { id_encomenda: encomendaId },
    include: { unidade: true },
  });

  if (!encomenda) {
    throw new Error("Encomenda não encontrada.");
  }
  if (encomenda.status !== StatusEncomenda.PENDENTE) {
    throw new Error("Esta encomenda não está mais pendente de retirada.");
  }

  let moradorAlvo;

  if (tipo_confirmacao === "TOKEN") {
    if (!token_retirante) throw new Error("Token é obrigatório para validação automática.");
    
    moradorAlvo = await db.usuario.findUnique({
      where: { token_acesso: token_retirante },
    });

    if (!moradorAlvo) {
      throw new Error("Token inválido ou expirado. Verifique com o morador.");
    }
  } else {
    if (!cpf_retirante || cpf_retirante.trim() === "") {
      throw new Error("O campo CPF é obrigatório para a baixa manual.");
    }

    const cpfLimpoInput = cpf_retirante.replace(/\D/g, "");

    moradorAlvo = await db.usuario.findFirst({
      where: { 
        cpf: cpfLimpoInput,
        id_condominio: encomenda.unidade.id_condominio 
      },
    });

    if (!moradorAlvo) {
      throw new Error("Nenhum morador encontrado com este CPF neste condomínio.");
    }
  }

  try {
    await db.$transaction([
      db.encomenda.update({
        where: { id_encomenda: encomendaId },
        data: {
          status: StatusEncomenda.ENTREGUE,
        },
      }),

      db.retirada.create({
        data: {
          id_encomenda: encomendaId,
          id_usuario_retirada: moradorAlvo.id_usuario,
          data_retirada: new Date(),
          forma_confirmacao: tipo_confirmacao,
          comprovante: tipo_confirmacao === "TOKEN" 
            ? `Validado via Token de Segurança`
            : `Confirmado manualmente via checagem direta de CPF`,
        },
      }),

      ...(tipo_confirmacao === "TOKEN" ? [
        db.usuario.update({
          where: { id_usuario: moradorAlvo.id_usuario },
          data: { token_acesso: null }
        })
      ] : [])
    ]);

    if (moradorAlvo.telegram_chat_id) {
      enviarNotificacaoRetiradaTelegram({
        chatId: moradorAlvo.telegram_chat_id,
        moradorNome: moradorAlvo.nome_completo,
        bloco: encomenda.unidade.bloco_torre,
        apartamento: encomenda.unidade.numero_unidade,
        tipoEncomenda: encomenda.tipo_encomenda,
        formaEntrega: encomenda.forma_entrega,
        codigoRastreio: encomenda.codigo_rastreio,
        dataRetirada: new Date(),
        quemRetirouNome: moradorAlvo.nome_completo,
        urlFotoProduto: null // Foto não é mais armazenada no banco
      }).catch((err) => {
        console.error("[TELEGRAM_BG_ERROR] Falha ao notificar saída:", err);
      });
    }

    revalidatePath(`/(app)/[slug]`, "page");

    return { success: true, message: `Retirada registrada com sucesso para ${moradorAlvo.nome_completo}!` };
  } catch (error) {
    console.error("Erro na transação de retirada:", error);
    throw new Error("Não foi possível registrar a retirada. Tente novamente.");
  }
}

export async function gerarNovoTokenRetirada(userId: string) {
  const novoToken = Math.floor(100000 + Math.random() * 900000).toString();

  await db.usuario.update({
    where: { id_usuario: userId },
    data: { token_acesso: novoToken },
  });

  revalidatePath("/");
  return { success: true, token: novoToken };
}

export async function confirmarChegadaEncomendaMorador(
  encomendaId: string,
  porteiroId: string,
  formData: FormData
) {
  if (!encomendaId || !porteiroId) {
    throw new Error("IDs de encomenda e porteiro são obrigatórios.");
  }

  const condicaoPorteiro = formData.get("condicaoPorteiro") as string;

  if (!condicaoPorteiro || condicaoPorteiro.trim() === "") {
    throw new Error("A condição/estado do pacote é obrigatória.");
  }

  const encomenda = await db.encomenda.findUnique({
    where: { id_encomenda: encomendaId },
    include: { unidade: true },
  });

  if (!encomenda) {
    throw new Error("Encomenda não encontrada.");
  }

  if (encomenda.id_porteiro_recebimento) {
    throw new Error("Esta encomenda já foi recebida por um porteiro.");
  }

  try {
    const fotoFile = formData.get("foto") as File | null;
    let urlFotoPacote = null;

    if (fotoFile && fotoFile.size > 0) {
      const arrayBuffer = await fotoFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      urlFotoPacote = `data:${fotoFile.type};base64,${buffer.toString("base64")}`;
    }

    await db.encomenda.update({
      where: { id_encomenda: encomendaId },
      data: {
        id_porteiro_recebimento: porteiroId,
        data_recebimento: new Date(),
        condicao: condicaoPorteiro,
      },
    });

    await enviarNotificacaoTelegram(
      encomenda.id_unidade,
      encomenda.tipo_encomenda,
      encomenda.forma_entrega,
      condicaoPorteiro,
      fotoFile || undefined
    );

    revalidatePath(`/(app)/[slug]`, "page");
    return { success: true, message: "Chegada do pacote registrada e morador notificado!" };
  } catch (error) {
    console.error("Erro ao confirmar chegada da encomenda:", error);
    throw new Error("Não foi possível registrar o recebimento da encomenda.");
  }
}

async function enviarNotificacaoTelegram(
  unidadeId: string,
  tipo: string,
  origem: string,
  observacaoPorteiro: string,
  fotoPacote?: string | Blob 
) {
  try {
    const unidade = await db.unidade.findUnique({
      where: { id_unidade: unidadeId },
      include: { moradores: { include: { usuario: true } } }
    });

    if (!unidade) return;

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    if (!BOT_TOKEN) return;

    for (const vinculo of unidade.moradores) {
      const chatId = vinculo.usuario.telegram_chat_id;
      const nomeMorador = vinculo.usuario.nome_completo;

      if (chatId) {
        const texto = [
          `📦 *🚨 Nova Encomenda Registrada na Portaria!*`,
          ``,
          `Olá, *${nomeMorador}*! Um novo volume deu entrada para você neste momento.`,
          ``,
          `🏢 *Local de Entrega:* Bloco ${unidade.bloco_torre} - Ap ${unidade.numero_unidade}`,
          `📦 *Volume:* ${tipo} (${origem})`,
          `📝 *Obs da Portaria:* _${observacaoPorteiro}_`,
          ``,
          `🔑 Gere seu Token de 8 dígitos no painel para efetuar a retirada com o porteiro.`
        ].join("\n");
        
        if (fotoPacote) {
          const telegramFormData = new FormData();
          telegramFormData.append("chat_id", chatId);
          telegramFormData.append("caption", texto);
          telegramFormData.append("parse_mode", "Markdown");
          
          if (typeof fotoPacote === "string") {
            if (fotoPacote.startsWith("data:")) {
              const fetchRes = await fetch(fotoPacote);
              const blob = await fetchRes.blob();
              telegramFormData.append("photo", blob, "pacote.jpg");
            } else {
              telegramFormData.append("photo", fotoPacote);
            }
          } else {
            telegramFormData.append("photo", fotoPacote, "pacote.jpg");
          }

          const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
            method: "POST",
            body: telegramFormData,
          });

          if (!res.ok) {
            const errorData = await res.json();
            console.error("[TELEGRAM_API_ERROR] Falha ao enviar foto:", errorData);
          }
        } else {
          await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            chat_id: chatId,
            text: texto,
            parse_mode: "Markdown"
          });
        }
      }
    }
  } catch (err) {
    console.error("Falha ao enviar dados de imagem para o Telegram:", err);
  }
}

export async function buscarMoradoresPorNome(condominioId: string, termo: string) {
  if (!termo || termo.trim().length < 2) return [];

  try {
    const moradores = await db.moradoresUnidades.findMany({
      where: {
        unidade: { 
          id_condominio: condominioId 
        },
        usuario: {
          nome_completo: { 
            contains: termo, 
            mode: "insensitive" 
          }
        }
      },
      include: {
        usuario: true,
        unidade: true
      },
      take: 6
    });

    return moradores.map(m => ({
      id_usuario: m.usuario.id_usuario,
      nome_completo: m.usuario.nome_completo,
      bloco: m.unidade.bloco_torre,
      apartamento: m.unidade.numero_unidade,
      id_unidade: m.id_unidade
    }));
  } catch (error) {
    console.error("Erro na busca de moradores:", error);
    return [];
  }
}