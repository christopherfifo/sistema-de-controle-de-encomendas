"use client";

import { useState } from "react";
import { Encomenda, Unidade } from "@prisma/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PackageCheck, PackageSearch } from "lucide-react";
import { ModalRegistrarRetirada } from "./modalRegistrarRetirada";

type EncomendaComUnidade = Encomenda & {
  unidade: Pick<Unidade, "bloco_torre" | "numero_unidade">;
};

interface ListaEncomendasPorteiroProps {
  encomendasIniciais: EncomendaComUnidade[];
  porteiroId: string;
  condominioId: string;
}

export function ListaEncomendasPorteiro({
  encomendasIniciais,
  porteiroId,
  condominioId,
}: ListaEncomendasPorteiroProps) {
  const [encomendasVisiveis, setEncomendasVisiveis] =
    useState<EncomendaComUnidade[]>(encomendasIniciais);

  const [encomendaSelecionada, setEncomendaSelecionada] =
    useState<EncomendaComUnidade | null>(null);

  const handleRetiradaSuccess = () => {
    if (encomendaSelecionada) {
      setEncomendasVisiveis((prev) =>
        prev.filter(
          (enc) => enc.id_encomenda !== encomendaSelecionada.id_encomenda,
        ),
      );
    }
    setEncomendaSelecionada(null);
  };

  if (encomendasVisiveis.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg">
        <PackageSearch className="h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">
          Nenhuma encomenda pendente
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Tudo em ordem! Não há pacotes aguardando retirada.
        </p>
      </div>
    );
  }

  return (
    <>
      <Accordion type="multiple" className="w-full">
        {encomendasVisiveis.map((encomenda) => (
          <AccordionItem
            key={encomenda.id_encomenda}
            value={encomenda.id_encomenda}
          >
            <AccordionTrigger className="hover:no-underline">
              <div className="flex justify-between items-center w-full pr-4">
                <div className="flex flex-col text-left">
                  <span className="font-semibold">
                    {encomenda.tipo_encomenda} {encomenda.forma_entrega}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Unidade: {encomenda.unidade.bloco_torre} -{" "}
                    {encomenda.unidade.numero_unidade}
                  </span>
                </div>
                <Badge variant="outline">Pendente</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-4 bg-muted/30 rounded-b-md">
              <div className="space-y-4">
                <ul className="space-y-2 text-sm">
                  <li>
                    <span className="font-medium">Recebido em:</span>{" "}
                    {encomenda.data_recebimento
                      ? new Date(
                          encomenda.data_recebimento,
                        ).toLocaleString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "N/A"}
                  </li>
                  <li>
                    <span className="font-medium">Transportadora:</span>{" "}
                    {encomenda.forma_entrega}
                  </li>
                  <li>
                    <span className="font-medium">Cód. Rastreio:</span>{" "}
                    {encomenda.codigo_rastreio || "Não informado"}
                  </li>
                  <li>
                    <span className="font-medium">Tamanho:</span>{" "}
                    {encomenda.tamanho}
                  </li>
                  <li>
                    <span className="font-medium">Observação:</span>{" "}
                    {encomenda.condicao || "Nenhuma"}
                  </li>
                </ul>

                <Button
                  className="w-full sm:w-auto"
                  onClick={() => setEncomendaSelecionada(encomenda)}
                >
                  <PackageCheck className="h-4 w-4 mr-2" />
                  Registrar Retirada
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <ModalRegistrarRetirada
        encomenda={encomendaSelecionada}
        porteiroId={porteiroId}
        condominioId={condominioId}
        onOpenChange={(open) => {
          if (!open) {
            setEncomendaSelecionada(null);
          }
        }}
        onRetiradaSuccess={handleRetiradaSuccess}
      />
    </>
  );
}