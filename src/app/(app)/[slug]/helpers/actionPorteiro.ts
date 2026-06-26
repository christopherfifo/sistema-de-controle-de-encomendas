"use server";

import { z } from "zod";
import { db } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import {
  registroPorteiroSchema,
  edicaoPorteiroSchema,
} from "../schemas/schemaPorteiro";
import { isValideCPF } from "@/helpers/cpf";
import { PerfilUsuario } from "@prisma/client";
import { getOrCreateUserToken } from "./token";

async function verificarPermissaoSindico(
  sindicoId: string,
  condominioId: string,
) {
  const sindico = await db.usuario.findFirst({
    where: {
      id_usuario: sindicoId,
      id_condominio: condominioId,
      perfil: PerfilUsuario.SINDICO,
    },
  });
  if (!sindico)
    throw new Error("Acesso negado. Apenas síndicos realizam esta ação.");
}

export async function adicionarPorteiro(
  values: z.infer<typeof registroPorteiroSchema>,
  condominioId: string,
  sindicoId: string,
) {
  try {
    await verificarPermissaoSindico(sindicoId, condominioId);
    const validated = await registroPorteiroSchema.safeParseAsync(values);
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
          perfil: PerfilUsuario.PORTEIRO,
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

    revalidatePath(`/(app)/[slug]/gerenciarFuncionarios`, "page");

    return {
      success: true,
      message: "Porteiro cadastrado com sucesso!",
      token_acesso: tokenFinal,
    };
  } catch (error: unknown) {
    const err = error as Error;
    return { success: false, message: err.message || "Erro." };
  }
}

export async function atualizarPorteiro(
  values: z.infer<typeof edicaoPorteiroSchema>,
  condominioId: string,
  sindicoId: string,
) {
  try {
    await verificarPermissaoSindico(sindicoId, condominioId);
    const validated = edicaoPorteiroSchema.safeParse(values);
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

    revalidatePath(`/(app)/[slug]/gerenciarFuncionarios`, "page");
    return {
      success: true,
      message: "Dados do funcionário updated com sucesso!",
    };
  } catch (error: unknown) {
    const err = error as Error;
    return { success: false, message: err.message || "Erro." };
  }
}

export async function transformarMoradorEmPorteiro(
  moradorId: string,
  condominioId: string,
  sindicoId: string,
) {
  try {
    await verificarPermissaoSindico(sindicoId, condominioId);

    await db.usuario.update({
      where: { id_usuario: moradorId, id_condominio: condominioId },
      data: { perfil: PerfilUsuario.PORTEIRO },
    });

    const tokenAcesso = await getOrCreateUserToken({
      userId: moradorId,
      length: 6,
      formatted: false,
    });

    revalidatePath(`/(app)/[slug]/gerenciarFuncionarios`, "page");
    return {
      success: true,
      message:
        "Morador promovido a Porteiro com sucesso! Ele agora tem acesso à portaria.",
      token_acesso: tokenAcesso,
    };
  } catch (error: unknown) {
    const err = error as Error;
    return { success: false, message: err.message || "Erro." };
  }
}

export async function alternarStatusPorteiro(
  porteiroId: string,
  atualStatus: boolean,
  condominioId: string,
) {
  try {
    await db.usuario.update({
      where: { id_usuario: porteiroId, id_condominio: condominioId },
      data: { ativo: !atualStatus },
    });
    revalidatePath(`/(app)/[slug]/gerenciarFuncionarios`, "page");
    return { success: true, message: "Status alterado!" };
  } catch {
    return { success: false, message: "Erro ao alterar status." };
  }
}

export async function excluirPorteiro(
  porteiroId: string,
  condominioId: string,
) {
  try {
    const porteiro = await db.usuario.findFirst({
      where: { id_usuario: porteiroId, id_condominio: condominioId },
      include: { unidades_residenciais: true },
    });

    if (!porteiro) {
      return { success: false, message: "Porteiro não encontrado." };
    }

    if (porteiro.unidades_residenciais.length > 0) {
      await db.usuario.update({
        where: { id_usuario: porteiroId },
        data: { perfil: PerfilUsuario.MORADOR },
      });
      revalidatePath(`/(app)/[slug]/gerenciarFuncionarios`, "page");
      return { success: true, message: "Porteiro removido do cargo. Como reside no local, voltou a ser apenas Morador." };
    }

    await db.usuario.delete({
      where: { id_usuario: porteiroId, id_condominio: condominioId },
    });
    revalidatePath(`/(app)/[slug]/gerenciarFuncionarios`, "page");
    return { success: true, message: "Removido do sistema." };
  } catch {
    return {
      success: false,
      message:
        "Este usuário possui registros atrelados (ex: entregas), desative-o em vez de excluir.",
    };
  }
}
