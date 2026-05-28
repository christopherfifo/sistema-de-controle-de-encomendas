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
import { PackageCheck, PackageSearch, User } from "lucide-react";
import { ModalRegistrarRetirada } from "./modalRegistrarRetirada";

type EncomendaComUnidadeEMorador = Encomenda & {
  usuario_cadastro?: {
    nome_completo: string;
  } | null;
  unidade: Pick<Unidade, "bloco_torre" | "numero_unidade"> & {
    moradores: {
      usuario: {
        id_usuario: string; 
        nome_completo: string;
      };
    }[];
  };
};

interface ListaEncomendasPorteiroProps {
  encomendasIniciais: EncomendaComUnidadeEMorador[];
  porteiroId: string;
  condominioId: string;
}

export function ListaEncomendasPorteiro({
  encomendasIniciais,
  porteiroId,
  condominioId,
}: ListaEncomendasPorteiroProps) {
  const [encomendasVisiveis, setEncomendasVisiveis] =
    useState<EncomendaComUnidadeEMorador[]>(encomendasIniciais);

  const [encomendaSelecionada, setEncomendaSelecionada] =
    useState<EncomendaComUnidadeEMorador | null>(null);

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
        {encomendasVisiveis.map((encomenda) => {
          const nomeMorador = encomenda.usuario_cadastro?.nome_completo 
            || encomenda.unidade.moradores.map(m => m.usuario.nome_completo).join(", ") 
            || "Morador não encontrado";

          const dataRecebimentoTexto = encomenda.data_recebimento 
            ? new Date(encomenda.data_recebimento).toLocaleString("pt-BR", { 
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "N/A";

          return (
            <AccordionItem
              key={encomenda.id_encomenda}
              value={encomenda.id_encomenda}
            >
              <AccordionTrigger className="hover:no-underline">
                <div className="flex justify-between items-center w-full pr-4">
                  <div className="flex flex-col text-left space-y-1">
                    <span className="font-semibold text-base">
                      {encomenda.tipo_encomenda} — {encomenda.forma_entrega}
                    </span>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground font-medium">
                      <User className="h-3.5 w-3.5 text-primary" />
                      <span>{nomeMorador}</span>
                    </div>
                    <span className="text-xs bg-muted px-2 py-0.5 rounded-sm w-fit font-mono">
                      Bloco {encomenda.unidade.bloco_torre} - Apt {encomenda.unidade.numero_unidade}
                    </span>
                  </div>
                  <Badge variant="outline" className="border-amber-500 text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20">Aguardando Retirada</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-muted/30 rounded-b-md">
                <div className="space-y-4">
                  <ul className="space-y-2 text-sm">
                    <li>
                      <span className="font-medium text-muted-foreground">Destinatário:</span>{" "}
                      <span className="font-semibold">{nomeMorador}</span>
                    </li>
                    <li>
                      <span className="font-medium text-muted-foreground">Recebido em:</span>{" "}
                      {dataRecebimentoTexto}
                    </li>
                    <li>
                      <span className="font-medium text-muted-foreground">Cód. Rastreio:</span>{" "}
                      <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">{encomenda.codigo_rastreio || "Não informado"}</code>
                    </li>
                    <li>
                      <span className="font-medium text-muted-foreground">Tamanho do Volume:</span>{" "}
                      {encomenda.tamanho}
                    </li>
                    <li>
                      <span className="font-medium text-muted-foreground">Observação da Portaria:</span>{" "}
                      <span className="text-destructive font-medium">{encomenda.condicao || "Nenhuma"}</span>
                    </li>
                  </ul>

                  <Button
                    className="w-full sm:w-auto bg-primary hover:bg-primary/95"
                    onClick={() => setEncomendaSelecionada(encomenda)}
                  >
                    <PackageCheck className="h-4 w-4 mr-2" />
                    Registrar Retirada
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
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