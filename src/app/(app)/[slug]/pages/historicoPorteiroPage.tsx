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
  unidade: Pick<Unidade, "id_unidade" | "bloco_torre" | "numero_unidade">;
  usuario_cadastro: Pick<Usuario, "id_usuario" | "nome_completo" | "telefone"> | null;
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
  isAdmin?: boolean;
  porteiros?: Pick<Usuario, "id_usuario" | "nome_completo">[];
}

type StatusFilterType = "ENTREGUE" | "CANCELADA" | "ALL";

export function HistoricoPorteiroPageContent({
  encomendasDoHistorico,
  condominioName,
  porteiroId,
  isAdmin = false,
  porteiros = [],
}: HistoricoPorteiroPageProps) {
  const [scopeFilter, setScopeFilter] = useState<"ALL" | "MINE" | "SPECIFIC">("ALL");
  const [specificPorteiroId, setSpecificPorteiroId] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>("ALL");

  const filteredEncomendas = useMemo(() => {
    return encomendasDoHistorico
      .filter((e) => {
        if (scopeFilter === "MINE") {
          return e.id_porteiro_recebimento === porteiroId;
        }
        if (scopeFilter === "SPECIFIC" && specificPorteiroId) {
          return e.id_porteiro_recebimento === specificPorteiroId;
        }
        return true;
      })
      .filter((e) => {
        if (statusFilter === "ALL") {
          return true;
        }

        return e.status === statusFilter;
      });
  }, [encomendasDoHistorico, scopeFilter, statusFilter, porteiroId, specificPorteiroId]);

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
              onValueChange={(val: "ALL" | "MINE" | "SPECIFIC") => {
                if (val) {
                  setScopeFilter(val);
                  if (val !== "SPECIFIC") setSpecificPorteiroId("");
                }
              }}
              className="justify-start flex-wrap"
            >
              <ToggleGroupItem value="ALL" aria-label="Todas as encomendas">
                Todas as Encomendas
              </ToggleGroupItem>
              {!isAdmin && (
                <ToggleGroupItem value="MINE" aria-label="Minhas encomendas">
                  Meus Registros
                </ToggleGroupItem>
              )}
              {isAdmin && (
                <ToggleGroupItem value="SPECIFIC" aria-label="Porteiro específico">
                  Por Porteiro Específico
                </ToggleGroupItem>
              )}
            </ToggleGroup>
            
            {isAdmin && scopeFilter === "SPECIFIC" && (
              <div className="mt-3 max-w-sm">
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={specificPorteiroId}
                  onChange={(e) => setSpecificPorteiroId(e.target.value)}
                >
                  <option value="">Selecione um porteiro...</option>
                  {porteiros.map((p) => (
                    <option key={p.id_usuario} value={p.id_usuario}>
                      {p.nome_completo}
                    </option>
                  ))}
                </select>
              </div>
            )}
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
