-- DropForeignKey
ALTER TABLE "public"."Condominio" DROP CONSTRAINT "Condominio_id_plano_fkey";

-- DropForeignKey
ALTER TABLE "public"."Encomenda" DROP CONSTRAINT "Encomenda_id_porteiro_recebimento_fkey";

-- AlterTable
ALTER TABLE "Condominio" ALTER COLUMN "logradouro" DROP NOT NULL,
ALTER COLUMN "numero" DROP NOT NULL,
ALTER COLUMN "bairro" DROP NOT NULL,
ALTER COLUMN "cidade" DROP NOT NULL,
ALTER COLUMN "qtd_unidades" DROP NOT NULL,
ALTER COLUMN "qtd_blocos_torres" DROP NOT NULL,
ALTER COLUMN "id_plano" DROP NOT NULL,
ALTER COLUMN "data_adesao" DROP NOT NULL,
ALTER COLUMN "ativo" DROP NOT NULL,
ALTER COLUMN "codigo_acesso" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Encomenda" ADD COLUMN     "id_usuario_cadastro" TEXT,
ALTER COLUMN "id_porteiro_recebimento" DROP NOT NULL,
ALTER COLUMN "condicao" DROP NOT NULL,
ALTER COLUMN "data_recebimento" DROP NOT NULL,
ALTER COLUMN "data_recebimento" DROP DEFAULT,
ALTER COLUMN "status" SET DEFAULT 'PENDENTE',
ALTER COLUMN "url_foto_pacote" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Condominio" ADD CONSTRAINT "Condominio_id_plano_fkey" FOREIGN KEY ("id_plano") REFERENCES "Plano"("id_plano") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Encomenda" ADD CONSTRAINT "Encomenda_id_usuario_cadastro_fkey" FOREIGN KEY ("id_usuario_cadastro") REFERENCES "Usuario"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Encomenda" ADD CONSTRAINT "Encomenda_id_porteiro_recebimento_fkey" FOREIGN KEY ("id_porteiro_recebimento") REFERENCES "Usuario"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;
