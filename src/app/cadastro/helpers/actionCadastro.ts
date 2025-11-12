"use server";

import { z } from "zod";
import { cadastroSchema } from "./schemaCadastro";
import { db } from "@/lib/prisma";
import bcrypt from "bcryptjs";

type CadastroResult = {
  success?: boolean;
  error?: string;
  userId?: string;
  condominioId?: string;
  perfil?: string;
};

export async function registerCondominioAndAdmin(
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

  const { nomeCompleto, email, cpf, senha, telefone, nomeCondominio, cnpj } =
    validatedFields.data;

  const hashedPassword = await bcrypt.hash(senha, 10);
  try {
    const existingUser = await db.usuario.findFirst({
      where: {
        OR: [{ email: email }, { cpf: cpf }],
      },
    });

    if (existingUser) {
      return { error: "Email ou CPF já cadastrados." };
    }

    const existingCondominio = await db.condominio.findUnique({
      where: { cnpj: cnpj },
    });

    if (existingCondominio) {
      return { error: "CNPJ do condomínio já cadastrado." };
    }

    const result = await db.$transaction(async (tx) => {
      const newCondominio = await tx.condominio.create({
        data: {
          nome_condominio: nomeCondominio,
          cnpj: cnpj,
        },
      });

      const newAdmin = await tx.usuario.create({
        data: {
          nome_completo: nomeCompleto,
          email: email,
          cpf: cpf,
          senha_hash: hashedPassword,
          telefone: telefone,
          perfil: "SINDICO",
          condominio: {
            connect: { id_condominio: newCondominio.id_condominio },
          },
        },
      });

      return { newCondominio, newAdmin };
    });

    return {
      success: true,
      userId: String(result.newAdmin.id_usuario),
      condominioId: String(result.newCondominio.id_condominio),
      perfil: String(result.newAdmin.perfil),
    };
  } catch (error) {
    console.error("[REGISTER_ACTION_ERROR]", error);
    return { error: "Ocorreu um erro no cadastro. Tente novamente." };
  }
}
