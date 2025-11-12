import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Package } from "lucide-react";

import { validateAndGetCondominioData } from "@/data/get-data-by-slug";

import { Encomenda, Unidade } from "@prisma/client";
import { EncomendasMoradorList } from "../components/encomendasMoradorList";

type EncomendaComUnidade = Encomenda & {
  unidade: Pick<Unidade, "bloco_torre" | "numero_unidade">;
};

interface HomePageSaasContentProps {
  slug: string;
  user?: string;
  perfil?: string;
  informationsOfUserAndCondominio: Awaited<
    ReturnType<typeof validateAndGetCondominioData>
  >;
  encomendasPendentes: EncomendaComUnidade[];
  userId?: string;
}

export function HomePageSaasContent({
  informationsOfUserAndCondominio,
  slug,
  user,
  perfil,
  encomendasPendentes,
  userId,
}: HomePageSaasContentProps) {
  const condominioName =
    informationsOfUserAndCondominio.condominio.nome_condominio;

  console.log({ user }, { perfil });

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Painel de Encomendas
          </h2>
          <p className="text-muted-foreground">
            Gerencie as entregas de {condominioName}
          </p>
        </div>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Minhas Encomendas Pendentes
          </CardTitle>
          <CardDescription>
            Lista de pacotes aguardando retirada em suas unidades.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EncomendasMoradorList
            encomendas={encomendasPendentes}
            userId={userId!}
            condominioId={slug}
          />
        </CardContent>
      </Card>
    </>
  );
}
