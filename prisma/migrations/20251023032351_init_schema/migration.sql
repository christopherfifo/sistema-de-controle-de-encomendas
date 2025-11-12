-- CreateEnum
CREATE TYPE "PerfilUsuario" AS ENUM ('ADMINISTRADOR', 'SINDICO', 'PORTEIRO', 'MORADOR');

-- CreateEnum
CREATE TYPE "StatusPagamento" AS ENUM ('PENDENTE', 'PAGO', 'ATRASADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "TipoRecado" AS ENUM ('DUVIDA', 'SUGESTAO', 'RECLAMACAO', 'AVISO_GERAL');

-- CreateTable
CREATE TABLE "Condominio" (
    "id_condominio" TEXT NOT NULL,
    "nome_condominio" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "logradouro" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "uf" CHAR(2) NOT NULL,
    "qtd_unidades" INTEGER NOT NULL,
    "qtd_blocos_torres" INTEGER NOT NULL,
    "id_plano" TEXT NOT NULL,
    "data_adesao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "identidade_visual" JSONB,

    CONSTRAINT "Condominio_pkey" PRIMARY KEY ("id_condominio")
);

-- CreateTable
CREATE TABLE "Plano" (
    "id_plano" TEXT NOT NULL,
    "nome_plano" TEXT NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "limite_unidades" INTEGER NOT NULL,
    "data_inclusao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Plano_pkey" PRIMARY KEY ("id_plano")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id_usuario" TEXT NOT NULL,
    "nome_completo" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "perfil" "PerfilUsuario" NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_condominio" TEXT NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "Unidade" (
    "id_unidade" TEXT NOT NULL,
    "id_condominio" TEXT NOT NULL,
    "bloco_torre" TEXT NOT NULL,
    "numero_unidade" TEXT NOT NULL,

    CONSTRAINT "Unidade_pkey" PRIMARY KEY ("id_unidade")
);

-- CreateTable
CREATE TABLE "MoradoresUnidades" (
    "id_morador_unidade" TEXT NOT NULL,
    "principal" BOOLEAN NOT NULL DEFAULT false,
    "id_usuario" TEXT NOT NULL,
    "id_unidade" TEXT NOT NULL,

    CONSTRAINT "MoradoresUnidades_pkey" PRIMARY KEY ("id_morador_unidade")
);

-- CreateTable
CREATE TABLE "Encomenda" (
    "id_encomenda" TEXT NOT NULL,
    "id_unidade" TEXT NOT NULL,
    "id_porteiro_recebimento" TEXT NOT NULL,
    "tipo_encomenda" TEXT NOT NULL,
    "tamanho" TEXT NOT NULL,
    "forma_entrega" TEXT NOT NULL,
    "codigo_rastreio" TEXT,
    "condicao" TEXT NOT NULL,
    "data_recebimento" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,
    "url_foto_pacote" TEXT NOT NULL,

    CONSTRAINT "Encomenda_pkey" PRIMARY KEY ("id_encomenda")
);

-- CreateTable
CREATE TABLE "Retirada" (
    "id_retirada" TEXT NOT NULL,
    "id_encomenda" TEXT NOT NULL,
    "id_usuario_retirada" TEXT NOT NULL,
    "data_retirada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "forma_confirmacao" TEXT NOT NULL,
    "comprovante" TEXT,

    CONSTRAINT "Retirada_pkey" PRIMARY KEY ("id_retirada")
);

-- CreateTable
CREATE TABLE "Fatura" (
    "id_fatura" TEXT NOT NULL,
    "id_condominio" TEXT NOT NULL,
    "id_plano" TEXT NOT NULL,
    "valor_cobrado" DECIMAL(10,2) NOT NULL,
    "data_emissao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_vencimento" TIMESTAMP(3) NOT NULL,
    "data_pagamento" TIMESTAMP(3),
    "status_pagamento" "StatusPagamento" NOT NULL,
    "inadimplente" BOOLEAN NOT NULL DEFAULT false,
    "forma_pagamento" TEXT NOT NULL,
    "link_pagamento" TEXT,

    CONSTRAINT "Fatura_pkey" PRIMARY KEY ("id_fatura")
);

-- CreateTable
CREATE TABLE "Recado" (
    "id_recado" TEXT NOT NULL,
    "id_condominio" TEXT NOT NULL,
    "id_usuario_origem" TEXT NOT NULL,
    "tipo_recado" "TipoRecado" NOT NULL,
    "assunto" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "status_recado" TEXT NOT NULL DEFAULT 'ABERTO',
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Recado_pkey" PRIMARY KEY ("id_recado")
);

-- CreateTable
CREATE TABLE "RespostaRecado" (
    "id_resposta" TEXT NOT NULL,
    "id_recado" TEXT NOT NULL,
    "id_usuario_resposta" TEXT NOT NULL,
    "data_resposta" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "conteudo_resposta" TEXT NOT NULL,

    CONSTRAINT "RespostaRecado_pkey" PRIMARY KEY ("id_resposta")
);

-- CreateTable
CREATE TABLE "Notificacao" (
    "id_notificacao" TEXT NOT NULL,
    "id_encomenda" TEXT NOT NULL,
    "id_usuario_destinatario" TEXT NOT NULL,
    "tipo_envio" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "data_envio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status_envio" TEXT NOT NULL,

    CONSTRAINT "Notificacao_pkey" PRIMARY KEY ("id_notificacao")
);

-- CreateIndex
CREATE UNIQUE INDEX "Condominio_cnpj_key" ON "Condominio"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Plano_nome_plano_key" ON "Plano"("nome_plano");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_cpf_key" ON "Usuario"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Unidade_id_condominio_bloco_torre_numero_unidade_key" ON "Unidade"("id_condominio", "bloco_torre", "numero_unidade");

-- CreateIndex
CREATE UNIQUE INDEX "MoradoresUnidades_id_usuario_id_unidade_key" ON "MoradoresUnidades"("id_usuario", "id_unidade");

-- CreateIndex
CREATE UNIQUE INDEX "Retirada_id_encomenda_key" ON "Retirada"("id_encomenda");

-- AddForeignKey
ALTER TABLE "Condominio" ADD CONSTRAINT "Condominio_id_plano_fkey" FOREIGN KEY ("id_plano") REFERENCES "Plano"("id_plano") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_id_condominio_fkey" FOREIGN KEY ("id_condominio") REFERENCES "Condominio"("id_condominio") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unidade" ADD CONSTRAINT "Unidade_id_condominio_fkey" FOREIGN KEY ("id_condominio") REFERENCES "Condominio"("id_condominio") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoradoresUnidades" ADD CONSTRAINT "MoradoresUnidades_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoradoresUnidades" ADD CONSTRAINT "MoradoresUnidades_id_unidade_fkey" FOREIGN KEY ("id_unidade") REFERENCES "Unidade"("id_unidade") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Encomenda" ADD CONSTRAINT "Encomenda_id_unidade_fkey" FOREIGN KEY ("id_unidade") REFERENCES "Unidade"("id_unidade") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Encomenda" ADD CONSTRAINT "Encomenda_id_porteiro_recebimento_fkey" FOREIGN KEY ("id_porteiro_recebimento") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Retirada" ADD CONSTRAINT "Retirada_id_encomenda_fkey" FOREIGN KEY ("id_encomenda") REFERENCES "Encomenda"("id_encomenda") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Retirada" ADD CONSTRAINT "Retirada_id_usuario_retirada_fkey" FOREIGN KEY ("id_usuario_retirada") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fatura" ADD CONSTRAINT "Fatura_id_condominio_fkey" FOREIGN KEY ("id_condominio") REFERENCES "Condominio"("id_condominio") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fatura" ADD CONSTRAINT "Fatura_id_plano_fkey" FOREIGN KEY ("id_plano") REFERENCES "Plano"("id_plano") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recado" ADD CONSTRAINT "Recado_id_condominio_fkey" FOREIGN KEY ("id_condominio") REFERENCES "Condominio"("id_condominio") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recado" ADD CONSTRAINT "Recado_id_usuario_origem_fkey" FOREIGN KEY ("id_usuario_origem") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RespostaRecado" ADD CONSTRAINT "RespostaRecado_id_recado_fkey" FOREIGN KEY ("id_recado") REFERENCES "Recado"("id_recado") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RespostaRecado" ADD CONSTRAINT "RespostaRecado_id_usuario_resposta_fkey" FOREIGN KEY ("id_usuario_resposta") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notificacao" ADD CONSTRAINT "Notificacao_id_encomenda_fkey" FOREIGN KEY ("id_encomenda") REFERENCES "Encomenda"("id_encomenda") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notificacao" ADD CONSTRAINT "Notificacao_id_usuario_destinatario_fkey" FOREIGN KEY ("id_usuario_destinatario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;
