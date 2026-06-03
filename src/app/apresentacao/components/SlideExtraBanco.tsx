"use client";

import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { Database, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

mermaid.initialize({
  startOnLoad: true,
  theme: 'dark',
  securityLevel: 'loose',
  themeVariables: {
    primaryColor: '#10b981',
    primaryTextColor: '#fff',
    primaryBorderColor: '#10b981',
    lineColor: '#52525b',
    secondaryColor: '#18181b',
    tertiaryColor: '#09090b'
  }
});

const chart = `
erDiagram
    Condominio ||--o{ Usuario : "possui"
    Condominio ||--o{ Unidade : "possui"
    Condominio ||--o{ Fatura : "gera"
    Condominio ||--o{ Recado : "recebe"
    Plano ||--o{ Condominio : "assinado por"
    Plano ||--o{ Fatura : "base de"
    Usuario ||--o{ MoradoresUnidades : "pertence"
    Unidade ||--o{ MoradoresUnidades : "contem"
    Unidade ||--o{ Encomenda : "recebe"
    Usuario ||--o{ Encomenda : "registra"
    Encomenda ||--o| Retirada : "finalizada por"
    Usuario ||--o{ Retirada : "realiza"
    Recado ||--o{ RespostaRecado : "contem"
    Usuario ||--o{ Recado : "envia"
    Usuario ||--o{ RespostaRecado : "responde"
    Encomenda ||--o{ Notificacao : "gera"
    Usuario ||--o{ Notificacao : "recebe"
`;

export default function SlideExtraBanco({ onBack }: { onBack: () => void }) {
  const mermaidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.contentLoaded();
  }, []);

  return (
    <div className="flex flex-col items-center justify-start h-full w-full p-8 pt-20 overflow-y-auto custom-scrollbar">
      <div className="max-w-6xl w-full">
        <div className="flex items-center justify-between mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/50 rounded-xl flex items-center justify-center">
              <Database className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">Modelagem de Dados</h2>
              <p className="text-zinc-500">Diagrama Entidade-Relacionamento do CondoDrop</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onBack} className="rounded-full border-zinc-700 hover:bg-zinc-800 text-zinc-300 hover:text-white bg-zinc-900/50">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl animate-in fade-in zoom-in-95 duration-700 delay-200">
          <div className="mermaid flex justify-center" ref={mermaidRef}>
            {chart}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
          <div className="bg-zinc-950/50 border border-zinc-800 p-6 rounded-2xl">
            <h4 className="text-emerald-400 font-bold mb-2">Multi-Tenant</h4>
            <p className="text-sm text-zinc-500">Toda tabela possui relação direta ou indireta com o <strong>Condominio</strong>, garantindo isolamento total entre clientes.</p>
          </div>
          <div className="bg-zinc-950/50 border border-zinc-800 p-6 rounded-2xl">
            <h4 className="text-emerald-400 font-bold mb-2">Rastreabilidade</h4>
            <p className="text-sm text-zinc-500">A tabela <strong>Encomenda</strong> centraliza o fluxo, conectando Unidade, Porteiro (recebimento), Morador e Retirada.</p>
          </div>
          <div className="bg-zinc-950/50 border border-zinc-800 p-6 rounded-2xl">
            <h4 className="text-emerald-400 font-bold mb-2">Comunicação</h4>
            <p className="text-sm text-zinc-500">Histórico de <strong>Notificacoes</strong> e <strong>Recados</strong> auditáveis, mantendo o registro de cada interação.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
