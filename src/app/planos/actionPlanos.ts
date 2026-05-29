"use server";

import { db } from "@/lib/prisma";

const DEFAULT_PLANS = [
  {
    nome_plano: "Plano Light",
    valor: 89.90,
    limite_unidades: 40,
    limite_condominios: 5,
    descricao: "Ideal para pequenos prédios e condomínios de poucas casas.",
  },
  {
    nome_plano: "Plano Profissional",
    valor: 149.90,
    limite_unidades: 100,
    limite_condominios: 9999,
    descricao: "A solução completa para condomínios de médio porte.",
  },
  {
    nome_plano: "Plano Premium",
    valor: 299.90,
    limite_unidades: 300,
    limite_condominios: 9999,
    descricao: "Gestão robusta para grandes condomínios com várias torres, com Suporte Prioritário.",
  },
  {
    nome_plano: "Plano Enterprise",
    valor: 599.90,
    limite_unidades: 800,
    limite_condominios: 9999,
    descricao: "Poder total para grandes complexos e gestores de larga escala, com Suporte Prioritário.",
  }
];

export async function getPlanos() {
  try {
    let planosDB = await db.plano.findMany({
      orderBy: { valor: 'asc' }
    });

    const formatarPlano = (p: { id_plano: string; nome_plano: string; valor: import("@prisma/client/runtime/library").Decimal; limite_unidades: number; limite_condominios: number; data_inclusao: Date }) => ({
      ...p,
      valor: Number(p.valor),
      data_inclusao: p.data_inclusao.toISOString(),
      descricao: DEFAULT_PLANS.find(dp => dp.nome_plano === p.nome_plano)?.descricao || "",
    });

    if (planosDB.length < DEFAULT_PLANS.length) {
      const nomesExistentes = planosDB.map(p => p.nome_plano);
      const planosFaltando = DEFAULT_PLANS.filter(p => !nomesExistentes.includes(p.nome_plano));
      
      if (planosFaltando.length > 0) {
        await db.plano.createMany({
          data: planosFaltando.map(p => ({
            nome_plano: p.nome_plano,
            valor: p.valor,
            limite_unidades: p.limite_unidades,
            limite_condominios: p.limite_condominios,
          }))
        });
        planosDB = await db.plano.findMany({ orderBy: { valor: 'asc' } });
      }
    }

    return planosDB.map(formatarPlano);
  } catch (error) {
    console.error("Erro ao buscar planos:", error);
    return [];
  }
}
