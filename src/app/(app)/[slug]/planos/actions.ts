"use server";

import { db } from "@/lib/prisma";

export async function changeCondominioPlan(condominioId: string, newPlanoId: string) {
  try {
    const condominio = await db.condominio.findUnique({
      where: { id_condominio: condominioId },
    });

    if (!condominio) {
      return { success: false, error: "Condomínio não encontrado." };
    }

    const newPlano = await db.plano.findUnique({
      where: { id_plano: newPlanoId },
    });

    if (!newPlano) {
      return { success: false, error: "Plano não encontrado." };
    }

    const currentUnitsCount = await db.unidade.count({
      where: { id_condominio: condominioId },
    });

    if (currentUnitsCount > newPlano.limite_unidades) {
      return {
        success: false,
        error: `Não é possível alterar para o plano ${newPlano.nome_plano}. O condomínio possui ${currentUnitsCount} unidades e o limite do novo plano é de ${newPlano.limite_unidades}. Por favor, exclua unidades antes de realizar o downgrade.`,
      };
    }

    await db.condominio.update({
      where: { id_condominio: condominioId },
      data: { id_plano: newPlanoId },
    });

    return { success: true };
  } catch (error) {
    console.error("Erro ao alterar plano do condomínio:", error);
    return { success: false, error: "Erro interno ao alterar o plano." };
  }
}
