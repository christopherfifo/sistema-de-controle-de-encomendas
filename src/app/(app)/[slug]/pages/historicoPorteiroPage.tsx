"use client";

import { useState, useMemo } from "react";

import {
  Encomenda,
  Unidade,
  Usuario,
  Retirada,
  StatusEncomenda,
} from "@prisma/client";
import { History, Package, User } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { EncomendasHistoricoList } from "../components/encomendasHistoricoList";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Label } from "@/components/ui/label";

type EncomendaComDetalhes = Encomenda & {
  unidade: Pick<Unidade, "bloco_torre" | "numero_unidade">;
  retirada:
    | (Retirada & {
        usuario_retirada: Pick<Usuario, "id_usuario" | "nome_completo">;
      })
    | null;
  porteiro_recebimento: Pick<Usuario, "id_usuario" | "nome_completo"> | null;
};

interface HistoricoPorteiroPageProps {
  encomendasDoHistorico: EncomendaComDetalhes[];
  condominioName: string;
  porteiroId: string;
}

type StatusFilterType = "ENTREGUE" | "CANCELADA" | "ALL";

export function HistoricoPorteiroPageContent({
  encomendasDoHistorico,
  condominioName,
  porteiroId,
}: HistoricoPorteiroPageProps) {
  const [scopeFilter, setScopeFilter] = useState<"ALL" | "MINE">("ALL");

  const [statusFilter, setStatusFilter] = useState<StatusFilterType>("ALL");

  const filteredEncomendas = useMemo(() => {
    return encomendasDoHistorico
      .filter((e) => {
        if (scopeFilter === "MINE") {
          return e.id_porteiro_recebimento === porteiroId;
        }
        return true;
      })
      .filter((e) => {
        if (statusFilter === "ALL") {
          return true;
        }

        return e.status === statusFilter;
      });
  }, [encomendasDoHistorico, scopeFilter, statusFilter, porteiroId]);

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Histórico da Portaria
          </h2>
          <p className="text-muted-foreground">
            Veja todas as encomendas finalizadas de {condominioName}
          </p>
        </div>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Opções de Filtro
          </CardTitle>
          <CardDescription>
            Filtre o histórico por porteiro e status de entrega.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 font-medium">
              <User className="h-4 w-4" />
              Responsável pelo Registro
            </Label>
            <ToggleGroup
              type="single"
              value={scopeFilter}
              onValueChange={(val: "ALL" | "MINE") => {
                if (val) setScopeFilter(val);
              }}
              className="justify-start"
            >
              <ToggleGroupItem value="ALL" aria-label="Todas as encomendas">
                Todas as Encomendas
              </ToggleGroupItem>
              <ToggleGroupItem value="MINE" aria-label="Minhas encomendas">
                Meus Registros
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 font-medium">
              <Package className="h-4 w-4" />
              Status Final da Encomenda
            </Label>
            <ToggleGroup
              type="single"
              onValueChange={(val: StatusFilterType) => {
                if (val) setStatusFilter(val);
              }}
              value={statusFilter}
              className="justify-start"
            >
              <ToggleGroupItem value="ALL" aria-label="Todos os status">
                Todos
              </ToggleGroupItem>

              <ToggleGroupItem
                value={StatusEncomenda.ENTREGUE}
                aria-label="Apenas entregues"
              >
                Entregues
              </ToggleGroupItem>
              <ToggleGroupItem
                value={StatusEncomenda.CANCELADA}
                aria-label="Apenas canceladas"
              >
                Canceladas
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Resultados ({filteredEncomendas.length})
          </CardTitle>
          <CardDescription>
            Resultados filtrados do histórico de encomendas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EncomendasHistoricoList encomendas={filteredEncomendas} />
        </CardContent>
      </Card>
    </>
  );
}
