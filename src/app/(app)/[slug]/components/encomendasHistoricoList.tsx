"use client";

import { useState, useMemo } from "react";
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
import { Search, Package, User, CheckCircle, XCircle, Home, UserPlus, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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

interface EncomendasHistoricoListProps {
  encomendas: EncomendaComDetalhes[];
  viewMode?: "list" | "grouped";
}

function formatarData(data: Date | string | null | undefined) {
  if (!data) return "N/A";
  return format(new Date(data), "dd/MM/yyyy 'às' HH:mm");
}

export function EncomendasHistoricoList({
  encomendas,
  viewMode = "list",
}: EncomendasHistoricoListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEncomendas = useMemo(() => {
    return encomendas.filter((enc) => {
      const searchLower = searchTerm.toLowerCase();
      const unidadeString = `${enc.unidade.bloco_torre} ${enc.unidade.numero_unidade}`.toLowerCase();
      const porteiroNome = enc.porteiro_recebimento?.nome_completo.toLowerCase() || "";
      const moradorRetirada = enc.retirada?.usuario_retirada.nome_completo.toLowerCase() || "";
      const moradorCadastro = enc.usuario_cadastro?.nome_completo.toLowerCase() || "";
      const tipo = enc.tipo_encomenda.toLowerCase();
      const rastreio = (enc.codigo_rastreio || "").toLowerCase();

      return (
        unidadeString.includes(searchLower) ||
        porteiroNome.includes(searchLower) ||
        moradorRetirada.includes(searchLower) ||
        moradorCadastro.includes(searchLower) ||
        tipo.includes(searchLower) ||
        rastreio.includes(searchLower)
      );
    });
  }, [encomendas, searchTerm]);

  const groupedEncomendas = useMemo(() => {
    if (viewMode !== "grouped") return null;

    const map = new Map<string, { unidade: EncomendaComDetalhes["unidade"]; items: EncomendaComDetalhes[] }>();
    filteredEncomendas.forEach(enc => {
      const key = enc.unidade.id_unidade;
      if (!map.has(key)) {
        map.set(key, { unidade: enc.unidade, items: [] });
      }
      map.get(key)!.items.push(enc);
    });

    return Array.from(map.values()).sort((a, b) => {
      const strA = `${a.unidade.bloco_torre} ${a.unidade.numero_unidade}`;
      const strB = `${b.unidade.bloco_torre} ${b.unidade.numero_unidade}`;
      return strA.localeCompare(strB);
    });
  }, [filteredEncomendas, viewMode]);

  const EncomendaCard = ({ encomenda }: { encomenda: EncomendaComDetalhes }) => (
    <Card className="mb-4 overflow-hidden border border-muted-foreground/20 hover:border-primary/50 transition-colors shadow-sm">
      <div className="bg-muted/30 p-3 sm:px-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full flex shrink-0 ${encomenda.status === 'ENTREGUE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {encomenda.status === 'ENTREGUE' ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
          </div>
          <div>
            <div className="font-bold text-base flex items-center gap-2">
              <span className="uppercase">{encomenda.tipo_encomenda}</span>
              <Badge variant="outline" className="text-xs font-normal shadow-none bg-background">{encomenda.tamanho}</Badge>
            </div>
            <div className="text-xs text-muted-foreground font-mono mt-0.5" title="ID do Pacote">
              #{encomenda.id_encomenda.split('-')[0]}
            </div>
          </div>
        </div>
        
        {viewMode === "list" && (
          <div className="flex items-center gap-2 text-sm font-semibold bg-background px-3 py-1.5 rounded-full border shadow-sm self-start sm:self-auto">
            <Home className="h-4 w-4 text-primary" />
            {encomenda.unidade.bloco_torre} - Apt {encomenda.unidade.numero_unidade}
          </div>
        )}
      </div>
      
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/50">
          
          <div className="p-4 space-y-3">
            <div className="font-semibold text-sm flex items-center gap-1.5 text-foreground/80 mb-2">
              <Package className="h-4 w-4" /> Detalhes do Pacote
            </div>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rastreio:</span>
                <span className="font-medium text-right">{encomenda.codigo_rastreio || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Entrega Via:</span>
                <span className="font-medium text-right">{encomenda.forma_entrega}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Condição:</span>
                <span className="font-medium text-right">{encomenda.condicao || "N/A"}</span>
              </div>
              <div className="flex justify-between mt-2 pt-2 border-t border-border/50">
                <span className="text-muted-foreground">Recepção:</span>
                <span className="font-medium text-right">{formatarData(encomenda.data_recebimento)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Por (Portaria):</span>
                <span className="font-medium text-right">{encomenda.porteiro_recebimento?.nome_completo || "Desconhecido"}</span>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-3">
            <div className="font-semibold text-sm flex items-center gap-1.5 text-foreground/80 mb-2">
              <UserPlus className="h-4 w-4" /> Origem / Cadastro
            </div>
            <div className="space-y-1.5 text-sm">
              {encomenda.usuario_cadastro ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cadastrado por:</span>
                    <span className="font-medium text-right">{encomenda.usuario_cadastro.nome_completo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Telefone:</span>
                    <span className="font-medium text-right">{encomenda.usuario_cadastro.telefone}</span>
                  </div>
                  <div className="mt-2 text-xs text-blue-600 bg-blue-500/10 px-2 py-1 rounded w-fit">Pré-cadastro via App</div>
                </>
              ) : (
                <div className="text-muted-foreground italic flex flex-col items-start gap-1">
                  <span>Não houve pré-cadastro.</span>
                  <span className="text-xs bg-muted px-2 py-1 rounded text-foreground/70 not-italic">Registrado direto na portaria.</span>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 space-y-3 bg-muted/10">
            <div className="font-semibold text-sm flex items-center gap-1.5 text-foreground/80 mb-2">
              <Info className="h-4 w-4" /> Resolução
            </div>
            <div className="space-y-1.5 text-sm">
              {encomenda.status === "ENTREGUE" && encomenda.retirada ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Retirado por:</span>
                    <span className="font-medium text-right">{encomenda.retirada.usuario_retirada.nome_completo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Em:</span>
                    <span className="font-medium text-right">{formatarData(encomenda.retirada.data_retirada)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Validação:</span>
                    <span className="font-medium text-right">{encomenda.retirada.forma_confirmacao}</span>
                  </div>
                </>
              ) : encomenda.status === "CANCELADA" ? (
                <div className="text-destructive font-medium">
                  Encomenda Cancelada / Estornada
                </div>
              ) : (
                <div className="text-muted-foreground italic">
                  Aguardando retirada...
                </div>
              )}
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      <div className="relative mb-6">
        <Search className="absolute left-2.5 top-2.5 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Busque por bloco, apartamento, porteiro, morador, tipo ou rastreio..."
          className="pl-10 py-5 text-base rounded-full bg-muted/50 border-muted-foreground/30 focus-visible:ring-primary/30"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredEncomendas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground border rounded-xl border-dashed">
          <Search className="h-10 w-10 mb-4 opacity-20" />
          <p className="text-lg font-medium">Nenhum registro encontrado</p>
          <p className="text-sm opacity-70">Tente ajustar os termos da sua busca ou alterar os filtros acima.</p>
        </div>
      ) : viewMode === "list" ? (
        <div className="space-y-1">
          {filteredEncomendas.map((encomenda) => (
            <EncomendaCard key={encomenda.id_encomenda} encomenda={encomenda} />
          ))}
        </div>
      ) : (
        <Accordion type="multiple" className="w-full space-y-3">
          {groupedEncomendas!.map((group) => (
            <AccordionItem
              key={group.unidade.id_unidade}
              value={group.unidade.id_unidade}
              className="border rounded-xl bg-card overflow-hidden shadow-sm"
            >
              <AccordionTrigger className="hover:no-underline hover:bg-muted/30 px-5 py-4">
                <div className="flex items-center gap-3 text-left">
                  <div className="bg-primary/10 p-2.5 rounded-lg text-primary">
                    <Home className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold">
                      {group.unidade.bloco_torre} <span className="opacity-50 mx-1">•</span> Apt {group.unidade.numero_unidade}
                    </h4>
                    <p className="text-sm text-muted-foreground font-normal">
                      {group.items.length} registro(s) no histórico
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 pt-1 bg-muted/10 border-t">
                <div className="mt-4 space-y-1">
                  {group.items.map((enc) => (
                    <EncomendaCard key={enc.id_encomenda} encomenda={enc} />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
