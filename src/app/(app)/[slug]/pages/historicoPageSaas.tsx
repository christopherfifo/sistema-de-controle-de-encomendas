import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { History } from "lucide-react";

import { Encomenda, Unidade, Usuario, Retirada } from "@prisma/client";
import { EncomendasHistoricoList } from "../components/encomendasHistoricoList";

type EncomendaComDetalhes = Encomenda & {
  unidade: Pick<Unidade, "bloco_torre" | "numero_unidade">;
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
}

export function HistoricoPageSassContent({
  encomendasDoHistorico,
  condominioName,
}: HistoricoPageSassProps) {
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Histórico
          </CardTitle>
          <CardDescription>
            Lista de pacotes que já foram retirados ou cancelados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EncomendasHistoricoList encomendas={encomendasDoHistorico} />
        </CardContent>
      </Card>
    </>
  );
}
