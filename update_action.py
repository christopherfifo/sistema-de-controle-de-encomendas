import re

with open("src/app/cadastro/helpers/actionCadastro.ts", "r") as f:
    content = f.read()

# 1. Update registerCondominioAndAdmin signature
content = content.replace(
    "export async function registerCondominioAndAdmin(\n  values: z.infer<typeof cadastroSchema>,\n): Promise<CadastroResult> {",
    "export async function registerCondominioAndAdmin(\n  values: z.infer<typeof cadastroSchema>,\n  dadosCartao?: any,\n  dadosFatura?: any\n): Promise<CadastroResult> {"
)

# 2. Add plano fetch before transaction
new_tx_logic = """
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
    });"""

content = re.sub(r'const result = await db\.\$transaction\(async \(tx\) => \{.*?\n      return \{ newCondominio, newAdmin \};\n    \}\);', new_tx_logic, content, flags=re.DOTALL)


# 3. Update validarEProcessarPagamento signature
content = content.replace(
    "export async function validarEProcessarPagamento(\n  validatePayload: Record<string, unknown>,\n  valor: number,\n  descricao: string,\n) {",
    "export async function validarEProcessarPagamento(\n  validatePayload: Record<string, unknown>,\n  valor: number,\n  descricao: string,\n  bandeira: string,\n) {"
)

# 4. Update payment processing payload
new_payment_logic = """
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
        tipo: "CREDITO"
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
    };"""

content = re.sub(r'const paymentPayload = \{.*?\n    return \{ success: true \};', new_payment_logic, content, flags=re.DOTALL)

with open("src/app/cadastro/helpers/actionCadastro.ts", "w") as f:
    f.write(content)

