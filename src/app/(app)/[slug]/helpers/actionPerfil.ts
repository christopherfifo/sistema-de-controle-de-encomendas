"use server";

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function validarToken(userId: string, token: string) {
  const user = await db.usuario.findUnique({
    where: { id_usuario: userId },
    select: { token_acesso: true },
  });

  if (!user) throw new Error("Usuário não encontrado.");

  const tokenLimpoDigitado = token.replace("-", "").trim();
  const tokenLimpoBanco = user.token_acesso?.replace("-", "").trim();

  if (!tokenLimpoBanco || tokenLimpoDigitado !== tokenLimpoBanco) {
    throw new Error("Token de confirmação inválido.");
  }
}

interface UpdateDadosParams {
  userId: string;
  nome: string;
  email: string;
  telefone: string;
  token: string;
}

export async function updateDadosPessoais({
  userId,
  nome: rawNome,
  email: rawEmail,
  telefone,
  token,
}: UpdateDadosParams) {
  try {
    await validarToken(userId, token);

    const nome = rawNome.trim();
    const email = rawEmail.trim();

    await db.usuario.update({
      where: { id_usuario: userId },
      data: {
        nome_completo: nome,
        email: email,
        telefone: telefone,
      },
    });

    revalidatePath(`/(app)/[slug]/meuPerfil`, "page");
    return { success: true, message: "Dados pessoais updated com sucesso!" };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro ao atualizar dados.";
    return { success: false, message };
  }
}

interface UpdateTelegramParams {
  userId: string;
  telegramId: string;
  token: string;
}

export async function updateTelegramId({
  userId,
  telegramId,
  token,
}: UpdateTelegramParams) {
  try {
    await validarToken(userId, token);

    await db.usuario.update({
      where: { id_usuario: userId },
      data: {
        telegram_chat_id: telegramId,
      },
    });

    revalidatePath(`/(app)/[slug]/meuPerfil`, "page");
    return { success: true, message: "ID do Telegram atualizado com sucesso!" };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro ao atualizar Telegram.";
    return { success: false, message };
  }
}
