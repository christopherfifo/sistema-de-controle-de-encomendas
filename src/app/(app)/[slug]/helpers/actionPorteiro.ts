"use server";

import { z } from "zod";
import { db } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { registroPorteiroSchema, edicaoPorteiroSchema } from "../schemas/schemaPorteiro";
import { isValideCPF } from "@/helpers/cpf";
import { PerfilUsuario } from "@prisma/client";

async function verificarPermissaoSindico(sindicoId: string, condominioId: string) {
  const sindico = await db.usuario.findFirst({
    where: { id_usuario: sindicoId, id_condominio: condominioId, perfil: PerfilUsuario.SINDICO }
  });
  if (!sindico) throw new Error("Acesso negado. Apenas síndicos realizam esta ação.");
}

export async function adicionarPorteiro(
  values: z.infer<typeof registroPorteiroSchema>,
  condominioId: string,
  sindicoId: string
) {
  try {
    await verificarPermissaoSindico(sindicoId, condominioId);
    const validated = await registroPorteiroSchema.safeParseAsync(values);
    if (!validated.success) return { success: false, message: "Dados inválidos." };

    const { nomeCompleto, email, cpf, senha, telefone, moraNoCondominio, id_unidade } = validated.data;

    const isCpfReal = await isValideCPF(cpf);
    if (!isCpfReal) return { success: false, message: "O CPF informado é inválido na Receita Federal." };

    const existingUser = await db.usuario.findFirst({ where: { OR: [{ email }, { cpf }] } });
    if (existingUser) return { success: false, message: "Email ou CPF já cadastrados." };

    const hashedPassword = await bcrypt.hash(senha, 10);

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
        }
      });

      if (moraNoCondominio && id_unidade) {
        await tx.moradoresUnidades.create({
          data: { id_usuario: usuario.id_usuario, id_unidade, principal: true }
        });
      }
    });

    revalidatePath(`/(app)/[slug]/gerenciarFuncionarios`, "page");
    return { success: true, message: "Porteiro cadastrado com sucesso!" };
  } catch (error: any) {
    return { success: false, message: error.message || "Erro ao cadastrar porteiro." };
  }
}

export async function atualizarPorteiro(
  values: z.infer<typeof edicaoPorteiroSchema>,
  condominioId: string,
  sindicoId: string
) {
  try {
    await verificarPermissaoSindico(sindicoId, condominioId);
    const validated = edicaoPorteiroSchema.safeParse(values);
    if (!validated.success) return { success: false, message: "Dados inválidos." };

    const { id_usuario, nomeCompleto, email, telefone, moraNoCondominio, id_unidade } = validated.data;

    await db.$transaction(async (tx) => {
      await tx.usuario.update({
        where: { id_usuario: id_usuario, id_condominio: condominioId },
        data: { nome_completo: nomeCompleto, email, telefone }
      });

      if (moraNoCondominio && id_unidade) {
        const jaMora = await tx.moradoresUnidades.findFirst({ where: { id_usuario, id_unidade } });
        if (!jaMora) {
          await tx.moradoresUnidades.create({
            data: { id_usuario, id_unidade, principal: true }
          });
        }
      } else {
        await tx.moradoresUnidades.deleteMany({ where: { id_usuario } });
      }
    });

    revalidatePath(`/(app)/[slug]/gerenciarFuncionarios`, "page");
    return { success: true, message: "Dados do funcionário atualizados com sucesso!" };
  } catch (error: any) {
    return { success: false, message: error.message || "Erro ao atualizar dados." };
  }
}

export async function transformarMoradorEmPorteiro(moradorId: string, condominioId: string, sindicoId: string) {
  try {
    await verificarPermissaoSindico(sindicoId, condominioId);

    await db.usuario.update({
      where: { id_usuario: moradorId, id_condominio: condominioId },
      data: { perfil: PerfilUsuario.PORTEIRO } 
    });

    revalidatePath(`/(app)/[slug]/gerenciarFuncionarios`, "page");
    return { success: true, message: "Morador promovido a Porteiro com sucesso! Ele agora tem acesso à portaria." };
  } catch (error: any) {
    return { success: false, message: error.message || "Erro ao alterar perfil do morador." };
  }
}

export async function alternarStatusPorteiro(porteiroId: string, atualStatus: boolean, condominioId: string) {
  try {
    await db.usuario.update({
      where: { id_usuario: porteiroId, id_condominio: condominioId },
      data: { ativo: !atualStatus }
    });
    revalidatePath(`/(app)/[slug]/gerenciarFuncionarios`, "page");
    return { success: true, message: "Status alterado!" };
  } catch (error) {
    return { success: false, message: "Erro ao alterar status." };
  }
}

export async function excluirPorteiro(porteiroId: string, condominioId: string) {
  try {
    await db.usuario.delete({ where: { id_usuario: porteiroId, id_condominio: condominioId } });
    revalidatePath(`/(app)/[slug]/gerenciarFuncionarios`, "page");
    return { success: true, message: "Removido do sistema." };
  } catch (error) {
    return { success: false, message: "Este usuário possui registros atrelados (ex: entregas), desative-o em vez de excluir." };
  }
}