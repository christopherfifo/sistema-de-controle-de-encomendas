"use server";

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { MoradoresUnidades, StatusEncomenda } from "@prisma/client";
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

    revalidatePath(`/(app)/[slug]`, "page");

    return { success: true, message: "Encomenda registrada com sucesso!" };
  } catch (error) {
    console.error("Erro ao registrar encomenda:", error);
    throw new Error("Não foi possível registrar a encomenda. Tente novamente.");
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

  const { id_usuario_retirada, documento_retirante } = validatedData.data;

  const encomenda = await db.encomenda.findUnique({
    where: { id_encomenda: encomendaId },
  });

  if (!encomenda) {
    throw new Error("Encomenda não encontrada.");
  }
  if (encomenda.status !== StatusEncomenda.PENDENTE) {
    throw new Error("Esta encomenda não está mais pendente de retirada.");
  }

  try {
    const [_, retirada] = await db.$transaction([
      db.encomenda.update({
        where: { id_encomenda: encomendaId },
        data: {
          status: StatusEncomenda.ENTREGUE,
        },
      }),

      db.retirada.create({
        data: {
          id_encomenda: encomendaId,
          id_usuario_retirada: id_usuario_retirada,
          data_retirada: new Date(),
          forma_confirmacao: "DOCUMENTO",
          comprovante: documento_retirante,
        },
      }),
    ]);

    revalidatePath(`/(app)/[slug]`, "page");

    return { success: true, message: "Retirada registrada com sucesso!" };
  } catch (error) {
    console.error("Erro na transação de retirada:", error);
    throw new Error("Não foi possível registrar a retirada. Tente novamente.");
  }
}
