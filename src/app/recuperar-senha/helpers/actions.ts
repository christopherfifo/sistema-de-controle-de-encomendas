"use server";

import { db } from "@/lib/prisma";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";
import { recuperarSenhaSchema } from "./schema";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "condodrop.mail@gmail.com",
    pass: process.env.EMAIL_PASS || "rata hych tewm pekj",
  },
});

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

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const resetLink = `${baseUrl}/resetar-senha?token=${token}`;

  try {
    await transporter.sendMail({
      from: `"CondoDrop" <${process.env.EMAIL_USER || "condodrop.mail@gmail.com"}>`,
      to: email,
      subject: "Recuperação de Senha - CondoDrop",
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
    console.error("[NODEMAILER_ERROR]", error);
    return { error: "Erro ao enviar o email. Tente novamente mais tarde." };
  }
}
