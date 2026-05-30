import { PrismaClient, PerfilUsuario, StatusEncomenda, StatusPagamento, TipoRecado } from "@prisma/client";
import { hash } from "bcryptjs";

const db = new PrismaClient();

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
  // PLANOS
  // ==========================================
  const planoBasico = await db.plano.create({
    data: {
      nome_plano: "Plano Light",
      valor: 89.90,
      limite_unidades: 40,
      limite_condominios: 5,
    },
  });

  const planoPremium = await db.plano.create({
    data: {
      nome_plano: "Plano Premium",
      valor: 199.90,
      limite_unidades: 200,
      limite_condominios: 15,
    },
  });
  console.log(`Planos criados.`);

  // ==========================================
  // CONDOMÍNIOS E FATURAS
  // ==========================================
  // 1. Condomínio Principal (Regular)
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
      id_plano: planoPremium.id_plano,
      ativo: true,
    },
  });

  // Fatura paga (condomínio em dia)
  await db.fatura.create({
    data: {
      id_condominio: condominio.id_condominio,
      id_plano: planoPremium.id_plano,
      valor_cobrado: 199.90,
      data_vencimento: new Date(new Date().setDate(new Date().getDate() + 10)),
      data_pagamento: new Date(),
      status_pagamento: StatusPagamento.PAGO,
      forma_pagamento: "PIX",
    },
  });

  // 2. Condomínio Inadimplente (Fatura Atrasada)
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
      id_plano: planoBasico.id_plano,
      ativo: true,
    },
  });

  await db.fatura.create({
    data: {
      id_condominio: condominioAtrasado.id_condominio,
      id_plano: planoBasico.id_plano,
      valor_cobrado: 89.90,
      data_vencimento: new Date(new Date().setDate(new Date().getDate() - 15)), // Venceu 15 dias atrás
      status_pagamento: StatusPagamento.ATRASADO,
      inadimplente: true,
      forma_pagamento: "BOLETO",
    },
  });

  // 3. Condomínio Inativo
  await db.condominio.create({
    data: {
      nome_condominio: "Residencial Fantasma",
      cnpj: "00000000000100",
      id_plano: planoBasico.id_plano,
      ativo: false,
    },
  });
  console.log(`Condomínios criados (1 ativo, 1 inadimplente, 1 inativo).`);

  // ==========================================
  // USUÁRIOS
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
      token_acesso: "00000000",
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
      token_acesso: "11111111",
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
      token_acesso: "22222222",
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
      token_acesso: "33333333",
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
      token_acesso: "44444444",
    },
  });

  // Usuário no condomínio atrasado
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
    },
  });

  console.log(`Usuários principais criados (Yaya, Síndico, Porteiros preservados).`);

  // ==========================================
  // UNIDADES
  // ==========================================
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
  }

  // Unidade Condominio Atrasado
  const unidadeAtrasada = await db.unidade.create({
    data: {
      id_condominio: condominioAtrasado.id_condominio,
      bloco_torre: "Único",
      numero_unidade: "101",
    },
  });

  const unidadeA101 = unidadesCriadas.find(u => u.bloco_torre === "Bloco A" && u.numero_unidade === "101");
  const unidadeB102 = unidadesCriadas.find(u => u.bloco_torre === "Bloco B" && u.numero_unidade === "102");

  if (!unidadeA101 || !unidadeB102) {
    throw new Error("Falha ao encontrar as unidades A-101 ou B-102.");
  }

  // Vínculos Morador -> Unidade
  await db.moradoresUnidades.create({
    data: {
      id_usuario: usuarioYaya.id_usuario,
      id_unidade: unidadeA101.id_unidade,
      principal: true,
    },
  });

  await db.moradoresUnidades.create({
    data: {
      id_usuario: usuarioJoao.id_usuario,
      id_unidade: unidadeB102.id_unidade,
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
  console.log("Unidades e vínculos de moradores criados.");

  // ==========================================
  // ENCOMENDAS E RETIRADAS
  // ==========================================
  // Encomendas Entregues (Yaya)
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

  // Encomendas Pré-cadastradas Entregues (Yaya)
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

  // Encomendas Canceladas (Yaya)
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

  // Encomendas PENDENTES (Pré-cadastradas Yaya)
  const pendenteYaya1 = await db.encomenda.create({
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

  // Encomenda Pendente e Entregue para João (Bloco B - 102)
  await db.encomenda.create({
    data: {
      id_unidade: unidadeB102.id_unidade,
      id_usuario_cadastro: usuarioJoao.id_usuario,
      tipo_encomenda: "Notebook",
      tamanho: "Médio",
      forma_entrega: "Transportadora",
      status: StatusEncomenda.PENDENTE,
    },
  });

  const encomendaJoao = await db.encomenda.create({
    data: {
      id_unidade: unidadeB102.id_unidade,
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
      status_recado: "ABERTO"
    }
  });

  await db.respostaRecado.create({
    data: {
      id_recado: avisoGeral.id_recado,
      id_usuario_resposta: usuarioYaya.id_usuario,
      conteudo_resposta: "Obrigada por avisar! Serão todos ao mesmo tempo ou um por vez?"
    }
  });

  await db.respostaRecado.create({
    data: {
      id_recado: avisoGeral.id_recado,
      id_usuario_resposta: sindico.id_usuario,
      conteudo_resposta: "Um por vez, não se preocupe."
    }
  });

  const reclamacao = await db.recado.create({
    data: {
      id_condominio: condominio.id_condominio,
      id_usuario_origem: usuarioJoao.id_usuario,
      tipo_recado: TipoRecado.RECLAMACAO,
      assunto: "Barulho excessivo à noite",
      conteudo: "Gostaria de relatar barulho após as 22h no Bloco B.",
      status_recado: "EM_ANDAMENTO"
    }
  });

  await db.respostaRecado.create({
    data: {
      id_recado: reclamacao.id_recado,
      id_usuario_resposta: sindico.id_usuario,
      conteudo_resposta: "Estamos verificando com as unidades envolvidas. Obrigado pelo relato."
    }
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
      status_envio: "ENVIADO"
    }
  });

  await db.notificacao.create({
    data: {
      id_encomenda: encomendaJoao.id_encomenda,
      id_usuario_destinatario: usuarioJoao.id_usuario,
      tipo_envio: "TELEGRAM",
      mensagem: "O pacote 'Cadeira de Escritório' foi entregue para João Pedro.",
      status_envio: "LIDO"
    }
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
