"use server";

import { db } from "@/lib/prisma";
import { Resend } from "resend";
import { v4 as uuidv4 } from "uuid";
import { recuperarSenhaSchema } from "./schema";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(values: { email: string }) {
  const validatedFields = recuperarSenhaSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Email inválido." };
  }
  const { email } = validatedFields.data;

  const existingUser = await db.usuario.findUnique({
    where: { email },
  });

  if (!existingUser) {
    // Return success anyway to prevent email enumeration
    return {
      success:
        "Se o email estiver cadastrado, um link de recuperação será enviado.",
    };
  }

  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 hour

  await db.passwordResetToken.deleteMany({
    where: { email },
  });

  await db.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/resetar-senha?token=${token}`;

  try {
    await resend.emails.send({
      from: "onboarding@resend.dev", // Default resend onboarding email
      to: email,
      subject: "Recuperação de Senha - Sistema de Encomendas",
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Recuperação de Senha</h2>
          <p>Olá ${existingUser.nome_completo},</p>
          <p>Você solicitou a redefinição de sua senha. Clique no botão abaixo para criar uma nova senha:</p>
          <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #000; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 10px; margin-bottom: 10px;">Redefinir Senha</a>
          <p>Se o botão não funcionar, copie e cole o link abaixo em seu navegador:</p>
          <p><a href="${resetLink}">${resetLink}</a></p>
          <p>Este link expira em 1 hora. Se você não solicitou esta alteração, ignore este email.</p>
        </div>
      `,
    });

    return {
      success:
        "Se o email estiver cadastrado, um link de recuperação será enviado.",
    };
  } catch (error) {
    console.error("[RESEND_ERROR]", error);
    return { error: "Erro ao enviar o email. Tente novamente mais tarde." };
  }
}
