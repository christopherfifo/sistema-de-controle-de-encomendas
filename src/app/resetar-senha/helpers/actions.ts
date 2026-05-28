"use server";

import { db } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { resetarSenhaSchema } from "./schema";

export async function resetPassword(values: { token: string, senha: string, confirmarSenha: string }) {
  const validatedFields = resetarSenhaSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Dados inválidos." };
  }
  const { token, senha } = validatedFields.data;

  const existingToken = await db.passwordResetToken.findUnique({
    where: { token }
  });

  if (!existingToken) {
    return { error: "Token inválido ou inexistente." };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { error: "O link de recuperação expirou." };
  }

  const existingUser = await db.usuario.findUnique({
    where: { email: existingToken.email }
  });

  if (!existingUser) {
    return { error: "Usuário não encontrado." };
  }

  const hashedPassword = await bcrypt.hash(senha, 10);

  await db.usuario.update({
    where: { id_usuario: existingUser.id_usuario },
    data: { senha_hash: hashedPassword }
  });

  await db.passwordResetToken.delete({
    where: { id: existingToken.id }
  });

  return { success: "Senha redefinida com sucesso!" };
}