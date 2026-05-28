const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const raquel = await prisma.usuario.findFirst({
    where: { nome_completo: { contains: 'raquel', mode: 'insensitive' } },
    include: { unidades_residenciais: { include: { unidade: true } } }
  });
  console.log(JSON.stringify(raquel, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
