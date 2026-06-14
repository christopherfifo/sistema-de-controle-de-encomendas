"use client";

import { Home, Maximize2 } from "lucide-react";
import { getSindicoData } from "../helpers/actionSindico";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type CondominioData = Awaited<ReturnType<typeof getSindicoData>>;

interface SindicoDashboardProps {
  condominioData: CondominioData & { id_condominio: string };
  sindicoId: string;
}

export function SindicoDashboard({
  condominioData,
  sindicoId,
}: SindicoDashboardProps) {
  const unidadesAtuais = condominioData.unidades.length;
  const limiteMaximo = condominioData.plano?.limite_unidades ?? 0;
  const unidadesRestantes = limiteMaximo - unidadesAtuais;

  const nomePlano = condominioData.plano?.nome_plano ?? "Plano não definido";

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Configuração do Condomínio
          </h2>
          <p className="text-muted-foreground">
            Acompanhe as estatísticas e limites de {condominioData.nome_condominio}. Para adicionar unidades, acesse o menu &quot;Gerenciar Unidades&quot;.
          </p>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="md:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Limite de Unidades
            </CardTitle>
            <Maximize2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {unidadesAtuais} / {limiteMaximo}
            </div>
            <p className="text-xs text-muted-foreground">
              {unidadesRestantes} unidades restantes no {nomePlano}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Unidades Cadastradas ({unidadesAtuais})
          </CardTitle>
          <CardDescription>
            Resumo das unidades registradas no condomínio.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-96 overflow-y-auto p-2">
            {condominioData.unidades.map((unidade) => (
              <div
                key={unidade.id_unidade}
                className="p-3 bg-muted/50 rounded-lg text-center shadow-sm hover:bg-muted transition-colors border"
              >
                <div className="font-semibold text-primary">
                  {unidade.bloco_torre}
                </div>
                <div className="text-lg font-bold">
                  {unidade.numero_unidade}
                </div>
              </div>
            ))}
          </div>
          {condominioData.unidades.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhuma unidade cadastrada. Vá até o menu &quot;Gerenciar Unidades&quot; para adicionar.
            </p>
          )}
        </CardContent>
      </Card>
    </>
  );
}
