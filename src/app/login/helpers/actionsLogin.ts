"use server";

import * as z from "zod";
import { db } from "@/lib/prisma";
import { loginSchema } from "./schemaLogin";
import bcrypt from "bcryptjs";
import { removeCpfPunctuation, isValideCPF } from "@/helpers/cpf";

type AuthResult = {
  success?: string;
  error?: string;
  userId?: string;
  perfil?: string;
  condominioId?: string;
};

// Função auxiliar síncrona para validar formato de e-mail no servidor
function isValidEmail(value: string): boolean {
  return z.string().email().safeParse(value).success;
}

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

    // 🛡️ VALIDAÇÃO DE SEGURANÇA NO SERVIDOR (LIVRE DE CORS)
    if (isEmail) {
      if (!isValidEmail(login)) {
        return { error: "Por favor, insira um e-mail válido." };
      }
    } else {
      // Se não tem "@", assume-se que tentou digitar um CPF
      const cpfLimpo = removeCpfPunctuation(login);
      const cpfValido = await isValideCPF(cpfLimpo);
      if (!cpfValido) {
        return { error: "Por favor, insira um CPF válido." };
      }
    }

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

    return {
      success: "Login efetuado com sucesso!",
      userId: user.id_usuario,
      perfil: user.perfil,
      condominioId: user.id_condominio || undefined,
    };
  } catch (error) {
    console.error("[AUTH_ERROR]", error);
    return { error: "Ocorreu um erro interno no servidor." };
  }
}