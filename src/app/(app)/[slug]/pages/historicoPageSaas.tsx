"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { History, LayoutList, Layers } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Label } from "@/components/ui/label";

import { Encomenda, Unidade, Usuario, Retirada, PerfilUsuario } from "@prisma/client";
import { EncomendasHistoricoList } from "../components/encomendasHistoricoList";

type EncomendaComDetalhes = Encomenda & {
  unidade: Pick<Unidade, "id_unidade" | "bloco_torre" | "numero_unidade"> & {
    moradores: { usuario: Pick<Usuario, "nome_completo"> }[];
  };
  usuario_cadastro: Pick<Usuario, "id_usuario" | "nome_completo" | "telefone"> | null;
  retirada:
    | (Retirada & {
        usuario_retirada: Pick<Usuario, "id_usuario" | "nome_completo">;
      })
    | null;
  porteiro_recebimento: Pick<Usuario, "id_usuario" | "nome_completo"> | null;
};

interface HistoricoPageSassProps {
  encomendasDoHistorico: EncomendaComDetalhes[];
  condominioName: string;
  perfil?: PerfilUsuario;
}

export function HistoricoPageSassContent({
  encomendasDoHistorico,
  condominioName,
  perfil,
}: HistoricoPageSassProps) {
  const [viewMode, setViewMode] = useState<"list" | "grouped">("list");

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Histórico de Encomendas
          </h2>
          <p className="text-muted-foreground">
            Veja as encomendas entregues e canceladas de {condominioName}
          </p>
        </div>
      </div>

      <Separator />

      {perfil !== PerfilUsuario.MORADOR && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Opções de Visualização
            </CardTitle>
            <CardDescription>
              Alterne entre a visão geral ou agrupe as encomendas por bloco/unidade familiar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label className="flex items-center gap-2 font-medium">
                Modo de Exibição
              </Label>
              <ToggleGroup
                type="single"
                value={viewMode}
                onValueChange={(val: "list" | "grouped") => {
                  if (val) setViewMode(val);
                }}
                className="justify-start flex-wrap"
              >
                <ToggleGroupItem value="list" aria-label="Lista Cronológica">
                  <LayoutList className="h-4 w-4 mr-2" />
                  Lista Cronológica
                </ToggleGroupItem>
                <ToggleGroupItem value="grouped" aria-label="Agrupado por Unidade">
                  <Layers className="h-4 w-4 mr-2" />
                  Por Bloco Familiar
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Resultados
          </CardTitle>
          <CardDescription>
            Lista de pacotes que já foram retirados ou cancelados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EncomendasHistoricoList encomendas={encomendasDoHistorico} viewMode={viewMode} />
        </CardContent>
      </Card>
    </>
  );
}
