import {
  PrismaClient,
  PerfilUsuario,
  StatusEncomenda,
  StatusPagamento,
  TipoRecado,
} from "@prisma/client";
import { hash } from "bcryptjs";

const db = new PrismaClient();

// Função helper para gerar tokens numéricos aleatórios de 8 dígitos
function gerarToken8Digitos(): string {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

async function main() {
  console.log("Iniciando o script de seed...");

  console.log("Limpando dados existentes...");
  await db.passwordResetToken.deleteMany();
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

  // ==========================================
  // PLANOS (Árvore comercial completa do SaaS)
  // ==========================================
  const planoLight = await db.plano.create({
    data: {
      nome_plano: "Plano Light",
      valor: 89.9,
      limite_unidades: 40,
      limite_condominios: 5,
    },
  });

  await db.plano.create({
    data: {
      nome_plano: "Plano Profissional",
      valor: 149.9,
      limite_unidades: 100,
      limite_condominios: 9999,
    },
  });

  const planoPremium = await db.plano.create({
    data: {
      nome_plano: "Plano Premium",
      valor: 299.9,
      limite_unidades: 300,
      limite_condominios: 9999,
    },
  });

  await db.plano.create({
    data: {
      nome_plano: "Plano Enterprise",
      valor: 599.9,
      limite_unidades: 800,
      limite_condominios: 9999,
    },
  });
  console.log(`Planos comerciais criados.`);

  // ==========================================
  // CONDOMÍNIOS E FATURAS
  // ==========================================
  const condominio = await db.condominio.create({
    data: {
      nome_condominio: "Residencial Pequeno Príncipe",
      cnpj: "95489660000194",
      logradouro: "Rua das Acácias",
      numero: "123",
      bairro: "Centro",
      cidade: "Curitiba",
      uf: "PR",
      qtd_unidades: 28, // 4 blocos * 7 moradores = 28 unidades
      qtd_blocos_torres: 4,
      id_plano: planoLight.id_plano, // Associado ao Plano Light corretamente
      ativo: true,
    },
  });

  await db.fatura.create({
    data: {
      id_condominio: condominio.id_condominio,
      id_plano: planoLight.id_plano,
      valor_cobrado: 89.9,
      data_vencimento: new Date(new Date().setDate(new Date().getDate() + 10)),
      data_pagamento: new Date(),
      status_pagamento: StatusPagamento.PAGO,
      forma_pagamento: "PIX",
    },
  });

  const condominioAtrasado = await db.condominio.create({
    data: {
      nome_condominio: "Condomínio Flores do Campo",
      cnpj: "12345678000199",
      logradouro: "Av das Flores",
      numero: "404",
      bairro: "Jardins",
      cidade: "São Paulo",
      uf: "SP",
      qtd_unidades: 10,
      qtd_blocos_torres: 1,
      id_plano: planoLight.id_plano,
      ativo: true,
    },
  });

  await db.fatura.create({
    data: {
      id_condominio: condominioAtrasado.id_condominio,
      id_plano: planoLight.id_plano,
      valor_cobrado: 89.9,
      data_vencimento: new Date(new Date().setDate(new Date().getDate() - 15)),
      status_pagamento: StatusPagamento.ATRASADO,
      inadimplente: true,
      forma_pagamento: "BOLETO",
    },
  });

  await db.condominio.create({
    data: {
      nome_condominio: "Residencial Fantasma",
      cnpj: "00000000000100",
      id_plano: planoLight.id_plano,
      ativo: false,
    },
  });
  console.log(`Condomínios criados (1 ativo no plano Light, 1 inadimplente, 1 inativo).`);

  // ==========================================
  // USUÁRIOS (Com tokens aleatórios de 8 dígitos)
  // ==========================================
  await db.usuario.create({
    data: {
      nome_completo: "Administrador do Sistema",
      email: "admin@gmail.com",
      cpf: "11122233344",
      telefone: "11999990000",
      senha_hash: senhaHash,
      perfil: PerfilUsuario.ADMINISTRADOR,
      id_condominio: condominio.id_condominio,
      termo_aceite: true,
      ativo: true,
      token_acesso: gerarToken8Digitos(),
    },
  });

  const sindico = await db.usuario.create({
    data: {
      nome_completo: "Síndico Admin",
      email: "sindico@gmail.com",
      cpf: "68282302058",
      telefone: "41912345678",
      senha_hash: senhaHash,
      perfil: PerfilUsuario.SINDICO,
      id_condominio: condominio.id_condominio,
      termo_aceite: true,
      ativo: true,
      token_acesso: gerarToken8Digitos(),
    },
  });

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
      termo_aceite: true,
      token_acesso: gerarToken8Digitos(),
    },
  });

  const usuarioJoao = await db.usuario.create({
    data: {
      nome_completo: "João Pedro",
      email: "joao@gmail.com",
      cpf: "98765432100",
      telefone: "41988887777",
      senha_hash: senhaHash,
      perfil: PerfilUsuario.MORADOR,
      id_condominio: condominio.id_condominio,
      ativo: true,
      termo_aceite: true,
      token_acesso: gerarToken8Digitos(),
    },
  });

  const porteiro1 = await db.usuario.create({
    data: {
      nome_completo: "Carlos (Porteiro 1)",
      email: "porteiro1@seed.com",
      cpf: "55563157873",
      telefone: "11911110001",
      senha_hash: senhaHash,
      perfil: PerfilUsuario.PORTEIRO,
      id_condominio: condominio.id_condominio,
      ativo: true,
      termo_aceite: true,
      token_acesso: gerarToken8Digitos(),
    },
  });

  const porteiro2 = await db.usuario.create({
    data: {
      nome_completo: "Roberto (Porteiro 2)",
      email: "porteiro2@seed.com",
      cpf: "34090527805",
      telefone: "11911110002",
      senha_hash: senhaHash,
      perfil: PerfilUsuario.PORTEIRO,
      id_condominio: condominio.id_condominio,
      ativo: true,
      termo_aceite: true,
      token_acesso: gerarToken8Digitos(),
    },
  });

  const moradorAtrasado = await db.usuario.create({
    data: {
      nome_completo: "Carlos Inadimplente",
      email: "carlos_inadimplente@gmail.com",
      cpf: "44455566677",
      telefone: "11977776666",
      senha_hash: senhaHash,
      perfil: PerfilUsuario.MORADOR,
      id_condominio: condominioAtrasado.id_condominio,
      ativo: true,
      termo_aceite: true,
      token_acesso: gerarToken8Digitos(),
    },
  });

  console.log(`Usuários criados com tokens de 8 dígitos dinâmicos.`);

  // ==========================================
  // UNIDADES (7 moradores por bloco para deixar espaço de testes)
  // ==========================================
  const blocosConfig = [
    { nome: "A", inicio: 1, fim: 7 },   // Bloco A: 1 ao 7
    { nome: "B", inicio: 8, fim: 14 },  // Bloco B: 8 ao 14
    { nome: "C", inicio: 15, fim: 21 }, // Bloco C: 15 ao 21
    { nome: "D", inicio: 22, fim: 28 }, // Bloco D: 22 ao 28
  ];
  const unidadesCriadas = [];

  for (const config of blocosConfig) {
    for (let i = config.inicio; i <= config.fim; i++) {
      const unidade = await db.unidade.create({
        data: {
          id_condominio: condominio.id_condominio,
          bloco_torre: `Bloco ${config.nome}`,
          numero_unidade: i.toString(),
        },
      });
      unidadesCriadas.push(unidade);
    }
  }

  // Unidade Condominio Atrasado
  const unidadeAtrasada = await db.unidade.create({
    data: {
      id_condominio: condominioAtrasado.id_condominio,
      bloco_torre: "Único",
      numero_unidade: "101",
    },
  });

  // Remapeando os testes para os novos índices corretos de 1 a 7 por bloco
  const unidadeA1 = unidadesCriadas.find(
    (u) => u.bloco_torre === "Bloco A" && u.numero_unidade === "1",
  );
  const unidadeB9 = unidadesCriadas.find(
    (u) => u.bloco_torre === "Bloco B" && u.numero_unidade === "9",
  );

  if (!unidadeA1 || !unidadeB9) {
    throw new Error("Falha ao mapear as novas sequências numéricas de 7 moradores por bloco.");
  }

  // Vínculos Morador -> Unidade
  await db.moradoresUnidades.create({
    data: {
      id_usuario: usuarioYaya.id_usuario,
      id_unidade: unidadeA1.id_unidade,
      principal: true,
    },
  });

  await db.moradoresUnidades.create({
    data: {
      id_usuario: usuarioJoao.id_usuario,
      id_unidade: unidadeB9.id_unidade,
      principal: true,
    },
  });

  await db.moradoresUnidades.create({
    data: {
      id_usuario: moradorAtrasado.id_usuario,
      id_unidade: unidadeAtrasada.id_unidade,
      principal: true,
    },
  });
  console.log("Unidades (7 por bloco) e vínculos de moradores aplicados com sucesso.");

  // ==========================================
  // ENCOMENDAS E RETIRADAS
  // ==========================================
  const encomendaA1 = await db.encomenda.create({
    data: {
      id_unidade: unidadeA1.id_unidade,
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
      id_unidade: unidadeA1.id_unidade,
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

  const encomendaB1 = await db.encomenda.create({
    data: {
      id_unidade: unidadeA1.id_unidade,
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

  await db.encomenda.create({
    data: {
      id_unidade: unidadeA1.id_unidade,
      id_porteiro_recebimento: porteiro1.id_usuario,
      data_recebimento: new Date("2025-11-05T09:00:00"),
      tipo_encomenda: "Envelope (Cancelado)",
      tamanho: "Pequeno",
      forma_entrega: "Documento",
      condicao: "Entrega errada, devolvido ao remetente.",
      status: StatusEncomenda.CANCELADA,
    },
  });

  const pendenteYaya1 = await db.encomenda.create({
    data: {
      id_unidade: unidadeA1.id_unidade,
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
      id_unidade: unidadeA1.id_unidade,
      id_usuario_cadastro: usuarioYaya.id_usuario,
      tipo_encomenda: "Pacote DHL",
      tamanho: "Grande",
      forma_entrega: "DHL",
      codigo_rastreio: "DHL987654",
      condicao: "Frágil, cuidado",
      status: StatusEncomenda.PENDENTE,
    },
  });

  await db.encomenda.create({
    data: {
      id_unidade: unidadeB9.id_unidade,
      id_usuario_cadastro: usuarioJoao.id_usuario,
      tipo_encomenda: "Notebook",
      tamanho: "Médio",
      forma_entrega: "Transportadora",
      status: StatusEncomenda.PENDENTE,
    },
  });

  const encomendaJoao = await db.encomenda.create({
    data: {
      id_unidade: unidadeB9.id_unidade,
      id_porteiro_recebimento: porteiro2.id_usuario,
      data_recebimento: new Date("2025-11-08T10:00:00"),
      tipo_encomenda: "Cadeira de Escritório",
      tamanho: "Grande",
      forma_entrega: "Mercado Livre",
      status: StatusEncomenda.ENTREGUE,
    },
  });
  await db.retirada.create({
    data: {
      id_encomenda: encomendaJoao.id_encomenda,
      id_usuario_retirada: usuarioJoao.id_usuario,
      data_retirada: new Date("2025-11-08T18:30:00"),
      forma_confirmacao: "Assinatura Digital",
    },
  });

  console.log("Cenários de encomendas variados criados.");

  // ==========================================
  // RECADOS (Mural / Mensagens)
  // ==========================================
  const avisoGeral = await db.recado.create({
    data: {
      id_condominio: condominio.id_condominio,
      id_usuario_origem: sindico.id_usuario,
      tipo_recado: TipoRecado.AVISO_GERAL,
      assunto: "Manutenção dos Elevadores",
      conteudo: "Informamos que no próximo final de semana haverá manutenção preventiva em todos os elevadores.",
      status_recado: "ABERTO",
    },
  });

  await db.respostaRecado.create({
    data: {
      id_recado: avisoGeral.id_recado,
      id_usuario_resposta: usuarioYaya.id_usuario,
      conteudo_resposta: "Obrigada por avisar! Serão todos ao mesmo tempo ou um por vez?",
    },
  });

  await db.respostaRecado.create({
    data: {
      id_recado: avisoGeral.id_recado,
      id_usuario_resposta: sindico.id_usuario,
      conteudo_resposta: "Um por vez, não se preocupe.",
    },
  });

  const reclamacao = await db.recado.create({
    data: {
      id_condominio: condominio.id_condominio,
      id_usuario_origem: usuarioJoao.id_usuario,
      tipo_recado: TipoRecado.RECLAMACAO,
      assunto: "Barulho excessivo à noite",
      conteudo: "Gostaria de relatar barulho após as 22h no Bloco B.",
      status_recado: "EM_ANDAMENTO",
    },
  });

  await db.respostaRecado.create({
    data: {
      id_recado: reclamacao.id_recado,
      id_usuario_resposta: sindico.id_usuario,
      conteudo_resposta: "Estamos verificando com as unidades envolvidas. Obrigado pelo relato.",
    },
  });
  console.log("Recados e interações no mural criados.");

  // ==========================================
  // NOTIFICAÇÕES
  // ==========================================
  await db.notificacao.create({
    data: {
      id_encomenda: pendenteYaya1.id_encomenda,
      id_usuario_destinatario: usuarioYaya.id_usuario,
      tipo_envio: "EMAIL",
      mensagem: "Sua encomenda 'Pacote Amazon' acaba de chegar na portaria!",
      status_envio: "ENVIADO",
    },
  });

  await db.notificacao.create({
    data: {
      id_encomenda: encomendaJoao.id_encomenda,
      id_usuario_destinatario: usuarioJoao.id_usuario,
      tipo_envio: "TELEGRAM",
      mensagem: "O pacote 'Cadeira de Escritório' foi entregue para João Pedro.",
      status_envio: "LIDO",
    },
  });
  console.log("Notificações simuladas.");

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