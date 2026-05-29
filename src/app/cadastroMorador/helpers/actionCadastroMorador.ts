"use server";

import { z } from "zod";
import { cadastroSchema } from "./schemaCadastroMorador";
import { db } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { isValideCPF } from "@/helpers/cpf";
import { getOrCreateUserToken } from "@/app/(app)/[slug]/helpers/token";

type CadastroResult = {
  success?: boolean;
  error?: string;
  field?: string;
  userId?: string;
  perfil?: string;
  condominioId?: string;
  token?: string;
};

export async function registerMorador(
  values: z.infer<typeof cadastroSchema>,
): Promise<CadastroResult> {
  const validatedFields = await cadastroSchema.safeParseAsync(values);

  if (!validatedFields.success) {
    console.error(
      "[ZOD_VALIDATION_ERROR]",
      validatedFields.error.flatten().fieldErrors,
    );

    return {
      error: "Dados inválidos. Verifique os campos e tente novamente.",
    };
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

  const isCpfReal = await isValideCPF(cpf);
  if (!isCpfReal) {
    return {
      error: "O CPF informado não é válido na Receita Federal.",
      field: "cpf",
    };
  }

  try {
    const existingUser = await db.usuario.findFirst({
      where: {
        OR: [{ email }, { cpf }],
      },
    });

    if (existingUser) {
      return {
        error: "Email ou CPF já cadastrados.",
        field: existingUser.email === email ? "email" : "cpf",
      };
    }

    const condominio = await db.condominio.findUnique({
      where: {
        codigo_acesso,
      },
    });

    if (!condominio) {
      return {
        error: "Código de acesso inválido.",
        field: "codigo_acesso",
      };
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
          "Unidade não encontrada. Verifique bloco e apartamento.",
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
          email,
          cpf,
          senha_hash: hashedPassword,
          telefone,
          perfil: "MORADOR",
          termo_aceite: true,
          id_condominio: condominio.id_condominio,
        },
      });

      const token = await getOrCreateUserToken({
        userId: usuario.id_usuario,
        prisma: tx,
        formatted: true,
      });

      await tx.moradoresUnidades.create({
        data: {
          id_usuario: usuario.id_usuario,
          id_unidade: unidade.id_unidade,
          principal: isPrincipal,
        },
      });

      return {
        usuario,
        token,
      };
    });

    return {
      success: true,
      token: newMorador.token,
      userId: newMorador.usuario.id_usuario,
      perfil: newMorador.usuario.perfil,
      condominioId: condominio.id_condominio,
    };
  } catch (error) {
    console.error("[REGISTER_MORADOR_ERROR]", error);

    return {
      error: "Ocorreu um erro no cadastro. Tente novamente.",
    };
  }
}

export async function getUnidadesByCodigoAcesso(codigo_acesso: string) {
  if (!codigo_acesso) return null;

  try {
    const condominio = await db.condominio.findUnique({
      where: { codigo_acesso },
      select: {
        id_condominio: true,
        unidades: {
          select: {
            bloco_torre: true,
            numero_unidade: true,
          },
          orderBy: [
            { bloco_torre: 'asc' },
            { numero_unidade: 'asc' }
          ]
        }
      }
    });

    if (!condominio) return null;

    // Agrupar unidades por bloco
    const blocosMap = new Map<string, string[]>();
    for (const unidade of condominio.unidades) {
      if (!blocosMap.has(unidade.bloco_torre)) {
        blocosMap.set(unidade.bloco_torre, []);
      }
      blocosMap.get(unidade.bloco_torre)!.push(unidade.numero_unidade);
    }

    const blocos = Array.from(blocosMap.keys());
    const unidadesPorBloco = Object.fromEntries(blocosMap);

    return { blocos, unidadesPorBloco };
  } catch (error) {
    console.error("[GET_UNIDADES_ERROR]", error);
    return null;
  }
}