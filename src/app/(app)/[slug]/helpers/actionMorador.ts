"use server";

import { db } from "@/lib/prisma";
import { PerfilUsuario } from "@prisma/client";
import { revalidatePath } from "next/cache";

interface OperacaoMoradorParams {
  moradorId: string;
  condominioId: string;
  sindicoId: string;
  tokenSindico: string;
  idUnidade?: string; 
}


async function validarTokenSindico(sindicoId: string, condominioId: string, tokenDigitado: string) {
  const sindico = await db.usuario.findFirst({
    where: {
      id_usuario: sindicoId,
      id_condominio: condominioId,
      perfil: PerfilUsuario.SINDICO,
    },
    select: { token_acesso: true },
  });

  if (!sindico) {
    throw new Error("Acesso negado. Apenas síndicos realizam esta ação.");
  }

  const tokenLimpoDigitado = tokenDigitado.replace("-", "").trim();
  const tokenLimpoBanco = sindico.token_acesso?.replace("-", "").trim();

  if (!tokenLimpoBanco || tokenLimpoDigitado !== tokenLimpoBanco) {
    throw new Error("Token de confirmação inválido. Operação cancelada.");
  }
}


export async function removerMoradorDoCondominio({
  moradorId,
  condominioId,
  sindicoId,
  tokenSindico,
}: OperacaoMoradorParams) {
  try {
    await validarTokenSindico(sindicoId, condominioId, tokenSindico);

    await db.$transaction(async (tx) => {
      await tx.moradoresUnidades.deleteMany({
        where: {
          id_usuario: moradorId,
          unidade: { id_condominio: condominioId },
        },
      });

      await tx.usuario.update({
        where: { id_usuario: moradorId },
        data: { ativo: false },
      });
    });

    revalidatePath(`/(app)/[slug]/gerenciarMoradores`, "page");
    return { success: true, message: "Morador desvinculado e bloqueado com sucesso!" };
  } catch (error: any) {
    return { success: false, message: error.message || "Erro ao remover morador." };
  }
}

export async function reativarMoradorNoCondominio({
  moradorId,
  condominioId,
  sindicoId,
  tokenSindico,
  idUnidade,
}: OperacaoMoradorParams) {
  try {
    if (!idUnidade) {
      return { success: false, message: "É necessário selecionar uma unidade para reativar o morador." };
    }

    await validarTokenSindico(sindicoId, condominioId, tokenSindico);

    await db.$transaction(async (tx) => {
      await tx.usuario.update({
        where: { id_usuario: moradorId },
        data: { ativo: true },
      });

      const vinculoExistente = await tx.moradoresUnidades.findFirst({
        where: { id_usuario: moradorId, id_unidade: idUnidade },
      });

      if (!vinculoExistente) {
        await tx.moradoresUnidades.create({
          data: {
            id_usuario: moradorId,
            id_unidade: idUnidade,
            principal: true, // Define como morador principal daquela nova ativação
          },
        });
      }
    });

    revalidatePath(`/(app)/[slug]/gerenciarMoradores`, "page");
    return { success: true, message: "Morador reativado e vinculado com sucesso!" };
  } catch (error: any) {
    return { success: false, message: error.message || "Erro ao reativar morador." };
  }
}