"use server";

import * as z from "zod";
import { db } from "@/lib/prisma";
import { loginSchema } from "./schemaLogin";
import bcrypt from "bcryptjs";
import { removeCpfPunctuation } from "@/helpers/cpf";

type AuthResult = {
  success?: string;
  error?: string;
  userId?: string;
  perfil?: string;
  condominioId?: string;
};

export async function authenticate(
  values: z.infer<typeof loginSchema>,
): Promise<AuthResult> {
  const validatedFields = loginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Campos inválidos." };
  }

  const { login, password } = validatedFields.data;

  try {
    const isEmail = login.includes("@");

    const cpfSearch = !isEmail
      ? removeCpfPunctuation(login).replace(/\D/g, "")
      : undefined;

    const user = await db.usuario.findFirst({
      where: {
        OR: [{ email: isEmail ? login : undefined }, { cpf: cpfSearch }],
      },
    });

    if (!user || !user.senha_hash) {
      return { error: "Credenciais inválidas." };
    }

    const passwordsMatch = await bcrypt.compare(password, user.senha_hash);

    if (!passwordsMatch) {
      return { error: "Credenciais inválidas." };
    }

    console.log("Usuário autenticado:", user.id_usuario);

    return {
      success: "Login bem-sucedido!",
      userId: user.id_usuario,
      perfil: user.perfil,
      condominioId: user.id_condominio,
    };
  } catch (error) {
    console.error(error);
    return { error: "Erro no servidor. Tente novamente." };
  }
}
