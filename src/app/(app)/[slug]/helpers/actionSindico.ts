"use server";

import { db } from "@/lib/prisma";
import { PerfilUsuario } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { isValideCPF } from "@/helpers/cpf";
import { getOrCreateUserToken } from "./token";
import {
  registroUnidadeSchema,
  RegistroUnidadeFormData,
  registroSindicoSchema,
  edicaoSindicoSchema,
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
    (user.perfil !== PerfilUsuario.SINDICO && user.perfil !== PerfilUsuario.ADMINISTRADOR) ||
    user.id_condominio !== condominioId
  ) {
    return {
      success: false,
      message:
        "Acesso negado. Apenas o Síndico ou Administrador deste condomínio pode adicionar unidades.",
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

async function verificarPermissaoAdministrador(adminId: string) {
  const admin = await db.usuario.findFirst({
    where: {
      id_usuario: adminId,
      perfil: PerfilUsuario.ADMINISTRADOR,
    },
  });
  if (!admin)
    throw new Error("Acesso negado. Apenas administradores realizam esta ação.");
}

export async function adicionarSindico(
  values: z.infer<typeof registroSindicoSchema>,
  condominioId: string,
  adminId: string,
) {
  try {
    await verificarPermissaoAdministrador(adminId);
    const validated = await registroSindicoSchema.safeParseAsync(values);
    if (!validated.success)
      return { success: false, message: "Dados inválidos." };

    const {
      nomeCompleto,
      email: rawEmail,
      cpf: rawCpf,
      senha,
      telefone,
      moraNoCondominio,
      id_unidade,
    } = validated.data;

    const email = rawEmail.trim();
    const cpf = rawCpf.trim();

    const isCpfReal = await isValideCPF(cpf);
    if (!isCpfReal)
      return {
        success: false,
        message: "O CPF informado é inválido na Receita Federal.",
      };

    const existingUser = await db.usuario.findFirst({
      where: { OR: [{ email }, { cpf }] },
    });
    if (existingUser)
      return { success: false, message: "Email ou CPF já cadastrados." };

    const hashedPassword = await bcrypt.hash(senha, 10);

    let tokenFinal = "";

    await db.$transaction(async (tx) => {
      const usuario = await tx.usuario.create({
        data: {
          nome_completo: nomeCompleto,
          email,
          cpf,
          senha_hash: hashedPassword,
          telefone,
          perfil: PerfilUsuario.SINDICO,
          id_condominio: condominioId,
        },
      });

      tokenFinal = await getOrCreateUserToken({
        userId: usuario.id_usuario,
        length: 6,
        formatted: false,
        prisma: tx,
      });

      if (moraNoCondominio && id_unidade) {
        await tx.moradoresUnidades.create({
          data: { id_usuario: usuario.id_usuario, id_unidade, principal: true },
        });
      }
    });

    revalidatePath(`/(app)/[slug]/cadastroSindico`, "page");

    return {
      success: true,
      message: "Síndico cadastrado com sucesso!",
      token_acesso: tokenFinal,
    };
  } catch (error: unknown) {
    const err = error as Error;
    return { success: false, message: err.message || "Erro." };
  }
}

export async function atualizarSindico(
  values: z.infer<typeof edicaoSindicoSchema>,
  condominioId: string,
  adminId: string,
) {
  try {
    await verificarPermissaoAdministrador(adminId);
    const validated = edicaoSindicoSchema.safeParse(values);
    if (!validated.success)
      return { success: false, message: "Dados inválidos." };

    const {
      id_usuario,
      nomeCompleto,
      email,
      telefone,
      moraNoCondominio,
      id_unidade,
    } = validated.data;

    await db.$transaction(async (tx) => {
      await tx.usuario.update({
        where: { id_usuario: id_usuario, id_condominio: condominioId },
        data: { nome_completo: nomeCompleto, email, telefone },
      });

      if (moraNoCondominio && id_unidade) {
        const jaMora = await tx.moradoresUnidades.findFirst({
          where: { id_usuario, id_unidade },
        });
        if (!jaMora) {
          await tx.moradoresUnidades.create({
            data: { id_usuario, id_unidade, principal: true },
          });
        }
      } else {
        await tx.moradoresUnidades.deleteMany({ where: { id_usuario } });
      }
    });

    revalidatePath(`/(app)/[slug]/cadastroSindico`, "page");
    return {
      success: true,
      message: "Dados do síndico atualizados com sucesso!",
    };
  } catch (error: unknown) {
    const err = error as Error;
    return { success: false, message: err.message || "Erro." };
  }
}

export async function transformarMoradorEmSindico(
  moradorId: string,
  condominioId: string,
  adminId: string,
) {
  try {
    await verificarPermissaoAdministrador(adminId);

    await db.usuario.update({
      where: { id_usuario: moradorId, id_condominio: condominioId },
      data: { perfil: PerfilUsuario.SINDICO },
    });

    const tokenAcesso = await getOrCreateUserToken({
      userId: moradorId,
      length: 6,
      formatted: false,
    });

    revalidatePath(`/(app)/[slug]/cadastroSindico`, "page");
    return {
      success: true,
      message:
        "Morador promovido a Síndico com sucesso!",
      token_acesso: tokenAcesso,
    };
  } catch (error: unknown) {
    const err = error as Error;
    return { success: false, message: err.message || "Erro." };
  }
}

export async function alternarStatusSindico(
  sindicoId: string,
  atualStatus: boolean,
  condominioId: string,
) {
  try {
    await db.usuario.update({
      where: { id_usuario: sindicoId, id_condominio: condominioId },
      data: { ativo: !atualStatus },
    });
    revalidatePath(`/(app)/[slug]/cadastroSindico`, "page");
    return { success: true, message: "Status alterado!" };
  } catch {
    return { success: false, message: "Erro ao alterar status." };
  }
}

export async function excluirSindico(
  sindicoId: string,
  condominioId: string,
) {
  try {
    const usuario = await db.usuario.findUnique({
      where: { id_usuario: sindicoId, id_condominio: condominioId },
      include: { unidades_residenciais: true },
    });

    if (!usuario) {
      return { success: false, message: "Usuário não encontrado." };
    }

    if (usuario.unidades_residenciais.length > 0) {
      await db.usuario.update({
        where: { id_usuario: sindicoId, id_condominio: condominioId },
        data: { perfil: PerfilUsuario.MORADOR },
      });
      revalidatePath(`/(app)/[slug]/cadastroSindico`, "page");
      return { success: true, message: "Cargo removido. Usuário voltou a ser morador." };
    }

    await db.usuario.delete({
      where: { id_usuario: sindicoId, id_condominio: condominioId },
    });
    revalidatePath(`/(app)/[slug]/cadastroSindico`, "page");
    return { success: true, message: "Removido do sistema." };
  } catch {
    return {
      success: false,
      message:
        "Este usuário possui registros atrelados, desative-o em vez de excluir.",
    };
  }
}
