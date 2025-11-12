CREATE DATABASE IF NOT EXISTS controle_encomendas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE controle_encomendas;

-- ----------------------------------------------------
-- TABELAS e ENUMs
-- ----------------------------------------------------

CREATE TABLE Plano (
    id_plano CHAR(36) NOT NULL DEFAULT (UUID()),
    nome_plano VARCHAR(255) NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    limite_unidades INT NOT NULL,
    limite_usuarios INT NOT NULL,
    limite_condominios INT NOT NULL,
    data_inclusao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_plano),
    UNIQUE (nome_plano)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE Condominio (
    id_condominio CHAR(36) NOT NULL DEFAULT (UUID()),
    nome_condominio VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18) NOT NULL,
    codigo_acesso VARCHAR(255) NOT NULL,
    logradouro VARCHAR(255) NOT NULL,
    numero VARCHAR(20) NOT NULL,
    bairro VARCHAR(255) NOT NULL,
    cidade VARCHAR(255) NOT NULL,
    uf CHAR(2) NOT NULL,
    qtd_unidades INT NOT NULL,
    qtd_blocos_torres INT NOT NULL,
    id_plano CHAR(36) NOT NULL,
    data_adesao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    identidade_visual JSON,
    PRIMARY KEY (id_condominio),
    UNIQUE (cnpj),
    UNIQUE (codigo_acesso),
    FOREIGN KEY (id_plano) REFERENCES Plano(id_plano)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE Usuario (
    id_usuario CHAR(36) NOT NULL DEFAULT (UUID()),
    nome_completo VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    perfil ENUM('ADMINISTRADOR', 'SINDICO', 'PORTEIRO', 'MORADOR') NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_condominio CHAR(36) NOT NULL,
    PRIMARY KEY (id_usuario),
    UNIQUE (cpf),
    UNIQUE (email),
    FOREIGN KEY (id_condominio) REFERENCES Condominio(id_condominio)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE Unidade (
    id_unidade CHAR(36) NOT NULL DEFAULT (UUID()),
    id_condominio CHAR(36) NOT NULL,
    bloco_torre VARCHAR(255) NOT NULL,
    numero_unidade VARCHAR(50) NOT NULL,
    PRIMARY KEY (id_unidade),
    UNIQUE (id_condominio, bloco_torre, numero_unidade),
    FOREIGN KEY (id_condominio) REFERENCES Condominio(id_condominio)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE MoradoresUnidades (
    id_morador_unidade CHAR(36) NOT NULL DEFAULT (UUID()),
    principal BOOLEAN NOT NULL DEFAULT FALSE,
    id_usuario CHAR(36) NOT NULL,
    id_unidade CHAR(36) NOT NULL,
    PRIMARY KEY (id_morador_unidade),
    UNIQUE (id_usuario, id_unidade),
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (id_unidade) REFERENCES Unidade(id_unidade)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE Encomenda (
    id_encomenda CHAR(36) NOT NULL DEFAULT (UUID()),
    id_unidade CHAR(36) NOT NULL,
    id_porteiro_recebimento CHAR(36) NOT NULL,
    tipo_encomenda VARCHAR(100) NOT NULL,
    tamanho VARCHAR(100) NOT NULL,
    forma_entrega VARCHAR(100) NOT NULL,
    codigo_rastreio VARCHAR(100),
    condicao VARCHAR(100) NOT NULL,
    data_recebimento TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(100) NOT NULL,
    url_foto_pacote VARCHAR(500) NOT NULL,
    PRIMARY KEY (id_encomenda),
    FOREIGN KEY (id_unidade) REFERENCES Unidade(id_unidade)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (id_porteiro_recebimento) REFERENCES Usuario(id_usuario)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE Retirada (
    id_retirada CHAR(36) NOT NULL DEFAULT (UUID()),
    id_encomenda CHAR(36) NOT NULL,
    id_usuario_retirada CHAR(36) NOT NULL,
    data_retirada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    forma_confirmacao VARCHAR(100) NOT NULL,
    comprovante VARCHAR(500),
    PRIMARY KEY (id_retirada),
    UNIQUE (id_encomenda),
    FOREIGN KEY (id_encomenda) REFERENCES Encomenda(id_encomenda)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (id_usuario_retirada) REFERENCES Usuario(id_usuario)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE Fatura (
    id_fatura CHAR(36) NOT NULL DEFAULT (UUID()),
    id_condominio CHAR(36) NOT NULL,
    id_plano CHAR(36) NOT NULL,
    valor_cobrado DECIMAL(10, 2) NOT NULL,
    data_emissao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_vencimento TIMESTAMP NOT NULL,
    data_pagamento TIMESTAMP NULL,
    status_pagamento ENUM('PENDENTE', 'PAGO', 'ATRASADO', 'CANCELADO') NOT NULL,
    inadimplente BOOLEAN NOT NULL DEFAULT FALSE,
    forma_pagamento VARCHAR(100) NOT NULL,
    link_pagamento VARCHAR(500),
    PRIMARY KEY (id_fatura),
    FOREIGN KEY (id_condominio) REFERENCES Condominio(id_condominio)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (id_plano) REFERENCES Plano(id_plano)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE Recado (
    id_recado CHAR(36) NOT NULL DEFAULT (UUID()),
    id_condominio CHAR(36) NOT NULL,
    id_usuario_origem CHAR(36) NOT NULL,
    tipo_recado ENUM('DUVIDA', 'SUGESTAO', 'RECLAMACAO', 'AVISO_GERAL') NOT NULL,
    assunto VARCHAR(255) NOT NULL,
    conteudo TEXT NOT NULL,
    status_recado VARCHAR(50) NOT NULL DEFAULT 'ABERTO',
    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_recado),
    FOREIGN KEY (id_condominio) REFERENCES Condominio(id_condominio)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (id_usuario_origem) REFERENCES Usuario(id_usuario)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE RespostaRecado (
    id_resposta CHAR(36) NOT NULL DEFAULT (UUID()),
    id_recado CHAR(36) NOT NULL,
    id_usuario_resposta CHAR(36) NOT NULL,
    data_resposta TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    conteudo_resposta TEXT NOT NULL,
    PRIMARY KEY (id_resposta),
    FOREIGN KEY (id_recado) REFERENCES Recado(id_recado)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (id_usuario_resposta) REFERENCES Usuario(id_usuario)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE Notificacao (
    id_notificacao CHAR(36) NOT NULL DEFAULT (UUID()),
    id_encomenda CHAR(36) NOT NULL,
    id_usuario_destinatario CHAR(36) NOT NULL,
    tipo_envio VARCHAR(100) NOT NULL,
    mensagem TEXT NOT NULL,
    data_envio TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status_envio VARCHAR(100) NOT NULL,
    PRIMARY KEY (id_notificacao),
    FOREIGN KEY (id_encomenda) REFERENCES Encomenda(id_encomenda)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (id_usuario_destinatario) REFERENCES Usuario(id_usuario)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
