"use server";

import { db } from "@/lib/prisma";
import { PerfilUsuario } from "@prisma/client";
import { revalidatePath } from "next/cache";
import {
  registroUnidadeSchema,
  RegistroUnidadeFormData,
} from "../schemas/schemaSindico";

type ActionResponse = {
  success: boolean;
  message: string;
};

export async function adicionarUnidade(
  data: RegistroUnidadeFormData,
  condominioId: string,
  sindicoId: string,
): Promise<ActionResponse> {
  const validatedData = registroUnidadeSchema.safeParse(data);
  if (!validatedData.success) {
    return { success: false, message: validatedData.error.issues[0].message };
  }

  const { bloco_torre, numero_unidade } = validatedData.data;

  const user = await db.usuario.findUnique({
    where: { id_usuario: sindicoId },
    select: { perfil: true, id_condominio: true },
  });

  if (
    !user ||
    user.perfil !== PerfilUsuario.SINDICO ||
    user.id_condominio !== condominioId
  ) {
    return {
      success: false,
      message:
        "Acesso negado. Apenas o Síndico deste condomínio pode adicionar unidades.",
    };
  }

  const condominio = await db.condominio.findUnique({
    where: { id_condominio: condominioId },
    include: {
      plano: { select: { limite_unidades: true } },
      unidades: { select: { id_unidade: true } },
    },
  });

  if (!condominio || !condominio.plano) {
    return { success: false, message: "Condomínio ou Plano não encontrado." };
  }

  const unidadesAtuais = condominio.unidades.length;
  const limiteMaximo = condominio.plano.limite_unidades;

  if (unidadesAtuais >= limiteMaximo) {
    return {
      success: false,
      message: `Limite de unidades atingido (${unidadesAtuais}/${limiteMaximo}). Atualize seu plano.`,
    };
  }

  const unidadeExistente = await db.unidade.findFirst({
    where: {
      id_condominio: condominioId,
      bloco_torre: bloco_torre,
      numero_unidade: numero_unidade,
    },
  });

  if (unidadeExistente) {
    return {
      success: false,
      message: "Unidade já cadastrada neste bloco/torre.",
    };
  }

  try {
    await db.$transaction(async (prisma) => {
      await prisma.unidade.create({
        data: {
          id_condominio: condominioId,
          bloco_torre: bloco_torre,
          numero_unidade: numero_unidade,
        },
      });

      await prisma.condominio.update({
        where: { id_condominio: condominioId },
        data: {
          qtd_unidades: {
            increment: 1,
          },
        },
      });
    });

    revalidatePath(`/(app)/[slug]`, "page");

    return {
      success: true,
      message: `Unidade ${bloco_torre} - ${numero_unidade} adicionada com sucesso!`,
    };
  } catch (error) {
    console.error("Erro ao adicionar unidade:", error);
    return { success: false, message: "Erro interno ao cadastrar unidade." };
  }
}

export async function getSindicoData(condominioId: string) {
  const condominio = await db.condominio.findUnique({
    where: { id_condominio: condominioId },
    select: {
      nome_condominio: true,
      qtd_unidades: true,
      qtd_blocos_torres: true,
      plano: {
        select: {
          nome_plano: true,
          limite_unidades: true,
        },
      },
      unidades: {
        select: {
          id_unidade: true,
          bloco_torre: true,
          numero_unidade: true,
        },
        orderBy: [{ bloco_torre: "asc" }, { numero_unidade: "asc" }],
      },
    },
  });

  if (!condominio) {
    throw new Error("Condomínio não encontrado.");
  }

  return condominio;
}
