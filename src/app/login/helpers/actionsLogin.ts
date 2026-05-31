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

  const { login: rawLogin, password } = validatedFields.data;
  const login = rawLogin.trim();

  try {
    const isEmail = login.includes("@");

    if (isEmail) {
      if (!isValidEmail(login)) {
        return { error: "Por favor, insira um e-mail válido." };
      }
    } else {
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
