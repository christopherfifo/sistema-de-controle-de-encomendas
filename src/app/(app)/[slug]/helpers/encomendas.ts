"use server";

import { db } from "@/lib/prisma";
import axios from "axios";
import { revalidatePath } from "next/cache";
import { StatusEncomenda } from "@prisma/client";
import { enviarNotificacaoRetiradaTelegram } from "@/lib/telegramService";

import {
  registroEncomendaSchema,
  RegistroEncomendaFormData,
} from "../schemas/schemaRegistroPorteiro";

import {
  cadastroEncomendaSchema,
  CadastroEncomendaFormData,
} from "../schemas/schemaCadastroEncomendas";

import {
  RetiradaEncomendaFormData,
  retiradaEncomendaSchema,
} from "../schemas/schemaRetiradaPorteiro";

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

export async function registrarEncomendaPorteiro(
  porteiroId: string,
  condominioId: string,
  data: RegistroEncomendaFormData,
) {
  if (!porteiroId || !condominioId) {
    throw new Error("Usuário ou condomínio não identificado.");
  }

  const validatedData = registroEncomendaSchema.safeParse(data);
  if (!validatedData.success) {
    throw new Error(validatedData.error.issues[0].message);
  }

  const { id_unidade, ...encomendaData } = validatedData.data;

  const unidade = await db.unidade.findUnique({
    where: { id_unidade: id_unidade },
    select: { id_condominio: true },
  });

  if (!unidade || unidade.id_condominio !== condominioId) {
    throw new Error(
      "Permissão negada. A unidade selecionada não pertence a este condomínio.",
    );
  }

  try {
    await db.encomenda.create({
      data: {
        ...encomendaData,
        id_unidade: id_unidade,
        id_porteiro_recebimento: porteiroId,
        data_recebimento: new Date(),
        status: StatusEncomenda.PENDENTE,
        id_usuario_cadastro: null,
      },
    });

    await enviarNotificacaoTelegram(id_unidade, encomendaData.tipo_encomenda, encomendaData.forma_entrega);

    revalidatePath(`/(app)/[slug]`, "page");
    return { success: true, message: "Encomenda registrada com sucesso!" };
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao registrar a encomenda.");
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
  data: RetiradaEncomendaFormData,
  encomendaId: string,
  porteiroId: string,
) {
  const validatedData = retiradaEncomendaSchema.safeParse(data);
  if (!validatedData.success) {
    throw new Error(validatedData.error.issues[0].message);
  }

  const { token_retirante } = validatedData.data;

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

  const morador = await db.usuario.findUnique({
    where: { token_acesso: token_retirante },
  });

  if (!morador) {
    throw new Error("Token inválido ou expirado. Verifique o código com o morador.");
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
          id_usuario_retirada: morador.id_usuario,
          data_retirada: new Date(),
          forma_confirmacao: "TOKEN",
          comprovante: `Validado via Token de Segurança`,
        },
      }),

      db.usuario.update({
        where: { id_usuario: morador.id_usuario },
        data: { token_acesso: null }
      })
    ]);

    if (morador.telegram_chat_id) {
      enviarNotificacaoRetiradaTelegram({
        chatId: morador.telegram_chat_id,
        moradorNome: morador.nome_completo,
        bloco: encomenda?.unidade.bloco_torre || encomenda.unidade.bloco_torre,
        apartamento: encomenda.unidade.numero_unidade,
        tipoEncomenda: encomenda.tipo_encomenda,
        formaEntrega: encomenda.forma_entrega,
        codigoRastreio: encomenda.codigo_rastreio,
        dataRetirada: new Date(),
        quemRetirouNome: morador.nome_completo,
        urlFotoProduto: encomenda.url_foto_pacote
      }).catch((err) => {
        console.error("[TELEGRAM_BG_ERROR] Falha ao notificar saída:", err);
      });
    }

    revalidatePath(`/(app)/[slug]`, "page");

    return { success: true, message: "Retirada por Token registrada com sucesso!" };
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

async function enviarNotificacaoTelegram(unidadeId: string, tipo: string, origem: string) {
  try {
    const moradoresDaUnidade = await db.moradoresUnidades.findMany({
      where: { id_unidade: unidadeId },
      include: {
        usuario: {
          select: { telegram_chat_id: true }
        }
      }
    });

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

    if (!BOT_TOKEN) return;

    for (const vinculo of moradoresDaUnidade) {
      const chatId = vinculo.usuario.telegram_chat_id;
      if (chatId) {
        const texto = `📦 *SysCondomínio — Nova Encomenda!*\n\nOlá! Um pacote do tipo *${tipo}* (${origem}) acabou de chegar na portaria.\n\nGere o seu *Token de 6 dígitos* no painel para efetuar a retirada em segurança!`;
        
        await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          chat_id: chatId,
          text: texto,
          parse_mode: "Markdown"
        });
      }
    }
  } catch (err) {
    console.error("Falha silenciosa no envio do Telegram:", err);
  }
}