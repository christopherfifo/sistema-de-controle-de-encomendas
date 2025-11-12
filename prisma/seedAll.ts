import { PrismaClient, PerfilUsuario, StatusEncomenda } from "@prisma/client";
import { hash } from "bcryptjs";

const db = new PrismaClient();

async function main() {
  console.log("Iniciando o script de seed...");

  console.log("Limpando dados existentes...");
  await db.retirada.deleteMany();
  await db.notificacao.deleteMany();
  await db.moradoresUnidades.deleteMany();
  await db.respostaRecado.deleteMany();
  await db.encomenda.deleteMany();
  await db.recado.deleteMany();
  await db.fatura.deleteMany();
  await db.unidade.deleteMany();
  await db.usuario.deleteMany();
  await db.condominio.deleteMany();
  await db.plano.deleteMany();
  console.log("Banco de dados limpo.");

  const senhaHash = await hash("Casa#2459", 10);
  console.log("Senha padrão criptografada.");

  const plano = await db.plano.create({
    data: {
      nome_plano: "Plano Light",
      valor: 99.9,
      limite_unidades: 50,
      limite_usuarios: 200,
      limite_condominios: 1,
    },
  });
  console.log(`Plano "${plano.nome_plano}" criado.`);

  const condominio = await db.condominio.create({
    data: {
      nome_condominio: "Residencial Pequeno Príncipe",
      cnpj: "95489660000194",
      logradouro: "Rua das Acácias",
      numero: "123",
      bairro: "Centro",
      cidade: "Curitiba",
      uf: "PR",
      qtd_unidades: 24,
      qtd_blocos_torres: 4,
      id_plano: plano.id_plano,
    },
  });
  console.log(`Condomínio "${condominio.nome_condominio}" criado.`);

  const sindico = await db.usuario.create({
    data: {
      nome_completo: "Síndico Admin",
      email: "sindico@gmail.com",
      cpf: "68282302058",
      telefone: "41912345678",
      senha_hash: senhaHash,
      perfil: PerfilUsuario.SINDICO,
      id_condominio: condominio.id_condominio,
    },
  });
  console.log(`Usuário Síndico "${sindico.nome_completo}" criado.`);

  const usuarioYaya = await db.usuario.create({
    data: {
      nome_completo: "Yasmin Alves",
      email: "yaya@gmail.com",
      cpf: "05955422048",
      telefone: "41999998888",
      senha_hash: senhaHash,
      perfil: PerfilUsuario.MORADOR,
      id_condominio: condominio.id_condominio,
      ativo: true,
    },
  });
  console.log(
    `Usuário MORADOR "${usuarioYaya.nome_completo}" (yaya@gmail.com) criado.`,
  );

  const porteiro1 = await db.usuario.create({
    data: {
      nome_completo: "Carlos (Porteiro 1)",
      email: "porteiro1@seed.com",
      cpf: "11111111101",
      telefone: "11911110001",
      senha_hash: senhaHash,
      perfil: PerfilUsuario.PORTEIRO,
      id_condominio: condominio.id_condominio,
      ativo: true,
    },
  });
  const porteiro2 = await db.usuario.create({
    data: {
      nome_completo: "Roberto (Porteiro 2)",
      email: "porteiro2@seed.com",
      cpf: "11111111102",
      telefone: "11911110002",
      senha_hash: senhaHash,
      perfil: PerfilUsuario.PORTEIRO,
      id_condominio: condominio.id_condominio,
      ativo: true,
    },
  });
  console.log(
    `Porteiros criados: ${porteiro1.nome_completo} e ${porteiro2.nome_completo}.`,
  );

  console.log("Iniciando criação das 24 unidades...");
  const blocos = ["A", "B", "C", "D"];
  const apartamentos: string[] = [];
  const unidadesCriadas = [];

  for (let andar = 1; andar <= 2; andar++) {
    for (let num = 1; num <= 3; num++) {
      apartamentos.push(`${andar}0${num}`);
    }
  }

  for (const bloco of blocos) {
    for (const apto of apartamentos) {
      const unidade = await db.unidade.create({
        data: {
          id_condominio: condominio.id_condominio,
          bloco_torre: `Bloco ${bloco}`,
          numero_unidade: apto,
        },
      });
      unidadesCriadas.push(unidade);
    }
    console.log(`--- 6 unidades do Bloco ${bloco} criadas.`);
  }

  const unidadeA101 = unidadesCriadas.find(
    (u) => u.bloco_torre === "Bloco A" && u.numero_unidade === "101",
  );

  if (!unidadeA101) {
    throw new Error("Falha ao encontrar a unidade A-101 recém-criada.");
  }

  await db.moradoresUnidades.create({
    data: {
      id_usuario: usuarioYaya.id_usuario,
      id_unidade: unidadeA101.id_unidade,
      principal: true,
    },
  });
  console.log(
    `Moradora ${usuarioYaya.nome_completo} vinculada à Unidade A-101.`,
  );

  console.log("Criando 6 cenários de encomenda para o Histórico...");

  const encomendaA1 = await db.encomenda.create({
    data: {
      id_unidade: unidadeA101.id_unidade,
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
      id_unidade: unidadeA101.id_unidade,
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
      id_unidade: unidadeA101.id_unidade,
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
      id_unidade: unidadeA101.id_unidade,
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
      id_unidade: unidadeA101.id_unidade,
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
      id_unidade: unidadeA101.id_unidade,
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

  console.log("Criando 2 encomendas PENDENTES (pré-cadastradas por Yaya)...");

  await db.encomenda.create({
    data: {
      id_unidade: unidadeA101.id_unidade,
      id_usuario_cadastro: usuarioYaya.id_usuario,
      tipo_encomenda: "Pacote Amazon",
      tamanho: "Médio",
      forma_entrega: "Amazon",
      codigo_rastreio: "BR123456789",
      status: StatusEncomenda.PENDENTE,
    },
  });

  await db.encomenda.create({
    data: {
      id_unidade: unidadeA101.id_unidade,
      id_usuario_cadastro: usuarioYaya.id_usuario,
      tipo_encomenda: "Pacote DHL",
      tamanho: "Grande",
      forma_entrega: "DHL",
      codigo_rastreio: "DHL987654",
      condicao: "Frágil, cuidado",
      status: StatusEncomenda.PENDENTE,
    },
  });
  console.log("Encomendas PENDENTES criadas.");

  console.log("\nSeed COMPLETO e UNIFICADO concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error("Erro durante a execução do seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
