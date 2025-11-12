"use client";

import { Encomenda, Unidade, Usuario, Retirada } from "@prisma/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

type EncomendaComDetalhes = Encomenda & {
  unidade: Pick<Unidade, "bloco_torre" | "numero_unidade">;
  retirada:
    | (Retirada & {
        usuario_retirada: Pick<Usuario, "id_usuario" | "nome_completo">;
      })
    | null;
  porteiro_recebimento: Pick<Usuario, "id_usuario" | "nome_completo"> | null;
};

interface EncomendasHistoricoListProps {
  encomendas: EncomendaComDetalhes[];
}

function formatarData(data: Date | string | null | undefined) {
  if (!data) return "N/A";
  return format(new Date(data), "dd/MM/yyyy 'às' HH:mm");
}

export function EncomendasHistoricoList({
  encomendas,
}: EncomendasHistoricoListProps) {
  if (encomendas.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        Nenhuma encomenda encontrada no histórico.
      </p>
    );
  }

  return (
    <Accordion type="multiple" className="w-full">
      {encomendas.map((encomenda) => {
        return (
          <AccordionItem
            key={encomenda.id_encomenda}
            value={encomenda.id_encomenda}
          >
            <AccordionTrigger className="hover:no-underline">
              <div className="flex justify-between items-center w-full pr-4">
                <div className="flex flex-col text-left">
                  <span className="font-semibold">
                    {encomenda.tipo_encomenda}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Unidade: {encomenda.unidade.bloco_torre} -{" "}
                    {encomenda.unidade.numero_unidade}
                  </span>
                </div>
                <Badge
                  variant={
                    encomenda.status === "CANCELADA" ? "destructive" : "default"
                  }
                >
                  {encomenda.status === "CANCELADA" ? "Cancelada" : "Entregue"}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-4 bg-muted/30 rounded-b-md">
              <div className="space-y-4">
                <ul className="space-y-2 text-sm divide-y divide-gray-200/50">
                  <li className="pt-2">
                    <span className="font-medium">Cód. Rastreio:</span>{" "}
                    {encomenda.codigo_rastreio || "Não informado"}
                  </li>
                  <li>
                    <span className="font-medium">Tamanho:</span>{" "}
                    {encomenda.tamanho}
                  </li>
                  <li>
                    <span className="font-medium">Observação (Portaria):</span>{" "}
                    {encomenda.condicao || "Nenhuma"}
                  </li>

                  <li className="pt-2">
                    <span className="font-medium">Pré-cadastro:</span>{" "}
                    {encomenda.id_usuario_cadastro
                      ? "Sim (Feito pelo morador)"
                      : "Não (Cadastro na portaria)"}
                  </li>
                  <li>
                    <span className="font-medium">
                      Recebido por (Portaria):
                    </span>{" "}
                    {encomenda.porteiro_recebimento
                      ? encomenda.porteiro_recebimento.nome_completo
                      : "Não identificado"}
                  </li>
                  {encomenda.porteiro_recebimento && (
                    <li>
                      <span className="font-medium">ID Porteiro (Receb.):</span>{" "}
                      {encomenda.porteiro_recebimento.id_usuario}
                    </li>
                  )}
                  <li>
                    <span className="font-medium">Recebido em:</span>{" "}
                    {formatarData(encomenda.data_recebimento)}
                  </li>

                  {encomenda.status === "ENTREGUE" && encomenda.retirada ? (
                    <>
                      <li className="pt-2">
                        <span className="font-medium">Retirado por:</span>{" "}
                        {encomenda.retirada.usuario_retirada.nome_completo ||
                          "N/A"}
                      </li>
                      <li>
                        <span className="font-medium">
                          ID Morador (Retir.):
                        </span>{" "}
                        {encomenda.retirada.usuario_retirada.id_usuario ||
                          "N/A"}
                      </li>
                      <li>
                        <span className="font-medium">Data da Retirada:</span>{" "}
                        {formatarData(encomenda.retirada.data_retirada)}
                      </li>
                      <li>
                        <span className="font-medium">Forma Confirmação:</span>{" "}
                        {encomenda.retirada.forma_confirmacao}
                      </li>
                      <li>
                        <span className="font-medium">Comprovante:</span>{" "}
                        {encomenda.retirada.comprovante || "Nenhum"}
                      </li>
                    </>
                  ) : (
                    <li className="pt-2">
                      <span className="font-medium">Retirada:</span>{" "}
                      {encomenda.status === "CANCELADA"
                        ? "Não aplicável (Cancelada)"
                        : "N/A"}
                    </li>
                  )}
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
