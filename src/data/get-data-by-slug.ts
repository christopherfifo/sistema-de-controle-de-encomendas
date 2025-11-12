import { db } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { StatusPagamento } from "@prisma/client";

export const validateAndGetCondominioData = async (
  condominioId: string,
  userId: string | undefined,
) => {
  if (!userId) {
    console.error("Validação falhou: ID do usuário não fornecido na URL.");
    redirect("/");
  }

  const user = await db.usuario.findUnique({
    where: { id_usuario: userId },
    include: {
      unidades_residenciais: {
        include: {
          unidade: {
            select: {
              id_unidade: true,
              bloco_torre: true,
              numero_unidade: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    console.error(`Validação falhou: Usuário ${userId} não encontrado.`);
    redirect("/");
  }

  if (!user) {
    console.error(`Validação falhou: Usuário ${userId} não encontrado.`);
    redirect("/");
  }

  if (user.id_condominio !== condominioId) {
    console.error(
      `Validação falhou: Usuário ${userId} não pertence ao condomínio ${condominioId}.`,
    );
    redirect("/");
  }

  const condominio = await db.condominio.findUnique({
    where: {
      id_condominio: condominioId,
    },
    include: {
      faturas: {
        where: {
          OR: [
            { status_pagamento: StatusPagamento.ATRASADO },
            { inadimplente: true },
            { status_pagamento: StatusPagamento.CANCELADO },
          ],
        },
        take: 1,
      },
    },
  });

  if (!condominio) {
    console.error(
      `Validação falhou: Condomínio ${condominioId} não encontrado.`,
    );
    redirect("/");
  }

  if (condominio.ativo === false) {
    console.error(`Validação falhou: Condomínio ${condominioId} está inativo.`);
    redirect("/");
  }

  if (condominio.faturas.length > 0) {
    console.error(
      `Validação falhou: Condomínio ${condominioId} possui faturas pendentes, atrasadas ou plano cancelado.`,
    );
    redirect("/");
  }

  return { condominio, user };
};
