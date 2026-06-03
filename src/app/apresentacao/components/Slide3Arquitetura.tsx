import React from 'react';
import { Building, ShieldCheck, Package, Users } from 'lucide-react';

export default function Slide3Arquitetura() {
  return (
    <div className="flex flex-col justify-center h-full px-12 md:px-32">
      <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-white mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150 fill-mode-both">
        Arquitetura Multi-Tenant
      </h2>
      <p className="text-2xl text-zinc-400 font-light mb-16 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300 fill-mode-both">
        Sistema projetado para atender múltiplos condomínios em uma única instância, garantindo isolamento lógico de dados, escalabilidade e segurança.
      </p>
      
      {/* Visual Flowchart */}
      <div className="relative max-w-5xl mx-auto w-full mt-8">
        {/* Linhas de conexão (SVG) */}
        <svg className="absolute inset-0 w-full h-full -z-10 hidden md:block animate-in fade-in duration-700 delay-700 fill-mode-both" style={{ pointerEvents: 'none' }}>
           <path d="M 50% 15% L 50% 50% L 20% 50% L 20% 80%" stroke="rgba(255,255,255,0.1)" strokeWidth="3" fill="none" strokeDasharray="8,8" className="animate-[dash_20s_linear_infinite]" />
           <path d="M 50% 15% L 50% 50% L 50% 80%" stroke="rgba(16,185,129,0.3)" strokeWidth="3" fill="none" />
           <path d="M 50% 15% L 50% 50% L 80% 50% L 80% 80%" stroke="rgba(255,255,255,0.1)" strokeWidth="3" fill="none" strokeDasharray="8,8" />
        </svg>

        <div className="flex flex-col items-center gap-16">
          {/* Top Node */}
          <div className="bg-zinc-900 border-2 border-emerald-500/30 p-8 rounded-3xl w-80 text-center shadow-[0_0_40px_-10px_rgb(16,185,129)] z-10 animate-in fade-in zoom-in-95 duration-500 delay-500 fill-mode-both hover:scale-105 transition-transform cursor-default">
             <Building className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
             <h3 className="font-bold text-white text-xl">Tenant ID</h3>
             <p className="text-sm text-zinc-400 mt-2">Identificador central que separa e protege as informações de cada condomínio no banco de dados.</p>
          </div>

          {/* Bottom Nodes */}
          <div className="flex flex-col md:flex-row justify-between w-full gap-8">
            <div className="bg-zinc-950 border-2 border-white/10 p-8 rounded-3xl flex-1 text-center z-10 hover:border-white/30 transition-colors animate-in fade-in slide-in-from-bottom-4 duration-500 delay-700 fill-mode-both">
               <ShieldCheck className="w-10 h-10 text-zinc-400 mx-auto mb-4" />
               <h4 className="font-bold text-white text-lg">Painel Administrativo</h4>
               <p className="text-sm text-zinc-500 mt-3">Visão gerencial (Síndico), configuração da entidade e auditoria do histórico de encomendas.</p>
            </div>
            
            <div className="bg-zinc-900 border-2 border-emerald-500/20 p-8 rounded-3xl flex-1 text-center z-10 relative shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500 delay-1000 fill-mode-both">
               <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-black text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider">Operação</div>
               <Package className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
               <h4 className="font-bold text-white text-lg">Painel Operacional</h4>
               <p className="text-sm text-zinc-400 mt-3">Interface otimizada para a Portaria, focada no fluxo rápido de entrada e saída de pacotes.</p>
            </div>

            <div className="bg-zinc-950 border-2 border-white/10 p-8 rounded-3xl flex-1 text-center z-10 hover:border-white/30 transition-colors animate-in fade-in slide-in-from-bottom-4 duration-500 delay-700 fill-mode-both">
               <Users className="w-10 h-10 text-zinc-400 mx-auto mb-4" />
               <h4 className="font-bold text-white text-lg">Área do Morador</h4>
               <p className="text-sm text-zinc-500 mt-3">Acesso restrito ao histórico individual e controle de autorização de retirada.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
