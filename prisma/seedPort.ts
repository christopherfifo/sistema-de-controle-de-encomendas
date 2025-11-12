import { PrismaClient, PerfilUsuario, StatusEncomenda } from "@prisma/client";
import { hash } from "bcryptjs";
const db = new PrismaClient();

async function main() {
  console.log("Iniciando o seeding de Porteiros e Histórico...");

  const usuarioYaya = await db.usuario.findUnique({
    where: { email: "yaya@gmail.com" },
  });

  if (!usuarioYaya || usuarioYaya.perfil !== PerfilUsuario.MORADOR) {
    throw new Error(
      "Usuário 'yaya@gmail.com' com perfil MORADOR não foi encontrado.",
    );
  }
  console.log(`Usuário MORADOR encontrado: ${usuarioYaya.nome_completo}`);

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
    `Unidade encontrada: ${unidadeDaYaya.bloco_torre}-${unidadeDaYaya.numero_unidade}`,
  );

  const senhaHash = await hash("senha123", 10);

  const porteiro1 = await db.usuario.upsert({
    where: { email: "porteiro1@seed.com" },
    update: {},
    create: {
      nome_completo: "Carlos (Porteiro 1)",
      email: "porteiro1@seed.com",
      cpf: "111.111.111-01",
      telefone: "11911110001",
      senha_hash: senhaHash,
      perfil: PerfilUsuario.PORTEIRO,
      id_condominio: usuarioYaya.id_condominio,
      ativo: true,
    },
  });

  const porteiro2 = await db.usuario.upsert({
    where: { email: "porteiro2@seed.com" },
    update: {},
    create: {
      nome_completo: "Roberto (Porteiro 2)",
      email: "porteiro2@seed.com",
      cpf: "111.111.111-02",
      telefone: "11911110002",
      senha_hash: senhaHash,
      perfil: PerfilUsuario.PORTEIRO,
      id_condominio: usuarioYaya.id_condominio,
      ativo: true,
    },
  });
  console.log(
    `Porteiros criados/atualizados: ${porteiro1.nome_completo} e ${porteiro2.nome_completo}`,
  );

  await db.encomenda.deleteMany({
    where: {
      id_unidade: unidadeDaYaya.id_unidade,
    },
  });
  console.log("Histórico anterior da unidade foi limpo.");

  console.log("Criando 6 cenários de encomenda...");

  const encomendaA1 = await db.encomenda.create({
    data: {
      id_unidade: unidadeDaYaya.id_unidade,
      id_porteiro_recebimento: porteiro1.id_usuario,
      data_recebimento: new Date("2025-11-01T10:30:00"),
      tipo_encomenda: "Caixa Média",
      tamanho: "Médio",
      forma_entrega: "Amazon",
      status: StatusEncomenda.ENTREGUE,
    },
  });
  await db.retirada.create({
    data: {
      id_encomenda: encomendaA1.id_encomenda,
      id_usuario_retirada: usuarioYaya.id_usuario,
      data_retirada: new Date("2025-11-01T18:00:00"),
      forma_confirmacao: "Assinatura Digital",
    },
  });

  const encomendaA2 = await db.encomenda.create({
    data: {
      id_unidade: unidadeDaYaya.id_unidade,
      id_porteiro_recebimento: porteiro2.id_usuario,
      data_recebimento: new Date("2025-11-02T11:00:00"),
      tipo_encomenda: "Pacote Correios",
      tamanho: "Pequeno",
      forma_entrega: "Correios",
      status: StatusEncomenda.ENTREGUE,
    },
  });
  await db.retirada.create({
    data: {
      id_encomenda: encomendaA2.id_encomenda,
      id_usuario_retirada: usuarioYaya.id_usuario,
      data_retirada: new Date("2025-11-03T09:15:00"),
      forma_confirmacao: "Documento (RG)",
    },
  });
  console.log(
    "Cenário A: 2 encomendas (Porteiro cadastra -> Yaya retira) criadas.",
  );

  const encomendaB1 = await db.encomenda.create({
    data: {
      id_unidade: unidadeDaYaya.id_unidade,
      id_usuario_cadastro: usuarioYaya.id_usuario,
      id_porteiro_recebimento: porteiro1.id_usuario,
      data_recebimento: new Date("2025-11-04T14:00:00"),
      tipo_encomenda: "Mercado Livre",
      tamanho: "Grande",
      forma_entrega: "Transportadora",
      codigo_rastreio: "ML123",
      status: StatusEncomenda.ENTREGUE,
    },
  });
  await db.retirada.create({
    data: {
      id_encomenda: encomendaB1.id_encomenda,
      id_usuario_retirada: usuarioYaya.id_usuario,
      data_retirada: new Date("2025-11-04T15:00:00"),
      forma_confirmacao: "Código App",
    },
  });

  const encomendaB2 = await db.encomenda.create({
    data: {
      id_unidade: unidadeDaYaya.id_unidade,
      id_usuario_cadastro: usuarioYaya.id_usuario,
      id_porteiro_recebimento: porteiro2.id_usuario,
      data_recebimento: new Date("2025-11-05T16:00:00"),
      tipo_encomenda: "Magazine Luiza",
      tamanho: "Médio",
      forma_entrega: "Transportadora",
      codigo_rastreio: "MAGALU456",
      status: StatusEncomenda.ENTREGUE,
    },
  });
  await db.retirada.create({
    data: {
      id_encomenda: encomendaB2.id_encomenda,
      id_usuario_retirada: usuarioYaya.id_usuario,
      data_retirada: new Date("2025-11-06T10:00:00"),
      forma_confirmacao: "Assinatura Digital",
    },
  });
  console.log(
    "Cenário B: 2 encomendas (Yaya cadastra -> Porteiro recebe -> Yaya retira) criadas.",
  );

  await db.encomenda.create({
    data: {
      id_unidade: unidadeDaYaya.id_unidade,
      id_porteiro_recebimento: porteiro1.id_usuario,
      data_recebimento: new Date("2025-11-05T09:00:00"),
      tipo_encomenda: "Envelope (Cancelado)",
      tamanho: "Pequeno",
      forma_entrega: "Documento",
      condicao: "Entrega errada, devolvido ao remetente.",
      status: StatusEncomenda.CANCELADA,
    },
  });

  await db.encomenda.create({
    data: {
      id_unidade: unidadeDaYaya.id_unidade,
      id_porteiro_recebimento: porteiro2.id_usuario,
      data_recebimento: new Date("2025-11-06T11:00:00"),
      tipo_encomenda: "iFood (Recusado)",
      tamanho: "Pequeno",
      forma_entrega: "iFood",
      condicao: "Morador recusou o recebimento.",
      status: StatusEncomenda.CANCELADA,
    },
  });
  console.log(
    "Cenário C: 2 encomendas (Porteiro cadastra -> Cancelada) criadas.",
  );

  console.log(
    `\nSeeding concluído! 6 encomendas criadas para a Unidade ${unidadeDaYaya.bloco_torre}-${unidadeDaYaya.numero_unidade}.`,
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
