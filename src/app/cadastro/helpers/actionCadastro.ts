"use server";

import { z } from "zod";
import { cadastroSchema } from "./schemaCadastro";
import { db } from "@/lib/prisma";
import bcrypt from "bcryptjs";

type CadastroResult = {
  success?: boolean;
  error?: string;
  userId?: string;
  condominioId?: string;
  perfil?: string;
};

export async function registerCondominioAndAdmin(
  values: z.infer<typeof cadastroSchema>,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  dadosCartao?: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dadosFatura?: any
): Promise<CadastroResult> {
  const validatedFields = await cadastroSchema.safeParseAsync(values);
  if (!validatedFields.success) {
    console.error(
      "[ZOD_VALIDATION_ERROR]",
      validatedFields.error.flatten().fieldErrors,
    );
    return { error: "Dados inválidos. Verifique os campos e tente novamente." };
  }

  const {
    nomeCompleto,
    email: rawEmail,
    cpf: rawCpf,
    senha,
    telefone,
    nomeCondominio,
    cnpj,
    planoId,
  } = validatedFields.data;

  const email = rawEmail.trim();
  const cpf = rawCpf.trim();

  const hashedPassword = await bcrypt.hash(senha, 10);
  try {
    const existingUser = await db.usuario.findFirst({
      where: {
        OR: [{ email: email }, { cpf: cpf }],
      },
    });

    if (existingUser) {
      return { error: "Email ou CPF já cadastrados." };
    }

    const existingCondominio = await db.condominio.findUnique({
      where: { cnpj: cnpj },
    });

    if (existingCondominio) {
      return { error: "CNPJ do condomínio já cadastrado." };
    }

    
    const planoSelecionado = await db.plano.findUnique({ where: { id_plano: planoId } });
    const valorPlano = planoSelecionado ? planoSelecionado.valor : 0;

    const result = await db.$transaction(async (tx) => {
      const newCondominio = await tx.condominio.create({
        data: {
          nome_condominio: nomeCondominio,
          cnpj: cnpj,
          id_plano: planoId,
        },
      });

      const newAdmin = await tx.usuario.create({
        data: {
          nome_completo: nomeCompleto,
          email: email,
          cpf: cpf,
          senha_hash: hashedPassword,
          telefone: telefone,
          perfil: "ADMINISTRADOR",
          termo_aceite: true,
          condominio: {
            connect: { id_condominio: newCondominio.id_condominio },
          },
        },
      });

      if (dadosCartao && dadosFatura) {
        const newCartao = await tx.cartao.create({
          data: {
            id_condominio: newCondominio.id_condominio,
            titular: dadosCartao.titular,
            ultimos_digitos: dadosCartao.ultimos_digitos,
            bandeira: dadosCartao.bandeira,
            mes_expiracao: dadosCartao.mes_expiracao,
            ano_expiracao: dadosCartao.ano_expiracao,
            tipo: dadosCartao.tipo === "CREDITO" ? "CREDITO" : "DEBITO",
            gateway_token: dadosCartao.gateway_token,
          }
        });

        await tx.fatura.create({
          data: {
            id_condominio: newCondominio.id_condominio,
            id_plano: planoId,
            id_cartao: newCartao.id_cartao,
            valor_cobrado: valorPlano,
            data_vencimento: new Date(),
            data_pagamento: new Date(),
            status_pagamento: dadosFatura.status_pagamento,
            inadimplente: false,
            forma_pagamento: "CARTAO",
          }
        });
      }

      return { newCondominio, newAdmin };
    });

    return {
      success: true,
      userId: String(result.newAdmin.id_usuario),
      condominioId: String(result.newCondominio.id_condominio),
      perfil: String(result.newAdmin.perfil),
    };
  } catch (error) {
    console.error("[REGISTER_ACTION_ERROR]", error);
    return { error: "Ocorreu um erro no cadastro. Tente novamente." };
  }
}

export async function consultarBandeiraCartao(bin: string) {
  try {
    const res = await fetch(
      `https://mock-pagamento-api.vercel.app/api/cartoes/bandeira/${bin}`,
    );
    if (res.ok) {
      return await res.json();
    }
    return null;
  } catch (error) {
    return null;
  }
}

export async function verificarCadastroExistente(email: string, cpf: string, cnpj: string) {
  try {
    const existingUser = await db.usuario.findFirst({
      where: {
        OR: [{ email: email }, { cpf: cpf }],
      },
    });

    if (existingUser) {
      return { exists: true, error: "Email ou CPF já cadastrados." };
    }

    const existingCondominio = await db.condominio.findUnique({
      where: { cnpj: cnpj },
    });

    if (existingCondominio) {
      return { exists: true, error: "CNPJ do condomínio já cadastrado." };
    }

    return { exists: false };
  } catch (error) {
    return { exists: true, error: "Erro ao verificar dados. Tente novamente." };
  }
}

export async function validarCartaoServidor(validatePayload: Record<string, unknown>) {
  try {
    const validateRes = await fetch(
      "https://mock-pagamento-api.vercel.app/api/cartoes/validar",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatePayload),
      },
    );

    if (validateRes.ok) {
      return await validateRes.json();
    } else {
      return { error: "Erro ao validar cartão." };
    }
  } catch (error) {
    return { error: "Ocorreu um erro de conexão ao validar o cartão." };
  }
}

export async function validarEProcessarPagamento(
  validatePayload: Record<string, unknown>,
  valor: number,
  descricao: string,
  bandeira: string,
) {
  try {
    const validateRes = await fetch(
      "https://mock-pagamento-api.vercel.app/api/cartoes/validar",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatePayload),
      },
    );

    if (validateRes.ok) {
      const validateData = await validateRes.json();
      if (!validateData.numero_valido || !validateData.data_valida) {
        return {
          error: validateData.mensagem_erro || "Dados do cartão inválidos.",
        };
      }
    } else {
      return { error: "Erro ao validar cartão." };
    }

    
    const partesData = String(validatePayload.validade).split('/');
    const mes = parseInt(partesData[0], 10);
    const anoRaw = parseInt(partesData[1], 10);
    const ano = anoRaw < 100 ? anoRaw + 2000 : anoRaw;

    const paymentPayload = {
      valor_cobranca: valor,
      cartao: {
        numero_cartao: validatePayload.numero,
        titular: validatePayload.nome_titular,
        mes_expiracao: mes,
        ano_expiracao: ano,
        cvv: validatePayload.cvv,
        bandeira: bandeira,
        tipo: validatePayload.tipoCartao || "CREDITO"
      }
    };

    const paymentRes = await fetch(
      "https://mock-pagamento-api.vercel.app/api/pagamentos/processar",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentPayload),
      },
    );

    if (!paymentRes.ok) {
      const errorData = await paymentRes.json();
      return {
        error: errorData.detail?.mensagem || "Erro ao processar pagamento.",
      };
    }

    const paymentData = await paymentRes.json();

    return { 
      success: true,
      dadosCartao: paymentData.dados_cartao_para_salvar,
      dadosFatura: paymentData.dados_fatura_para_salvar
    };
  } catch (error) {
    return {
      error: "Ocorreu um erro de conexão ao processar. Tente novamente.",
    };
  }
}
