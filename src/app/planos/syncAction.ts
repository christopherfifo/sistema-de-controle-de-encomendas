"use server";

import { db } from "@/lib/prisma";

const DEFAULT_PLANS = [
  {
    nome_plano: "Plano Light",
    valor: 89.9,
    limite_unidades: 40,
    limite_condominios: 5,
  },
  {
    nome_plano: "Plano Profissional",
    valor: 149.9,
    limite_unidades: 100,
    limite_condominios: 9999,
  },
  {
    nome_plano: "Plano Premium",
    valor: 299.9,
    limite_unidades: 300,
    limite_condominios: 9999,
  },
  {
    nome_plano: "Plano Enterprise",
    valor: 599.9,
    limite_unidades: 800,
    limite_condominios: 9999,
  },
];

export async function syncPlanos() {
  try {
    const nomesMantidos = DEFAULT_PLANS.map((p) => p.nome_plano);

    for (const plano of DEFAULT_PLANS) {
      await db.plano.upsert({
        where: { nome_plano: plano.nome_plano },
        update: {
          valor: plano.valor,
          limite_unidades: plano.limite_unidades,
          limite_condominios: plano.limite_condominios,
        },
        create: {
          nome_plano: plano.nome_plano,
          valor: plano.valor,
          limite_unidades: plano.limite_unidades,
          limite_condominios: plano.limite_condominios,
        },
      });
    }

    await db.plano.deleteMany({
      where: {
        nome_plano: {
          notIn: nomesMantidos,
        },
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Erro ao sincronizar planos:", error);
    return { success: false, error };
  }
}
