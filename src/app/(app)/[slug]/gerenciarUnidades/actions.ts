"use server";

import { db } from "@/lib/prisma";

export async function getUnidadesDoCondominio(condominioId: string) {
  try {
    const unidades = await db.unidade.findMany({
      where: { id_condominio: condominioId },
      orderBy: [
        { bloco_torre: "asc" },
        { numero_unidade: "asc" },
      ],
      include: {
        _count: {
          select: { moradores: true, encomendas: true },
        },
      },
    });

    const plano = await db.condominio.findUnique({
      where: { id_condominio: condominioId },
      select: { plano: { select: { limite_unidades: true } } }
    });

    return { 
      success: true, 
      unidades, 
      limite: plano?.plano?.limite_unidades || 0,
      totalAtual: unidades.length
    };
  } catch (error) {
    console.error("Erro ao buscar unidades:", error);
    return { success: false, error: "Falha ao buscar unidades." };
  }
}

export async function adicionarUnidades(
  condominioId: string, 
  bloco: string, 
  numerosStr: string,
  isNovoBloco: boolean = false
) {
  try {
    // Padroniza para "Title Case" (ex: Bloco A, Torre Norte)
    const blocoPadronizado = bloco
      .trim()
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    if (!blocoPadronizado) {
      return { success: false, error: "Nome do bloco inválido." };
    }

    if (isNovoBloco) {
      const blocoExiste = await db.unidade.findFirst({
        where: { id_condominio: condominioId, bloco_torre: blocoPadronizado }
      });
      if (blocoExiste) {
        return { success: false, error: `O bloco '${blocoPadronizado}' já existe. Use a aba "Adicionar a Bloco Existente" ou escolha outro nome.` };
      }
    }

    const numeros = numerosStr
      .split(",")
      .map((n) => n.trim())
      .filter((n) => n !== "");

    if (numeros.length === 0) {
      return { success: false, error: "Nenhum número de unidade válido fornecido." };
    }

    const unidadesExistentes = await db.unidade.findMany({
      where: {
        id_condominio: condominioId,
        bloco_torre: blocoPadronizado,
        numero_unidade: { in: numeros }
      }
    });

    if (unidadesExistentes.length > 0) {
      const numerosExistentes = unidadesExistentes.map(u => u.numero_unidade).join(", ");
      return { success: false, error: `As seguintes unidades já existem no bloco '${blocoPadronizado}': ${numerosExistentes}.` };
    }

    const infoCondominio = await db.condominio.findUnique({
      where: { id_condominio: condominioId },
      include: { 
        plano: true,
        _count: {
          select: { unidades: true }
        }
      }
    });

    if (!infoCondominio || !infoCondominio.plano) {
      return { success: false, error: "Condomínio ou plano não encontrado." };
    }

    const limitePlano = infoCondominio.plano.limite_unidades;
    const qtdAtual = infoCondominio._count.unidades;
    const qtdParaAdicionar = numeros.length;

    if (qtdAtual + qtdParaAdicionar > limitePlano) {
      return { 
        success: false, 
        error: `Ação excede o limite do plano. Limite: ${limitePlano}, Atual: ${qtdAtual}, Adicionando: ${qtdParaAdicionar}. Faltam ${limitePlano - qtdAtual} vagas disponíveis.` 
      };
    }

    const unidadesParaCriar = numeros.map((numero) => ({
      id_condominio: condominioId,
      bloco_torre: blocoPadronizado,
      numero_unidade: numero,
    }));

    await db.unidade.createMany({
      data: unidadesParaCriar,
      skipDuplicates: true, 
    });

    return { success: true };
  } catch (error) {
    console.error("Erro ao adicionar unidades:", error);
    return { success: false, error: "Falha ao adicionar as unidades. Verifique se alguma já existe." };
  }
}

export async function deletarUnidade(unidadeId: string) {
  try {
    const unidade = await db.unidade.findUnique({
      where: { id_unidade: unidadeId },
      include: {
        _count: {
          select: { encomendas: true }
        },
        moradores: {
          select: { id_usuario: true }
        }
      }
    });

    if (!unidade) {
      return { success: false, error: "Unidade não encontrada." };
    }

    if (unidade._count.encomendas > 0) {
      return { 
        success: false, 
        error: "Não é possível excluir esta unidade pois há encomendas vinculadas a ela no histórico." 
      };
    }

    await db.$transaction(async (tx) => {
      const userIds = unidade.moradores.map(m => m.id_usuario);

      if (userIds.length > 0) {
        await tx.moradoresUnidades.deleteMany({
          where: { id_unidade: unidadeId }
        });

        await tx.usuario.updateMany({
          where: { id_usuario: { in: userIds } },
          data: { ativo: false }
        });
      }

      await tx.unidade.delete({
        where: { id_unidade: unidadeId }
      });
    });

    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar unidade:", error);
    return { success: false, error: "Falha ao excluir a unidade." };
  }
}

export async function deletarBloco(condominioId: string, blocoTorre: string) {
  try {
    const blocoPadronizado = blocoTorre.trim().toUpperCase();

    const unidadesDoBloco = await db.unidade.findMany({
      where: { 
        id_condominio: condominioId,
        bloco_torre: blocoPadronizado 
      },
      include: {
        _count: {
          select: { encomendas: true }
        },
        moradores: {
          select: { id_usuario: true }
        }
      }
    });

    if (unidadesDoBloco.length === 0) {
      return { success: false, error: "Nenhuma unidade encontrada para este bloco." };
    }

    const temEncomendas = unidadesDoBloco.some(
      (unidade) => unidade._count.encomendas > 0
    );

    if (temEncomendas) {
      return { 
        success: false, 
        error: "Não é possível excluir este bloco pois há unidades com encomendas vinculadas a elas." 
      };
    }

    await db.$transaction(async (tx) => {
      const userIds = unidadesDoBloco.flatMap(u => u.moradores.map(m => m.id_usuario));
      const unidadesIds = unidadesDoBloco.map(u => u.id_unidade);

      if (userIds.length > 0) {
        await tx.moradoresUnidades.deleteMany({
          where: { id_unidade: { in: unidadesIds } }
        });

        await tx.usuario.updateMany({
          where: { id_usuario: { in: userIds } },
          data: { ativo: false }
        });
      }

      await tx.unidade.deleteMany({
        where: { 
          id_condominio: condominioId,
          bloco_torre: blocoPadronizado 
        }
      });
    });

    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar bloco:", error);
    return { success: false, error: "Falha ao excluir o bloco." };
  }
}
