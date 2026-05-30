import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const condId = 'bfb21e90-a8e9-445b-bdde-bd52af62fe3b'; // Copied from previous output
  const unidades = await prisma.unidade.findMany({
    where: { id_condominio: condId },
    include: { moradores: { include: { usuario: true } } }
  });
  console.log(JSON.stringify(unidades, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
export {};
