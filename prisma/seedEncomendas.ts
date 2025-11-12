import { PrismaClient, PerfilUsuario } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  console.log("Iniciando o seeding de ENCOMENDAS (Apenas Morador)...");

  const usuarioYaya = await db.usuario.findUnique({
    where: { email: "yaya@gmail.com" },
  });

  if (!usuarioYaya || usuarioYaya.perfil !== PerfilUsuario.MORADOR) {
    throw new Error(
      "Usuário 'yaya@gmail.com' com perfil MORADOR não foi encontrado. O seed não pode continuar.",
    );
  }
  console.log(
    `Usuário MORADOR encontrado: ${usuarioYaya.nome_completo} (ID: ${usuarioYaya.id_usuario})`,
  );

  const vinculoMorador = await db.moradoresUnidades.findFirst({
    where: { id_usuario: usuarioYaya.id_usuario },
    include: {
      unidade: true,
    },
  });

  if (!vinculoMorador) {
    throw new Error(
      "Nenhuma unidade encontrada para 'yaya@gmail.com'. Vincule o usuário a uma unidade primeiro.",
    );
  }

  const unidadeDaYaya = vinculoMorador.unidade;
  console.log(
    `Unidade encontrada: ${unidadeDaYaya.bloco_torre}-${unidadeDaYaya.numero_unidade} (ID: ${unidadeDaYaya.id_unidade})`, //
  );

  await db.encomenda.deleteMany({
    where: {
      id_unidade: unidadeDaYaya.id_unidade,
      status: "PENDENTE",
    },
  });
  console.log("Encomendas PENDENTES anteriores da unidade foram limpas.");

  console.log("Criando 4 novas encomendas PENDENTES (pré-cadastradas)...");

  await db.encomenda.create({
    data: {
      id_unidade: unidadeDaYaya.id_unidade,
      id_usuario_cadastro: usuarioYaya.id_usuario,
      tipo_encomenda: "Pacote",
      tamanho: "Médio",
      forma_entrega: "Correios",
      codigo_rastreio: "BR123456789",
      status: "PENDENTE",
    },
  });

  await db.encomenda.create({
    data: {
      id_unidade: unidadeDaYaya.id_unidade,
      id_usuario_cadastro: usuarioYaya.id_usuario,
      tipo_encomenda: "Caixa",
      tamanho: "Grande",
      forma_entrega: "Amazon",
      codigo_rastreio: "BR987654321",
      condicao: "Frágil, cuidado",
      status: "PENDENTE",
    },
  });

  await db.encomenda.create({
    data: {
      id_unidade: unidadeDaYaya.id_unidade,
      id_usuario_cadastro: usuarioYaya.id_usuario,
      tipo_encomenda: "Envelope",
      tamanho: "Pequeno",
      forma_entrega: "Magazine Luiza",
      codigo_rastreio: "ML123123",
      status: "PENDENTE",
    },
  });

  await db.encomenda.create({
    data: {
      id_unidade: unidadeDaYaya.id_unidade,
      id_usuario_cadastro: usuarioYaya.id_usuario,
      tipo_encomenda: "Pacote Internacional",
      tamanho: "Médio",
      forma_entrega: "DHL",
      codigo_rastreio: "DHL555444",
      status: "PENDENTE",
    },
  });

  console.log(
    `Seeding concluído: 4 encomendas pré-cadastradas para a Unidade ${unidadeDaYaya.bloco_torre}-${unidadeDaYaya.numero_unidade}.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
