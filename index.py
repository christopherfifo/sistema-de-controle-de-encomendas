from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel, Field
import uuid
from datetime import datetime, timezone
import re
from datetime import datetime

def validar_algoritmo_luhn(numero_cartao: str) -> bool:
    """Verifica se o número do cartão é válido usando a fórmula de Luhn."""
    numero_limpo = re.sub(r'[^0-9]', '', numero_cartao)
    if not numero_limpo:
        return False

    lista_digitos = [int(digito) for digito in numero_limpo][::-1]
    
    soma_posicoes_impares = sum(lista_digitos[0::2])
    
    soma_posicoes_pares = sum(
        sum(divmod(digito_par * 2, 10)) 
        for digito_par in lista_digitos[1::2]
    )
    
    total_soma = soma_posicoes_impares + soma_posicoes_pares
    return total_soma % 10 == 0

def validar_data_expiracao(data_validade: str) -> bool:
    """Verifica se o cartão não está vencido (espera formato MM/AA ou MM/AAAA)."""
    try:
        partes_data = data_validade.split('/')
        mes_cartao = int(partes_data[0])
        ano_cartao = int(partes_data[1])

        if ano_cartao < 100:
            ano_cartao += 2000

        data_atual = datetime.now()
        ano_atual = data_atual.year
        mes_atual = data_atual.month

        if ano_cartao < ano_atual:
            return False
        if ano_cartao == ano_atual and mes_cartao < mes_atual:
            return False
            
        return 1 <= mes_cartao <= 12
    except (ValueError, IndexError):
        return False

def identificar_bandeira(numero_cartao: str) -> str:
    """Retorna a bandeira baseada nos dígitos iniciais do cartão."""
    numero_limpo = re.sub(r'[^0-9]', '', numero_cartao)
    
    # Dicionário de padrões Regex para as principais bandeiras no Brasil
    padroes_bandeiras = {
        "Visa": r"^4[0-9]{12}(?:[0-9]{3})?$",
        "Mastercard": r"^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$",
        "American Express": r"^3[47][0-9]{13}$",
        "Elo": r"^(?:4011(78|79)|43(1274|8935)|45(1416|7393|763(1|2))|50(4175|6699|67[0-7][0-9]|9000)|50(9[0-9][0-9][0-9])|627780|63(6297|6368)|650(03([^4])|04([0-9])|05(0|1)|05([7-9])|06([0-9])|07([0-9])|08([0-9])|4([0-3][0-9]|8[5-9]|9[0-9])|5([0-2][0-9]|3[0-8]|4[1-9]|[5-8][0-9]|9[0-8])|7([0-2][0-9]|20)|9([0-8][0-9]|9[0-6]))|651652|655000|655021)[0-9]{10,12}$",
        "Discover": r"^6(?:011|5[0-9]{2})[0-9]{12}$",
        "Hipercard": r"^(606282\d{10}(\d{3})?)|(3841\d{15})$"
    }

    for nome_bandeira, padrao_regex in padroes_bandeiras.items():
        if re.match(padrao_regex, numero_limpo):
            return nome_bandeira
            
    return "Desconhecida"



app = FastAPI(title="Mock Gateway de Pagamentos TCC")

class CartaoMock(BaseModel):
    numero: str = Field(..., min_length=13, max_length=19, description="Número do cartão sem espaços")
    nome_titular: str = Field(..., description="Nome impresso no cartão")
    validade: str = Field(..., pattern=r"^(0[1-9]|1[0-2])\/?([0-9]{2}|[0-9]{4})$", description="MM/AA ou MM/AAAA")
    cvv: str = Field(..., min_length=3, max_length=4)

class CartaoRequest(BaseModel):
    numero_cartao: str
    titular: str
    mes_expiracao: int
    ano_expiracao: int
    cvv: str
    bandeira: str
    tipo: str

class RequestPagamento(BaseModel):
    valor_cobranca: float = Field(..., gt=0, description="Valor da transação")
    cartao: CartaoRequest

class DadosCartaoSalvar(BaseModel):
    gateway_token: str
    titular: str
    ultimos_digitos: str
    bandeira: str
    mes_expiracao: int
    ano_expiracao: int
    tipo: str

class DadosFaturaSalvar(BaseModel):
    status_pagamento: str
    codigo_retorno: str
    metodo_retorno: str
    rmegu: str

class ResponsePagamento(BaseModel):
    sucesso: bool
    mensagem: str
    dados_cartao_para_salvar: DadosCartaoSalvar | None = None
    dados_fatura_para_salvar: DadosFaturaSalvar | None = None

class ResponseValidacaoCartao(BaseModel):
    numero_valido: bool
    data_valida: bool
    bandeira: str
    mensagem_erro: str | None = None

