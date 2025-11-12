"use server";

import { z } from "zod";
import { cadastroSchema } from "./schemaCadastroMorador";
import { db } from "@/lib/prisma";
import bcrypt from "bcryptjs";

type CadastroResult = {
  success?: boolean;
  error?: string;
  userId?: string;
  perfil?: string;
  condominioId?: string;
};

export async function registerMorador(
  values: z.infer<typeof cadastroSchema>,
): Promise<CadastroResult> {
  const validatedFields = cadastroSchema.safeParse(values);

  if (!validatedFields.success) {
    console.error(
      "[ZOD_VALIDATION_ERROR]",
      validatedFields.error.flatten().fieldErrors,
    );
    return { error: "Dados inválidos. Verifique os campos e tente novamente." };
  }

  const {
    nomeCompleto,
    email,
    cpf,
    senha,
    telefone,
    codigo_acesso,
    bloco,
    apartamento,
  } = validatedFields.data;

  try {
    const existingUser = await db.usuario.findFirst({
      where: {
        OR: [{ email: email }, { cpf: cpf }],
      },
    });

    if (existingUser) {
      return { error: "Email ou CPF já cadastrados." };
    }

    const condominio = await db.condominio.findUnique({
      where: {
        codigo_acesso: codigo_acesso,
      },
    });

    if (!condominio) {
      return { error: "Código de acesso inválido. Condomínio não encontrado." };
    }

    const unidade = await db.unidade.findUnique({
      where: {
        id_condominio_bloco_torre_numero_unidade: {
          id_condominio: condominio.id_condominio,
          bloco_torre: bloco,
          numero_unidade: apartamento,
        },
      },
    });

    if (!unidade) {
      return {
        error:
          "Unidade não encontrada. Verifique o bloco e o número do apartamento.",
      };
    }

    const existingPrincipal = await db.moradoresUnidades.findFirst({
      where: {
        id_unidade: unidade.id_unidade,
        principal: true,
      },
    });

    const isPrincipal = !existingPrincipal;

    const hashedPassword = await bcrypt.hash(senha, 10);

    const newMorador = await db.$transaction(async (tx) => {
      const usuario = await tx.usuario.create({
        data: {
          nome_completo: nomeCompleto,
          email: email,
          cpf: cpf,
          senha_hash: hashedPassword,
          telefone: telefone,
          perfil: "MORADOR",
          id_condominio: condominio.id_condominio,
        },
      });

      await tx.moradoresUnidades.create({
        data: {
          id_usuario: usuario.id_usuario,
          id_unidade: unidade.id_unidade,
          principal: isPrincipal,
        },
      });

      return usuario;
    });

    return {
      success: true,
      userId: newMorador.id_usuario,
      perfil: newMorador.perfil,
      condominioId: condominio.id_condominio,
    };
  } catch (error) {
    console.error("[REGISTER_MORADOR_ERROR]", error);
    return { error: "Ocorreu um erro no cadastro. Tente novamente." };
  }
}
