import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const encomendas = await prisma.encomenda.findMany({
    where: {
      status: "PENDENTE",
      id_usuario_cadastro: { not: null },
      id_porteiro_recebimento: null,
    },
    include: {
      unidade: {
        include: {
          moradores: {
            include: {
              usuario: {
                select: { nome_completo: true },
              },
            },
          },
        },
      },
    },
  });
  console.log(JSON.stringify(encomendas, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
export {};