@app.post("/api/cartoes/validar", response_model=ResponseValidacaoCartao)
def validar_dados_cartao(payload: CartaoMock):
    """
    Simula uma validação de front-end ou pré-autorização.
    Pode ser chamado logo após o usuário preencher o formulário.
    """
    numero_cartao_valido = validar_algoritmo_luhn(payload.numero)
    data_expiracao_valida = validar_data_expiracao(payload.validade)
    bandeira_identificada = identificar_bandeira(payload.numero)
    
    mensagem = None
    if not numero_cartao_valido:
        mensagem = "O número do cartão fornecido é inválido."
    elif not data_expiracao_valida:
        mensagem = "A data de validade informada já expirou ou possui um formato incorreto."

    return ResponseValidacaoCartao(
        numero_valido=numero_cartao_valido,
        data_valida=data_expiracao_valida,
        bandeira=bandeira_identificada,
        mensagem_erro=mensagem
    )

@app.get("/api/cartoes/bandeira/{bin_cartao}")
def consultar_bandeira(bin_cartao: str):
    """
    Endpoint focado apenas em retornar a bandeira.
    Ideal para o front-end mostrar o ícone do cartão (Visa, Master) 
    assim que o usuário digitar os primeiros 6 ou 8 dígitos.
    """
    numero_limpo = re.sub(r'[^0-9]', '', bin_cartao)
    
    if len(numero_limpo) < 6:
         raise HTTPException(
            status_code=400,
            detail="É necessário fornecer pelo menos os 6 primeiros dígitos do cartão."
        )
         
    # Para o Regex funcionar corretamente na identificação parcial, 
    # podemos preencher o resto com zeros até dar 16 dígitos.
    cartao_preenchido = numero_limpo.ljust(16, '0')
    bandeira_encontrada = identificar_bandeira(cartao_preenchido)
    
    return {
        "bin_pesquisado": numero_limpo,
        "bandeira": bandeira_encontrada
    }

@app.post("/api/pagamentos/processar", response_model=ResponsePagamento, status_code=status.HTTP_201_CREATED)
def processar_pagamento(payload: RequestPagamento):
    gateway_token = f"tok_mock_{uuid.uuid4().hex[:10]}"
    
    numero_cartao = payload.cartao.numero_cartao
    cvv = payload.cartao.cvv
    ultimos_digitos = numero_cartao[-4:]
    
    dados_cartao = DadosCartaoSalvar(
        gateway_token=gateway_token,
        titular=payload.cartao.titular,
        ultimos_digitos=ultimos_digitos,
        bandeira=payload.cartao.bandeira,
        mes_expiracao=payload.cartao.mes_expiracao,
        ano_expiracao=payload.cartao.ano_expiracao,
        tipo=payload.cartao.tipo
    )

    # 1. Simulação: Cartão Recusado (final 0000)
    if numero_cartao.endswith("0000"):
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail={
                "sucesso": False,
                "mensagem": "Transação não autorizada: Saldo insuficiente ou limite excedido.",
                "dados_fatura_para_salvar": {
                    "status_pagamento": "RECUSADO",
                    "codigo_retorno": "51",
                    "metodo_retorno": "API_MOCKADA",
                    "rmegu": str(uuid.uuid4().int)[:9]
                }
            }
        )
        
    # 2. Simulação: Bloqueio Antifraude (CVV 999)
    if cvv == "999":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "sucesso": False,
                "mensagem": "Transação bloqueada pelo sistema antifraude.",
                "dados_fatura_para_salvar": {
                    "status_pagamento": "BLOQUEADO",
                    "codigo_retorno": "57",
                    "metodo_retorno": "API_MOCKADA",
                    "rmegu": str(uuid.uuid4().int)[:9]
                }
            }
        )

    # 3. Simulação: Erro interno no Gateway (final 5000)
    if numero_cartao.endswith("5000"):
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={
                "sucesso": False,
                "mensagem": "Sistema de pagamentos temporariamente indisponível.",
                "dados_fatura_para_salvar": {
                    "status_pagamento": "ERRO",
                    "codigo_retorno": "99",
                    "metodo_retorno": "API_MOCKADA",
                    "rmegu": str(uuid.uuid4().int)[:9]
                }
            }
        )

    # 4. Simulação: Pagamento Aprovado (Qualquer outro cenário)
    return ResponsePagamento(
        sucesso=True,
        mensagem="Pagamento processado e cartão salvo com sucesso.",
        dados_cartao_para_salvar=dados_cartao,
        dados_fatura_para_salvar=DadosFaturaSalvar(
            status_pagamento="PAGO",
            codigo_retorno="00",
            metodo_retorno="API_MOCKADA",
            rmegu=str(uuid.uuid4().int)[:9]
        )
    )

@app.get("/api/pagamentos/{gateway_token}")
def consultar_status(gateway_token: str):
    # Endpoint bônus para simular um webhook ou consulta de status
    return {
        "gateway_token": gateway_token,
        "sucesso": True, 
        "mensagem": "Consulta realizada com sucesso.",
        "dados_fatura_para_salvar": {
            "status_pagamento": "PAGO",
            "codigo_retorno": "00",
            "metodo_retorno": "API_MOCKADA",
            "rmegu": "123456789"
        }
    }

