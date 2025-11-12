"use client";

import { useState, useTransition } from "react";
import { Encomenda, Unidade } from "@prisma/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Loader2, XCircle } from "lucide-react";
import { cancelarEncomendaMorador } from "../helpers/encomendas";

type EncomendaComUnidade = Encomenda & {
  unidade: Pick<Unidade, "bloco_torre" | "numero_unidade">;
};

interface EncomendasMoradorListProps {
  encomendas: EncomendaComUnidade[];
  userId: string;
  condominioId: string;
}

export function EncomendasMoradorList({
  encomendas,
  userId,
  condominioId,
}: EncomendasMoradorListProps) {
  const [isPending, startTransition] = useTransition();
  const [encomendasVisiveis, setEncomendasVisiveis] =
    useState<EncomendaComUnidade[]>(encomendas);

  const handleCancel = (encomendaId: string) => {
    startTransition(async () => {
      try {
        await cancelarEncomendaMorador(encomendaId, userId, condominioId);
        setEncomendasVisiveis((prev) =>
          prev.filter((enc) => enc.id_encomenda !== encomendaId),
        );
        alert("Encomenda cancelada com sucesso!");
      } catch (error) {
        if (error instanceof Error) {
          alert(`Erro: ${error.message}`);
        } else {
          alert("Ocorreu um erro desconhecido.");
        }
      }
    });
  };

  if (encomendasVisiveis.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        Nenhuma encomenda pendente encontrada para suas unidades.
      </p>
    );
  }

  return (
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
                  {encomenda.tipo_encomenda}
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
                  <span className="font-medium">Cód. Rastreio:</span>{" "}
                  {encomenda.codigo_rastreio || "Não informado"}
                </li>
                <li>
                  <span className="font-medium">Tamanho:</span>{" "}
                  {encomenda.tamanho}
                </li>
                <li>
                  <span className="font-medium">Forma de Entrega:</span>{" "}
                  {encomenda.forma_entrega}
                </li>
                <li>
                  <span className="font-medium">Observação:</span>{" "}
                  {encomenda.condicao || "Nenhuma"}
                </li>
              </ul>

              {/* Botão de Cancelar: 
                  Só aparece se foi o usuário que pré-cadastrou */}
              {encomenda.id_usuario_cadastro === userId && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleCancel(encomenda.id_encomenda)}
                  disabled={isPending}
                  className="w-full sm:w-auto"
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <XCircle className="h-4 w-4 mr-2" />
                  )}
                  Cancelar Pré-Cadastro
                </Button>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
