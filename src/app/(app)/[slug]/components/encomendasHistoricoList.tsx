"use client";

import { useState } from "react";
import { Encomenda, Unidade, Usuario, Retirada } from "@prisma/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Search } from "lucide-react";

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
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEncomendas = encomendas.filter((enc) => {
    const searchLower = searchTerm.toLowerCase();
    const unidadeString = `${enc.unidade.bloco_torre} ${enc.unidade.numero_unidade}`.toLowerCase();
    const porteiroNome = enc.porteiro_recebimento?.nome_completo.toLowerCase() || "";
    const moradorNome = enc.retirada?.usuario_retirada.nome_completo.toLowerCase() || "";
    const tipo = enc.tipo_encomenda.toLowerCase();

    return (
      unidadeString.includes(searchLower) ||
      porteiroNome.includes(searchLower) ||
      moradorNome.includes(searchLower) ||
      tipo.includes(searchLower)
    );
  });

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Filtrar por unidade, porteiro, morador ou tipo..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredEncomendas.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          Nenhuma encomenda encontrada com os filtros aplicados.
        </p>
      ) : (
        <Accordion type="multiple" className="w-full">
          {filteredEncomendas.map((encomenda) => {
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
      )}
    </div>
  );
}