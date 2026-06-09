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

async function validarTokenSindico(
  sindicoId: string,
  condominioId: string,
  tokenDigitado: string,
) {
  const sindico = await db.usuario.findFirst({
    where: {
      id_usuario: sindicoId,
      id_condominio: condominioId,
      perfil: { in: [PerfilUsuario.SINDICO, PerfilUsuario.ADMINISTRADOR] },
    },
    select: { token_acesso: true },
  });

  if (!sindico) {
    throw new Error("Acesso negado. Apenas síndicos e administradores realizam esta ação.");
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
      const vinculosPrincipais = await tx.moradoresUnidades.findMany({
        where: {
          id_usuario: moradorId,
          principal: true,
          unidade: { id_condominio: condominioId },
        },
        select: { id_unidade: true },
      });

      await tx.moradoresUnidades.deleteMany({
        where: {
          id_usuario: moradorId,
          unidade: { id_condominio: condominioId },
        },
      });

      for (const v of vinculosPrincipais) {
        const outroMorador = await tx.moradoresUnidades.findFirst({
          where: { id_unidade: v.id_unidade },
          orderBy: { usuario: { data_criacao: "asc" } }, 
        });

        if (outroMorador) {
          await tx.moradoresUnidades.update({
            where: { id_morador_unidade: outroMorador.id_morador_unidade },
            data: { principal: true },
          });
        }
      }

      await tx.usuario.update({
        where: { id_usuario: moradorId },
        data: { ativo: false },
      });
    });

    revalidatePath(`/(app)/[slug]/gerenciarCadastroMoradores`, "page");
    return {
      success: true,
      message: "Morador desativado e titularidade transferida (se aplicável)!",
    };
  } catch (error: unknown) {
    const err = error as Error;
    return { success: false, message: err.message || "Erro." };
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
      return {
        success: false,
        message: "É necessário selecionar uma unidade para reativar o morador.",
      };
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
        const temTitular = await tx.moradoresUnidades.findFirst({
          where: { id_unidade: idUnidade, principal: true },
        });

        await tx.moradoresUnidades.create({
          data: {
            id_usuario: moradorId,
            id_unidade: idUnidade,
            principal: !temTitular, 
          },
        });
      }
    });

    revalidatePath(`/(app)/[slug]/gerenciarCadastroMoradores`, "page");
    return {
      success: true,
      message: "Morador reativado com sucesso!",
    };
  } catch (error: unknown) {
    const err = error as Error;
    return { success: false, message: err.message || "Erro." };
  }
}

export async function alterarUnidadeMorador({
  moradorId,
  condominioId,
  sindicoId,
  tokenSindico,
  idUnidade,
}: OperacaoMoradorParams) {
  try {
    if (!idUnidade) {
      return {
        success: false,
        message: "É necessário selecionar a nova unidade.",
      };
    }

    await validarTokenSindico(sindicoId, condominioId, tokenSindico);

    await db.$transaction(async (tx) => {
      const eraTitular = await tx.moradoresUnidades.findFirst({
        where: { id_usuario: moradorId, principal: true, unidade: { id_condominio: condominioId } }
      });

      if (eraTitular) {
         const proximoMorador = await tx.moradoresUnidades.findFirst({
            where: { id_unidade: eraTitular.id_unidade, id_usuario: { not: moradorId } },
            orderBy: { usuario: { data_criacao: "asc" } }
         });
         if (proximoMorador) {
            await tx.moradoresUnidades.update({
               where: { id_morador_unidade: proximoMorador.id_morador_unidade },
               data: { principal: true }
            });
         }
      }

      await tx.moradoresUnidades.deleteMany({
        where: {
          id_usuario: moradorId,
          unidade: { id_condominio: condominioId },
        },
      });

      const temTitular = await tx.moradoresUnidades.findFirst({
        where: { id_unidade: idUnidade, principal: true },
      });

      await tx.moradoresUnidades.create({
        data: {
          id_usuario: moradorId,
          id_unidade: idUnidade,
          principal: !temTitular, 
        },
      });
    });

    revalidatePath(`/(app)/[slug]/gerenciarCadastroMoradores`, "page");
    return {
      success: true,
      message: "Unidade alterada e titularidades ajustadas!",
    };
  } catch (error: unknown) {
    const err = error as Error;
    return { success: false, message: err.message || "Erro." };
  }
}

export async function promoverMoradorATitular({
  moradorId,
  condominioId,
  sindicoId,
  tokenSindico,
  idUnidade,
}: OperacaoMoradorParams) {
  try {
    if (!idUnidade) throw new Error("Unidade não informada.");

    await validarTokenSindico(sindicoId, condominioId, tokenSindico);

    await db.$transaction(async (tx) => {
      await tx.moradoresUnidades.updateMany({
        where: { id_unidade: idUnidade, principal: true },
        data: { principal: false },
      });

      await tx.moradoresUnidades.update({
        where: {
          id_usuario_id_unidade: {
            id_usuario: moradorId,
            id_unidade: idUnidade,
          },
        },
        data: { principal: true },
      });
    });

    revalidatePath(`/(app)/[slug]/gerenciarCadastroMoradores`, "page");
    return {
      success: true,
      message: "Novo titular definido com sucesso!",
    };
  } catch (error: unknown) {
    const err = error as Error;
    return { success: false, message: err.message || "Erro." };
  }
}
