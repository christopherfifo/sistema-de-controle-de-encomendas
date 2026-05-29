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
): Promise<CadastroResult> {
  const validatedFields = await cadastroSchema.safeParseAsync(values);
  if (!validatedFields.success) {
    console.error(
      "[ZOD_VALIDATION_ERROR]",
      validatedFields.error.flatten().fieldErrors,
    );
    return { error: "Dados inválidos. Verifique os campos e tente novamente." };
  }

  const { nomeCompleto, email, cpf, senha, telefone, nomeCondominio, cnpj, planoId } =
    validatedFields.data;

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
    const res = await fetch(`https://mock-pagamento-api.vercel.app/api/cartoes/bandeira/${bin}`);
    if (res.ok) {
      return await res.json();
    }
    return null;
  } catch (error) {
    return null;
  }
}

export async function validarEProcessarPagamento(validatePayload: Record<string, unknown>, valor: number, descricao: string) {
  try {
    const validateRes = await fetch("https://mock-pagamento-api.vercel.app/api/cartoes/validar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validatePayload),
    });

    if (validateRes.ok) {
      const validateData = await validateRes.json();
      if (!validateData.numero_valido || !validateData.data_valida) {
        return { error: validateData.mensagem_erro || "Dados do cartão inválidos." };
      }
    } else {
      return { error: "Erro ao validar cartão." };
    }

    const paymentPayload = {
      valor,
      moeda: "BRL",
      descricao,
      cartao: validatePayload
    };

    const paymentRes = await fetch("https://mock-pagamento-api.vercel.app/api/pagamentos/processar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymentPayload),
    });

    if (!paymentRes.ok) {
      const errorData = await paymentRes.json();
      return { error: errorData.detail?.mensagem || "Erro ao processar pagamento." };
    }

    return { success: true };
  } catch (error) {
    return { error: "Ocorreu um erro de conexão ao processar. Tente novamente." };
  }
}

