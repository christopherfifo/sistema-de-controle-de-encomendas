"use server";

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function salvarTelegramChatId(userId: string, chatId: string) {
  if (!userId || !chatId) {
    throw new Error("Usuário ou ID do Telegram inválidos.");
  }

  try {
    await db.usuario.update({
      where: { id_usuario: userId },
      data: { telegram_chat_id: chatId },
    });

    revalidatePath(`/${userId}`);
    return { success: true, message: "ID do Telegram vinculado com sucesso!" };
  } catch (error) {
    console.error("Erro ao salvar ID do Telegram:", error);
    return { success: false, message: "Não foi possível vincular o Telegram." };
  }
}