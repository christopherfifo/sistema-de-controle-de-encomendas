"use client";

import { useState } from "react";
import { Encomenda, Unidade } from "@prisma/client";
import { ClipboardCheck, User } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ItemAvisoForm } from "./itemAvisoForm";

type EncomendaComUnidadeEMorador = Encomenda & {
  usuario_cadastro?: {
    nome_completo: string;
  } | null;
  unidade: Pick<Unidade, "bloco_torre" | "numero_unidade"> & {
    moradores: {
      usuario: {
        nome_completo: string;
      };
    }[];
  };
};

interface ListaAvisosMoradoresProps {
  avisosIniciais: EncomendaComUnidadeEMorador[];
  porteiroId: string;
}

export function ListaAvisosMoradores({ avisosIniciais, porteiroId }: ListaAvisosMoradoresProps) {
  const [avisos, setAvisos] = useState<EncomendaComUnidadeEMorador[]>(avisosIniciais);

  const handleSuccess = (encomendaId: string) => {
    setAvisos((prev) => prev.filter((item) => item.id_encomenda !== encomendaId));
  };

  if (avisos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg">
        <ClipboardCheck className="h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">Nenhum aviso pendente</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Nenhum morador registrou entregas futuras no momento.
        </p>
      </div>
    );
  }

  return (
    <Accordion type="multiple" className="w-full">
      {avisos.map((encomenda) => {
        const nomeMorador = encomenda.usuario_cadastro?.nome_completo 
          || encomenda.unidade.moradores.map(m => m.usuario.nome_completo).join(", ") 
          || "Morador não encontrado";

        return (
          <AccordionItem key={encomenda.id_encomenda} value={encomenda.id_encomenda}>
            <AccordionTrigger className="hover:no-underline">
              <div className="flex justify-between items-center w-full pr-4">
                <div className="flex flex-col text-left space-y-1">
                  <span className="font-semibold text-amber-600 dark:text-amber-400">
                    ⚠️ {encomenda.tipo_encomenda} — {encomenda.forma_entrega}
                  </span>
                  <div className="flex flex-col text-xs text-muted-foreground">
                    <span>Unidade: Bloco {encomenda.unidade.bloco_torre} - {encomenda.unidade.numero_unidade}</span>
                    <div className="flex items-center gap-1 mt-0.5 font-medium text-foreground/80">
                      <User className="h-3 w-3 text-amber-500" />
                      <span>{nomeMorador}</span>
                    </div>
                  </div>
                </div>
                <Badge variant="secondary">Esperando Chegar</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-4 bg-amber-50/20 dark:bg-amber-950/10 border border-amber-200/40 rounded-b-md space-y-4">
              <div className="text-sm space-y-1.5">
                <p><strong>Morador Responsável:</strong> {nomeMorador}</p>
                <p><strong>Cód. Rastreio:</strong> <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">{encomenda.codigo_rastreio || "Não informado"}</code></p>
                <p><strong>Obs. Morador:</strong> <span className="italic text-muted-foreground">&quot;{encomenda.condicao || "Nenhuma"}&quot;</span></p>
              </div>

              <hr className="border-muted" />

              <ItemAvisoForm 
                encomendaId={encomenda.id_encomenda} 
                porteiroId={porteiroId} 
                onSuccess={handleSuccess} 
              />
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}