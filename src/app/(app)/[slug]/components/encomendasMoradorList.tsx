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

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

type EncomendaComUnidade = Encomenda & {
  unidade: Pick<Unidade, "bloco_torre" | "numero_unidade">;
  porteiro_recebimento?: { nome_completo: string } | null;
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

  const preCadastradas = encomendasVisiveis.filter((enc) => !enc.id_porteiro_recebimento);
  const naPortaria = encomendasVisiveis.filter((enc) => enc.id_porteiro_recebimento);

  const renderLista = (lista: EncomendaComUnidade[], emptyMessage: string, badgeText: string, badgeVariant: "outline" | "default" | "secondary" | "destructive") => {
    return (
      <div className="space-y-4 mt-4">
        {lista.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            {emptyMessage}
          </p>
        ) : (
          <Accordion type="multiple" className="w-full">
            {lista.map((encomenda) => (
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
                      {encomenda.porteiro_recebimento && (
                        <span className="text-xs text-muted-foreground mt-1">
                          Entregue a: {encomenda.porteiro_recebimento.nome_completo} ({new Date(encomenda.data_recebimento!).toLocaleDateString("pt-BR")})
                        </span>
                      )}
                    </div>
                    <Badge variant={badgeVariant}>{badgeText}</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 bg-muted/30 rounded-b-md">
                  <div className="space-y-4">
                    <ul className="space-y-2 text-sm">
                      {encomenda.porteiro_recebimento && (
                        <li>
                          <span className="font-medium">Recebido por:</span>{" "}
                          {encomenda.porteiro_recebimento.nome_completo}
                        </li>
                      )}
                      {encomenda.data_recebimento && (
                        <li>
                          <span className="font-medium">Recebido em:</span>{" "}
                          {new Date(encomenda.data_recebimento).toLocaleString("pt-BR")}
                        </li>
                      )}
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
                        Só aparece se foi o usuário que pré-cadastrou E ainda não foi recebida na portaria */}
                    {encomenda.id_usuario_cadastro === userId && !encomenda.id_porteiro_recebimento && (
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
        )}
      </div>
    );
  };

  if (encomendasVisiveis.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        Nenhuma encomenda pendente encontrada para suas unidades.
      </p>
    );
  }

  return (
    <Tabs defaultValue="portaria" className="w-full mt-2">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="portaria">Na Portaria ({naPortaria.length})</TabsTrigger>
        <TabsTrigger value="precadastradas">Pré-cadastradas ({preCadastradas.length})</TabsTrigger>
      </TabsList>
      
      <TabsContent value="portaria">
        {renderLista(
          naPortaria,
          "Nenhuma encomenda aguardando na portaria.",
          "Na Portaria",
          "default"
        )}
      </TabsContent>
      
      <TabsContent value="precadastradas">
        {renderLista(
          preCadastradas,
          "Nenhuma encomenda pré-cadastrada no momento.",
          "Pendente",
          "outline"
        )}
      </TabsContent>
    </Tabs>
  );
}
